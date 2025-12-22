"""
Filters for the doctors app
"""
import django_filters
from apps.users.models import DoctorInformation


class DoctorFilter(django_filters.FilterSet):
    """
    Filter class for DoctorInformation model
    Supports filtering by specialization, experience, rating, location, and availability
    """
    # Text filters
    specialization = django_filters.CharFilter(
        field_name='specialization',
        lookup_expr='iexact'
    )
    city = django_filters.CharFilter(
        field_name='user__location',
        lookup_expr='icontains'
    )
    state = django_filters.CharFilter(
        field_name='state',
        lookup_expr='icontains'
    )
    location = django_filters.CharFilter(
        field_name='user__location',
        lookup_expr='icontains'
    )
    
    # Numeric filters
    min_experience = django_filters.NumberFilter(
        field_name='experience_years',
        lookup_expr='gte'
    )
    max_experience = django_filters.NumberFilter(
        field_name='experience_years',
        lookup_expr='lte'
    )
    
    min_rating = django_filters.NumberFilter(
        field_name='rating_avg',
        lookup_expr='gte'
    )
    max_rating = django_filters.NumberFilter(
        field_name='rating_avg',
        lookup_expr='lte'
    )
    
    min_fee = django_filters.NumberFilter(
        field_name='consultation_fee',
        lookup_expr='gte'
    )
    max_fee = django_filters.NumberFilter(
        field_name='consultation_fee',
        lookup_expr='lte'
    )
    
    # Choice filter
    availability_status = django_filters.ChoiceFilter(
        field_name='availability_status',
        choices=DoctorInformation.AVAILABILITY_CHOICES
    )
    
    class Meta:
        model = DoctorInformation
        fields = [
            'specialization',
            'city',
            'state',
            'location',
            'min_experience',
            'max_experience',
            'min_rating',
            'max_rating',
            'min_fee',
            'max_fee',
            'availability_status',
        ]
