"""
Serializers package for users app
"""
from .auth import UserRegistrationSerializer, UserLoginSerializer
from .user import UserProfileSerializer, UserUpdateSerializer
from .doctor import DoctorApplicationSerializer, DoctorInformationSerializer, DoctorProfileUpdateSerializer

__all__ = [
    'UserRegistrationSerializer',
    'UserLoginSerializer',
    'UserProfileSerializer',
    'UserUpdateSerializer',
    'DoctorApplicationSerializer',
    'DoctorInformationSerializer',
    'DoctorProfileUpdateSerializer',
]
