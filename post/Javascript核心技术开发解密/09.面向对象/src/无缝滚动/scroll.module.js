(function(ROOT){
  var lastTime = 0,
    nextFrame = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequesAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback) {
                  var currTime = +new Date,
                    delay = Math.max(1000 / 60, 1000 / 60 - (currTime - lastTime));
                  lastTime = currTime + delay;
                  return setTimeout(callback, delay);
                },
    cancelFrame = window.cancelAnimationFrame ||
                  window.webkitCancelAnimationFrame ||
                  window.webkitCancelRequestAnimationFrame ||
                  window.mozCancelRequestAnimationFrame ||
                  window.msCancelRequestAnimationFrame ||
                  clearTimeout;
  
  var timer = null;
  
  function Scroll(elem) {
    this.elem = elem;
    this.areaWidth = elem.offsetWidth;

    this.scrollBody = elem.querySelector('.scroll_body');
    this.itemWidth = this.areaWidth/this.scrollBody.children.length;
    this.scrollX = 0;
    this.targetPos = this.areaWidth;
    this.init();
  }

  Scroll.prototype = {
    constructor: Scroll,
    init: function() {
      this.scrollBody.style.width = this.areaWidth * 2 + 'px';
      this.scrollBody.innerHTML = this.scrollBody.innerHTML + this.scrollBody.innerHTML;
      this.moveRight();
    },
    moveLeft: function() {
      var self = this;
      cancelFrame(timer);
      timer = nextFrame(function() {
        self.scrollX -= 1;
        if(-self.scrollX >= self.targetPos) {
          self.scrollX = 0;
        }
    
        self.scrollBody.style.left = self.scrollX + 'px';
        self.moveLeft();
      })
    },
    moveRight: function() {
      var self = this;
      cancelFrame(timer);
      timer = nextFrame(function() {
        self.scrollX += 1;
        if(self.scrollX >= 0) {
          self.scrollX = -self.targetPos;
        }
    
        self.scrollBody.style.left = self.scrollX + 'px';
        self.moveRight();
      })
    },
    stop: function() {
      cancelFrame(timer);
    }
  }

  ROOT.Scroll = Scroll;  
})(window);

var scroll = new Scroll(document.querySelector('#scroll_area'));

var left_btn = document.querySelector('.left');
var right_btn = document.querySelector('.right');
var stop_btn = document.querySelector('.stop');

left_btn.onclick = function() {
  scroll.moveLeft();
}
right_btn.onclick = function() {
  scroll.moveRight();
}
stop_btn.onclick = function() {
  scroll.stop();
}