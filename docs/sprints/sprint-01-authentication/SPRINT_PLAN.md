# Sprint 1: Authentication & User Management

## Sprint Overview

**Sprint Goal:** Implement secure user authentication and basic user management features

**Duration:** 2 weeks  
**Sprint Dates:** TBD  
**Status:** 📋 Planning

---

## Sprint Scope

### What's Included (Must Have)
1. ✅ User Registration
2. ✅ User Login with JWT
3. ✅ User Profile View
4. ✅ Doctor Application (Join as Doctor)

### What's NOT Included (Future Sprints)
- ❌ Email verification (Sprint 1.5 or Sprint 2)
- ❌ Password reset (Sprint 1.5 or Sprint 2)
- ❌ Profile picture upload (Sprint 2)
- ❌ Admin doctor verification (Sprint 2)

---

## User Stories

### Story 1: User Registration
**As a** user  
**I want to** register an account with my personal information  
**So that** I can access the platform

**Acceptance Criteria:**
- [ ] User can register with: name, email, phone, password, location, blood_group, gender, age
- [ ] Email must be unique (no duplicates)
- [ ] Phone must be unique (no duplicates)
- [ ] Password must be at least 8 characters
- [ ] System generates unique user_id (format: u-XXXXXX, e.g., u-199232)
- [ ] User receives success message on registration
- [ ] User is automatically logged in after registration
- [ ] Validation errors are displayed clearly

**Priority:** 🔴 Must Have

---

### Story 2: User Login
**As a** user  
**I want to** log in using my email and password  
**So that** I can access my account securely

**Acceptance Criteria:**
- [ ] User can log in with email and password
- [ ] System validates credentials
- [ ] JWT access token is generated on successful login
- [ ] JWT refresh token is generated for session management
- [ ] Token is stored securely in frontend
- [ ] User is redirected to home page after login
- [ ] Error message displayed on invalid credentials
- [ ] Login form has "Remember me" option (optional)

**Priority:** 🔴 Must Have

---

### Story 3: View User Profile
**As a** logged-in user  
**I want to** view my profile information  
**So that** I can see my account details

**Acceptance Criteria:**
- [ ] User can access profile page (authenticated)
- [ ] Profile displays: user_id, name, email, phone, location, blood_group, gender, age
- [ ] Password is NOT displayed
- [ ] Role is displayed (PATIENT by default)
- [ ] Profile page is protected (requires authentication)
- [ ] "Join as Doctor" button visible if user is not a doctor

**Priority:** 🔴 Must Have

---

### Story 4: Join as Doctor (Apply)
**As a** patient user  
**I want to** apply to join as a doctor by providing professional information  
**So that** I can offer medical services on the platform

**Acceptance Criteria:**
- [ ] "Join as Doctor" button visible on patient's profile
- [ ] User clicks button → application form opens
- [ ] Form collects: license_number, qualification, education, specialization, practice_location
- [ ] User submits application
- [ ] Doctor Information record created with status: PENDING
- [ ] User sees "Application Pending" message
- [ ] Application cannot be submitted twice (duplicate check)
- [ ] User can view application status on profile

**Priority:** 🔴 Must Have

**Note:** Admin approval will be implemented in Sprint 2

---

## Technical Design Document (TDD)

### Database Design (Detailed)

#### User Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(20) UNIQUE NOT NULL,           -- Format: u-XXXXXX
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,                -- Hashed with bcrypt
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    location VARCHAR(255) NOT NULL,
    blood_group VARCHAR(10),                       -- A+, B+, O-, etc.
    gender VARCHAR(10),                            -- Male, Female, Other
    age INTEGER,
    role VARCHAR(20) DEFAULT 'PATIENT',            -- PATIENT, DOCTOR, ADMIN
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_users_role ON users(role);
```

#### Doctor Information Table
```sql
CREATE TABLE doctor_information (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    qualification TEXT NOT NULL,                   -- Degrees (MBBS, MD, etc.)
    education TEXT,                                 -- University details
    specialization VARCHAR(100) NOT NULL,          -- Cardiology, etc.
    practice_location VARCHAR(255) NOT NULL,
    experience_years INTEGER,
    bio TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',          -- PENDING, APPROVED, REJECTED
    is_verified BOOLEAN DEFAULT FALSE,
    rating_avg DECIMAL(3, 2) DEFAULT 0.00,        -- Average rating (0-5)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)                                -- One doctor profile per user
);

-- Indexes
CREATE INDEX idx_doctor_user_id ON doctor_information(user_id);
CREATE INDEX idx_doctor_status ON doctor_information(status);
CREATE INDEX idx_doctor_specialization ON doctor_information(specialization);
```

---

### API Endpoints (Detailed)

#### 1. User Registration

**Endpoint:** `POST /api/v1/auth/register/`

**Auth Required:** No

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "01712345678",
  "location": "Dhaka, Bangladesh",
  "blood_group": "A+",
  "gender": "Male",
  "age": 30
}
```

**Validation Rules:**
- `name`: Required, max 100 characters
- `email`: Required, valid email format, unique
- `password`: Required, min 8 characters, must contain letter and number
- `phone`: Required, unique, valid Bangladesh phone format
- `location`: Required, max 255 characters
- `blood_group`: Optional, valid blood types (A+, A-, B+, B-, O+, O-, AB+, AB-)
- `gender`: Optional, choices (Male, Female, Other)
- `age`: Optional, integer, 1-120

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user_id": "u-199232",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01712345678",
    "location": "Dhaka, Bangladesh",
    "blood_group": "A+",
    "gender": "Male",
    "age": 30,
    "role": "PATIENT",
    "is_active": true,
    "created_at": "2025-12-21T10:30:00Z"
  },
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "errors": {
    "email": ["Email already exists"],
    "password": ["Password must contain at least one number"],
    "phone": ["Phone number already registered"]
  },
  "message": "Validation failed"
}
```

---

#### 2. User Login

**Endpoint:** `POST /api/v1/auth/login/`

**Auth Required:** No

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user_id": "u-199232",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "PATIENT"
  },
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid email or password",
  "message": "Authentication failed"
}
```

---

#### 3. Get User Profile

**Endpoint:** `GET /api/v1/users/profile/`

**Auth Required:** Yes (JWT Bearer token)

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user_id": "u-199232",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01712345678",
    "location": "Dhaka, Bangladesh",
    "blood_group": "A+",
    "gender": "Male",
    "age": 30,
    "role": "PATIENT",
    "is_active": true,
    "created_at": "2025-12-21T10:30:00Z",
    "doctor_profile": null  // null if not a doctor, object if doctor
  },
  "message": "Profile retrieved successfully"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Token is invalid or expired",
  "message": "Authentication required"
}
```

---

#### 4. Apply to Join as Doctor

**Endpoint:** `POST /api/v1/doctors/apply/`

**Auth Required:** Yes (JWT Bearer token)

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "license_number": "BM-12345",
  "qualification": "MBBS, MD (Cardiology)",
  "education": "Dhaka Medical College, Bangladesh",
  "specialization": "Cardiology",
  "practice_location": "Dhaka Medical College Hospital",
  "experience_years": 10,
  "bio": "Cardiologist with 10 years of experience..."
}
```

**Validation Rules:**
- `license_number`: Required, unique, max 50 characters
- `qualification`: Required, min 5 characters
- `education`: Optional
- `specialization`: Required, max 100 characters
- `practice_location`: Required, max 255 characters
- `experience_years`: Optional, integer, 0-60
- `bio`: Optional, max 1000 characters

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": "u-199232",
    "license_number": "BM-12345",
    "qualification": "MBBS, MD (Cardiology)",
    "education": "Dhaka Medical College, Bangladesh",
    "specialization": "Cardiology",
    "practice_location": "Dhaka Medical College Hospital",
    "experience_years": 10,
    "status": "PENDING",
    "is_verified": false,
    "created_at": "2025-12-21T11:00:00Z"
  },
  "message": "Doctor application submitted successfully. Pending admin approval."
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "errors": {
    "license_number": ["License number already exists"]
  },
  "message": "Validation failed"
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "error": "You have already applied. Application status: PENDING",
  "message": "Duplicate application"
}
```

---

### Backend Implementation Tasks

#### Django Models
```python
# backend/apps/users/models.py

from django.contrib.auth.models.py import AbstractUser
from django.db import models
import random

class User(AbstractUser):
    ROLE_CHOICES = [
        ('PATIENT', 'Patient'),
        ('DOCTOR', 'Doctor'),
        ('ADMIN', 'Admin'),
    ]
    
    BLOOD_GROUP_CHOICES = [
        ('A+', 'A+'), ('A-', 'A-'),
        ('B+', 'B+'), ('B-', 'B-'),
        ('O+', 'O+'), ('O-', 'O-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'),
    ]
    
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]
    
    user_id = models.CharField(max_length=20, unique=True, editable=False)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, unique=True)
    location = models.CharField(max_length=255)
    blood_group = models.CharField(max_length=10, choices=BLOOD_GROUP_CHOICES, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    age = models.IntegerField(null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='PATIENT')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Override username (use email instead)
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'phone']
    
    def save(self, *args, **kwargs):
        if not self.user_id:
            self.user_id = self.generate_user_id()
        super().save(*args, **kwargs)
    
    @staticmethod
    def generate_user_id():
        while True:
            user_id = f"u-{random.randint(100000, 999999)}"
            if not User.objects.filter(user_id=user_id).exists():
                return user_id
    
    def __str__(self):
        return f"{self.user_id} - {self.email}"


class DoctorInformation(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    license_number = models.CharField(max_length=50, unique=True)
    qualification = models.TextField()
    education = models.TextField(blank=True)
    specialization = models.CharField(max_length=100)
    practice_location = models.CharField(max_length=255)
    experience_years = models.IntegerField(null=True, blank=True)
    bio = models.TextField(blank=True, max_length=1000)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    is_verified = models.BooleanField(default=False)
    rating_avg = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Dr. {self.user.name} - {self.specialization}"
    
    class Meta:
        verbose_name = "Doctor Information"
        verbose_name_plural = "Doctor Information"
```

#### Django Serializers
- [ ] UserRegistrationSerializer
- [ ] UserLoginSerializer
- [ ] UserProfileSerializer
- [ ] DoctorApplicationSerializer

#### Django Views/ViewSets
- [ ] UserRegistrationView (POST)
- [ ] UserLoginView (POST)
- [ ] UserProfileView (GET)
- [ ] DoctorApplicationView (POST)

#### URL Routing
```python
# backend/apps/users/urls.py
from django.urls import path
from .views import (
    UserRegistrationView,
    UserLoginView,
    UserProfileView,
    DoctorApplicationView
)

urlpatterns = [
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/', UserLoginView.as_view(), name='login'),
    path('users/profile/', UserProfileView.as_view(), name='profile'),
    path('doctors/apply/', DoctorApplicationView.as_view(), name='doctor-apply'),
]
```

---

### Frontend Implementation Tasks

#### React Components
- [ ] RegistrationForm component
- [ ] LoginForm component
- [ ] UserProfile component
- [ ] DoctorApplicationForm component
- [ ] ProtectedRoute component (authentication guard)

#### React Pages
- [ ] `/register` - Registration page
- [ ] `/login` - Login page
- [ ] `/home` - Home page (after login)
- [ ] `/profile` - User profile page

#### State Management
- [ ] Auth context/store (user data, token)
- [ ] Login/Logout actions
- [ ] Token storage (localStorage/sessionStorage)

#### API Integration
- [ ] API service for authentication
- [ ] Axios interceptors for JWT token
- [ ] Error handling

---

### Testing Checklist

#### Backend Tests
- [ ] Test user registration with valid data
- [ ] Test duplicate email error
- [ ] Test duplicate phone error
- [ ] Test weak password error
- [ ] Test user_id generation (unique)
- [ ] Test login with valid credentials
- [ ] Test login with invalid credentials
- [ ] Test JWT token generation
- [ ] Test profile access (authenticated)
- [ ] Test profile access (unauthenticated) → 401
- [ ] Test doctor application with valid data
- [ ] Test duplicate license number error
- [ ] Test duplicate doctor application → 409

#### Frontend Tests
- [ ] Registration form validation
- [ ] Login form validation
- [ ] Successful registration redirects to home
- [ ] Successful login redirects to home
- [ ] Protected routes require authentication
- [ ] Doctor application form validation

---

## Definition of Done

Sprint 1 is complete when:
- ✅ All 4 user stories implemented
- ✅ All API endpoints working and tested
- ✅ Database migrations applied
- ✅ Frontend forms functional
- ✅ JWT authentication working
- ✅ Unit tests passing (backend)
- ✅ Integration tests passing
- ✅ Code reviewed and merged
- ✅ Documentation updated
- ✅ No critical bugs

---

## Sprint Retrospective (To be filled after sprint)

### What Went Well
- TBD

### What Didn't Go Well
- TBD

### Action Items
- TBD

---

**Document Status:** ✅ Planning Complete  
**Next Step:** Start Development - Implement User Model
