# JavaScript高程笔记-（7-10章）

# 第 7 章 - 函数表达式

**学习目标**

- 函数表达式的特征
- 使用函数实现递归
- 使用闭包定义私有变量

**定义函数的方式**

- **函数声明（存在函数声明提升，所以可以在函数声明之前调用函数）**

```js
function fn() {
  return 'liusixin';
}
```

- **函数表达式（声明必须在调用之前）**

```js
let fn = () => {};
```

部分浏览器实现了一个非标准的属性 `name`，表示函数名字

**不要用下面的方式去定义一个函数**

不同的浏览器对此解析不同，有的两个都声明了，有的只声明了 a 函数

```js
if (true) {
  function a() {
    return 'a';
  }
} else {
  function b() {
    return 'b';
  }
}
```

**如果想根据不同的条件声明函数可以用函数表达式**

```js
var fn = null;

if (true) {
  fn = function() {
    return 'a';
  };
} else {
  fn = function() {
    return 'b';
  };
}
```

## 7.1 递归

> 递归函数是一个函数通过名字调用自身的情况下构成的。

```js
function recursion(num) {
  if (num === 1) {
    return 1;
  } else {
    return num * recursion(num - 1);
  }
}
```

以上定义了一个递归求阶乘的函数，如果我们用下面这种使用方式会怎么样呢？

```js
var fn = recursion;
recursion = null;

fn(2); // 这个时候就报错了，因为recursion函数内部，调用了recursion本身，但是recurtion已经被赋值为了null。
```

**使用 arguments.callee**

他是一个当前正在执行的函数的引用

```js
function recursion(num) {
  if (num === 1) {
    return 1;
  } else {
    return num * arguments.callee(num - 1);
  }
}

var fn = recursion;

recursion = null;

fn(3); // 6
```

> 严格模式下不允许这样用

**还有别的方式**

```js
var recursion = function f(num) {
  if (num === 1) {
    return 1;
  } else {
    return num * f(num - 1);
  }
};

var fn = recursion;
recursion = null;
fn(3); // 2
```

函数表达式依旧可以给函数取名字

## 7.2 闭包

> 一个能够访问另一个函数作用域中变量的函数。

```js
var property = function(key) {
  return function(obj) {
    return obj[key];
  };
};

var length = property('length');
```

以上就是一个经典的闭包，需要注意的是闭包会产生比普通函数更多的内存，所以需要慎用。

### 7.2.1 闭包与变量

> 闭包只能取得包含函数中任何变量的最后一个值

```js
var fn = function() {
  var arrFn = [];
  var i = 0;

  for (; i < 10; i++) {
    arrFn[i] = function() {
      return i;
    };
  }

  return arrFn;
};

var fns = fn();
```

我们以为创建出来的函数数组 fns 会输出 0， 1， 2....，但是实际上只会得到 10，因为闭包只能拿到包含函数中所有变量的最后值。

i 在循环结束的时候已经变成了 10，故所有的函数执行都只能得到 10

如果想得到对应的输出，我们可以用其他的闭包方式,例如

```js
var fn = function() {
  var arrFn = [];
  var i = 0;

  for (; i < 10; i++) {
    arrFn[i] = (function(num) {
      return function() {
        return num;
      };
    })(i);
  }

  return arrFn;
};

var fns = fn();
```

**这个时候每个立即执行函数的都有自己的执行环境，而 fns 数组中函数的所形成的闭包自然也可以得到自己的唯一的 num 值了**

### 7.2.2 关于 this 对象

> 关于闭包能够访问另一个函数的变量，有两个比较特殊 this, arguments

```js
var name = 'the window';
var obj = {
  name: 'the obj',
  showName: function() {
    return function() {
      return this.name; // 注意这里
    };
  }
};

obj.showName()(); // the window
```

这里打印的是 `'the window'`，记住 this 和 arguments 两个值比较特殊就可以，如果没有手动将另一个函数的 this 和 arguments 赋值，其得到的还是动态运行的结果，我们看下面的例子就可以明白

```js
var name = 'the window';
var obj = {
  name: 'the obj',
  showName: function() {
    var thatArguments = arguments;
    var that = this;
    return function() {
      console.log(thatArguments);
      console.log(that.name);
      console.log(this.name);
    };
  }
};

obj.showName()();
```

![WX20180716-190424-2x.png](http://pbzt3k27s.bkt.clouddn.com/WX20180716-190424-2x.png)

### 7.2.3 内存泄漏

> javascript 中常见的有两种垃圾回收机制，其中引用计数就是造成内存泄漏的罪魁祸首。

- **标记清除**
- **引用计数**

通过以下例子简单的回顾一下两种垃圾回收机制

```js
function problem() {
  var a = {};
  var b = {};

  a.otherObj = b;
  b.otherObj = a;
}
```

**标记清除**

> 当变量进入环境（比如在函数中声明一个变量）的时候就讲这个变量标记为进入环境，当变量离开环境的时候，则将其标记为离开环境

上面那个例子中，当函数结束的时候，两个对象都离开了作用域，因此这种相互引用不是个问题

**引用计数**

- 首先引用清除的含义是记录每个值被引用的次数
- 当声明了一个变量并将一个引用类型的值赋值给该变量时这个值的引用次数就是 1
- 如果同一个值又被赋给了另外一个变量则该值的引用次数加 1
- 相反如果包含这个值引用的变量又取得了另外一个值,则这个值的引用次数减 1
- 当这个值的引用次数为 0 的时候，则释放其所占空间

上面那个例子中，a 和 b 通过各自的属性相互引用，从而造成两个空对象的引用计数都为 2.当函数结束之后，a 和 b 将继续存在，因为两个空对象的引用次数不可能为 0，当这种情况出现的多了，将有大量的空间被占用得不到释放。

**接下里看一下闭包的使用中可能因为引用计数机制造成内存泄漏问题**

```js
function assignHandler() {
  var ele = document.getElementById('id');
  ele.onclick = function() {
    console.log(ele.id);
  };
}
```

这个函数创建了一个作为 ele 元素事件处理程序的闭包，这个闭包中又创建了一个循环引用，只要事件处理程序(匿名函数)一直存在，则 ele 的引用计数至少为 1 因此 ele 所占用的内存空间永远得不到释放，可以通过以下的例子解决该问题

```js
function assignHandler() {
  var ele = document.getElementById('id');
  var id = ele.id;

  ele.onclick = function() {
    console.log(id); // 消除循环引用
  };

  ele = null; // 减少引用次数
}
```

## 7.3 模仿块级作用域

> js 中没有块级作用域的概念，只有函数和全局作用域，那么这意味着，在块语句中定义的变量实际上是在包含函数中而非语句中创建的。举个例子

**注意： js 中使用 var 如果对同一个变量进行声明，其实会对后续的声明视而不见，但是会执行后续声明中的初始工作**

```js
function outputNum(num) {
  for (var i = 0; i < num; i++) {
    console.log(i);
  }
  console.log(i); // 在java、c++类的语言中，这里是会报错的，因为i只在上面的for循环中起效
}
```

所以说变量的声明是在包含函数中，也就是上面的 outputNum 函数体中，而不是在语句中,比如上面的 for 循环中，那么如果用函数表达式来模拟块级作用域呢？很简单，用一个立即执行函数包裹起来就可以

```js
function outputNum(num) {
  (function() {
    for (var i = 0; i < num; i++) {
      console.log(i);
    }
  })();

  console.log(i); // Uncaught ReferenceError: i is not defined
}
```

为什么`(function () {})()`可以模仿块级作用域呢？

> 匿名函数中定义的任何变量都会在其执行结束时销毁，这也是为什么 i 只能在循环中使用的原因。

> 这种技术也经常被用在限制向全局作用域中添加过多的变量和函数，从而避免全局污染

## 7.4 私有变量

> js 中没有私有成员的概念，所有对象的属性都是公有的，不过倒是有一个私有变量的概念，任何在函数中定义的变量都是私有变量。私有变量包括函数的参数、局部变量、函数内部定义的其它函数。

```js
function add(num1, num2) {
  var sum = num1 + num2;
  return sum;
}
```

函数的外部没有任何方法能够访问 add 函数的内部私有变量 sum1、sum2 和 sum。利用闭包的性质，我们可以创建能够访问私有变量的公有方法(也叫做**特权方法**)。

**有两种在对象上创建特权方法的方法。**

- **在构造函数中定义特权方法。**

```js
function MyObject() {
  // 私有私有变量和函数
  var privateVariable = 10;

  function privateFunction() {
    return false;
  }

  this.publicMethod = function() {
    privateVariable++;
    return privateFunction();
  };
}
```

**利用私有和特权成员可以隐藏那些不应该被直接修改的数据。**

使用构造函数模式来创建特权方法的缺点是必须要用构造函数模式来达到这个目的，而且每个实例都会创建相同的一组方法，而使用静态私有变量来实现特权方法可以避免这个问题。

### 7.4.1 静态私有变量

### 7.4.2 模块模式

### 7.4.3 增强的模块模式

# 第 8 章 - BOM

**学习目标**

- 理解 window 对象--BOM 的核心
- 控制窗口、框架和弹出窗口
- 利用 location 对象的页面信息
- 使用 navigator 对象了解浏览器

## 8.1 window 对象

> BOM 的核心对象是 window，它表示浏览器的一个实例，在浏览器中，window 对象有双重角色，它既是通过 JavaScript 访问浏览器窗口的一个接口，也是 ECMAScript 规范的 Global 对象，这意味着在网页中定义任何一个对象，变量或者函数，都以 window 作为 Global 对象，因此有权访问 parseInt 等方法

### 8.1.1 全局作用域

> 所有在全局作用域中声明的变量、函数都会变成 window 对象的属性和方法。

```js
var age = 29;

function sayAge() {
  alert(this.age);
}

alert(window.age);
sayAge();
window.sayAge();
```

age 和 sayAge 都被自动归在了 window 对象名下，所以可以通过 window.age 和 window.sayAge 访问

**非常重要**

定义全局变量与在 window 对象上直接定义属性的差别是：全局变量不能通过 delete 操作符删除，而直接在 window 对象上的定义的属性可以。

# 第 9 章 - 客户端检测

**学习目标**

- 使用能力检测
- 用户代理检测的历史
- 选择检测的方式

**前言**

> 各大浏览器在实现公共接口方面投入了很多精力，但是结果仍然是每一种浏览器都有各自存在不一致性的问题，面对普遍不一致的问题，开发人员要么采取迁就各方的“最小公分母”策略，要么就得利用各种客户端的检测方法，来突破或者规避种种局限。

## 9.1 能力检测

> 最常用也是最为人们广泛接受的客户端检测形式是能力检测，能力检测的目标不是识别特定的浏览器，而是识别浏览器的能力，采用这种形式不必顾忌特定的浏览器是如何如何，只要确定浏览器支持的特定的能力，就可以给出解决方案，举个例子。

在 IE5 之前的版本不支持 document.getElementById()这个 DOM 方法，尽管可以使用非标准的 document.all 属性实现相同的功能，但是 IE 早期的版本中，确实不存在前面那个方法，于是就有了下面的能力检测代码。

```js
function getElement(id) {
  if (document.getElementById) {
    return document.getElementById(id);
  } else if (document.all) {
    return document.all[id];
  } else {
    throw new Error('No way to retrieve element!');
  }
}
```

这里的 getElement 函数的用途是返回具有给定 ID 的元素，因为 document.getElementById 是实现这一目的的标准，所以一开始就检测了这个方法，如果该函数不存在就继续监测 document.all 是否存在，如果是就使用，如果两个特性都不满足，则创建一个错误并抛出。表示这个函数没有办法使用

**主要要理解能力检测，首先必须要理解两个重要的概念。**

- 先检测达成目的的最常用的特性，可以保证代码最优化。因为在多数情况下，都可以避免测试多个条件。
- 必须检测实际要用到的特性，一个特性存在并不意味着另外一个特性也存在。

```js
function getWindowWith() {
  if (document.all) {
    return document.documentElement.clientWidth; // 错误的使用例子
  } else {
    return window.innerWidth;
  }
}
```

上面是一个错误使用能力检测的例子，检测`document.all`是否存在，并不意味着`document.documentElement.clientWith`也存在。

### 9.1.1 更可靠的能力检测

> 能力检测对于想知道某个特性是否会按照适当的方式行事（而不仅仅是某个特性存在）非常有用。

```js
function isSortable(object) {
  return !!object.sort;
}
```

这个函数通过检测对象是否存在 sort 方法，来确定是否支持排序，问题是包含 sort 属性的对象也会返回 true

```js
let result = isSortable({ sort: true }); // true
```

检测某个属性是否存在并不能确定对象是够支持排序，更好的方式是检测 sort 是不是一个函数。

```js
function isSortable(object) {
  return typeof object.sort === 'function';
}
```

在可能的情况下，要尽量用 typeof 进行能力检测，特别是，宿主对象没有义务让 typeof 返回合理的值，最令人发指的是事就发生在 ie 中，大多数浏览器在检测到`document.createElement()`存在时多会返回 true

```js
function hasCreateElement() {
  return typeof document.createElement === 'function';
}
```

但是在 ie8 及其之前的版本中，这个函数返回 false，因为`typeof document.createElement`返回的是 object 而不是 function,本质原因是 DOM 对象是宿主对象，IE 及其更早的版本中的宿主对象是 COM 对象，所以 typeof 才会返回 object，IE9 纠正了这个问题，对所有的 DOM 方法都返回 function.

再举个例子了解一下 typeof 的的行为不准确性。

**ActiveX** 对象（只有 IE 支持）与其他对象的行为差异很大。

```js
let xhr = new ActiveXObject('Microsoft.XMLHttp');

if (xhr.open) {
  // xxx
}
```

直接把函数当做属性访问会导致 js 错误，所以使用 typeof 操作符会更加安全一些。但是有一个问题是`typeof xhr.open`会返回 unknow

### 9.1.2 能力检测，不是浏览器检测

> 检测某个或者某几个特性并不能确定浏览器，下面的代码就是错误地依赖能力检测的典型示例。

```js
let isFirefox = !!(navigator.vendor && navigator.vendorSub);

let isIE = !!(document.all && document.uniqueID);
```

这两行代码代表了对能力检测的典型勿用，以前确实可以通过检测 navigatorv.vendor 和 navigator.vendorSub 来确定 firefox 浏览器，但是别的浏览器也会实现相同的功能，所以检测自然会出现问题。

## 9.2 怪癖检测

> 与能力检测类似，怪癖检测的目标是识别浏览器的特殊行为，但与能力检测确认浏览器支持什么能力不同，怪癖检测是想要知道浏览器存在什么缺陷，这通常需要运行一段代码，以确定某一特性不能正常工作。

- IE8 之前有一个 bug，即如果某个实例属性与标记为`[[DontEnum]]` 的某个原型属性同名，name 该实例属性将不会出现在 for in 循环当中。使用以下代码来检测。

```js
let hasDontEnumQuick = (() => {
  let o = { toString() {} };

  for (let prop in o) {
    if (prop === 'toString') {
      return false;
    }
  }

  return true;
})();
```

- Safari3 以前的浏览器版本会枚举被隐藏的属性，可以用下面的代码检测该怪癖

```js
let hasEnumShadowQuick = (() => {
  let o = { toString() {} };
  let count = 0;

  for (let prop in o) {
    if (prop === 'toString') {
      count++;
    }
  }

  return count > 1;
})();
```

如果浏览器存在这个 bug，那么 for in 循环枚举带有自定义的 toString 方法的对象，就会返回两个 toString 的实例。

> 一般来说“怪癖”检测是个别浏览器所独有的，而且通常被归为 bug，建议仅检测那些对你有直接影响的怪癖，而且最好是在脚本一开始就执行此类检测，以便尽早解决问题

## 9.3 用户代理

> 第三种方式，也是争议最大的一种客户端检测方式叫做用户代理检测。用户代理检测通过检测用户代理字符串来确定实际使用的浏览器。 因为存在浏览器通过再自己的用户代理字符串中添加一些错误或者误导的信息来达到欺骗的目的。其优先级排在能力检测和怪癖检测之后。

# 第 10 章 - DOM

> DOM（文档对象模型），是针对 HTML 和 XML 文档的一个 API，DOM 描述了一个层次化的节点树，允许开发人员`添加`，`移除`,`修改`页面的某一部分。

**学习目标**

- 理解包含不同层次节点的 DOM
- 使用不同的节点类型(一般是元素节点，文本节点，文档碎片，文档节点等)
- 克服浏览器的兼容性问题及各种陷阱

**节点的类型**

接下来会简要的总结常见的几种节点类型以及其相关的知识点

### Node 类型

> DOM1 定义了一个 Node 借口，所有的元素都有`nodeType`属性，`nodeType`可取得值有 12 中，常见和经常用的有以下几种

- 1 (元素节点)
- 3 (文本节点)
- 9 (文档节点)
- 11 (文档碎片 DocumentFragment)

### childNodes

> 每个节点都有`childNodes`属性，其保存着一种类数组对象，用于保存一组有序的节点，可以用下标方式去访问，也可以用`item`方法去访问,当然也要注意，`childNodes`属性有浏览器的兼容问题，ie 下只包含其子节点中为元素节点的子元素，其他浏览器则还包括元素节点

```js
var eles = someNode.childNodes
var len = eles.length
var firstChild = ele[0] or eles.item(0)
var lastChild = eles[len - 1] or eles.item(len - 1)
```

### 节点之间的关系

> 节点之间的关系是多样的，两个节点之间可以父子节点，祖孙节点，兄弟节点等等

- previousSibling
- nextSibling
- firstChild
- lastChild

当一个列表中只存在一个节点，那么`previousSibling`和`nextSibling`都为 null

`firstChild`和`lastChild`也分别指向第一个和最后一个子节点

### 操作节点

> 我们可以用`appendChild`、`insertBefore`、`replaceChild`来进行常见的节点之间的操作

- `appendChild()`
  - `parentNode.appendChild(childNode)`
  - 将 childNode 节点添加到 parentNode 节点末尾
  - 如果 childNode 节点已经在文档中存在，则从原来的位置移动到 parentNode 的末尾。
- `insertBefore()`
  - `parentNode.insertBefore(要插入的节点, 作为参照的节点)`
  - 如果作为参照的节点不为 null，则要插入的节点最终会插入到作为参照的节点前面。
  - 如果作为参照的节点为 null，则其作用与 appendChild 类似
  - 该方法执行之后返回要插入的节点
- `replaceChild()`
  - `parentNode.replaceChild(要插入的节点, 要替换的节点)`
  - 要插入的节点如果是原来已经存在，则从原来的位置移动到要替换的节点位置前面
- `removeChild()`
  - `parentNode.removeChild(childNode)`
