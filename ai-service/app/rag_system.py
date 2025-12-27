"""
RAG System for Medical Chatbot
Handles document loading, embedding, and retrieval
"""
import os
from typing import List
from langchain.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from pinecone import Pinecone, ServerlessSpec

from app.config import settings


class MedicalRAGSystem:
    """Medical RAG System for chatbot"""
    
    def __init__(self):
        """Initialize RAG system components"""
        self.embedding = None
        self.docsearch = None
        self.retriever = None
        self.rag_chain = None
        self.pc = None
        self.index = None
        
    def initialize(self):
        """Initialize all components"""
        print("🚀 Initializing Medical RAG System...")
        
        # Initialize embeddings
        print("📦 Loading embedding model...")
        self.embedding = self._load_embeddings()
        
        # Initialize Pinecone
        print("🔗 Connecting to Pinecone...")
        self._initialize_pinecone()
        
        # Initialize vector store
        print("🗄️ Loading vector store...")
        self._initialize_vectorstore()
        
        # Initialize RAG chain
        print("⚙️ Setting up RAG chain...")
        self._initialize_rag_chain()
        
        print("✅ Medical RAG System initialized successfully!")
        
    def _load_embeddings(self) -> HuggingFaceEmbeddings:
        """Load HuggingFace embeddings model"""
        return HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL
        )
    
    def _initialize_pinecone(self):
        """Initialize Pinecone connection and index"""
        self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        
        # Create index if it doesn't exist
        if not self.pc.has_index(settings.PINECONE_INDEX_NAME):
            print(f"⚠️ Index '{settings.PINECONE_INDEX_NAME}' not found. Creating...")
            self.pc.create_index(
                name=settings.PINECONE_INDEX_NAME,
                dimension=settings.PINECONE_DIMENSION,
                metric=settings.PINECONE_METRIC,
                spec=ServerlessSpec(
                    cloud=settings.PINECONE_CLOUD,
                    region=settings.PINECONE_REGION
                )
            )
        
        self.index = self.pc.Index(settings.PINECONE_INDEX_NAME)
    
    def _initialize_vectorstore(self):
        """Initialize vector store from existing Pinecone index"""
        self.docsearch = PineconeVectorStore.from_existing_index(
            index_name=settings.PINECONE_INDEX_NAME,
            embedding=self.embedding
        )
        
        self.retriever = self.docsearch.as_retriever(
            search_type="similarity",
            search_kwargs={"k": settings.TOP_K_RESULTS}
        )
    
    def _initialize_rag_chain(self):
        """Initialize RAG chain with LLM"""
        # Initialize Gemini LLM
        chat_model = ChatGoogleGenerativeAI(
            model=settings.LLM_MODEL,
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=settings.LLM_TEMPERATURE,
            convert_system_message_to_human=True
        )
        
        # Create prompt template
        system_prompt = (
            "You are a knowledgeable Medical Assistant designed to help users with medical questions. "
            "Use the following retrieved medical context to answer the user's question accurately. "
            "If you don't know the answer based on the context, say that you don't know and recommend "
            "consulting a healthcare professional. Keep your answers clear, concise, and helpful. "
            "Always prioritize patient safety in your responses."
            "\n\n"
            "Context: {context}"
        )
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}"),
        ])
        
        # Create chains
        question_answer_chain = create_stuff_documents_chain(chat_model, prompt)
        self.rag_chain = create_retrieval_chain(self.retriever, question_answer_chain)
    
    def query(self, question: str) -> dict:
        """
        Query the RAG system with a medical question
        
        Args:
            question: User's medical question
            
        Returns:
            Dictionary with answer and sources
        """
        if not self.rag_chain:
            raise RuntimeError("RAG system not initialized. Call initialize() first.")
        
        response = self.rag_chain.invoke({"input": question})
        
        # Extract sources from retrieved documents
        sources = []
        if "context" in response:
            for doc in response["context"]:
                if hasattr(doc, "metadata") and "source" in doc.metadata:
                    source = doc.metadata["source"]
                    if source not in sources:
                        sources.append(source)
        
        return {
            "answer": response["answer"],
            "sources": sources
        }
    
    def health_check(self) -> dict:
        """Check system health"""
        return {
            "embedding_loaded": self.embedding is not None,
            "pinecone_connected": self.pc is not None,
            "vectorstore_ready": self.docsearch is not None,
            "rag_chain_ready": self.rag_chain is not None
        }
    
    @staticmethod
    def load_and_index_documents(data_path: str = None):
        """
        Load PDF documents and index them to Pinecone
        This should be run once during setup
        """
        if data_path is None:
            data_path = settings.DATA_PATH
        
        print(f"📂 Loading documents from {data_path}...")
        
        # Load PDF files
        loader = DirectoryLoader(
            data_path,
            glob="*.pdf",
            loader_cls=PyPDFLoader
        )
        documents = loader.load()
        print(f"✅ Loaded {len(documents)} documents")
        
        # Filter to minimal metadata
        minimal_docs = []
        for doc in documents:
            src = doc.metadata.get("source")
            minimal_docs.append(
                Document(
                    page_content=doc.page_content,
                    metadata={"source": src}
                )
            )
        
        # Split documents
        print("✂️ Splitting documents into chunks...")
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
        )
        text_chunks = text_splitter.split_documents(minimal_docs)
        print(f"✅ Created {len(text_chunks)} chunks")
        
        # Load embeddings
        print("📦 Loading embeddings...")
        embeddings = HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL
        )
        
        # Initialize Pinecone
        print("🔗 Connecting to Pinecone...")
        pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        
        # Create index if needed
        if not pc.has_index(settings.PINECONE_INDEX_NAME):
            print(f"📊 Creating index '{settings.PINECONE_INDEX_NAME}'...")
            pc.create_index(
                name=settings.PINECONE_INDEX_NAME,
                dimension=settings.PINECONE_DIMENSION,
                metric=settings.PINECONE_METRIC,
                spec=ServerlessSpec(
                    cloud=settings.PINECONE_CLOUD,
                    region=settings.PINECONE_REGION
                )
            )
        
        # Index documents
        print("🚀 Indexing documents to Pinecone...")
        PineconeVectorStore.from_documents(
            documents=text_chunks,
            embedding=embeddings,
            index_name=settings.PINECONE_INDEX_NAME
        )
        
        print("✅ Documents indexed successfully!")


# Global RAG system instance
rag_system = MedicalRAGSystem()
