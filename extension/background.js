function showBrowserNotification(
  prediction,
  confidence,
  url
) {

  let title =
    "PhishGuard";

  let message =
    `Website scanned successfully`;

  if (
    prediction === "suspicious"
  ) {

    title =
      "⚠ Suspicious Website";

    message =
      `${url}\nMay contain phishing threats.`;

  }

  else if (
    prediction === "malicious"
  ) {

    title =
      "🚨 Malicious Website";

    message =
      `${url}\nPotential phishing attack detected!`;

  }

  else {

    title =
      "✅ Safe Website";

    message =
      `${url}\nNo major threats detected.`;

  }

  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: title,
    message: message,
    priority: 2
  });

}

async function scanURL(url, tabId) {

  try {

    // Ignore browser internal pages
    if (
      url.startsWith("chrome://") ||
      url.startsWith("chrome-extension://") ||
      url.startsWith("edge://") ||
      url.startsWith("about:")
    ) {
      chrome.action.setBadgeText({
        text: ""
      });

      return;
    }

    const response = await fetch(
      "http://127.0.0.1:8000/scan-url",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: url
        })
      }
    );

    const data = await response.json();

    console.log("Scan Result:", data);

    const prediction = data.prediction;
    const confidence = data.confidence;

    showBrowserNotification(
      prediction,
      confidence,
      url
    );

    // =========================
    // BADGE COLORS
    // =========================

    if (prediction === "safe") {

      chrome.action.setBadgeText({
        text: "OK",
        tabId: tabId
      });

      chrome.action.setBadgeBackgroundColor({
        color: "#16a34a",
        tabId: tabId
      });

    }

    else if (prediction === "suspicious") {

      chrome.action.setBadgeText({
        text: "!",
        tabId: tabId
      });

      chrome.action.setBadgeBackgroundColor({
        color: "#eab308",
        tabId: tabId
      });

    }

    else {

      chrome.action.setBadgeText({
        text: "X",
        tabId: tabId
      });

      chrome.action.setBadgeBackgroundColor({
        color: "#dc2626",
        tabId: tabId
      });

    }

    // =========================
    // SEND TO CONTENT SCRIPT
    // =========================

    chrome.tabs.sendMessage(
      tabId,
      {
        prediction: prediction,
        confidence: confidence
      }
    );

  }

  catch (error) {

    console.error(
      "Background scan failed:",
      error
    );

  }
}

// =========================
// AUTO SCAN
// =========================

chrome.tabs.onUpdated.addListener(
  (tabId, changeInfo, tab) => {

    if (
      changeInfo.status === "complete" &&
      tab.url
    ) {

      scanURL(
        tab.url,
        tabId
      );

    }

  }
);