const getModal = function(){
	let $modal = document.querySelector('#ui-modal');
	if(!$modal){
		$modal = document.createElement('div');
		$modal.id = 'ui-modal';
		$modal.className = 'modal';
		$modal.style.top = '10%';
		$modal.style.zIndex = '1000';
		$modal.addEventListener('click', (e) => {
			if(e.target.classList.contains('modal-close')){
				$modal.style.display = 'none';
				getOverlay().style.display = 'none';
				e.preventDefault();
			}
		});
		document.body.appendChild($modal);
	}
	return $modal;
};

const getOverlay = function(){
	let $overlay = document.querySelector('#ui-overlay');
	if(!$overlay){
		$overlay = document.createElement('div');
		$overlay.id = 'ui-overlay';
		$overlay.className = 'modal-overlay';
		$overlay.style.opacity = '.3';
		document.body.appendChild($overlay);
	}
	return $overlay;
};


exports.show = function(options){
	if(!options) options = {};
	if(!options.title) options.title = '提示';
	let html = `
		<div class="modal-content">
			<h4>${options.title}</h4>
			<p>${options.content}</p>
		</div>
		<div class="modal-footer">
			<a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">确定</a>
		</div>
	`;

	let $modal = getModal();
	let $overlay = getOverlay();
	$modal.innerHTML = html;
	$modal.style.display = 'block';
	$overlay.style.display = 'block';
};
