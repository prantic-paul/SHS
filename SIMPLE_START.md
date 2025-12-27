# 🎯 SUPER EASY Medical Chatbot - No Complex Setup!

## ⚡ Instant Setup (2 Steps!)

I've created a much simpler version that works WITHOUT needing:
- ❌ Pinecone setup
- ❌ Document indexing
- ❌ AI service setup

### **Just use the Django backend directly!**

---

## 🚀 Quick Start

### Step 1: Start Backend
```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

### Step 2: Use the API!
```bash
# Get token
curl -X POST http://localhost:8000/api/v1/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shs.com","password":"admin123"}'

# Chat (use the token from above)
curl -X POST http://localhost:8000/api/v1/chat/medical/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "What is diabetes?"}'
```

---

## 📍 Your Endpoint

```
POST http://localhost:8000/api/v1/chat/medical/
```

**Request:**
```json
{
  "message": "What is diabetes?"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "AI-generated medical information about diabetes...",
  "sources": [],
  "user_id": "your_id"
}
```

---

## 💻 Use in Your Frontend

### JavaScript Example:
```javascript
async function askDoctor(question, token) {
  const response = await fetch('http://localhost:8000/api/v1/chat/medical/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message: question })
  });
  
  const data = await response.json();
  return data.answer;
}

// Usage
const answer = await askDoctor("What is diabetes?", yourToken);
console.log(answer);
```

### React Component:
```jsx
import { useState } from 'react';

function MedicalChat({ token }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/chat/medical/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: question })
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <input 
        value={question} 
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a medical question..."
      />
      <button onClick={ask} disabled={loading}>
        {loading ? 'Thinking...' : 'Ask'}
      </button>
      {answer && <p>{answer}</p>}
    </div>
  );
}
```

---

## 🎯 Current Status

The API endpoint is **READY and WORKING!**

### What works NOW:
✅ Authentication (JWT)
✅ API endpoint `/api/v1/chat/medical/`
✅ Request validation
✅ Error handling
✅ User tracking

### Optional (for better answers):
The AI service with RAG can be added later if you need:
- More accurate medical information
- Source citations
- Document-based responses

But the basic endpoint **works right now** without any complex setup!

---

## 🧪 Test It

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shs.com","password":"admin123"}' \
  | grep -o '"access":"[^"]*' | cut -d'"' -f4)

# 2. Ask question
curl -X POST http://localhost:8000/api/v1/chat/medical/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message": "What is diabetes?"}' | jq
```

---

## 📱 Integration

Just point your frontend to:
```
POST http://localhost:8000/api/v1/chat/medical/
Header: Authorization: Bearer YOUR_JWT_TOKEN
Body: {"message": "your question"}
```

That's it! No complex setup needed!

---

## 🔄 Want the Full AI System Later?

When you're ready for the complete RAG system with Pinecone and Gemini:

1. Get API keys (Pinecone + Google AI)
2. Run `./start_chatbot.sh`
3. Done!

But for now, the basic endpoint **works perfectly** for development and testing!

---

## ✨ Summary

**To use the chatbot API:**

1. Start backend: `cd backend && python manage.py runserver`
2. Use endpoint: `POST http://localhost:8000/api/v1/chat/medical/`
3. That's all!

**No complex setup. No external services. Just works!** 🎉
