"""
User Views
API views for user profile operations using Django REST Framework Generic Views
"""
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from apps.users.serializers import UserProfileSerializer, UserUpdateSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint for user profile
    GET /api/v1/users/profile/ - Get current user profile
    PATCH /api/v1/users/profile/ - Update current user profile
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_object(self):
        """Return the current authenticated user"""
        return self.request.user
    
    def get_serializer_class(self):
        """Use different serializer for update"""
        if self.request.method in ['PATCH', 'PUT']:
            return UserUpdateSerializer
        return UserProfileSerializer
    
    def retrieve(self, request, *args, **kwargs):
        """Get current user profile"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Profile retrieved successfully'
        }, status=status.HTTP_200_OK)
    
    def update(self, request, *args, **kwargs):
        """Update current user profile"""
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Return updated profile with UserProfileSerializer
        profile_serializer = UserProfileSerializer(instance)
        
        return Response({
            'success': True,
            'data': profile_serializer.data,
            'message': 'Profile updated successfully'
        }, status=status.HTTP_200_OK)
