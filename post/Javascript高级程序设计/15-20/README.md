# JavaScript高程笔记-（15-20章）

# 第 15 章 - 使用 canvas 绘图

**学习目标**

- 理解元素
- 绘制简单的 2d 图形
- 使用 WebGL 绘制 3D 图形

## 15.1 基本用法

> 使用 canvas 元素，需要先设置其 width 和 height，指定可以绘图的大小，出现在开始和结束标签中的内容是后备信息，如果浏览器不支持 canvas 元素就会显示这些信息。

```html
<canvas id="drawing" width="200" height="200"></canvas>
```

与其他元素一样，canvas 对象的 DOM 元素也有 width 和 height 属性，可以随意修改，而且也可以通过 css 为该元素添加样式(与直接在 html 指定 width 和 height 有什么不同呢)，如果不添加任何样式或者不绘制图形，在页面中是看不到该元素的。

要在这块画布上绘图，需要取得绘图上下文。并通过`getContext()`方法传入上下文的名字 2d。

```js
let drawing = document.getElementById('drawing');

// 如果确定支持canvas元素
if (drawing.getContext) {
  let ctx = drawing.getContext();
}
```

如上代码，在使用`canvas`元素之前需要先检测`getContext`方法是否存在，在有些浏览器中会 HTML 规范之外的元素创建默认的 HTML 元素对象，在这种情况中，虽然保存着一个有效的元素引用，也检测不到`getContext`方法。

使用`toDataURL`方法，可以导出在 canvas 元素上绘制的图像，这个方法接收一个参数，即图像的`MIME`类型格式，而且适合用于创建图像的任何上下文，比如，要取得画布中的一幅`PNG`格式的图像，可以使用以下代码。

```js
let drawing = document.getElementById('drawing');

if (drawing.getContext) {
  let imgURL = drawing.toDataURL('image/png');
  let image = document.createElement('img');
  image.src = imgURL;
  document.body.appendChild(image);
}
```

**注意： 如果绘制到画布上的图像源自不同的域，toDataURL 方法会抛出错误**

## 15.2 2d 上下文

> 使用 2D 绘图上下文提供的方法，可以绘制简单的 2D 图形，比如矩形，弧线和路径。2D 上下文的坐标开始于 canvas 元素的左上角，原点是(0, 0)，所有的坐标值都基于这个原点计算，x 值越大表示跃靠右，y 值越大表示越靠下，默认情况下，width 和 height 表示水平和垂直方向上可用的像素数目。

### 15.2.1 填充和描边

> 2D 上下文的两种基本绘图操作是填充和描边，填充即使用指定的样式（颜色，渐变，或图像）填充图形，描边就是只在图形的边缘画线。大多数 2D 上下文操作都会细分为填充和描边两个操作，而操作的结果取决于两个属性，fillStyle 和 strokeStyle

**需要注意的是这两个属性的值都可以是字符串，渐变对象或模式对象，而且默认的值都是“#000000”，如果为他们指定表示颜色的字符串，可以使用 css 中指定颜色值的任何格式，包括颜色名，十六进制码，rgb，rgba，hsl 和 hsla**

下面是一个简单的例子

```js
let $drawing = document.getElementById('drawing');
let ctx = $drawing.getContext && $drawing.getContext();

if (ctx) {
  ctx.strokeStyle = 'red';
  ctx.fillStyle = '#0000ff';
}
```

所有涉及描边和填充的操作都将使用这两个样式，直至重新设置这两个值，这两个属性的值也可以是渐变对象和模式对象。

### 15.2.2 绘制矩形

> 矩形是唯一一种可以直接到 2D 的上下文中绘制的形状，与矩形有关的方法包括`fillRect`,`strokeRect`,`clearRect`这三个方法都可以接受 4 个参数，矩形的 x 坐标，矩形的 y 坐标，矩形的宽度和句型的高度。这些参数的单位都是像素。

`fillRect`方法在画布上绘制的矩形会填充指定的颜色，填充的颜色通过`fillStyle`属性指定。比如：

```js
let $drawing = document.getElementById('drawing');
let ctx = $drawing.getContext && $drawing.getContext();

if (ctx) {
  // 绘制红色的矩形
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(10, 10, 50, 50);
  // 绘制半透明的矩形
  ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
  ctx.fillRect(30, 30, 50, 50);
}
```

以上代码先将 fillStyle 设置为红色，然后从（10， 10）处开始绘制矩形，矩形的宽度和高度均为 50 像素，然后通过 rgba 格式将 fillStyle 设置为半透明的颜色，在第一个矩形上面绘制的第二矩形，结果就是可以透过蓝色的矩形看到红色的矩形。

**strokeRect**

strokeRect 方法在画布上绘制的矩形会使用指定的颜色描边，描边的颜色通过 strokeStyle 指定。

```js
let $drawing = document.getElementById('drawing');
let ctx = $drawing.getContext && $drawing.getContext();

if (ctx) {
  // 绘制红色的矩形
  ctx.fillStyle = '#ff0000';
  ctx.strokeRect(10, 10, 50, 50);
  // 绘制半透明的矩形
  ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
  ctx.strokeRect(30, 30, 50, 50);
}
```

以上代码绘制了两个重叠的矩形，不过这两个矩形都只有框线，内部没有填充颜色。

### 15.2.3 绘制路径

> 2D 绘制上下文支持很多在画布上绘制路径的方法，通过路径可以创造出复杂的形状和线条。要绘制路径，首先必须调用`beginPath()`方法，表示要开始绘制新的路径，然后再通过调用以下方法来实际地绘制路径。

- `arc(x, y, radius, startAngle, endAngle, counterclockwise)`： 以(x, y)为圆心绘制一条弧线，弧线的半径为 radius，起始角度和结束角度（用弧度表示）分别为`startAngle`和`endAngle`，最后一个参数表示是否按照逆时针方向计算，值为 false 表示按顺时针计算。
- `arcTo(x1, y1, x2, y2, radius)`：从上一点开始绘制一条弧线，到(x2, y2)并且以给定的半径 radius 穿过(x1, y1)
- `bezierCurveTo(c1x, c1y, c2x, c2y, x, y)`： 从上一点开始绘制一条曲线，到(x, y)位置，并且以（c1x, c1y）和（c2x, c2y）为控制点。
- `lineTo(x, y)`: 从上一点开始绘制一条直线，直到(x, y)为止。
- `moveTo(x, y)`: 将绘图游标移动到(x, y)，不画线。
- `quadraticCurveTo(cx, cy, x, y)`: 从上一点开始绘制一条二次曲线，到(x, y)为止。并且以(cx, cy)为控制点。
- `rect(c, y, width, height)`, 从点(x, y)开始绘制一个矩形，宽度和高度由 width 和 height 指定，这个方法绘制的是矩形路径，而不是`strokeRect`和`fillRect`所绘制的独立矩形形状。

创立了路径后，接下来有几种可能的选择，如果要绘制一条连接到起点的线条，可以调用`closePath()`,如果路径已经完成，你想用`fillStyle`填充他，可以调用`fill()`,另外，还可以调用`stroke()`方法对路径描边，描边使用的是`strokeStyle`，最后还可以调用`clip`，这个方法可以在路径上创建一个剪切区域。

**接下来我们要绘制一个不带数字的时钟表盘。**

```js
let $drawing = document.getElementById('drawing');
let ctx = $drawing.getContext && $drawing.getContext('2d');

if (ctx) {
  ctx.beginPath();
  ctx.arc(100, 100, 100, 0, 2 * Math.PI, false);
  ctx.moveTo(190, 100); // 防止画出多余的线
  ctx.arc(100, 100, 90, 0, 2 * Math.PI, false);
  ctx.moveTo(100, 100);
  ctx.lineTo(100, 20);
  ctx.moveTo(100, 100);
  ctx.lineTo(40, 100);
  ctx.stroke();
}
```

### 15.2.4 绘制文本

> 2d 绘图上下文也提供了绘制文本的方法，绘制文本主要有两个方法：`fillText()`和`strokeText()`。这两个方法都可以接受 4 个参数，要绘制的文本字符串，x 坐标，y 坐标和可选的最大像素宽度。而且这两个方法都以下列 3 个属性为基础。

- `font`: 表示文本样式，大小，以及字体，用 css 中指定的字体格式来指定例如： `"10px Arial"`
- `textAlign`: 表示文本对齐方式，可能的值有`“start”`， `“end”`，`“left”`，`“right”`， `“center”`，建议使用`“start”`， `“end”`，不适用`“left”`，`“right”`，因为前者的意思更稳妥，能同时适合从左到右，和从右到左的语言。
- `textBaseline`： 表示文本的基线，可能的值有`“top”`， `“hanging”`， `“middle”`， `“alphabetic”`， `“ideographic”`，`“bottom”`

这几个属性都有默认值，因此没有必要每次使用它们都重新设置一遍值，`fillText()`方法使用`fillStyle`属性绘制文本，`strokeText`使用`strokeStyle`属性为文本描边，相对来说，还是使用`fillText`的时候更多，因为该方法模仿了在网页中正常显示文本。

接下来我们接着上面的例子绘制数字。

```js
ctx.font = 'bold 14px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('12', 100, 20);
ctx.textAlign = 'start';
ctx.fillText('12', 100, 40);
ctx.textAlign = 'end';
ctx.fillText('12', 100, 60);
```

注意：将`textAlign`设置为`“center”`，把`textBaseline`设置为`“middle”`，所以坐标为(100, 20)表示的是文本水平和垂直重点的坐标，如果将`textAlign`设置为`“start”`，则 x 坐标表示的是文本左端的位置（从左到右的语言），设置为`“end”`，则 x 坐标表示的是文本右端的位置.

**measureText**

当需要将文本控制在某一区域中的时候，2D 上下文提供了辅助确定文本大小的方法`measureText()`,这个方法接收一个参数，即要回执的文本，返回一个`textMetrics`对象，返回的对象只有一个`width`属性，并且该方法是利用`font`，`textAlign`和`textBaseline`的当前值计算指定的文本的大小。比如，假设你想在一个 140 像素宽的矩形区域中绘制文本，Hello world！下面的代码从 100 像素的字体大小开始递减，最终会找到合适的字体大小。

```js
let fontSize = 100;
let fontStr = 'Hello world';

if (ctx) {
  ctx.textAlign = 'start';
  ctx.textBaseline = 'middle';
  ctx.font = `${fontSize}px Arial`;

  while (ctx.measureText(fontStr).width > 60) {
    fontSize--;
    ctx.font = `${fontSize}px Arial`;
  }

  ctx.fillText(fontStr, 10, 10);
  ctx.fillText(`Font size is ${fontSize}px`, 10, 50);
}
```

### 15.2.5 变换

> 省略...

# 第 16 章 - HTML5 脚本编程

**学习目标**

- 使用跨文档消息传递
- 拖放 API
- 音频与视频

## 16.1 跨文档消息传递

> 跨文档消息传送（cross-document-messaging），有时候简称为 XDM，指的是在来自不同域的页面间传递消息。例如`www.wrox.com`域中的页面与位于一个内嵌框架中的`p2p.wrox.com`域中的页面通信。

XDM 的核心是`postMessage`方法，在 HTML5 中除了 XDM 部分之外的其他部分也会提到这个方法名，但都是为了同一个目的：向另一个地方传递数据，对于 XDM 而言，“另一个地方”指的是包含在当前页面中的`<iframe>`或者由当前页面弹出的窗口

`postMessage`方法接收两个参数，一条消息和一个表示消息接收方来自哪个域的字符串。**第二个参数对保障安全通信非常重要，可以防止浏览器把消息发送到不安全的地方**。来看下面的例子

```js
let iframeWindow = document.getElementById('myframe').contentWindow;

iframeWindow.postMessage('A secret', 'http://www.wrox.com');
```

如果`postMessage`的第二个参数是`'*'`，则可以把消息发送给来自任何域的文档，但是我们不推荐这样做。

接收到 XDM 消息的时候会触发 window 对象的`message`事件，这个事件是以**异步**形式触发的，因此从发送消息到接收消息（触发窗口的`message`事件）可能要经过一段时间的延迟。触发`message`事件之后，传递给`onmessage`处理程序的事件包含以下三方面的信息。

- `data`：作为 postMessage 第一个参数传入的字符串参数
- `origin`：发送消息的文档所在的域，例如`"http://www.wrox.com"`
- `source`: 发送消息的文档的 window 对象的代理，这个代理对象主要用于发送一条消息的窗口中调用 postMessage 方法，如果发送消息的窗口来自同一个域，那么这个对象就是 window。

**特别注意**

- `event.source`大多数情况下只是 window 对象的代理，并非是实际的 window 对象，换句话说，不能通过这个代理对象拿到 window 对象的其他任何信息，记住，只通过这个代理调用`postMessage`就好，这个方法永远存在。
- XDM 还有一些怪异之处，首先就是`postMessage`的第一个参数最早是作为`“永远都是字符串”`来实现的，但是后来这个参数定义改了，改成允许传入任何数据结构，可是并非所有的浏览器都实现了这一变化，为了保险起见，使用`postMessage`时，最好还是只传字符串，如果要传结构化后的数据，最佳选择是现在要传入的数据上调用`JSON.stringfy`,通过`postMessage`传入得到的字符串，然后再在`onmessage`事件处理程序中调用`JSON.parse`

## 16.2 　原生拖放

> HTML5 以 IE 的实例为基础制定了拖放规范。Firefox 3.5、Safari 3+和 Chrome 也根据 HTML5 规范实现了原生拖放功能。

### 16.2.1 拖放事件

> 通过拖放事件，可以控制拖放相关的各个方面。其中最关键的地方在于确定哪里发生了拖放事件，有些事件是在被拖动的元素上触发的，而有些事件是在放置目标上触发的。拖动某元素时，将依次触发下列事件：

- `dragstart`
- `drag`
- `dragend`

按下鼠标键并开始移动鼠标时，会在被拖放的元素上触发`dragstart`事件。拖动开始时，可以通过`ondragstart`事件处理程序来运行 JavaScript 代码。

触发`dragstart`事件后，随即会触发`drag`事件，而且在元素被拖动期间会持续触发该事件。这个事件与`mousemove`事件相似。当拖动停止时（无论是把元素放到了有效的放置目标，还是放到了无效的放置目标上），会触发`dragend`事件。

**当某个元素被拖动到一个有效的放置目标上时，下列事件会依次发生：**

- dragenter
- dragover
- dragleave 或 drop

元素被拖动到放置目标上，会触发`dragenter`事件（类似于`mouseover`事件）。其后是`dragover`事件，如果元素被拖出了放置目标，`dragover`事件不再发生，但会触发`dragleave`事件（类似于`mouseout`事件）。如果元素被放到了放置目标中，则会触发`drop`事件而不是`dragleave`事件。上述三个事件的目标都是作为放置目标的元素。

### 16.2.2 　自定义放置目标

如果拖动元素经过不允许放置的元素，无论用户如何操作，都不会发生 drop 事件。不过，你可以把任何元素变成有效的放置目标，方法是重写`dragenter`和`dragover`事件的默认行为。例如，假设有一个 ID 为"droptarget"的<div>元素，可以用如下代码将它变成一个放置目标。

```js
var droptarget = document.getElementById('droptarget');

EventUtil.addHandler(droptarget, 'dragover', function(event) {
  EventUtil.preventDefault(event);
});

EventUtil.addHandler(droptarget, 'dragenter', function(event) {
  EventUtil.preventDefault(event);
});
```

> 以上代码执行后，你就会发现当拖动着元素移动到放置目标上时，光标变成了允许放置的符号。当然，释放鼠标也会触发 drop 事件。

### 16.2.3 　 dataTransfer 对象

> 它是事件对象的一个属性，用于从被拖动元素向放置目标传递字符串格式的数据。在事件处理程序中，可以使用这个对象的属性和方法来完善拖放功能。

**dataTransfer 对象有两个主要方法：**

- `getData()` - 取得由 setData()保存的值
- `setData()` - 方法的第一个参数，也是`getData()`方法唯一的一个参数，是一个字符串，表示保存的数据类型，取值为"text"或"URL"

```js
//设置和接收文本数据
event.dataTransfer.setData('text', 'some text');
var text = event.dataTransfer.getData('text');

//设置和接收URL
event.dataTransfer.setData('URL', 'http://www.wrox.com/');
var url = event.dataTransfer.getData('URL');
```

> HTML5 支持`"text"`和`"URL"`，但这两种类型会被映射为`"text/plain"`和`"text/uri-list"`。

### 16.2.4 　 dropEffect 与 effectAllowed

> 利用 dataTransfer 对象，通过它来确定被拖动的元素以及作为放置目标的元素能够接收什么操作。为此，需要访问`dataTransfer`对象的两个属性：`dropEffect`和`effectAllowed`。

**dropEffect**

- `"none"`：不能把拖动的元素放在这里。这是除文本框之外所有元素的默认值。
- `"move"`：应该把拖动的元素移动到放置目标。
- `"copy"`：应该把拖动的元素复制到放置目标。
- `"link"`：表示放置目标会打开拖动的元素（但拖动的元素必须是一个链接，有 URL）。

要使用 dropEffect 属性，必须在`ondragenter`事件处理程序中针对放置目标来设置它。

## 16.3 　媒体元素

> HTML5 新增了两个与媒体相关的标签，让开发人员不必依赖任何插件就能在网页中嵌入跨浏览器的音频和视频内容。这两个标签就是`<audio>`和`<video>`。

```html
<!-- 嵌入视频 -->
<video src="conference.mpg" id="myVideo">Video player not available.</video>

<!-- 嵌入音频 -->
<audio src="song.mp3" id="myAudio">Audio player not available.</audio>
```

使用这两个元素时，至少要在标签中包含`src`属性，指向要加载的媒体文件。还可以设置 width 和 height 属性以指定视频播放器的大小，而为`poster`属性指定图像的 URI 可以在加载视频内容期间显示一幅图像。另外，如果标签中有`controls`属性，则意味着浏览器应该显示 UI 控件，以便用户直接操作媒体。位于开始和结束标签之间的任何内容都将作为后备内容，在浏览器不支持这两个媒体元素的情况下显示。

因为并非所有浏览器都支持所有媒体格式，所以可以指定多个不同的媒体来源。为此，不用在标签中指定 src 属性，而是要像下面这样使用一或多个`<source>`元素。

```html
<!-- 嵌入视频 -->
<video id="myVideo">
  <source src="conference.webm" type="video/webm; codecs='vp8, vorbis'">
  <source src="conference.ogv" type="video/ogg; codecs='theora, vorbis'">
  <source src="conference.mpg">
  Video player not available.
</video>

<!-- 嵌入音频 -->
<audio id="myAudio">
  <source src="song.ogg" type="audio/ogg">
  <source src="song.mp3" type="audio/mpeg">
  Audio player not available.
</audio>
```

### 16.3.1 　属性

|      属　　性       | 数据类型 |                                                                    说　　明                                                                    |
| :-----------------: | :------: | :--------------------------------------------------------------------------------------------------------------------------------------------: |
|      autoplay       |  布尔值  |                                                            取得或设置 autoplay 标志                                                            |
|      buffered       | 时间范围 |                                                        表示已下载的缓冲的时间范围的对象                                                        |
|    bufferedBytes    | 字节范围 |                                                        表示已下载的缓冲的字节范围的对象                                                        |
|    bufferingRate    |   整数   |                                                        下载过程中每秒钟平均接收到的位数                                                        |
| bufferingThrottled  |  布尔值  |                                                         表示浏览器是否对缓冲进行了节流                                                         |
|      controls       |  布尔值  |                                            取得或设置 controls 属性，用于显示或隐藏浏览器内置的控件                                            |
|     currentLoop     |   整数   |                                                             媒体文件已经循环的次数                                                             |
|     currentSrc      |  字符串  |                                                            当前播放的媒体文件的 URL                                                            |
|     currentTime     |  浮点数  |                                                                 已经播放的秒数                                                                 |
| defaultPlaybackRate |  浮点数  |                                                   取得或设置默认的播放速度。默认值为 1.0 秒                                                    |
|      duration       |  浮点数  |                                                            媒体的总播放时间（秒数）                                                            |
|        ended        |  布尔值  |                                                            表示媒体文件是否播放完成                                                            |
|        loop         |  布尔值  |                                                取得或设置媒体文件在播放完成后是否再从头开始播放                                                |
|        muted        |  布尔值  |                                                           取得或设置媒体文件是否静音                                                           |
|    networkState     |   整数   |               表示当前媒体的网络连接状态：0 表示空，1 表示正在加载，2 表示正在加载元数据，3 表示已经加载了第一帧，4 表示加载完成               |
|       paused        |  布尔值  |                                                               表示播放器是否暂停                                                               |
|    playbackRate     |  浮点数  | 取得或设置当前的播放速度。用户可以改变这个值，让媒体播放速度变快或变慢，这与 defaultPlaybackRate 只能由开发人员修改的 defaultPlaybackRate 不同 |
|       played        | 时间范围 |                                                          到目前为止已经播放的时间范围                                                          |
|     readyState      |   整数   |           表示媒体是否已经就绪（可以播放了）。0 表示数据不可用，1 表示可以显示当前帧，2 表示可以开始播放，3 表示媒体可以从头到尾播放           |
|      seekable       | 时间范围 |                                                               可以搜索的时间范围                                                               |
|       seeking       |  布尔值  |                                                    表示播放器是否正移动到媒体文件中的新位置                                                    |
|         src         |  字符串  |                                                   媒体文件的来源。任何时候都可以重写这个属性                                                   |
|        start        |  浮点数  |                                                  取得或设置媒体文件中开始播放的位置，以秒表示                                                  |
|     totalBytes      |   整数   |                                                             当前资源所需的总字节数                                                             |
|     videoHeight     |   整数   |                                               返回视频（不一定是元素）的高度。只适用于`<video>`                                                |
|     videoWidth      |   整数   |                                               返回视频（不一定是元素）的宽度。只适用于`<video>`                                                |
|       volume        |  浮点数  |                                                      取得或设置当前音量，值为 0.0 到 1.0                                                       |

### 16.3.2 　事件

|      事　　件       |                             触发时机                              |
| :-----------------: | :---------------------------------------------------------------: |
|        abort        |                             下载中断                              |
|       canplay       |                   可以播放时；readyState 值为 2                   |
|   canplaythrough    |          播放可继续，而且应该不会中断；readyState 值为 3          |
| canshowcurrentframe |               当前帧已经下载完成；readyState 值为 1               |
|   dataunavailable   |             因为没有数据而不能播放；readyState 值为 0             |
|   durationchange    |                       duration 属性的值改变                       |
|       emptied       |                           网络连接关闭                            |
|        empty        |                      发生错误阻止了媒体下载                       |
|        ended        |                    媒体已播放到末尾，播放停止                     |
|        error        |                       下载期间发生网络错误                        |
|        load         | 所有媒体已加载完成。这个事件可能会被废弃，建议使用 canplaythrough |
|     loadeddata      |                      媒体的第一帧已加载完成                       |
|   loadedmetadata    |                      媒体的元数据已加载完成                       |
|      loadstart      |                            下载已开始                             |
|        pause        |                            播放已暂停                             |
|        play         |                     媒体已接收到指令开始播放                      |
|       playing       |                        媒体已实际开始播放                         |
|      progress       |                             正在下载                              |
|     ratechange      |                        播放媒体的速度改变                         |
|       seeked        |                             搜索结束                              |
|       seeking       |                          正移动到新位置                           |
|       stalled       |                  浏览器尝试下载，但未接收到数据                   |
|     timeupdate      |              currentTime 被以不合理或意外的方式更新               |
|    volumechange     |                volume 属性值或 muted 属性值已改变                 |
|       waiting       |                    播放暂停，等待下载更多数据                     |

### 16.3.3 　自定义媒体播放器

> 使用`<audio>`和`<video>`元素的`play()`和`pause()`方法，可以手工控制媒体文件的播放。组合使用属性、事件和这两个方法，很容易创建一个自定义的媒体播放器，如下面的例子所示。

```html
<div class="mediaplayer">
  <div class="video">
    <video id="player" src="movie.mov" poster="mymovie.jpg" width="300" height="200">
          Video player not available.
      </video>
  </div>
  <div class="controls">
    <input type="button" value="Play" id="video-btn">
    <span id="curtime">0</span>/<span id="duration">0</span>
  </div>
</div>
```

```js
//取得元素的引用
var player = document.getElementById('player'),
  btn = document.getElementById('video-btn'),
  curtime = document.getElementById('curtime'),
  duration = document.getElementById('duration');

//更新播放时间
duration.innerHTML = player.duration;

//为按钮添加事件处理程序
EventUtil.addHandler(btn, 'click', function(event) {
  if (player.paused) {
    player.play();
    btn.value = 'Pause';
  } else {
    player.pause();
    btn.value = 'Play';
  }
});

//定时更新当前时间
setInterval(function() {
  curtime.innerHTML = player.currentTime;
}, 250);
```

## 16.4 　历史状态管理

> HTML5 通过更新 history 对象为管理历史状态提供了方便。

- `hashchange`

通过`hashchange`事件，可以知道 URL 的参数什么时候发生了变化，即什么时候该有所反应。而通过状态管理 API，能够在不加载新页面的情况下改变浏览器的 URL。为此，需要使用`history.pushState()`方法，该方法可以接收三个参数：`状态对象、新状态的标题和可选的相对URL`。

```js
history.pushState({ name: 'Nicholas' }, "Nicholas' page", 'nicholas.html');
```

按下“后退”按钮，会触发 window 对象的 popstate 事件 1。popstate 事件的事件对象有一个 state 属性，这个属性就包含着当初以第一个参数传递给`pushState()`的状态对象。

```js
EventUtil.addHandler(window, 'popstate', function(event) {
  var state = event.state;
  if (state) {
    //第一个页面加载时state为空
    processState(state);
  }
});
```

要更新当前状态，可以调用`replaceState()`，传入的参数与`pushState()`的前两个参数相同。调用这个方法不会在历史状态栈中创建新状态，只会重写当前状态。

```js
history.replaceState({ name: 'Greg' }, "Greg's page");
```

# 第 17 章 - 错误处理与调试

**学习目标**

- 理解浏览器报告的错误
- 处理错误
- 调试 JavaScript 代码

## 17.2 　错误处理

### 17.2.1 　 try-catch 语句

```js
try {
  window.someNonexistentFunction();
} catch (error) {
  alert(error.message);
}
```

**finally 子句**

> finally 子句一经使用，其代码无论如何都会执行。换句话说，try 语句块中的代码全部正常执行，finally 子句会执行；如果因为出错而执行了 catch 语句块，finally 子句照样还会执行。只要代码中包含 finally 子句，则无论 try 或 catch 语句块中包含什么代码——甚至 return 语句，都不会阻止 finally 子句的执行。

```js
function testFinally() {
  try {
    return 2;
  } catch (error) {
    return 1;
  } finally {
    return 0;
  }
}
```

这个函数在 try-catch 语句的每一部分都放了一条 return 语句。表面上看，调用这个函数会返回 2，因为返回 2 的 return 语句位于 try 语句块中，而执行该语句又不会出错。可是，由于最后还有一个 finally 子句，结果就会导致该 return 语句被忽略；也就是说，调用这个函数只能返回 0。如果把 finally 子句拿掉，这个函数将返回 2。

# 第 20 章 - Json

**学习目标**

- 理解 JSON 语法
- 解析 JSON
- 序列化 JSON

> 为了解决 XML 过于繁琐、冗长、这个问题，涌现了许多解决方案，JSON 就是其中一种，JSON 是 JavaScript 的一个严格的子集，通过一些模式来表示结构化的数据，需要理解的是它是一种数据格式，而不是一种编程语言。虽然具有相同的语法格式，但是 JSON 并不从属于 JavaScript。很多编程语言都有针对 JSON 的解析器和序列化器。

## 20.2 　解析与序列化

- `stringify()`
- `parse()`

```js
var book = {
  title: 'Professional JavaScript',
  authors: ['Nicholas C. Zakas'],
  edition: 3,
  year: 2011
};

var jsonText = JSON.stringify(book);
```

### 20.2.2 　序列化选项

**过滤结果**

如果过滤器参数是**数组**，那么 JSON.stringify()的结果中将只包含数组中列出的属性。来看下面的例子。

```js
var book = {
  title: 'Professional JavaScript',
  authors: ['Nicholas C. Zakas'],
  edition: 3,
  year: 2011
};

var jsonText = JSON.stringify(book, ['title', 'edition']);
console.log(jsonText);
// "{"title":"Professional JavaScript","edition":3}"
```

如果第二个参数是**函数**，行为会稍有不同。传入的函数接收两个参数，属性（键）名和属性值。根据属性（键）名可以知道应该如何处理要序列化的对象中的属性。属性名只能是字符串，而在值并非键值对儿结构的值时，键名可以是空字符串。

```js
var book = {
  title: 'Professional JavaScript',
  authors: ['Nicholas C. Zakas'],
  edition: 3,
  year: 2011
};

var jsonText = JSON.stringify(book, function(key, value) {
  switch (key) {
    case 'authors':
      return value.join(',');

    case 'year':
      return 5000;

    case 'edition':
      return undefined;

    default:
      return value;
  }
});
// "{"title":"Professional JavaScript","authors":"Nicholas C. Zakas","year":5000}"
```
