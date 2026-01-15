# Sprint 5: Disease Prediction & Doctor Recommendation - API Specification

**Version**: 1.0  
**ML Service Base URL**: `http://localhost:8002`  
**Backend Base URL**: `http://localhost:8000/api/v1`

---

## 🔬 ML Service Endpoints (FastAPI)

### 1. Predict Disease
**Endpoint**: `POST /predict`  
**Description**: Predict diseases based on symptoms

**Request Body**:
```json
{
  "symptoms": [
    "headache",
    "fever",
    "cough",
    "fatigue",
    "body_ache"
  ]
}
```

**Success Response** (200 OK):
```json
{
  "predictions": [
    {
      "disease": "Influenza",
      "confidence": 0.92,
      "probability": 92.0
    },
    {
      "disease": "Common Cold",
      "confidence": 0.78,
      "probability": 78.0
    },
    {
      "disease": "Viral Fever",
      "confidence": 0.65,
      "probability": 65.0
    }
  ],
  "model_used": "RandomForestClassifier",
  "accuracy": 90.5
}
```

**Error Responses**:
- `400 Bad Request`: Invalid symptoms
  ```json
  {
    "detail": "At least one symptom is required",
    "invalid_symptoms": ["unknown_symptom"]
  }
  ```

---

### 2. Get All Symptoms
**Endpoint**: `GET /symptoms`  
**Description**: Get list of all supported symptoms

**Success Response** (200 OK):
```json
{
  "symptoms": [
    "headache",
    "fever",
    "cough",
    "fatigue",
    "body_ache",
    "nausea",
    "vomiting",
    "diarrhea",
    ...
  ],
  "total_count": 132
}
```

---

### 3. Get All Diseases
**Endpoint**: `GET /diseases`  
**Description**: Get list of all predictable diseases

**Success Response** (200 OK):
```json
{
  "diseases": [
    "Influenza",
    "Common Cold",
    "Diabetes",
    "Hypertension",
    "Migraine",
    ...
  ],
  "total_count": 41
}
```

---

### 4. Health Check
**Endpoint**: `GET /health`  
**Description**: Check ML service health

**Success Response** (200 OK):
```json
{
  "status": "healthy",
  "service": "disease-prediction-ml",
  "version": "1.0.0",
  "models_loaded": true,
  "model_accuracy": 90.5
}
```

---

## 👨‍⚕️ Doctor Recommendation Endpoints (Django Backend)

### 5. Get Doctors by Disease
**Endpoint**: `GET /doctors/?disease=<disease_name>`  
**Description**: Get doctors who treat a specific disease  
**Authentication**: Optional

**Query Parameters**:
- `disease`: Disease name (required)
- `limit`: Number of results (optional, default: 10)

**Success Response** (200 OK):
```json
{
  "disease": "Diabetes",
  "doctors": [
    {
      "id": 5,
      "name": "Dr. Sarah Johnson",
      "specialization": "Endocrinology",
      "qualification": "MBBS, MD, DM",
      "experience_years": 15,
      "rating_avg": 4.8,
      "practice_location": "City Hospital",
      "treats_diseases": ["Diabetes", "Thyroid Disorders", "PCOS"],
      "bio": "Specialist in diabetes and hormonal disorders..."
    },
    {
      "id": 12,
      "name": "Dr. Michael Chen",
      "specialization": "Internal Medicine",
      "qualification": "MBBS, MD",
      "experience_years": 10,
      "rating_avg": 4.6,
      "practice_location": "Community Health Center",
      "treats_diseases": ["Diabetes", "Hypertension", "Heart Disease"]
    }
  ],
  "total_count": 2
}
```

---

### 6. Add Disease Treatment (Doctor)
**Endpoint**: `POST /doctors/{doctor_id}/add-disease-treatment/`  
**Description**: Add disease to doctor's expertise  
**Authentication**: Required (Bearer Token, Role: DOCTOR or ADMIN)

**Request Body**:
```json
{
  "diseases": ["Diabetes", "Hypertension", "Heart Disease"]
}
```

**Success Response** (200 OK):
```json
{
  "message": "Disease treatments updated successfully",
  "doctor_id": 5,
  "treats_diseases": ["Diabetes", "Hypertension", "Heart Disease"]
}
```

---

### 7. Get Doctor Profile with Diseases
**Endpoint**: `GET /doctors/{doctor_id}/`  
**Description**: Get doctor profile including disease expertise

**Success Response** (200 OK):
```json
{
  "id": 5,
  "name": "Dr. Sarah Johnson",
  "specialization": "Endocrinology",
  "qualification": "MBBS, MD, DM",
  "experience_years": 15,
  "rating_avg": 4.8,
  "practice_location": "City Hospital",
  "treats_diseases": ["Diabetes", "Thyroid Disorders", "PCOS"],
  "bio": "Specialist in diabetes and hormonal disorders...",
  "is_verified": true,
  "status": "APPROVED"
}
```

---

## 📝 Models Schema

### Disease Prediction Request
```python
{
  "symptoms": list[string]  # 1-10 symptoms
}
```

### Disease Prediction Response
```python
{
  "predictions": [
    {
      "disease": string,
      "confidence": float,  # 0-1
      "probability": float  # 0-100
    }
  ],
  "model_used": string,
  "accuracy": float
}
```

### Doctor Model (Extended)
```python
{
  "id": integer,
  "user": foreign_key(User),
  "specialization": string,
  "qualification": string,
  "experience_years": integer,
  "rating_avg": float,
  "practice_location": string,
  "treats_diseases": list[string],  # NEW FIELD
  "bio": text,
  "is_verified": boolean
}
```

---

## 🧪 Testing Examples

### Predict Disease with cURL
```bash
curl -X POST http://localhost:8002/predict \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": ["headache", "fever", "cough", "fatigue"]
  }'
```

### Get Recommended Doctors
```bash
curl -X GET "http://localhost:8000/api/v1/doctors/?disease=Diabetes"
```

### Add Disease Treatment (Doctor)
```bash
curl -X POST http://localhost:8000/api/v1/doctors/5/add-disease-treatment/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "diseases": ["Diabetes", "Hypertension"]
  }'
```

---

## ⚙️ ML Model Details

### Supported Algorithms
1. **Random Forest Classifier** (Primary)
   - Accuracy: 90.5%
   - Best for multi-class prediction
   
2. **Decision Tree Classifier**
   - Accuracy: 87.2%
   - Fast inference
   
3. **Logistic Regression**
   - Accuracy: 85.8%
   - Interpretable results

### Features
- **Input**: 132 binary symptom features
- **Output**: 41 disease classes
- **Training Data**: 4,920 samples
- **Test Accuracy**: 90.5%
- **Inference Time**: < 50ms

---

## 🔗 Related Documentation

- [User Stories](./USER_STORIES.md)
- [TDD Approach](./TDD.md)
