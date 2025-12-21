# Smart Health Synchronizer (SHS)

A comprehensive healthcare management platform that connects patients with verified healthcare professionals, enables appointment booking, and provides digital health record management.

## 🚀 Quick Start

### Backend (Django)
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/v1/
- **Admin Panel**: http://localhost:8000/admin/

## 📚 Documentation

### Core Documentation
- **[Problem Statement](./docs/PROBLEM_STATEMENT.md)** - Project overview and objectives
- **[Requirements](./docs/REQUIREMENTS.md)** - Functional and non-functional requirements
- **[Product Backlog](./docs/PRODUCT_BACKLOG.md)** - Feature backlog and priorities
- **[User Base](./docs/USER_BASE.md)** - Target users and personas

### Architecture & Design
- **[System Architecture](./docs/architecture/SYSTEM_ARCHITECTURE.md)** - High-level system design
- **[Database Schema](./docs/architecture/DATABASE_SCHEMA.md)** - Database design and relationships
- **[API Design Principles](./docs/architecture/API_DESIGN_PRINCIPLES.md)** - REST API guidelines

### Sprint Documentation
- **[Sprint 1: Authentication](./docs/sprints/sprint-01-authentication/README.md)** - User authentication and profile management
  - [Testing Guide](./docs/sprints/sprint-01-authentication/TESTING_GUIDE.md)
  - [Quick Summary](./docs/sprints/sprint-01-authentication/SUMMARY.md)
  - [Bug Fixes](./docs/sprints/sprint-01-authentication/fixes/)

### Learning Resources
- **[Learning Materials](./docs/learning/README.md)** - Guides for developers new to the project

## 🏗️ Project Structure

```
SHS/
├── backend/              # Django REST Framework backend
│   ├── apps/            # Django apps (users, appointments, etc.)
│   ├── config/          # Project configuration
│   └── requirements.txt
├── frontend/            # React + Vite frontend
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── contexts/   # React contexts
│   │   └── services/   # API services
│   └── package.json
├── ai-service/          # AI/ML services (future)
└── docs/               # Documentation
    ├── architecture/   # System design docs
    ├── learning/       # Learning materials
    └── sprints/        # Sprint documentation
```

## 🎯 Features

### ✅ Implemented (Sprint 1)
- User registration and authentication
- JWT-based security
- User profile management
- Doctor application system
- Admin panel for doctor verification
- Role-based access control

### 🔜 Upcoming
- Doctor search and filtering
- Appointment booking
- Digital health records
- Telemedicine integration
- AI-powered recommendations

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 4.2.7
- **API**: Django REST Framework 3.14.0
- **Authentication**: djangorestframework-simplejwt
- **Database**: SQLite (development), PostgreSQL (production)

### Frontend
- **Framework**: React 19.0.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router v6
- **HTTP Client**: Axios

## 👥 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and development process.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 📞 Contact

- **Project Repository**: https://github.com/prantic-paul/SHS
- **Email**: contact@smarthealth.com

---

**Current Sprint**: Sprint 1 - Authentication ✅ Completed  
**Next Sprint**: Sprint 2 - Doctor Search & Appointments  
**Last Updated**: December 21, 2025
