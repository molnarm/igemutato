function save_options() {
	var config = {
		// TODO parseInt hibakezelés
		forditas : document.getElementById("forditas").value,
		tipH : parseInt(document.getElementById("tipH").value),
		tipW : parseInt(document.getElementById("tipW").value),
		tipShow : parseInt(document.getElementById("tipShow").value),
		tipHide : parseInt(document.getElementById("tipHide").value),
		excludeTags : document.getElementById("excludeTags").value,
	};

	// TODO bohóckodás helyett split() az ellenőrzésnél
	if (config.excludeTags.length > 0) {
		if (config.excludeTags.slice(-1) != ',') {
			config.excludeTags += ',';
		}
		if (config.excludeTags.charAt(0) != ',') {
			config.excludeTags = ',' + config.excludeTags;
		}
	}

	chrome.storage.sync.set({
		'config' : config
	}, function() {
		var status = document.getElementById("status");
		status.innerHTML = "Elmentettük a beállításokat.";
		setTimeout(function() {
			status.innerHTML = "";
		}, 1000);
	});

}

function restore_options() {
	var defaults = {
		forditas : 'SZIT',
		tipW : 300,
		tipH : 200,
		tipD : 10,
		tipShow : 200,
		tipHide : 500,
		excludeTags : "head,script,input,select,textarea,h1,h2,h3,a,"
	};

	chrome.storage.sync.get('config', function(result) {
		var config = result.config || defaults;

		var select = document.getElementById("forditas");
		for ( var i = 0; i < select.children.length; i++) {
			var child = select.children[i];
			if (child.value == (config.forditas || defaults.forditas)) {
				child.selected = "true";
				break;
			}
		}

		document.getElementById("tipH").value = config.tipH || defaults.tipH;
		document.getElementById("tipW").value = config.tipW || defaults.tipW;
		document.getElementById("tipShow").value = config.tipShow || defaults.tipShow;
		document.getElementById("tipHide").value = config.tipHide || defaults.tipHide;
		document.getElementById("excludeTags").value = config.excludeTags || defaults.excludeTags;
	});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);