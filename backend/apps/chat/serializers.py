"""Serializers for chat app"""
from rest_framework import serializers
from .models import ChatMessage


class ChatRequestSerializer(serializers.Serializer):
    """Serializer for incoming chat requests"""
    question = serializers.CharField(
        min_length=1,
        max_length=1000,
        help_text="Medical question to ask"
    )


class SourceDocumentSerializer(serializers.Serializer):
    """Serializer for source documents"""
    content = serializers.CharField()
    source = serializers.CharField()


class ChatResponseSerializer(serializers.Serializer):
    """Serializer for chat responses"""
    question = serializers.CharField()
    answer = serializers.CharField()
    sources = SourceDocumentSerializer(many=True)


class ChatMessageSerializer(serializers.ModelSerializer):
    """Serializer for stored chat messages"""
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = ChatMessage
        fields = [
            'id',
            'user',
            'username',
            'question',
            'answer',
            'sources',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'username']
