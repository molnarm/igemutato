// indexof: http://stackoverflow.com/a/3629211/318508
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

// trim: http://stackoverflow.com/a/498995/318508
if (!String.prototype.trim) {
    (function () {
        // Make sure we trim BOM and NBSP
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function () {
            return this.replace(rtrim, '');
        };
    })();
}

// textContent: https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#Polyfill_for_IE8
if (Object.defineProperty
    && Object.getOwnPropertyDescriptor
    && Object.getOwnPropertyDescriptor(Element.prototype, "textContent")
    && !Object.getOwnPropertyDescriptor(Element.prototype, "textContent").get) {
    (function () {
        var innerText = Object.getOwnPropertyDescriptor(Element.prototype, "innerText");
        Object.defineProperty(Element.prototype, "textContent",
            {
                get: function () {
                    return innerText.get.call(this);
                },
                set: function (s) {
                    return innerText.set.call(this, s);
                }
            }
        );
    })();
}