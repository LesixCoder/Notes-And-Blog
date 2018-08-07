// 高阶函数withLogin，用来判断当前用户状态
(function() {
  // 用随机数的方式来模拟一个获取用户信息的方法
  var getLogin = function() {
    var a = parseInt(Math.random * 10).toFixed(0);
    if(a % 2 == 0){
      return {
        login: false
      }
    }
    return {
      login: true,
      userInfo: {
        nickname: 'karl',
        vip: 11,
        userid: '666666'
      }
    }
  }

  var withLogin = function(basicFn) {
    var loginInfo = getLogin();

    // 将loginInfo 以参数的形式传入基础函数中
    return basicFn.bind(null, loginInfo);
  }

  window.withLogin = withLogin;
})()

(function() {
  var withLogin = window.withLogin;

  var renderIndex = function(loginInfo) {
    // 这里处理 index 页面的逻辑

    if(loginInfo.login) {
      // 处理已经登陆之后的逻辑
    } else {
      // 这里处理未登录的逻辑
    }
  }

  // 对外暴露接口时，使用高阶函数包一层，来判断当前页面的登录状态
  window.renderIndex = withLogin(renderIndex);
})()

(function() {
  var withLogin = window.withLogin;
  var renderPersonal = function(loginInfo) {
    if(loginInfo.login) {
      // do something
    } else {
      // do other something
    }
  }
  window.renderPersonal = withLogin(renderPersonal);
})()

(function() {
  var env = {
    isMobile: false,
    isAndroid: false,
    isIOS: false
  }
  var ua = navigator.userAgent;
  env.isMobile = 'ontouchstart' in document;
  env.isAndroid = !!ua.match(/android/);
  env.isIOS = !!ua.match(/iphone/);

  var withEnviroment = function(basicFn) {
    return basicFn.bind(null, env);
  }

  window.withEnviroment = withEnviroment;
})();

(function() {
  window.renderIndex();
})();