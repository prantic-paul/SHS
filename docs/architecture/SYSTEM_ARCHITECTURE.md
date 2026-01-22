# System Architecture: Smart Health Synchronizer

## Overview
This document describes the high-level system architecture for Smart Health Synchronizer (SHS) - Sprint 0 initial design. This architecture will evolve incrementally as we implement features in subsequent sprints.

**Architecture Level:** High-Level (10% detail - concepts and relationships only)  
**Phase:** Sprint 0 - Foundation  
**Last Updated:** December 21, 2025

---

## 1. System Components

The Smart Health Synchronizer is built using a **4-tier architecture** with separated concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Frontend (React.js)                    │    │
│  │  - User Interface                                   │    │
│  │  - User Interactions                                │    │
│  │  - API Communication                                │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            │ (JSON)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Backend (Django REST Framework)             │    │
│  │  - Request/Response Handling                        │    │
│  │  - Business Logic                                   │    │
│  │  - Authentication (JWT Middleware)                  │    │
│  │  - API Endpoints                                    │    │
│  │  - Data Validation                                  │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                │                           │
                │                           │ HTTP/REST API
                │                           │ (JSON)
                │                           ▼
                │              ┌──────────────────────────┐
                │              │   AI Service (FastAPI)   │
                │              │  - Symptom Extraction    │
                │              │  - Disease Prediction    │
                │              │  - Doctor Recommendation │
                │              │  - ML Models:            │
                │              │    • Random Forest       │
                │              │    • SVM                 │
                │              │    • Others              │
                │              └──────────────────────────┘
                │
                │ SQL Queries
                ▼
┌─────────────────────────────────────────────────────────────┐
│                         DATA LAYER                           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │            Database (PostgreSQL)                    │    │
│  │  - User Data                                        │    │
│  │  - Medical Records                                  │    │
│  │  - Appointments                                     │    │
│  │  - Prescriptions                                    │    │
│  │  - Blog Posts                                       │    │
│  │  - All Application Data                             │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Component Details

### 2.1 Frontend (React.js)
**Purpose:** Client-side user interface for user interactions

**Responsibilities:**
- Render user interface (UI/UX)
- Handle user inputs and interactions
- Send requests to Backend API
- Display responses from Backend
- Manage client-side state
- Handle routing between pages

**Technology Stack:**
- React.js (UI framework)
- React Router (navigation)
- Axios/Fetch (API calls)
- CSS/Tailwind (styling)

**Communication:**
- **With Backend:** HTTPS REST API (JSON format)
- **Authentication:** Sends JWT token in request headers

---

### 2.2 Backend (Django REST Framework)
**Purpose:** Server-side application logic and API management

**Responsibilities:**
- Handle all incoming HTTP requests
- Process and validate user data
- Implement business logic (appointment booking, prescription management, etc.)
- Authenticate and authorize users (JWT middleware)
- Communicate with Database (CRUD operations)
- Communicate with AI Service for predictions
- Send responses back to Frontend

**Technology Stack:**
- Django 4.x (web framework)
- Django REST Framework (API framework)
- Simple JWT (authentication)
- Python 3.10+

**Communication:**
- **With Frontend:** HTTPS REST API (receives requests, sends responses)
- **With Database:** Direct SQL queries via Django ORM
- **With AI Service:** HTTP REST API calls (JSON format)
- **Authentication:** Issues and validates JWT tokens

---

### 2.3 AI Service (FastAPI)
**Purpose:** Machine learning service for intelligent healthcare features

**Responsibilities:**
- Extract symptoms from patient descriptions (Natural Language Processing)
- Predict possible diseases based on symptoms (ML models)
- Suggest appropriate doctors based on predictions
- Return AI predictions to Backend

**Technology Stack:**
- FastAPI (API framework)
- Machine Learning Models:
  - Random Forest (classification)
  - Support Vector Machine (SVM)
  - Other ML algorithms
- scikit-learn (ML library)
- pandas (data processing)
- Python 3.10+

**Communication:**
- **With Backend:** HTTP REST API (receives requests, sends predictions)
- **Data Format:** JSON (symptoms, predictions, recommendations)

---

### 2.4 Database (PostgreSQL)
**Purpose:** Persistent data storage for all application data

**Responsibilities:**
- Store all user information (patients, doctors, admins)
- Store medical records and health history
- Store appointments and schedules
- Store prescriptions
- Store blog posts and reviews
- Maintain data integrity and relationships

**Technology Stack:**
- PostgreSQL 15+
- Relational database (SQL)

**Communication:**
- **With Backend:** Direct SQL queries via Django ORM
- **Data Format:** Structured relational data (tables, rows, columns)

---

## 3. Communication Flow

### 3.1 Standard Request Flow (Example: View Doctors)

```
1. User Action (Frontend)
   └─> User clicks "Search Doctors"

2. Frontend → Backend
   └─> GET /api/doctors/?location=Dhaka&specialty=Cardiology
       Headers: Authorization: Bearer <JWT_TOKEN>

3. Backend Processing
   ├─> Validate JWT token (authentication)
   ├─> Check user permissions (authorization)
   ├─> Query Database for doctors
   └─> Format response

4. Database → Backend
   └─> Return doctor data

5. Backend → Frontend
   └─> Response: { "doctors": [...] }

6. Frontend Display
   └─> Show doctor list to user
```

### 3.2 AI-Powered Request Flow (Example: Doctor Recommendation)

```
1. User Action (Frontend)
   └─> User enters symptoms: "fever, cough, headache"

2. Frontend → Backend
   └─> POST /api/recommendations/
       Body: { "symptoms": "fever, cough, headache" }
       Headers: Authorization: Bearer <JWT_TOKEN>

3. Backend → AI Service
   └─> POST /predict/
       Body: { "description": "fever, cough, headache" }

4. AI Service Processing
   ├─> Extract symptoms (NLP)
   ├─> Run ML models (Random Forest, SVM)
   ├─> Predict disease
   └─> Recommend doctor specialty

5. AI Service → Backend
   └─> Response: {
         "symptoms": ["fever", "cough", "headache"],
         "predicted_disease": "Common Cold",
         "recommended_specialty": "General Physician",
         "confidence": 0.85
       }

6. Backend Processing
   ├─> Query Database for matching doctors
   └─> Format final response

7. Backend → Frontend
   └─> Response: {
         "prediction": "Common Cold",
         "doctors": [...]
       }

8. Frontend Display
   └─> Show prediction and recommended doctors
```

---

## 4. Authentication & Security

### 4.1 JWT-Based Authentication

**Authentication Flow:**

```
1. User Login (Frontend)
   └─> POST /api/auth/login/
       Body: { "email": "user@example.com", "password": "****" }

2. Backend Validation
   ├─> Check credentials in Database
   └─> If valid, generate JWT token

3. Backend → Frontend
   └─> Response: {
         "access_token": "eyJhbGc...",
         "refresh_token": "eyJhbGc...",
         "user": { ... }
       }

4. Frontend Storage
   └─> Store tokens securely (localStorage/sessionStorage)

5. Subsequent Requests
   └─> Include token in headers:
       Authorization: Bearer <ACCESS_TOKEN>

6. Backend Middleware
   ├─> Validate token
   ├─> Extract user identity
   └─> Allow/Deny access
```

**Security Measures:**
- All passwords stored as hashed values (bcrypt/Argon2)
- HTTPS encryption for all communication
- JWT tokens for stateless authentication
- Token expiration and refresh mechanism
- Role-based access control (Patient, Doctor, Admin)

---

## 5. Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React.js | User interface and interactions |
| **Backend** | Django REST Framework | API and business logic |
| **AI Service** | FastAPI + ML Models | Intelligent predictions |
| **Database** | PostgreSQL | Data storage |
| **Authentication** | Simple JWT | Secure user authentication |
| **Communication** | REST API (JSON) | Component interaction |
| **Security** | HTTPS/SSL | Encrypted communication |

---

## 6. Design Principles

### 6.1 Separation of Concerns
- Frontend handles UI only
- Backend handles business logic only
- AI Service handles ML predictions only
- Database handles data storage only

### 6.2 Stateless Architecture
- JWT-based authentication (no server-side sessions)
- Each request contains all necessary information
- Enables horizontal scaling

### 6.3 API-First Design
- All components communicate via REST APIs
- Clear, documented API contracts
- Easy to test and maintain

### 6.4 Modularity
- Components are independent and loosely coupled
- Each service can be developed, tested, and deployed separately
- Easy to replace or upgrade individual components

### 6.5 Security by Default
- Authentication required for sensitive operations
- Data encryption in transit (HTTPS)
- Password hashing for storage
- Input validation on all endpoints

---

## 7. Deployment Architecture (Initial)

```
┌─────────────────────────────────────────────────────┐
│                Development Environment              │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │   Frontend   │  │   Backend    │  │ Database │ │
│  │ localhost:   │  │ localhost:   │  │ localhost│ │
│  │   3000       │  │   8000       │  │   5432   │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
│                     ┌──────────────┐               │
│                     │  AI Service  │               │
│                     │ localhost:   │               │
│                     │   8001       │               │
│                     └──────────────┘               │
└─────────────────────────────────────────────────────┘
```

**Note:** Production deployment architecture will be designed in later sprints.

---

## 8. Data Flow Example: Complete User Journey

**Scenario:** Patient books an appointment with a doctor

```
Step 1: User Authentication
Frontend → Backend: POST /api/auth/login/
Backend → Database: Verify credentials
Backend → Frontend: Return JWT token

Step 2: Symptom Analysis
Frontend → Backend: POST /api/symptoms/analyze/
Backend → AI Service: POST /predict/
AI Service → Backend: Return prediction
Backend → Frontend: Return recommended doctors

Step 3: Doctor Selection
Frontend → Backend: GET /api/doctors/{id}/
Backend → Database: Fetch doctor details
Backend → Frontend: Return doctor profile

Step 4: Appointment Booking
Frontend → Backend: POST /api/appointments/
Backend → Database: Create appointment record
Backend → Frontend: Return confirmation

Step 5: Confirmation
Frontend: Display success message to user
```

---

## 9. Future Considerations

**This architecture will evolve to include:**
- Notification service (email/SMS reminders)
- File storage service (prescription PDFs, images)
- Caching layer (Redis for performance)
- Message queue (for async tasks)
- API Gateway (for load balancing)
- Microservices (as system grows)

**These will be designed and implemented in future sprints based on requirements.**

---

## 10. Architecture Decision Records (ADRs)

Key architectural decisions are documented separately in `/docs/adr/`:
- Technology choices (Django, React, FastAPI, PostgreSQL)
- Authentication strategy (JWT)
- Communication protocol (REST API)
- Database design approach
- AI/ML model selection

**Note:** ADRs will be created as we make specific decisions during Sprint 0 and beyond.

---

## Summary

**What This Architecture Provides:**
- ✅ Clear separation of responsibilities
- ✅ Scalable and maintainable design
- ✅ Secure authentication and communication
- ✅ Intelligent AI-powered features
- ✅ Foundation for incremental development

**What We'll Design Later (Sprint 1+):**
- Specific API endpoints (e.g., POST /api/users/register/)
- Detailed database schema (tables, columns, types)
- Error handling strategies
- Logging and monitoring
- Deployment configuration
- Performance optimization

---

**Document Status:** ✅ Completed  
**Architecture Level:** High-Level (Sprint 0)  
**Next Step:** Initial Database Schema Design
