// import util1 from './util1.js'
// import { fn1, fn2 } from './util2.js'

// console.log(util1)
// fn1()
// fn2()

// [1, 2, 3].map(item => item + 1)

// class MathHandle {
//     constructor(x, y) {
//         this.x = x
//         this.y = y
//     }
//     add() {
//         return this.x + this.y
//     }
// }

// const m = new MathHandle(1, 2)

// console.log(typeof MathHandle)  // 'function'
// console.log(MathHandle.prototype.constructor === MathHandle)  // true
// console.log(m.__proto__ === MathHandle.prototype)  // true

// class Animal {
//     constructor(name) {
//         this.name = name
//     }
//     eat() {
//         alert(this.name + ' eat')
//     }
// }

// class Dog extends Animal {
//     constructor(name) {
//         super(name)   // 注意 ！！！
//         this.name = name
//     }
//     say() {
//         alert(this.name + ' say')
//     }
// }

// const dog = new Dog('哈士奇')
// dog.say()
// dog.eat()

// function fn() {
//     console.log('real', this)  // real {a: 100}

//     var arr = [1, 2, 3]
//     arr.map(item => {
//         console.log(this)  // {a: 100}
//     })
// }
// fn.call({a: 100})

// real {a: 100}
// {a: 100}
// {a: 100}
// {a: 100}

import 'babel-polyfill'

function loadImg(src) {
    var promise = new Promise(function (resolve, reject) {
        var img = document.createElement('img')
        img.onload = function () {
            resolve(img)
        }
        img.onerror = function () {
            reject('图片加载失败')
        }
        img.src = src
    })
    return promise
}

var src1 = 'https://www.imooc.com/static/img/index/logo_new.png'
var src2 = 'https://img1.mukewang.com/545862fe00017c2602200220-100-100.jpg'

const load = async function () {
    const result1 = await loadImg(src1)
    console.log(result1)
    const result2 = await loadImg(src2)
    console.log(result2)
}
load()









