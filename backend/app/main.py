from fastapi import FastAPI
from app.routes.scan import router as scan_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="WEBGuard API",
    description="AI-Powered phishing detection platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(scan_router)

@app.get("/")
def home():
    return {"message": "Welcome to the WEBGuard API!"}
