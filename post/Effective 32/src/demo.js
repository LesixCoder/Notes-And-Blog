let data = [1, 2, 3];
console.log(data instanceof Array); //true

var toString = Object.prototype.toString;
toString.call([1, 2, 3]); // [object Array]
toString.call({}); // [object Object]
toString.call(function(){}); // [object Function]
toString.call(""); // [object String]
toString.call(1); // [object Number]
toString.call(null); // [object Null]
toString.call(undefined); // [object Undefined]






