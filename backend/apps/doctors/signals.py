"""
Signals for the doctors app to auto-update rating calculations
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg, Count
from apps.users.models import DoctorInformation
from .models import Rating


@receiver(post_save, sender=Rating)
def update_doctor_rating_on_save(sender, instance, **kwargs):
    """
    Update doctor's rating_avg and rating_count when a rating is created or updated
    """
    doctor = instance.doctor
    
    # Calculate average rating and count
    rating_stats = Rating.objects.filter(doctor=doctor).aggregate(
        avg_rating=Avg('rating'),
        total_count=Count('id')
    )
    
    doctor.rating_avg = round(rating_stats['avg_rating'] or 0.0, 2)
    doctor.rating_count = rating_stats['total_count']
    doctor.save(update_fields=['rating_avg', 'rating_count', 'updated_at'])


@receiver(post_delete, sender=Rating)
def update_doctor_rating_on_delete(sender, instance, **kwargs):
    """
    Update doctor's rating_avg and rating_count when a rating is deleted
    """
    doctor = instance.doctor
    
    # Calculate average rating and count
    rating_stats = Rating.objects.filter(doctor=doctor).aggregate(
        avg_rating=Avg('rating'),
        total_count=Count('id')
    )
    
    doctor.rating_avg = round(rating_stats['avg_rating'] or 0.0, 2)
    doctor.rating_count = rating_stats['total_count']
    doctor.save(update_fields=['rating_avg', 'rating_count', 'updated_at'])
