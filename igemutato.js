var Szentiras = (function () {

    var config = {
        // fordítás
        forditas: 'SZIT',
        // tooltip szélesség
        tipW: 300,
        // tooltip magasság
        tipH: 200,
        // betűméret,
        fontSize: 16,
        // tooltip távolsága a szövegtől / képenyő szélétől
        tipD: 5,
        // tooltip megjelenítési késleltetés
        tipShow: 200,
        // tooltip elrejtési késleltetés
        tipHide: 500,
        // kizárt tagek
        excludeTags: "head,script,input,select,textarea,h1,h2,h3,a",
        // formázás engedélyezése
        enableFormatting: true,
        // számok megjelenítése
        showNumbers: false
    },

    regexp = /(?:^|[^\w\u00C0-\u017F])((?:[12](?:K(?:[io]r|rón)|Makk?|Pé?t(?:er)?|Sám|T(?:h?essz?|im))|[1-3]Já?n(?:os)?|[1-5]Móz(?:es)?|(?:Ap)?Csel|A(?:gg?|bd)|Ám(?:ós)?|B(?:ár|[ií]r(?:ák)?|ölcs)|Dán|É(?:sa|zs|n(?:ek(?:ek|Én)?)?)|E(?:f(?:éz)?|szt?|z(?:s?dr?)?)|Fil(?:em)?|Gal|H(?:a[bg]|ós)|Iz|J(?:ak|á?n(?:os)?|e[lr]|o(?:el)?|ó(?:[bn]|zs|el)|[Ss]ir(?:alm?)?|úd(?:ás)?|ud(?:it)?)|K(?:iv|ol)|L(?:ev|u?k(?:ács)?)|M(?:al(?:ak)?|á?té?|(?:ár)?k|ik|Törv)|N[áe]h|(?:Ó|O)z|P(?:él|ré)d|R(?:óm|[uú]th?)|S(?:ir(?:alm?)?|ír|z?of|zám)|T(?:er|it|ób)|Z(?:ak|of|s(?:olt|id)?))\.?(?:\s*[0-9]{1,3}(?:[,:]\s*[0-9]{1,2}[a-z]?(?:\s*[-–—]\s*[0-9]{1,2}[a-z]?\b(?![,:]))?(?:\.\s*[0-9]{1,2}[a-z]?(?:\s*[-–—]\s*[0-9]{1,2}[a-z]?\b(?![,:]))?)*)?(?:\s*[-–—]\s*[0-9]{1,3}(?:[,:]\s*[0-9]{1,2}[a-z]?(?:\s*[-–—]\s*[0-9]{1,2}[a-z]?\b(?![,:]))?(?:\.\s*[0-9]{1,2}[a-z]?(?:\s*[-–—]\s*[0-9]{1,2}[a-z]?\b(?![,:]))?)*)?)?(?:\s*[\|;]\s*[0-9]{1,3}(?:[,:]\s*[0-9]{1,2}[a-z]?(?:\s*[-–—]\s*[0-9]{1,2}[a-z]?\b(?![,:]))?(?:\.\s*[0-9]{1,2}[a-z]?(?:\s*[-–—]\s*[0-9]{1,2}[a-z]?\b(?![,:]))?)*)?(?:\s*[-–—]\s*[0-9]{1,3}(?:[,:]\s*[0-9]{1,2}[a-z]?(?:\s*[-–—]\s*[0-9]{1,2}[a-z]?\b(?![,:]))?(?:\.\s*[0-9]{1,2}[a-z]?(?:\s*[-–—]\s*[0-9]{1,2}[a-z]?\b(?![,:]))?)*)?)?)*))(?:(?=[^\w\u00C0-\u017F])|$)/g,
    forditasok = [ 'KNB', 'SZIT', 'KG', 'UF', 'RUF', 'BD' ],
        // API URL
        url = '//szentiras.hu/',
        api = url + 'api/idezet/',
        // tooltip elemei
        tooltip, szoveg, igehely, forditasSelect,
        // timeoutok
        linkTimeout, tipTimeout,
        // lekérdezések kellékei
        xmlhttp, cache = {},
        // aktuális adatok
        forditas, ige,
        // DOM elemek
        d = document, b = d.body, e = d.documentElement,
        // kizárt elemek
        excludes,
        // facepalm
        ie8;

    // #if !CHROME
    // #if !FIREFOX
    // IE8 indexof: http://stackoverflow.com/a/3629211/318508
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elt) {
            var len = this.length >>> 0, from = 0;
            for (; from < len; from++) {
                if (from in this && this[from] === elt)
                    return from;
            }
            return -1;
        };
    }
    // #endif !FIREFOX
    // #endif !CHROME

    // Megkeresi a hivatkozásokat az oldalban
    // (valaha ez volt a [hibás] kiindulás: http://stackoverflow.com/a/2848304/318508)
    function keres(node) {
        var match, next, parent, replacementNode, text, left;

        if (node = (node && node.firstChild))
            do {
                next = node.nextSibling;
                parent = node.parentNode;
                if (node.nodeType === 1 && excludes.indexOf(node.nodeName.toLowerCase()) == -1) {
                    keres(node);
                }
                else if (node.nodeType === 3) {
                    text = node.data;

                    while (match = regexp.exec(text)) {
                        left = RegExp.leftContext, text = RegExp.rightContext, replacementNode = csere(match);

                        if (!replacementNode)
                            continue;

                        parent.insertBefore(d.createTextNode(left), parent.insertBefore(replacementNode, node));

                        regexp.lastIndex = 0;
                    }
                    parent.replaceChild(d.createTextNode(text), node);
                }
            }
            while (node = next)
    }

    // A hivatkozásokat linkekre cseréli
    function csere(match) {
        var a = d.createElement('a'),
        ref = encodeURI(match[1].replace(/\s/g, ""));
        
        a.className += ' ige-link';
        // Az oldalba az eredeti szöveget tesszük vissza
        a.appendChild(d.createTextNode(match[0]));
        // A tooltipen csak a hivatkozás lesz rajta
        a.setAttribute("data-ige", match[1]);
        // Betöltéshez az URL formát használjuk
        a.setAttribute("data-ref", ref);
        
        a.target = '_blank';
        a.href = url + forditas + '/' + ref;

        a.onmouseover = function(event) {
            // ha rámutatunk egy hivatkozásra, akkor új tooltipet jelenítünk meg
            clearTimeout(linkTimeout);
            clearTimeout(tipTimeout);
            hideTooltip();
            fillTooltip(a);
            linkTimeout = setTimeout(function() {
                tooltip.style.display = 'block';
                szoveg.scrollTop = 0;
            }, config.tipShow);
        };
        a.onmouseout = function() {
            // ha elvisszük az egeret a hivatkozásról, akkor elrejtjük a tooltipet
            clearTimeout(linkTimeout);
            if (tooltip) {
                clearTimeout(tipTimeout);
                tipTimeout = setTimeout(function() {
                    hideTooltip();
                }, config.tipHide);
            }
        };
        return a;
    }

    // http://www.html5rocks.com/en/tutorials/cors/
    function createCORSRequest(method, target) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            xhr.open(method, target, true);
        }
        else if (typeof XDomainRequest != "undefined") {
            xhr = new XDomainRequest();
            xhr.open(method, target);
        }
        else {
            xhr = null;
        }
        return xhr;
    }

    // Betölti a hivatkozott szöveget
    function fetch() {
        xmlhttp && xmlhttp.abort();

        if (cache[forditas] && cache[forditas][ige]) {
            // #if FIREFOX
            addContent(cache[forditas][ige]);
            // #endif FIREFOX
            // #if !FIREFOX
            szoveg.innerHTML = cache[forditas][ige];
            // #endif !FIREFOX
            szoveg.scrollTop = 0;
            return;
        }

        var src = api + ige + '/' + forditas,
            success = function () {
                try {
                    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                        show(JSON.parse(xmlhttp.responseText));
                        return;
                    }
                }
                catch (ex) {
                    console && console.log && console.log(ex.message);
                }
                if (xmlhttp.readyState !== 0) {
                    szoveg.textContent = 'A betöltés sikertelen :-(';
                }
            };

        xmlhttp = createCORSRequest('GET', src);

        xmlhttp.onreadystatechange = success;

        xmlhttp.send();
    }

    // Feldolgozza a JSON választ
    function show(json) {
        try {
            if (json && json.error) {
                setText(szoveg, json.error);
            }
            else if (json && json.valasz) {
                if (json.valasz.hiba) {
                    setText(szoveg, json.valasz.hiba);
                }
                else if (json.valasz.versek) {
                    if(json.valasz.versek.length) {				
                    var versek = json.valasz.versek;
                    // #if FIREFOX
                    addContent(versek);
                    cache[forditas] || (cache[forditas] = {});
                    cache[forditas][ige] = versek;
                    // #endif FIREFOX
                    // #if !FIREFOX
                    var result = '', vers, fejezet = 0, szamok;
                    for (var i = 0; i < versek.length; i++) {
                        vers = versek[i].szoveg;
                        if (!ie8) vers = vers.trim(); // :-(
                        if (!config.enableFormatting)
                            vers = vers.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
                        if (config.showNumbers) {
                            szamok = versszam(versek[i]);
                            vers = '<sup>' + szamok.vers + '</sup>' + vers;
                            if (szamok.fejezet != fejezet) {
                                vers = '<span class="konyv">' + szamok.fejezet + '</span>&nbsp;' + vers;
                                fejezet = szamok.fejezet;
                            }
                        }
                        result += vers + ' ';
                    }
                    szoveg.innerHTML = result;
    
                    cache[forditas] || (cache[forditas] = {});
                    cache[forditas][ige] = result;
                    // #endif !FIREFOX
                    szoveg.scrollTop = 0;
                    return;
                }
                    else{
                        setText(szoveg, 'Nem található a kért szöveg, talán egy másik fordításban?');
                        return;
                    }
                }
            }
        }
        catch (ex) {
            console && console.log && console.log(ex.message);
        }
        setText(szoveg, 'Valami baj van a szöveggel...');
    }

    // #if FIREFOX
    function addContent(versek) {
        var domParser = new DOMParser(), i, html, fejezetElem, vers, szamElem, fejezet = 0, szamok;

        while (szoveg.firstChild) {
            szoveg.removeChild(szoveg.firstChild);
        }
        for (i = 0; i < versek.length; i++) {
            vers = versek[i].szoveg.trim();
            if (config.showNumbers) {
                szamok = versszam(versek[i]);
                if (szamok.fejezet != fejezet) {
                    fejezetElem = d.createElement('span'), fejezetElem.className = 'konyv', setText(fejezetElem, szamok.fejezet);
                    szoveg.appendChild(fejezetElem), szoveg.appendChild(d.createTextNode(' '));
                    fejezet = szamok.fejezet;
                }
                szamElem = d.createElement('sup'), setText(szamElem, szamok.vers);
                szoveg.appendChild(szamElem);
            }
            if (config.enableFormatting) {
                html = domParser.parseFromString(vers, 'text/html');
                if (html.body && html.body.firstChild && html.body.firstChild.nodeName != "parserError") {
                    addElements(szoveg, html.body.childNodes);
                }
            }
            else {
                szoveg.appendChild(d.createTextNode((vers.replace(/<[^>]+>/g, ' ') + ' ').replace(/\s+/g, ' ')));
            }
        }
    }

    function addElements(root, nodes) {
        var whitelist = /br|i|em|u|b|strong|center|span|sup/i, node, next;

        node = nodes[0];
        do {
            next = node.nextSibling;
            if (node.nodeType == 3) {
                node.textContent += ' ';
                root.appendChild(node);
            }
            else if (whitelist.test(node.nodeName)) {
                if (node.childNodes.length > 0) {
                    addElements(node, node.childNodes);
                }
                root.appendChild(node);
            }
        }
        while (node = next);
    }
    // #endif FIREFOX

    function versszam(vers) {
        var kod = vers.hely.gepi.toString();
        return {
            fejezet: parseInt(kod.substring(3, 6), 10),
            vers: parseInt(kod.substring(6, 9), 10)
        };
    }

    function setText(element, text) {
        // #if !FIREFOX
        // #if !CHROME
        if (ie8) {
            element.innerText = text;
        }
        else {
            // #endif !CHROME
            // #endif !FIREFOX
            element.textContent = text;
            // #if !FIREFOX
            // #if !CHROME
        }
        // #endif !CHROME
        // #endif !FIREFOX
    }

    function createTooltip() {
        var footer, left, forras, span, option;

        tooltip = d.createElement('div'),
            szoveg = d.createElement('div'), szoveg.className += 'szoveg', tooltip.appendChild(szoveg),
            footer = d.createElement('div'), footer.className += 'igehely', tooltip.appendChild(footer);

        tooltip.id = "igemutato-tooltip";
        // amíg a tooltipen van az egér, addig marad megjelenítve
        tooltip.onmouseover = function () {
            clearTimeout(tipTimeout);
        };
        // ha elvisszük róla az egeret, akkor elrejtjük
        tooltip.onmouseout = function (event) {
            clearTimeout(tipTimeout);
            tipTimeout = setTimeout(function () {
                hideTooltip();
            }, config.tipHide);
        };

        szoveg.style.fontSize = config.fontSize + "px";
        szoveg.style.height = (config.tipH - 30) + "px";

        left = d.createElement('div');
        igehely = d.createElement('a'), igehely.target = '_blank', left.appendChild(igehely);

        forditasSelect = d.createElement('select');
        for (var i = 0; i < forditasok.length; i++) {
            option = d.createElement('option');
            option.value = forditasok[i];
            setText(option, forditasok[i]);
            if (forditas == forditasok[i]) {
                option.selected = true;
            }
            forditasSelect.appendChild(option);
        }
        forditasSelect.onchange = function () {
            forditas = forditasSelect.value;
            igehely.href = url + forditas + '/' + ige;
            fetch();
        };

        forras = d.createElement('a'), forras.href = url, forras.target = '_blank', setText(forras, 'szentiras.hu »');
        span = d.createElement('span'), span.appendChild(forras);

        footer.appendChild(span);
        footer.appendChild(forditasSelect);
        footer.appendChild(left);

        tooltip.style.display = 'none';
        b.appendChild(tooltip);
    }

    // jQuery.offset() kibelezve
    function calculateOffset(elem) {
        var box = elem.getBoundingClientRect();
        return {
            top: box.top + (window.pageYOffset || e.scrollTop || b.scrollTop) - e.clientTop,
            left: box.left + (window.pageXOffset || e.scrollLeft || b.scrollLeft) - e.clientLeft
        };
    }

    function fillTooltip(a) {
        var hivatkozas = a.getAttribute("data-ige"),
        hivatkozasUrl = a.getAttribute("data-ref"),
            position = a.getBoundingClientRect(),
            offset = calculateOffset(a),
            screenW = b.clientWidth || window.innerWidth,
            triggerH = a.offsetHeight;

        igehely.href = a.href;
        setText(igehely, hivatkozas);

        setText(szoveg, "Betöltés...");

        ige = hivatkozasUrl;
        fetch();

        // ha a tooltip nem lóg ki az ablak tetején, akkor az elem fölé kerül, egyébként alá
        tooltip.style.top = ((position.top > config.tipH + config.tipD) ? (offset.top - config.tipH - config.tipD) : (offset.top + triggerH + config.tipD)) + "px";
        // ha a tooltip kilógna jobb oldalt, akkor úgy helyezzük el, hogy még pont elférjen, egyébként az elem fölé
        tooltip.style.left = ((offset.left + config.tipW > screenW) ? (screenW - config.tipW - config.tipD) : offset.left) + "px";
        tooltip.style.width = config.tipW + "px";
        tooltip.style.height = config.tipH + "px";
    }

    function hideTooltip() {
        tooltip.style.display = 'none';
        ige = null;
    }

    function setConfig(options) {
        var data = config;
        for (key in options) {
            data[key] = options[key];
        }
        // #if !FIREFOX
        // #if !CHROME
        // a bővítményekben már eleve van ellenőrzés
        var tipW = parseInt(data.tipW),
            tipH = parseInt(data.tipH),
            fontSize = parseInt(data.fontSize),
            tipShow = parseInt(data.tipShow),
            tipHide = parseInt(data.tipHide),
            forditas = data.forditas;

        data.tipW = (isNaN(tipW) || tipW < 100) ? config.tipW : tipW;
        data.tipH = (isNaN(tipH) || tipW < 50) ? config.tipH : tipH;
        data.fontSize = (isNaN(fontSize) || fontSize < 5) ? config.fontSize : fontSize;
        data.tipShow = (isNaN(tipShow) || tipShow < 0) ? config.tipShow : tipShow;
        data.tipHide = (isNaN(tipHide) || tipHide < 0) ? config.tipHide : tipHide;
        data.forditas = (forditasok.indexOf(forditas) == -1) ? config.forditas : forditas;
        data.excludeTags = data.excludeTags || config.excludeTags;
        data.enableFormatting = (data.enableFormatting === undefined) ? config.enableFormatting : data.enableFormatting;
        data.showNumbers = (data.showNumbers === undefined) ? config.showNumbers : data.showNumbers;
        // #endif !CHROME
        // #endif !FIREFOX
        config = data;
    }

    function start(element) {
        // #if !WORDPRESS
        // #if !EMBEDDED
        if (d.getElementById('igemutato-script'))
            return;
        // #endif !EMBEDDED
        var css = d.createElement("link");
        css.setAttribute("rel", "stylesheet");
        css.setAttribute("type", "text/css");
        // #if CHROME
        css.setAttribute("href", chrome.extension.getURL('igemutato.min.css'));
        // #endif CHROME
        // #if FIREFOX
        css.setAttribute("href", config.firefoxCSS);
        // #endif FIREFOX
        // #if EMBEDDED
        css.setAttribute("href", 'http://molnarm.github.io/igemutato.min.css');
        // #endif EMBEDDED
        d.getElementsByTagName("head")[0].appendChild(css);
        // #endif !WORDPRESS
        // IE8: http://stackoverflow.com/a/10965073/318508
        ie8 = (window.attachEvent && !window.addEventListener);
        forditas = config.forditas;
        excludes = config.excludeTags.split(',');
        createTooltip();
        keres(element);
    }

    return {
        setConfig: setConfig,
        start: start
    };
})();
// #if !CHROME
// #if !FIREFOX
window.igemutato && window.igemutato.config && Szentiras.setConfig(window.igemutato.config);
Szentiras.start(document.body);
// #endif !CHROME
// #endif !FIREFOX
