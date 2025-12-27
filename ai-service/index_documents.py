"""
Script to index documents to Pinecone
Run this once during setup or when documents are updated
"""
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.rag_system import MedicalRAGSystem
from app.config import settings


def main():
    """Index documents to Pinecone"""
    print("=" * 60)
    print("📊 Medical Chatbot - Document Indexing")
    print("=" * 60)
    print()
    
    try:
        # Set environment variables
        os.environ["PINECONE_API_KEY"] = settings.PINECONE_API_KEY
        os.environ["GOOGLE_API_KEY"] = settings.GOOGLE_API_KEY
        
        # Index documents
        MedicalRAGSystem.load_and_index_documents(settings.DATA_PATH)
        
        print()
        print("=" * 60)
        print("✅ Document indexing completed successfully!")
        print("=" * 60)
        print()
        print("Next step: Start the service with 'python main.py'")
        
    except Exception as e:
        print()
        print("=" * 60)
        print(f"❌ Error: {e}")
        print("=" * 60)
        sys.exit(1)


if __name__ == "__main__":
    main()
