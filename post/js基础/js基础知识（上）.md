基础知识上

知识点
*变量类型
  值类型 vs 引用类型(对象、数组、函数)
  typeof运算符详解
    typeof undefined //undefined
    typeof 'abc' //string
    typeof 123 //number
    typeof true //boolean
    typeof {} //object
    typeof [] //object
    typeof null //object
    typeof console.log //function(函数是特殊的引用类型)
  typeof只能区分值类型

*变量计算-强制类型转换
  ·字符串拼接
    var a = 100 + 10 //110  
    var a = 100 + '10' //10010
  ·==运算符
    100 == '100' //true
    0 == '' //true
    null == undefined //true
  ·if语句
    var a = true;
    if(a){...}
    var b = 100;
    if(b){...}
    var c = '';
    if(c){...}
  ·逻辑运算
    10 && 0 //0
    '' || 'abc' //'abc'
    !window.abc //true

    var a = 100
    !!a //强制转换boolean

问题：
    1.js中使用typeof能得到的哪些类型
    2.何时使用===何时使用==
      if(obj.a == null){
        //这里相当于obj.a === null || obj.a === undefined,简写形式
        //这是jquery源码中推荐的写法
      }//其它全部用===
    3.JS中有哪些内置函数 - 数据封装类对象
      Object/Array/Boolean/Number/String/Function/Date/RegExp/Error
      Math为对象
    4.JS变量按照存储方式区分为哪些类型，并描述其特点
      值类型、引用类型（面向指针，并不是真正值的拷贝，所以值会干预）
    5.如何理解JSON（JSON只不过是一个JS对象而已，同时也是一种数据格式）
      JSON.stringify({a:10, b:20}) //对象转字符串
      JSON.parse('{"a":10, "b":20}') //字符串转对象

*原型和原型链
题目：
  ·如何准确判断一个变量是数组类型
  ·写一个原型链继承的例子
  ·描述new一个对象的过程
  ·zepto（或其他框架）源码中如何使用原型链
知识点：
  ·构造函数(类似于模板)
  ·构造函数-扩展
  ·原型规则和示例
  ·原型链
  ·instanceof

function Foo(name, age){ //函数名大写的基本上都是构造函数
  this.name = name;
  this.age = age;
  this.class = 'class-1'
  // return this // 默认有这一行
}
var f = new Foo('zhangsan', 20);

2.·var a = {} 其实是var a = new Object()的语法糖
  ·var a = [] 其实是var a = new Array()的语法糖
  ·function Foo(){...} 其实是var Foo = new Function(...)
  ·使用instanceof判断一个函数是否是一个变量的构造函数
3.所有的引用类型，都具有对象特性，即可自由扩展属性（除了“null”以外）
  所有的引用类型，都有一个__proto__属性（隐式原型），属性值是一个普通的对象
  所有的函数，都有一个prototype属性（显式原型），属性值也是一个普通的对象
  所有的引用类型，__proto__属性值指向它的构造函数的“prototype”属性值
  obj.__proto__===Object.prototype
  当试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么会去它的__proto__（即它的构造函数的prototype）中寻找
  循环对象自身的属性
    var item;
    for(item in f){
      //高级浏览器已经在for in中屏蔽了来自原型的属性
      if(f.hasOwnProperty(item)){ //此判断保证了程序的健壮性
        console.log(item)
      }
    }
解答：
·如何准确判断一个变量是数组类型?
  var arr = [];
  arr instanceof Array //true
·写一个原型链继承的例子?
  //动物
  function Animal() {
    this.eat = function(){
      console.log('animal eat');
    }
  }
  function Dog() {
    this.bark = function() {
      console.log('dog bark');
    }
  }
  Dog.prototype = new Animal()
  //哈士奇
  var hashiqi = new Dog()

·描述new一个对象的过程?
  创建一个新对象
  this指向这个新对象
  执行代码，即对this赋值
  返回this

·zepto（或其他框架）源码中如何使用原型链？
  阅读源码是高效提高技能的方式

·写一个封装dom查询的例子
  function Elem(id){
    this.ele = document.getElementById(id)
  }
  Elem.prototype.html = function(val) {
    var elem = this.elem
    if(val){
      elem.innerHTML = val
      return this; //链式操作
    }else{
      return elem.innerHTML
    }
  }
  Elem.prototype.on = function(type, fn){
    var elem = this.elem;
    elem.addEventListener(type, fn);
    return this;
  }
  var div1 = new Elem('div1')

####引用类型
  1.都可以随意扩展属性
  2.都有一个隐式属性__proto__
  3.构造函数都有prototype属性
  4.函数的__proto__等于它构造函数的prototype