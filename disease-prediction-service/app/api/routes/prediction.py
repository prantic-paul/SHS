"""
Prediction API routes
"""
from fastapi import APIRouter, HTTPException
from typing import List
import logging

from app.schemas.prediction import (
    SymptomInput,
    PredictionResponse,
    SymptomsListResponse
)
from app.ml.model import predictor

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/", response_model=PredictionResponse)
async def predict_disease(request: SymptomInput):
    """
    Predict disease based on input symptoms
    
    - **symptoms**: List of symptom names (e.g., ["fever", "cough", "headache"])
    
    Returns the predicted disease with confidence score and alternatives
    """
    try:
        # Check if model is loaded
        if not predictor.is_trained:
            # Try to load model
            if not predictor.load_model():
                raise HTTPException(
                    status_code=503,
                    detail="Model not trained yet. Please train the model first using /api/v1/train/ endpoint"
                )
        
        # Make prediction
        result = predictor.predict(request.symptoms)
        
        return PredictionResponse(
            success=True,
            message="Prediction successful",
            prediction=result
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.get("/symptoms", response_model=SymptomsListResponse)
async def get_symptoms():
    """
    Get list of all available symptoms
    
    Returns complete list of symptoms that can be used for prediction
    """
    try:
        # Check if model is loaded
        if not predictor.is_trained:
            # Try to load model
            if not predictor.load_model():
                raise HTTPException(
                    status_code=503,
                    detail="Model not trained yet. Please train the model first."
                )
        
        symptoms = predictor.get_all_symptoms()
        
        return SymptomsListResponse(
            success=True,
            symptoms=symptoms,
            total=len(symptoms)
        )
        
    except Exception as e:
        logger.error(f"Error getting symptoms: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get symptoms: {str(e)}")


@router.get("/info")
async def get_model_info():
    """
    Get information about the loaded model
    
    Returns model statistics and configuration
    """
    try:
        # Try to load model if not loaded
        if not predictor.is_trained:
            predictor.load_model()
        
        info = predictor.get_model_info()
        return {
            "success": True,
            "model_info": info
        }
        
    except Exception as e:
        logger.error(f"Error getting model info: {str(e)}")
        return {
            "success": False,
            "message": str(e)
        }
