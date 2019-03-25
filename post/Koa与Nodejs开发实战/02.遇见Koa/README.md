# 遇见Koa

- 2.1 Koa介绍
- 2.2 context对象
- 2.3 Koa的中间件

## 2.2 context对象

### 常用属性和方法

- ctx.request
  - url 获取请求 URL
  - query 获取解析的查询字符串
  - querystring 获取原始查询字符串
  - accepts 判断客户端期望的数据类型
- ctx.response
  - status 请求状态
  - type 设置响应的数据类型 `Content-Type`
  - body 设直响应体内容
  - redirect 重定向
- ctx.state 命名空间，用于通过中间件传递信息和前端视图。类似 `koa-views` 这些渲染 View 层的中间件也会默认把 `ctx.state` 里面的属性作为 View 的上下文传入。
  - `ctx.state.user = yield User.find(id) ;` 把user属性存放到 ctx.state 对象里，以便能够被另一个中间件读取。
- ctx.cookies
  - `ctx.cookies.get(name, [options]);` 获取Cookie
  - `ctx.cookies.set(name, value, [options]);` 设置Cookie

option 的配置表：

| key | value |
|:---|:---|
maxAge | 一个以毫秒为单位的数字，表示过期时间
signed | 签名值
expires | 过期的Date
path | 路径，默认是/
domain | Cookie域名
secure | 安全 Cookie，只能使用 HTTPS访问
httpOnly | 如果为true，则Cookie无法被JavaScript获取到
overwrite | 一个布尔值，表示是否覆盖以前设置的同名Cookie (默认是false)

- ctx.throw 用于抛出错误，把错误信息返回给用户

## 2.3 Koa的中间件

### 概念

中间件函数是一个带有 `ctx` 和 `next` 两个参数的简单函数。 `ctx` 就是之前章节介绍的上下
文，封装了 `Request` 和 `Response` 等对象; `next` 用于把中间件的执行权交给下游的中间件。在 `next()`之前使用 `await` 关键字是因为 `next()` 会返回一个 Promise 对象，而在当前中间件中位于 `next()`之后的代码会暂停执行，直到最后一个中间件执行完毕后，再自下而上依次执行每个中间件中 `next()`之后的代码，类似于一种先进后出的堆栈结构。

```js
app.use(async function (ctx, next) {
    console .log(ctx.method, ctx.host + ctx.url)  // 打印请求方法、主机名、 URL
    await next();
    ctx.body = 'Hello World';
})
```

上述代码是 Koa 应用程序的一个简单的 "Hello World"示例，可以把其中打印日志的部分单独抽象成 一个 logger 函数:

```js
const logger = async function (ctx, next) {
    console .log(ctx.method, ctx.host + ctx.url)  // 打印请求方法、主机名、 URL
    await next();
}
app.use(logger); // 使用 app.use加载中间件
app.use(async function (ctx, next) {
    ctx.body = 'Hello World';
})
```

抽象出来的 logger 函数就是中间件，通过 `app.use()` 函数来加载中间件。

如果想将多个中间件组合成一个单一的中间件，便于重用或导 出，可以使用 koa-compose

```js
const compose = require (’ koa-compose ’ ) ;
async function middleware1(ctx, next) {
    // do something
    await next{);
};
async function middleware2 (ctx, next) {
    // do something
    await next();
};
async function middleware3 (ctx, next) {
    // do something
    await next();
};
const all = compose([middleware1, middleware2, middleware3));
app.use(all);
```

### 实战演练:使用中间件获取晌应时间

在项目中，经常需要记录服务器的响应时间，响应时间指的是从服务器接收到 HTTP 请求到最终返回给客户端之间所耗的时长：

```js
const koa = require('koa');
const app = new koa();
app.use(async (ctx, next) => { // 记录服务器响应时间的中间件
    let startTime = new Date().getTime(); // 记录当前时间戳
    await next(); // 事件控制权中转
    let endTime = new Date().getTime(); // 所有中间件执行完成后记录当前时间
    ctx.response.type = 'text/html';
    ctx.response.body = `<h1>Hello World</h1>`;
    console.log(`请求地址：${ctx.path}  响应时间：${endTime - startTime}ms`);
});
app.use(async (ctx, next) => {
    console.log('中间件 doSoming');
    await next();
    console.log('中间件执行 over');
})
app.listen(3000, () => console.log('server is starting at 3000'));
```

然后打开浏览器输入 `http://localhost:3000`控制台会打印

```bash
server is starting at 3000
中间件 doSoming
中间件执行 over
请求地址：/  响应时间：1ms
中间件 doSoming
中间件执行 over
请求地址：/favicon.ico  响应时间：1ms
```

### 常用 Koa 中间件介绍

> Koa 社区提供了 很多有用的中间件，参考 https://github.com/koajs/koa/wiki 进行搜索 。

- koa-bodyparser 可以把 POST 请求的参数解析到 ctx.request.body 中

```js
const koa = require('koa');
const app = new koa();
const bodyParser = require('koa-bodyparser');

app.use(bodyParser());
app.use(async (ctx) => {
    if(ctx.url === '/' && ctx.method === 'GET') {
        ctx.type = 'html';
        let html = `
            <h1>登录</h1>
            <form method="POST" action="/">
                <p>用户名</p>
                <input name="username" /><br/>
                <p>密码</p>
                <input name="password" /><br/>
                <button type="submit">submit</button>
            </form>
        `
        ctx.body = html;
    } else if(ctx.url === '/' && ctx.method === 'POST') {
        // 当 POST请求时，中间件 koa-bodyparser解析 POST表单里的数据
        let postData = ctx.request.body
        ctx.body = postData
    }
});
app.listen(3000, () => console.log('server is starting at 3000'));
```

- koa-router

```js
const koa = require('koa');
const app = new koa();
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const router = new Router();

router.get('/', (ctx, next) => {
    ctx.type = 'html';
    let html = `
        <h1>登录</h1>
        <form method="POST" action="/">
            <p>用户名</p>
            <input name="username" /><br/>
            <p>密码</p>
            <input name="password" /><br/>
            <button type="submit">submit</button>
        </form>
    `
    ctx.body = html;
})
router.post('/', (ctx, next) => {
    // 当 POST请求时，中间件 koa-bodyparser解析 POST表单里的数据
    let postData = ctx.request.body
    ctx.body = postData
})

app
    .use(bodyParser()) // 加载 koa-bodyparser 中间件
    .use(router.routes()) // 加载 koa-router 中间件
    .use(router.allowedMethods()) //对异常状态码的处理

app.listen(3000, () => console.log('server is starting at 3000'));
```

- koa-static 与 koa-views
