# Sprint 4: AI Medical Chatbot - Implementation Guide

**Technical Implementation Guide for RAG System**

---

## 🏗️ System Architecture

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend  │────────▶│    Django    │────────▶│  AI Service  │
│   (React)   │         │   Backend    │         │  (FastAPI)   │
└─────────────┘         └──────────────┘         └──────────────┘
                               │                         │
                               │                         ├──▶ Google Gemini
                               │                         │
                               ▼                         └──▶ Pinecone
                        ┌──────────────┐
                        │  PostgreSQL  │
                        │ (Chat History)│
                        └──────────────┘
```

---

## 📦 Installation & Setup

### 1. Install Dependencies

#### AI Service
```bash
cd ai-service
pip install -r requirements.txt
```

**requirements.txt**:
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
langchain==0.1.0
langchain-google-genai==0.0.5
pinecone-client==3.0.0
sentence-transformers==2.2.2
python-dotenv==1.0.0
pydantic==2.5.0
```

#### Backend (if not already installed)
```bash
cd backend
pip install langchain pinecone-client
```

---

### 2. Environment Configuration

#### AI Service `.env`
```bash
# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX_NAME=medical-knowledge-base

# Google Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash-latest

# Embedding Model
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2

# Service Configuration
HOST=0.0.0.0
PORT=8001
```

#### Django Backend `.env`
```bash
AI_SERVICE_URL=http://localhost:8001
```

---

## 🔧 Implementation Steps

### Step 1: Set Up Pinecone Vector Database

**File**: `ai-service/app/vector_store.py`

```python
import os
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))

# Create or connect to index
index_name = os.getenv('PINECONE_INDEX_NAME', 'medical-knowledge-base')

if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=384,  # all-MiniLM-L6-v2 dimension
        metric='cosine',
        spec=ServerlessSpec(
            cloud='aws',
            region='us-west-2'
        )
    )

index = pc.Index(index_name)

# Initialize embedding model
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

def embed_text(text: str):
    """Generate embedding for text"""
    return embedding_model.encode(text).tolist()

def upsert_documents(documents: list):
    """Upload documents to Pinecone"""
    vectors = []
    for doc in documents:
        embedding = embed_text(doc['text'])
        vectors.append({
            'id': doc['id'],
            'values': embedding,
            'metadata': {
                'text': doc['text'],
                'source': doc.get('source', ''),
                'page': doc.get('page', 0)
            }
        })
    index.upsert(vectors=vectors)
    return len(vectors)

def search_similar(query: str, top_k: int = 3):
    """Search for similar documents"""
    query_embedding = embed_text(query)
    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )
    return results['matches']
```

---

### Step 2: Integrate Google Gemini LLM

**File**: `ai-service/app/llm.py`

```python
import os
from langchain_google_genai import ChatGoogleGenerativeAI

# Initialize Gemini
llm = ChatGoogleGenerativeAI(
    model=os.getenv('GEMINI_MODEL', 'gemini-1.5-flash-latest'),
    google_api_key=os.getenv('GEMINI_API_KEY'),
    temperature=0.7
)

def generate_response(prompt: str) -> str:
    """Generate response using Gemini"""
    try:
        response = llm.invoke(prompt)
        return response.content
    except Exception as e:
        raise Exception(f"LLM generation failed: {str(e)}")
```

---

### Step 3: Build RAG Pipeline

**File**: `ai-service/app/rag_system.py`

```python
from app.vector_store import search_similar, embed_text
from app.llm import generate_response

def build_context(retrieved_docs):
    """Build context from retrieved documents"""
    context_parts = []
    for doc in retrieved_docs:
        text = doc['metadata']['text']
        source = doc['metadata'].get('source', 'Unknown')
        context_parts.append(f"[Source: {source}]\n{text}")
    return "\n\n".join(context_parts)

def build_prompt(question: str, context: str) -> str:
    """Build prompt for LLM"""
    return f"""You are a helpful medical AI assistant. Answer the question based on the provided context.
If the context doesn't contain enough information, say so.

Context:
{context}

Question: {question}

Answer:"""

def process_query(question: str, user_id: str = None):
    """Process user query through RAG pipeline"""
    try:
        # Step 1: Retrieve relevant documents
        retrieved_docs = search_similar(question, top_k=3)
        
        # Step 2: Build context
        context = build_context(retrieved_docs)
        
        # Step 3: Build prompt
        prompt = build_prompt(question, context)
        
        # Step 4: Generate response
        response = generate_response(prompt)
        
        # Step 5: Extract sources
        sources = [
            {
                'document': doc['metadata'].get('source', 'Unknown'),
                'page': doc['metadata'].get('page', 0),
                'relevance_score': doc['score']
            }
            for doc in retrieved_docs
        ]
        
        return {
            'response': response,
            'sources': sources,
            'user_id': user_id
        }
    except Exception as e:
        raise Exception(f"RAG pipeline failed: {str(e)}")
```

---

### Step 4: Create FastAPI Endpoints

**File**: `ai-service/app/main.py`

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.rag_system import process_query

app = FastAPI(title="Medical AI Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    user_id: str
    conversation_id: str = None

class ChatResponse(BaseModel):
    response: str
    sources: list
    conversation_id: str = None

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat endpoint with RAG"""
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        result = process_query(request.message, request.user_id)
        
        return ChatResponse(
            response=result['response'],
            sources=result['sources'],
            conversation_id=request.conversation_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "ai-medical-chatbot",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
```

---

### Step 5: Django Backend Integration

**File**: `backend/apps/chat/views.py`

```python
import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings

AI_SERVICE_URL = settings.AI_SERVICE_URL

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_with_ai(request):
    """Proxy chat request to AI service"""
    try:
        message = request.data.get('message')
        conversation_id = request.data.get('conversation_id')
        
        # Call AI service
        response = requests.post(
            f"{AI_SERVICE_URL}/chat",
            json={
                'message': message,
                'user_id': str(request.user.id),
                'conversation_id': conversation_id
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            
            # Save to chat history
            save_chat_message(
                user=request.user,
                conversation_id=conversation_id,
                role='user',
                content=message
            )
            save_chat_message(
                user=request.user,
                conversation_id=conversation_id,
                role='assistant',
                content=data['response'],
                sources=data['sources']
            )
            
            return Response(data)
        else:
            return Response(
                {'error': 'AI service error'},
                status=response.status_code
            )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=500
        )
```

---

### Step 6: Frontend Integration

**File**: `frontend/src/pages/ChatbotPage.jsx`

```jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/v1/chat/', {
        message: input,
        conversation_id: 'conv_' + Date.now()
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.response,
        sources: response.data.sources
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-bold">Medical AI Assistant</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p>{msg.content}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 text-xs">
                    <p className="font-semibold">Sources:</p>
                    {msg.sources.map((source, i) => (
                      <p key={i}>• {source.document}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 px-4 py-2 rounded-lg">
                <p className="text-gray-600">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask a medical question..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPage;
```

---

## 🚀 Running the System

### 1. Start AI Service
```bash
cd ai-service
uvicorn app.main:app --reload --port 8001
```

### 2. Start Django Backend
```bash
cd backend
python manage.py runserver 8000
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:5173
- AI Service: http://localhost:8001
- Backend API: http://localhost:8000

---

## 📚 Populating Knowledge Base

**Script**: `ai-service/scripts/populate_knowledge_base.py`

```python
from app.vector_store import upsert_documents
import os
import json

def load_medical_documents(docs_dir):
    """Load medical documents from directory"""
    documents = []
    for filename in os.listdir(docs_dir):
        if filename.endswith('.txt'):
            with open(os.path.join(docs_dir, filename), 'r') as f:
                content = f.read()
                # Split into chunks
                chunks = [content[i:i+500] for i in range(0, len(content), 500)]
                for idx, chunk in enumerate(chunks):
                    documents.append({
                        'id': f"{filename}_{idx}",
                        'text': chunk,
                        'source': filename,
                        'page': idx
                    })
    return documents

if __name__ == "__main__":
    docs = load_medical_documents('./medical_docs')
    count = upsert_documents(docs)
    print(f"Uploaded {count} document chunks to Pinecone")
```

**Run**:
```bash
python scripts/populate_knowledge_base.py
```

---

## 🔗 Related Documentation

- [User Stories](./USER_STORIES.md)
- [API Specification](./API_SPECIFICATION.md)
- [TDD Approach](./TDD.md)
