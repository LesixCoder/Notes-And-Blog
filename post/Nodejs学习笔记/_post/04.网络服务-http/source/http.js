var http = require('http');

// http server 例子
var server = http.createServer(function(req, res) {
  var url = req.url;
  res.end('您访问的地址是：' + url);
});

server.listen(3000);

// http client 例子
var client = http.get('http://127.0.0.1:3000', function(res) {
  res.pipe(process.stdout);
});