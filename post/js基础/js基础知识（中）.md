基础知识中

知识点
fn()
function fn() {
  // 函数声明
}
var fn = function() {
  // 函数表达式
}

区别：
  第二个会报错，函数声明会提前，函数表达式执行的只是fn这个变量，并不是把函数声明提前

3-2.作用域和闭包
题目：
1.说一下对变量提升的理解
2.说明this几种不同的使用场景
3.创建10个a标签，电机的时候弹出来对应的序号
4.如何理解作用域
5.实际开发中闭包的应用
知识点：
·执行上下文 ·作用域 ·作用域链 ·闭包
·执行上下文：
  范围：一段script或者一个函数
  全局：变量定义、函数声明  一段<script>
  函数：变量定义、函数声明、this、arguments 函数
  PS:注意“函数声明”和“函数表达式”的区别
this要在执行时才能确认值，定义时无法确认
  var a = {
    name: 'A',
    fn: function() {
      console.log(this.name)
    }
  }
  a.fn() //this === a
  a.fn.call({name: 'B'}) //this ===  {nam e: 'B'}
  var fn1 = a.fn
  fn1() //this === window
  ·作为构造函数执行
  ·作为对象属性执行
  ·作为普通函数执行
  ·call apply bind

作用域：
·没有块级作用域
  if(true) {
    var name = 'zhangsan'
  }
  console.log(name)

  //函数和全局作用域
  var a = 100
  function fn() {
    var a = 200
    console.log('fn', a)
  }
  console.log('global', a)
  fn()
作用域链：
  var a = 100
  function fn(){
    var b = 200
    //当前作用于没有定义的变量，即“自由变量”
    console.log(a)

    console.log(b)
  }
  fn()

解题：
1.说一下对变量提升的理解？
  ·变量定义
  ·函数声明（注意和函数表达式的区别）
2.说明this几种不同的使用场景？
  ·作为构造函数执行
  ·作为对象属性执行
  ·作为普通函数执行
  ·call apply bind
3.创建10个a标签，电机的时候弹出来对应的序号？
  var i,a
  for (i = 0; i < 10; i++) {
    a = document.createElement('a')
    a.innerHTML = i + '<br>'
    a.addEventListener('click', function(e){
      e.preventDefault()
      alert(i)
    })
    document.body.appendChild(a)
  }

  var i
  for (i = 0; i < 10; i++) {
    (function(i){
      var a = document.createElement('a')
      a.innerHTML = i + '<br>'
      a.addEventListener('click', function(e){
        e.preventDefault()
        alert(i)
      })
      document.body.appendChild(a)
    })(i)
  }
4.如何理解作用域?
  ·自由变量
  ·作用域链，即自由变量的查找
  ·闭包的两个场景
5.实际开发中闭包的应用
  //封装变量，收敛权限
  function isFirstLoad() {
    var _list = []
    return function(id) {
      if(_list.indexOf(id) >= 0){
        return false
      } else {
        _list.push(id)
        return true
      }
    }
  }
  //使用(检查id是否被使用过)
  var firstLoad = isFirstLoad()
  firstLoad(10) //true
  firstLoad(10) //false