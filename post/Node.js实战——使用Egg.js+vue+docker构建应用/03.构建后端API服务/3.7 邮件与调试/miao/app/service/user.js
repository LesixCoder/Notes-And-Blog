'use strict'
const R = require('ramda')
class User extends S {
  constructor(ctx) {
    super(ctx)
    this._User = this.ctx.model.User
    this._Invitation = this.ctx.model.Invitation
    this.where = this.ctx.helper.where
  }
  /**
   * * 校验邀请码有效性
   * @param {string} code 邀请码
   * @return {boolean} 是否有效
   * @memberof User
   */
  async checkInvitation(code) {
    const invitation = await this._Invitation.find(this.where({ code }))
    if (!invitation || invitation.use_user_id) {
      return this.ctx.helper.throw(400, 'code', '无效的邀请码')
    }
    return invitation
  }
  /**
   * * 生成邀请码
   * @param {number} user_id 用户 ID
   * @param {number} length 生成的个数
   * @return {Array<Invitation>} 所生成的邀请码数组
   * @memberof User
   */
  async generatorInvitation(user_id, length) {
    const invitation_promise = this.ctx.helper.range(length).map(() => {
      return this._Invitation.create({ user_id })
    })
    return Promise.all(invitation_promise)
  }
  /**
   * ? 为社会化登录创建的方法
   * * 社会化登陆 -> 可获取 email -> 无 Code -> 登陆之后验证 email -> 填写 password
   * * -> 不填写 Code 减少一些功能，或者不让他登陆，要求提供 Code 后方可登陆。
   * @param {object} user 用户
   * @return {object} user 创建后的用户
   */
  async create(user) {
    return await this._User.create(user)
  }
  /**
   * ? 待考虑
   * *将 Code 邀请码给 user_id 使用，并为 user_id 生成邀请码
   * @param {string} code 验证码
   * @param {number} user_id 用户 ID
   * @return {{user: User, invitations: Invitation[]}} 用户与生成的邀请码
   * @memberof User
   */
  async invaitationToUser(code, user_id) {
    const invaitation = await this.checkInvitation(code)
    const user = await this._User.findById(user_id)

    this.ctx.assert(user, 401, '没有找到该用户')

    // if (!user) {
    //   this.ctx.throw(401, 'user', '没有该用户')
    // }
    // copyPropoty
    invaitation.use_user_id = user.id
    invaitation.use_username = user.username
    invaitation.save()
    const invitations = await this.generatorInvitation(user_id, 5)
    return { user, invitations }
  }
  /**
   * 登陆
   * @memberof User
   */
  async signIn() {
    const { eamil, password, remember_me } = this.ctx.request.body
    const user = await this._User.Auth(eamil, password)
    this.ctx.assert(user, 401, '没有找到该用户')
  }
  /**
   *  发送验证邮件
   * @param {(string)} title 标题
   * @param {(string| User)} email 邮件地址
   * @param {Function} getTemplate 获取模板
   * @memberof User
   * @return {void}
   */
  async sendVerifyEmail(title, email, getTemplate) {
    let user = null
    if (R.type(email) === 'Object') {
      user = email
      email = user.email
    } else {
      user = await this._User.findByEmail(email)
    }
    const token = this.ctx.random(4)
    await this.app.redis.set(
      'email:' + user.id,
      token,
      'EX',
      60 * 3 * 1000 // 3 分钟
    )
    const template = getTemplate(user, token)
    info('[send email template] -> ' + email + ' | ' + template)
    const mail_ret = await this.ctx.send(title, template, email)
    info(mail_ret)
    if (mail_ret.code === 0) {
      return true
    }
    return false
  }
  /**
   * 验证邮件 token
   * @param {number} user_id  用户 ID
   * @param {string} token  验证码
   * @return {boolean} 通过否
   */
  async verifyToken(user_id, token) {
    const key = 'email:' + user_id
    const local_token = await this.app.redis.get(key)
    if (local_token === token) {
      await this.app.redis.del(key)
      const user = await this._User.findById(user_id)
      user.email_verifyed = 1
      await user.save()
      return true
    }
    return false
  }

  /**
   * * 注册逻辑
   * TODO: 通知邀请码所有者，user.id 成功使用了你的激活码
   * TODO: 向用户邮箱发送验证邮件
   * @return {Object} 注册成功的用户与生成的邀请码
   * @memberof {User}
   */
  async signUp() {
    const body = this.ctx.request.body
    const invitation = await this.checkInvitation(body.code)
    const user = await this._User.create(
      R.pick(['username', 'password', 'email'], body)
    )
    /* eslint-disable no-proto */
    console.dir(user.__proto__)
    console.dir(invitation.__proto__)
    invitation.use_user_id = user.id
    invitation.use_username = user.username
    await invitation.save()
    const invitations = await this.generatorInvitation(user.id, 5)
    return { user, invitations }
  }
}

module.exports = User
