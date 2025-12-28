"""Script to index medical documents into Pinecone vector database"""

import os
from typing import List
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec

# Load environment variables
load_dotenv()

# Configuration
DATA_DIR = "data"
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "medical-chatbot")
PINECONE_CLOUD = os.getenv("PINECONE_CLOUD", "aws")
PINECONE_REGION = os.getenv("PINECONE_REGION", "us-east-1")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
EMBEDDING_DIMENSION = int(os.getenv("EMBEDDING_DIMENSION", "384"))


def load_pdf_files(data_dir: str) -> List[Document]:
    """Load PDF files from directory"""
    print(f"📂 Loading PDF files from: {data_dir}")
    
    loader = DirectoryLoader(
        data_dir,
        glob="*.pdf",
        loader_cls=PyPDFLoader
    )
    
    documents = loader.load()
    print(f"✅ Loaded {len(documents)} pages from PDF files")
    
    return documents


def filter_to_minimal_docs(docs: List[Document]) -> List[Document]:
    """Filter documents to keep only essential metadata"""
    print("🔧 Filtering documents to minimal metadata...")
    
    minimal_docs: List[Document] = []
    for doc in docs:
        src = doc.metadata.get("source", "Unknown")
        minimal_docs.append(
            Document(
                page_content=doc.page_content,
                metadata={"source": src}
            )
        )
    
    return minimal_docs


def split_documents(documents: List[Document]) -> List[Document]:
    """Split documents into smaller chunks"""
    print("✂️  Splitting documents into chunks...")
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=20,
    )
    
    chunks = text_splitter.split_documents(documents)
    print(f"✅ Created {len(chunks)} chunks")
    
    return chunks


def initialize_embeddings():
    """Initialize HuggingFace embeddings"""
    print(f"🔤 Loading embeddings model: {EMBEDDING_MODEL}...")
    
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL
    )
    
    print("✅ Embeddings model loaded")
    return embeddings


def create_or_get_pinecone_index(pc: Pinecone):
    """Create Pinecone index if it doesn't exist"""
    print(f"📊 Checking Pinecone index: {PINECONE_INDEX_NAME}...")
    
    # Get list of existing indexes
    index_names = [idx.name for idx in pc.list_indexes()]
    
    if PINECONE_INDEX_NAME not in index_names:
        print(f"🆕 Creating new index: {PINECONE_INDEX_NAME}...")
        pc.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=EMBEDDING_DIMENSION,
            metric="cosine",
            spec=ServerlessSpec(
                cloud=PINECONE_CLOUD,
                region=PINECONE_REGION
            )
        )
        print(f"✅ Index '{PINECONE_INDEX_NAME}' created successfully")
    else:
        print(f"✅ Index '{PINECONE_INDEX_NAME}' already exists")
    
    return pc.Index(PINECONE_INDEX_NAME)


def index_documents(chunks: List[Document], embeddings):
    """Index documents into Pinecone"""
    print(f"💾 Indexing {len(chunks)} chunks into Pinecone...")
    
    # Initialize Pinecone
    pc = Pinecone(api_key=PINECONE_API_KEY)
    
    # Create or get index
    index = create_or_get_pinecone_index(pc)
    
    # Create vector store and upload documents
    print("⬆️  Uploading documents to Pinecone...")
    docsearch = PineconeVectorStore.from_documents(
        documents=chunks,
        embedding=embeddings,
        index_name=PINECONE_INDEX_NAME
    )
    
    print("✅ Documents indexed successfully!")
    return docsearch


def main():
    """Main function to index documents"""
    print("\n" + "="*60)
    print("📚 Medical Document Indexing Pipeline")
    print("="*60 + "\n")
    
    try:
        # 1. Load PDF files
        documents = load_pdf_files(DATA_DIR)
        
        # 2. Filter to minimal metadata
        minimal_docs = filter_to_minimal_docs(documents)
        
        # 3. Split into chunks
        chunks = split_documents(minimal_docs)
        
        # 4. Initialize embeddings
        embeddings = initialize_embeddings()
        
        # 5. Index documents
        index_documents(chunks, embeddings)
        
        print("\n" + "="*60)
        print("🎉 Indexing Complete!")
        print("="*60)
        print(f"✅ Total pages processed: {len(documents)}")
        print(f"✅ Total chunks created: {len(chunks)}")
        print(f"✅ Index name: {PINECONE_INDEX_NAME}")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error during indexing: {e}")
        raise


if __name__ == "__main__":
    main()
