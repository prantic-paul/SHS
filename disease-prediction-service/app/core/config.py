"""
Configuration settings for the Disease Prediction Service
"""
from pydantic_settings import BaseSettings
from typing import Optional
import os
from pathlib import Path

class Settings(BaseSettings):
    """Application settings"""
    
    # Service Configuration
    SERVICE_NAME: str = "disease-prediction-service"
    SERVICE_HOST: str = "0.0.0.0"
    SERVICE_PORT: int = 8002
    DEBUG: bool = True
    
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Disease Prediction Service"
    
    # Model Configuration
    MODEL_PATH: str = "app/data/models/disease_model.pkl"
    ENCODER_PATH: str = "app/data/models/encoder.pkl"
    SYMPTOM_INDEX_PATH: str = "app/data/models/symptom_index.pkl"
    MODEL_NAME: str = "disease_prediction_model"
    MODEL_VERSION: str = "1.0.0"
    
    # Data Paths
    RAW_DATA_PATH: str = "app/data/raw"
    PROCESSED_DATA_PATH: str = "app/data/processed"
    MODELS_PATH: str = "app/data/models"
    DATA_FILE: str = "app/data/processed/Final_Augmented_dataset_Diseases_and_Symptoms.csv"
    
    # ML Configuration
    TEST_SIZE: float = 0.2
    RANDOM_STATE: int = 42
    N_ESTIMATORS: int = 100
    N_ROWS: int = 50000  # Number of rows to use for training
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Create directories if they don't exist
Path(settings.RAW_DATA_PATH).mkdir(parents=True, exist_ok=True)
Path(settings.PROCESSED_DATA_PATH).mkdir(parents=True, exist_ok=True)
Path(settings.MODELS_PATH).mkdir(parents=True, exist_ok=True)
