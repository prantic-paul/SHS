# 📋 Integration Checklist

## Phase 1: Setup AI Service ✅

### 1.1 Install Dependencies
```bash
cd ai-service
chmod +x setup.sh
./setup.sh
source venv/bin/activate
```

- [ ] Virtual environment created
- [ ] Dependencies installed
- [ ] No installation errors

### 1.2 Configure Environment
```bash
cp .env.example .env
# Edit .env with your API keys
```

- [ ] `.env` file created
- [ ] `PINECONE_API_KEY` set
- [ ] `GOOGLE_API_KEY` set

### 1.3 Index Documents
```bash
python index_documents.py
```

- [ ] Documents loaded successfully
- [ ] Chunks created
- [ ] Pinecone index created
- [ ] Documents uploaded to Pinecone

### 1.4 Test AI Service
```bash
# Terminal 1: Start service
python main.py

# Terminal 2: Run tests
python test_service.py
```

- [ ] Service starts without errors
- [ ] Health check passes
- [ ] Chat endpoint responds
- [ ] Responses are relevant

---

## Phase 2: Backend Integration (Django)

### 2.1 Create Chat App
```bash
cd backend
source venv/bin/activate
python manage.py startapp chat
```

- [ ] Chat app created
- [ ] App added to `INSTALLED_APPS`

### 2.2 Create Services Directory
```bash
mkdir -p backend/services
touch backend/services/__init__.py
```

Create `backend/services/ai_chatbot.py`:

```python
import requests
from django.conf import settings

class AIChatbotService:
    def __init__(self):
        self.base_url = getattr(settings, 'AI_SERVICE_URL', 'http://localhost:8001')
    
    def chat(self, message: str, user_id: str = None):
        try:
            response = requests.post(
                f"{self.base_url}/api/chat",
                json={"message": message, "user_id": user_id},
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            return {
                "error": str(e),
                "answer": "Sorry, the AI service is currently unavailable. Please try again later."
            }
    
    def health_check(self):
        try:
            response = requests.get(f"{self.base_url}/health", timeout=5)
            return response.json()
        except:
            return {"status": "unavailable"}

chatbot_service = AIChatbotService()
```

- [ ] Services directory created
- [ ] `ai_chatbot.py` created
- [ ] Service class implemented

### 2.3 Add Settings
Add to `backend/config/settings.py`:

```python
# AI Service Configuration
AI_SERVICE_URL = env('AI_SERVICE_URL', default='http://localhost:8001')
AI_SERVICE_ENABLED = env.bool('AI_SERVICE_ENABLED', default=True)
```

- [ ] Settings added
- [ ] Environment variable configured

### 2.4 Create Chat Views
Create `backend/apps/chat/views.py`:

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from services.ai_chatbot import chatbot_service

class MedicalChatView(APIView):
    """
    Medical chatbot endpoint
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Send message to medical chatbot"""
        message = request.data.get('message')
        
        if not message:
            return Response(
                {"error": "Message is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Call AI service
        result = chatbot_service.chat(
            message=message,
            user_id=str(request.user.user_id)
        )
        
        return Response(result)

class ChatHealthView(APIView):
    """Check AI service health"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        health = chatbot_service.health_check()
        return Response(health)
```

- [ ] Views created
- [ ] Authentication configured
- [ ] Error handling implemented

### 2.5 Create URLs
Create `backend/apps/chat/urls.py`:

```python
from django.urls import path
from .views import MedicalChatView, ChatHealthView

app_name = 'chat'

urlpatterns = [
    path('medical/', MedicalChatView.as_view(), name='medical-chat'),
    path('health/', ChatHealthView.as_view(), name='chat-health'),
]
```

Update `backend/config/urls.py`:

```python
urlpatterns = [
    # ... existing patterns
    path('api/v1/chat/', include('apps.chat.urls')),
]
```

- [ ] Chat URLs created
- [ ] URLs included in main config
- [ ] Routes tested with curl/Postman

### 2.6 Test Backend Integration
```bash
# Terminal 1: AI Service
cd ai-service && python main.py

# Terminal 2: Django Backend
cd backend && python manage.py runserver

# Terminal 3: Test
curl -X POST http://localhost:8000/api/v1/chat/medical/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "What is diabetes?"}'
```

- [ ] Backend receives requests
- [ ] AI service called successfully
- [ ] Response returned to client

---

## Phase 3: Frontend Integration (React)

### 3.1 Create Chatbot Service
Create `frontend/src/services/chatbotService.js`:

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const chatbotService = {
  /**
   * Send message to medical chatbot
   */
  async sendMessage(message) {
    try {
      const response = await axios.post(
        `${API_URL}/chat/medical/`,
        { message },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Chat error:', error);
      throw error.response?.data || error;
    }
  },
  
  /**
   * Check AI service health
   */
  async checkHealth() {
    try {
      const response = await axios.get(
        `${API_URL}/chat/health/`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return { status: 'unavailable' };
    }
  }
};
```

- [ ] Service file created
- [ ] API URL configured
- [ ] Authentication headers added

### 3.2 Create Chatbot Component
Create `frontend/src/components/MedicalChatbot.jsx` (see QUICKSTART.md for full code)

- [ ] Component created
- [ ] State management implemented
- [ ] UI styled
- [ ] Send message function working
- [ ] Message history displayed

### 3.3 Create Chat Page
Create `frontend/src/pages/ChatPage.jsx`:

```javascript
import MedicalChatbot from '../components/MedicalChatbot';
import { Helmet } from 'react-helmet-async';

const ChatPage = () => {
  return (
    <>
      <Helmet>
        <title>Medical Assistant - Smart Health Synchronizer</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Medical Assistant
          </h1>
          <p className="text-gray-600">
            Ask medical questions and get AI-powered answers based on medical literature
          </p>
        </div>
        
        <MedicalChatbot />
        
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> This AI assistant provides general medical information 
            and should not be used as a substitute for professional medical advice, diagnosis, 
            or treatment. Always consult with a qualified healthcare provider.
          </p>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
```

- [ ] Page created
- [ ] Component imported
- [ ] Disclaimer added

### 3.4 Add Route
Update `frontend/src/App.jsx`:

```javascript
import ChatPage from './pages/ChatPage';

// In routes:
<Route path="/chat" element={<ChatPage />} />
```

- [ ] Route added
- [ ] Navigation link added (if needed)

### 3.5 Test Frontend
```bash
cd frontend
npm run dev
```

Visit: `http://localhost:5173/chat`

- [ ] Chat page loads
- [ ] Can type message
- [ ] Send button works
- [ ] Receives response
- [ ] Messages display correctly
- [ ] Loading state works

---

## Phase 4: End-to-End Testing

### 4.1 Full Stack Test
Run all services:

```bash
# Terminal 1: AI Service
cd ai-service && source venv/bin/activate && python main.py

# Terminal 2: Backend
cd backend && source venv/bin/activate && python manage.py runserver

# Terminal 3: Frontend
cd frontend && npm run dev
```

- [ ] All services running
- [ ] No port conflicts
- [ ] Services communicate

### 4.2 Functional Tests
- [ ] User can access chat page
- [ ] User can send message
- [ ] AI responds within 5 seconds
- [ ] Response is relevant
- [ ] Conversation history works
- [ ] Error handling works
- [ ] Loading states display

### 4.3 Edge Cases
- [ ] Empty message handled
- [ ] Very long message handled
- [ ] AI service down (shows error)
- [ ] Network timeout handled
- [ ] Invalid token handled
- [ ] Concurrent requests work

---

## Phase 5: Production Deployment

### 5.1 Environment Variables
- [ ] Production API keys configured
- [ ] URLs updated for production
- [ ] Debug mode disabled
- [ ] CORS configured correctly

### 5.2 Security
- [ ] API keys not in code
- [ ] HTTPS enabled
- [ ] Rate limiting added
- [ ] Input sanitization
- [ ] SQL injection prevention

### 5.3 Monitoring
- [ ] Logging configured
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring

### 5.4 Documentation
- [ ] API documentation updated
- [ ] User guide created
- [ ] Admin documentation
- [ ] Troubleshooting guide

---

## 📊 Success Criteria

✅ **AI Service**
- Responds to queries in < 5 seconds
- 95%+ uptime
- Relevant responses

✅ **Backend Integration**
- Successful API calls
- Proper error handling
- Authentication working

✅ **Frontend**
- Smooth user experience
- Responsive design
- Clear error messages

✅ **Overall System**
- End-to-end flow works
- All tests passing
- Ready for production

---

## 🆘 Troubleshooting

### AI Service Not Starting
1. Check `.env` file exists
2. Verify API keys are valid
3. Check port 8001 is free
4. Review logs for errors

### Backend Cannot Connect
1. Verify AI service is running
2. Check `AI_SERVICE_URL` setting
3. Test with curl directly
4. Check firewall/network

### Frontend Issues
1. Check authentication token
2. Verify API URL is correct
3. Check browser console
4. Test backend endpoint directly

---

## 📞 Support

- Check README.md for detailed docs
- Review QUICKSTART.md for setup
- Check ARCHITECTURE.md for system design
- Review code comments
- Test with `test_service.py`

---

**Last Updated:** December 27, 2025
**Version:** 1.0.0
