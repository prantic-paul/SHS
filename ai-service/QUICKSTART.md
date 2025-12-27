# Quick Start Guide - Medical Chatbot AI Service

## 📋 Step-by-Step Setup

### Step 1: Install Dependencies

```bash
cd ai-service

# Run setup script (Linux/Mac)
chmod +x setup.sh
./setup.sh

# OR manually:
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and add your API keys:
```bash
PINECONE_API_KEY=your_pinecone_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
```

**Get API Keys:**
- **Pinecone**: Sign up at https://www.pinecone.io/ → Get API key from dashboard
- **Google AI**: Get from https://makersuite.google.com/app/apikey

### Step 3: Index Documents (First Time Only)

```bash
# Activate virtual environment if not already active
source venv/bin/activate

# Index documents to Pinecone
python index_documents.py
```

This will:
- Load PDF documents from `data/` directory
- Split them into chunks
- Generate embeddings
- Upload to Pinecone vector database

**Expected Output:**
```
📊 Medical Chatbot - Document Indexing
============================================================

📂 Loading documents from data...
✅ Loaded 1 documents
✂️ Splitting documents into chunks...
✅ Created 150 chunks
📦 Loading embeddings...
🔗 Connecting to Pinecone...
🚀 Indexing documents to Pinecone...
✅ Documents indexed successfully!
```

### Step 4: Start the Service

```bash
# Start the FastAPI service
python main.py

# The service will be available at http://localhost:8001
```

**Expected Output:**
```
🚀 Starting Medical Chatbot AI Service...
🚀 Initializing Medical RAG System...
📦 Loading embedding model...
🔗 Connecting to Pinecone...
🗄️ Loading vector store...
⚙️ Setting up RAG chain...
✅ Medical RAG System initialized successfully!
✅ Service ready!

INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
```

### Step 5: Test the Service

Open a new terminal and run:

```bash
# Activate venv
source venv/bin/activate

# Run test script
python test_service.py
```

OR test with curl:

```bash
# Health check
curl http://localhost:8001/health

# Ask a question
curl -X POST http://localhost:8001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is diabetes?"
  }'
```

## 🔗 Integration with Main Project

### Backend Integration (Django)

1. **Create AI Service Client** (`backend/services/ai_chatbot.py`):

```python
import requests
from django.conf import settings

class AIChatbotService:
    def __init__(self):
        self.base_url = "http://localhost:8001"
    
    def chat(self, message: str, user_id: str = None):
        try:
            response = requests.post(
                f"{self.base_url}/api/chat",
                json={"message": message, "user_id": user_id},
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"error": str(e), "answer": "AI service unavailable"}

chatbot_service = AIChatbotService()
```

2. **Create Django View** (`backend/apps/chat/views.py`):

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from services.ai_chatbot import chatbot_service

class MedicalChatView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        message = request.data.get('message')
        if not message:
            return Response({"error": "Message required"}, status=400)
        
        result = chatbot_service.chat(
            message=message,
            user_id=str(request.user.user_id)
        )
        return Response(result)
```

3. **Add URL Route** (`backend/apps/chat/urls.py`):

```python
from django.urls import path
from .views import MedicalChatView

urlpatterns = [
    path('medical/', MedicalChatView.as_view(), name='medical-chat'),
]
```

4. **Include in main URLs** (`backend/config/urls.py`):

```python
urlpatterns = [
    # ... other patterns
    path('api/v1/chat/', include('apps.chat.urls')),
]
```

### Frontend Integration (React)

1. **Create Service** (`frontend/src/services/chatbotService.js`):

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export const chatbotService = {
  async sendMessage(message) {
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
  }
};
```

2. **Use the service in your component** - See README.md for full component code

3. **Add route** (`frontend/src/App.jsx`):

```javascript
import ChatPage from './pages/ChatPage';

// In your routes:
<Route path="/chat" element={<ChatPage />} />
```

## 🚀 Running Both Services Together

### Terminal 1: Backend (Django)
```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

### Terminal 2: AI Service
```bash
cd ai-service
source venv/bin/activate
python main.py
```

### Terminal 3: Frontend
```bash
cd frontend
npm run dev
```

Now you can access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- AI Service: http://localhost:8001

## 🎯 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Service info |
| `/health` | GET | Health check |
| `/api/chat` | POST | Send message to chatbot |
| `/api/index-documents` | POST | Re-index documents |

## 📝 Example API Requests

### Health Check
```bash
curl http://localhost:8001/health
```

### Chat Request
```bash
curl -X POST http://localhost:8001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the symptoms of diabetes?",
    "user_id": "user123"
  }'
```

### Response
```json
{
  "answer": "Diabetes symptoms include increased thirst, frequent urination, extreme hunger, unexplained weight loss, fatigue, blurred vision, and slow-healing sores...",
  "sources": ["data/Medical_book.pdf"],
  "confidence": null
}
```

## 🔧 Troubleshooting

### Issue: "Service not starting"
**Solution:** 
- Check if API keys are set in `.env`
- Verify port 8001 is not in use: `lsof -i :8001`

### Issue: "Pinecone connection error"
**Solution:**
- Verify API key is correct
- Check internet connection
- Make sure you've run `python index_documents.py` first

### Issue: "Module not found errors"
**Solution:**
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: "No response from chatbot"
**Solution:**
- Check if documents are indexed: `python index_documents.py`
- Verify Google API key is valid
- Check service logs for errors

## 📚 Next Steps

1. ✅ Service is running
2. Add more medical documents to `data/` folder
3. Customize the system prompt in `app/rag_system.py`
4. Implement conversation history
5. Add authentication/authorization
6. Deploy to production

## 🆘 Need Help?

- Check the main README.md for detailed documentation
- Review the code in `app/` directory
- Check service logs for errors
- Test with `python test_service.py`

Happy coding! 🚀
