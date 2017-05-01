const gettingItem = browser.storage.sync.get();
gettingItem.then((results) => {
    results.firefoxCSS = browser.extension.getURL('igemutato.css');

    Szentiras.setConfig(results);
    Szentiras.start(document.body);
});