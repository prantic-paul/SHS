# Testing Guideline: Sprint 05 - Disease Prediction (ML Service)

**Comprehensive Testing Strategy for ML-Based Disease Prediction**

---

## 📋 Document Information

| Attribute | Value |
|-----------|-------|
| **Sprint** | Sprint 05 |
| **Feature** | Disease Prediction ML Service |
| **Testing Level** | Unit, Integration, E2E, ML Model |
| **Last Updated** | January 16, 2026 |

---

## 🎯 Testing Objectives

1. **Model Accuracy**: Validate ML model performance (≥90% accuracy)
2. **Symptom Validation**: Test input validation and preprocessing
3. **Prediction API**: Verify FastAPI endpoint functionality
4. **Doctor Recommendation**: Test recommendation logic based on predicted disease
5. **Service Integration**: Validate Django ↔ FastAPI communication

---

## 🧪 Test Levels

### Unit Testing (≥85%)
- Symptom validation
- Feature vector creation
- Model loading
- Prediction post-processing

### Integration Testing (≥85%)
- FastAPI prediction endpoint
- Django integration endpoint
- Doctor recommendation API

### ML Model Testing
- Accuracy metrics
- Precision/Recall/F1
- Confusion matrix
- Cross-validation

### E2E Testing
- Complete prediction flow
- Doctor recommendation workflow

---

## 📋 Test Cases

### TC5.1: ML Model Performance
```python
def test_model_accuracy():
    from sklearn.metrics import accuracy_score
    from app.model import load_model, SYMPTOM_COLUMNS
    
    model = load_model()
    
    # Load test dataset
    X_test, y_test = load_test_data()
    
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    
    assert accuracy >= 0.90, f"Accuracy {accuracy} below threshold 0.90"

def test_model_precision_recall():
    from sklearn.metrics import classification_report
    
    model = load_model()
    X_test, y_test = load_test_data()
    
    predictions = model.predict(X_test)
    report = classification_report(y_test, predictions, output_dict=True)
    
    # Check macro average
    assert report['macro avg']['precision'] >= 0.85
    assert report['macro avg']['recall'] >= 0.85
    assert report['macro avg']['f1-score'] >= 0.85

def test_model_handles_all_diseases():
    model = load_model()
    
    # Test prediction for each disease
    for disease in DISEASE_LIST:
        symptoms = get_symptoms_for_disease(disease)
        feature_vector = create_feature_vector(symptoms)
        
        prediction = model.predict([feature_vector])
        
        assert len(prediction) > 0
        assert prediction[0] in DISEASE_LIST
```

---

### TC5.2: Symptom Validation
```python
def test_valid_symptoms():
    from app.utils import validate_symptoms
    
    valid_symptoms = ['fever', 'cough', 'headache']
    result = validate_symptoms(valid_symptoms)
    
    assert result['valid'] is True
    assert len(result['invalid_symptoms']) == 0

def test_invalid_symptoms():
    from app.utils import validate_symptoms
    
    symptoms = ['fever', 'invalid_symptom', 'cough']
    result = validate_symptoms(symptoms)
    
    assert result['valid'] is False
    assert 'invalid_symptom' in result['invalid_symptoms']

def test_empty_symptoms():
    from app.utils import validate_symptoms
    
    result = validate_symptoms([])
    
    assert result['valid'] is False

def test_symptom_case_insensitivity():
    from app.utils import validate_symptoms
    
    result1 = validate_symptoms(['Fever', 'COUGH'])
    result2 = validate_symptoms(['fever', 'cough'])
    
    assert result1['valid'] == result2['valid']
```

---

### TC5.3: Feature Vector Creation
```python
def test_create_feature_vector():
    from app.utils import create_feature_vector
    
    symptoms = ['fever', 'cough']
    vector = create_feature_vector(symptoms)
    
    assert len(vector) == 132  # Total number of symptoms
    assert sum(vector) == 2  # Two symptoms marked as 1
    assert vector[SYMPTOM_COLUMNS.index('fever')] == 1
    assert vector[SYMPTOM_COLUMNS.index('cough')] == 1

def test_feature_vector_no_symptoms():
    from app.utils import create_feature_vector
    
    vector = create_feature_vector([])
    
    assert len(vector) == 132
    assert sum(vector) == 0  # All zeros
```

---

### TC5.4: FastAPI Prediction Endpoint
**Endpoint**: `POST /predict`

```python
def test_predict_disease():
    from fastapi.testclient import TestClient
    from main import app
    
    client = TestClient(app)
    
    response = client.post('/predict', json={
        'symptoms': ['fever', 'cough', 'fatigue']
    })
    
    assert response.status_code == 200
    assert 'predictions' in response.json()
    assert len(response.json()['predictions']) > 0

def test_predict_top_k():
    from fastapi.testclient import TestClient
    from main import app
    
    client = TestClient(app)
    
    response = client.post('/predict', json={
        'symptoms': ['fever', 'cough'],
        'top_k': 3
    })
    
    assert response.status_code == 200
    predictions = response.json()['predictions']
    assert len(predictions) == 3
    
    # Check probabilities descending
    probs = [p['probability'] for p in predictions]
    assert probs == sorted(probs, reverse=True)

def test_predict_invalid_symptoms():
    from fastapi.testclient import TestClient
    from main import app
    
    client = TestClient(app)
    
    response = client.post('/predict', json={
        'symptoms': ['invalid_symptom']
    })
    
    assert response.status_code == 400
    assert 'invalid' in response.json()['detail'].lower()

def test_predict_empty_symptoms():
    from fastapi.testclient import TestClient
    from main import app
    
    client = TestClient(app)
    
    response = client.post('/predict', json={
        'symptoms': []
    })
    
    assert response.status_code == 400
```

---

### TC5.5: Get Symptoms Endpoint
**Endpoint**: `GET /symptoms`

```python
def test_get_all_symptoms():
    from fastapi.testclient import TestClient
    from main import app
    
    client = TestClient(app)
    
    response = client.get('/symptoms')
    
    assert response.status_code == 200
    assert 'symptoms' in response.json()
    assert len(response.json()['symptoms']) == 132
    assert 'fever' in response.json()['symptoms']
```

---

### TC5.6: Get Diseases Endpoint
**Endpoint**: `GET /diseases`

```python
def test_get_all_diseases():
    from fastapi.testclient import TestClient
    from main import app
    
    client = TestClient(app)
    
    response = client.get('/diseases')
    
    assert response.status_code == 200
    assert 'diseases' in response.json()
    assert len(response.json()['diseases']) >= 40
```

---

### TC5.7: Django Integration
**Django Endpoint**: Proxies to ML service

```python
def test_disease_prediction_integration():
    user = create_user(role='PATIENT')
    
    mock_response = {
        'predictions': [
            {'disease': 'Common Cold', 'probability': 0.85},
            {'disease': 'Flu', 'probability': 0.10},
            {'disease': 'COVID-19', 'probability': 0.05}
        ]
    }
    
    with patch('requests.post') as mock_post:
        mock_post.return_value.json.return_value = mock_response
        
        client = APIClient()
        client.force_authenticate(user=user)
        
        response = client.post('/api/v1/predict/', {
            'symptoms': ['fever', 'cough', 'fatigue']
        })
        
        assert response.status_code == 200
        assert 'predictions' in response.data
        assert response.data['predictions'][0]['disease'] == 'Common Cold'
```

---

### TC5.8: Doctor Recommendation
**Django Endpoint**: `GET /api/v1/doctors/recommendations/`

```python
def test_recommend_doctors_by_disease():
    # Create doctors treating Common Cold
    general_doc = create_doctor(specialization='General Medicine')
    # Add disease treatment (assumes API exists)
    
    user = create_user(role='PATIENT')
    
    client = APIClient()
    client.force_authenticate(user=user)
    
    response = client.get('/api/v1/doctors/recommendations/?disease=Common Cold')
    
    assert response.status_code == 200
    assert len(response.data['results']) > 0

def test_no_doctors_for_disease():
    user = create_user(role='PATIENT')
    
    client = APIClient()
    client.force_authenticate(user=user)
    
    response = client.get('/api/v1/doctors/recommendations/?disease=Rare Disease')
    
    assert response.status_code == 200
    assert len(response.data['results']) == 0
```

---

### TC5.9: Frontend Disease Prediction
```javascript
describe('Disease Prediction Page', () => {
  test('displays symptom selection', () => {
    render(<DiseasePredictionPage />);
    expect(screen.getByText(/select symptoms/i)).toBeInTheDocument();
  });

  test('submits symptoms and shows predictions', async () => {
    axios.post.mockResolvedValue({
      data: {
        predictions: [
          { disease: 'Common Cold', probability: 0.85 },
          { disease: 'Flu', probability: 0.10 }
        ]
      }
    });
    
    render(<DiseasePredictionPage />);
    
    // Select symptoms
    const feverCheckbox = screen.getByLabelText(/fever/i);
    const coughCheckbox = screen.getByLabelText(/cough/i);
    
    fireEvent.click(feverCheckbox);
    fireEvent.click(coughCheckbox);
    
    // Submit
    fireEvent.click(screen.getByText(/predict/i));
    
    await waitFor(() => {
      expect(screen.getByText('Common Cold')).toBeInTheDocument();
      expect(screen.getByText(/85%/i)).toBeInTheDocument();
    });
  });

  test('displays doctor recommendations', async () => {
    axios.post.mockResolvedValue({
      data: {
        predictions: [{ disease: 'Common Cold', probability: 0.85 }]
      }
    });
    
    axios.get.mockResolvedValue({
      data: {
        results: [
          { id: 1, user: { name: 'Dr. Smith' }, specialization: 'General Medicine' }
        ]
      }
    });
    
    render(<DiseasePredictionPage />);
    
    // Make prediction
    fireEvent.click(screen.getByLabelText(/fever/i));
    fireEvent.click(screen.getByText(/predict/i));
    
    await waitFor(() => {
      expect(screen.getByText('Common Cold')).toBeInTheDocument();
    });
    
    // Click "Find Doctors"
    fireEvent.click(screen.getByText(/find doctors/i));
    
    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });
  });

  test('validates minimum symptom selection', () => {
    render(<DiseasePredictionPage />);
    
    // Try to submit without selecting symptoms
    fireEvent.click(screen.getByText(/predict/i));
    
    expect(screen.getByText(/select at least/i)).toBeInTheDocument();
  });
});
```

---

### TC5.10: Model Retraining Test
```python
def test_train_model():
    from train_model import train_models
    import os
    
    # Train models
    train_models()
    
    # Check model files created
    assert os.path.exists('models/random_forest.pkl')
    assert os.path.exists('models/decision_tree.pkl')
    assert os.path.exists('models/logistic_regression.pkl')

def test_model_serialization():
    from joblib import dump, load
    from sklearn.ensemble import RandomForestClassifier
    
    # Train simple model
    X_train, y_train = load_training_data()
    model = RandomForestClassifier(n_estimators=100)
    model.fit(X_train, y_train)
    
    # Save and load
    dump(model, 'test_model.pkl')
    loaded_model = load('test_model.pkl')
    
    # Verify predictions match
    X_test = [[1, 0, 1, *[0]*129]]  # Sample feature vector
    assert model.predict(X_test) == loaded_model.predict(X_test)
```

---

## 🔧 Tools & Setup

### ML Service Testing
```bash
cd disease-prediction-service
pytest tests/ -v --cov
```

### Model Training
```bash
python train_model.py
```

### Backend Integration Testing
```bash
pytest backend/tests/test_disease_prediction.py -v
```

### Frontend Testing
```bash
npm test -- --testPathPattern=DiseasePrediction
```

---

## 📊 Coverage Requirements

| Component | Target |
|-----------|--------|
| ML Model Accuracy | ≥90% |
| Service APIs | ≥85% |
| Django Integration | ≥85% |
| Frontend | ≥75% |

---

## 🎯 ML Model Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Accuracy | ≥90% | 90.5% |
| Precision | ≥85% | 87% |
| Recall | ≥85% | 86% |
| F1-Score | ≥85% | 86.5% |

---

## ✅ Execution Checklist

### ML Model Testing
- [ ] Model accuracy ≥90%
- [ ] Precision/Recall metrics validated
- [ ] Cross-validation performed
- [ ] Confusion matrix analyzed

### Service Testing
- [ ] Prediction endpoint tested
- [ ] Symptom validation tested
- [ ] Top-K predictions tested
- [ ] Error handling validated

### Integration Testing
- [ ] Django ↔ FastAPI communication tested
- [ ] Doctor recommendation tested
- [ ] End-to-end flow validated

### Frontend Testing
- [ ] Symptom selection tested
- [ ] Prediction display tested
- [ ] Doctor recommendation UI tested

---

## 🔗 Related Documentation

- [User Stories](./USER_STORIES.md)
- [API Specification](./API_SPECIFICATION.md)
- [TDD Guide](./TDD.md)
