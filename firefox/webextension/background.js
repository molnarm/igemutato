var port = browser.runtime.connect({ name: "sync-legacy-addon-data" });
port.onMessage.addListener((msg) => {
    if (msg) {
        browser.storage.sync.set(msg);
    }
});