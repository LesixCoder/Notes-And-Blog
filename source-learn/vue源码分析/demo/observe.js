const oldProto = Array.prototype;
const _arrProto = Object.create(oldProto);

['pop', 'push', 'shift', 'unshift', 'splice'].forEach(methodName => {
  _arrProto[methodName] = function () {
    updateView()
    oldProto[methodName].call(this, ...arguments)
  }
})

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
        updateView(newVal)
      }
    }
  })
}

const observer = (target) => {
  // 不是对象或者数组
  if (typeof target !== 'object' || target === null) return target

  if (Array.isArray(target)) {
    console.log(target, target.prototype, target.__proto__)
    target.__proto__ = _arrProto
  }

  for (let key in target) {
    defineReactive(target, key, target[key])
  }
}

const updateView = () => {
  console.log('更新视图')
}

const data = {
  name: 'liusixin',
  age: 18,
  info: {
    job: '前端'
  },
  hobby: ['打球', '游泳', '上网']
}

observer(data)
console.log('数据', data)
// data.info = {
//   job: '后端'
// }
// data.info.job = '全栈'
data.hobby.push('泡妞')
console.log('数据', data)
