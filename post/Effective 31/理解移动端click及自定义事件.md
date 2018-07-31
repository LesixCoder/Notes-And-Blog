# 明白移动端 click 及自定义事件

## 前言

大家都知道移动端有 300ms 点击延迟，移动端尽量不要使用 click，因为 click 会比较迟钝，尽量使用 touchstart。但是 touchstart 也会有一个问题， 用户在滑动页面的时候要是不小心碰到了相关元素也会触发 touchstart。

首先为什么移动端的 click 会迟钝呢？因为移动端要判断是否是双击，所以单击之后不能够立刻触发 click, 要等 300ms, 直到确认不是双击了才触发 click。所以就导致了 click 有延迟。

## 解决延迟

在 2014 年的 Chrome32 版本已经把这个延迟去掉了，如果有一个 meta 标签

```html
<meta name="viewport" content="width=device-width">
```

把 viewport 设置成设备的实际像素，那么就不会有这 300ms 的延迟。

如果设置 `initial-scale=1.0`, 在 Chrome 上是可以生效的， 但是 Safari 不会

```html
<meta name="viewport" content="width=initial-scale=1.0">
```

还有第三种办法是设置 css

```css
html {
  touch-action: manipulation;
}
```

这样也可以取消掉 300ms 的延迟，Chrome 和 Safari 都可以生效。

## click/touch 触发顺序

要弄明白 click 的延迟原因，我们先要搞清楚 click 是在什么时候触发，并研究下它的触发顺序。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>移动端click及自定义事件</title>\
</head>

<body>
  <div id="target" style="height:100px;background-color:red">hello, world</div>

  <script>
    ! function() {
      var target = document.getElementById("target");
      var body = document.querySelector("body");
      var touchstartTime = 0;

      function log(event) {
        if(event.type === "touchstart") touchstartTime = Date.now();
        console.log(event.type, Date.now() - touchstartTime);
      }
      target.onclick = log;
      target.ontouchstart = log;
      target.ontouchend = log;
      target.ontouchmove = log;
      target.onmouseover = log;
      target.onmousedown = log;
      target.onmouseup = log;
    }();
  </script>
</body>
</html>
```

在浏览器下测试

![](http://cdn-blog.liusixin.cn/WX20180731-020119@2x.png)

从结果上看，click 是最后出发的，并且有 300ms 延迟，之所有实际结果会比 300ms 大是因为浏览器内核运行也会消耗时间。

然后我们加上 `viewport` 的 `meta` 标签，再看打印结果

![](http://cdn-blog.liusixin.cn/WX20180731-015945@2x.png)

可以看到， 300ms 的延迟没有了。

> 这里用加上 css 的 `touch-action: manipulation;`属性也会有一样的效果。

## tap 事件的实现

知道了 click 是在 touchend 之后触发的， 那么我们来尝试一下实现一个 tap 事件。

这里有两个库是可以快速实现 tap 无延迟的效果，一个是 zepto, 另一个是 fastclick。其中 zepto 有一个自定义事件 tap, 它是一个没有延迟的 click 事件。而 fastclick 是在 touchend 之后生成一个 click 事件，并立即触发这个 click, 再取消原本的 click 事件。他们原理都是一样的，都是在 touchend 之后触发，一个是触发它自己定义的 tap 事件，一个是触发原生 click。

还有一个关键的问题是如果用户是上下滑动也会频繁触发 tap 事件。怎么判定用户是单击还是在上下滑呢?

- **Zepto**：位移偏差
  - 记录下 touchstart 的初始位移， 然后 touchend 的位移减掉初始位移的偏差如果在 30 以内，则认为用户是单击，大于 30 就认为是滑动。
- **fastclick**：时间偏差
  - 分别记录 touchstart 和 touchend 的时间戳， 如果它们的时间差大于 700 毫秒，则认为是滑动操作，否则是单击操作。

**现在我们来实现一个按位移偏差判断的 tap。**

要实现一个自定义事件，有两种方式，第一种是像 jQuery/Zepto 一样，自己封装一个事件机制，第二种是调用原生的 `document.createEvent`, 然后再执行 `div.dispatchEvent(event)`, 这里我们使用第一种方式

先写一个选择器

```js
var $ = function(selector) {
  var dom = null;
  if (typeof selector === 'string') {
    dom = document.querySelectorAll(selector);
  } else if (selector instanceof HTMLElement) {
    dom = selector;
  }
  return new $Element(dom);
};
window.$ = $;
```

选择器的名称用＄， 它是一个函数，传进来的参数为选择器或者 DOM 元素，如果是字符串的选择器，则调用 `querySelectorAll` 去获取 DOM 元素，如果它已经是一个 DOM 则不用处理，最后返回一个 `$Element` 封装的实例，类似于 jQuery 对象。

现在来实现这个 `$Element` 的类

```js
class $Element {
  constructor(_doms) {
    var doms =
      _doms.constructor === Array || _doms.constructor === NodeList
        ? _doms
        : [_doms];
    this.doms = doms;
    this.init();
    for (var i = 0; i < doms.length; i++) {
      this[i] = doms[i]; // 把 this 当作一个数组， DOM 元素当作这个数组的元素。 这样就可以通过索引获取 DOM 元素
      if (!doms[i].listeners) {
        doms[i].listeners = {};
      }
    }
  }
}
```

`$Element` 的构造函数里面，先判断参数的类型，如果它不是一个数组或是用 `querySelectorAll` 返回的 `NodeList` 类型，则构造一个 DOM 数组。然后给这些 DOM 对象添加一个 `listeners` 的属性，用来存放事件的回调函数。

> 一般不推荐给原生对象添加东西。但是从简单考虑，这里先用这样的方法。

上面 `this[i] = doms[i];` 这步注释已经写明，然后就可以通过以下方式获取

```js
var value = $('input')[0].value;
```

它是一个伪数组，是一个 `$Element` 实例，又有 length, 可以通过 index 获取元素，这部分代码也让我们知道了 arguments 实例、jQuery 对象这种伪数组是怎么来的。

上面代码还调用了一个 init, 这个 init 函数用来添加 tap 事件。

```js
init() {
  for (var i = 0; i < this.doms.length; i++){
    if(!this.doms[i].listeners) {
      this.initTapEvent(this.doms[i]);
    }
  }
}
```

还需要提供事件绑定和触发的 API

```js
on(eventType, callback) {
  for (var i = 0; i < this.doms.length; i++) {
    var dom = this.doms[i];
    if (!dom.listeners[eventType]) {
      dom.listeners[eventType] = [];
    }
    dom.listeners[eventType].push(callback);
  }
}
```

on 函数会给 DOM 的 `listeners` 属性添加相应事件的回调， 每种事件类型都用一个数组存储。

触发的代码

```js
trigger(eventType, event){
  for(var i = 0; i < this.doms.length; i++) {
    $Element.dispatchEvent(this.doms[i], eventType, event);
  }
}

static dispatchEvent(dom, eventType, event){
  var listeners = dom.listeners[eventType];
  if(listeners){
    for(var i = 0; i < listeners.length; i++) {
      listeners[i].call(dom, event);
    }
  }
}
```

根据不同的事件类型去取回调函数的数组，依次执行。

现在重点来说一下怎么添加一个 tap 事件， 即上面的 `initTapEvent` 函数

```js
initTapEvent(dom) {
  var x1 = 0,
    x2 = 0,
    y1 = 0,
    y2 = 0;
  dom.addEventListener("touchstart", function(event) {

  });
  dom.addEventListener("touchmove", function(event) {

  });
  dom.addEventListener("touchend", function(event) {

  });
}
```

实现的思路是这样的， 在 touchstart 的时候记录 x1 和 y1 的位置

```js
dom.addEventListener('touchstart', function(event) {
  var touch = event.touches[0];
  x1 = x2 = touch.pageX;
  y1 = y2 = touch.pageY;
});
```

> 如果你用两根手指的话， 那么 `event.touches.length` 就是 2, 如果是 3 根则为 3, 进而分别获得到每根手指的位置，由于我们是单点，所以就获取第一个手指的位置即可。`pageX/pageY` 是相对于当前 HTML 页面的位置，而 `clientX` 和 `clientY` 是相对于视图窗口的位置。

然后在 touchmove 的时候获取到最新的移动位置

```js
dom.addEventListener('touchmove', function(event) {
  var touch = event.touches[0];
  x2 = touch.pageX;
  y2 = touch.pageY;
});
```

最后 touchend 的时候，比较位移偏差

```js
dom.addEventListener('touchend', function(event) {
  if (Math.abs(x2 - x1) < 10 && Math.abs(y2 - y1) < 10) {
    $Element.dispatchEvent(dom, 'tap', new $Event(x1, y1));
  }
  y2 = x2 = 0;
});
```

如果两者的位移差小千 10, 则认为是 tap 事件，并触发这个事件。这里封装了定义事件

```js
class $Event {
  constructor(pageX, pageY) {
    this.pageX = pageX;
    this.pageY = pageY;
  }
}
```

然后就可以使用这个 tap 事件

```js
$('#target').on('tap', function(event) {
  console.log('tap', event.pageX, event.pageY);
});
```

![](http://cdn-blog.liusixin.cn/WX20180731-031110@2x.png)

当单击目标区域的时候就会执行 tap 回调，而上下滑动的时候则不会触发。

再比较一下 tap 和原生 click 的触发时间的差别，需要给自定义事件添加一个 click

```js
dom.addEventListener('click', function(event) {
  $Element.dispatchEvent(dom, 'click', new $Event(event.pageX, event.pageY));
});
```

我们用一个 tapTime 记录一下时间

```js
var tapTime = 0;
$('#target').on('tap', function(event) {
  tapTime = Date.now();
  console.log('tap', tapTime);
});
$('#target').on('click', function(event) {
  console.log('click time diff', Date.now() - tapTime);
});
```

![](http://cdn-blog.liusixin.cn/WX20180731-032739@2x.png)

click 会大概慢 200ms, 可能是因为它前面还要触发 mouse 的事件。

这样我们就实现了一个自定义 tap 事件，fastclick 是使用原生的 Event, 在 touchend 的回调函数里面执行。

```js
touch = event.changedTouches[O];
// Synthesise a click event, with an extra attribute so it can be tracked
clickEvent = document.createEvent('MouseEvents');
clickEvent.initMouseEvent(
  this.determineEventType(targetElement),
  true,
  true,
  window,
  1,
  touch.screenX,
  touch.screenY,
  touch.clientX,
  touch.clientY,
  false,
  false,
  false,
  false,
  0,
  null
);
clickEvent.forwardedTouchEvent = true;
targetElement.dispatchEvent(clickEvent);
```

然后再调用 `event.preventDefault` 禁掉原本的 click 事件的触发。它里面还做了其他一些兼容性的处理。

这个时候如果要做一个放大的事件，可以在 `touchstart` 里面获取 `event.touches` 两根手指的初始位置，保存初始化手指的距离，然后在 `touchmove` 里面再次获取新位置，计算新的距离减掉老的距离，如果是正数则说明是放大，反之缩小，放大和缩小的尺度也是可以取一个相对值。手机 Safari 有一个 `gesturestart/gesturechange/gestureend` 事件，在 `gesturechange` 的 event 里面有一个放大比例 scale 的属性。

## 摇一摇事件

HTML5 新增了一个 `devicemotion` 的事件，可以使用手机的重力感应

```js
window.ondevicemotion = function(event) {
  var gravity = event.accelerationIncludingGravity;
  console.log(gravity.x, gravity.y, gravity.z);
};
```

x, y, z 表示三个方向的重力加速度

![](http://cdn-blog.liusixin.cn/WX20180731-034305@2x.png)

x 是手机短边，y 是长边，z 是和手机屏幕垂直的方向，当把手机平着放的时候，由于 x、y 和地平线平行， 所以 `g(x) = g(y) = 0`, 而 z 和地平线垂直， 所以 `g(z) = 9.8` 左右， 同理当把手机竖着放的时候，`g(x) = g(z) = 0`, 而 `g(y) = -9.8`。

`devicemotion` 事件会不断地触发，而且触发得很快。当我们把手机拿起来摇一摇的时候

![](http://cdn-blog.liusixin.cn/WX20180731-034646@2x.png)

y 轴和 x 轴的变化范围从 `-45°` 到 `+45°`, 即这个区间是：`delta = 9.8 * sin(45°) * 2 = 13.8`。即只要 x 轴和 y 轴的 g 值变化超过 13.8, 我们就认为发生了摇一摇事件。

根据上面的分析，我们就可以写出代码：

```js
const EMPTY_VALUE = 100;
const THREAD_HOLD = 13.8;
var minX = EMPTY_VALUE,
  minY = EMPTY_VALUE;
window.ondevicemotion = function(event) {
  var gravity = event.accelerationIncludingGravity,
    x = gravity.x,
    y = gravity.y;
  if (x < minX) minX = x;
  if (y < minY) minY = y;
  if (Math.abs(x - minX) > THREAD_HOLD && Math.abs(y - minY) > THREAD_HOLD) {
    console.log('shake');
    var event = new CustomEvent('shake');
    window.dispatchEvent(event);
    minX = minY = EMPTY_VALUE;
  }
};

window.addEventListener('shake', function() {
  console.log('window shake callback was called');
});
```

用一个 minX 和 minY 记录最小的值，每次 devicemotion 触发的时候就判断当前的 g 值与最小值的差值是否超过了阈值，如果是的话就创建一个 `CustomEvent` 的实例，然后 `dispatch` 给 window, window 上监听的 onshake 事件就会触发了。

这样就实现了一个摇一摇 shake 事件。如果太难触发可以把阈值改小一点。

## 总结

本文比较了移动端 touch 事件和 click 事件的区别， 以及怎么去掉 click 事件的 300ms 延迟，怎么实现一个快速响应的 tap 事件，怎么封装和触发自定义事件，还有摇一摇的原理是怎么样的， 怎么实现一个摇一摇的 shake 事件。

上面用一个 `$Element` 的类，由它负责决定是否触发 tap, 而调用者不需要关心 tap 事件触发的细节，这个 `$Element` 就相当于一个事件代理，或者也可以把 tap 当作一个门面。所以它是一个代理模式或门面模式。
