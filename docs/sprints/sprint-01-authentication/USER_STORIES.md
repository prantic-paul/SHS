# Sprint 1: User Authentication & Profile Management - User Stories

**Sprint Duration**: December 19-24, 2025  
**Status**: ✅ Completed

---

## 📋 User Stories

### US1.1: User Registration
**As a** new user  
**I want to** register for an account  
**So that** I can access the Smart Health Synchronizer platform

**Acceptance Criteria:**
- ✅ Registration form with name, email, password, phone, location
- ✅ Email validation and uniqueness check
- ✅ Password strength validation
- ✅ Optional fields: blood_group, gender, age
- ✅ Successful registration redirects to home page
- ✅ Error messages for validation failures
- ✅ Profile button appears in navbar after registration

**Priority**: High  
**Story Points**: 5

---

### US1.2: User Login
**As a** registered user  
**I want to** login to my account  
**So that** I can access personalized features

**Acceptance Criteria:**
- ✅ Login form with email and password
- ✅ JWT token generation on successful login
- ✅ Token stored securely in localStorage
- ✅ Successful login redirects to home page
- ✅ Error message for invalid credentials
- ✅ Login button changes to Profile button after authentication

**Priority**: High  
**Story Points**: 3

---

### US1.3: User Profile Management
**As a** logged-in user  
**I want to** view and edit my profile  
**So that** I can keep my information up to date

**Acceptance Criteria:**
- ✅ View all profile information
- ✅ Edit personal details (name, phone, location, blood_group, gender, age)
- ✅ Changes saved to backend
- ✅ Success message on update
- ✅ Form validation for all fields
- ✅ Display user role badge

**Priority**: Medium  
**Story Points**: 5

---

### US1.4: Doctor Application
**As a** registered user  
**I want to** apply to become a doctor on the platform  
**So that** I can offer medical services

**Acceptance Criteria:**
- ✅ "Apply as Doctor" button in profile page
- ✅ Doctor application form with required fields:
  - License number
  - Qualification
  - Specialization
  - Education
  - Practice location
  - Experience years
  - Bio
- ✅ Application submitted with PENDING status
- ✅ Status badge shows "Pending Approval"
- ✅ Cannot reapply while application is pending

**Priority**: High  
**Story Points**: 8

---

### US1.5: Doctor Verification (Admin)
**As an** administrator  
**I want to** verify and approve doctor applications  
**So that** only qualified doctors can provide services

**Acceptance Criteria:**
- ✅ Admin panel access to doctor applications
- ✅ View all doctor information
- ✅ Approve/Reject functionality
- ✅ Approval automatically changes user role to DOCTOR
- ✅ Approval sets is_verified to true
- ✅ `save_model()` correctly triggers approve() method
- ✅ Read-only is_verified field in admin

**Priority**: High  
**Story Points**: 5

---

### US1.6: Doctor Profile Management
**As an** approved doctor  
**I want to** manage my professional profile  
**So that** patients can learn about my expertise

**Acceptance Criteria:**
- ✅ View doctor profile section in profile page
- ✅ Edit doctor-specific information
- ✅ Display specialization and qualifications
- ✅ Show approval status
- ✅ Display average rating
- ✅ Only accessible after approval

**Priority**: Medium  
**Story Points**: 5

---

### US1.7: Role-Based Access Control
**As a** system  
**I want to** enforce role-based access  
**So that** users can only access appropriate features

**Acceptance Criteria:**
- ✅ Three roles: PATIENT, DOCTOR, ADMIN
- ✅ Patients can book appointments
- ✅ Doctors can manage appointments and write prescriptions
- ✅ Admins can verify doctors
- ✅ JWT token includes role information
- ✅ Backend validates permissions for protected endpoints

**Priority**: High  
**Story Points**: 3

---

### US1.8: JWT Token Management
**As a** system  
**I want to** use JWT for secure authentication  
**So that** user sessions are secure and scalable

**Acceptance Criteria:**
- ✅ Access token generated on login
- ✅ Refresh token for token renewal
- ✅ Tokens stored in localStorage
- ✅ Automatic token refresh mechanism
- ✅ Logout clears tokens
- ✅ Protected routes require valid token

**Priority**: High  
**Story Points**: 5

---

## 📊 Sprint Summary

**Total Story Points**: 39  
**Completed Story Points**: 39  
**Sprint Velocity**: 39 points

**Stories Completed**: 8/8  
**Success Rate**: 100%

---

## 🔗 Related Documentation

- [API Specification](./API_SPECIFICATION.md)
- [TDD Approach](./TDD.md)
- [Testing Guide](./TESTING_GUIDE.md)
