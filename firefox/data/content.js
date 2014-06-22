self.port.on("prefs", function(prefs){
	Szentiras.setConfig(prefs);
	Szentiras.start(document.body);	
});