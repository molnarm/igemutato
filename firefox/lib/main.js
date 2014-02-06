var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
pageMod.PageMod({
	include : "*.hu", //["http://*", "https://*"],
	contentScriptFile : [data.url("igemutato.min.js"), data.url("content.js")],
	contentStyleFile : [data.url("igemutato.min.css")]
});