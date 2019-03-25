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
