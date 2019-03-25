const koa = require('koa');
const app = new koa();
app.use(async (ctx) => {
    ctx.response.body = {
        url: ctx.request.url, // 获取请求 URL
        query: ctx.request.query, // 获取解析的查询字符串
        querystring: ctx.request.querystring // 获取原始查询字符串
    }
});
app.listen(3000, () => console.log('server is starting at 3000'));

// 访问 http://localhost:3000/?search=koa&keywords=context，打印如下
// {
//     url: "/?search=koa&keywords=context",
//     query: {
//         search: "koa",
//         keywords: "context"
//     },
//     querystring: "search=koa&keywords=context"
// }
