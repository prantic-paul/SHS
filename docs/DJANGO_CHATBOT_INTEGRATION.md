# 🏥 Medical Chatbot - Django Integration Complete!

## 📚 Overview

Your AI-powered medical chatbot is now fully integrated with your Django backend! Users can ask medical questions through your Django API, which communicates with the FastAPI microservice.

## 🎯 Architecture

```
React Frontend → Django Backend (Port 8000) → FastAPI Microservice (Port 8001) → Pinecone Vector DB
                      ↓
                 PostgreSQL (Chat History)
```

## 🔧 Setup Steps

### 1. Install Dependencies

```bash
cd /home/prantic/SHS/backend
source venv/bin/activate
pip install requests==2.31.0
```

### 2. Run Migrations

```bash
cd /home/prantic/SHS/backend
python manage.py makemigrations chat
python manage.py migrate
```

### 3. Start Both Services

**Terminal 1 - FastAPI Microservice:**
```bash
cd /home/prantic/SHS/ai-service
/home/prantic/SHS/ai-service/venv/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 - Django Backend:**
```bash
cd /home/prantic/SHS/backend
python manage.py runserver
```

## 📡 API Endpoints

### 1. Chat with AI Bot
**POST** `/api/v1/chat/medical/`

Ask a medical question and get AI-powered answer with sources.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "question": "What is diabetes and how to manage it?"
}
```

**Response:**
```json
{
  "question": "What is diabetes and how to manage it?",
  "answer": "Diabetes is a chronic condition where the body cannot properly process blood sugar. Management includes monitoring blood glucose levels, maintaining a healthy diet, regular exercise, and medication as prescribed by your doctor.",
  "sources": [
    {
      "content": "Diabetes mellitus is a group of metabolic diseases...",
      "source": "data/Medical_book.pdf"
    }
  ]
}
```

### 2. Get Chat History
**GET** `/api/v1/chat/history/`

Retrieve chat history for the authenticated user.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters:**
- `limit` (optional): Number of messages to retrieve (default: 20)

**Response:**
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "user": 2,
      "username": "john_doe",
      "question": "What is diabetes?",
      "answer": "Diabetes is...",
      "sources": [...],
      "created_at": "2025-12-28T10:30:00Z"
    }
  ]
}
```

### 3. Clear Chat History
**DELETE** `/api/v1/chat/history/clear/`

Delete all chat messages for the authenticated user.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "message": "Deleted 5 chat messages",
  "deleted_count": 5
}
```

### 4. Health Check
**GET** `/api/v1/chat/health/`

Check if AI service is available (no authentication required).

**Response:**
```json
{
  "status": "healthy",
  "rag_system": "ready",
  "index_name": "medical-chatbot"
}
```

## 🎨 React Frontend Integration

### Setup Axios Instance

```javascript
// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Create Chat Service

```javascript
// src/services/chatService.js
import api from '../api/axios';

export const chatService = {
  // Send a question to the chatbot
  askQuestion: async (question) => {
    const response = await api.post('/chat/medical/', { question });
    return response.data;
  },

  // Get chat history
  getChatHistory: async (limit = 20) => {
    const response = await api.get(`/chat/history/?limit=${limit}`);
    return response.data;
  },

  // Clear chat history
  clearHistory: async () => {
    const response = await api.delete('/chat/history/clear/');
    return response.data;
  },

  // Check if AI service is available
  checkHealth: async () => {
    const response = await api.get('/chat/health/');
    return response.data;
  },
};
```

### Create Chat Component

```javascript
// src/components/MedicalChatbot.jsx
import React, { useState, useEffect } from 'react';
import { chatService } from '../services/chatService';

const MedicalChatbot = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load chat history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await chatService.getChatHistory(10);
      setMessages(data.results);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await chatService.askQuestion(question);
      
      // Add to messages
      setMessages((prev) => [
        {
          question: response.question,
          answer: response.answer,
          sources: response.sources,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      
      setQuestion('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medical-chatbot">
      <h2>Medical Chatbot</h2>
      
      {/* Chat Form */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a medical question..."
          rows={3}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Asking...' : 'Ask Question'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {/* Chat Messages */}
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <div className="question">
              <strong>You:</strong> {msg.question}
            </div>
            <div className="answer">
              <strong>AI Doctor:</strong> {msg.answer}
            </div>
            {msg.sources && msg.sources.length > 0 && (
              <div className="sources">
                <strong>Sources:</strong>
                {msg.sources.map((source, i) => (
                  <div key={i} className="source">
                    <small>{source.source}</small>
                  </div>
                ))}
              </div>
            )}
            <div className="timestamp">
              {new Date(msg.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalChatbot;
```

### Example CSS

```css
/* src/components/MedicalChatbot.css */
.medical-chatbot {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.medical-chatbot form {
  margin-bottom: 20px;
}

.medical-chatbot textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.medical-chatbot button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.medical-chatbot button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  padding: 10px;
  background-color: #fee;
  color: #c00;
  border-radius: 4px;
  margin-bottom: 10px;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message {
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.question {
  margin-bottom: 10px;
  color: #333;
}

.answer {
  margin-bottom: 10px;
  color: #555;
}

.sources {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  font-size: 12px;
}

.source {
  margin-top: 5px;
  color: #666;
}

.timestamp {
  margin-top: 10px;
  font-size: 11px;
  color: #999;
}
```

## 🧪 Testing with cURL

### Test Health Check
```bash
curl http://localhost:8000/api/v1/chat/health/
```

### Test Chat (with authentication)
```bash
# First, login to get token
TOKEN=$(curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}' \
  | jq -r '.access')

# Then ask a question
curl -X POST http://localhost:8000/api/v1/chat/medical/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question": "What is diabetes?"}'
```

### Test Chat History
```bash
curl http://localhost:8000/api/v1/chat/history/ \
  -H "Authorization: Bearer $TOKEN"
```

## 📊 Database Schema

### ChatMessage Model

| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key |
| user | ForeignKey | User who asked the question |
| question | TextField | User's medical question |
| answer | TextField | AI-generated answer |
| sources | JSONField | Source documents (array) |
| created_at | DateTime | Timestamp |

## 🔒 Security Notes

1. **Authentication**: All chat endpoints (except health check) require JWT authentication
2. **Rate Limiting**: Consider adding rate limiting for production
3. **Input Validation**: Questions are validated for length and content
4. **API Keys**: FastAPI microservice API keys are stored in `.env` file

## 🐛 Troubleshooting

### Issue: "AI service is unavailable"
**Solution:** Make sure FastAPI microservice is running on port 8001

### Issue: "401 Unauthorized"
**Solution:** Include valid JWT token in Authorization header

### Issue: "503 Service Unavailable"
**Solution:** Check if Pinecone index exists and FastAPI service is healthy

## 🎯 Next Steps

1. ✅ Run migrations: `python manage.py migrate`
2. ✅ Start FastAPI service (port 8001)
3. ✅ Start Django service (port 8000)
4. ✅ Test health endpoint
5. ✅ Integrate chat component in your React frontend
6. ✅ Add error handling and loading states
7. ✅ Style the chat interface
8. ✅ Add rate limiting for production

## 📚 API Summary

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/v1/chat/medical/` | POST | ✅ Yes | Ask a medical question |
| `/api/v1/chat/history/` | GET | ✅ Yes | Get chat history |
| `/api/v1/chat/history/clear/` | DELETE | ✅ Yes | Clear chat history |
| `/api/v1/chat/health/` | GET | ❌ No | Check AI service health |

---

**Your medical chatbot is ready for users! 🎉**

Users can now ask medical questions through your Django API, which will:
1. Call the FastAPI microservice
2. Get AI-powered answers with source citations
3. Store the conversation in the database
4. Return the response to the user
