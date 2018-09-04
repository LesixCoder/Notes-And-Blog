var List = function(container, items, itemHeight) {
	this.container = container;
	this.items = items;
	this.itemHeight = itemHeight;
	this.init();
	this.update();
};

List.prototype.init = function() {
	var h = this.container.offsetHeight;
	this.ul = document.createElement('ul');
	var len = this._maxLength();
	var html = '';
	for(var i = 0; i < len; i++) {
		html += '<li>' + this.items[i] + '</li>';
	}
	this.ul.innerHTML = html;
	this.container.appendChild(this.ul);
	var self = this;
	this.container.addEventListener('scroll', function() {
		self.update();
	}, false)
};

List.prototype._maxLength = function() {
	var h = this.container.offsetHeight;
	var len = Math.min(Math.ceil(h / this.itemHeight), this.items.length);
	return len;
};

List.prototype.update = function() {
	this.ul.style.height = this.items.length * this.itemHeight + 'px';

	var scrollTop = this.container.scrollTop;
	var start = Math.floor(scrollTop / this.itemHeight);
	var items = this.ul.children;
	var len = this._maxLength();
	for(var i = 0; i < len; i++) {
		var item = items[i];
		if(!item) {
			item = items[i] = document.createElement('li');
			this.ul.appendChild(item);
		}
		var index = start * i;
		item.innerHTML = this.items[index];
		item.style.top = this.itemHeight * index + 'px';
	}
};

List.prototype.push = function(html) {
	this.items.push(html);
};

List.prototype.scrollToBottom = function(done) {
	this.update();
	var scrollTop = this.container.scrollTop;

	if(this.container).stop().animate({
		scrollTop: this.items.length + 10
	}, 4000, function() {
		if(typeof done === 'function') done();
		console.log('end');
	});
}