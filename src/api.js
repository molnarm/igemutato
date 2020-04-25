var Szentiras_API = function(){
    // lekérdezések kellékei
    var xmlhttp;

    // https://www.html5rocks.com/en/tutorials/cors/
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