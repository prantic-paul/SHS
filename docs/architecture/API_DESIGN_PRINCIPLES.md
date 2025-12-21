# API Design Principles: Smart Health Synchronizer

## Overview
This document defines the REST API design standards and conventions for Smart Health Synchronizer. All backend APIs must follow these principles to ensure consistency, maintainability, and ease of use.

**Status:** Sprint 0 - Foundation  
**Last Updated:** December 21, 2025  
**Applies To:** All sprints

---

## 1. REST API Fundamentals

### 1.1 RESTful Principles
- Use **HTTP methods** correctly (GET, POST, PUT, PATCH, DELETE)
- Resources are **nouns**, not verbs
- Use **plural names** for collections
- **Stateless** communication (JWT authentication)

### 1.2 Base URL Structure
```
Development:  http://localhost:8000/api/v1/
Production:   https://api.shsplatform.com/api/v1/
```

**Version in URL:** `/api/v1/` for future versioning support

---

## 2. URL Naming Conventions

### 2.1 Resource Naming Rules

✅ **DO:**
- Use plural nouns: `/users`, `/doctors`, `/appointments`
- Use lowercase: `/medical-records`
- Use hyphens for multi-word: `/appointment-schedules`
- Be consistent

❌ **DON'T:**
- Use verbs: `/getUsers`, `/createAppointment`
- Use camelCase: `/medicalRecords`
- Use underscores: `/medical_records`
- Mix singular/plural: `/user`, `/doctors`

### 2.2 Examples

```
✅ Good:
GET    /api/v1/users              # List all users
GET    /api/v1/users/123          # Get specific user
POST   /api/v1/users              # Create user
PUT    /api/v1/users/123          # Update entire user
PATCH  /api/v1/users/123          # Partial update
DELETE /api/v1/users/123          # Delete user

❌ Bad:
GET    /api/v1/getUsers
POST   /api/v1/createUser
GET    /api/v1/user/123
PUT    /api/v1/updateUser/123
```

---

## 3. HTTP Methods

### 3.1 Method Usage

| Method | Usage | Idempotent | Safe |
|--------|-------|------------|------|
| **GET** | Retrieve resource(s) | ✅ Yes | ✅ Yes |
| **POST** | Create new resource | ❌ No | ❌ No |
| **PUT** | Replace entire resource | ✅ Yes | ❌ No |
| **PATCH** | Update partial resource | ❌ No* | ❌ No |
| **DELETE** | Remove resource | ✅ Yes | ❌ No |

*PATCH should be idempotent but may not be in practice

### 3.2 Method Examples

```
# GET - Retrieve
GET /api/v1/users              → List users
GET /api/v1/users/123          → Get user ID 123
GET /api/v1/users/123/profile  → Get user's profile

# POST - Create
POST /api/v1/users             → Create new user
POST /api/v1/auth/login        → Login (create session/token)
POST /api/v1/appointments      → Book appointment

# PUT - Replace entire resource
PUT /api/v1/users/123          → Replace all user fields

# PATCH - Update partial
PATCH /api/v1/users/123        → Update some user fields
PATCH /api/v1/appointments/456 → Update appointment status

# DELETE - Remove
DELETE /api/v1/users/123       → Delete user
DELETE /api/v1/appointments/456 → Cancel appointment
```

---

## 4. HTTP Status Codes

### 4.1 Success Codes (2xx)

| Code | Meaning | Usage |
|------|---------|-------|
| **200 OK** | Success | GET, PUT, PATCH successful |
| **201 Created** | Resource created | POST successful, returns new resource |
| **204 No Content** | Success, no body | DELETE successful |

### 4.2 Client Error Codes (4xx)

| Code | Meaning | Usage |
|------|---------|-------|
| **400 Bad Request** | Invalid input | Validation errors, malformed request |
| **401 Unauthorized** | Not authenticated | Missing or invalid token |
| **403 Forbidden** | Not authorized | Valid token but insufficient permissions |
| **404 Not Found** | Resource not found | ID doesn't exist |
| **409 Conflict** | Resource conflict | Duplicate email, double booking |
| **422 Unprocessable Entity** | Validation failed | Business logic validation errors |

### 4.3 Server Error Codes (5xx)

| Code | Meaning | Usage |
|------|---------|-------|
| **500 Internal Server Error** | Server error | Unexpected errors, exceptions |
| **503 Service Unavailable** | Service down | Maintenance, overload |

### 4.4 Response Examples

```json
// 200 OK - Success
{
  "success": true,
  "data": {
    "id": 123,
    "name": "John Doe"
  },
  "message": "User retrieved successfully"
}

// 201 Created - Resource created
{
  "success": true,
  "data": {
    "id": 124,
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "message": "User created successfully"
}

// 400 Bad Request - Validation error
{
  "success": false,
  "errors": {
    "email": ["Email is required", "Email must be valid"],
    "password": ["Password must be at least 8 characters"]
  },
  "message": "Validation failed"
}

// 401 Unauthorized - Not authenticated
{
  "success": false,
  "error": "Token is invalid or expired",
  "message": "Authentication required"
}

// 404 Not Found - Resource not found
{
  "success": false,
  "error": "User with ID 999 not found",
  "message": "Resource not found"
}
```

---

## 5. Request/Response Format

### 5.1 Request Format

**Content-Type:** `application/json`

```json
// POST /api/v1/users
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "01712345678",
  "location": "Dhaka",
  "blood_group": "A+",
  "gender": "Male",
  "age": 30
}
```

### 5.2 Response Format (Standard)

All responses follow this structure:

```json
{
  "success": true|false,
  "data": { ... },           // On success (single object or array)
  "message": "...",          // Human-readable message
  "errors": { ... },         // On validation errors (field-specific)
  "error": "...",            // On general errors
  "meta": { ... }            // Pagination, etc. (optional)
}
```

### 5.3 Pagination Response

```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "User 1" },
    { "id": 2, "name": "User 2" }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 50,
    "total_pages": 5
  },
  "message": "Users retrieved successfully"
}
```

---

## 6. Authentication & Authorization

### 6.1 JWT Token Authentication

**Header Format:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Example:**
```
GET /api/v1/users/profile
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
```

### 6.2 Token Structure

JWT payload should contain:
```json
{
  "user_id": "u-199232",
  "email": "john@example.com",
  "role": "PATIENT",  // or "DOCTOR", "ADMIN"
  "exp": 1640000000,
  "iat": 1639990000
}
```

### 6.3 Public vs Protected Endpoints

**Public (No auth required):**
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/blogs` (read blogs)

**Protected (Auth required):**
- `GET /api/v1/users/profile`
- `POST /api/v1/appointments`
- `PATCH /api/v1/users/:id`

---

## 7. Filtering, Sorting, Pagination

### 7.1 Filtering (Query Parameters)

```
GET /api/v1/doctors?specialization=Cardiology&location=Dhaka
GET /api/v1/appointments?status=CONFIRMED&date=2025-12-25
GET /api/v1/users?role=DOCTOR&is_verified=true
```

### 7.2 Sorting

```
GET /api/v1/doctors?sort=rating&order=desc
GET /api/v1/appointments?sort=appointment_date&order=asc
```

### 7.3 Pagination

```
GET /api/v1/doctors?page=2&per_page=10
GET /api/v1/blogs?page=1&per_page=20
```

### 7.4 Search

```
GET /api/v1/doctors?search=cardiology
GET /api/v1/blogs?search=pandemic
```

---

## 8. Error Handling

### 8.1 Validation Errors (422)

```json
{
  "success": false,
  "errors": {
    "email": ["Email already exists"],
    "password": ["Password must contain at least one number"],
    "phone": ["Phone number is invalid"]
  },
  "message": "Validation failed"
}
```

### 8.2 Authentication Errors (401)

```json
{
  "success": false,
  "error": "Token has expired",
  "message": "Please log in again"
}
```

### 8.3 Authorization Errors (403)

```json
{
  "success": false,
  "error": "You do not have permission to perform this action",
  "message": "Forbidden"
}
```

### 8.4 Server Errors (500)

```json
{
  "success": false,
  "error": "An unexpected error occurred",
  "message": "Internal server error. Please try again later."
}
```

---

## 9. Nested Resources

### 9.1 When to Use Nested Routes

**Use nested when resource is always accessed through parent:**
```
GET /api/v1/users/:user_id/appointments      # User's appointments
GET /api/v1/doctors/:doctor_id/schedules     # Doctor's schedules
POST /api/v1/appointments/:id/prescriptions  # Create prescription for appointment
```

**Don't over-nest (max 2 levels):**
```
❌ BAD: /api/v1/users/:user_id/appointments/:appt_id/prescriptions/:pres_id
✅ GOOD: /api/v1/prescriptions/:id
```

---

## 10. Field Naming Conventions

### 10.1 JSON Field Names

**Use snake_case for consistency:**
```json
{
  "user_id": "u-199232",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "01712345678",
  "blood_group": "A+",
  "created_at": "2025-12-21T10:30:00Z",
  "is_verified": true
}
```

### 10.2 Date/Time Format

**Use ISO 8601 format:**
```json
{
  "created_at": "2025-12-21T10:30:00Z",
  "updated_at": "2025-12-21T15:45:30Z",
  "appointment_date": "2025-12-25T14:00:00Z"
}
```

---

## 11. Versioning

### 11.1 URL Versioning

```
/api/v1/users     # Version 1 (current)
/api/v2/users     # Version 2 (future)
```

**When to version:**
- Breaking changes to API structure
- Major feature changes
- Incompatible updates

**Maintain old versions** for at least 6 months after new version release.

---

## 12. Rate Limiting

### 12.1 Rate Limit Headers (Future Implementation)

```
X-RateLimit-Limit: 100        # Max requests per window
X-RateLimit-Remaining: 87     # Requests left
X-RateLimit-Reset: 1640000000 # Reset time (Unix timestamp)
```

### 12.2 Rate Limit Response (429)

```json
{
  "success": false,
  "error": "Rate limit exceeded. Try again in 15 minutes.",
  "message": "Too many requests"
}
```

---

## 13. Security Best Practices

### 13.1 Always Use HTTPS
- All production APIs must use HTTPS
- Development can use HTTP locally

### 13.2 Validate Input
- Sanitize all user input
- Use Django REST Framework serializers
- Prevent SQL injection, XSS

### 13.3 Never Expose Sensitive Data
```json
❌ BAD:
{
  "password": "hashed_value",
  "secret_key": "abc123"
}

✅ GOOD:
{
  "email": "john@example.com",
  "name": "John Doe"
}
```

### 13.4 Use Role-Based Access Control (RBAC)
```python
# Check user role before allowing action
if user.role == "ADMIN":
    # Allow admin operations
elif user.role == "DOCTOR":
    # Allow doctor operations
else:
    # Return 403 Forbidden
```

---

## 14. Documentation Standards

### 14.1 API Documentation Format

Each endpoint must be documented with:
1. **URL** - Full endpoint path
2. **Method** - HTTP method
3. **Auth Required** - Yes/No
4. **Permissions** - Required role(s)
5. **Request Body** - JSON schema
6. **Response** - Success and error examples
7. **Status Codes** - All possible codes

### 14.2 Example Endpoint Documentation

```markdown
### Register User

**Endpoint:** `POST /api/v1/auth/register/`

**Auth Required:** No

**Permissions:** None (public)

**Request Body:**
{
  "name": "string (required, max 100)",
  "email": "string (required, unique, valid email)",
  "password": "string (required, min 8 chars)",
  "phone": "string (required, unique)",
  "location": "string (required)",
  "blood_group": "string (optional)",
  "gender": "string (optional)",
  "age": "integer (optional)"
}

**Success Response (201):**
{
  "success": true,
  "data": {
    "user_id": "u-199232",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "User registered successfully"
}

**Error Response (400):**
{
  "success": false,
  "errors": {
    "email": ["Email already exists"]
  },
  "message": "Validation failed"
}
```

---

## 15. Testing Standards

### 15.1 All APIs Must Have Tests
- Unit tests for business logic
- Integration tests for API endpoints
- Test all status codes
- Test authentication/authorization

### 15.2 Example Test Cases
```python
# Test successful user creation
# Test duplicate email error
# Test missing required fields
# Test invalid email format
# Test authentication required
# Test unauthorized access
```

---

## Summary

**Key Principles:**
1. ✅ RESTful design (resources, HTTP methods)
2. ✅ Consistent naming (snake_case, plural nouns)
3. ✅ Standard response format
4. ✅ Proper status codes
5. ✅ JWT authentication
6. ✅ Input validation
7. ✅ Error handling
8. ✅ Security first
9. ✅ Complete documentation
10. ✅ Comprehensive testing

**These principles apply to ALL sprints and features.**

---

**Document Status:** ✅ Completed  
**Phase:** Sprint 0 - Foundation  
**Next Step:** Implement Sprint 1 APIs following these principles
