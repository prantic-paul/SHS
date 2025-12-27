"""
Test script for Medical Chatbot AI Service
"""
import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:8001"

def test_root():
    """Test root endpoint"""
    print("\n" + "="*60)
    print("Testing Root Endpoint")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_health():
    """Test health check endpoint"""
    print("\n" + "="*60)
    print("Testing Health Check Endpoint")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_chat(message):
    """Test chat endpoint"""
    print("\n" + "="*60)
    print(f"Testing Chat Endpoint")
    print("="*60)
    print(f"Question: {message}")
    
    try:
        start_time = time.time()
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={"message": message},
            timeout=60
        )
        elapsed_time = time.time() - start_time
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Time: {elapsed_time:.2f}s")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\nAnswer: {data['answer']}")
            if data.get('sources'):
                print(f"Sources: {', '.join(data['sources'])}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Medical Chatbot AI Service - Test Suite")
    print("=" * 60)
    
    # Wait for service to be ready
    print("\n⏳ Waiting for service to be ready...")
    max_retries = 10
    for i in range(max_retries):
        try:
            response = requests.get(f"{BASE_URL}/health", timeout=2)
            if response.status_code == 200:
                print("✅ Service is ready!")
                break
        except:
            if i < max_retries - 1:
                print(f"Attempt {i+1}/{max_retries}... Retrying in 2s")
                time.sleep(2)
            else:
                print("❌ Service is not responding. Please start the service first.")
                return
    
    # Run tests
    results = []
    
    # Test 1: Root endpoint
    results.append(("Root", test_root()))
    
    # Test 2: Health check
    results.append(("Health Check", test_health()))
    
    # Test 3: Chat with medical questions
    test_questions = [
        "What is diabetes?",
        "What are the symptoms of hypertension?",
        "How to treat common cold?",
    ]
    
    for question in test_questions:
        results.append((f"Chat: {question[:30]}...", test_chat(question)))
    
    # Summary
    print("\n" + "="*60)
    print("Test Summary")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {name}")
    
    print(f"\n{passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
    else:
        print("⚠️ Some tests failed. Check the output above.")

if __name__ == "__main__":
    main()
