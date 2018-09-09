JS-Web-API(上)

·JS基础知识：ECMA262标准
·JS-Web-API：W3C标准
  关于JS的规定：
    ·DOM操作
    ·BOM操作
    ·事件绑定
    ·ajax请求（包括http协议）
    ·存储

###DOM操作：
  Document
  Object
  Model
·题目
  ·DOM是哪种基本的数据结构
  ·DOM操作的常用API有哪些
  ·DOM节点的attr和property有何区别
·知识点
  ·DOM本质
    <?xml version="1.0" encoding="UTF-8"?>
    <note></note>
  ·DOM节点操作
    ·获取DOM节点
    ·prototype
      获取样式dom.style.width
      获取nodeName和nodeType
    ·Attribute
      获取属性getAttribute，setAttribute
  ·DOM结构操作
    ·新增节点
    ·获取父节点
    ·获取子元素
    ·删除节点
·解答
  ·DOM是哪种基本的数据结构?
    ·树
  ·DOM操作的常用API有哪些？
    ·获取DOM节点，以及节点的property和Attribute
    ·获取父节点，获取子节点
    ·新增节点，删除节点
  ·DOM节点的attr和property有何区别？
    ·property只是一个JS对象的属性的修改
    ·Attribute是对html标签属性的修改

###BOM操作
·题目：
  ·如何检测浏览器的类型
  ·拆解url各部分
·知识点：
  ·navigator
  ·screen
  ·location
  ·history
·解答：
  ·如何检测浏览器的类型?
    var ua = navigator.userAgent
    var isChrome = ua.indexOf('Chrome')