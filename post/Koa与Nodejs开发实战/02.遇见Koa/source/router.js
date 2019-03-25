const koa = require('koa');
const app = new koa();
app.use(async (ctx) => {
    if(ctx.request.method === 'POST') { // 判断是否为POST请求
        // 处理 POST 请求
    } else if (ctx.request.method === 'GET') { // 判断是否为GET请求
        if (ctx.request.path !== '/') {
            ctx.response.type = 'html';
            ctx.response.body = '<a href="/">Go To Index</a>';
        } else {
            ctx.response.body = 'Hello World';
        }
    }
});
app.listen(3000, () => console.log('server is starting at 3000'));

//  curl -d "param1=value1&param2=value2" http://localhost:3000/
