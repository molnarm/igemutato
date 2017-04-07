const sp = require("sdk/simple-prefs");

exports.setSyncLegacyDataPort = function (port) {
    // Send the initial data dump.
    port.postMessage({
        prefs: {
            superImportantUserPref: sp.prefs["superImportantUserPref"],
        },
    });

    // Keep the preferences in sync with the data stored in the webextension.
    sp.on("superImportantUserPref", () => {
        port.postMessage({
            prefs: {
                superImportantUserPref: sp.prefs["superImportantUserPref"],
            }
        });
    });
};