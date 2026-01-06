# 🏥 SHS Backend (Django REST API)

## Overview
Django REST Framework backend for Smart Healthcare System. Handles authentication, appointments, prescriptions, and integrates with AI services.

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.10+
- PostgreSQL 14+
- pip package manager

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Virtual Environment
```bash
python3 -m venv venv

# Activate
# Linux/Mac:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Setup PostgreSQL Database

```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE shs_db;
CREATE USER shs_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE shs_db TO shs_user;
ALTER ROLE shs_user SET client_encoding TO 'utf8';
ALTER ROLE shs_user SET timezone TO 'UTC';
\q
```

### 5. Configure Environment

Create `.env` file:
```env
DEBUG=True
SECRET_KEY=django-secret-key-generate-a-strong-one
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=shs_db
DB_USER=shs_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

AI_SERVICE_URL=http://localhost:8001
DISEASE_PREDICTION_URL=http://localhost:8002

CORS_ALLOWED_ORIGINS=http://localhost:5174
```

### 6. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. Create Admin User
```bash
python manage.py createsuperuser
```

### 8. Run Development Server
```bash
python manage.py runserver

# Server at: http://127.0.0.1:8000
# Admin: http://127.0.0.1:8000/admin
# API: http://127.0.0.1:8000/api/v1/
```

---

## 📡 Key API Endpoints

### Authentication
- `POST /api/v1/auth/register/` - Register user
- `POST /api/v1/auth/login/` - Login
- `GET /api/v1/auth/profile/` - Get profile

### Appointments
- `POST /api/v1/appointments/` - Book appointment
- `GET /api/v1/appointments/my-appointments/` - My appointments
- `GET /api/v1/appointments/doctor/today/` - Today's appointments (Doctor)
- `GET /api/v1/appointments/doctor/upcoming/` - Upcoming appointments (Doctor)

### Doctors
- `GET /api/v1/doctors/` - List doctors
- `GET /api/v1/doctors/recommend/` - AI recommendations

### Prescriptions
- `POST /api/v1/prescriptions/` - Create prescription (Doctor)
- `GET /api/v1/prescriptions/` - List prescriptions

---

## 🔧 Management Commands

### Cleanup Missed Appointments
```bash
# Manual cleanup
python manage.py cleanup_missed_appointments

# Setup cron job (run at 11:59 PM daily)
crontab -e
# Add: 59 23 * * * cd /path/to/backend && python manage.py cleanup_missed_appointments
```

---

## 🧪 Testing
```bash
python manage.py test
```

---

## 📁 Project Structure
```
backend/
├── apps/
│   ├── appointment/      # Appointment management
│   ├── doctors/         # Doctor profiles
│   ├── prescription/    # Prescriptions
│   └── users/          # Authentication
├── config/
│   ├── settings.py     # Django settings
│   └── urls.py        # URL routing
├── manage.py
└── requirements.txt
```

---

## 🚢 Production Deployment

```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

---

## 🐛 Troubleshooting

**Database Connection Error:**
```bash
sudo systemctl status postgresql
psql -U shs_user -d shs_db
```

**Migration Issues:**
```bash
python manage.py migrate --fake-initial
```

**Port Already in Use:**
```bash
lsof -i :8000
kill -9 <PID>
```

---

## 📚 Documentation
- Admin Panel: http://localhost:8000/admin
- API Docs: http://localhost:8000/api/v1/
- [Django Docs](https://docs.djangoproject.com/)
- [DRF Docs](https://www.django-rest-framework.org/)

---

**Last Updated:** January 6, 2026
