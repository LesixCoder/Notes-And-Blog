## this

前面我们已经知道了，当函数被调用执行时，变量对象会生成，这个时候，this 的指向会确定。 因此首先要牢记一个非常重要的结论，**当前函数的 this 是在函数被调用执行的时候才确定的。** 如果当前的执行上下文处于函数调用栈的栈顶，那么这个时候变量对象会变成活动对象，同时 this 的指向确认。

### 全局对象中的 this

在全局对象中，this 指向它本身，因此相对简单，没有那么多复杂的情况需要考虑。

```js
// 通过this绑定到全局对象
this.a2 = 20;
// 通过声明绑定到交量对象，但在全局环境中，变量对象就是它本身
var a1 = 10;
// 仅仅只有赋值操作，标识符会隐式绑定到全局对象
a3 = 30;
// 输出结采全部符合预期
console.log(a1); // 10
console.log(a2); // 20
console.log(a3); // 30
```

### 函数中的 this

> 在一个函数的执行上下文中， this 由该函数的调用者提供，由调用函数的方式来决定其指向。

如果调用者被某一个对象所拥有，那么在调用该函数时，内部的 this 指向该对象。 如果调用者函数独立调用，那么该函数内部的 this 则指向 undefined。

> 在非严格模式中，当 this 指向 undefined 时，它会自动指向全局对象。

```js
// 为了能够准确判断，我们在函数内部使用严格模式
// 因为非严格模式会自动指向全局
function fn() {
  'use strict';
  console.log(this);
}

fn(); // fn是调用者，独立调用，this 为 undefined
window.fn(); // fn是调用者，被window所拥有，this 为 window 对象
```

```js
var a = 20;
var obj = {
  a: 40
};
function fn() {
  console.log('fn this: ', this);
  function foo() {
    console.log(this.a);
  }
  foo();
}
fn.call(obj);
fn();
```

这个例子中旬最终的调用方式不同，因此在 fn 的环境中 this 会有所变化。但是无论 fn 如何调用，在 fn 执行时，foo 始终都是独立调用。因此 foo 内部的 this 都是指向 undefined 的，在非严格模式下自动转向 window，所以输出结果：

```js
fn this:  {a: 40}
20
fn this:  Window
20
```

```js
'use strict';
var a = 20;
function foo() {
  var a = 1;
  var obj = {
    a: 10,
    c: this.a + 20
  };
  return obj.c;
}
console.log(window.foo()); // 20
console.log(foo()); // 报错 TypeError
```

对象字面量的写法并不会产生自己的作用域，因此 `obj.c` 上的 this 属性并不会指向 obj，而是与 foo 函数内部的 this 一样。

当使用 `window.foo()` 调用时，foo 内部的 this 指向 window 对象，这个时候 `this.a` 能访问到全局的 a 变量。 但是当 `foo()` 独立调用时，foo 内部的 this 指向 undefined，由于是在严格模式中，因此并不会转向 window 对象， 此时执行会报错。

### call/apply/bind 显式指定 this

当函数调用 `call/apply` 时，则表示会执行该函数，并且函数内部的 this 指向 `call/apply` 的第一个参数。

而 `call/apply` 的不同之处在于参数的传递形式。

```js
function fn(num1, num2) {
  return this.a + num1 + num2;
}
var a = 20;
var object = { a: 40 };

// 正常执行
fn(10, 10); // 40

// 通过 call 改变 this 指向
fn.call(object, 10, 10); // 60

// 通过 apply 改变 this 指向
fn.apply(object, [10, 10]); // 60
```

`bind` 方法也能指定函数内部的 this 指向，但是它与 `call/apply` 有所不同。

当函数调用 `call/appy` 时，函数的内部 this 被显式指定，并且函数会**立即执行**。而当函数调用 `bind` 时，函数并**不会立即执行**，而是返回一个新的函数，这个新的函数与原函数有共同的函数体，但它并非原函数，并且新函数的参数与 this 指向都已经被绑定，参数为 `bind` 的后续参数。

```js
function fn(num1, num2) {
  return this.a + num1 + num2;
}
var a = 20;
var object = { a: 40 };

var _fn = fn.bind(object, 1, 2);

console.log(_fn === fn); // false
_fn(); // 43
_fn(1, 4); // 43 (因为参数被绑定，因此重新传入参数是无效的)
```