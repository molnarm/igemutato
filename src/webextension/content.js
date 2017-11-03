chrome.storage.sync.get('config', function(result) {
    if(result && result.config)	
        Szentiras.setConfig(result.config);

    if (document.getElementById('igemutato-script'))
        return;

    var css = document.createElement("link");
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("type", "text/css");
    css.setAttribute("href", chrome.extension.getURL('igemutato.css'));
    document.getElementsByTagName("head")[0].appendChild(css);

    Szentiras.start(document.body);
});
