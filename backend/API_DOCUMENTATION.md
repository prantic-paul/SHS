# 🎉 Medical Chatbot API - Ready to Use!

## 🚀 Your API Endpoint is Ready!

### **Endpoint URL**
```
POST http://localhost:8000/api/v1/chat/medical/
```

---

## 📋 How to Use

### **1. Authentication Required**
You need a valid JWT token. Get it by logging in:

```bash
# Login to get token
curl -X POST http://localhost:8000/api/v1/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your_email@example.com",
    "password": "your_password"
  }'

# Response will contain:
{
  "access": "your_jwt_token_here",
  "refresh": "refresh_token_here"
}
```

### **2. Send Message to Chatbot**

#### **Basic Request**
```bash
curl -X POST http://localhost:8000/api/v1/chat/medical/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "What is diabetes?"
  }'
```

#### **With Conversation History**
```bash
curl -X POST http://localhost:8000/api/v1/chat/medical/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "What are the treatment options?",
    "conversation_history": [
      {
        "role": "user",
        "content": "What is diabetes?"
      },
      {
        "role": "assistant",
        "content": "Diabetes is a chronic condition..."
      }
    ]
  }'
```

---

## 📊 Request Format

### **Required Fields**
```json
{
  "message": "Your medical question here"
}
```

### **Optional Fields**
```json
{
  "message": "Your question",
  "conversation_history": [
    {
      "role": "user",
      "content": "Previous question"
    },
    {
      "role": "assistant",
      "content": "Previous answer"
    }
  ]
}
```

---

## ✅ Success Response

### **Status Code:** `200 OK`

```json
{
  "success": true,
  "answer": "Diabetes is a chronic metabolic disorder characterized by elevated blood sugar levels. It occurs when the body either doesn't produce enough insulin or cannot effectively use the insulin it produces. Common symptoms include increased thirst, frequent urination, and fatigue.",
  "sources": [
    "data/Medical_book.pdf"
  ],
  "confidence": null,
  "user_id": "user_uuid_here"
}
```

### **Fields Explanation**
- `success` (boolean): Request was successful
- `answer` (string): AI-generated response
- `sources` (array): PDF files used as context
- `confidence` (float|null): Confidence score (future feature)
- `user_id` (string): Your user ID

---

## ❌ Error Responses

### **1. Missing Message**
**Status:** `400 Bad Request`
```json
{
  "success": false,
  "error": "Message is required"
}
```

### **2. Empty Message**
**Status:** `400 Bad Request`
```json
{
  "success": false,
  "error": "Message must be a non-empty string"
}
```

### **3. AI Service Unavailable**
**Status:** `503 Service Unavailable`
```json
{
  "success": false,
  "error": "connection_error",
  "answer": "Cannot connect to the AI service. Please make sure the AI service is running.",
  "sources": [],
  "confidence": null
}
```

### **4. Unauthorized**
**Status:** `401 Unauthorized`
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### **5. Invalid Token**
**Status:** `401 Unauthorized`
```json
{
  "detail": "Given token not valid for any token type"
}
```

---

## 🔍 Health Check Endpoint

Check if AI service is available:

### **Endpoint**
```
GET http://localhost:8000/api/v1/chat/health/
```

### **Request**
```bash
curl -X GET http://localhost:8000/api/v1/chat/health/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Success Response**
```json
{
  "success": true,
  "health": {
    "status": "healthy",
    "service": "medical-chatbot-ai",
    "pinecone_connected": true,
    "embedding_model_loaded": true
  }
}
```

### **Unavailable Response**
```json
{
  "success": false,
  "error": "Connection refused",
  "health": {
    "status": "unavailable"
  }
}
```

---

## 📝 Complete Example (JavaScript/TypeScript)

### **Using Axios**
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

// Store your token after login
const token = localStorage.getItem('access_token');

// Send message to chatbot
async function askMedicalQuestion(message) {
  try {
    const response = await axios.post(
      `${API_URL}/chat/medical/`,
      { message },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Answer:', response.data.answer);
    console.log('Sources:', response.data.sources);
    return response.data;
    
  } catch (error) {
    if (error.response) {
      // Server responded with error
      console.error('Error:', error.response.data);
    } else if (error.request) {
      // No response received
      console.error('No response from server');
    } else {
      // Request setup error
      console.error('Error:', error.message);
    }
    throw error;
  }
}

// Usage
askMedicalQuestion("What are the symptoms of hypertension?")
  .then(data => {
    console.log('Success!', data);
  })
  .catch(error => {
    console.error('Failed:', error);
  });
```

### **Using Fetch**
```javascript
async function askQuestion(message, token) {
  const response = await fetch('http://localhost:8000/api/v1/chat/medical/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

// Usage
askQuestion("What is asthma?", "your_jwt_token")
  .then(data => console.log(data.answer))
  .catch(error => console.error(error));
```

---

## 🔧 Setup Requirements

### **Before Using the API**

1. **Start AI Service** (Port 8001)
```bash
cd ai-service
source venv/bin/activate
python main.py
```

2. **Start Django Backend** (Port 8000)
```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

3. **Ensure AI Service is Indexed**
```bash
cd ai-service
python index_documents.py
```

---

## 🎯 Testing the Complete Flow

### **Step 1: Login**
```bash
TOKEN=$(curl -X POST http://localhost:8000/api/v1/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  | jq -r '.access')

echo "Token: $TOKEN"
```

### **Step 2: Check Health**
```bash
curl -X GET http://localhost:8000/api/v1/chat/health/ \
  -H "Authorization: Bearer $TOKEN" | jq
```

### **Step 3: Ask Question**
```bash
curl -X POST http://localhost:8000/api/v1/chat/medical/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "message": "What is diabetes and how is it treated?"
  }' | jq
```

---

## 🐛 Troubleshooting

### **Problem: "Cannot connect to AI service"**
**Solution:**
```bash
# Check if AI service is running
curl http://localhost:8001/health

# If not running, start it:
cd ai-service
source venv/bin/activate
python main.py
```

### **Problem: "Authentication credentials not provided"**
**Solution:**
- Make sure you include the `Authorization` header
- Token format: `Bearer YOUR_TOKEN` (with space)
- Check token is not expired

### **Problem: "Message is required"**
**Solution:**
- Ensure your request has a `message` field
- Message cannot be empty or just whitespace
- Check JSON formatting is correct

### **Problem: Slow responses**
**Normal:** First request may take 3-5 seconds (loading models)
**If always slow:**
- Check AI service logs for errors
- Verify Pinecone connection
- Check Google API key is valid

---

## 📚 API Endpoints Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/v1/chat/medical/` | POST | ✅ Required | Send message to chatbot |
| `/api/v1/chat/health/` | GET | ✅ Required | Check AI service health |
| `/api/v1/login/` | POST | ❌ Not required | Get JWT token |

---

## 🎉 You're Ready!

Your medical chatbot API is now fully functional and ready to use!

### **Quick Start:**
1. ✅ Backend running on port 8000
2. ✅ AI service running on port 8001
3. ✅ Login to get JWT token
4. ✅ POST to `/api/v1/chat/medical/` with your question
5. ✅ Get AI-powered medical information!

### **Example Flow:**
```
User Login → Get Token → Ask Question → Receive AI Answer
```

### **Integration:**
- Frontend: Use the JavaScript examples above
- Mobile: Same REST API endpoints
- Testing: Use curl commands or Postman

---

## 📞 Need Help?

- Check if both services are running
- Verify your JWT token is valid
- Check console logs for errors
- Review the integration examples above
- Test with curl commands first

**Happy coding!** 🚀💻
