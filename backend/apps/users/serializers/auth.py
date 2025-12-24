"""
Authentication Serializers
Serializers for user registration and login
"""
from rest_framework import serializers
from django.contrib.auth import authenticate
from apps.users.models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'},
        help_text='Password (minimum 8 characters)'
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        help_text='Confirm password'
    )
    
    class Meta:
        model = User
        fields = [
            'name', 'email', 'password', 'password_confirm',
            'phone', 'location', 'blood_group', 'gender', 'age'
        ]
        extra_kwargs = {
            'email': {'required': True},
            'phone': {'required': True},
            'location': {'required': True},
        }
    
    def validate_email(self, value):
        """Validate email is unique"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value.lower()
    
    def validate_phone(self, value):
        """Validate phone is unique"""
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Phone number already registered")
        return value
    
    def validate(self, attrs):
        """Validate password confirmation"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                "password_confirm": "Passwords do not match"
            })
        return attrs
    
    def create(self, validated_data):
        """Create new user"""
        # Remove password_confirm (not needed for user creation)
        validated_data.pop('password_confirm')
        
        # Create user with hashed password
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login
    """
    email = serializers.EmailField(
        required=True,
        help_text='Email address'
    )
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'},
        help_text='Password'
    )
    
    def validate(self, attrs):
        """Validate user credentials"""
        email = attrs.get('email', '').lower()
        password = attrs.get('password')
        
        if email and password:
            # Authenticate user
            user = authenticate(
                request=self.context.get('request'),
                username=email,  # Django uses 'username' param
                password=password
            )
            
            if not user:
                raise serializers.ValidationError(
                    "Invalid email or password"
                )
            
            if not user.is_active:
                raise serializers.ValidationError(
                    "Account is inactive"
                )
            
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError(
                "Email and password are required"
            )
