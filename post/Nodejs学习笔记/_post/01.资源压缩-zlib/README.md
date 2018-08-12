## 概览

浏览器通过 HTTP 请求头部里加上 `Accept-Encoding`，值如下：

- `gzip`
- `defalte`

```shell
Accept-Encoding: gzip, deflate
```

在 nodejs 里，使用 `Zlib` 模块对资源进行压缩。

## 入门实例：简单的压缩/解压缩

### 压缩

非常简单的几行代码，就完成了本地文件的 gzip 压缩。

```js
var fs = require('fs');
var zlib = require('zlib');

var gzip = zlib.createGzip();

var inFile = fs.createReadStream('./fileForCompress.txt');
var out = fs.createWriteStream('./fileForCompress.txt.gz');

inFile.pipe(gzip).pipe(out);
```

### 解压

同样非常简单，就是个反向操作。

```js
var fs = require('fs');
var zlib = require('zlib');

var gunzip = zlib.createGunzip();

var inFile = fs.createReadStream('./fileForCompress.txt.gz');
var outFile = fs.createWriteStream('./fileForCompress1.txt');

inFile.pipe(gunzip).pipe(outFile);
```

### 服务端 gzip 压缩

首先判断 是否包含 `accept-encoding` 首部，且值为 `gzip`。

- 否：返回未压缩的文件。
- 是：返回 gzip 压缩后的文件。

```js
var http = require('http');
var zlib = require('zlib');
var fs = require('fs');
var filepath = './fileForGzip.html';

var server = http.createServer(function(req, res) {
  var acceptEncoding = req.headers['accept-encoding'];
  var gzip;

  if (acceptEncoding.indexOf('gzip') != -1) { // 判断是否需要gzip压缩
    gzip = zlib.createGzip();

    // 记得响应 Content-Encoding，告诉浏览器：文件被 gzip 压缩过
    res.writeHead(200, {
      'Content-Encoding': 'gzip'
    });
    fs.createReadStream(filepath).pipe(gzip).pipe(res);
  } else {
    fs.createReadStream(filepath).pipe(res);
  }
});

server.listen('3000');
```

### 服务端字符串 gzip 压缩

代码跟前面例子类似，这里采用了 `zlib.gzipSync(str)` 对字符串进行 gzip 压缩。

```js
var http = require('http');
var zlib = require('zlib');

var responseText = 'hello world';

var server = http.createServer(function(req, res) {
  var acceptEncoding = req.headers['accept-encoding'];
  if (acceptEncoding.indexOf('gzip') != -1) {
    res.writeHead(200, {
      'content-encoding': 'gzip'
    });
    res.end(zlib.gzipSync(responseText));
  } else {
    res.end(responseText);
  }
});

server.listen('3000');
```

### 总结

deflate 压缩的使用也差不多，更多详细用法可参考[官方文档](https://nodejs.org/api/zlib.html#zlib_class_options)。
