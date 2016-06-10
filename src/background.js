/****************
 * Content script to DevTools page communication
 * (code from https://developer.chrome.com/extensions/devtools#content-script-to-devtools)
 * ****************/

var connections = {}

chrome.runtime.onConnect.addListener((port) => {

  port.onMessage.addListener((message, sender, sendResponse) => {
    // The original connection event doesn't include the tab ID of the
    // DevTools page, so we need to send it explicitly.
    if (message.name === 'init') {
      connections[message.tabId] = port
      // Inject content script to the identified tab
      chrome.tabs.executeScript(message.tabId, {file: message.scriptToInject})
    }
  })

  port.onDisconnect.addListener((port) => {
    port.onMessage.removeListener(extensionListener)
    var tabs = Object.keys(connections)
    for (var i = 0, len = tabs.length; i < len; i++) {
      if (connections[tabs[i]] == port) {
        delete connections[tabs[i]]
        break
      }
    }
  })
})

// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Messages from content scripts should have sender.tab set
  if (sender.tab) {
    const tabId = sender.tab.id
    if (tabId in connections) {
      connections[tabId].postMessage(request)
    } else {
      console.error('Tab not found in connection list.')
    }
  } else {
    console.error('sender.tab not defined.')
  }
  return true
})
