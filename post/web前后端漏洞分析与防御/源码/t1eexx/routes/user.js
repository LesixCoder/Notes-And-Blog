const Router = require('koa-router');
const router = new Router({
	prefix: '/user'
});

const user = require('../controllers/user');

/*router.all('/*', async function(ctx, next){
	await next();
});*/

router.get('/login', user.login);
router.post('/login', user.doLogin);

module.exports = router;
