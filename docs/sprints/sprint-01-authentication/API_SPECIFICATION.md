# Sprint 1: User Authentication & Profile Management - API Specification

**Version**: 1.0  
**Base URL**: `http://localhost:8000/api/v1`

---

## 🔐 Authentication Endpoints

### 1. User Registration
**Endpoint**: `POST /auth/register/`  
**Description**: Register a new user account

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",
  "location": "New York",
  "blood_group": "A+",  // Optional
  "gender": "male",      // Optional: male, female, other
  "age": 30              // Optional
}
```

**Success Response** (201 Created):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "PATIENT",
    "phone": "+1234567890",
    "location": "New York"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbG...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

**Error Responses**:
- `400 Bad Request`: Validation errors
  ```json
  {
    "email": ["User with this email already exists."],
    "password": ["Password must be at least 8 characters."]
  }
  ```

---

### 2. User Login
**Endpoint**: `POST /auth/login/`  
**Description**: Authenticate user and generate JWT tokens

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response** (200 OK):
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "PATIENT"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbG...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid credentials
  ```json
  {
    "detail": "Invalid email or password"
  }
  ```

---

### 3. Refresh Token
**Endpoint**: `POST /auth/refresh/`  
**Description**: Generate new access token using refresh token

**Request Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Success Response** (200 OK):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOi..."
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or expired refresh token

---

## 👤 User Profile Endpoints

### 4. Get User Profile
**Endpoint**: `GET /users/profile/`  
**Description**: Get authenticated user's profile  
**Authentication**: Required (Bearer Token)

**Success Response** (200 OK):
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "PATIENT",
  "phone": "+1234567890",
  "location": "New York",
  "blood_group": "A+",
  "gender": "male",
  "age": 30,
  "created_at": "2025-12-19T10:30:00Z"
}
```

**Headers**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

---

### 5. Update User Profile
**Endpoint**: `PUT /users/profile/`  
**Description**: Update authenticated user's profile  
**Authentication**: Required (Bearer Token)

**Request Body**:
```json
{
  "name": "John Updated",
  "phone": "+1234567899",
  "location": "Los Angeles",
  "blood_group": "B+",
  "gender": "male",
  "age": 31
}
```

**Success Response** (200 OK):
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "John Updated",
    "email": "john@example.com",
    "phone": "+1234567899",
    "location": "Los Angeles",
    "blood_group": "B+",
    "gender": "male",
    "age": 31
  }
}
```

---

## 👨‍⚕️ Doctor Endpoints

### 6. Apply as Doctor
**Endpoint**: `POST /users/apply-doctor/`  
**Description**: Submit doctor application  
**Authentication**: Required (Bearer Token)

**Request Body**:
```json
{
  "license_number": "MD12345",
  "qualification": "MBBS, MD",
  "specialization": "Cardiology",
  "education": "Harvard Medical School",
  "practice_location": "New York Medical Center",
  "experience_years": 10,
  "bio": "Experienced cardiologist with 10 years of practice..."
}
```

**Success Response** (201 Created):
```json
{
  "message": "Doctor application submitted successfully",
  "doctor_info": {
    "id": 1,
    "user": 1,
    "license_number": "MD12345",
    "qualification": "MBBS, MD",
    "specialization": "Cardiology",
    "status": "PENDING",
    "is_verified": false
  }
}
```

**Error Responses**:
- `400 Bad Request`: Application already exists
  ```json
  {
    "detail": "Doctor application already submitted"
  }
  ```

---

### 7. Get Doctor Profile
**Endpoint**: `GET /users/doctor-profile/`  
**Description**: Get authenticated doctor's profile  
**Authentication**: Required (Bearer Token, Role: DOCTOR)

**Success Response** (200 OK):
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "name": "Dr. John Doe",
    "email": "john@example.com"
  },
  "license_number": "MD12345",
  "qualification": "MBBS, MD",
  "specialization": "Cardiology",
  "education": "Harvard Medical School",
  "practice_location": "New York Medical Center",
  "experience_years": 10,
  "bio": "Experienced cardiologist...",
  "status": "APPROVED",
  "is_verified": true,
  "rating_avg": 4.7,
  "created_at": "2025-12-19T14:20:00Z"
}
```

---

### 8. Update Doctor Profile
**Endpoint**: `PUT /users/doctor-profile/`  
**Description**: Update authenticated doctor's profile  
**Authentication**: Required (Bearer Token, Role: DOCTOR)

**Request Body**:
```json
{
  "qualification": "MBBS, MD, DM",
  "bio": "Updated bio with new achievements...",
  "experience_years": 12
}
```

**Success Response** (200 OK):
```json
{
  "message": "Doctor profile updated successfully",
  "doctor_info": {
    "id": 1,
    "qualification": "MBBS, MD, DM",
    "bio": "Updated bio...",
    "experience_years": 12
  }
}
```

---

## 🔑 Authentication Headers

All protected endpoints require JWT access token:

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## 📝 Models Schema

### User Model
```python
{
  "id": integer,
  "name": string,
  "email": string (unique),
  "password": string (hashed),
  "role": string (PATIENT|DOCTOR|ADMIN),
  "phone": string,
  "location": string,
  "blood_group": string (optional),
  "gender": string (optional),
  "age": integer (optional),
  "created_at": datetime
}
```

### DoctorInformation Model
```python
{
  "id": integer,
  "user": foreign_key(User),
  "license_number": string (unique),
  "qualification": string,
  "specialization": string,
  "education": string,
  "practice_location": string,
  "experience_years": integer,
  "bio": text,
  "status": string (PENDING|APPROVED|REJECTED),
  "is_verified": boolean,
  "rating_avg": float,
  "created_at": datetime
}
```

---

## ⚠️ Error Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication failed or missing
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## 🧪 Testing Examples

### Using cURL

**Register User**:
```bash
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!",
    "phone": "+1234567890",
    "location": "Test City"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

**Get Profile** (with token):
```bash
curl -X GET http://localhost:8000/api/v1/users/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🔗 Related Documentation

- [User Stories](./USER_STORIES.md)
- [TDD Approach](./TDD.md)
- [Testing Guide](./TESTING_GUIDE.md)
