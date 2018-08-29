class Vue {
  constructor(options) {
    this.data = options.data
    observer(this.data) // 监控数据
    new Watcher(); // 这一步仅仅只是告诉发布者我是谁,真正的订阅发生在数据被引用的时候
  }
}

// 订阅者 ---- 每一个引用数据的都是订阅者
class Watcher {
  constructor() {
    // 每次订阅的时候告诉发布者我是谁
    Dep.target = this;
  }

  update() {
    console.log('更新了')
  }

}

// 发布者 ---- 每一个数据都是发布者
class Dep {
  constructor() {
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  notify() {
    this.subs.forEach(item => {
      item.update();
    })
  }
}


function defineReactive(obj, key, val) {
  const dep = new Dep() // 将数据变成发布者
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 需要知道是谁订阅了我, 所以在订阅的时候就提前保存下订阅者(Dep.target)
      dep.addSub(Dep.target)
      return val
    },
    set(newVal) {
      if (newVal === val) return;
      // 通知所有的订阅者我更新了
      dep.notify()
    }
  })
}

function observer(obj) {
  if (!obj || typeof obj !== 'object') return;
  Object.keys(obj).forEach(key => {
    const val = obj[key]
    if (typeof val === 'object') {
      return observer(val)
    }
    defineReactive(obj, item, val)
  })
}

let o = new Vue({
  data: {
    name: 'lsx'
  }
})

console.log('模拟数据被使用', o.data.name) // 此时订阅了
o.data.name = 'liusixin' // 模拟数据更新