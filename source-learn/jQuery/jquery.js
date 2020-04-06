(function (window, undefined) {
  var jQuery = function (selector, context) {
    // 这里的new 相当于直接 new jQuery.prototype
    return new jQuery.fn.init(selector, context)
  }
  jQuery.fn = jQuery.prototype = {
    // jQuery.fn.init.prototype = jQuery.fn = jQuery.prototype
    init: function (selector, context) { }
  }
  jQuery.fn.init.prototype = jQuery.fn
  /**
   * 这里相当于 jQuery.fn.init.prototype = jQuery.fn = jQuery.prototype
   * 所以 jQuery.fn.init = jQuery，new jQuery.fn.init相当于new jQuery
   */
})(window)

/**
 * jQuery.fn.extend 挂载到原型链上
 * example:
 * jQuery.fn.extend({
 *  a: function() {}
 * })
 * $('').a()
 *
 * jQuery.extend 挂载到jQuery对象上
 * example:
 * jQuery.extend({
 *  a: 123
 * })
 * $.a
 */

/**
  * 重载：同样的函数接收不同参数处理不同的事情
  * $('.test').val('test') -> 取值、赋值。这里$('.test')是可以传任何长度，甚至可以传函数
  */
// function addMethod (obj, name, f) {
//   /**
//    * 第一次执行 obj[name] -> find0
//    */
//   var old = obj[name]
//   obj[name] = function () {
//     if (f.length === arguments.length) {
//       return f.apply(this, arguments)
//     } else {
//       return old.apply(this, arguments)
//     }
//   }
// }
// var people = {
//   name: ['张三', '李四', '王五']
// }
// var find0 = function () {
//   return this.name
// }
// var find1 = function (name) {
//   var n = this.name.length
//   for (let i = 0; i < n; i++) {
//     if (this.name[i] === name) {
//       return `${this.name[i]} -> ${i}`
//     }
//   }
// }
// var find2 = function (name, age) {
//   console.log('重载测试find2')
// }
// addMethod(people, 'find', find0)
// addMethod(people, 'find', find1)
// addMethod(people, 'find', find2)
// console.log(people, people.find())
function test () {
  console.log(arguments)
}

test()
