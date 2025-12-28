"""Models for chat history"""
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class ChatMessage(models.Model):
    """Store chat messages with AI responses"""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='chat_messages'
    )
    question = models.TextField(help_text="User's medical question")
    answer = models.TextField(help_text="AI-generated answer")
    sources = models.JSONField(
        default=list,
        help_text="Source documents used for the answer"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Chat Message'
        verbose_name_plural = 'Chat Messages'
    
    def __str__(self):
        return f"{self.user.username} - {self.question[:50]}..."
