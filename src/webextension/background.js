chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.contentScriptQuery == "apiRequest") {
        Szentiras_API.request(request.api, request.ige, request.forditas, sendResponse);
        return true; 
      }
    });