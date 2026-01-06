# 🧬 Disease Prediction Service

## Overview
Machine Learning service for disease prediction based on symptoms. Built with FastAPI and scikit-learn.

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.10+
- pip package manager

### 1. Navigate to Service Directory
```bash
cd disease-prediction-service
```

### 2. Create Virtual Environment
```bash
python3 -m venv venv

# Activate
# Linux/Mac:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configure Environment

Create `.env` file:
```env
SERVICE_PORT=8002
SERVICE_HOST=0.0.0.0
MODEL_PATH=./app/data/models
LOG_LEVEL=INFO
```

### 5. Train Model (First Time)
```bash
python train_model.py
```

### 6. Run Service
```bash
# Using start script
./start.sh

# Or with uvicorn
uvicorn main:app --host 0.0.0.0 --port 8002 --reload

# Server at: http://localhost:8002
# Docs: http://localhost:8002/docs
# Health: http://localhost:8002/health
```

---

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

### Predict Disease
```bash
POST /api/v1/predict/
Content-Type: application/json

{
  "symptoms": ["fever", "cough", "fatigue"]
}
```

**Response:**
```json
{
  "predicted_disease": "Common Cold",
  "confidence": 0.85,
  "alternatives": [
    {"disease": "Flu", "confidence": 0.72}
  ]
}
```

---

## 📁 Project Structure
```
disease-prediction-service/
├── app/
│   ├── api/routes/      # API endpoints
│   ├── ml/             # ML models
│   ├── core/           # Config
│   └── data/
│       ├── raw/        # Training data
│       └── models/     # Trained models
├── main.py             # FastAPI app
├── train_model.py      # Training script
└── requirements.txt    # Dependencies
```

---

## 🧪 Testing

```bash
# Test endpoint
curl -X POST http://localhost:8002/api/v1/predict/ \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["fever", "cough"]}'
```

---

## 🚢 Production Deployment

```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8002
```

---

## �� Troubleshooting

**Model Not Found:**
```bash
python train_model.py
```

**Port in Use:**
```bash
lsof -i :8002
kill -9 <PID>
```

---

## 📊 Model Info
- Algorithm: Random Forest
- Features: 132 symptoms
- Diseases: 41 common diseases
- Accuracy: ~92%

---

## 📚 Documentation
- API Docs: http://localhost:8002/docs
- [FastAPI](https://fastapi.tiangolo.com/)
- [scikit-learn](https://scikit-learn.org/)

---

**Last Updated:** January 6, 2026
