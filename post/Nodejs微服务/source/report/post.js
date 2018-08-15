module.exports = function (options) {
  /**
   * 将待打印、邮寄的信息放入队列
   */
  this.add({channel: 'post', action: 'queue'}, function(msg, respond) {
    // 邮寄信息放入队列代码实现
    respond(null, {});
  });
}