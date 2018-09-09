const Koa = require('koa');
const app = new Koa();

const koaStatic = require('koa-static');
app.use(koaStatic('./static', {
	hidden: true,
	maxage: 365*24*3600*1000
}));
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

const Pug = require('koa-pug');
/*const pug = */new Pug({
	app,
	viewPath: './views',
	noCache: process.env.NODE_ENV === 'development'
});

const routes = ['site', 'user'];
routes.forEach((route) => {
	app.use(require(`./routes/${route}`).routes());
});

app.listen(1521, function(){
	console.log('App is listening on port 1521');
});
