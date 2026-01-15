# Sprint 5: Disease Prediction & Doctor Recommendation - User Stories

**Sprint Duration**: January 6-10, 2026  
**Status**: ✅ Completed

---

## 📋 User Stories

### US5.1: Symptom-Based Disease Prediction
**As a** patient  
**I want to** input my symptoms and get disease predictions  
**So that** I can understand potential health issues

**Acceptance Criteria:**
- ✅ Multi-select symptom input interface
- ✅ Search/filter symptoms by name
- ✅ Select multiple symptoms (up to 10)
- ✅ Submit symptoms for prediction
- ✅ Receive top 3-5 disease predictions with probabilities
- ✅ Display prediction confidence scores
- ✅ Clear, user-friendly results display

**Priority**: High  
**Story Points**: 13

---

### US5.2: ML Model Training
**As a** system  
**I want** trained machine learning models  
**So that** disease predictions are accurate

**Acceptance Criteria:**
- ✅ Multiple ML algorithms (Random Forest, Decision Tree, Logistic Regression)
- ✅ Training pipeline with medical dataset
- ✅ Model evaluation and selection
- ✅ 132 symptoms supported
- ✅ 40+ diseases predicted
- ✅ Model accuracy ≥ 88%
- ✅ Serialized models for production use

**Priority**: High  
**Story Points**: 13

---

### US5.3: Doctor Recommendation System
**As a** patient  
**I want** to see doctors who treat my predicted disease  
**So that** I can book appointments with relevant specialists

**Acceptance Criteria:**
- ✅ Doctors filtered by disease expertise
- ✅ Display recommended doctors in modal
- ✅ Show doctor specialization, experience, rating
- ✅ Direct booking link from recommendations
- ✅ "Book Appointment" button per doctor
- ✅ Relevance-based sorting

**Priority**: High  
**Story Points**: 8

---

### US5.4: Disease Treatment Mapping
**As a** doctor  
**I want to** specify diseases I treat  
**So that** I appear in relevant recommendations

**Acceptance Criteria:**
- ✅ Disease treatment field in doctor profile
- ✅ Multi-select disease expertise
- ✅ API endpoint to add/update diseases
- ✅ Backend filtering by disease
- ✅ Admin can manage doctor-disease mapping

**Priority**: Medium  
**Story Points**: 5

---

### US5.5: FastAPI ML Microservice
**As a** system  
**I want** ML predictions in a separate microservice  
**So that** it's scalable and maintainable

**Acceptance Criteria:**
- ✅ FastAPI service for ML predictions
- ✅ RESTful prediction endpoint
- ✅ Model loading on startup
- ✅ Health check endpoint
- ✅ Error handling and validation
- ✅ Response time < 500ms

**Priority**: Medium  
**Story Points**: 5

---

### US5.6: Prediction Results Visualization
**As a** patient  
**I want** clear visualization of prediction results  
**So that** I can easily understand the output

**Acceptance Criteria:**
- ✅ Disease names with confidence percentages
- ✅ Progress bars or charts for probabilities
- ✅ Color-coded confidence levels
- ✅ Top predictions highlighted
- ✅ Explanation of confidence scores

**Priority**: Medium  
**Story Points**: 3

---

### US5.7: Integration with Appointment System
**As a** patient  
**I want** to book appointments directly from predictions  
**So that** the workflow is seamless

**Acceptance Criteria:**
- ✅ "View Doctors" button on predictions
- ✅ Doctor recommendation modal opens
- ✅ "Book Appointment" navigates to booking page
- ✅ Doctor pre-selected in booking form
- ✅ Predicted disease pre-filled as reason

**Priority**: Medium  
**Story Points**: 5

---

## 📊 Sprint Summary

**Total Story Points**: 52  
**Completed Story Points**: 52  
**Sprint Velocity**: 52 points

**Stories Completed**: 7/7  
**Success Rate**: 100%

---

## 🔑 Key Features Delivered

1. ✅ ML-based disease prediction (90% accuracy)
2. ✅ 132 symptoms, 40+ diseases supported
3. ✅ Doctor recommendation by disease expertise
4. ✅ FastAPI ML microservice
5. ✅ Seamless appointment booking integration
6. ✅ Clear prediction visualization

---

## 🔗 Related Documentation

- [API Specification](./API_SPECIFICATION.md)
- [TDD Approach](./TDD.md)
