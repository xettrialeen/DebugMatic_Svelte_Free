console.log('Content script loaded');

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'incrementCount') {
    console.log(`Button clicked! Count is now: ${message.count}`);
  }
});
