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

var area = document.querySelector('#scroll_area');
var areaWidth = area.offsetWidth;

var scrollBody = area.querySelector('.scroll_body');
var itemWidth = areaWidth/(scrollBody.children.length);

scrollBody.style.width = areaWidth * 2 + 'px';
scrollBody.innerHTML = scrollBody.innerHTML + scrollBody.innerHTML;

var targetPos = areaWidth;
var scrollX = 0;
var timer = null;

function ani() {
  cancelFrame(timer);
  timer = nextFrame(function() {
    scrollX -= 1;

    if(-scrollX >= targetPos) {
      scrollX = 0;
    }

    scrollBody.style.left = scrollX + 'px';
    ani();
  })
}

ani();