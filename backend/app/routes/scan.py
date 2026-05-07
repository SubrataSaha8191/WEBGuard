from fastapi import APIRouter
from app.utils.features import extract_features

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