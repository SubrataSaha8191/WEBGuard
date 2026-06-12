from fastapi import APIRouter
from app.models.schemas import URLRequest
import joblib
import pandas as pd
from urllib.parse import urlparse, urlunparse

from app.utils.features import (
    extract_features
)

from app.ml.threat_intel import (
    calculate_threat_score
)

from app.ml.reputation import (
    check_virustotal
)

from app.ml.deep_predict import (
    predict_deep
)

# URL normalization

def normalize_url(url):
    url = url.strip()
    if not url:
        return url

    parsed = urlparse(url, scheme="http")
    if not parsed.netloc:
        parsed = urlparse(f"http://{url}")

    scheme = parsed.scheme or "http"
    netloc = parsed.netloc
    path = parsed.path if parsed.path else "/"

    return urlunparse((scheme, netloc, path, "", "", ""))

# ROUTER

router = APIRouter()

# LOAD TRADITIONAL MODEL

model = joblib.load(
    "models/phishing_model.pkl"
)

# SCAN ROUTE

@router.post("/scan-url")
def scan_url(payload: URLRequest):
    url = normalize_url(payload.url)

    # FEATURE EXTRACTION

    features = extract_features(url)
    df = pd.DataFrame([features])

    # TRADITIONAL ML
    prediction = model.predict(df)[0]
    probabilities = (
        model.predict_proba(df)[0]
    )

    ml_confidence = round(
        max(probabilities) * 100,
        2
    )

    ml_prediction = (
        "phishing"
        if prediction == 1
        else "safe"
    )

    # DEEP LEARNING

    deep_result = predict_deep(url)

    deep_prediction = (
        deep_result["prediction"]
    )

    deep_confidence = (
        deep_result["confidence"]
    )

    # Override ML if deep model is safe and URL has no phishing signals
    if (
        deep_prediction == "safe" and
        ml_prediction == "phishing" and
        features.get("suspicious_word_count", 0) == 0 and
        features.get("has_ip", 0) == 0
    ):
        ml_prediction = "safe"

    # VIRUSTOTAL

    vt_result = check_virustotal(
        url
    )

    # THREAT INTELLIGENCE

    intel = calculate_threat_score(
        url=url,
        ml_prediction=ml_prediction,
        confidence=ml_confidence
    )

    threat_score = intel[
        "threat_score"
    ]

    # HYBRID SCORING

    # Deep learning boost
    if (
        deep_prediction ==
        "phishing"
    ):
        threat_score += 25

    # VirusTotal boost
    if (
        "malicious" in vt_result
    ):

        if (
            vt_result["malicious"]
            >= 2
        ):
            threat_score += 40

        elif (
            vt_result["suspicious"]
            >= 1
        ):
            threat_score += 20

    # Cap score
    threat_score = min(
        threat_score,
        100
    )

    # FINAL VERDICT

    if threat_score >= 75:
        final_prediction = (
            "malicious"
        )

    elif threat_score >= 40:
        final_prediction = (
            "suspicious"
        )

    else:
        final_prediction = (
            "safe"
        )

    final_confidence = round((ml_confidence * 0.8 + deep_confidence * 0.2) ,2)

    # Override confidence with threat_score if threat_score is higher
    # to reflect strict rules
    final_confidence = float(max(final_confidence, threat_score))

    # RESPONSE

    return {
        "url": url,
        "prediction": final_prediction,
        "threat_score": threat_score,
        # Traditional ML
        "ml_prediction": ml_prediction,
        "ml_confidence": ml_confidence,
        # Deep Learning
        "deep_prediction": deep_prediction,
        "deep_confidence": deep_confidence,
        # Threat Intel
        "threat_intelligence": intel,
        # VirusTotal
        "virustotal": vt_result,
        # Features
        "features": features,
        "confidence": final_confidence
    }