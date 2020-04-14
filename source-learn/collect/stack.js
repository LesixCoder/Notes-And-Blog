/**
 *  栈结构
 */
class Stack {
  constructor() {
    let wm = new WeakMap()
    this.store = wm.set(this, [])
    this.top = 0
  }
}
const Stack = (() => {
  const wm = new WeakMap()
  class Stack {
    constructor() {
      wm.set(this, [])
      this.top = 0
    }

    push (...nums) {
      let list = wm.get(this)
      nums.forEach(item => {
        list[this.top++] = item
      })
    }

    pop () {
      let list = wm.get(this)
      let last = list[--this.top]
      list.length = this.top
      return last
    }

    peek () {
      let list = wm.get(this)
      return list[this.top - 1]
    }

    clear () {
      let list = wm.get(this)
      list.length = 0
    }

    size () {
      return this.top
    }

    output () {
      return wm.get(this)
    }

    isEmpty () {
      return wm.get(this).length === 0
    }
  }
  return Stack
})()

let s = new Stack()

s.push(1, 2, 3, 4, 5)
console.log(s.output()) // [ 1, 2, 3, 4, 5 ]
