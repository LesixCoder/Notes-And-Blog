if (navigator.serviceWorker) {
	navigator.serviceWorker.register('./service-worker.js', {scope: './'})
		.then(function(req){
			console.log(req)
		})
		.catch(function(e){
			console.log(e)
		})
} else{
	alert('Service Worker is not supported')
}