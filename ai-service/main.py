"""
Medical Chatbot AI Service - FastAPI Application
"""
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.config import settings
from app.schemas import ChatRequest, ChatResponse, HealthResponse
from app.rag_system import rag_system


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events for startup and shutdown"""
    # Startup
    print("🚀 Starting Medical Chatbot AI Service...")
    try:
        rag_system.initialize()
        print("✅ Service ready!")
    except Exception as e:
        print(f"❌ Failed to initialize: {e}")
        raise
    
    yield
    
    # Shutdown
    print("👋 Shutting down Medical Chatbot AI Service...")


# Create FastAPI app
app = FastAPI(
    title="Medical Chatbot AI Service",
    description="AI-powered medical chatbot with RAG system using Pinecone and Google Gemini",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "message": "Medical Chatbot AI Service",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint"""
    health = rag_system.health_check()
    
    return HealthResponse(
        status="healthy" if all(health.values()) else "degraded",
        service="medical-chatbot-ai",
        pinecone_connected=health["pinecone_connected"],
        embedding_model_loaded=health["embedding_loaded"]
    )


@app.post("/api/chat", response_model=ChatResponse, tags=["Chat"])
async def chat(request: ChatRequest):
    """
    Chat endpoint for medical questions
    
    Args:
        request: ChatRequest with user's message
        
    Returns:
        ChatResponse with AI-generated answer and sources
    """
    try:
        # Query RAG system
        result = rag_system.query(request.message)
        
        return ChatResponse(
            answer=result["answer"],
            sources=result["sources"],
            confidence=None  # Can be enhanced with confidence scoring
        )
        
    except Exception as e:
        print(f"❌ Error processing chat request: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process request: {str(e)}"
        )


@app.post("/api/index-documents", tags=["Admin"])
async def index_documents():
    """
    Index documents from data directory to Pinecone
    This should be called once during setup or when documents are updated
    """
    try:
        rag_system.load_and_index_documents()
        return {
            "success": True,
            "message": "Documents indexed successfully"
        }
    except Exception as e:
        print(f"❌ Error indexing documents: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to index documents: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
