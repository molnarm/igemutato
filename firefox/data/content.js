self.port.on("prefs", function(prefs){
	Szentiras.setConfig(prefs);
	Szentiras.keres(document.body);	
});