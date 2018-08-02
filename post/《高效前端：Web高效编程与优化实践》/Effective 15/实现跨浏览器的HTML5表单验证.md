# 实现跨浏览器的HTML5表单验证

## 前言

表单验证通常采用的方法是用策略模式的思想， 把一个个验证规则封装成一个函数，如非空规则，最大长度规则等，不同的输入框选择某一个或者某几个规则进行验证。这样有它的好处，也有它的坏处。好处是每个规则是独立的，包括它的检验规则和出错提示信息，可以把它们封装在一起。坏处是当你写一个表单里面有 10 个 input, 每个 input 都有 3~4 个验证规则， 那你的 JS 至少得写 30 行代码用来添加验证规则， 这样代码看起来就有点冗长了。

其实 HTML5 增加了很多种类型的 input, 每个 input 还支持 `pattern/minlength/maxlength` 等规则的验证， 可以说几乎不用自己去写验证规则。使用 HTML5 的表单验证能够更加的方便快捷。但是每个浏览器在某些行为不一致， 再加上兼容性的原因， 大家都不太想用。其实这两个缺点是可以克服的。

使用 HTML5 的 input 有一个很大的优点， 就是手机上会根据不同的类型弹不同的键盘， 方便用户输入， 这一点你用什么策略模式都是无法做到的。

但是由于不同的浏览器对不合法输入提示文案不一致，样式也不一样，并且老的浏览器不兼容 (IE9 及以下），在生产环境中比较少看到有人用。

具体来说存在三个问题：

- 输入框 blur 的时候不会触发检查，只有在点提交时才触发， 但是有一种场景是希望用户一旦离开这个输入框就对其输入进行检查；
- 提示控件的 UI 差异很大，safari 还不会触发提示控件，一些浏览器如 IE 会给非法的输入框添加一个红色的边框；
- 文案是写死的，并且不同浏览器的文案不一致，其中应该以 Chrome 的提示最好。

## 实现跨浏览器插件

为解决这些问题，网上有一些插件，如 HTML5 Form, 做了跨浏览器的处理， 但是使用起来效果并不是十分让人满意， HTML5 Form 在 Safari 下面就失效了。 接下来我们就自己封装一个插件。

为了实现跨浏览器的一致性和使用的方便，达到了以下特点：

1.  统一 UI 和文案
2.  支待异步验证
3.  支持多重类型规则验证
4.  能够中英文切换

先来说一下怎么用这个插件，然后再分析怎么实现一个这样的插件。

## 插件使用方法

**1. 最简单的使用方法**

所有的 input 要写在 form 里面

```html
<form class="sign-up">
  <label>邮箱地址</label>
  <input type="email" name="account" data-t="email" required="">
  <label>密码</label>
  <input type="password" name="password" pattern=".{6,20}" data-pm="密码要在6到
20位之间" required="">
  <label>确认密码</label>
  <input type="password" name="confirm-pwd" maxlength="20" minlength="6">
  <input id="confirm-sign" type="submit" value="注册">
  <p></p>
</form>
```

定义了 input 的 `type="email"` , 还要再写多 一个`data­-t="email" 主要是因为 IE10 以下的浏览器会把不认识的 type 强制改成 text。

上面总共用到了类型、必填、正则、长度检验，出错信息放在了 `data-pm` 属性里面。 这比你手动一个个去添加规则要方便多了。有了上面的 HTML 结构之后， 只需要初始化插件就可以了。

```js
new Form(
  document.getElementByid('sign-up-form'),
  {
    errorMsgClass: 'error', // 错误提示桯的类名， 用于自定义样式
    errorinputClass: 'invalid' //input无教的类名， 用于自定义样式
  },
  submit
);

function submit() {
  console.log('表单验证成功， 准备提交');
  // 提交操作
}
```

执行 `new From` 的时候传了 3 个参数， 第一个是 form 的 DOM 元素， 第二个参数是验证规则的一些配置， 第三是验证成功的回调函数。 第二个参数 `checkOpt` 有两个属性 `errorMsgClass`和`errorInputClass` 用来自定义样式。

**2. 添加自定义检验**

有时候有些检验无法用 HTML5 的属性检验，这个时候需要添加自定义检验， 如上面的密码需要保证两次的输入一致，可以在`checkOpt`里面添加自定义验证

```js
checkOpt.rule = {
  'confirm-pwd': {
    check: checkPwdIdentity, // 定义检验函数
    msg: '两次密码输入不一致' // 出错提示信息
  }
};

function checkPwdIdentity() {
  return this.form['password'].value === this.form['confirm-pwd'].value;
}
```

添加了一个 rule 属性，key 值为 input 的 name 属性，value 值包含一个自定义的检验函数和出错信息。

**3. 自定义异步检验**

有些数据需要向服务请求检验，如检验账户是否存在

```js
checkOpt.rule.account = {
  check: checkAccountExist,
  msg: '账户已存在！',
  async: true
};

function checkAccountExist(failCallback, successCallback) {
  var input = this;
  util.ajax(
    '/register/hasUser',
    {
      account: this.value
    },
    function(data) {
      // 如果用户存在则调用failCallback, 让插件添加一个错误提示
      if (data.isUser) {
        failCallback();
      }
      // 成功则调用插件的成功回调函数
      else {
        successCallback();
      }
    }
  );
}
```

在回调函数里面传进两个参数，如果检验失败则执行第一个参数，成功则执行第二个参数，为插件所用。

**4. 添加自定义类型出错提示**

不同类型的输入框给出不同类型的出错提示

```js
Form.prototype.validationMessage_cn = {
  email: '无效的邮箱格式',
  number: '无效的数字格式',
  url: '无效的网址格式',
  password: '格式无效',
  text: '格式无效'
};
```

可以取消掉浏览器提供的文案， 用上面的默认文案，显示英文站的时候取消掉中文浏览器的中文提示：

```js
// 如果浏览器的语言不是中文的话， 就不要使用英文的文案了， 双语站时侯适用
checkOpt.disableBrowserMsg = !(
  navigator.language || navigator.userLanguage
).match(/cn/i);
```

还可以指定插件使用的语言

```js
// 双语站切换时适用
checkOpt.lang = 'en'; // 或者en
```

## 插件的实现

怎么实现这么一个方便快捷的表单验证插件呢？它的实现并不是很复杂，只是需要考虑很多细节。下面分析一些关键点和难点。

### 1. 为非 HTML5 浏览器添加 checkValidity 函数

如果没有 `checkValidity` 函数的话就给它添加一个， 相当于自行实现一个 HTML5 的 `checkValidity` 函数。 因为在后续的验证里面需要用到这个函数

```js
var input = document.createElement('input');
if (!input.checkValidity) {
  HTMLinputElement.prototype.checkValidity = function() {
    // 这里根据不同的属性规则做检验， 如type/pattern/minlength, 代码略
  };
}
```

### 2. 添加错误提示

重点是计算提示显示的位置

```js
Form.prototype.addErrorMsg = function(input, msg) {
  // 根据input计算msg相对input的位置
};
```

### 3. 异步检验的实现

异步检验的难点在于，什么时候执行 submit 回调。 解决方案是给每个 input 添加一个 hasCheck 属性，如果检查通过则设置为 true, 一旦 focus 了就设为 false, blur 则触发检查。只有所有的 input 都有了属性 hasCheck 为 true 时才能执行 submit 回调。 下面代码中的 `checkAsync` 的第二个参数 `needSubmit`, 点提交时设置成 true, 而 blur 验证则为 false, 用于控制检验成功后是否要提交表单。

**异步检验核心代码**

```js
Form.prototype.checkAsync = function(input, needSubmit) {
  var name = input.name;
  var rule = input.form.Form.checkOpt.rule;
  rule[name]['check'].call(
    input,
    // 检验失败回调函数
    function() {
      var Form = input.form.Form;
      Form.addErrorMsg(input, Form.checkOpt.rule[name].msg);
    },
    // 检验成功回调函数
    function() {
      input.hasCheck = true;
      if (needSubmit) {
        input.form.Form.tryCallSubmit(input);
      }
    }
  );
};
```

`tryCallSubmit` 函数检查除 submit 外所有的 input 是否为 `hasCheck` 是 true, 如果有则执行 `submit callback`。

以上就是整个跨浏览器的 HTML5 表单验证插件的思想。 表单验证的实现可能有多种方式， 但是借助 HTML5 的特性做表单验证无疑会更简单，代码更少，用户体验更好。
