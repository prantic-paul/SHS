"""RAG (Retrieval-Augmented Generation) System for Medical Chatbot"""

import os
from typing import List, Dict, Any
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from pinecone import Pinecone
from app.config import settings


class MedicalRAGSystem:
    """Medical RAG System using Pinecone and Google Gemini"""
    
    def __init__(self):
        """Initialize the RAG system components"""
        self.embeddings = None
        self.vectorstore = None
        self.retriever = None
        self.rag_chain = None
        self._initialized = False
    
    def initialize(self):
        """Initialize all components of the RAG system"""
        if self._initialized:
            return
        
        print("🚀 Initializing Medical RAG System...")
        
        # Set environment variables for Pinecone
        os.environ["PINECONE_API_KEY"] = settings.PINECONE_API_KEY
        
        # 1. Initialize Pinecone
        print("📊 Connecting to Pinecone...")
        pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        
        # Check if index exists
        index_names = [idx.name for idx in pc.list_indexes()]
        if settings.PINECONE_INDEX_NAME not in index_names:
            raise ValueError(
                f"Index '{settings.PINECONE_INDEX_NAME}' not found. "
                "Please run index_documents.py first to create and populate the index."
            )
        
        # 2. Initialize embeddings
        print(f"🔤 Loading embeddings model: {settings.EMBEDDING_MODEL}...")
        self.embeddings = HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL
        )
        
        # 3. Initialize vector store
        print(f"💾 Connecting to vector store: {settings.PINECONE_INDEX_NAME}...")
        self.vectorstore = PineconeVectorStore.from_existing_index(
            index_name=settings.PINECONE_INDEX_NAME,
            embedding=self.embeddings
        )
        
        # 4. Initialize retriever
        print(f"🔍 Setting up retriever (top-{settings.RETRIEVAL_K} documents)...")
        self.retriever = self.vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": settings.RETRIEVAL_K}
        )
        
        # 5. Initialize LLM
        print(f"🤖 Loading LLM: {settings.LLM_MODEL}...")
        llm = ChatGoogleGenerativeAI(
            model=settings.LLM_MODEL,
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=settings.LLM_TEMPERATURE,
            convert_system_message_to_human=True
        )
        
        # 6. Create RAG chain
        print("⛓️  Building RAG chain...")
        system_prompt = (
            "You are a Medical assistant for question-answering tasks. "
            "Use the following pieces of retrieved context to answer "
            "the question. If you don't know the answer, say that you "
            "don't know. Use three sentences maximum and keep the "
            "answer concise."
            "\n\n"
            "{context}"
        )
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}"),
        ])
        
        question_answer_chain = create_stuff_documents_chain(llm, prompt)
        self.rag_chain = create_retrieval_chain(self.retriever, question_answer_chain)
        
        self._initialized = True
        print("✅ Medical RAG System initialized successfully!\n")
    
    def chat(self, question: str) -> Dict[str, Any]:
        """
        Process a user question and return an answer with sources
        
        Args:
            question: User's medical question
            
        Returns:
            Dictionary containing question, answer, and source documents
        """
        if not self._initialized:
            raise RuntimeError("RAG system not initialized. Call initialize() first.")
        
        # Get response from RAG chain
        response = self.rag_chain.invoke({"input": question})
        
        # Format sources
        sources = []
        for doc in response.get("context", []):
            sources.append({
                "content": doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content,
                "source": doc.metadata.get("source", "Unknown")
            })
        
        return {
            "question": question,
            "answer": response["answer"],
            "sources": sources
        }
    
    def is_ready(self) -> bool:
        """Check if the RAG system is ready"""
        return self._initialized


# Global RAG system instance (singleton pattern)
rag_system = MedicalRAGSystem()
