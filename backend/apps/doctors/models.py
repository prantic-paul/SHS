from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator, MinLengthValidator
from django.utils import timezone
from datetime import datetime, time
from apps.users.models import DoctorInformation

User = get_user_model()


class Rating(models.Model):
    """
    Model to store doctor ratings and reviews from patients
    """
    doctor = models.ForeignKey(
        DoctorInformation,
        on_delete=models.CASCADE,
        related_name='ratings'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='doctor_ratings'
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    review_text = models.TextField(
        max_length=200,
        blank=True,
        validators=[MinLengthValidator(0)]
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'doctor_ratings'
        ordering = ['-created_at']
        unique_together = ['doctor', 'user']
        verbose_name = 'Doctor Rating'
        verbose_name_plural = 'Doctor Ratings'
        indexes = [
            models.Index(fields=['doctor', '-created_at']),
            models.Index(fields=['rating']),
        ]
    
    def __str__(self):
        return f"{self.user.username} rated Dr. {self.doctor.user.name} - {self.rating} stars"


class DoctorSchedule(models.Model):
    """
    Model to store doctor's weekly appointment schedule
    """
    WEEKDAY_CHOICES = [
        (0, 'Sunday'),
        (1, 'Monday'),
        (2, 'Tuesday'),
        (3, 'Wednesday'),
        (4, 'Thursday'),
        (5, 'Friday'),
        (6, 'Saturday'),
    ]
    
    doctor = models.ForeignKey(
        DoctorInformation,
        on_delete=models.CASCADE,
        related_name='schedules'
    )
    day_of_week = models.IntegerField(
        choices=WEEKDAY_CHOICES,
        help_text='Day of the week (0=Sunday, 6=Saturday)'
    )
    start_time = models.TimeField(
        help_text='Schedule start time (e.g., 09:00)'
    )
    end_time = models.TimeField(
        help_text='Schedule end time (e.g., 16:00)'
    )
    is_active = models.BooleanField(
        default=True,
        help_text='Whether this schedule is currently active'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'doctor_schedules'
        ordering = ['day_of_week', 'start_time']
        verbose_name = 'Doctor Schedule'
        verbose_name_plural = 'Doctor Schedules'
        unique_together = ['doctor', 'day_of_week']
        indexes = [
            models.Index(fields=['doctor', 'day_of_week']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"Dr. {self.doctor.user.name} - {self.get_day_of_week_display()} {self.start_time}-{self.end_time}"
    
    def clean(self):
        from django.core.exceptions import ValidationError
        if self.start_time >= self.end_time:
            raise ValidationError('End time must be after start time')
    
    @staticmethod
    def is_doctor_available(doctor):
        """
        Check if doctor is available today or tomorrow
        Returns True if doctor has active schedule for today or tomorrow
        """
        now = timezone.now()
        current_time = now.time()
        today_weekday = now.weekday()
        # Convert Python weekday (0=Monday) to our format (0=Sunday)
        today = (today_weekday + 1) % 7
        tomorrow = (today + 1) % 7
        
        # Check if doctor has schedule for today and time hasn't passed
        today_schedule = DoctorSchedule.objects.filter(
            doctor=doctor,
            is_active=True,
            day_of_week=today
        ).first()
        
        if today_schedule and current_time < today_schedule.end_time:
            return True
        
        # Check if doctor has schedule for tomorrow
        tomorrow_schedule = DoctorSchedule.objects.filter(
            doctor=doctor,
            is_active=True,
            day_of_week=tomorrow
        ).exists()
        
        return tomorrow_schedule
