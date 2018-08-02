# JavaScript高程笔记-（21-25章）

# 第 21 章 - Ajax 与 Comet

> 参考：[也可以查看阮一峰 AJAX 学习](http://javascript.ruanyifeng.com/bom/ajax.html)

Asynchronous Javascript and XML(Ajax),这一技术能够能够向服务器请求额外的数据而不用刷新页面，能够带来更好的用户体验，熟练地使用 XHR 对象是 Web 开发人员必须掌握的一项技能。

**学习目标**

- 使用`XMLHttpRequest`
- 使用`XMLHttpRequest`相应的事件
- 跨域 Ajax 通信的限制

## 21.1 XMLHttpRequest 对象

> `XMLHttpRequest`对象是使用 Ajax 技术最重要的一个点，最早支持该 api 的浏览器是 IE5，在该浏览器中通过 MSXML 中的一个`ActiveX`对象实现的，所以在 IE 中也可能会遇到三个不同版本的 XHR 对象，分别是 MSXML2.XMLHttp、MSXML2.XMLHttp.3.0、MSXML2.XMLHttp.6.0。需要兼容的话可以使用下面这个函数。

```js
//  适用于ie7之前的版本

function createXHR() {
  if (typeof arguments.callee.activeXString != 'string') {
    var versions = [
      'MSXML2.XMLHttp',
      'MSXML2.XMLhttp.3.0',
      'MSXML2.XMLhttp.6.0'
    ];
    for (var i = 0, len = versions.length; i < len; i++) {
      try {
        new ActiveXObject(versions[i]);
        arguments.callee.activeXString = versions[i];
        break;
      } catch (e) {
        // 跳过
      }
    }
  }
  return new ActiveXObject(arguments.callee.activeXString);
}
```

**当然如果我们只想支持 ie7 以及更高版本的浏览器只需要像下面这样使用构造函数**

```js
var xhr = new XMLHttpRequest();
```

**如果必须支持 ie7 以下的版本，稍微改造下前面的 createXHR 函数即可**

```js
function createXHR() {
  if (typeof XMLHttpRequest != 'undefined') {
    return new XMLHttpRequest();
  } else if (typeof arguments.callee.activeXString != 'string') {
    console.log('进了arguments.callee.activeXString');
    var versions = [
      'MSXML2.XMLHttp',
      'MSXML2.XMLhttp.3.0',
      'MSXML2.XMLhttp.6.0'
    ];
    for (var i = 0, len = versions.length; i < len; i++) {
      try {
        // 为什么这里不将实例返回也可以得到XHR对象
        console.log(versions[i]);
        new ActiveXObject(versions[i]);
        arguments.callee.activeXString = versions[i];
        break;
      } catch (e) {
        // 跳过
      }
    }
    console.log('ActiveXObject');
    return new ActiveXObject(arguments.callee.activeXString);
  } else {
    throw new Error('No XHR object available');
  }
}
```

### 21.1.1 XHR 的用法

> 上面了解了如何用兼容的方式获取一个 xhr 对象，现在开始学习如何使用，一般大致上可以分为以下三步。

- 通过`onreadystatechange`监听请求状态
- `xhr.open(method, url, true or false)`
- `xhr.send()`

`xhr.open(method, url, true or false)`的三个参数分别是请求的类型(get、post 等)，请求的 url，以及请求是否设置为异步。

**示例**

```js
xhr.open('get', 'example.php', false);
```

**特别说明**

- url 可以是相对路径也可以是绝对路径
- 调用 open 方法后并不会立即发送一个请求到服务器，只是启动一个请求以备发送。
- 真正发送请求是从`xhr.send()`开始

```js
xhr.open('get', 'example.php', false);
xhr.send(null);
```

send 方法接收一个参数，即作为请求主体发送的数据，如果不需要发送数据必须传入`null`,此时请求才真正地被分派至服务器。

当发送的请求接收到响应的时候会自动填充 xhr 对象的相关属性，现在对相关属性介绍如下。

- `responseText`(作为响应主体被返回的文本)
- `status` (响应的 http 状态)
- `statusText`(http 状态说明)

接收到响应的时候先判断`status`属性，以判断响应是否完成，一般将 http 状态为 200(304 表示请求的资源没有更改，可以走浏览器缓存)时作为成功的标志。

所以可以如下写法检查请求的状态

```js
xhr.open('get', 'example.php', false);
xhr.send(null);
if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
  // 成功
  alert(xhr.responseText);
} else {
  alert('request was unsuccessful' + xhr.status);
}
```

像上面那样发送的是同步请求，大多数情况下我们发送的还是异步请求以不阻塞 js 继续执行，这个时候可以监测 xhr 对象的`readyState`属性,该属性表示请求/响应过程属于哪一个阶段。总共有以下几个阶段

- `0` : 未初始化，还没有调用 open()方法
- `1` : 启动，已经吊用 open()方法但是还没有调用 send()方法
- `2` : 发送，已经调用 send()方法，但是尚未接收到响应
- `3` : 接收，已经接收到部分数据
- `4` : 完成，已经接收到全部数据，而且已经可以在客户端使用了。

通常`readyState`由一个值切换到另一个值都会触发`onreadystatechange`事件，通常我们只对为 4 的情况感兴趣，因为只有这个时候响应的数据是完整的。

```js
let xhr = createXHR();

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
      // 成功
      alert(xhr.responseText);
    } else {
      // 失败
    }
  }
};
xhr.open('get', 'example.php', true);
xhr.send(null);
```

**另外既然可以发送请求，我们也可以终止请求，调用`xhr.abort()` 法方法，xhr 对象将会停止触发事件，此时也应该对 xhr 对象解除引用操作**

### 21.1.2 http 头部信息

> 每个 http 的请求和响应都会带有响应的头部信息，xhr 对象提供了操作这两种头部(请求头部和响应头部)信息的方法。

- `Accept` : 浏览器能够处理的内容类型
- `Accept-charset` : 浏览器能够显示的字符集
- `Accept-Encoding` : 浏览器能够处理的压缩编码
- `Accept-Language` : 浏览器当前设置的语言
- `Connection` : 浏览器与服务器之间的连接类型
- `Cookie` : 当前页面设置的任何 cookie
- `Host` : 发出的请求所在的域
- `Referer` : 发出请求的页面 URI (特别注意：这个单词正确拼写应该是 referrer,但是 HTTP 规范把单词拼错了，也只能将错就错了)

**可以使用`xhr.setRequestHeader`来设置自定义的请求头部信息**

该方法接收两个参数，即头部字段的名称和头部字段的值。

**如果要成功的发送请求头部信息，必须在调用 open 方法之后并且调用 send 方法之前调用`setRequesHeader`方法**，比如

```js
var xhr = createXHR();
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
      console.log(xhr.responseText);
    }
  }
};
xhr.open('get', 'example', true);
xhr.setRequestHeader('name', 'liusixin');
xhr.send(null);
```

服务端在接收到这种自定义的头部信息之后，可以执行响应的后续操作，建议不要修改浏览器默认的头部相关字段。

我们也可以调用`xhr.getResponseHeader()`，并传入一个头部字段的名称即可获取响应的头部信息，而调用`xhr.getAllResponseHeaders()`则可以获取包含所有头部信息的长字符串。

```js
var myHeader = xhr.getResponseHeader('myHeader');
var allHeaders = xhr.getAllResponseHeaders();
```

当然了客户端在发起请求的时候可以自定义请求头部信息，服务端同样可以返回客户端一些自定义的头部信息。

### 21.1.3 GET 请求

> GET 是最常见的请求类型，最常用于向服务器查询某些信息，将查询字符串跟在 url 的后面，以便将信息发送给服务器。，对于 XHR 而言传入 open 方法的 url 后的查询字符串，必须经过正确的编码（即名和值都必须使用`encodeURIComponent()`进行处理）才行。

```js
function addURLParam(url, name, value) {
  url += url.indexOf('?') === -1 ? '?' : '&';
  url += encodeURIComponent(name) + '=' + encodeURIComponent(value);
  return url;
}
```

### 21.1.4 POST 请求

> 使用频率仅次于 get 的是 post 请求，通常用于向服务器发送应该被保存的数据，post 请求应该将数据作为请求的主体提交而 get 请求传统上不是如此，post 请求可以包含非常多的数据而且格式不限。

**默认情况下，服务器对 post 请求和提交的 web 表单请求并不会一视同仁，因此服务器必须有程序来读取发送过来的原始数据，并且解析出有用的部分，不过我们可以用 xhr 来模仿表单提交**

模仿表单提交一般有以下两点

- 将请求头的`Content-type`设置为`application/x-www-form-urlencoded`,也就是表单提交的类型
- 其次以合适的格式创建一个字符串，post 格式与查询字符串的格式相同

```js
function submitData() {
  var xhr = createXHR();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        alert(xhr.responseText);
      } else {
        alert('err');
      }
    }
  };
  xhr.open('post', 'example.php', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); // 着重点
  var form = document.getElementById('user-info');
  xhr.send(serialize(form)); // 着重点
}
```

**与 GET 请求相比 POST 请求消耗的资源会更多一些，从性能角度看，发送相同的数据，GET 请求的速度可以达到 POST 请求的 2 倍**

## 21.2 XMLHttpRequest 2 级

### 21.2.1 FormData

> 现代 Web 应用中频繁使用的一项功能就是表单序列化，`XMLHttpRequest 2`为此定义了`FormData`类型，`FormData`为序列化表单和创建与表单格式相同的数据(用于通过 XHR 传输)提供了便利。

```js
var data = new FormData();
data.append('name', 'liusixin');
```

其接收两个参数，数据的健和值，当然也可以直接像 FormData 传入表单

```js
var xhr = createXHR();
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
      alert(xhr.responseText);
    } else {
      alert('err');
    }
  }
};
xhr.open('post', 'example.php', true);
var form = document.getElementById('user-info');
xhr.send(new FormData(form)); // 着重点
```

**对比上面一个例子我们可以发现，使用 FormData 来传输数据的时候，可以省去设置头部 Content-type，也不必自己序列化表单，可谓方便多了**

### 21.2.2 超时设置

**`overrideMimeType()`方法**

> 该方法用于重写 XHR 响应的 MIME 类型，因为返回响应的类型决定了 XHR 对象如何处理它，所以提供一种能够重写服务端返回的 MIME 类型是很有用的。[MIME MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types)

举个例子：服务器返回的 MIME 类型是`text/plain`,但是数据中实际包含的是 XML，那么 XHR 根据 MIME 的类型，即使数据是 XML。`responseXML`属性中仍然是 null，通过调用`overrideMimeType`方法，可以保证把响应当作 XML 而非穿文本来处理。

```js
var xhr = createXHR();
xhr.open('get', 'text.php', true);
xhr.overrideMimeType('text/xml');
xhr.send(null);
```

**注意该方法必须要在 send 方法之前调用，才能保证重写响应的 MIME 类型**

## 21.3 进度事件

> Progress Events 定义了客户端与服务器通信有关的事件。

- `loadStart` ： 在接收到响应数据的第一个自己触发
- `progress` ：在接收响应期间持续不断的触发
- `error` ： 在请求发生错误时触发
- `abort` ： 在因为调用 abort()方法而终止连接时触发
- `load` ： 在接收到完整的数据时触发
- `loadend` ： 在通信完成或者触发 error、abort 或 load 事件后触发

**着重看`load`和`progress`事件**

### 21.3.1 load 事件

> load 事件的初衷在于简化异步交互的模型，用以替代`readystatechange`事件，响应接收完毕将会触发 load 事件，因此也就没有必要检查`readyState`属性。并且 load 事件处理程序会受到一个 event 对象，target 属性就是指向 xhr 对象的实例，也就可以访问到其所有的属性和方法。

遗憾的是并不是所有的浏览器都实现了适当的事件对象，所以兼容写法还是如下

```js
var xhr = createXHR();
xhr.onload = function() {
  if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
    alert(xhr.responseText);
  } else {
    alert('Request was unsuccessful');
  }
};
```

### 21.3.2 progress 事件

> 该事件会在浏览器接收数据期间周期性的触发。而`onprogress`的事件处理程序会接收到一个 event 对象，其 target 属性是 XHR 对象，但是包含三个而外的属性

- `lengthComputable` (表示进度信息是否可用)
- `position` (表示已经接收的字节数)
- `totalSize` (表示根据`Content-Length`响应头部确定的预期的字节数)

> 这些属性兼容性问题比较大，谨慎使用

## 21.4 跨域资源共享

### 21.4.1 IE 对 CORS 的实现

### 21.4.2 其他浏览器对 CORS 的实现

### 21.4.3 Preflighted Request

### 21.4.4 带凭据的请求

### 21.4.5 跨浏览器的 CORS

> 上面内容可以参考 阮一峰的[跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)

## 21.5 其他跨域技术

> 在 CORS 技术出现之前，解决跨域问题，一般是利用 DOM 中能够执行跨域请求的功能，在不依赖 XHR 对象的情况下也能发送某种请求。

### 21.5.1 图像 ping

> 网页中无论从哪个网页中加载图片都不用担心跨域的问题，通过动态的创建图像，使用它们的`onload`和`onerror`事件处理程序来确定是否接收到了响应。

**图像 ping 是与服务器进行简单、单向的跨域通信的一种方式，请求的数据通过查询字符串形式发送给服务器，而响应可以是任意内容，但通常是像素图或 204 响应，通过图像 ping 浏览器得到不任何数据，但可以通过 onload 和 onerror 事件知晓请求是何时接收到的。**

```js
var img = new Image();
img.onload = img.onerror = function() {
  alert('DONE');
};
img.src = 'www.baidu.com';
```

### 21.5.2 JSONP

> JSONP(JSON with padding),由两部分组成：回调函数和数据，回调函数是当响应到来的时应该在页面中调用的函数，回调函数的名字一般是在请求中指定的。而数据就是传入回调函数中的 json 数据。

**通过动态地创建`<script>`标签，将其 src 属性指向一个跨域的 url，其实这里的 script 标签和 img 标签类似，都有能力不受限制的跨域加载资源，因为 JSONP 是有效的 JavaScript 代码，所以在请求完成之后，即在 JSONP 响应加载到页面以后，就会立即执行。**

```js
function handleResponse(response) {
  console.log(response);
}

var script = document.createElement('script');
script.src = 'http://example.php?callback=handleReponse';
document.body.appendChild(script);
```

# 第 22 章 - 高级技巧

**学习目标**

- 使用高级函数
- 防篡改对象
- Yielding Timers

## 22.1 高级函数

### 22.1.1 安全的类型检测

> JavaScript 内置的类型检测并不是完全可靠，发生错误的情况不再少数，

- 例如`typeof`操作符噢，由于它有一些无法预知的行为，经常会导致检测数据类型时得不到靠谱的结果。Safari 在对正则表达式应用 typeof 操作符时会返回 function,因此很难判断一个值是否是函数
- `instanceof` 操作符存在全局作用域的情况下，也是问题多多。

```js
let isArray = value instanceof Array;
```

以上代码要 true,value 必须是一个数组，而且还必须与 Array 构造函数在同一个全局的作用域中（比如 value 是一个页面中的 iframe 定义的，就会返回 false）

> 解决以上问题的方案是调用`Object`的`toString`方法，都会返回一个`[object NativeConstructorName]`格式的字符串，每个类在内部都有一个`[[class]]`属性，这个属性中就指定了上述字符串中构造函数的名。

```js
let isArray = value => {
  return Object.prototype.toString.call(value) === '[object Array]';
};

let isFunction = value => {
  return Object.prototype.toString.call(value) === '[object Function]';
};

let isRegExp = value => {
  return Object.prototype.toString.call(value) === '[object RegExp]';
};
```

### 22.1.2 作用域安全的构造函数

> 构造函数其实就是一个用 new 操作符调用的函数，当使用 new 调用的时候，构造函数内用到的 this 会指向新创建的对象实例。

```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
}

let p = new Person('liusixin', 26, 'fe');
```

**当使用 new 操作符调用时会创建一个新的 Person 对象，但是问题就是出现在没有使用 new 的时候，由于 this 是在运行时绑定的，所以直接调用 Person 会映射到全局的 window 对象**

作用域安全的构造函数在进行任何更改之前，首先确认 this 对象是正确类型的实例，如果不是，那么会创建新的实例并返回。

```js
function Person(name) {
  if (!(this instanceof Person)) {
    return new Person(name);
  }

  this.name = name;
}

let p1 = new Person('liusixin');
let p2 = new Person('hahaha');
```

**以上代码实现了不管是否使用 new 操作符去调用 Person 函数都会生成一个新的 Person 实例**

但是以上模式也有缺陷，比如在使用构造函数的窃取模式来实现继承并且不用原型链，那么这个继承可能会遭到破坏。

```js
function A(name) {
  if (!(this instanceof A)) {
    return new A(name);
  }
  this.name = name;
  this.showName = function() {
    console.log(this.name);
  };
}

function B(name, age) {
  A.call(this, name);
  this.age = age;
}

let b1 = new B('liusixin', 26);
b1.name; // undefined
```

在这段代码中 A 函数的构造函数是安全的，然而 B 函数却不是，新创建一个 B 函数的实例后，应该通过 A.call 来继承 A 的 name 属性，但是由于 A 函数的作用域是安全的，this 并不是 A 函数的实例，所以会创建一个新的 A 对象，B 中的 this 并没有得到增长，同时 A.call(name)返回的值也没有用到，所以 b1 中就不会有 name 属性。

但是构造函数窃取模式使用原型链或者寄生组合模式就可以解决这个问题。举个例子。

```js
function A(name) {
  if (!(this instanceof A)) {
    return new A(name);
  }
  this.name = name;
  this.showInfo = function() {
    console.log(this.name);
  };
}

function B(name, age) {
  A.call(this, name);
  this.age = age;
  this.showAge = function() {
    console.log(this.age);
  };
}

B.prototype = new A();

let b2 = new B('liusixin', 1);
b2.name; // liusixin
```

### 22.1.3 惰性载入函数

### 22.1.4 函数绑定

### 22.1.5 函数柯里化

## 22.2 防止篡改对象

# 第 23 章 - 离线应用与客户端存储

**学习目标**

- 进行离线检测
- 使用离线缓存
- 在浏览器中保存数据

## 23.3 数据存储

> 随着 Web 应用程序的出现，也产生了对于能够直接在客户端上存储用户信息能力的要求。属于某个特定用户的信息应该存在该用户的机器上，无论是登录信息还是偏好设置或者其他数据。

> 解决该问题的第一个方案是以 cookie 的形式出现的，cookie 只是在客户端存储数据的其中一种选项。

### Cookie

> HTTP Cookie 通常叫做 cookie，最初是在客户端用于存储会话信息的。该标准要求服务器对任意的 http 请求发送 Set-Cookie HTTP 头作为响应的一部分，其中包含会话信息，例如这种服务器响应的头可能如下。

**cookie 以名值对存在，并且名称和值都必须是 URL 编码的，浏览器会存储这样的会话信息，并在这之后，通过为每个请求添加 Cookie HTTP 头将信息发送回服务器。**

# 第 25 章 - 新兴的 API

**学习目标**

- 创建平滑的动画
- 操作文件
- 使用 Web Workers 在后台执行 JavaScript

## 25.4 File API

> 不能直接访问用户计算机中的文件，一直都是 web 应用开发中的一大障碍，2000 年以前，处理文件唯一的方式就是在表单中加入字段，仅此而已，File API 的宗旨是为 Web 开发人员开提供一种安全的的方式，以便在客户端访问用户计算机中的文件，并更好地对这些文件进行操作。

File API 在表单的文件字段的基础上又添加了一些直接访问文件信息的接口，HTML5 中在 DOM 中为文件输入元素添加了一个 files 集合，在通过文件输入字段选择了一或多个文件时，files 集合中将包含一组 File 对象，每个 File 对象对应一个文件，每个 File 对象下面都有下列的只读属性。

- `name`: 本地文件系统中的文件名
- `size`: 文件的字节大小
- `type`: 字符串，文件的 MIME 类型
- `lastModifiedDate`: 字符串，文件上一次被修改的时间（只有 Chrome 实现了这个属性）

**文件信息获取示例**

```html
<input type="file" class="files" multiple>
```

```js
let $files = document.querySelector('.files');

$files.addEventListener(
  'change',
  e => {
    let target, files;

    e = e || event;
    target = e.target || e.srcElement;
    files = target.files;

    Array.from(files).forEach((file, i) => {
      console.table(file);
    });
  },
  false
);
```

### 25.4.1 FileReader 类型

> FileReader 类型实现的是一种异步文件读取机制，可以把 FileReader 想象成 XMLHttpRequest，区别只是它读取的是文件系统，而不是远程服务器。问了读取文件中的数据，FileReader 提供了以下几个方法。

- `readAsText(file, encoding)`： 以纯文本形式读取文件，将读取到的文本保存在 result 属性中
- `readAsDataURL(file)`: 读取文件并将文件以数据 URI 的形式保存在 result 属性中。
- `readAsBinaryString(file)`: 读取文件并将一个字符串保存在 result 属性中，字符串中的每个字符表示一个字节。
- `readArrayBuffer(file)`: 读取文件并将一个包含文件内容的 ArrayBuffer 保存在 result 属性中。

**由于读取文件的过程是异步的，因为 FileReader 也提供了几个事件，其中最有用的三个事件是`progress`，`error`，`load`，分别表示是否又读取了数据，是否发生错误以及是否已经读完了整个文件**

每隔 50ms 左右，就会触发一次`progress`事件，通过事件对象可以获得与 XHR 的 progress 事件相同的信息。`lengthComputed`,`loaded`,`total`,另外尽管可能没有包含全部数据但是每次 progress 事件中都可以通过 FileReader 的 result 属性读取到文件内容。

由于种种原因无法读取文件，就会触发 error 事件，触发 error 事件时，相关的信息将会保存到 FileReader 的 error 属性中，这个属性中将保存一个对象，该对象只有一个属性 code，即错误码，这个错误码是

- `1`：表示未找到文件
- `2`：表示安全性错误
- `3`：表示读取中断
- `4`：表示文件不可读
- `5`：表示编码错误

件成功加载后会触发 load 事件，如果发生了 error 事件就不会触发 load 事件。

### 25.4.2 读取部分内容

> 有时候，我们只想读取文件的一部分内容而不是全部内容，为此，File 对象还支持一个 slice 方法，这个方法在 Firefox 中叫 mozSlice，在 chrome 中叫做 webkitSlice，其接受两个参数，起始字节，以及要读取的字节数。这个方法返回一个 Blob 的实例，Blob 是 File 类型的父类型。下面是一个兼容的方法

```js
function blobSlice(blob, startByte, length) {
  if (blob.slice) {
    return blob.slice(startByte, length);
  } else if (blob.webkitSlice) {
    return blob.webkitSlice(startByte, length);
  } else if (blob.mozSlice) {
    return blob.mozSlice(startByte, length);
  } else {
    return null;
  }
}
```

### 25.4.3 对象 URL

### 25.4.4 读取拖放的文件

> 围绕文件信息，结合使用的 HTML5 API 和文件 API，可以做出很赞的东西来。与拖放一张图片或者一个链接类似，从桌面上把文件拖放到浏览器中也会触发 drop 事件，而且可以在 event.dataTransfer.files 中读取到被放置的文件，当然此时他是一个 File 对象，与通过文件输入字段取得的 File 对象一样

## 25.6 Web Workers

> 随着 Web 应用复杂性的与日俱增，越来越复杂的计算在所难免，长时间运行的 JavaScript 进行会导致浏览器冻结用户界面，让人感觉屏幕“冻结”了，Web Workers 规范通过让 JavaScript 在后台运行解决了这个问题，浏览器实现 Web Worker 的方式有很多种，可以使用线程，后台进程或者运行在其他处理器上的进程，等等。怎么实现细节其实没有那么重要，重要的是开发人员现在可以放心地运行 JavaScript 而不必担心影响用户体验了。
