"""
Disease prediction endpoint
"""
from fastapi import APIRouter, HTTPException
from app.schemas.prediction import SymptomInput, PredictionResponse, DiseaseOutput
from app.ml.model import predictor
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/", response_model=PredictionResponse)
async def predict_disease(symptoms: SymptomInput):
    """
    Predict disease based on symptoms
    
    Args:
        symptoms: List of symptom names
    
    Returns:
        Predicted disease with confidence score
    """
    try:
        # Check if model is loaded
        if not predictor.is_loaded():
            # Try to load model
            if not predictor.load_model():
                return PredictionResponse(
                    success=False,
                    message="Model not available. Please train the model first.",
                    prediction=None
                )
        
        # Make prediction
        result = predictor.predict(symptoms.symptoms)
        
        return PredictionResponse(
            success=True,
            message="Prediction successful",
            prediction=DiseaseOutput(**result)
        )
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/symptoms")
async def get_available_symptoms():
    """
    Get list of symptoms the model can recognize
    
    Returns:
        List of symptom names
    """
    if not predictor.is_loaded():
        predictor.load_model()
    
    if predictor.feature_names:
        return {
            "success": True,
            "symptoms": predictor.feature_names,
            "total": len(predictor.feature_names)
        }
    else:
        return {
            "success": False,
            "message": "Model not loaded or no symptoms available",
            "symptoms": [],
            "total": 0
        }
