# 🤖 AI Service - Medical Chatbot with RAG

**Intelligent medical chatbot powered by Google Gemini AI and Pinecone vector database using Retrieval-Augmented Generation (RAG) for accurate, context-aware medical information.**

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [RAG System](#-rag-system)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)

---

## 📋 Overview

The AI Service is a FastAPI-based microservice that provides an intelligent medical chatbot using **RAG (Retrieval-Augmented Generation)**. It combines:

- **Google Gemini 1.5 Flash** - Large Language Model for generating responses
- **Pinecone Vector Database** - Stores and retrieves medical document embeddings
- **HuggingFace Embeddings** - Converts text to vector representations
- **LangChain** - Framework for building the RAG pipeline

### How RAG Works

```
User Question → Embedding → Pinecone Search → Retrieve Top-K Documents → 
Gemini LLM (Question + Context) → Detailed Medical Answer + Sources
```

The system retrieves relevant medical information from a knowledge base and uses it as context for Gemini to generate accurate, evidence-based responses.

---

## ✨ Features

- 🧠 **AI-Powered Medical Q&A** - Ask any medical question and get detailed answers
- 📚 **Evidence-Based Responses** - Answers backed by retrieved medical documents
- 📖 **Source Citations** - Shows which medical documents were used (book name + page)
- 🔍 **Semantic Search** - Finds relevant information even with different wording
- ⚡ **Fast Response** - Optimized retrieval with Pinecone vector database
- 🔒 **Context-Aware** - Uses medical knowledge base for accurate information
- 📊 **Auto-Generated API Docs** - FastAPI Swagger UI at `/docs`

---

## 🛠️ Tech Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | FastAPI | 0.108.0 | Web framework for API |
| **Server** | Uvicorn | 0.25.0 | ASGI server |
| **LLM** | Google Gemini | 1.5-flash | Language model |
| **Vector DB** | Pinecone | 3.0.0 | Store document embeddings |
| **Embeddings** | Sentence Transformers | 3.4.0 | all-MiniLM-L6-v2 model |
| **RAG Framework** | LangChain | 0.1.0 | RAG pipeline |
| **Document Processing** | PyPDF | 3.17.4 | PDF parsing |

---

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      AI Service (Port 8001)                  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    FastAPI Server                       │ │
│  │  • /chat - Main chatbot endpoint                       │ │
│  │  • /health - Health check                              │ │
│  │  • /docs - Auto-generated API documentation            │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            ▼                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              RAG System (rag_system.py)                │ │
│  │  • Question processing                                 │ │
│  │  • Document retrieval                                  │ │
│  │  • Context generation                                  │ │
│  │  • Response synthesis                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│              │                        │                      │
└──────────────┼────────────────────────┼──────────────────────┘
               │                        │
               ▼                        ▼
    ┌──────────────────┐    ┌──────────────────────┐
    │  Pinecone Cloud  │    │  Google Gemini API   │
    │  Vector Database │    │  LLM Service         │
    │  • Medical docs  │    │  • Text generation   │
    │  • Embeddings    │    │  • Context aware     │
    └──────────────────┘    └──────────────────────┘
```

### Request Flow

1. **User sends question** → FastAPI `/chat` endpoint
2. **Question embedding** → Convert question to vector using HuggingFace model
3. **Similarity search** → Query Pinecone for top-3 relevant medical documents
4. **Context preparation** → Retrieved documents + user question
5. **LLM generation** → Gemini generates answer using context
6. **Response** → Return answer with source citations

---

## 🚀 Installation

### Prerequisites

- Python 3.10 or higher
- Google Gemini API key
- Pinecone API key
- 8GB+ RAM (for loading embeddings model)

### Step 1: Navigate to AI Service Directory

```bash
cd ai-service
```

### Step 2: Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### Step 3: Install Dependencies

```bash
# Upgrade pip
pip install --upgrade pip

# Install requirements
pip install -r requirements.txt
```

This will install:
- FastAPI and Uvicorn
- LangChain and integrations
- Pinecone client
- Sentence Transformers
- Google Generative AI
- Other dependencies

---

## ⚙️ Configuration

### Step 1: Get API Keys

#### Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Create a new API key or use existing
4. Copy the API key

#### Pinecone API Key
1. Sign up at [Pinecone](https://www.pinecone.io/)
2. Create a new project
3. Go to API Keys section
4. Copy your API key

### Step 2: Create `.env` File

```bash
# Create .env file
cat > .env << 'EOF'
# Google Gemini API
GOOGLE_API_KEY=your_google_gemini_api_key_here

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=medical-knowledge

# Embedding Model (HuggingFace)
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2

# LLM Configuration
LLM_MODEL=gemini-1.5-flash
LLM_TEMPERATURE=0.7

# Retrieval Configuration
RETRIEVAL_K=3

# Server Configuration
AI_SERVICE_HOST=0.0.0.0
AI_SERVICE_PORT=8001
EOF
```

### Step 3: Index Medical Documents (First Time Only)

Before starting the service, you need to index medical documents into Pinecone:

```bash
# Run the indexing script
python index_documents.py
```

**What this does:**
1. Creates Pinecone index if it doesn't exist
2. Loads medical PDF documents from `data/` directory
3. Splits documents into chunks
4. Generates embeddings using HuggingFace model
5. Stores embeddings in Pinecone vector database

**Expected output:**
```
🚀 Starting Medical Document Indexing...
📊 Connecting to Pinecone...
✅ Index 'medical-knowledge' exists
📚 Loading documents from data/...
Found 5 medical documents
📄 Processing: medical_book_1.pdf
...
✅ Indexing complete! 1,234 chunks indexed.
```

**Note:** This process takes 5-10 minutes depending on document size and internet speed.

---

## 🚀 Usage

### Start the AI Service

```bash
# Make sure you're in ai-service directory with venv activated
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

**Server will start at:** `http://localhost:8001`

### Quick Start Script

For convenience, use the start script:

```bash
chmod +x start.sh
./start.sh
```

### Expected Output

```
🏥 Medical Chatbot Service Starting...
============================================================

🚀 Initializing Medical RAG System...
📊 Connecting to Pinecone...
🔤 Loading embeddings model: sentence-transformers/all-MiniLM-L6-v2...
💾 Connecting to vector store: medical-knowledge...
🔍 Setting up retriever (top-3 documents)...
🤖 Loading LLM: gemini-1.5-flash...
⛓️  Building RAG chain...
✅ Medical RAG System initialized successfully!

INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
```

---

## 📡 API Endpoints

### 1. Root Endpoint

**GET** `/`

```bash
curl http://localhost:8001/
```

**Response:**
```json
{
  "message": "Medical Chatbot API",
  "version": "1.0.0",
  "docs": "/docs",
  "health": "/health"
}
```

### 2. Health Check

**GET** `/health`

```bash
curl http://localhost:8001/health
```

**Response:**
```json
{
  "status": "healthy",
  "rag_system": "ready",
  "index_name": "medical-knowledge"
}
```

### 3. Chat Endpoint (Main Feature)

**POST** `/chat`

**Request Body:**
```json
{
  "question": "What are the symptoms of diabetes?"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the symptoms of diabetes?"}'
```

**Response:**
```json
{
  "question": "What are the symptoms of diabetes?",
  "answer": "Diabetes manifests through several key symptoms. The most common symptoms include frequent urination (polyuria), excessive thirst (polydipsia), and increased hunger (polyphagia). Patients often experience unexplained weight loss despite increased appetite. Other symptoms include fatigue, blurred vision, slow-healing wounds, frequent infections, and tingling or numbness in hands or feet. In Type 1 diabetes, symptoms appear suddenly, while Type 2 diabetes symptoms develop gradually. If you experience these symptoms, consult a healthcare professional for proper diagnosis and treatment.",
  "sources": [
    {
      "source": "Medical Textbook - Endocrinology",
      "page": 245
    },
    {
      "source": "Clinical Guide to Diabetes",
      "page": 12
    }
  ]
}
```

### 4. Interactive API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: `http://localhost:8001/docs`
- **ReDoc**: `http://localhost:8001/redoc`

You can test the API directly from the browser!

---

## 🔍 RAG System

### How RAG Works

The RAG (Retrieval-Augmented Generation) system combines retrieval and generation:

```python
# Simplified flow
question = "What is hypertension?"

# 1. Embed question
question_vector = embeddings.embed(question)

# 2. Search Pinecone
relevant_docs = pinecone.query(question_vector, top_k=3)

# 3. Build context
context = "\n".join([doc.text for doc in relevant_docs])

# 4. Generate answer
prompt = f"Context: {context}\n\nQuestion: {question}"
answer = gemini.generate(prompt)

# 5. Return with sources
return {
    "answer": answer,
    "sources": [doc.metadata for doc in relevant_docs]
}
```

### Embeddings Model

**Model**: `sentence-transformers/all-MiniLM-L6-v2`

- **Type**: Sentence Transformer
- **Dimensions**: 384
- **Purpose**: Convert text to vector embeddings
- **Performance**: Fast and accurate for semantic search
- **Size**: ~80MB

### LLM Configuration

**Model**: `gemini-1.5-flash`

- **Provider**: Google Generative AI
- **Temperature**: 0.7 (balanced between creativity and consistency)
- **Max Tokens**: Auto (based on context)
- **Use Case**: Medical question answering

### Retrieval Settings

- **Top-K**: 3 documents
- **Search Type**: Similarity search
- **Distance Metric**: Cosine similarity

---

## 👨‍💻 Development

### Project Structure

```
ai-service/
├── app/
│   ├── __init__.py
│   ├── config.py           # Configuration and environment variables
│   ├── rag_system.py       # RAG system implementation
│   └── schemas.py          # Pydantic models for request/response
├── data/                   # Medical documents (PDFs) for indexing
├── main.py                 # FastAPI application
├── index_documents.py      # Script to index documents into Pinecone
├── requirements.txt        # Python dependencies
├── requirements-dev.txt    # Development dependencies
├── .env                    # Environment variables (not in git)
├── .env.example            # Example environment file
├── start.sh                # Start script
└── README.md               # This file
```

### Key Files

#### `main.py`
- FastAPI application setup
- CORS middleware configuration
- API endpoint definitions
- Application lifespan management

#### `app/rag_system.py`
- RAG system implementation
- Pinecone initialization
- Embeddings setup
- LangChain RAG chain
- Query processing

#### `app/config.py`
- Environment variable loading
- Configuration management
- Validation

#### `app/schemas.py`
- Pydantic models
- Request/response validation
- Type hints

#### `index_documents.py`
- Document loading
- Text splitting
- Embedding generation
- Pinecone indexing

### Adding New Medical Documents

1. Place PDF files in `data/` directory
2. Run indexing script:
   ```bash
   python index_documents.py
   ```
3. Documents will be automatically processed and indexed

### Testing

```bash
# Install dev dependencies
pip install -r requirements-dev.txt

# Run tests (if available)
pytest tests/

# Test API manually
curl -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What is pneumonia?"}'
```

---

## 🐛 Troubleshooting

### Issue: "RAG system not ready"

**Cause**: RAG system failed to initialize

**Solutions:**
1. Check API keys are correct in `.env`
2. Ensure Pinecone index exists (run `index_documents.py`)
3. Check internet connection for API access
4. Verify embeddings model can be downloaded

### Issue: "Index not found"

**Cause**: Pinecone index doesn't exist

**Solution:**
```bash
python index_documents.py
```

### Issue: "Out of memory"

**Cause**: Embeddings model requires too much RAM

**Solutions:**
1. Use a smaller embedding model
2. Increase system RAM
3. Use cloud deployment with more resources

### Issue: "API rate limit exceeded"

**Cause**: Too many requests to Gemini or Pinecone

**Solutions:**
1. Add rate limiting middleware
2. Implement caching for common questions
3. Upgrade API plan

### Issue: Slow response time

**Causes & Solutions:**
1. **Large documents**: Reduce chunk size or top-k value
2. **Network latency**: Deploy closer to Pinecone/Gemini servers
3. **Cold start**: First request is slower (embeddings loading)

---

## 📊 Performance

### Typical Response Times

- **Cold start** (first request): 3-5 seconds
- **Warm requests**: 1-2 seconds
- **Embedding generation**: 100-200ms
- **Pinecone query**: 100-300ms
- **LLM generation**: 500-1500ms

### Resource Usage

- **RAM**: 1-2GB (with embeddings loaded)
- **CPU**: Low (mostly I/O bound)
- **Storage**: 100MB (dependencies + model)

---

## 🔒 Security

### Best Practices

1. **Never commit `.env` file** - Contains API keys
2. **Use environment variables** - Don't hardcode secrets
3. **Enable CORS selectively** - Specify allowed origins in production
4. **Rate limiting** - Prevent API abuse
5. **Input validation** - Use Pydantic models
6. **Monitoring** - Track API usage and errors

### Production Configuration

```python
# main.py - Update CORS for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specific domains
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

---

## 🚢 Deployment

### Docker Deployment (Recommended)

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
```

### Environment Variables for Production

```bash
GOOGLE_API_KEY=prod_key
PINECONE_API_KEY=prod_key
PINECONE_INDEX_NAME=medical-knowledge-prod
AI_SERVICE_HOST=0.0.0.0
AI_SERVICE_PORT=8001
```

---

## 📚 Additional Resources

- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **LangChain Docs**: https://python.langchain.com/
- **Pinecone Docs**: https://docs.pinecone.io/
- **Google Gemini**: https://ai.google.dev/
- **Sentence Transformers**: https://www.sbert.net/

---

## 🤝 Contributing

See main project [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

---

## 📄 License

This project is part of SHS (Smart Health Synchronizer) and is licensed under the MIT License.

---

## 👨‍💻 Author

**Prantic Paul**

- 📧 Email: pranticpaulshimul@gmail.com
- 🐙 GitHub: [@prantic-paul](https://github.com/prantic-paul)

---

## 🙏 Acknowledgments

- Google for Gemini AI API
- Pinecone for vector database services
- LangChain community for the RAG framework
- HuggingFace for embeddings models
