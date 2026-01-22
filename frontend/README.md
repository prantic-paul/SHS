# 🎨 Frontend – Smart Health Synchronizer

**Modern React-based healthcare platform interface with intelligent features for patients, doctors, and administrators.**

---

## 📋 Overview

The Smart Health Synchronizer frontend is a responsive, user-friendly web application built with React 19 and Vite. It provides seamless interfaces for:

- **Patients** - Search doctors, book appointments, chat with AI assistant, predict diseases, manage health records
- **Doctors** - View appointments, create prescriptions, write medical blogs, manage patient interactions
- **Admins** - Verify doctors, manage users, moderate content, monitor system health

**Key Highlights:**
- 🎨 Modern UI with Tailwind CSS
- ⚡ Lightning-fast with Vite build tool
- 🔐 Secure JWT authentication
- 📱 Fully responsive design
- 🤖 Integrated AI medical assistant
- 🧬 Real-time disease prediction
- 📊 Interactive dashboards

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI library for building components |
| **Vite** | 7.2.4 | Fast build tool and dev server |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| **React Router** | 7.1.1 | Client-side routing |
| **Axios** | 1.7.9 | HTTP client for API calls |
| **Lucide React** | Latest | Icon library |
| **React Hook Form** | Latest | Form validation |

---

## ✨ Features

### For Patients 👤
- ✅ **User Registration & Login** - Secure authentication with JWT
- 🔍 **Doctor Search & Filter** - Find doctors by specialty, location, rating
- 📅 **Appointment Booking** - Book, view, and manage appointments
- 💬 **AI Medical Assistant** - Chat with RAG-powered AI for medical advice
- 🧬 **Disease Prediction** - Input symptoms to predict diseases with 94.3% accuracy
- 👨‍⚕️ **Doctor Recommendations** - Get doctor suggestions based on predicted disease
- 📋 **Medical History** - View prescriptions and health records
- 👤 **Profile Management** - Update personal information and preferences

### For Doctors 👨‍⚕️
- 📊 **Dashboard** - Overview of appointments, patients, and activities
- 📅 **Appointment Management** - View today's appointments, upcoming schedule
- 💊 **Prescription System** - Create detailed prescriptions with dosage, tests
- 📝 **Blog Writing** - Publish medical articles and health tips
- 👥 **Patient Information** - Access patient history and vital signs
- ✅ **Appointment Actions** - Mark appointments as completed or cancelled
- 👤 **Profile Management** - Update credentials, specialization, experience

### For Admins 🔐
- ✅ **Doctor Verification** - Approve or reject doctor applications
- 👥 **User Management** - View and manage all users
- 📝 **Content Moderation** - Monitor and manage blogs
- 📊 **System Monitoring** - Track platform usage and metrics

---

## 📸 Screenshots / UI Preview

### Patient Portal

#### Home Page
![Home Page](../Screenshots/homePage.png)
*Landing page with doctor search and key features*

#### Doctor Search & Profile
<table>
<tr>
<td width="50%"><img src="../Screenshots/doctorSearch.png" alt="Doctor Search"/><br/><i>Advanced doctor search with filters</i></td>
<td width="50%"><img src="../Screenshots/doctorProfile.png" alt="Doctor Profile"/><br/><i>Detailed doctor profile with ratings</i></td>
</tr>
</table>

#### Appointment Booking
<table>
<tr>
<td width="50%"><img src="../Screenshots/appointmentBook1.png" alt="Appointment Booking 1"/><br/><i>Select doctor and date</i></td>
<td width="50%"><img src="../Screenshots/appointBook2.png" alt="Appointment Booking 2"/><br/><i>Confirm appointment details</i></td>
</tr>
</table>

#### AI Medical Assistant
![AI Assistant](../Screenshots/aiAssistant.png)
*RAG-powered AI chatbot providing medical advice*

#### Disease Prediction
![Doctor Recommendation](../Screenshots/doctorRecommendation.png)
*ML-based disease prediction with doctor recommendations*

#### User Dashboard
<table>
<tr>
<td width="50%"><img src="../Screenshots/userAppointmentDash.png" alt="User Dashboard"/><br/><i>Patient appointment dashboard</i></td>
<td width="50%"><img src="../Screenshots/userProfile.png" alt="User Profile"/><br/><i>User profile management</i></td>
</tr>
</table>

### Doctor Portal

#### Doctor Dashboard
![Appointment Dashboard](../Screenshots/appointmentDash.png)
*Doctor's appointment management dashboard*

#### Prescription & Medical Records
<table>
<tr>
<td width="50%"><img src="../Screenshots/prescriptionForm.png" alt="Prescription Form"/><br/><i>Create detailed prescriptions</i></td>
<td width="50%"><img src="../Screenshots/medicalHistory.png" alt="Medical History"/><br/><i>View patient medical history</i></td>
</tr>
</table>

#### Blog Writing
![Blog Write](../Screenshots/blogWrite.png)
*Rich text editor for publishing medical blogs*

### Admin Panel

#### Doctor Verification
<table>
<tr>
<td width="50%"><img src="../Screenshots/doctorApplicationForm.png" alt="Doctor Application"/><br/><i>Doctor registration form</i></td>
<td width="50%"><img src="../Screenshots/adminApproval.png" alt="Admin Approval"/><br/><i>Admin verification dashboard</i></td>
</tr>
</table>

### Authentication

<table>
<tr>
<td width="50%"><img src="../Screenshots/registrationForm.png" alt="Registration"/><br/><i>User registration</i></td>
<td width="50%"><img src="../Screenshots/LoginForm.png" alt="Login"/><br/><i>Secure login</i></td>
</tr>
</table>

---

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, icons, static files
│   ├── components/      # Reusable UI components
│   │   ├── layout/      # Layout components (Header, Footer, Sidebar)
│   │   ├── common/      # Common components (Button, Card, Modal)
│   │   ├── auth/        # Authentication components
│   │   ├── doctor/      # Doctor-specific components
│   │   ├── patient/     # Patient-specific components
│   │   └── admin/       # Admin-specific components
│   ├── contexts/        # React Context for state management
│   │   └── AuthContext.jsx  # Authentication state
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── DoctorSearch.jsx
│   │   ├── AppointmentBooking.jsx
│   │   ├── AIChatbot.jsx
│   │   ├── DiseasePrediction.jsx
│   │   ├── DoctorDashboard.jsx
│   │   ├── AdminPanel.jsx
│   │   └── ...
│   ├── services/        # API service modules
│   │   ├── api.js       # Axios instance configuration
│   │   ├── authService.js
│   │   ├── doctorService.js
│   │   ├── appointmentService.js
│   │   ├── aiService.js
│   │   └── mlService.js
│   ├── utils/           # Utility functions
│   ├── hooks/           # Custom React hooks
│   ├── App.jsx          # Main App component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables
├── .env.example         # Example environment file
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── package.json         # Dependencies
└── README.md            # This file
```

---

## ⚙️ Environment Variables

Create a `.env` file in the frontend root directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000/api/v1

# AI Service URL (optional - backend proxies this)
VITE_AI_SERVICE_URL=http://localhost:8001

# ML Service URL (optional - backend proxies this)
VITE_ML_SERVICE_URL=http://localhost:8002

# App Configuration
VITE_APP_NAME=Smart Health Synchronizer
VITE_APP_VERSION=1.0.0
```

---

## 🚀 Setup & Run Locally

### Prerequisites
- Node.js 18+ and npm

### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your backend URL
nano .env
```

### Step 4: Start Development Server
```bash
npm run dev
```

The application will start at `http://localhost:5173`

### Step 5: Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend must be running:** http://localhost:8000

---

## 🔌 API Integration

The frontend communicates with the backend through Axios. All API calls are centralized in the `services/` directory.

### API Service Configuration (`services/api.js`)

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

### Example Service (`services/doctorService.js`)

```javascript
import API from './api';

export const searchDoctors = async (params) => {
  const response = await API.get('/doctors/search', { params });
  return response.data;
};

export const getDoctorById = async (id) => {
  const response = await API.get(`/doctors/${id}`);
  return response.data;
};
```

### API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/register` | POST | User registration |
| `/auth/login` | POST | User login |
| `/doctors/search` | GET | Search doctors |
| `/doctors/:id` | GET | Get doctor details |
| `/appointments/` | POST | Book appointment |
| `/appointments/my-appointments` | GET | Get user appointments |
| `/chat/send-message` | POST | AI chatbot |
| `/predict/disease` | POST | Disease prediction |
| `/prescriptions/` | POST | Create prescription |
| `/blogs/` | GET/POST | Blog operations |

---

##  Future Improvements

- [ ] **Real-time Notifications** - WebSocket for appointment updates
- [ ] **Video Consultation** - WebRTC integration for telemedicine
- [ ] **Offline Support** - PWA with service workers
- [ ] **Multi-language Support** - i18n internationalization
- [ ] **Dark Mode** - Theme switcher
- [ ] **Advanced Analytics** - Patient health trends
- [ ] **Payment Integration** - Online appointment payments
- [ ] **Mobile App** - React Native version
- [ ] **Voice Commands** - Speech recognition for accessibility
- [ ] **Medical Records Upload** - File upload and management
- [ ] **Appointment Reminders** - Email/SMS notifications
- [ ] **Doctor Reviews** - Patient feedback system

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
