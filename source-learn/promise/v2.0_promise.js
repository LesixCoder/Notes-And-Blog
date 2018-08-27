// v2.0基于观察模式实现

// 为了处理异步resolve，我们修改myPromise的定义，用2个数组onFullfilledArray和onRejectedArray来保存异步的方法。在状态发生改变时，一次遍历执行数组中的方法。

function myPromise(constructor) {
  let self = this;
  self.status = "pending"; // 定义状态改变前的初始状态
  self.value = undefined; // 定义状态为resolved的时候的状态
  self.reason = undefined; // 定义状态为rejected的时候的状态
  self.onFullfilledArr = [];
  self.onRejectedArr = [];
  function resolve(value) {
    // 两个==="pending"，保证了状态的改变是不可逆的
    if(self.status === "pending") {
      self.value = value;
      self.status = "resolved";
      self.onFullfilledArr.forEach(function(f) {
        f(self.value);
        // 如果状态从pending变为resolved，
        // 那么就遍历执行里面的异步方法
      })
    }
  }
  function reject(reason) {
    // 两个==="pending"，保证了状态的改变是不可逆的
    if(self.status === "pending") {
      self.reason = reason;
      self.status = "rejected";
      self.onRejectedArr.forEach(function(f) {
        f(self.reason);
        // 如果状态从pending变为rejected， 
        // 那么就遍历执行里面的异步方法
      })
    }
  }
  // 捕获构造异常
  try {
    constructor(resolve, reject);
  } catch(e) {
    reject(e);
  }
}

// 对于then方法，状态为pending时，往数组里面添加方法：
myPromise.prototype.then = function(onFullfilled, onRejected) {
  let self = this;
  switch (self.status) {
    case "pending":
      self.onFullfilledArr.push(function() {
        onFullfilled(self.value);
      })
      self.onRejectedArr.push(function() {
        onRejected(self.reason);
      })
    case "resolved":
      onFullfilled(self.value);
      break;
    case "rejected":
      onRejected(self.value);
      break;
    default:
  }
}

// 通过两个数组，在状态发生改变之后再开始执行，这样可以处理异步resolve无法调用的问题。这个版本的myPromise就能处理所有的异步，那么这样做就完整了吗？
// 没有，我们做Promise/A+规范的最大的特点就是链式调用，也就是说then方法返回的应该是一个promise。