# Sprint 4: AI Medical Chatbot with RAG - API Specification

**Version**: 1.0  
**AI Service Base URL**: `http://localhost:8001`  
**Backend Base URL**: `http://localhost:8000/api/v1`

---

## 🤖 AI Service Endpoints (FastAPI)

### 1. Chat with AI
**Endpoint**: `POST /chat`  
**Description**: Send message to medical chatbot and get AI response with RAG  
**Authentication**: Not required (proxied through backend)

**Request Body**:
```json
{
  "message": "What are the symptoms of diabetes?",
  "user_id": "user_123",
  "conversation_id": "conv_456"
}
```

**Success Response** (200 OK):
```json
{
  "response": "Diabetes symptoms include increased thirst, frequent urination, extreme hunger, unexplained weight loss, fatigue, blurred vision, slow-healing sores, and frequent infections. Type 1 diabetes symptoms can develop quickly, while type 2 diabetes symptoms develop more gradually.",
  "sources": [
    {
      "document": "diabetes_guide.pdf",
      "page": 3,
      "relevance_score": 0.92
    },
    {
      "document": "endocrine_disorders.pdf",
      "page": 15,
      "relevance_score": 0.87
    }
  ],
  "conversation_id": "conv_456",
  "timestamp": "2026-01-15T10:30:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid message format
- `500 Internal Server Error`: LLM or vector DB error
  ```json
  {
    "detail": "Failed to generate response",
    "error_type": "LLM_ERROR"
  }
  ```

---

### 2. Health Check
**Endpoint**: `GET /health`  
**Description**: Check if AI service is running

**Success Response** (200 OK):
```json
{
  "status": "healthy",
  "service": "ai-medical-chatbot",
  "version": "1.0.0",
  "pinecone_connected": true,
  "gemini_available": true
}
```

---

### 3. Initialize Vector Store
**Endpoint**: `POST /initialize`  
**Description**: Initialize Pinecone with medical documents (admin only)

**Request Body**:
```json
{
  "documents_path": "/path/to/medical/documents",
  "force_reinitialize": false
}
```

**Success Response** (200 OK):
```json
{
  "status": "initialized",
  "documents_processed": 150,
  "embeddings_created": 150,
  "pinecone_index": "medical-knowledge-base"
}
```

---

## 💬 Chat History Endpoints (Django Backend)

### 4. Get Chat History
**Endpoint**: `GET /chat/history/`  
**Description**: Get user's chat history  
**Authentication**: Required (Bearer Token)

**Success Response** (200 OK):
```json
{
  "conversations": [
    {
      "conversation_id": "conv_456",
      "messages": [
        {
          "id": 1,
          "role": "user",
          "content": "What are the symptoms of diabetes?",
          "timestamp": "2026-01-15T10:30:00Z"
        },
        {
          "id": 2,
          "role": "assistant",
          "content": "Diabetes symptoms include increased thirst...",
          "sources": [
            {"document": "diabetes_guide.pdf", "page": 3}
          ],
          "timestamp": "2026-01-15T10:30:05Z"
        }
      ],
      "created_at": "2026-01-15T10:30:00Z"
    }
  ]
}
```

---

### 5. Save Chat Message
**Endpoint**: `POST /chat/messages/`  
**Description**: Save a chat message  
**Authentication**: Required (Bearer Token)

**Request Body**:
```json
{
  "conversation_id": "conv_456",
  "role": "user",
  "content": "What are the symptoms of diabetes?",
  "sources": []
}
```

**Success Response** (201 Created):
```json
{
  "id": 1,
  "conversation_id": "conv_456",
  "role": "user",
  "content": "What are the symptoms of diabetes?",
  "timestamp": "2026-01-15T10:30:00Z"
}
```

---

### 6. Clear Chat History
**Endpoint**: `DELETE /chat/history/`  
**Description**: Clear user's entire chat history  
**Authentication**: Required (Bearer Token)

**Success Response** (200 OK):
```json
{
  "message": "Chat history cleared successfully"
}
```

---

## 🔧 Technical Architecture

### RAG Pipeline Flow
```
1. User sends message → Frontend
2. Frontend → Django Backend API
3. Backend → FastAPI AI Service
4. AI Service:
   a. Embed user query (sentence-transformers)
   b. Query Pinecone for relevant documents
   c. Retrieve top-k most relevant chunks
   d. Construct prompt with context
   e. Send to Google Gemini LLM
   f. Get response with source tracking
5. Response → Backend → Frontend
6. Backend saves to chat history
```

---

## 📝 Models Schema

### ChatConversation Model
```python
{
  "id": uuid,
  "user": foreign_key(User),
  "conversation_id": string (unique),
  "created_at": datetime,
  "updated_at": datetime
}
```

### ChatMessage Model
```python
{
  "id": integer,
  "conversation": foreign_key(ChatConversation),
  "role": string (user|assistant),
  "content": text,
  "sources": json,
  "timestamp": datetime
}
```

---

## 🔑 Environment Variables

### AI Service (.env)
```bash
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX_NAME=medical-knowledge-base
GEMINI_API_KEY=your_gemini_api_key
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

### Django Backend
```bash
AI_SERVICE_URL=http://localhost:8001
```

---

## 🧪 Testing Examples

### Chat with AI (via cURL)
```bash
curl -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the symptoms of diabetes?",
    "user_id": "user_123",
    "conversation_id": "conv_456"
  }'
```

### Get Chat History (via cURL)
```bash
curl -X GET http://localhost:8000/api/v1/chat/history/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## ⚠️ Rate Limiting & Performance

- **Gemini API**: 60 requests/minute
- **Response Time Target**: < 3 seconds
- **Context Window**: 4096 tokens
- **Retrieved Documents**: Top 3 most relevant

---

## 🔗 Related Documentation

- [User Stories](./USER_STORIES.md)
- [TDD Approach](./TDD.md)
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md)
