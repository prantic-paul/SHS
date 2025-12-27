#!/bin/bash

# Medical Chatbot AI Service - Quick Install & Test Script
# This script sets up and tests the AI service

set -e  # Exit on error

echo "════════════════════════════════════════════════════════════════"
echo "   Medical Chatbot AI Service - Installation & Setup"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo -e "${RED}❗ IMPORTANT: You must update .env with your API keys!${NC}"
    echo ""
    echo "Required API keys:"
    echo "  1. PINECONE_API_KEY - Get from https://www.pinecone.io/"
    echo "  2. GOOGLE_API_KEY - Get from https://makersuite.google.com/app/apikey"
    echo ""
    read -p "Press Enter after you've updated the .env file..."
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${GREEN}📦 Creating virtual environment...${NC}"
    python3 -m venv venv
else
    echo -e "${GREEN}✅ Virtual environment already exists${NC}"
fi

# Activate virtual environment
echo -e "${GREEN}🔧 Activating virtual environment...${NC}"
source venv/bin/activate

# Upgrade pip
echo -e "${GREEN}⬆️  Upgrading pip...${NC}"
pip install --upgrade pip --quiet

# Install requirements
echo -e "${GREEN}📚 Installing requirements (this may take a few minutes)...${NC}"
pip install -r requirements.txt --quiet

# Check if documents need to be indexed
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "   Document Indexing"
echo "════════════════════════════════════════════════════════════════"
echo ""
read -p "Do you want to index documents to Pinecone? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}🚀 Indexing documents...${NC}"
    python index_documents.py
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Documents indexed successfully!${NC}"
    else
        echo -e "${RED}❌ Error indexing documents. Please check your API keys and try again.${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⏭️  Skipping document indexing${NC}"
    echo "Note: You must index documents before the service can work properly."
fi

# Start the service
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "   Starting Service"
echo "════════════════════════════════════════════════════════════════"
echo ""
read -p "Do you want to start the service now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}🚀 Starting Medical Chatbot AI Service...${NC}"
    echo ""
    echo "Service will be available at: http://localhost:8001"
    echo "Press Ctrl+C to stop the service"
    echo ""
    python main.py
else
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo -e "${GREEN}✅ Setup Complete!${NC}"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "Next steps:"
    echo "  1. Activate virtual environment: source venv/bin/activate"
    echo "  2. Start the service: python main.py"
    echo "  3. Run tests: python test_service.py"
    echo ""
    echo "Documentation:"
    echo "  • Quick Start: QUICKSTART.md"
    echo "  • Full Docs: README.md"
    echo "  • Integration: INTEGRATION_CHECKLIST.md"
    echo "  • Architecture: ARCHITECTURE.md"
    echo ""
fi
