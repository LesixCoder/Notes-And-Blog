'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    console.log(global.use);
    const r = use('app.schemas.signup');
    this.ctx.type = 'json';
    this.ctx.body = JSON.stringify(r);
  }
}

module.exports = HomeController;
