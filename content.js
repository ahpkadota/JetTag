chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting === "hello") {
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
    }
});



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.tabTitle > 0) {
        chrome.storage.local.get(['lol'], function(result) {
            let val = document.activeElement.value
            let start = document.activeElement.selectionStart;
            let end = document.activeElement.selectionEnd;
            let txt = result.lol[request.tabTitle-1];
            document.activeElement.value = val.substr(0,start) + txt + val.substr(end,val.length);
            document.activeElement.setSelectionRange(txt.length+start, txt.length+start)
            document.activeElement.dispatchEvent(new Event('input', {bubbles:true}));
        });
    } else if (request.tabTitle == 0) {
        let a = document.getElementsByClassName("semi-descriptions-key");
        let b = [];
        for (let i=0;i<a.length;i++) {
            if (a[i].firstChild.innerHTML == "selectedPolicyCode") {
                b.push(a[i].parentElement.nextSibling.firstChild.innerHTML);
            }
        }
        let c = b.map(x=>x.split(",")).flat();
        let d = c.filter(item => c.lastIndexOf(item) == c.indexOf(item))
        let titles = data.slice(0,data.length-2).map(x => x.children.map(y => y.id)).flat();
        let titles2 = data.slice(0,data.length-2).map(x => x.children.map(y => y.ft)).flat();
        let e = [];
        for (let i=0;i<titles.length;i++) {
            for (let j=0;j<d.length;j++) {
                if (d[j] == titles[i]) {
                    e.push(titles2[i])
                }
            }
        }
        let val = document.activeElement.value
        let start = document.activeElement.selectionStart;
        let end = document.activeElement.selectionEnd;
        let txt = e.join("\n")+"\nREASON:\n";
        document.activeElement.value = val.substr(0,start) + txt + val.substr(end,val.length);
        document.activeElement.setSelectionRange(txt.length+start, txt.length+start)
        document.activeElement.dispatchEvent(new Event('input', {bubbles:true}));
    }
});


let data = [];
chrome.storage.local.get(['key'], function(result) {
    data = JSON.parse(result.key);
});


