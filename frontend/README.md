# ⚛️ SHS Frontend (React + Vite)

## Overview
Modern React frontend for Smart Healthcare System. Built with Vite, Tailwind CSS, and React Router.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend services running

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Configure Environment

Create `.env` file:
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_AI_SERVICE_URL=http://localhost:8001
VITE_DISEASE_PREDICTION_URL=http://localhost:8002

VITE_APP_NAME=Smart Healthcare System
VITE_ENABLE_CHATBOT=true
VITE_ENABLE_CAPTCHA=true
```

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev

# Server at: http://localhost:5174
```

### 5. Build for Production
```bash
npm run build
# Output in dist/
```

---

## 📁 Project Structure
```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── AppointmentBookingModal.jsx
│   │   ├── DoctorDashboard.jsx
│   │   └── ...
│   ├── pages/          # Page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── ...
│   ├── context/        # React Context
│   │   └── AuthContext.jsx
│   ├── services/       # API services
│   │   ├── api.js
│   │   ├── appointmentService.js
│   │   └── ...
│   ├── App.jsx         # Main component
│   └── main.jsx        # Entry point
├── public/             # Static assets
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## ✨ Features

### For Patients
- Register with CAPTCHA security
- Find doctors by specialization
- Book appointments (7-day advance)
- View appointment history
- AI medical chatbot
- Disease prediction

### For Doctors
- Dashboard with 3 sections:
  - Today's appointments
  - Upcoming appointments
  - Prescribed patients
- Create digital prescriptions
- Manage patient queue
- View medical history

---

## 🧪 Testing

```bash
# Run tests
npm run test

# E2E tests
npm run test:e2e
```

---

## 🚢 Production Deployment

### Build
```bash
npm run build
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy with Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/SHS/frontend/dist;
    
    location / {
        try_files $uri /index.html;
    }
}
```

---

## 🐛 Troubleshooting

**Port Already in Use:**
```bash
lsof -i :5174
kill -9 <PID>
# Or use different port
npm run dev -- --port 3000
```

**API Connection Error:**
```bash
# Check backend is running
curl http://localhost:8000/api/v1/

# Verify .env file
cat .env
```

**Build Errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🎨 Customization

### Update Theme
Edit `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {...}
      }
    }
  }
}
```

---

## 📚 Documentation
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

---

**Last Updated:** January 6, 2026
