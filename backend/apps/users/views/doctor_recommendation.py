"""
Doctor Recommendation View
Recommends doctors based on predicted disease
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from apps.users.models import DoctorInformation
from apps.users.serializers.doctor import DoctorInformationSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def recommend_doctors(request):
    """
    Recommend doctors based on predicted disease.
    
    Request body:
    {
        "disease": "Disease Name"
    }
    
    Returns:
    {
        "disease": "Disease Name",
        "doctors": [...list of doctor objects...]
    }
    """
    disease = request.data.get('disease', '').strip()
    
    if not disease:
        return Response(
            {'error': 'Disease name is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Find doctors who treat this disease
        # Case-insensitive search in diseases_treated field
        doctors = DoctorInformation.objects.filter(
            Q(diseases_treated__icontains=disease) &
            Q(is_verified=True) &
            Q(status='APPROVED') &
            Q(availability_status__in=['available', 'busy'])
        ).select_related('user').order_by('-rating_avg', '-experience_years')
        
        # Serialize doctor data
        serializer = DoctorInformationSerializer(doctors, many=True)
        
        return Response({
            'disease': disease,
            'doctors': serializer.data,
            'count': len(serializer.data)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch doctor recommendations: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
