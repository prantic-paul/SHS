# Technical Design Document (TDD)
## Feature: User Authentication with JWT
**Project:** Smart Health Synchronizer (SHS)

---

## 1. Overview

This feature implements JWT-based authentication for users of the Smart Health Synchronizer. It allows users to securely register, log in, and access protected APIs using access and refresh tokens. 

---

## 2. Scope

### In Scope
- User registration
- User login
- JWT access token generation
- JWT refresh token generation
- Token validation for protected APIs

### Out of Scope
- Role assignment (User / Doctor)
- Doctor profile creation
- Role-based access control
- Admin approval workflows
- Third-party authentication (OAuth)
- Multi-factor authentication (MFA)

---

## 3. Requirements

### Functional Requirements
- FR-1: Users can register using user name , email ,phone number ,  password , adress , blood group , gender.
- FR-2: Users can log in using valid credentials
- FR-3: The system issues a JWT access token after successful login
- FR-4: The system issues a refresh token alongside the access token
- FR-5: Users can obtain a new access token using a valid refresh token
- FR-6: Protected APIs require a valid access token

### Non-Functional Requirements
- Access token expiration time: 24 hours
- Refresh token expiration time: configurable (e.g., 7 days)
- Passwords must be securely hashed
- Authentication-related requests must respond within 2 seconds

---

## 4. High-Level Design

The authentication system is implemented within the backend API layer and communicates with the database and JWT service.

**Flow:**

Client  
→ Authentication API  
→ JWT Token Service  
→ User Database  

---

## 5. Detailed Design

### 5.1 API Design

| Method | Endpoint | Description | Auth Required |
|------|--------|------------|--------------|
| POST | /api/auth/register | Register a new user | No |
| POST | /api/auth/login | Authenticate user and issue tokens | No |
| POST | /api/auth/refresh | Issue new access token using refresh token | No |
| GET | /api/auth/profile | Retrieve authenticated user info | Yes |

---

### 5.2 Database Design

#### User Table
- id (PK)
- user name
- email (unique)
- phone number (unique)
- password_hash
- adress
- blood group (Not Compulsory)
- gender
- is_doctor (default = false)
- is_active
- created_at

📌 Passwords are stored only as hashed values.

---

### 5.3 Business Logic

#### Registration Flow
1. Validate user input
2. Hash password
3. Create user record
4. Return success response

#### Login Flow
1. Validate credentials
2. Verify password hash
3. Generate access token
4. Generate refresh token
5. Return tokens to client

#### Token Refresh Flow
1. Validate refresh token
2. Issue new access token
3. Return new access token

#### Authentication Flow
1. Extract access token from Authorization header
2. Validate token signature and expiration
3. Allow or deny request access

---

### 5.4 Token Strategy

- **Access Token**
  - Short-lived
  - Used to authenticate API requests

- **Refresh Token**
  - Long-lived
  - Used only to obtain new access tokens
  - Invalid or expired refresh tokens are rejected

---

### 5.5 Security Considerations

- Passwords are hashed using a secure hashing algorithm
- JWTs are signed using a secret key
- Refresh tokens are validated on each use
- Tokens do not contain sensitive personal information
- HTTPS is enforced for all authentication endpoints

---

## 6. Error Handling & Edge Cases

- Invalid credentials → 401 Unauthorized
- Expired access token → 401 Unauthorized
- Invalid or expired refresh token → 403 Forbidden
- Duplicate email during registration → 400 Bad Request
- Missing authentication token → 403 Forbidden

---

## 7. Implementation Plan

1. Create user model and database migration
2. Implement registration API
3. Implement login API with token generation
4. Implement refresh token endpoint
5. Configure JWT authentication middleware
6. Protect selected APIs using access tokens
7. Write unit and integration tests

---

## 8. Testing Strategy

### Unit Tests
- Password hashing and verification
- Access token creation and validation
- Refresh token validation logic

### Integration Tests
- Login followed by access to protected API
- Access token expiration and refresh flow
- Invalid token handling

---

## 9. Dependencies

- Django REST Framework
- JWT authentication library
- ADR-001: Use PostgreSQL
- ADR-003: Use JWT Authentication

---

## 10. Open Questions / Future Improvements

- Token rotation strategy
- Token blacklisting on logout
- Rate limiting on authentication endpoints

---

## 11. Version History

| Version | Date | Description |
|------|------|------------|
| 1.0 | 2025-12-19 | Initial user authentication design |
