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
    }
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