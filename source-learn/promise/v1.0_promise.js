function myPromise(constructor) {
  let self = this;
  self.status = "pending"; // 定义状态改变前的初始状态
  self.value = undefined; // 定义状态为resolved的时候的状态
  self.reason = undefined; // 定义状态为rejected的时候的状态
  function resolve(value) {
    // 两个==="pending"，保证了状态的改变是不可逆的
    if(self.status === "pending") {
      self.value = value;
      self.status = "resolved";
    }
  }
  function reject(reason) {
    // 两个==="pending"，保证了状态的改变是不可逆的
    if(self.status === "pending") {
      self.reason = reason;
      self.status = "rejected";
    }
  }
  // 捕获构造异常
  try {
    constructor(resolve, reject);
  } catch(e) {
    reject(e);
  }
}

// 在myPromise的原型上定义链式调用的then方法：
myPromise.prototype.then = function(onFullfilled, onRejected) {
  let self = this;
  switch (self.status) {
    case "resolved":
      onFullfilled(self.value);
      break;
    case "rejected":
      onRejected(self.value);
      break;
    default:
  }
}

// 但是这里myPromise无法处理异步的resolve.比如：
var p = new myPromise(function(resolve,reject){setTimeout(function(){resolve(1)},1000)});
p.then(function(x){console.log(x)})
//无输出