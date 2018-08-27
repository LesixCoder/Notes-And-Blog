## Promise/A+ 规范js实现

> 有兴趣的可以参考官方网址 [https://promisesaplus.com/](https://promisesaplus.com/)

### 什么是promise/a+规范？

Promise 表示一个异步操作的最终结果。与 Promise 最主要的交互方法是通过将函数传入它的 then 方法从而获取得 Promise最终的值。

```js
return fn1().then(fn2).then(fn3).catch(function(err){
  // do something when err...
});
```

`fn1` 执行成功了，那么就会执行 `fn2`，如果 `fn2` 执行成功了就会执行下一个，以此类推。当出现异常就会直接到 `catch` 流程。

### promise

promise 是一个包含了兼容 promise 规范 then 方法的对象或函数。我们可以这样理解，每一个 promise 只要返回了 then 就可以无限的链式下去(就像jquery的链式调用，相当于返回了 this)。

```js
return fn1().fn2().fn3();
```

这里的 this 约定为每一个对象或函数返回的都是兼容 promise 规范 then 方法。

但是每个方法都返回this，比较麻烦，那能不能只有 then 方法 promise 对象，每一个操作都返回一样的 promise 对象，是不是就可以无限链接下去了？

### 总结

我们来总结一下，promise 规范到底是怎样的实现？

- 每个操作都返回一样的 promise 对象，保证链式调用
- 每个链式都通过 then 方法调用
- 每个操作内部允许出错，出了错误，统一由 `catch error` 处理
- 操作内部，也可以是一个操作链，通过 `reject` 或 `resolve` 再造流程

### 实现

`promise/a+` 规范是一个通用解决方案，不只是对 nodejs 管用，只要知道原理，用别的语言也可以轻易实现。

```js
var Promise = function() {};

var isPromise = function(value) {
  return value instanceof Promise;
};

var defer = function() {
  var pending = [],
    value;
  var promise = new Promise(); // 声明promise对象
  promise.then = function(callback) { // 给promise对象增加then方法
    if (pending) {
      pending.push(callback);
    } else {
      callback(value);
    }
  };
  return { // 给defer对象返回resolve和promise
    resolve: function(_value) {
      if (pending) {
        value = _value; // 在resolve事件里传参，是第几个就执行第几个
        for (var i = 0, ii = pending.length; i < ii; i++) {
          var callback = pending[i];
          callback(value);
        }
        pending = undefined;
      }
    },
    promise: promise
  };
};
```

- 首先
  - 声明promise对象
    - `var promise = new Promise();`
  - 给promise对象增加then方法
    - `promise.then = function (callback) {}`
  - 给defer对象返回resolve和promise
  - value，在resolve事件里传参，是第几个就执行第几个

cnode里的William17写的挺好的，完整的实现可以参考

- [https://cnodejs.org/topic/5603cb8a152fdd025f0f5014](https://cnodejs.org/topic/5603cb8a152fdd025f0f5014)
- [https://github.com/William17/taxi](https://github.com/William17/taxi)

q是一个不错的项目，也是比较早的promise实现，它把q的7个版本是如何实现的都详细记录了

> 参考 [https://github.com/kriskowal/q/tree/v1/design](https://github.com/kriskowal/q/tree/v1/design)

### bluebird 的 promisify

简单来说就是你给他传一个对象或者prototype，它去遍历，给他们加上async方法，此方法返回 promise 对象，你就可以做你想做的事情。

- 优点：使用简单
- 缺点：谨防对象过大，内存问题

```js
var fs = Promise.promisifyAll(require("fs"));

fs.readFileAsync("myfile.json").then(JSON.parse).then(function (json) {
  console.log("Successful json");
}).catch(SyntaxError, function (e) {
  console.error("file contains invalid json");
}).catch(Promise.OperationalError, function (e) {
   console.error("unable to read file, because: ", e.message);
});
```

我们都知道 nodejs API fs有 `fs.readFile`、`fs.readFileSync`，但是没有 `fs.readFileAsync`，实际上`fs.readFileAsync` 是 bluebird 加上去的

> 参考：[http://liubin.org/promises-book/#introduction](http://liubin.org/promises-book/#introduction)

### 检测是否完全符合Promise/A+规范

```sh
npm i promises-aplus-tests -g
```

具体用法请看 [promise test](https://github.com/promises-aplus/promises-tests)，然后

```sh
promises-aplus-tests  promise.js
```