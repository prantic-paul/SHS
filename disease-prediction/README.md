# 🧬 SHS Disease Prediction Service (FastAPI + ML)

## Overview
Machine Learning service for disease prediction based on patient symptoms using trained ML models. Provides fast, accurate disease predictions to assist in medical diagnosis.

## 🛠️ Technology Stack
- **Framework**: FastAPI
- **ML Library**: Scikit-learn, TensorFlow/PyTorch
- **Models**: Random Forest, SVM, Neural Networks
- **Python**: 3.10+

## ✨ Key Features
- 🎯 **Disease Prediction** - ML-based diagnosis from symptoms
- 🔢 **Confidence Scores** - Probability scores for each prediction
- 📊 **Multiple Models** - Ensemble of ML algorithms
- ⚡ **Fast Inference** - Optimized for quick predictions
- 📈 **Model Versioning** - Track and update models

---

## 📋 Prerequisites

- **Python 3.10 or higher**
- **pip** (Python package manager)
- **4GB+ RAM** (for model loading)

---

## 🚀 Installation & Setup

### 1. Navigate to Service Directory
```bash
cd SHS/disease-prediction
```

### 2. Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows
```

### 3. Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Environment Configuration

Create `.env` file:

```env
# Service Configuration
SERVICE_HOST=0.0.0.0
SERVICE_PORT=8002

# Model Configuration
MODEL_PATH=./models
MODEL_VERSION=v1.0
USE_GPU=False

# Backend Service
BACKEND_URL=http://localhost:8000

# Logging
LOG_LEVEL=INFO
```

### 5. Download/Train Models

```bash
# If models are provided
python scripts/load_models.py

# Or train new models
python scripts/train_models.py --dataset data/symptoms_dataset.csv
```

### 6. Run Development Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8002

# Server runs at: http://127.0.0.1:8002
# API Docs: http://127.0.0.1:8002/docs
```

---

## 📡 API Endpoints

### Health Check
```http
GET /health
```

### Predict Disease
```http
POST /api/v1/predict/
Content-Type: application/json

{
  "symptoms": ["fever", "cough", "fatigue", "headache"]
}
```

**Response:**
```json
{
  "predicted_disease": "Common Cold",
  "confidence": 0.87,
  "alternative_predictions": [
    {"disease": "Flu", "confidence": 0.72},
    {"disease": "COVID-19", "confidence": 0.65}
  ],
  "recommended_action": "Consult a General Physician"
}
```

### List Available Symptoms
```http
GET /api/v1/symptoms/
```

---

## 📁 Project Structure

```
disease-prediction/
├── main.py                 # FastAPI application
├── predictor.py           # ML prediction logic
├── models/                # Trained ML models
│   ├── random_forest.pkl
│   ├── svm_model.pkl
│   └── scaler.pkl
├── data/                  # Training datasets
├── scripts/
│   ├── train_models.py   # Model training
│   └── load_models.py    # Load pretrained models
├── requirements.txt      # Dependencies
├── .env                  # Environment variables
└── README.md             # This file
```

---

## 🧪 Testing

```bash
# Test prediction endpoint
curl -X POST http://localhost:8002/api/v1/predict/ \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": ["fever", "cough", "headache"]
  }'
```

---

## 🚢 Deployment

### Using Systemd Service

Create `/etc/systemd/system/shs-disease-prediction.service`:

```ini
[Unit]
Description=SHS Disease Prediction Service
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/SHS/disease-prediction
Environment="PATH=/var/www/SHS/disease-prediction/venv/bin"
ExecStart=/var/www/SHS/disease-prediction/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8002

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable shs-disease-prediction
sudo systemctl start shs-disease-prediction
```

---

## 🐛 Troubleshooting

### Model Loading Error
```bash
# Check model files exist
ls -lh models/

# Re-download models
python scripts/load_models.py --force
```

### Low Prediction Accuracy
```bash
# Retrain with more data
python scripts/train_models.py --dataset data/expanded_dataset.csv --epochs 100
```

---

## 📚 Model Information

### Current Models
- **Random Forest**: Accuracy 89%, Best for general symptoms
- **SVM**: Accuracy 85%, Best for specific patterns
- **Neural Network**: Accuracy 91%, Best overall (slower)

### Supported Diseases
100+ diseases including:
- Common Cold, Flu, COVID-19
- Diabetes, Hypertension
- Asthma, Bronchitis
- And more...

---

## 🔒 Security

- Input validation for all symptoms
- Rate limiting on prediction endpoint
- Model versioning and rollback capability

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Scikit-learn](https://scikit-learn.org/)
- [Model Training Guide](./docs/training.md)

---

**Last Updated:** January 6, 2026  
**Maintained by:** SHS Development Team
