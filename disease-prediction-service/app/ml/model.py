"""
Disease Prediction Model
Random Forest Classifier for disease prediction from symptoms
"""
import pandas as pd
import numpy as np
import joblib
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class DiseasePredictor:
    """Disease prediction model using Random Forest"""
    
    def __init__(self):
        self.model: Optional[RandomForestClassifier] = None
        self.encoder: Optional[LabelEncoder] = None
        self.symptom_index: Optional[Dict[str, int]] = None
        self.symptoms: Optional[List[str]] = None
        self.is_trained: bool = False
        
    def load_data(self, file_path: str = None) -> pd.DataFrame:
        """Load dataset from CSV"""
        if file_path is None:
            file_path = settings.DATA_FILE
        
        logger.info(f"Loading data from {file_path}")
        data = pd.read_csv(file_path)
        logger.info(f"Data loaded: {data.shape[0]} rows, {data.shape[1]} columns")
        return data
    
    def encode_labels(self, data: pd.DataFrame) -> Tuple[pd.DataFrame, LabelEncoder]:
        """Encode disease labels"""
        encoder = LabelEncoder()
        data["diseases"] = encoder.fit_transform(data["diseases"])
        logger.info(f"Encoded {len(encoder.classes_)} unique diseases")
        return data, encoder
    
    def prepare_features_targets(self, data: pd.DataFrame, n_rows: int = None) -> Tuple[pd.DataFrame, pd.Series]:
        """Extract features (symptoms) and target (disease)"""
        if n_rows is None:
            n_rows = settings.N_ROWS
        
        # Limit rows if dataset is large
        n_rows = min(n_rows, len(data))
        
        # First column is disease, rest are symptoms
        X = data.iloc[:n_rows, 1:]
        y = data.iloc[:n_rows, 0]
        
        logger.info(f"Using {n_rows} rows for training")
        logger.info(f"Features: {X.shape[1]} symptoms")
        
        return X, y
    
    def train(self, data_path: str = None) -> Dict[str, float]:
        """
        Train the Random Forest model
        
        Args:
            data_path: Path to training data CSV
            
        Returns:
            Dictionary with training metrics
        """
        try:
            # Load and prepare data
            data = self.load_data(data_path)
            data, self.encoder = self.encode_labels(data)
            X, y = self.prepare_features_targets(data)
            
            # Store symptom information
            self.symptoms = X.columns.values.tolist()
            self.symptom_index = {symptom: idx for idx, symptom in enumerate(self.symptoms)}
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, 
                test_size=settings.TEST_SIZE, 
                random_state=settings.RANDOM_STATE
            )
            
            logger.info(f"Training set: {len(X_train)} samples")
            logger.info(f"Test set: {len(X_test)} samples")
            
            # Train Random Forest model
            logger.info(f"Training Random Forest with {settings.N_ESTIMATORS} estimators...")
            self.model = RandomForestClassifier(
                n_estimators=settings.N_ESTIMATORS,
                random_state=settings.RANDOM_STATE,
                n_jobs=-1,
                verbose=1
            )
            self.model.fit(X_train, y_train)
            
            # Evaluate
            train_pred = self.model.predict(X_train)
            test_pred = self.model.predict(X_test)
            
            metrics = {
                'train_accuracy': accuracy_score(y_train, train_pred),
                'test_accuracy': accuracy_score(y_test, test_pred),
                'precision': precision_score(y_test, test_pred, average='weighted', zero_division=0),
                'recall': recall_score(y_test, test_pred, average='weighted', zero_division=0),
                'f1_score': f1_score(y_test, test_pred, average='weighted', zero_division=0),
                'n_diseases': len(self.encoder.classes_),
                'n_symptoms': len(self.symptoms),
                'n_samples': len(X)
            }
            
            logger.info(f"Training completed!")
            logger.info(f"Train Accuracy: {metrics['train_accuracy']*100:.2f}%")
            logger.info(f"Test Accuracy: {metrics['test_accuracy']*100:.2f}%")
            logger.info(f"Precision: {metrics['precision']*100:.2f}%")
            logger.info(f"Recall: {metrics['recall']*100:.2f}%")
            logger.info(f"F1 Score: {metrics['f1_score']*100:.2f}%")
            
            self.is_trained = True
            
            return metrics
            
        except Exception as e:
            logger.error(f"Training failed: {str(e)}")
            raise
    
    def save_model(self, model_path: str = None, encoder_path: str = None, 
                   symptom_index_path: str = None):
        """Save trained model and supporting files"""
        if not self.is_trained or self.model is None:
            raise ValueError("Model must be trained before saving")
        
        if model_path is None:
            model_path = settings.MODEL_PATH
        if encoder_path is None:
            encoder_path = settings.ENCODER_PATH
        if symptom_index_path is None:
            symptom_index_path = settings.SYMPTOM_INDEX_PATH
        
        Path(model_path).parent.mkdir(parents=True, exist_ok=True)
        
        logger.info(f"Saving model to {model_path}")
        joblib.dump(self.model, model_path, compress=3)
        
        logger.info(f"Saving encoder to {encoder_path}")
        joblib.dump(self.encoder, encoder_path, compress=3)
        
        logger.info(f"Saving symptom index to {symptom_index_path}")
        joblib.dump(self.symptom_index, symptom_index_path, compress=3)
        
        logger.info("Model saved successfully!")
        
        return {
            'model_path': str(model_path),
            'encoder_path': str(encoder_path),
            'symptom_index_path': str(symptom_index_path)
        }
    
    def load_model(self, model_path: str = None, encoder_path: str = None,
                   symptom_index_path: str = None) -> bool:
        """Load trained model from disk"""
        try:
            if model_path is None:
                model_path = settings.MODEL_PATH
            if encoder_path is None:
                encoder_path = settings.ENCODER_PATH
            if symptom_index_path is None:
                symptom_index_path = settings.SYMPTOM_INDEX_PATH
            
            if not Path(model_path).exists():
                logger.warning(f"Model file not found: {model_path}")
                return False
            
            logger.info(f"Loading model from {model_path}")
            self.model = joblib.load(model_path)
            
            logger.info(f"Loading encoder from {encoder_path}")
            self.encoder = joblib.load(encoder_path)
            
            logger.info(f"Loading symptom index from {symptom_index_path}")
            self.symptom_index = joblib.load(symptom_index_path)
            
            self.symptoms = sorted(self.symptom_index.keys(), key=lambda x: self.symptom_index[x])
            
            self.is_trained = True
            logger.info(f"Model loaded successfully!")
            logger.info(f"Diseases: {len(self.encoder.classes_)}")
            logger.info(f"Symptoms: {len(self.symptoms)}")
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            return False
    
    def predict(self, input_symptoms: List[str]) -> Dict:
        """Predict disease from input symptoms"""
        if not self.is_trained or self.model is None:
            raise ValueError("Model not loaded. Please train or load a model first.")
        
        if not input_symptoms:
            raise ValueError("Please provide at least one symptom")
        
        input_vector = [0] * len(self.symptom_index)
        matched_symptoms = []
        unmatched_symptoms = []
        
        for symptom in input_symptoms:
            symptom = symptom.strip().lower()
            if symptom in self.symptom_index:
                input_vector[self.symptom_index[symptom]] = 1
                matched_symptoms.append(symptom)
            else:
                unmatched_symptoms.append(symptom)
        
        if not matched_symptoms:
            raise ValueError("None of the provided symptoms are recognized")
        
        input_df = pd.DataFrame([input_vector], columns=self.symptoms)
        
        prediction = self.model.predict(input_df)[0]
        disease_name = self.encoder.inverse_transform([prediction])[0]
        
        probabilities = self.model.predict_proba(input_df)[0]
        
        top_indices = np.argsort(probabilities)[-3:][::-1]
        top_predictions = [
            {
                'disease': self.encoder.inverse_transform([idx])[0],
                'confidence': float(probabilities[idx])
            }
            for idx in top_indices
        ]
        
        result = {
            'disease': disease_name,
            'confidence': float(max(probabilities)),
            'alternative_diseases': top_predictions[1:] if len(top_predictions) > 1 else [],
            'matched_symptoms': matched_symptoms,
            'unmatched_symptoms': unmatched_symptoms,
            'total_symptoms': len(matched_symptoms)
        }
        
        logger.info(f"Prediction: {disease_name} (confidence: {result['confidence']:.2%})")
        
        return result
    
    def get_all_symptoms(self) -> List[str]:
        """Get list of all available symptoms"""
        if self.symptoms is None:
            raise ValueError("Model not loaded")
        return self.symptoms
    
    def get_model_info(self) -> Dict:
        """Get model information"""
        if not self.is_trained:
            return {
                'is_trained': False,
                'message': 'Model not loaded'
            }
        
        return {
            'is_trained': True,
            'n_diseases': len(self.encoder.classes_),
            'n_symptoms': len(self.symptoms),
            'model_type': 'Random Forest',
            'n_estimators': settings.N_ESTIMATORS,
            'model_version': settings.MODEL_VERSION
        }


# Global predictor instance
predictor = DiseasePredictor()
