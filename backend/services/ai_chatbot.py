"""
AI Chatbot Service Client
Communicates with the AI Service microservice
"""
import requests
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class AIChatbotService:
    """Service to communicate with AI chatbot microservice"""
    
    def __init__(self):
        self.base_url = getattr(settings, 'AI_SERVICE_URL', 'http://localhost:8001')
        self.timeout = 30  # 30 seconds timeout
    
    def chat(self, message: str, user_id: str = None, conversation_history: list = None):
        """
        Send message to AI chatbot
        
        Args:
            message: User's medical question
            user_id: Optional user ID for tracking
            conversation_history: Optional list of previous messages
            
        Returns:
            dict: Response with answer, sources, and confidence
        """
        try:
            payload = {
                "message": message,
                "user_id": user_id,
                "conversation_history": conversation_history or []
            }
            
            logger.info(f"Sending message to AI service: {message[:100]}...")
            
            response = requests.post(
                f"{self.base_url}/api/chat",
                json=payload,
                timeout=self.timeout
            )
            
            response.raise_for_status()
            result = response.json()
            
            logger.info(f"Received response from AI service")
            return result
            
        except requests.Timeout:
            logger.error("AI service request timed out")
            return {
                "error": "timeout",
                "answer": "The AI service is taking too long to respond. Please try again.",
                "sources": [],
                "confidence": None
            }
            
        except requests.ConnectionError:
            logger.error("Cannot connect to AI service")
            return {
                "error": "connection_error",
                "answer": "Cannot connect to the AI service. Please make sure the AI service is running.",
                "sources": [],
                "confidence": None
            }
            
        except requests.RequestException as e:
            logger.error(f"AI service request failed: {str(e)}")
            return {
                "error": "request_failed",
                "answer": "Sorry, the AI service is currently unavailable. Please try again later.",
                "sources": [],
                "confidence": None
            }
            
        except Exception as e:
            logger.error(f"Unexpected error calling AI service: {str(e)}")
            return {
                "error": "unexpected_error",
                "answer": "An unexpected error occurred. Please try again.",
                "sources": [],
                "confidence": None
            }
    
    def health_check(self):
        """
        Check AI service health
        
        Returns:
            dict: Health status
        """
        try:
            response = requests.get(
                f"{self.base_url}/health",
                timeout=5
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"AI service health check failed: {str(e)}")
            return {
                "status": "unavailable",
                "service": "medical-chatbot-ai",
                "pinecone_connected": False,
                "embedding_model_loaded": False,
                "error": str(e)
            }


# Global instance
chatbot_service = AIChatbotService()
