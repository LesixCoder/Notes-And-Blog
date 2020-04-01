let oldArrayProto = Array.prototype;
let _newArrayProto = Object.create(oldArrayProto);

['pop', 'push', 'shift', 'unshift', 'splice'].forEach(methodName => {
  _newArrayProto[methodName] = function () {
    updateView()
    oldArrayProto[methodName].call(this, ...arguments)
  }
})

const updateView = () => {
  console.log('更新视图')
}

const defineReactive = (target, key, value) => {
  // 深度监听
  observer(value)

  Object.defineProperty(target, key, {
    get () {
      return value
    },
    set (newVal) {
      if (newVal !== value) {
        observer(newVal)

        value = newVal
        updateView()
      }
    }
  })
}

const observer = (target) => {
  if (typeof target !== 'object' || target === null) return target

  if (Array.isArray(target)) target.__proto__ = _newArrayProto

  for (let key in target) {
    defineReactive(target, key, target[key])
  }
}

const data = {
  name: 'liusixin',
  age: 18,
  info: {
    job: '前端'
  },
  hobby: ['打球', '游泳', '上网']
}

let hook = {
  prepatch1 (old, val) {
    console.log(old, val)
  },
  prepatch2 (old, val) {
    console.log(old, val)
  }
}
hook?.prepatch?.('old', 'val')

let vnode = {
  ele: 'vnodeEle'
}
let oldVnode = {
  ele: 'oldVnodeEle'
}
let ele = vnode.ele = oldVnode.ele;
console.log(ele)

observer(data)
console.log('数据', JSON.parse(JSON.stringify(data.hobby)))
// data.info = {
//   job: '后端'
// }
// data.info.job = '全栈'
// data.name = 'liuxin'
data.hobby.push('泡妞')
console.log('数据', data.hobby)
