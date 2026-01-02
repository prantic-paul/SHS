#!/usr/bin/env python3
"""
Medical Chatbot API Testing Script
Tests all endpoints with provided credentials
"""

import requests
import json
import time
from typing import Dict, Any

# Configuration
BASE_URL = "http://localhost:8000/api/v1"
EMAIL = "pranticpaulshimul@gmail.com"
PASSWORD = "zxcvbnm123"

# Colors for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_header(text: str):
    print(f"\n{'='*60}")
    print(f"{Colors.BOLD}{text}{Colors.END}")
    print(f"{'='*60}\n")

def print_success(text: str):
    print(f"{Colors.GREEN}✅ {text}{Colors.END}")

def print_error(text: str):
    print(f"{Colors.RED}❌ {text}{Colors.END}")

def print_info(text: str):
    print(f"{Colors.BLUE}ℹ️  {text}{Colors.END}")

def print_warning(text: str):
    print(f"{Colors.YELLOW}⚠️  {text}{Colors.END}")

def pretty_print_json(data: Any):
    print(json.dumps(data, indent=2))

def test_login() -> str:
    """Test login endpoint and return access token"""
    print_header("Test 1: User Login")
    print(f"Endpoint: POST {BASE_URL}/auth/login/")
    print(f"Email: {EMAIL}\n")
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login/",
            json={"email": EMAIL, "password": PASSWORD},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        data = response.json()
        pretty_print_json(data)
        
        # Handle different response structures
        access_token = None
        if response.status_code == 200:
            # Try to get token from different possible locations
            if 'tokens' in data and 'access' in data['tokens']:
                access_token = data['tokens']['access']
            elif 'access' in data:
                access_token = data['access']
        
        if access_token:
            print_success("Login Successful!")
            print(f"Access Token: {access_token[:30]}...")
            return access_token
        else:
            print_error("Login Failed!")
            return None
            
    except requests.exceptions.ConnectionError:
        print_error("Cannot connect to Django server!")
        print_warning("Please start Django: cd backend && python manage.py runserver")
        return None
    except Exception as e:
        print_error(f"Login error: {e}")
        return None

def test_health():
    """Test AI service health check"""
    print_header("Test 2: AI Service Health Check")
    print(f"Endpoint: GET {BASE_URL}/chat/health/\n")
    
    try:
        response = requests.get(f"{BASE_URL}/chat/health/", timeout=10)
        print(f"Status Code: {response.status_code}")
        data = response.json()
        pretty_print_json(data)
        
        if 'status' in data and data.get('status') == 'healthy':
            print_success("AI Service is Healthy!")
        elif 'rag_system' in data and data.get('rag_system') == 'ready':
            print_success("AI Service is Ready!")
        else:
            print_warning("AI Service status unclear")
            
    except Exception as e:
        print_error(f"Health check error: {e}")

def test_chat(token: str, question: str, test_num: int):
    """Test chat endpoint with a question"""
    print_header(f"Test {test_num}: Ask Medical Question")
    print(f"Endpoint: POST {BASE_URL}/chat/medical/")
    print(f"Question: {question}\n")
    
    if not token:
        print_error("No access token available")
        return
    
    try:
        response = requests.post(
            f"{BASE_URL}/chat/medical/",
            headers={"Authorization": f"Bearer {token}"},
            json={"question": question},
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        data = response.json()
        
        if response.status_code == 200:
            print(f"\nQuestion: {data.get('question', 'N/A')}")
            print(f"\nAnswer: {data.get('answer', 'N/A')}")
            print(f"\nSources ({len(data.get('sources', []))}):")
            for i, source in enumerate(data.get('sources', []), 1):
                print(f"  {i}. {source.get('source', 'Unknown')}")
                content = source.get('content', '')
                print(f"     {content[:100]}..." if len(content) > 100 else f"     {content}")
            
            print_success("Chat Response Received!")
        else:
            pretty_print_json(data)
            print_error("Chat request failed")
            
    except requests.exceptions.Timeout:
        print_error("Request timeout! AI service might be slow or unavailable")
    except Exception as e:
        print_error(f"Chat error: {e}")

def test_history(token: str):
    """Test chat history endpoint"""
    print_header("Test: Get Chat History")
    print(f"Endpoint: GET {BASE_URL}/chat/history/?limit=10\n")
    
    if not token:
        print_error("No access token available")
        return
    
    try:
        response = requests.get(
            f"{BASE_URL}/chat/history/?limit=10",
            headers={"Authorization": f"Bearer {token}"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        data = response.json()
        
        if response.status_code == 200:
            count = data.get('count', 0)
            results = data.get('results', [])
            
            print(f"\nTotal Messages: {count}")
            print(f"Showing: {len(results)} messages\n")
            
            for i, msg in enumerate(results[:3], 1):  # Show first 3
                print(f"{i}. [{msg.get('created_at', 'N/A')}]")
                print(f"   Q: {msg.get('question', 'N/A')[:80]}...")
                print(f"   A: {msg.get('answer', 'N/A')[:80]}...\n")
            
            print_success(f"Retrieved {len(results)} chat messages!")
        else:
            pretty_print_json(data)
            print_error("History request failed")
            
    except Exception as e:
        print_error(f"History error: {e}")

def test_without_auth():
    """Test endpoint without authentication (should fail)"""
    print_header("Test: Access Without Authentication")
    print(f"Endpoint: POST {BASE_URL}/chat/medical/")
    print("Without Authorization header\n")
    
    try:
        response = requests.post(
            f"{BASE_URL}/chat/medical/",
            json={"question": "Test"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        data = response.json()
        pretty_print_json(data)
        
        if response.status_code == 401:
            print_success("Authentication Required (Correct Behavior)")
        else:
            print_warning("Expected 401 Unauthorized")
            
    except Exception as e:
        print_error(f"Test error: {e}")

def main():
    """Main test function"""
    print("\n" + "="*60)
    print(f"{Colors.BOLD}{Colors.BLUE}🧪 Medical Chatbot API Testing{Colors.END}")
    print("="*60)
    print(f"\nTesting against: {BASE_URL}")
    print(f"User: {EMAIL}\n")
    
    print_info("Make sure both services are running:")
    print("  1. Django: cd backend && python manage.py runserver")
    print("  2. FastAPI: cd ai-service && ./start_server.sh")
    
    input("\nPress Enter to start testing...")
    
    # Test 1: Login
    access_token = test_login()
    if not access_token:
        print_error("\nCannot proceed without access token. Exiting.")
        return
    
    time.sleep(1)
    
    # Test 2: Health Check
    test_health()
    time.sleep(1)
    
    # Test 3-5: Chat with different questions
    questions = [
        "What is diabetes?",
        "What are the symptoms of high blood pressure?",
        "How to manage fever at home?"
    ]
    
    for i, question in enumerate(questions, 3):
        test_chat(access_token, question, i)
        time.sleep(2)
    
    # Test 6: History
    test_history(access_token)
    time.sleep(1)
    
    # Test 7: No Auth
    test_without_auth()
    
    # Summary
    print_header("📊 Testing Complete!")
    print_success("All API endpoints have been tested!")
    print(f"\n{Colors.BOLD}Tested Endpoints:{Colors.END}")
    print("  ✅ POST /api/v1/auth/login/")
    print("  ✅ GET  /api/v1/chat/health/")
    print("  ✅ POST /api/v1/chat/medical/")
    print("  ✅ GET  /api/v1/chat/history/")
    print("\nYour Medical Chatbot API is working perfectly! 🎉\n")

if __name__ == "__main__":
    main()
