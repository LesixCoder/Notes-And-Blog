## 面向对象

### 构造函数与原型

new 关键字在创建实例时经历了如下过程:

- 先创建一个新的、空的实例对象;
- 将实例对象的原型，指向构造函数的原型;
- 将构造函数内部的 this，修改为指向实例;
- 最后返回该实例对象;

如果使用 `Prototype` 指代原型对象，那么构造函数、原型、实例之间有如下关系。

```js
// -> 表示指向
Person.prototype -> Prototype;
p1.__proto__ -> Prototype;
p2.__proto__ -> Prototype; Prototype.constructor -> Person
```

因为在构造函数中声明的变量与方法只属于当前实例，因此我们可以将构造函数中声明的属性与方法称为该实例的**私有属性与方法**，它们只能被当前实例访问。

而原型中的方法与属性能够被所有的实例访问，因此我们将原型中声明的属性与方法称为**公有属性与方法**。

与在原型中添加一个方法不同，当在构造函数中声明一个方法时，每创建一个实例，该方法都会被重新创建一次。而原型中的方法仅仅只会被创建一次(这也是我们称其为私有方法的原因之一)。

因此在构造函数中，声明私有方法会消耗更多的内存空间。如果构造函数中声明的 `私有方法/属性` 与原型中的 `公有方法/属性` 重名，那么会优先访问 `私有方法/属性`

可以通过 in 来判断一个对象是否拥有某一个 `方法/属性`，无论该 `方法/属性` 是否公有。

我们常常使用 in 的这种特性来判断当前页面所处的环境是否在移动端。

```js
// 特性检测，只有移动端环境才支持 touchstart 事件
var isMobile = 'ontouchstart' in document;
```

### 更简单的原型写法

要想在原型上添加很多的方法与属性，则可以这样写。

```js
function Person() {}
Person.prototype.getName = function() {};
Person.prototype.getAge = function() {};
Person.prototype.sayHello = function() {};
```

还可以使用更为简洁的对象字面量的写法来添加原型方法。

```js
Person.prototype = {
  constructor: Person,
  getName: function() {},
  getAge: function() {},
  sayHello: function() {}
};
```

### 原型链

当创建一个对象时，可以使用 `new Object()` 来创建。因此 `Object` 其实是一个构造函数，而其对应的原型 `Object.prototype` 则是原型链的终点。

当创建函数时，除可以使用 `function` 关键字外，还可以使用 `Function` 对象。

```js
var add = new Function('a', 'b', 'return a + b');
// 等价于
var add = function(a, b) {
  return a + b;
};
```

因此这里创建的 `add` 方法是一个实例，它对应的构造函数是 `Function`，它的原型是 `Function.prototype`。

```js
add.__proto__ === Function.prototype; // true
```

这里还有一个非常特殊的地方，`Function` 同时是 `Function.prototype` 的构造函数与实例。

```js
add.__proto__ === Function.prototype; // true
Function.prototype.constructor === Function; // true
Function.prototype === Function.prototype; // true
Function.__proto__ === Function.prototype; // true
add instanceof Function; // true 判断 add 是否是构造函数 Function 的实例
```

而与此同时，`Function.prototype` 不仅是 `Function` 的原型，还是 `Object.prototype` 的实例。

```js
Function.prototype.__proto__ === Object.prototype;
Function instanceof Function; // true
```

所有的函数都是构造函数 `Function` 的实例

```js
Object.__proto__ === Function.prototype; // true
Object instanceof Function; // true
```

对原型链上方法与属性的访问，与作用域链的访问类似，也是一个单向的查找过程。虽然 `add` 方法与 `Object` 并没有直接的关系，但是它们同处于一条原型链上，因此 `add` 可以根据原型链的特点访问 `Object` 上的方法。

```js
function add() {}
add.toString === Object.toString; // true
```

> 需要注意的是，当构造函数与原型拥有同名的 `方法/属性` 时，如果用创建的实例访问该 `方法/属性`，则优先访问构造函数的 `方法/属性`。

### 实例方法、原型方法、静态方法

构造函数中的 this 指向的是新创建的实例, 因此在往 `this` 上添加方法与属性时，其实是在往新创建的实例上添加属性与方法，所以构造函数中的方法可称之为 **实例方法**。

而通过 `prototype` 添加的方法，将会挂载到原型对象上，因此称之为 **原型方法**。

方法被直接挂载在构造函数上，我们称之为 **静态方法**。静态方法不能通过实例访问，只能通过构造函数来访问。

```js
function Foo() {
  this.bar = function() {
    return 'bar in Foo'; // 实例方法
  };
}

Foo.bar = function() {
  return 'bar in static'; // 静态方法
};

Foo.prototype.bar = function() {
  return 'bar in prototype'; // 原型方法
};
```

静态方法又称为工具方法，常用来实现一些常用的，与具体实例无关的功能。例如遍历方法 `each`。

### 继承

封装一个对象是由构造函数与原型共同组成的，所以继承也被分为有**构造函数的继承**与**原型的继承**两种。

```js
var Person = function(name, age) {
  this.name = name;
  this.age = age;
};

Person.prototype.getName = function() {
  return this.name;
};

Person.prototype.getAge = function() {
  return this.age;
};
```

构造函数的继承,可以借助 `call/apply` 来实现

```js
var Student = function(name, age, grade) {
  // 通过 call 方法还原 Person 构造函数中的所有处理逻辑
  Student.call(Person, name, age);
  this.grade = grade;
};
// 等价于
var Student = function(name, age, grade) {
  this.name = name;
  this.age = age;
  this.grade = grade;
};
```

原型的继承，首先应该考虑，如何将子类对象的原型加到原型链中? 其实只需让子类对象的原型成为父类对象的一个实例 ， 然后通过 `__proto__` 访问父类对象的原型，这样就继承了父类原型中的方法与属性了。

可以先封装一个方法，该方法会根据父类对象的原型创建一个实例，该实例即为子类对象的原型。

```js
function create(proto, options) {
  // 创建一个空对象
  var tmp = {};
  // 让这个新的空对象成为父类对象的实例
  tmp.__proto__ = proto;
  // 传入的方法都挂栽到新对象上，新对象将作为子类对象的原型
  Object.defineProperties(tmp, options);
  return tmp;
}
```

实现原型的继承

```js
Student.prototype = create(Person.prototype, {
  // 不要忘了重新指定构造函数
  constructor: {
    value: Student
  }
  getGrade: {
    value: function() {
      return this.grade
    }
  }
})

var s1 = new Student('ming', 22, 5);
console.log(s1.getName()); // ming
console.log(s1.getAge()); // 22
console.log(s1.getGrade()); // 5
```

在 ECMAScript5 中直接提供了一个 `Object.create` 方法来完成上面封装的 `create` 的功能，因此可以直接使用 `Object.create`。

```js
Student.prototype = Object.create(Person.prototype, {
  // 不要忘了重新指定构造函数
  constructor: {
    value: Student
  }
  getGrade: {
    value: function() {
      return this.grade
    }
  }
})
```

### 属性类型

`defineProperties` 是对象中的属性类型。通常给对象添加一个属性时，直接使用 `object.param` 的方式就可以了，或者直接在对象中挂载。

```js
var person = {
  name: 'TOM'
};
```

在 ECMAScript5 中，对每个属性都添加了几个属性类型，用来描述这些属性的特点，具体如下。

- `configurable`: 表示该属性是否能被 `delete` 删除。当其值为 false 时，其他的特性也不能被改变。默认值为 true。
- `enumerable`: 是否能枚举。即是否能被 `for-in` 遍历。默认值为 true。
- `writable`: 是否能修改值，默认为 true。
- `value`: 该属性的具体值是多少，默认为 `undefined`。
- `get`:当通过 `person.name` 访问 `name` 的值时，`get`将被调用。该方法可以自定义返回的具体值是多少，`get`的默认值为 `undefined`。
- `set`: 当通过 `person.name ='Jake'`设置 name 的值时，`set` 方法将被调用。该方法可以自定义设置值的具体方式。`set`的默认值为 `undefined`。

> 不能同时设置 value、writable 与 get、set 的值 。 可以通过 `Object.defineProperty` 方法来修改这些属性类型。

### 读取属性的特性值

可以使用 `Object.getOwnPropertyDescriptor` 方法读取某一个属性的特性值。

```js
var person = {};
Object.defineProperty(person, 'name', {
  value: 'alex',
  writable: false,
  configurable: false
});

var descripter = Object.getOwnPropertyDescriptor(person, 'name');
console.log(descripter);
// 返回结果如下
descripter = {
  configurable: false,
  enumerable: false,
  value: 'alex',
  writable: false
};
```

## jQuery 封装详解

**我们来实现一个简化版的 jQuery 库**

一个库就是一个单独的模块，因此应使用自执行函数的方式模拟一个模块。

```js
(function() {
  // do something
});
```

既然能够在全局直接调用 jQuery，则说明 jQuery 被挂载在了全局对象上。 块中对外提供接口时，可以采取 `window.jQuery` 的方式。

```js
var jQuery = function() {};
// ...
window.jQuery = jQuery;
```

我们在使用过程中，使用了 $，其实只是多加了一个赋值操作。

```js
window.$ = window.jQuery = jQuery;
```

在使用过程中直接使用 $，其实相当于直接调用构造函数 jQuery 创建了一个实例，而没有用 new。 我们知道创建实例 new 关键字是必不可少的，由此说明 new 的操作被放在了 jQuery 方法中来实现，而 jQuery 并不是真正的构造函数。

```js
(function(ROOT) {
  // 构造函数
  var jQuery = function(selector) {
    // 在该方法中直接返回new创建的实例，
    // 因此这里的 init 才是真正的构造函数
    return new jQuery.fn.init(selector);
  };

  jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    version: '1.0.0',
    init: function(selector) {
      var elem, selector;
      elem = document.querySelector(selector);
      this[0] = elem;

      // 在jQuery中返回的是一个由所有原型属性方法组成的数组，
      // 这里做了简化，直接返回this即可
      return this;
    },

    // 在原型上添加一堆方法
    toArray: function() {},
    get: function() {},
    each: function() {},
    ready: function() {},
    first: function() {},
    slice: function() {}
    // ...more
  };

  // 让 init 方法的原型指向jQuery的原型
  jQuery.fn.init.prototype = jQuery.fn;

  ROOT.jQuery = ROOT.$ = jQuery;
})(window);
```

在上面的实现中，首先在 jQuery 构造函数中声明了一个 `fn` 属性，并将其指向了原型 `jQuery.prototype`。 随后在原型对象中添加了 `init` 方法。

```js
jQuery.fn = jQuery.prototype = {
  init: function() {}
};
```

之后又将 `init` 的原型指向了 `jQuery.prototype`。

```js
jQuery.fn.init.prototype = jQuery.fn;
```

而在构造函数 `jQuery` 中 ，则返回了 `init` 的实例对象。

```js
var jQuery = function(selector) {
  return new jQuery.fn.init(selector);
};
```

最后对外暴露接口时，将字符 `$` 与方法 `jQuery` 对等起来。

```js
ROOT.jQuery = ROOT.$ = jQuery;
```

因此当使用 `$('#test')` 创建一个 jQuery 实例时，实际上调用的是 `jQuery('#test')` 创建的一个 `init` 实例。这里正在构造函数的是原型中的 `init` 方法。

### 扩展方法

jQuery 提供了两个扩展接口来帮助自定义 jQuery 的方法，通常称自定义的 jQuery 方法为 jQuery 桶件。

```js
(function(ROOT) {
  // 构造函数
  var jQuery = function(selector) {
    // 在该方法中直接返回new创建的实例，
    // 因此这里的 init 才是真正的构造函数
    return new jQuery.fn.init(selector);
  };

  jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    version: '1.0.0',
    init: function(selector) {
      var elem, selector;
      elem = document.querySelector(selector);
      this[0] = elem;

      // 在jQuery中返回的是一个由所有原型属性方法组成的数组，
      // 这里做了简化，直接返回this即可
      return this;
    },

    // 在原型上添加一堆方法
    toArray: function() {},
    get: function() {},
    each: function() {},
    ready: function() {},
    first: function() {},
    slice: function() {}
    // ...more
  };

  // 让 init 方法的原型指向jQuery的原型
  jQuery.fn.init.prototype = jQuery.fn;

  // 实现 jQuery 的两种扩展方法
  jQuery.extend = jQuery.fn.extend = function(options) {
    // 在jQuery源码中根据参数不同进行不同的判断，这里假设只有一种方式
    var target = this;
    var copy;

    for (name in options) {
      copy = options[name];
      target[name] = copy;
    }
    return target;
  };

  // jQuery利用上面实现的扩展机制，添加了许多方法

  // 添加静态扩展方法，即工具方法
  jQuery.extend({
    isFunction: function() {},
    type: function() {},
    parseHTML: function() {},
    parseJSON: function() {},
    ajax: function() {}
    // ...more
  });

  // 添加原型方法
  jQuery.fn.extend({
    queue: function() {},
    promise: function() {},
    attr: function() {},
    prop: function() {},
    addClass: function() {},
    removeClass: function() {},
    val: function() {},
    css: function() {}
    // ...more
  });

  ROOT.jQuery = ROOT.$ = jQuery;
})(window);
```

在上面的代码中，我们通过下面的方式简单实现了两个扩展方法。

```js
jQuery.extend = jQuery.fn.extend = function(options) {
  // 在jQuery源码中根据参数不同进行不同的判断
  // 而这里直接用了一种方式 ，所以就不用判断了
  var target = this;
  var copy;

  for (name in options) {
    copy = options[name];
    target[name] = copy;
  }
  return target;
};
```

要理解它的实现，首先要明确知道内部 `this` 的指向。传人的参数 `options` 对象是一个 `key-value` 模式的对象。我们可以通过 `for in` 遍历 `options`，将 `key` 作为新的属性，`value`作为该属性对应的新方法，分别添加到 `jQuery` 与 `jQuery.fn` 中。

也就是说，当通过 `$.extend` 扩展 jQuery 时，方法被添加到了静态方法中;而通过 `$.fn.extend` 扩展 jQuery 时，方法被添加到了原型对象中。静态方法可以直接调用，因此也被称为工具方法。

```js
$.ajax();
$.isFunction();
$.each();
```

原型方法必须通过声明的实例才能调用

```js
$('#test').css();
$('#test').attr();
```

## 封装一个拖曳对象

### 1. 如何让一个 DOM 元素动起来

拖曳的本质就是让 DOM 元素能够跟着鼠标运动起来。

在页面中创建一个 class 名为 autumn 的 div 标签，它的基本样式如下:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>拖拽封装</title>
  <style>
    .autumn {
      width: 20px;
      height: 20px;
      background-color: orange;
    }
  </style>
</head>

<body>
  <div class="autumn"></div>
</body>
</html>
```

当页面所处的环境支持 CSS3 属性 `translate` 时，修改 `left/top` 会导致频繁的重排与回流，因此我们在处理元素运动时修改 `translate` 的值。

```css
.autumn {
  transform: translateX(0px);
}
```

为了考虑兼容性，需要判断当前浏览器环境支持的 `transform` 属性是哪一种

```js
// 获取当前浏览器支持的 transform兼容写法
function getTransform() {
  var transform = '',
    divStyle = document.createElement('div').style,
    _transforms = [
      'transform',
      'webkitTransform',
      'MozTransform',
      'msTransform',
      'OTransform'
    ],
    i = 0,
    len = _transforms.length;

  for (; i < len; i++) {
    if (_transforms[i] in divStyle) {
      // 找到之后立即返回，结束函数
      return (transform = _transforms[i]);
    }
  }

  // 如果没有找到，就直接返回空字符串
  return transform;
}
```

该方法用于获取当前浏览器支持的 `transform` 属性。 如果返回空字符串，则表示该浏览器不支持 `transform`，这个时候就要考虑选择 `left/top`。

### 2. 如何获取元素的初始位置

为了获取元素的初始位置，需要声明一个专门用来获取元素样式的功能函数。获取元素样式的方法在 IE 中与其他浏览器中有所不同，所以需要一个兼容性的写法:

```js
function getStyle(elem, property) {
  // IE通过 currentStyle 来获取元素的样式，
  // 其他浏览器通过 getComputedStyle 来获取
  return document.defaultView.getComputedStyle
    ? document.defaultView.getComputedStyle(elem, false)[property]
    : elem.currentStyle[property];
}
```

有了这个方法之后，我们就可以动手来实现一个获取元素位置的方法了

```js
function getTargetPos(elem) {
  var pos = { x: 0, y: 0 };
  var transform = getTransform();
  if (transform) {
    var transformValue = getStyle(elem, transform);
    if (transformValue == 'none') {
      elem.style[transform] = 'translate(0, 0)';
      return pos;
    } else {
      var temp = transformValue.match(/-?\d+/g);
      return (pos = {
        x: parseInt(temp[4].trim()),
        y: parseInt(temp[5].trim())
      });
    }
  } else {
    if (getStyle(elem, 'position') == 'static') {
      elem.style.position = 'relative';
      return pos;
    } else {
      var x = parseInt(getStyle(elem, 'left') ? getStyle(elem, 'left') : 0);
      var y = parseInt(getStyle(elem, 'top') ? getStyle(elem, 'top') : 0);
      return (pos = {
        x: x,
        y: y
      });
    }
  }
}
```

在拖曳过程中，需要不停地设置目标元素的位置，这样它才能够移动起来，因此还需要声明一个设置元素位置的方法。

```js
// pos = { x: 200, y: 100 }
function setTargetPos(elem, pos) {
  var transform = getTransform();
  if (transform) {
    elem.style[transform] = 'translate(' + pos.x + 'px, ' + pos.y + 'px)';
  } else {
    elem.style.left = pos.x + 'px';
    elem.style.top = pos.y + 'px';
  }
  return elem;
}
```

有了这几个工具方法后，就可以使用更为完善的方式来实现上述要求的效果了

```js
var autumn = document.querySelector('.autumn');

autumn.addEventListener(
  'click',
  function() {
    var curPos = getTargetPos(this);
    setTargetPos(this, {
      x: curPos.x + 5,
      y: curPos.y
    });
  },
  false
);
```

#### 拖曳的原理

可以结合 mousedown、mousemove、mouseup 这三个事件来实现拖曳。在这些事件触发的回调函数中得到了一个事件对象，通过事件对象即可获取当前鼠标所处的精确位置。

当鼠标按下(`mousedown`触发)时，需要记住鼠标的初始位置与目标元素的初始位置。当鼠标移动时，目标元素也跟着移动，因此鼠标与目标元素的位置有如下关系:
`移动后鼠标位置-鼠标初始位置=移动后目标元素位置一目标元素初始位置`

如果鼠标位置的差值用变量 `dis` 来表示，那么目标元素的位置就等于:

`移动后目标元素位置=dis+目标元素的初始位置`

通过事件对象中提供的鼠标精确位置信息，在鼠标移动时可以轻易地计算出鼠标移动位置的差值，然后根据上面的关系，计算出目标元素的当前位置，这样拖曳就能够实现了。

#### 代码实现

准备工作

```js
// 获取目标元素对象
var autumn = document.querySelector('.autumn');
// 声明2个变量用来保存鼠标初始位直的x, y坐标
var startX = 0;
var startY = 0;
// 声明2个变量用来保存目标元素初始位直的X, y坐标
var sourceX = 0;
var sourceY = 0;
```

功能函数

```js
// 获取当前浏览器支持的 transform 兼容写法
function getTransform() {}

// 获取元素属性
function getStyle(elem, property) {}

// 获取元素的初始位直
function getTargetPos(elem) {}

// 设置元素的初始位直
function setTargetPos(elem, potions) {}
```

声明三个事件的回调

```js
autumn.addEventListener('mousedown', start, false);

// 绑定在 mousedown 上的回调，event为传入的事件对象
function start(event) {
  // 获取鼠标初始位直
  startX = event.pageX;
  startY = event.pageY;

  // 获取元素初始位置
  var pos = getTargetPos(autumn);

  sourceX = pos.x;
  sourceY = pos.y;

  // 绑定
  document.addEventListener('mousemove', move, false);
  document.addEventListener('mouseup', end, false);
}

function move(event) {
  // 获取鼠标当前位置
  var currentX = event.pageX;
  var currentY = event.pageY;

  // 计算差值
  var distanceX = currentX - startX;
  var distanceY = currentY - startY;

  // 计算并设直元素当前位置
  setTargetPos(autumn, {
    x: (sourceX + distanceX).toFixed(),
    y: (sourceY + distanceY).toFixed()
  })
}

function end(event) {
  document.removeEventListener('mousemove', move);
  document.removeEventListener('mouseup', end); 
  // do other things
}
```

至此，一个简单的拖曳就实现了。

### 使用面向对象进行封装

为了避免变量污染，我们需要将模块放置在一个函数自执行方式模拟的块级作用域中。

```js
(function() {
  // ...
})();
```

**而我们面临的挑战是，如何合理地处理属性与方法的位置。**

- **构造函数中**：属性与方法为当前实例所单独拥有，只能被当前实例访问，并且每声明一个实例，其中的方法都会被重新创建一次。
- **原型中**： 属性与方法为所有实例共同拥有，可以被所有实例访问，新声明的实例不会重复创建方法。
- **模块作用域中**：属性和方法不能被任何实例访问，但是能被内部方法访问，新声明的实例不会重复创建相同的方法。

对于方法的判断则比较简单，因为构造函数中的方法总是在声明 一个新的实例时被重复创建，因此声明方法时应尽量避免出现在构造函数中。如果你的方法中需要用到构造函数中的变量，或者想要公开，那么就需要放在原型中。如果方法需要私有不被外界访问，那么就放置在模块作用域中。

关于面向对象，上面的几点必须认真思考。如果在封装时没有思考清楚，则很可能会遇到很多意想不到的 bug，所以建议大家结合自己的开发经验，多多思考，总结出自己的观点。

```js
(function() {
  // 这是一个私有属性，不需要被实例访问 
  var transform = getTransform();

  function Drag(selector) {
    // 放在构造函数中的属性，被每一个实例所单独拥有
    this.elem = typeof selector == 'Object' ? selector : document.getElementById(selector);
    this.startX = 0;
    this.startY = 0;
    this.sourceX = 0;
    this.sourceY = 0;

    this.init();
  }

  // 原型
  Drag.prototype = {
    constructor: Drag,

    init: function() {
      // 初始时需要做哪些事情
      this.setDrag();
    },

    // 稍作改造，仅用于获取当前元素的属性，类似于getName
    getStyle: function(property) {
      return document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(this.elem, false)[property] : this.elem.currentStyle[property];
    },

    // 用来获取当前元素的位直信息，注意与之前的不同之处
    getPosition: function() {
      var pos = {
        x: 0,
        y: 0
      };
      if (transform) {
        var transformValue = this.getStyle(transform);
        if (transformValue == 'none') {
          this.elem.style[transform] = 'translate(0, 0)';
        } else {
          var temp = transformValue.match(/-?\d+/g);
          pos = {
            x: parseInt(temp[4].trim()),
            y: parseInt(temp[5].trim()),
          }
        }
      } else {
        if (this.getStyle('position') == 'static') {
          this.elem.style.position = 'relative';
        } else {
          pos = {
            x: parseInt(this.getStyle('left') ? this.getStyle('left') : 0),
            y: parseInt(this.getStyle('top') ? this.getStyle('top') : 0)
          }
        }
      }

      return pos;
    },

    // 用来设直当前元素的位置
    setPosition: function(pos) {
      if (transform) {
        this.elem.style[transform] = 'translate(' + pos.x + 'px, ' + pos.y + 'px)';
      } else {
        this.elem.style.left = pos.x + 'px';
        this.elem.style.top = pos.y + 'px';
      }
    },

    // 该方法用来绑定事件
    setDrag: function() {
      var self = this;
      this.elem.addEventListener('mousedown', start, false);

      function start(event) {
        self.startX = event.pageX;
        self.startY = event.pageY;

        var pos = self.getPosition();

        self.sourceX = pos.x;
        self.sourceY = pos.y;

        document.addEventListener('mousemove', move, false);
        document.addEventListener('mouseup', end, false);
      }

      function move(event) {
        var currentX = event.pageX;
        var currentY = event.pageY;

        var distanceX = currentX - self.startX;
        var distanceY = currentY - self.startY;

        self.setPosition({
          x: (self.sourceX + distanceX).toFixed(),
          y: (self.sourceY + distanceY).toFixed()
        })
      }

      function end(event) {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', end);
        // do other things
      }
    }
  }

  // 私有方法，仅仅用来获取 transform 的兼容写法
  function getTransform() {
    var transform = '',
      divStyle = document.createElement('div').style,
      transformArr = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'],
      i = 0,
      len = transformArr.length;

    for(;i<len;i++) {
      if(transformArr[i] in divStyle) {
        return transform = transformArr[i]
      }
    }

    return transform;
  }

  // 对外暴露方法
  window.Drag = Drag;
})();

// 使用
new Drag('target');
```

这样一个拖曳对象就封装完成了。

### 将拖曳对象扩展为一个 jQuery 插件

jQuery 中可以使用 `$.extend` 扩展 jQuery 工具方法，来使用 `$.fn.extend` 扩展原型方法。当然，这里的拖曳插件扩展为原型方法是最合适的。

```js
//通过扩展方法将拖曳扩展为 jQuery 的一个实例方法
(function($) {
  $.fn.extend({
    canDrag: function() {
      new Drag(this[0]);
      return this;
      // 注意:为了保证 jQuery 所有的方法都能够链式访问， 
      // 每一个方法的最后都需妥返回 this, 即返回 jQuery 实例
    }
  })
})(jQuery);
```

这样就能够很轻松地让目标 DOM 元素具备拖曳能力了。

```js
$('target').canDrag();
```

## 封装一个选项卡

通常情况下，选项卡由两部分组成。一部分是头部，它包含一堆按钮，每一个按钮对应不同的页面，按钮包括选中与无法选中两种状态。另一部分则由一些具体的页面组成，当我们单击按钮时，就切换到对应的页面。

> 如果每个页面中包含的是根据动态加载的数据渲染出来的界函，那么通常只会有一个页面，单击按钮时重新加载数据并重新渲染页面。

先初始化html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>封装选项卡</title>
  <style>
    body {
      margin: 0;
    }
    ul, li {
      list-style: none;
      padding: 0;
    }
    .box {
      max-width: 400px;
      margin: 10px auto;
      background: #efefef;
    }
    .box .tab_options {
      height: 40px;
      display: flex;
      justify-content: space-around;
      border-bottom: 1px solid #ccc;
    }
    .box .tab_options li {
      line-height: 40px;
      cursor: pointer;
    }
    .box .tab_options li.active {
      color: red;
      border-bottom: 1px solid red;
    }
    .box .tab_content {
      position: relative;
      min-height: 400px;
    }
    .box .tab_content .item_box {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      text-align: center;
      display: none;
    }
    .box .tab_content .item_box.active {
      display: block;
    }
  </style>
</head>
<body>
  <div class="box" id="tab_wrap">
    <ul class="tab_options">
      <li data-index="0" class="item active">tab1</li>
      <li data-index="1" class="item">tab2</li>
      <li data-index="2" class="item">tab3</li>
      <li data-index="3" class="item">tab4</li>
    </ul>
    <div class="tab_content">
      <div class="item_box active">tab box 1</div>
      <div class="item_box">tab box 2</div>
      <div class="item_box">tab box 3</div>
      <div class="item_box">tab box 4</div>
    </div>
  </div>
</body>
</html>
```

### 实现原理

在 HTML 代码中，每一个头部按钮都保存了一个 `data-index` 属性，这个属性告诉我们这是第几个按钮，这个值同时也对应第几页。 因此只需声明一个 `index` 变量来保存当前页的序列，井在单击时把当前页的值修改为 `data-index` 的值就可以了。与此同时，把当前按钮修改为选中状态，其他按钮修改为未选中状态，让当前页显示，其他页隐藏即可。

```js
var tabHeader = document.querySelector('.tab_options'); 
var items = tabHeader.children;
var tabContent = document.querySelector('.tab_content'); 
var itemboxes = tabContent.children;
var index = 0;

tabHeader.addEventListener('click', function(e) {
  var a = [].slice.call(e.target.classList).indexOf('item');
  if(a > -1 && index != e.target.dataset.index) {
    items[index].classList.remove('active');
    itemboxes[index].classList.remove('active');
    index = e.target.dataset.index;
    items[index].classList.add('active');
    itemboxes[index].classList.add('active');
  }
}, false)
```

此时假设要新增一个功能，即在 HTML 中新增两个按钮，单击它们就可以分别切换到上一页或下一页

```html
<button class="next">Next</button>
<button class="prev">Prev</button>
```

为了更直观地实现这个功能，我们将选项卡封装为一个对象

```js
!function(ROOT) {
  // var index = 0;
  function Tab(elem) {
    this.index = 0;
    this.tabHeader = elem.firstElementChild;
    this.items = this.tabHeader.children;
    this.tabContent = elem.lastElementChild;
    this.itemboxes = this.tabContent.children;
    this.max = this.items.length - 1;

    this.init();
  }

  Tab.prototype = {
    constructor: Tab,
    init:function() {
      this.tabHeader.addEventListener('click', this.clickHandler.bind(this), false);
    },
    clickHandler: function(e) {
      var a = [].slice.call(e.target.classList).indexOf('item');
      if(a > -1) {
        this.switchTo(e.target.dataset.index);
      }
    },
    switchTo: function(i) {
      if(i == this.index) {
        return;
      }
      this.items[this.index].classList.remove('active');
      this.itemboxes[this.index].classList.remove('active');
      this.index = i;
      this.items[this.index].classList.add('active');
      this.itemboxes[this.index].classList.add('active');
    },
    next: function() {
      var tgIndex = 0;
      if(this.index >= this.max) {
        tgIndex = 0;
      } else {
        tgIndex = this.index + 1;
      }
      this.switchTo(tgIndex);
    },
    pre: function() {
      var tgIndex = 0;
      if(this.index == 0) {
        tgIndex = this.max;
      } else {
        tgIndex = this.index - 1;
      }
      this.switchTo(tgIndex);
    },
    getIndex: function() {
      return this.index;
    }
  }

  ROOT.Tab = Tab;
}(window);
```

在上面的代码中，将切换功能封装成了基础的 `switchTo` 方法，它接收一个表示页面序列的参数，只要我们调用这个方法，就能够切换到对应的页面。因此基于这个基础方法，就能够很容易地扩展出下一页 `next` 与上一页 `pre` 的方法。

```js
var tab = new Tab(document.querySelector('#tab_wrap'));

document.querySelector('.next').addEventListener('click', function() {
  tab.next();
  console.log(tab.getIndex());
}, false);

document.querySelector('.prev').addEventListener('click', function() {
  tab.pre();
  console.log(tab.getIndex());
}, false);
```

## 封装无缝滚动

无缝滚动指的是几个元素循环滚动，视觉效果就像是有无穷无尽的元素一样。

实现的原理也很简单，首先对容器元素进行滚动操作。子元素在容器元素中依次排列，并且将子元素复制一份，放在同一个容器元素中，这样就实现了首尾相接。当最后一个子元素滚动过临界点的时候，将容器元素的位置拉回初始位置，然后重复滚动操作即可。

首先写好 HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>封装无缝滚动</title>
  <style>
    body {
      margin: 0;
    }

    #scroll_area {
      width: 400px;
      height: 100px;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      margin: 20px auto;
      overflow: hidden;
    }

    .scroll_body {
      display: flex;
      position: relative;
      left: 0;
      height: 100%;
      font-size: 30px;
    }

    .scroll_body .item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .buttons {
      width: 400px;
      margin: 20px auto;
    }
  </style>
</head>
<body>
  <div id="scroll_area">
    <div class="scroll_body">
      <div class="item">1</div>
      <div class="item">2</div>
      <div class="item">3</div>
      <div class="item">4</div>
      <div class="item">5</div>
    </div>
  </div>

  <div class="buttons">
    <button class="left">move left</button>
    <button class="right">move right</button>
    <button class="stop">stop</button>
  </div>
</body>
</html>
```

滚动区域元素 `scroll_area` 固定，容器元素 `scro11_body` 在滚动区域中滚动，滚动效果就是通过定时器每秒钟移动 1 个像素来实现的。

```js
var lastTime = 0,
  nextFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequesAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) {
    var currTime = +new Date,
      delay = Math.max(1000 / 60, 1000 / 60 - (currTime - lastTime));
    lastTime = currTime + delay;
    return setTimeout(callback, delay);
  },
  cancelFrame = window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.webkitCancelRequestAnimationFrame ||
  window.mozCancelRequestAnimationFrame ||
  window.msCancelRequestAnimationFrame ||
  clearTimeout;

var area = document.querySelector('#scroll_area');
var areaWidth = area.offsetWidth;

var scrollBody = area.querySelector('.scroll_body');
var itemWidth = areaWidth/(scrollBody.children.length);

scrollBody.style.width = areaWidth * 2 + 'px';
scrollBody.innerHTML = scrollBody.innerHTML + scrollBody.innerHTML;

var targetPos = areaWidth;
var scrollX = 0;
var timer = null;

function ani() {
  cancelFrame(timer);
  timer = nextFrame(function() {
    scrollX -= 1;

    if(-scrollX >= targetPos) {
      scrollX = 0;
    }

    scrollBody.style.left = scrollX + 'px';
    ani();
  })
}

ani();
```

对于初学者来说，一个比较难以理解的地方就是 `nextFrame` 与 `cancelFrame` 的声明，这是一个类似于定时器的 `setTimeout` 的兼容性写法。`requestAnimationFrame` 是一个在 HTML5 中用于实现动画效果的API。

通过面向对象的方式来扩展控制滚动方向、停止滚动等接口:

```js
(function(ROOT){
  var lastTime = 0,
    nextFrame = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequesAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback) {
                  var currTime = +new Date,
                    delay = Math.max(1000 / 60, 1000 / 60 - (currTime - lastTime));
                  lastTime = currTime + delay;
                  return setTimeout(callback, delay);
                },
    cancelFrame = window.cancelAnimationFrame ||
                  window.webkitCancelAnimationFrame ||
                  window.webkitCancelRequestAnimationFrame ||
                  window.mozCancelRequestAnimationFrame ||
                  window.msCancelRequestAnimationFrame ||
                  clearTimeout;
  
  var timer = null;
  
  function Scroll(elem) {
    this.elem = elem;
    this.areaWidth = elem.offsetWidth;

    this.scrollBody = elem.querySelector('.scroll_body');
    this.itemWidth = this.areaWidth/this.scrollBody.children.length;
    this.scrollX = 0;
    this.targetPos = this.areaWidth;
    this.init();
  }

  Scroll.prototype = {
    constructor: Scroll,
    init: function() {
      this.scrollBody.style.width = this.areaWidth * 2 + 'px';
      this.scrollBody.innerHTML = this.scrollBody.innerHTML + this.scrollBody.innerHTML;
      this.moveRight();
    },
    moveLeft: function() {
      var self = this;
      cancelFrame(timer);
      timer = nextFrame(function() {
        self.scrollX -= 1;
        if(-self.scrollX >= self.targetPos) {
          self.scrollX = 0;
        }
    
        self.scrollBody.style.left = self.scrollX + 'px';
        self.moveLeft();
      })
    },
    moveRight: function() {
      var self = this;
      cancelFrame(timer);
      timer = nextFrame(function() {
        self.scrollX += 1;
        if(self.scrollX >= 0) {
          self.scrollX = -self.targetPos;
        }
    
        self.scrollBody.style.left = self.scrollX + 'px';
        self.moveRight();
      })
    },
    stop: function() {
      cancelFrame(timer);
    }
  }

  ROOT.Scroll = Scroll;  
})(window);

var scroll = new Scroll(document.querySelector('#scroll_area'));

var left_btn = document.querySelector('.left');
var right_btn = document.querySelector('.right');
var stop_btn = document.querySelector('.stop');

left_btn.onclick = function() {
  scroll.moveLeft();
}
right_btn.onclick = function() {
  scroll.moveRight();
}
stop_btn.onclick = function() {
  scroll.stop();
}
```