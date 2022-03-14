chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var asdfg = document.getElementsByClassName("semi-descriptions-value");
        if (asdfg.length > 0)
            sendResponse({farewell: Array.prototype.map.call(asdfg, function(x){return x.innerHTML}).join("")});
});