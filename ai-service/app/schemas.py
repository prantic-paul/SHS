"""Pydantic schemas for request/response models"""

from pydantic import BaseModel, Field
from typing import List, Optional


class ChatRequest(BaseModel):
    """Request model for chat endpoint"""
    question: str = Field(..., description="User's medical question", min_length=1)
    
    class Config:
        json_schema_extra = {
            "example": {
                "question": "What is diabetes and how to manage it?"
            }
        }


class SourceDocument(BaseModel):
    """Source document information"""
    content: str
    source: str


class ChatResponse(BaseModel):
    """Response model for chat endpoint"""
    question: str
    answer: str
    sources: List[SourceDocument]
    
    class Config:
        json_schema_extra = {
            "example": {
                "question": "What is diabetes?",
                "answer": "Diabetes is a chronic condition...",
                "sources": [
                    {
                        "content": "Diabetes mellitus is...",
                        "source": "Medical_book.pdf"
                    }
                ]
            }
        }


class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str
    rag_system: str
    index_name: str
