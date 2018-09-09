首先了解下浏览器输入url后http请求返回的过程是什么，看下图

![](https://blog.liusixin.cn/content/images/2018/06/WX20180606-002640-2x.png)

(一) 首先一开始要做 `redirect` 重定向，那么为什么要 redirect 呢，因为浏览器可能记录了你这个地址已经永久跳转成一个新的地址，所以一开始浏览器需要判断需不需要 redirect 以及 redirect 到哪里。

(二) 看缓存，请求的资源可能已经缓存过，在 App cache 里看是否有缓存，如果没有缓存，就会去服务器请求资源。

(三) 输入域名，域名会对应ip之后才能真正访问到服务器，所以这时候会先去查找域名对应的IP地址，这就叫DNS解析

(四) 有了IP之后，就会创建tcp连接，该过程要经过tcp的三次握手之后才能真正创建连接。同时如果这个请求是https的，就会创建https的链接，这跟tcp的三次握手不一样，中间会有一个保证安全的数据传输的过程。

(五) 连接创建好之后，才会真正发起http请求的数据包，数据包发送完成之后，服务器接收到这个数据并进行处理之后会返回这个请求响应的内容数据，返回数据之后这个http请求才真正完成

## 1. 网络协议分层
我们先来看下经典五层模型图例：

![](https://blog.liusixin.cn/content/images/2018/06/WX20180606-144132-2x-2.png)

这个五层模型中，分为应用层、传输层、网络层、数据链路层、物理层，每一个服务器上都会有这样的层级关系存在来维护整个网络数据传输的过程。

本文主要内容是http相关内容，所以主要是在应用层展开。http协议基于传输层里的 TCP/IP 协议，该协议会涉及到一些http请求的性能，以及请求过程的消耗，会面也会有一些 TCP/IP 协议的介绍。

**低三层：**

* 物理层(硬件) - 主要作用是定义物理设备如何传输数据
* 数据链路层 - 在通信的实体间建立数据链路连接
* 网络层 - 为数据在结点之间传输创建逻辑链路

### 1.1 传输层
传输层主要有两个协议，一个是 TCP/IP，一个是 UDP。更多情况下都使用的是 TCP/IP 协议，因为它更可靠的传输数据。

**向用户提供可靠的端到端(e2e)服务**

个人电脑到网络服务器建立连接之后，如果传输数据很大，一次性无法完成传输，就需要分片传输，传输成功之后再重新组装。两端传输数据的方式都是在这一层定义

**传输层向高层屏蔽了下层数据通信的细节**

http协议要传输数据只需在浏览器输入url，输入url这个过程还涉及到一系列数据的拼装及传输，比如分包传输具体是怎么实现，服务器怎么接收，ajax请求，整个过程传输层已经做好了封装，这个过程用户不需要知道。

### 1.2 应用层
http协议所在层

* 为应用软件提供了很多服务
* 构建于TCP协议之上
* 屏蔽网络传输相关细节

## 2. http协议发展历史

- HTTP/0.9
  - 只有一个命令GET
  - 没有HEADER等描述数据的信息
  - 服务器发送完毕，就关闭TCP连接
- HTTP/1.0
  - 增加了很多命令
  - 增加 status code 和 header
  - 多字符集支持、多部分发送、权限、缓存等
- HTTP/1.1
  - 持久连接
  - pipeline
  - 增加 host 和其它一些命令
- HTTP2
  - 所有数据以二进制传输
  - 同一个连接里面发送多个请求不再需要按照顺序来
  - 头信息压缩以及推送等提高效率的功能

**头信息压缩及推送**

http2 解决了 http 里整体性能低下的问题，在http1.1里，每次发送请求和返回请求，它的http头都会进行一个完整传输，并且很多字段都是以字符串形式保存，占用大量带宽。http2里会将头信息进行压缩传输。

推送是什么概念呢？在http1.1里，客户端发起请求然后服务端响应请求返回内容，客户端永远是主动方，服务端永远是被动方。在http2里，服务端是可以主动发起数据传输的。比如：一个html页面中引入了css和js，浏览器首先要对html进行分析，再寻找css和js对应的url去请求对应的文件，这就涉及到一个顺序问题，需要先请求到html文本，在浏览器里运行解析了这个文本之后才能发送css及js的请求。但是在http2中服务端可以主动把css及js文件推送到客户端，与html并行传输，极大提高传输效率

## 3. http的连接
![](https://blog.liusixin.cn/content/images/2018/06/WX20180606-162521-2x.png)

在客户端和服务端之间进行http请求的发送和返回的过程当中，需要创建一个 TCP connection。http只有请求和响应这个概念，不存在连接，请求和响应都是数据包，
之间要经过一个传输的通道，这个传输的通道就是在tcp里创建的一个连接(TCP connection)。这个连接可以保持状态，http请求就是在这个连接之上发送的，所以在一个tcp连接上可以发送多个http请求。

在不同版本下，http连接的模式不一样，在http1.0里，这个连接是在http请求创建同时创建tcp连接，请求结束后tcp连接就会关闭。

在http1.1里，这个连接可以通过某种方式声明是否保持连接状态。tcp连接在创建过程中有三次握手消耗，三次握手就表示三次网络传输(客户端发送 - 服务端响应 - 客户端再次发送)，然后才能发送http请求。如果tcp连接一直保持，第二个http请求就没有三次握手的开销

在http2里不仅可以保持tcp的连接，同时这个连接上的http请求可以并发，就是说同一个用户对同一个服务器发起一个网页请求时只需要一个tcp连接。

### 3.1 tcp的三次握手
![](https://blog.liusixin.cn/content/images/2018/06/WX20180606-162552-2x.png)

(一) 在tcp的三次握手当中，客户端会向服务端发起一个创建连接的数据包请求，这里会有一个标识为 `SYN=1`,SYN是一个标志位，表示创建请求的数据包。后面会发送一个叫 `Seq=X`，X表示数字，一般为1。服务端接收到这个数据包之后就会知道要创建一个连接

(二) 创建连接之后，服务端就会开启一个 tcp 端口，返回给客户端数据，这个数据 `SYN=1,ACK=X+1,Seq=Y`,客户端拿到这个数据表示服务端允许创建这个tcp连接。

(三) 这时候客户端再去发送 `ACK=Y+1,Seq=Z`。

那么为什么tcp要进行三次握手呢，这是为了防止服务端开启一些无用连接，网络连接具有延时性。客户端向服务端发起创建连接请求时，服务端直接创建了这个连接，返回的数据包因为网络原因丢失，那么客户端就一直接收不到服务器返回的数据，连接超时这个连接就会关闭，然后再发起新的连接，如果没有三次握手的话，这时服务端是不知道客户端到底有没有接收到返回的数据，浪费服务端的开销。所以需要三次握手去即时的察觉到网络原因导致的数据包传输中断的问题。

### 3.2 URI、URL、URN
在http协议中，基本上使用的都是URL。

* URI(Uniform Resource Identifier)
  * 统一资源标志符
  * 用来唯一标识互联网上的信息资源
  * 包含URL和URN
* URL(Uniform Resource Locator)
  * 统一资源定位器
* URN
  * 永久统一资源定位符
  * 在资源移动之后还能被找到
  * 目前还没有非常成熟的使用方案

### 3.3 HTTP报文
![](https://blog.liusixin.cn/content/images/2018/06/WX20180606-181124-2x.png)

从图中可以看到http首部下面有一段空行，空行下面表示 http body 部分，上面就是 http headers 部分。

#### 3.3.1 请求报文

(一)  **GET**

http请求头中，首行第一部分包含的是 `method` 请求方法，每个方法有各自的语义，分别是 GET(获取数据)、POST(创建数据)、PUT(更新数据)、DELETE(删除数据)。这几种方法只是语义上的说明，并没有强约束，比如使用 GET 方法去更新数据，只是这样违反了http语义化的定义规则。

(二) **/test/hi-there.txt**

首行第二部分是请求的资源资源地址url，一般这里是存放路由相关的内容

(三) **HTTP/1.0**

首行第三部分是http的版本，现在的web服务一般都是http1.1，http2也会有越来越多的实现，不同的版本也会有不同操作方式。

#### 3.3.2 响应报文
(一)  **200 ok**

http状态码，200 代表成功

### 3.4 HTTP方法
* 用来定义对于资源的操作
* 常用有GET、POST等
* 从定义上有各自的语义
```
GET - 请求指定的页面信息，并返回实体主体。
HEAD - 类似于get请求，只不过返回的响应中没有具体的内容，用于获取报头
POST - 向指定资源提交数据进行处理请求（例如提交表单或者上传文件）。数据被包含在请求体中。POST请求可能会导致新的资源的建立和/或已有资源的修改。
PUT - 从客户端向服务器传送的数据取代指定的文档的内容。
DELETE - 请求服务器删除指定的页面。
```

### 3.5 HTTP CODE
* 定义服务器对请求的处理结果
* 各个区间的CODE有各自的语义
* 好的HTTP服务可以通过CODE判断结果

**HTTP Status：**
```
1xx（临时响应）
表示临时响应并需要请求者继续执行操作的状态代码。

代码   说明
100   （继续） 请求者应当继续提出请求。 服务器返回此代码表示已收到请求的第一部分，正在等待其余部分。
101   （切换协议） 请求者已要求服务器切换协议，服务器已确认并准备切换。

2xx （成功）
表示成功处理了请求的状态代码。

代码   说明
200   （成功）  服务器已成功处理了请求。 通常，这表示服务器提供了请求的网页。
201   （已创建）  请求成功并且服务器创建了新的资源。
202   （已接受）  服务器已接受请求，但尚未处理。
203   （非授权信息）  服务器已成功处理了请求，但返回的信息可能来自另一来源。
204   （无内容）  服务器成功处理了请求，但没有返回任何内容。
205   （重置内容） 服务器成功处理了请求，但没有返回任何内容。
206   （部分内容）  服务器成功处理了部分 GET 请求。

3xx （重定向）
表示要完成请求，需要进一步操作。 通常，这些状态代码用来重定向。

代码   说明
300   （多种选择）  针对请求，服务器可执行多种操作。 服务器可根据请求者 (user agent) 选择一项操作，或提供操作列表供请求者选择。
301   （永久移动）  请求的网页已永久移动到新位置。 服务器返回此响应（对 GET 或 HEAD 请求的响应）时，会自动将请求者转到新位置。
302   （临时移动）  服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求。
303   （查看其他位置） 请求者应当对不同的位置使用单独的 GET 请求来检索响应时，服务器返回此代码。
304   （未修改） 自从上次请求后，请求的网页未修改过。 服务器返回此响应时，不会返回网页内容。
305   （使用代理） 请求者只能使用代理访问请求的网页。 如果服务器返回此响应，还表示请求者应使用代理。
307   （临时重定向）  服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求。

4xx（请求错误）
这些状态代码表示请求可能出错，妨碍了服务器的处理。

代码   说明
400   （错误请求） 服务器不理解请求的语法。
401   （未授权） 请求要求身份验证。 对于需要登录的网页，服务器可能返回此响应。
403   （禁止） 服务器拒绝请求。
404   （未找到） 服务器找不到请求的网页。
405   （方法禁用） 禁用请求中指定的方法。
406   （不接受） 无法使用请求的内容特性响应请求的网页。
407   （需要代理授权） 此状态代码与 401（未授权）类似，但指定请求者应当授权使用代理。
408   （请求超时）  服务器等候请求时发生超时。
409   （冲突）  服务器在完成请求时发生冲突。 服务器必须在响应中包含有关冲突的信息。
410   （已删除）  如果请求的资源已永久删除，服务器就会返回此响应。
411   （需要有效长度） 服务器不接受不含有效内容长度标头字段的请求。
412   （未满足前提条件） 服务器未满足请求者在请求中设置的其中一个前提条件。
413   （请求实体过大） 服务器无法处理请求，因为请求实体过大，超出服务器的处理能力。
414   （请求的 URI 过长） 请求的 URI（通常为网址）过长，服务器无法处理。
415   （不支持的媒体类型） 请求的格式不受请求页面的支持。
416   （请求范围不符合要求） 如果页面无法提供请求的范围，则服务器会返回此状态代码。
417   （未满足期望值） 服务器未满足”期望”请求标头字段的要求。

5xx（服务器错误）
这些状态代码表示服务器在尝试处理请求时发生内部错误。 这些错误可能是服务器本身的错误，而不是请求出错。

代码   说明
500   （服务器内部错误）  服务器遇到错误，无法完成请求。
501   （尚未实施） 服务器不具备完成请求的功能。 例如，服务器无法识别请求方法时可能会返回此代码。
502   （错误网关） 服务器作为网关或代理，从上游服务器收到无效响应。
503   （服务不可用） 服务器目前无法使用（由于超载或停机维护）。 通常，这只是暂时状态。
504   （网关超时）  服务器作为网关或代理，但是没有及时从上游服务器收到请求。
505   （HTTP 版本不受支持） 服务器不支持请求中所用的 HTTP 协议版本。
```
## 4. HTTP客户端
浏览器就是我们最常用的http客户端

![](https://blog.liusixin.cn/content/images/2018/06/WX20180606-193151-2x.png)

同时 curl 可以查看http请求返回的内容

![](https://blog.liusixin.cn/content/images/2018/06/WX20180606-222909-2x-2.png)

curl还可以查看请求的详细内容， `curl  -v [host]`

![](https://blog.liusixin.cn/content/images/2018/06/WX20180606-222733-2x.png)

### 4.1 CORS跨域请求的限制与解决
做过前端开发的同学对跨域并不会陌生，通常我们可以使用jsonp去实现跨域请求。

**jsonp跨域：**
```
<script src="http://www.example.com:8080"></script>
```
**原理：**

浏览器允许 link、img、script 标签上写入路径加载一些内容的时候，是允许跨域的。

**服务端设置跨域：**

这里以express为例，我们只需在响应头中添加 `Access-Control-Allow-Origin` 即可
```
response.writeHead(200, {
  'Access-Control-Allow-Origin': '*'
})
```
浏览器在发送请求的时候并不知道服务是否跨域，还是会发送请求并且接收返回内容，只是在浏览器接收内容的时候没有找到 `Access-Control-Allow-Origin` 头设置为允许的话，它会把请求返回的内容忽略掉并且会在服务端报错。这个是浏览器所提供的功能。

实际上 Access-Control-Allow-Origin 值为 * 是不安全的，这样会导致第三方服务也可以通过跨域访问你的服务，可以设置为特定的域名
```
response.writeHead(200, {
  'Access-Control-Allow-Origin': 'http://xxxx.com'
})
```
#### 4.1.1 CORS预请求

浏览器是根据 header 判断某个请求的返回是否允许，如果想要允许自定义的头进行发送的话，需要返回新的头告知浏览器允许
```
response.writeHead(200, {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'X-Test-Cors'
})
```
![](https://blog.liusixin.cn/content/images/2018/06/WX20180606-233126-2x.png)

同时会发现 network 中多出一个请求，这就是预请求，它的 `Request Method` 为 `OPTIONS`，服务端可以根据不同method进行不同的操作，浏览器根据这个 OPTIONS 请求，来获得服务端允许的权限，接下来发送的它所认可的请求就会被允许，这就是浏览器对于跨域请求的预请求操作。

(一) 在跨域请求中，默认允许的方法只有 GET、HEAD、POST，其它的方法默认不允许，浏览器是有一个预请求的方式去验证的。
```
response.writeHead(200, {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PUT'
})
```
还可以设置某个请求下允许跨域的最大时间,这样就不需要再次发送预请求去验证，可直接发送正式请求
```
response.writeHead(200, {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PUT',
  'Access-Control-Max-Age': '1000'
})
```

(二) 默认允许的Content-Type：text/plain、multipart/form-data、application/x-www-form-urlencoded。这三个就是在html里使用form表单可以设置的三种数据类型。其它的也需要预请求验证过之后才能进行发送。

(三) 其它的请求头限制具体可以查看文档
https://fetch.spec.whatwg.org/#cors-safelisted-request-header

(四) `XMLHttpRequestUpload` 对象均没有注册任何事件监听器

(五) 请求中没有使用 `ReadableStream` 对象

### 4.2 缓存Cache-Control
* 可缓存性
  * `public`（任何地方都会缓存）
  * `private`（发起请求的浏览器）
  * `no-cache` 可以在本地进行缓存，但是每次发起请求都要在服务端验证，如果服务端允许使用本地缓存，才能真正使用本地缓存。
* 到期
  * `max-age = <seconds>`
  * `s-maxage = <seconds>` 在代理服务器中才会生效，代理服务器中如果两个都设置了，会优先选择 s-maxage 配置项
  * `max-stale = <secon ds>` 发起端设置。即便缓存失效，只要这个时间内还可以使用过期的缓存，而不需要去原服务器请求新的内容。
* 重新验证(不常用)
  * `must-revalidate` 在设置了max-age缓存中如果过期，必须去原服务端发送请求然后重新获取数据再来验证内容是否真的过期，而不能直接使用本地缓存。
  * `proxy-revalidate` 和 must-revalidate 类似，但是用在缓存服务器当中。
* 其它
  * `no-store` 与 no-cache 对应，表示任何情况下都不会存储缓存，永远都要去服务端请求新的内容才能使用它。即便服务端允许使用缓存，但本地没有进行缓存
  * `no-transform` 用在 proxy 服务器，有些proxy服务器返回资源过大，会帮助进行压缩及格式转换，该属性会不允许。

没有缓存情况下请求资源

![](https://blog.liusixin.cn/content/images/2018/06/WX20180607-134507-2x.png)

设置客户端缓存后
```
response.writeHead(200, {
  'Content-Type': 'text/javascript',
  'Cache-Control': 'max-age=200'
})
response.end('console.log("script loaded")')
```
![](https://blog.liusixin.cn/content/images/2018/06/WX20180607-134342-2x.png)

可以看到 Size 变为了 == (from memory cache) ==，表示从浏览器中读取缓存。

在做前端开发的时候，有些静态资源文件我们希望浏览器缓存下来，但是在服务端内容更新之后，客户端请求的是缓存下的旧资源文件，这样就没法更新应用。

目前最常见的方式就是前端编译的时候加静态资源文件md5戳。

### 4.3 资源验证
首先看一张图

![](https://blog.liusixin.cn/content/images/2018/06/WX20180607-141513-2x.png)

浏览器创建请求，请求到达本地缓存(如果有cache-control)，如果有本地缓存，就直接返回给浏览器显示出来，不经过任何网络传输。如果没有本地缓存，请求进入网络传输，如果有代理服务器就会进入并查找缓存设置，查看资源是否被缓存，有缓存就返回缓存资源经过本地缓存再到浏览器显示。如果代理服务器未缓存，就会进入原服务器获取新的内容再返回。

#### 4.3.1 验证头
* Last-Modified
  * 上次修改时间
  * 配合If-Modified-Since或者If-Unmodified-Since使用

浏览器在请求资源的headers里有 `Last-Modified` 这个头，并指定了时间，这个时间内下次浏览器发起请求时就会带上 `Last-Modified`传入的值，通过 `If-Modified-Since` 或 `If-Unmodified-Since`(通常为If-Modified-Since)带到服务器上，服务器通过读取 headers里If-Modified-Since 带入的值找到资源存在的地方对比上次修改的时间，如果时间一样，就表示资源没有被重新修改过，服务器就通知浏览器直接使用缓存的资源，这就是资源验证的过程。

* Etag(更加严格的验证方式)
  * 数据签名 - 对内容产生唯一的签名
  * 配合If-Match或者If-Non-Match使用

有任何的修改两个签名就会不一样，最典型的做法就是对资源内容做哈希计算，计算之后会得到一个唯一值，用这个签名来标记这个资源，下一次浏览器发起请求时会带上
If-Match或者If-Non-Match头，这个头的值就是服务端返回Etag的值，然后对比服务器拿到浏览器传入的签名和服务器存在的签名，如果相同，就不需要返回新的内容。

### 4.4 Cookie和Session
* Cookie
  * 通过Set-Cookie设置
  * 下次请求会自动带上
  * 键值对，可以设置多个

* Cookie属性
  * max-age(有效时间)和expires(到某个时间点过期)设置过期时间
  * Secure只在https的时候发送
  * HttpOnly无法通过document.cookie访问

```
// Cookie设置，以express为例
response.writeHead(200, {
  'Content-Type': 'text/html',
  'Set-Cookie': 'name=hello'
})

// 设置多个
'Set-Cookie': ['name=hello', 'age=12']

// 过期时间
'Set-Cookie': ['name=hello; max-age=2', 'age=12']

// 禁止js访问cookie
'Set-Cookie': ['name=hello', 'age=12; HttpOnly']

// 子域名共享主域名cookie，前提是cookie要在主域名下设置
'Set-Cookie': ['name=hello', 'age=12; domain=example.com']
```
**Session**

session机制是一种服务器端的机制，服务器使用一种类似于散列表的结构（也可能就是使用散列表）来保存信息。

当程序需要为某个客户端的请求创建一个session的时候，服务器首先检查这个客户端的请求里是否已包含了一个session标识 - 称为session id，如果已包含一个session id则说明以前已经为此客户端创建过session，服务器就按照session id把这个session检索出来使用（如果检索不到，可能会新建一个），如果客户端请求不包含session id，则为此客户端创建一个session并且生成一个与此session相关联的session id，session id的值应该是一个既不会重复，又不容易被找到规律以仿造的字符串，这个session id将被在本次响应中返回给客户端保存。

保存这个session id的方式可以采用cookie，这样在交互过程中浏览器可以自动的按照规则把这个标识发挥给服务器。一般这个cookie的名字都是类似于SEEESIONID，而。比如weblogic对于web应用程序生成的cookie，JSESSIONID=ByOK3vjFD75aPnrF7C2HmdnV6QZcEbzWoWiBYEnLerjQ99zWpBng!-145788764，它的名字就是JSESSIONID。

由于cookie可以被人为的禁止，必须有其他机制以便在cookie被禁止时仍然能够把session id传递回服务器。经常被使用的一种技术叫做URL重写，就是把session id直接附加在URL路径的后面，附加方式也有两种，一种是作为URL路径的附加信息，表现形式为http://...../xxx;jsessionid=ByOK3vjFD75aPnrF7C2HmdnV6QZcEbzWoWiBYEnLerjQ99zWpBng!-145788764

另一种是作为查询字符串附加在URL后面，表现形式为http://...../xxx?jsessionid=ByOK3vjFD75aPnrF7C2HmdnV6QZcEbzWoWiBYEnLerjQ99zWpBng!-145788764

这两种方式对于用户来说是没有区别的，只是服务器在解析的时候处理的方式不同，采用第一种方式也有利于把session id的信息和正常程序参数区分开来。为了在整个交互过程中始终保持状态，就必须在每个客户端可能请求的路径后面都包含这个session id。

另一种技术叫做表单隐藏字段。就是服务器会自动修改表单，添加一个隐藏字段，以便在表单提交时能够把session id传递回服务器。比如下面的表单：
```
<form name="testform" action="/xxx">
  <input type="text">
</form>
```
在被传递给客户端之前将被改写成：
```
<form name="testform" action="/xxx">
  <input type="hidden" name="jsessionid" value="ByOK3vjFD75aPnrF7C2HmdnV6QZcEbzWoWiBYEnLerjQ99zWpBng!-145788764">
  <input type="text">
</form>
```
这种技术现在已较少应用，实际上这种技术可以简单的用对action应用URL重写来代替。

### 4.5 HTTP长连接
http的请求是在tcp的连接上进行发送的，tcp连接又分为长连接和短连接。

长连接就是在tcp连接上把http请求发送并接收返回，这个时候一次http请求已经结束，浏览器和服务器会协商是否断掉这个连接，长连接就是在不断掉连接下可以持续发送http请求，适合高并发。

![](https://blog.liusixin.cn/content/images/2018/06/WX20180607-164944-2x.png)
在Connection Id这一栏可以看到很多 10247 的相同id，表示这些请求都是在同一连接下发送的。但还是会有不同的连接，因为http1.1的连接在tcp连接上发送请求是有先后顺序的，不会并发请求。

我们希望在加载网站首页的时候可以并发处理这些请求，浏览器可以允许产生一个并发的创建tcp连接，chrome允许最大并发数为6。

![](https://blog.liusixin.cn/content/images/2018/06/WX20180607-170036-2x.png)

可以看到，并发情况下会创建不同的tcp连接，chrome如果超出了6个并发，后面的请求会等待前面的完成，并且会尽量复用前面的连接地址而保持长连接，这是浏览器默认的行为。

可以手动关闭长连接
```
response.writeHead(200, {
  'Content-Type': 'image/jpg',
  'Connection': 'close'
})
```
![](https://blog.liusixin.cn/content/images/2018/06/WX20180607-171314-2x.png)

关闭长连接之后可以发现每次连接id都会不一样，后面的也会等待前面的完成，没有重复利用tcp连接，每次请求发送完成tcp连接就会关闭。

一般情况下keep-alive都是开启的，并且会设置一个自动关闭时间。

**信道复用**

在tcp连接上并发的发送http请求，也就是说在连接一个网站时只需一个tcp连接，只在同域下请求有效，http2实现了这个功能。

### 4.6 数据协商
在客户端发送给服务端请求的时候，客户端会声明这个请求拿到的数据格式以及数据相关的一些限制是怎样的，服务端会根据客户端的这个声明做出判断，从而返回不同的数据类型格式。

**分类**

* 请求
  * Accept
  * Accept-Encoding
  * Accept-Language
  * User-Agent
* 返回
  * Content-Type
  * Content-Encoding
  * Content-Language

> Accept里MIME_types相关对照表看这里[文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)

### 4.7 Redirect
在开发中，我们存放资源的位置如果发生了改变，页面在请求时就会报404错误，为了避免这种错误，需要帮助浏览器指向到正确的地址。
```
http.createServer(function(req, res) {
  if(req.url === '/'){
    res.writeHead(302, {
      'Location': '/new'
    })
    res.end('')
  }

  if(req.url === '/new'){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    })
    res.end('<div>web</div>')
  }
})
```
![](https://blog.liusixin.cn/content/images/2018/06/WX20180607-180941-2x.png)

图中可以看到第一次请求页面状态码为302，并跳转到了new这个url下。

但是 302 是临时跳转，每一次访问都要经过服务端的跳转，图中也可以看到有两个url的请求。如果确定每次访问 / 下都会跳转到 new 下，可以指定状态码为 301 永久跳转，这样访问页面就只出现 new。

需要注意的是，301 会尽可能长时间的把跳转页面缓存下来，这时候服务端即使修改了url，浏览器还是会从缓存里读取，这个是有用户使用浏览器情况所决定的，除非用户主动去清理浏览器缓存。所以 301 要慎重处理。

### 4.8 CSP
Content-Security-Policy内容安全策略，这使得浏览器变得更加安全。

**作用**

* 限制资源获取
* 报告资源获取越权

**限制方式**

* default-src限制全局
* 制定资源类型
  * connect-src
  * img-src
  * manifest-src
  * font-src
  * media-src
  * style-src
  * frame-src
  * script-src

```
res.writeHead(200, {
  'Content-Type': 'text/html',
  'Content-Security-Policy': 'default-src http: https:'
})
```
加入限制之后浏览器就会阻止js脚本的加载并报错

![](https://blog.liusixin.cn/content/images/2018/06/WX20180607-183042-2x.png)

只允许本站下的资源
```
res.writeHead(200, {
  'Content-Type': 'text/html',
  'Content-Security-Policy': 'default-src \'self\''
})
```
允许某些站点的内容
```
res.writeHead(200, {
  'Content-Type': 'text/html',
  'Content-Security-Policy': 'default-src \'self\' http://www.example.com/'
})
```
限制form表单的跳转
```
res.writeHead(200, {
  'Content-Type': 'text/html',
  'Content-Security-Policy': 'default-src \'self\'; form-action \'self\''
})
```
> 详细内容可以查看csp文档 [MDN CSP](https://developer.mozilla.org/zh-CN/docs/Web/Security/CSP)

内容安全策略如果出现了不希望出现的情况下，可以申请主动向服务端发起请求来汇报
```
res.writeHead(200, {
  'Content-Type': 'text/html',
  'Content-Security-Policy': 'default-src \'self\' report-uri /report'
})
```
![](https://blog.liusixin.cn/content/images/2018/06/WX20180607-185148-2x.png)

如果我们只想对限制进行错误报告而不阻止资源加载的话，可以这么写
```
res.writeHead(200, {
  'Content-Type': 'text/html',
  'Content-Security-Policy-Report-Only': 'default-src \'self\''
})
```
scp不仅可以写在 headers 里，还可以在html的meta标签里写
```
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
```
在meta下是不允许写 report-uri 的，这个指令只能写在 headers 里。

## 5. Nginx代理服务器

### 5.1 基础代理配置

nginx是现在互联网界用的最多的web服务器，它是一个非常纯粹的做http协议实现的服务器，并没有一个工具来实现业务逻辑的开发。主要是用来做http的代理服务器。

nginx的安装和用法可以查网上相关教程。这里介绍的主要是nginx的代理和缓存的功能。

一个最简单的代理
```
// nginx.conf

server {
  listen       80;
  server_name  example.com;

  location / {
    proxy_pass http://127.0.0.1:8080;
    # proxy_set_header Host $host;
  }
}
```
![](https://blog.liusixin.cn/content/images/2018/06/WX20180608-121046-2x.png)
![](https://blog.liusixin.cn/content/images/2018/06/WX20180608-121213-2x.png)

可以看到，浏览器下host 是 `test.com`，但在服务器下就变成了 `127.0.0.1:8888`。这是因为设置了代理，浏览器请求是发送到nginx的，nginx再进行转发，发送到实际的node服务，这时候作为发起方，它认为的 host 就是这里设置的 `proxy_pass`。

想要拿到浏览器的 host 。可以设置 `proxy_set_header` 属性 `$host`。

中间代理可以修改任何想要修改的数据，但只是在http中，https的传输过程是加密的，中间代理无法解析。在手机上所看到的一些移动联通的广告就是经过代理层插入了一些代码所展示的。

### 5.2 nginx缓存
```
// nginx.conf

proxy_cache_path cache levels=1:2 keys_zone=my_cache:10m;

server {
  listen       80;
  server_name  example.com;

  location / {
    proxy_cache my_cache;
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
  }
}
```
**proxy_cache_path：**第一个选项表示缓存路径，`levels` 是否创建二级文件夹，`keys_zone` url对应的缓存位置及内存大小

```
response.writeHead(200, {
  'Cache-Control': 'max-age=10, s-maxage=10, private'
})
```
`s-maxage` 是专门为代理缓存设置过期时间的，而private就表示只允许浏览器缓存。

### 5.3 HTTPS
![](https://blog.liusixin.cn/content/images/2018/06/WX20180608-130309-2x-2.png)

https在传输过程中，客户端会生成一个随机数传输到服务端，中间会带上一个支持的加密套件，服务端拿到之后保存并且也生成一段随机数，然后把这段随机数和服务端生成的证书一同发到客户端，同时客户端也会把服务端的随机数保存，并且通过服务端证书生成预主秘钥，生成过程也会生成一个随机数，这个随机数通过公钥加密后传输给服务端，服务端通过私钥解密拿到预主秘钥。然后客户端和服务端同时对这三个随机数进行算法解密生成主密钥(这里会涉及到加密套件，服务端选择的加密套件必须是客户端所支持的)，后续的数据传输都是经过主密钥加密进行传输的。这对主密钥只有客户端和服务端共有，中间代理无法破解，这就是https的加密原理。

![](https://blog.liusixin.cn/content/images/2018/06/WX20180608-131702-2x-2.png)

这里是通过抓取工具抓的https加密的站点，可以看到，数据都被加密，无法破解。

#### 5.3.1 nginx部署https服务
要部署https服务，首先要生成一对公钥和私钥，这里有一个命令可以帮助生成

```
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -keyout localhost-privkey.pem -out localhost-cert.pem
```
![](https://blog.liusixin.cn/content/images/2018/06/WX20180608-170452-2x.png)

敲入回车之后可以看到这样的提示，这里我们测试，全部按回车跳过就好。

![](https://blog.liusixin.cn/content/images/2018/06/WX20180608-170824-2x.png)

最终会生成两个文件，然后在nginx配置这个证书
```
// nginx.conf

proxy_cache_path cache levels=1:2 keys_zone=my_cache:10m;

server {
  listen       80 default_server;
  listen       [::]:80 default_server;
  server_name  test.com;
  return 302 https://$server_name$request_uri;
}

server {
  listen       443;
  server_name  test.com;

  ssl on;
  ssl_certificate_key /www/data/cert/localhost-privkey.pem;
  ssl_certificate /www/data/cert/localhost-cert.pem;

  location / {
    proxy_cache my_cache;
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
  }
}
```
配置好之后重启nginx服务，然后输入https的域名
![](https://blog.liusixin.cn/content/images/2018/06/WX20180608-171754-2x.png)

提示非安全连接是因为chrome浏览器认为的安全证书是要通过有权威的机构去签发的，这种机构会先认证域名所有者与服务是否属于你，验证通过才会签发证书。

#### 5.3.2 http2
* 优势
  * 信道复用
  * 分帧传输
  * Server Push(推送)

**http2的使用**
```
res.writeHead(200, {
  'Content-Type': 'text/html',
  'Link': '</test.jpg>; as=image; rel=preload'
})
```
server 头信息了的 `Link`可以指定这个头想要推送的内容，`</xxx>` 为文件绝对路径，`as` 指定文件类型，`preload` 表示需要进行服务端推送。

nginx里也要做这些配置。在使用nginx做反向代理时，我们希望nginx帮助处理这些东西，而 http2 也是在nginx里提供的，node server 还是为http的服务，nginx 会把http2的请求转化为http的请求发送到node服务上。

为何不在node上做http2的服务呢，因为在nginx开启一个http2的服务是非常容易的，在 node 上做http2的服务可能还会涉及到大量的逻辑修改，成本开销比较大。

> 需要注意的是，目前只有在https下才能开启http2

在nginx下开启http2很简单。
```
// nginx.conf

proxy_cache_path cache levels=1:2 keys_zone=my_cache:10m;

server {
  listen       80 default_server;
  listen       [::]:80 default_server;
  server_name  test.com;
  return 302 https://$server_name$request_uri;
}

server {
  listen       443 http2;
  server_name  test.com;
  http2_push_preload on;

  ssl on;
  ssl_certificate_key /www/data/cert/localhost-privkey.pem;
  ssl_certificate /www/data/cert/localhost-cert.pem;

  location / {
    proxy_cache my_cache;
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
  }
}
```
`http2_push_preload` 开启之后，在接收 node 返回信息里如果有 `Link：rel=preload`，就会去寻找该路径资源，然后主动推送。

![](https://blog.liusixin.cn/content/images/2018/06/WX20180608-175257-2x.png)

可以看到 `Protocal` 值为 `h2`，这个就是http2的缩写。

这里有一个可以测试http2性能的网站 [网站入口](https://http2.akamai.com/demo/http2-lab.html)

![](https://blog.liusixin.cn/content/images/2018/06/WX20180608-183211-2x-2.png)

可以看到，使用HTTP2的性能提升非常显著。

有些浏览器不支持http2，nginx会帮助浏览器做兼容处理，这个兼容方案为 ALPN ，客户端跟服务端会进行协商用哪个协议，如果客户端只支持http1.1，服务端就会以http1.1的传输方式进行。
