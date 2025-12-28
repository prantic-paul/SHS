"""URL patterns for chat app"""
from django.urls import path
from . import views

app_name = 'chat'

urlpatterns = [
    path('medical/', views.chat_with_bot, name='chat'),
    path('history/', views.chat_history, name='history'),
    path('history/clear/', views.clear_chat_history, name='clear_history'),
    path('health/', views.health_check, name='health'),
]
