(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

require("core-js/shim");

require("regenerator-runtime/runtime");

require("core-js/fn/regexp/escape");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

// import util1 from './util1.js'
// import { fn1, fn2 } from './util2.js'

// console.log(util1)
// fn1()
// fn2()

// [1, 2, 3].map(item => item + 1)

// class MathHandle {
//     constructor(x, y) {
//         this.x = x
//         this.y = y
//     }
//     add() {
//         return this.x + this.y
//     }
// }

// const m = new MathHandle(1, 2)

// console.log(typeof MathHandle)  // 'function'
// console.log(MathHandle.prototype.constructor === MathHandle)  // true
// console.log(m.__proto__ === MathHandle.prototype)  // true

// class Animal {
//     constructor(name) {
//         this.name = name
//     }
//     eat() {
//         alert(this.name + ' eat')
//     }
// }

// class Dog extends Animal {
//     constructor(name) {
//         super(name)   // 注意 ！！！
//         this.name = name
//     }
//     say() {
//         alert(this.name + ' say')
//     }
// }

// const dog = new Dog('哈士奇')
// dog.say()
// dog.eat()

// function fn() {
//     console.log('real', this)  // real {a: 100}

//     var arr = [1, 2, 3]
//     arr.map(item => {
//         console.log(this)  // {a: 100}
//     })
// }
// fn.call({a: 100})

// real {a: 100}
// {a: 100}
// {a: 100}
// {a: 100}

function loadImg(src) {
    var promise = new Promise(function (resolve, reject) {
        var img = document.createElement('img');
        img.onload = function () {
            resolve(img);
        };
        img.onerror = function () {
            reject('图片加载失败');
        };
        img.src = src;
    });
    return promise;
}

var src1 = 'https://www.imooc.com/static/img/index/logo_new.png';
var src2 = 'https://img1.mukewang.com/545862fe00017c2602200220-100-100.jpg';

var load = function () {
    var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var result1, result2;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return loadImg(src1);

                    case 2:
                        result1 = _context.sent;

                        console.log(result1);
                        _context.next = 6;
                        return loadImg(src2);

                    case 6:
                        result2 = _context.sent;

                        console.log(result2);

                    case 8:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function load() {
        return _ref.apply(this, arguments);
    };
}();
load();

})));
