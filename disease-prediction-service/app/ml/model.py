"""
ML Model Manager for Disease Prediction
Handles model training, loading, and prediction
"""
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from typing import List, Dict, Tuple, Optional
from pathlib import Path
import logging

from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DiseasePredictor:
    """
    Disease Prediction Model
    Uses Random Forest Classifier to predict diseases based on symptoms
    """
    
    def __init__(self):
        self.model: Optional[RandomForestClassifier] = None
        self.symptom_encoder: Optional[LabelEncoder] = None
        self.disease_encoder: Optional[LabelEncoder] = None
        self.feature_names: List[str] = []
        self.model_path = Path(settings.MODEL_PATH)
        
    def load_model(self) -> bool:
        """Load trained model from disk"""
        try:
            if self.model_path.exists():
                model_data = joblib.load(self.model_path)
                self.model = model_data['model']
                self.symptom_encoder = model_data.get('symptom_encoder')
                self.disease_encoder = model_data['disease_encoder']
                self.feature_names = model_data['feature_names']
                logger.info(f"Model loaded successfully from {self.model_path}")
                return True
            else:
                logger.warning(f"Model file not found at {self.model_path}")
                return False
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            return False
    
    def train_model(
        self,
        data: pd.DataFrame,
        target_column: str = 'disease',
        test_size: float = None
    ) -> Dict[str, float]:
        """
        Train the disease prediction model
        
        Args:
            data: DataFrame with symptoms and disease columns
            target_column: Name of the target column (disease)
            test_size: Test set size (default from settings)
        
        Returns:
            Dictionary with evaluation metrics
        """
        if test_size is None:
            test_size = settings.TEST_SIZE
            
        logger.info("Starting model training...")
        
        # Separate features and target
        X = data.drop(columns=[target_column])
        y = data[target_column]
        
        # Store feature names
        self.feature_names = X.columns.tolist()
        
        # Encode target labels
        self.disease_encoder = LabelEncoder()
        y_encoded = self.disease_encoder.fit_transform(y)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y_encoded,
            test_size=test_size,
            random_state=settings.RANDOM_STATE,
            stratify=y_encoded
        )
        
        # Train model
        self.model = RandomForestClassifier(
            n_estimators=settings.N_ESTIMATORS,
            random_state=settings.RANDOM_STATE,
            n_jobs=-1
        )
        
        logger.info("Training Random Forest model...")
        self.model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test)
        
        metrics = {
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred, average='weighted', zero_division=0),
            'recall': recall_score(y_test, y_pred, average='weighted', zero_division=0),
            'f1_score': f1_score(y_test, y_pred, average='weighted', zero_division=0)
        }
        
        logger.info(f"Training completed. Metrics: {metrics}")
        
        return metrics
    
    def save_model(self, path: Optional[Path] = None) -> str:
        """Save trained model to disk"""
        if path is None:
            path = self.model_path
        
        path.parent.mkdir(parents=True, exist_ok=True)
        
        model_data = {
            'model': self.model,
            'symptom_encoder': self.symptom_encoder,
            'disease_encoder': self.disease_encoder,
            'feature_names': self.feature_names,
            'version': settings.MODEL_VERSION
        }
        
        joblib.dump(model_data, path)
        logger.info(f"Model saved to {path}")
        
        return str(path)
    
    def predict(self, symptoms: List[str]) -> Dict:
        """
        Predict disease from symptoms
        
        Args:
            symptoms: List of symptom names
        
        Returns:
            Dictionary with prediction and confidence
        """
        if self.model is None:
            raise ValueError("Model not loaded. Train or load a model first.")
        
        # Create feature vector (one-hot encoding of symptoms)
        feature_vector = np.zeros(len(self.feature_names))
        
        for symptom in symptoms:
            if symptom in self.feature_names:
                idx = self.feature_names.index(symptom)
                feature_vector[idx] = 1
        
        # Reshape for prediction
        X = feature_vector.reshape(1, -1)
        
        # Get prediction and probabilities
        prediction = self.model.predict(X)[0]
        probabilities = self.model.predict_proba(X)[0]
        
        # Decode disease name
        disease_name = self.disease_encoder.inverse_transform([prediction])[0]
        confidence = probabilities[prediction]
        
        # Get top 3 alternative predictions
        top_indices = np.argsort(probabilities)[-3:][::-1]
        alternatives = [
            {
                'disease': self.disease_encoder.inverse_transform([idx])[0],
                'confidence': float(probabilities[idx])
            }
            for idx in top_indices[1:]  # Skip the top prediction
        ]
        
        return {
            'disease': disease_name,
            'confidence': float(confidence),
            'alternative_diseases': alternatives
        }
    
    def is_loaded(self) -> bool:
        """Check if model is loaded"""
        return self.model is not None

# Global model instance
predictor = DiseasePredictor()
