// 加载 `unit-test/test/*.js` 里所有的测试文件
const tests = require.context('./test', true, /\.js$/);
tests.keys().forEach(tests);
// 加载 `js/lib/*.js` 里的lib文件
const libs = require.context('../js/lib', true, /util\.js$/);
libs.keys().forEach(libs);
// 加载 `js/module/*.js` 里所有的 module 文件
const modules = require.context('../js/module', true, /\.js$/); 
modules.keys().forEach(modules);