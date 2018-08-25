## 关键字

```py
>>> import keyword
>>> keyword.kwlist
['and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'exec', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'not', 'or', 'pass', 'print', 'raise', 'return', 'try', 'while', 'with', 'yield']
```

```py
>>> keyword.iskeyword('and')
True
>>> keyword.iskeyword('have')
False
```

## 数据类型

- `整型(int)`: Python3中可以处理任意大小的整数（Python 2.x中有int和long两种类型的整数，但这种区分对Python来说意义不大，在python中内存分配是自动的，用户并不关心这些细节，反而给用户无限大的使用空间更好，因此在Python 3.x中整数只有int这一种了），而且支持二进制（如0b100，换算成十进制是4）、八进制（如0o100，换算成十进制是64）、十进制（100）和十六进制（0x100，换算成十进制是256）的表示法。
- `复数型(complex)`：形如3+5j，跟数学上的复数表示一样，唯一不同的是虚部的i换成了j。
- `浮点型(float)`：浮点数也就是小数，之所以称为浮点数，是因为按照科学记数法表示时，一个浮点数的小数点位置是可变的，浮点数除了数学写法（如123.456）之外还支持科学计数法（如1.23456e2）。
- `字符串型(str)`：字符串是以单引号或双引号括起来的任意文本，比如'hello'和"hello",字符串还有原始字符串表示法、字节字符串表示法、Unicode字符串表示法，而且可以书写成多行的形式（用三个单引号或三个双引号开头，三个单引号或三个双引号结尾）。
- `布尔型(bool)`：布尔值只有True、False两种值，要么是True，要么是False，在Python中，可以直接用True、False表示布尔值（请注意大小写），也可以通过布尔运算计算出来（例如3 < 5会产生布尔值True，而2 == 1会产生布尔值False）。python中把None、0、'' 都视为False。
- `空类型`: None 为空类型。

各数据类型之间是可以相互转换的，可使用Python提供的内置函数：

- `int()`：将一个数值或字符串转换成整数，可以指定进制。
- `float()`：将一个字符串转换成浮点数。
- `str()`：将指定的对象转换成字符串形式，可以指定编码。

另外2个字符转化内置函数：

- `chr()`：将整数转换成该ASCII编码对应的字符串（一个字符,如 chr(65) 返回为字符串 'A' ）。
- `ord()`：将字符串转换成对应的ASCII编码。

## 变量、常量

### 变量

Python 中的变量是内存中保存数据的地址的一个别称。变量是没有类型的，变量对应的值对象是有类型的。变量的类型是跟着值对象走的。严格来说，类型是属于对象的，而不是变量, 变量和对象是分离的，对象是内存中储存数据的实体，变量则是指向对象的内存地址。

#### 变量赋值

在Python 的语法中，变量无需声明，可直接使用，区别于其他语言，有些语言的变量需要先声明后使用。python中，使用像上边代码中的等号‘=’来表示`赋值`，即表示将等号右边的数据赋值给左边的变量，变量的类型有它存储的数值来决定。

```py
>>> a = 123
>>> b = '123'
>>> c = True
>>> print(type(a),type(b),type(c))
(<type 'int'>, <type 'str'>, <type 'bool'>)

# 可同时给多个变量赋值
>>> d, e = 1,2
```

#### 变量命名

变量的命令是一个重要的规则，好的命名可以增加代码的可读性，提高代码的可维护性。python中变量的命名有如下要求：

- 能使用数据、字母和下划线，且只能以字母或下划线开头。
- 大小写敏感，即区分大小写。a和A 是2个变量名。
- 不能使用关键字及系统预留字重复。

#### 变量的作用域

根据有效范围作用域分为`全局变量（Local）`和`局部变量（Global）`。`全局变量` 是在整个程序系统或文件全局中有效的变量。`局部变量`表示在一个代码逻辑块中有效的变量。全局和局部变量是相对的，如我们可以叫一个相对于文件来说的全局变量，但是在多个文件或者文件包中便成了局部变量。除了全局和局部变量，Python中还有以下作用域：

- E （Enclosing） 闭包函数外的函数中
- B （Built-in） 内建作用域

作用域以 L –> E –> G –>B 的规则查找，即：在局部找不到，便会去局部外的局部找，再找不到就会去全局找，再者去内建中找。

### 常量

变量中存储的数值是可以变动的，那么有没有不变的呢？答案是有的，如数学计算使用的PI。我们经常把代码中，存储不变数据的变量称之为常量。可见，常量是一种特殊的变量。

## 字符串与编码

### 字符编码

- ASCII 使用1个字节，只支持英文；
- GB2312 使用2个字节，支持6700+汉字；
- GBK GB2312的升级版，支持21000+汉字；
- Unicode编码，使用2、3或4个字节表示字符；
- UTF 编码为Unicode编码的一种可变长实现；
- 计算机内存中使用Unicode编码处理，存储和传输则使用UTF编码。

我们看下Python中的编码。Python2中的默认编码为`ASCII编码`，Python3中使用的则是`UTF-8编码`。可使用如下命令查看：

```py
import sys
sys.getdefaultencoding()
```

Python2和Python3的默认编码是不一样的，它们处理编码方式也是不一样。

**Python2中的编码**

在 Python2中字符串类型有4种：`str`、`unicode`、`basestring`和`bytes`。

- `basestring` 是一个基类（稍后会讲到此概念，可暂时理解为父亲或基础即可），`str`和`unicode`类型在此基础上构建。
- `str` 是Python设计之初的字符串类型，默认使用系统编码。
- `unicode` 是了使Python支持Unicode编码，在2.0版本之后添加的一种字符串类型。
- `bytes` 是字节串，`str`本身便是一个字节串，那可认为`bytes`是`str`的一个别称，使用和`str`完全一致。

```py
>>> a = '你好'  # 使用系统编码的str 类型
>>> type(a)
<type 'str'>
>>> print a
你好
>>> a
'\xe4\xbd\xa0\xe5\xa5\xbd'  # 系统编码为 utf-8的字节码，使用了3个字节表示一个汉字；
>>> ua = u'你好'   # unicode 编码
>>> type(ua)
<type 'unicode'>
>>> print ua
你好
>>> ua
u'\u4f60\u597d'  # unicode 编码格式的你好，对应unicode代码表中代码
>>> b = b'你好'  # bytes 类型的字符串
>>> type(b)  
<type 'str'>
>>> print b
你好
>>> b  
'\xe4\xbd\xa0\xe5\xa5\xbd'  # 使用3个字节表示1个汉字，且字节码和str类型一样；
```

- Python 解释器默认使用系统的编码方式声明变量。
- unicode类型以 u 开头标识
- bytes 类型以 b 开头标识
- str类型以16进制的ASCII字节码表示，实际上是一个字节串，回应了它的另一个名字bytes。
- unicode类型以unicode字符码表示，是真正的字符串。

`str`与`unicode` 类型之间是可以相互转化的，通过 `encode`和`decode` 来实现。来看实例：

```py
>>> a = '你好'
>>> a.decode('utf-8')  # decode 解码: str类型(UTF-8) --> unicode类型(Unicode)
u'\u4f60\u597d'  # 对应的unicode代码
>>> ua
u'\u4f60\u597d'
>>> ua.encode('utf-8')  # encode 编码: unicode类型(Unicode) --> str类型(UTF-8)
'\xe4\xbd\xa0\xe5\xa5\xbd'  # utf-8的编码的 str字节串
>>> a.decode('gbk')  # 尝试使用 gbk 解码，结果出现乱码
u'\u6d63\u72b2\u30bd'
>>> print a.decode('gbk')  
浣犲ソ
>>> a.decode('gbk').encode('gbk')  # 使用 gbk 解码，再编码，成功还原
'\xe4\xbd\xa0\xe5\xa5\xbd'
>>> print a.decode('gbk').encode('gbk')
你好
>>> a.decode('gbk').encode('utf-8')  # 使用不同的编码来解码和编码, 也出现乱码
'\xe6\xb5\xa3\xe7\x8a\xb2\xe3\x82\xbd'
>>> print a.decode('gbk').encode('utf-8')
浣犲ソ
```

- 使用什么编码编码，就需要使用什么编码解码，否则会出现乱码。
- 转为unicode类型要decode解码。
- 转为str类型要encode编码。
- 区分Unicode类型和Unicode编码，Unicode编码是一套编码集，内容丰富，编码内容涵盖了世界各地的语言，实现方式有UTF-8、UTF-16、UTF-32；Unicode类型只是python字符串的一种类型，使用Unicode编码作为其编码格式，可经过各种编码方式（UTF、GBK、ASCII）编码成str类型字符或者叫bytes（字节序列）类型供计算机使用。
- Unicode 编码的兼容性，可作为其他编码格式的转码的中间站。

文件的存储是以二进制流的方式保存在硬盘上。当Python文件被执行时，这些文件会以二进制流的方式加载到内存中，然后按照Python的默认编码方式解码成相应的python代码对应的unicode编码的字节码来解释执行。在python2中，默认编码为ASCII码，那么当文件中有非ASCII码时，这个解码过程便会出错。Python 为了解决这个问题，在Python 文件头部增加了文件的编码声明，[PEP236](https://www.python.org/dev/peps/pep-0263/)就是为这个问题而创建的改进意见。

Python 文件格式声明如下：

```py
# coding:utf-8
# 或
# -*- coding:utf-8 -*-
```

```py
# -*- coding:utf-8 -*- 

a = '你好'
print(a)
print(type(a))
# <type 'str'>

ua = u'你好'
print(ua)
print(type(ua))
# <type 'unicode'>
```

影响Python 字符编码的地方主要有以下几点：

- Python解释器的默认编码，python2中默认为ASCII。
- Python源文件文件声明编码及保存的编码方式。
- 系统终端使用的编码，会影响python文件执行时的编码方式。
- 操作系统的编码，会影响终端的编码方式。

**Python3中编码**

在python2中，编码问题有2个大的问题：

- 使用 ASCII 作为默认编码方式，不能很好的支持非ASCII码字符；
- 将字符串分为了str 和 unicode两种类型，让大家容易混淆；

Python3 对以上问题做了很好的修正。Python3 默认编码改为了 UTF-8,对于非ASCII码支持更强大。其次，Python3 合并了`str` 和 `unicode` 类型，统一为 `str` 类型。使用 `bytes`类型来表示字节类型。这样很好的区分了字符串和字节串，`str`即为字符串，`bytes` 为字节串或叫二进制字节。

```py
>>> a = '你好'  # utf-8 编码的str类型
>>> type(a)
<class 'str'> 
>>> print(a)
你好
>>> repr(a)
"'你好'"
>>> a  # 显示为原字符串
'你好'
>>> ua = u'你好'
>>> type(ua)    # unicode 编码的 str类型
<class 'str'>
>>> print(ua)
你好
>>> repr(ua)
"'你好'"
>>> ua  # 可以看到，字符串直接显示并没有显示unicode编码
'你好'
>>> a.decode('utf-8')  # unicode 字符串已不能再解码了
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: 'str' object has no attribute 'decode'
>>> a.encode('utf-8')  # 显示为字节串
b'\xe4\xbd\xa0\xe5\xa5\xbd'
>>> e = 'Test'
>>> e
'Test'
>>> e.encode('utf-8')  # 显示为原字符串
b'Test'
```

- 可以看到Unicode类型的字符串类型为 str，带不带u 是一样的。
- unicode 字符串编码成utf-8格式的字节码，前边带 b 说明是bytes 字节类型。
- 在Python3中，所有unicode编码显示均为原字符串，非 unicode 编码的 非ASCII码范围的字符 显示均为字节串。

### 字符串操作

**字符串中的运算符**

```py
# Python 中字符串可以直接使用 "+" 链接。
>>> a = '你好'
>>> b = '世界'
>>> print(a+b)
你好世界

# "*2" 标识2次重复输出
>>> print(a*2)
你好你好

# len 内建函数，可以获取字符串的字节长度
>>> a = '你好'
>>> a
'\xe4\xbd\xa0\xe5\xa5\xbd'  # utf-8 编码，3个字节代表一个汉字。
print(len(a))
>>> e = 'hello'
>>> print(len(e))
5

# [] 索引，可通过下标的方式来获取字符串的某个字节，下标是从 0 开始的，最后一个为'字符串长度-1'或'-1'。
>>> print(a)
helloworld
>>> a[2]
'l'
>>> a[0]
'h'
>>> a[9]
'd'
>>> a[-1]
'd'

# [:] 切片，可使用字符串下标来截取字符串
>>> a = 'helloworld'
>>> a[0:5]
'hello'

# in 判断某变量是否在字符串中。
>>> a = 'helloworld'
>>> 'hello' in a
True
```

**格式化**

有时候，我们要将多个变量组成一个我们需要的字符串来使用，这个过程叫做格式化。Python中格式化的方式有两种，一种使用`‘%’` ，一种是使用`format`内建函数。

```py
# 使用 % 格式化，格式化变量，依次由左向右对应。
>>> c = '%s,%s!'%(a,b)  
>>> print(c)
你好,世界!
```

使用 `%`来格式化时，`%s`中的`s`叫做`占位符`，不同的类型需要不同的占位符，如下：

| 占位符 | 类型 |
| :------ | :------ |
%d | 整数
%f | 浮点数
%s | 字符串
%x | 十六进制整数

```py
# 使用format 格式化，格式化变量，由左向右根据大括号的序号对应。
>>> d = '{1}，{0}'.format('世界','你好')
>>> print(d)
你好，世界
```

**常用方法**

```py
# 可使用内建函数dir查看某对象的方法:
>>> dir(a)
['__add__', '__class__', '__contains__', '__delattr__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__getitem__', '__getnewargs__', '__getslice__', '__gt__', '__hash__', '__init__', '__le__', '__len__', '__lt__', '__mod__', '__mul__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__rmod__', '__rmul__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '_formatter_field_name_split', '_formatter_parser', 'capitalize', 'center', 'count', 'decode', 'encode', 'endswith', 'expandtabs', 'find', 'format', 'index', 'isalnum', 'isalpha', 'isdigit', 'islower', 'isspace', 'istitle', 'isupper', 'join', 'ljust', 'lower', 'lstrip', 'partition', 'replace', 'rfind', 'rindex', 'rjust', 'rpartition', 'rsplit', 'rstrip', 'split', 'splitlines', 'startswith', 'strip', 'swapcase', 'title', 'translate', 'upper', 'zfill']
>>>
```

- `endswith(‘’)` 是否以某字符串结尾，是则返回True，否则返回False；
- `startswith('')` 是否以某字符串开始，是则返回True，否则返回False；
- `split()` 分隔字符串，返回一个列表（python高级数据结构，稍后讲解）。
- `lower()` 转为小写。
- `upper()` 转为大写。
- `strip('')` 2侧去除某字符串。
- `lstrip('')` 左侧去除某字符串。
- `rstrip('')` 右侧去除某字符串。
- `join()` 以某字符串为连接符，合并某列表。
- `ljust(int)` 左对齐，并使用空格填充至指定长度的新字符串
- `rjust(int)` 右对齐，并使用空格填充至指定长度的新字符串

## 运算符与表达式

### 运算符

- 算数运算符
  - `+`、`-`、`*`、`/`、`%`、`**`(幂)、`//`(取整除)
- 比较运算符
  - `==`、`!=`、`>`、`<`、`>=`、`<=`
  - python2中运行不同类型的变量作比较，比较时会自动做类型转化，由简单类型向复杂类型转变。python3只允许同类型变量比较。
- 逻辑运算符
  - `and`、`or`、`not`
- 赋值运算符
  - `=`、`+=`、`-=`、`*=`、`%=`、`**=`、`//=`、`/=`
  - `//=` 与 `/=` 在python2中都为取整除法
- 位运算符
  - `&` `(a & b)`输出12，二进制解释：0000 1100
  - `|`
  - `^` 按位异或运算符：当两对应的二进位相异时，结果为1，`(a^b)`输出49，二进制解释：0011 0001 1
  - `~` 按位取反运算符：当数据的每个二进制位取反，即把1变为0，0变为1。`(~a)`输出-61，二进制解释：1100 0011，在一个有符号二进制数的补码形式。
  - `<<` 左移动运算符：运算数的各二进位全部左移若干位，高位丢弃，低位补0.
  - `>>` 右移动运算符：运算数的各二进位全部右移若干位。
- 成员运算符
  - `in` 如果在指定的序列中找到值返回 True，否则False。
  - `not in` 如果在指定的序列中没有找到值返回 True，否则False。
- 身份运算符
  - `is` is 是判断两个标识符是不是引用自同一个对象。
  - `is not` 判断两个标识符是不是引用自不同对象。
  - 与比较运算符 `==` 比较，`==` 为值相等即可，内存引用地址可不同；`is`则为值和内存引用地址均相同。
- 运算符优先级
  - `**`
  - `~ + -`
  - `* / % //`
  - `+ -`
  - `>> <<`
  - `&`
  - `^ |`
  - `<= < > >=`
  - `<> == !=`
  - `= %= /= //= -= += *= **=`
  - `is is not`
  - `in not in`

## 输入输出

python2 中提供了输入函数 `input`、`raw_input`来输入，函数`print` 来输出。python3中`raw_input`函数去掉了，功能合并到input。

### 输入

python2 中`raw_input`

```py
>>> raw_input('请输入：')
>>> raw_input('请输入：')
请输入：123
'123'
>>> raw_input('请输入：')
请输入：abc
'abc'
```

可见 `raw_input` 返回我们输入的数据为一个字符串返回。

再来看下 `input`，它除了支持字符串还支持表达式，如下：

```py
>>> input('请输入：')
请输入：1+2
3
>>>
```

可见它输出了表达式的值，也就是说它执行了表达式。试想，如果这里放一个破坏我们系统执行的表达式，我们系统便会受到安全威胁。在人们衡量后，在python3中，决定去除该函数，并将原来的`raw_input` 改名为 `input`。

### 输出

python2 中使用`print`语句来输出，python3中则改为了 `print`函数。

```py
>>> print('你好', end=',')
你好,>>> a = '世界'
>>> print('你好，%s'%a)
你好，世界
>>> print('你好', '世界')
你好世界
```

- `end=`参数, 传递给参数的字符将追加到打印字符串结尾，当省略时默认为回车换行。
- `print` 函数可传入多个字符串来打印，当传入多个时，会自动合并链接。
- `print` 函数常被用来在调试代码时，打印变量使用。

## 练习

- 1、你想通过某种对齐方式来格式化字符串？

```py
>>> text = 'Hello World'
>>> text.ljust(20)
'Hello World         '
>>> text.rjust(20)
'         Hello World'
>>> text.center(20)
'    Hello World     '
>>>
```

- 2、华氏温度转摄氏温度。

```py
"""
将华氏温度转换为摄氏温度公式：
F = 1.8C + 32
"""

f = float(input('请输入华氏温度: '))
c = (f - 32) / 1.8
print('%.1f华氏度 = %.1f摄氏度' % (f, c))
```

- 3、输入圆的半径计算计算周长和面积。

```py
"""
输入半径计算圆的周长和面积
"""
import math

radius = float(input('请输入圆的半径: '))
perimeter = 2 * math.pi * radius
area = math.pi * radius * radius
print('周长: %.2f' % perimeter)
print('面积: %.2f' % area)
```

- 4、输入年份判断是不是闰年。

```py
"""
输入年份 如果是闰年输出True 否则输出False
"""

year = int(input('请输入年份: '))
# 如果代码太长写成一行不便于阅读 可以使用\或()折行
is_leap = (year % 4 == 0 and year % 100 != 0 or
           year % 400 == 0)
print(is_leap)
```