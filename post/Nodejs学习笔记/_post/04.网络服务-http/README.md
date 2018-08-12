# HTTP 相关

- http
- http-req
- http-res
- http-client
- http-server
- https

## http 模块概览

大多数 nodejs 开发者都是冲着开发 web server 的目的选择了 nodejs。借助 http 模块，可以几行代码就搞定一个超迷你的 web server。

在 nodejs 中，`http` 可以说是最核心的模块，同时也是比较复杂的一个模块。上手很简单，但一旦深入学习，不少初学者就会觉得头疼，不知从何入手。

### 一个简单的例子

在下面的例子中，我们创建了 1 个 web 服务器、1 个 http 客户端

- 服务器 server：接收来自客户端的请求，并将客户端请求的地址返回给客户端。
- 客户端 client：向服务器发起请求，并将服务器返回的内容打印到控制台。

```js
var http = require('http');

// http server 例子
var server = http.createServer(function(serverReq, serverRes) {
  var url = serverReq.url;
  serverRes.end('您访问的地址是：' + url);
});

server.listen(3000);

// http client 例子
var client = http.get('http://127.0.0.1:3000', function(clientRes) {
  clientRes.pipe(process.stdout);
});
```

### 例子解释

在上面这个简单的例子里，涉及了 4 个实例。大部分时候，serverReq、serverRes 才是主角。

- server：`http.Server` 实例，用来提供服务，处理客户端的请求。
- client：`http.ClientReques` 实例，用来向服务端发起请求。
- serverReq/clientRes：其实都是 `http.IncomingMessage` 实例。serverReq 用来获取客户端请求的相关信息，如 request header；而 clientRes 用来获取服务端返回的相关信息，比如 response header。
- serverRes：`http.ServerResponse` 实例

### 关于 http.IncomingMessage、http.ServerResponse

- `http.ServerResponse` - 服务端通过 `http.ServerResponse` 实例，来个请求方发送数据。包括发送响应表头，发送响应主体等。
- `http.IncomingMessage` 实例
  - 在 server 端：获取请求发送方的信息，比如请求方法、路径、传递的数据等。
  - 在 client 端：获取 server 端发送过来的信息，比如请求方法、路径、传递的数据等。

http.IncomingMessage 实例 有三个属性需要注意：method、statusCode、statusMessage。

- `method`：只在 server 端的实例有（也就是 serverReq.method）
- `statusCode/statusMessage`：只在 client 端 的实例有（也就是 `clientRes.method`）

### 关于继承与扩展

#### http.Server

- `http.Server` 继承了 `net.Server` （于是顺带需要学一下 net.Server 的 API、属性、相关事件）
- `net.createServer(fn)`，回调中的 `socket` 是个双工的 stream 接口，也就是说，读取发送方信息、向发送方发送信息都靠他。

> socket 的客户端、服务端是相对的概念，所以其实 `net.Server` 内部也是用了 `net.Socket`。

```js
// 参考：https://cnodejs.org/topic/4fb1c1fd1975fe1e1310490b
var net = require('net');

var PORT = 8989;
var HOST = '127.0.0.1';

var server = net.createServer(function(socket) {
  console.log('Connected: ' + socket.remoteAddress + ':' + socket.remotePort);

  socket.on('data', function(data) {
    console.log('DATA ' + socket.remoteAddress + ': ' + data);
    console.log('Data is: ' + data);

    socket.write('Data from you is  "' + data + '"');
  });

  socket.on('close', function() {
    console.log('CLOSED: ' + socket.remoteAddress + ' ' + socket.remotePort);
  });
});
server.listen(PORT, HOST);

console.log(server instanceof net.Server); // true
```

#### http.ClientRequest

http.ClientRequest 内部创建了一个 socket 来发起请求，[代码如下](https://github.com/nodejs/node/blob/master/lib/_http_client.js#L174)。

当你调用 `http.request(options)` 时，内部是这样的

```js
self.onSocket(net.createConnection(options));
```

#### http.ServerResponse

- 实现了 Writable Stream interface，内部也是通过 socket 来发送信息。

### http.IncomingMessage

- 实现了 Readable Stream interface，参考[这里](https://github.com/nodejs/node/blob/master/lib/_http_incoming.js#L62)
- req.socket --> 获得跟这次连接相关的 socket
