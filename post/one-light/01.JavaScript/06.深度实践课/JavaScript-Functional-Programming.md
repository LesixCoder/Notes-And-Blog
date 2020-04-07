# JavaScript-Functional-Programming

- 函数式编程思维
- 函数式编程常用核心概念
- 当下函数式编程最热的库
- 函数式编程的实际应用场景

## 1. 函数式编程思维

**范畴论(Category Theory)**

1. 函数式编程是范畴论的数学分支是一门很复杂的数学，认为世界上所有概念体系都可以抽象出一个个范畴
2. 彼此之间存在某种关系概念、事物、对象等等，都构成范畴。任何事物只要找出他们之间的关系，就能定义
3. 箭头表示范畴成员之间的关系，正式的名称叫做 **"态射" (morphism)**。范畴论认为，同一个范畴的所有成员， 就是不同状态的 **"变形"(transformation)**。通过"态射"， 一个成员可以变形成另一个成员。

![](http://cdn-blog.liusixin.cn/FivF0PPO6JNXmaGVxU4A9WgzuWEl)

- 所有成员是一个集合
- 变形关系是函数

###  1.1 函数式编程基础理论

1. 函数是”第一等公民”
2. 只用”表达式"，不用"语句"
3. 没有”副作用"
4. 不修改状态
5. 引用透明(函数运行只靠参数)

函数是一等公民。所谓”第一等公民”(first class)，指的是函数与其他数据类型一样，处于平等地位，可以赋值给其他变量，也可以作为参数，传入另一个函数，或者作为别的函数的返回值。

不可改变量。在函数式编程中，我们通常理解的变量在函数式编程中也被函数代替了:在函数式编程中变量仅仅代表某个表达式。这里所说的’变量’是不能被修改的。所有的变量只能被赋一次初值

**map & reduce他们是最常用的函数式编程的方法。**

##  2. 函数式编程常用核心概念

- 纯函数
- 偏应用函数、函数的柯里化
- 函数组合
- Point Free
- 声明式与命令式代码
- 惰性求值

###  2.1 纯函数

对于相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用，也不依赖外部环境的状态。

```js
let arr = [1,2,3,4,5];
// Array.slice是纯函数，因为它没有副作用，对于固定的输入，输出总是固定的
arr.slice(0,3);
arr.slice(0,3);

// splice不纯，因为每次调用都会修改数组，返回不一样的值
arr.splice(0,3);
arr.splice(0,3);
```

####  优缺点

```js
import _ from 'lodash';
let sin = _.memorize(x => Math.sin(x));
//第一次计算的时候会稍慢一点 var a = sin(1);
//第二次有了缓存，速度极快
let b = sin(1);
```

纯函数不仅可以有效降低系统的复杂度，还有很多很棒的特性，比如可缓存性

```js
//不纯的，因为 checkage 依赖了外部的变量min
let min = 18;
let checkage = age => age > min;
//纯的，这很函数式
let checkage = age => age > 18;
```

在不纯的版本中，`checkage` 不仅取决于 `age` 还有外部依赖的变量 `min`。纯的 `checkage` 把关键数字 `18` 硬编码在函数内部，扩展性比较差，这时可以用柯里化优雅的函数式解决。

**偏应用函数**

传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。

偏函数之所以“偏”，在就在于其只能处理那些能与至少一个case语句匹配的输入，而不能处理所有可能的输入。

```js
// 带一个函数参数和该函数的部分参数
const partial = (f, ...args) =>
(...moreArgs) => f(...args, ...moreArgs)

const add3 = (a, b, c) => a + b + c
// 偏应用 `2` 和 `3` 到 `add3` 给你一个单参数的函数
const fivePlus = partial(add3, 2, 3)
fivePlus(4)

//bind实现
const add1More = add3.bind(null,2,3)
// (c) => 2 + 3 + c
```

### 2.2   函数的柯里化

柯里化(Curried) 通过偏应用函数实现。传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。

```js
// 我们一起来用柯里化来改他
var checkage = min => (age => age > min);var checkage18 = checkage(18);
checkage18(20);
```

我们再看一个例子

```js
// 柯里化之前
function add(x, y) {
  return x + y;
}
add(1, 2) // 3
// 柯里化之后
function addX(y) {
  return function (x) {
    return x + y;
  }
}
addX(2)(1) // 3
```

通过bind柯里化

```js
function foo(p1, p2) {
  this.val = p1 + p2;
}
var bar = foo.bind(null, “p1”);
var baz = new bar("p2");
console.log(baz.val); // 'p1p2'
```

#### 优缺点

```js
import { curry } from 'lodash';
var match = curry((reg, str) => str.match(reg));
var filter = curry((f, arr) => arr.filter(f));
var haveSpace = match(/\s+/g);
//haveSpace(“ffffffff”);
//haveSpace(“a b");

//filter(haveSpace, ["abcdefg", "Hello World"]);
filter(haveSpace)(["abcdefg", "Hello World"])
```

事实上柯里化是一种“预加载”函数的方法，通过传递较少的参数，得到一个已经记住了这些参数的新函数，某种意义上讲，这是一种对参数的“缓存”，是一种非常高效的编写函数的方法。

###  2.3 函数组合

纯函数以及如何把它柯里化写出的洋葱代码 `h(g(f(x)))`， 为了解决函数嵌套的问题，我们需要用到 **“函数组合”**。

我们一起来用柯里化来改他，让多个函数像拼积木一样

```js
const compose = (f, g) => (x => f(g(x)));let first = arr => arr[0];
let reverse = arr => arr.reverse();
let last = compose(first, reverse);
last([1,2,3,4,5]); // 5
```

### 2.4 Point Free

把一些对象自带的方法转化成纯函数,不要命名转瞬即逝的中间变量。

这个函数中，我们使用了 `str` 作为我们的中间变量，但这个中间变量除了让代码变得长了一点以外是毫无意义的。

```js
const f = str => str.toUpperCase().split(' ');

// 优化
let toUpperCase = word => word.toUpperCase();
let split = x => (str => str.split(x));
let f = compose(split(' '), toUpperCase);
f("abcd efgh"); // ["ABCD", "EFGH"]
```

### 2.5  声明式与命令式代码

命令式代码的意思就是，我们通过编写一条又一条指令去让计算机执行一些动作，这其中一般都会涉及到很多繁杂的细节。而声明式就要优雅很多了，我们通过写表达式的方式来声明我们想干
什么，而不是通过一步一步的指示。

```js
//命令式
let CEOs = [];
for(var i = 0; i < companies.length; i++)
  CEOs.push(companies[i].CEO)
}
//声明式
let CEOs = companies.map(c => c.CEO);
```

### 2.6 惰性求值、惰性函数、惰性链

在指令式语言中以下代码会按顺序执行，由于每个函数都有可能改动或者依赖于其外部的状态，因此必须顺序执行。

```js
function somewhatLongOperation1(){somewhatLongOperation1}
new LazyChain([2,1,3])...
```

### 函数式编程深入概念

- 高阶函数
- 尾调用优化PTC
- 闭包
- 容器、Functor
- 错误处理、Either、AP
- IO
- Monad

### 2.7  高阶函数

函数当参数，把传入的函数做一个封装，然后返回这个封装函数,达到更高程度的抽象。

```js
//命令式
let add = function(a,b){
  return a + b;
};
function math(func,array){
  return func(array[0],array[1]);
}
math(add,[1,2]); // 3
```

### 2.8 尾调用优化

指函数内部的最后一个动作是函数调用。该调用的返回值，直接返回给函数。函数调用自身，称为递归。如果尾调用自身，就称为尾递归。递归需要保存大量的调用记录，很容易发生栈溢出错误，如果使用尾递归优化，将递归变为循环，那么只需要保存一个调用记录，这样就不会发生栈溢出错误了。

```js
// 不是尾递归，无法优化斐波那契数列
function factorial(n) {
  if (n === 1) return 1;
 return n * factorial(n - 1);
}
function factorial(n, total) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
} //ES6强制使用尾递归
```
