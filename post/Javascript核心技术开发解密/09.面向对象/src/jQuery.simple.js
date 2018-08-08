(function(ROOT) {
  // 构造函数
  var jQuery = function(selector) {
    // 在该方法中直接返回new创建的实例，
    // 因此这里的 init 才是真正的构造函数
    return new jQuery.fn.init(selector);
  };

  jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    version: '1.0.0',
    init: function(selector) {
      var elem, selector;
      elem = document.querySelector(selector);
      this[0] = elem;

      // 在jQuery中返回的是一个由所有原型属性方法组成的数组，
      // 这里做了简化，直接返回this即可
      return this;
    },

    // 在原型上添加一堆方法
    toArray: function() {},
    get: function() {},
    each: function() {},
    ready: function() {},
    first: function() {},
    slice: function() {}
    // ...more
  };

  // 让 init 方法的原型指向jQuery的原型
  jQuery.fn.init.prototype = jQuery.fn;

  // 实现 jQuery 的两种扩展方法
  jQuery.extend = jQuery.fn.extend = function(options) {
    // 在jQuery源码中根据参数不同进行不同的判断，这里假设只有一种方式
    var target = this;
    var copy;

    for (name in options) {
      copy = options[name];
      target[name] = copy;
    }
    return target;
  };

  // jQuery利用上面实现的扩展机制，添加了许多方法

  // 添加静态扩展方法，即工具方法
  jQuery.extend({
    isFunction: function() {},
    type: function() {},
    parseHTML: function() {},
    parseJSON: function() {},
    ajax: function() {}
    // ...more
  });

  // 添加原型方法
  jQuery.fn.extend({
    queue: function() {},
    promise: function() {},
    attr: function() {},
    prop: function() {},
    addClass: function() {},
    removeClass: function() {},
    val: function() {},
    css: function() {},
    // ...more
  });

  ROOT.jQuery = ROOT.$ = jQuery;
})(window);
