'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);
  router.get('/session1', async (ctx, next) => {
    ctx.flash_error({
      ss: 'some error',
    });
    ctx.redirect('/session2');
  });
  router.get('/session2', async (ctx, next) => {
    ctx.type = 'json';
    ctx.body = ctx.flash;
  });
  router.get('/session3', async (ctx, next) => {
    ctx.flash = {
      type: 'warning',
      message: {
        field: {
          naem: 'required',
        },
      },
    };
    ctx.request.flash('warning', {
      field: {
        name: 'required',
      },
    });
    ctx.redirect('/session4');
  });
  router.get('/session4', async (ctx, next) => {
    ctx.type = 'json';
    ctx.body = ctx.flash;
  });
};
