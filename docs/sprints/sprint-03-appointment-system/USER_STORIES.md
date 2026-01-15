# Sprint 3: Appointment Booking System - User Stories

**Sprint Duration**: December 28-31, 2025  
**Status**: ✅ Completed

---

## 📋 User Stories

### US3.1: Patient Appointment Booking
**As a** patient  
**I want to** book appointments with doctors  
**So that** I can schedule consultations for my health concerns

**Acceptance Criteria:**
- ✅ View list of available approved doctors
- ✅ Select a doctor from the list
- ✅ Choose appointment date (future dates only)
- ✅ Choose appointment time
- ✅ Complete CAPTCHA verification for security
- ✅ Enter reason for appointment
- ✅ Receive confirmation after booking
- ✅ View all my appointments in one place
- ✅ Cannot book appointments in the past

**Priority**: High  
**Story Points**: 8

---

### US3.2: CAPTCHA Security on Registration
**As a** system administrator  
**I want** CAPTCHA verification on registration  
**So that** I can prevent spam accounts and bot registrations

**Acceptance Criteria:**
- ✅ Math CAPTCHA displayed on registration form
- ✅ User must solve math problem before submitting
- ✅ CAPTCHA validation on backend
- ✅ New CAPTCHA generated on failure
- ✅ Clear error message for wrong CAPTCHA

**Priority**: High  
**Story Points**: 3

---

### US3.3: CAPTCHA Security on Booking
**As a** system administrator  
**I want** CAPTCHA verification on appointment booking  
**So that** I can prevent spam bookings and system abuse

**Acceptance Criteria:**
- ✅ Math CAPTCHA displayed on booking form
- ✅ User must solve math problem before booking
- ✅ CAPTCHA validation on backend
- ✅ Booking rejected if CAPTCHA is wrong

**Priority**: High  
**Story Points**: 3

---

### US3.4: Date Validation for Bookings
**As a** system  
**I want to** prevent booking appointments in the past  
**So that** all appointments are for future dates only

**Acceptance Criteria:**
- ✅ Frontend date picker restricts past dates
- ✅ Backend validation rejects past dates
- ✅ Clear error message for invalid dates
- ✅ Current date + future dates allowed only

**Priority**: Medium  
**Story Points**: 2

---

### US3.5: Doctor Appointment Dashboard
**As a** doctor  
**I want to** view my appointments organized by timeframe  
**So that** I can manage my schedule efficiently

**Acceptance Criteria:**
- ✅ Dashboard with three sections:
  - Today's appointments
  - Upcoming appointments (next 7 days)
  - All appointment requests
- ✅ Each section shows relevant appointment details
- ✅ Patient information visible
- ✅ Appointment date, time, and reason displayed
- ✅ Auto-refresh on status changes

**Priority**: High  
**Story Points**: 8

---

### US3.6: 7-Day Appointment Window
**As a** doctor  
**I want to** see appointments for the next 7 days  
**So that** I can focus on my immediate schedule

**Acceptance Criteria:**
- ✅ "Upcoming Appointments" section shows next 7 days
- ✅ Appointments automatically move sections as dates change
- ✅ Today's appointments highlighted separately
- ✅ Past appointments not shown (auto-cleanup)

**Priority**: Medium  
**Story Points**: 5

---

### US3.7: Automatic Appointment Cleanup
**As a** system  
**I want to** automatically clean up old appointments  
**So that** the database doesn't get cluttered with past data

**Acceptance Criteria:**
- ✅ Appointments older than 7 days automatically archived/deleted
- ✅ Cleanup runs automatically (scheduled task or on-access)
- ✅ Doctor dashboard only shows relevant appointments
- ✅ No performance impact from old data

**Priority**: Medium  
**Story Points**: 3

---

### US3.8: View Patient Appointments
**As a** patient  
**I want to** view all my appointments  
**So that** I can keep track of my scheduled consultations

**Acceptance Criteria:**
- ✅ "My Appointments" page accessible from navbar
- ✅ List of all appointments (past and future)
- ✅ Shows doctor name, specialization
- ✅ Shows appointment date, time, status
- ✅ Shows booking reason
- ✅ Sorted by date (newest first)

**Priority**: High  
**Story Points**: 5

---

### US3.9: Appointment Status Management
**As a** system  
**I want to** track appointment status  
**So that** patients and doctors know appointment state

**Acceptance Criteria:**
- ✅ Status options: pending, confirmed, cancelled
- ✅ New appointments start as "pending"
- ✅ Status visible to both patient and doctor
- ✅ Status badge with color coding
- ✅ Future: Doctors can confirm/cancel

**Priority**: Medium  
**Story Points**: 3

---

## 📊 Sprint Summary

**Total Story Points**: 40  
**Completed Story Points**: 40  
**Sprint Velocity**: 40 points

**Stories Completed**: 9/9  
**Success Rate**: 100%

---

## 🔑 Key Features Delivered

1. ✅ Complete appointment booking system
2. ✅ CAPTCHA security on registration and booking
3. ✅ Date validation preventing past bookings
4. ✅ Doctor dashboard with 3 sections
5. ✅ 7-day appointment window
6. ✅ Automatic cleanup of old appointments
7. ✅ Patient appointment viewing
8. ✅ Appointment status tracking

---

## 🔗 Related Documentation

- [API Specification](./API_SPECIFICATION.md)
- [TDD Approach](./TDD.md)
