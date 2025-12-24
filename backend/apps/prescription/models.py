"""
Prescription Models
Database models for storing prescription data
"""
from django.db import models
from django.contrib.auth import get_user_model
from apps.appointment.models import Appointment
from apps.users.models import DoctorInformation

User = get_user_model()


class Prescription(models.Model):
    """Model to store prescription details"""
    
    # Foreign Keys
    doctor = models.ForeignKey(
        DoctorInformation,
        on_delete=models.CASCADE,
        related_name='prescriptions'
    )
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='prescriptions',
        limit_choices_to={'role': 'PATIENT'}
    )
    appointment = models.OneToOneField(
        Appointment,
        on_delete=models.CASCADE,
        related_name='prescription'
    )
    
    # Prescription Details
    chief_complaint = models.TextField(help_text="Main reason for visit")
    diagnosis = models.TextField(help_text="Medical diagnosis")
    
    # Vital Signs
    temperature = models.DecimalField(
        max_digits=4, 
        decimal_places=1, 
        null=True, 
        blank=True,
        help_text="Temperature in Fahrenheit"
    )
    blood_pressure_systolic = models.IntegerField(null=True, blank=True)
    blood_pressure_diastolic = models.IntegerField(null=True, blank=True)
    heart_rate = models.IntegerField(null=True, blank=True, help_text="Beats per minute")
    respiratory_rate = models.IntegerField(null=True, blank=True)
    
    # Medications
    medications = models.TextField(help_text="Prescribed medications")
    dosage = models.CharField(max_length=255, help_text="Dosage and frequency")
    
    # Instructions and Notes
    instructions = models.TextField(blank=True, help_text="Special instructions for patient")
    doctor_notes = models.TextField(blank=True, help_text="Additional notes by doctor")
    
    # Follow-up
    follow_up_required = models.BooleanField(default=False)
    follow_up_date = models.DateField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['doctor', 'created_at']),
            models.Index(fields=['patient', 'created_at']),
            models.Index(fields=['appointment']),
        ]
    
    def __str__(self):
        return f"Prescription for {self.patient.name} by Dr. {self.doctor.user.name}"
    
    @property
    def blood_pressure(self):
        """Return formatted blood pressure"""
        if self.blood_pressure_systolic and self.blood_pressure_diastolic:
            return f"{self.blood_pressure_systolic}/{self.blood_pressure_diastolic}"
        return None
