"""
Health check endpoint
"""
from fastapi import APIRouter
from app.schemas.prediction import HealthResponse
from app.ml.model import predictor
from app.core.config import settings

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        service=settings.SERVICE_NAME,
        version=settings.MODEL_VERSION,
        model_loaded=predictor.is_loaded()
    )
