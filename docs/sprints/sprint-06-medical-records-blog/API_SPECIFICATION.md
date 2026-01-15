# Sprint 6: Medical Records, Prescriptions & Blogs - API Specification

**Version**: 1.0  
**Base URL**: `http://localhost:8000/api/v1`

---

## 📋 Medical Records Endpoints

### 1. Get Patient Medical Records
**Endpoint**: `GET /medical-records/`  
**Description**: Get all medical records for authenticated patient  
**Authentication**: Required (Bearer Token, Role: PATIENT)

**Success Response** (200 OK):
```json
{
  "records": [
    {
      "id": 15,
      "doctor": {
        "id": 5,
        "name": "Dr. Sarah Johnson",
        "specialization": "Cardiology"
      },
      "diagnosis": "Hypertension Stage 1",
      "treatment": "Lifestyle modifications, monitor BP daily, follow-up in 2 weeks",
      "medications": "Amlodipine 5mg once daily",
      "notes": "Patient advised to reduce salt intake and exercise regularly",
      "created_at": "2026-01-12T10:30:00Z"
    }
  ],
  "total_count": 1
}
```

---

### 2. Get Single Medical Record
**Endpoint**: `GET /medical-records/<id>/`  
**Description**: Get specific medical record details  
**Authentication**: Required (Bearer Token)

**Success Response** (200 OK):
```json
{
  "id": 15,
  "patient": {
    "id": 3,
    "name": "John Doe",
    "age": 45,
    "blood_group": "A+"
  },
  "doctor": {
    "id": 5,
    "name": "Dr. Sarah Johnson",
    "specialization": "Cardiology",
    "qualification": "MBBS, MD"
  },
  "diagnosis": "Hypertension Stage 1",
  "treatment": "Lifestyle modifications, monitor BP daily",
  "medications": "Amlodipine 5mg once daily",
  "notes": "Patient advised to reduce salt intake",
  "created_at": "2026-01-12T10:30:00Z",
  "updated_at": "2026-01-12T10:30:00Z"
}
```

---

### 3. Create Medical Record (Doctor)
**Endpoint**: `POST /medical-records/`  
**Description**: Create medical record for patient  
**Authentication**: Required (Bearer Token, Role: DOCTOR)

**Request Body**:
```json
{
  "patient_id": 3,
  "diagnosis": "Hypertension Stage 1",
  "treatment": "Lifestyle modifications, monitor BP daily, follow-up in 2 weeks",
  "medications": "Amlodipine 5mg once daily",
  "notes": "Patient advised to reduce salt intake and exercise regularly"
}
```

**Success Response** (201 Created):
```json
{
  "id": 15,
  "message": "Medical record created successfully",
  "record": {
    "patient_id": 3,
    "doctor_id": 5,
    "diagnosis": "Hypertension Stage 1",
    "created_at": "2026-01-12T10:30:00Z"
  }
}
```

---

## 💊 Prescription Endpoints

### 4. Get Patient Prescriptions
**Endpoint**: `GET /prescriptions/`  
**Description**: Get all prescriptions for authenticated patient  
**Authentication**: Required (Bearer Token, Role: PATIENT)

**Success Response** (200 OK):
```json
{
  "prescriptions": [
    {
      "id": 20,
      "doctor": {
        "id": 5,
        "name": "Dr. Sarah Johnson",
        "specialization": "Cardiology"
      },
      "medications": "Amlodipine 5mg - once daily after breakfast\nAspirin 75mg - once daily after dinner",
      "instructions": "Take medications regularly. Monitor blood pressure daily. Avoid excessive salt.",
      "duration": "30 days",
      "created_at": "2026-01-12T11:00:00Z"
    }
  ],
  "total_count": 1
}
```

---

### 5. Create Prescription (Doctor)
**Endpoint**: `POST /prescriptions/`  
**Description**: Write prescription for patient  
**Authentication**: Required (Bearer Token, Role: DOCTOR)

**Request Body**:
```json
{
  "patient_id": 3,
  "medications": "Amlodipine 5mg - once daily after breakfast\nAspirin 75mg - once daily after dinner",
  "instructions": "Take medications regularly. Monitor blood pressure daily. Avoid excessive salt.",
  "duration": "30 days"
}
```

**Success Response** (201 Created):
```json
{
  "id": 20,
  "message": "Prescription created successfully",
  "prescription": {
    "patient_id": 3,
    "doctor_id": 5,
    "medications": "Amlodipine 5mg - once daily after breakfast...",
    "created_at": "2026-01-12T11:00:00Z"
  }
}
```

---

### 6. Get Prescription Details
**Endpoint**: `GET /prescriptions/<id>/`  
**Description**: Get specific prescription details  
**Authentication**: Required (Bearer Token)

**Success Response** (200 OK):
```json
{
  "id": 20,
  "patient": {
    "id": 3,
    "name": "John Doe"
  },
  "doctor": {
    "id": 5,
    "name": "Dr. Sarah Johnson",
    "specialization": "Cardiology",
    "qualification": "MBBS, MD"
  },
  "medications": "Amlodipine 5mg - once daily after breakfast\nAspirin 75mg - once daily after dinner",
  "instructions": "Take medications regularly. Monitor blood pressure daily.",
  "duration": "30 days",
  "created_at": "2026-01-12T11:00:00Z"
}
```

---

## 📝 Blog Endpoints

### 7. Get All Blogs (Public)
**Endpoint**: `GET /blogs/`  
**Description**: Get all published blogs (public access)  
**Authentication**: Not required

**Query Parameters**:
- `category`: Filter by category (optional)
- `search`: Search in title/content (optional)
- `page`: Page number (optional)
- `limit`: Results per page (optional, default: 10)

**Success Response** (200 OK):
```json
{
  "blogs": [
    {
      "id": 8,
      "title": "10 Tips for Managing Diabetes",
      "content_excerpt": "Living with diabetes requires careful management...",
      "author": {
        "id": 5,
        "name": "Dr. Sarah Johnson",
        "specialization": "Endocrinology"
      },
      "category": "Chronic Diseases",
      "published_at": "2026-01-13T09:00:00Z",
      "read_time": "5 min"
    }
  ],
  "total_count": 1,
  "page": 1,
  "total_pages": 1
}
```

---

### 8. Get Blog Details (Public)
**Endpoint**: `GET /blogs/<id>/`  
**Description**: Get full blog post  
**Authentication**: Not required

**Success Response** (200 OK):
```json
{
  "id": 8,
  "title": "10 Tips for Managing Diabetes",
  "content": "Full blog content here...",
  "author": {
    "id": 5,
    "name": "Dr. Sarah Johnson",
    "specialization": "Endocrinology",
    "qualification": "MBBS, MD, DM",
    "experience_years": 15
  },
  "category": "Chronic Diseases",
  "tags": ["diabetes", "lifestyle", "health"],
  "published_at": "2026-01-13T09:00:00Z",
  "read_time": "5 min"
}
```

---

### 9. Create Blog (Doctor)
**Endpoint**: `POST /blogs/`  
**Description**: Publish a blog post  
**Authentication**: Required (Bearer Token, Role: DOCTOR)

**Request Body**:
```json
{
  "title": "10 Tips for Managing Diabetes",
  "content": "Full blog content with detailed information...",
  "category": "Chronic Diseases",
  "tags": ["diabetes", "lifestyle", "health"],
  "status": "published"
}
```

**Success Response** (201 Created):
```json
{
  "id": 8,
  "message": "Blog published successfully",
  "blog": {
    "title": "10 Tips for Managing Diabetes",
    "author_id": 5,
    "category": "Chronic Diseases",
    "status": "published",
    "published_at": "2026-01-13T09:00:00Z"
  }
}
```

---

### 10. Update Blog (Doctor)
**Endpoint**: `PUT /blogs/<id>/`  
**Description**: Update own blog post  
**Authentication**: Required (Bearer Token, Role: DOCTOR)

**Request Body**:
```json
{
  "title": "Updated: 10 Tips for Managing Diabetes",
  "content": "Updated content...",
  "category": "Chronic Diseases"
}
```

**Success Response** (200 OK):
```json
{
  "message": "Blog updated successfully",
  "blog": {
    "id": 8,
    "title": "Updated: 10 Tips for Managing Diabetes",
    "updated_at": "2026-01-14T10:00:00Z"
  }
}
```

---

### 11. Delete Blog (Doctor)
**Endpoint**: `DELETE /blogs/<id>/`  
**Description**: Delete own blog post  
**Authentication**: Required (Bearer Token, Role: DOCTOR)

**Success Response** (200 OK):
```json
{
  "message": "Blog deleted successfully"
}
```

---

## 📝 Models Schema

### MedicalRecord Model
```python
{
  "id": integer,
  "patient": foreign_key(User),
  "doctor": foreign_key(User),
  "diagnosis": text,
  "treatment": text,
  "medications": text,
  "notes": text,
  "created_at": datetime,
  "updated_at": datetime
}
```

### Prescription Model
```python
{
  "id": integer,
  "patient": foreign_key(User),
  "doctor": foreign_key(User),
  "medications": text,
  "instructions": text,
  "duration": string,
  "created_at": datetime,
  "updated_at": datetime
}
```

### BlogPost Model
```python
{
  "id": integer,
  "author": foreign_key(User),  # Doctor
  "title": string,
  "content": text,
  "category": string,
  "tags": list[string],
  "status": string (draft|published),
  "published_at": datetime,
  "created_at": datetime,
  "updated_at": datetime
}
```

---

## 🧪 Testing Examples

### Get Medical Records
```bash
curl -X GET http://localhost:8000/api/v1/medical-records/ \
  -H "Authorization: Bearer PATIENT_TOKEN"
```

### Create Prescription (Doctor)
```bash
curl -X POST http://localhost:8000/api/v1/prescriptions/ \
  -H "Authorization: Bearer DOCTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": 3,
    "medications": "Amlodipine 5mg - once daily",
    "instructions": "Take after breakfast",
    "duration": "30 days"
  }'
```

### Get Public Blogs
```bash
curl -X GET "http://localhost:8000/api/v1/blogs/?category=Chronic%20Diseases"
```

---

## 🔗 Related Documentation

- [User Stories](./USER_STORIES.md)
- [TDD Approach](./TDD.md)
