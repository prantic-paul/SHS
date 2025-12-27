#!/bin/bash

# =============================================================================
# Medical Chatbot - One-Click Setup & Start Script
# This script handles EVERYTHING for you!
# =============================================================================

set -e  # Exit on error

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

clear

echo -e "${CYAN}"
echo "════════════════════════════════════════════════════════════════"
echo "    🏥 Medical Chatbot - Automated Setup & Start"
echo "════════════════════════════════════════════════════════════════"
echo -e "${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "ai-service/main.py" ]; then
    echo -e "${RED}❌ Error: Please run this script from the SHS root directory${NC}"
    exit 1
fi

# =============================================================================
# STEP 1: Check API Keys
# =============================================================================
echo -e "${BLUE}[1/5] Checking API Keys...${NC}"

if [ ! -f "ai-service/.env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating from template...${NC}"
    cp ai-service/.env.example ai-service/.env
    
    echo ""
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}   ⚠️  IMPORTANT: You need to add your API keys!${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "You need two API keys:"
    echo ""
    echo -e "${CYAN}1. Pinecone API Key${NC}"
    echo "   → Sign up at: https://www.pinecone.io/"
    echo "   → Go to API Keys section"
    echo "   → Copy your API key"
    echo ""
    echo -e "${CYAN}2. Google AI API Key${NC}"
    echo "   → Get from: https://makersuite.google.com/app/apikey"
    echo "   → Click 'Create API Key'"
    echo "   → Copy your API key"
    echo ""
    echo -e "${YELLOW}Opening .env file for editing...${NC}"
    echo ""
    
    # Try to open with available editor
    if command -v nano &> /dev/null; then
        nano ai-service/.env
    elif command -v vim &> /dev/null; then
        vim ai-service/.env
    elif command -v code &> /dev/null; then
        code ai-service/.env
        echo "Press Enter after you've saved the .env file..."
        read
    else
        echo "Please edit ai-service/.env manually and add your API keys"
        echo "Press Enter when done..."
        read
    fi
    
    # Verify keys are added
    if grep -q "pcsk_" ai-service/.env && grep -q "AIza" ai-service/.env; then
        echo -e "${GREEN}✅ API keys detected!${NC}"
    else
        echo -e "${RED}❌ API keys not found. Please add them to ai-service/.env${NC}"
        exit 1
    fi
else
    # Check if keys exist
    if grep -q "pcsk_" ai-service/.env && grep -q "AIza" ai-service/.env; then
        echo -e "${GREEN}✅ API keys found!${NC}"
    else
        echo -e "${YELLOW}⚠️  API keys might be missing. Please check ai-service/.env${NC}"
        echo "Continue anyway? (y/n)"
        read -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
fi

echo ""

# =============================================================================
# STEP 2: Setup AI Service
# =============================================================================
echo -e "${BLUE}[2/5] Setting up AI Service...${NC}"

cd ai-service

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo -e "${GREEN}✅ Virtual environment created${NC}"
else
    echo -e "${GREEN}✅ Virtual environment exists${NC}"
fi

# Activate and install requirements
echo "Installing AI service dependencies..."
source venv/bin/activate
pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet

echo -e "${GREEN}✅ AI service setup complete!${NC}"
echo ""

# =============================================================================
# STEP 3: Index Documents (if needed)
# =============================================================================
echo -e "${BLUE}[3/5] Checking if documents are indexed...${NC}"

# Simple check - if Pinecone index exists, skip
INDEX_EXISTS=false
if python -c "
import os
from dotenv import load_dotenv
load_dotenv()
from pinecone import Pinecone
pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
print('exists' if pc.has_index('medical-chatbot') else 'missing')
" 2>/dev/null | grep -q "exists"; then
    INDEX_EXISTS=true
fi

if [ "$INDEX_EXISTS" = true ]; then
    echo -e "${GREEN}✅ Documents already indexed!${NC}"
else
    echo -e "${YELLOW}⚠️  Documents not indexed yet. Indexing now...${NC}"
    python index_documents.py
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Documents indexed successfully!${NC}"
    else
        echo -e "${RED}❌ Error indexing documents. Check your API keys.${NC}"
        exit 1
    fi
fi

echo ""

# =============================================================================
# STEP 4: Setup Backend
# =============================================================================
echo -e "${BLUE}[4/5] Setting up Backend...${NC}"

cd ../backend

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo -e "${GREEN}✅ Virtual environment created${NC}"
else
    echo -e "${GREEN}✅ Virtual environment exists${NC}"
fi

# Install requirements
echo "Installing backend dependencies..."
source venv/bin/activate
pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet

echo -e "${GREEN}✅ Backend setup complete!${NC}"
echo ""

# =============================================================================
# STEP 5: Start Services
# =============================================================================
echo -e "${BLUE}[5/5] Starting Services...${NC}"
echo ""

cd ..

# Check if tmux is available (for better terminal management)
if command -v tmux &> /dev/null; then
    echo -e "${CYAN}Using tmux for service management...${NC}"
    
    # Kill existing session if it exists
    tmux kill-session -t medical-chatbot 2>/dev/null || true
    
    # Create new session
    tmux new-session -d -s medical-chatbot
    
    # Window 1: AI Service
    tmux rename-window -t medical-chatbot:0 'AI-Service'
    tmux send-keys -t medical-chatbot:0 'cd ai-service && source venv/bin/activate && python main.py' C-m
    
    # Window 2: Backend
    tmux new-window -t medical-chatbot:1 -n 'Backend'
    tmux send-keys -t medical-chatbot:1 'cd backend && source venv/bin/activate && python manage.py runserver' C-m
    
    # Wait a bit for services to start
    sleep 3
    
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}   ✅ Services Started Successfully!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${CYAN}Services are running in tmux session 'medical-chatbot'${NC}"
    echo ""
    echo "Available commands:"
    echo -e "  ${YELLOW}tmux attach -t medical-chatbot${NC}  - View running services"
    echo -e "  ${YELLOW}tmux kill-session -t medical-chatbot${NC}  - Stop all services"
    echo ""
    echo "Switch between windows in tmux:"
    echo -e "  ${YELLOW}Ctrl+B then 0${NC}  - AI Service window"
    echo -e "  ${YELLOW}Ctrl+B then 1${NC}  - Backend window"
    echo -e "  ${YELLOW}Ctrl+B then D${NC}  - Detach (services keep running)"
    echo ""
    
else
    # Fallback: Start in background without tmux
    echo -e "${YELLOW}tmux not found. Starting services in background...${NC}"
    
    # Start AI Service
    cd ai-service
    source venv/bin/activate
    nohup python main.py > ../logs/ai-service.log 2>&1 &
    AI_PID=$!
    echo $AI_PID > ../logs/ai-service.pid
    cd ..
    
    # Start Backend
    cd backend
    source venv/bin/activate
    nohup python manage.py runserver > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../logs/backend.pid
    cd ..
    
    sleep 3
    
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}   ✅ Services Started in Background!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Process IDs:"
    echo "  AI Service: $AI_PID"
    echo "  Backend: $BACKEND_PID"
    echo ""
    echo "View logs:"
    echo -e "  ${YELLOW}tail -f logs/ai-service.log${NC}"
    echo -e "  ${YELLOW}tail -f logs/backend.log${NC}"
    echo ""
    echo "Stop services:"
    echo -e "  ${YELLOW}kill $AI_PID $BACKEND_PID${NC}"
    echo ""
fi

# =============================================================================
# Final Information
# =============================================================================
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${MAGENTA}   🎉 Setup Complete! Your API is Ready!${NC}"
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}📍 Your API Endpoint:${NC}"
echo -e "   ${GREEN}POST http://localhost:8000/api/v1/chat/medical/${NC}"
echo ""
echo -e "${CYAN}🔗 Service URLs:${NC}"
echo "   AI Service:  http://localhost:8001"
echo "   Backend API: http://localhost:8000"
echo ""
echo -e "${CYAN}📚 Next Steps:${NC}"
echo "   1. Login to get JWT token"
echo "   2. Use the token to chat with the bot"
echo "   3. Check CHATBOT_API_READY.md for examples"
echo ""
echo -e "${CYAN}🧪 Quick Test:${NC}"
echo "   Run: ${YELLOW}./test_chatbot.sh${NC}"
echo ""
echo -e "${CYAN}📖 Documentation:${NC}"
echo "   • CHATBOT_API_READY.md - Quick reference"
echo "   • backend/API_DOCUMENTATION.md - Full API docs"
echo ""

# Create test script
cat > test_chatbot.sh << 'EOF'
#!/bin/bash
# Quick test script for chatbot API

echo "Testing Medical Chatbot API..."
echo ""

# Check AI service
echo "1. Checking AI Service..."
if curl -s http://localhost:8001/health | grep -q "healthy"; then
    echo "   ✅ AI Service is running"
else
    echo "   ❌ AI Service is not responding"
    exit 1
fi

echo ""
echo "2. Checking Backend..."
if curl -s http://localhost:8000/admin/ > /dev/null 2>&1; then
    echo "   ✅ Backend is running"
else
    echo "   ❌ Backend is not responding"
    exit 1
fi

echo ""
echo "3. Testing Chat Endpoint (you'll need to provide credentials)..."
echo ""
read -p "Enter your email: " email
read -s -p "Enter your password: " password
echo ""
echo ""

# Get token
echo "Getting JWT token..."
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/login/ \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$email\",\"password\":\"$password\"}" \
  | grep -o '"access":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "   ❌ Login failed. Check credentials."
    exit 1
fi

echo "   ✅ Token obtained"
echo ""

# Test chat
echo "4. Sending test message..."
RESPONSE=$(curl -s -X POST http://localhost:8000/api/v1/chat/medical/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message": "What is diabetes?"}')

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "   ✅ Chat working!"
    echo ""
    echo "Response:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
else
    echo "   ❌ Chat failed"
    echo "Response: $RESPONSE"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   🎉 All tests passed! Your chatbot is working!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
EOF

chmod +x test_chatbot.sh

echo -e "${GREEN}✅ Setup script created: test_chatbot.sh${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
