# 🚀 Quick Start Guide - Medical AI Chatbot

## ⚡ Start Everything (3 Commands)

### Terminal 1: Django Backend
```bash
cd /home/prantic/SHS/backend
source venv/bin/activate
python manage.py runserver
```
**Status**: Running on http://localhost:8000 ✅

---

### Terminal 2: FastAPI AI Service
```bash
cd /home/prantic/SHS/ai-service
source venv/bin/activate
uvicorn main:app --reload --port 8001
```
**Status**: Running on http://localhost:8001 ✅

---

### Terminal 3: React Frontend
```bash
cd /home/prantic/SHS/frontend
npm run dev
```
**Status**: Running on http://localhost:5174 ✅

---

## 🌐 Access URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:5174 | User interface |
| **Chatbot Page** | http://localhost:5174/chatbot | AI chat interface |
| **Backend API** | http://localhost:8000/api/v1 | REST API |
| **AI Service** | http://localhost:8001 | AI microservice |
| **API Docs** | http://localhost:8001/docs | Swagger UI |

---

## 🎯 How Users Access Chatbot

### Option 1: Navigation Menu
1. Login to account
2. Click **"AI Assistant"** in navbar
3. Start chatting

### Option 2: Floating Button
1. Look for **blue button** (bottom-right corner)
2. Click it from any page
3. Instant access to chatbot

### Option 3: Direct URL
- Navigate to: http://localhost:5174/chatbot
- (Requires login)

---

## 📁 New Files Created

```
frontend/
├── src/
│   ├── pages/
│   │   └── ChatbotPage.jsx           ← Main chatbot UI
│   ├── services/
│   │   └── chatService.js            ← API integration
│   └── components/
│       └── FloatingChatButton.jsx    ← Floating button

CHATBOT_FRONTEND_GUIDE.md             ← User guide
CHATBOT_IMPLEMENTATION_SUMMARY.md     ← Technical summary
CHATBOT_UI_SHOWCASE.md                ← UI documentation
QUICK_START.md                        ← This file
```

---

## 🎨 Key Features

✅ **Professional UI** - Modern, gradient design  
✅ **Real-time Chat** - Instant AI responses  
✅ **Source Citations** - Medical references shown  
✅ **Chat History** - Automatically saved  
✅ **Suggested Questions** - Quick start templates  
✅ **Mobile Responsive** - Works on all devices  
✅ **Floating Button** - Global access  
✅ **JWT Auth** - Secure access control  

---

## 🧪 Quick Test

### 1. Login
- Email: pranticpaulshimul@gmail.com
- Password: zxcvbnm123

### 2. Access Chatbot
- Click "AI Assistant" OR floating button

### 3. Ask a Question
Try: **"What is diabetes?"**

### 4. Check Response
✅ Should show AI answer  
✅ Should show 3 source citations  
✅ Should save to history  

---

## 🐛 Troubleshooting

### Frontend Won't Load?
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### AI Service Not Responding?
```bash
# Check if running
curl http://localhost:8001/health

# Restart if needed
cd ai-service
uvicorn main:app --reload --port 8001
```

### Authentication Error?
```javascript
// Check token in browser console
console.log(localStorage.getItem('access_token'));

// If null, login again
```

---

## 📊 System Status Check

Run this to check all services:

```bash
# Check Django
curl http://localhost:8000/api/v1/auth/health/

# Check FastAPI
curl http://localhost:8001/health

# Check Frontend
curl http://localhost:5174
```

All should return **200 OK** ✅

---

## 🎊 What's Working

✅ FastAPI AI service with RAG  
✅ Django backend with chat endpoints  
✅ PostgreSQL database for history  
✅ React frontend with beautiful UI  
✅ JWT authentication  
✅ Floating chatbot button  
✅ Navigation menu link  
✅ Mobile responsive design  
✅ Source citation display  
✅ Error handling  

---

## 📚 Documentation

- **User Guide**: `CHATBOT_FRONTEND_GUIDE.md`
- **Technical Summary**: `CHATBOT_IMPLEMENTATION_SUMMARY.md`
- **UI Documentation**: `CHATBOT_UI_SHOWCASE.md`
- **This Quick Start**: `QUICK_START.md`

---

## 🎉 You're Ready!

Everything is set up and working. Users can now:
1. ✅ Login to the application
2. ✅ Access the AI chatbot
3. ✅ Ask medical questions
4. ✅ Get AI-powered answers with sources
5. ✅ View and manage chat history

**Enjoy your production-ready medical chatbot! 🏥💬🤖**

---

## 💡 Quick Tips

### For Testing:
- Use Chrome DevTools (F12) to debug
- Check Network tab for API calls
- Look at Console for errors

### For Users:
- Suggested questions help get started
- Sources show where info comes from
- Clear history to start fresh
- Works on mobile too!

### For Development:
- Hot reload enabled (auto-refresh on changes)
- Check `ai-service/main.py` for AI logic
- Check `backend/apps/chat/views.py` for Django logic
- Check `frontend/src/pages/ChatbotPage.jsx` for UI

---

**Last Updated**: December 28, 2025  
**Status**: ✅ Fully Operational  
**Version**: 1.0.0
