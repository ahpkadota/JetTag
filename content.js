chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        let a = document.getElementsByClassName("semi-descriptions-key");
        let b = [];
        let c = document.getElementsByClassName("semi-tag-content");
        let d = [];
        for (let i=0;i<a.length;i++) {
            if (a[i].firstChild.innerHTML == "selectedPolicyCode") {
                b.push(a[i].parentElement.nextSibling.firstChild.innerHTML);
            }
        }
        for (let j=0;j<c.length;j++) {
            d.push(c[j].innerText)
        }
        if (b.length > 0)
            sendResponse({farewell: b.map(x=>x.split(",")).flat(), fair: d.join("")});
});


