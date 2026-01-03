"""
Model training endpoint
"""
from fastapi import APIRouter, HTTPException, UploadFile, File
from app.schemas.prediction import TrainingRequest, TrainingResponse
from app.ml.model import predictor
from app.ml.training import load_dataset, preprocess_symptoms
from app.core.config import settings
import logging
import pandas as pd
from pathlib import Path

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/", response_model=TrainingResponse)
async def train_model(request: TrainingRequest):
    """
    Train the disease prediction model
    
    Args:
        request: Training request with dataset path and parameters
    
    Returns:
        Training results with metrics
    """
    try:
        # Get dataset path
        dataset_path = request.dataset_path or f"{settings.RAW_DATA_PATH}/disease_symptoms.csv"
        
        # Check if file exists
        if not Path(dataset_path).exists():
            return TrainingResponse(
                success=False,
                message=f"Dataset not found at {dataset_path}",
                metrics=None,
                model_path=None
            )
        
        # Load dataset
        logger.info(f"Loading dataset from {dataset_path}")
        df = load_dataset(dataset_path)
        
        # Train model
        metrics = predictor.train_model(df)
        
        # Save model
        model_path = predictor.save_model()
        
        return TrainingResponse(
            success=True,
            message="Model trained and saved successfully",
            metrics=metrics,
            model_path=model_path
        )
        
    except Exception as e:
        logger.error(f"Training error: {e}")
        return TrainingResponse(
            success=False,
            message=f"Training failed: {str(e)}",
            metrics=None,
            model_path=None
        )

@router.post("/upload-dataset")
async def upload_dataset(file: UploadFile = File(...)):
    """
    Upload a training dataset CSV file
    
    Args:
        file: CSV file with disease and symptom columns
    
    Returns:
        Upload confirmation
    """
    try:
        # Save uploaded file
        file_path = Path(settings.RAW_DATA_PATH) / file.filename
        
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Validate CSV
        df = pd.read_csv(file_path)
        
        return {
            "success": True,
            "message": f"Dataset uploaded successfully",
            "file_path": str(file_path),
            "rows": len(df),
            "columns": list(df.columns)
        }
        
    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=400, detail=f"Upload failed: {str(e)}")

@router.get("/status")
async def get_training_status():
    """
    Get current model training status
    
    Returns:
        Model status information
    """
    return {
        "model_loaded": predictor.is_loaded(),
        "model_path": str(settings.MODEL_PATH),
        "model_version": settings.MODEL_VERSION,
        "feature_count": len(predictor.feature_names) if predictor.feature_names else 0
    }
