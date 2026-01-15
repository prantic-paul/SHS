# Sprint 4: AI Medical Chatbot with RAG - User Stories

**Sprint Duration**: January 1-5, 2026  
**Status**: ✅ Completed

---

## 📋 User Stories

### US4.1: AI Medical Chatbot Interface
**As a** patient  
**I want to** ask medical questions to an AI chatbot  
**So that** I can get instant preliminary health advice

**Acceptance Criteria:**
- ✅ Chat interface accessible from navbar
- ✅ Real-time message sending
- ✅ AI responses displayed immediately
- ✅ Chat history preserved during session
- ✅ Clear, user-friendly UI with message bubbles

**Priority**: High  
**Story Points**: 8

---

### US4.2: RAG Implementation with Pinecone
**As a** system  
**I want to** use Retrieval-Augmented Generation  
**So that** chatbot answers are grounded in medical literature

**Acceptance Criteria:**
- ✅ Pinecone vector database integration
- ✅ Medical documents embedded and stored
- ✅ Semantic search retrieves relevant context
- ✅ LangChain orchestrates RAG pipeline
- ✅ Retrieved context fed to LLM

**Priority**: High  
**Story Points**: 13

---

### US4.3: Google Gemini LLM Integration
**As a** system  
**I want to** use Google Gemini for natural language generation  
**So that** responses are accurate and human-like

**Acceptance Criteria:**
- ✅ Google Gemini API integrated
- ✅ gemini-1.5-flash-latest model used
- ✅ Prompt engineering for medical context
- ✅ Response generation under 3 seconds
- ✅ Error handling for API failures

**Priority**: High  
**Story Points**: 8

---

### US4.4: Source Citation
**As a** patient  
**I want to** see sources for AI responses  
**So that** I can verify information credibility

**Acceptance Criteria:**
- ✅ Source documents tracked during retrieval
- ✅ Sources displayed with each response
- ✅ Document names/titles shown
- ✅ Expandable source details
- ✅ Clear attribution

**Priority**: Medium  
**Story Points**: 5

---

### US4.5: Medical Knowledge Base
**As a** system administrator  
**I want to** maintain a curated medical knowledge base  
**So that** the chatbot has reliable information

**Acceptance Criteria:**
- ✅ Medical documents curated and validated
- ✅ Documents embedded using sentence-transformers
- ✅ Embeddings stored in Pinecone
- ✅ Easy to add/update documents
- ✅ Version control for knowledge base

**Priority**: High  
**Story Points**: 8

---

### US4.6: FastAPI Microservice
**As a** system  
**I want** AI functionality in a separate microservice  
**So that** it's scalable and maintainable

**Acceptance Criteria:**
- ✅ FastAPI service independent from Django backend
- ✅ RESTful API for chat endpoint
- ✅ Health check endpoint
- ✅ Proper error handling
- ✅ CORS configuration for frontend access

**Priority**: Medium  
**Story Points**: 5

---

### US4.7: Chat History Persistence
**As a** patient  
**I want** my chat history saved  
**So that** I can refer back to previous conversations

**Acceptance Criteria:**
- ✅ Chat messages stored in database
- ✅ History retrieved on page load
- ✅ User-specific chat history
- ✅ Timestamped messages
- ✅ Clear conversation button

**Priority**: Medium  
**Story Points**: 5

---

## 📊 Sprint Summary

**Total Story Points**: 52  
**Completed Story Points**: 52  
**Sprint Velocity**: 52 points

**Stories Completed**: 7/7  
**Success Rate**: 100%

---

## 🔑 Key Features Delivered

1. ✅ AI chatbot with medical knowledge
2. ✅ RAG using Google Gemini + Pinecone + LangChain
3. ✅ Source citation for transparency
4. ✅ FastAPI microservice architecture
5. ✅ Chat history persistence
6. ✅ Medical knowledge base with embeddings

---

## 🔗 Related Documentation

- [API Specification](./API_SPECIFICATION.md)
- [TDD Approach](./TDD.md)
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md)
