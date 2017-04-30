chrome.storage.sync.get('config', function(result) {
    if(result && result.config)	
        Szentiras.setConfig(result.config);
    Szentiras.start(document.body);
});
