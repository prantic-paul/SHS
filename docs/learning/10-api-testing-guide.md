# API Testing Guide - Sprint 1

## Quick Start Testing

### Prerequisites
1. Django server running: `python manage.py runserver`
2. Use Postman, Insomnia, or curl for testing

---

## Test Scenarios

### 1. User Registration
**Endpoint:** `POST http://localhost:8000/api/v1/auth/register/`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "password_confirm": "SecurePass123",
  "phone": "01712345678",
  "location": "Dhaka, Bangladesh",
  "blood_group": "A+",
  "gender": "Male",
  "age": 30
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user_id": "u-123456",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01712345678",
    "location": "Dhaka, Bangladesh",
    "blood_group": "A+",
    "gender": "Male",
    "age": 30,
    "role": "PATIENT",
    "is_active": true,
    "created_at": "2025-12-21T10:00:00Z"
  },
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

**Save the `access` token for next requests!**

---

### 2. User Login
**Endpoint:** `POST http://localhost:8000/api/v1/auth/login/`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user_id": "u-123456",
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

---

### 3. Get User Profile
**Endpoint:** `GET http://localhost:8000/api/v1/users/profile/`

**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user_id": "u-123456",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01712345678",
    "location": "Dhaka, Bangladesh",
    "blood_group": "A+",
    "gender": "Male",
    "age": 30,
    "role": "PATIENT",
    "is_active": true,
    "created_at": "2025-12-21T10:00:00Z",
    "doctor_profile": null
  },
  "message": "Profile retrieved successfully"
}
```

---

### 4. Update User Profile
**Endpoint:** `PATCH http://localhost:8000/api/v1/users/profile/`

**Headers:**
```
Authorization: Bearer <your_access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Updated",
  "location": "Chittagong, Bangladesh",
  "age": 31
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user_id": "u-123456",
    "name": "John Updated",
    "email": "john@example.com",
    "phone": "01712345678",
    "location": "Chittagong, Bangladesh",
    "blood_group": "A+",
    "gender": "Male",
    "age": 31,
    "role": "PATIENT",
    "is_active": true
  },
  "message": "Profile updated successfully"
}
```

---

### 5. Apply as Doctor
**Endpoint:** `POST http://localhost:8000/api/v1/doctors/apply/`

**Headers:**
```
Authorization: Bearer <your_access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "license_number": "BM-12345",
  "qualification": "MBBS, MD (Cardiology)",
  "education": "Dhaka Medical College",
  "specialization": "Cardiology",
  "practice_location": "Dhaka Medical College Hospital",
  "experience_years": 10,
  "bio": "Cardiologist with 10 years of experience in treating heart diseases."
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": "u-123456",
    "user_name": "John Updated",
    "license_number": "BM-12345",
    "qualification": "MBBS, MD (Cardiology)",
    "education": "Dhaka Medical College",
    "specialization": "Cardiology",
    "practice_location": "Dhaka Medical College Hospital",
    "experience_years": 10,
    "bio": "Cardiologist with 10 years of experience in treating heart diseases.",
    "status": "PENDING",
    "is_verified": false,
    "rating_avg": "0.00",
    "created_at": "2025-12-21T10:30:00Z"
  },
  "message": "Doctor application submitted successfully. Pending admin approval."
}
```

---

## Error Cases to Test

### 1. Duplicate Email Registration
**Request:**
```json
{
  "email": "john@example.com",
  ...
}
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "errors": {
    "email": ["User with this email already exists."]
  }
}
```

---

### 2. Invalid Login Credentials
**Request:**
```json
{
  "email": "john@example.com",
  "password": "WrongPassword"
}
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "errors": {
    "non_field_errors": ["Invalid email or password."]
  }
}
```

---

### 3. Access Protected Route Without Token
**Request:**
```
GET http://localhost:8000/api/v1/users/profile/
(No Authorization header)
```

**Expected Response (401 Unauthorized):**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

### 4. Duplicate Doctor Application
**Request:**
Apply as doctor twice with same user

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "errors": {
    "non_field_errors": ["You have already applied as a doctor."]
  }
}
```

---

## Using Postman Collection

### Step 1: Import Environment
Create environment with:
- `base_url`: `http://localhost:8000/api/v1`
- `access_token`: (will be set automatically)

### Step 2: Create Collection "SHS Sprint 1"

#### Request 1: Register
- Method: POST
- URL: `{{base_url}}/auth/register/`
- Body: raw JSON (see above)
- Test Script:
```javascript
pm.test("Status is 201", function() {
    pm.response.to.have.status(201);
});

pm.test("Has access token", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.tokens.access).to.exist;
    pm.environment.set("access_token", jsonData.tokens.access);
});
```

#### Request 2: Login
- Method: POST
- URL: `{{base_url}}/auth/login/`
- Body: raw JSON
- Test Script:
```javascript
pm.test("Status is 200", function() {
    pm.response.to.have.status(200);
});

var jsonData = pm.response.json();
pm.environment.set("access_token", jsonData.tokens.access);
```

#### Request 3: Get Profile
- Method: GET
- URL: `{{base_url}}/users/profile/`
- Headers: `Authorization: Bearer {{access_token}}`
- Test Script:
```javascript
pm.test("Status is 200", function() {
    pm.response.to.have.status(200);
});

pm.test("Has user data", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.user_id).to.exist;
});
```

#### Request 4: Update Profile
- Method: PATCH
- URL: `{{base_url}}/users/profile/`
- Headers: `Authorization: Bearer {{access_token}}`
- Body: raw JSON

#### Request 5: Apply as Doctor
- Method: POST
- URL: `{{base_url}}/doctors/apply/`
- Headers: `Authorization: Bearer {{access_token}}`
- Body: raw JSON

---

## Admin Panel Testing

### Access Admin Panel
1. Open browser: `http://localhost:8000/admin/`
2. Login with superuser credentials:
   - Email: `admin@shs.com`
   - Password: (your superuser password)

### Test Admin Features

#### 1. View All Users
- Go to Users section
- Check if registered users appear
- Filter by role, gender, blood group
- Search by email, name, phone

#### 2. Approve Doctor Application
- Go to Doctor Information section
- Find doctor with status "PENDING"
- Select the doctor
- Choose "Approve selected doctors" from Actions
- Click Go
- Verify:
  - Doctor status changed to "APPROVED"
  - User role changed to "DOCTOR"
  - is_verified set to True

#### 3. Reject Doctor Application
- Find another pending doctor
- Choose "Reject selected doctors"
- Verify status changed to "REJECTED"

---

## Manual Testing Checklist

### Registration Flow
- [ ] Register with valid data → Success
- [ ] Register with duplicate email → Error
- [ ] Register with duplicate phone → Error
- [ ] Register with mismatched passwords → Error
- [ ] Register with invalid email format → Error
- [ ] Verify JWT tokens returned
- [ ] Verify user_id auto-generated

### Login Flow
- [ ] Login with correct credentials → Success
- [ ] Login with wrong password → Error
- [ ] Login with non-existent email → Error
- [ ] Verify JWT tokens returned

### Profile Flow
- [ ] Get profile without token → Unauthorized
- [ ] Get profile with valid token → Success
- [ ] Update profile with valid data → Success
- [ ] Update with duplicate phone → Error
- [ ] Verify readonly fields not updated (email, user_id)

### Doctor Application Flow
- [ ] Apply without authentication → Unauthorized
- [ ] Apply with valid data → Success (status PENDING)
- [ ] Apply twice with same user → Error
- [ ] Apply with duplicate license → Error
- [ ] Verify profile shows doctor_profile after application

### Admin Flow
- [ ] Login to admin panel → Success
- [ ] View users list → Success
- [ ] Filter and search users → Success
- [ ] Approve doctor application → Success
- [ ] Reject doctor application → Success
- [ ] Bulk approve multiple doctors → Success

---

## Testing Tips

### 1. Use Different Users
Create multiple test users:
- `patient1@test.com` - Regular patient
- `doctor1@test.com` - User who applies as doctor
- `patient2@test.com` - Another patient for testing

### 2. Check Database
Use Django shell to verify:
```bash
python manage.py shell
```

```python
from apps.users.models import User, DoctorInformation

# Check users
User.objects.all()
User.objects.filter(role='PATIENT').count()

# Check doctors
DoctorInformation.objects.all()
DoctorInformation.objects.filter(status='PENDING')
```

### 3. Monitor Server Logs
Watch terminal for API requests and responses

### 4. Test Edge Cases
- Very long bio (1000+ characters)
- Special characters in name
- International phone numbers
- Different blood groups
- All gender options

---

## Expected Results Summary

| Test Case | Expected Status | Expected Result |
|-----------|----------------|-----------------|
| Register valid user | 201 | User created with tokens |
| Register duplicate email | 400 | Email error message |
| Login valid credentials | 200 | User data with tokens |
| Login invalid credentials | 400 | Authentication error |
| Get profile (authenticated) | 200 | Full user profile |
| Get profile (no auth) | 401 | Authentication required |
| Update profile | 200 | Updated profile data |
| Apply as doctor | 201 | Application created (PENDING) |
| Apply twice | 400 | Duplicate application error |
| Admin approve doctor | - | Status → APPROVED, role → DOCTOR |

---

## Next Steps After Testing

1. ✅ All tests pass → Sprint 1 complete
2. ❌ Tests fail → Debug and fix issues
3. 📝 Document any bugs found
4. 🔄 Refactor if needed
5. ✍️ Write automated tests (unit tests)
6. 🚀 Move to Sprint 2

---

**Testing Completed:** Ready for production deployment after comprehensive testing
