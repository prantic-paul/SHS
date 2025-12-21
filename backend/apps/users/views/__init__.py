"""
Views package for users app
"""
from .auth import UserRegistrationView, UserLoginView
from .user import UserProfileView
from .doctor import DoctorApplicationView

__all__ = [
    'UserRegistrationView',
    'UserLoginView',
    'UserProfileView',
    'DoctorApplicationView',
]
