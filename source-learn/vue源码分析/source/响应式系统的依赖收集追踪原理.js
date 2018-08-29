class Dep {
  constructor () {
      this.subs = [];
  }

  addSub (sub) {
      this.subs.push(sub);
  }

  notify () {
      this.subs.forEach((sub) => {
          sub.update();
      })
  }
}

class Watcher {
  constructor () {
      Dep.target = this;
  }

  update () {
      console.log("视图更新啦～");
  }
}

function observer (obj) {
  if (!obj || (typeof obj !== 'object')) {
      return;
  }
  
  Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key]);
  });
}

function defineReactive (obj, key, val) {
  const dep = new Dep();
  
  Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
          dep.addSub(Dep.target);
          return val;         
      },
      set: function reactiveSetter (newVal) {
          if (newVal === val) return;
          val = newVal;
          dep.notify();
      }
  });
}

class Vue {
  constructor(options) {
      this._data = options.data;
      observer(this._data);
      new Watcher();
      console.log('render~', this._data.test);
  }
}

let o = new Vue({
  data: {
      test: "I am test."
  }
});
o._data.test = "hello,test.";

Dep.target = null;