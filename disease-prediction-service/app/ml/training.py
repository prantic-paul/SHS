"""
Training utilities and data preprocessing
"""
import pandas as pd
import numpy as np
from sklearn.preprocessing import MultiLabelBinarizer
from typing import Dict, List, Tuple
import logging

logger = logging.getLogger(__name__)

def load_dataset(file_path: str) -> pd.DataFrame:
    """
    Load dataset from CSV file
    
    Args:
        file_path: Path to CSV file
    
    Returns:
        DataFrame with disease and symptoms
    """
    try:
        df = pd.read_csv(file_path)
        logger.info(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")
        return df
    except Exception as e:
        logger.error(f"Error loading dataset: {e}")
        raise

def preprocess_symptoms(df: pd.DataFrame, symptom_columns: List[str]) -> pd.DataFrame:
    """
    Preprocess symptom data
    - Handle missing values
    - Normalize symptom names
    - Convert to binary features
    
    Args:
        df: Input DataFrame
        symptom_columns: List of symptom column names
    
    Returns:
        Preprocessed DataFrame
    """
    # Fill missing values
    df[symptom_columns] = df[symptom_columns].fillna(0)
    
    # Convert to binary (0 or 1)
    for col in symptom_columns:
        df[col] = (df[col] != 0).astype(int)
    
    return df

def create_symptom_disease_mapping(df: pd.DataFrame) -> Dict[str, List[str]]:
    """
    Create mapping of diseases to their common symptoms
    
    Args:
        df: DataFrame with disease and symptom columns
    
    Returns:
        Dictionary mapping disease names to symptom lists
    """
    mapping = {}
    disease_col = 'disease'
    
    if disease_col not in df.columns:
        disease_col = df.columns[0]  # Assume first column is disease
    
    symptom_cols = [col for col in df.columns if col != disease_col]
    
    for disease in df[disease_col].unique():
        disease_df = df[df[disease_col] == disease]
        # Get symptoms that appear in more than 50% of cases
        common_symptoms = []
        for col in symptom_cols:
            if disease_df[col].mean() > 0.5:
                common_symptoms.append(col)
        mapping[disease] = common_symptoms
    
    return mapping

def get_feature_importance(model, feature_names: List[str], top_n: int = 20) -> Dict[str, float]:
    """
    Get top feature importances from trained model
    
    Args:
        model: Trained model with feature_importances_ attribute
        feature_names: List of feature names
        top_n: Number of top features to return
    
    Returns:
        Dictionary of feature names and their importance scores
    """
    if not hasattr(model, 'feature_importances_'):
        return {}
    
    importance_dict = dict(zip(feature_names, model.feature_importances_))
    sorted_importance = sorted(importance_dict.items(), key=lambda x: x[1], reverse=True)
    
    return dict(sorted_importance[:top_n])
