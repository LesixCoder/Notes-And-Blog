// v4.0 then函数中的onFullfilled和onRejected方法的返回值问题

// 特别的为了解决onFullfilled和onRejected方法的返回值可能是一个promise的问题。
// （1）首先来看promise中对于onFullfilled函数的返回值的要求
// I）如果onFullfilled函数返回的是该promise本身，那么会抛出类型错误
// II）如果onFullfilled函数返回的是一个不同的promise，那么执行该promise的then函数，在then函数里将这个promise的状态转移给新的promise
// III）如果返回的是一个嵌套类型的promsie，那么需要递归。
// IV)如果返回的是非promsie的对象或者函数，那么会选择直接将该对象或者函数，给新的promise。
// 根据上述返回值的要求，我们要重新的定义resolve函数，这里Promise/A+规范里面称为：resolvePromise函数，该函数接受当前的promise、onFullfilled函数或者onRejected函数的返回值、resolve和reject作为参数。

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
          setTimeout(function() {
            try {
              let temple = onFullfilled(self.value);
              resolvePromise(temple);
            } catch(e) {
              reject(e);
            }
          })
        })
        self.onRejectedArr.push(function() {
          setTimeout(function() {
            try {
              let temple = onRejected(self.reason);
              resolvePromise(temple);
            } catch(e) {
              reject(e);
            }
          })
        })
      })
    case "resolved":
      _promise = new myPromise(function(resolve, reject) {
        setTimeout(function() {
          try {
            let temple = onFullfilled(self.value);
            // 将上次一then里面的方法传递进下一个Promise的状态
            resolvePromise(temple);
          } catch(e) {
            reject(e);
          }
        })
      })
      break;
    case "rejected":
      _promise = new myPromise(function(resolve, reject){
        setTimeout(function() {
          try{
            let temple = onRejected(self.reason);
            //将then里面的方法传递到下一个Promise的状态里
            resolvePromise(temple);   
          }catch(e){
            reject(e);
          }
        })
      })
      break;
    default:
  }
  return _promise;
}

function resolvePromise(promise, resolve, reject) {
  if(promise === x) {
    throw new TypeError('type error');
  }
  let isUesd;
  if(x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then;
      if(typeof then === 'function') {
        // 是一个promise的情况
        then.call(x, function(y) {
          if(isUesd) return;
          isUesd = true;
          resolvePromise(promise, y, resolve, reject);
        }, function(e) {
          if(isUesd) return;
          isUesd = true;
          reject(e);
        })
      } else {
        //n仅仅是一个函数或者是对象
        resolve(x)
      }
    } catch(e) {
      if(isUesd) return;
      isUesd = true;
      retject(e);
    }
  } else {
    // 返回的基本类型，直接resolve
    resolve(x);
  }
}

myPromise.deferred=function(){
  let dfd={};
  dfd.promise=new myPromise(function(resolve, reject){
    dfd.resolve=resolve;
    dfd.reject=reject;
  });
  return dfd;
}
export default myPromise;

// then函数的返回值——>返回一个新promise，从而实现链式调用
// then函数中的onFullfilled和onRejected方法——>返回基本值或者新的promise
// 这两者其实是有关联的，onFullfilled方法的返回值可以决定then函数的返回值。
