chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.storage.sync.get({
		targetUrl: ''
	}, function(items) {
		if (items.targetUrl === '') {
			alert('Please configure the URL in the Extension options.');
			return;
		}
		var link = items.targetUrl;
		link = link + '#/bookmark/add?';
		link = link + 'title='+encodeURIComponent(tab.title);
		link = link + '&link='+encodeURIComponent(tab.url);
		link = link + '&window=1';
		chrome.windows.create({
			'url': link,
			'type': 'popup',
			'width': 313,
			'height': 513
		}, function(window) {});
	});
});
