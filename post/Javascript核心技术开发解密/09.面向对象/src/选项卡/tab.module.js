!function(ROOT) {
  // var index = 0;
  function Tab(elem) {
    this.index = 0;
    this.tabHeader = elem.firstElementChild;
    this.items = this.tabHeader.children;
    this.tabContent = elem.lastElementChild;
    this.itemboxes = this.tabContent.children;
    this.max = this.items.length - 1;

    this.init();
  }

  Tab.prototype = {
    constructor: Tab,
    init:function() {
      this.tabHeader.addEventListener('click', this.clickHandler.bind(this), false);
    },
    clickHandler: function(e) {
      var a = [].slice.call(e.target.classList).indexOf('item');
      if(a > -1) {
        this.switchTo(e.target.dataset.index);
      }
    },
    switchTo: function(i) {
      if(i == this.index) {
        return;
      }
      this.items[this.index].classList.remove('active');
      this.itemboxes[this.index].classList.remove('active');
      this.index = i;
      this.items[this.index].classList.add('active');
      this.itemboxes[this.index].classList.add('active');
    },
    next: function() {
      var tgIndex = 0;
      if(this.index >= this.max) {
        tgIndex = 0;
      } else {
        tgIndex = this.index + 1;
      }
      this.switchTo(tgIndex);
    },
    pre: function() {
      var tgIndex = 0;
      if(this.index == 0) {
        tgIndex = this.max;
      } else {
        tgIndex = this.index - 1;
      }
      this.switchTo(tgIndex);
    },
    getIndex: function() {
      return this.index;
    }
  }

  ROOT.Tab = Tab;
}(window);

// var tab = new Tab(document.querySelector('#tab_wrap'));

// document.querySelector('.next').addEventListener('click', function() {
//   tab.next();
//   console.log(tab.getIndex());
// }, false);

// document.querySelector('.prev').addEventListener('click', function() {
//   tab.pre();
//   console.log(tab.getIndex());
// }, false);