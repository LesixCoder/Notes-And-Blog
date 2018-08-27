// v3.0then方法实现链式调用

// 要通过then方法实现链式调用，那么也就是说then方法每次调用需要返回一个primise,同时在返回promise的构造体里面，增加错误处理部分，我们来改造then方法

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
  let self = this, _promise;
  switch (self.status) {
    case "pending":
      _promise = new myPromise(function(resolve, reject) {
        self.onFullfilledArr.push(function() {
          try {
            let temple = onFullfilled(self.value);
            resolve(temple);
          } catch(e) {
            reject(e);
          }
        })
        self.onRejectedArr.push(function() {
          try {
            let temple = onRejected(self.reason);
            reject(temple);
          } catch(e) {
            reject(e);
          }
        })
      })
    case "resolved":
      _promise = new myPromise(function(resolve, reject) {
        try {
          let temple = onFullfilled(self.value);
          // 将上次一then里面的方法传递进下一个Promise的状态
          resolve(temple);
        } catch(e) {
          reject(e);
        }
      })
      break;
    case "rejected":
      _promise = new myPromise(function(resolve, reject){
        try{
          let temple = onRejected(self.reason);
          //将then里面的方法传递到下一个Promise的状态里
          resolve(temple);   
        }catch(e){
          reject(e);
        }
      })
      break;
    default:
  }
  return _promise;
}

// 这样我们虽然实现了then函数的链式调用，但是还有一个问题，就是在Promise/A+规范中then函数里面的onFullfilled方法和onRejected方法的返回值可以是对象，函数，甚至是另一个promise。