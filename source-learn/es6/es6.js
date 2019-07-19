// map 循环
const map = (f, array) => {
    const newArray = [];
    for (let i = 0; i < array.length; ++i) {
        newArray[i] = f(array[i]);
    }
    return newArray;
}

const filter = (f, array) => {
    const newArray = [];
    for (let i = 0; i < array.length; ++i) {
        if (f(array[i])) {
            newArray[array.length] = array[i];
        }
    }
    return newArray;
}

const reduce = (f, start, array) => {
    var acc = start;
    for (var i = 0; i < array.length; ++i) {
        acc = f(array[i], acc); // f() takes 2 parameters
    }
    return acc;
}
const a = reduce((x,y) => x+y,0,[3,4,5]);
console.log(a)
