"""
Pydantic schemas for request/response models
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class SymptomInput(BaseModel):
    """Input schema for symptom-based prediction"""
    symptoms: List[str] = Field(..., description="List of symptoms", min_length=1)
    
    class Config:
        json_schema_extra = {
            "example": {
                "symptoms": ["fever", "cough", "headache", "fatigue"]
            }
        }

class DiseaseOutput(BaseModel):
    """Output schema for disease prediction"""
    disease: str = Field(..., description="Predicted disease")
    confidence: float = Field(..., description="Confidence score (0-1)", ge=0, le=1)
    alternative_diseases: Optional[List[Dict[str, float]]] = Field(
        default=None,
        description="Alternative predictions with confidence scores"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "disease": "Common Cold",
                "confidence": 0.85,
                "alternative_diseases": [
                    {"disease": "Influenza", "confidence": 0.12},
                    {"disease": "Sinusitis", "confidence": 0.03}
                ]
            }
        }

class PredictionResponse(BaseModel):
    """Complete prediction response"""
    success: bool
    prediction: Optional[DiseaseOutput] = None
    message: str
    
class TrainingRequest(BaseModel):
    """Request schema for model training"""
    dataset_path: Optional[str] = Field(None, description="Path to training dataset")
    model_params: Optional[Dict] = Field(default_factory=dict, description="Model hyperparameters")
    
    class Config:
        json_schema_extra = {
            "example": {
                "dataset_path": "app/data/raw/disease_symptoms.csv",
                "model_params": {
                    "n_estimators": 100,
                    "max_depth": 10
                }
            }
        }

class TrainingResponse(BaseModel):
    """Response schema for model training"""
    success: bool
    message: str
    metrics: Optional[Dict[str, float]] = None
    model_path: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Model trained successfully",
                "metrics": {
                    "accuracy": 0.92,
                    "precision": 0.89,
                    "recall": 0.91
                },
                "model_path": "app/data/models/disease_model.pkl"
            }
        }

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    service: str
    version: str
    model_loaded: bool
