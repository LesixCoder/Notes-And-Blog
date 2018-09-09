// import util1 from './util1.js'
// import { fn1, fn2 } from './util2.js'

// console.log(util1)
// fn1()
// fn2()

// // [1, 2, 3].map(item => item + 1)

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

