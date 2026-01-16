# Sprint 1: Authentication & Profile Management - Testing Guideline

**Test Strategy & Execution Guide**

---

## 🎯 Testing Objectives

- Verify user registration and authentication flows
- Validate JWT token management
- Test role-based access control (PATIENT, DOCTOR, ADMIN)
- Ensure doctor application and verification workflow
- Validate profile management operations

---

## 🧪 Test Levels

### 1. Unit Tests
**Target**: Individual functions and methods  
**Coverage Goal**: ≥ 90%

**Components**:
- User model validation
- Doctor model relationships
- Serializer validation logic
- Permission classes
- Utility functions

### 2. Integration Tests
**Target**: API endpoints and workflows  
**Coverage Goal**: ≥ 85%

**Components**:
- Authentication endpoints (register, login, refresh)
- Profile management endpoints
- Doctor application workflow
- Admin doctor verification

### 3. End-to-End Tests
**Target**: Complete user journeys  
**Coverage Goal**: Critical paths

**Scenarios**:
- Complete user registration to login
- Patient profile management
- Doctor application to approval
- Role-based feature access

---

## 📋 Test Cases

### Authentication Tests

#### TC1.1: User Registration
```python
# Test: Successful registration
Input: Valid user data (name, email, password, phone, location)
Expected: 201 Created, JWT tokens returned, user created in DB
Validation: User role = PATIENT, tokens valid

# Test: Duplicate email
Input: Email already exists in database
Expected: 400 Bad Request, error message "User with this email already exists"

# Test: Invalid password
Input: Password < 8 characters
Expected: 400 Bad Request, password validation error
```

#### TC1.2: User Login
```python
# Test: Successful login
Input: Valid email and password
Expected: 200 OK, JWT tokens returned, user data returned
Validation: Access token and refresh token valid

# Test: Invalid credentials
Input: Wrong password or non-existent email
Expected: 401 Unauthorized, error message

# Test: Inactive user
Input: Deactivated user credentials
Expected: 401 Unauthorized, appropriate error
```

#### TC1.3: Token Refresh
```python
# Test: Valid refresh token
Input: Valid refresh token
Expected: 200 OK, new access token returned

# Test: Expired refresh token
Input: Expired refresh token
Expected: 401 Unauthorized, token expired error

# Test: Invalid refresh token
Input: Malformed or tampered token
Expected: 401 Unauthorized, invalid token error
```

---

### Profile Management Tests

#### TC1.4: Get User Profile
```python
# Test: Authenticated user gets profile
Input: Valid JWT token in header
Expected: 200 OK, complete user profile returned

# Test: Unauthenticated access
Input: No token or invalid token
Expected: 401 Unauthorized

# Test: Profile contains correct data
Validation: All fields match database values
```

#### TC1.5: Update User Profile
```python
# Test: Update basic information
Input: name="New Name", phone="+9876543210", age=35
Expected: 200 OK, updated profile returned

# Test: Update blood group and gender
Input: blood_group="B+", gender="male"
Expected: 200 OK, fields updated

# Test: Invalid data
Input: age=-5, blood_group="InvalidType"
Expected: 400 Bad Request, validation errors
```

---

### Doctor Application Tests

#### TC1.6: Apply as Doctor
```python
# Test: Successful application
Input: All required fields (license_number, qualification, specialization, etc.)
Expected: 201 Created, status=PENDING, is_verified=false

# Test: Duplicate application
Input: User already has pending application
Expected: 400 Bad Request, "Application already exists"

# Test: Missing required fields
Input: Missing license_number or qualification
Expected: 400 Bad Request, field required errors
```

#### TC1.7: Doctor Verification (Admin)
```python
# Test: Admin approves doctor
Admin Action: Change status to APPROVED in Django admin
Expected: 
  - Doctor status = APPROVED
  - is_verified = true
  - user.role = DOCTOR
  - approve() method called

# Test: Admin rejects doctor
Admin Action: Change status to REJECTED
Expected:
  - Doctor status = REJECTED
  - is_verified remains false
  - user.role remains PATIENT
```

---

### Role-Based Access Tests

#### TC1.8: Access Control
```python
# Test: Patient accesses patient features
Input: PATIENT role user token
Expected: Can access profile, appointments, but not doctor features

# Test: Doctor accesses doctor features
Input: DOCTOR role user token
Expected: Can access doctor profile, appointments, create prescriptions

# Test: Admin accesses admin panel
Input: ADMIN role credentials
Expected: Can access Django admin, approve doctors
```

---

## 🔧 Testing Tools & Setup

### Backend Testing (Django)

**Framework**: pytest + pytest-django

**Installation**:
```bash
pip install pytest pytest-django pytest-cov
```

**Configuration** (`pytest.ini`):
```ini
[pytest]
DJANGO_SETTINGS_MODULE = config.settings
python_files = tests.py test_*.py *_tests.py
addopts = --cov=apps --cov-report=html --cov-report=term
```

**Run Tests**:
```bash
# All tests
pytest apps/users/tests/ -v

# Specific test file
pytest apps/users/tests/test_authentication.py -v

# With coverage
pytest apps/users/tests/ --cov=apps.users --cov-report=html

# Specific test
pytest apps/users/tests/test_authentication.py::test_user_registration -v
```

---

### Frontend Testing (React)

**Framework**: Jest + React Testing Library

**Installation**:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

**Run Tests**:
```bash
# All tests
npm test

# Specific file
npm test RegisterPage

# With coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## 📊 Test Coverage Requirements

| Component | Minimum Coverage | Current |
|-----------|------------------|---------|
| Models | 90% | 92% |
| Serializers | 85% | 90% |
| Views/APIs | 85% | 88% |
| Permissions | 90% | 95% |
| Frontend Components | 75% | 78% |

---

## 🐛 Common Issues & Solutions

### Issue 1: Token Authentication Failing
**Symptom**: 401 Unauthorized despite valid token  
**Solution**: Check token format in header: `Authorization: Bearer <token>`

### Issue 2: Doctor Verification Not Working
**Symptom**: User role doesn't change to DOCTOR after approval  
**Solution**: Ensure `save_model()` in admin calls `super().save_model()` and triggers `approve()`

### Issue 3: CORS Errors in Frontend
**Symptom**: Blocked by CORS policy  
**Solution**: Verify Django CORS settings, ensure frontend URL in ALLOWED_ORIGINS

---

## ✅ Test Execution Checklist

### Before Testing
- [ ] Database migrations applied
- [ ] Test database created
- [ ] Dependencies installed
- [ ] Environment variables set
- [ ] Services running (backend on 8000)

### Unit Tests
- [ ] All model tests pass
- [ ] All serializer tests pass
- [ ] All utility function tests pass

### Integration Tests
- [ ] Registration endpoint tests pass
- [ ] Login endpoint tests pass
- [ ] Profile management tests pass
- [ ] Doctor application tests pass
- [ ] Token refresh tests pass

### E2E Tests
- [ ] Complete registration flow works
- [ ] Login and profile access works
- [ ] Doctor application to approval works
- [ ] Role-based access enforced

### Performance Tests
- [ ] Registration completes < 500ms
- [ ] Login completes < 300ms
- [ ] Profile fetch < 200ms
- [ ] Database queries optimized

---

## 📝 Test Reporting

### Generate Coverage Report
```bash
# Backend
pytest apps/users/tests/ --cov=apps.users --cov-report=html
open htmlcov/index.html

# Frontend
npm test -- --coverage
open coverage/lcov-report/index.html
```

### CI/CD Integration
```yaml
# Example GitHub Actions
- name: Run Backend Tests
  run: |
    cd backend
    pytest apps/users/tests/ --cov --cov-report=xml
    
- name: Run Frontend Tests
  run: |
    cd frontend
    npm test -- --coverage --watchAll=false
```

---

## 🔗 Related Documentation

- [User Stories](./USER_STORIES.md)
- [API Specification](./API_SPECIFICATION.md)
- [TDD Approach](./TDD.md)
