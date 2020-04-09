let fs = require('fs');
import _ from 'lodash';
let compose = _.flowRight;

class Functor {
  constructor(val) {
    this.val = val;
  }
  map (f) {
    return Functor.of(f(this.val));
  }
  static of (f) {
    return new Functor(f);
  }
}

class Monad extends Functor {
  join () {
    return this.val;
  }
  flatMap (f) {
    /**
     * flatMap
     * f == 接受一个函数返回的是IO函子
     * this.val 等于上一步的脏操作
     * this.map(f) compose(f, this.val) 函数组合
     * 返回这个组合函数并执行，注意顺序
     */
    return this.map(f).join();
  }
}
class IO extends Monad {
  map (f) {
    return IO.of(compose(f, this.val))
  }
  static of (f) {
    return new IO(f);
  }
}

let readFile = function (filename) {
  return IO.of(function () {
    return fs.readFileSync(filename, 'utf-8');
  })
}

let print = function (x) {
  console.log('🍊');
  return IO.of(function () {
    console.log('🍌');
    return x + '函数式';
  })
}

let tail = function (x) {
  console.log(x);
  return IO.of(function () {
    return x + '【liusixin】';
  })
}

readFile('./user.txt') // IO函子
  .flatMap(tail) // this.map.join() == IO.of(compose(tail, fs.readFileSync(filename, 'utf-8')))
  .flatMap(print) // IO函子 - value == compose(print, tail, fs.readFileSync(filename, 'utf-8'))
