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
