from fastapi import APIRouter
from app.utils.features import extract_features
from app.ml.predict import predict_url
from app.models.schemas import URLRequest

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy"
    }

@router.get("/extract")
def extract(url: str):
    features = extract_features(url)

    return {
        "url": url,
        "features": features
    }

@router.post("/scan-url")
def scan_url(payload: URLRequest):
    result = predict_url(payload.url)
    return result