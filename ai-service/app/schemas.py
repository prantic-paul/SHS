"""
Pydantic models for request/response validation
"""
from typing import List, Optional
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    """Single chat message"""
    role: str = Field(..., description="Role of the message sender (user/assistant)")
    content: str = Field(..., description="Content of the message")


class ChatRequest(BaseModel):
    """Request model for chat endpoint"""
    message: str = Field(..., description="User's medical question", min_length=1)
    conversation_history: Optional[List[ChatMessage]] = Field(
        default=[],
        description="Previous conversation history"
    )
    user_id: Optional[str] = Field(None, description="User ID for tracking")


class ChatResponse(BaseModel):
    """Response model for chat endpoint"""
    answer: str = Field(..., description="AI-generated answer")
    sources: List[str] = Field(default=[], description="Source documents used")
    confidence: Optional[float] = Field(None, description="Confidence score")


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    service: str
    pinecone_connected: bool
    embedding_model_loaded: bool
