# 学习JS高级技巧

## 前言

- 安全的类型检测
- 惰性载入函数
- 柯里化
- 防篡改对象
- 冻结对象
- 定时器
- 函数节流

## 安全的类型检测

是怎么安全地检测一个变量的类型，例如判断一个变量是否为一个数组。一般是使用 `instanceof`

```js
let data = [1, 2, 3];
console.log(data instanceof Array); //true
```

但是这种方式有一个弊端，就是在 iframe 里面判断一个父窗口的变量的时候会不准确。

![](http://cdn-blog.liusixin.cn/WX20180731-144753@2x.png)

```js
Array !== window.parent.Array;
```

这个其实很好解释，它们分别是两个函数（父窗口定义的和子窗口定义的），内存地址不一样，Object 等式判断不成立，而`window.parent.arrayData.constructor` 返回的
是父窗口的 Array, 比较的时候是在子窗口，使用的是子窗口的 Array, 这两个 Array 不相等，所以导致判断不成立。

**使用 `Object.prototype.toString` 判断**

```js
var toString = Object.prototype.toString;
toString.call([1, 2, 3]); // [object Array]
toString.call({}); // [object Object]
toString.call(function() {}); // [object Function]
toString.call(''); // [object String]
toString.call(1); // [object Number]
toString.call(null); // [object Null]
toString.call(undefined); // [object Undefined]
```

可以用这个函数安全地判断变量是不是数组。

注意要使用 call, 而不是直接调用，call 的第一个参数是 context 执行上下文，把数组传给它作为执行上下文。

```js
var toString = Object.prototype.toString;
class Person {}
console.log(toString.call(Person)); // [object Function]
console.log(toString.call(new Person())); // [object Object]
```

可以看到 es6 的 class 也是用 function 实现的原型，也就是说 class 和 function 本质上是一样的，只是写法上不一样。

## 惰性载入函数

**UA 判断**

有时候我们需要做一些兼容性判断，比如 UA 的判断。

```js
// UA的类型
getUAType: function() {
  let ua = window.navigator.userAgent;
  if (ua.match(/renren/i)) return O;
  else if (ua.match(/MicroMessenger/i)) return 1;
  else if (ua.match(/weibo/i)) return 2;
  return -1;
}
```

这个函数的作用是判断用户是在哪个环境打开的网页，以便于统计哪个渠道的效果比较好。

这种类型的判断有一个特点，就是它的结果是固定的，不管执行判断多少次，都会返回相同的结果，用户的 UA 在这个网页不可能会发生变化（除了调试设定的之外）。所以为了优化，我们采用惰性函数优化下代码：

```js
var pageData = {
  getUAType: function() {
    let ua = window.navigator.userAgent;
    if (ua.match(/renren/i)) {
      pageData.getUAType = () => 0;
      return O;
    } else if (ua.match(/MicroMessenger/i)) {
      pageData.getUAType = () => 1;
      return 1;
    } else if (ua.match(/weibo/i)) {
      pageData.getUAType = () => 2;
      return 2;
    }
    return -1;
  }
};
```

每次判断之后把 `getUAType` 这个函数重新赋值，变成一个新的 function, 而这个 function 直接返回一个确定的变量，这样在下一次获取就可以跳过判断了，这就是惰性函数的作用。

更简单的实现，直接用变量存起来

```js
let ua = window.navigator.userAgent;
let UAType = ua.match(/renren/i)
  ? 0
  : ua.match(/MicroMessenger/i)
    ? 1
    : ua.match(/weibo/i)
      ? 2
      : -1;
```

连函数都不用写了，缺点是即使没有使用到 UAType 这个变量，也会执行一次判断，但是我们认为这个变量被用到的概率还是很高的。

**localStorage 兼容处理**

我们再举一个比较有用的例子，由于 Safari 的无痕浏览会禁掉本地存储，因此需要写一个兼容性判断

```js
Data.localStorageEnabled = true;
// Safari的无痕浏览会禁用 localStorage
try {
  window.localStorage.trySetData = 1;
} catch (e) {
  Data.localStorageEnabled = false;
}
function setLocalData(key, value) {
  if (Data.localStorageEnabled) {
    window.localStorage[key] = value;
  } else {
    util.setCookie('_L_' + key, value, 1000);
  }
}
```

在设置本地数据的时候，需要判断一下是不是支持本地存储，如果是的话就用 localStorage ,否则改用 cookie。 可以用惰性函数改造一下:

```js
setLocalData: function(key, value) {
  if (Data.localStorageEnabled) {
    util.setLocalData = function(key, value) {
      return window.localStorage[key];
    }
  } else {
    util.setLocalData = function(key, value) {
      return util.getCookie("_L_" + key);
    }
  }
  return util.setLocalData(key, value);
}
```

## 函数绑定

> 有时候要把一个函数当作参数传递给另一个函数执行， 此时函数的执行上下文往往会发生变化

```js
class DrawTool {
  constructor() {
    this.points = [];
  }
  init() {
    $map.on('click', this.handleMouseClick);
  }
  handleMouseClick(event) {
    this.points.push(event.latLng);
  }
}
```

click 事件的执行回调里面 this 不是指向了 `DrawTool` 的实例了，所以里面的 `this.points` 将会返回 `undefined`。

第一种解决方法是使用**闭包**，先把 this 缓存起来

```js
init() {
  let that = this;
  $map.on('click', that.handleMouseClick);
}
```

使用箭头函数：

```js
$map.on('click', event => this.handleMouseClick(event));
```

箭头函数的 this 还是指向父级的上下文，因此这里不用自已创建一个闭包，直接用 this 就可以。

第二种是 ES5 的 **bind 函数绑定**

```js
$map.on('click', this.handleMouseClick.bind(this));
```

bind 函数其实实现起来非常简单：

```js
Function.prototype.bind = function(context) {
  return () => this.call(context);
};
```

## 柯里化

> 柯里化就是一个函数的返回结果当成另一个函数的入参执行，就是函数和参数值结合产生一个新的函数。

```js
function add(a, b) {
  return a + b;
}
let add1 = add.curry(1);
console.log(add1(5)); // 6
console.log(add1(2)); // 3
```

要实现这样一个 curry 的函数，它的重点是要返回一个函数，这个函数有一些闭包的变量记录了创建时的默认参数，然后执行这个返回函数的时候，把新传进来的参数和默认参数拼一下变成完整参数列表去调用原本的函数。来看代码：

```js
Function.prototype.curry = function() {
  let slice = Array.prototype.slice;
  let defaultArgs = slice.call(arguments);
  let that = this;
  return function() {
    return that.apply(this, defaultArgs.concat(slice.call(arguments)));
  };
};
```

现在举一下柯里化一个有用的例子，当需要把一个数组降序排序的时候:

```js
let data = [1, 5, 2, 3, 10];
data.sort((a, b) => b - a); // [10, 5, 3, 2, 1]
```

给 sort 传一个函数的参数，但是如果你的降序操作比较多，每次都写－个函数参数还是有点烦的，因此可以用柯里化把这个参数固化起来

```js
Array.prototype.sortDescending = Array.prototype.sort.curry((a, b) => b - a);
let data = [1, 5, 2, 3, 10];
data.sortDescending();
console.log(data); // [10, 5, 3, 2, 1]
```

## 防止篡改对象

### 1. Object.seal 防止新增和删除属性

```js
let person = {
  name: 'liusixin'
};
Object.seal(person);
delete person.name; // 不能删
console.log(person.name); // 输出liusixin
person.age = 18; // 不能加
console.log(person.age); // 输出undefined
```

当把一个对象 seal 之后，将不能添加和删除属性。

> 注意：当使用严格模式将会抛异常

### 2. Object.freeze 冻结对象

这个方法是不能改属性值

```js
let person = {
  name: 'liusixin'
};
Object.freeze(person);
person.name = 'lsx'; // 不能修改
console.log(person.name); // 输出lsx
```

同时可以使用 `Object.isFrozen`、`Object.isSealed`、`Object.isExtensible` 判断当前对象的状态。

### 3. defineProperty 冻结单个属性

设置 `enumable/writable`为 false, 那么这个属性将不可遍历和写。

```js
let person = {
  name: 'liusixin'
};

Object.defineProperty(person, 'grade', {
  enumerable: false,
  value: 3
});
for (var key in person) {
  console.log(key); // name
  console.log(person.grade); // 3
}
```

## 定时器

我们知道在 C/C++/Java 等语言都是有 sleep 函数的，但
是 JS 没有。那么怎样实现一个 JS 版的 sleep 函数呢？

sleep 函数的作用是让线程进入休眠，当到了指定时间后再重新唤起。你不能写个 while 循环然后不断地判断当前时间和开始时间的差值是不是到了指定时间，因为这样会占用 CPU, 就不是休眠了。

**我们可以使用 setTimeout + 回调**

```js
function sleep(millionSeconds, callback) {
  setTimeout(callback, millionSeconds);
}
// sleep 2秒
sleep(2000, () => console.log('sleep recover'));
```

但是回调如果过多的话会造成回调地狱，可读性差，我们用 **Promise** 改写

```js
function sleep(millionSeconds) {
  return new Promise(resolve => {
    setTimeout(resolve, millionSeconds);
  });
}
// sleep 2秒
sleep(2000).then(() => console.log('sleep recover'));
```

**async/await 改写**

```js
function sleep(millionSeconds) {
  return new Promise(resolve => {
    setTimeout(resolve, millionSeconds);
  });
}
async function init() {
  await sleep(2000);
  console.log('sleep recover');
}
init();
```

相对于简单的 Promise 版本，sleep 的实现还是没变。不过在调用 sleep 的前面加一个 await，这样只有 sleep 这个异步完成了，才会接着执行下面的代码。同时需要把代码逻辑包在一个 async 标记的函数里面，这个函数会返回一个 Promise 对象，当里面的异步都执行完了就可以 then 了。

```js
init().then(() => console.log('init finished'));
```

关于定时器还有－个很重要的话题，那就是 **setTimeout 和 setlnterval 的区别**:

setTimeout 是在当前执行单元都执行完才开始计时，而 setlnterval 是在设定完计时器后就立马计时。

```js
let scriptBegin = Date.now();
fun1();
fun2();
// 需要执行20ms的工作单元
function act(functionName) {
  console.log(functionName, Date.now() - scriptBegin);
  let begin = Date.now();
  while (Date.now() - begin < 20);
}

function fun1() {
  let fun3 = () => act('fun3');
  setTimeout(fun3, 0);
  act('fun1');
}

function fun2() {
  act('fun2 - 1');
  var fun4 = () => act('fun4');
  setInterval(fun4, 20);
  act('fun2 - 2');
}
```

这段代码的执行模型是这样的：

![](http://cdn-blog.liusixin.cn/WX20180731-164004@2x.png)

打印结果：

![](http://cdn-blog.liusixin.cn/WX20180731-164203@2x.png)

## 函数节流 throttling

节流的目的是为了不想触发执行得太快，比如：

- 监听 input 触发搜索；
- 监听 resize 做响应式调整；
- 监听 mousemove 调整位置。

```js
function throttle(method, context) {
  clearTimeout(method.tId);
  method.tId = setTimeout(function() {
    method.call(context);
  }, 100);
}
```

每次执行都要 setTimeout 一下，如果触发得很快就把上一次的 setTimeout 清掉重新 setTimeout, 这样就不会执行很快了。

但是这样有个问题，这个回调函数可能永远不会执行，因为它一直在触发，一直在清掉 `tId`, 这就尴尬了 -\_- ，上面代码的本意应该是 1OOms 内最多触发一次，而实际情况是可能永远不会执行。这种实现应该**叫防抖，不是节流**。

把上面的代码稍微改造一下：

```js
function throttle(method, context) {
  if (method.tId) return;
  method.tId = setTimeout(function() {
    method.call(context);
    method.tId = 0;
  }, 100);
}
```

这个实现就是正确的，每 1OOms 最多执行一次回调，原理是在 setTimeout 里面把 tId 给置成 0, 这样能让下一次的触发执行。大概每 1OOms 就执行一次，这样就达到我们的目的。

但是这样有一个小问题，就是每次执行都是要延迟 1OOms, 有时候用户可能就是最大化了窗口，只触发了一次 resize 事件，但是这次还是得延迟 1OOms 才能执行，我们再优化下代码：

```js
function throttle(method, context) {
  // 如果是第一次触发， 立刻执行
  if (typeof method.tId === 'undefined') {
    method.call(context);
  }
  if (method.tId) return;
  method.tId = setTimeout(function() {
    method.call(context);
    method.tId = 0;
  }, 100);
}
```

先判断是否为第一次触发，如果是的话立刻执行。这样就解决了上面提到的问题，但是这个实现还是有问题，因为它只是全局的第一次，用户最大化之后，隔了一会又取消最大化了就又有延迟了，并且第一次触发会执行两次。继续优化：

```js
function throttle(method, context) {
  if (!method.tId) {
    method.call(context);
    method.tId = 0;
    setTimeout(() => (method.tId = 0), 100);
  }
}
```

每次触发的时候立刻执行，然后再设定一个计时器，把 tId 置成 0。这个实现比之前的实现还要简洁，并且能够解决延迟的问题。 但还是有一个问题就是最后 1OOms 的信息将会被丢弃，一般应该是希望最后的那次触发能够执行，因为那个才是最终的状态。

> 防抖是只执行重复操作的最后一次，而节流是每多少单位时间内只执行一次。
