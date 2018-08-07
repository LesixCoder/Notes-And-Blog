## 函数与函数式编程

### 函数

在前面的章节中我们 已经创建过一个简单的状态管理模块，这里我们将扩展它，以便应对更加复杂的场景。

```js
// 自执行创建模块
(function() {
  // states 结构预览
  // states = {
  //   a: 1,
  //   b: 2,
  //   m: 30,
  //   o: {}
  // }
  var states = {}; // 私有变量，用来存储状态与数据

  // 判断数据类型
  function type(elem) {
    if (elem == null) {
      return elem + '';
    }
    return toString
      .call(elem)
      .replace(/[\[\]]/g, '')
      .split(' ')[1]
      .toLowerCase();
  }

  /**
   * @description 通过属性名获取保存在 states 中 的值
   * @param {*} name 属性名
   * @returns
   */
  function get(name) {
    return states[name] ? states[name] : '';
  }

  function getStates() {
    return states;
  }

  /**
   * @description 通过传入键值对的方式修改 state 树，使用方式与小程序的 data 或者 react 中的 setStates 类似
   * @param {*} options {object} 键值对
   * @param {*} target {object} 属性值为对象的属性，只在函数实现，递归调用时传入
   */
  function set(options, target) {
    var keys = Object.keys(options);
    var o = target ? target : states;

    keys.map(function(item) {
      if (typeof o[item] == 'undefined') {
        o[item] = options[item];
      } else {
        type(o[item]) == 'object'
          ? set(options[item], o[item])
          : (o[item] = options[item]);
      }
      return item;
    });
  }

  // 对外提供接口
  window.get = get;
  window.set = set;
  window.getStates = getStates;
})();

// 具体使用方式如下
set({
  a: 20
}); // 保存属性a
set({
  b: 100
}); // 保存属性b
set({
  c: 10
}); // 保存属性c

// 保存属性o, 它的值为一个对象
set({
  o: {
    m: 10,
    n: 20
  }
});
// 修改对象o的m值
set({
  o: {
    m: 1000
  }
});
// 给对象o中增加一个c属性
set({
  o: {
    c: 100
  }
});
console.log(getStates());
```

### 函数式编程

一般来说，当想要做的事情比较简单时，可能还看不出封装成函数之后带来的便利。如果想要做的事情稍微复杂一点呢，例如想要计算一个数组中所有子项的和。

```js
function mergeArr(arr) {
  var result = 0;
  for (var i = 0; i < arr.length; i++) {
    result += arr[i];
  }
  return result;
}
```

封装之后，当再次做这件事情的时候，只需用一句代码即可。

```js
mergeArr([1, 2, 3, 4, 5]);
```

这里将要学习的函数封装思维叫作**函数式编程**。

与函数式编程对应的叫作命令式编程。这也是我们在初学代码时，不由自主地会使用的编码方式。

假设这个时候有一个数组，我们需要找出该数组中所有类型为 number 的子项。

当使用命令式编程时，写出的代码如下。

```js
var array = [1, 3, 'h', 5, 'm', '4'];
var res = [];
for (var i = O; i < array.length; i++) {
  if (typeof array[i] == 'number') {
    res.push(array[i]);
  }
}
```

在这种实现方式中，简单地达到了我们想要的目的。 但是在另外一个场景，出现了同样的需求，或者需要将另外一个数组中的 number 子项也找出来，那么用 这种方式的后果就是不得不把实现逻辑再重写一遍，因此这个时候代码就变得非常冗余且难以维护。

而函数式编程的思维则是当遇到这种场景时，把逻辑封装起来。

```js
function getNumbers(array) {
  var res = [];
  array.forEach(function(item) {
    if (typeof item === 'number') {
      res.push(item);
    }
  });
  return res;
}

// 以上是封装，以下是功能实现
var array = [1, 3, 'h', 5, 'm', '4'];
var res = getNumbers(array);
```

#### 函数是一等公民

所谓的 “一等公民”，其实就是普通公民。像对待任何其他数据类型一样对待函数。

可以把函数赋值给一个变量。

```js
var fn = function() {};
```

也可以把函数存在数组里。

```js
function fn(callback) {
  var a = 20;
  return callback(20, 30) + a;
}

function add(a, b) {
  return a + b;
}

fn(add); // 70
```

还可以把函数作为另一个函数运行的返回值。

```js
function add(x) {
  var y = 20;
  return function() {
    return x + y;
  };
}

var _add = add(100);
_add(); // 120
```

自定义如下这样一个函数，要求在 5000ms 之后执行该函数，我们应该怎么做?

```js
function delay() {
  console.log('5000ms之后执行该函数。');
}
```

有的人可能会这样写。

```js
var timer = setTimeout(function() {
  delay();
}, 5000);
```

很显然，这样做能够达到我们的目的，但这也正是我们忽视了上面的概念写出来的糟糕代码。

函数既然能够作为一个参数传入另外一个函数，那么是不是可以直接将 delay 函数传人，而不用在固有的思维上额外再封装一层多余的 function 呢?

```js
var timer = setTimeout(delay, 5000);
```

现在思考一下如何优化下面的例子。

```js
function getUser(path, callback) {
  return $.get(path, function(info) {
    return callback(info);
  });
}
getUser('/api/user', function(resp) {
  // resp为成功请求之后返回的数据
  console.log(resp);
});
```

在这个例子中，我们期望封装一个获取用户信息的函数，并期望在请求成功之后把需要处理的事情放在回调函数 `callback` 中来做。

先看看 `getUser` 这个方法内部的实现。

```js
$.get(path, function(info) {
  return callback(info);
});
```

`callback` 函数被额外包裹了一层没有意义的函数，因此第一步就是对其进行简化。

```js
$.get(path, callback);
```

```js
function getUser(path, callback) {
  return $.get(path, callback);
}
```

但是再仔细观察，是不是又发现了同样的问题，`$.get` 方法也同样被包裹了一层没有意义的函数。

```js
// $.get是jquery自带的工具方法
var getUser = $.get;
```

当然，可能会有一部分人对于参数的处理有一些疑问，下面就通过一个例子来进行简单的类比。

```js
function add(a, b) {
  return a + b;
}
var other = add;
other(10, 20); // 30
```

#### 纯函数

> 相同的输入总会得到相同的输出，并且不会产生副作用的函数，就是纯函数。

通过一个是否会改变原始数据的两个同样功能的方法来区别纯函数与非纯函数之间的不同。

我们期望封装一个函数，能够获取到传人数组的最后一项。那么可以通过以下两种方式来实现。

```js
function getLast(arr) {
  return arr[arr.length];
}

function getLast_(arr) {
  return arr.pop();
}
var source = [1, 2, 3, 4];
var last = getLast(source); // 返回结采 4，原数组不变
var last_ = getLast_(source); // 返回结果4，原数纽最后一项被删除
```

在 JavaScript 原生支持的数据方法中，也有许多不纯的方法，我们在使用时要多加警惕，要清晰地知道原始数据的改变是否会留下隐患。

```js
var source = [1, 2, 3, 4, 5];

source.slice(1, 3); // 纯函数返回[2, 3], source不变
source.splice(1, 3); // 不纯的函数返回[2, 3, 4], source被改变
source.pop(); // 不纯的
source.push(6); // 不纯的
source.shift(); // 不纯的
source.unshift(1); // 不纯的
source.reverse(); // 不纯的
// 不能短时间知道现在 source 被改变成什么样子了，干脆重新约定一下
source = [1, 2, 3, 4, 5];

source.concat([6, 7]); // 纯函数返回[1, 2, 3, 4, 5, 6, 7] , source不变
source.join('-'); // 纯函数返回 1-2-3-4-5,source不变
```

纯函数还有一个重要的特点，那就是除传入的参数外，不依赖任何外界的信息与状态。 例如:

```js
var name = 'Jake';
function sayHello() {
  return ’Hello, ‘ + name;
}
sayHello(); // Hello, Jake
// 当我们有其他需求时需要改变 name 的值
name = 'Tom';
sayHello(); // Hello, Tom
```

同样的调用，但是由于 `sayHello` 函数依赖于外界的 name 变量，因此当外界变量发生变化时，函数的运行结果就变得不一样。很显然这并不是我们封装函数时所希望看到的状况，因为这样的变化无法预测。 因此，对于上面的例子，我们应该把 name 当作一个参数传入，这样就能够直观地看到该函数执行时会输出的结果了。

```js
function sayHello(name) {
  return 'Hello，' + name;
}
```

**纯函数的可移植性**

在封装一个函数、一个库或一个组件时，其实都期望一次封装，多处使用，而纯函数刚好具备这样的特性。

我们知道一个页面的 URL 里常常会在 “?” 后面带有参数，例如 `https://www.baidu.com/s?tn=baidu&wd=javascript&rsv_sug=1`。 很多时候我们需要从这段 URL 中，获取某些参数对应的值。

```js
function getParams(url, param) {
  if (!/\?/.test(url)) {
    return null;
  }

  var search = url.split('?')[1];
  var array = search.split('k');

  for (var i = O; i < array.length; i++) {
    var tmp = array[i].split('=');
    if (tmp[O] === param) {
      return decodeURIComponent(tmp[1]);
    }
  }

  return null;
}

var url = 'https://www.baidu.com/s?tn=baidu&wd=javascript&rsv_sug=1';
getParams(url, 'wd'); // javascript
```

虽然 `getParams` 并非完全健壮，但是已经足以体现纯函数可移植的特点。我们可以在任何需要从 URL 中取得参数对应值的地方调用该方法。

**纯函数的可缓存性**

在实践中我们可能会处理大量的数据，例如根据日期，得到当日相关的数据，并处理成前端能够使用的数据。假设我们封装了一个 process 方法来处理每天的数据，而这个处理过程会很复杂。如果不缓存处理结果，那么每次想要得到当天的数据时，就不得不从原始数据再转换一次。当数据的处理足够复杂时，那么很可能不是性能最优的解决方案。而纯函数的特点是，相同的输入总能得到相同的输出，因此如果将处理过的每一天的数据都缓存起来，那么当第二次或者更多次的想要得到当天的数据时，就不用经历复杂的处理过程了。

```js
// 传入日期，获取当天的数据
function process(date) {
  var result = '';
  // 略掉中间复杂的处理过程
  return result;
}

function withProcess(base) {
  var cache = {};
  return function() {
    var date = arguments[O];
    if (cache[date]) {
      return cache[date];
    }
    return base.apply(base, arguments);
  };
}

var _process = withProcess(process);

//经过上面一句代码处理之后，就可以使用 _process 来获取我们想要的数据了。
//如采数据存在 ，就返回缓存中的数据;如果不存在，则调用 process 方法重新获取
_process('2017-06-03');
_process('2017-06-04');
_process('2017-06-05');
```

上面例子中利用了闭包的特性，将处理过的数据都缓存在了 cache 中。这种方式算是高阶函数的一种运用。也正是因为纯函数的可靠性，才能够确保缓存的数据一定就是我们想要的正确结果。

#### 商阶函数

有一个问题可能困扰过很多人，那就是在构造函数中，如果使用了 this，那么这个 this 指向的是谁? 如果在定义的原型方法中使用了 this，那么这个 this 又指向谁?是构造函数、原型，还是实例?

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.getName = function() {
  return this.name;
};
var p1 = new Person('Jake', 18);
p1.getName();
```

构造函数其实就是普通的函数，而 this 是在函数运行时才确认的。那么是什么导致了构造函数变得特别?

**答案与 new 关键字有关**

我们自定义一个 New 方法，来模拟关键字 new 的能力

```js
// 将构造函数以参数形式传入
function New(func) {
  // 声明一个中间对象，该对象为最终返回的实例
  var res = {};
  if (func.prototype !== null) {
    // 将实例的原型指向构造函数的原型
    res.__proto__ = func.prototype;
  }

  // ret为构造函数执行的结果，这里通过 apply
  // 将构造函数内部的 this 指向修改为指向 res，即为实例对象
  var ret = func.apply(res, Array.prototype.slice.call(arguments, 1));

  // 当在构造函数中明确指定了返回对象时，那么 new 的执行结果就是该返回对象
  if ((typeof ret === 'object' || typeof ret === 'function') && ret !== null) {
    return ret;
  }

  //6 如采没有明确指定返回对象，则默认返回 res，这个 res 就是实例对象
  return res;
}
```

通过 New 方法的实现可以看出，当 New 执行时，利用 apply 设定了传入的构造函数的 this 指向，因此当使用 New 方法创建实例时，构造函数中的 this 就指向了被创建的实例。

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.getName = function() {
  return this.name;
};

// 使用上例中封装的New方法来创建实例
var p1 = New(Person, 'Jake', 18);
var p2 = New(Person, 'Tom', 20);
p1.getName(); // Jake
p2.getName(); // Tom
```

如果把当前函数看成基础函数，那么高阶函数，就是让当前函数获得额外能力的函数。如果把构造函数看成基础函数，那么 New 方法，就是构造函数的高阶函数。构造函数本就和普通函数一样，没有什么区别。但是因为 New 的存在，它获得了额外的能力。New 方法每次执行都会创建一个新的中间对象，并将中间对象的原型指向构造函数的原型，将构造函数的 this 指向该中间对象。这样统一逻辑的封装，就是高阶函数的运用。

高阶函数其实是一个高度封装的过程，理解它需要一点想象力。接下来，就借助几个例子，来理解高阶函数的封装。

**数组 map 方法封装的思考过程**

数组有一个 map 方法，它对数组中的每一项运行给定的函数，返回每次函数调用的结果并组成数组。简单来说，就是遍历数组的每一项，并且在 map 的第一个参数中进行运算处理后返回计算结果，最终返回一个由所有计算结果组成的新数组。

```js
//声明一个被迫历的数据 array
var array = [1, 2, 3, 4];

// map方法 第一个参数为一个回调函数，该函数拥有三个参数
// 第一个参数表示array数组中的每一项
// 第二个参数表示当前遍历的索引值
// 第三个参数表示数组本身
// 该函数中的 this 指向 map 方法的第二个参数，若该参数不存在，则 this 指向丢失
var newArray = array.map(
  function(item, i, arr) {
    console.log(item, i, arr, this); // 可运行查看每一项参数的具体值
    return item + 1;
  },
  { a: 1 }
);

// newArray为一个新数组，由 map 遍历的结果组成
console.log(newArray); // [2, 3, 4, 5]
```

现在需要思考的是，如果要我们自己来封装这样一个方法，应该怎么办?

因为所有的数组遍历方法其实都是在 for 循环的基础之上封装的，因此我们可以从 for 循环开始考虑。

在封装函数时，对于一个不确定的变量，我们可以用往函数中传入参数的方式来指定它。同样的道理，对于一个不确定的处理过程，我们可以用往函数中传入另外一个函数的方式来自定义这个处理过程。因此，基于这个思路，我们可以按照如下方式来封装 map 方法。

```js
Array.prototype._map = function(fn, context) {
  // 首先定义一个数组来保存每一项的运算结果，最后返回
  var temp = [];
  if (typeof fn == 'function') {
    var k = 0;
    var len = this.length;
    // 封装for循环过程
    for (; k < len; k++) {
      // 将每一项的运算操作丢进fn里，
      // 利用 call 方法指定fn的this指向与具体参数
      temp.push(fn.call(context, this[k], k, this));
    }
  } else {
    console.error('TypeError:' + fn + ' is not a function.');
  }

  // 返回每一项运算结果组成的新数组
  return temp;
};

var newArr = [1, 2, 3, 4]._map(function(item) {
  return item + 1;
});
// [2, 3, 4, 5]
```

回过头反思 map 方法的封装过程可以发现，其实我们封装的是一个数组的 for 循环过程。 每一个数组在使用 for 循环遍历时，虽然无法确认在 for 循环中到底会做什么事情，但是可以确定的是，它们一定会使用 for 循环。

因此我们把 “都会使用 for 循环” 这个公共逻辑封装起来，而具体要做什么事，则以一个函数作为参数的形式，来让使用者自定义。这个被作为参数传人的函数，就可以称之为**基础函数**。而我们封装的 map 方法，就可以称之为**高阶函数**。

**高阶函数的使用思路正在于此，它其实是一个封装公共逻辑的过程。**

通过另外一个例子来再次感受高阶函数的魅力。

假设我们正在做一个音乐社区的项目。很显然，在进入这个项目的每一个页面时，都必须判断当前用户是否已经登录。因为登录与未登录所展示的页面肯定是有很多差别的。不仅如此，在确认用户登录之后，还需得到用户的具 体信息，如昵称、姓名、VIP 等级、权限范围等。

首先需要一个高阶函数来专门处理获取用户状态的逻辑，因此可以单独将这个高阶函数封装为一个独立的模块。

```js
// 高阶函数withLogin，用来判断当前用户状态
(function() {
  // 用随机数的方式来模拟一个获取用户信息的方法
  var getLogin = function() {
    var a = parseInt(Math.random * 10).toFixed(0);
    if (a % 2 == 0) {
      return {
        login: false
      };
    }
    return {
      login: true,
      userInfo: {
        nickname: 'karl',
        vip: 11,
        userid: '666666'
      }
    };
  };

  var withLogin = function(basicFn) {
    var loginInfo = getLogin();

    // 将loginInfo 以参数的形式传入基础函数中
    return basicFn.bind(null, loginInfo);
  };

  window.withLogin = withLogin;
})();
```

假设我们要展示主页，则可以通过 renderIndex 的方法来渲染。当然，渲染主页仍然是一个单独的模块。

```js
(function() {
  var withLogin = window.withLogin;

  var renderIndex = function(loginInfo) {
    // 这里处理 index 页面的逻辑

    if (loginInfo.login) {
      // 处理已经登陆之后的逻辑
    } else {
      // 这里处理未登录的逻辑
    }
  };

  // 对外暴露接口时，使用高阶函数包一层，来判断当前页面的登录状态
  window.renderIndex = withLogin(renderIndex);
})();
```

同样的道理，当我们想要展示其他页面，例如个人主页时，则可以使用 renderPersonal 方法

```js
(function() {
  var withLogin = window.withLogin;
  var renderPersonal = function(loginInfo) {
    if (loginInfo.login) {
      // do something
    } else {
      // do other something
    }
  };
  window.renderPersonal = withLogin(renderPersonal);
})();
```

当我们使用高阶函数封装每个页面的公共逻辑之后，会发现我们的代码逻辑变得非常清晰，而且更加统一。当再写新的页面逻辑时，就在此基础之上完成即可，而不用再去考虑已经封装过的逻辑。最后，在合适的时机使用这些渲染函数即可。

```js
(function() {
  window.renderIndex();
})();
```

#### 柯里化

> 柯里化是指这样一个函数(假设叫作 createCurry)，它接收函数 A 作为参数，运行后能够返回一个新的函数，并且这个新的函数能够处理函数 A 的剩余参数。

假设有一个接收三个参数的函数 A。

```js
function A(a, b, c) {
  // do something
}
```

又假如我们有一个已经封装好了的柯里化通用函数 `createCurry`。 它接收 bar 作为参数，能够将 A 转化为柯里化函数，返回结果就是这个被转化之后的函数。

```js
var _A = createCurry(A);
```

那么 `_A` 作为 `createCurry` 运行的返回函数，能够处理 A 的剩余参数。因此下面的运行结果都是等价的。

```js
_A(1, 2, 3);
_A(1, 2)(3);
_A(1)(2, 3);
_A(1)(2)(3);
A(1, 2, 3);
```

函数 A 被 `createCurry` 转化之后得到柯里化函数 `_A`, `_A` 能够处理 A 的所有剩余参数。因此柯里化也被称为部分求值。

例如，有一个简单的加法函数，它能够将自身的三个参数加起来并返回计算结果。

```js
function add(a, b, c) {
  return a + b + c;
}
```

那么 add 函数的柯里化函数 \_add 则可以写成:

```js
function _add(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}
```

通过 \_add 可以看出，柯里化函数的运行过程其实是一个参数的收集过程，我们将每一次传入的参数收集起来，并在最里层进行处理。因此在实现 `createCurry` 时，可以借助这个思路来进行封装。

```js
// arity 用来标记剩余参数的个数
// args 用来收集参数
function createCurry(func, arity, args) {
  // 第一次执行时，并不会传入arity，而是直接获取 func 参数的个数 func.length
  var arity = arity || func.length;

  // 第一次执行也不会传入 args，而是默认为空数组
  var args = args || [];

  var wrapper = function() {
    // 将 wrapper 中的参数收集到 args 中
    var _args = [].slice.call(arguments);
    [].push.apply(args, _args);

    // 如果参数个数小于最初的 func.length，则递归调用，继续收集参数
    if (_args.length < arity) {
      arity -= _args.length;
      return createCurry(func, arity, args);
    }

    // 参数收集完毕，执行 func
    return func.apply(func, args);
  };

  return wrapper;
}
```

这个 `createCurry` 函数的封装其实借助了闭包与递归，实现了一个参数收集，并在收集完毕之后执行所有参数。

柯里化确实是把简单的问题复杂化了，但在复杂化的同时，我们在使用函数时拥有了更多的自由度。对于函数参数的自由处理，正是柯里化的核心所在。

如果想要验证一串数字是否是正确的手机号，那么按照普通的思路来做，可能会这样封装。

```js
function checkPhone(phoneNumber) {
  return /^1[34578]\d{9}$/.test(phoneNumber);
}
```

而如果想要验证是否是邮箱呢?很可能会这么封装:

```js
function checkEmail(email) {
  return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(email);
}
```

当然，还可能会遇到验证身份证号、验证密码等各种验证信息，因此在实践中，为了统一逻辑，我们会封装一个更为通用的函数，把待验证的正则表达式与将要被验证的字符串作为参数传入。

```js
function check(reg, targetString) {
  return reg.test(targetString);
}
```

但是这样封装之后，在使用时又会遇到问题，因为总是需要输入一串正则表达式，这样就导致了使用时的效率低下。

```js
check(/^1[34578]\d{9}$/, '14900000088');
check(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, 'test@163.com');
```

这个时候，就可以借助柯里化，在 check 的基础上再做一层封装

```js
var _check = createCurry(check);

var checkPhone = _check(/^1[34578]\d{9}$/);
var checkEmail = _check(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/);

checkPhone('18301110294');
checkEmail('test@163.com');
```

在这个过程中可以发现，柯里化能够应对更加复杂的逻辑封装。当情况变得多变时，柯里化依然能够应付自如。

下面继续来思考一个例子,我们分析了封装 map 方法的思考过程。由于没有办法确认一个数组在遍历时会执行什么操作，因此只能将调用 for 循环的这个统一逻辑封装起来，而具体的操作则通过参数传人的形式让使用者自定义，这就是 map 函数。

但是，这是针对了所有的情况我们才会这样想。

在实践中常常会发现，在我们的某个项目中，针对于某一个数组的操作其实是固定的，也就是说，同样的操作，可能会在项目的不同地方调用很多次。

这个时候，我们就可以在 map 函数的基础上，进行二次封装，以简化在项目中的使用。假设这个在项目中会调用多次的操作是将数组的每一项都转化为百分比: 1 ~ 100%。

普通思维下可以这样来封装:

```js
function getNewArray(array) {
  return array.map(function(item) {
    return item * 100 + '%';
  });
}
getNewArray([1, 2, 3, 0.12]);
// ['100%', '200%', '300%', '12%'];
```

而如果借助柯里化来二次封装这样的逻辑：

```js
function _map(func, array) {
  return array.map(func);
}
var _getNewArray = createCurry(_map);
var getNewArray = _getNewArray(function(item) {
  return item * 100 + '%';
})
getNewArray([1, 2, 3, 0.12]);
// ['100%', '200%', '300%', '12%'];
getNewArray( [O.01, 1]);
// ['1%', '100%']
```

如果项目中的固定操作是希望对数组进行一个过滤，找出数组中的所有 Number 类型的数据，则借助柯里化思维还可以这样做。

```js
function _filter(func, array) {
  return array.filter(func);
}
var _find = createCurry(_filter);

var findNumber = _find(function(item) {
  if(typeof item == 'number') {
    return item;
  }
})

findNumber([1, 2, 3, '2', '3', 4]); // [1, 2, 3, 4]

// 当我们继续封装另外的过滤操作时就会变得非常简单 // 找出数字为20的子项
var find20 = _find(function(item, i) {
  if(typeof item === 20) {
    return i;
  }
})
find20([1, 2, 3, 30, 20, 100]); // 4

// 找出数组中大于100的所有数据
var findGreater100 = _find(function(item) {
  if(item > 100) [
    return item;
  ]
})
findGreater100([1, 2, 101, 300, 2, 122]); // [101, 300, 122]
```

这里采用了与 check 例子不一样的思维方向来向大家展示我在使用柯里化时的想法，目的是想告诉大家，柯里化能够帮助我们应对更多更复杂的场景。

柯里化虽然具有了更多的自由度，但同时柯里化通用式里调用了 `arguments` 对象，使用了递归与闭包，因此柯里化的自由度是以牺牲了一定的性能为代价换来的。只有在情况变得复杂时，才是柯里化大显身手的时候。

**额外知识补充:无限参数的柯里化**

在前端面试中，可能会遇到这样一个涉及柯里化的题目。

```js
// 实现一个 add 方法，使计算结果能够满足如下预期:
add(1)(2)(3) = 6;
add(1, 2, 3)(4) = 10;
add(1)(2)(3)(4)(5) = 15;
```

这个题目的目的是想让 add 执行之后返回一个函数能够继续执行，最终运算的结果是所有出现过的参数之和。而这个题目的难点在于参数的不固定。我们不知道函数会执行几次，因此不能使用前面封装的 `createCurry` 通用公式来转换一个柯里化函数，只能自己封装，该怎样操作呢？在此之前，补充两个非常重要的知识点。

一个是 ES6 函数的不定参数。假如我们有一个数组，希望把这个数组中所有的子项展开传递给一个函数作为参数，那么应该怎么做呢?

```js
// 大家可以思考一下，如何将 args 数组的子项展开作为 add 的参数传入
function add(a, b, c, d) {
  return a + b + c + d;
}
var args = [1, 3, 100, 1];
```

在 ES5 中，我们可以借助之前学过的 apply 来达到这个目的。

```js
add.apply(null, args); // 105
```

而在 ES6 中，提供了一种新的语法来解决这个问题，那就是不定参

```js
add(...args); // 105
```

这两种写法是等效的。在接下来的实现中，我们会用到不定参的特性。

第二个要补充的知识点是函数的**隐式转换**。当函数直接参与其他计算时，函数会默认调用 `toString` 方法，直接将函数体转换为字符串参与计算。

add 方法的实现仍然是一个参数的收集过程。当 add 函数执行到最后时，返回的仍然是一个函数，但是我们可以通过定义 `toString/valueOf` 的方式，让这个函数可以直接参与计算，并且转换的结果是我们想要的，而且它本身也仍然可以继续接收新的参数，实现方式如下。

```js
function add() {
  // 第一次执行时，定义一个数组专门用来存储所有的参数
  var _args = [].slice.call(arguments);

  // 在内部声明一个函数，利用闭包的特性保存 _args 并收集所有的参数值
  var adder = function() {
    var _adder = function() {
      // [].push.apply(_args, [].slice.call(arguments));
      _args.push(...arguments);
      return _adder;
    };

    // 利用隐式转换的特性，当最后执行时隐式转换，计算最终的值并返回
    _adder.toString = function() {
      return _args.reduce(function(a, b) {
        return a + b;
      });
    };

    return _adder;
  };

  // return adder.apply(null, _args);
  return adder(..._args);
}

var a = add(1)(2)(3)(4); // f 10
var b = add(1, 2, 3, 4); // f 10
var c = add(1, 2)(3, 4); // f 10
var d = add(1, 2, 3)(4); // f 10

// 可以利用隐式转换的特性参与计算
console.log(a + 10); // 20
console.log(b + 20); // 30
console.log(c + 30); // 40
console.log(d + 40); // 50

// 也可以继续传入参数，得到的结果再次利用隐式转换参与计算
console.log(a(10) + 100); // 120
console.log(b(10) + 100); // 120
console.log(c(10) + 100); // 120
console.log(d(10) + 100); // 120
```

#### 代码组合

在学习高阶函数的时候，曾探讨过一个实践中的案例。每一个页面都会判断用户的登录状态，因此我们封装了一个 `withLogin` 的高阶函数来处理这个统一的逻辑。而每一个页面的渲染函数，则作为基础函数，通过下面的方式得到高阶函数 `withLogin` 赋予的新能力。这个新能力就是 直接从参数中得到用户的登录状态。

```js
window.renderIndex = withLogin(renderIndex);
```

但是如果这个时候，又新增一个需求，即不仅需要判断用户的登录状态，还需要判断用户打开当前页面所处的具体环境: 是在某一个 App 中打开，还是在移动端打开，或者是在 PC 端的某一个浏览器中打开。因为在不同的打开环境需要做不同的处理。

根据高阶函数的用法，还需要封装一个新的高阶函数 `withEnvironment` 来处理这个统一的环境判断逻辑。

```js
(function() {
  var env = {
    isMobile: false,
    isAndroid: false,
    isIOS: false
  };
  var ua = navigator.userAgent;
  env.isMobile = 'ontouchstart' in document;
  env.isAndroid = !!ua.match(/android/);
  env.isIOS = !!ua.match(/iphone/);

  var withEnviroment = function(basicFn) {
    return basicFn.bind(null, env);
  };

  window.withEnviroment = withEnviroment;
})();
```

正常情况下，在使用这个高阶函数时，一般会这样做

```js
window.renderIndex = withEnvironment(renderIndex);
```

但现在的问题是，我们这里已经有两个高阶函数想要给基础函数 `renderIndex` 传递新能力了。因为在高阶函数的实现中使用了 `bind` 方法，因此 `withEnvironment(renderIndex)`与 `renderIndex` 其实是拥有共同的函数体的，所以当遇到多个高阶函数时，也可以这样来使用。

```js
window.renderIndex = withLogin(withEnvironment(renderIndex));
```

但是这又出现了多层嵌套的使用问题，为了避免这个问题 ，我们可以使用代码组合的方式来解决。

我们期望有一个组合方法 `compose`，可以这样来使用。 参数从右至左，将第一个参数 `ren­derIndex` 作为第二个参数 `withEnvironment` 的参数，并将运行结果作为第三个参数 `withLogin` 的参数，依次递推，最终返回一个新的函数。这个新函数，是在基础函数 `renderIndex` 之上，得到了所有高阶函数的新能力。

```js
window.renderIndex = compose(
  withLogin,
  withEnvironment,
  renderIndex
);
```

如何实现这样一个 `compose` 函数呢?

```js
// ...args 为 ES6语法中的不定参数，args 表示一个由所有参数组成的数组，
// 最新的 Chrome 浏览器已经支持该语法
function compose(...args) {
  var arity = args.length - 1;
  var tag = false;
  if (typeof args[arity] === 'function') {
    tag = true;
  }

  if (arity > 1) {
    var param = args.pop(args[arity]);
    arity--;
    var newParam = args[arity].call(args[arity], param);
    args.pop(args[arity]);

    // newParam 走上一个参数的运行结果，我们可以 打印出来查看它的值
    args.push(newParam);
    console.log(newParam);

    return compose(...args);
  } else if (arity == 1) {
    // 将操作目标放在最后一个参数，目标可能是一个函数，
    // 也可能是一个值，因此可针对不同的情况做不同的处理
    if (!tag) {
      return args[0].bind(null, args[1]);
    } else {
      return args[0].call(null, args[1]);
    }
  }
}
```

下面就来验证一下封装的这个 `compose` 函数是否可靠。

```js
var fn1 = function(a) { return a + 100 };var fn2 = function(a) { return a + 10 };var fn3 = function(a) { return a + 20 };

var bar = compose(fn1, fn2, fn3, 10); console.log(bar());
// 30
// 40
// 140

var base = function() {
  return arguments[0] + arguments[1];
}
var foo1 = function(fn) {
  return fn.bind(null, 20);
}
var foo2 = function(fn) {
  return fn.bind(null, 30);
}

var res = compose(foo1, foo2, base);
console.log(res());
// f(){}
// 50
```

通过这两个验证的例子，可以确定封装的这个组合函数还是比较可靠的，因此可以直接放心使用。

当然，组合函数还可以借助柯里化封装变得更加灵活。

```js
window.renderIndex = compose(withLogin, withEnvironment, renderIndex);
// 还可以这样
window.renderIndex = compose(withLogin, withEnvironment)(renderIndex);
```

这里不再继续深入探讨具体的封装方法，我们可以在使用时借助工具库 `lodash.js` 中的 `flowRight` 来实现这种灵活的效果。

```js
// ES6 模块化语法，引入flowRight函数 
import flowRight from 'lodash/flowRight';
// ES6模块化语法，对外暴露接口
export default flowRight(withLogin, withEnvironment)(renderIndex);
```