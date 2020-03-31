## 【深度实践课】

### 三. ES6在企业中的应用

1. 模块语法

```js
import {$} from 'jquery.js'; // es6
var $ = require('jquery.js')['$']; // amd

export {$}; // es6
export.$ = $; // amd
```

- 按需引入 vs 全局引入
- 多点暴露 vs 全局暴露

```js
import {each, ...} from 'underscore.js'; // es6
var _ = require('underscore.js'); // amd

export {each, map, ...}; // es6
module.exports = _; // amd
```

2. 实战

- 在线编译器(https://babeljs.io/repl/)

3. 参考资料

- http://es6.ruanyifeng.com/
- http://www.infoq.com/cn/es6-in-depth/
- http://www.ecma-international.org/ecma-262/6.0/
- http://es6-features.org/
- https://github.com/lukehoban/es6features
- https://github.com/es6-org/exploring-es6
- http://yanhaijing.com/es5/
