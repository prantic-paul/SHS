"""
Serializers for the doctors app
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.users.models import DoctorInformation
from .models import Rating

User = get_user_model()


class DoctorListSerializer(serializers.ModelSerializer):
    """
    Serializer for doctor list view with essential information
    """
    doctor_name = serializers.CharField(source='user.name', read_only=True)
    user_location = serializers.CharField(source='user.location', read_only=True)
    
    class Meta:
        model = DoctorInformation
        fields = [
            'id',
            'doctor_name',
            'user_location',
            'profile_image',
            'specialization',
            'experience_years',
            'practice_location',
            'city',
            'state',
            'consultation_fee',
            'rating_avg',
            'rating_count',
            'availability_status',
        ]
        read_only_fields = ['rating_avg', 'rating_count']


class DoctorDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for doctor detail view with complete information
    """
    doctor_name = serializers.CharField(source='user.name', read_only=True)
    doctor_email = serializers.EmailField(source='user.email', read_only=True)
    user_location = serializers.CharField(source='user.location', read_only=True)
    
    class Meta:
        model = DoctorInformation
        fields = [
            'id',
            'doctor_name',
            'doctor_email',
            'user_location',
            'profile_image',
            'specialization',
            'license_number',
            'experience_years',
            'qualification',
            'education',
            'email',
            'phone',
            'clinic_address',
            'city',
            'state',
            'pincode',
            'consultation_fee',
            'rating_avg',
            'rating_count',
            'availability_status',
            'bio',
            'languages',
            'practice_location',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['rating_avg', 'rating_count', 'created_at', 'updated_at']


class RatingUserSerializer(serializers.ModelSerializer):
    """
    Serializer for user information in ratings
    """
    class Meta:
        model = User
        fields = ['id', 'name', 'email']
        read_only_fields = fields


class RatingListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing ratings
    """
    user = RatingUserSerializer(read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.name', read_only=True)
    
    class Meta:
        model = Rating
        fields = [
            'id',
            'doctor',
            'doctor_name',
            'user',
            'rating',
            'review_text',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'doctor_name', 'user', 'created_at', 'updated_at']


class RatingCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating ratings
    """
    doctor = serializers.PrimaryKeyRelatedField(
        queryset=DoctorInformation.objects.all(),
        required=False  # Not required because it comes from URL
    )
    
    class Meta:
        model = Rating
        fields = [
            'doctor',
            'rating',
            'review_text',
        ]
    
    def validate_rating(self, value):
        """
        Validate that rating is between 1 and 5
        """
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5 stars.")
        return value
    
    def validate_review_text(self, value):
        """
        Validate review text length
        """
        if len(value) > 200:
            raise serializers.ValidationError("Review text cannot exceed 200 characters.")
        return value
    
    def validate(self, attrs):
        """
        Check if user has already rated this doctor
        """
        request = self.context.get('request')
        doctor = attrs.get('doctor')
        
        # If doctor not in attrs, get it from view kwargs (URL parameter)
        if not doctor:
            view = self.context.get('view')
            if view and hasattr(view, 'kwargs'):
                doctor_id = view.kwargs.get('doctor_id')
                if doctor_id:
                    try:
                        doctor = DoctorInformation.objects.get(id=doctor_id)
                        attrs['doctor'] = doctor
                    except DoctorInformation.DoesNotExist:
                        raise serializers.ValidationError("Doctor not found.")
        
        if request and hasattr(request, 'user') and doctor:
            # Check for existing rating only on create
            if not self.instance:
                existing_rating = Rating.objects.filter(
                    doctor=doctor,
                    user=request.user
                ).exists()
                
                if existing_rating:
                    raise serializers.ValidationError(
                        "You have already rated this doctor. Please update your existing rating."
                    )
        
        return attrs
    
    def create(self, validated_data):
        """
        Create rating with the current user
        """
        request = self.context.get('request')
        validated_data['user'] = request.user
        return super().create(validated_data)


class RatingDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for rating detail view
    """
    user = RatingUserSerializer(read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.name', read_only=True)
    can_edit = serializers.SerializerMethodField()
    
    class Meta:
        model = Rating
        fields = [
            'id',
            'doctor',
            'doctor_name',
            'user',
            'rating',
            'review_text',
            'created_at',
            'updated_at',
            'can_edit',
        ]
        read_only_fields = ['id', 'doctor', 'doctor_name', 'user', 'created_at', 'updated_at', 'can_edit']
    
    def get_can_edit(self, obj):
        """
        Check if the current user can edit this rating
        """
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return obj.user == request.user
        return False


class SpecializationSerializer(serializers.Serializer):
    """
    Serializer for specialization list with doctor count
    """
    specialization = serializers.CharField()
    count = serializers.IntegerField()
