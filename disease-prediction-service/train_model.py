"""
Training script for Disease Prediction Model
Run this script to train the Random Forest model
"""
import sys
import logging
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from app.ml.model import predictor
from app.core.config import settings

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def main():
    """Main training function"""
    logger.info("=" * 80)
    logger.info("Disease Prediction Model Training")
    logger.info("=" * 80)
    
    logger.info(f"\nConfiguration:")
    logger.info(f"  Data file: {settings.DATA_FILE}")
    logger.info(f"  N_ROWS: {settings.N_ROWS}")
    logger.info(f"  N_ESTIMATORS: {settings.N_ESTIMATORS}")
    logger.info(f"  TEST_SIZE: {settings.TEST_SIZE}")
    logger.info(f"  RANDOM_STATE: {settings.RANDOM_STATE}")
    
    # Check if data file exists
    if not Path(settings.DATA_FILE).exists():
        logger.error(f"\nError: Data file not found: {settings.DATA_FILE}")
        logger.error("Please ensure the dataset is in the correct location.")
        return
    
    try:
        # Train model
        logger.info("\n" + "=" * 80)
        logger.info("Starting Training...")
        logger.info("=" * 80 + "\n")
        
        metrics = predictor.train()
        
        # Display results
        logger.info("\n" + "=" * 80)
        logger.info("Training Results")
        logger.info("=" * 80)
        logger.info(f"\nDataset Information:")
        logger.info(f"  Total samples: {metrics['n_samples']}")
        logger.info(f"  Number of diseases: {metrics['n_diseases']}")
        logger.info(f"  Number of symptoms: {metrics['n_symptoms']}")
        
        logger.info(f"\nModel Performance:")
        logger.info(f"  Train Accuracy: {metrics['train_accuracy']*100:.2f}%")
        logger.info(f"  Test Accuracy:  {metrics['test_accuracy']*100:.2f}%")
        logger.info(f"  Precision:      {metrics['precision']*100:.2f}%")
        logger.info(f"  Recall:         {metrics['recall']*100:.2f}%")
        logger.info(f"  F1 Score:       {metrics['f1_score']*100:.2f}%")
        
        # Save model
        logger.info("\n" + "=" * 80)
        logger.info("Saving Model...")
        logger.info("=" * 80 + "\n")
        
        saved_paths = predictor.save_model()
        
        logger.info("Model saved to:")
        for key, path in saved_paths.items():
            logger.info(f"  {key}: {path}")
        
        logger.info("\n" + "=" * 80)
        logger.info("Training Completed Successfully!")
        logger.info("=" * 80)
        
        # Test prediction
        logger.info("\n" + "=" * 80)
        logger.info("Testing Prediction...")
        logger.info("=" * 80 + "\n")
        
        test_symptoms = [
            "anxiety and nervousness",
            "shortness of breath",
            "depressive or psychotic symptoms"
        ]
        
        logger.info(f"Test symptoms: {test_symptoms}")
        result = predictor.predict(test_symptoms)
        
        logger.info(f"\nPrediction Result:")
        logger.info(f"  Disease: {result['disease']}")
        logger.info(f"  Confidence: {result['confidence']*100:.2f}%")
        logger.info(f"  Matched symptoms: {len(result['matched_symptoms'])}")
        
        if result['alternative_diseases']:
            logger.info(f"\n  Alternative predictions:")
            for alt in result['alternative_diseases']:
                logger.info(f"    - {alt['disease']}: {alt['confidence']*100:.2f}%")
        
        logger.info("\n" + "=" * 80)
        logger.info("All Done! Model is ready for use.")
        logger.info("=" * 80)
        
    except Exception as e:
        logger.error(f"\nTraining failed: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
