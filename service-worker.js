chrome.commands.onCommand.addListener(function (command) {
    switch (command) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
            barkTitle(command);
            break;
        default:
            console.log(`Command ${command} not found`);
    }
});

/**
* Gets the current active tab URL and opens a new tab with the same URL.
*/
function barkTitle(x) {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            tabTitle: x
        });
    });
}
