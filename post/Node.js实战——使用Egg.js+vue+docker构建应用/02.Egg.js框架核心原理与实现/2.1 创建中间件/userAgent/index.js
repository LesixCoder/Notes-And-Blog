const koa = require("koa");
const userAgent = require("koa-useragent");
const log = require("./log");
const app = new koa();

app.use(userAgent);

app.use(async (ctx, next) => {
  console.log(require("util").inspect(ctx.userAgent));
});

app.listen(3000, () => {
  console.log("app is starting at 3000");
});
