"""
Doctor Information Model
Extended profile for doctor users
"""
from django.db import models
from django.conf import settings


class DoctorInformation(models.Model):
    """
    Doctor Information Model
    One-to-one relationship with User model
    """
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    # One-to-one relationship with User
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='doctor_profile',
        help_text='User account associated with this doctor profile'
    )
    
    # Professional information
    license_number = models.CharField(
        max_length=50,
        unique=True,
        help_text='Medical license number (must be unique)'
    )
    qualification = models.TextField(
        help_text='Medical qualifications (e.g., MBBS, MD)'
    )
    education = models.TextField(
        blank=True,
        help_text='Educational background and institutions'
    )
    specialization = models.CharField(
        max_length=100,
        help_text='Medical specialization (e.g., Cardiology, Dermatology)'
    )
    practice_location = models.CharField(
        max_length=255,
        help_text='Current practice location/hospital'
    )
    experience_years = models.IntegerField(
        null=True,
        blank=True,
        help_text='Years of medical practice experience'
    )
    bio = models.TextField(
        blank=True,
        max_length=1000,
        help_text='Professional biography'
    )
    
    # Verification and status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING',
        help_text='Application status (pending admin approval)'
    )
    is_verified = models.BooleanField(
        default=False,
        help_text='Verified by admin'
    )
    
    # Rating (calculated from reviews)
    rating_avg = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.00,
        help_text='Average rating (0.00 to 5.00)'
    )
    rating_count = models.IntegerField(
        default=0,
        help_text='Total number of ratings'
    )
    
    # Availability status
    AVAILABILITY_CHOICES = [
        ('available', 'Available'),
        ('busy', 'Busy'),
        ('unavailable', 'Unavailable'),
    ]
    availability_status = models.CharField(
        max_length=20,
        choices=AVAILABILITY_CHOICES,
        default='unavailable',
        help_text='Current availability status for appointments'
    )
    
    # Contact and consultation details
    phone = models.CharField(
        max_length=20,
        blank=True,
        help_text='Contact phone number'
    )
    email = models.EmailField(
        blank=True,
        help_text='Professional email address'
    )
    consultation_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        help_text='Consultation fee in local currency'
    )
    clinic_address = models.TextField(
        blank=True,
        help_text='Clinic or practice address'
    )
    city = models.CharField(
        max_length=100,
        blank=True,
        help_text='City of practice'
    )
    state = models.CharField(
        max_length=100,
        blank=True,
        help_text='State/province of practice'
    )
    pincode = models.CharField(
        max_length=10,
        blank=True,
        help_text='Postal/ZIP code'
    )
    languages = models.CharField(
        max_length=255,
        default='English',
        help_text='Languages spoken (comma-separated)'
    )
    profile_image = models.ImageField(
        upload_to='doctors/profiles/',
        blank=True,
        null=True,
        help_text='Doctor profile picture'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'doctor_information'
        verbose_name = 'Doctor Information'
        verbose_name_plural = 'Doctor Information'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['status']),
            models.Index(fields=['specialization']),
            models.Index(fields=['is_verified']),
            models.Index(fields=['availability_status']),
            models.Index(fields=['city']),
            models.Index(fields=['rating_avg']),
        ]
    
    def __str__(self):
        return f"Dr. {self.user.name} - {self.specialization}"
    
    @property
    def is_pending(self):
        """Check if application is pending"""
        return self.status == 'PENDING'
    
    @property
    def is_approved(self):
        """Check if application is approved"""
        return self.status == 'APPROVED'
    
    @property
    def is_rejected(self):
        """Check if application is rejected"""
        return self.status == 'REJECTED'
    
    def approve(self):
        """Approve doctor application"""
        self.status = 'APPROVED'
        self.is_verified = True
        self.user.role = 'DOCTOR'
        self.save()
        self.user.save()
    
    def reject(self):
        """Reject doctor application"""
        self.status = 'REJECTED'
        self.is_verified = False
        self.save()
