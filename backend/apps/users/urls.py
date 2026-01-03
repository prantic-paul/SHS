"""
URL Configuration for users app
"""
from django.urls import path
from apps.users.views import (
    UserRegistrationView,
    UserLoginView,
    UserProfileView,
    DoctorApplicationView,
    DoctorProfileUpdateView
)
from apps.users.views.doctor_recommendation import recommend_doctors

app_name = 'users'

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/', UserLoginView.as_view(), name='login'),
    
    # User profile endpoints
    path('users/profile/', UserProfileView.as_view(), name='profile'),
    
    # Doctor endpoints
    path('doctors/apply/', DoctorApplicationView.as_view(), name='doctor-apply'),
    path('doctors/profile/', DoctorProfileUpdateView.as_view(), name='doctor-profile'),
    path('doctors/recommend/', recommend_doctors, name='doctor-recommend'),
]
