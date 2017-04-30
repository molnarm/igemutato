const webExtension = require("sdk/webextension");
const {setSyncLegacyDataPort} = require("./lib/user-data-storage");

webExtension.startup().then(({browser}) => {
    browser.runtime.onConnect.addListener(port => {
        if (port.name === "sync-legacy-addon-data") {
            setSyncLegacyDataPort(port);
        }
    });
});