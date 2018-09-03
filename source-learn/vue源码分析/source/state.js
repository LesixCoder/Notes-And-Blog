function observer(obj) {
  Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key], cb))
}

function defineReactive(obj, key, val, cb) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      /*....依赖收集等....*/
    },
    set: (newVal) => {
      /*订阅者收到消息的回调*/
      cb();
    }
  })
}

class Vue {
  constructor(options) {
    this._data = options.data;
    observer(this._data, options.render)
    _proxy(options.data);
  }
}

function _proxy(data) {
  const that = this;
  Object.keys(data).forEach((key) => {
    Object.defineProperty(that, key, {
      enumerable: true,
      configurable: true,
      get: function proxyGetter() {
        return that._data[key];
      },
      set: function proxySetter(val) {
        that._data[key] = val;
      }
    })
  })
}