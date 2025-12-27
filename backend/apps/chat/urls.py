"""
Chat App URLs
"""
from django.urls import path
from .views import MedicalChatView, ChatHealthView

app_name = 'chat'

urlpatterns = [
    path('medical/', MedicalChatView.as_view(), name='medical-chat'),
    path('health/', ChatHealthView.as_view(), name='chat-health'),
]
