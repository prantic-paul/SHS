# Disease Prediction Microservice - Implementation Guide

**Date**: January 3, 2026  
**Branch**: feature/doctor-recommendation  
**Service Port**: 8002  
**Status**: Structure Complete

---

## 📋 Overview

A standalone FastAPI microservice for predicting diseases based on symptoms using Machine Learning. This service will integrate with the main SHS application to provide intelligent doctor recommendations.

---

## 🏗️ Service Architecture

### Directory Structure

```
disease-prediction-service/
├── app/
│   ├── api/
│   │   └── routes/
│   │       ├── health.py          # Health check
│   │       ├── prediction.py      # Disease prediction
│   │       └── training.py        # Model training
│   ├── core/
│   │   └── config.py              # Settings & configuration
│   ├── ml/
│   │   ├── model.py               # ML model class
│   │   └── training.py            # Training utilities
│   ├── schemas/
│   │   └── prediction.py          # Pydantic models
│   └── data/
│       ├── raw/                   # Training datasets
│       ├── processed/             # Preprocessed data
│       └── models/                # Saved models (.pkl)
├── tests/                         # Unit tests (to be added)
├── venv/                          # Virtual environment
├── main.py                        # FastAPI app
├── requirements.txt               # Dependencies
├── .env                           # Configuration
├── start.sh                       # Startup script
└── README.md                      # Service documentation
```

---

## 🔧 Technology Stack

### Backend Framework
- **FastAPI 0.116.2**: Modern, fast web framework
- **Uvicorn 0.35.0**: ASGI server
- **Pydantic 2.11.9**: Data validation

### Machine Learning
- **Scikit-learn 1.7.2**: ML algorithms (Random Forest)
- **Pandas 2.3.2**: Data manipulation
- **NumPy 2.2.6**: Numerical computing
- **Joblib 1.5.2**: Model serialization

### Visualization (for analysis)
- **Matplotlib 3.10.6**: Plotting
- **Seaborn 0.13.2**: Statistical visualization

### Additional
- **Python-dotenv 1.0.0**: Environment variables
- **Google-generativeai**: For future enhancement

---

## 🚀 Installation & Setup

### 1. Virtual Environment (Already Created)

```bash
cd disease-prediction-service

# Virtual environment exists at: venv/
# Activate it:
source venv/bin/activate

# Verify installation:
python -c "import fastapi, sklearn, pandas; print('All packages installed!')"
```

### 2. Configuration

Edit `.env` file:

```env
# Service
SERVICE_HOST=0.0.0.0
SERVICE_PORT=8002
DEBUG=True

# Model
MODEL_PATH=app/data/models/disease_model.pkl
MODEL_VERSION=1.0.0

# ML Parameters
TEST_SIZE=0.2
RANDOM_STATE=42
N_ESTIMATORS=100
```

### 3. Start Service

```bash
# Option 1: Use startup script
./start.sh

# Option 2: Direct Python
python main.py

# Option 3: Uvicorn
uvicorn main:app --host 0.0.0.0 --port 8002 --reload
```

### 4. Verify Running

```bash
# Health check
curl http://localhost:8002/health

# API documentation
open http://localhost:8002/docs
```

---

## 📡 API Endpoints

### 1. Health Check

```http
GET /health

Response:
{
  "status": "healthy",
  "service": "disease-prediction-service",
  "version": "1.0.0",
  "model_loaded": false
}
```

### 2. Predict Disease

```http
POST /api/v1/predict/
Content-Type: application/json

{
  "symptoms": ["fever", "cough", "headache", "fatigue"]
}

Response:
{
  "success": true,
  "message": "Prediction successful",
  "prediction": {
    "disease": "Common Cold",
    "confidence": 0.85,
    "alternative_diseases": [
      {"disease": "Influenza", "confidence": 0.12},
      {"disease": "Sinusitis", "confidence": 0.03}
    ]
  }
}
```

### 3. Get Available Symptoms

```http
GET /api/v1/predict/symptoms

Response:
{
  "success": true,
  "symptoms": ["fever", "cough", "headache", ...],
  "total": 132
}
```

### 4. Train Model

```http
POST /api/v1/train/
Content-Type: application/json

{
  "dataset_path": "app/data/raw/disease_symptoms.csv",
  "model_params": {
    "n_estimators": 100
  }
}

Response:
{
  "success": true,
  "message": "Model trained and saved successfully",
  "metrics": {
    "accuracy": 0.92,
    "precision": 0.89,
    "recall": 0.91,
    "f1_score": 0.90
  },
  "model_path": "app/data/models/disease_model.pkl"
}
```

### 5. Upload Dataset

```http
POST /api/v1/train/upload-dataset
Content-Type: multipart/form-data

file: <disease_symptoms.csv>

Response:
{
  "success": true,
  "message": "Dataset uploaded successfully",
  "file_path": "app/data/raw/disease_symptoms.csv",
  "rows": 4920,
  "columns": ["disease", "fever", "cough", ...]
}
```

### 6. Training Status

```http
GET /api/v1/train/status

Response:
{
  "model_loaded": true,
  "model_path": "app/data/models/disease_model.pkl",
  "model_version": "1.0.0",
  "feature_count": 132
}
```

---

## 🤖 ML Model Implementation

### Model Class: DiseasePredictor

Located: `app/ml/model.py`

#### Key Methods

```python
class DiseasePredictor:
    def __init__(self):
        """Initialize predictor"""
        
    def load_model(self) -> bool:
        """Load trained model from disk"""
        
    def train_model(self, data: pd.DataFrame) -> Dict[str, float]:
        """Train Random Forest model"""
        
    def save_model(self, path: Path) -> str:
        """Save model to disk"""
        
    def predict(self, symptoms: List[str]) -> Dict:
        """Predict disease from symptoms"""
        
    def is_loaded(self) -> bool:
        """Check if model is loaded"""
```

#### Algorithm

- **Random Forest Classifier**
- Default: 100 estimators
- Multi-class classification
- Binary feature encoding (symptom present/absent)

#### Model File Structure

```python
{
    'model': RandomForestClassifier,
    'symptom_encoder': LabelEncoder,
    'disease_encoder': LabelEncoder,
    'feature_names': List[str],
    'version': str
}
```

---

## 📊 Dataset Requirements

### CSV Format

```csv
disease,symptom1,symptom2,symptom3,...
Common Cold,1,1,0,...
Influenza,1,1,1,...
Malaria,1,0,1,...
```

### Requirements

1. **First column**: `disease` (target variable)
2. **Remaining columns**: Symptom names
3. **Values**: Binary (0 = absent, 1 = present)
4. **No missing values** in disease column
5. **Multiple rows** per disease (training examples)

### Example Dataset

| disease      | fever | cough | headache | fatigue | nausea | sore_throat |
|--------------|-------|-------|----------|---------|--------|-------------|
| Common Cold  | 1     | 1     | 1        | 1       | 0      | 1           |
| Common Cold  | 1     | 1     | 0        | 1       | 0      | 1           |
| Influenza    | 1     | 1     | 1        | 1       | 1      | 1           |
| Malaria      | 1     | 0     | 1        | 1       | 1      | 0           |
| Dengue       | 1     | 0     | 1        | 1       | 1      | 0           |

---

## 🔄 Workflow

### 1. Dataset Preparation Phase

```bash
# 1. Prepare your dataset (CSV format)
# 2. Upload to service
curl -X POST http://localhost:8002/api/v1/train/upload-dataset \
  -F "file=@disease_symptoms.csv"

# 3. Verify upload
curl http://localhost:8002/api/v1/train/status
```

### 2. Training Phase

```bash
# Train model
curl -X POST http://localhost:8002/api/v1/train/ \
  -H "Content-Type: application/json" \
  -d '{"dataset_path": "app/data/raw/disease_symptoms.csv"}'

# Model saved to: app/data/models/disease_model.pkl
```

### 3. Prediction Phase

```bash
# Get available symptoms
curl http://localhost:8002/api/v1/predict/symptoms

# Make prediction
curl -X POST http://localhost:8002/api/v1/predict/ \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["fever", "cough", "headache"]}'
```

---

## 🧪 Testing

### Manual Testing

```bash
# 1. Health check
curl http://localhost:8002/health

# 2. Try prediction (before training)
curl -X POST http://localhost:8002/api/v1/predict/ \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["fever"]}'
# Expected: Error - model not trained

# 3. Upload sample dataset
# 4. Train model
# 5. Try prediction again
# Expected: Success with disease prediction
```

### Python Testing

```python
import requests

# Base URL
BASE_URL = "http://localhost:8002"

# Health check
response = requests.get(f"{BASE_URL}/health")
print(response.json())

# Prediction
response = requests.post(
    f"{BASE_URL}/api/v1/predict/",
    json={"symptoms": ["fever", "cough", "headache", "fatigue"]}
)
print(response.json())
```

---

## 🔮 Next Steps

### Immediate (Current Sprint)

1. **Prepare Dataset**
   - Collect disease-symptom data
   - Format as CSV
   - Minimum 1000 rows recommended

2. **Train Initial Model**
   - Upload dataset via API
   - Train using /api/v1/train/ endpoint
   - Verify metrics (accuracy > 80%)

3. **Test Predictions**
   - Test with various symptom combinations
   - Verify confidence scores
   - Check alternative predictions

### Integration (Next Sprint)

1. **Frontend Integration**
   - Update DoctorRecommendation component
   - Call disease prediction API
   - Display predicted disease to user

2. **Backend Integration**
   - Create Django endpoint
   - Call disease prediction service
   - Map diseases to doctor specializations
   - Return recommended doctors

3. **Data Flow**
   ```
   User Symptoms (Frontend)
     → Django Backend
     → Disease Prediction Service (ML)
     → Disease Name
     → Doctor Specialization Mapping
     → Recommended Doctors
     → User (Frontend)
   ```

### Enhancement (Future)

1. **Multiple ML Models**
   - Support Vector Machine (SVM)
   - XGBoost
   - Neural Networks
   - Ensemble methods

2. **Advanced Features**
   - Symptom severity levels
   - Symptom duration tracking
   - Age/gender-specific predictions
   - Confidence threshold tuning

3. **Production Readiness**
   - Add authentication
   - Implement rate limiting
   - Add comprehensive logging
   - Docker containerization
   - CI/CD pipeline

---

## 🐛 Troubleshooting

### Issue: Module not found

```bash
# Activate virtual environment
cd disease-prediction-service
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: Port already in use

```bash
# Find process using port 8002
lsof -i :8002

# Kill process
kill -9 <PID>

# Or change port in .env
SERVICE_PORT=8003
```

### Issue: Model not loading

```bash
# Check if model file exists
ls -la app/data/models/

# Train new model
curl -X POST http://localhost:8002/api/v1/train/ \
  -H "Content-Type: application/json" \
  -d '{"dataset_path": "app/data/raw/disease_symptoms.csv"}'
```

---

## 📚 Resources

### API Documentation
- Swagger UI: http://localhost:8002/docs
- ReDoc: http://localhost:8002/redoc

### Code References
- FastAPI: https://fastapi.tiangolo.com/
- Scikit-learn: https://scikit-learn.org/
- Random Forest: https://scikit-learn.org/stable/modules/ensemble.html#forest

### Dataset Sources (for reference)
- Kaggle Disease-Symptom datasets
- UCI ML Repository
- Custom medical databases

---

## 🔐 Security Considerations

### Current (Development)
- No authentication (open endpoints)
- CORS: Allow all origins
- Debug mode enabled

### Production (Todo)
- Add JWT authentication
- Implement rate limiting
- Restrict CORS origins
- Disable debug mode
- Add input validation
- Implement API keys

---

## 📝 Code Examples

### Training Script

```python
import pandas as pd
import requests

# Prepare dataset
data = {
    'disease': ['Common Cold', 'Influenza', 'Malaria'],
    'fever': [1, 1, 1],
    'cough': [1, 1, 0],
    'headache': [1, 1, 1],
    'fatigue': [1, 1, 1]
}
df = pd.DataFrame(data)
df.to_csv('disease_symptoms.csv', index=False)

# Upload
with open('disease_symptoms.csv', 'rb') as f:
    response = requests.post(
        'http://localhost:8002/api/v1/train/upload-dataset',
        files={'file': f}
    )
print(response.json())

# Train
response = requests.post(
    'http://localhost:8002/api/v1/train/',
    json={'dataset_path': 'app/data/raw/disease_symptoms.csv'}
)
print(response.json())
```

### Prediction Script

```python
import requests

# Predict
symptoms = ["fever", "cough", "headache", "fatigue"]
response = requests.post(
    'http://localhost:8002/api/v1/predict/',
    json={'symptoms': symptoms}
)

result = response.json()
if result['success']:
    prediction = result['prediction']
    print(f"Disease: {prediction['disease']}")
    print(f"Confidence: {prediction['confidence']:.2%}")
    print("\nAlternatives:")
    for alt in prediction['alternative_diseases']:
        print(f"  - {alt['disease']}: {alt['confidence']:.2%}")
```

---

## ✅ Completion Checklist

### Service Setup
- [x] Directory structure created
- [x] Virtual environment set up
- [x] Dependencies installed
- [x] Configuration files created
- [x] Startup script created

### Core Implementation
- [x] FastAPI app structure
- [x] Configuration management
- [x] Pydantic schemas defined
- [x] ML model class implemented
- [x] Training utilities created

### API Endpoints
- [x] Health check endpoint
- [x] Prediction endpoint
- [x] Training endpoint
- [x] Upload dataset endpoint
- [x] Get symptoms endpoint
- [x] Training status endpoint

### Documentation
- [x] README.md with complete guide
- [x] API documentation (auto-generated)
- [x] Code comments and docstrings
- [x] Implementation guide (this document)

### Ready for Next Phase
- [ ] Prepare training dataset
- [ ] Train initial model
- [ ] Test predictions
- [ ] Integrate with frontend
- [ ] Integrate with backend

---

**Service Status**: ✅ Structure Complete  
**Ready For**: Dataset Preparation & Model Training  
**Next Action**: Prepare disease-symptom CSV dataset  

---

**Created**: January 3, 2026  
**Last Updated**: January 3, 2026  
**Version**: 1.0.0  
**Port**: 8002
