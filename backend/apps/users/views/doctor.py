"""
Doctor Views
API views for doctor application and profile
"""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.users.serializers import DoctorApplicationSerializer


class DoctorApplicationView(APIView):
    """
    API endpoint for doctor application
    POST /api/v1/doctors/apply/ - Apply to join as doctor
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Submit doctor application"""
        serializer = DoctorApplicationSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            doctor_profile = serializer.save()
            
            return Response({
                'success': True,
                'data': {
                    'id': doctor_profile.id,
                    'user_id': request.user.user_id,
                    'license_number': doctor_profile.license_number,
                    'qualification': doctor_profile.qualification,
                    'education': doctor_profile.education,
                    'specialization': doctor_profile.specialization,
                    'practice_location': doctor_profile.practice_location,
                    'experience_years': doctor_profile.experience_years,
                    'status': doctor_profile.status,
                    'is_verified': doctor_profile.is_verified,
                    'created_at': doctor_profile.created_at.isoformat(),
                },
                'message': 'Doctor application submitted successfully. Pending admin approval.'
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors,
            'message': 'Validation failed'
        }, status=status.HTTP_400_BAD_REQUEST)
