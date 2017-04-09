var data = require("sdk/self").data;
var prefs = require("sdk/simple-prefs");
var pageMod = require("sdk/page-mod");

pageMod.PageMod({
	include : ["http://*", "https://*"],
	contentScriptFile : [data.url("igemutato.min.js"), data.url("content.js")],
	onAttach: function(worker) {
		validateOptions();
		prefs.prefs.firefoxCSS = data.url('igemutato.min.css');
		worker.port.emit("prefs", prefs.prefs);
	}
});

function validateOptions(){
	var defaults = {
		forditas : 'SZIT',
		tipW : 300,
		tipH : 200,
		tipShow : 200,
		tipHide : 500,
		fontSize : 16,
		excludeTags : "head,script,input,select,textarea,h1,h2,h3,a",
		enableFormatting: true,
		showNumbers: false
	},
	options = prefs.prefs;

	var tipW = parseInt(options.tipW),
	tipH = parseInt(options.tipH),
	tipShow = parseInt(options.tipShow),
	tipHide = parseInt(options.tipHide),
	fontSize = parseInt(options.fontSize),
	forditas = options.forditas;

	prefs.prefs.tipW = (isNaN(tipW) || tipW < 100) ? defaults.tipW : tipW;
	prefs.prefs.tipH = (isNaN(tipH) || tipW < 50) ? defaults.tipH : tipH;
	prefs.prefs.tipShow = (isNaN(tipShow) || tipShow < 0) ? defaults.tipShow : tipShow;
	prefs.prefs.tipHide = (isNaN(tipHide) || tipHide < 0) ? defaults.tipHide : tipHide;
	prefs.prefs.fontSize = (isNaN(fontSize) || fontSize < 5) ? defaults.fontSize : fontSize;
	prefs.prefs.forditas = ([ 'SZIT', 'KNB', 'KG', 'UF', 'RUF', 'BD' ].indexOf(forditas) == -1) ? defaults.forditas : forditas;
	if(prefs.prefs.enableFormatting === undefined) prefs.prefs.enableFormatting = defaults.enableFormatting; 
	if(prefs.prefs.showNumbers === undefined) prefs.prefs.showNumbers = defaults.showNumbers; 
}