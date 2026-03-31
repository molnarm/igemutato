var Szentiras_API = function(){
    // lekérdezések kellékei
    var xmlhttp;
    // a böngészőben úgyis bárki meg tudja nézni a kulcsot
    var API_KEY = 'faeb977c-6be4-43f0-8241-7069eb62d20e';

    // https://www.html5rocks.com/en/tutorials/cors/
    function createCORSRequest(method, target) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            xhr.open(method, target, true);
            xhr.setRequestHeader('X-API-Key', API_KEY);
        }
        else if (typeof XDomainRequest != "undefined") {
            xhr = new XDomainRequest();
            xhr.open(method, target);
            xhr.setRequestHeader('X-API-Key', API_KEY);
        }
        else {
            xhr = null;
        }
        return xhr;
    }

    function request(api, ige, forditas, callback){
        xmlhttp && xmlhttp.abort();

        var src = api + ige + '/' + forditas,
            success = function () {
                try {
                    if (xmlhttp.readyState === 4) {
                        if( xmlhttp.status === 200) {
                            callback(JSON.parse(xmlhttp.responseText));
                            return;
                        }
                        else{
                            callback(null);
                        }
                    }
                }
                catch (ex) {
                    console && console.log && console.log(ex.message);
                }
            };

        xmlhttp = createCORSRequest('GET', src);
        xmlhttp.onreadystatechange = success;
        xmlhttp.send();
    }

    return {
        request: request
    };
}();