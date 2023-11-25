let extensionEnabled = true;

updateBadge(false);

// Retrieve the extension status from storage
chrome.storage.local.get('extensionEnabled', ({ extensionEnabled: storedExtensionEnabled }) => {
  if (storedExtensionEnabled !== undefined) {
    extensionEnabled = storedExtensionEnabled;
  }
  updateBadge(false);
});

// Initialize the initial state of the DOM if not set in storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('extensionEnabled', ({ extensionEnabled: storedExtensionEnabled }) => {
    if (storedExtensionEnabled === undefined) {
      chrome.storage.local.set({ extensionEnabled });
      updateBadge(false);
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleExtension') {
    extensionEnabled = !extensionEnabled;
    updateBadge(true);
    // sendResponse({ extensionEnabled });
  }
});

function updateBadge(sendMessage) {
  const badgeText = extensionEnabled ? 'ON' : 'OFF';
  const badgeColor = extensionEnabled ? '#00FF00' : '#FF0000';

  chrome.action.setBadgeText({ text: badgeText });
  chrome.action.setBadgeBackgroundColor({ color: badgeColor });
  chrome.storage.local.set({ extensionEnabled });

  if (sendMessage) {

    // chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    //   console.log(tabs);
    //   if (tabs[0].url.match('https://meet.google.com/*')) {
    //     // Send a message to other parts of the extension to update their state if necessary
    //       chrome.runtime.sendMessage({ action: 'toggleExtension'});
    //   }
    // });
  }
}