console.log(
  "Vision script loaded"
);

async function captureAndSendScreenshot() {

  try {

    chrome.runtime.sendMessage(
      {
        action: "capture_screenshot"
      }
    );

  }

  catch (error) {

    console.error(
      "Vision error:",
      error
    );
  }
}

captureAndSendScreenshot();