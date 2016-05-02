// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, { file: "js/main.js" });
    //console.log(chrome.runtime.lastError);
  });
