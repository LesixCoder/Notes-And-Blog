// ES6 其他常用功能

// var arr = [1, 2, 3];
// arr.map(function (item) {
//     return item + 1;
// })

const arr = [1, 2, 3];
arr.map(item => item + 1);
arr.map((item, index) => {
    console.log(item);
    return item + 1;
});