"""
Authentication Views
API views for user registration and login
"""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.serializers import UserRegistrationSerializer, UserLoginSerializer


class UserRegistrationView(APIView):
    """
    API endpoint for user registration
    POST /api/v1/auth/register/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Register a new user"""
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            # Prepare response data
            response_data = {
                'success': True,
                'data': {
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
        
        # Validation errors
        return Response({
            'success': False,
            'errors': serializer.errors,
            'message': 'Validation failed'
        }, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    """
    API endpoint for user login
    POST /api/v1/auth/login/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Authenticate user and return JWT tokens"""
        serializer = UserLoginSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            # Prepare response data
            response_data = {
                'success': True,
                'data': {
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
        
        # Authentication errors
        return Response({
            'success': False,
            'error': serializer.errors.get('non_field_errors', ['Invalid credentials'])[0],
            'message': 'Authentication failed'
        }, status=status.HTTP_401_UNAUTHORIZED)
