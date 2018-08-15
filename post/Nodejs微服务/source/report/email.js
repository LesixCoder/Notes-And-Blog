module.exports = function (options) {
  /**
   * 发送邮件
   */
  this.add({channel: 'email', action: 'send'}, function(msg, respond) {
    // 发送邮件代码实现
    respond(null, {});
  });

  /**
   * 获取未读邮件列表
   */
  this.add({channel: 'email', action: 'pending'}, function(msg, respond) {
    // 读取未读邮件代码实现
    respond(null, {});
  });

  /**
   * 将信息标记为已读
   */
  this.add({channel: 'email', action: 'read'}, function(msg, respond) {
    // 标记信息为已读代码实现
    respond(null, {});
  });
}