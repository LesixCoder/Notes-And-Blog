## vue 源码分析系列 1

我们要分析 vue 的源码，首先从全局看下 vue 的运行机制是怎样的，然后逐步分析。

### Vue.js 运行机制全局概览

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

### 响应式系统的基本原理

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

#### 实现 observer（可观察的）

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
