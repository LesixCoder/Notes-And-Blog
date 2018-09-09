JS-Web-API(下)

###事件
·题目：
  ·编写一个通用的事件监听函数
  ·描述事件冒泡流程
  ·对一个无限下拉加载图片的页面，如何给每个图片绑定事件
·知识点：
  ·通用事件绑定
  ·事件冒泡
  ·代理
    好处：·代码简洁 ·减少浏览器内存占用

###Ajax
·题目：
  ·手动编写一个ajax，不依赖第三方库
  ·跨域的几种实现方式
·知识点：
  ·XMLHttpRequest
  ·状态码说明
  ·跨域
readyState
  ·0-（未初始化）还没有调用send方法
  ·1-（载入）已调用send方法，正在发送请求
  ·2-（载入完成）send方法执行完成，已经接收到全部响应内容
  ·3-（交互）正在解析响应内容
  ·4-（完成）响应内容解析完成，可以在客户端调用了
status
  ·2xx - 表示成功处理请求
  ·3xx - 需要重定向，浏览器直接跳转
  ·4xx - 客户端请求错误
  ·5xx - 服务端错误
·跨域
  ·什么是跨域
    ·浏览器有同源策略，不允许ajax访问其他域接口
    ·跨域条件：协议、域名、端口，有一个不同就算跨域
    ####可以跨域的三个标签：
      ·<img src="" />用于打点统计，统计网站可能是其他域
      ·<link href=""> ·<script src=""></script>可以使用CDN，CDN的也是其他域
      ·<script src=""></script>可以用于JSONP
    ####跨域注意事项
      ·所有的跨域请求都必须经过信息提供方允许
      ·如果未经允许即可获取，那是浏览器同源策略出现漏洞
  ·JSONP
    ####JSONP实现原理
      ·加载http://coding.com/classindex.html
      ·不一定服务器端真正有一个classindex.html文件
      ·服务器可以根据请求，动态生成一个文件，返回
      ·同理于script
  ·服务端设置http header
    ·另外一个解决跨域的简洁方法，需要服务器端来做
    ·是解决跨域问题的一个趋势

###存储
·题目：
  ·请描述一下cookie，sessionStorage和localStorage的区别？
·知识点：
  ·cookie
    ·本身用于客户端和服务端通信
    ·但是它有本地存储的功能，于是就被“借用”
    ·使用document.cookie=...获取和修改即可
  ·cookie用于存储的缺点
    ·存储量太小，只有4kb
    ·所有http请求都带着，会影响获取资源的效率
    ·API简单，需要封装才能用document.cookie=...
  ·locationStorage和sessionStorage
    ·HTML5专门为存储而设计，最大计量5M
    ·API简单易用
    ·localStorage.setItem(key, value);localStorage.getItem(key)
    ####iOS safari隐藏模式下
    ·localStorage.getItem会报错
    ·建议统一使用try-catch封装
·解答：
  ·容量
  ·是否会携带到ajax中
  ·API易用性