function save_options() {
	localStorage["tipH"] = document.getElementById("tipH").value;
	localStorage["tipW"] = document.getElementById("tipW").value;
	localStorage["tipShow"] = document.getElementById("tipShow").value;
	localStorage["tipHide"] = document.getElementById("tipHide").value;

	var status = document.getElementById("status");
	status.innerHTML = "Elmentettük a beállításokat.";
	setTimeout(function() {
		status.innerHTML = "";
	}, 1000);
}

function restore_options() {
	document.getElementById("tipH").value = localStorage["tipH"] || 200;
	document.getElementById("tipW").value = localStorage["tipW"] || 400;
	document.getElementById("tipShow").value = localStorage["tipShow"] || 200;
	document.getElementById("tipHide").value = localStorage["tipHide"] || 500;
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);