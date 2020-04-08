let fs = require('fs');
import _ from 'lodash';
let compose = _.flowRight;

class Monad extends Functor {
  join () {
    return this.__value;
  }
  flatMap (f) {
    return this.map(f).join();
  }
}
class IO extends Monad {
  map (f) {
    return IO.of(compose(f, this.__value))
  }
}

let readFile = function (filename) {
  return new IO(function () {
    return fs.readFileSync(filename, 'utf-8');
  })
}

readFile('./user.txt') // IO函子
  .flatMap(tail) // this.map.join() == IO.of(compose(tail, fs.readFileSync(filename, 'utf-8')))
  .flatMap(print) // IO函子 - value == compose(print, tail, fs.readFileSync(filename, 'utf-8'))
