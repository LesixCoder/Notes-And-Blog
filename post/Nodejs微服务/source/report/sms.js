module.exports = function (options) {
  /**
   * 发送短信
   */
  this.add({channel: 'sms', action: 'send'}, function(msg, respond) {
    // 发送短信代码实现
    respond(null, {});
  });

  /**
   * 获取未读短信
   */
  this.add({channel: 'sms', action: 'pending'}, function(msg, respond) {
    // 读取未读短信代码实现
    respond(null, {});
  });
}