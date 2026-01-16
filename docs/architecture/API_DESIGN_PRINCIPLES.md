# API Design Principles: Smart Health Synchronizer

**Industry-Standard API Guidelines**

---

## 📋 Document Information

| Attribute | Value |
|-----------|-------|
| **Version** | 2.0 |
| **Last Updated** | January 16, 2026 |
| **API Framework** | Django REST Framework 3.14.0 |
| **API Standard** | REST (RESTful) |
| **Base URL** | `/api/v1/` |

---

## 🎯 Core Principles

### 1. RESTful Design
We follow **REST (Representational State Transfer)** architectural constraints:

- **Stateless**: Each request contains all necessary information
- **Client-Server Separation**: Decoupled frontend and backend
- **Cacheable**: Responses define cacheability
- **Uniform Interface**: Consistent endpoint structure
- **Layered System**: Architecture can have intermediary servers (load balancers, caches)

### 2. Resource-Oriented
APIs organized around **resources** (nouns), not actions (verbs):

✅ **Good:**
- `GET /api/v1/doctors/` - List doctors
- `POST /api/v1/appointments/` - Create appointment
- `PUT /api/v1/users/profile/` - Update profile

❌ **Bad:**
- `GET /api/v1/getDoctors/`
- `POST /api/v1/createAppointment/`
- `POST /api/v1/updateProfile/`

### 3. Consistency
- Naming conventions strictly followed
- Response formats standardized
- Error handling unified
- Authentication mechanism uniform

---

## 📐 Endpoint Structure

### Base URL Pattern
```
https://api.example.com/api/v1/{resource}/{id}/{action}/
```

### Examples
```
GET    /api/v1/doctors/                 # List all doctors
GET    /api/v1/doctors/5/               # Get specific doctor
POST   /api/v1/doctors/5/rate/          # Rate a doctor (custom action)
GET    /api/v1/appointments/            # List user's appointments
POST   /api/v1/appointments/            # Create appointment
DELETE /api/v1/appointments/12/         # Cancel appointment
```

---

## 🔤 Naming Conventions

### 1. URL Naming
- **Lowercase only**: `/api/v1/users/`, not `/api/v1/Users/`
- **Plural nouns**: `/doctors/`, not `/doctor/`
- **Hyphens for multi-word**: `/medical-records/`, not `/medicalRecords/`
- **No trailing slash in requests**: `/doctors` (but Django adds `/` by default)

### 2. JSON Field Naming
- **snake_case**: `appointment_date`, not `appointmentDate`
- **Descriptive**: `created_at`, not `created`
- **Boolean prefix**: `is_verified`, `has_permission`

### 3. Query Parameters
- **snake_case**: `?specialization=cardiology&location=dhaka`
- **Filters**: `?status=PENDING&date=2026-01-16`
- **Pagination**: `?page=1&page_size=20`
- **Search**: `?search=heart`
- **Ordering**: `?ordering=-created_at` (descending)

---

## 🔧 HTTP Methods

### Standard CRUD Operations

| Method | Action | Example | Idempotent | Safe |
|--------|--------|---------|------------|------|
| **GET** | Read/Retrieve | `GET /api/v1/doctors/5/` | ✅ Yes | ✅ Yes |
| **POST** | Create | `POST /api/v1/appointments/` | ❌ No | ❌ No |
| **PUT** | Update (full) | `PUT /api/v1/users/profile/` | ✅ Yes | ❌ No |
| **PATCH** | Update (partial) | `PATCH /api/v1/doctors/5/` | ❌ No | ❌ No |
| **DELETE** | Delete | `DELETE /api/v1/appointments/12/` | ✅ Yes | ❌ No |

### Custom Actions
For actions that don't fit CRUD, use POST with action suffix:
```
POST /api/v1/doctors/5/rate/           # Rate doctor
POST /api/v1/auth/login/                # User login
POST /api/v1/auth/refresh/              # Refresh token
GET  /api/v1/appointments/doctor-dashboard/  # Doctor's dashboard
```

---

## 📊 Request Format

### Headers
```http
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept: application/json
```

### Request Body (POST/PUT/PATCH)
```json
{
  "doctor_id": 5,
  "appointment_date": "2026-01-20",
  "appointment_time": "10:30",
  "reason": "Regular checkup"
}
```

### Query Parameters (GET)
```http
GET /api/v1/doctors/?specialization=Cardiology&location=Dhaka&page=1
```

---

## 📤 Response Format

### Success Response Structure
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Dr. John Doe",
    "specialization": "Cardiology",
    "rating_avg": 4.5
  },
  "message": "Doctor retrieved successfully",
  "timestamp": "2026-01-16T10:30:00Z"
}
```

### List Response with Pagination
```json
{
  "success": true,
  "data": {
    "count": 150,
    "next": "/api/v1/doctors/?page=2",
    "previous": null,
    "results": [
      {
        "id": 1,
        "name": "Dr. Alice Smith",
        "specialization": "Cardiology"
      },
      {
        "id": 2,
        "name": "Dr. Bob Johnson",
        "specialization": "Neurology"
      }
    ]
  },
  "message": "Doctors retrieved successfully"
}
```

### Error Response Structure
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "details": {
      "email": ["User with this email does not exist"]
    }
  },
  "timestamp": "2026-01-16T10:30:00Z"
}
```

---

## 🔢 HTTP Status Codes

### Success Codes (2xx)

| Code | Name | Usage |
|------|------|-------|
| **200** | OK | Successful GET, PUT, PATCH, DELETE |
| **201** | Created | Successful POST (resource created) |
| **204** | No Content | Successful DELETE (no response body) |

### Client Error Codes (4xx)

| Code | Name | Usage |
|------|------|-------|
| **400** | Bad Request | Validation error, malformed request |
| **401** | Unauthorized | Missing or invalid authentication token |
| **403** | Forbidden | Authenticated but not authorized |
| **404** | Not Found | Resource does not exist |
| **409** | Conflict | Duplicate resource (e.g., email already exists) |
| **422** | Unprocessable Entity | Semantic validation error |
| **429** | Too Many Requests | Rate limit exceeded |

### Server Error Codes (5xx)

| Code | Name | Usage |
|------|------|-------|
| **500** | Internal Server Error | Unexpected server error |
| **502** | Bad Gateway | AI/ML service unavailable |
| **503** | Service Unavailable | Server overload or maintenance |

---

## 🔐 Authentication & Authorization

### JWT-Based Authentication

#### 1. Login (Obtain Tokens)
```http
POST /api/v1/auth/login/
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "securepassword"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 25,
      "email": "patient@example.com",
      "name": "John Doe",
      "role": "PATIENT"
    }
  },
  "message": "Login successful"
}
```

**Token Lifetimes:**
- Access Token: 15 minutes
- Refresh Token: 7 days

#### 2. Refresh Access Token
```http
POST /api/v1/auth/refresh/
Content-Type: application/json

{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. Protected Endpoint Request
```http
GET /api/v1/users/profile/
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Authorization Levels

| Role | Access |
|------|--------|
| **PATIENT** | Profile, appointments, chat, medical records, prescriptions (own) |
| **DOCTOR** | All PATIENT + Doctor dashboard, create records/prescriptions, manage blogs |
| **ADMIN** | All + Django admin, doctor verification, system management |

### Error Responses

**401 Unauthorized:**
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_REQUIRED",
    "message": "Authentication credentials were not provided"
  }
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You do not have permission to perform this action"
  }
}
```

---

## ✅ Validation & Error Handling

### Field Validation

#### Required Field Missing
**Request:**
```json
POST /api/v1/appointments/
{
  "doctor_id": 5
  // Missing appointment_date
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "appointment_date": ["This field is required"]
    }
  }
}
```

#### Invalid Data Type
**Request:**
```json
POST /api/v1/doctors/5/rate/
{
  "rating": "excellent"  // Should be integer 1-5
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "rating": ["A valid integer is required"]
    }
  }
}
```

#### Business Logic Validation
**Request:**
```json
POST /api/v1/appointments/
{
  "doctor_id": 5,
  "appointment_date": "2026-01-01"  // Past date
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_DATE",
    "message": "Cannot book appointment in the past",
    "details": {
      "appointment_date": ["Date cannot be in the past"]
    }
  }
}
```

---

## 🔍 Filtering, Searching & Pagination

### Filtering
```http
GET /api/v1/doctors/?specialization=Cardiology&location=Dhaka
```

### Full-Text Search
```http
GET /api/v1/doctors/?search=heart surgery
```

### Ordering
```http
GET /api/v1/doctors/?ordering=-rating_avg  # Descending
GET /api/v1/doctors/?ordering=experience_years  # Ascending
```

### Pagination
```http
GET /api/v1/doctors/?page=2&page_size=20
```

**Response:**
```json
{
  "count": 150,
  "next": "/api/v1/doctors/?page=3",
  "previous": "/api/v1/doctors/?page=1",
  "results": [...]
}
```

### Combined Example
```http
GET /api/v1/doctors/?specialization=Cardiology&search=heart&ordering=-rating_avg&page=1&page_size=10
```

---

## 📝 API Versioning

### URL Versioning (Current Approach)
```
/api/v1/doctors/
/api/v2/doctors/  (future)
```

**Benefits:**
- Clear and explicit
- Easy to route
- Browser-friendly

**Version Strategy:**
- v1: Current stable version
- v2: Breaking changes only
- Maintain v1 for at least 6 months after v2 release

---

## 🔄 Idempotency

### Idempotent Operations
Same request multiple times = same result

- **GET**: Always idempotent
- **PUT**: Idempotent (full update, same data = same result)
- **DELETE**: Idempotent (delete twice = same result)

### Non-Idempotent Operations
- **POST**: Creates new resource each time
  ```http
  POST /api/v1/appointments/  # Creates new appointment each time
  ```

### Idempotency Keys (Future Enhancement)
For critical POST operations:
```http
POST /api/v1/appointments/
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

---

## 🚀 Performance Best Practices

### 1. Response Caching
```http
Cache-Control: public, max-age=300  # Cache for 5 minutes
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

### 2. Conditional Requests
```http
GET /api/v1/doctors/5/
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"

Response: 304 Not Modified (if unchanged)
```

### 3. Partial Responses (Field Selection)
```http
GET /api/v1/doctors/?fields=id,name,specialization
```

### 4. Pagination Limits
- Default: 20 items per page
- Maximum: 100 items per page
- Use cursor-based pagination for large datasets (future)

### 5. Rate Limiting
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642329600
```

---

## 🌐 CORS (Cross-Origin Resource Sharing)

### Allowed Origins
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",      # Development
    "https://app.example.com"     # Production
]
```

### Allowed Methods
```
GET, POST, PUT, PATCH, DELETE, OPTIONS
```

### Exposed Headers
```
Content-Type, Authorization, X-RateLimit-*
```

---

## 📄 API Documentation

### Automatic Documentation (DRF)
- **Browsable API**: `/api/v1/` (HTML interface)
- **OpenAPI Schema**: `/api/v1/schema/` (JSON)
- **Swagger UI**: `/api/v1/docs/` (future integration)
- **ReDoc**: `/api/v1/redoc/` (future integration)

### Documentation Standards
Each endpoint documented with:
- Description
- Request parameters
- Request body schema
- Response schema
- Status codes
- Authentication requirements
- Example requests/responses

---

## 🧪 API Testing Standards

### 1. Unit Tests
- Test serializers
- Test viewsets
- Test permissions
- Test business logic

### 2. Integration Tests
- Test full request/response cycle
- Test authentication flow
- Test error handling

### 3. Test Coverage
- Minimum 85% code coverage
- All endpoints tested
- All error cases covered

---

## 🔒 Security Best Practices

### 1. Input Validation
- Validate all input data
- Sanitize HTML/JavaScript
- Prevent SQL injection (Django ORM handles this)

### 2. Authentication
- Use HTTPS in production
- JWT tokens with expiration
- Secure token storage (httpOnly cookies future)

### 3. Authorization
- Role-based access control
- Object-level permissions
- Rate limiting per user

### 4. Sensitive Data
- Never log passwords
- Mask sensitive data in logs
- Use environment variables for secrets

### 5. CAPTCHA
- Implement CAPTCHA on:
  - User registration
  - Appointment booking
  - Password reset (future)

---

## 📊 API Endpoint Catalog

### Authentication
```
POST   /api/v1/auth/register/          # Register new user
POST   /api/v1/auth/login/             # User login
POST   /api/v1/auth/refresh/           # Refresh access token
POST   /api/v1/auth/logout/            # User logout (future)
```

### Users
```
GET    /api/v1/users/profile/          # Get current user profile
PUT    /api/v1/users/profile/          # Update profile
POST   /api/v1/users/apply-doctor/     # Apply as doctor
GET    /api/v1/users/doctor-profile/   # Get doctor profile
```

### Doctors
```
GET    /api/v1/doctors/                # List doctors (with filters)
GET    /api/v1/doctors/{id}/           # Get doctor details
POST   /api/v1/doctors/{id}/rate/      # Rate a doctor
POST   /api/v1/doctors/{id}/add-disease-treatment/  # Add disease expertise
```

### Appointments
```
GET    /api/v1/appointments/           # List patient's appointments
POST   /api/v1/appointments/           # Book appointment
GET    /api/v1/appointments/{id}/      # Get appointment details
PUT    /api/v1/appointments/{id}/      # Update appointment
DELETE /api/v1/appointments/{id}/      # Cancel appointment
GET    /api/v1/appointments/doctor-dashboard/  # Doctor's appointments
```

### Chat (AI Chatbot)
```
POST   /api/v1/chat/                   # Send chat message
GET    /api/v1/chat/history/           # Get chat history
DELETE /api/v1/chat/history/           # Clear chat history
```

### Medical Records
```
GET    /api/v1/medical-records/        # List patient's records
GET    /api/v1/medical-records/{id}/   # Get record details
POST   /api/v1/medical-records/        # Create record (Doctor only)
```

### Prescriptions
```
GET    /api/v1/prescriptions/          # List patient's prescriptions
GET    /api/v1/prescriptions/{id}/     # Get prescription details
POST   /api/v1/prescriptions/          # Create prescription (Doctor only)
```

### Blogs
```
GET    /api/v1/blogs/                  # List published blogs (public)
GET    /api/v1/blogs/{id}/             # Get blog details (public)
POST   /api/v1/blogs/                  # Create blog (Doctor only)
PUT    /api/v1/blogs/{id}/             # Update blog (Owner only)
DELETE /api/v1/blogs/{id}/             # Delete blog (Owner only)
```

### AI/ML Services (External)
```
POST   http://localhost:8001/chat      # AI chatbot (RAG)
POST   http://localhost:8002/predict   # Disease prediction (ML)
GET    http://localhost:8002/symptoms  # List symptoms
GET    http://localhost:8002/diseases  # List diseases
```

---

## 🔗 Related Documentation

- [System Architecture](./SYSTEM_ARCHITECTURE.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Sprint Documentation](../sprints/)

---

## 📚 References

- [REST API Best Practices](https://restfulapi.net/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [JWT RFC 7519](https://tools.ietf.org/html/rfc7519)
- [OpenAPI Specification](https://swagger.io/specification/)
