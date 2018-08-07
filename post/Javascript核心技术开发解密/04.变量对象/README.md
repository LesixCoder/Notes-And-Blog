## 变量对象

前面我们曾提到过变量对象，我们在 JavaScript 代码中声明的所有变量都保存在变量对象中，除此之外，变量对象中还可能包含以下内容。

- 函数的所有参数
- 当前上下文中的所有函数声明。
- 当前上下文中的所有变量声明。

### 创建过程

1. 在 Chrome 浏览器中，变量对象会首先获得函数的参数变量及其值; 在 Firefox 浏览器中，是直接将参数对象 arguments 保存在变量对象中。
2. 依次获取当前上下文中所有的函数声明，也就是使用 `function` 关键宇声明的函数。在变量对象中会以函数名建立一个属性，属性值为指向该函数所在的内存地址引用。如果函数名的属性已经存在，那么该属性的值会被新的引用覆盖。
3. 依次获取当前上下文中的变量声明，也就是使用 `var` 关键字声明的变量。每找到一个变量声明，就在变量对象中就以变量名建立一个属性，属性值为 `undefined`。 如果该变量名的属性已经存在，为了防止同名的函数被修改为 `undefined`，则会直接跳过，原属性值不会被修改。

> ES6 支持新的变量声明方式 `let/const`，规则与 `var` 完全不同，它们是在上下文的执行阶段开始执行的，避免了变量提升带来的一系列问题。

我们以一个例子讲解：

```js
var a = 30;
```

- 第一步：首先上下文的创建阶段会先确认变量对象，而变量对象的创建过程则是先获取变量名井赋值为 `undefined`。这种现象我们称之为变量提升(Hoisting)。
  - `var a = undefined;`
- 第二步：上下文的创建阶段完毕后，开始进入执行阶段，在执行阶段需要完成变量赋值的工作
  - `a = 30;`

> 在变量对象的创建过程中，函数声明的执行优先级会比变量声明的优先级更高一点，而且同名的函数会覆盖函数与变量，但是同名的变量并不会覆盖函数。

但是在上下文的执行阶段，同名的函数会被变量重新赋值。

```js
var a = 20;
function fn() {
  console.log('fn');
};
function fn() {
  console.log('cover fn.');
};
function a() {
  console.log('cover a.');
};

console.log(a);
fn();
var fn = 'I want cover function named fn.'; console.log(fn);
// 20
// cover fn.
// I want cover function named fn.
```

上面例子的执行顺序其实为:

```js
// 创建阶段
function fn() {
  console.log('fn');
};
function fn() {
  console.log('cover fn.');
};
function a() {
  console.log('cover a.');
};
var a = undefined;
var fn = undefined;

// 执行阶段
a = 20;
console.log(a);
fn();
fn = 'I want cover function named fn.';
console.log(fn);
```
根据输出结果可以证明，在创建阶段，后创建的函数 fn 覆盖了前面创建的函数 fn，但是变量也并没有覆盖函数 fn。 而在执行阶段，a 与 fn 的重新赋值导致它们发生了变化。

### 实例分析

```js
function test() {
  console.log(foo);
  console.log(bar);

  var foo = 'Hello';
  console.log(foo);
  var bar = function() {
    return 'world';
  }

  function foo() {
    return 'hello';
  }
}

test();
```

我们拆解执行顺序

```js
// 创建阶段
function test() {
  function foo() {
    return 'hello';
  }
  var foo = undefined;
  var bar = undefined;

  // 执行阶段
  console.log(foo);
  console.log(bar);

  foo = 'Hello';
  console.log(foo);
  bar = function() {
    return 'world';
  }
}

test();
```

> 创建阶段，var声明的变量在遇到同名的属性时会跳过而不是覆盖

> 执行阶段，声明的变量覆盖同名函数

### 全局上下文的变量对象
以浏览器为例，全局对象为 window 对象。

全局上下文的变量对象有一个特殊的地方，即它的变量对象就是 window 对象，而且全局上下文的变量对象不能变成活动对象。