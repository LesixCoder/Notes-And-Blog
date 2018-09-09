基础知识下

题目：
·同步和异步的区别是什么？分别举一个同步和异步的例子
  同步会阻塞代码执行，而异步不会
·一个关于setTimeout的笔试题
·前端使用异步的场景有哪些
知识点：
·什么是异步（对比同步）
  console.log(100)
  setTimeout(function(){
    console.log(200)
  }, 1000)
  console.log(300)
·前端使用异步的场景
  定时任务：setTimeout、setInterval
  网络请求：ajax请求，动态img加载
  事件绑定
·异步和单线程


###其他知识
题目：
·获取2017-06-10格式的日期
·获取随机数，要求长度一直的字符串格式
·写一个能遍历对象和数组的通用forEach函数
知识点：
·日期 ·Math ·数组API ·对象API
Date.now() //获取当前时间毫秒数
var dt = new Date()
dt.getTime() //获取毫秒数
dt.getFullYear() //年
dt.getMonth()  //月（0~11）
dt.getDate()  //日（0~31）
dt.getHours()  //小时（0~23）
dt.getMinutes()  //分钟（0~59）
dt.getSeconds()  //秒（0~59）

获取随机数Math.random() //清除缓存

数组API
  ·forEach遍历所有元素
    var arr = [1,2,3]
    var result = arr.forEach(function(item, index){
      //item值，index索引
      return '<b>' + item + '</b>'
    })
    console.log(result)
  ·every判断所有元素是否都符合条件
    var arr = [1,2,3]
    var result = arr.every(function(item, index){
      //用来判断所有的数组元素，都满足一个条件
      if(item < 4){
        return true
      }
    })
  ·some判断是否有至少一个元素符合条件
    var arr = [1,2,3]
    var result = arr.some(function(item, index){
      //用来判断所有的数组元素，只要有一个满足条件即可
      if(item < 2){
        return true
      }
    })
  ·sort排序
    var arr = [1,4,2,3,5]
    var result = arr.sort(function(a, b){
      //从小到大排序
      return a-b
    })
  ·map对元素重新组装，生成新数组
    var arr = [1,2,3,4]
    var result = arr.map(function(item, index){
      //将数组重新组装并返回
      return '<b>' + item + '</b>'
    })
  ·filter过滤符合条件的元素
    var arr = [1,2,3]
    var result = arr.filter(function(item, index){
      //过滤数组
      if(item >= 2){
        return true //要的为true
      }
    })

对象API
  var obj = {
    x: 100,
    y: 200,
    z: 300
  }
  var key
  for(key in obj) {
    //注意这里的hasOwnProperty是指obj原生的属性，而不是原型链中的
    if(obj.hasOwnProperty(key)){
      console.log(key, obj[key])
    }
  }

解题：
html
  