# 🤖 AI Service – Smart Health Synchronizer

**RAG-based Medical Chatbot powered by Google Gemini, Pinecone Vector Database, and LangChain for intelligent, context-aware healthcare assistance.**

---

## 📋 Overview

The AI Service is an advanced **Retrieval-Augmented Generation (RAG)** chatbot designed to provide accurate, context-aware medical information to SHS platform users. By combining the power of:

- **Google Gemini 1.5 Flash** - Latest LLM for natural language understanding
- **Pinecone Vector Database** - Fast semantic search over medical knowledge
- **LangChain** - Orchestration framework for RAG pipeline
- **HuggingFace Embeddings** - Convert text to vector representations

The AI Service offers **intelligent medical advice** that is grounded in authoritative medical documents, reducing hallucinations and improving factual accuracy.

**Key Capabilities:**
- 💬 Natural conversational interface for health queries
- 📚 Context-aware responses from medical knowledge base
- 🔍 Semantic search across medical documents
- 🎯 Specialized medical prompting strategies
- ⚡ Fast response times with vector similarity search
- 🛡️ Safety disclaimers and medical ethics compliance

**Important Note:** This AI assistant provides general health information only. It is **NOT** a substitute for professional medical diagnosis or treatment. Users are always advised to consult qualified healthcare providers.

---

## 🎯 Problem It Solves

### Healthcare Information Gap

**Problems:**
1. **Information Overload** - Patients struggle to find reliable health information online
2. **Medical Jargon** - Complex medical terminology confuses non-experts
3. **Misinformation** - Unverified health advice spreads easily
4. **Accessibility** - Limited access to immediate medical consultation
5. **Question Complexity** - Users don't know what to ask or how to describe symptoms

### Our Solution

The AI Service bridges this gap by:

✅ **Accurate Information** - Responses grounded in medical documents, not just LLM training data  
✅ **Plain Language** - Translates complex medical concepts into understandable terms  
✅ **24/7 Availability** - Instant responses anytime, anywhere  
✅ **Personalized Guidance** - Context-aware answers based on user queries  
✅ **Doctor Recommendations** - Suggests appropriate specialist types for conditions  
✅ **Safe Advice** - Always includes disclaimers and encourages professional consultation

**Use Cases:**
- Explaining medical test results
- Understanding medication side effects
- Identifying when to seek urgent care
- Preparing questions before doctor appointments
- Learning about medical conditions and treatments
- Finding appropriate specialist recommendations

---

## 🧠 AI Approach

### Retrieval-Augmented Generation (RAG)

Traditional chatbots rely solely on LLM knowledge, which can be:
- ❌ **Outdated** - Training data is static
- ❌ **Unreliable** - Prone to hallucinations
- ❌ **Generic** - Lacks domain-specific expertise

**RAG Solves This:**

```
User Query → Embedding → Vector Search → Relevant Docs → Gemini (with context) → Answer
```

### How It Works

1. **Document Ingestion**
   - Medical documents are split into chunks
   - Each chunk is converted to embeddings (vectors)
   - Embeddings stored in Pinecone with metadata

2. **Query Processing**
   - User query is converted to embedding
   - Similarity search in Pinecone finds relevant chunks
   - Top K most relevant documents retrieved

3. **Context Injection**
   - Retrieved documents added to system prompt
   - User query appended
   - Full context sent to Gemini

4. **Answer Generation**
   - Gemini generates response grounded in provided context
   - Response formatted with clear structure
   - Safety disclaimers added automatically

### Why RAG for Healthcare?

- 📖 **Up-to-date Information** - Knowledge base can be updated anytime
- 🎯 **Domain Expertise** - Uses curated medical documents
- 🔬 **Verifiable** - Responses can be traced to source documents
- 🛡️ **Reduced Hallucinations** - LLM constrained by retrieved context
- ⚡ **Efficient** - Only relevant information sent to LLM, reducing tokens

---

## 🏗️ Architecture Flow

### System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         User Interface (React)                        │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │ HTTP Request (Chat Message)
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                       Backend API (Django)                            │
│  • Validates JWT token                                               │
│  • Stores chat history in database                                   │
│  • Forwards request to AI Service                                    │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │ POST /chat
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    AI Service (FastAPI - Port 8001)                  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    1. Query Embedding                         │   │
│  │    HuggingFace Embeddings (all-MiniLM-L6-v2)                │   │
│  │    Converts user query to 384-dimensional vector             │   │
│  └────────────────────────────┬─────────────────────────────────┘   │
│                                │                                       │
│                                ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    2. Semantic Search                         │   │
│  │    Query: Pinecone Vector DB                                 │   │
│  │    Returns: Top 5 most relevant medical document chunks      │   │
│  └────────────────────────────┬─────────────────────────────────┘   │
│                                │                                       │
│                                ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    3. Context Assembly                        │   │
│  │    LangChain RetrievalQA Chain                               │   │
│  │    Combines: System Prompt + Retrieved Docs + User Query     │   │
│  └────────────────────────────┬─────────────────────────────────┘   │
│                                │                                       │
│                                ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    4. Response Generation                     │   │
│  │    Google Gemini 1.5 Flash                                   │   │
│  │    Generates context-aware medical response                  │   │
│  └────────────────────────────┬─────────────────────────────────┘   │
│                                │                                       │
└────────────────────────────────┼─────────────────────────────────────┘
                                 │ JSON Response
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         Backend API (Django)                          │
│  • Receives AI response                                              │
│  • Stores in chat history                                            │
│  • Forwards to frontend                                              │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         User Interface (React)                        │
│  Displays AI response in chat interface                              │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | FastAPI | 0.108.0 | Async web framework |
| **LLM** | Google Gemini | 1.5 Flash | Response generation |
| **Vector DB** | Pinecone | Latest | Semantic search |
| **Orchestration** | LangChain | 0.1.0 | RAG pipeline |
| **Embeddings** | HuggingFace | all-MiniLM-L6-v2 | Text vectorization |
| **HTTP Client** | requests | 2.31.0 | API calls |
| **Environment** | python-dotenv | 1.0.0 | Config management |
| **Validation** | Pydantic | 2.5.0 | Data validation |

---

## 📚 Data Sources

### Medical Knowledge Base

The AI Service is grounded in curated medical documents including:

1. **Medical Textbooks** - General medicine, symptoms, diseases
2. **Clinical Guidelines** - Treatment protocols, diagnostics
3. **Health Information** - Common conditions, medications, preventive care
4. **Specialist Directories** - When to consult specific specialists

### Document Processing Pipeline

```python
# 1. Document Loading
documents = TextLoader("medical_docs/").load()

# 2. Text Splitting (chunks of 500 tokens, 50 overlap)
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)
chunks = text_splitter.split_documents(documents)

# 3. Embedding Generation
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# 4. Vector Store Creation
vectorstore = Pinecone.from_documents(
    chunks, 
    embeddings, 
    index_name="shs-medical"
)
```

---

## 🎯 Prompting Strategy

### System Prompt Design

```python
SYSTEM_PROMPT = """
You are a helpful medical assistant for the Smart Health Synchronizer platform.

Guidelines:
1. **Be Accurate**: Base responses on provided medical documents
2. **Be Clear**: Use simple language, explain medical terms
3. **Be Helpful**: Suggest next steps (book appointment, see specialist)
4. **Be Safe**: Always include disclaimer about consulting healthcare professionals
5. **Be Empathetic**: Show understanding and compassion

IMPORTANT DISCLAIMERS:
- You are NOT a doctor and cannot provide medical diagnosis
- Your advice is for informational purposes only
- Users should always consult qualified healthcare providers
- In emergencies, users should call emergency services immediately

Context from medical documents:
{context}

User Question: {question}
"""
```

### Response Structure

```
📋 **Explanation**
[Clear explanation of medical topic]

🔍 **Key Points**
- Point 1
- Point 2

👨‍⚕️ **Recommended Specialist**
[Specialist type if applicable]

⚠️ **Important Disclaimer**
This information is for educational purposes only. Consult a healthcare provider.
```

---

## 🌐 API Endpoints

### POST /chat - Send Chat Message

**Request:**
```bash
curl -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the symptoms of diabetes?",
    "user_id": "user_123"
  }'
```

**Response:**
```json
{
  "response": "📋 **Diabetes Symptoms**\n\nCommon symptoms:\n\n🔍 **Key Symptoms**\n- Increased thirst\n- Frequent urination\n- Extreme hunger\n- Fatigue\n- Blurred vision\n\n👨‍⚕️ **Recommended Specialist**\nConsult an **Endocrinologist**\n\n⚠️ **Disclaimer**\nConsult a healthcare provider for diagnosis.",
  "timestamp": "2026-01-22T10:30:00Z",
  "sources": ["diabetes_overview.pdf"]
}
```

### GET /health - Health Check

**Request:**
```bash
curl http://localhost:8001/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "ai-service",
  "pinecone": "connected",
  "gemini": "available"
}
```

---

## ⚠️ Limitations

1. **Not a Medical Diagnosis Tool** - Cannot replace professional medical consultation
2. **Knowledge Base Scope** - Limited to documents in vector database
3. **Language Support** - Primary: English
4. **Privacy** - User queries sent to external services (Gemini, Pinecone)
5. **Response Time** - 2-5 seconds depending on query
6. **Response Quality** - May occasionally provide incomplete information

### Safety Measures

✅ Always includes medical disclaimer  
✅ Encourages professional consultation  
✅ Suggests appropriate specialists  
✅ Refuses to diagnose conditions  
✅ Provides emergency guidance when needed

---

## 🚀 Future Enhancements

1. **Enhanced Knowledge Base** - Expand to 10,000+ medical documents
2. **Fine-Tuned Models** - Custom fine-tuned Gemini model on medical data
3. **Personalization** - User medical history integration (with consent)
4. **Advanced Features** - Image analysis, voice input/output, multi-turn memory
5. **Quality Improvements** - Source citation, confidence scores, feedback loop
6. **Integration** - Direct booking, EHR integration, medication checker

---

## ⚙️ Environment Variables

Create `.env` file in `ai-service/` directory:

```env
# Google Gemini API
GOOGLE_API_KEY=your-gemini-api-key-here

# Pinecone Configuration
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=us-east1-gcp
PINECONE_INDEX_NAME=shs-medical

# Model Configuration
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
LLM_MODEL=gemini-1.5-flash
MAX_TOKENS=1024
TEMPERATURE=0.3

# Application Settings
PORT=8001
DEBUG=True
LOG_LEVEL=INFO
```

---

## 🚀 Setup & Run

### Prerequisites
- Python 3.10+
- Google Gemini API key
- Pinecone account and API key

### Installation

```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
nano .env  # Add your API keys
```

### Initialize Vector Database

```bash
python scripts/ingest_documents.py
```

### Run Service

```bash
uvicorn main:app --reload --port 8001
```

Service runs at `http://localhost:8001`

### API Documentation
- **Swagger UI:** http://localhost:8001/docs
- **ReDoc:** http://localhost:8001/redoc

---

## 📄 License

Part of Smart Health Synchronizer - MIT License

---

## 👨‍💻 Author

**Prantic Paul**  
GitHub: [@prantic-paul](https://github.com/prantic-paul)  
Email: pranticpaulshimul@gmail.com
