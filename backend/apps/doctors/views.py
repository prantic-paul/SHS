"""
Views for the doctors app
"""
from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q
from apps.users.models import DoctorInformation
from .models import Rating
from .serializers import (
    DoctorListSerializer,
    DoctorDetailSerializer,
    RatingListSerializer,
    RatingCreateSerializer,
    RatingDetailSerializer,
    SpecializationSerializer,
)
from .filters import DoctorFilter


class DoctorListView(generics.ListAPIView):
    """
    API view to list all doctors with search, filters, and pagination
    GET /api/v1/doctors/
    """
    queryset = DoctorInformation.objects.filter(is_verified=True, status='APPROVED')
    serializer_class = DoctorListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = DoctorFilter
    search_fields = ['user__name', 'specialization']
    ordering_fields = ['rating_avg', 'experience_years', 'consultation_fee']
    ordering = ['-rating_avg']
    
    def get_queryset(self):
        """
        Optionally filter by availability status
        """
        queryset = super().get_queryset()
        
        # Additional custom filtering can be added here
        availability = self.request.query_params.get('availability_status', None)
        if availability:
            queryset = queryset.filter(availability_status=availability)
        
        return queryset


class DoctorDetailView(generics.RetrieveAPIView):
    """
    API view to retrieve a single doctor's details
    GET /api/v1/doctors/{id}/
    """
    queryset = DoctorInformation.objects.filter(is_verified=True, status='APPROVED')
    serializer_class = DoctorDetailSerializer
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([AllowAny])
def specialization_list_view(request):
    """
    API view to get all unique specializations with doctor count
    GET /api/v1/doctors/specializations/
    """
    specializations = DoctorInformation.objects.filter(
        is_verified=True,
        status='APPROVED'
    ).values('specialization').annotate(
        count=Count('id')
    ).order_by('specialization')
    
    serializer = SpecializationSerializer(specializations, many=True)
    return Response(serializer.data)


class RatingListCreateView(generics.ListCreateAPIView):
    """
    API view to list and create ratings for a doctor
    GET /api/v1/doctors/{doctor_id}/ratings/
    POST /api/v1/doctors/{doctor_id}/ratings/
    """
    serializer_class = RatingListSerializer
    
    def get_permissions(self):
        """
        Allow anyone to view ratings, but require authentication to create
        """
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """
        Get all ratings for a specific doctor
        """
        doctor_id = self.kwargs.get('doctor_id')
        return Rating.objects.filter(doctor_id=doctor_id)
    
    def get_serializer_class(self):
        """
        Use different serializers for list and create
        """
        if self.request.method == 'POST':
            return RatingCreateSerializer
        return RatingListSerializer
    
    def get_serializer_context(self):
        """
        Add view to serializer context
        """
        context = super().get_serializer_context()
        context['view'] = self
        return context
    
    def perform_create(self, serializer):
        """
        Save the rating with the doctor_id from the URL
        """
        doctor_id = self.kwargs.get('doctor_id')
        # If doctor is already in validated_data (from serializer), use it
        # Otherwise, set it from the URL parameter
        if 'doctor' not in serializer.validated_data:
            serializer.save(user=self.request.user, doctor_id=doctor_id)
        else:
            serializer.save(user=self.request.user)


class RatingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve, update, or delete a specific rating
    GET /api/v1/doctors/{doctor_id}/ratings/{rating_id}/
    PUT /api/v1/doctors/{doctor_id}/ratings/{rating_id}/
    PATCH /api/v1/doctors/{doctor_id}/ratings/{rating_id}/
    DELETE /api/v1/doctors/{doctor_id}/ratings/{rating_id}/
    """
    queryset = Rating.objects.all()
    serializer_class = RatingDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'rating_id'
    
    def get_serializer_class(self):
        """
        Use CreateSerializer for updates
        """
        if self.request.method in ['PUT', 'PATCH']:
            return RatingCreateSerializer
        return RatingDetailSerializer
    
    def get_queryset(self):
        """
        Filter ratings by doctor and ensure user can only modify their own ratings
        """
        doctor_id = self.kwargs.get('doctor_id')
        queryset = Rating.objects.filter(doctor_id=doctor_id)
        
        # For update/delete, ensure user owns the rating
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            queryset = queryset.filter(user=self.request.user)
        
        return queryset
    
    def perform_update(self, serializer):
        """
        Update rating, keeping the same doctor and user
        """
        serializer.save()
    
    def destroy(self, request, *args, **kwargs):
        """
        Delete rating with custom response
        """
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"message": "Rating deleted successfully."},
            status=status.HTTP_200_OK
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def rating_breakdown_view(request, doctor_id):
    """
    API view to get rating statistics and breakdown for a doctor
    GET /api/v1/doctors/{doctor_id}/ratings/breakdown/
    """
    try:
        doctor = DoctorInformation.objects.get(id=doctor_id)
    except DoctorInformation.DoesNotExist:
        return Response(
            {"error": "Doctor not found."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Get rating distribution
    ratings = Rating.objects.filter(doctor=doctor)
    total_ratings = ratings.count()
    
    breakdown = {
        '5': ratings.filter(rating=5).count(),
        '4': ratings.filter(rating=4).count(),
        '3': ratings.filter(rating=3).count(),
        '2': ratings.filter(rating=2).count(),
        '1': ratings.filter(rating=1).count(),
    }
    
    # Calculate percentages
    breakdown_percentage = {}
    for star, count in breakdown.items():
        percentage = (count / total_ratings * 100) if total_ratings > 0 else 0
        breakdown_percentage[star] = {
            'count': count,
            'percentage': round(percentage, 1)
        }
    
    data = {
        'doctor_id': doctor.id,
        'doctor_name': doctor.user.name,
        'rating_avg': float(doctor.rating_avg),
        'rating_count': doctor.rating_count,
        'breakdown': breakdown_percentage,
    }
    
    return Response(data)
