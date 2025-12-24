"""
User Serializers
Serializers for user profile operations
"""
from rest_framework import serializers
from apps.users.models import User


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile (read-only)
    """
    doctor_profile = serializers.SerializerMethodField()
    profile_picture = serializers.ImageField(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'user_id', 'name', 'email', 'phone', 'location',
            'blood_group', 'gender', 'age', 'role', 'profile_picture',
            'is_active', 'created_at', 'doctor_profile'
        ]
        read_only_fields = ['user_id', 'email', 'role', 'created_at']
    
    def get_doctor_profile(self, obj):
        """Get doctor profile if user is a doctor"""
        try:
            if hasattr(obj, 'doctor_profile'):
                from apps.users.serializers.doctor import DoctorInformationSerializer
                return DoctorInformationSerializer(obj.doctor_profile).data
            return None
        except:
            return None


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile
    """
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = ['name', 'phone', 'location', 'blood_group', 'gender', 'age', 'profile_picture']
        extra_kwargs = {
            'phone': {'required': False},
        }
    
    def validate_phone(self, value):
        """Validate phone is unique (excluding current user)"""
        user = self.instance
        if User.objects.filter(phone=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("Phone number already in use")
        return value
