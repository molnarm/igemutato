var css = document.createElement("link");
css.setAttribute("rel", "stylesheet");
css.setAttribute("type", "text/css");
css.setAttribute("href", 'http://molnarm.github.io/igemutato.min.css');
document.getElementsByTagName("head")[0].appendChild(css);

window.igemutato && window.igemutato.config && Szentiras.setConfig(window.igemutato.config);
Szentiras.start(document.body);