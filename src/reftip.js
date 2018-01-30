var RefTip = function () {
    var config = {
        // SIZES

        // Width of tooltip
        tipW: 300,
        // Height of tooltip
        tipH: 200,
        // Font size in tooltip
        fontSize: 16,
        // Distance of tooltip from text / window edge
        tipD: 5,

        // TIMINGS

        // Delay when showing tooltip (ms)
        tipShow: 200,
        // Delay when hiding tooltip (ms)
        tipHide: 500,

        // PROCESSING

        // Tags to ignore when processing a node
        excludeTags: "head,script,input,select,textarea,h1,h2,h3,a",

        // STYLE

        tooltipId: "reftip",
        refLinkClass: " reftip-link",
        textBoxClass: "reftip-textBox",
        footerClass: "reftip-footer",

        // SOURCE
        sourceUrl: null,
        sourceTitle: null,

        // MESSAGES
        loadingMessage: "Loading...",
        loadingFailedMessage: "Loading failed."
    },
        tooltip, textBox, refLabel,
        linkTimeout, tipTimeout,
        xmlhttp, cache = {},
        currentRef,
        d = document, b = d.body, e = d.documentElement;

    /**
     * Sets configuration options
     * @param {any} options New configuration options
     */
    function setConfig(options) {
        for (key in options) {
            if (config.hasOwnProperty(key))
                config[key] = options[key];
        }
    }

    /**
     * Finds text nodes matching the given regexp and calls the replacer function on them
     * (initially based on http://stackoverflow.com/a/2848304/318508)
     * @param {any} node Root of the subtree to be processed
     * @param {any} regexp Regular expression that identifies text to be replaced
     * @param {any} replace Function to execute on matches (match=>DOM element)
     * @param {any} excludes List of HTML tags to ignore
     */
    function process(node, regexp) {
        var match, next, parent, replacementNode, text, left,
            excludes = config.excludeTags.split(',');

        tooltip || createTooltip();

        if (node = (node && node.firstChild))
            do {
                next = node.nextSibling;
                parent = node.parentNode;
                if (node.nodeType === 1 && excludes.indexOf(node.nodeName.toLowerCase()) == -1) {
                    process(node, regexp, replace, excludes);
                }
                else if (node.nodeType === 3) {
                    text = node.data;

                    while (match = regexp.exec(text)) {
                        left = RegExp.leftContext, text = RegExp.rightContext, replacementNode = replace(match);

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

    function showContent(json, container) {
        container.textContent = json;
        container.scrollTop = 0;
    }

    function customizeTooltip(tooltip) {
    }

    function getCurrentRef() {
        return currentRef;
    }

    /*
     * Replaces matched text with link to referenced page
     * @param {any} match Regex match
     */
    function replace(match) {
        var a = d.createElement('a'),
            ref = encodeURI(match[1].replace(/\s/g, ""));

        a.className += config.refLinkClass;
        // Link text is the original
        a.appendChild(d.createTextNode(match[0]));
        // Show only relevant part in tooltip
        a.setAttribute("data-refTitle", match[1]);
        // Use URL form for loading
        a.setAttribute("data-refUrl", ref);

        a.target = '_blank';
        a.href = public.getFullUrl(ref);

        a.onmouseover = function (event) {
            clearTimeout(linkTimeout);
            clearTimeout(tipTimeout);
            hideTooltip();
            fillTooltip(a);
            linkTimeout = setTimeout(function () {
                tooltip.style.display = 'block';
                textBox.scrollTop = 0;
            }, config.tipShow);
        };
        a.onmouseout = function () {
            clearTimeout(linkTimeout);
            if (tooltip) {
                clearTimeout(tipTimeout);
                tipTimeout = setTimeout(function () {
                    hideTooltip();
                }, config.tipHide);
            }
        };
        return a;
    }

    function fillTooltip(a) {
        var refTitle = a.getAttribute("data-refTitle"),
            refUrl = a.getAttribute("data-refUrl"),
            position = a.getBoundingClientRect(),
            offset = calculateOffset(a),
            screenW = b.clientWidth || window.innerWidth,
            triggerH = a.offsetHeight;

        refLabel.href = a.href;
        refLabel.textContent = refTitle;

        textBox.textContent = config.loadingMessage;

        currentRef = refUrl;
        load();

        // If there is enough space above the link, show the tooltip there; otherwise show it below
        tooltip.style.top = ((position.top > config.tipH + config.tipD) ? (offset.top - config.tipH - config.tipD) : (offset.top + triggerH + config.tipD)) + "px";
        // If there is enough space to the right, show the tooltip right above the element; otherwise aligned to the right edge of the window
        tooltip.style.left = ((offset.left + config.tipW > screenW) ? (screenW - config.tipW - config.tipD) : offset.left) + "px";
        tooltip.style.width = config.tipW + "px";
        tooltip.style.height = config.tipH + "px";
    }

    // Betölti a hivatkozott szöveget
    function load() {
        xmlhttp && xmlhttp.abort();

        var cacheKey = public.getCacheKey(currentRef);
        if (cache[cacheKey]) {
            public.showContent(cache[cacheKey], textBox);
            return;
        }

        var src = public.getApiUrl(currentRef),
            success = function () {
                try {
                    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                        var cached = public.showContent(JSON.parse(xmlhttp.responseText), textBox);
                        if (cached)
                            cache[cacheKey] = cached;
                        return;
                    }
                }
                catch (ex) {
                    console && console.log && console.log(ex.message);
                }
                if (xmlhttp.readyState !== 0) {
                    textBox.textContent = config.loadFailedMessage;
                }
            };

        xmlhttp = createCORSRequest('GET', src);

        xmlhttp.onreadystatechange = success;

        xmlhttp.send();
    }

    function createTooltip() {
        var footer, left, source, span, option;

        tooltip = d.createElement('div'),
            textBox = d.createElement('div'), textBox.className += config.textBoxClass, tooltip.appendChild(textBox),
            footer = d.createElement('div'), footer.className += config.footerClass, tooltip.appendChild(footer);

        tooltip.id = config.tooltipId;
        tooltip.onmouseover = function () {
            clearTimeout(tipTimeout);
        };
        tooltip.onmouseout = function (event) {
            var e = event.toElement || event.relatedTarget;
            if (!e) return;

            clearTimeout(tipTimeout);
            tipTimeout = setTimeout(function () {
                hideTooltip();
            }, config.tipHide);
        };

        textBox.style.fontSize = config.fontSize + "px";
        textBox.style.height = (config.tipH - 30) + "px";

        left = d.createElement('div');
        refLabel = d.createElement('a'), refLabel.target = '_blank', left.appendChild(refLabel);

        source = d.createElement('a'), source.href = config.sourceUrl, source.target = '_blank', source.textContent = config.sourceTitle;
        span = d.createElement('span'), span.appendChild(source);

        footer.appendChild(span);
        footer.appendChild(left);

        public.customizeTooltip(tooltip);

        tooltip.style.display = 'none';
        b.appendChild(tooltip);
    }

    function hideTooltip() {
        tooltip.style.display = 'none';
        currentRef = null;
    }

    // Based on jQuery.offset()
    function calculateOffset(elem) {
        var box = elem.getBoundingClientRect();
        return {
            top: box.top + (window.pageYOffset || e.scrollTop || b.scrollTop) - e.clientTop,
            left: box.left + (window.pageXOffset || e.scrollLeft || b.scrollLeft) - e.clientLeft
        };
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

    // this is way too complicated now
    var public = {
        setConfig: setConfig,
        process: process,
        load: load,
        getCurrentRef: getCurrentRef,

        // these can be overridden
        showContent: showContent, // text, textBox => show the contents
        customizeTooltip: customizeTooltip,

        // these need to be defined
        getApiUrl: null, // reference => URL to JSON API
        getFullUrl: null, // reference => URL to readable page
        getCacheKey: null, // reference => cache key
    };

    return public;
};