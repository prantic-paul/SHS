from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator, MinLengthValidator
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
