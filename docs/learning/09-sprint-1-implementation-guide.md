# Sprint 1 Implementation Guide: Authentication & User Management

## Overview
This document provides a complete walkthrough of Sprint 1 implementation for the Smart Health Synchronizer project. Sprint 1 focuses on user authentication and basic user management using Django REST Framework and JWT tokens.

**Date:** December 21, 2025  
**Sprint Duration:** Completed in 1 day (rapid development)  
**Branch:** `feature/sprint-1-authentication`

---

## Table of Contents
1. [Project Structure](#project-structure)
2. [Models Created](#models-created)
3. [Serializers Implemented](#serializers-implemented)
4. [Views (API Endpoints)](#views-api-endpoints)
5. [URL Configuration](#url-configuration)
6. [Admin Panel Setup](#admin-panel-setup)
7. [Configuration Changes](#configuration-changes)
8. [Database Migrations](#database-migrations)
9. [Testing the APIs](#testing-the-apis)
10. [What We Learned](#what-we-learned)

---

## 1. Project Structure

### Industrial Django REST Framework Structure

We organized the backend following industry best practices:

```
backend/
├── apps/                           # All Django apps live here
│   ├── __init__.py
│   └── users/                      # Users app
│       ├── models/                 # Database models (organized)
│       │   ├── __init__.py
│       │   ├── user.py            # User model
│       │   └── doctor.py          # DoctorInformation model
│       ├── serializers/            # DRF serializers (organized)
│       │   ├── __init__.py
│       │   ├── auth.py            # Registration & Login
│       │   ├── user.py            # User profile operations
│       │   └── doctor.py          # Doctor application
│       ├── views/                  # API views (organized)
│       │   ├── __init__.py
│       │   ├── auth.py            # Authentication views
│       │   ├── user.py            # User profile views
│       │   └── doctor.py          # Doctor application views
│       ├── tests/                  # Unit tests
│       │   ├── __init__.py
│       │   ├── test_models.py
│       │   ├── test_views.py
│       │   └── test_serializers.py
│       ├── migrations/             # Database migrations
│       ├── admin.py               # Django admin configuration
│       ├── apps.py                # App configuration
│       └── urls.py                # URL routing
├── core/                          # Shared utilities (future use)
│   └── __init__.py
├── config/                        # Django project settings
│   ├── __init__.py
│   ├── settings.py               # Main settings
│   ├── urls.py                   # Main URL configuration
│   └── wsgi.py
├── manage.py
├── requirements.txt
└── venv/                         # Virtual environment

```

**Why this structure?**
- ✅ Separation of concerns (models, serializers, views in separate files)
- ✅ Scalable (easy to add new apps and features)
- ✅ Maintainable (easy to find and update code)
- ✅ Industry standard (recognized pattern in Django community)

---

## 2. Models Created

### 2.1 User Model (`apps/users/models/user.py`)

**Purpose:** Custom user model for authentication with email instead of username

**Key Features:**
- Uses email for login (no username field)
- Auto-generates unique user_id (format: `u-XXXXXX`)
- Role-based access (PATIENT, DOCTOR, ADMIN)
- Custom UserManager for creating users and superusers

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `user_id` | CharField(20) | Auto-generated unique ID (e.g., u-199232) |
| `email` | EmailField | Unique email for login |
| `password` | CharField | Hashed password (bcrypt) |
| `name` | CharField(100) | Full name |
| `phone` | CharField(20) | Unique phone number |
| `location` | CharField(255) | User location/address |
| `blood_group` | CharField(10) | A+, A-, B+, B-, O+, O-, AB+, AB- |
| `gender` | CharField(10) | Male, Female, Other |
| `age` | IntegerField | Age in years |
| `role` | CharField(20) | PATIENT (default), DOCTOR, ADMIN |
| `is_active` | BooleanField | Account status |
| `created_at` | DateTimeField | Registration timestamp |
| `updated_at` | DateTimeField | Last update timestamp |

**Special Methods:**
- `_generate_unique_user_id()`: Generates random 6-digit user ID
- `is_patient`, `is_doctor`, `is_admin`: Property methods for role checking

**Database Table:** `users`

---

### 2.2 DoctorInformation Model (`apps/users/models/doctor.py`)

**Purpose:** Extended profile for doctor users (one-to-one with User)

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `user` | OneToOneField | Link to User model |
| `license_number` | CharField(50) | Unique medical license number |
| `qualification` | TextField | Medical degrees (MBBS, MD, etc.) |
| `education` | TextField | Educational background |
| `specialization` | CharField(100) | Medical specialty |
| `practice_location` | CharField(255) | Current practice location |
| `experience_years` | IntegerField | Years of experience |
| `bio` | TextField(1000) | Professional biography |
| `status` | CharField(20) | PENDING, APPROVED, REJECTED |
| `is_verified` | BooleanField | Admin verification status |
| `rating_avg` | DecimalField(3,2) | Average rating (0.00-5.00) |
| `created_at` | DateTimeField | Application timestamp |
| `updated_at` | DateTimeField | Last update timestamp |

**Special Methods:**
- `approve()`: Approve doctor application and change user role to DOCTOR
- `reject()`: Reject doctor application
- `is_pending`, `is_approved`, `is_rejected`: Status check properties

**Database Table:** `doctor_information`

---

## 3. Serializers Implemented

### 3.1 Authentication Serializers (`apps/users/serializers/auth.py`)

#### UserRegistrationSerializer
**Purpose:** Handle user registration with validation

**Fields:** name, email, password, password_confirm, phone, location, blood_group, gender, age

**Validations:**
- ✅ Email uniqueness check
- ✅ Phone uniqueness check
- ✅ Password confirmation match
- ✅ Minimum password length (8 characters)

**Process:**
1. Validate all fields
2. Check email/phone uniqueness
3. Confirm password match
4. Create user with hashed password
5. Auto-generate user_id

---

#### UserLoginSerializer
**Purpose:** Authenticate user credentials

**Fields:** email, password

**Validations:**
- ✅ Email and password required
- ✅ User authentication check
- ✅ Account active status check

**Process:**
1. Receive email and password
2. Authenticate using Django's authenticate()
3. Check if user is active
4. Return user object if valid

---

### 3.2 User Profile Serializers (`apps/users/serializers/user.py`)

#### UserProfileSerializer
**Purpose:** Display user profile information

**Fields:** user_id, name, email, phone, location, blood_group, gender, age, role, is_active, created_at, doctor_profile

**Special Features:**
- Read-only fields: user_id, email, role, created_at
- Includes doctor_profile if user is a doctor

---

#### UserUpdateSerializer
**Purpose:** Update user profile information

**Fields:** name, phone, location, blood_group, gender, age

**Validations:**
- ✅ Phone uniqueness check (excluding current user)

---

### 3.3 Doctor Serializers (`apps/users/serializers/doctor.py`)

#### DoctorApplicationSerializer
**Purpose:** Handle doctor application submission

**Fields:** license_number, qualification, education, specialization, practice_location, experience_years, bio

**Validations:**
- ✅ License number uniqueness
- ✅ Check if user already has application
- ✅ Required fields validation

---

#### DoctorInformationSerializer
**Purpose:** Display doctor profile information

**Fields:** id, user_id, user_name, license_number, qualification, education, specialization, practice_location, experience_years, bio, status, is_verified, rating_avg, created_at

---

## 4. Views (API Endpoints)

### 4.1 Authentication Views (`apps/users/views/auth.py`)

#### UserRegistrationView
- **Endpoint:** `POST /api/v1/auth/register/`
- **Permission:** AllowAny (public)
- **Purpose:** Register new user
- **Process:**
  1. Validate registration data
  2. Create user
  3. Generate JWT tokens
  4. Return user data + tokens
- **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user_id": "u-199232",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01712345678",
    "location": "Dhaka",
    "blood_group": "A+",
    "gender": "Male",
    "age": 30,
    "role": "PATIENT",
    "is_active": true,
    "created_at": "2025-12-21T10:30:00Z"
  },
  "tokens": {
    "access": "eyJhbGc...",
    "refresh": "eyJhbGc..."
  },
  "message": "User registered successfully"
}
```

---

#### UserLoginView
- **Endpoint:** `POST /api/v1/auth/login/`
- **Permission:** AllowAny (public)
- **Purpose:** Authenticate user
- **Process:**
  1. Validate credentials
  2. Authenticate user
  3. Generate JWT tokens
  4. Return user data + tokens
- **Response (200 OK):**
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
    "access": "eyJhbGc...",
    "refresh": "eyJhbGc..."
  },
  "message": "Login successful"
}
```

---

### 4.2 User Profile View (`apps/users/views/user.py`)

#### UserProfileView
- **Endpoints:** 
  - `GET /api/v1/users/profile/` - Get profile
  - `PATCH /api/v1/users/profile/` - Update profile
- **Permission:** IsAuthenticated (requires JWT token)
- **Purpose:** View and update user profile
- **Headers Required:**
```
Authorization: Bearer <access_token>
```
- **GET Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user_id": "u-199232",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01712345678",
    "location": "Dhaka",
    "blood_group": "A+",
    "gender": "Male",
    "age": 30,
    "role": "PATIENT",
    "is_active": true,
    "created_at": "2025-12-21T10:30:00Z",
    "doctor_profile": null
  },
  "message": "Profile retrieved successfully"
}
```

---

### 4.3 Doctor Application View (`apps/users/views/doctor.py`)

#### DoctorApplicationView
- **Endpoint:** `POST /api/v1/doctors/apply/`
- **Permission:** IsAuthenticated (requires JWT token)
- **Purpose:** Apply to join as doctor
- **Request Body:**
```json
{
  "license_number": "BM-12345",
  "qualification": "MBBS, MD (Cardiology)",
  "education": "Dhaka Medical College",
  "specialization": "Cardiology",
  "practice_location": "Dhaka Medical College Hospital",
  "experience_years": 10,
  "bio": "Cardiologist with 10 years of experience..."
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": "u-199232",
    "license_number": "BM-12345",
    "qualification": "MBBS, MD (Cardiology)",
    "specialization": "Cardiology",
    "status": "PENDING",
    "is_verified": false,
    "created_at": "2025-12-21T11:00:00Z"
  },
  "message": "Doctor application submitted successfully. Pending admin approval."
}
```

---

## 5. URL Configuration

### Main URLs (`config/urls.py`)
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('apps.users.urls')),
]
```

### Users App URLs (`apps/users/urls.py`)
```python
urlpatterns = [
    # Authentication
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/', UserLoginView.as_view(), name='login'),
    
    # User Profile
    path('users/profile/', UserProfileView.as_view(), name='profile'),
    
    # Doctor
    path('doctors/apply/', DoctorApplicationView.as_view(), name='doctor-apply'),
]
```

**API Base URL:** `http://localhost:8000/api/v1/`

---

## 6. Admin Panel Setup

### User Admin
**Features:**
- List display: user_id, email, name, phone, role, is_active, created_at
- Filters: role, is_active, is_staff, gender, blood_group
- Search: user_id, email, name, phone
- Custom fieldsets for better organization

**Admin URL:** `http://localhost:8000/admin/`

---

### Doctor Information Admin
**Features:**
- List display: user, specialization, license_number, status, is_verified, rating_avg
- Filters: status, is_verified, specialization
- Search: user name, email, license_number, specialization
- Bulk actions: Approve doctors, Reject doctors
- Custom approve/reject methods

---

## 7. Configuration Changes

### `config/settings.py`

#### Added to INSTALLED_APPS:
```python
INSTALLED_APPS = [
    # ...
    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    
    # Local apps
    'apps.users',
]
```

#### Custom User Model:
```python
AUTH_USER_MODEL = 'users.User'
```

#### REST Framework Configuration:
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
    ],
}
```

#### JWT Configuration:
```python
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}
```

---

## 8. Database Migrations

### Commands Executed:
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser --email admin@shs.com --name "Admin User"
```

### Tables Created:
1. `users` - User accounts
2. `doctor_information` - Doctor profiles
3. Django default tables (auth, sessions, etc.)

### Migration Files:
- `apps/users/migrations/0001_initial.py`

---

## 9. Testing the APIs

### 9.1 Using cURL

#### Register User:
```bash
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "password_confirm": "SecurePass123",
    "phone": "01712345678",
    "location": "Dhaka, Bangladesh",
    "blood_group": "A+",
    "gender": "Male",
    "age": 30
  }'
```

#### Login:
```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

#### Get Profile (with token):
```bash
curl -X GET http://localhost:8000/api/v1/users/profile/ \
  -H "Authorization: Bearer <access_token>"
```

#### Apply as Doctor:
```bash
curl -X POST http://localhost:8000/api/v1/doctors/apply/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "license_number": "BM-12345",
    "qualification": "MBBS, MD",
    "specialization": "Cardiology",
    "practice_location": "Dhaka Medical",
    "experience_years": 10
  }'
```

---

### 9.2 Using Postman

1. **Import Collection:**
   - Create new collection "SHS API"
   - Set base URL: `http://localhost:8000/api/v1`

2. **Register Request:**
   - Method: POST
   - URL: `{{base_url}}/auth/register/`
   - Body: JSON (as shown above)

3. **Login Request:**
   - Method: POST
   - URL: `{{base_url}}/auth/login/`
   - Body: JSON
   - Save `access` token from response

4. **Profile Request:**
   - Method: GET
   - URL: `{{base_url}}/users/profile/`
   - Headers: `Authorization: Bearer {{access_token}}`

---

## 10. What We Learned

### Technical Concepts

#### 1. Custom User Model in Django
- How to extend AbstractUser
- Using email instead of username for authentication
- Creating custom UserManager
- Auto-generating unique IDs

#### 2. Django REST Framework
- Serializers for data validation and transformation
- APIView for creating REST endpoints
- Permission classes (AllowAny, IsAuthenticated)
- Response and status codes

#### 3. JWT Authentication
- Token-based authentication (stateless)
- Access tokens (short-lived, 1 hour)
- Refresh tokens (long-lived, 7 days)
- Bearer token in Authorization header

#### 4. Industrial Project Structure
- Organizing Django apps in `apps/` folder
- Splitting models, serializers, views into separate files
- Using `__init__.py` for clean imports
- Separation of concerns

#### 5. One-to-One Relationships
- DoctorInformation linked to User
- Related name: `user.doctor_profile`
- CASCADE deletion behavior

---

### Design Patterns

#### 1. RESTful API Design
- Proper HTTP methods (GET, POST, PATCH)
- Meaningful URLs (`/auth/register/`, `/users/profile/`)
- Standard response format
- Proper status codes (200, 201, 400, 401)

#### 2. Validation Pattern
- Serializer-level validation
- Field-level validation (validate_email, validate_phone)
- Object-level validation (validate method)
- Custom error messages

#### 3. Response Format Pattern
```json
{
  "success": true/false,
  "data": { ... },
  "errors": { ... },
  "message": "..."
}
```

---

### Best Practices Applied

✅ **Password Security:**
- Passwords hashed with bcrypt
- Never stored in plain text
- Password strength validation

✅ **Data Validation:**
- Email uniqueness
- Phone uniqueness
- Required fields enforcement
- Type validation

✅ **Code Organization:**
- Separate files for models, serializers, views
- Clear naming conventions
- Docstrings for all classes and methods

✅ **Database Design:**
- Proper indexes for performance
- Meaningful field names
- Appropriate field types
- Foreign key relationships

✅ **Error Handling:**
- Validation errors with field-specific messages
- Authentication errors with clear messages
- HTTP status codes matching the error type

---

## Sprint 1 Completion Checklist

### ✅ Backend Implementation
- [x] User model created
- [x] DoctorInformation model created
- [x] UserRegistrationSerializer implemented
- [x] UserLoginSerializer implemented
- [x] UserProfileSerializer implemented
- [x] DoctorApplicationSerializer implemented
- [x] Registration API view implemented
- [x] Login API view implemented
- [x] Profile API view implemented
- [x] Doctor application API view implemented
- [x] URLs configured
- [x] Admin panel configured
- [x] Settings updated
- [x] Migrations created and applied
- [x] Superuser created

### ✅ Documentation
- [x] Sprint 1 implementation guide
- [x] API documentation in sprint plan
- [x] Database schema documented
- [x] Code comments and docstrings

### ⏳ Pending (Not in Sprint 1 Scope)
- [ ] Email verification (Sprint 1.5)
- [ ] Password reset (Sprint 1.5)
- [ ] Frontend implementation (Separate task)
- [ ] Unit tests (Next priority)
- [ ] Integration tests (Next priority)
- [ ] Admin doctor approval (Sprint 2)

---

## Key Takeaways

### What Went Well ✅
1. Clean project structure from the start
2. Proper separation of concerns
3. Comprehensive API endpoints
4. JWT authentication working perfectly
5. Industrial-standard code organization

### Challenges Faced 🤔
1. Initial folder structure confusion (solved by using `apps/` folder)
2. Custom user model setup (solved with proper AUTH_USER_MODEL)
3. One-to-one relationship with User model

### Next Steps 🚀
1. **Sprint 1 Testing:** Write unit tests for models, serializers, views
2. **Frontend Integration:** Connect React to these APIs
3. **Sprint 2 Planning:** Doctor verification by admin
4. **Code Review:** Review and refactor if needed

---

## Useful Commands Reference

```bash
# Start virtual environment
source venv/bin/activate

# Run development server
python manage.py runserver

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests (when we write them)
python manage.py test apps.users

# Django shell (for testing)
python manage.py shell
```

---

## Conclusion

Sprint 1 is **COMPLETE**! ✅

We successfully implemented:
- ✅ User registration with auto-generated user_id
- ✅ User login with JWT tokens
- ✅ User profile viewing and updating
- ✅ Doctor application submission
- ✅ Admin panel for user and doctor management
- ✅ Industrial-standard Django REST Framework structure

The foundation is solid. All APIs are working, the database is structured properly, and the code is clean and maintainable.

**Status:** Ready for Frontend Integration & Testing Phase

---

**Document Created:** December 21, 2025  
**Author:** Sprint 1 Development Team  
**Version:** 1.0
