"""
Authentication Views
API views for user registration and login using Django REST Framework Generic Views
"""
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.serializers import UserRegistrationSerializer, UserLoginSerializer


class UserRegistrationView(generics.CreateAPIView):
    """
    API endpoint for user registration
    POST /api/v1/auth/register/
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Register a new user"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        # Prepare response data
        response_data = {
            'success': True,
            'data': {
                'id': user.id,  # Add numeric ID for ForeignKey comparisons
                'user_id': user.user_id,
                'name': user.name,
                'email': user.email,
                'phone': user.phone,
                'location': user.location,
                'blood_group': user.blood_group,
                'gender': user.gender,
                'age': user.age,
                'role': user.role,
                'is_active': user.is_active,
                'created_at': user.created_at.isoformat(),
            },
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            },
            'message': 'User registered successfully'
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)


class UserLoginView(generics.GenericAPIView):
    """
    API endpoint for user login
    POST /api/v1/auth/login/
    """
    serializer_class = UserLoginSerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        """Authenticate user and return JWT tokens"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        # Prepare response data
        response_data = {
            'success': True,
            'data': {
                'id': user.id,  # Add numeric ID for ForeignKey comparisons
                'user_id': user.user_id,
                'name': user.name,
                'email': user.email,
                'role': user.role,
            },
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            },
            'message': 'Login successful'
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
