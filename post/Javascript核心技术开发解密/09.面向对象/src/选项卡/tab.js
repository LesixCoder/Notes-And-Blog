var tabHeader = document.querySelector('.tab_options'); 
var items = tabHeader.children;
var tabContent = document.querySelector('.tab_content'); 
var itemboxes = tabContent.children;
var index = 0;

tabHeader.addEventListener('click', function(e) {
  var a = [].slice.call(e.target.classList).indexOf('item');
  if(a > -1 && index != e.target.dataset.index) {
    items[index].classList.remove('active');
    itemboxes[index].classList.remove('active');
    index = e.target.dataset.index;
    items[index].classList.add('active');
    itemboxes[index].classList.add('active');
  }
}, false)