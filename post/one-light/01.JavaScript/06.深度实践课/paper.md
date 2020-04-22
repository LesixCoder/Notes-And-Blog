# 难点题目

## 1.写出如下代码输出值，并解释为什么

```js
console.log(a);
console.log(typeof test(a));
var flag = true;
if (!flag) {
  var a = 1;
}
if (flag) {
  function test (a) {
    test = a;
    console.log("test1");
  }
} else {
  function test (a) {
    test = a;
    console.log("test2");
  }
}
// undefined
// Uncaught TypeError: test is not a function
```

先看一个例子

```js
function test () {
  console.log("output");
}
function init () {
  var flag = false;
  if (flag) {
    function test (a) {
      test = a;
      console.log("test1");
    }
  }
  test()
}
init()
// Uncaught TypeError: test is not a function
```

这是因为函数作用域，init 内 test 函数被提升到函数顶端，相当于如下写法

```js
function test () {
  console.log("output");
}
function init () {
  var test = undefined
  var flag = false;
  if (flag) {
    test = function test (a) {
      test = a;
      console.log("test1");
    }
  }
  test()
}
init()
```

还有一个知识点需要注意，请看下面输出值

```js
function test () {
  test = undefined
  console.log("output", test);
}
test() // undefined
test() // Uncaught TypeError: test is not a function

var fn = function test () {
  test = undefined
  console.log("output", test);
}
fn() // output ƒ test () {}
fn() // output ƒ test () {}
```

> 函数声明内部是可以改写当前函数变量的，表达式内部只读，不可修改

## 2.写出如下输出值，并完成附加题的作答

```js
function fn () {
  console.log(this.length);
}
var test = {
  length: 5,
  method: function () {
    "use strict";
    fn();
    arguments[0]()
  }
}
const result = test.method.bind(null);
result(fn, 1);
// 0 2
```

我们先看下面这段代码：

```js
function fn () {
  console.log(this.length);
}
fn() // 0
// 这里的this.length 指页面iframe的数量，并且this指window

function fn () {
  'use strict';
  console.log(this.length);
}
fn() // Cannot read property 'length' of undefined
// 严格模式下this指undefined
```

接着看

```js
function fn () {
  console.log(this.length);
}
const result = fn.bind(null);
result() // 0
// 这里按理说this应该指null，其实是被忽略了。许多库都会这么做，也叫软绑
```

我们再回到这道题

```js
function fn () {
  console.log(this.length);
}
var test = {
  length: 5,
  method: function () {
    "use strict";
    fn();
    arguments[0]()
  }
}
const result = test.method.bind(null);
result(fn, 1);

// 这里严格模式只针对`method`这个函数生效，所以`fn`该指谁还指谁，这里依旧指`window`
// arguments[0]() 相当于是arguments调用了fn，所以this指arguments，长度为2
```

我们再扩展一道题

```js
// 实参5个，形参3个
function test (a, b, c) {
  console.log(this.length);
  console.log(this.callee.length);
}
function fn (a) {
  // test -> this -> arguments
  // arguments -> fn，指实参
  // this.callee -> fn
  arguments[0](10, 20, 30, 40, 50)
}
// 实参4个，形参1个
fn(test, 10, 20, 30)
// 4 1
```

根据上面结论，我们做下转换

```js
function test (a, b, c) {
  ...
}
function fn (a) {
  arguments.test(10, 20, 30, 40, 50) {
    console.log(this.length);
    console.log(this.callee.length);
  }
}
fn(test, 10, 20, 30)
// 这样就很明显看出来，this.length指arguments长度，arguments为实参，所以是4
// this.callee 指向调用函数为fn，fn.length指形参，所以为1
```

## 3.请问变量a会被GC回收么，为什么呢？

```js
function test () {
  var a = "fn";
  return function () {
    eval("");
  }
}
test()();
// eval不对词法环境任何的变量进行解除绑定，保留所有，所以不会被回收。
// 解决：window.eval调用，用window调用会认为当前环境不受变量影响，可以回收
```

同样的还有 with

```js
var obj = {}
with(obj){
  a = 1
}
console.log(obj.a) // undefined
console.log(window.a) // 1 这里a被挂到了全局
// with会欺骗词法作用域，浏览器一旦遇到with，会放弃对所有变量的回收
```

new 函数

```js
var a = 20
function init () {
  var a = 30
  var s = new Function('console.log(a)') // 全局创建
  s() // 20
   s = new Function(console.log(a))
  s() // 30
}
init()
```

同样 `try...catch` 也会欺骗词法作用域，因为 `catch(e)` 中的e是自创建的，会延长作用域链
