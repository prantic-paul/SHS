# 🏥 Smart Health Synchronizer (SHS)

**A comprehensive healthcare management platform that connects patients with verified doctors through intelligent appointment booking, AI-powered medical assistance, and ML-based disease prediction to achieve seamless, accessible, and informed healthcare delivery.**

---

## 📋 Overview

Smart Health Synchronizer (SHS) is a modern, microservices-based healthcare platform designed to bridge the gap between patients and healthcare providers through technology.

- **Problem Summary**: Patients struggle to find the right doctors, access medical advice quickly, and manage appointments efficiently. Traditional healthcare systems lack digital integration, making healthcare delivery fragmented and time-consuming.

- **What the System Does**: SHS provides an intelligent platform where patients can search for verified doctors, book appointments, get AI-powered medical advice, predict diseases based on symptoms, receive doctor recommendations, and maintain digital health records.

- **Who It's For**: 
  - **Patients**: Seeking convenient access to healthcare services and medical information
  - **Doctors**: Managing appointments, patient records, and sharing medical knowledge
  - **Healthcare Administrators**: Overseeing doctor verification and system management

- **Key Technologies**: Django REST Framework, React, FastAPI, Google Gemini AI, Machine Learning (scikit-learn), Pinecone Vector Database, PostgreSQL

---

## 🎯 Problem Statement

### Current Situation
Healthcare delivery faces significant challenges in the digital age:
- Patients cannot easily find doctors specialized in treating specific diseases
- Booking appointments requires phone calls and physical visits
- Access to medical advice is limited to clinic hours
- Health records are scattered across different providers
- Symptom-based doctor discovery is virtually non-existent

### Core Pain Point
**Lack of intelligent, integrated digital healthcare infrastructure** that connects patients with the right healthcare providers while providing instant medical guidance and maintaining comprehensive health records.

### Gap in Existing Solutions
- Traditional systems lack AI-powered symptom analysis
- No intelligent doctor recommendation based on health conditions
- Poor integration between appointment booking and medical assistance
- Limited or no digital health record management
- No real-time medical chatbot assistance

---

## 💡 Solution

Smart Health Synchronizer solves these problems by providing an **intelligent, AI-powered healthcare ecosystem** that combines appointment management, disease prediction, doctor recommendations, and medical assistance in a single, unified platform powered by machine learning and artificial intelligence.

### 🌟 Key Features

#### For Patients 🏥
- **🔍 Smart Doctor Discovery**: Search and filter doctors by specialization, location, rating, and disease expertise
- **📅 Easy Appointment Booking**: Book appointments with verified doctors with CAPTCHA security and instant confirmation
- **🤖 AI Medical Chatbot**: Get instant medical advice from an AI assistant powered by Google Gemini with RAG (Retrieval-Augmented Generation)
- **🧬 Disease Prediction**: Predict potential diseases from symptoms using ML models (90.5% accuracy with Random Forest)
- **👨‍⚕️ Intelligent Doctor Recommendation**: Get personalized doctor recommendations based on predicted diseases
- **📋 Health Record Management**: Access prescriptions, medical history, and appointment records in one place
- **⭐ Doctor Ratings & Reviews**: Rate and review doctors to help other patients make informed decisions

#### For Doctors 👨‍⚕️
- **📊 Comprehensive Dashboard**: View today's appointments, upcoming schedules, and all requests in one place
- **💊 Digital Prescription System**: Create and manage prescriptions with vital signs, diagnosis, and medications
- **📝 Medical Blog Publishing**: Share health knowledge, medical tips, and awareness content
- **🏆 Profile Management**: Showcase qualifications, specializations, experience, and disease treatment expertise
- **👥 Patient Management**: Access patient medical history and appointment records
- **📈 Rating System**: Receive ratings and feedback from patients

#### For Administrators 🔧
- **✅ Doctor Verification**: Manual verification system for doctor licenses and qualifications
- **👤 User Management**: Manage patient and doctor accounts
- **📢 Content Moderation**: Oversee medical blogs and community content
- **📊 System Monitoring**: Track platform usage and performance metrics

#### AI & ML Capabilities 🤖
- **RAG-Powered Chatbot**: Context-aware medical responses using Retrieval-Augmented Generation with Google Gemini and Pinecone vector database
- **Disease Prediction Models**: Three ML models (Random Forest 90.5%, Decision Tree 87.2%, Logistic Regression 85.8%)
- **132 Symptoms Recognition**: Comprehensive symptom database covering 41 diseases
- **Medical Knowledge Base**: Semantic search across medical documents with source citations
- **Doctor-Disease Mapping**: Intelligent matching of diseases to medical specializations

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              🖥️  CLIENT LAYER                                    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                      React Frontend (Vite 7.2.4)                         │  │
│  │  • Patient Portal  • Doctor Dashboard  • Admin Panel                    │  │
│  │  • Tailwind CSS 3.4  • React Router  • Axios HTTP Client                │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────────────────────┘
                                 │
                                 │ 🔐 REST API (JWT Authentication)
                                 │ 📊 JSON Data Exchange
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          🔧 APPLICATION LAYER                                    │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐   │
│  │              Django Backend (Port 8000) - Django 4.2.7                  │   │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │   │
│  │  │  📦 Core Apps:                                                    │  │   │
│  │  │  • users: Authentication, User Profiles, Doctor Info             │  │   │
│  │  │  • doctors: Search, Ratings, Recommendations, Verification       │  │   │
│  │  │  • appointment: Booking System, Dashboard, Auto-cleanup          │  │   │
│  │  │  • chat: AI Chat History Storage                                 │  │   │
│  │  │  • prescription: Medical Records, Vital Signs                    │  │   │
│  │  │  • blog: Content Management, Medical Articles                    │  │   │
│  │  │  • medical_record: Patient History Management                    │  │   │
│  │  └──────────────────────────────────────────────────────────────────┘  │   │
│  │  • Django REST Framework 3.14  • JWT Auth  • CORS Headers           │   │
│  └────────────────────────────────────────────────────────────────────────┘   │
└──────────────────┬─────────────────────────────────┬───────────────────────────┘
                   │                                 │
                   │ 🔗 HTTP REST API                │ 🔗 HTTP REST API
                   │                                 │
                   ▼                                 ▼
    ┌──────────────────────────────┐    ┌──────────────────────────────┐
    │   🤖 AI Service (Port 8001)  │    │  🧬 ML Service (Port 8002)   │
    │      FastAPI 0.108.0         │    │      FastAPI 0.116.2         │
    │  ┌────────────────────────┐  │    │  ┌────────────────────────┐  │
    │  │  RAG System:           │  │    │  │  Disease Prediction:   │  │
    │  │  • Google Gemini LLM   │  │    │  │  • Random Forest 90.5% │  │
    │  │  • LangChain Pipeline  │  │    │  │  • Decision Tree 87.2% │  │
    │  │  • Medical Q&A         │  │    │  │  • Logistic Reg 85.8%  │  │
    │  │  • Source Citations    │  │    │  │  • 132 Symptoms        │  │
    │  └────────────────────────┘  │    │  │  • 41 Diseases         │  │
    └──────────────┬───────────────┘    │  │  • Doctor Matching     │  │
                   │                     │  └────────────────────────┘  │
                   ▼                     └───────────────────────────────┘
    ┌──────────────────────────────┐
    │   🗄️  Pinecone Vector DB     │
    │   • Medical Documents        │
    │   • 384-dim Embeddings       │
    │   • Semantic Search          │
    │   • sentence-transformers    │
    └──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          💾 DATA LAYER                                           │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐   │
│  │                    PostgreSQL Database (Port 5432)                      │   │
│  │  📊 Tables:                                                             │   │
│  │  • custom_user            • doctor_information    • appointments        │   │
│  │  • doctor_ratings         • prescriptions         • medical_records    │   │
│  │  • blog_posts             • chat_messages         • comments           │   │
│  └────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Workflow Overview

The system follows a **microservices architecture** where the React frontend communicates with the Django backend for core operations (auth, booking, data management), while the Django backend orchestrates AI and ML services for intelligent features (chatbot responses and disease prediction). All data is persisted in PostgreSQL, while AI services use Pinecone for semantic medical knowledge retrieval.

---

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.0 - UI library for building user interfaces
- **Vite** 7.2.4 - Fast build tool and dev server
- **Tailwind CSS** 3.4 - Utility-first CSS framework
- **React Router DOM** 7.11 - Client-side routing
- **Axios** 1.13.2 - HTTP client for API requests
- **Lucide React** - Icon library

### Backend
- **Django** 4.2.7 - High-level Python web framework
- **Django REST Framework** 3.14.0 - RESTful API toolkit
- **djangorestframework-simplejwt** 5.3.1 - JWT authentication
- **django-cors-headers** 4.3.1 - CORS handling
- **django-filter** 23.5 - Advanced query filtering

### ML / AI Services
- **FastAPI** 0.108.0 / 0.116.2 - Modern Python API framework
- **Google Gemini** (via langchain-google-genai) - Large Language Model
- **LangChain** 0.1.0 - LLM orchestration framework
- **Pinecone** 3.0.0 - Vector database for semantic search
- **sentence-transformers** 3.4.0 - Text embeddings (384-dim)
- **scikit-learn** 1.7.2 - Machine learning library
- **pandas** 2.3.2 - Data manipulation
- **numpy** 2.2.6 - Numerical computing

### Database
- **PostgreSQL** 15+ - Relational database
- **psycopg2-binary** 2.9.9 - PostgreSQL adapter for Python

### Tools & Services
- **Git** - Version control
- **Uvicorn** 0.25.0 - ASGI server for FastAPI
- **python-dotenv** 1.0.0 - Environment variable management
- **drf-spectacular** 0.27.0 - OpenAPI schema generation
- **Requests** 2.31.0 - HTTP library for Python

---

## 🚀 Installation

### Prerequisites

Before running the project, ensure you have the following installed:

- **Python** 3.10 or higher
- **Node.js** 18+ and npm
- **PostgreSQL** 14 or higher
- **Git** for version control

### Required API Keys

- **Google Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Pinecone API Key**: Get from [Pinecone Console](https://www.pinecone.io/)

---

## 💻 Run Locally

Follow these steps to run the project on your local machine:

### Step 1: Clone the Repository

```bash
git clone https://github.com/prantic-paul/SHS.git
cd SHS
```

### Step 2: Setup PostgreSQL Database

```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE shs_db;

# Create user with password
CREATE USER shs_user WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE shs_db TO shs_user;

# Exit
\q
```

### Step 3: Setup Django Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://shs_user:your_password@localhost:5432/shs_db
AI_SERVICE_URL=http://localhost:8001
ML_SERVICE_URL=http://localhost:8002
EOF

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser for admin access
python manage.py createsuperuser

# Start Django server
python manage.py runserver
# Backend runs at http://localhost:8000
```

### Step 4: Setup AI Service (Medical Chatbot)

```bash
# Open new terminal
cd ai-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with API keys
cat > .env << EOF
GOOGLE_API_KEY=your_gemini_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=medical-knowledge
EOF

# Index medical documents (first time only)
python index_documents.py

# Start AI service
uvicorn main:app --reload --port 8001
# AI Service runs at http://localhost:8001
```

### Step 5: Setup Disease Prediction Service

```bash
# Open new terminal
cd disease-prediction-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train ML models (first time only - takes 2-3 minutes)
python train_model.py

# Start ML service
uvicorn main:app --reload --port 8002
# ML Service runs at http://localhost:8002
```

### Step 6: Setup React Frontend

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:8000
EOF

# Start development server
npm run dev
# Frontend runs at http://localhost:5173
```

### Step 7: Access the Application

Once all services are running:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:5173 | Main application interface |
| **Backend API** | http://localhost:8000/api/v1/ | REST API endpoints |
| **Admin Panel** | http://localhost:8000/admin/ | Django admin dashboard |
| **AI Service Docs** | http://localhost:8001/docs | FastAPI auto-generated docs |
| **ML Service Docs** | http://localhost:8002/docs | FastAPI auto-generated docs |

### Step 8: First Steps

1. **Register a Patient Account**: Go to http://localhost:5173/register
2. **Register as Doctor**: Select "Doctor" role during registration
3. **Admin Approval**: Login to admin panel with superuser credentials and approve doctor application
4. **Test Features**:
   - Search and book appointments with doctors
   - Chat with AI medical assistant
   - Try disease prediction → view recommended doctors
   - Doctors can manage appointments and create prescriptions

### Quick Start (Alternative - All Services at Once)

If you want to start all services with one script:

```bash
# Make the script executable
chmod +x start-all.sh

# Run all services
./start-all.sh
```

To stop all services:

```bash
./stop-all.sh
```

---

## 🔮 Future Improvements

### Security Enhancements 🔐
- **Email Verification**: Implement email verification during registration to ensure valid user accounts
- **Two-Factor Authentication (2FA)**: Add optional 2FA for enhanced account security
- **Password Reset via Email**: Secure password recovery mechanism
- **Rate Limiting**: Prevent API abuse with request rate limiting
- **OAuth Integration**: Social login with Google, Facebook, GitHub

### Payment Integration 💳
- **Online Payment Gateway**: Integrate payment systems (Stripe, PayPal, bKash) for appointment fees
- **Subscription Plans**: Premium features for patients (priority booking, extended chat)
- **Doctor Consultation Fees**: Monetization model for video consultations
- **Payment History**: Track and manage transaction records

### Advanced Features 🚀
- **Video Consultation**: Real-time video calls between doctors and patients using WebRTC
- **Real-time Notifications**: Push notifications for appointment reminders and updates
- **Email/SMS Notifications**: Automated reminders for appointments and medication
- **Mobile Application**: Native iOS and Android apps using React Native
- **Telemedicine Integration**: Complete telehealth functionality
- **Lab Test Integration**: Connect with diagnostic labs for test bookings
- **Pharmacy Integration**: Direct prescription fulfillment from partner pharmacies

### AI/ML Enhancements 🤖
- **Medical Image Analysis**: AI-powered diagnosis from X-rays, CT scans, MRIs
- **Personalized Health Insights**: ML-based health trend analysis and predictions
- **Drug Interaction Checker**: Warn about dangerous medication combinations
- **Voice-based Symptom Input**: Natural language processing for hands-free interaction
- **Multi-language Support**: Chatbot support for Bengali, Hindi, and other languages

### Platform Improvements 📊
- **Analytics Dashboard**: Comprehensive insights for doctors and admins
- **Patient Health Timeline**: Visual representation of health journey
- **Appointment History Export**: Download records in PDF format
- **Doctor Availability Calendar**: Advanced scheduling with recurring slots
- **Review Moderation System**: AI-powered fake review detection
- **Performance Optimization**: Caching, CDN integration, database optimization

---

## 👨‍💻 Author

**Prantic Paul**

- 📧 Email: pranticpaulshimul@gmail.com
- 📱 Phone: +880 1739509014
- 💼 LinkedIn: [Prantic Paul](https://www.linkedin.com/in/prantic-paul-80917a28a/details/skills/)
- 🐙 GitHub: [prantic-paul](https://github.com/prantic-paul)

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙏 Acknowledgments

- Google Gemini for providing the powerful LLM API
- Pinecone for vector database services
- The Django and React communities for excellent frameworks
- All contributors and testers who helped improve this project

---

## 📞 Support

For questions, issues, or contributions:

- 📧 **Email**: pranticpaulshimul@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/prantic-paul/SHS/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/prantic-paul/SHS/discussions)

---

<div align="center">

**⭐ If you find this project helpful, please consider giving it a star on GitHub! ⭐**

Made with ❤️ by [Prantic Paul](https://github.com/prantic-paul)

</div>
