# Testing Guideline: Sprint 04 - AI Chatbot (RAG System)

**Comprehensive Testing Strategy for AI-Powered Medical Chatbot**

---

## 📋 Document Information

| Attribute | Value |
|-----------|-------|
| **Sprint** | Sprint 04 |
| **Feature** | AI Chatbot with RAG |
| **Testing Level** | Unit, Integration, E2E |
| **Last Updated** | January 16, 2026 |

---

## 🎯 Testing Objectives

1. **RAG Pipeline**: Test retrieval-augmented generation workflow
2. **Chat History**: Verify message storage and retrieval
3. **Source Attribution**: Ensure responses include sources
4. **Service Integration**: Test Django ↔ FastAPI communication
5. **Response Quality**: Validate LLM response accuracy

---

## 🧪 Test Levels

### Unit Testing (≥85%)
- ChatMessage model
- Embedding generation
- Vector search
- Prompt building

### Integration Testing (≥85%)
- Django chat API
- FastAPI chat endpoint
- Pinecone integration
- Gemini LLM integration

### E2E Testing
- Complete chat flow
- Multi-turn conversations
- History management

---

## 📋 Test Cases

### TC4.1: ChatMessage Model
```python
def test_chat_message_creation():
    user = create_user(role='PATIENT')
    
    message = ChatMessage.objects.create(
        user=user,
        question='What are symptoms of diabetes?',
        answer='Common symptoms include increased thirst...',
        sources=[{'title': 'Diabetes Guide', 'source': 'medical-db'}]
    )
    
    assert message.user == user
    assert message.question is not None
    assert isinstance(message.sources, list)

def test_chat_history_ordering():
    user = create_user(role='PATIENT')
    
    msg1 = ChatMessage.objects.create(
        user=user,
        question='Q1',
        answer='A1'
    )
    msg2 = ChatMessage.objects.create(
        user=user,
        question='Q2',
        answer='A2'
    )
    
    messages = ChatMessage.objects.filter(user=user)
    assert messages[0].id == msg2.id  # Newest first
```

---

### TC4.2: Django Chat API
**Endpoint**: `POST /api/v1/chat/`

```python
def test_send_chat_message():
    user = create_user(role='PATIENT')
    
    # Mock AI service response
    mock_response = {
        'answer': 'Symptoms of diabetes include...',
        'sources': [{'title': 'Guide', 'source': 'db'}]
    }
    
    with patch('requests.post') as mock_post:
        mock_post.return_value.json.return_value = mock_response
        
        client = APIClient()
        client.force_authenticate(user=user)
        
        response = client.post('/api/v1/chat/', {
            'message': 'What are symptoms of diabetes?'
        })
        
        assert response.status_code == 200
        assert 'answer' in response.data
        assert 'sources' in response.data

def test_chat_requires_authentication():
    client = APIClient()
    
    response = client.post('/api/v1/chat/', {
        'message': 'Test question'
    })
    
    assert response.status_code == 401

def test_chat_saves_to_history():
    user = create_user(role='PATIENT')
    
    mock_response = {
        'answer': 'Test answer',
        'sources': []
    }
    
    with patch('requests.post') as mock_post:
        mock_post.return_value.json.return_value = mock_response
        
        client = APIClient()
        client.force_authenticate(user=user)
        
        client.post('/api/v1/chat/', {
            'message': 'Test question'
        })
        
        assert ChatMessage.objects.filter(
            user=user,
            question='Test question'
        ).exists()
```

---

### TC4.3: Get Chat History
**Endpoint**: `GET /api/v1/chat/history/`

```python
def test_get_chat_history():
    user = create_user(role='PATIENT')
    
    ChatMessage.objects.create(
        user=user,
        question='Q1',
        answer='A1'
    )
    ChatMessage.objects.create(
        user=user,
        question='Q2',
        answer='A2'
    )
    
    client = APIClient()
    client.force_authenticate(user=user)
    
    response = client.get('/api/v1/chat/history/')
    
    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]['question'] == 'Q2'  # Newest first

def test_user_sees_only_own_history():
    user1 = create_user(role='PATIENT', email='u1@test.com')
    user2 = create_user(role='PATIENT', email='u2@test.com')
    
    ChatMessage.objects.create(user=user1, question='Q1', answer='A1')
    ChatMessage.objects.create(user=user2, question='Q2', answer='A2')
    
    client = APIClient()
    client.force_authenticate(user=user1)
    
    response = client.get('/api/v1/chat/history/')
    
    assert len(response.data) == 1
    assert response.data[0]['question'] == 'Q1'
```

---

### TC4.4: Clear Chat History
**Endpoint**: `DELETE /api/v1/chat/history/`

```python
def test_clear_chat_history():
    user = create_user(role='PATIENT')
    
    ChatMessage.objects.create(user=user, question='Q1', answer='A1')
    ChatMessage.objects.create(user=user, question='Q2', answer='A2')
    
    client = APIClient()
    client.force_authenticate(user=user)
    
    response = client.delete('/api/v1/chat/history/')
    
    assert response.status_code == 204
    assert ChatMessage.objects.filter(user=user).count() == 0
```

---

### TC4.5: FastAPI Chat Endpoint
**Service**: `ai-service`
**Endpoint**: `POST /chat`

```python
def test_ai_service_chat():
    from fastapi.testclient import TestClient
    from main import app
    
    client = TestClient(app)
    
    response = client.post('/chat', json={
        'message': 'What is diabetes?'
    })
    
    assert response.status_code == 200
    assert 'answer' in response.json()
    assert 'sources' in response.json()

def test_ai_service_empty_message():
    from fastapi.testclient import TestClient
    from main import app
    
    client = TestClient(app)
    
    response = client.post('/chat', json={
        'message': ''
    })
    
    assert response.status_code == 400
```

---

### TC4.6: RAG Pipeline Components
```python
def test_embedding_generation():
    from sentence_transformers import SentenceTransformer
    
    model = SentenceTransformer('all-MiniLM-L6-v2')
    embedding = model.encode('What is diabetes?')
    
    assert len(embedding) == 384  # Model dimension

def test_pinecone_query():
    # Mock Pinecone query
    with patch('pinecone.Index') as mock_index:
        mock_index.return_value.query.return_value = {
            'matches': [
                {
                    'id': 'doc1',
                    'score': 0.85,
                    'metadata': {
                        'text': 'Diabetes is...',
                        'source': 'medical-db'
                    }
                }
            ]
        }
        
        from app.rag import search_similar_documents
        results = search_similar_documents('diabetes query')
        
        assert len(results) > 0
        assert results[0]['score'] > 0.7

def test_prompt_building():
    context = [
        {'text': 'Diabetes is a metabolic disease...', 'source': 'db1'},
        {'text': 'Treatment includes insulin...', 'source': 'db2'}
    ]
    query = 'What is diabetes?'
    
    from app.rag import build_prompt
    prompt = build_prompt(query, context)
    
    assert 'Diabetes is a metabolic disease' in prompt
    assert 'What is diabetes?' in prompt

def test_llm_response_extraction():
    from app.rag import extract_sources_from_context
    
    context = [
        {'source': 'Medical Guide', 'text': 'Content 1'},
        {'source': 'Health Database', 'text': 'Content 2'}
    ]
    
    sources = extract_sources_from_context(context)
    
    assert len(sources) == 2
    assert sources[0]['source'] == 'Medical Guide'
```

---

### TC4.7: Frontend Chatbot
```javascript
describe('Chatbot Page', () => {
  test('displays chat interface', () => {
    render(<ChatbotPage />);
    expect(screen.getByPlaceholderText(/ask a question/i)).toBeInTheDocument();
    expect(screen.getByText(/send/i)).toBeInTheDocument();
  });

  test('sends message and displays response', async () => {
    axios.post.mockResolvedValue({
      data: {
        answer: 'Diabetes is a metabolic disease...',
        sources: [{ title: 'Medical Guide' }]
      }
    });
    
    render(<ChatbotPage />);
    
    const input = screen.getByPlaceholderText(/ask a question/i);
    fireEvent.change(input, { target: { value: 'What is diabetes?' } });
    
    const sendButton = screen.getByText(/send/i);
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Diabetes is a metabolic disease/i))
        .toBeInTheDocument();
    });
  });

  test('displays sources', async () => {
    axios.post.mockResolvedValue({
      data: {
        answer: 'Test answer',
        sources: [
          { title: 'Medical Guide', source: 'db1' },
          { title: 'Health Database', source: 'db2' }
        ]
      }
    });
    
    render(<ChatbotPage />);
    
    // Send message
    fireEvent.change(screen.getByPlaceholderText(/ask a question/i), {
      target: { value: 'Test' }
    });
    fireEvent.click(screen.getByText(/send/i));
    
    await waitFor(() => {
      expect(screen.getByText('Medical Guide')).toBeInTheDocument();
      expect(screen.getByText('Health Database')).toBeInTheDocument();
    });
  });

  test('loads chat history on mount', async () => {
    const mockHistory = [
      { question: 'Q1', answer: 'A1', sources: [] },
      { question: 'Q2', answer: 'A2', sources: [] }
    ];
    
    axios.get.mockResolvedValue({ data: mockHistory });
    
    render(<ChatbotPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Q1')).toBeInTheDocument();
      expect(screen.getByText('A1')).toBeInTheDocument();
    });
  });

  test('clears chat history', async () => {
    axios.delete.mockResolvedValue({ status: 204 });
    
    render(<ChatbotPage />);
    
    const clearButton = screen.getByText(/clear history/i);
    fireEvent.click(clearButton);
    
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith('/api/v1/chat/history/');
    });
  });
});
```

---

### TC4.8: Multi-Turn Conversations
```javascript
test('handles multi-turn conversation', async () => {
  const responses = [
    { answer: 'Diabetes is a metabolic disease...', sources: [] },
    { answer: 'Symptoms include increased thirst...', sources: [] }
  ];
  
  axios.post
    .mockResolvedValueOnce({ data: responses[0] })
    .mockResolvedValueOnce({ data: responses[1] });
  
  render(<ChatbotPage />);
  
  // First message
  fireEvent.change(screen.getByPlaceholderText(/ask/i), {
    target: { value: 'What is diabetes?' }
  });
  fireEvent.click(screen.getByText(/send/i));
  
  await waitFor(() => {
    expect(screen.getByText(/metabolic disease/i)).toBeInTheDocument();
  });
  
  // Second message
  fireEvent.change(screen.getByPlaceholderText(/ask/i), {
    target: { value: 'What are the symptoms?' }
  });
  fireEvent.click(screen.getByText(/send/i));
  
  await waitFor(() => {
    expect(screen.getByText(/increased thirst/i)).toBeInTheDocument();
  });
});
```

---

## 🔧 Tools & Setup

### Backend
```bash
pytest backend/apps/chat/tests/ -v --cov
```

### AI Service
```bash
cd ai-service
pytest tests/ -v
```

### Frontend
```bash
npm test -- --testPathPattern=Chatbot
```

---

## 📊 Coverage Requirements

| Component | Target |
|-----------|--------|
| Chat Models | ≥90% |
| Django APIs | ≥85% |
| AI Service | ≥85% |
| Frontend | ≥75% |

---

## ✅ Execution Checklist

- [ ] Chat message storage tested
- [ ] RAG pipeline tested
- [ ] Source attribution verified
- [ ] History management tested
- [ ] Multi-turn conversations tested
- [ ] Error handling validated

---

## 🔗 Related Documentation

- [User Stories](./USER_STORIES.md)
- [API Specification](./API_SPECIFICATION.md)
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md)
