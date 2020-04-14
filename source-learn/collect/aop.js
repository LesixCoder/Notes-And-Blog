/**
 * AOP面向切面编程
 */
Function.prototype.before = function (beforeFn) {
  let _self = this
  return function () {
    beforeFn.apply(this, arguments) // 执行当前函数
    return _self.apply(this, arguments) // 执行原函数
  }
}

Function.prototype.after = function (beforeFn) {
  let _self = this
  return function () {
    let result = _self.apply(this, arguments) // 执行原函数
    beforeFn.apply(this, arguments) // 执行当前函数
    return result
  }
}

let func = () => console.log('func', this);
func = func.before(() => {
  console.log('===before===', this);
}).after(() => {
  console.log('===after===', this);
})

func();
