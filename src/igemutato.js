var Szentiras = (function () {

    var config = {
        // IGEMUTATÓ
        // fordítás
        forditas: 'SZIT',
        // formázás engedélyezése
        enableFormatting: true,
        // számok megjelenítése
        showNumbers: false
    },

        regexp = /(?:^|[^\w\u00C0-\u017F])((?:[12](?:K(?:[io]r|rón)|Makk?|Pé?t(?:er)?|Sám|T(?:h?essz?|im))|[1-3]Já?n(?:os)?|[1-5]Móz(?:es)?|(?:Ap)?Csel|A(?:gg?|bd)|Ám(?:ós)?|B(?:ár|[ií]r(?:ák)?|ölcs)|Dán|É(?:sa|zs|n(?:ek(?:ek|Én)?)?)|E(?:f(?:éz)?|szt?|z(?:s?dr?)?)|Fil(?:em)?|Gal|H(?:a[bg]|ós)|Iz|J(?:ak|á?n(?:os)?|e[lr]|o(?:el)?|ó(?:[bn]|zs|el)|[Ss]ir(?:alm?)?|úd(?:ás)?|ud(?:it)?)|K(?:iv|ol)|L(?:ev|u?k(?:ács)?)|M(?:al(?:ak)?|á?té?|(?:ár)?k|ik|Törv)|N[áe]h|(?:Ó|O)z|P(?:él|ré)d|R(?:óm|[uú]th?)|S(?:ir(?:alm?)?|ír|z?of|zám)|T(?:er|it|ób)|Z(?:ak|of|s(?:olt|id)?))\.?(?:\s*[0-9]{1,3}(?:[,:]\s*[0-9]{1,2}[a-z]?(?:\s*[-–—]\s*[0-9]{1,2}[a-z]?\b(?![,:]))?(?:\.\s*[0-9]{1,2}[a-z]?(?:\s*[-–—]\s*[0-9]{1,2}[a-z]?\b(?![,:]))?)*)?(?:\s*[-–—]\s*[0-9]{1,3}(?:[,:]\s*[0-9]{1,2}[a-z]?(?:\s*[-–—]\s*[0-9]{1,2}[a-z]?\b(?![,:]))?(?:\.\s*[0-9]{1,2}[a-z]?(?:\s*[-–—]\s*[0-9]{1,2}[a-z]?\b(?![,:]))?)*)?)?(?:\s*[\|;]\s*[0-9]{1,3}(?:[,:]\s*[0-9]{1,2}[a-z]?(?:\s*[-–—]\s*[0-9]{1,2}[a-z]?\b(?![,:]))?(?:\.\s*[0-9]{1,2}[a-z]?(?:\s*[-–—]\s*[0-9]{1,2}[a-z]?\b(?![,:]))?)*)?(?:\s*[-–—]\s*[0-9]{1,3}(?:[,:]\s*[0-9]{1,2}[a-z]?(?:\s*[-–—]\s*[0-9]{1,2}[a-z]?\b(?![,:]))?(?:\.\s*[0-9]{1,2}[a-z]?(?:\s*[-–—]\s*[0-9]{1,2}[a-z]?\b(?![,:]))?)*)?)?)*))(?:(?=[^\w\u00C0-\u017F])|$)/g,
        forditasok = ['KNB', 'SZIT', 'KG', 'UF', 'RUF', 'BD', 'STL'],
        // API URL
        url = (window.location.protocol === 'https:' ? 'https:' : 'http:') + '//szentiras.hu/',
        api = url + 'api/idezet/',
        // tooltip elemei
        forditasSelect,
        // aktuális adatok
        forditas, igehely,
        // DOM elemek
        d = document,
        rt = window.RefTip();

    function getFullUrl(ref) {
        return url + forditas + '/' + ref;
    }

    function getCacheKey(currentRef) {
        return forditas + '_' + currentRef;
    }

    function getApiUrl(currentRef) {
        return api + currentRef + '/' + forditas;
    }

    // Feldolgozza a JSON választ
    function show(json, container) {
        try {
            if (json && json.error) {
                setText(container, json.error);
                return null;
            }
            else if (json && json.valasz) {
                if (json.valasz.hiba) {
                    setText(container, json.valasz.hiba);
                    return null;
                }
                else if (json.valasz.versek) {
                    if (json.valasz.versek.length) {
                        var versek = json.valasz.versek;
                        addContent(versek, container);
                        container.scrollTop = 0;
                        return json;
                    }
                    else {
                        setText(container, 'Nem található a kért szöveg, talán egy másik fordításban?');
                        return null;
                    }
                }
            }
        }
        catch (ex) {
            console && console.log && console.log(ex.message);
        }
        setText(container, 'Valami baj van a szöveggel...');
        return null;
    }

    function addContent(versek, container) {
        var domParser = new DOMParser(), i, html, fejezetElem, vers, szamElem, fejezet = 0, szamok;

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        for (i = 0; i < versek.length; i++) {
            vers = versek[i].szoveg.trim();
            if (config.showNumbers) {
                szamok = versszam(versek[i]);
                if (szamok.fejezet !== fejezet) {
                    fejezetElem = d.createElement('span'), fejezetElem.className = 'konyv', setText(fejezetElem, szamok.fejezet);
                    container.appendChild(fejezetElem), container.appendChild(d.createTextNode(' '));
                    fejezet = szamok.fejezet;
                }
                szamElem = d.createElement('sup'), setText(szamElem, szamok.vers);
                container.appendChild(szamElem);
            }
            if (config.enableFormatting) {
                html = domParser.parseFromString(vers, 'text/html');
                if (html.body && html.body.firstChild && html.body.firstChild.nodeName !== "parserError") {
                    addElements(container, html.body.childNodes);
                }
            }
            else {
                container.appendChild(d.createTextNode((vers.replace(/<[^>]+>/g, ' ') + ' ').replace(/\s+/g, ' ')));
            }
        }
    }

    function versszam(vers) {
        var kod = vers.hely.gepi.toString();
        return {
            fejezet: parseInt(kod.substring(3, 6), 10),
            vers: parseInt(kod.substring(6, 9), 10)
        };
    }

    function setText(element, text) {
        element.textContent = text;
    }

    function customizeTooltip(toolTip) {
        var footer = toolTip.getElementsByClassName("igemutato-igehely")[0];
        var source = footer.getElementsByTagName("div")[0],
            igehely = source.getElementsByTagName("a")[0];
        forditasSelect = d.createElement('select');
        for (var i = 0; i < forditasok.length; i++) {
            option = d.createElement('option');
            option.value = forditasok[i];
            setText(option, forditasok[i]);
            if (forditas === forditasok[i]) {
                option.selected = true;
            }
            forditasSelect.appendChild(option);
        }
        forditasSelect.onchange = function () {
            forditas = forditasSelect.value;
            igehely.href = url + forditas + '/' + rt.getCurrentRef();
            rt.load();
        };

        footer.insertBefore(forditasSelect, source);
    }

    function setConfig(options) {
        for (key in options) {
            if (config.hasOwnProperty(key))
                config[key] = options[key];
        }

        rt.setConfig(options);
    }

    function start(element) {
        forditas = config.forditas;

        rt.setConfig({
            tooltipId: "igemutato-tooltip",
            refLinkClass: " ige-link",
            textBoxClass: "igemutato-szoveg",
            footerClass: "igemutato-igehely",

            sourceUrl: url,
            sourceTitle: 'szentiras.hu »',

            loadingMessage: "Betöltés...",
            loadingFailedMessage: 'A betöltés sikertelen :-('
        });
        rt.showContent = show;
        rt.customizeTooltip = customizeTooltip;
        rt.getFullUrl = getFullUrl;
        rt.getCacheKey = getCacheKey;
        rt.getApiUrl = getApiUrl;

        rt.process(element, regexp);
    }

    return {
        setConfig: setConfig,
        start: start
    };
})();