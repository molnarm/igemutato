chrome.storage.sync.get('config', function(result) {
	for (key in result.config) {
		Szentiras.config[key] = result.config[key];
	}
	Szentiras.keres(document.body);
});
