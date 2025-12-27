"""
Chat Views
API endpoints for medical chatbot
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from services.ai_chatbot import chatbot_service
import logging

logger = logging.getLogger(__name__)


class MedicalChatView(APIView):
    """
    Medical chatbot endpoint
    POST /api/v1/chat/medical/ - Send message to medical chatbot
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Send message to medical chatbot"""
        message = request.data.get('message')
        conversation_history = request.data.get('conversation_history', [])
        
        # Validate input
        if not message:
            return Response(
                {
                    "success": False,
                    "error": "Message is required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not isinstance(message, str) or len(message.strip()) == 0:
            return Response(
                {
                    "success": False,
                    "error": "Message must be a non-empty string"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Log request
        user_id = str(request.user.user_id) if hasattr(request.user, 'user_id') else None
        logger.info(f"Medical chat request from user {user_id}: {message[:100]}...")
        
        # Call AI service
        try:
            result = chatbot_service.chat(
                message=message.strip(),
                user_id=user_id,
                conversation_history=conversation_history
            )
            
            # Check if there was an error
            if 'error' in result:
                logger.warning(f"AI service returned error: {result.get('error')}")
                return Response(
                    {
                        "success": False,
                        "error": result.get('error'),
                        "answer": result.get('answer'),
                        "sources": result.get('sources', []),
                        "confidence": result.get('confidence')
                    },
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            
            # Success response
            return Response(
                {
                    "success": True,
                    "answer": result.get('answer'),
                    "sources": result.get('sources', []),
                    "confidence": result.get('confidence'),
                    "user_id": user_id
                },
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            logger.error(f"Error processing chat request: {str(e)}")
            return Response(
                {
                    "success": False,
                    "error": "internal_error",
                    "answer": "An error occurred while processing your request. Please try again."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ChatHealthView(APIView):
    """
    Check AI service health
    GET /api/v1/chat/health/ - Get AI service status
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Check AI service health"""
        try:
            health = chatbot_service.health_check()
            
            # Determine HTTP status based on health
            if health.get('status') == 'healthy':
                http_status = status.HTTP_200_OK
            elif health.get('status') == 'degraded':
                http_status = status.HTTP_200_OK
            else:
                http_status = status.HTTP_503_SERVICE_UNAVAILABLE
            
            return Response(
                {
                    "success": True,
                    "health": health
                },
                status=http_status
            )
            
        except Exception as e:
            logger.error(f"Error checking AI service health: {str(e)}")
            return Response(
                {
                    "success": False,
                    "error": str(e),
                    "health": {
                        "status": "unavailable"
                    }
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

