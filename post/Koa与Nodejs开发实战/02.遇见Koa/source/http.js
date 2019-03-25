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
