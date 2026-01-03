# Disease Prediction Service

A FastAPI microservice for ML-based disease prediction from symptoms using scikit-learn.

---

## 📋 Overview

This service provides RESTful APIs for:
- **Disease Prediction**: Predict diseases based on input symptoms
- **Model Training**: Train ML models on custom datasets
- **Model Management**: Load, save, and manage trained models

---

## 🏗️ Architecture

```
disease-prediction-service/
├── app/
│   ├── api/
│   │   └── routes/
│   │       ├── health.py          # Health check endpoints
│   │       ├── prediction.py      # Prediction endpoints
│   │       └── training.py        # Training endpoints
│   ├── core/
│   │   └── config.py              # Configuration settings
│   ├── ml/
│   │   ├── model.py               # ML model class
│   │   └── training.py            # Training utilities
│   ├── schemas/
│   │   └── prediction.py          # Pydantic schemas
│   └── data/
│       ├── raw/                   # Raw training data
│       ├── processed/             # Processed datasets
│       └── models/                # Trained model files
├── tests/                         # Unit tests
├── main.py                        # FastAPI application
├── requirements.txt               # Python dependencies
├── .env                           # Environment variables
└── README.md                      # This file
```

---

## 🚀 Quick Start

### 1. Setup Virtual Environment

```bash
# Navigate to service directory
cd disease-prediction-service

# Virtual environment already created
# Activate it
source venv/bin/activate

# Verify installation
python -c "import fastapi; print('FastAPI installed successfully')"
```

### 2. Start the Service

```bash
# Using Python
python main.py

# Or using Uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8002 --reload
```

### 3. Access API Documentation

- **Swagger UI**: http://localhost:8002/docs
- **ReDoc**: http://localhost:8002/redoc
- **Health Check**: http://localhost:8002/health

---

## 📡 API Endpoints

### Health Check
```http
GET /health
```
Returns service health status and model information.

### Predict Disease
```http
POST /api/v1/predict/
Content-Type: application/json

{
  "symptoms": ["fever", "cough", "headache", "fatigue"]
}
```

**Response:**
```json
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

### Get Available Symptoms
```http
GET /api/v1/predict/symptoms
```
Returns list of symptoms the model recognizes.

### Train Model
```http
POST /api/v1/train/
Content-Type: application/json

{
  "dataset_path": "app/data/raw/disease_symptoms.csv",
  "model_params": {
    "n_estimators": 100,
    "max_depth": 10
  }
}
```

**Response:**
```json
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

### Upload Training Dataset
```http
POST /api/v1/train/upload-dataset
Content-Type: multipart/form-data

file: <CSV file>
```

### Get Training Status
```http
GET /api/v1/train/status
```

---

## 🤖 ML Model

### Algorithm
- **Random Forest Classifier** (sklearn)
- Default: 100 estimators
- Multi-class classification

### Features
- Binary encoding of symptoms (presence/absence)
- Supports multiple symptoms as input
- Returns confidence scores for predictions
- Provides alternative disease predictions

### Model Files
Trained models are saved as `.pkl` files in `app/data/models/`:
- Model object
- Label encoders
- Feature names
- Version metadata

---

## 📊 Dataset Format

### Training Data CSV Format

```csv
disease,symptom1,symptom2,symptom3,...
Common Cold,1,1,0,...
Influenza,1,1,1,...
Malaria,1,0,1,...
```

**Requirements:**
- First column: `disease` (target variable)
- Remaining columns: Symptom names
- Values: Binary (0 = absent, 1 = present)
- No missing values in disease column

### Example Dataset Structure

| disease      | fever | cough | headache | fatigue | nausea |
|--------------|-------|-------|----------|---------|--------|
| Common Cold  | 1     | 1     | 1        | 1       | 0      |
| Influenza    | 1     | 1     | 1        | 1       | 1      |
| Malaria      | 1     | 0     | 1        | 1       | 1      |
| Dengue       | 1     | 0     | 1        | 1       | 1      |

---

## 🛠️ Configuration

Edit `.env` file:

```env
# Service Configuration
SERVICE_NAME=disease-prediction-service
SERVICE_HOST=0.0.0.0
SERVICE_PORT=8002
DEBUG=True

# Model Configuration
MODEL_PATH=app/data/models/disease_model.pkl
MODEL_VERSION=1.0.0

# ML Configuration
TEST_SIZE=0.2
RANDOM_STATE=42
N_ESTIMATORS=100
```

---

## 🧪 Testing

### Manual Testing with curl

```bash
# Health check
curl http://localhost:8002/health

# Predict disease
curl -X POST http://localhost:8002/api/v1/predict/ \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["fever", "cough", "headache"]}'

# Get symptoms
curl http://localhost:8002/api/v1/predict/symptoms

# Training status
curl http://localhost:8002/api/v1/train/status
```

### Testing with Python

```python
import requests

# Prediction
response = requests.post(
    "http://localhost:8002/api/v1/predict/",
    json={"symptoms": ["fever", "cough", "headache", "fatigue"]}
)
print(response.json())
```

---

## 📦 Dependencies

Key packages installed:
- **FastAPI**: Web framework
- **Uvicorn**: ASGI server
- **Scikit-learn**: ML algorithms
- **Pandas**: Data manipulation
- **NumPy**: Numerical computing
- **Pydantic**: Data validation
- **Joblib**: Model serialization
- **Matplotlib/Seaborn**: Visualization (for analysis)

See `requirements.txt` for complete list.

---

## 🔧 Development

### Project Structure

```
app/
├── api/routes/          # API endpoint definitions
├── core/                # Core configuration
├── ml/                  # ML model and training logic
├── schemas/             # Pydantic models
└── data/               # Data storage
    ├── raw/            # Raw training datasets
    ├── processed/      # Preprocessed data
    └── models/         # Saved model files
```

### Adding New Features

1. **New Endpoint**: Add route in `app/api/routes/`
2. **New Schema**: Define in `app/schemas/`
3. **New ML Logic**: Extend `app/ml/model.py`
4. **Configuration**: Update `app/core/config.py`

### Model Training Workflow

1. Prepare dataset in CSV format
2. Upload via `/api/v1/train/upload-dataset`
3. Train model via `/api/v1/train/`
4. Model automatically saved to `app/data/models/`
5. Use prediction endpoints immediately

---

## 🐛 Troubleshooting

### Model not found
```
Error: Model not loaded. Train or load a model first.
```
**Solution**: Train a model or provide a trained model file.

### Import errors
```
Error: ModuleNotFoundError: No module named 'X'
```
**Solution**: Ensure virtual environment is activated and dependencies installed:
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Port already in use
```
Error: Address already in use
```
**Solution**: Change port in `.env` or kill existing process:
```bash
lsof -i :8002
kill -9 <PID>
```

---

## 🔮 Next Steps

### Phase 1: Model Development (Current)
- ✅ Service structure created
- ✅ API endpoints defined
- ✅ ML model class implemented
- ⏳ Prepare training dataset
- ⏳ Train initial model
- ⏳ Test predictions

### Phase 2: Enhancement
- Add more ML algorithms (SVM, XGBoost, Neural Networks)
- Implement model versioning
- Add model performance monitoring
- Create model comparison endpoints
- Implement cross-validation

### Phase 3: Integration
- Connect with frontend (symptom input from user)
- Integrate with main backend (doctor recommendations)
- Add database for prediction history
- Implement caching for faster predictions

### Phase 4: Production
- Add authentication
- Implement rate limiting
- Add logging and monitoring
- Docker containerization
- CI/CD pipeline

---

## 📚 Documentation

### API Documentation
- Swagger UI: http://localhost:8002/docs
- ReDoc: http://localhost:8002/redoc

### Code Documentation
- Docstrings in all modules
- Type hints for better IDE support
- Inline comments for complex logic

---

## 🤝 Contributing

When adding features:
1. Follow existing code structure
2. Add appropriate schemas in `app/schemas/`
3. Document API endpoints
4. Add error handling
5. Update this README

---

## 📝 License

Part of the SHS (Intelligent Doctor Recommendation System) project.

---

## 📞 Support

For issues or questions:
1. Check API documentation at `/docs`
2. Review logs for error messages
3. Verify dataset format
4. Ensure all dependencies installed

---

**Service Status**: ✅ Ready for Development  
**Current Phase**: Structure Complete - Ready for Model Training  
**Next Action**: Prepare training dataset and train initial model  

---

**Last Updated**: January 3, 2026  
**Version**: 1.0.0  
**Port**: 8002
