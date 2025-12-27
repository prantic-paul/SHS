# AI Service - Medical Chatbot with RAG System

This directory contains the AI/ML service for Smart Health Synchronizer's intelligent medical chatbot powered by RAG (Retrieval Augmented Generation) using Pinecone vector database and Google Gemini LLM.

## 🎯 Features

- **RAG-Powered Responses**: Retrieves relevant medical information from indexed documents
- **Google Gemini Integration**: Uses Gemini 1.5 Flash for fast, accurate responses
- **Vector Search**: Pinecone vector database for efficient similarity search
- **FastAPI Backend**: High-performance async API
- **Medical Knowledge Base**: Built on medical literature (PDF documents)
- **RESTful API**: Easy integration with frontend applications

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Pinecone account and API key
- Google AI API key (for Gemini)

### Installation

```bash
# 1. Navigate to ai-service directory
cd ai-service

# 2. Run setup script
chmod +x setup.sh
./setup.sh

# 3. Activate virtual environment
source venv/bin/activate

# 4. Update .env file with your API keys
nano .env  # or use any text editor
```

### Configuration

Update `.env` file with your credentials:

```bash
# API Keys (Required)
PINECONE_API_KEY=your_pinecone_api_key
GOOGLE_API_KEY=your_google_api_key

# Service Configuration
DEBUG=True
HOST=0.0.0.0
PORT=8001

# Backend API URL
BACKEND_API_URL=http://localhost:8000/api
```

### Index Documents (First Time Setup)

Before starting the service, index your medical documents:

```bash
# This will process PDFs from the data/ directory and index them to Pinecone
python index_documents.py
```

### Start the Service

```bash
# Start FastAPI service
python main.py

# Or with uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

The service will be available at: `http://localhost:8001`

## 📁 Project Structure

```
ai-service/
├── app/                      # Application package
│   ├── __init__.py
│   ├── config.py            # Configuration settings
│   ├── schemas.py           # Pydantic models
│   └── rag_system.py        # RAG system implementation
│
├── data/                    # Medical documents (PDFs)
│   └── Medical_book.pdf
│
├── chatbot.ipynb           # Jupyter notebook for experimentation
├── main.py                 # FastAPI application entry point
├── index_documents.py      # Script to index documents to Pinecone
├── setup.sh               # Setup script
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
└── README.md             # This file
```

## 📡 API Endpoints

### 1. Root Endpoint
```http
GET /
```
Returns service information and status.

### 2. Health Check
```http
GET /health
```
Returns service health status including Pinecone connection and model status.

**Response:**
```json
{
  "status": "healthy",
  "service": "medical-chatbot-ai",
  "pinecone_connected": true,
  "embedding_model_loaded": true
}
```

### 3. Chat Endpoint
```http
POST /api/chat
```

Send medical questions and get AI-powered responses.

**Request Body:**
```json
{
  "message": "What is diabetes and what are its symptoms?",
  "conversation_history": [],
  "user_id": "optional_user_id"
}
```

**Response:**
```json
{
  "answer": "Diabetes is a chronic condition...",
  "sources": ["data/Medical_book.pdf"],
  "confidence": null
}
```

### 4. Index Documents (Admin)
```http
POST /api/index-documents
```

Re-index documents from the data directory. Use this when adding new documents.

## 🔧 Integration with Your Project

### Option 1: Direct API Integration (Recommended)

#### Backend Integration (Django/FastAPI)

Add this service configuration to your Django settings or backend:

```python
# settings.py or config.py
AI_SERVICE_URL = "http://localhost:8001"
AI_SERVICE_ENABLED = True
```

Create a service client:

```python
# backend/services/ai_chatbot.py
import requests
from django.conf import settings

class AIChatbotService:
    """Service to communicate with AI chatbot microservice"""
    
    def __init__(self):
        self.base_url = settings.AI_SERVICE_URL
    
    def chat(self, message: str, user_id: str = None):
        """Send message to chatbot"""
        try:
            response = requests.post(
                f"{self.base_url}/api/chat",
                json={
                    "message": message,
                    "user_id": user_id
                },
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            return {
                "error": str(e),
                "answer": "Sorry, the AI service is currently unavailable."
            }
    
    def health_check(self):
        """Check AI service health"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=5)
            return response.json()
        except:
            return {"status": "unavailable"}

# Usage
chatbot = AIChatbotService()
result = chatbot.chat("What is hypertension?")
print(result["answer"])
```

#### Add Django View/Endpoint

```python
# backend/apps/chat/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from services.ai_chatbot import AIChatbotService

class MedicalChatView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        message = request.data.get('message')
        
        if not message:
            return Response(
                {"error": "Message is required"}, 
                status=400
            )
        
        # Call AI service
        chatbot = AIChatbotService()
        result = chatbot.chat(
            message=message,
            user_id=str(request.user.user_id)
        )
        
        return Response(result)

# urls.py
from django.urls import path
from apps.chat.views import MedicalChatView

urlpatterns = [
    path('api/v1/chat/medical/', MedicalChatView.as_view()),
]
```

#### Frontend Integration (React)

Create a chatbot service:

```javascript
// frontend/src/services/chatbotService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const chatbotService = {
  /**
   * Send message to medical chatbot
   */
  async sendMessage(message) {
    try {
      const response = await axios.post(
        `${API_URL}/chat/medical/`,
        { message },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Check AI service health
   */
  async checkHealth() {
    try {
      const response = await axios.get('http://localhost:8001/health');
      return response.data;
    } catch (error) {
      return { status: 'unavailable' };
    }
  }
};
```

Create a chatbot component:

```javascript
// frontend/src/components/MedicalChatbot.jsx
import { useState } from 'react';
import { chatbotService } from '../services/chatbotService';
import { FiSend, FiMessageSquare } from 'react-icons/fi';

const MedicalChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatbotService.sendMessage(input);
      const botMessage = {
        role: 'assistant',
        content: response.answer,
        sources: response.sources
      };
      setMessages(prev => [...prev, botMessage]);
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
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 rounded-t-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FiMessageSquare /> Medical Assistant
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p>{msg.content}</p>
              {msg.sources && msg.sources.length > 0 && (
                <p className="text-xs mt-2 opacity-75">
                  Sources: {msg.sources.join(', ')}
                </p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask a medical question..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalChatbot;
```

Add to your page:

```javascript
// frontend/src/pages/ChatPage.jsx
import MedicalChatbot from '../components/MedicalChatbot';

const ChatPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Medical Assistant</h1>
      <MedicalChatbot />
    </div>
  );
};

export default ChatPage;
```

### Option 2: Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "main.py"]
```

Add to `docker-compose.yml`:

```yaml
services:
  ai-service:
    build: ./ai-service
    ports:
      - "8001:8001"
    environment:
      - PINECONE_API_KEY=${PINECONE_API_KEY}
      - GOOGLE_API_KEY=${GOOGLE_API_KEY}
      - BACKEND_API_URL=http://backend:8000/api
    volumes:
      - ./ai-service/data:/app/data
```

## 🧪 Testing

Test the API using curl:

```bash
# Health check
curl http://localhost:8001/health

# Chat request
curl -X POST http://localhost:8001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the symptoms of diabetes?"
  }'
```

## 📝 Adding New Documents

1. Place PDF files in the `data/` directory
2. Run the indexing script:
   ```bash
   python index_documents.py
   ```
3. Restart the service

## 🔍 Troubleshooting

### Service won't start
- Check if all API keys are set in `.env`
- Verify Python version (3.9+)
- Check if port 8001 is available

### Pinecone connection errors
- Verify API key is correct
- Check internet connection
- Ensure index name matches configuration

### Poor response quality
- Add more relevant documents to `data/`
- Adjust chunk size in config
- Increase `TOP_K_RESULTS` for more context

## 📚 Tech Stack

- **FastAPI**: Web framework
- **LangChain**: RAG orchestration
- **Pinecone**: Vector database
- **Google Gemini**: LLM
- **HuggingFace**: Embeddings
- **PyPDF**: PDF processing

## 🔐 Security Notes

- Never commit `.env` file
- Use environment variables for API keys
- Enable authentication in production
- Update CORS settings for production

## 📄 License

Part of Smart Health Synchronizer project.

## 🛠️ Technologies

- **FastAPI**: Web framework for APIs
- **scikit-learn**: Machine learning library
- **pandas**: Data manipulation
- **numpy**: Numerical computing
- **spaCy / transformers**: NLP (Natural Language Processing)
- **pydantic**: Data validation
- **uvicorn**: ASGI server

## 📝 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Service Configuration
SERVICE_HOST=0.0.0.0
SERVICE_PORT=8001
DEBUG=True

# Model Configuration
MODEL_PATH=models/trained_models/
CONFIDENCE_THRESHOLD=0.7

# API Keys (if needed)
OPENAI_API_KEY=your-key-here  # If using external APIs
```

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Test specific functionality
pytest tests/test_symptom_analyzer.py
```

## 🤖 Features

### 1. Symptom Analysis
- Natural language understanding of patient symptoms
- Severity assessment
- Preliminary condition identification

### 2. Doctor Recommendation
- Match symptoms to medical specialties
- Recommend appropriate doctors
- Consider location, ratings, and availability

### 3. Health Risk Prediction
- Analyze health metrics
- Predict potential health risks
- Provide preventive recommendations

## 📊 API Endpoints

Once the service is running, visit:
- API Documentation: `http://localhost:8001/docs`
- ReDoc: `http://localhost:8001/redoc`

### Example Endpoints

```python
# POST /analyze-symptoms
{
  "symptoms": ["headache", "fever", "cough"],
  "severity": "moderate",
  "duration": "3 days"
}

# Response
{
  "possible_conditions": [
    {"name": "Common Cold", "confidence": 0.85},
    {"name": "Flu", "confidence": 0.65}
  ],
  "recommended_specialties": ["General Physician", "Internal Medicine"],
  "severity_level": "moderate",
  "requires_immediate_attention": false
}
```

```python
# POST /recommend-doctors
{
  "specialty": "Cardiologist",
  "location": "New York",
  "symptoms": ["chest pain", "shortness of breath"]
}

# Response
{
  "doctors": [
    {
      "id": 123,
      "name": "Dr. Smith",
      "specialty": "Cardiology",
      "rating": 4.8,
      "match_score": 0.92
    }
  ]
}
```

## 🔧 Development

```bash
# Run development server with auto-reload
uvicorn main:app --reload --port 8001

# Run in production mode
uvicorn main:app --host 0.0.0.0 --port 8001

# Train models
python scripts/train_models.py

# Update training data
python scripts/update_data.py
```

## 📦 Key Dependencies

```
fastapi>=0.104.0
uvicorn>=0.24.0
pydantic>=2.5.0
scikit-learn>=1.3.0
pandas>=2.1.0
numpy>=1.24.0
spacy>=3.7.0
python-multipart>=0.0.6
```

## 🎯 Model Training

```python
# Example: Training symptom analyzer
from models.symptom_analyzer import SymptomAnalyzer

# Load training data
data = load_training_data('data/training/symptoms.csv')

# Initialize and train model
analyzer = SymptomAnalyzer()
analyzer.train(data)

# Save model
analyzer.save('models/trained_models/symptom_analyzer.pkl')

# Evaluate
accuracy = analyzer.evaluate(test_data)
print(f"Model Accuracy: {accuracy:.2f}")
```

## 🔐 Security Considerations

- Input validation with Pydantic
- Rate limiting for API endpoints
- API key authentication (if needed)
- Data sanitization
- Error handling without exposing internals

## 📈 Performance

- Response time: < 200ms for symptom analysis
- Concurrent requests: 100+ (with proper scaling)
- Model accuracy: > 85% for common conditions
- Caching: Redis for frequent queries

## 🚀 Coming Soon

This directory will be set up in Sprint 6 with:
- FastAPI service initialization
- ML models for symptom analysis
- Doctor recommendation engine
- NLP processing
- API endpoints
- Tests and documentation

Stay tuned! 🎉

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [scikit-learn Guide](https://scikit-learn.org/)
- [spaCy Documentation](https://spacy.io/)
