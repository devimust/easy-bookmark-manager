function save_options() {
	var targetUrl = document.getElementById('targetUrl').value;
	chrome.storage.sync.set({
		targetUrl: targetUrl
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved!';
		setTimeout(function() {
			status.textContent = '';
		}, 1200);
	});
}

function restore_options() {
	chrome.storage.sync.get({
		targetUrl: ''
	}, function(items) {
		document.getElementById('targetUrl').value = items.targetUrl;
	});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
