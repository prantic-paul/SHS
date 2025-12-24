"""
Doctor Views
API views for doctor application and profile using Django REST Framework Generic Views
"""
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.users.serializers import DoctorApplicationSerializer, DoctorProfileUpdateSerializer
from apps.users.models import DoctorInformation


class DoctorApplicationView(generics.CreateAPIView):
    """
    API endpoint for doctor application
    POST /api/v1/doctors/apply/ - Apply to join as doctor
    """
    serializer_class = DoctorApplicationSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        """Submit doctor application"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        doctor_profile = self.perform_create(serializer)
        
        return Response({
            'success': True,
            'data': {
                'id': doctor_profile.id,
                'user_id': request.user.user_id,
                'user_name': request.user.name,
                'license_number': doctor_profile.license_number,
                'qualification': doctor_profile.qualification,
                'education': doctor_profile.education,
                'specialization': doctor_profile.specialization,
                'practice_location': doctor_profile.practice_location,
                'experience_years': doctor_profile.experience_years,
                'bio': doctor_profile.bio,
                'status': doctor_profile.status,
                'is_verified': doctor_profile.is_verified,
                'created_at': doctor_profile.created_at.isoformat(),
            },
            'message': 'Doctor application submitted successfully. Pending admin approval.'
        }, status=status.HTTP_201_CREATED)
    
    def perform_create(self, serializer):
        """Save and return the doctor profile"""
        return serializer.save()


class DoctorProfileUpdateView(generics.RetrieveUpdateAPIView):
    """
    API endpoint for updating doctor profile
    GET /api/v1/doctors/profile/ - Get current doctor profile
    PUT/PATCH /api/v1/doctors/profile/ - Update doctor profile
    """
    serializer_class = DoctorProfileUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        """Get doctor profile for current user"""
        try:
            return DoctorInformation.objects.get(user=self.request.user)
        except DoctorInformation.DoesNotExist:
            return None
    
    def retrieve(self, request, *args, **kwargs):
        """Get doctor profile"""
        instance = self.get_object()
        if not instance:
            return Response({
                'success': False,
                'message': 'No doctor profile found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'success': True,
            'data': {
                'id': instance.id,
                'license_number': instance.license_number,
                'qualification': instance.qualification,
                'education': instance.education,
                'specialization': instance.specialization,
                'practice_location': instance.practice_location,
                'experience_years': instance.experience_years,
                'bio': instance.bio,
                'status': instance.status,
                'is_verified': instance.is_verified,
                'rating_avg': str(instance.rating_avg),
            }
        })
    
    def update(self, request, *args, **kwargs):
        """Update doctor profile"""
        instance = self.get_object()
        if not instance:
            return Response({
                'success': False,
                'message': 'No doctor profile found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Refresh from database
        instance.refresh_from_db()
        
        return Response({
            'success': True,
            'data': {
                'id': instance.id,
                'license_number': instance.license_number,
                'qualification': instance.qualification,
                'education': instance.education,
                'specialization': instance.specialization,
                'practice_location': instance.practice_location,
                'experience_years': instance.experience_years,
                'bio': instance.bio,
                'status': instance.status,
                'is_verified': instance.is_verified,
                'rating_avg': str(instance.rating_avg),
            },
            'message': 'Doctor profile updated successfully'
        })
