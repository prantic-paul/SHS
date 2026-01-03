# Doctor Recommendation System - Complete Documentation

## Overview

A complete ML-powered doctor recommendation system that predicts diseases from symptoms and recommends qualified doctors.

**Version**: 1.0.0  
**Date**: January 3, 2026  
**Branch**: `feature/doctor-recommendation`

---

## Features

✅ **Disease Prediction from Symptoms** (93.74% ML accuracy)  
✅ **Doctor Recommendation** based on predicted disease  
✅ **Modal Interface** integrated in ProfilePage  
✅ **Display diseases treated** on doctor profiles  
✅ **Symptom Autocomplete** with 377 available symptoms  
✅ **Confidence Scores** for predictions  
✅ **Multi-Doctor Comparison** (opens profiles in new tabs)  
✅ **Comprehensive Error Handling**  

---

## Architecture

### System Flow
```
User Input Symptoms → Disease Prediction Service (ML Model)
    ↓
Predicted Disease + Confidence Score
    ↓
Backend API Search (diseases_treated field)
    ↓
Return Recommended Doctors (sorted by rating/experience)
    ↓
Display Results in Modal
```

### Services
1. **Django Backend** - Port 8000 (User/Doctor management)
2. **AI Service** - Port 8001 (Medical chatbot)
3. **Disease Prediction** - Port 8002 (ML disease prediction)
4. **React Frontend** - Port 5174 (User interface)

---

## Database Schema

### Table: `users_doctorinformation`

**Key Field**: `diseases_treated`
- **Type**: TextField (TEXT in database)
- **Format**: Comma-separated (e.g., "Diabetes,Hypertension,Panic Disorder")
- **Purpose**: Stores diseases each doctor treats
- **Indexed**: No (uses ILIKE for search)
- **Nullable**: Yes (blank=True, default='')

**Location**: `backend/apps/users/models/doctor.py` (lines 141-145)

**Migrations**:
- `0003_doctorinformation_diseases_treated.py` - Initial field addition
- `0004_add_diseases_treated_to_doctor.py` - Field migration

---

## API Endpoints

### 1. Disease Prediction API (Port 8002)

#### Predict Disease
```
POST http://localhost:8002/predict/
Content-Type: application/json

Request:
{
  "symptoms": ["fever", "cough", "headache"]
}

Response:
{
  "success": true,
  "message": "Prediction successful",
  "prediction": {
    "disease": "Common Cold",
    "confidence": 0.95,
    "alternative_diseases": [
      {"disease": "Flu", "confidence": 0.78}
    ],
    "matched_symptoms": ["fever", "cough", "headache"],
    "total_symptoms": 3
  }
}
```

#### Get Available Symptoms
```
GET http://localhost:8002/symptoms

Response:
{
  "success": true,
  "symptoms": ["fever", "cough", ...],
  "total": 377
}
```

### 2. Doctor Recommendation API (Port 8000)

```
POST http://localhost:8000/api/v1/doctors/recommend/
Content-Type: application/json
Authorization: Bearer <access_token>

Request:
{
  "disease": "Panic Disorder"
}

Response:
{
  "disease": "Panic Disorder",
  "doctors": [
    {
      "id": 1,
      "user": {
        "id": 1,
        "name": "Dr. John Smith",
        "full_name": "Dr. John Smith",
        "email": "doctor@example.com"
      },
      "specialization": "Psychiatry",
      "diseases_treated": "Panic Disorder,Anxiety,Depression",
      "experience_years": 15,
      "rating_avg": 4.8,
      "rating_count": 120,
      "city": "New York",
      "consultation_fee": 150.00,
      "availability_status": "available",
      "profile_image": "url"
    }
  ],
  "count": 1
}
```

**Search Logic**:
- Case-insensitive search: `diseases_treated ILIKE '%disease%'`
- Only verified doctors: `is_verified = TRUE`
- Only approved doctors: `status = 'APPROVED'`
- All availability statuses included (available, busy, unavailable)
- Sorted by: `rating_avg DESC`, `experience_years DESC`

---

## Frontend Implementation

### Component: DoctorRecommendation Modal

**File**: `frontend/src/components/DoctorRecommendation.jsx`

**Features**:
- Multi-symptom input with autocomplete
- Dynamic add/remove symptom fields
- Disease prediction display with confidence
- Recommended doctors list
- Click doctor → Opens in NEW TAB (modal stays open)
- Highlight matching disease in green chips

**Usage in ProfilePage**:
```jsx
import DoctorRecommendation from '../components/DoctorRecommendation';

// In component:
const [showRecommendationModal, setShowRecommendationModal] = useState(false);

// Button to open:
<button onClick={() => setShowRecommendationModal(true)}>
  Get Doctor Recommendation
</button>

// Modal:
{showRecommendationModal && (
  <DoctorRecommendation onClose={() => setShowRecommendationModal(false)} />
)}
```

### Disease Input Component

**File**: `frontend/src/components/DiseaseInput.jsx`

Used by doctors to select diseases they treat:
- Autocomplete with 773 diseases
- Multi-select with chips
- Remove functionality
- Prevents duplicates

---

## Machine Learning Model

### Model Details
- **Algorithm**: Random Forest Classifier
- **Estimators**: 100
- **Training Data**: 50,000 samples from 246,945 total
- **Test Accuracy**: 93.74%
- **Train Accuracy**: 97.68%

### Dataset
- **Diseases**: 773 unique
- **Symptoms**: 377 unique
- **File**: `Final_Augmented_dataset_Diseases_and_Symptoms.csv`

### Model Files
- `disease_model.pkl` - 39MB (Random Forest model)
- `encoder.pkl` - 7.1KB (Disease encoder)
- `symptom_index.pkl` - 4KB (Symptom mapping)

**Location**: `disease-prediction-service/models/`

---

## Data Files

### Backend
- `unique_diseases.txt` - 773 diseases (root directory)

### Frontend
- `frontend/src/data/diseases_list.txt` - 773 diseases (for autocomplete)
- `frontend/src/data/symptoms_list.txt` - 377 symptoms (for autocomplete)

---

## User Flow

### Patient Journey
1. **Login** → Navigate to Profile
2. **Click** "Get Doctor Recommendation" button
3. **Modal Opens** → Symptom input interface
4. **Select Symptoms** → Use autocomplete or quick-add buttons
5. **Click** "Get Doctor Recommendations"
6. **AI Predicts Disease** → Shows disease name + confidence %
7. **Backend Searches** → Finds doctors treating that disease
8. **View Results** → List of recommended doctors with profiles
9. **Click Doctor Card** → Opens full profile in NEW TAB
10. **Compare Multiple Doctors** → Open several profiles
11. **Book Appointment** → Choose preferred doctor

---

## Issues Resolved

### Issue 1: Availability Filter Too Restrictive
**Problem**: No doctors returned even when they existed  
**Cause**: Filter excluded `unavailable` doctors  
**Fix**: Removed `availability_status` filter  
**Commit**: `f8b836e`

### Issue 2: Missing Serializer Fields
**Problem**: Doctor cards not displaying properly  
**Cause**: API missing fields like city, phone, profile_image  
**Fix**: Added all fields to `DoctorInformationSerializer`  
**Commit**: `5a516ed`

### Issue 3: "None None" Name Display
**Problem**: Doctor names showing as "None None"  
**Cause**: User model uses `name` field, not `first_name`/`last_name`  
**Fix**: Updated serializer to use `user.name`  
**Commit**: `a12607f`

### Issue 4: Navigation Confusion
**Problem**: Clicking doctor closed modal, back button went to profile  
**Cause**: Navigation replaced current page  
**Fix**: Open doctor profiles in NEW TAB using `window.open()`  
**Commit**: `a12607f`

---

## Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 22+
- PostgreSQL or SQLite
- Virtual environments

### Start All Services
```bash
cd /home/prantic/SHS
./start-all.sh
```

### Services will start on:
- Backend: http://localhost:8000
- AI Service: http://localhost:8001
- Disease Prediction: http://localhost:8002
- Frontend: http://localhost:5174

### Stop All Services
```bash
./stop-all.sh
# OR
pkill -f 'python.*manage.py|uvicorn|vite'
```

---

## Testing

### Test Disease Prediction API
```bash
curl -X POST "http://localhost:8002/predict/" \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["fever", "cough", "headache"]}'
```

### Test Doctor Recommendation
1. Login to frontend
2. Go to profile page
3. Click "Get Doctor Recommendation"
4. Select symptoms: fever, anxiety, chest pain
5. Verify disease prediction shows
6. Verify doctor list appears
7. Click doctor card → Opens in new tab
8. Modal stays open

---

## Files Modified/Created

### Backend
1. `backend/apps/users/models/doctor.py` - Added `diseases_treated` field
2. `backend/apps/users/views/doctor_recommendation.py` - NEW: Recommendation API
3. `backend/apps/users/serializers/doctor.py` - Updated with all fields
4. `backend/apps/users/urls.py` - Added `/api/v1/doctors/recommend/` route
5. `backend/apps/users/migrations/0003_*.py` - Added field migration
6. `backend/apps/users/migrations/0004_*.py` - Field migration

### Disease Prediction Service
1. `disease-prediction-service/main.py` - Added `/predict` prefix to router
2. `disease-prediction-service/app/api/routes/prediction.py` - Fixed routes

### Frontend
1. `frontend/src/components/DoctorRecommendation.jsx` - Enhanced with full API integration
2. `frontend/src/components/DiseaseInput.jsx` - Disease input with autocomplete
3. `frontend/src/pages/DoctorDetailPage.jsx` - Display diseases treated
4. `frontend/src/pages/ProfilePage.jsx` - Display diseases + modal integration
5. `frontend/src/data/diseases_list.txt` - NEW: 773 diseases
6. `frontend/src/data/symptoms_list.txt` - NEW: 377 symptoms

---

## Environment Configuration

### Backend (.env)
```env
DEBUG=True
DATABASE_URL=postgresql://user:pass@localhost:5432/shs
SECRET_KEY=your-secret-key
```

### Disease Prediction Service (.env)
```env
SERVICE_HOST=0.0.0.0
SERVICE_PORT=8002
MODEL_PATH=./models/
```

---

## Security Considerations

1. **Authentication Required**: Doctor recommendation requires JWT token
2. **Verified Doctors Only**: Only `is_verified=True` doctors returned
3. **Approved Doctors Only**: Only `status='APPROVED'` doctors returned
4. **CORS Configured**: For local development (adjust for production)
5. **Input Validation**: Symptoms validated against known list
6. **SQL Injection Safe**: Using Django ORM with parameterized queries

---

## Performance

- **API Response Time**: < 2 seconds for full flow
- **ML Prediction**: < 500ms
- **Database Query**: < 100ms
- **Concurrent Users**: Supports multiple simultaneous predictions
- **Caching**: Consider adding for common symptom combinations

---

## Future Enhancements

### High Priority
1. Add location-based filtering (find doctors nearby)
2. Add rating/fee filters
3. Show doctor availability calendar
4. Direct appointment booking from recommendations

### Medium Priority
5. Cache common symptom combinations
6. Add symptom severity ratings
7. Multi-language support
8. Mobile app version

### Low Priority
9. Email notifications for new matching doctors
10. Patient reviews on recommendations
11. Doctor response time metrics
12. Integration with insurance providers

---

## Troubleshooting

### Disease Prediction Not Working
```bash
# Check if service is running
ps aux | grep "uvicorn.*8002"

# Check logs
tail -f logs/disease-prediction.log

# Test endpoint
curl http://localhost:8002/health
```

### No Doctors Found
1. Verify doctors have `diseases_treated` field populated
2. Check doctor verification status: `is_verified=True`
3. Check doctor status: `status='APPROVED'`
4. Check database: 
   ```sql
   SELECT * FROM users_doctorinformation 
   WHERE diseases_treated ILIKE '%disease_name%';
   ```

### Name Shows as "None None"
- User must have `name` field set (not first_name/last_name)
- Check: `SELECT name FROM users WHERE id=X;`

---

## Support & Contact

For issues or questions:
1. Check logs: `tail -f logs/*.log`
2. Verify all services running
3. Check database migrations applied
4. Review API documentation: http://localhost:8002/docs

---

## License

[Your License Here]

---

## Contributors

[Your Team/Name]

---

**Last Updated**: January 3, 2026  
**Status**: Production Ready ✅  
**Test Coverage**: Manual testing complete  
**Documentation**: Complete  
