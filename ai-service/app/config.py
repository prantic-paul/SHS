"""
Configuration settings for AI Service
"""
import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    
    # Service Configuration
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    
    # API Keys
    PINECONE_API_KEY: str
    GOOGLE_API_KEY: str
    
    # Model Configuration
    CONFIDENCE_THRESHOLD: float = 0.7
    
    # Backend API URL
    BACKEND_API_URL: str = "http://localhost:8000/api"
    
    # Pinecone Configuration
    PINECONE_INDEX_NAME: str = "medical-chatbot"
    PINECONE_DIMENSION: int = 384
    PINECONE_METRIC: str = "cosine"
    PINECONE_CLOUD: str = "aws"
    PINECONE_REGION: str = "us-east-1"
    
    # Embedding Model
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    
    # LLM Configuration
    LLM_MODEL: str = "gemini-1.5-flash"
    LLM_TEMPERATURE: float = 0.3
    
    # RAG Configuration
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 20
    TOP_K_RESULTS: int = 3
    
    # Data Path
    DATA_PATH: str = "data"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
