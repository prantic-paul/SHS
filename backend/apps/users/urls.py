"""
URL Configuration for users app
"""
from django.urls import path
from apps.users.views import (
    UserRegistrationView,
    UserLoginView,
    UserProfileView,
    DoctorApplicationView
)

app_name = 'users'

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/', UserLoginView.as_view(), name='login'),
    
    # User profile endpoints
    path('users/profile/', UserProfileView.as_view(), name='profile'),
    
    # Doctor endpoints
    path('doctors/apply/', DoctorApplicationView.as_view(), name='doctor-apply'),
]
