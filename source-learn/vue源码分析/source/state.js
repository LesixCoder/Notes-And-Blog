function observer(obj) {
  if(!obj || (typeof obj !== 'object')) return;
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if(typeof val === 'object') return observer(val);
    defineReactive(obj, key, val)
  })
}

function cb (val) {
  /* 渲染视图 */
  console.log("视图更新啦～");
}

function defineReactive(obj, key, val) {
  /* 在闭包内存储一个Dep对象，将数据变成发布者 */
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    enumerable: true, /* 属性可枚举 */
    configurable: true, /* 属性可被修改或删除 */
    get: function reactiveGetter() {
      /*....依赖收集等....*/
      if(Dep.target) { // 将观察者Watcher实例赋值给全局的Dep.target，然后触发render操作只有被Dep.target标记过的才会进行依赖收集。
        /* Watcher对象存在全局的Dep.target中, 将Watcher的实例push到subs中 */
        dep.addSub(Dep.target)
        return val;
      }
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return;
      /*订阅者收到消息的回调*/
      /* 只有之前addSub中的函数才会触发 */
      dep.notify();
    }
  })
}

class Vue {
  /* Vue构造类 */
  constructor(options) {
    this._data = options.data;
    observer(this._data); // 监控数据
    /* 新建一个Watcher观察者对象，这时候Dep.target会指向这个watcher对象 */
    new Watcher();
    /* 在这里模拟render的过程，为了触发test属性的get函数 */
    console.log('render~', this._data.test);
    // _proxy(options.data);
  }
}

function _proxy(data) {
  const that = this;
  Object.keys(data).forEach((key) => {
    Object.defineProperty(that, key, {
      enumerable: true,
      configurable: true,
      get: function proxyGetter() {
        // return that._data[key];
      },
      set: function proxySetter(newVal) {
        // that._data[key] = newVal;
      }
    })
  })
}

// 发布者 ---- 每一个数据都是发布者
class Dep {
  constructor() {
    /* 用来存放Watcher对象的数组 */
    this.subs = [];
  }

  /* 在subs中添加一个Watcher对象 */
  addSub(sub) {
    this.subs.push(sub);
  }

  removeSub(sub) {
    remove(this.subs, sub)
  }

  /* 通知所有Watcher对象更新视图 */
  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    })
  }
}

function remove(arr, item) {
  if(arr.length) {
    const index = arr.indexOf(item);
    if(index > -1) {
      return arr.splice(index, 1);
    }
  }
}

// 订阅者 ---- 每一个引用数据的都是订阅者
class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.cb = cb;
    this.vm = vm;
    /*在这里将观察者本身赋值给全局的target，只有被target标记过的才会进行依赖收集*/
    Dep.target = this;
    /*触发渲染操作进行依赖收集*/
    // this.cb.call(this.vm);
  }

  update() {
    this.cb.call(this.vm)
  }
}

Dep.target = null;