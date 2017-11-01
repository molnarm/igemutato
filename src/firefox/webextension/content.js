const gettingItem = browser.storage.sync.get();
gettingItem.then((results) => {
    Szentiras.setConfig(results);
    Szentiras.start(document.body);
});