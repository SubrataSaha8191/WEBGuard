from fastapi import FastAPI
from app.routes.scan import router as scan_router

app = FastAPI(
    title="PhishGuard API",
    description="AI-Powered phishing detection platform",
    version="1.0.0",
)

app.include_router(scan_router)

@app.get("/")
def home():
    return {"message": "Welcome to the PhishGuard API!"}
