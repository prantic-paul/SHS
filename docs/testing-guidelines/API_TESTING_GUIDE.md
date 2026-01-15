# Disease Prediction API - Test Documentation

**Service**: Disease Prediction Microservice  
**Port**: 8002  
**Base URL**: http://localhost:8002  
**API Documentation**: http://localhost:8002/docs  
**Status**: ✅ RUNNING

---

## Model Information

- **Model Type**: Random Forest Classifier
- **Training Dataset**: Final_Augmented_dataset_Diseases_and_Symptoms.csv
- **Training Samples**: 50,000
- **Test Accuracy**: 93.74%
- **Precision**: 93.90%
- **Recall**: 93.74%
- **F1 Score**: 93.76%
- **Number of Diseases**: 773
- **Number of Symptoms**: 377

---

## API Endpoints

### 1. Root Endpoint

```bash
curl http://localhost:8002/
```

**Response**:
```json
{
    "service": "Disease Prediction Service",
    "version": "1.0.0",
    "status": "running",
    "docs": "/docs",
    "health": "/health"
}
```

---

### 2. Health Check

**Endpoint**: `GET /health`

```bash
curl http://localhost:8002/health
```

**Response**:
```json
{
    "status": "healthy",
    "service": "disease-prediction-service",
    "version": "1.0.0",
    "model_loaded": true
}
```

---

### 3. Model Status

**Endpoint**: `GET /api/v1/train/status`

```bash
curl http://localhost:8002/api/v1/train/status
```

**Response**:
```json
{
    "model_loaded": true,
    "message": "Model is loaded and ready",
    "model_path": "app/data/models/disease_model.pkl",
    "model_version": "1.0.0",
    "n_diseases": 773,
    "n_symptoms": 377,
    "model_type": "Random Forest"
}
```

---

### 4. Get All Symptoms

**Endpoint**: `GET /api/v1/predict/symptoms`

```bash
curl http://localhost:8002/api/v1/predict/symptoms
```

**Response**:
```json
{
    "success": true,
    "symptoms": [
        "anxiety and nervousness",
        "depression",
        "shortness of breath",
        "depressive or psychotic symptoms",
        "sharp chest pain",
        "dizziness",
        "insomnia",
        "..."
    ],
    "total": 377
}
```

---

### 5. Predict Disease (Main Endpoint)

**Endpoint**: `POST /api/v1/predict/`

**Request Body**:
```json
{
    "symptoms": [
        "symptom1",
        "symptom2",
        "symptom3"
    ]
}
```

---

## Test Cases

### Test Case 1: Panic Disorder

```bash
curl -X POST http://localhost:8002/api/v1/predict/ \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": [
        "anxiety and nervousness",
        "shortness of breath",
        "depressive or psychotic symptoms"
    ]
}'
```

**Expected Response**:
```json
{
    "success": true,
    "message": "Prediction successful",
    "prediction": {
        "disease": "panic disorder",
        "confidence": 0.46,
        "alternative_diseases": [
            {
                "disease": "abdominal hernia",
                "confidence": 0.31
            },
            {
                "disease": "congenital malformation syndrome",
                "confidence": 0.165
            }
        ],
        "matched_symptoms": [
            "anxiety and nervousness",
            "shortness of breath",
            "depressive or psychotic symptoms"
        ],
        "unmatched_symptoms": [],
        "total_symptoms": 3
    }
}
```

✅ **Result**: PASSED  
✅ **Confidence**: 46%  
✅ **Alternatives**: 2 diseases provided

---

### Test Case 2: Mononucleosis

```bash
curl -X POST http://localhost:8002/api/v1/predict/ \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": [
        "fever",
        "cough",
        "headache",
        "fatigue"
    ]
}'
```

**Expected Response**:
```json
{
    "success": true,
    "message": "Prediction successful",
    "prediction": {
        "disease": "mononucleosis",
        "confidence": 0.66,
        "alternative_diseases": [
            {
                "disease": "cold sore",
                "confidence": 0.24
            },
            {
                "disease": "alcohol withdrawal",
                "confidence": 0.05
            }
        ],
        "matched_symptoms": [
            "fever",
            "cough",
            "headache",
            "fatigue"
        ],
        "unmatched_symptoms": [],
        "total_symptoms": 4
    }
}
```

✅ **Result**: PASSED  
✅ **Confidence**: 66%  
✅ **Alternatives**: 2 diseases provided

---

### Test Case 3: Invalid Symptom

```bash
curl -X POST http://localhost:8002/api/v1/predict/ \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": [
        "fake symptom that doesnt exist"
    ]
}'
```

**Expected Response**:
```json
{
    "detail": "None of the provided symptoms are recognized"
}
```

✅ **Result**: Proper error handling

---

### Test Case 4: Mixed Valid/Invalid Symptoms

```bash
curl -X POST http://localhost:8002/api/v1/predict/ \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": [
        "fever",
        "not a real symptom",
        "headache"
    ]
}'
```

**Expected Behavior**:
- Should use only "fever" and "headache"
- Should list "not a real symptom" in `unmatched_symptoms`
- Should still make a prediction

---

## Python Client Example

```python
import requests

# Base URL
BASE_URL = "http://localhost:8002"

# 1. Check health
response = requests.get(f"{BASE_URL}/health")
print("Health:", response.json())

# 2. Get model status
response = requests.get(f"{BASE_URL}/api/v1/train/status")
print("Model Status:", response.json())

# 3. Get available symptoms
response = requests.get(f"{BASE_URL}/api/v1/predict/symptoms")
symptoms_data = response.json()
print(f"Available symptoms: {symptoms_data['total']}")

# 4. Make a prediction
symptoms = [
    "anxiety and nervousness",
    "shortness of breath",
    "depressive or psychotic symptoms"
]

response = requests.post(
    f"{BASE_URL}/api/v1/predict/",
    json={"symptoms": symptoms}
)

result = response.json()
if result['success']:
    prediction = result['prediction']
    print(f"\nDisease: {prediction['disease']}")
    print(f"Confidence: {prediction['confidence']*100:.2f}%")
    print(f"Matched Symptoms: {prediction['matched_symptoms']}")
    
    print("\nAlternative Predictions:")
    for alt in prediction['alternative_diseases']:
        print(f"  - {alt['disease']}: {alt['confidence']*100:.2f}%")
```

---

## JavaScript/Frontend Example

```javascript
// Base URL
const BASE_URL = "http://localhost:8002";

// Function to predict disease
async function predictDisease(symptoms) {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/predict/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ symptoms: symptoms })
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('Disease:', data.prediction.disease);
            console.log('Confidence:', data.prediction.confidence);
            console.log('Alternatives:', data.prediction.alternative_diseases);
            return data.prediction;
        } else {
            console.error('Prediction failed:', data.message);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Example usage
const symptoms = [
    "fever",
    "cough",
    "headache",
    "fatigue"
];

predictDisease(symptoms).then(result => {
    if (result) {
        console.log('Predicted Disease:', result.disease);
    }
});

// Get all available symptoms
async function getAllSymptoms() {
    const response = await fetch(`${BASE_URL}/api/v1/predict/symptoms`);
    const data = await response.json();
    return data.symptoms;
}
```

---

## Integration with Frontend (DoctorRecommendation Component)

**File**: `frontend/src/components/DoctorRecommendation.jsx`

**Steps to integrate**:

1. Add disease prediction API call after symptom selection:

```javascript
// In DoctorRecommendation.jsx

const predictDisease = async (symptoms) => {
    try {
        const response = await fetch('http://localhost:8002/api/v1/predict/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ symptoms: symptoms })
        });
        
        const data = await response.json();
        
        if (data.success) {
            return data.prediction;
        }
        return null;
    } catch (error) {
        console.error('Disease prediction error:', error);
        return null;
    }
};

// In handleSubmit function
const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) {
        alert('Please select at least one symptom');
        return;
    }
    
    // Call disease prediction API
    const prediction = await predictDisease(selectedSymptoms);
    
    if (prediction) {
        console.log('Predicted Disease:', prediction.disease);
        console.log('Confidence:', prediction.confidence);
        
        // Now send to Django backend with disease info
        const response = await fetch('/api/recommend-doctor/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                symptoms: selectedSymptoms,
                predicted_disease: prediction.disease,
                confidence: prediction.confidence
            })
        });
        
        // Handle response...
    }
};
```

---

## Performance Metrics

### Model Training
- **Training Time**: ~12 seconds
- **Model Size**: ~4.5 MB (disease_model.pkl)
- **Memory Usage**: ~150 MB during training

### API Performance
- **Health Check**: < 5ms
- **Prediction**: ~50-100ms
- **Get Symptoms**: < 10ms
- **Model Load**: ~1-2 seconds (first time)

---

## Error Handling

### 1. Model Not Trained
```bash
curl -X POST http://localhost:8002/api/v1/predict/ \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["fever"]}'
```
**Response** (if model not loaded):
```json
{
    "detail": "Model not trained yet. Please train the model first using /api/v1/train/ endpoint"
}
```

### 2. Empty Symptoms List
```bash
curl -X POST http://localhost:8002/api/v1/predict/ \
  -H "Content-Type: application/json" \
  -d '{"symptoms": []}'
```
**Response**:
```json
{
    "detail": [
        {
            "type": "too_short",
            "loc": ["body", "symptoms"],
            "msg": "List should have at least 1 item after validation"
        }
    ]
}
```

### 3. Invalid Symptoms
```bash
curl -X POST http://localhost:8002/api/v1/predict/ \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["xyz", "abc"]}'
```
**Response**:
```json
{
    "detail": "None of the provided symptoms are recognized"
}
```

---

## Next Steps

### ✅ Completed
1. Model trained with 93.74% accuracy
2. API endpoints implemented and tested
3. Health check working
4. Prediction working with confidence scores
5. Alternative predictions provided
6. Error handling implemented

### ⏳ To Do (User will decide)
1. **Frontend Integration**: Connect DoctorRecommendation component to this API
2. **Django Backend**: Create endpoint to receive disease prediction and recommend doctors
3. **Doctor Mapping**: Map diseases to doctor specializations
4. **Authentication**: Add JWT authentication to API endpoints (if needed)
5. **Rate Limiting**: Add API rate limiting for production
6. **Logging**: Implement structured logging
7. **Monitoring**: Add health metrics and monitoring

---

## Service Management

### Start Service
```bash
cd /home/prantic/SHS/disease-prediction-service
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8002

# Or use the full path:
/home/prantic/SHS/disease-prediction-service/venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8002
```

### Stop Service
```bash
pkill -f "uvicorn main:app"
```

### Check Service Status
```bash
curl http://localhost:8002/health

# Or check if port is in use:
lsof -i :8002
```

### View Logs
```bash
tail -f /tmp/disease-service.log
```

---

## API Documentation

**Interactive Swagger UI**: http://localhost:8002/docs  
**ReDoc**: http://localhost:8002/redoc

---

**Created**: January 3, 2026  
**Last Updated**: January 3, 2026  
**Status**: ✅ Production Ready (API Only)  
**Next**: Frontend Integration (When User Requests)
