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