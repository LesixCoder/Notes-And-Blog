### Array.prototype.indexOf

查找一个值在不在数组中，从前往后查找，在的话返回值的索引，不在的话返回-1

### Array.prototype.lastIndexOf

查找一个值在不在数组中，从后往前查找，在的话返回值的索引，不在的话返回-1

### Array.prototype.every

查找数组中每一个元素，直到有一个不符合条件，返回false为止。否则返回true

```js
 var arr = [2,2,2,2].every(function(item,index,arr){
    return item == 2;
})
console.log(arr);
```

### Array.prototype.some

找到数组中第一个符合要求的值后就不再继续执行。找到返回true，未找到返回false

```js
var arr = [1,2,3,2].some(function(item,index,arr){
    console.log(item);      //1,2
    return item == 2;
})
console.log(arr);   //true
```

### Array.prototype.forEach

循环数组，对数组进行操作

```js
 [1,2,3,4].forEach(function(item,index,arr){
    console.log(item);
})
```

### Array.prototype.map

map处理数组中的所有值并返回处理后的值，不影响原数组，返回结果为新的数组。

```js
 var arr = [1,2,3,4].map(function(item,index,arr){
    return item * item;
})
console.log(arr);
```

### Array.prototype.filter

filter是对数组元素的过滤，把返回true的汇集成新的数组，返回结果为新的数组。

```js
var arr = [1,2,3,4].filter(function(item,index,arr){
    return item ==2;
})
console.log(arr);
```

### Array.prototype.reduce

使用指定的函数将数组元素进行整合，生成单个值。这是在函数式编程中是常见的操作，也可以称为‘注入’和‘折叠’

```js
var arr = [1,2,3,4].reduce(function(a,b){
    return a + b;
})
console.log(arr);   //10
```

### Array.prototype.reduceRight

和上面方法一样，是从后往前整合

```js
var arr = [1,2,3,4].reduceRight(function(a,b){
    return a + b;
})
console.log(arr);   //10
```

### Array.isArray

判断一个对象是不是数组。

```js
var arr = [];
var a;
console.log(Array.isArray(arr));        //true
console.log(Array.isArray(a))       //false
```

### TypedArray

TypedArray 是一种通用的固定长度缓冲区类型，允许读取缓冲区中的二进制数据。

### Object.getPrototypeOf

用于读取一个对象的原型的对象。

```js
function Car(){}
var car = new Car();
Object.getPrototypeOf(car) === Car.prototype  //true
```

### Object.getOwnPropertyDescriptor

用于获取一个属性的描述对象

```js
var obj = {
    name : "liusixin",
}
Object.getOwnPropertyDescriptor(obj,"name");
```

### Object.getOwnPropertyNames

Object.getOwnPropertyNames() 返回一个数组，该数组对元素是 obj自身拥有的枚举或不可枚举属性名称字符串。

```js
var obj = {
    a : 'a',
    b : 'b',
    c : 'c'
}
Object.getOwnPropertyNames(obj);
```

### Object.create

创建一个对象的副本，有参数的话继承于参数对象，无参数的话类似于字面量创建对象，当参数为null的时候，创建最干净的对象，无任何集成

```js
var obj = Object.create(null);
console.log(obj);
```

### Object.defineProperty

Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有描述属性， 并返回这个对象。

```js
var obj = {};
Object.defineProperty(obj,"name",{
    value : "liusixin", // name 的值
    configurable : true,    //是否可配置
    enumerable : true, //是否可枚举
    writable : true //是否可写
    //get  给属性添加一个getter
    //set  给属性添加一个setter
})
```

### Object.definProperties

Object.defineProperties方法在一个对象上定义多个新属性，或者修改现有属性，返回该对象。

```js
var obj = {};
Object.defineProperties(obj,{
    "name" : {
        value : "liusixin", //name 的值
        configurable : true,    //是否可配置
        enumerable : true, //是否可枚举
        writable : true //是否可写
        //get  给属性添加一个getter
        //set  给属性添加一个setter
    },
    "age" : {
        value : 18, //name 的值
        configurable : true,    //是否可配置
        enumerable : true, //是否可枚举
        writable : true //是否可写
        //get  给属性添加一个getter
        //set  给属性添加一个setter
    }
})
```

### Object.seal

Object.seal()方法封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要可写就可以改变。

```js
const object = {name : 'asdf'};
Object.seal(object);
object.name = "liusixin";
object.name // liusixin
delete object.name      //false
object.age = 12;
objde.age //undefined
```

### Object.freeze

Object.freeze() 方法可以冻结一个对象，冻结指的是不能向这个对象添加新的属性，不能修改其已有属性的值，不能删除已有属性，以及不能修改该对象已有属性的可枚举性、可配置性、可写性。该方法返回被冻结的对象。

主要注意的是，这个冻结是浅冻结，如果一个对象的属性也是一个对象的话，这个对象中的属性是冻结不了的。

```js
var obj = {name : 'age',test : {name : 'liusixin'}};
Object.freeze(obj); //{name: "age",test: {…}}
obj.name = "liusixin";
obj.name // age  无法修改
obj.test.name = "lsx"
obj.test.name // lsx 修改成功
```

### Object.preventExtensions

Object.preventExtensions将一个对象设置为不可扩展的。

```js
var obj = {};
Object.preventExtensions(obj);
Object.defineProperty(obj,"name",{
    value : "liusixin",     //报错
})
```

### Object.isSealed

用于判断一个对象是否被密封

```js
var obj = {};
var obj1 = {};
Object.seal(obj);
Object.isSealed(obj)    //true
Object.isSealed(obj1)   //false
```

### Object.isFrozen

用于判断一个对象是否被冻结

```js
var obj = {};
var obj1 = {};
Object.freeze(obj);
Object.isFrozen(obj)    //true
Object.isFrozen(obj1)   //false
```

### Object.isExtensible

用于判断一个对象是否是不可扩展的

```js
var obj = {};
var obj1 = {};
Object.preventExtensions(obj);
Object.isExtensible(obj)    //true
Object.isExtensible(obj1) //false
```

### Object.keys

返回一个由自身可枚举属性组成的数组，数组中属性的排列顺序和使用for...in的遍历该对象时返回的顺序一致。

```js
var obj = {
    name : 'liusixin',
    age : 18,
    lastname : 'lsx',
}
Object.keys(obj);
```

### Object.is

Object.is判断两个值是否相等，与===的行为保持一致。
唯有两个不同的地方：

1. +0不等于-0
2. NaN等于自身

```js
+0 === -0 //true
NaN === NaN // false

Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```

ES5提供了一个全局的JSON对象，用来序列化(JSON.strigify)和反序列化(JSON.parse)对象为JSON对象。

对于老式的浏览器，可以使用json2.js，可以让旧的浏览器实现同样的功能。

### JSON.parse

接受文本并转换成一个ECMAScript的值 可选的reviver参数是带有key和value两个参数的函数，用于是对文本的所转的值做一次过滤。

```js
//不带第二个参数
var result = JSON.parse('{"a" : 1, "b" :2}');
console.log(result);      {a : 1,b : 2}
//带第二个参数
 var result = JSON.parse('{"a":"1","b" : 2}',function(key,value){
    if(typeof value == "string"){
        return parseInt(value);
    }else {
        return value;
    }
});
console.log(result);
```

### JSON.stringify

将传入的对象进行序列化，第二个参数提供一个可选的函数，参数为key和value对传入对象进行过滤。

当value值为undefined的时候，该对应属性不会被序列化。

第三个为space参数，表示被序列化，每个属性的格式化前的空格数。

```js
//一个参数
var obj = {
    name : "liusixin",
    age : 21,
}
var result = JSON.stringify(obj);
console.log(result);
//二个参数
var obj = {
    name : "liusixin",
    age : 21,
}
var result = JSON.stringify(obj,function(key,value){
    if(key == "age"&& value >20){
        return value =18;
    } else {
        return value;
    }
})
console.log(result);
//三个参数
var  obj = {
    name : "lsx",
    age : 21,
}
var result = JSON.stringify(obj,function(key,value){
    if(key == "age" && value > 20){
        return value = 18;
    }else {
         return value;
    }
},4);
console.log(result);
```

### 严格模式

严格模式给作者提供了选择一个限制性更强语言变种的方式。

开启严格模式：在js文件或者函数顶部加上"use strict"。开启严格模式有两种方法：

1. 全局严格模式：

```js
"use strict"
```

2. 函数内部严格模式:

```js
function foo(){
    "use strict"
}
```

#### 严格模式做了哪些限制

1. 变量：使用变量但不声明

```js
testvar = 4      //报错：严格模式下不允许未声明使用变量
```

2. 只读属性:写入只读属性

```js
 testObject = {};
Object.defineProperty(testObject,"name",{
    value : "wang",
    writable:false,
})
testObject.name = "zhou";   //报错，严格模式下不允许分配只读属性
```

3. 不可扩展的属性:  将属性描述的extensible属性设置为false。

```js
var testObj = new Object();
Object.preventExtensions(testObj);
testObj.name = "wang";  //报错，严格模式下，无法为不可扩展的对象创建属性
```

4. delete删除变量、函数或者参数。删除configurable特性设置为false的属性。

```js
var testvar = 10;
delete testvar;  //报错，严格模式不允许删除变量
function fun(){};
delete fun;         //报错，严格模式下不允许删除函数
var testObj = {};
Object.defineProperty(testObj,"name",{
    configurable : false,
})
delete testObj.name;        //报错，严格模式不允许删除对象属性的描述configurable为false的属性。
```

5. 重复属性：在一个对象文本中国多次定义某个属性。

```js
var testObj = {
    prop1 = 10,
    prop1 = 10,             //报错，严格模式不允许对象定义相同的属性。
}
```

6. 重复参数名:在一个函数中多次使用相同的参数名。

```js
function test (name,name) {         //报错，严格模式不允许函数定义相同的函数名。
    return 1;
}
```

7. 未来保留字:将未来保留关键字用作变量或者函数名。

```js
//implements、interface 、package、private、protected、public、static、yield。
```

8. 八进制数: 对数值的分配八进制值，或尝试对八进制值使用转义。

```js
var testvar = 010;  //报错
var testvar1 = \010;    //报错
```

9. this:当this的值为null或者undefined的时候，该值不会转换为全局对象。

```js
function testFunc(){
console.log(this)       //非严格模式下，this指向window
//严格模式下，this为undefined
}
```

10. 作为标示符的eval:字符串eval不能作为标识符（变量或函数名、参数名）。

```js
// var eval = 10;      //报错
```

11.语句或块中声明函数 : 无法再语句或者块中声明函数

```js
for(var i = 0 ; i<5 ; i++) {
    function tes(){}            //没有报错
}
if(true){
    function test(){    //没报错
    }
}
```

12. eval函数内声明的变量:如果在eval函数内声明的变量，则不能再次函数外部使用该变量

```js
eval("var testvar = 10");
console.log(testvar = 5);       //报错，严格模式下，eval用法无效
```

13. 作为标识符的Arguments : 字符串的arguments不能作为标识符（变量或函数名参数名）

```js
var arguments = 10;     //报错
function arguments(){};     //报错
```

14. 函数内的arguments  : 无法更改本地的arguments对象的成员的值。

```js
function test(name){
    arguments[0] = 1;
    console.log(name);      //wang 不变
}
test("wang")
```

15. arguments.callee : 不允许使用

```js
function test(){
    arguments.callee();         //报错
}
test();
```

16. with: 不允许使用

```js
with(Math){
    x = cos(3);     //报错，严格模式下，不允许使用with
    y = tan(7);
}
```
