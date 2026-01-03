"""
Training API routes
"""
from fastapi import APIRouter, HTTPException
from pathlib import Path
import logging

from app.schemas.prediction import TrainingResponse, ModelStatusResponse
from app.ml.model import predictor
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/", response_model=TrainingResponse)
async def train_model():
    """
    Train the disease prediction model
    
    This endpoint will:
    1. Load the dataset from app/data/processed/
    2. Train a Random Forest classifier
    3. Save the trained model to disk
    4. Return training metrics
    
    Note: This may take several minutes depending on dataset size
    """
    try:
        logger.info("Starting model training...")
        
        # Check if dataset exists
        if not Path(settings.DATA_FILE).exists():
            raise HTTPException(
                status_code=404,
                detail=f"Dataset not found at {settings.DATA_FILE}"
            )
        
        # Train model
        metrics = predictor.train()
        
        # Save model
        saved_paths = predictor.save_model()
        
        logger.info("Model training completed successfully")
        
        return TrainingResponse(
            success=True,
            message="Model trained and saved successfully",
            metrics={
                'train_accuracy': float(metrics['train_accuracy']),
                'test_accuracy': float(metrics['test_accuracy']),
                'precision': float(metrics['precision']),
                'recall': float(metrics['recall']),
                'f1_score': float(metrics['f1_score']),
                'n_diseases': metrics['n_diseases'],
                'n_symptoms': metrics['n_symptoms'],
                'n_samples': metrics['n_samples']
            },
            model_path=saved_paths['model_path']
        )
        
    except Exception as e:
        logger.error(f"Training error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")


@router.get("/status", response_model=ModelStatusResponse)
async def get_training_status():
    """
    Get current model status
    
    Returns information about whether a model is loaded and its details
    """
    try:
        # Try to load model if not loaded
        if not predictor.is_trained:
            loaded = predictor.load_model()
            if not loaded:
                return ModelStatusResponse(
                    model_loaded=False,
                    message="No trained model found. Please train the model first.",
                    model_path=settings.MODEL_PATH
                )
        
        info = predictor.get_model_info()
        
        return ModelStatusResponse(
            model_loaded=True,
            message="Model is loaded and ready",
            model_path=settings.MODEL_PATH,
            model_version=settings.MODEL_VERSION,
            n_diseases=info.get('n_diseases', 0),
            n_symptoms=info.get('n_symptoms', 0),
            model_type="Random Forest"
        )
        
    except Exception as e:
        logger.error(f"Error checking status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get status: {str(e)}")


@router.post("/reload")
async def reload_model():
    """
    Reload the model from disk
    
    Useful after training or updating the model files
    """
    try:
        success = predictor.load_model()
        
        if not success:
            raise HTTPException(
                status_code=404,
                detail="Failed to load model. Please ensure model files exist."
            )
        
        info = predictor.get_model_info()
        
        return {
            "success": True,
            "message": "Model reloaded successfully",
            "model_info": info
        }
        
    except Exception as e:
        logger.error(f"Error reloading model: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to reload model: {str(e)}")
