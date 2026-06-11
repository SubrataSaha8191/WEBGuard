console.log("WEBGuard content script loaded");

// REMOVE EXISTING OVERLAY

function removeExistingWarning() {
  const existing =document.getElementById("WEBGuard-warning-overlay");

  if (existing) {
    existing.remove();
  }
}

// REMOVE EXISTING TOAST

function removeExistingToast() {
  const existingToast = document.getElementById("WEBGuard-toast");

  if (existingToast) {
    existingToast.remove();
  }
}

// TOAST NOTIFICATION

function showToast(data) {
  removeExistingToast();

  const toast = document.createElement("div");
  toast.id = "WEBGuard-toast";

  let bgColor = "#16a34a";
  let title = "SAFE";
  let icon = "✓";

  // SUSPICIOUS
  if (data.prediction === "suspicious") {

    bgColor = "#eab308";
    title = "SUSPICIOUS";
    icon = "⚠";
  }

  // MALICIOUS
  else if (data.prediction === "malicious") {
    bgColor = "#dc2626";
    title = "MALICIOUS";
    icon = "✕";
  }

  toast.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999999;
      background: ${bgColor};
      color: white;
      padding: 18px;
      border-radius: 14px;
      width: 300px;
      box-shadow: 0 0 25px rgba(0,0,0,0.45);
      font-family: Arial, sans-serif;
      animation: slideIn 0.25s ease;
    ">

      <div style="
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
      ">

        <div style="
          font-size: 24px;
          font-weight: bold;
        ">
          ${icon}
        </div>

        <div style="
          font-size: 22px;
          font-weight: bold;
        ">
          WEBGuard
        </div>

      </div>

      <div style="
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 8px;
      ">
        ${title}
      </div>
    </div>
  `;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

// FULLSCREEN MALICIOUS OVERLAY

function createWarningOverlay(data) {
  removeExistingWarning();
  const overlay = document.createElement("div");

  overlay.id ="WEBGuard-warning-overlay";
  overlay.innerHTML = `
    <div class="pg-warning-box">

      <div class="pg-icon">
        ⚠
      </div>

      <h1>
        MALICIOUS WEBSITE DETECTED
      </h1>

      <p class="pg-subtitle">
        This page appears to be a phishing or malicious website.
      </p>

      <div class="pg-details">

        <p>
          <strong>Prediction:</strong>
          ${data.prediction}
        </p>

      </div>

      <div class="pg-buttons">

        <button id="pg-leave-btn">
          Leave Site
        </button>

        <button id="pg-proceed-btn">
          Continue Anyway
        </button>

      </div>
    </div>
  `;

  const style = document.createElement("style");

  style.textContent = `
    #WEBGuard-warning-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.96);
      z-index: 999999999;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: Arial, sans-serif;
    }

    .pg-warning-box {
      width: 90%;
      max-width: 620px;
      background: #7f1d1d;
      border: 3px solid #ef4444;
      border-radius: 20px;
      padding: 40px;
      text-align: center;
      color: white;
      box-shadow:
        0 0 45px rgba(239,68,68,0.5);
    }

    .pg-icon {
      font-size: 72px;
      margin-bottom: 20px;
    }

    .pg-warning-box h1 {
      font-size: 38px;
      margin-bottom: 20px;
      color: #fecaca;
    }

    .pg-subtitle {
      font-size: 18px;
      color: #fca5a5;
      margin-bottom: 30px;
      line-height: 1.5;
    }

    .pg-details {
      background: rgba(255,255,255,0.08);
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 30px;
    }

    .pg-buttons {
      display: flex;
      gap: 20px;
      justify-content: center;
    }

    #pg-leave-btn,
    #pg-proceed-btn {

      border: none;
      padding: 14px 26px;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }

    #pg-leave-btn {
      background: #ef4444;
      color: white;
    }

    #pg-proceed-btn {
      background: white;
      color: black;
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(overlay);

  // LEAVE SITE

  document.getElementById("pg-leave-btn").addEventListener("click",() => {
        window.location.href =
          "https://google.com";
      }
    );

  // CONTINUE ANYWAY

  document.getElementById("pg-proceed-btn").addEventListener("click",() => {
        overlay.remove();
      }
    );
}

// MESSAGE LISTENER

chrome.runtime.onMessage.addListener(
  (message) => {
    console.log(
      "MESSAGE RECEIVED:",
      message
    );

    // SAFE
    if (message.prediction === "safe") {
      showToast(message);
    }

    // SUSPICIOUS
    else if (message.prediction === "suspicious") {
      showToast(message);
    }

    // MALICIOUS
    else if (message.prediction === "malicious") {
      showToast(message);
      createWarningOverlay(message);
    }
  }
);