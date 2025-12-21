"""
User Views
API views for user profile operations
"""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.users.serializers import UserProfileSerializer, UserUpdateSerializer


class UserProfileView(APIView):
    """
    API endpoint for user profile
    GET /api/v1/users/profile/ - Get current user profile
    PATCH /api/v1/users/profile/ - Update current user profile
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get current user profile"""
        serializer = UserProfileSerializer(request.user)
        
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Profile retrieved successfully'
        }, status=status.HTTP_200_OK)
    
    def patch(self, request):
        """Update current user profile"""
        serializer = UserUpdateSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            
            # Return updated profile
            profile_serializer = UserProfileSerializer(request.user)
            
            return Response({
                'success': True,
                'data': profile_serializer.data,
                'message': 'Profile updated successfully'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'errors': serializer.errors,
            'message': 'Validation failed'
        }, status=status.HTTP_400_BAD_REQUEST)
