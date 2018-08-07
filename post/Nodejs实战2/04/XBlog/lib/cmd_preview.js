var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var utils = require('./utils');
var open = require('open');

module.exports = function(dir) {
  dir = dir || '.'; // 指定当前博客项目所在的目录，如果没有指定则默认为当前目录

  // 初始化express
  var app = express();
  var router = express.Router();
  app.use('/assets', serveStatic(path.resolve(dir, 'assets'))); // 静态资源文件
  app.use(router);

  // 渲染文章
  router.get('/posts/*', function(req, res, next) { // 文章内容页面
    var name = utils.stripExtname(req.params[0]);
    var file = path.resolve(dir, '_posts', name + '.md');
    var html = utils.renderPost(dir, file);
    res.end(html);
  })

  // 渲染列表
  router.get('/', function(req, res, next) { // 文章列表页面
    var html = utils.renderIndex(dir);
    res.end(html);
  })

  var config = utils.loadConfig(dir);
  var port = config.port || 3000;
  var url = 'http://127.0.0.1:' + port;
  app.listen(port, function() {
    console.log(`Blog is running`);
  })
  open(url);
};