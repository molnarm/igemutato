var data = require("sdk/self").data;
var prefs = require("sdk/simple-prefs");
var pageMod = require("sdk/page-mod");

pageMod.PageMod({
	include : ["http://*", "https://*"],
	contentScriptFile : [data.url("igemutato.min.js"), data.url("content.js")],
	contentStyleFile : [data.url("igemutato.min.css")],
	onAttach: function(worker) {
		validateOptions();
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
		excludeTags : "head,script,input,select,textarea,h1,h2,h3,a",
		enableFormatting: true
	},
	options = prefs.prefs;

	var tipW = parseInt(options.tipW),
	tipH = parseInt(options.tipH),
	tipShow = parseInt(options.tipShow),
	tipHide = parseInt(options.tipHide),
	forditas = options.forditas;

	prefs.prefs.tipW = (isNaN(tipW) || tipW < 100) ? defaults.tipW : tipW;
	prefs.prefs.tipH = (isNaN(tipH) || tipW < 50) ? defaults.tipH : tipH;
	prefs.prefs.tipShow = (isNaN(tipShow) || tipShow < 0) ? defaults.tipShow : tipShow;
	prefs.prefs.tipHide = (isNaN(tipHide) || tipHide < 0) ? defaults.tipHide : tipHide;
	prefs.prefs.forditas = ([ 'SZIT', 'KNB', 'KG', 'UF' ].indexOf(forditas) == -1) ? defaults.forditas : forditas;
	if(prefs.prefs.enableFormatting === undefined) prefs.prefs.enableFormatting = defaults.enableFormatting; 
}