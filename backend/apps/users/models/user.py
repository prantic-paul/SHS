"""
User Model
Custom user model for Smart Health Synchronizer
"""
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
import random


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication"""
    
    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user"""
        if not email:
            raise ValueError('Email is required')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a superuser"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'ADMIN')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True')
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    Custom User Model
    Uses email for authentication instead of username
    """
    
    ROLE_CHOICES = [
        ('PATIENT', 'Patient'),
        ('DOCTOR', 'Doctor'),
        ('ADMIN', 'Admin'),
    ]
    
    BLOOD_GROUP_CHOICES = [
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
    ]
    
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]
    
    # Custom fields
    user_id = models.CharField(
        max_length=20,
        unique=True,
        editable=False,
        help_text='Auto-generated unique user ID (format: u-XXXXXX)'
    )
    email = models.EmailField(
        unique=True,
        help_text='Email address (used for login)'
    )
    phone = models.CharField(
        max_length=20,
        unique=True,
        help_text='Phone number (must be unique)'
    )
    location = models.CharField(
        max_length=255,
        help_text='User location/address'
    )
    blood_group = models.CharField(
        max_length=10,
        choices=BLOOD_GROUP_CHOICES,
        blank=True,
        help_text='Blood group'
    )
    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        blank=True,
        help_text='Gender'
    )
    age = models.IntegerField(
        null=True,
        blank=True,
        help_text='Age in years'
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='PATIENT',
        help_text='User role (determines permissions)'
    )
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True,
        help_text='User profile picture'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Override default fields
    username = None  # Remove username field
    first_name = None  # Remove first_name field
    last_name = None  # Remove last_name field
    
    # Custom name field
    name = models.CharField(
        max_length=100,
        help_text='Full name'
    )
    
    # Use email as the unique identifier for authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'phone']
    
    objects = UserManager()
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['user_id']),
            models.Index(fields=['role']),
            models.Index(fields=['phone']),
        ]
    
    def save(self, *args, **kwargs):
        """Override save to auto-generate user_id"""
        if not self.user_id:
            self.user_id = self._generate_unique_user_id()
        super().save(*args, **kwargs)
    
    @staticmethod
    def _generate_unique_user_id():
        """Generate unique user ID with format u-XXXXXX"""
        while True:
            # Generate random 6-digit number
            random_number = random.randint(100000, 999999)
            user_id = f"u-{random_number}"
            
            # Check if already exists
            if not User.objects.filter(user_id=user_id).exists():
                return user_id
    
    def __str__(self):
        return f"{self.user_id} - {self.email}"
    
    @property
    def is_patient(self):
        """Check if user is a patient"""
        return self.role == 'PATIENT'
    
    @property
    def is_doctor(self):
        """Check if user is a doctor"""
        return self.role == 'DOCTOR'
    
    @property
    def is_admin(self):
        """Check if user is an admin"""
        return self.role == 'ADMIN'
