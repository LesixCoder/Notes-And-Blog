## 闭包

### 概念

闭包是一种特殊的对象。它由两部分组成 - **执行上下文**(代号 A)，以及在该**执行上下文中创建的函数**(代号 B)。当 B 执行时，如果访问了 A 中变量对象中的值，那么闭包就会产生。

许多书籍、文章里都以 函数 B 的名字代指这里生成的闭包。而在 Chrome 中，则以执行上下文 A 的函数名代指闭包。

我们只需知道， 一个闭包对象，由 A、 B 共同组成，本文都以 Chrome 的标准来称呼。

### 闭包与垃圾回收机制

我们知道，当一个函数的执行上下文运行完毕之后，内部的所有内容都会失去引用而被垃圾回收机制回收。

我们还知道，闭包的本质就是在函数外部保持了内部变量的引用，因此闭包会阻止垃圾回收机制进行回收。

### 闭包与作用域链

```js
var fn = null;
function foo() {
  var a = 2;
  function innerFoo() {
    console.log(a);
  }
  fn = innerFoo;
}

function bar() {
  fn();
}

foo();
bar(); // 2
```

在这个例子中，`foo` 内部的 `innerFoo` 访问了 `foo` 的变量 a。 因此当 `innerFoo` 执行时会有闭包产生，这是一个比较简单的闭包例子。不一样的地方在于全局变量 fn。fn 在 foo 内部获取了 `innerFoo` 的引用，并在 bar 中执行。

因为函数调用栈其实是在代码执行时才确定的，而作用域规则在代码编译阶段就已经确定，虽然作用域链是在代码执行时才生成的，但是它的规则并不会在执行时发生改变。 所以这里闭包的存在并不会导致作用域链发生变化。

### 在 Chrome 开发者工具中观察函数调用枝、作用域链与闭包

函数在被调用执行时，会创建一个当前函数的执行上下文。在该执行上下文的创建阶段，变量对象、作用域链、闭包、 this 等会分别确认。而一个程序中一般来说会有多个函数执行，因此执行引擎会使用函数调用栈来管理这些函数的执行顺序。函数调用栈的执行顺序与栈数据结构一致。

打开 chrome 开发者工具，点击 sources，我们把需要关注的地方标注出来

![](http://cdn-blog.liusixin.cn/WX20180806-200854@2x.png)

① 通过这排图标来控制函数的执行进程。从左到右它们依次是:

- resume/pause script execution - 恢复/暂停脚本执行
- step over next function call - 跨过。实际表示是在未遇到函数时，执行下一步。遇到函数时，不进入函数直接执行下一步。
- step into next function call - 跨入。实际表示的是未遇到函数时，执行下一步。遇到函数时，进入函数执行上下文。
- step out of current function - 跳出当前函数。
- deactivate breakpoints - 停用断点。
- don't pause on exceptions - 不暂停异常捕获

其中 跨过、跨入、跳出 是调试过程中用得最多的三个操作。

② 区域表示代码的行数，当我们单击某一行时，就可以在该行设置一个断点。

③ 表示程序的执行调用栈。

④ 区域为 Scope，即当前函数的作用域链。其中，Local 表示当前正在执行的活动对象，Closure 表示闭包。

我们以一段代码来讲解

```js
var fn;
function foo() {
  var a = 2;
  function baz() {
    console.log(a);
  }
  fn = baz;
}

function bar() {
  fn();
}
foo();
bar(); // 2
```

很显然，fn 是对 foo 或者 foo 内部函数 baz 的引用。因此当 fn 执行时，其实就是 baz 在执行。而 baz 在执行时访问了 foo 中的变量，因此闭包产生。在 Chrome 中，用 foo 来指代生成的闭包。

- 第一步，设置断点，然后刷新页面
  ![](http://cdn-blog.liusixin.cn/WX20180806-202757@2x.png)

经过简单地分析可以看出，代码是从 `foo()` 这一行开始执行的，因此在这里设置一个断点。

- 第二步，单击上图箭头所指的按钮, 该按钮的作用是根据代码的执行顺序，一步步向下执行，当遇到函数时，跳入函数执行。多次点击，直到 baz 函数执行。
  ![](http://cdn-blog.liusixin.cn/WX20180806-203132@2x.png)

当执行到 baz 函数时，CalStack 与 Scope 如图所示。如果大家对前面的知识有足够地理解，就应该明白函数调用栈的不同就应该如此，而作用域链则不会因为闭包发生变化。而我们还需要关注的一个点在于 Chrome 对作用域链所做的一个优化。

从上面的例子中我们可以明确地知道，在函数 foo 的变量对象中，应该保存了一个变量 a 与 一个函数 baz。 但是从图中可看出， Closure(foo) 并没有函数 baz，仅仅只有变量 a。其实这是 Chrome 新版本对闭包与作用域链所做的一个优化，它仅仅只保留了会被访问到的变量。

我们可以用下面的例子来进一步证明这一点。

```js
function foo() {
  var x = 20;
  var y = 10;
  function child() {
    var m = 5;

    return function add() {
      var z = 'this is add';
      return x + y;
    };
  }

  return child();
}
foo()();
```

我们来分析下 add 在执行时它的作用域链应该是怎样的

```js
addEC = {
  scopeChain: [AO(add)], VO(child), VO(foo), VO(Global)
}
```

可是 Chrome 中的表现是怎样的呢？一起来看一下：

![](http://cdn-blog.liusixin.cn/WX20180806-204255@2x.png)

中间的 `VO(child)` 直接被省略了，这正是 Chrome 的优化。因为 child 函数中的变量 m 与函数 add 在 add 的执行上下文中并没有被访问，因此就没有保留在内存中的必要。

下面再来看一个特殊的例子。

```js
function foo() {
  var a = 10;
  function fn1() {
    console.log(a);
  }

  function fn2() {
    var b = 10;
    console.log(b);
  }
  fn2();
}
foo();
```

当函数 fn2 执行时，这个例子中有没有闭包产生？

![](http://cdn-blog.liusixin.cn/WX20180806-205248@2x.png)

从图中可以看出，确实产生了闭包。

> 在最新的 MDN 中，对闭包是这样定义的(结合上例): “闭包是指这样的作用域(foo)，它包含了一个函数(fn1)，这个函数(fn1)可以调用被这个作用域所封闭的变量(a)、函数或者闭包等内容。通常我们通过闭包所对应的函数来获得对闭包的访问。”

### 应用闭包

我们通过三个案例，运用闭包来解决实际问题。

#### 循环、setTimeout 与闭包

在面试题中常常会遇到一个与循环、闭包有关的问题

```js
//利用闭包的知识，修改这段代码，让代码的执行结果为隔秒输出 1,2,3,4,5
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i * 1000);
}
```

前面我们已经知道，for 循环的大括号并不会形成自己的作用域，i 值作为全局的一个变量，会随着循环的过程递增。因此循环结束之后，i 变成 6。

每一个循环中，setTimeout 的第二个参数访问的都是当前的 i 值，因此第二个 i 值分别是 1,2,3,4,5。而第一个参数 timer 函数中虽然访问的是同一个 i 值，但是由于延迟的原因，当 timer 函数被 setTimeout 运行时，循环已经结束， 即 i 已经变成了 6。

因此这段代码直接运行的结果是隔秒输出 6。

而我们想要的是隔秒输出 1,2,3,4,5，需要借助闭包的特性，将每一个 i 值都用一个闭包保存起来。 每一轮循环，都把当前的 i 值保存在一个闭包中，当 setTimeout 中定义的操作执行时，访问对应的闭包即可。

```js
for (var i = 1; i <= 5; i++) {
  (function(i) {
    setTimeout(function timer() {
      console.log(i);
    }, i * 1000);
  })(i);
}
```

同样的道理，也可以在 timer 函数这里做文章

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(
    (function timer(i) {
      console.log(i);
    })(i),
    i * 1000
  );
}
```

#### 单例模式与闭包

**最简单的单例模式**

```js
var per = {
  name: 'Jake',
  age: 20,
  getName: function() {
    return this.name;
  },
  getAge: function() {
    return this.age;
  }
};
```

但是这样的单例模式有一个严重的问题，即它的属性可以被外部修改。我们期望对象能够有自己的私有方法与属性。

**私有方法/属性的单例模式**

```js
var per = (function() {
  var name = 'Jake';
  var age = 20;
  return {
    getName: function() {
      return this.name;
    },
    getAge: function() {
      return this.age;
    }
  };
})();

// 访问私有交量
per.getName();
```

**调用时才初始化的单例模式**

有的时候(使用频次较少)我们希望自己的实例仅仅只是在调用的时候才被初始化，而不是如上面两个例子那样，即使没有调用 per, per 的实例在函数自执行的时候就返回了。

```js
var per = (function() {
  // 定义一个变量，用来保存实例
  var instance = null;
  var name = 'Jake';
  var age = 20;

  // 初始化方法
  function initial() {
    return {
      getName: function() {
        return name;
      },
      getAge: function() {
        return age;
      }
    };
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = initial();
      }
      return instance;
    }
  };
})();

// 只在使用时获得实例
var p1 = per.getInstance();
var p2 = per.getInstance();
console.log(p1 === p2); // true
```

在这个例子中，我们在匿名函数中定义了一个 instance 变量用来保存实例。在 getInstance 方法中判断了是否对它进行重新赋值。由于这个判断的存在，因此变量 instance 仅仅只在第一次调用 getInstance 方法时赋值了。所以这种写法完美符合了单例模式的思路。

#### 模块化与闭包

模块化开发是目前最流行，也是必须要掌握的一种开发思路。而模块化其实是建立在单例模式基础之上的，因此模块化开发和闭包息息相关。

在未来，你可能会被告知，每一个文件，就是一个模块。而这里把每一个单例模式假想成一个单独的文件即可。定义一个模块，而变量名就是模块名。

```js
var module_test = (function() {})();
```

每一个模块要想与其他模块交互，则必须有获取其他模块的能力，例如 requirejs 中的 `require` 与 ES6 modules 中的 `import`。

```js
// require
var $ = require('jquery');
// es6 modules
import $ from 'jquery';
```

每一个模块都应该有对外的接口，以保证与其他模块交互的能力。这里直接使用 `return` 返回一个字面量对象的方式来对外提供接口。

```js
var module_test = (function() {
  ...
  return {
    fn1: function(){},
    fn2: function(){}
  }
})();
```

> 我们结合一个简单的案例来走一遍模块化开发的流程。这个案例想要实现的功能是每隔一秒，`body` 的背景色就随着一个数字的递增在固定的三种颜色之间切换。

- 首先创建一个专门用来管理全局状态的模块。这个模块中有一个私有变量保存了所有的状态值，并对外提供了访问与设置这个私有变量的方法。

```js
var module_status = (function() {
  var status = {
    number: 0,
    color: null
  }
  
  var get = function(prop) {
    return status[prop];
  }

  var set = function(prop, value) {
    status[prop] = value;
  }

  return {
    get: get,
    set: set
  }
})()
```
- 再来创建一个模块，这个模块专门负责 `body` 背景颜色的改变。
```js
var module_color = (function() {
  // 假装用这种方式执行第二步引入模块
  // 类似于 import state from 'module_status'; 
  var state = module_status;
  var colors = ['orange', '#ccc', 'pink'];
  function render() {
    var color = colors[state.get('number') % 3]; 
    document.body.style.backgroundColor = color;
  }
  return {
    render: render
  }
})();
```
在这个模块中，引入了管理状态的模块，并且将颜色的管理与改变方式都定义在该模块中，因此在使用时我们只需调用 `render` 方法就可以了。

- 接下来我们还要创建另外一个模块来负责显示当前的 number 值，用于参考与对比。

```js
var module_context = (function(){
  var state = module_status;

  function render() {
    document.body.innerHTML = 'this Number is' + state.get('number');
  }

  return {
    render: render
  }
})()
```
这些功能模块都创建完毕之后，最后我们只需创建一个主模块即可。这个主模块的目的就是借助功能模块，来实现我们想要的效果。
```js
var module_main = (function(){
  var state = module_status;
  var color = module_color;
  var context = module_context;

  setInterval(function(){
    var newNumber = state.get('number') + 1;
    state.set('number', newNumber);

    color.render();
    context.render();
  }, 1000)
})()
```
把这些代码摘抄到一个 HTML 文件的 script 标签中即可看到展示效果。