"""
Doctor Serializers
Serializers for doctor application and profile
"""
from rest_framework import serializers
from apps.users.models import DoctorInformation, User


class DoctorApplicationSerializer(serializers.ModelSerializer):
    """
    Serializer for doctor application (join as doctor)
    """
    class Meta:
        model = DoctorInformation
        fields = [
            'license_number', 'qualification', 'education',
            'specialization', 'practice_location',
            'experience_years', 'bio', 'city', 'state',
            'phone', 'email', 'consultation_fee', 'clinic_address'
        ]
        extra_kwargs = {
            'license_number': {'required': True},
            'qualification': {'required': True},
            'specialization': {'required': True},
            'practice_location': {'required': True},
            'city': {'required': False},
            'state': {'required': False},
        }
    
    def validate_license_number(self, value):
        """Validate license number is unique"""
        if DoctorInformation.objects.filter(license_number=value).exists():
            raise serializers.ValidationError(
                "License number already exists"
            )
        return value
    
    def validate(self, attrs):
        """Additional validation"""
        # Check if user already has a doctor profile
        request = self.context.get('request')
        if request and hasattr(request.user, 'doctor_profile'):
            raise serializers.ValidationError(
                "You have already applied. Application status: " +
                request.user.doctor_profile.status
            )
        return attrs
    
    def create(self, validated_data):
        """Create doctor profile"""
        request = self.context.get('request')
        validated_data['user'] = request.user
        doctor_profile = DoctorInformation.objects.create(**validated_data)
        return doctor_profile


class DoctorInformationSerializer(serializers.ModelSerializer):
    """
    Serializer for reading doctor information
    """
    user_name = serializers.CharField(source='user.name', read_only=True)
    user_id = serializers.CharField(source='user.user_id', read_only=True)
    profile_image = serializers.ImageField(read_only=True)
    
    class Meta:
        model = DoctorInformation
        fields = [
            'id', 'user_id', 'user_name', 'license_number',
            'qualification', 'education', 'specialization',
            'practice_location', 'experience_years', 'bio',
            'status', 'is_verified', 'rating_avg', 'created_at', 'profile_image'
        ]
        read_only_fields = ['status', 'is_verified', 'rating_avg', 'created_at']


class DoctorProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating doctor profile information
    Only allows editing of professional details, not verification status
    """
    profile_image = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = DoctorInformation
        fields = [
            'qualification', 'education', 'specialization',
            'practice_location', 'experience_years', 'bio', 'profile_image'
        ]
    
    def validate(self, attrs):
        """Ensure only approved doctors can update certain fields"""
        instance = self.instance
        if instance and instance.status != 'APPROVED':
            # Pending/rejected doctors have limited editing
            allowed_fields = {'bio', 'practice_location'}
            requested_fields = set(attrs.keys())
            restricted_fields = requested_fields - allowed_fields
            if restricted_fields:
                raise serializers.ValidationError(
                    f"Cannot update {', '.join(restricted_fields)} until application is approved"
                )
        return attrs
