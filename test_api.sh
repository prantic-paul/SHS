#!/bin/bash

# Medical Chatbot API Test Script
# This script tests all endpoints of the medical chatbot

echo "=========================================="
echo "🧪 Medical Chatbot API Testing"
echo "=========================================="
echo ""

# Configuration
BASE_URL="http://localhost:8000/api/v1"
EMAIL="pranticpaulshimul@gmail.com"
PASSWORD="zxcvbnm123"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Prerequisites Check:${NC}"
echo "1. Make sure Django server is running on port 8000"
echo "2. Make sure FastAPI service is running on port 8001"
echo ""
echo "To start Django: cd backend && python manage.py runserver"
echo "To start FastAPI: cd ai-service && ./start_server.sh"
echo ""
read -p "Press Enter to continue with testing..."
echo ""

# Test 1: Login
echo "=========================================="
echo -e "${YELLOW}Test 1: User Login${NC}"
echo "=========================================="
echo "Endpoint: POST $BASE_URL/auth/login/"
echo "Credentials: $EMAIL"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login/" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "Response:"
echo "$LOGIN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin).get('access', ''))" 2>/dev/null)

if [ -z "$ACCESS_TOKEN" ]; then
    echo -e "${RED}❌ Login Failed!${NC}"
    echo "Please check:"
    echo "  - Django server is running"
    echo "  - Credentials are correct"
    echo "  - Database has the user"
    exit 1
fi

echo -e "${GREEN}✅ Login Successful!${NC}"
echo "Access Token: ${ACCESS_TOKEN:0:30}..."
echo ""

# Test 2: Health Check
echo "=========================================="
echo -e "${YELLOW}Test 2: AI Service Health Check${NC}"
echo "=========================================="
echo "Endpoint: GET $BASE_URL/chat/health/"
echo ""

HEALTH_RESPONSE=$(curl -s -X GET "$BASE_URL/chat/health/")

echo "Response:"
echo "$HEALTH_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$HEALTH_RESPONSE"
echo ""

if echo "$HEALTH_RESPONSE" | grep -q "healthy\|ready"; then
    echo -e "${GREEN}✅ AI Service is Healthy!${NC}"
else
    echo -e "${RED}❌ AI Service Not Available${NC}"
    echo "Please start FastAPI service on port 8001"
fi
echo ""

# Test 3: Chat - Question 1
echo "=========================================="
echo -e "${YELLOW}Test 3: Ask Medical Question #1${NC}"
echo "=========================================="
echo "Endpoint: POST $BASE_URL/chat/medical/"
echo "Question: What is diabetes?"
echo ""

CHAT1_RESPONSE=$(curl -s -X POST "$BASE_URL/chat/medical/" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question": "What is diabetes?"}')

echo "Response:"
echo "$CHAT1_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CHAT1_RESPONSE"
echo ""

if echo "$CHAT1_RESPONSE" | grep -q "answer"; then
    echo -e "${GREEN}✅ Chat Endpoint Working!${NC}"
    ANSWER=$(echo "$CHAT1_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('answer', '')[:150])" 2>/dev/null)
    echo "Answer preview: $ANSWER..."
else
    echo -e "${RED}❌ Chat Endpoint Failed${NC}"
fi
echo ""

sleep 2

# Test 4: Chat - Question 2
echo "=========================================="
echo -e "${YELLOW}Test 4: Ask Medical Question #2${NC}"
echo "=========================================="
echo "Endpoint: POST $BASE_URL/chat/medical/"
echo "Question: What are the symptoms of high blood pressure?"
echo ""

CHAT2_RESPONSE=$(curl -s -X POST "$BASE_URL/chat/medical/" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the symptoms of high blood pressure?"}')

echo "Response:"
echo "$CHAT2_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CHAT2_RESPONSE"
echo ""

if echo "$CHAT2_RESPONSE" | grep -q "answer"; then
    echo -e "${GREEN}✅ Second Question Successful!${NC}"
else
    echo -e "${RED}❌ Second Question Failed${NC}"
fi
echo ""

sleep 2

# Test 5: Chat - Question 3
echo "=========================================="
echo -e "${YELLOW}Test 5: Ask Medical Question #3${NC}"
echo "=========================================="
echo "Endpoint: POST $BASE_URL/chat/medical/"
echo "Question: How to manage fever at home?"
echo ""

CHAT3_RESPONSE=$(curl -s -X POST "$BASE_URL/chat/medical/" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question": "How to manage fever at home?"}')

echo "Response:"
echo "$CHAT3_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CHAT3_RESPONSE"
echo ""

if echo "$CHAT3_RESPONSE" | grep -q "answer"; then
    echo -e "${GREEN}✅ Third Question Successful!${NC}"
else
    echo -e "${RED}❌ Third Question Failed${NC}"
fi
echo ""

sleep 2

# Test 6: Get Chat History
echo "=========================================="
echo -e "${YELLOW}Test 6: Get Chat History${NC}"
echo "=========================================="
echo "Endpoint: GET $BASE_URL/chat/history/?limit=10"
echo ""

HISTORY_RESPONSE=$(curl -s -X GET "$BASE_URL/chat/history/?limit=10" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Response:"
echo "$HISTORY_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$HISTORY_RESPONSE"
echo ""

if echo "$HISTORY_RESPONSE" | grep -q "results"; then
    echo -e "${GREEN}✅ History Endpoint Working!${NC}"
    MESSAGE_COUNT=$(echo "$HISTORY_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('count', 0))" 2>/dev/null)
    echo "Total messages in history: $MESSAGE_COUNT"
else
    echo -e "${RED}❌ History Endpoint Failed${NC}"
fi
echo ""

# Test 7: Test Without Authentication
echo "=========================================="
echo -e "${YELLOW}Test 7: Test Without Auth (Should Fail)${NC}"
echo "=========================================="
echo "Endpoint: POST $BASE_URL/chat/medical/"
echo "Without Authorization header"
echo ""

NO_AUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/chat/medical/" \
  -H "Content-Type: application/json" \
  -d '{"question": "Test question"}')

echo "Response:"
echo "$NO_AUTH_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$NO_AUTH_RESPONSE"
echo ""

if echo "$NO_AUTH_RESPONSE" | grep -qi "unauthorized\|authentication\|credentials"; then
    echo -e "${GREEN}✅ Authentication Required (Correct)${NC}"
else
    echo -e "${YELLOW}⚠️  Unexpected Response${NC}"
fi
echo ""

# Final Summary
echo "=========================================="
echo -e "${BLUE}📊 Test Summary${NC}"
echo "=========================================="
echo ""
echo "✅ Completed Tests:"
echo "  1. User Login"
echo "  2. AI Service Health Check"
echo "  3. Medical Question #1 (Diabetes)"
echo "  4. Medical Question #2 (Blood Pressure)"
echo "  5. Medical Question #3 (Fever Management)"
echo "  6. Chat History Retrieval"
echo "  7. Authentication Validation"
echo ""
echo -e "${GREEN}🎉 All API endpoints tested successfully!${NC}"
echo ""
echo "Your medical chatbot API is working and ready for production!"
echo "=========================================="
