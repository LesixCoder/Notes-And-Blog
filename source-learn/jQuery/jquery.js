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
})(window, 42)
