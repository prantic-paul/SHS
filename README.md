# 🏥 Smart Health Synchronizer (SHS)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Django](https://img.shields.io/badge/Django-4.2.7-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)

A comprehensive, microservices-based healthcare management platform that connects patients with verified healthcare professionals, enabling seamless appointment booking, AI-powered medical assistance, disease prediction, and digital health record management.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Services](#-services)
- [Documentation](#-documentation)
- [Tech Stack](#-tech-stack)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

SHS is a modern healthcare platform designed to bridge the gap between patients and healthcare providers through technology. The platform provides:

- **Patient Portal**: Book appointments, manage health records, AI chatbot assistance
- **Doctor Portal**: Manage appointments, patient records, write prescriptions, medical blogs
- **AI Services**: Intelligent medical chatbot with RAG-based responses
- **ML Prediction**: Disease prediction based on symptoms using machine learning
- **Admin Dashboard**: Complete system administration and user management

### 🎬 Key Highlights

- 🔐 **Secure**: JWT-based authentication with role-based access control
- 🤖 **AI-Powered**: Claude-based medical chatbot with vector database
- 🧠 **ML Integration**: Symptom-based disease prediction
- 📱 **Responsive**: Mobile-first design with modern UI/UX
- 🏗️ **Microservices**: Scalable architecture with independent services
- 📚 **Document-Driven**: Comprehensive documentation for every feature

---

## ✨ Features

### 👨‍⚕️ For Doctors
- ✅ Professional profile with specialization and verification
- ✅ Appointment management with calendar view (7-day visible appointments)
- ✅ Patient medical records access
- ✅ Prescription writing system
- ✅ Medical blog publishing
- ✅ Dashboard with analytics

### 🏥 For Patients
- ✅ User registration and profile management
- ✅ Doctor search by specialization, location, and availability
- ✅ Appointment booking with CAPTCHA verification
- ✅ AI medical chatbot for instant assistance
- ✅ Disease prediction based on symptoms
- ✅ Medical record management
- ✅ Prescription viewing

### 🤖 AI & ML Features
- ✅ RAG-based medical chatbot using Anthropic Claude
- ✅ ChromaDB vector database for medical knowledge
- ✅ Disease prediction using trained ML models
- ✅ Symptom analysis and recommendations
- ✅ Medical document embeddings

### 🔧 Admin Features
- ✅ Doctor verification system
- ✅ User management
- ✅ Content moderation
- ✅ System monitoring

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│                    React + Vite Frontend                         │
│              (Patient Portal, Doctor Portal, Admin)              │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ HTTPS/REST API
                 │
┌────────────────┴────────────────────────────────────────────────┐
│                      API Gateway Layer                           │
│                    Nginx Load Balancer                           │
└────────┬───────────────────┬──────────────────┬─────────────────┘
         │                   │                  │
         │                   │                  │
┌────────▼────────┐ ┌───────▼────────┐ ┌──────▼──────────┐
│  Backend API    │ │  AI Service    │ │  Disease Pred   │
│  (Django REST)  │ │  (FastAPI)     │ │  (FastAPI)      │
│                 │ │                │ │                 │
│  • Auth         │ │  • Chatbot     │ │  • ML Models    │
│  • Appointments │ │  • RAG         │ │  • Prediction   │
│  • Records      │ │  • ChromaDB    │ │  • Analysis     │
│  • Doctors      │ │  • Claude AI   │ │                 │
└────────┬────────┘ └───────┬────────┘ └──────┬──────────┘
         │                   │                  │
         │                   │                  │
┌────────▼───────────────────▼──────────────────▼─────────────────┐
│                        Data Layer                                │
│     PostgreSQL DB    │   ChromaDB    │   Model Storage          │
└──────────────────────────────────────────────────────────────────┘
```

### Design Principles

- **Separation of Concerns**: Each service handles specific functionality
- **Microservices**: Independent, scalable services
- **RESTful APIs**: Standard HTTP methods and status codes
- **JWT Authentication**: Stateless, secure authentication
- **Database per Service**: Each service manages its own data
- **API-First Development**: Well-documented APIs before implementation

---

## 🚀 Quick Start

### Prerequisites

- **Python** 3.10+
- **Node.js** 18+ and npm
- **PostgreSQL** 14+
- **Git**
- **Anthropic API Key** (for AI chatbot)

### One-Command Setup (All Services)

```bash
# Clone the repository
git clone https://github.com/prantic-paul/SHS.git
cd SHS

# Start all services
./start-all.sh
```

### Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | Patient/Doctor portal |
| Backend API | http://localhost:8000/api/v1/ | Main REST API |
| Admin Panel | http://localhost:8000/admin/ | Django admin |
| AI Service | http://localhost:8001 | Medical chatbot API |
| Disease Prediction | http://localhost:8002 | ML prediction API |

### Manual Setup (Step by Step)

For detailed setup instructions for each service, refer to individual service READMEs:

- [Backend Setup](./backend/README.md) - Django REST Framework setup
- [Frontend Setup](./frontend/README.md) - React + Vite setup
- [AI Service Setup](./ai-service/README.md) - FastAPI AI chatbot setup
- [Disease Prediction Setup](./disease-prediction-service/README.md) - ML service setup

---

## 🔧 Services

### 1. Backend Service (Django REST Framework)

Main application backend handling all business logic, authentication, and data management.

**Key Features:**
- User authentication & authorization
- Doctor and patient management
- Appointment booking system
- Medical record management
- Prescription system
- Blog management

📖 [Backend Documentation](./backend/README.md)

### 2. Frontend Application (React + Vite)

Modern, responsive web application providing user interfaces for patients and doctors.

**Key Features:**
- Patient registration and dashboard
- Doctor profile and dashboard
- Appointment booking interface
- AI chatbot integration
- Disease prediction interface
- Responsive design

📖 [Frontend Documentation](./frontend/README.md)

### 3. AI Service (FastAPI)

Intelligent medical chatbot service using RAG (Retrieval-Augmented Generation) with Anthropic Claude.

**Key Features:**
- Medical question answering
- Context-aware responses
- Vector database integration
- Medical knowledge base
- Real-time chat interface

📖 [AI Service Documentation](./ai-service/README.md)

### 4. Disease Prediction Service (FastAPI)

Machine learning service for symptom-based disease prediction.

**Key Features:**
- Symptom analysis
- Disease probability prediction
- Multiple ML models
- Recommendation engine
- Model training pipeline

📖 [Disease Prediction Documentation](./disease-prediction-service/README.md)

---

## 📚 Documentation

### Core Documentation

| Document | Description |
|----------|-------------|
| [System Architecture](./docs/architecture/SYSTEM_ARCHITECTURE.md) | High-level system design and component interaction |
| [Database Schema](./docs/architecture/DATABASE_SCHEMA.md) | Database design and relationships |
| [API Design](./docs/architecture/API_DESIGN_PRINCIPLES.md) | REST API design guidelines and standards |

### Project Management

| Document | Description |
|----------|-------------|
| [Problem Statement](./docs/collaboration/PROBLEM_STATEMENT.md) | Project overview, objectives, and scope |
| [Requirements](./docs/collaboration/REQUIREMENTS.md) | Functional and non-functional requirements |
| [Product Backlog](./docs/collaboration/PRODUCT_BACKLOG.md) | Feature backlog and priorities |
| [User Base](./docs/collaboration/USER_BASE.md) | Target users and personas |

### Development Guides

| Document | Description |
|----------|-------------|
| [Git Workflow](./docs/GIT_WORKFLOW.md) | Branching strategy and contribution guidelines |
| [Quick Start Guide](./docs/QUICK_START.md) | Fast setup for new developers |
| [API Testing Guide](./docs/project-docs/API_TESTING_GUIDE.md) | API testing procedures and examples |

### Feature Documentation

| Document | Description |
|----------|-------------|
| [Disease Prediction](./docs/project-docs/DISEASE_PREDICTION_SERVICE.md) | ML service design and usage |
| [Doctor Recommendation](./docs/project-docs/DOCTOR_RECOMMENDATION_FRONTEND.md) | Doctor search and filtering |

**📖 For complete documentation index, see [docs/README.md](./docs/README.md)**

---

## 🛠️ Tech Stack

### Backend
```
Django 4.2.7          - Web framework
Django REST Framework - API development
PostgreSQL           - Primary database
JWT                  - Authentication
```

### Frontend
```
React 19.0.0         - UI library
Vite 7.2.4           - Build tool
Tailwind CSS 3.4.17  - Styling
React Router         - Navigation
Axios                - HTTP client
```

### AI & ML Services
```
FastAPI              - Web framework
Anthropic Claude     - LLM for chatbot
ChromaDB             - Vector database
scikit-learn         - ML models
sentence-transformers - Text embeddings
```

---

## 💻 Development

### Project Structure

```
SHS/
├── backend/                    # Django REST Framework backend
│   ├── apps/                  # Django applications
│   │   ├── users/            # User management
│   │   ├── doctors/          # Doctor profiles
│   │   ├── appointment/      # Appointment booking
│   │   ├── medical_record/   # Health records
│   │   ├── prescription/     # Prescriptions
│   │   ├── blog/             # Medical blogs
│   │   └── chat/             # Chat history
│   └── README.md            # Backend documentation
│
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   └── services/        # API services
│   └── README.md           # Frontend documentation
│
├── ai-service/                 # AI Chatbot service
│   ├── app/                  # FastAPI application
│   ├── knowledge_base/       # Medical documents
│   ├── chroma_db/           # Vector database
│   └── README.md           # AI service documentation
│
├── disease-prediction-service/ # ML Prediction service
│   ├── app/                  # FastAPI application
│   ├── models/              # Trained ML models
│   └── README.md           # ML service documentation
│
├── docs/                       # Documentation
│   ├── architecture/         # System design
│   ├── collaboration/        # Project management
│   ├── project-docs/        # Feature documentation
│   ├── sprints/             # Sprint documentation
│   └── README.md           # Documentation index
│
├── start-all.sh               # Start all services script
├── stop-all.sh                # Stop all services script
└── README.md                  # This file
```

### Git Workflow

```bash
# Feature development
git checkout develop
git checkout -b feature/feature-name
# ... make changes ...
git commit -m "feat: add feature description"
git push origin feature/feature-name
# Create PR to develop

# Bug fixes
git checkout develop
git checkout -b fix/bug-description
# ... make changes ...
git commit -m "fix: bug description"
git push origin fix/bug-description
# Create PR to develop
```

See [Git Workflow Guide](./docs/GIT_WORKFLOW.md) for details.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'feat: add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure all tests pass

See [Git Workflow Guide](./docs/GIT_WORKFLOW.md) for detailed contribution process.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 📞 Contact & Support

- **Repository**: [github.com/prantic-paul/SHS](https://github.com/prantic-paul/SHS)
- **Issues**: [GitHub Issues](https://github.com/prantic-paul/SHS/issues)

---

## 📊 Project Status

| Sprint | Status | Features |
|--------|--------|----------|
| Sprint 1 | ✅ Complete | Authentication, User Management |
| Sprint 2 | ✅ Complete | Doctor Search, Appointments |
| Sprint 3 | ✅ Complete | AI Chatbot, Disease Prediction |
| Sprint 4 | 🔄 In Progress | Medical Records, Prescriptions |

---

<div align="center">

**Built with ❤️ for better healthcare**

[⬆ back to top](#-smart-health-synchronizer-shs)

</div>
