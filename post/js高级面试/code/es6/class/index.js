// function MathHandle(x, y) {
//     this.x = x
//     this.y = y
// }

// MathHandle.prototype.add = function () {
//     return this.x + this.y
// }

// var m = new MathHandle(1, 2)
// // console.log(m.add())

// typeof MathHandle  // 'function'
// MathHandle.prototype.constructor === MathHandle  // true
// m.__proto__ === MathHandle.prototype  // true

// // 动物
// function Animal() {
//     this.eat = function () {
//         alert('Animal eat')
//     }
// }

// // 狗
// function Dog() {
//     this.bark = function () {
//         alert('Dog bark')
//     }
// }

// // 绑定原型，实现继承
// Dog.prototype = new Animal()

// var hashiqi = new Dog()
// hashiqi.bark()
// hashiqi.eat()

function fn() {
    console.log('real', this)  // real {a: 100}

    var arr = [1, 2, 3]
    arr.map(function (item) {
        console.log(this)  // window
    })
}
fn.call({a: 100})

// Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, frames: Window, …}
// Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, frames: Window, …}
// Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, frames: Window, …}
















