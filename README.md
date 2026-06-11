<div align="center">
  <h1><img src="https://img.icons8.com/color/48/shield.png" width="40" height="40" align="absmiddle" /> WEBGuard (PhishGuard)</h1>
  <p><em>An AI-Powered Phishing Detection Platform & Browser Extension</em></p>
  <p>
    <strong>Machine Learning</strong> • <strong>Computer Vision</strong> • <strong>Real-time Protection</strong>
  </p>
</div>

---

## <img src="https://img.icons8.com/color/48/open-book.png" width="28" height="28" align="absmiddle" /> Overview

**WEBGuard** is a comprehensive, production-grade phishing detection platform designed to protect users from malicious websites in real-time. By combining *Machine Learning* for URL feature analysis and *Deep Learning* (Computer Vision) for visual page inspection, WEBGuard provides robust, multi-layered security directly within your browser.

---

## <img src="https://img.icons8.com/color/48/star--v1.png" width="28" height="28" align="absmiddle" /> Features

- **<img src="https://img.icons8.com/color/48/search--v1.png" width="24" height="24" align="absmiddle" /> Real-time URL Analysis**: Extracts and analyzes URL-based security features on the fly.
- **<img src="https://img.icons8.com/color/48/visible--v1.png" width="24" height="24" align="absmiddle" /> Visual Screenshot Inspection**: Employs Computer Vision to visually assess the webpage for deceptive patterns.
- **<img src="https://img.icons8.com/color/48/flash-on.png" width="24" height="24" align="absmiddle" /> Browser Extension Integration**: Seamless, lightweight Chrome extension offering automated monitoring and threat notifications.
- **<img src="https://img.icons8.com/color/48/traffic-light.png" width="24" height="24" align="absmiddle" /> Tri-Level Threat Classification**:
  - <img src="https://img.icons8.com/color/48/checked--v1.png" width="20" height="20" align="absmiddle" /> **SAFE**: Minimal phishing indicators.
  - <img src="https://img.icons8.com/color/48/high-importance.png" width="20" height="20" align="absmiddle" /> **SUSPICIOUS**: Unusual characteristics needing caution.
  - <img src="https://img.icons8.com/color/48/cancel--v1.png" width="20" height="20" align="absmiddle" /> **MALICIOUS**: Strong malicious patterns detected.

---

## <img src="https://img.icons8.com/color/48/mind-map.png" width="28" height="28" align="absmiddle" /> Architecture & Workflow

Understanding how **WEBGuard** operates under the hood.

### System Architecture
![Architecture](docs/Architecture.png)

### Processing Workflow
![Workflow](docs/Workflow.png)

---

## <img src="https://img.icons8.com/color/48/source-code.png" width="28" height="28" align="absmiddle" /> Tech Stack

WEBGuard leverages a modern and powerful technology stack across its architecture:

### <img src="https://img.icons8.com/color/48/settings--v1.png" width="24" height="24" align="absmiddle" /> Backend (AI & API)
<p align="left">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" alt="PyTorch"/>
  <img src="https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" alt="Scikit-Learn"/>
  <img src="https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white" alt="OpenCV"/>
</p>

### <img src="https://img.icons8.com/color/48/domain--v1.png" width="24" height="24" align="absmiddle" /> Frontend (Dashboard)
<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
</p>

### <img src="https://img.icons8.com/color/48/puzzle.png" width="24" height="24" align="absmiddle" /> Browser Extension
<p align="left">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/Google_Chrome-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Chrome Extension"/>
</p>

### <img src="https://img.icons8.com/color/48/docker.png" width="24" height="24" align="absmiddle" /> DevOps
<p align="left">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
</p>

---

## <img src="https://img.icons8.com/color/48/camera--v1.png" width="28" height="28" align="absmiddle" /> Screenshots

Here are some visual demonstrations of **WEBGuard** in action:

<details>
<summary><b>Click to expand screenshots</b></summary>
<br>

<div align="center">
  <img src="docs/screenshots/Screenshot from 2026-06-10 19-42-17.png" alt="Screenshot 1" width="800"/>
  <br><br>
  <img src="docs/screenshots/Screenshot from 2026-06-10 19-49-09.png" alt="Screenshot 2" width="800"/>
  <br><br>
  <img src="docs/screenshots/Screenshot from 2026-06-10 19-56-04.png" alt="Screenshot 3" width="800"/>
  <br><br>
  <img src="docs/screenshots/Screenshot from 2026-06-11 09-40-06.png" alt="Screenshot 4" width="800"/>
  <br><br>
  <img src="docs/screenshots/Screenshot from 2026-06-11 09-40-16.png" alt="Screenshot 5" width="800"/>
</div>

</details>

---

## <img src="https://img.icons8.com/color/48/rocket--v1.png" width="28" height="28" align="absmiddle" /> Getting Started

### Prerequisites
- Node.js & npm (for Frontend)
- Python 3.9+ (for Backend)
- Google Chrome browser (for Extension)
- **Docker & Docker Compose** (Optional, for containerized setup)

### 🐳 Using Docker (Recommended)

To quickly spin up the entire application stack:
```bash
cd docker
docker-compose up --build
```
This will start both the backend API and the frontend dashboard automatically.

### 💻 Manual Setup

<details>
<summary><b>1. Backend Setup</b></summary>
<br>

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
uvicorn app.main:app --reload
```
</details>

<details>
<summary><b>2. Frontend Setup</b></summary>
<br>

```bash
cd frontend
npm install
npm run dev
```
</details>

### 🧩 Extension Setup

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked** and select the `extension` folder from this repository.
4. Pin the **WEBGuard** extension to your toolbar.

---

## <img src="https://img.icons8.com/color/48/security-checked--v1.png" width="28" height="28" align="absmiddle" /> Security Disclaimer

> **Note:** *WEBGuard is intended as a phishing detection and awareness platform. Predictions are generated using machine learning and computer vision models and should be treated as security recommendations rather than absolute guarantees.*

---

## <img src="https://img.icons8.com/color/48/handshake.png" width="28" height="28" align="absmiddle" /> Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/SubrataSaha8191/PhishGuard/issues).

---

<div align="center">
  <sub>Built with <img src="https://img.icons8.com/color/48/like--v1.png" width="16" height="16" align="absmiddle" /> for a safer web environment.</sub>
</div>
