# WEBGuard Comprehensive Project Documentation

## Introduction
WEBGuard is an advanced, AI-powered phishing detection platform designed to protect users from malicious URLs, spoofed websites, and sophisticated social engineering attacks. Traditional signature-based detection systems struggle to keep pace with dynamic phishing campaigns. WEBGuard addresses this by utilizing a multi-layered approach, combining Traditional Machine Learning (ML), Deep Learning (DL), visual analysis via OpenCV, and a heuristic Threat Intelligence engine. It provides real-time protection through a dedicated browser extension and an administrative dashboard for deep analysis.

## Problem Statement
Modern phishing attacks frequently bypass standard security filters by using legitimate-looking domains, obtaining free SSL/TLS certificates (HTTPS), and perfectly mimicking the visual design of trusted brands. A robust solution is required that doesn't just rely on blocklists but can analyze the structural semantics of a URL, verify the cryptographic integrity of its connection, and visually inspect the rendered page to identify brand spoofing.

## Literature & Research
Research indicates that modern phishing relies heavily on domain obfuscation, high entropy subdomains, and leveraging trusted infrastructure (like `.top` or `.xyz` domains). Furthermore, studies show over 80% of phishing sites now use HTTPS, rendering the "padlock" icon useless as a security indicator. Our research determined that combining URL feature extraction (lexical analysis) with character-level deep learning and visual logo detection yields the highest accuracy in zero-day phishing detection.

## Requirement Analysis
- **Functional Requirements:** Real-time URL scanning, visual spoofing detection, threat scoring, browser integration, historical scan tracking.
- **Non-Functional Requirements:** Low latency for browser extension performance, high availability, strict privacy (no sensitive user data sent), and scalable API design.
- **Technology Stack:** FastAPI (Backend), React/Vite (Frontend dashboard), Chrome Manifest V3 (Browser Extension), Scikit-Learn & PyTorch (AI Models), OpenCV (Computer Vision).

## System Architecture
WEBGuard follows a microservices-inspired architecture:
1. **Client Layer:** The Chrome Browser Extension intercepts navigation and captures visuals. The React Dashboard provides manual analysis and analytics.
2. **API Gateway & Routing:** A FastAPI backend routes requests concurrently to multiple analysis modules.
3. **Engine Layer:** Requests are processed in parallel by the ML Pipeline, DL Pipeline, Threat Intel Engine, and the OpenCV module.
4. **Aggregator:** A hybrid scoring algorithm weights the outputs from all engines to determine a final Threat Score and Verdict (Safe, Suspicious, Malicious).

## ML Pipeline
The Traditional Machine Learning pipeline utilizes a **Random Forest Classifier**.
- **Feature Extraction:** Extracts 12 critical lexical features from the URL, including URL length, domain length, entropy, dot/slash counts, IP addresses in the domain, and suspicious keywords.
- **Training:** Trained on a dataset of balanced safe and phishing URLs.
- **Recent Upgrades:** We explicitly removed the `has_https` feature to eliminate the model's false bias that HTTPS implies safety, increasing baseline accuracy to 88.35%.

## DL Pipeline
The Deep Learning pipeline uses a **Bidirectional Long Short-Term Memory (BiLSTM)** network built with PyTorch.
- **Mechanism:** Instead of manual feature extraction, the BiLSTM treats the URL as a sequence of characters. It embeds characters into vectors and processes them bidirectionally to understand semantic patterns (e.g., hidden typosquatting like `paypa1.com`).
- **Advantage:** Highly effective at catching zero-day obfuscation techniques that fool the Random Forest model.

## Threat Intelligence Integration
A heuristic engine designed to cross-reference known threat patterns and infrastructure flaws.
- **Domain Age:** Penalizes newly registered domains via WHOIS lookups.
- **Suspicious TLDs:** Flags cheap or heavily abused Top-Level Domains (e.g., `.tk`, `.xyz`).
- **Keyword Scoring:** Detects aggressive calls-to-action ("login", "verify") combined with brand names.
- **Strict SSL Validation:** Uses `certifi` (browser-grade root certificates) to rigorously validate the SSL chain. Sites claiming HTTPS with broken or untrusted certificates receive a massive +50 threat score penalty.

## Browser Extension Development
A Chrome Manifest V3 extension acts as the primary shield for the user.
- **Background Scripts:** Monitors web navigation and communicates with the FastAPI backend in real-time.
- **Content Scripts:** Can extract page context or DOM elements if required.
- **Vision Script:** Captures a screenshot of the viewport for visual analysis if the URL is deemed suspicious but not definitively malicious.
- **UI:** A sleek popup interface allows users to see the safety status of the current tab immediately.

## Dashboard Development
Built with React and Vite, the dashboard serves as the administrative control center.
- **UI/UX:** Features a modern, retro-cyberpunk aesthetic with dynamic theming.
- **Features:** Allows manual URL input for deep scanning, displays live Threat Trends (Spear Phishing, Malware Drop, Credential Theft), tracks False Positives, and maintains a history of recent scans.

## OpenCV Module
To combat pixel-perfect brand spoofing, WEBGuard employs Computer Vision.
- **Capture Processing:** Receives screenshots from the browser extension.
- **Logo Detection:** Uses edge detection and contour mapping to isolate logos on the rendered page.
- **Model Analysis:** Compares extracted logos against a database of protected brands. If a page looks like PayPal but the URL is not `paypal.com`, the system triggers an immediate block.

## Security Features
- **Zero-Trust HTTPS:** Does not inherently trust SSL certificates.
- **Hybrid Scoring:** Prevents evasion by requiring attackers to bypass lexical (ML), semantic (DL), infrastructure (Threat Intel), and visual (OpenCV) checks simultaneously.
- **CORS Protection:** The backend strictly controls API access via FastAPI middleware.

## Testing & Results
- **Unit Testing:** Individual models were tested on isolated datasets. The retrained ML model achieved 88.35% accuracy.
- **Integration Testing:** The hybrid scoring system successfully prioritized Threat Intel over raw ML confidence when zero-day obfuscation was used.
- **Real-World Validation:** Successfully caught live phishing sites (e.g., untrusted academic spoof sites) that slipped past traditional filters due to invalid SSL implementations.

## Challenges
- **False Positives:** Balancing aggressive threat scoring without blocking legitimate new websites or obscure academic/government domains.
- **HTTPS Bias:** Overcoming the historical assumption in datasets that HTTPS means a site is safe, requiring dataset reprocessing and model retraining.
- **Performance:** Running OpenCV inference and PyTorch BiLSTM predictions concurrently within the strict timeout window required for a seamless browser navigation experience.

## Future Scope
- **WebAssembly (WASM):** Porting the ML feature extraction directly into the browser extension via WASM to reduce backend server load and latency.
- **Continuous Learning:** Implementing a feedback loop where false positives flagged by users on the dashboard automatically retrain the Random Forest model.
- **Expanded Brand Database:** Scaling the OpenCV logo detection to cover thousands of local banks and regional services.

## Conclusion
WEBGuard represents a comprehensive, modern approach to web security. By combining lexical, semantic, infrastructural, and visual analysis into a single cohesive platform, it provides robust defense against the evolving landscape of sophisticated phishing threats. The recent upgrades to strip HTTPS bias and enforce strict SSL validation ensure the platform remains effective against contemporary attack vectors.
