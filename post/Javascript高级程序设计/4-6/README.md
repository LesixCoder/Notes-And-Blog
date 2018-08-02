# JavaScript高程笔记-（4-6章）

红宝书读过之后很多知识点都忘了，写此博文来重新复习下之前比较模糊的知识点。

# 第 4 章 - 变量、作用域和内存问题

**学习目标**

- 理解基本类型和引用类型的值
- 理解执行环境
- 理解垃圾收集

JavaScript 松散类型的本质，决定了它只是在特定时间用于保存特定的值的一个名字而已。由于不存在定义某个变量必须保存何种数据类型值的规则，变量的值，及其数据类型可以在脚本的声明周期内改变。

## 4.1 基本类型和引用类型的值

**js 中包括两种不同数据类型的值**

- 基本类型值 (undefined null string number boolean)
- 引用类型值 (对象)

### 4.1.1 动态属性

这节说了一个问题，只能给引用类型的值动态地添加属性，不能给基本类型的值添加。

### 4.1.2 复制变量值

两种数据类型，除了保存方式不一样之外，在从一个变量向另一个变量复制基本类型值和引用类型值时，也存在不同。

> 1.如果从一个变量向另一个变量复制基本类型的值，会在变量对象上创建一个新值，然后把该值复制到为新变量分配的位置上。

```js
var num1 = 5;
var num2 = num1;
```

![](http://pbzt3k27s.bkt.clouddn.com/687474703a2f2f6f647373676e6e70662e626b742e636c6f7564646e2e636f6d2f2545352539462542412545362539432541432545372542312542422545352539452538422545352541342538442545352538382542362e706e67.png)

> 当用一个变量向另一个变量复制引用类型的值的时候，同样也会将存储在变量对象中的值复制一份放到新变量分配的空间中，不同的是，这个值的副本实际上是一个指针，而这个指针指向存储在堆中的一个对象，复制操作结束之后，两个变量实际上将引用同一个对象。所以只要改变其中一个变量就会影响到另一个变量。

```js
var obj1 = new object();
var obj2 = obj1;
obj1.name = 'liusixin';
alert(obj.name); // liusixin
```

基本原理看下图

![](http://pbzt3k27s.bkt.clouddn.com/687474703a2f2f6f647373676e6e70662e626b742e636c6f7564646e2e636f6d2f2545352542432539352545372539342541382545372542312542422545352539452538422545352541342538442545352538382542362e706e67.png)

### 4.1.3 传递参数

> ECMAScript 中所有函数的参数都是按值传递的，也就是说，把函数外部的值复制给函数内部的参数，就和把值从一个变量复制到另一个变量一样。

理解上面这句话，大概就可以理解 js 中的传参机制了，还有可以可以把函数的参数想象成局部变量。

### 4.1.4 检测类型

> 要检测一个变量是不是基本数据类型的？typeof 是得力的工具，更具体一些旧事 typeof 可以确定一个变量是 string、number、boolean、还是 undefined，但是 null 会返回 object。

## 4.2 执行环境及作用域

### 4.2.1 延长作用域

- try catch
- with

**没有块级作用域**

> 在类似 C 语言中，由花括号封闭的代码块都有自己的作用域，因而支持根据条件来定义变量。

```js
if (true) {
  var color = 'blue';
}

alert(color); // blue
```

如果在类似 c 语言中，if 执行之后变量 color 会被销毁，但是在 js 中会被添加到当前的执行环境中。

**声明函数**

> 使用 var 声明的变量会自动添加到最接近的环境中，在函数内部，最接近的环境就是函数局部环境，在 with 语句中，最接近的环境是函数环境，如果初始化的时候没有制定 var 声明，该变量就会被添加到全局环境中。

**查询标志符**

> 说白了就是 js 在查找变量的过程是逐级向上的。

```js
var color = 'blue';

function getColor() {
  return color;
}

alert(getColor()); // blue
```

![](http://pbzt3k27s.bkt.clouddn.com/687474703a2f2f6f647373676e6e70662e626b742e636c6f7564646e2e636f6d2f2545362539462541352545382541462541322545362541302538372545352542462539372545372541432541362e706e67.png)

## 4.3 垃圾收集

> JavaScript 有自动的垃圾回收机制，执行环境会自动管理代码执行过程中使用的内容。

**找出那些不再继续使用的变量，然后释放其占用的内存。**
为此，垃圾收集器会按照固定的时间间隔周期性地执行这一操作

垃圾回收机制一般有两种，`标记清除` `引用计数`

### 4.3.1 标记清除

基本原理

> 当变量进入环境(例如： 声明一个变量)，就将这个变量标记为"进入环境"，当变量离开环境时将其标志为"离开环境"

### 4.3.2 引用计数

基本原理

> 引用计数的含义是跟踪记录每个值被引用的次数。

1.  当声明了一个变量并将一个引用类型的值赋给该变量时，则这个值的引用次数就是 1，如果同一个值又被赋给另一个变量，则该引用次数又加一.
2.  相反如果包含这个值引用的变量又取得了另外一个值，则这个值的引用次数减一。
3.  当这个值的引用次数变成 0 的时，则说明没有办法再访问这个值了，因而就可以将其占用的内存空间回收回来。

**引用计数带来的问题**

```js
function problem() {
  var objectA = new object();
  var objectB = new object();

  objectA.somOtherObject = objectB;
  objectB.somOtherObject = objectA;
}
```

这个例子中两个对象通过各自的属性相互引用，导致这两个对象的引用次数都是 2，且永远不可能为 0。在用标记清除的策略中，函数执行完成之后，两个对象都离开的作用域，所以循环引用不是问题。

**ie 中的麻烦**

ie 中的 BOM 和 DOM 对象不是 JavaScript 对象，而是使用 c++以 COM(Component Object Model 组件对象模型)对象形成的。但是 COM 对象的垃圾收集机制是引用计数，所以即使 ie 的 JavaScript 引擎是使用标记清楚策略来实现的，但是因为存在上面的问题，依然会有循环引用带来的问题。

```js
var element = document.getElementById('some_element');
var myObject = new Object();
myObject.element = element;
element.someObject = myObject;
```

为了避免以上问题，应该手动断原声 js 对象与 DOM 元素之间的连接

```js
myObject.element = null;
element.someObject = null;
```

**性能问题**

> 主要说垃圾回收机制周期处理时间

**管理内存**

> 将不用的变量手动设置为 null，解除引用关系。

# 第 5 章 - 引用类型

**学习目标**

- 使用对象
- 创建并操作数组
- 理解基本的 JavaScript 类型
- 使用基本类型和基本包装类型

## 5.1 Object 类型

> 大多数引用类型的值都是 Object 类型的实例，而且 Object 也是 ECMAScript 中使用最多的一个类型。

**创建对象的方式**

- **使用 new 操作符后跟 Object 构造函数**

```js
var person = new Object();
person.name = 'liusixin';
person.sex = 'boy';
```

- **对象字面量表示法(定义对象的一种简写形式)**

```js
var person = {
  name: 'liusixin',
  sex: 'boy'
};
```

> 注意对象的最后一个属性后面不是说不能加逗号，是在部分浏览器例 IE7 及更早版本下会报错，所以最好不要写

**访问对象的方式**

一般有两种

- 点表示法`(obj.name)`
- 方括号表示法`(obj['name'])`

> 两种方式都可以但是如果属性名中包含会导致语法错误的字符，或者属性使用的是关键字或保留字，也可以使用方括号表示法(这个时候使用点表示法就报错了)

当然了除非必须使用方括号表示法不然建议使用点表示法

## 5.2 Array 类型

**创建数组的方式有两种**

- **使用 Array 的构造函数**

```js
var colors = new Array();
```

如果事先知道数组的长度可以传一个数字，并且该数字会变成该数组 length 属性的值。

```js
var colors = new Array(20);
```

当然也可以向数组传入应该包含的项

```js
var colors = new Array('red', 'green');
```

> 所以当你向构造函数传递一个值的时候，如果这个值是数值，那么会创建给定项数的数组。如果传递的是其他类型参数，则会创建包含那个值的只有一项的数组。

另外创建数组也可以省去 new 操作符。

- **创建数组的第二种基本方式是数组字面量表示法**

```js
var colors = ['red', 'green'];
var names = [];
var values = [1, 2]; // 不要这样，这样会创建包含2或3项的数组
var options = [, , , , ,]; // 不要这样，这样会创建包含5或6项的数组
```

> 注意不要像第二行以及第三行那样创建数组，在 ie 中 values 是包含 3 个项且值分别为 1， 2， undefined 的数组

在读取或者设置数组的值时，要使用方括号并提供索引基于 0 的数字索引.

```js
var colors = ['red', 'blue', 'green'];
alert(colors[0]);
colors[2] = 'black'; // 修改第三项
colors[3] = 'brown'; // 新增第四项
```

> 当设置的索引大于数组现有的项数的时，数组就会自动增加到该索引加一的长度(其实不然应该是索引值需小于 4294967295)

数组的 length 可读可写，通过设置 length 属性可以从数组的末尾移除项或者向数组中添加项。

```js
var colors = ['red', 'green', 'blue'];
colors.length = 2;
alert(colors[2]); // undefined
```

利用 length 属性也可以很方便的添加新项

```js
var colors = ['red', 'blue'];
colors[colors.length] = 'black';
colors[colors.length] = 'pink';
colors[100] = 'grey'; // 4 ~ 99 都是undefined
```

> **特别注意数组最多可以包含 4294967294 个项，如果添加的项数超过这个数，可能会导致错误**

### 5.2.1 检测数组

- **对于一个网页或者一个全局作用域而言，使用 instanceof 即可**

```js
if (value instanceof Array) {
  //
}
```

当然这样判断是有缺陷的，如果使用 iframe 形式嵌入网页，那么至少存在两个以上的全局执行环境，从而存在两个以上不同版本的 Array 构造函数。这样第一个框架与第二个框架分别具有不同的构造函数，(具体验证可以看 examples/第五章-引用类型/iframe 父窗口.html)

- **也可以利用 Object.prototype.toString 来判断**

```js
var isArray = function(obj) {
  return obj == null
    ? false
    : Object.prototype.toString.call(obj) === '[object Array]';
};
```

- **还可以借助 es5 中的新 apiArray.isArray()**

```js
if (Array.isArray(obj)) {
  // xxx
}
```

### 5.2.2 转换方法

以下是数组的三个转换方法

- valueOf(返回的是数组本身,即是相同的引用)
- toString(返回数组中每个值的字符串形式拼接形成的一个以逗号分隔的字符串)
- toLocaleString(与 toString 类似，不过是调用数组的每一项的 toString 方法)

```js
var person = {
  name: 'liusixin',
  toString() {
    return this.name;
  },
  toLocaleString() {
    return `${this.name}-boy`;
  }
};
var people = [person];
alert(people); // liusixin
alert(people.toString()); // liusixin
alert(people.toLocaleString()); // liusixin-boy
```

有一个疑问，如下，既然是调用数组的每一项的 toString、toLocaleString 方法拼接成的字符串,为什么下面不报错呢？内部做了兼容？**(null 没有 toString 和 toLocaleString 方法)**

```js
var arr = ['liusixin', null];
arr.toString(); // liusixin,
arr.toLocaleString(); // liusixin,
```

### 5.2.3 栈方法

> 数组提供的 push 和 pop 方法可以让其像其他数据结构一样，完成(LIFO)后进先出的表现。

- `push` - 可以接收任意的参数，把它们逐个添加到数组的末尾，并返回修改后数组的长度
- `pop` - 删除数组最后一项，并返回移除的项

```js
var colors = new Array();
var count = colors.push('red', 'green'); // 2
count = colors.push('black'); // 3
var item = colors.pop(); // 'black'
```

**当然我们也可以向这样使用 push**

```js
var arr = ['a', 'b'];
arr.push.apply(arr, ['c', 'd']);
console.log(arr); // ["a", "b", "c", "d"]
```

**甚至可以像数组一样，在对象上使用 push 方法**

```js
let push = Array.prototype.push;
let obj = {
  length: 0,
  addItem() {
    push.apply(this, arguments); // 使用apply可以支持一次性传入多个选项
  }
};

obj.addItem('hello');
obj.addItem('world');
obj.addItem({ age: 25 });
obj.addItem('liusixin', 'sex');
```

![](http://pbzt3k27s.bkt.clouddn.com/WX20180716-163424-2x.png)

### 5.2.4 队列方法

> 利用 shift 和 push 可以模仿队列(FIFO)的数据结构形态。

- `shift` - 删除数组的第一个项并返回该项

```js
var colors = new Array();
var count = colors.push('red', 'green'); // 2
var item = colors.shift(); // red
```

当然可以使用 unshift 和 pop 实现相反方向的队列结构

- `unshift` - 在数组的前端添加任意个项并返回新数组的长度

```js
var colors = new Array();
var count = colors.unshift('red', 'green'); // 2
var item = colors.pop(); // green
```

**当然我们也可以向这样使用 unshift**

```js
var arr = ['c', 'd'];
arr.unshift.apply(arr, ['a', 'b']);
console.log(arr); // ["a", "b", "c", "d"]
```

### 5.2.5 重排序方法

数组排序主要关注两个原生支持的方法

- `reverse` - 反转数组，会影响原数组,并且返回值为原数组的引用

```js
var values = [1, 2, 3, 4, 5];
var tempArr = values.reverse(); // [5, 4, 3, 2, 1]
values === tempArr; // true
```

- `sort` - sort 方法会调用每个数组项的 toString 方法，然后比较得到的字符串,即使是数字比较的也是字符串，以确定如何排序, 会改变原数组

```js
var values = [0, 1, 5, 10, 15];
values.sort(); // [0, 1, 10, 15, 5]
```

有人会对结果有疑问，我们看一张图

![](http://pbzt3k27s.bkt.clouddn.com/WX20180716-164233-2x.png)

**所以为了得到真正的排序后的结果，从小到大或者从大到小我们可以像下面这样做**

```js
var values = [1, -3, 0, 5, 10, 1, 34, 2];
// 从小到大
values.sort((a, b) => a - b);
// 从大到小
values.sort((a, b) => b - a);
```

### 5.2.6 操作方法

- `concat()` - 基于当前的数组中的所有项创建一个新的数组，具体来说就是先创建当前数组的一个副本，然后将接收到的参数添加到这个副本的末尾，最后返回新构建的数组。
  - 如果没有传参数，只是简单地对当前数组的拷贝
  - 如果传递的是一个或者多个数组，则该方法会将这些数组中的所有项都添加到该数组中
  - 如果传递的不是数组，这些值就会简单地添加到数组的末尾

```js
var colors = ['red'];
var colors2 = colors.concat('yellow', ['green']); // ["red", "yellow", "green"]
```

**concat 方法并不修改调用它的对象(this 指向的对象) 和参数中的各个数组本身的值,而是将他们的每个元素拷贝一份放在组合成的新数组中.原数组中的元素有两种被拷贝的方式:**

- 对象引用(非对象直接量):concat 方法会复制对象引用放到组合的新数组里,原数组和新数组中的对象引用都指向同一个实际的对象,所以,当实际的对象被修改时,两个数组也同时会被修改.
- 字符串和数字(是原始值,而不是包装原始值的 String 和 Number 对象): concat 方法会复制字符串和数字的值放到新数组里.

```js
var arr = [1, { name: 'liusixin' }];
var arr2 = arr.concat([{ sex: 'boy' }]);

arr2[0] = 'a'; // 没有修改arr[0]的值
arr2[1].name = 'Karl'; // 此时也修改了arr[1]的值
```

- `slice()` - 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。原始数组不会被修改
  - 如果没有传参数则表示对当前数组的一个浅拷贝
  - 如果传递了一个参数则返回从该参数指定的位置开始到当前数组末尾所有的项。
  - 如果传递了两个参数则返回起始位置到结束位置的所有的项(不包含结束位置)

> **特别提示：如果有一个值为负值，则利用数组长度加上该值来确定相应的位置,比如下面的例子得到的结果是相同的**

```js
var arr = [1, 2, 3, 4, 5];
var arr2 = arr.slice(-2, -1);
var arr3 = arr.slice(3, 4);
```

- `splice()` - 该方法可谓强大，可以实现 `删除`、`插入`、`替换` 等功能，且直接改变原数组的内容,通过以下例子来说明其用法

```js
array.splice(start)

array.splice(start, deleteCount)

array.splice(start, deleteCount, item1, item2, ...)
```

**splice 使用举例**

```js
var colors = ['red', 'green', 'blue'];
// 1. 删除第一项(删除)
var removed = colors.splice(0, 1); // removed是一个数组，包含删除的项 ["red"]
// 2. 从第一个位置开始插入两项(插入)
removed = colors.splice(1, 0, 'yellow', 'orange'); // 如果没有删除，返回的是一个空数组[]
// 3. 替换
removed = colors.splice(1, 1, 'red');
```

### 5.2.7 位置方法

es5 中添加了两个位置方法：

- indexOf
- lastIndexOf

这两个方法都接收两个参数，要查找的项和(可选的)表示查找起点位置的索引，执行后的返回值都是表示要查找的项在数组中的位置，在找到则返回-1.并且比较使用的是严格比较（即值和类型都要相等）。

**关于第二个参数特别注意下面这段话**

> 开始查找的位置。如果该索引值大于或等于数组长度，意味着不会在数组里查找，返回-1。如果参数中提供的索引值是一个负值，则将其作为数组末尾的一个抵消，即-1 表示从最后一个元素开始查找，-2 表示从倒数第二个元素开始查找 ，以此类推。 注意：如果参数中提供的索引值是一个负值，仍然从前向后查询数组。如果抵消后的索引值仍小于 0，则整个数组都将会被查询。其默认值为 0.

![](http://pbzt3k27s.bkt.clouddn.com/WX20180716-165923-2x.png)

### 5.2.8 迭代方法

es5 中添加了 5 个迭代方法，每个方法都接收两个参数，要在每一项上运行的函数和运行该函数的执行上下文(影响内部的 this 值)，而传入的函数会接收三个值(**数组的项，该项的索引，以及数组本身**)

- `every()` - 对数组中的每一个项运行给定的函数，如果该数组的每一项都返回 true，那么结果也返回 true)
- `some()` - 对数组中的每一项运行给定的函数，如果该项对任一项返回 true，就返回 true
- `forEach()` - 对数组中的每一项运行给定的函数，该函数没有返回值
- `map()` - 对数组中的每一项运行给定的函数，返回每次调用函数的结果组成的数组
- `filter()` - 对数组的每一项运行给定的函数，返回该函数返回 true 的项组成的数组

**特别注意**

> 注意： 没有办法中止或者跳出 forEach 循环，除了抛出一个异常。如果你需要这样，使用 forEach()方法是错误的，你可以用一个简单的循环作为替代。如果您正在测试一个数组里的元素是否符合某条件，且需要返回一个布尔值，那么可使用 Array.every 或 Array.some。如果可用，新方法 find() 或者 findIndex() 也可被用于真值测试的提早终止。

**使用举例**

```js
var arr = [1, 2, 3, 4, 5, 4];

// forEach
arr.forEach(
  function(v, i, array) {
    console.log(v, i, array, this);
  },
  { name: 'liusixin' }
);

// every
arr.every(v => {
  return v < 0;
});

// some
arr.some(v => {
  return v > 1;
});

// map
arr.map(v => {
  return `${v}-hello`;
});

// filter
arr.filter(v => {
  return v > 3;
});
```

![](http://pbzt3k27s.bkt.clouddn.com/WX20180716-174335-2x.png)

## 5.3 Date 类型

## 5.4 RegExp 类型

## 5.5 Function 类型

函数实际上是对象，每个函数都是 Function 的实例，而且都与其它引用类型一样具有属性和方法。由于函数是对象，所以函数名也是指向函数对象的指针，不会与某个函数绑定。

**定义函数的方式**

- **函数声明**

```js
function sum(num1, num2) {
  return num1 + num2;
}
```

- **函数表达式**

```js
var sum = function(num1, num2) {
  return num1 + num2;
};
```

- **使用 Function 构造函数(这种方式平时用到比较少)**
  - Function 构造函数可以接收任意数量的参数，但最后一个参数指的是函数体，前面的参数则是新函数的参数。

```js
var sum = new Function('num1', 'num2', 'return num1 + num2');
```

> 函数名其实仅仅是指向函数的指针，因此函数名与包含对象指针的其它变量没有什么不同，也就是说函数可能会有多个名字

### 5.5.1 没有重载(深入理解)

> 将函数想象为指针，有助于理解为什么函数没有重载的概念。

```js
var addSum = function() {
  return 1;
};
var addSum = function() {
  return 2;
};
```

### 5.5.2 函数声明与函数表达式

> 解析器在向执行环境中加载数据时，对函数声明和函数表达式并不是一视同仁，解析器会率先读取函数声明（存在函数声明提升），并使其在执行任何代码之前可用，而函数表达式，则是必须等到解析器执行到它所在的代码行，才会真正地被执行。

```js
alert(sum(10, 10)); // 20

function sum(num1, num2) {
  return num1 + num2;
}

alert(fn()); // 报错

var fn = function() {
  return 1;
};
```

# 第 6 章 - 面向对象的程序设计

**学习目标**

- 理解对象属性
- 理解并创建对象（重要）
- 理解继承(重要)

**概述**

> 面向对象(OO)的语言都有类的概念，而通过类可以创建任意多个具有相同属性和方法的对象，js 中的对象是"无序属性的集合，其属性可以包含基本值，对象或者函数"

## 6.1 理解对象

创建自定义对象的 2 种常见方式

- **创建一个 Object 的实例**

```js
var person = new Object();
person.name = 'liusixin';
person.sayName = function() {
  alert(this.name);
};
```

- **对象字面量创建**

```js
var person = {
  name: 'liusixin',
  sayName: function() {
    alert(this.name);
  }
};
```

### 6.1.1 属性类型

- 数据属性
- 访问器属性

**数据属性**

> 数据属性包含一个数据值的位置，在这个位置可以读取和写入值，数据属性有 4 个描述其行为的特性。

- `[[Configurable]]` : 表示 `1. 能否通过delete删除属性重而重新定义属性`。 `2. 能否修改属性的特性`，`3. 能否把属性修改为访问器属性`，使用 new Object 或对象字面量，默认值为 true
- `[[Enumerable]]` : 表述能否通过 for in 循环返回属性，使用 new Object 或对象字面量，默认值为 true
- `[[Writable]]` : 表述能否修改属性的值，使用 new Object 或对象字面量，默认值为 true
- `[[Value]]` : 包含这个属性的数据值，读取属性值的时候，从这个位置读，写入属性值的时候，把新值保存到这个位置。这个特性的默认值为 undefined。

**经过测试，通过 `Object.defineProperty` 定义对象的属性 Configurable、Enumerable、Writable 默认值都是 false，而 Value 没有设置则是 undefined**

> 可以多次调用 `Object.defineProperty()` 方法修改同一属性，但在把 configurable 特性设置为 false 之后就会有限制了。

**访问器属性**

> 访问器属性不包括数据值，包含一堆 getter 和 setter 函数（这两个函数不是必须的）。在读取属性的时，会调用 getter 函数，这个函数负责返回有效值，在写入访问器属性时，会调用 getter 函数并传入新值，这个函数负责决定如何处理数据。分别有以下属性

- `[[Configurable]]` : 表示 `1 能否通过delete删除属性重而重新定义属性`，`2. 能否修改属性的特性`，`3. 能否把属性修改为访问器属性`,使用 new Object 或对象字面量，默认值为 true
- `[[Enumerable]]` : 表述能否通过 for in 循环返回属性，使用 new Object 或对象字面量，默认值为 true
- `[[Get]]` : 在读取属性时调用的函数，默认值为 undefined
- `[[Set]]` : 在写入属性时调用的函数，默认值为 undefined

> 访问器属性不能直接定义，必须使用 Object.defineProperty 定义。

```js
var book = {
  _year: 2004,
  edition: 1
};

Object.defineProperty(book, 'year', {
  get: function() {
    return this._year;
  },
  set: function(newValue) {
    if (newValue > 2004) {
      this._year = newValue;
      this.edition += newValue - 2004;
    }
  }
});

book.year = 2005;
alert(book.edition);
```

**不一定 get 和 set 函数都要指定，只指定 get，意味着只能读不能写，只指定 set，意为着只能写不能读**

同样我们可以使用 `__defineGetter__` 和 `__defineSetter__` 来做一些 get、set 的事情

```js
var book = {
  _year: 2004,
  edition: 1
};

book.__defineGetter__('year', function() {
  return this._year;
});

book.__defineSetter__('year', function(newValue) {
  if (newValue > 2004) {
    this._year = newValue;
    this.edition += newValue - 2004;
  }
});
```

### 6.1.2 定义多个属性

> `Object.defineProperties()`一次描述多个属性。

```js
var book = {};
Object.defineProperties(book, {
  _year: {
    value: 2004,
    writable: true // 不指定将不可写
  },
  edition: {
    value: 1,
    writable: true
  },
  year: {
    get: function() {
      return this._year;
    },
    set: function(newValue) {
      if (newValue > 2004) {
        this._year = newValue;
        this.edition += newValue - 2004;
      }
    }
  }
});
```

## 6.2 创建对象

> 使用 Object 构造函数和对象字面量的形式来创建对象有一个明显的缺点，使用同一个接口创建很多对象，会产生很多垃圾代码。

**创建对象的各种模式**

> 创建对象的模式有很多种，比如工厂模式、构造函数模式、原型模式、混合构造函数和原型模式等等，这里做主要的代码示例和介绍。

### 6.2.1 工厂模式

> 工厂模式是软件工程领域一种广为人知的设计模式，这种模式抽象了创建具体对象的过程，用函数来封装以特定接口来创建对象的细节。

```js
function createPerson(name, sex, age) {
  let o = new Object();

  o.name = name;
  o.sex = sex;
  o.age = age;
  o.sayName = function() {
    console.log(this.name);
  };
  return o;
}

let p1 = createPerson('liusixin', 'boy', 100);
let p2 = createPerson('hahaha', 'girl', 1000);
```

`createPerson` 函数能够根据传入的参数来构建包含三个所有必要信息的 Person 对象,可以无数次的调用这个函数，而它每次都会返回包含三个属性的一个方法的对象。工厂模式虽然解决了创建多个相似对象的代码冗余问题，但是却没有解决对象识别的问题。

### 6.2.2 构造函数模式

> 构造函数可以用来创建特定类型的对象，有些类似 Array 和 Object 在运行时就自动出现在执行环境中，此外，也可以自定义构造函数。从而自定义对象类型的属性和方法。

```js
function Person(name, sex, age) {
  this.name = name;
  this.sex = sex;
  this.age = age;
  this.sayName = function() {
    console.log(this.name);
  };
}

let p1 = new Person('liusixin', 'boy', 100);
let p2 = new Person('hahaha', 'girl', 1000);
```

**跟工厂模式相比可以发现，有以下区别**

- 没有显示地创建对象
- 直接将属性和方法赋给了 this 对象
- 没有 return 语句
- 构造函数名字使用首字母大写

**创建 Person 实例大概经历了以下几步**

- 创建一个新的对象
- 将构造函数的作用域赋值给新对象（因此 this 就指向了这个新对象）
- 执行构造函数中的代码（为这个新对象添加属性）
- 返回新的对象

创建自定义的构造函数意味着可以将它的实例标记为一种特定的类型，这也是其胜过工厂模式的地方
