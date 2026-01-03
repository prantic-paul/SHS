# Doctor Recommendation System - Implementation Guide

## Overview
Complete implementation of a symptom-based disease prediction and doctor recommendation system.

## Architecture

### Flow Diagram
```
User Input Symptoms 
    ↓
Disease Prediction Service (Port 8002)
    ↓
Predicted Disease + Confidence
    ↓
Backend API (Port 8000)
    ↓
Search Doctors by diseases_treated field
    ↓
Return Recommended Doctors
    ↓
Display Results to User
```

## Database Schema

### Table: `users_doctorinformation`
**Field: `diseases_treated`**
- **Type**: TextField (TEXT in database)
- **Format**: Comma-separated disease names (e.g., "Diabetes,Hypertension,Obesity")
- **Nullable**: Yes (blank=True, default='')
- **Purpose**: Stores diseases that each doctor specializes in treating
- **Location**: `/home/prantic/SHS/backend/apps/users/models/doctor.py` (lines 141-145)

### Migrations Applied
- `0003_doctorinformation_diseases_treated.py` - Initial field addition
- `0004_add_diseases_treated_to_doctor.py` - Field migration

## Backend Implementation

### 1. API Endpoint: Doctor Recommendation
**File**: `/home/prantic/SHS/backend/apps/users/views/doctor_recommendation.py`

**Endpoint**: `POST /api/doctors/recommend/`

**Request Body**:
```json
{
  "disease": "Diabetes"
}
```

**Response**:
```json
{
  "disease": "Diabetes",
  "doctors": [
    {
      "id": 1,
      "user": {
        "full_name": "John Doe"
      },
      "specialization": "Endocrinology",
      "experience_years": 15,
      "diseases_treated": "Diabetes,Thyroid Disorders,Obesity",
      "rating_avg": 4.8,
      "city": "New York",
      "consultation_fee": 150.00
    }
  ],
  "count": 1
}
```

**Search Logic**:
- Case-insensitive search in `diseases_treated` field
- Filters only verified doctors (`is_verified=True`)
- Only approved doctors (`status='APPROVED'`)
- Only available doctors (`availability_status` in ['available', 'busy'])
- Ordered by rating (descending) and experience (descending)

**Route**: Added to `/home/prantic/SHS/backend/apps/users/urls.py`

## Disease Prediction Service

### 1. Predict Endpoint
**Endpoint**: `POST http://localhost:8002/predict`

**Request**:
```json
{
  "symptoms": ["fever", "cough", "headache"]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Prediction successful",
  "prediction": {
    "disease": "Common Cold",
    "confidence": 0.95,
    "alternatives": [
      {"disease": "Flu", "confidence": 0.78},
      {"disease": "COVID-19", "confidence": 0.65}
    ]
  }
}
```

### 2. Symptoms List Endpoint
**Endpoint**: `GET http://localhost:8002/symptoms`

**Response**:
```json
{
  "success": true,
  "symptoms": [
    "fever",
    "cough",
    "headache",
    "..."
  ],
  "total": 377
}
```

**File**: `/home/prantic/SHS/disease-prediction-service/app/api/routes/prediction.py`

## Frontend Implementation

### 1. Doctor Recommendation Page
**File**: `/home/prantic/SHS/frontend/src/pages/DoctorRecommendation.jsx`

**Features**:
- Multi-symptom input with autocomplete (from 377 available symptoms)
- Add/remove symptom fields dynamically
- "Get Doctor Recommendation" button
- Displays predicted disease with confidence score
- Shows recommended doctors with profiles
- Highlights matching disease in doctor's specialties
- Click on doctor card to view full profile
- Responsive design with gradient backgrounds

**Route**: `/doctor-recommendation` (Protected - requires login)

### 2. Navigation
**File**: `/home/prantic/SHS/frontend/src/components/Navbar.jsx`

Added new nav item:
```jsx
{ path: '/doctor-recommendation', label: 'Find Doctor', icon: Activity }
```

### 3. App Routes
**File**: `/home/prantic/SHS/frontend/src/App.jsx`

Added protected route:
```jsx
<Route 
  path="/doctor-recommendation" 
  element={
    <ProtectedRoute>
      <DoctorRecommendation />
    </ProtectedRoute>
  } 
/>
```

## Usage Flow

### Step 1: User Inputs Symptoms
1. Navigate to `/doctor-recommendation`
2. Enter symptoms (with autocomplete suggestions)
3. Add more symptoms if needed
4. Click "Get Doctor Recommendation"

### Step 2: Disease Prediction
1. Frontend sends symptoms to `http://localhost:8002/predict`
2. ML model predicts disease with confidence score
3. Disease and confidence displayed to user

### Step 3: Doctor Recommendation
1. Frontend sends predicted disease to backend API
2. Backend searches `diseases_treated` field (case-insensitive)
3. Returns list of matching doctors (verified, approved, available)
4. Doctors sorted by rating and experience

### Step 4: Display Results
1. Shows predicted disease with confidence percentage
2. Lists recommended doctors with:
   - Profile photo
   - Name and specialization
   - Experience, location, rating
   - Consultation fee
   - Diseases treated (matching disease highlighted in green)
3. Click any doctor to view full profile

## Testing

### Test Case 1: Common Disease
```
Symptoms: fever, cough, headache
Expected Disease: Common Cold / Flu
Expected: Multiple doctors found
```

### Test Case 2: Specific Disease
```
Symptoms: increased_thirst, frequent_urination, weight_loss
Expected Disease: Diabetes
Expected: Endocrinologists recommended
```

### Test Case 3: No Doctors Found
```
Symptoms: rare symptoms
Expected: Disease predicted but no doctors found
Message: "Try searching manually"
```

## Error Handling

1. **No symptoms entered**: Shows error "Please enter at least one symptom"
2. **Prediction service down**: Shows error "Failed to get recommendations"
3. **Not logged in**: Shows error "Please login to get doctor recommendations"
4. **No doctors found**: Shows info message with alternative actions

## Security

- Doctor recommendation requires authentication
- Only verified and approved doctors shown
- Only available doctors included in results
- CORS configured for local development

## Services Configuration

All services start with:
```bash
./start-all.sh
```

**Ports**:
- Backend: 8000
- AI Service: 8001
- Disease Prediction: 8002
- Frontend: 5174

## Data Files

- **Diseases**: 773 unique diseases
  - Backend: `/home/prantic/SHS/unique_diseases.txt`
  - Frontend: `/home/prantic/SHS/frontend/src/data/diseases_list.txt`

- **Symptoms**: 377 unique symptoms
  - Loaded from ML model at runtime
  - Available via `/symptoms` API endpoint

- **ML Model Files**:
  - `disease_model.pkl` (39MB) - Random Forest model
  - `encoder.pkl` (7.1KB) - Disease encoder
  - `symptom_index.pkl` (4KB) - Symptom mapping

## Performance

- **ML Model Accuracy**: 93.74% (test set)
- **Training Data**: 50,000 samples
- **Response Time**: < 2 seconds for full flow
- **Concurrent Users**: Supports multiple simultaneous predictions

## Future Enhancements

1. Add appointment booking from recommendation page
2. Filter doctors by location, rating, fee range
3. Show doctor availability calendar
4. Add patient reviews and testimonials
5. Implement caching for common symptom combinations
6. Add symptom severity ratings
7. Multi-language support
8. Mobile app version

## Troubleshooting

### Issue: Prediction service not responding
**Solution**: Check if port 8002 is running:
```bash
ps aux | grep uvicorn | grep 8002
```

### Issue: No doctors found
**Solution**: 
1. Verify doctors have `diseases_treated` field populated
2. Check doctor verification status in admin
3. Ensure doctors are marked as available

### Issue: Authentication error
**Solution**: User must be logged in - redirect to `/login`

## API Documentation

Full API documentation available at:
- Disease Prediction: http://localhost:8002/docs
- Backend API: http://localhost:8000/api/ (Swagger/ReDoc if configured)

## Contact

For issues or questions, refer to the project repository or contact the development team.
