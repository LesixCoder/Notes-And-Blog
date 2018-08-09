## ES6 与模块化

> babel 在线编译工具 - [http://babeljs.io/repl/](http://babeljs.io/repl/)

### 1. 常用语法知识

#### 1.1 新的变量声明方式 `let/const`

```js
console.log(a); // ReferenceError: a is not defined
let a = 20;
```

由于不会默认赋值为 `undefined`，加上 `let/const` 存在自己的作用域，因此会出现一个叫作**暂时性死区**的现象。

```js
var a = 20;
if (true) {
  console.log(a); // ReferenceError: a is not defined
  let a = 30;
}
```

虽然 a 已经声明过了，但是由于存在暂时性死区，因此仍然无法正常访问。我们在自己的代码中，要注意这些异常，尽量将声明主动放置在代码的前面。

**一般来说，声明一个引用可以被改变的变量时用 `let`，声明一个引用不能被改变的变量时用 `const`。**

当声明一个引用类型的数据时，也会使用 `const`。尽管可能会改变该数据的值，但是必须保持它的引用不变。

const arr = [1, 2, 3, 4];
arr.forEach(function(item) {
const temp = item + 1;
console.log(temp);
})

#### 1.2 箭头函数(arrowfunction)

需要注意的是，箭头函数只能替换函数表达式，即使用 `var/let/const` 声明的函数。而直接使用 `function` 声明的函数是不能使用箭头函数替换的。

我们知道，函数内部的 this 指向，与它的调用者有关，或者使用 `call/apply/bind` 也可以修改内部的 this 指向。

```js
var name = 'TOM';

// 更改为箭头函数的写法
var getName = () => {
  console.log(this.name);
};

var person = {
  name: 'Alex',
  getName: getName
};

var other = {
  name: 'Jone'
};

getName(); // TOM
person.getName(); // TOM
getName.call(other); // TOM
```

三次调用都输出了 TOM, **箭头函数中的 this，就是声明函数时所处上下文中的 this，它不会被其他方式所改变。** `getName` 是在全局上下文中声明的，因此 this 指向的是 `window` 对象，所以输出的结果全是 TOM。

在实践中，常常会遇到 this 在传递过程中发生改变，因此带来许多困扰，例如:

```js
var Mot = function(name) {
  this.name = name;
};
Mot.prototype = {
  constructor: Mot,
  do: function() {
    console.log(this.name);
    document.onclick = function() {
      console.log(this.name);
    };
  }
};

new Mot('Alex').do();
```

当调用 `do` 方法时，我们期望单击 `document` 时仍然输出 ‘Alex’。 但是很遗憾，在 `onclick` 的回调函数中，this 的指向已经发生了变化，它指向了 `document`。解决方案是使用箭头函数。

```js
document.onclick = () => {
  console.log(this.name);
};
```

> 注意：`arguments`还有一个需要大家注意的地方，即在箭头函数中，没有`arguments`对象。

### 2. 模板字符串

```js
// 变量
const hello = 'hello';
let message = `${hello}, world !`;

// 表达式
const a = 40;
const b = 50;
let result = `the result is: ${a + b}`;

// 函数
let fn = () => {
  const result = 'you are the best.';
  return result;
};
let str = `he said: ${fn()}`;
```

### 3. 解析结构

```js
var tom = {
  name: 'TOM',
  age: 20,
  genober: 1,
  job: 'student'
};

// 传统方式取值
var name = tom.name;
var age = tom.age;
var gender = tom.gender;
var job = tom.job;

// 解构赋值
const { name, age, gender, job } = tom;
// 上面实际上是下面这种方式的简写，但在实践中我们并不会这么使用
const { name: name, age: age, gender: gender, job: job } = tom;

// 给变量指定默认值
// 如果数据中能找到 name，则变量的值与数据中相等;若找不到，则使用默认值
const { name = 'Jake', stature = '170' } = tom;

// 或者给变量重新命名:
const { gender: t, job } = tom;
// 重命名之后，gender将无法访问，而只能通过新的变量名 t 来访问对应的数据。

// 获取嵌套数据中的值
const peoples = {
  counts: 100,
  detail: {
    tom: {
      name: 'tom',
      age: 20
    }
  }
};

// 获取tom
const {
  detail: { tom }
} = peoples;
// 直接获取 tom 的 name 与 age
const {
  detail: {
    tom: { name, age }
  }
} = peoples;
```

数组也有自己的解析结构。

```js
const arr = [1, 2, 3];
const [a, b, c] = arr;

// 等价于
const a = arr[O];
const b = arr[1];
const c = arr[2];
```

> 与对象不同的是，数组中变量和值的关系与序列号是一一对应的，这是一个有序的对应关系。而对象则根据属性名一一对应，这是一个无序的对应关系。因此在实践中，对象的解析结构使用得更加频繁与便利。

**总结一个关于默认值应用场景的小知识点**

```js
// 对象解析结构中的默认值
const { name, age = 20 } = tom;

// 数组解析结构中的默认值
const [a, b = 20] = [1];

// 函数参数中的默认值
const fn = (x = 20, y = 30) => x + y;
fn(); // 50
```

### 4. 展开运算符

在 ES6 中，使用...来表示展开运算符，它可以展开数组/对象。

```js
// 首先声明一个数组
const arr1 = [1, 2, 3];

// 其次声明另一个数组，我们期望新数组中包含数组 arr1 的所有元素，
// 因此可以利用展开运算符
const arr2 = [...arr1, 4, 5, 6];
// 那么arr2就变成了 [1, 2, 3, 4, 5, 6]
```

展开对象也可以得到类似的结果。

```js
const object1 = {
  a: 1,
  b: 2,
  c: 3
};
const object2 = {
  ...object1,
  d: 4,
  e: 5,
  f: 6
};

// object2的结果等价于
object2 = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6
};
```

在解析结构中，也常常使用展开运算符。

```js
const tom = {
  name: 'TOM',
  age: 20,
  gender: 1,
  job: 'student'
};

const { name, ...others } = tom;
// others = { age: 20, gender: 1, job: "student" }
```

展开运算符还可以运用在函数参数中

```js
// 求所有参数之和
const add = (a, b, ...more) => {
  return more.reduce((m, n) => m + n) + a + b;
};
console.log(add(1, 23, 1, 2, 3, 4, 5)); // 39
```

### 5. Promise 详解

#### 5.1 异步与同步

使用 Promise 模拟一个发起请求的函数，该函数执行后，会在 1s 之后返回数值 30。

```js
function fn() {
  return new Promise(function(resolve, reject) => {
    setTimeout(function() {
      resolve(30);
    }, 1000);
  })
}
```

该函数的基础上，可以使用 `async/await` 语法来模拟同步的效果。

```js
var foo = async function() {
  var t = await fn();
  console.log(t);
  console.log('next code');
};
foo();

// 1s之后输出
// 30
// next code
```

异步效果则会有不同的输出结果:

```js
var foo = function() {
  fn().then(function(resp) {
    console.log(resp);
  });
  console.log('next code');
};
foo();

// next code
// 停顿1s后继续输出
// 30
```

下面分别学习 `Promise` 与 `async/await` 的具体作用与使用方法。

#### 5.2 Promise

**5.2.1 Ajax**

用 Ajax 向服务端请求我们需要的数据。 整个过程的简单实现如下:

```js
// 简单的 Ajax 原生实现
// 由服务端提供的接口
var url = 'https://hq.tigerbrokers.com/fundamental/finance_calendar/getType';
var result;

var XHR = new XMLHttpRequest();
XHR.open('GET', url, true);
XHR.send();

XHR.onreadystatechange = function() {
  if (XHR.readyState == 4 &&: XHR.status == 200) {
    result = XHR.response;
    console.log(result);
  }
}
```

在 Ajax 的原生实现中，利用了 `onreadystatechange` 事件，只有当该事件触发并且符合一定条件时，才能拿到我们想要的数据，之后才能开始处理数据。

如果我们有这样的需求，在这个请求成功之后，还要进行下一个 Ajax 请求，这个新的 Ajax 请求参数要从上一个请求中获取。就需要在回调成功之后再进行嵌套请求 Ajax。当如果请求变成 3 个或者更多的时候，这样的代码就变成了灾难，造成**回调地狱**。

为了使代码更具读性和可维护性，我们需要将数据请求与数据处理明确地区分开来。

当想要确保某代码在某某之后执行时，可以利用函数调用栈，将想要执行的代码放入回调函数中。

```js
//一个简单的封装
function want() {
  console.log('这是你想要执行的代码');
}

function fn(want) {
  console.log('这里表示执行了一大堆各种代码');
  //其他代码执行完毕后，最后执行回调函数
  want && want();
}

fn(want);
```

除利用函数调用栈的执行顺序外，还可以利用队列机制来确保我们想要的代码压后执行。

```js
function want() {
  console.log('这是你想要执行的代码');
}

function fn(want) {
  // 将想妥执行的代码放入队列中后，根据事件循环机制，就不用将它放到最后面了，可以自由选择
  want && setTimeout(want, 0);
  console.log('这里表示执行了一大堆各种代码');
}

fn(want);
```

与 `setTimeout` 类似，`Promise` 也可以认为是一种任务分发器，它将任务分配到 `Promise` 队列中，通常的流程是首先发起一个请求，然后等待(等待时间无法确定)并处理请求结果。

```js
var tag = true;
var p = new Promise(function(resolve, reject) {
  if (tag) {
    resolve('tag is true');
  } else {
    reject('tag is false');
  }
});

p.then(function(result) {
  console.log(result);
}).catch(function(err) {
  console.log(err);
});
```

**Promise 相关基础知识**

- `new Promise` 表示创建一个 Promise 实例对象
- `Promise` 函数中的第一个参数为一个回调函数，也可以称之为 `executor`。通常情况下，在这个函数中，会执行发起请求操作，并修改结果的状态值。
- 请求结果有三种状态，分别是 `pending`(等待中，表示还没有得到结果)、`resolved`(得到了我们想要的结果，可以继续执行)，以及 `rejected`(得到了错误的，或者不是我们期望的结果，拒绝继续执行)。请求结果的默认状态为 `pending`。在 `executor` 函数中，可以分别使用 `resolve` 与 `reject` 将状态修改为对应的 `resolved` 与 `rejected`。`resolve`、`reject` 是 `executor` 函数的两个参数，它们能够将请求结果的具体数据传递出去。
- `Promise` 实例拥有的 `then` 方法，可用来处理当请求结果的状态变成 `resolved` 时的逻辑。`then` 的第一个参数为一个回调函数，该函数的参数是 `resolve` 传递出来的数据。在上面的例子中，`result = tag is true`。
- `Promise` 实例拥有的 `catch` 方法，可用来处理当请求结果的状态变成 `rejected` 时的逻辑。`catch` 的第一个参数为一个回调函数，该函数的参数是 `reject` 传递出来的数据。在上面的例子中，`err = tag is false`。

```js
function fn(num) {
  return new Promise(function(resolve, reject) {
    // 模拟一个请求行为，2s以后得到结果
    setTimeout(function() {
      if (typeof num == 'number') {
        resolve(num);
      } else {
        var err = num + ' is not a number.';
        reject(err);
      }
    }, 2000);
  })
    .then(function(resp) {
      console.log(resp);
    })
    .catch(function(err) {
      console.log(err);
    });
}

// 修改传入的参数类型，观察结果变化
fn('abc');

// 注意观察该语句的执行顺序
console.log('next code');

// next code
// 2s后输出
// abc is not a number.
```

因为 `fn` 函数运行的结果是返回一个 `Promise` 对象，因此也可以将上面的例子修改为:

```js
function fn(num) {
  return new Promise(function(resolve, reject) {
    // 模拟一个请求行为，2s以后得到结果
    setTimeout(function() {
      if (typeof num == 'number') {
        resolve(num);
      } else {
        var err = num + ' is not a number.';
        reject(err);
      }
    }, 2000);
  });
}

fn('abc')
  .then(function(resp) {
    console.log(resp);
  })
  .catch(function(err) {
    console.log(err);
  });

// 注意观察该语句的执行顺序
console.log('next code');

// next code
// 2s后输出
// abc is not a number.
```

`catch` 方法其实与下面的写法等价:

```js
fn('abc').then(
  function(resp) {
    console.log(resp);
  },
  function(err) {
    console.log(err);
  }
);
```

了解了这些基础知识之后，再回过头来看看最开始提到过的 Ajax 的例子，我们可以进行一个简单的封装:

```js
var url = 'https://hq.tigerbrokers.com/fundamental/finance_calendar/getType';

// 封装一个get请求的方法
function getJSON(url) {
  return new Promise(function(resolve, reject) {
    // 利用Ajax发送一个请求
    var XHR = new XMLHttpRequest();
    XHR.open('GET', url, true);
    XHR.send();

    // 等待结果
    XHR.onreadystatechange = function() {
      if (XHR.readyState == 4) {
        if (XHR.status == 200) {
          try {
            var response = JSON.parse(XHR.responseText);
            // 得到正确的结果修改状态并将数据传递出去
            resolve(response);
          } catch (e) {
            reject(e);
          }
        } else {
          // 得到错误结果并抛出异常
          reject(new Error(XHR.statusText));
        }
      }
    };
  });
}

// 封装好之后，使用就很简单了
getJSON(url).then(function(resp) {
  console.log(resp);
  // 之后就是处理数据的具体逻辑
});
```

**使用 jQuery 请求**

```js
$.get(url)
  .then(function(resp) {
    // ...处理 success 的结果
  })
  .catch(function(err) {
    // ...
  });
```

**Promise.all**

接收一个 `Promise` 对象组成的数组作为参数，当这个数组中所有的 `Promise` 对象状态都变成 `resolved` 或者 `rejected` 时，它才会去调用 `then` 方法。

```js
var url1 = 'https://api.v1.movie/list1';
var url2 = 'https://api.v1.movie/list2';

function renderAll() {
  return Promise.all([getJSON(url1), getJSON(url2)]);
}

renderAll().then(function(value) {
  console.log(value);
});
```

**Promise.race**

与 `Promise.all` 相似，`Promise.race` 也以 `Promise` 对象组成的数组作为参数，只要当数组中的其中一个 `Promsie` 状态变成 `resolved` 或者 `rejected` 时，就可以调用 `.then` 方法，而传递给 `then` 方法的值也会有所不同。

```js
function renderRace() {
  return Promise.race([getJSON(url1), getJSON(url2)]);
}

renderRace().then(function(value) {
  console.log(value);
});
```

#### 5.3 async/await

```js
async function fn() {
  return 30;
}

// 或者
const fn = async () => {
  return 30;
};

console.log(fn());
```

![](http://cdn-blog.liusixin.cn/WX20180809-165659@2x.png)

可以发现 fn 函数运行后返回的是一个标准的 Promise 对象，因此可以猜想到 async 其实是 Promise 的一个语法糖。

> `await` 关键字只能在 `async` 函数中使用，并且 `await` 后面的函数运行后必须返回一个 `Promise` 对象才能实现同步的效果。

**异常处理**

在 `Promise` 中，是通过 `catch` 的方式来捕获异常的，而当使用 `async` 时，则通过 `try/catch` 捕获异常。如果有多个 `await` 函数，那么只返回第一个捕获到的异常。

```js
function fn1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('some error fn1.');
    }, 1000);
  })
}
function fn2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('some error fn2.');
    }, 1000);
  })
}

const foo = async () => {
  try {
    await fn1();
    await fn2();
  }
} catch(e) {
  console.log(e); // some error fn1.
}
```

### 6. 事件循环机制

在学习事件循环机制之前，我们需要理解以下概念

- 执行上下文(Execution context)
- 函数调用栈(call stack)
- 队列数据结构(queue)
- Promise

JavaScript 的一个特点就是单线程，但是很多时候我们仍然需要在不同的时间去执行不同的任务，例如给元素添加点击事件，设置一个定时器，或者发起 Ajax 请求。因此需要一个异步机制来达到这样的目的，事件循环机制也因此而来。

每一个 JavaScript 程序都拥有唯一的事件循环，大多数代码的执行顺序是可以根据函数调用栈的规则执行的，而 `setTimeout/setInterval` 或者不同的事件绑定(`click`、`mousedown`等)中的代码，则通过队列来执行。

`setTimeout` 为任务源，或者任务分发器，由它们将不同的任务分发到不同的任务队列中去。每一个任务源都有对应的任务队列。

任务队列又分为宏任务(macro-task)与微任务(micro-task)两种，在浏览器中，包括:

- 宏任务: `script`(整体代码)、`setTimeout/setInterval`、I/O、UI rendering 等。
- 微任务: `Promise`。

> 在 node.js 中还包括更多的任务队列。来自不同任务源的任务会进到不同的任务队列中，其中 `setTimeout` 与 `setInterval` 是同源的。

**重点**：事件循环的顺序，决定了 JavaScript 代码的执行顺序。它从 `宏任务` 中的 `script` 开始第一次循环。此时全局上下文进入函数调用栈，直到调用栈清空(只剩下全局上下文)，在这个过程中，如果遇到任务分发器就会将任务放人对应队列中去。

- 第一次循环时，`宏任务` 中其实只有 `script`，因此函数调用栈清空之后，会直接执行所有的 `微任务`。当所有可执行的 `微任务` 执行完毕之后，就表示第一次事件循环已经结束。
- 第二次循环会再次从 `宏任务` 开始执行。此时 `宏任务` 中的 `script` 队列中已经没有任务了，但是可能会有其他的队列任务，而 `微任务` 中暂时还没有任务。此时会先选择其中一个 `宏任务` 队列，例如 `setTimeout`，将该队列中的所有任务全部执行完毕，然后再执行此过程中可能产生的`微任务`。`微任务`执行完毕之后，再回过头来执行其他`宏任务`队列中的任务。依次类推，直到所有`宏任务`队列中的任务都被执行一遍，并且清空了`微任务`，第二次循环就会结束。
- 如果在第二次循环过程中，产生了新的`宏任务`队列，或者之前`宏任务`队列中的的任务暂时没有满足执行条件，例如延迟时间不够或者事件没有触发，那么将会继续以同样的顺序重复循环。

接下来就结合例子来一步步理解这个复杂的规则:

```js
setTimeout(function() {
  console.log('setTimeout');
}, 0);
console.log('global');
```

`首先，宏任务` 中 `script` 任务队列最先执行。执行过程中遇到 `setTimeout`, `setTimeout`会将它的任务分发到 `setTimeout` 任务队列中去，因此里面的代码是不执行的。代码会接着往下执行，因而这里会首先输出 `global`。由于整个过程没有产生 `微任务`，因而第一轮循环结束。第二轮循环开始，发现 `setTimeout` 任务队列中巳存在一个任务，所以执行它，这个时候会输出 `"setTimeout"`。

再看一个复杂一点的例子：

```js
setTimeout(function() {
  console.log('timeout1');
});

new Promise(function(resolve) {
  console.log('promise1');
  for (var i = 0; i < 1000; i++) {
    i == 99 && resolve();
  }
  console.log('promise2');
}).then(function() {
  console.log('then1');
});

console.log('global1');
```

- 第一步，`script` 任务开始执行，全局上下文入栈。

![](http://cdn-blog.liusixin.cn/WX20180809-183815@2x.png)

- 第二步，`script` 任务执行时首先遇到了 `setTimeout`, `setTimeout`为一个宏任务源，而它的作用就是将任务分发到它对应的队列中去

![](http://cdn-blog.liusixin.cn/WX20180809-183938@2x.png)

- 第三步，`script` 执行时遇到 `Promise` 实例。 `Promise` 构造函数中的第一个参数，是在 `new` 创建实例的时候执行，因此不会进入任何其他的队列，而是在当前任务直接执行，后续的 `then` 则会被分发到 `微任务` 的 `Promise` 队列中去。

- 因此，构造函数执行时，里面的参数进入函数调用栈执行。for 循环不会进入任何队列 ，因 此代码会依次执行，所以这里的 `promise1` 和 `promise2` 会依次输出。

- promise1 入栈执行，执行后 `promise1` 被最先输出

![](http://cdn-blog.liusixin.cn/WX20180809-232638@2x.png)

- `resolve` 在 for 循环中入栈执行

![](http://cdn-blog.liusixin.cn/WX20180809-232817@2x.png)

- 在构造函数执行过程中，`resolve` 执行完毕出栈，`promise2` 输出，`promise1` 也出栈。`then` 执行
  时，`Promise` 任务 `then1` 进入对应队列

![](http://cdn-blog.liusixin.cn/WX20180809-233039@2x.png)

- `script` 任务继续向下执行，最后输出 `global`，至此，全局任务就执行完毕了。

- 第四步，第一个宏任务 `script` 执行完毕之后，就开始执行所有可执行的微任务。这个时候，微任务中，只有 `Promise` 队列中的一个任务 `then1`。 因此直接执行就可以了，执行结果输出 `then1`, 当然，它也是进入函数调用栈中执行的。

![](http://cdn-blog.liusixin.cn/WX20180809-233039@2x.png)

- 第五步，当所有的 `微任务` 执行完毕之后，表示第一轮的循环就结束了开始第二轮的循环。第二轮循环仍然从 `宏任务` 开始。

- 这个时候，我们发现宏任务中，只有 `setTimeout` 队列中还要一个 `timeout1` 的任务等待执行，因此直接执行即可。

![](http://cdn-blog.liusixin.cn/WX20180809-234646@2x.png)

- 至此，宏任务队列与微任务队列中就都没有任务了，输出结果

```js
promise1;
promise2;
global1;
then1;
timeout1;
```

### 7. 对象与 class

**当属性与变量同名时**

```js
// ES6
const person = {
  name,
  age
}

// 等价于 ES5
var person = {
  name : name,
  age : age
}
```

这样的写法在很多地方都能见到，例如在一个模块中对外提供接口时。

```js
const getName = () => person.name;
const getAge = () => person.age;

// commonJS的方式
module.exports = { getName, getAge }

// ES6 modules的方式
export default { getName, getAge }
```

**对象中方法的简写**

```js
// ES6
const person = {
  name,
  age,
  getName() {
    // 只要不使用箭头函数，this就还是我们熟悉的this
    return this.name;
  }
}
```

**变量作为对象的属性**

```js
const name = 'Jane';
const age = 20;

const person = {
  [name]: true,
  [age]: true
}
```

#### class

```js
class Person {
  constructor(name, age) {
    // 构造函数
    this.name = name;
    this.age = age;
  }

  getName() {
    // 这种写法表示将方法添加到原型中
    return this.name;
  }

  static a = 20; // 等同于 Person.a = 20

  c = 20; // 表示在构造函数中添加属性，在构造函数中等同于 this.c = 20

  // 箭头函数的写法表示在构造函数中添加方法，在构造函数中等同于 this.
  getAge = function(){}
  getAge = () => this.age
}
```

> `constructor` 方法是一个默认方法，当通过 new 声明实例时，会调用该方法，相当于构造函数。如果没有显式定义，那么将会添加一个空的默认方法。

####  继承

```js
class Person {
  constructor(name, age) {
    // 构造函数
    this.name = name;
    this.age = age;
  }
}

// Student类继承Person类
class Student extends Person {
  constructor(name, age, gender, classes) {
    super(name, age);
    this.gender = gender;
    this.classes = classes;
  }

  getGender () {
    return this.gender;
  }
}
```

在子类的构造函数中必须调用 `super` 方法，它表示构造函数的继承，与 ES5 中利用 `call/apply` 继承构造函数的功能一样。

```js
// 构造函数中
// ES6
super(name, age);

// ES5
Person.call(this);
```

### 8. 模块化

> 在线的模块化学习环境 [codepen.io](codepen.io)

#### 8.1 基础语法

```js
// import
import App from './App';
import './test';

import { name1 } from './module.js';
import { name1, name2 } from './module.js';
// or 利用别名的方式
import * as module from './module.js';
// 那么就有
name1 = module.name1
name2 = module.name2

// export
// module.js
export const name1 = 'liusixin';
export const name2 = 'sixin';

// 还可以通过 export default 来对外提供接口，这种情况下，对外接口通常是一个对象。
export default {
  name1,
  name2
}

// 
import module from './module.js';
```

> 一个模块中只允许出现一次 `export default` 命令，不过可以同时拥有多个 `export` 与一个 `export default`。

#### 8.2 实例

现在来实现一个场景。首先有一个普通的正方形 div，并且有一堆设置按钮，现在想要通过这些按钮来控制 div 的 显示/隐藏、背景颜色、边框颜色、长宽等属性，应该怎么做呢?

在实践中类似的场景很多，例如手机的设置、控制中心，以及每个网页都有的个人中心里的设置等。

当然，如果仅仅只是通过一个按钮来控制一个 div 的单一属性，那么非常简单，但实践中的场景往往更加复杂。第一个难点是我们可能会有更多的属性需要控制，也有更多的目标元素需要控制。第二个难点则是在构建代码之初，目标元素们可能存在于不同的模块中，如何通过单一的变量来控制不同的目标元素?

当项目变得越来越复杂时，需要管理的状态值也会变得越来越多，针对准备要实现的效果，自己动手实现一个简单的状态管理模块。

**1. 准备工作**

创建项目 es6app

```shell
- src
  - state.js
- index.js
```

**2. 状态管理模块**

首先需要创建一个状态树。在整个项目中，状态树是唯一的，我们会把所有的状态名与状态值通过 `key-value` 的形式保存在状态树中。

```js
const store = {}
```

当根据需求往状态树中保存状态时，状态树大概会变成如下形式:

```js
store = {
  show: 0,
  backgroundColor: '#ccc',
  width: '200',
  height: '200'
  // ...
}
```

根据需求，可以先大概列出可能会用到的方法，如果之后需要补充则再另行添加。可能会用到的方法如下:

- `registerState`: 往状态树中放入新的状态值。
- `getStore`: 获取整个状态树。
- `getState`: 获取某一个状态值。
- `setState`: 修改状态树中某一个状态值。

```js
// 往store中添加一个状态值
export const registerState = (status, value) => {
  if(store[status]) {
    throw new Error('状态已经存在');
    return;
  }
  store[status] = value;
  return value;
}

// 获取整个状态树
export const getStore = () => store

// 获取某个状态的位
export const getState = status => store[status]

// 设置某个状态的值
export const setState = (status, value) => {
  store[status] = value;
  dispatch(status, value);
  return value;
}
```

当通过交互改变状态值时，其实期待的是界面 UI 能够发生相应的改变。UI 的变动可能会比较简单，也可能会非常复杂，因此为了能够更好地维护UI改变，我们将每个UI变化用函数封装起来，并与对应的状态值对应。这样，当状态值改变时，调用一下对应的 UI 函数就能够实现界面的实时变动了。

因此，除需要一个 store 来保存状态值外，还需要一个 events 对象来保存 UI 函数。

```js
const events = {}
```

状态值与 UI 函数的对应关系如下:

```js
store = {
  show: 0,
  backgroundColor: '#ccc',
  width: '200',
  height: '200'
  // ...
}

events = {
  show: function() {},
  backgroundColor: function() {},
  width: function() {},
  height: function() {}
  // ...
}

// 通过相同的状态命名，可以访问对应的状态值与函数
```

同样的道理，我们也需要提供几个能够操作 `events` 的方法。

```js
// UI方法可以理解为一个绑定过程，因此命名为 bind，在有的地方也称为订阅 
export const bind = (status, eventFn) => {
  events[status] = eventFn;
}

// 移除绑定
export const remove = status => {
  events[status] = null;
  return status;
}

// 需要在状态值改变时触发UI的变化，因此在setState方法中调用了该方法
export const dispatch = (status, value) => {
  if(!events[status]) {
    throw new Error('未绑定任何事件！');
  }
  events[status](value);
  return value;
}
```

至此，一个简单的状态管理模块就完成了，接下来看看应该如何运用它。

**3. 注册状态值模块**

注册状态的方式就是利用状态管理模块中定义 `registerState` 的方法来完成。

```js
// src/register.js

import { registerState } from './state';

// 控制显示隐藏
registerState('show', 0);
registerState('backgroundColor', '#FFF'); 
registerState('borderColor', '#000'); 
registerState('width', 100);
registerState('height', 100); 
// ... and more
```

**4. 功能函数模块**

每一个项目中都有这样一个功能函数模块，我们会把一些封装好的功能性的方法都放到这个模块中去。

```js
// src/utils.js

// 获取DOM元素属性值
export const getStyle = (obj, key) => {
  return obj.currentStyle ? obj.currentStyle[key] : document.defaultView.getComputedStyle(obj, false)[key];
}
```

除此之外，也可以引人 lodash.js 这样的工具库。lodash 是一个具有一致接口、模块化、高性能的工具库，它封装了许多常用的工具函数，在实践开发中非常有用。

**5. 目标元素模块**

目标元素，也就是可能会涉及 UI 改变的元素。之前在创建状态管理模块时已经提到，我们需要将 UI 改变的动作封装为函数，并保存/绑定到 events 对象中。这个操作就选择在目标元素模块中来完成。

首先在 `public/index.html` 中写入一个 div元素。

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>es6app</title>
  <style>
    .target {
      width: 100px;
      height: 100px;
      background: #ccc;
      transition: .3s;
    }
    .target.hide {
      display: none;
    }
  </style>
</head>
<body>
  <div class="target"></div>
</body>
</html>
```

此处目标元素是一个正方形的 div 元素，我们将会通过控制按钮来改变它的显示/隐藏、边框、背景、长宽等属性。因此该模块的主要功能就是根据注册的状态变量，绑定 UI 变化的函数。

```js
// src/box.js

import { bind } from './state';
import { getStyle } from './utils';
import './register'

const div = document.querySelector('.target');

// control show or hide
bind('show', value => {
  if(value === 1) {
    div.classList.add('hide');
  }
  if(value === 0) {
    div.classList.remove('hide');
  }
})

// change background color
bind('backgroundColor', value => {
  div.style.backgroundColor = value;
})

// change border color
bind('borderColor', value => {
  const width = parseInt(getStyle(div, 'borderWidth'));
  if(width === 0) {
    div.style.border = '2px solid #ccc';
  }
  div.style.borderColor = value;
})

// change width
bind('width', value => {
  div.style.width = `${value}px`;
})

bind('height', value => {
  div.style.height = `${value}px`;
})
```

**6. 控制模块**

根据需求，分别创建对应的控制模块。

```html
<div class="control_wrap">
  <div>
    <button class="show">show/hide</button>
  </div>
  <div>
    <input type="text" class="bgcolor_input" placeholder="input background color" />
    <button class="bgcolor_btn">sure</button>
  </div>
  <div>
    <input type="text" class="bdcolor_input" placeholder="input border color" />
    <button class="bdcolor_btn">sure</button>
  </div>
  <div>
    <span>width</span>
    <button class="width_reduce">-5</button>
    <button class="width_add">+5</button>
  </div>
  <div>
    <span>height</span>
    <button class="height_reduce">-</button>
    <input type="text" class="height_input" readonly />
    <button class="height_add">+</button>
  </div>
</div>
```

现在在 src 目录下创建一个 controlBtns 文件夹，该文件夹中全部用来存放控制模块，然后依次编写控制模块的代码即可。

- 控制目标元素显示/隐藏的模块

```js
// src/controlBtns/showBtn.js

import { getState, setState } from '../state';

const btn = document.querySelector('.show');

btn.addEventListener('click', () => { 
  if(getState('show') == 0) {
    setState('show', 1); 
  } else {
    setState('show', 0);
  }
}, false);
```

- 控制目标元素背景颜色变化的模块

```js
// src/controlBtns/bgColor.js

import { setState } from '../state';

const input = document.querySelector('.bgcolor_input');
const btn = document.querySelector('.bgcolor_btn');

btn.addEventListener('click', () => { 
  if(input.value) {
    setState('backgroundColor', input.value); 
  }
}, false);
```

- 控制目标元素边框颜色变化的模块

```js
// src/controlBtns/bdColor.js

import { setState } from '../state';

const input = document.querySelector('.bdcolor_input');
const btn = document.querySelector('.bdcolor_btn');

btn.addEventListener('click', () => { 
  if(input.value) {
    setState('borderColor', input.value); 
  }
}, false);
```

- 控制目标元素宽度变化的模块

```js
// src/controlBtns/width.js

import { getState, setState } from '../state';

const reduce_btn = document.querySelector('.width_reduce');
const add_btn = document.querySelector('.width_add');

reduce_btn.addEventListener('click', () => { 
  const cur = getState('width');
  if(cur > 50) {
    setState('width', cur - 5); 
  }
}, false);

add_btn.addEventListener('click', () => { 
  const cur = getState('width');
  if(cur < 400) {
    setState('width', cur + 5); 
  }
}, false);
```

- 控制目标元素高度变化的模块

```js
// src/controlBtns/height.js

import { getState, setState } from '../state';

const reduce_btn = document.querySelector('.height_reduce');
const add_btn = document.querySelector('.height_add');
const height_input = document.querySelector('.height_input');

height_input.value = getState('height') || 100;

reduce_btn.addEventListener('click', () => { 
  const cur = getState('height');
  if(cur > 50) {
    setState('height', cur - 5);
    height_input.value = cur - 5; 
  }
}, false);

add_btn.addEventListener('click', () => { 
  const cur = getState('height');
  if(cur < 400) {
    setState('height', cur + 5); 
    height_input.value = cur + 5; 
  }
}, false);
```

最后将这些模块整合起来

```js
// src/controlBtns/index.js

import './showBtn';
import './bgColor';
import './bdColor';
import './width';
import './height';
```

在这个例子中，我们将状态控制设定为控制层，而UI变化设定为view层。我们只需在目标元素模块中，将view层的变化封装好，然后利用状态管理模块中的机制，在控制层只需考虑状态值的变化即可。

**7. 拼合模块**

在 src 目录下的 `index.js` 文件中，可以通过 `import` 将需要的模块拼合起来。

```js
// src/index.js

import './controlBtns';
import './box';

import './index.css';
```

**整个项目的相关目录结构如下**

```shell
- public
  - index.html
- src
  - index.js
  - index.css
  - box.js
  - state.js
  - utils.js
  - register.js
  - controlBtns
    - index.js
    - showBtn.js
    - bgColor.js
    - bdColor.js
    - width.js
    - height.js
```

**项目小结**

模块化的开发思路，实际上是通过视觉元素、功能性等原则，将代码划分为一个个拥有各自独立职能的模块。