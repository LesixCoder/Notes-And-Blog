/**
 * Functor 函子
 */
class Functor {
  constructor(val) {
    this.val = val;
  }

  // 一般约定，函子的标志就是容器具有map方法。该方法将容器里面的每一个值，映射到另一个容器。
  map (f) {
    return Functor.of(f(this.val));
  }

  //函数式编程一般约定，函子有一个of方法
  static of (x) {
    return new Functor(x);
  }
}

/**
 * Maybe 函子
 */
// Functor.of(null).map(function (f) {
//   return f.toUpperCase();
// });
// TypeError
class Maybe extends Functor {
  map (f) {
    return this.val ? Maybe.of(f(this.val)) : Maybe.of(null);
  }
  static of (x) {
    return new Maybe(x);
  }
}
Maybe.of(null).map(function (f) {
  return f.toUpperCase();
});

/**
 * Either 函子
 */
class Either {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  map (f) {
    return this.right ? Either.of(this.left, f(this.right)) : Either.of(f(this.left), this.right);
  }

  static of (left, right) {
    return new Either(left, right);
  };
}

var addOne = function (x) {
  return x + 1;
};

Either.of(5, 6).map(addOne); // Either(5, 7);
Either.of(1, null).map(addOne); // Either(2, null);
Either.of({ address: 'xxx' }, currentUser.address).map(updateField);


/**
 * AP函子
 */
class Ap extends Functor {
  ap (F) {
    return Ap.of(this.val(F.val));
  }
  of (x) {
    return new Ap(x);
  }
}
Ap.of(addTwo).ap(Functor.of(2))

/**
 * IO
 */
import _ from 'lodash';
let compose = _.flowRight;
class IO extends Monad {
  map (f) {
    return IO.of(compose(f, this.__value))
  }
}

/**
 * Monad
 */
class Monad extends Functor {
  join () {
    return this.val;
  }
  flatMap (f) {
    return this.map(f).join();
  }
}
