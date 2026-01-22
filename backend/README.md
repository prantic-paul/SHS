# �� Backend – Smart Health Synchronizer

**Django REST Framework backend powering the Smart Health Synchronizer platform with robust APIs for healthcare management, AI integration, and real-time data processing.**

---

## 📋 Overview

The SHS backend is a comprehensive Django-based REST API that serves as the central hub for all platform operations. It manages:

- **User Authentication & Authorization** - JWT-based secure authentication for patients, doctors, and admins
- **Doctor Management** - Registration, verification, search, and profile management
- **Appointment System** - Booking, scheduling, status tracking, and automatic cleanup
- **AI Service Integration** - Proxies requests to AI chatbot service
- **ML Service Integration** - Routes disease prediction requests
- **Prescription Management** - Digital prescription creation and storage
- **Blog System** - Medical article publishing and management
- **Medical Records** - Patient health history and vital signs tracking
- **Admin Operations** - Doctor verification, user management, content moderation

**Key Features:**
- 🔐 Secure JWT authentication with role-based access control
- 📊 RESTful API design with comprehensive endpoints
- 🗄️ SQLite3 database for development
- 🔄 Automated appointment status management
- 🤖 Seamless AI/ML service integration
- 📝 Auto-generated API documentation (DRF Spectacular)
- ✅ Input validation and error handling
- 🔍 Advanced search and filtering capabilities

---

## 🏗️ System Architecture

### Backend Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Frontend[React Frontend<br/>Port 5173]
    end
    
    subgraph "Backend Layer - Port 8000"
        DRF[Django REST Framework<br/>API Gateway]
        
        subgraph "Core Applications"
            Users[users<br/>Authentication & Profiles]
            Doctors[doctors<br/>Doctor Management]
            Appointment[appointment<br/>Booking System]
            Chat[chat<br/>AI Integration]
            Prescription[prescription<br/>Digital Prescriptions]
            Blog[blog<br/>Medical Articles]
            MedRecord[medical_record<br/>Health History]
        end
        
        Auth[JWT Authentication<br/>Simple JWT]
        CORS[CORS Headers<br/>Cross-Origin Support]
        
        DB[(SQLite3 Database<br/>db.sqlite3)]
    end
    
    subgraph "External Services"
        AI[AI Service<br/>Port 8001<br/>RAG Chatbot]
        ML[ML Service<br/>Port 8002<br/>Disease Prediction]
    end
    
    Frontend -->|HTTP Requests| DRF
    DRF --> Auth
    Auth --> Users
    DRF --> CORS
    
    DRF --> Users
    DRF --> Doctors
    DRF --> Appointment
    DRF --> Chat
    DRF --> Prescription
    DRF --> Blog
    DRF --> MedRecord
    
    Users --> DB
    Doctors --> DB
    Appointment --> DB
    Chat --> DB
    Prescription --> DB
    Blog --> DB
    MedRecord --> DB
    
    Chat -->|Proxy Requests| AI
    Backend -->|Symptom Data| ML
    
    style Frontend fill:#1e3a5f,stroke:#4fc3f7,stroke-width:2px,color:#e3f2fd
    style DRF fill:#1b5e20,stroke:#66bb6a,stroke-width:2px,color:#e8f5e9
    style Users fill:#004d40,stroke:#4db6ac,stroke-width:2px,color:#e0f2f1
    style Doctors fill:#004d40,stroke:#4db6ac,stroke-width:2px,color:#e0f2f1
    style Appointment fill:#004d40,stroke:#4db6ac,stroke-width:2px,color:#e0f2f1
    style Chat fill:#004d40,stroke:#4db6ac,stroke-width:2px,color:#e0f2f1
    style Prescription fill:#004d40,stroke:#4db6ac,stroke-width:2px,color:#e0f2f1
    style Blog fill:#004d40,stroke:#4db6ac,stroke-width:2px,color:#e0f2f1
    style MedRecord fill:#004d40,stroke:#4db6ac,stroke-width:2px,color:#e0f2f1
    style Auth fill:#6a1b9a,stroke:#ab47bc,stroke-width:2px,color:#f3e5f5
    style CORS fill:#6a1b9a,stroke:#ab47bc,stroke-width:2px,color:#f3e5f5
    style DB fill:#01579b,stroke:#29b6f6,stroke-width:2px,color:#e1f5fe
    style AI fill:#0d47a1,stroke:#42a5f5,stroke-width:2px,color:#e3f2fd
    style ML fill:#e65100,stroke:#ff9800,stroke-width:2px,color:#fff3e0
```

### Request Flow

1. **Client Request** → React Frontend sends HTTP request with JWT token
2. **Authentication** → JWT token validated via Simple JWT middleware
3. **API Routing** → Django URL dispatcher routes to appropriate view
4. **Business Logic** → View processes request, validates data with serializers
5. **Database Query** → Django ORM queries SQLite3 database
6. **External Services** → Calls AI/ML services if needed (chat, predictions)
7. **Response** → JSON response sent back to client

---

## 🛠️ Tech Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | Django | 4.2.7 | Web framework |
| **API** | Django REST Framework | 3.14.0 | REST API toolkit |
| **Authentication** | djangorestframework-simplejwt | 5.3.1 | JWT auth |
| **CORS** | django-cors-headers | 4.3.1 | Cross-origin requests |
| **Database** | SQLite3 | Built-in | Development database |
| **API Docs** | drf-spectacular | 0.27.0 | OpenAPI schema |
| **HTTP Client** | requests | 2.31.0 | External API calls |
| **Environment** | python-decouple | 3.8 | Environment variables |
| **Timezone** | pytz | 2023.3 | Timezone support |

---

## 📦 Core Modules

### 1. **users** - User Management
**Purpose:** Handle user authentication, registration, and profile management

**Models:**
- `User` - Custom user model (extends AbstractUser)
- `UserProfile` - Extended user information

**Key Features:**
- User registration (patient/doctor)
- Login/logout with JWT tokens
- Profile management
- Role-based access control (patient/doctor/admin)

**Main Endpoints:**
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login (returns JWT)
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update profile
- `POST /api/v1/auth/token/refresh` - Refresh JWT token

### 2. **doctors** - Doctor Management
**Purpose:** Manage doctor profiles, verification, and search functionality

**Models:**
- `DoctorInformation` - Doctor profile details
- `DoctorSpecialization` - Medical specializations
- `DoctorAvailability` - Working hours and schedules

**Key Features:**
- Doctor registration and admin verification
- Advanced search with filters (specialty, location, rating)
- Doctor profile management with experience and education
- Ratings and reviews system
- Availability scheduling

**Main Endpoints:**
- `GET /api/v1/doctors/search` - Search doctors with filters
- `GET /api/v1/doctors/{id}` - Get doctor details
- `POST /api/v1/doctors/register` - Doctor registration
- `PATCH /api/v1/doctors/verify/{id}` - Verify doctor (admin only)
- `GET /api/v1/doctors/{id}/availability` - Get doctor availability

### 3. **appointment** - Appointment System
**Purpose:** Handle appointment booking, scheduling, and management

**Models:**
- `Appointment` - Appointment details and status
- `AppointmentSlot` - Available time slots for doctors

**Key Features:**
- Appointment booking with date/time selection
- Status tracking (pending, confirmed, completed, cancelled)
- Automatic missed appointment cleanup (scheduled task)
- Doctor and patient dashboards
- Appointment history and analytics

**Main Endpoints:**
- `POST /api/v1/appointments/` - Book new appointment
- `GET /api/v1/appointments/my-appointments` - Get user's appointments
- `GET /api/v1/appointments/doctor-appointments` - Doctor's appointments
- `PATCH /api/v1/appointments/{id}/status` - Update appointment status
- `DELETE /api/v1/appointments/{id}` - Cancel appointment

### 4. **chat** - AI Chatbot Integration
**Purpose:** Store chat history and proxy requests to AI service

**Models:**
- `ChatMessage` - Chat message storage with user and AI responses

**Key Features:**
- Message storage and retrieval
- AI service integration (proxies to Port 8001)
- Chat history per user
- Conversation threading

**Main Endpoints:**
- `POST /api/v1/chat/send-message` - Send message to AI assistant
- `GET /api/v1/chat/history` - Get user's chat history
- `DELETE /api/v1/chat/clear-history` - Clear chat history

### 5. **prescription** - Prescription Management
**Purpose:** Digital prescription creation and storage by doctors

**Models:**
- `Prescription` - Prescription details linked to appointments
- `Medication` - Prescribed medications with dosage
- `MedicalTest` - Recommended medical tests

**Key Features:**
- Create detailed prescriptions after appointments
- Add medications with dosage instructions
- Recommend medical tests
- Track vital signs (BP, temperature, weight)
- Digital prescription PDF generation

**Main Endpoints:**
- `POST /api/v1/prescriptions/` - Create prescription (doctor only)
- `GET /api/v1/prescriptions/patient/{id}` - Get patient prescriptions
- `GET /api/v1/prescriptions/{id}` - Get prescription details
- `GET /api/v1/prescriptions/{id}/download` - Download prescription PDF

### 6. **blog** - Medical Blog System
**Purpose:** Medical article publishing and management by doctors

**Models:**
- `BlogPost` - Medical article with rich content

**Key Features:**
- Create and publish medical articles
- Rich text content support (Markdown/HTML)
- Author attribution (doctors only can write)
- Blog listing with pagination
- Search and category filtering

**Main Endpoints:**
- `GET /api/v1/blogs/` - List all published blogs
- `POST /api/v1/blogs/` - Create blog (doctor only)
- `GET /api/v1/blogs/{id}` - Get blog details
- `PUT /api/v1/blogs/{id}` - Update blog (author only)
- `DELETE /api/v1/blogs/{id}` - Delete blog (author/admin)

### 7. **medical_record** - Health Records
**Purpose:** Patient health history and medical records storage

**Models:**
- `MedicalRecord` - Patient health data and history

**Key Features:**
- Store comprehensive medical history
- Track chronic health conditions
- Record allergies and current medications
- Family medical history
- Lab test results storage

**Main Endpoints:**
- `GET /api/v1/medical-records/{patient_id}` - Get patient records
- `POST /api/v1/medical-records/` - Add medical record
- `PUT /api/v1/medical-records/{id}` - Update record

---

## 📖 API Documentation

### Authentication & Authorization

**JWT Token-Based Authentication**

1. **Register/Login** → Receive access and refresh tokens
2. **Include Token** → Add to Authorization header: `Bearer <access_token>`
3. **Refresh Token** → Use refresh token to get new access token when expired

```bash
# Login Example
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Response
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "patient"
  }
}

# Use token in subsequent requests
curl -X GET http://localhost:8000/api/v1/auth/profile \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

### Role-Based Access Control

| Role | Access Level |
|------|-------------|
| **Patient** | Book appointments, chat with AI, predict diseases, view own data |
| **Doctor** | View appointments, create prescriptions, write blogs, manage patient records |
| **Admin** | All access + verify doctors, manage users, moderate content |

### Interactive API Documentation

Django REST Framework provides auto-generated documentation:

- **Browsable API:** http://localhost:8000/api/v1/
- **Swagger UI:** http://localhost:8000/api/schema/swagger-ui/
- **ReDoc:** http://localhost:8000/api/schema/redoc/
- **OpenAPI Schema:** http://localhost:8000/api/schema/

---

## 🔐 Authentication & Authorization

### JWT Implementation

**Simple JWT Configuration:**

```python
# settings.py
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

### Permission Classes

```python
# Custom permission example
from rest_framework import permissions

class IsDoctor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'doctor'

# Usage in views
class PrescriptionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsDoctor]
```

---

## 🗄️ Database Design

### Database: SQLite3 (db.sqlite3)

**Why SQLite3?**
- ✅ Zero configuration required
- ✅ Perfect for development and testing
- ✅ Single file database (easy backup)
- ✅ Built into Python
- ✅ Lightweight and fast for small to medium datasets

### Key Models and Relationships

```
User (AbstractUser)
  ├── UserProfile (OneToOne)
  ├── DoctorInformation (OneToOne, if doctor)
  ├── Appointment (as patient, ForeignKey)
  ├── Appointment (as doctor, ForeignKey)
  ├── ChatMessage (ForeignKey)
  ├── Prescription (as patient, ForeignKey)
  ├── MedicalRecord (ForeignKey)
  └── BlogPost (as author, ForeignKey)

DoctorInformation
  ├── User (OneToOne)
  ├── DoctorSpecialization (ManyToMany)
  ├── DoctorAvailability (ManyToMany)
  └── Appointment (ForeignKey)

Appointment
  ├── Patient (ForeignKey to User)
  ├── Doctor (ForeignKey to DoctorInformation)
  └── Prescription (OneToOne, optional)

Prescription
  ├── Patient (ForeignKey to User)
  ├── Doctor (ForeignKey to User)
  ├── Appointment (OneToOne)
  ├── Medication (ManyToMany)
  └── MedicalTest (ManyToMany)
```

---

## ⚙️ Environment Variables

Create a `.env` file in the backend directory:

```env
# Django Configuration
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (SQLite3 - no configuration needed, auto-created as db.sqlite3)

# External Services
AI_SERVICE_URL=http://localhost:8001
ML_SERVICE_URL=http://localhost:8002

# JWT Settings
JWT_ACCESS_TOKEN_LIFETIME=60  # minutes
JWT_REFRESH_TOKEN_LIFETIME=7  # days

# CORS (for development)
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Email Configuration (optional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

---

## 🚀 Setup & Run Locally

### Prerequisites
- Python 3.10 or higher
- pip package manager

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Create Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### Step 3: Install Dependencies
```bash
# Upgrade pip
pip install --upgrade pip

# Install requirements
pip install -r requirements.txt
```

### Step 4: Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration (optional for basic setup)
nano .env
```

### Step 5: Run Migrations
```bash
# Create database tables (creates db.sqlite3 automatically)
python manage.py makemigrations
python manage.py migrate
```

This will create the `db.sqlite3` file with all necessary tables.

### Step 6: Create Superuser
```bash
# Create admin account
python manage.py createsuperuser
```

Follow the prompts to set email and password.

### Step 7: (Optional) Load Sample Data
```bash
# Load sample doctors and patients
python manage.py loaddata fixtures/sample_data.json
```

### Step 8: Run Development Server
```bash
python manage.py runserver
```

The backend will start at `http://localhost:8000`

### Step 9: Access Admin Panel
Navigate to `http://localhost:8000/admin` and login with superuser credentials.

---

## 🧪 Testing

### Run Tests
```bash
# Run all tests
python manage.py test

# Run tests for specific app
python manage.py test apps.appointment

# Run with verbose output
python manage.py test --verbosity=2
```

### Test Structure
```
backend/
└── apps/
    └── appointment/
        └── tests/
            ├── __init__.py
            ├── test_models.py
            ├── test_views.py
            ├── test_serializers.py
            └── test_permissions.py
```

---

## �� License

Part of Smart Health Synchronizer - MIT License

---

## 👨‍💻 Author

**Prantic Paul**  
- 📧 Email: pranticpaulshimul@gmail.com
- 🐙 GitHub: [@prantic-paul](https://github.com/prantic-paul)
