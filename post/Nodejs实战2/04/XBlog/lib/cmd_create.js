var path = require('path');
var utils = require('./utils');
var fs = require('fs-extra');
var moment = require('moment');

module.exports = function(dir) {
  dir = dir || '.';

  // 创建基本目录
  fs.mkdirsSync(path.resolve(dir, '_layout'));
  fs.mkdirsSync(path.resolve(dir, '_posts'));
  fs.mkdirsSync(path.resolve(dir, 'assets'));
  fs.mkdirsSync(path.resolve(dir, 'posts'));

  // 复制模板文件
  var tplDir = path.resolve(__dir, '../tpl');
  fs.copySync(tplDir, dir);

  // 创建第一篇文章
  newPost(dir, 'hello, world', '这是我的第一篇文章');
  console.log('OK');
}

// 创建一篇文章
function newPost(dir, title, content) {
  var data = [
    '---',
    'title: ' + title,
    'date: ' + moment().format('YYYY-MM-DD'),
    '---',
    '',
    content
  ].join('\n');
  var name = moment().format('YYYY-MM') + '/hello-world.md';
  var file = path.resolve(dir, '_posts', name);
  fs.outputFileSync(file, data);
}