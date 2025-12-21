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
            'experience_years', 'bio'
        ]
        extra_kwargs = {
            'license_number': {'required': True},
            'qualification': {'required': True},
            'specialization': {'required': True},
            'practice_location': {'required': True},
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
    
    class Meta:
        model = DoctorInformation
        fields = [
            'id', 'user_id', 'user_name', 'license_number',
            'qualification', 'education', 'specialization',
            'practice_location', 'experience_years', 'bio',
            'status', 'is_verified', 'rating_avg', 'created_at'
        ]
        read_only_fields = ['status', 'is_verified', 'rating_avg', 'created_at']
