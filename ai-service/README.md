# 🤖 SHS AI Service (FastAPI)

## Overview
FastAPI service for AI-powered medical chatbot and doctor recommendations using RAG (Retrieval-Augmented Generation) with medical knowledge base.

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.10+
- Anthropic API Key
- 8GB+ RAM (for embeddings)

### 1. Navigate to AI Service Directory
```bash
cd ai-service
```

### 2. Create Virtual Environment
```bash
python3 -m venv venv

# Activate
# Linux/Mac:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Get Anthropic API Key
1. Sign up at https://console.anthropic.com/
2. Create API key
3. Copy the key

### 5. Configure Environment

Create `.env` file:
```env
ANTHROPIC_API_KEY=your-anthropic-api-key-here

AI_SERVICE_HOST=0.0.0.0
AI_SERVICE_PORT=8001

CHROMA_DB_PATH=./chroma_db
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
LLM_MODEL=claude-3-sonnet-20240229

BACKEND_URL=http://localhost:8000
```

### 6. Initialize Knowledge Base
```bash
# Load medical documents
python knowledge_loader.py
```

### 7. Run Service
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8001

# Server at: http://127.0.0.1:8001
# Docs: http://127.0.0.1:8001/docs
# Health: http://127.0.0.1:8001/health
```

---

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

### Chatbot
```bash
POST /chat
Content-Type: application/json

{
  "message": "What are symptoms of diabetes?",
  "conversation_history": []
}
```

### Doctor Recommendations
```bash
POST /recommend-doctors
Content-Type: application/json

{
  "symptoms": ["fever", "cough"],
  "location": "Dhaka"
}
```

---

## 📁 Project Structure
```
ai-service/
├── main.py              # FastAPI app
├── knowledge_loader.py  # Load medical docs
├── rag_chatbot.py      # RAG implementation
├── chroma_db/          # Vector database
├── data/               # Medical documents
└── requirements.txt    # Dependencies
```

---

## 🧪 Testing

```bash
# Test health
curl http://localhost:8001/health

# Test chatbot
curl -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What causes fever?"}'
```

---

## 🚢 Production Deployment

```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8001
```

---

## 🐛 Troubleshooting

**ChromaDB Error:**
```bash
rm -rf chroma_db/
python knowledge_loader.py
```

**API Key Error:**
```bash
# Verify key in .env
cat .env | grep ANTHROPIC_API_KEY
```

**Memory Error:**
```bash
# Use smaller model
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

---

## 📚 Documentation
- API Docs: http://localhost:8001/docs
- [FastAPI](https://fastapi.tiangolo.com/)
- [Anthropic Claude](https://docs.anthropic.com/)
- [ChromaDB](https://docs.trychroma.com/)

---

**Last Updated:** January 6, 2026
