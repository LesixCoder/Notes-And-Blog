const koa = require('koa');
const app = new koa();
app.use(async (ctx) => {
    let postData = '';
    ctx.req.on('data', data => { // 监听data事件
        postData += data; // 拼装POST请求的参数
    });
    ctx.req.on('end', () => {
        console.log(postData); // 打印 POST请求的参数;
    });
});
app.listen(3000, () => console.log('server is starting at 3000'));

//  curl -d "param1=value1&param2=value2" http://localhost:3000/
