# AI Service - Machine Learning Service

This directory contains the AI/ML service for Smart Health Synchronizer's chatbot and recommendation system.

## 🚀 Quick Start

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run service
python main.py
```

## 📁 Structure

```
ai-service/
├── models/              # ML models
│   ├── symptom_analyzer.py
│   ├── doctor_recommender.py
│   └── trained_models/  # Saved model files
│
├── utils/               # Utility functions
│   ├── preprocessing.py
│   ├── feature_extraction.py
│   └── validators.py
│
├── api/                 # API endpoints
│   ├── routes.py
│   └── schemas.py
│
├── data/               # Training data and resources
│   ├── symptoms.json
│   ├── specialties.json
│   └── training/
│
├── tests/              # Test files
├── requirements.txt    # Dependencies
├── main.py            # Entry point
├── config.py          # Configuration
├── .env.example       # Environment variables template
└── README.md          # This file
```

## 🛠️ Technologies

- **FastAPI**: Web framework for APIs
- **scikit-learn**: Machine learning library
- **pandas**: Data manipulation
- **numpy**: Numerical computing
- **spaCy / transformers**: NLP (Natural Language Processing)
- **pydantic**: Data validation
- **uvicorn**: ASGI server

## 📝 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Service Configuration
SERVICE_HOST=0.0.0.0
SERVICE_PORT=8001
DEBUG=True

# Model Configuration
MODEL_PATH=models/trained_models/
CONFIDENCE_THRESHOLD=0.7

# API Keys (if needed)
OPENAI_API_KEY=your-key-here  # If using external APIs
```

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Test specific functionality
pytest tests/test_symptom_analyzer.py
```

## 🤖 Features

### 1. Symptom Analysis
- Natural language understanding of patient symptoms
- Severity assessment
- Preliminary condition identification

### 2. Doctor Recommendation
- Match symptoms to medical specialties
- Recommend appropriate doctors
- Consider location, ratings, and availability

### 3. Health Risk Prediction
- Analyze health metrics
- Predict potential health risks
- Provide preventive recommendations

## 📊 API Endpoints

Once the service is running, visit:
- API Documentation: `http://localhost:8001/docs`
- ReDoc: `http://localhost:8001/redoc`

### Example Endpoints

```python
# POST /analyze-symptoms
{
  "symptoms": ["headache", "fever", "cough"],
  "severity": "moderate",
  "duration": "3 days"
}

# Response
{
  "possible_conditions": [
    {"name": "Common Cold", "confidence": 0.85},
    {"name": "Flu", "confidence": 0.65}
  ],
  "recommended_specialties": ["General Physician", "Internal Medicine"],
  "severity_level": "moderate",
  "requires_immediate_attention": false
}
```

```python
# POST /recommend-doctors
{
  "specialty": "Cardiologist",
  "location": "New York",
  "symptoms": ["chest pain", "shortness of breath"]
}

# Response
{
  "doctors": [
    {
      "id": 123,
      "name": "Dr. Smith",
      "specialty": "Cardiology",
      "rating": 4.8,
      "match_score": 0.92
    }
  ]
}
```

## 🔧 Development

```bash
# Run development server with auto-reload
uvicorn main:app --reload --port 8001

# Run in production mode
uvicorn main:app --host 0.0.0.0 --port 8001

# Train models
python scripts/train_models.py

# Update training data
python scripts/update_data.py
```

## 📦 Key Dependencies

```
fastapi>=0.104.0
uvicorn>=0.24.0
pydantic>=2.5.0
scikit-learn>=1.3.0
pandas>=2.1.0
numpy>=1.24.0
spacy>=3.7.0
python-multipart>=0.0.6
```

## 🎯 Model Training

```python
# Example: Training symptom analyzer
from models.symptom_analyzer import SymptomAnalyzer

# Load training data
data = load_training_data('data/training/symptoms.csv')

# Initialize and train model
analyzer = SymptomAnalyzer()
analyzer.train(data)

# Save model
analyzer.save('models/trained_models/symptom_analyzer.pkl')

# Evaluate
accuracy = analyzer.evaluate(test_data)
print(f"Model Accuracy: {accuracy:.2f}")
```

## 🔐 Security Considerations

- Input validation with Pydantic
- Rate limiting for API endpoints
- API key authentication (if needed)
- Data sanitization
- Error handling without exposing internals

## 📈 Performance

- Response time: < 200ms for symptom analysis
- Concurrent requests: 100+ (with proper scaling)
- Model accuracy: > 85% for common conditions
- Caching: Redis for frequent queries

## 🚀 Coming Soon

This directory will be set up in Sprint 6 with:
- FastAPI service initialization
- ML models for symptom analysis
- Doctor recommendation engine
- NLP processing
- API endpoints
- Tests and documentation

Stay tuned! 🎉

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [scikit-learn Guide](https://scikit-learn.org/)
- [spaCy Documentation](https://spacy.io/)
