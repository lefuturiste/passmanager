chrome.commands.onCommand.addListener((command) => {
    if (command === 'passmanager_load_page') {
        console.log('passmanager_load_page');
        chrome.tabs.executeScript({
            file: './content.js'
        });
    }
});

chrome.runtime.onInstalled.addListener(function() {
    console.log('hello')
    // chrome.contextMenus.create({
    //   "id": "sampleContextMenu",
    //   "title": "Sample Context Menu",
    //   "contexts": ["selection"]
    // });
  });
