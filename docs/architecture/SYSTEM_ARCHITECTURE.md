# Smart Health Synchronizer - System Architecture

## Table of Contents
- [Overview](#overview)
- [Architecture Diagram](#architecture-diagram)
- [System Components](#system-components)
- [Data Flow](#data-flow)
- [Technology Stack](#technology-stack)
- [Communication Patterns](#communication-patterns)
- [Security Architecture](#security-architecture)
- [Deployment Architecture](#deployment-architecture)

---

## Overview

Smart Health Synchronizer is a SaaS healthcare platform built with a modern three-tier architecture:

1. **Frontend Layer**: React.js + Vite (User Interface)
2. **Backend Layer**: Django REST Framework (Business Logic & API)
3. **AI Service Layer**: FastAPI (Machine Learning & AI Features)
4. **Data Layer**: PostgreSQL (Persistent Storage)

### Architecture Style
- **Microservices**: AI Service is separate from main backend
- **REST API**: Standard HTTP/JSON communication
- **SPA (Single Page Application)**: React frontend
- **Stateless Authentication**: JWT tokens

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          USERS                                   │
│                  (Patients & Doctors)                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYER                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │              React.js 18+ (SPA)                         │   │
│  │                                                          │   │
│  │  • Components: Pages, Forms, Dashboards                │   │
│  │  • State: React Query, Context API                     │   │
│  │  • Routing: React Router v6                            │   │
│  │  • Styling: Tailwind CSS                               │   │
│  │  • Build: Vite (Fast Development)                      │   │
│  │                                                          │   │
│  │  Storage:                                               │   │
│  │  • LocalStorage: JWT Tokens                            │   │
│  │  • SessionStorage: Temp data                           │   │
│  └────────────────────────────────────────────────────────┘   │
│                             │                                    │
└─────────────────────────────┼────────────────────────────────────┘
                             │
                             │ REST API (JSON)
                             │ Authorization: Bearer <JWT>
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND LAYER                               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │          Django REST Framework 3.14+                    │   │
│  │                                                          │   │
│  │  API Endpoints:                                         │   │
│  │  • /api/auth/      - Authentication (JWT)              │   │
│  │  • /api/users/     - User Management                   │   │
│  │  • /api/doctors/   - Doctor Profiles                   │   │
│  │  • /api/patients/  - Patient Profiles                  │   │
│  │  • /api/appointments/ - Appointment Booking            │   │
│  │  • /api/prescriptions/ - Prescription Management       │   │
│  │  • /api/health-records/ - Health Records              │   │
│  │  • /api/blogs/     - Blog Posts & Comments             │   │
│  │  • /api/ai/        - AI Feature Proxy                  │   │
│  │                                                          │   │
│  │  Middleware:                                            │   │
│  │  • JWT Authentication                                   │   │
│  │  • CORS Headers                                         │   │
│  │  • Rate Limiting                                        │   │
│  │  • Logging                                              │   │
│  │                                                          │   │
│  │  Django Apps:                                           │   │
│  │  • users      - Custom User Model                      │   │
│  │  • doctors    - Doctor Specific Logic                  │   │
│  │  • patients   - Patient Specific Logic                 │   │
│  │  • appointments - Appointment System                    │   │
│  │  • prescriptions - Prescription Management             │   │
│  │  • health_records - Health Data Storage                │   │
│  │  • blogs      - Blog & Content Management              │   │
│  └────────────────────────────────────────────────────────┘   │
│                             │                                    │
│                             ├──────────────┐                    │
│                             │              │                     │
│                             ▼              ▼                     │
│              ┌──────────────────┐  ┌─────────────────┐         │
│              │   PostgreSQL      │  │   AI Service    │         │
│              │   Database        │  │   (FastAPI)     │         │
│              └──────────────────┘  └─────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                             │                   │
                             ▼                   ▼
                    ┌──────────────┐    ┌──────────────┐
                    │  PostgreSQL  │    │   FastAPI    │
                    │   13+        │    │  AI Service  │
                    └──────────────┘    └──────────────┘
```

### Detailed Component Interaction
```
┌──────────┐        ┌───────────┐        ┌──────────┐        ┌──────────┐
│  React   │───────▶│  Django   │───────▶│ Postgres │        │ FastAPI  │
│ Frontend │  HTTP  │  Backend  │  ORM   │ Database │        │AI Service│
│          │◀───────│    API    │◀───────│          │        │          │
└──────────┘  JSON  └───────────┘        └──────────┘        └──────────┘
                            │                                       ▲
                            │          HTTP/JSON                    │
                            └───────────────────────────────────────┘
                                    AI Feature Requests
```

---

## System Components

### 1. Frontend (React.js + Vite)

**Purpose**: User interface for patients and doctors

**Responsibilities**:
- Render UI components
- Handle user interactions
- Manage client-side state
- Make API requests to backend
- Store JWT tokens securely
- Route navigation

**Key Features**:
- Patient dashboard (view health records, book appointments)
- Doctor dashboard (manage appointments, write prescriptions)
- Blog reading and commenting
- Profile management
- Authentication (login/register)

**Technology Details**:
- **Framework**: React 18+
- **Build Tool**: Vite (fast HMR, optimized builds)
- **Routing**: React Router v6
- **State Management**: 
  - Local state: useState, useReducer
  - Global state: Context API
  - Server state: React Query (TanStack Query)
- **HTTP Client**: Axios with interceptors
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Yup validation

**File Structure**:
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route pages
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API service functions
│   ├── contexts/       # React Context providers
│   ├── utils/          # Helper functions
│   └── assets/         # Images, icons
```

---

### 2. Backend API (Django REST Framework)

**Purpose**: Core business logic and REST API

**Responsibilities**:
- Authenticate users (JWT)
- Authorize access to resources
- CRUD operations for all entities
- Business logic validation
- Database interactions (via Django ORM)
- Communicate with AI service
- Generate API documentation

**Key Features**:
- User registration and authentication
- Doctor and patient profile management
- Appointment booking system
- Prescription management
- Health record storage
- Blog management
- Role-based permissions

**Technology Details**:
- **Framework**: Django 4.2+
- **API Framework**: Django REST Framework 3.14+
- **Authentication**: djangorestframework-simplejwt
- **Database**: PostgreSQL with psycopg2
- **API Docs**: drf-spectacular (OpenAPI/Swagger)
- **Testing**: pytest-django
- **CORS**: django-cors-headers

**Django Apps**:
```python
# Core Apps
users/          # Custom User model (email-based auth)
doctors/        # Doctor profiles, specializations, availability
patients/       # Patient profiles, medical history
appointments/   # Appointment booking, scheduling
prescriptions/  # Prescription creation, management
health_records/ # Health records, test results (JSONB)
blogs/          # Blog posts, comments
```

**Key Models**:
```python
# users/models.py
User (AbstractUser)
  - id, email, password, user_type, is_active, created_at

# doctors/models.py
Doctor
  - user (OneToOne), specialization, experience, education, license_number

# patients/models.py  
Patient
  - user (OneToOne), date_of_birth, blood_group, allergies

# appointments/models.py
Appointment
  - doctor, patient, appointment_date, status, notes

# prescriptions/models.py
Prescription
  - doctor, patient, appointment, medications (JSONB), created_at

# health_records/models.py
HealthRecord
  - patient, record_type, test_results (JSONB), created_at

# blogs/models.py
Blog
  - author (doctor), title, content, published_at
  
BlogComment
  - blog, user, content, created_at
```

---

### 3. AI Service (FastAPI)

**Purpose**: Machine learning and AI features

**Responsibilities**:
- Disease prediction from symptoms
- Doctor recommendation based on symptoms
- Health risk assessment
- NLP processing of medical text
- Model inference and scoring

**Technology Details**:
- **Framework**: FastAPI 0.100+
- **Server**: Uvicorn (ASGI server)
- **Validation**: Pydantic models
- **ML Libraries**: scikit-learn, pandas, numpy
- **NLP**: spaCy for medical text processing

**API Endpoints**:
```python
POST /predict/disease
  - Input: symptoms list
  - Output: predicted disease, confidence

POST /recommend/doctor
  - Input: symptoms, location
  - Output: recommended doctors with specialization

POST /assess/risk
  - Input: patient health data
  - Output: health risk score, recommendations
```

**Communication with Backend**:
- Django backend calls AI service via HTTP
- AI service returns JSON predictions
- Backend stores results in database

---

### 4. Database (PostgreSQL)

**Purpose**: Persistent data storage

**Responsibilities**:
- Store user accounts
- Store doctor and patient profiles
- Store appointments and prescriptions
- Store health records
- Store blog posts and comments

**Technology Details**:
- **Database**: PostgreSQL 13+
- **ORM**: Django ORM
- **Features Used**:
  - JSONB for flexible health data
  - Full-text search for blog posts
  - Indexes for performance
  - Foreign keys for relationships

**Key Tables**:
```sql
users_user
doctors_doctor
patients_patient
appointments_appointment
prescriptions_prescription
health_records_healthrecord
blogs_blog
blogs_blogcomment
```

---

## Data Flow

### Example: Patient Books Appointment

```
1. User Action (Frontend)
   ├─▶ Patient clicks "Book Appointment" button
   └─▶ Fills form: doctor, date, time, reason

2. API Request (Frontend → Backend)
   ├─▶ POST /api/appointments/
   ├─▶ Headers: Authorization: Bearer <access_token>
   └─▶ Body: { doctor_id, date, time, reason }

3. Authentication (Backend)
   ├─▶ JWT token validated
   ├─▶ User identity extracted from token
   └─▶ User must be a patient (permission check)

4. Business Logic (Backend)
   ├─▶ Check if doctor exists
   ├─▶ Check if doctor available at requested time
   ├─▶ Check if patient has no conflicting appointment
   └─▶ Validate date is in future

5. Database Operation (Backend → Database)
   ├─▶ Create appointment record
   ├─▶ Link to patient and doctor
   └─▶ Save to PostgreSQL

6. Response (Backend → Frontend)
   ├─▶ Return appointment details
   └─▶ Status: 201 Created

7. UI Update (Frontend)
   ├─▶ Show success message
   ├─▶ Update appointment list
   └─▶ Navigate to appointment details page
```

### Example: AI-Powered Doctor Recommendation

```
1. User Action (Frontend)
   ├─▶ Patient enters symptoms
   └─▶ Clicks "Get Recommendation"

2. API Request (Frontend → Backend)
   ├─▶ POST /api/ai/recommend-doctor/
   └─▶ Body: { symptoms: ["fever", "cough", "headache"] }

3. Backend Processing
   ├─▶ Validate request
   └─▶ Forward to AI service

4. AI Service Request (Backend → FastAPI)
   ├─▶ POST http://ai-service:8001/recommend/doctor
   └─▶ Body: { symptoms, location }

5. AI Processing (FastAPI)
   ├─▶ NLP: Process symptoms
   ├─▶ ML Model: Predict medical specialty
   ├─▶ Rank doctors by specialization
   └─▶ Return top 5 doctors

6. Backend Response
   ├─▶ Receive AI recommendations
   ├─▶ Fetch full doctor profiles from database
   ├─▶ Add availability information
   └─▶ Return enriched data to frontend

7. Frontend Display
   ├─▶ Show recommended doctors
   ├─▶ Display specialization match score
   └─▶ Show "Book Appointment" buttons
```

---

## Technology Stack

### Frontend Stack
```
React.js 18+          - UI framework
Vite                  - Build tool & dev server
React Router v6       - Client-side routing
React Query           - Server state management
Axios                 - HTTP client
React Hook Form       - Form handling
Tailwind CSS          - Styling framework
Heroicons             - Icon library
```

### Backend Stack
```
Python 3.11+          - Programming language
Django 4.2+           - Web framework
Django REST Framework - API framework
djangorestframework-simplejwt - JWT authentication
PostgreSQL 13+        - Database
psycopg2-binary       - PostgreSQL adapter
drf-spectacular       - API documentation
django-cors-headers   - CORS handling
pytest-django         - Testing
```

### AI Service Stack
```
Python 3.11+          - Programming language
FastAPI 0.100+        - API framework
Uvicorn               - ASGI server
Pydantic              - Data validation
scikit-learn          - Machine learning
pandas                - Data manipulation
numpy                 - Numerical computing
spaCy                 - NLP library
```

### DevOps & Tools
```
Git                   - Version control
GitHub                - Code hosting
Docker                - Containerization (future)
pytest                - Testing
ESLint                - JavaScript linting
Black                 - Python formatting
```

---

## Communication Patterns

### 1. Frontend ↔ Backend (REST API)

**Protocol**: HTTP/HTTPS  
**Format**: JSON  
**Authentication**: JWT (Bearer token)

```javascript
// Example: Fetch appointments
const response = await axios.get('/api/appointments/', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

**Request Flow**:
```
Frontend → HTTP Request → Backend
Backend → Process → Database
Backend → JSON Response → Frontend
Frontend → Update UI
```

### 2. Backend ↔ AI Service (Internal API)

**Protocol**: HTTP  
**Format**: JSON  
**Authentication**: API Key (future) or internal network

```python
# Example: Get disease prediction
import requests

response = requests.post(
    'http://ai-service:8001/predict/disease',
    json={'symptoms': ['fever', 'cough']}
)
prediction = response.json()
```

### 3. Backend ↔ Database (ORM)

**Protocol**: PostgreSQL protocol  
**Interface**: Django ORM

```python
# Example: Query appointments
from appointments.models import Appointment

appointments = Appointment.objects.filter(
    patient=patient,
    status='confirmed'
).select_related('doctor')
```

---

## Security Architecture

### 1. Authentication Flow

```
┌─────────┐                    ┌─────────┐
│ Frontend│                    │ Backend │
└────┬────┘                    └────┬────┘
     │                              │
     │  POST /api/auth/login/       │
     │  { email, password }         │
     │─────────────────────────────▶│
     │                              │ Verify credentials
     │                              │ Generate JWT
     │                              │
     │  { access, refresh }         │
     │◀─────────────────────────────│
     │                              │
     │ Store tokens in localStorage │
     │                              │
     │  GET /api/appointments/      │
     │  Authorization: Bearer <JWT> │
     │─────────────────────────────▶│
     │                              │ Validate JWT
     │                              │ Check permissions
     │                              │
     │  { appointments: [...] }     │
     │◀─────────────────────────────│
     │                              │
```

### 2. Security Layers

**Transport Security**:
- HTTPS only in production
- TLS 1.3 encryption
- Secure WebSocket (WSS) for real-time features

**Authentication**:
- JWT tokens (stateless)
- Password hashing (bcrypt)
- Email verification
- Two-factor authentication (future)

**Authorization**:
- Role-based access control (RBAC)
- Permission classes in Django
- Object-level permissions

**API Security**:
- Rate limiting (DRF throttling)
- CORS configuration
- Input validation (DRF serializers)
- SQL injection prevention (ORM)
- XSS prevention (React escaping)

**Data Security**:
- Encrypted at rest (database encryption)
- Encrypted in transit (HTTPS)
- HIPAA compliance considerations
- Audit logs for sensitive operations

---

## Deployment Architecture

### Development Environment
```
┌──────────────────────────────────────────────────┐
│  Developer Machine                                │
│                                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │  Frontend  │  │  Backend   │  │AI Service  │ │
│  │  :5173     │  │  :8000     │  │  :8001     │ │
│  │  (Vite)    │  │  (Django)  │  │  (FastAPI) │ │
│  └────────────┘  └────────────┘  └────────────┘ │
│                         │                         │
│                  ┌────────────┐                   │
│                  │ PostgreSQL │                   │
│                  │  :5432     │                   │
│                  └────────────┘                   │
└──────────────────────────────────────────────────┘
```

### Production Environment (Future)
```
┌─────────────────────────────────────────────────────────┐
│                     Cloud Provider                       │
│  (AWS / Google Cloud / DigitalOcean)                    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  CDN (CloudFront / Cloudflare)                  │   │
│  │  - Static files (React build)                   │   │
│  └────────────────────┬────────────────────────────┘   │
│                       │                                  │
│  ┌────────────────────▼───────────────────────────┐   │
│  │  Load Balancer                                  │   │
│  └────────────────────┬────────────────────────────┘   │
│                       │                                  │
│         ┌─────────────┴─────────────┐                  │
│         ▼                           ▼                   │
│  ┌─────────────┐           ┌─────────────┐            │
│  │  Backend    │           │  Backend    │            │
│  │  Instance 1 │           │  Instance 2 │            │
│  │  (Django)   │           │  (Django)   │            │
│  └──────┬──────┘           └──────┬──────┘            │
│         │                         │                     │
│         └────────┬────────────────┘                    │
│                  │                                      │
│         ┌────────▼────────┐                            │
│         │   PostgreSQL    │                            │
│         │   (RDS/Managed) │                            │
│         └─────────────────┘                            │
│                                                          │
│  ┌─────────────┐                                       │
│  │ AI Service  │                                       │
│  │  (FastAPI)  │                                       │
│  └─────────────┘                                       │
└─────────────────────────────────────────────────────────┘
```

---

## API Design Principles

### RESTful Principles
- Resources identified by URLs
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Stateless communication
- JSON response format

### Endpoint Naming Convention
```
GET    /api/appointments/          - List all appointments
POST   /api/appointments/          - Create appointment
GET    /api/appointments/{id}/     - Get specific appointment
PUT    /api/appointments/{id}/     - Update appointment
DELETE /api/appointments/{id}/     - Delete appointment
```

### Response Format
```json
{
  "success": true,
  "data": {
    "id": 1,
    "doctor": {...},
    "patient": {...}
  },
  "message": "Appointment created successfully"
}
```

### Error Handling
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid appointment date",
    "field": "appointment_date"
  }
}
```

---

## Scalability Considerations

### Horizontal Scaling
- **Frontend**: Static files served via CDN
- **Backend**: Multiple Django instances behind load balancer
- **Database**: PostgreSQL read replicas for read-heavy operations
- **AI Service**: Multiple FastAPI instances for ML inference

### Caching Strategy
- **Frontend**: Browser caching, service workers
- **Backend**: Redis for session data, API responses
- **Database**: Query result caching

### Performance Optimization
- **Database Indexing**: On foreign keys and frequently queried fields
- **API Pagination**: Limit response size
- **Lazy Loading**: Load data as needed in frontend
- **Database Connection Pooling**: Reuse database connections

---

## Future Enhancements

1. **Real-time Features**
   - WebSocket for live chat between doctor and patient
   - Real-time appointment notifications

2. **Mobile Apps**
   - React Native app (same backend)
   - Push notifications

3. **Advanced AI**
   - Medical image analysis
   - Chatbot for symptom checking
   - Personalized health recommendations

4. **Microservices**
   - Separate notification service
   - Separate payment service
   - Separate messaging service

5. **DevOps**
   - Docker containerization
   - Kubernetes orchestration
   - CI/CD pipeline (GitHub Actions)
   - Automated testing

---

## Conclusion

This architecture provides:
- ✅ **Scalability**: Can grow with user base
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **Security**: Multiple security layers
- ✅ **Performance**: Optimized for speed
- ✅ **Developer Experience**: Modern tools and frameworks
- ✅ **Future-proof**: Easy to add new features

The monorepo structure keeps everything organized while allowing independent development and deployment of each component.
