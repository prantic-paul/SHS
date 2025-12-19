# API Design Principles - Smart Health Synchronizer

## Table of Contents
- [RESTful API Fundamentals](#restful-api-fundamentals)
- [HTTP Methods](#http-methods)
- [HTTP Status Codes](#http-status-codes)
- [URL Structure & Naming](#url-structure--naming)
- [Request & Response Format](#request--response-format)
- [Authentication & Authorization](#authentication--authorization)
- [Pagination & Filtering](#pagination--filtering)
- [Error Handling](#error-handling)
- [Versioning](#versioning)
- [Best Practices](#best-practices)

---

## RESTful API Fundamentals

### What is REST?

**REST (Representational State Transfer)** is an architectural style for designing networked applications.

### Core Principles:

1. **Client-Server Architecture**
   - Frontend (React) and Backend (Django) are separate
   - They communicate over HTTP

2. **Stateless**
   - Each request contains all information needed
   - Server doesn't store client state between requests
   - JWT tokens contain user information

3. **Cacheable**
   - Responses can be cached for better performance
   - Use HTTP cache headers

4. **Uniform Interface**
   - Standard HTTP methods (GET, POST, PUT, DELETE)
   - Predictable URL patterns
   - JSON response format

5. **Resource-Based**
   - Everything is a "resource" (users, appointments, prescriptions)
   - Resources identified by URLs
   - Actions performed using HTTP methods

---

## HTTP Methods

### Standard CRUD Operations

| HTTP Method | Action | Example | Description |
|-------------|--------|---------|-------------|
| **GET** | Read | `GET /api/appointments/` | Retrieve list of resources |
| **GET** | Read | `GET /api/appointments/1/` | Retrieve single resource |
| **POST** | Create | `POST /api/appointments/` | Create new resource |
| **PUT** | Update (Full) | `PUT /api/appointments/1/` | Update entire resource |
| **PATCH** | Update (Partial) | `PATCH /api/appointments/1/` | Update specific fields |
| **DELETE** | Delete | `DELETE /api/appointments/1/` | Delete resource |

### Method Details:

#### 1. GET (Retrieve Data)

**Purpose**: Fetch data from server

**Characteristics**:
- Safe (doesn't change data)
- Idempotent (calling multiple times has same effect)
- Can be cached

**Examples**:
```http
# Get all appointments
GET /api/appointments/
Response: [
  {"id": 1, "doctor": {...}, "patient": {...}},
  {"id": 2, "doctor": {...}, "patient": {...}}
]

# Get specific appointment
GET /api/appointments/1/
Response: {"id": 1, "doctor": {...}, "patient": {...}}

# Get with filters
GET /api/appointments/?status=confirmed
GET /api/appointments/?doctor_id=1&date=2025-01-05
```

#### 2. POST (Create New Resource)

**Purpose**: Create new data

**Characteristics**:
- Not safe (changes data)
- Not idempotent (creates new resource each time)
- Returns 201 Created on success

**Example**:
```http
POST /api/appointments/
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Request Body:
{
  "doctor_id": 1,
  "patient_id": 1,
  "appointment_date": "2025-01-15T10:00:00",
  "reason": "Regular checkup"
}

Response: 201 Created
{
  "id": 5,
  "doctor": {
    "id": 1,
    "name": "Dr. Ahmed Rahman",
    "specialization": "Cardiologist"
  },
  "patient": {
    "id": 1,
    "name": "Fatima Khan"
  },
  "appointment_date": "2025-01-15T10:00:00",
  "status": "pending",
  "reason": "Regular checkup",
  "created_at": "2025-01-01T12:00:00"
}
```

#### 3. PUT (Full Update)

**Purpose**: Replace entire resource

**Characteristics**:
- Not safe (changes data)
- Idempotent (same result if called multiple times)
- Must send all fields

**Example**:
```http
PUT /api/appointments/5/
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Request Body (ALL fields required):
{
  "doctor_id": 1,
  "patient_id": 1,
  "appointment_date": "2025-01-15T14:00:00",  # Changed time
  "status": "confirmed",                       # Changed status
  "reason": "Regular checkup"
}

Response: 200 OK
{
  "id": 5,
  "doctor_id": 1,
  "patient_id": 1,
  "appointment_date": "2025-01-15T14:00:00",
  "status": "confirmed",
  "reason": "Regular checkup"
}
```

#### 4. PATCH (Partial Update)

**Purpose**: Update specific fields only

**Characteristics**:
- Not safe (changes data)
- Idempotent
- Only send fields you want to change

**Example**:
```http
PATCH /api/appointments/5/
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Request Body (Only changed fields):
{
  "status": "confirmed"
}

Response: 200 OK
{
  "id": 5,
  "doctor_id": 1,
  "patient_id": 1,
  "appointment_date": "2025-01-15T14:00:00",
  "status": "confirmed",  # Updated
  "reason": "Regular checkup"
}
```

**When to use PUT vs PATCH?**
- **PATCH**: Preferred (more flexible, less data sent)
- **PUT**: When you want to replace entire resource

#### 5. DELETE (Remove Resource)

**Purpose**: Delete a resource

**Characteristics**:
- Not safe (changes data)
- Idempotent (deleting deleted resource = same result)

**Example**:
```http
DELETE /api/appointments/5/
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response: 204 No Content
(No response body)
```

---

## HTTP Status Codes

### Success Codes (2xx)

| Code | Meaning | Use Case |
|------|---------|----------|
| **200 OK** | Success | GET, PUT, PATCH successful |
| **201 Created** | Resource created | POST successful |
| **204 No Content** | Success, no data returned | DELETE successful |

### Client Error Codes (4xx)

| Code | Meaning | Use Case |
|------|---------|----------|
| **400 Bad Request** | Invalid data | Validation failed |
| **401 Unauthorized** | Not authenticated | Missing/invalid JWT token |
| **403 Forbidden** | Not authorized | User can't access resource |
| **404 Not Found** | Resource doesn't exist | Invalid ID |
| **409 Conflict** | Resource conflict | Duplicate email, time slot taken |
| **422 Unprocessable Entity** | Validation error | Invalid field values |
| **429 Too Many Requests** | Rate limit exceeded | Too many API calls |

### Server Error Codes (5xx)

| Code | Meaning | Use Case |
|------|---------|----------|
| **500 Internal Server Error** | Server crashed | Unhandled exception |
| **502 Bad Gateway** | Upstream service failed | AI service down |
| **503 Service Unavailable** | Server overloaded | Maintenance mode |

### Examples:

```http
# Success: Get appointments
GET /api/appointments/
Response: 200 OK

# Success: Create appointment
POST /api/appointments/
Response: 201 Created

# Error: Invalid JWT token
GET /api/appointments/
Response: 401 Unauthorized
{
  "detail": "Authentication credentials were not provided."
}

# Error: Permission denied (patient trying to delete prescription)
DELETE /api/prescriptions/1/
Response: 403 Forbidden
{
  "detail": "You do not have permission to perform this action."
}

# Error: Appointment not found
GET /api/appointments/999/
Response: 404 Not Found
{
  "detail": "Not found."
}

# Error: Validation failed
POST /api/appointments/
Request: {"doctor_id": "abc"}  # Invalid type
Response: 400 Bad Request
{
  "doctor_id": ["A valid integer is required."]
}
```

---

## URL Structure & Naming

### URL Pattern

```
https://api.smarthealthsync.com/api/{version}/{resource}/{id}/{sub-resource}/
```

### Naming Conventions:

1. **Use nouns, not verbs**
   - ✅ `GET /api/appointments/`
   - ❌ `GET /api/getAppointments/`

2. **Use plural nouns**
   - ✅ `GET /api/doctors/`
   - ❌ `GET /api/doctor/`

3. **Use lowercase with hyphens**
   - ✅ `/api/health-records/`
   - ❌ `/api/HealthRecords/`
   - ❌ `/api/health_records/` (underscore OK but hyphen preferred)

4. **No trailing slash** (Django adds it automatically)
   - ✅ `/api/appointments/1/`
   - ⚠️ `/api/appointments/1` (Django redirects to above)

5. **Hierarchical structure for relationships**
   - ✅ `/api/doctors/1/appointments/`
   - ✅ `/api/patients/1/prescriptions/`

### Our API Endpoints:

```
# Authentication
POST   /api/auth/register/
POST   /api/auth/login/
POST   /api/auth/refresh/
POST   /api/auth/logout/

# Users
GET    /api/users/
GET    /api/users/{id}/
PATCH  /api/users/{id}/
DELETE /api/users/{id}/

# Doctors
GET    /api/doctors/
GET    /api/doctors/{id}/
POST   /api/doctors/
PATCH  /api/doctors/{id}/
DELETE /api/doctors/{id}/
GET    /api/doctors/{id}/appointments/     # Nested resource
GET    /api/doctors/?specialization=Cardiologist  # Filter

# Patients
GET    /api/patients/
GET    /api/patients/{id}/
POST   /api/patients/
PATCH  /api/patients/{id}/
DELETE /api/patients/{id}/
GET    /api/patients/{id}/appointments/
GET    /api/patients/{id}/prescriptions/
GET    /api/patients/{id}/health-records/

# Appointments
GET    /api/appointments/
GET    /api/appointments/{id}/
POST   /api/appointments/
PATCH  /api/appointments/{id}/
DELETE /api/appointments/{id}/
GET    /api/appointments/?status=confirmed
GET    /api/appointments/?doctor_id=1

# Prescriptions
GET    /api/prescriptions/
GET    /api/prescriptions/{id}/
POST   /api/prescriptions/
PATCH  /api/prescriptions/{id}/
DELETE /api/prescriptions/{id}/

# Health Records
GET    /api/health-records/
GET    /api/health-records/{id}/
POST   /api/health-records/
PATCH  /api/health-records/{id}/
DELETE /api/health-records/{id}/

# Blogs
GET    /api/blogs/
GET    /api/blogs/{id}/
POST   /api/blogs/
PATCH  /api/blogs/{id}/
DELETE /api/blogs/{id}/
GET    /api/blogs/{id}/comments/
POST   /api/blogs/{id}/comments/

# AI Features (Backend proxies to FastAPI)
POST   /api/ai/predict-disease/
POST   /api/ai/recommend-doctor/
POST   /api/ai/assess-risk/
```

---

## Request & Response Format

### Request Format

**Content-Type**: Always use `application/json`

```http
POST /api/appointments/
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "doctor_id": 1,
  "patient_id": 1,
  "appointment_date": "2025-01-15T10:00:00",
  "reason": "Regular checkup"
}
```

### Response Format

**Standard Success Response**:
```json
{
  "id": 1,
  "doctor": {
    "id": 1,
    "name": "Dr. Ahmed Rahman",
    "specialization": "Cardiologist"
  },
  "patient": {
    "id": 1,
    "name": "Fatima Khan"
  },
  "appointment_date": "2025-01-15T10:00:00",
  "status": "pending",
  "reason": "Regular checkup",
  "created_at": "2025-01-01T12:00:00"
}
```

**Standard Error Response**:
```json
{
  "detail": "Error message here"
}
```

**Validation Error Response**:
```json
{
  "field_name": ["Error message for this field"],
  "another_field": ["Another error message"]
}
```

### Response Fields:

1. **Always include IDs**
   - `id`, `doctor_id`, `patient_id`

2. **Use ISO 8601 for dates**
   - `"2025-01-15T10:00:00Z"` (with timezone)
   - `"2025-01-15"` (date only)

3. **Use nested objects for relationships**
   ```json
   {
     "id": 1,
     "doctor": {           // Nested object, not just ID
       "id": 1,
       "name": "Dr. Ahmed",
       "specialization": "Cardiologist"
     }
   }
   ```

4. **Include timestamps**
   - `created_at`, `updated_at`

---

## Authentication & Authorization

### JWT Token Authentication

**Login Flow**:
```http
POST /api/auth/login/
Content-Type: application/json

Request:
{
  "email": "patient1@example.com",
  "password": "securepassword"
}

Response: 200 OK
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Using Access Token**:
```http
GET /api/appointments/
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Refresh Token**:
```http
POST /api/auth/refresh/
Content-Type: application/json

Request:
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response: 200 OK
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  # New access token
}
```

### Authorization Rules

**1. Public Endpoints** (No authentication required):
```
GET  /api/blogs/           # Anyone can read blogs
GET  /api/blogs/{id}/
GET  /api/doctors/         # Anyone can view doctor list
GET  /api/doctors/{id}/
```

**2. Authenticated Endpoints** (Require login):
```
GET  /api/appointments/    # View own appointments
POST /api/appointments/    # Book appointment
```

**3. Role-Based Endpoints**:

**Patient-only**:
```
POST /api/appointments/    # Only patients can book
GET  /api/patients/{id}/   # View own profile only
```

**Doctor-only**:
```
POST /api/prescriptions/   # Only doctors can prescribe
POST /api/blogs/           # Only doctors can write blogs
```

**Example Authorization Logic**:
```python
# views.py
class PrescriptionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsDoctorOrReadOnly]
    
    def create(self, request):
        # Only doctors can create prescriptions
        if request.user.user_type != 'doctor':
            return Response(
                {"detail": "Only doctors can create prescriptions."},
                status=403
            )
        # ... create prescription
```

---

## Pagination & Filtering

### Pagination

**Why?** Don't return 10,000 appointments in one request!

**Default Pagination** (Django REST Framework):
```http
GET /api/appointments/

Response:
{
  "count": 156,
  "next": "https://api.example.com/api/appointments/?page=2",
  "previous": null,
  "results": [
    {"id": 1, ...},
    {"id": 2, ...},
    ...
  ]
}
```

**Page Size**:
```http
GET /api/appointments/?page=2&page_size=10
```

**Cursor Pagination** (for large datasets):
```http
GET /api/appointments/?cursor=cD0yMDIx

Response:
{
  "next": "https://api.example.com/api/appointments/?cursor=cD0yMDIy",
  "previous": "https://api.example.com/api/appointments/?cursor=cD0yMDIw",
  "results": [...]
}
```

### Filtering

**Basic Filtering**:
```http
# Filter by status
GET /api/appointments/?status=confirmed

# Filter by doctor
GET /api/appointments/?doctor_id=1

# Filter by date range
GET /api/appointments/?date_after=2025-01-01&date_before=2025-01-31

# Multiple filters
GET /api/appointments/?doctor_id=1&status=confirmed&date_after=2025-01-01
```

**Search**:
```http
# Search in multiple fields
GET /api/doctors/?search=cardiologist

# Searches in: name, specialization, bio
```

**Ordering**:
```http
# Sort by date (ascending)
GET /api/appointments/?ordering=appointment_date

# Sort by date (descending)
GET /api/appointments/?ordering=-appointment_date

# Multiple ordering
GET /api/appointments/?ordering=-appointment_date,status
```

### Example in Frontend (React):
```javascript
// Fetch filtered appointments
const fetchAppointments = async (filters) => {
  const params = new URLSearchParams();
  
  if (filters.status) params.append('status', filters.status);
  if (filters.doctor_id) params.append('doctor_id', filters.doctor_id);
  if (filters.page) params.append('page', filters.page);
  
  const response = await axios.get(
    `/api/appointments/?${params.toString()}`
  );
  return response.data;
};

// Usage
const data = await fetchAppointments({
  status: 'confirmed',
  doctor_id: 1,
  page: 1
});
```

---

## Error Handling

### Standard Error Response

```json
{
  "detail": "Error message"
}
```

### Validation Errors

```json
{
  "email": ["This field is required."],
  "password": ["Password must be at least 8 characters."]
}
```

### Custom Error Codes

```json
{
  "error": {
    "code": "APPOINTMENT_CONFLICT",
    "message": "Doctor is not available at this time.",
    "details": {
      "conflicting_appointment_id": 15,
      "available_slots": ["10:00", "14:00"]
    }
  }
}
```

### Error Handling in Frontend:
```javascript
try {
  const response = await axios.post('/api/appointments/', data);
  // Success
} catch (error) {
  if (error.response) {
    // Server responded with error
    const status = error.response.status;
    const data = error.response.data;
    
    if (status === 400) {
      // Validation error
      console.log('Validation errors:', data);
    } else if (status === 401) {
      // Unauthorized - redirect to login
      navigate('/login');
    } else if (status === 403) {
      // Forbidden
      alert('You do not have permission');
    } else if (status === 404) {
      alert('Resource not found');
    }
  } else {
    // Network error
    alert('Network error. Please try again.');
  }
}
```

---

## Versioning

### Why Version APIs?

- Breaking changes don't break old clients
- Smooth migration to new features
- Support multiple app versions

### Versioning Strategies:

**1. URL Versioning** (Our approach):
```
https://api.example.com/api/v1/appointments/
https://api.example.com/api/v2/appointments/
```

**2. Header Versioning**:
```http
GET /api/appointments/
Accept: application/vnd.myapi.v1+json
```

**3. Query Parameter**:
```
https://api.example.com/api/appointments/?version=1
```

### Our Versioning Strategy:

```python
# urls.py
urlpatterns = [
    path('api/v1/', include('api.v1.urls')),
    # Future: path('api/v2/', include('api.v2.urls')),
]
```

**When to create new version?**
- Breaking changes (changing field names, removing fields)
- Not needed for adding new fields or endpoints

---

## Best Practices

### 1. Use HTTPS in Production
```
✅ https://api.example.com/api/appointments/
❌ http://api.example.com/api/appointments/
```

### 2. Rate Limiting
```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour'
    }
}
```

### 3. CORS Configuration
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Frontend dev server
    "https://smarthealthsync.com"  # Production frontend
]
```

### 4. API Documentation
- Use drf-spectacular for automatic OpenAPI docs
- Access at: `/api/docs/`

### 5. Field Selection (Sparse Fieldsets)
```http
# Get only specific fields
GET /api/appointments/?fields=id,appointment_date,status
```

### 6. Bulk Operations
```http
# Create multiple resources
POST /api/prescriptions/bulk/
[
  {"doctor_id": 1, "patient_id": 1, ...},
  {"doctor_id": 1, "patient_id": 2, ...}
]
```

### 7. Health Check Endpoint
```http
GET /api/health/
Response: 200 OK
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-01-01T12:00:00Z"
}
```

---

## Complete Example: Appointment Booking Flow

```http
# 1. Patient logs in
POST /api/auth/login/
{
  "email": "patient1@example.com",
  "password": "securepassword"
}
Response: 200 OK
{
  "access": "eyJhbGci...",
  "refresh": "eyJhbGci..."
}

# 2. Get list of doctors
GET /api/doctors/?specialization=Cardiologist
Authorization: Bearer eyJhbGci...

Response: 200 OK
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "name": "Dr. Ahmed Rahman",
      "specialization": "Cardiologist",
      "experience_years": 10,
      "consultation_fee": 1500.00
    }
  ]
}

# 3. Check doctor availability
GET /api/doctors/1/available-slots/?date=2025-01-15
Authorization: Bearer eyJhbGci...

Response: 200 OK
{
  "date": "2025-01-15",
  "available_slots": ["10:00", "11:00", "14:00", "15:00"]
}

# 4. Book appointment
POST /api/appointments/
Authorization: Bearer eyJhbGci...
{
  "doctor_id": 1,
  "appointment_date": "2025-01-15T10:00:00",
  "reason": "Chest pain consultation"
}

Response: 201 Created
{
  "id": 25,
  "doctor": {
    "id": 1,
    "name": "Dr. Ahmed Rahman",
    "specialization": "Cardiologist"
  },
  "patient": {
    "id": 1,
    "name": "Fatima Khan"
  },
  "appointment_date": "2025-01-15T10:00:00",
  "status": "pending",
  "reason": "Chest pain consultation",
  "created_at": "2025-01-01T12:00:00"
}

# 5. Get appointment details
GET /api/appointments/25/
Authorization: Bearer eyJhbGci...

Response: 200 OK
{
  "id": 25,
  "doctor": {...},
  "patient": {...},
  "appointment_date": "2025-01-15T10:00:00",
  "status": "pending"
}
```

---

## Summary Checklist

### ✅ API Design Checklist:

- [ ] Use standard HTTP methods (GET, POST, PUT/PATCH, DELETE)
- [ ] Return correct HTTP status codes
- [ ] Use nouns in URLs, not verbs
- [ ] Use plural resource names
- [ ] Implement JWT authentication
- [ ] Add authorization checks
- [ ] Implement pagination
- [ ] Support filtering and searching
- [ ] Use JSON for requests and responses
- [ ] Handle errors gracefully
- [ ] Version your API
- [ ] Document your API (OpenAPI/Swagger)
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Configure CORS properly

---

## Resources

- [REST API Tutorial](https://restfulapi.net/)
- [Django REST Framework Docs](https://www.django-rest-framework.org/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [JSON API Specification](https://jsonapi.org/)
