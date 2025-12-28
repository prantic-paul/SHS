"""Views for chat app"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ChatMessage
from .serializers import (
    ChatRequestSerializer,
    ChatResponseSerializer,
    ChatMessageSerializer
)
from services.ai_chatbot import ai_chatbot_service


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_with_bot(request):
    """
    Chat with AI medical bot
    
    POST /api/v1/chat/medical/
    Body: {"question": "What is diabetes?"}
    """
    serializer = ChatRequestSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    question = serializer.validated_data['question']
    
    # Call AI service
    result = ai_chatbot_service.chat(question)
    
    if result['status'] == 'error':
        return Response(
            {'error': result['message']},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    # Save to database
    chat_data = result['data']
    chat_message = ChatMessage.objects.create(
        user=request.user,
        question=chat_data['question'],
        answer=chat_data['answer'],
        sources=chat_data['sources']
    )
    
    # Return response
    response_serializer = ChatResponseSerializer(data=chat_data)
    if response_serializer.is_valid():
        return Response(response_serializer.data)
    
    return Response(chat_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_history(request):
    """
    Get chat history for current user
    
    GET /api/v1/chat/history/
    Query params: ?limit=20
    """
    limit = int(request.query_params.get('limit', 20))
    messages = ChatMessage.objects.filter(user=request.user)[:limit]
    serializer = ChatMessageSerializer(messages, many=True)
    
    return Response({
        'count': messages.count(),
        'results': serializer.data
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_chat_history(request):
    """
    Clear chat history for current user
    
    DELETE /api/v1/chat/history/
    """
    deleted_count, _ = ChatMessage.objects.filter(user=request.user).delete()
    
    return Response({
        'message': f'Deleted {deleted_count} chat messages',
        'deleted_count': deleted_count
    })


@api_view(['GET'])
def health_check(request):
    """
    Check if AI service is available
    
    GET /api/v1/chat/health/
    """
    result = ai_chatbot_service.health_check()
    
    if result['status'] == 'error':
        return Response(
            result,
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    return Response(result['data'])
