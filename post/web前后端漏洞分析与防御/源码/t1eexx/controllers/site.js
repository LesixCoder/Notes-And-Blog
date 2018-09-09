const bluebird = require('bluebird');
const connectionModel = require('../models/connection');

exports.index = async function(ctx, next){
	const connection = connectionModel.getConnection();
	const query = bluebird.promisify(connection.query.bind(connection));
	const posts = await query(
			'select post.*,count(comment.id) as commentCount from post left join comment on post.id = comment.postId group by post.id limit 10'
		);
	const comments = await query(
			'select comment.*,post.id as postId,post.title as postTitle,user.username as username from comment left join post on comment.postId = post.id left join user on comment.userId = user.id order by comment.id desc limit 10'
		);
	ctx.render('index', {posts, comments, from:ctx.query.from || ''});
	connection.end();
};

exports.post = async function(ctx, next){
	try{
		console.log('enter post');

		const id = ctx.params.id;
		const connection = connectionModel.getConnection();
		const query = bluebird.promisify(connection.query.bind(connection));
		const posts = await query(
			`select * from post where id = "${id}"`
		);
		let post = posts[0];

		const comments = await query(
			`select comment.*,user.username from comment left join user on comment.userId = user.id where postId = "${post.id}" order by comment.createdAt desc`
		);
		if(post){
			ctx.render('post', {post, comments});
		}else{
			ctx.status = 404;
		}
		connection.end();
	}catch(e){
		console.log('[/site/post] error:', e.message, e.stack);
		ctx.body = {
			status: e.code || -1,
			body: e.message
		};
	}
};

exports.addComment = async function(ctx, next){
	try{
		const data = ctx.request.body;
		const connection = connectionModel.getConnection();
		const query = bluebird.promisify(connection.query.bind(connection));
		const result = await query(
			`insert into comment(userId,postId,content,createdAt) values("${ctx.cookies.get('userId')}", "${data.postId}", "${data.content}",${connection.escape(new Date())})`
		);
		if(result){
			ctx.redirect(`/post/${data.postId}`);
		}else{
			ctx.body = 'DB操作失败';
		}
	}catch(e){
		console.log('[/site/addComment] error:', e.message, e.stack);
		ctx.body = {
			status: e.code || -1,
			body: e.message
		};
	}
};
