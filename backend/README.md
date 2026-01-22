# 🔧 Backend – Smart Health Synchronizer

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
- �� Secure JWT authentication with role-based access control
- 📊 RESTful API design with comprehensive endpoints
- 🗄️ SQLite3 database for development (easily switchable to PostgreSQL)
- 🔄 Automated appointment status management
- 🤖 Seamless AI/ML service integration
- 📝 Auto-generated API documentation (DRF Spectacular)
- ✅ Input validation and error handling
- 🔍 Advanced search and filtering capabilities

---

## 🏗️ System Architecture

### Backend Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Django Backend (Port 8000)                    │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     Django REST Framework                   │ │
│  │  • JWT Authentication       • CORS Headers                 │ │
│  │  • API Routing              • Request/Response Handling    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      Core Applications                      │ │
│  │                                                             │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │ │
│  │  │  users   │  │ doctors  │  │appointment│  │   chat   │  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │ │
│  │                                                             │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                │ │
│  │  │ prescription│  │   blog   │  │medical_  │              │ │
│  │  │          │  │          │  │ record   │                │ │
│  │  └──────────┘  └──────────┘  └──────────┘                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      SQLite3 Database                       │ │
│  │                       (db.sqlite3)                          │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
           │                                 │
           ▼                                 ▼
   ┌────────────────┐              ┌────────────────┐
   │  AI Service    │              │  ML Service    │
   │  (Port 8001)   │              │  (Port 8002)   │
   └────────────────┘              └────────────────┘
```

### Request Flow

1. **Client Request** → React Frontend sends HTTP request
2. **Authentication** → JWT token validated via Simple JWT
3. **API Routing** → Django URL dispatcher routes to appropriate view
4. **Business Logic** → View processes request, validates data
5. **Database Query** → ORM queries SQLite3 database
6. **External Services** → Calls AI/ML services if needed
7. **Response** → JSON response sent back to client

---

## 🛠️ Tech Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | Django | 4.2.7 | Web framework |
| **API** | Django REST Framework | 3.14.0 | REST API toolkit |
| **Authentication** | djangorestframework-simplejwt | 5.3.1 | JWT auth |
| **CORS** | django-cors-headers | 4.3.1 | Cross-origin requests |
| **Filtering** | django-filter | 23.5 | Query filtering |
| **Database** | SQLite3 | Built-in | Development database |
| **API Docs** | drf-spectacular | 0.27.0 | OpenAPI schema |
| **HTTP Client** | requests | 2.31.0 | External API calls |
| **Environment** | python-dotenv | 1.0.0 | Environment variables |

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
- Role-based access control

**Endpoints:**
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update profile

### 2. **doctors** - Doctor Management
**Purpose:** Manage doctor profiles, verification, and search functionality

**Models:**
- `DoctorInformation` - Doctor profile details
- `DoctorSpecialization` - Medical specializations
- `DoctorAvailability` - Working hours

**Key Features:**
- Doctor registration and verification
- Advanced search with filters (specialty, location, rating)
- Doctor profile management
- Ratings and reviews

**Endpoints:**
- `GET /api/v1/doctors/search` - Search doctors
- `GET /api/v1/doctors/{id}` - Get doctor details
- `POST /api/v1/doctors/register` - Doctor registration
- `PATCH /api/v1/doctors/verify/{id}` - Verify doctor (admin only)

### 3. **appointment** - Appointment System
**Purpose:** Handle appointment booking, scheduling, and management

**Models:**
- `Appointment` - Appointment details
- `AppointmentSlot` - Available time slots

**Key Features:**
- Appointment booking with date/time selection
- Status tracking (pending, confirmed, completed, cancelled)
- Automatic missed appointment cleanup
- Doctor and patient dashboards

**Endpoints:**
- `POST /api/v1/appointments/` - Book appointment
- `GET /api/v1/appointments/my-appointments` - Get user appointments
- `GET /api/v1/appointments/doctor-appointments` - Doctor's appointments
- `PATCH /api/v1/appointments/{id}/status` - Update status

### 4. **chat** - AI Chatbot Integration
**Purpose:** Store chat history and proxy requests to AI service

**Models:**
- `ChatMessage` - Chat message storage

**Key Features:**
- Message storage and retrieval
- AI service integration
- Chat history per user

**Endpoints:**
- `POST /api/v1/chat/send-message` - Send message to AI
- `GET /api/v1/chat/history` - Get chat history

### 5. **prescription** - Prescription Management
**Purpose:** Digital prescription creation and storage

**Models:**
- `Prescription` - Prescription details
- `Medication` - Prescribed medications
- `MedicalTest` - Recommended tests

**Key Features:**
- Create detailed prescriptions
- Add medications with dosage
- Recommend medical tests
- Track vital signs

**Endpoints:**
- `POST /api/v1/prescriptions/` - Create prescription
- `GET /api/v1/prescriptions/patient/{id}` - Get patient prescriptions
- `GET /api/v1/prescriptions/{id}` - Get prescription details

### 6. **blog** - Medical Blog System
**Purpose:** Medical article publishing and management

**Models:**
- `BlogPost` - Blog article

**Key Features:**
- Create and publish medical articles
- Rich text content support
- Author attribution (doctors only)
- Blog listing and search

**Endpoints:**
- `GET /api/v1/blogs/` - List all blogs
- `POST /api/v1/blogs/` - Create blog (doctor only)
- `GET /api/v1/blogs/{id}` - Get blog details
- `PUT /api/v1/blogs/{id}` - Update blog

### 7. **medical_record** - Health Records
**Purpose:** Patient health history and medical records

**Models:**
- `MedicalRecord` - Patient health data

**Key Features:**
- Store medical history
- Track health conditions
- Record allergies and medications

**Endpoints:**
- `GET /api/v1/medical-records/{patient_id}` - Get patient records
- `POST /api/v1/medical-records/` - Add medical record

---

## 📖 API Documentation

### Authentication & Authorization

**JWT Token-Based Authentication**

1. **Register/Login** → Receive access and refresh tokens
2. **Include Token** → Add to Authorization header: `Bearer <access_token>`
3. **Refresh Token** → Use refresh token to get new access token when expired

```bash
# Login
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
| **Doctor** | View appointments, create prescriptions, write blogs, manage patients |
| **Admin** | All access + verify doctors, manage users, moderate content |

### API Endpoints Overview

#### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/token/refresh` - Refresh JWT token
- `GET /api/v1/auth/profile` - Get user profile

#### Doctors
- `GET /api/v1/doctors/search?specialty=cardiology` - Search doctors
- `GET /api/v1/doctors/{id}` - Get doctor details
- `POST /api/v1/doctors/register` - Register as doctor

#### Appointments
- `POST /api/v1/appointments/` - Book appointment
- `GET /api/v1/appointments/my-appointments` - User's appointments
- `PATCH /api/v1/appointments/{id}/status` - Update status

#### AI Chatbot
- `POST /api/v1/chat/send-message` - Chat with AI
- `GET /api/v1/chat/history` - Chat history

#### Disease Prediction
- `POST /api/v1/predict/disease` - Predict disease from symptoms

#### Prescriptions
- `POST /api/v1/prescriptions/` - Create prescription
- `GET /api/v1/prescriptions/patient/{id}` - Patient prescriptions

#### Blogs
- `GET /api/v1/blogs/` - List blogs
- `POST /api/v1/blogs/` - Create blog

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
class IsDoctor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'doctor'

# Usage in views
class PrescriptionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsDoctor]
```

---

## 🗄️ Database Design

### Key Models and Relationships

```
User (AbstractUser)
  ├── UserProfile (OneToOne)
  ├── DoctorInformation (OneToOne)
  ├── Appointment (as patient, ForeignKey)
  ├── Appointment (as doctor, ForeignKey)
  ├── ChatMessage (ForeignKey)
  ├── Prescription (as patient, ForeignKey)
  └── BlogPost (as author, ForeignKey)

DoctorInformation
  ├── User (OneToOne)
  ├── DoctorSpecialization (ManyToMany)
  ├── DoctorAvailability (ManyToMany)
  └── Appointment (ForeignKey)

Appointment
  ├── Patient (ForeignKey to User)
  ├── Doctor (ForeignKey to Doctor Information)
  └── Prescription (OneToOne)

Prescription
  ├── Patient (ForeignKey to User)
  ├── Doctor (ForeignKey to User)
  ├── Appointment (OneToOne)
  ├── Medication (ManyToMany)
  └── MedicalTest (ManyToMany)
```

### Database Schema Highlights

**Users Table:**
- Custom user model extending Django's AbstractUser
- Fields: email (unique), password, role (patient/doctor/admin), is_verified

**Doctors Table:**
- Linked to User via OneToOne
- Fields: specialty, experience, education, rating, fees, location

**Appointments Table:**
- Links patient and doctor
- Fields: date, time, status, reason, notes

**Prescriptions Table:**
- Links appointment to medications
- Fields: diagnosis, symptoms, medications, tests, advice

---

## ⚙️ Environment Variables

Create a `.env` file in the backend directory:

```env
# Django Configuration
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (SQLite3 by default, no configuration needed)
# For PostgreSQL, uncomment and configure:
# DATABASE_URL=postgresql://user:password@localhost:5432/shs_db

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
# For production:
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USE_TLS=True
# EMAIL_HOST_USER=your-email@gmail.com
# EMAIL_HOST_PASSWORD=your-app-password
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

# Edit .env with your configuration
nano .env
```

### Step 5: Run Migrations
```bash
# Create database tables (creates db.sqlite3 automatically)
python manage.py makemigrations
python manage.py migrate
```

### Step 6: Create Superuser
```bash
# Create admin account
python manage.py createsuperuser
```

Follow the prompts to set email and password.

### Step 7: (Optional) Seed Data
```bash
# Seed sample doctors and patients
python manage.py seed_bd_data
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

# Run with coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Generate HTML report
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

### Example Test
```python
from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

class AppointmentTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        
    def test_book_appointment(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/v1/appointments/', {
            'doctor': 1,
            'date': '2026-01-25',
            'time': '10:00'
        })
        self.assertEqual(response.status_code, 201)
```

---

## 🚢 Deployment Notes

### Production Checklist

- [ ] Set `DEBUG=False` in settings
- [ ] Configure proper `SECRET_KEY`
- [ ] Set up PostgreSQL database
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Set up static files collection (`python manage.py collectstatic`)
- [ ] Configure HTTPS
- [ ] Set up CORS for production frontend domain
- [ ] Configure email backend
- [ ] Set up logging
- [ ] Enable database backups
- [ ] Configure rate limiting

### Environment Variables for Production
```env
DEBUG=False
SECRET_KEY=<strong-secret-key>
DATABASE_URL=postgresql://user:pass@host:5432/db
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### Deployment Platforms

**Recommended:**
- **AWS EC2** - Full control, scalable
- **Heroku** - Easy deployment with Procfile
- **DigitalOcean** - Simple setup with App Platform
- **Google Cloud Run** - Container-based deployment
- **Railway** - Modern deployment platform

### Docker Deployment
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

---

## 🤝 Contributing

See main project [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

---

## 📄 License

Part of Smart Health Synchronizer - Licensed under MIT License.

---

## 👨‍💻 Author

**Prantic Paul**
- 📧 Email: pranticpaulshimul@gmail.com
- 🐙 GitHub: [@prantic-paul](https://github.com/prantic-paul)
