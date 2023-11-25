let extensionStatus = true;

document.addEventListener('DOMContentLoaded', function () {
  const enableButton = document.querySelector('#enableButton');
  const disableButton = document.querySelector('#disableButton');

  // Retrieve the extension status from storage
  chrome.storage.local.get('extensionEnabled', ({ extensionEnabled }) => {
    if (extensionEnabled !== undefined) {
      extensionStatus = extensionEnabled;
    }
    updateButtonDisplay();
  });

  enableButton.addEventListener('click', function () {
    enableButton.style.display = 'none';
    disableButton.style.display = 'block';
    enableFunction();
    updateExtensionStatus();
  });

  disableButton.addEventListener('click', function () {
    disableButton.style.display = 'none';
    enableButton.style.display = 'block';
    disableFunction();
    updateExtensionStatus();
  });

  function enableFunction() {
    // Actions to be performed when the button is enabled
    console.log("Button is enabled.");
    extensionStatus = true;
  }

  function disableFunction() {
    // Actions to be performed when the button is disabled
    console.log("Button is disabled.");
    extensionStatus = false;
  }

  function updateButtonDisplay() {
    if (extensionStatus) {
      enableButton.style.display = 'none';
      disableButton.style.display = 'block';
    } else {
      disableButton.style.display = 'none';
      enableButton.style.display = 'block';
    }
  }

  function updateExtensionStatus() {
    chrome.storage.local.set({ 'extensionEnabled': extensionStatus });
    // Send a message to the background script to update the extension state there as well if necessary
    chrome.runtime.sendMessage({ action: 'toggleExtension' });
  }
});

