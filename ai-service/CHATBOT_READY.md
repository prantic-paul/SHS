# Medical Chatbot FastAPI Microservice

## 🎉 Setup Complete!

Your FastAPI chatbot microservice has been successfully created! This service provides AI-powered medical question answering using RAG (Retrieval-Augmented Generation).

## 📁 Project Structure

```
ai-service/
├── app/
│   ├── __init__.py          # Package initialization
│   ├── config.py            # Configuration settings
│   ├── schemas.py           # Pydantic models
│   └── rag_system.py        # RAG system implementation
├── data/
│   └── Medical_book.pdf     # Your medical PDF document
├── main.py                  # FastAPI application
├── index_documents.py       # Document indexing script
├── requirements.txt         # Python dependencies
└── .env                     # Environment variables (API keys)
```

## 🚀 Quick Start

### Step 1: Index Documents (First Time Only)

Before starting the service, you need to index your medical documents into Pinecone:

```bash
cd /home/prantic/SHS/ai-service
/home/prantic/SHS/ai-service/venv/bin/python3 index_documents.py
```

This will:
- Load PDFs from the `data/` directory
- Split them into chunks
- Create embeddings
- Upload to Pinecone vector database

**Note:** This only needs to be done once, or when you add new documents.

### Step 2: Start the FastAPI Server

```bash
cd /home/prantic/SHS/ai-service
/home/prantic/SHS/ai-service/venv/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 8001
```

The server will start at: `http://localhost:8001`

## 📡 API Endpoints

### 1. Health Check
**GET** `/health`

Check if the service is running and RAG system is ready.

```bash
curl http://localhost:8001/health
```

**Response:**
```json
{
  "status": "healthy",
  "rag_system": "ready",
  "index_name": "medical-chatbot"
}
```

### 2. Chat Endpoint (Main Feature)
**POST** `/chat`

Ask medical questions and get AI-powered answers with source citations.

**Request Body:**
```json
{
  "question": "What is diabetes and how to manage it?"
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What is diabetes?"}'
```

**Response:**
```json
{
  "question": "What is diabetes?",
  "answer": "Diabetes is a chronic condition where the body cannot properly process blood sugar...",
  "sources": [
    {
      "content": "Diabetes mellitus is a group of metabolic diseases...",
      "source": "data/Medical_book.pdf"
    }
  ]
}
```

### 3. Root Endpoint
**GET** `/`

Service information and documentation links.

```bash
curl http://localhost:8001/
```

### 4. Interactive API Documentation

FastAPI provides automatic interactive documentation:

- **Swagger UI:** http://localhost:8001/docs
- **ReDoc:** http://localhost:8001/redoc

## 🔧 Configuration

All configuration is in `.env` file:

```env
# API Keys (Required)
PINECONE_API_KEY=your_pinecone_api_key
GOOGLE_API_KEY=your_google_api_key

# Pinecone Configuration
PINECONE_INDEX_NAME=medical-chatbot
PINECONE_CLOUD=aws
PINECONE_REGION=us-east-1

# Embedding Configuration
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
EMBEDDING_DIMENSION=384

# LLM Configuration
LLM_MODEL=gemini-2.5-flash
LLM_TEMPERATURE=0.3

# Retrieval Configuration
RETRIEVAL_K=3
```

## 🧪 Testing the Service

### Test with Python:

```python
import requests

# Health check
response = requests.get("http://localhost:8001/health")
print(response.json())

# Ask a question
response = requests.post(
    "http://localhost:8001/chat",
    json={"question": "What are the symptoms of diabetes?"}
)
print(response.json())
```

### Test with JavaScript (from your frontend):

```javascript
// Health check
fetch('http://localhost:8001/health')
  .then(res => res.json())
  .then(data => console.log(data));

// Ask a question
fetch('http://localhost:8001/chat', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    question: 'What are the symptoms of diabetes?'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

## 🔒 Important Notes

1. **No Authentication Required:** The `/chat` endpoint is open for testing. Add authentication in production.

2. **CORS Enabled:** The service allows requests from any origin (`allow_origins=["*"]`). Restrict this in production.

3. **API Keys:** Keep your `.env` file secure. Never commit it to version control.

4. **First Request is Slow:** The first request after starting the server will be slower as models load into memory.

## 📦 Dependencies

All required packages are in `requirements.txt`:
- FastAPI for web framework
- LangChain for RAG pipeline
- Pinecone for vector database
- sentence-transformers for embeddings
- Google Generative AI for LLM

## 🐛 Troubleshooting

### Error: "Index 'medical-chatbot' not found"
**Solution:** Run the indexing script first:
```bash
/home/prantic/SHS/ai-service/venv/bin/python3 index_documents.py
```

### Error: "ValidationError" on startup
**Solution:** Check that all required environment variables are in `.env` file.

### Port 8001 already in use
**Solution:** Either stop the other service or change the port:
```bash
/home/prantic/SHS/ai-service/venv/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 8002
```

## 🎯 Next Steps

1. **Index your documents** (if not already done)
2. **Start the server**
3. **Test the endpoints** using curl or the Swagger UI
4. **Integrate with your Django backend** (see Django integration guide)
5. **Add authentication** for production use

## 📚 Additional Resources

- FastAPI Documentation: https://fastapi.tiangolo.com/
- LangChain Documentation: https://python.langchain.com/
- Pinecone Documentation: https://docs.pinecone.io/

---

**Your FastAPI microservice is ready to use! 🚀**

The endpoint `http://localhost:8001/chat` is now available for your application to consume.
