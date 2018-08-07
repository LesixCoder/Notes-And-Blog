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

  for(var i = O; i < array.length; i++) {
    var tmp = array[i].split('=');
    if (tmp[O] === param) {
      return decodeURIComponent(tmp[1]);
    }
  }

  return null;
}

var url = 'https://www.baidu.com/s?tn=baidu&wd=javascript&rsv_sug=1';
getParams(url,'wd'); // javascript
```

虽然 `getParams` 并非完全健壮，但是已经足以体现纯函数可移植的特点。我们可以在任何需要从 URL 中取得参数对应值的地方调用该方法。

**纯函数的可缓存性**