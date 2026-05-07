import joblib
import pandas as pd

from app.utils.features import extract_features

# Load trained model
model = joblib.load("models/phishing_model.pkl")

def predict_url(url):
    features = extract_features(url)
    feature_df = pd.DataFrame([features])
    prediction = model.predict(feature_df)[0]
    probability = model.predict_proba(feature_df)[0][prediction]

    return {
        "prediction": "phishing" if prediction == 1 else "safe",
        "confidence": round(probability * 100, 2),
        "features": features
    }