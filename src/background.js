chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message in background:", request);

  if (!request.action) {
    console.warn("Received message without 'action' field:", request);
    return true;
  }

  switch (request.action) {

    case "colorPicker_captureTab":
      debouncedCaptureTab(sender, sendResponse);
      break;
  default:
      console.warn("Unknown message action:", request.action);
  }
  return true; // Keeps the message channel open for asynchronous responses
});



let captureQueue = [];
let isProcessingQueue = false;
const CAPTURE_DELAY = 1000; // 1 second delay between captures

function debouncedCaptureTab(sender, sendResponse) {
  captureQueue.push({ sender, sendResponse });
  if (!isProcessingQueue) {
    processQueue();
  }
}

function processQueue() {
  isProcessingQueue = true;
  if (captureQueue.length === 0) {
    isProcessingQueue = false;
    return;
  }

  const { sender, sendResponse } = captureQueue.shift();
  chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
    sendResponse({ data: dataUrl });
    setTimeout(processQueue, CAPTURE_DELAY);
  });
}


chrome.commands.onCommand.addListener((command) => {
  if (command === "activate_color_picker") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "toggleColorPicker"});
      }
    });
  }
});