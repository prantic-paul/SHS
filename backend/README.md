# Backend - Django REST API

This directory contains the Django REST Framework backend for Smart Health Synchronizer.

## 🚀 Quick Start

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

## 📁 Structure

```
backend/
├── src/
│   ├── config/           # Django project settings
│   │   ├── settings/     # Settings split by environment
│   │   │   ├── base.py
│   │   │   ├── development.py
│   │   │   └── production.py
│   │   ├── urls.py       # Main URL configuration
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   └── apps/             # Django applications
│       ├── users/        # User authentication & profiles
│       ├── doctors/      # Doctor-specific features
│       ├── patients/     # Patient-specific features
│       ├── appointments/ # Appointment management
│       ├── prescriptions/# Digital prescriptions
│       ├── blogs/        # Blog system
│       └── chat/         # Chatbot integration
│
├── tests/                # Test files
├── requirements.txt      # Production dependencies
├── requirements-dev.txt  # Development dependencies
├── manage.py            # Django management script
├── pytest.ini           # Pytest configuration
├── .env.example         # Environment variables template
└── README.md            # This file
```

## 🛠️ Technologies

- **Django 4.2+**: Web framework
- **Django REST Framework**: API framework
- **PostgreSQL**: Database
- **djangorestframework-simplejwt**: JWT authentication
- **drf-spectacular**: API documentation
- **pytest**: Testing framework
- **black, flake8, isort**: Code quality tools

## 📝 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=smart_health_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET_KEY=your-jwt-secret
JWT_ACCESS_TOKEN_LIFETIME=60  # minutes
JWT_REFRESH_TOKEN_LIFETIME=1440  # minutes (24 hours)
```

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/test_auth.py

# Run specific test
pytest tests/test_auth.py::test_user_registration
```

## 📊 API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`
- OpenAPI Schema: `http://localhost:8000/api/schema/`

## 🔧 Development

```bash
# Create new Django app
python manage.py startapp app_name src/apps/app_name

# Make migrations
python manage.py makemigrations

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Run shell
python manage.py shell
```

## 📦 Dependencies

Install dependencies:
```bash
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Development tools
```

## 🎨 Code Quality

```bash
# Format code
black .

# Sort imports
isort .

# Lint code
flake8

# Run all quality checks
black . && isort . && flake8 && pytest
```

## 🚀 Coming Soon

This directory will be set up in Sprint 1 with:
- Django project initialization
- Database models
- API endpoints
- Authentication system
- Tests and documentation

Stay tuned! 🎉
