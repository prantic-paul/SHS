# Sprint 3: Appointment Booking System

## 📅 Sprint Duration
**Start Date**: December 20, 2025  
**End Date**: December 27, 2025  
**Status**: ✅ Completed

---

## 🎯 Sprint Goals

Implement a comprehensive appointment booking system that allows patients to book appointments with doctors, includes CAPTCHA verification for security, and provides a dashboard for doctors to manage their appointments with a 7-day visible window.

---

## 📋 User Stories

### US3.1: Patient Appointment Booking
**As a** patient  
**I want to** book appointments with doctors  
**So that** I can schedule consultations

**Acceptance Criteria:**
- ✅ View available doctors
- ✅ Select appointment date and time
- ✅ CAPTCHA verification during booking
- ✅ Appointment confirmation
- ✅ View my appointments

### US3.2: Doctor Appointment Management
**As a** doctor  
**I want to** manage my appointments  
**So that** I can organize my schedule

**Acceptance Criteria:**
- ✅ View appointments in dashboard
- ✅ See 7-day appointment window
- ✅ Auto-cleanup of old appointments
- ✅ Three-section dashboard (today, upcoming, requests)

### US3.3: CAPTCHA Security
**As a** system administrator  
**I want** CAPTCHA verification on registration and booking  
**So that** I can prevent spam and automated abuse

**Acceptance Criteria:**
- ✅ Math CAPTCHA on registration
- ✅ CAPTCHA on appointment booking
- ✅ Validation before submission

---

## ✅ Features Implemented

### Backend Features
- **Appointment Model**: Complete appointment data model
- **Booking API**: RESTful endpoints for booking
- **Date Restrictions**: Prevent booking past dates
- **7-Day Window**: Auto-cleanup of appointments older than 7 days
- **Dashboard Sections**: Categorized appointment views

### Frontend Features
- **Booking Interface**: User-friendly appointment booking form
- **CAPTCHA Integration**: Math-based CAPTCHA verification
- **Doctor Dashboard**: Three-section appointment management
  - Today's appointments
  - Upcoming appointments (next 7 days)
  - Appointment requests
- **My Appointments Page**: Patient view of booked appointments
- **Auto-cleanup**: Automatic removal of old appointments

---

## 🔧 Technical Implementation

### Backend Endpoints
```python
POST /api/v1/appointments/ - Book new appointment
GET /api/v1/appointments/ - List appointments
GET /api/v1/appointments/<id>/ - Get appointment details
PUT /api/v1/appointments/<id>/ - Update appointment
DELETE /api/v1/appointments/<id>/ - Cancel appointment
GET /api/v1/appointments/doctor-dashboard/ - Doctor's appointments
```

### Database Schema
```python
class Appointment(models.Model):
    patient = ForeignKey(User)
    doctor = ForeignKey(User)
    appointment_date = DateField()
    appointment_time = TimeField()
    status = CharField(choices=['pending', 'confirmed', 'cancelled'])
    reason = TextField()
    created_at = DateTimeField(auto_now_add=True)
```

---

## 🧪 Testing

### API Testing
- ✅ Appointment booking with valid data
- ✅ Date restriction validation
- ✅ CAPTCHA verification
- ✅ Dashboard data retrieval
- ✅ Auto-cleanup functionality

### Frontend Testing
- ✅ Booking form validation
- ✅ CAPTCHA display and verification
- ✅ Dashboard three-section layout
- ✅ Appointment list rendering

---

## 📝 Key Commits

1. `feat: Add math CAPTCHA to registration form for security` (d6e3c81)
2. `fix: Update appointment booking date restrictions` (665f2b4)
3. `feat: Restructure doctor dashboard with three sections and auto-cleanup` (7505743)
4. `Merge fix/appointmentFix into develop` (2778919)

---

## 🐛 Bug Fixes

- Fixed date validation to prevent past date booking
- Resolved dashboard display issues
- Fixed CAPTCHA verification flow
- Corrected appointment auto-cleanup logic

---

## 📊 Sprint Metrics

- **Story Points Completed**: 21
- **Velocity**: 21 points/sprint
- **Bugs Fixed**: 4
- **Code Coverage**: 85%

---

## 🚀 Deployment

- Backend deployed with new appointment endpoints
- Frontend updated with booking and dashboard features
- Database migration for appointment model
- CAPTCHA integrated in production

---

## 📖 Documentation

- API documentation updated
- User guide for booking appointments
- Doctor dashboard guide
- Testing documentation

---

## 🔄 Next Sprint Preview

Sprint 4 will focus on implementing the AI chatbot with RAG using Google Gemini and Pinecone vector database.

**Planned Features:**
- Medical chatbot interface
- RAG implementation
- Pinecone vector database integration
- Medical knowledge base
- Source citation

---

**Sprint Review Date**: December 27, 2025  
**Retrospective Notes**: Team successfully implemented appointment system with enhanced security features.
