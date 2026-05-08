async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function scanURL(url) {
  try {
    const response = await fetch("http://127.0.0.1:8000/scan-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    return await response.json();
  } catch (error) {
    return { prediction: "error", error: "Failed to connect to scanner" };
  }
}

// Theme handling logic
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

function updateThemeIcon(theme) {
  if (theme === "dark") {
    // Moon Icon
    themeIcon.innerHTML = `
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    `;
  } else {
    // Sun Icon
    themeIcon.innerHTML = `
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    `;
  }
}

function initializeTheme() {
  const savedTheme = localStorage.getItem("pg-theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

themeToggleBtn.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("pg-theme", newTheme);
  updateThemeIcon(newTheme);
});

// Tab handling logic
const tabs = document.querySelectorAll(".tab");
const views = document.querySelectorAll(".view");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove active from all tabs
    tabs.forEach((t) => t.classList.remove("active"));
    // Hide all views
    views.forEach((v) => {
      v.classList.remove("active-view");
      v.classList.add("hidden-view");
    });

    // Add active to clicked tab
    tab.classList.add("active");
    // Show target view
    const targetId = tab.getAttribute("data-target");
    const targetView = document.getElementById(targetId);
    targetView.classList.remove("hidden-view");
    targetView.classList.add("active-view");
  });
});

async function main() {
  initializeTheme();

  const tab = await getCurrentTab();
  const url = tab.url;

  if (!url) return;

  document.getElementById("url").innerText = url;
  document.getElementById("detail-url").innerText = url;

  if (
    url.startsWith("chrome://") ||
    url.startsWith("chrome-extension://") ||
    url.startsWith("edge://") ||
    url.startsWith("about:")
  ) {
    const card = document.getElementById("status-card");
    card.className = "retro-card border-thick safe";
    card.innerHTML = `
      <svg class="status-icon" fill="none" stroke-width="3" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="square" stroke-linejoin="miter" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      <div class="status-title">TRUSTED PAGE</div>
      <div class="status-text">Internal browser page.</div>
    `;
    document.getElementById("detail-prediction").innerText =
      "TRUSTED (Internal)";
    document.getElementById("detail-confidence").innerText = "100%";
    return;
  }

  const result = await scanURL(url);
  const card = document.getElementById("status-card");

  // Populate Detail View info regardless
  document.getElementById("detail-prediction").innerText =
    result.prediction || "ERROR";
  document.getElementById("detail-confidence").innerText = result.confidence
    ? `${result.confidence.toFixed(2)}%`
    : "N/A";
  document.getElementById("detail-features").innerText = result.features
    ? JSON.stringify(result.features)
    : "None extracted";

  if (result.prediction === "error") {
    card.className = "retro-card border-thick warning";
    card.innerHTML = `
      <svg class="status-icon" fill="none" stroke-width="3" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="square" stroke-linejoin="miter" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div class="status-title">SCAN FAILED</div>
      <div class="status-text">${result.error}</div>
    `;
    return;
  }

  const confidence = result.confidence || 0;

  if (result.prediction === "safe") {
    card.className = "retro-card border-thick safe";
    card.innerHTML = `
      <svg class="status-icon" fill="none" stroke-width="3" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="square" stroke-linejoin="miter" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div class="status-title">SAFE</div>
      <div class="status-text">Confidence: ${confidence.toFixed(1)}%</div>
    `;
  } else if (confidence < 75) {
    card.className = "retro-card border-thick warning";
    card.innerHTML = `
      <svg class="status-icon" fill="none" stroke-width="3" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="square" stroke-linejoin="miter" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div class="status-title">SUSPICIOUS</div>
      <div class="status-text">Confidence: ${confidence.toFixed(1)}%</div>
    `;
  } else {
    card.className = "retro-card border-thick danger";
    card.innerHTML = `
      <svg class="status-icon" fill="none" stroke-width="3" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="square" stroke-linejoin="miter" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div class="status-title">MALICIOUS</div>
      <div class="status-text">Leave this site immediately.</div>
    `;
  }
}

main();
