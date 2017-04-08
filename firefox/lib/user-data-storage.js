const preferences = require("sdk/simple-prefs");

exports.setSyncLegacyDataPort = function (port) {
    validateOptions(prefs);
    port.postMessage({
        prefs: preferences.prefs
    });

    preferences.on("", () => {
        validateOptions(prefs);
        port.postMessage({
            prefs: preferences.prefs
        });
    });
};

function validateOptions(prefs) {
    var defaults = {
        forditas: 'SZIT',
        tipW: 300,
        tipH: 200,
        tipShow: 200,
        tipHide: 500,
        fontSize: 16,
        excludeTags: "head,script,input,select,textarea,h1,h2,h3,a",
        enableFormatting: true,
        showNumbers: false
    },
        options = prefs;

    var tipW = parseInt(options.tipW),
        tipH = parseInt(options.tipH),
        tipShow = parseInt(options.tipShow),
        tipHide = parseInt(options.tipHide),
        fontSize = parseInt(options.fontSize),
        forditas = options.forditas;

    prefs.tipW = (isNaN(tipW) || tipW < 100) ? defaults.tipW : tipW;
    prefs.tipH = (isNaN(tipH) || tipW < 50) ? defaults.tipH : tipH;
    prefs.tipShow = (isNaN(tipShow) || tipShow < 0) ? defaults.tipShow : tipShow;
    prefs.tipHide = (isNaN(tipHide) || tipHide < 0) ? defaults.tipHide : tipHide;
    prefs.fontSize = (isNaN(fontSize) || fontSize < 5) ? defaults.fontSize : fontSize;
    prefs.forditas = (['SZIT', 'KNB', 'KG', 'UF'].indexOf(forditas) == -1) ? defaults.forditas : forditas;
    if (prefs.enableFormatting === undefined) prefs.enableFormatting = defaults.enableFormatting;
    if (prefs.showNumbers === undefined) prefs.showNumbers = defaults.showNumbers;
}