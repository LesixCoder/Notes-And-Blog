# JavaScript高程笔记-（13-14章）

# 第 13 章 - 事件

**学习目标**

- 理解事件流
- 使用事件处理程序
- 不同的事件类型

JavaScript 与 HTML 之间的交互通过事件实现，事件就是文档或者浏览器窗口中发生的一些特定的交互瞬间。可以使用侦听器（或处理程序）来预订事件，以便事件发生时执行相应的代码，这种在传统软件工程中称为观察员模式，支持页面的行为与页面的外观之间的松散耦合

## 13.1 事件流

> 事件流描述的从页面接收事件的顺序，IE 的事件是冒泡流，Netscape 的事件流是事件捕获流。

### 13.1.1 事件冒泡

> IE 的事件流叫做事件冒泡，也就是事件由最具体的元素（文档中嵌套最深的那个节点）接收，然后逐级向上传播到较为不具体的节点。

**举例**

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <div></div>
</body>
</html>
```

![](http://pbzt3k27s.bkt.clouddn.com/687474703a2f2f6f647373676e6e70662e626b742e636c6f7564646e2e636f6d2f515132303138303132302d3230353735374032782e706e67.png)

所有的现代浏览器都支持事件冒泡，但是具体实现上还有一些差别，IE5.5 更在版本中的事件冒泡会跳过 html 元素。IE9，chrome 和 safari 则将事件一直冒泡到 window 对象.

### 13.1.2 事件捕获

Netscape Communicator 团队提出的另一种事件流叫做事件捕获，事件捕获的思想是不太具体的节点应该更早接收到事件，事件捕获的用于在事件到达预定目标之前捕获他。

![](http://pbzt3k27s.bkt.clouddn.com/687474703a2f2f6f647373676e6e70662e626b742e636c6f7564646e2e636f6d2f515132303138303132302d3231313632344032782e706e67.png)

虽然事件捕获是 Netscape Communicator 唯一支持的事件流模型，但是 IE9、safari 等浏览器都支持这种事件模型，规范要求事件应该从`document`对象开始传播，但是这些浏览器都是从`window`开始传播。

### 13.1.3 DOM 事件流

> "DOM2 级事件" 规定的事件流包括三个阶段：事件捕获阶段、处于目标阶段和冒泡阶段。首先发生的是事件捕获，为截获事件提供了机会，然后是实际的目标接收到事件，最后一个阶段是冒泡阶段，可以在这个阶段对事件做出响应。

### 13.2 事件处理程序

> 事件就是用户或浏览器自身执行的某种动作，诸如`click`、`load`和`mouseover`，都是事件的名称，响应某个事件的函数叫做事件处理程序（或事件监听器）

**为事件指定事件处理程序的方式有很多种，如下**

- **HTML 事件处理程序**
  > 元素所支持的每种事件，都可以使用一个与事件同名的`HTML`特性来指定，该特性的值是能够执行的`JavaScript`代码，例如

```HTML
<div class="box" onclick="console.log(1)"></div>
```

当然也可以调用在页面中其他地方定义的脚本,事件处理程序中的代码在执行时，**有权访问全局作用域中的任何代码。**

```HTML
<script>
  let showMsg = () => {
    console.log('hello world')
  }
</script>

<div class="box" onclick="showMsg()"></div>
```

**可以通过 event 变量，直接访问事件对象，不用自己定义，也不用从函数的参数列表读取**

> 在这个函数中 this 等于事件的目标元素

```HTML
<script>
  let showMsg = function (val, e) {
    console.log(val)
    console.log(e)
  }
</script>
<div class="box" onclick="showMsg(this.innerHTML, event)">hello world</div>
```

**HTML 事件处理程序缺点**

- 存在"时差问题"，当用户触发相应的事件时，如果事件处理程序尚不具备执行条件，就会引发错误。（比如上面的`script`标签中放到页尾）
- 扩展事件处理程序中的作用域在不同的浏览器中会导致不同的结果。
- `HTML`与`JavaScript`代码紧密耦合，如果要更换事件处理程序，就要改动两个地方，这也是大家都转向`JavaScript`指定事件处理程序的原因所在。

### 13.2.2 DOM0 级事件处理程序

> 通过 JavaScript 指定事件处理程序的传统方式，就是将一个函数赋值给一个事件处理程序属性。这种方式有以下几个特点。

- 简单
- 跨浏览器

每个元素（包括 window 和 document）都有自己的事件处理程序，这些属性通常全部小写，例如 onclick。

```html
<button class="btn">按钮</button>
```

```js
let btn = document.querySelector('.btn');

btn.onclick = function() {
  console.log(this.className);
};
```

需要注意的是，在这些代码运行之前不会指定事件处理程序，因此这些代码在页面中位于按钮后面，就有可能在一段时间内怎么单击都没有反应。

> 使用 DOM0 级方法指定的事件处理程序被认为是元素的方法，因此这时候的事件处理程序是在元素的作用域中运行，换句话说，程序中的 this 引用当前元素。

**1. 以这种方式添加的事件处理程序会在事件流的冒泡阶段被处理**

**2. 也可以删除通过 DOM0 级方法指定的事件程序，如下**

```js
btn.onclick = null;
```

使用 DOM0 级方法指定的事件处理程序

### 13.2.3 DOM2 级事件处理程序

> "DOM2 级事件"定义了两个方法，分别用于指定和删除事件处理程序：addEventListener、removeEventListener,所有的 DOM 节点都包括这两个方法，并且接受 3 个参数，要处理的事件名，作为事件处理程序的函数和一个布尔值。如果这个布尔值为 true，表示在捕获阶段调用事件处理程序，如果是 false，表示在冒泡阶段调用事件处理程序

```js
let btn = document.querySelector('.btn');

btn.addEventListener(
  'click',
  function() {
    console.log(this.className);
  },
  false
);
```

与 DOM0 级方法一样，这里添加的事件处理程序也是在其依附的**元素的作用域**中运行,但其可以添加多个事件处理函数。并且是按照添加的顺序触发

```js
let btn = document.querySelector('.btn');

btn.addEventListener(
  'click',
  function() {
    console.log('hello world 1');
  },
  false
);

btn.addEventListener(
  'click',
  function() {
    console.log('hello world 2');
  },
  false
);

// 打印出 hello world 1, hello world 2
```

**移除事件处理程序**

> 通过 addEventListener 添加的事件处理程序只能使用 removeEventListener 来移除，移除时传入的参数和添加处理程序时使用的参数相同，这也意味着通过其添加的匿名函数将无法移除。

```js
const handleClick = () => {
  console.log('hello world 3');
};

btn.addEventListener('click', handleClick, false);
btn.removeEventListener('click', handleClick, false); // 移除的时候需要和添加的时候参数保持一致,匿名函数无法移除
```

**如果不是特别需要，不建议在捕获阶段注册事件处理程序**

### 13.2.4 IE 事件处理程序

> IE 实现了与 DOM 中类似的两个方法，attachEvent, detachEvent。接受相同的参数，事件名称和事件处理程序函数。

- `attachEvent()` - 添加事件
- `detachEvent()` - 移除事件

```js
let $btn = document.querySelector('button');
const handle = function() {
  console.log('1');
};
const handle2 = function() {
  console.log('2');
};
// 添加事件
$btn.attachEvent('onclick', handle);
$btn.attachEvent('onclick', handle2);
// 移除事件
$btn.detachEvent('onclick', handle);
```

> **通过`attachEvent添加的事件处理程序以添加时的相反顺序触发`，移除事件的时候，事件名称和事件处理函数必须与添加的时候相同，匿名函数无法移除**

### 13.2.5 跨浏览器的事件处理程序

> 恰当的使用能力检测，可以编写跨浏览器的事件处理。要保证处理事件在大多数浏览器下一致运行，只需要关注冒泡阶段。

我们要创建的一个方法是`addHandler()`,它的职责是分别使用 DOM0 级方法，DOM2 级方法或 IE 方法来添加事件。

**addHandler**

```js
const addHandler = (element, type, handler) => {
  if (element.addEventListener) {
    element.addEventListener(type, handler, false);
  } else if (element.attachEvent) {
    element.attachEvent(`on${type}`, handler);
  } else {
    element[`on${type}`] = handler;
  }
};
```

**removeHandler**

```js
const removeHandler = (element, type, handler) => {
  if (element.removeEventListener) {
    element.removeEventListener(type, handler, false);
  } else if (element.detachEvent) {
    element.detachEvent(`on${type}`, handler);
  } else {
    element[`on${type}`] = null;
  }
};
```

**实例**

```js
const $btn = document.querySelector('.btn');
const logClassName = function() {
  console.log(this.className);
};

addHandler($btn, 'click', logClassName);
addHandler($btn, 'click', function() {
  console.log('hello world');
});

removeHandler($btn, 'click', logClassName);
```

## 13.3 事件对象

> 在触发 DOM 上的某个事件时，会产生一个事件对象 event，这个对象中包含着所有与事件有关的信息。 例如包含包括事件的元素，事件的类型以及其他特定事件相关的信息。例如鼠标操作导致得事件对象中，会包含鼠标的位置信息，而键盘操作的事件对象中，会包含与按下的键有关的信息，所有的浏览器都支持 event 对象，但支持的方式不同

### 13.3.1 DOM 中的事件对象

> 兼容 DOM 的浏览器会将一个 event 对象传入到事件处理程序中，无论指定事件处理程序使用什么方式（DOM0 和 DOM2 级），都会传入 event 对象，如下例子

```js
let $btn = document.querySelector('.box');

const logEventType = event => {
  console.log(event.type);
};

$btn.onclick = logEventType;
$btn.addEventListener('click', logEventType, false);
```

另外以下面这种方式提供 event 对象，可以让 HTML 特性事件处理程序函数执行相同的操作。

```html
<div class="box" onclick="console.log(this.innerHTML, event)">hello world</div>
```

**event 对象包含创建它的特定的事件相关的属性和方法，触发的事件类型不一样，可用的属性和方法也不一样。不过所有的事件都会有下表列出的成员**

|         属性/方法          |     类型     | 读/写 |                                          说明                                           |
| :------------------------: | :----------: | :---: | :-------------------------------------------------------------------------------------: |
|          bubbles           |   Boolean    | 只读  |                                    表明事件是否冒泡                                     |
|         cancelable         |   Boolean    | 只读  |                             表明是否可以取消事件的默认行为                              |
|       currentTarget        |   Element    | 只读  |                        其事件处理程序当前正在处理事件的那个元素                         |
|      defaultPrevented      |   Boolean    | 只读  |                         为 true 表示已经调用了 preventDefault()                         |
|           detail           |   Integer    | 只读  |                                  与事件相关的细节信息                                   |
|         eventPhase         |   Integer    | 只读  |        调用事件处理程序的截断：1 表示捕获阶段，2 表示“处于目标”，3 表示冒泡阶段         |
|      preventDefault()      |   Function   | 只读  |           取消事件的默认行为，如果是 cancelable 是 true，则可以使用这个方法。           |
| stopImmediatePropagation() |   Function   | 只读  |             取消事件的进一步捕获或者冒泡，同事阻止任何事件处理程序被调用。              |
|     stopPropagation()      |   Function   | 只读  |          取消事件的进一步捕获或者冒泡，如果 bubbles 为 true 则可以使用这个方法          |
|           target           |   Element    | 只读  |                                       事件的目标                                        |
|          trusted           |   Boolean    | 只读  | 为 true 表示事件是由浏览器生成的，为 false 则表示事件是由开发人员通过 JavaScript 创建的 |
|            type            |    String    | 只读  |                                    被触发的事件类型                                     |
|            view            | AbstractView | 只读  |                   与事件关联的抽象视图，等同于发生事件的 window 对象                    |

### 13.3.2 IE 中的事件对象

> 与访问 DOM 中的 event 对象不同，要访问 IE 中的 event 对象有几种不同的方式，取决于指定事件处理程序的方法。在使用 DOM0 级方法添加事件处理程序时，event 对象作为 window 对象的一个属性存在。

```js
let $btn = document.querySelector('button');

$btn.onclick = () => {
  let event = window.event;
  console.log(event.type);
};
```

### 13.3.3 跨浏览器的事件对象

## 13.4 事件类型

> web 浏览器中可能发生的事件有很多类型。如前所述，不同的事件类型具有不同的信 ，而 DOM3 级事件，规定了以下几类事件

### 13.4.1 UI 事件

### 13.4.2 焦点事件

### 13.4.3 鼠标与滚轮事件

# 第 14 章 - 表单脚本

**学习目标：**

- 理解表单
- 文本框验证和交互
- 使用其他表单控制

## 14.1 表单基础知识

> 在 HTML 中，表单是由元素来表示的，而在 JavaScript 中，表单对应的元素类型是`HTMLFormElement`类型，`HTMLFormElement`继承了`HTMLElement`，所以除了与其他 html 元素具有的相同属性之外还拥有以下属性。

- `acceptCharset`: 服务器能够处理的字符集，等价于 HTML 中的 accept-charset。
- `action`: 接受请求的 URL，等价于 html 中的 action 特性
- `enctype`： 请求的编码类型，等价于 html 中的 enctype
- `length`：表单中控件的数量
- `method`： 要发送的 http 请求的类型，通常是 get 或者 post，等价于 html 中的 method 特性
- `name`：表单的名称，等价于 html 中的 name 属性
- `reset()`: 将表单域重置为默认值
- `submit()`: 提交表单
- `target`: 用于发送请求和接收响应的窗口的名称，等价于 html 中的 target 属性。

**获取表单引用的一些方式**

1.  通过`getElementById`方法找到
2.  通过`document.forms`可以获取到页面中所有的表单，并通过索引或者 name 取得特定的表单。

```js
let forms = document.forms;
let firstForm = forms[0];
let myForm = form['form2'];
```

### 14.1.1 提交表单

> 用户点击提交按钮或者图像按钮就会提交表单。使用或者都可以定义提交按钮，只要将其 type 类型的值设置为‘submit’即可。图像按钮则是将的 type 设置为‘image’。

**只要表单中存在上面列出的任何一种按钮，那么在相应的表单控件拥有焦点的情况下，按下回车键就可以提交表单(需要注意的是 textarea 是个例外，会换行)，相反没有以上的提交按钮，则不会提交表单**

**以上三种按钮提交表单的时候，浏览器在将请求发送给服务器前触发 submit 事件，这样我们就有机会可以验证表单数据，并决定是不是允许表单提交**

```html
<form action="https://github.com/">
  <input type="text" value="用户名" name="username">
  <input type="password" value="pwd" name="password">
  <input type="submit" value="提交表单">
</form>
```

```js
let $form = document.forms[0];
let fields = [].slice.call($form.elements);
let checkForm = () => {
  return fields
    .filter(ele => {
      return ['text', 'password'].includes(ele.type);
    })
    .every(ele => {
      return ele.value.length > 6;
    });
};

$form.addEventListener(
  'submit',
  function(event) {
    if (checkForm()) {
      // xxx 通过表单验证
    } else {
      // xxx 没通过
      event.preventDefault();
    }
  },
  false
);
```

### 14.1.2 重置表单

> 和表单提交有类似，可以通过`<input>`或者`button`标签并且`type`属性为`reset`来创建重置按钮。它的功能就是将所有的表单字段都恢复到页面刚加载完毕的时候的初始值。同样用户点击充值表单的时候会触发`reset`事件，我们可以必要的时候取消重置操作

```html
<form action="https://github.com/">
  <input type="text" value="用户名" name="username">
  <input type="password" value="pwd" name="password">
  <!-- 以下两种方式都可以定义重置按钮 -->
   <input type="reset" value="重置表单">  
  <!-- <button>重置表单</button>   -->
</form>
```

**稍微修改一下上面的脚本**

```js
let $form = document.forms[0];
let fields = [].slice.call($form.elements);
let checkForm = () => {
  return fields
    .filter(ele => {
      return ['text', 'password'].includes(ele.type);
    })
    .every(ele => {
      return ele.value.length > 6;
    });
};

['submit', 'reset'].forEach(v => {
  $form.addEventListener(
    v,
    function(event) {
      if (checkForm()) {
        // xxx 通过表单验证
      } else {
        // xxx 没通过
        event.preventDefault();
      }
    },
    false
  );
});
```

**当然最后我们也可以通过`form.reset()`在 js 中手动触发重置操作。**

### 14.1.3 表单字段

> 表单元素与其他的原生元素一样，可以使用 getElementById 等方式去访问。此外每个表单都有一个 elements 属性，表示表单中所有元素的集合。如果有多个表单控件都在使用一个 name（比如单选按钮），name 就会返回以该 name 命名的一个 NodeList

```html
<form action="">
  <input type="text" name="username">
  <input type="text" name="username">
  <input type="text" name="pwd">
  <input type="radio" name="sex" value="boy">
  <input type="radio" name="sex" value="girl">
  <input type="submit">
</form>
```

```js
let $form = document.forms[0];
let elements = $form.elements;
```

以下是 elements 变量的取值，可以看到可以通过索引 0,1,2 等形式去访问表单控件，也可以通过 pwd,sex 等命名形式去访问。

![](http://pbzt3k27s.bkt.clouddn.com/687474703a2f2f6f647373676e6e70662e626b742e636c6f7564646e2e636f6d2f515132303137303930322d3137303734304032782e706e67.png)

**共有的表单字段属性**

> 除了元素之外，所有的表单字段都拥有相同的一组属性。比如如下。

- `disabled`:布尔值，表示当前字段是否被禁用。
- `form`：指向当前字段所属表单的指针，只读。
- `name`：当前字段的名称
- `readOnly`：布尔值，表示当前字段是否只读。
- `tabIndex`：表示当前字段的切换号
- `type`：当前字段的类型，如“checkbox”，“radio”等等
- `value`：当前字段被提交给服务器的值，对文件字段来说，这个属性是只读的，包含着文件在计算机中的路径。

> 除了 form 属性之外，可以通过 js 动态修改其值

**共有的表单字段方法**

- `focus()`,获取焦点
- `blur()`，失去焦点

> 需要注意的是，只有表单字段才可以获取焦点，对于其他元素来说，如果先将其 tabIndex 属性设置为-1，然后在调用 focus()方法，也可以让这些元素获得焦点。当前 opera 目前不支持这种技术

**共有的表单事件**

除了支持鼠标，键盘，更改和 HTML 事件之外，所有表单字段都支持下面三个事件。

- `blur`：当前子弹失去焦点时触发
- `change`：对于 input 和 textarea 元素来说，在他们是去焦点并且值改变时触发，对于 select 元素，在其选项改变时触发，
- `focus`：当前字段获得焦点时触发

## 14.2 文本框脚本

> 在 HTML 中，`<input>` 元素和`<textarea>`元素都表示文本框。这两个空间非常类似，而且大多数的时候行为也差不多，不过还是有一些差别。

- 对于 input 元素来说可以通过 size 特性来设置能够显示的字符数，通过 value 特性，可以设置初始值。，而 maxlength 则可以指定能够接受的最大字符数。如果要创建一个文本框，让他能够显示 25 个字符，单输入不能超过 50 个字符。可以用如下代码。

```html
<input type="text" size="25" maxlength="50" value="initial value">
```

- 但是对于`<textarea>`而言，元素始终会呈现为一个多行文本，要指定文本框的大小可以通过 rows 和 cols,rows 表示行数，cols 表示列数。与元素的区别在于其初始值需要放在`<textarea>initial value<textarea>`之间。并且不能指定最大字符数。

### 14.2.1 选择文本

> 上述两种文本框都支持`select()`方法，这个方法用于选择文本框中的所有文本，在调用`select()`方法时，大多数浏览器都会讲焦点设置到文本框中。

在文本框获取焦点时选择所有文本，可以让用户不必一个一个删除文本。

**1. select 事件**

> 与`select()`方法对应的是 select 事件，在选择了文本框的文本时就会触发 select 事件。但是什么时候触发会因浏览器而异。在 ie9+，Opera,FireFox，Chrome 和 Safari 中，只有用户选择了文本而且释放了鼠标才会触发 select 事件。但是在 ie8 及更早的版本中只要用户选择了一个字母，不必释放鼠标，就会触发。当然在调用`select()`方法的时候也会触发该事件。

**2. 获取选择的文本**

> 通过`selectionStart`和`selectionEnd`表示所选择的文本的范文（即文本选区的开头和结尾的偏移量），就可以知道用户到底选择了啥。

```js
$area.addEventListener(
  'select',
  e => {
    console.log(
      $area.value.substring($area.selectionStart, $area.selectionEnd)
    );
  },
  false
);
```

当然该方式是有兼容问题的

**3. 选择部分文本**

> HTML5 中为选择文本框中的部分文本提供了解决方法，即`setSelectionRange`方法，接收两个参数，要选择地第一个和最后一个字符之后的字符的索引。

### 14.2.2 过滤输入

> 我们经常会要求用户在文本框中输入特定格式的数据，比如必须匹配某种模式，我们可以综合运用事件和 DOM 手段，来将普通的文本框转化成能够理解用户输入数据的功能控件。

**1. 屏蔽字符**

> 有时候我们需要用户输入的文本中不包含某些字符，这个时候可以给 keypress 事件，阻止这个事件的默认行为来屏蔽此类字符。甚至在某些极端的情况下可以屏蔽掉所有操作。

```
$keyPress.addEventListener('keypress', (e) => {
  e.preventDefault()
}, false)
```

**2. 操作剪切板**

> IE 是第一个支持与剪切板相关事件，以及通过 js 访问剪切板数据的浏览器。后来 html5 也把剪切板事件纳入了规范，下面是 6 个剪切板事件。

- `beforecopy`: 在发生复制操作前触发
- `copy`：在发生复制操作时触发
- `beforecut`：在发生剪切操作前触发
- `cut`：在发生剪切操作时触发
- `beforepaste`：在发生粘贴操作前触发
- `paste`：在发生粘贴操作时触发

```html
<div class="box">
  <input type="text" class="paste-input">
</div>
```

```js
let $pasteInput = document.querySelector('.paste-input');

let getClipboardData = e => {
  let clipboardData = (e || event).clipboardData;

  return clipboardData.getData('text');
};
let setClipboardData = (e, val) => {
  let params = e.clipboardData ? 'text/plain' : 'text';
  let clipboardData = (e || event).clipboardData;

  clipboardData.setData(params, val);
};

$pasteInput.addEventListener(
  'paste',
  e => {
    let data = getClipboardData(e);
    console.log('paste===', data);
  },
  false
);
```

**拿到的兼容事件对象上有一个 clipboardData 属性，这个对象有三个方法，分别是 getData，setData 和 clearData。用于从剪切板中取得数据，他接收一个参数，即要取得的数据的格式，在 ie 中，有两种数据格式：‘text’和‘url’，在 firefox 和 safari 中的 setData 方法不能识别‘text’类型，这两个浏览器在成功将文本放到剪切板中后，都会返回 true，否则返回 false**

### 14.2.3 自动切换焦点

> 使用 js 可以从多个方面增强表单的易用性，其中，最常见的一种方式就是在用户填写完当前字段的时候，自动将焦点切换到下一个字段。通常在自动切换焦点之前，必须知道用户已经输入了既定的长度的数据（比如电话号码）。

```html
<form action="" name="form1">
  <input type="text" name="tel1" maxlength="3">
  <input type="text" name="tel2" maxlength="4">
  <input type="text" name="tel3" maxlength="5">
</form>
```

```js
let $form = document.forms['form1'];

let getNextInput = e => {
  let target = (e || event).target;
  let maxLength = target.maxLength;
  let val = target.value;
  let name = target.name;
  let len = name.length;
  let nextInputIndex = Number(name[name.length - 1]) + 1;
  let prefix;

  if (val.length === maxLength) {
    prefix = name.slice(0, len - 1);
    name = `${prefix}${nextInputIndex}`;
    return $form.elements[name];
  }
};

$form.addEventListener(
  'keyup',
  e => {
    let $nextInput = getNextInput(e);

    if ($nextInput) {
      $nextInput.focus();
    }
  },
  false
);
```

## 14.4 表单序列化

在浏览器中提交表单之前，浏览器是怎样将数据发送给服务器的,如下说明。

- 对表单字段的名称和值进行 URL(`encodeURIComponent()`)编码,并使用(&)进行分割
- 不发送禁用的表单字段
- 只发送勾选的复选框和单选按钮
- 不发送 type 为 reset 和 button 的按钮
- 多选框中每个选中的值单独一个条目
- 在单击提交按钮提交表单的情况下，也会发送提交按钮；否则不会发送，也包括 type 为 image 的 input 元素
- `<select>`元素的值就是选中的 `<option>`元素的 value 值，如果`<option>`元素没有 value 特性则是`<option>`的文本值

**放一张常见的表单提交的 GET 方式各个字段的截图**

![](http://pbzt3k27s.bkt.clouddn.com/687474703a2f2f6f647373676e6e70662e626b742e636c6f7564646e2e636f6d2f2545382541312541382545352538442539352545362538462539302545342542412541342545362539362542392545352542432538466765742e706e67 (1).png)

**放一张常见的表单提交的 POST 方式各个字段的截图**

![](http://pbzt3k27s.bkt.clouddn.com/687474703a2f2f6f647373676e6e70662e626b742e636c6f7564646e2e636f6d2f2545382541312541382545352538442539352545362538462539302545342542412541342545362539362542392545352542432538462e706e67.png)
