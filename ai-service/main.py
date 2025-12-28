"""FastAPI Medical Chatbot Service"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.schemas import ChatRequest, ChatResponse, HealthCheckResponse, SourceDocument
from app.rag_system import rag_system
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("\n" + "="*60)
    print("🏥 Medical Chatbot Service Starting...")
    print("="*60 + "\n")
    
    try:
        rag_system.initialize()
    except Exception as e:
        print(f"❌ Failed to initialize RAG system: {e}")
        raise
    
    yield
    
    # Shutdown
    print("\n" + "="*60)
    print("👋 Medical Chatbot Service Shutting Down...")
    print("="*60 + "\n")


# Initialize FastAPI app
app = FastAPI(
    title="Medical Chatbot API",
    description="AI-powered medical chatbot using RAG (Retrieval-Augmented Generation)",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "message": "Medical Chatbot API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health", response_model=HealthCheckResponse, tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return HealthCheckResponse(
        status="healthy" if rag_system.is_ready() else "unhealthy",
        rag_system="ready" if rag_system.is_ready() else "not ready",
        index_name=settings.PINECONE_INDEX_NAME
    )


@app.post("/chat", response_model=ChatResponse, tags=["Chat"])
async def chat(request: ChatRequest):
    """
    Chat endpoint - Ask medical questions and get AI-powered answers
    
    This endpoint uses RAG (Retrieval-Augmented Generation) to provide
    accurate medical information based on the indexed medical documents.
    """
    try:
        if not rag_system.is_ready():
            raise HTTPException(
                status_code=503,
                detail="RAG system is not ready. Please try again later."
            )
        
        # Process the question
        result = rag_system.chat(request.question)
        
        # Format response
        response = ChatResponse(
            question=result["question"],
            answer=result["answer"],
            sources=[
                SourceDocument(
                    content=source["content"],
                    source=source["source"]
                )
                for source in result["sources"]
            ]
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing chat request: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True
    )
