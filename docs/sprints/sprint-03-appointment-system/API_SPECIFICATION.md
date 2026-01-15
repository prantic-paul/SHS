# Sprint 3: Appointment Booking System - API Specification

**Version**: 1.0  
**Base URL**: `http://localhost:8000/api/v1`

---

## 📋 Appointment Endpoints

### 1. Book Appointment
**Endpoint**: `POST /appointments/`  
**Description**: Book a new appointment with a doctor  
**Authentication**: Required (Bearer Token, Role: PATIENT)

**Request Body**:
```json
{
  "doctor_id": 5,
  "appointment_date": "2026-01-20",
  "appointment_time": "14:30:00",
  "reason": "Regular checkup for chest pain",
  "captcha_answer": 7
}
```

**Success Response** (201 Created):
```json
{
  "id": 15,
  "patient": {
    "id": 3,
    "name": "John Doe"
  },
  "doctor": {
    "id": 5,
    "name": "Dr. Smith",
    "specialization": "Cardiology"
  },
  "appointment_date": "2026-01-20",
  "appointment_time": "14:30:00",
  "reason": "Regular checkup for chest pain",
  "status": "pending",
  "created_at": "2026-01-15T10:30:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid data or past date
  ```json
  {
    "appointment_date": ["Cannot book appointments in the past"],
    "captcha_answer": ["Incorrect CAPTCHA answer"]
  }
  ```

---

### 2. Get Patient Appointments
**Endpoint**: `GET /appointments/`  
**Description**: Get all appointments for authenticated patient  
**Authentication**: Required (Bearer Token, Role: PATIENT)

**Success Response** (200 OK):
```json
[
  {
    "id": 15,
    "doctor": {
      "id": 5,
      "name": "Dr. Smith",
      "specialization": "Cardiology"
    },
    "appointment_date": "2026-01-20",
    "appointment_time": "14:30:00",
    "reason": "Regular checkup",
    "status": "pending",
    "created_at": "2026-01-15T10:30:00Z"
  },
  {
    "id": 12,
    "doctor": {
      "id": 8,
      "name": "Dr. Johnson",
      "specialization": "Dermatology"
    },
    "appointment_date": "2026-01-18",
    "appointment_time": "11:00:00",
    "reason": "Skin consultation",
    "status": "confirmed",
    "created_at": "2026-01-10T14:20:00Z"
  }
]
```

---

### 3. Get Doctor Dashboard
**Endpoint**: `GET /appointments/doctor-dashboard/`  
**Description**: Get doctor's appointments organized by timeframe  
**Authentication**: Required (Bearer Token, Role: DOCTOR)

**Success Response** (200 OK):
```json
{
  "todays_appointments": [
    {
      "id": 20,
      "patient": {
        "id": 10,
        "name": "Alice Brown",
        "age": 35,
        "gender": "female"
      },
      "appointment_date": "2026-01-15",
      "appointment_time": "15:00:00",
      "reason": "Follow-up consultation",
      "status": "pending",
      "created_at": "2026-01-12T09:00:00Z"
    }
  ],
  "upcoming_appointments": [
    {
      "id": 21,
      "patient": {
        "id": 11,
        "name": "Bob Wilson",
        "age": 42,
        "gender": "male"
      },
      "appointment_date": "2026-01-18",
      "appointment_time": "10:30:00",
      "reason": "Initial consultation",
      "status": "pending",
      "created_at": "2026-01-14T11:30:00Z"
    }
  ],
  "all_requests": [
    {
      "id": 20,
      "patient": {"id": 10, "name": "Alice Brown"},
      "appointment_date": "2026-01-15",
      "status": "pending"
    },
    {
      "id": 21,
      "patient": {"id": 11, "name": "Bob Wilson"},
      "appointment_date": "2026-01-18",
      "status": "pending"
    }
  ]
}
```

---

### 4. Get Appointment Details
**Endpoint**: `GET /appointments/<id>/`  
**Description**: Get specific appointment details  
**Authentication**: Required (Bearer Token)

**Success Response** (200 OK):
```json
{
  "id": 15,
  "patient": {
    "id": 3,
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com"
  },
  "doctor": {
    "id": 5,
    "name": "Dr. Smith",
    "specialization": "Cardiology",
    "qualification": "MBBS, MD"
  },
  "appointment_date": "2026-01-20",
  "appointment_time": "14:30:00",
  "reason": "Regular checkup for chest pain",
  "status": "pending",
  "created_at": "2026-01-15T10:30:00Z"
}
```

---

### 5. Update Appointment
**Endpoint**: `PUT /appointments/<id>/`  
**Description**: Update appointment (status, date, time)  
**Authentication**: Required (Bearer Token)

**Request Body**:
```json
{
  "status": "confirmed",
  "appointment_date": "2026-01-21",
  "appointment_time": "15:00:00"
}
```

**Success Response** (200 OK):
```json
{
  "id": 15,
  "status": "confirmed",
  "appointment_date": "2026-01-21",
  "appointment_time": "15:00:00",
  "message": "Appointment updated successfully"
}
```

---

### 6. Cancel Appointment
**Endpoint**: `DELETE /appointments/<id>/`  
**Description**: Cancel an appointment  
**Authentication**: Required (Bearer Token)

**Success Response** (200 OK):
```json
{
  "message": "Appointment cancelled successfully"
}
```

---

## 🔒 CAPTCHA Validation

### Registration CAPTCHA
- Math-based CAPTCHA (e.g., "What is 4 + 3?")
- Generated on frontend
- Validated on backend
- Required field in registration

### Booking CAPTCHA
- Math-based CAPTCHA
- Generated on booking form
- Validated before appointment creation
- Prevents automated bookings

---

## 📝 Models Schema

### Appointment Model
```python
{
  "id": integer,
  "patient": foreign_key(User),
  "doctor": foreign_key(User),
  "appointment_date": date,
  "appointment_time": time,
  "reason": text,
  "status": string (pending|confirmed|cancelled),
  "created_at": datetime,
  "updated_at": datetime
}
```

---

## ⚠️ Business Rules

1. **Date Validation**:
   - Appointments can only be booked for future dates
   - Backend validates: `appointment_date >= today`

2. **Auto-Cleanup**:
   - Appointments older than 7 days are archived/removed
   - Runs on dashboard access or scheduled task

3. **Status Flow**:
   - New: `pending`
   - Doctor confirms: `confirmed`
   - Cancel: `cancelled`

4. **Access Control**:
   - Patients can view their own appointments
   - Doctors can view appointments where they are the doctor
   - Admins can view all appointments

---

## 🧪 Testing Examples

### Book Appointment with cURL
```bash
curl -X POST http://localhost:8000/api/v1/appointments/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": 5,
    "appointment_date": "2026-01-20",
    "appointment_time": "14:30:00",
    "reason": "Regular checkup",
    "captcha_answer": 7
  }'
```

### Get Doctor Dashboard
```bash
curl -X GET http://localhost:8000/api/v1/appointments/doctor-dashboard/ \
  -H "Authorization: Bearer DOCTOR_ACCESS_TOKEN"
```

---

## 🔗 Related Documentation

- [User Stories](./USER_STORIES.md)
- [TDD Approach](./TDD.md)
