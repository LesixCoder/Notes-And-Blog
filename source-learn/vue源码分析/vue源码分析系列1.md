# vue 源码分析系列 1

我们要分析 vue 的源码，首先从全局看下 vue 的运行机制是怎样的，然后逐步分析。

## Vue.js 运行机制全局概览

我们先看一张图：

![](http://cdn-blog.liusixin.cn/WX20180828-145159@2x.png)

这张图基本上囊括了 vue 的整个运行过程的内部机制实现，从图上我们可以总结出这个过程：

- 初始化及挂载
- 编译
- 响应式
- Virtual DOM
- 更新视图

我们一步一步来分析

**初始化及挂载**

这个过程就是上图中 `new Vue() -init-> $mount`，首先 `new Vue()` 实例化之后，会在内部调用 `_init` 来进行初始化(生命周期、事件、props、methods、data、computed、watch 等)。当中最重要的是【响应式】和【依赖收集】，就是通过 `Object.defineProperty` 设置 `setter` 和 `getter` 函数，我们后面再说。`_init` 之后会调用 `$mount` 挂载组件，如果是运行时编译，即不存在 render function 但是存在 template 的情况，需要进行【编译】步骤。

**编译**

`compile()` 编译还可以细分为 `parse`、`optimize`、`generate`，最终会编译成 render function。

- `parse` 会用正则等方式解析 template 模板中的指令、class、style 等数据，形成 AST(抽象语法树)。
- `optimize` 主要作用是标记 static 静态节点，这是 Vue 在编译过程中的一处优化，后面当 `update` 更新界面时，会有一个 `patch` 的过程，`diff` 算法会直接跳过静态节点，从而减少了比较的过程，优化了 `patch` 的性能。
- `generate` 将 AST 转化成 render function 字符串的过程，得到结果是 render 的字符串以及 staticRenderFns 字符串。

当编译阶段完成之后，组件中就会存在渲染 VNode 所需的 render function 了。

**响应式**

前面我们说了响应式主要是通过 `Object.defineProperty` 设置 `setter` 和 `getter` 函数，`Object.defineProperty` ，简单来说就是当被设置的对象被读取的时候会执行 `getter` 函数，而在当被赋值的时候会执行 `setter` 函数。当 render function 被渲染的时候，因为会读取所需对象的值，所以会触发 `getter` 函数进行【依赖收集】，【依赖收集】的目的是将观察者 Watcher 对象存放到当前闭包中的订阅者 Dep 的 subs 中。形成如下所示的这样一个关系。

![](http://cdn-blog.liusixin.cn/WX20180828-151344@2x.png)

在修改对象的值的时候，会触发对应的 `setter`， `setter` 通知之前【依赖收集】得到的 Dep 中的每一个 Watcher，告诉它们自己的值改变了，需要重新渲染视图。这时候这些 Watcher 就会开始调用 `update` 来更新视图，过程中还有一个 `patch` 的过程以及使用队列来异步更新的策略。

**Virtual DOM**

render function 会被转化成 VNode 节点，Virtual DOM 其实就是一棵以 JavaScript 对象（ VNode 节点）作为基础的树，用对象属性来描述节点，实际上它只是一层对真实 DOM 的抽象。最终可以通过一系列操作使这棵树映射到真实环境上。由于 Virtual DOM 是以 JavaScript 对象为基础而不依赖真实平台环境，所以使它具有了跨平台的能力。

**更新视图**

当修改一个值的时候，会通过 `setter -> Watcher -> update` 的流程来修改对应的视图。数据变化后，执行 render function 就可以得到一个新的 VNode 节点，如果想要得到新的视图，按往常最简单的方式就是直接解析这个 VNode 节点，然后 `innerHTML` 直接全部渲染到真实 DOM 中。但是这样做会有性能问题，因为我们只改了其中一小部分，全部更改似乎有点【浪费】。这就要说下 `patch` 了，我们会将新的 VNode 与旧的 VNode 一起传入 `patch` 进行比较，经过 diff 算法得出它们的差异。最后我们只需要将这些发生变化的的对应 DOM 进行修改即可。

## 响应式系统的基本原理

前面我们从全局角度分析了整个 vue 的运行机制，我们都知道 Vue.js 是一款 MVVM 框架，数据模型仅仅是普通的 JavaScript 对象，但是对这些对象进行操作时，却能影响对应视图，它的核心实现就是【响应式系统】。

**`Object.defineProperty`**

```js
/*
  obj: 目标对象
  prop: 需要操作的目标对象的属性名
  descriptor: 描述符
  return value 传入对象
*/
Object.defineProperty(obj, prop, descriptor);
```

`descriptor` 的一些属性，简单介绍几个属性，具体可以参考 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 文档。

- `enumerable`，属性是否可枚举，默认 false。
- `configurable`，属性是否可以被修改或者删除，默认 false。
- `get`，获取属性的方法。
- `set`，设置属性的方法。

### 实现 observer（可观察的）

知道了 `Object.defineProperty` 以后，我们来用它使对象变成可观察的。首先我们定义一个 `cb` 函数，这个函数用来模拟视图更新，调用它即代表更新视图，内部可以是一些更新视图的方法。

```js
function cb(val) {
  /* 渲染视图 */
  console.log('update view');
}
```

然后我们定义一个 `defineReactive`，这个方法通过 `Object.defineProperty` 来实现对对象的【响应式】化，入参是一个 `obj`（需要绑定的对象）、`key`（obj 的某一个属性），`val`（具体的值）。经过 `defineReactive` 处理以后，我们的 `obj` 的 `key` 属性在【读】的时候会触发 `reactiveGetter` 方法，而在该属性被【写】的时候则会触发 `reactiveSetter` 方法。

```js
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true /* 属性可枚举 */,
    configurable: true /* 属性可被修改或删除 */,
    get: function reactiveGetter() {
      return val; /* 这里会进行依赖收集 */
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return;
      cb(newVal);
    }
  });
}
```

当然这是不够的，我们需要在上面再封装一层 `observer`。这个函数传入一个 `value`（需要【响应式】化的对象），通过遍历所有属性的方式对该对象的每一个属性都通过 `defineReactive` 处理。（注：实际上 `observer` 会进行递归调用，为了便于理解去掉了递归的过程）

```js
function observer(value) {
  if (!value || typeof value !== 'object') {
    return;
  }

  Object.keys(value).forEach(key => {
    defineReactive(value, key, value[key]);
  });
}
```

最后，在 Vue 的构造函数中，对 `options` 的 `data` 进行处理，这里的 `data` 想必大家很熟悉，就是平时我们在写 Vue 项目时组件中的 `data` 属性（实际上是一个函数，这里当作一个对象来简单处理）。

```js
class Vue {
  /* Vue构造类 */
  constructor(options) {
    this._data = options.data;
    observer(this._data);
  }
}
```

这样我们只要 new 一个 Vue 对象，就会将 `data` 中的数据进行【响应式】化。如果我们对 `data` 的属性进行下面的操作，就会触发 `cb` 方法更新视图。

```js
let o = new Vue({
  data: {
    test: 'I am test.'
  }
});
/* 视图更新啦～ */
```

然后我们再说说【依赖收集】

### 依赖收集追踪原理

先举个 vue 的例子：

```js
new Vue({
  template: `<div>
            <span>{{text1}}</span>
            <span>{{text2}}</span>
        <div>`,
  data: {
    text1: 'text1',
    text2: 'text2',
    text3: 'text3'
  }
});
```

然后我们操作如下：

```js
this.text3 = 'modify text3';
```

我们修改了 `data` 中 `text3` 的数据，但是因为视图中并不需要用到 `text3` ，所以我们并不需要触发 `cb` 函数来更新视图，调用 `cb` 显然是不正确的。

还有如果现在有一个全局的对象，我们可能会在多个 Vue 对象中用到它。

```js
let globalObj = {
  text1: 'text1'
};

let o1 = new Vue({
  template: `<div>
            <span>{{text1}}</span>
        <div>`,
  data: globalObj
});

let o2 = new Vue({
  template: `<div>
            <span>{{text1}}</span>
        <div>`,
  data: globalObj
});
```

这个时候，我们执行了如下操作。

```js
globalObj.text1 = 'hello,text1';
```

我们应该需要通知 `o1` 以及 `o2` 两个 vm 实例进行视图的更新，【依赖收集】会让 `text1` 这个数据知道“哦～有两个地方依赖我的数据，我变化的时候需要通知它们～”。

最终会形成数据与视图的一种对应关系，如下图。

![](http://cdn-blog.liusixin.cn/WX20180829-132539@2x.png)

下面我们来说说【依赖收集】是如何实现的。

**订阅者 Dep**

它的主要作用是用来存放 `Watcher` 观察者对象。

```js
class Dep {
  constructor() {
    /* 用来存放Watcher对象的数组 */
    this.subs = [];
  }

  /* 在subs中添加一个Watcher对象 */
  addSub(sub) {
    this.subs.push(sub);
  }

  /* 通知所有Watcher对象更新视图 */
  notify() {
    this.subs.forEach(sub => {
      sub.update();
    });
  }
}
```

为了便于理解我们只实现了添加的部分代码，主要是两件事情：

- 用 `addSub` 方法可以在目前的 `Dep` 对象中增加一个 `Watcher` 的订阅操作；
- 用 `notify` 方法通知目前 `Dep` 对象的 `subs` 中的所有 `Watcher` 对象触发更新操作。

**观察者 Watcher**

```js
class Watcher {
  constructor() {
    /* 在new一个Watcher对象时将该对象赋值给Dep.target，在get中会用到 */
    Dep.target = this;
  }

  /* 更新视图的方法 */
  update() {
    console.log('update view~');
  }
}

Dep.target = null;
```

**依赖收集**

接下来我们修改一下 `defineReactive` 以及 Vue 的构造函数，来完成依赖收集。

我们在闭包中增加了一个 Dep 类的对象，用来收集 `Watcher` 对象。在对象被【读】的时候，会触发 `reactiveGetter` 函数把当前的 `Watcher` 对象（存放在 `Dep.target` 中）收集到 `Dep` 类中去。之后如果当该对象被【写】的时候，则会触发 `reactiveSetter` 方法，通知 `Dep` 类调用 `notify` 来触发所有 `Watcher` 对象的 `update` 方法更新对应视图。

```js
function defineReactive(obj, key, val) {
  /* 一个Dep类对象 */
  const dep = new Dep();

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      /* 将Dep.target（即当前的Watcher对象存入dep的subs中） */
      dep.addSub(Dep.target);
      return val;
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return;
      /* 在set的时候触发dep的notify来通知所有的Watcher对象更新视图 */
      dep.notify();
    }
  });
}

class Vue {
  constructor(options) {
    this._data = options.data;
    observer(this._data);
    /* 新建一个Watcher观察者对象，这时候Dep.target会指向这个Watcher对象 */
    new Watcher();
    /* 在这里模拟render的过程，为了触发test属性的get函数 */
    console.log('render~', this._data.test);
  }
}
```

### 小结

首先在 `observer` 的过程中会注册 `get` 方法，该方法用来进行【依赖收集】。在它的闭包中会有一个 `Dep` 对象，这个对象用来存放 `Watcher` 对象的实例。其实【依赖收集】的过程就是把 `Watcher` 实例存放到对应的 `Dep` 对象中去。`get` 方法可以让当前的 `Watcher` 对象（`Dep.target`）存放到它的 `subs` 中（`addSub`）方法，在数据变化时，`set` 会调用 `Dep` 对象的 `notify` 方法通知它内部所有的 `Watcher` 对象进行视图更新。

这是 `Object.defineProperty` 的 `set/get` 方法处理的事情，那么【依赖收集】的前提条件还有两个：

1. 触发 `get` 方法；
2. 新建一个 Watcher 对象。

这个我们在 Vue 的构造类中处理。新建一个 `Watcher` 对象只需要 new 出来，这时候 `Dep.target` 已经指向了这个 new 出来的 `Watcher` 对象来。而触发 `get` 方法也很简单，实际上只要把 render function 进行渲染，那么其中的依赖的对象都会被【读取】，这里我们通过打印来模拟这个过程，读取 `test` 来触发 `get` 进行【依赖收集】。

本章我们介绍了【依赖收集】的过程，配合之前的响应式原理，已经把整个【响应式系统】介绍完毕了。其主要就是 get 进行【依赖收集】。set 通过观察者来更新视图。

## 实现 Virtual DOM

我们全面介绍过，render function 最终会转化为 VNode 节点，VNode 归根结底就是一个 JavaScript 对象，只要这个类的一些属性可以正确直观地描述清楚当前节点的信息即可。我们来实现一个简单的 VNode 类，加入一些基本属性，为了便于理解，我们先不考虑复杂的情况。

```js
class VNode {
  constructor(tag, data, children, text, elm) {
    /*当前节点的标签名*/
    this.tag = tag;
    /*当前节点的一些数据信息，比如props、attrs等数据*/
    this.data = data;
    /*当前节点的子节点，是一个数组*/
    this.children = children;
    /*当前节点的文本*/
    this.text = text;
    /*当前虚拟节点对应的真实dom节点*/
    this.elm = elm;
  }
}
```

vue 组件：

```html
<template>
  <span class="demo" v-show="isShow">
    This is a span.
  </span>
</template>
```

用 js 表示是这样的：

```js
function render() {
  return new VNode(
    'span',
    {
      /* 指令集合数组 */
      directives: [
        {
          /* v-show指令 */
          rawName: 'v-show',
          expression: 'isShow',
          name: 'show',
          value: true
        }
      ],
      /* 静态class */
      staticClass: 'demo'
    },
    [new VNode(undefined, undefined, undefined, 'This is a span.')]
  );
}
```

转换成 VNode 以后的情况:

```js
{
  tag: 'span',
  data: {
    /* 指令集合数组 */
    directives: [
        {
          /* v-show指令 */
          rawName: 'v-show',
          expression: 'isShow',
          name: 'show',
          value: true
        }
    ],
    /* 静态class */
    staticClass: 'demo'
  },
  text: undefined,
  children: [
    /* 子节点是一个文本VNode节点 */
    {
      tag: undefined,
      data: undefined,
      text: 'This is a span.',
      children: undefined
    }
  ]
}
```

然后我们可以将 VNode 进一步封装一下，可以实现一些产生常用 VNode 的方法。

- 创建一个空节点

```js
function createEmptyVNode() {
  const node = new VNode();
  node.text = '';
  return node;
}
```

创建一个文本节点

```js
function createTextVNode(val) {
  return new VNode(undefined, undefined, undefined, String(val));
}
```

克隆一个 VNode 节点

```js
function cloneVNode(node) {
  const cloneVnode = new VNode(
    node.tag,
    node.data,
    node.children,
    node.text,
    node.elm
  );
  return cloneVnode;
}
```

总的来说，VNode 就是一个 JavaScript 对象，用 JavaScript 对象的属性来描述当前节点的一些状态，用 VNode 节点的形式来模拟一棵 Virtual DOM 树。

下一篇我们会介绍 template 模板的编译。