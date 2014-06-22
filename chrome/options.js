function save_options() {
	var config = {
		forditas : document.getElementById("forditas").value,
		tipH : parseInt(document.getElementById("tipH").value),
		tipW : parseInt(document.getElementById("tipW").value),
		fontSize : parseInt(document.getElementById("fontSize").value),
		tipShow : parseInt(document.getElementById("tipShow").value),
		tipHide : parseInt(document.getElementById("tipHide").value),
		excludeTags : document.getElementById("excludeTags").value,
		enableFormatting : document.getElementById("enableFormatting").checked,
	};

	chrome.storage.sync.set({
		'config' : validate_options(config)
	}, function() {
		restore_options();
		
		var status = document.getElementById("status");		
		status.innerHTML = "Elmentettük a beállításokat.";
		setTimeout(function() {
			status.innerHTML = "";
		}, 1000);
	});
}

function validate_options(data) {
	var defaults = {
		forditas : 'SZIT',
		tipW : 300,
		tipH : 200,
		fontSize : 13,
		tipShow : 200,
		tipHide : 500,
		excludeTags : "head,script,input,select,textarea,h1,h2,h3,a",
		enableFormatting: true
	};

	var options = data || {};
	var tipW = parseInt(options.tipW),
	tipH = parseInt(options.tipH),
	fontSize = parseInt(options.fontSize),
	tipShow = parseInt(options.tipShow),
	tipHide = parseInt(options.tipHide),
	forditas = options.forditas;

	options.tipW = (isNaN(tipW) || tipW < 100) ? defaults.tipW : tipW;
	options.tipH = (isNaN(tipH) || tipW < 50) ? defaults.tipH : tipH;
	options.fontSize = (isNaN(fontSize) || fontSize < 5) ? defaults.fontSize : fontSize;
	options.tipShow = (isNaN(tipShow) || tipShow < 0) ? defaults.tipShow : tipShow;
	options.tipHide = (isNaN(tipHide) || tipHide < 0) ? defaults.tipHide : tipHide;
	options.forditas = ([ 'SZIT', 'KNB', 'KG', 'UF' ].indexOf(forditas) == -1) ? defaults.forditas : forditas;
	options.excludeTags = options.excludeTags || defaults.excludeTags;
	if(options.enableFormatting === undefined) options.enableFormatting = defaults.enableFormatting;

	return options;
}

function restore_options() {
	chrome.storage.sync.get('config', function(result) {
		var config = validate_options(result.config);

		var select = document.getElementById("forditas");
		for (var i = 0; i < select.children.length; i++) {
			var child = select.children[i];
			if (child.value == (config.forditas)) {
				child.selected = "true";
				break;
			}
		}

		document.getElementById("tipH").value = config.tipH;
		document.getElementById("tipW").value = config.tipW;
		document.getElementById("fontSize").value = config.fontSize;
		document.getElementById("tipShow").value = config.tipShow;
		document.getElementById("tipHide").value = config.tipHide;
		document.getElementById("excludeTags").value = config.excludeTags;
		document.getElementById("enableFormatting").checked = config.enableFormatting;
	});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);