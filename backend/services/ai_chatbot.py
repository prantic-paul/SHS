"""AI Chatbot Service Client - Communicates with FastAPI microservice"""
import requests
from django.conf import settings
from typing import Dict, Any


class AIChatbotService:
    """Client for communicating with AI Chatbot FastAPI microservice"""
    
    def __init__(self):
        self.base_url = getattr(settings, 'AI_SERVICE_URL', 'http://localhost:8001')
    
    def health_check(self) -> Dict[str, Any]:
        """
        Check if AI service is healthy
        
        Returns:
            dict: Health status
        """
        try:
            response = requests.get(
                f"{self.base_url}/health",
                timeout=5
            )
            response.raise_for_status()
            return {
                'status': 'success',
                'data': response.json()
            }
        except requests.RequestException as e:
            return {
                'status': 'error',
                'message': f"AI service is unavailable: {str(e)}"
            }
    
    def chat(self, question: str) -> Dict[str, Any]:
        """
        Send a question to the AI chatbot
        
        Args:
            question (str): User's medical question
            
        Returns:
            dict: Response with answer and sources
        """
        try:
            response = requests.post(
                f"{self.base_url}/chat",
                json={"question": question},
                timeout=30
            )
            response.raise_for_status()
            data = response.json()
            
            return {
                'status': 'success',
                'data': {
                    'question': data.get('question'),
                    'answer': data.get('answer'),
                    'sources': data.get('sources', [])
                }
            }
        except requests.Timeout:
            return {
                'status': 'error',
                'message': 'AI service request timed out. Please try again.'
            }
        except requests.RequestException as e:
            return {
                'status': 'error',
                'message': f'Failed to get response from AI service: {str(e)}'
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Unexpected error: {str(e)}'
            }


# Singleton instance
ai_chatbot_service = AIChatbotService()
