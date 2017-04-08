const gettingItem = browser.storage.sync.get();
gettingItem.then((results) => {
    results.firefoxCSS = browser.extension.getUrl('igemutato.min.css');

    Szentiras.setConfig(results);
    Szentiras.start(document.body);
};