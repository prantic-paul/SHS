# Medical Chatbot Integration Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                           │
│                     (React Frontend)                             │
│                    http://localhost:5173                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ HTTP Requests
                           │ (Bearer Token Auth)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Django Backend API                           │
│                    http://localhost:8000                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Chat Endpoint: /api/v1/chat/medical/                    │  │
│  │  - Validates user authentication                         │  │
│  │  - Proxies requests to AI service                        │  │
│  │  - Logs conversations (optional)                         │  │
│  └─────────────────┬────────────────────────────────────────┘  │
└────────────────────┼───────────────────────────────────────────┘
                     │
                     │ HTTP POST
                     │ /api/chat
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              AI Service (FastAPI Microservice)                   │
│                    http://localhost:8001                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Endpoints:                                               │  │
│  │  • POST /api/chat          - Chat with medical bot       │  │
│  │  • GET  /health            - Health check                │  │
│  │  • POST /api/index-documents - Re-index documents        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  RAG System Components:                                   │  │
│  │  1. Document Loader (PyPDF)                              │  │
│  │  2. Text Splitter (RecursiveCharacterTextSplitter)       │  │
│  │  3. Embeddings (HuggingFace all-MiniLM-L6-v2)           │  │
│  │  4. Vector Store (Pinecone)                              │  │
│  │  5. Retriever (Similarity Search, k=3)                   │  │
│  │  6. LLM (Google Gemini 1.5 Flash)                        │  │
│  └─────────────┬────────────────────────────┬────────────────┘  │
└────────────────┼────────────────────────────┼───────────────────┘
                 │                            │
                 │                            │
                 ▼                            ▼
    ┌────────────────────────┐   ┌──────────────────────┐
    │   Pinecone Cloud       │   │   Google AI API      │
    │   Vector Database      │   │   (Gemini LLM)       │
    │   - Medical embeddings │   │   - Text generation  │
    │   - Similarity search  │   │   - Context-aware    │
    └────────────────────────┘   └──────────────────────┘
```

## 🔄 Data Flow

### 1. Document Indexing (One-time Setup)
```
Medical PDFs → PyPDF Loader → Text Splitter → 
HuggingFace Embeddings → Pinecone Vector Store
```

### 2. User Query Flow
```
User Question → Frontend → Django Backend → AI Service →
│
├─→ Embeddings Generator (HuggingFace)
│   └─→ Query Vector
│
├─→ Pinecone Vector Search
│   └─→ Top 3 Similar Documents
│
└─→ Google Gemini LLM
    └─→ Generate Answer using Context
        └─→ Return to User
```

## 📁 Project Structure

```
SHS/
├── backend/                          # Django Backend
│   ├── apps/
│   │   └── chat/                    # Chat app (NEW)
│   │       ├── views.py            # MedicalChatView
│   │       └── urls.py             # Chat routes
│   ├── services/                   # Business logic (NEW)
│   │   └── ai_chatbot.py          # AI service client
│   └── manage.py
│
├── frontend/                        # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── MedicalChatbot.jsx  # Chat UI component (NEW)
│   │   ├── services/
│   │   │   └── chatbotService.js   # API client (NEW)
│   │   └── pages/
│   │       └── ChatPage.jsx        # Chat page (NEW)
│   └── package.json
│
└── ai-service/                      # AI Microservice (NEW)
    ├── app/
    │   ├── config.py               # Configuration
    │   ├── schemas.py              # Pydantic models
    │   └── rag_system.py           # RAG implementation
    ├── data/
    │   └── Medical_book.pdf        # Medical documents
    ├── main.py                     # FastAPI app
    ├── index_documents.py          # Document indexing
    ├── setup.sh                    # Setup script
    ├── test_service.py             # Test suite
    ├── requirements.txt            # Dependencies
    ├── README.md                   # Full documentation
    └── QUICKSTART.md               # Quick start guide
```

## 🔐 Security Considerations

1. **Authentication**: Django backend validates JWT tokens
2. **Rate Limiting**: Can be added to prevent abuse
3. **API Keys**: Stored securely in .env files
4. **CORS**: Configured for specific origins in production
5. **Input Validation**: Pydantic schemas validate all inputs

## 🚀 Deployment Options

### Option 1: Separate Services (Development)
- Django: Port 8000
- AI Service: Port 8001
- Frontend: Port 5173

### Option 2: Docker Compose (Production)
```yaml
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
  
  ai-service:
    build: ./ai-service
    ports: ["8001:8001"]
    environment:
      - PINECONE_API_KEY=${PINECONE_API_KEY}
      - GOOGLE_API_KEY=${GOOGLE_API_KEY}
  
  frontend:
    build: ./frontend
    ports: ["80:80"]
```

### Option 3: Serverless (AWS Lambda/Cloud Run)
- Deploy AI service to Cloud Run/Lambda
- Update backend to call cloud endpoint
- Scale automatically based on traffic

## 📊 Performance Metrics

- **Average Response Time**: 2-5 seconds
- **Embedding Dimension**: 384
- **Context Window**: Top 3 documents
- **Chunk Size**: 500 characters
- **Concurrent Users**: 10+ (FastAPI async)

## 🔧 Configuration Options

### Environment Variables
```bash
# AI Service
PINECONE_API_KEY=xxx          # Required
GOOGLE_API_KEY=xxx            # Required
PINECONE_INDEX_NAME=medical-chatbot
TOP_K_RESULTS=3               # Number of documents to retrieve
LLM_TEMPERATURE=0.3           # Creativity (0=factual, 1=creative)
CHUNK_SIZE=500                # Document chunk size
```

## 📈 Future Enhancements

1. **Conversation Memory**: Store chat history
2. **Multi-language Support**: Translate queries/responses
3. **Voice Input/Output**: Speech-to-text integration
4. **Image Analysis**: Medical image interpretation
5. **Doctor Recommendations**: Suggest specialists based on symptoms
6. **Appointment Booking**: Integrate with booking system
7. **Analytics Dashboard**: Track usage patterns
8. **Feedback Loop**: Improve responses based on user feedback

## 🎯 API Integration Checklist

- [ ] Install AI service dependencies
- [ ] Configure API keys in .env
- [ ] Index medical documents
- [ ] Start AI service
- [ ] Create Django chat app
- [ ] Add AI service client
- [ ] Create chat endpoint
- [ ] Build React chatbot component
- [ ] Add chat route to frontend
- [ ] Test end-to-end flow
- [ ] Deploy to production

