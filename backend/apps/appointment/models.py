"""
Appointment Model
Stores appointment booking information
"""
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.utils import timezone
from apps.users.models import DoctorInformation

User = get_user_model()


class Appointment(models.Model):
    """
    Appointment Model
    Stores patient appointments with doctors
    """
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('COMPLETED', 'Completed'),
    ]
    
    # Appointment details
    appointment_number = models.CharField(
        max_length=20,
        unique=True,
        help_text='Unique appointment number (e.g., APT-20231224-001)'
    )
    
    # Relationships
    doctor = models.ForeignKey(
        DoctorInformation,
        on_delete=models.CASCADE,
        related_name='appointments',
        help_text='Doctor for this appointment'
    )
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='appointments',
        help_text='Patient who booked the appointment'
    )
    
    # Appointment schedule
    appointment_date = models.DateField(
        help_text='Date of the appointment'
    )
    appointment_time = models.TimeField(
        help_text='Time of the appointment',
        null=True,
        blank=True
    )

    # Persisted approximate time calculated from serial number and doctor's schedule
    approximate_time = models.TimeField(
        help_text='Approximate appointment time calculated from serial number',
        null=True,
        blank=True,
    )
    
    # Serial number for queue management
    serial_number = models.IntegerField(
        validators=[MinValueValidator(1)],
        help_text='Serial number for the day (queue position)'
    )
    
    # Status and notes
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='CONFIRMED',
        help_text='Appointment status'
    )
    patient_notes = models.TextField(
        blank=True,
        help_text='Patient notes or reason for visit'
    )
    doctor_notes = models.TextField(
        blank=True,
        help_text='Doctor notes after consultation'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'appointments'
        ordering = ['appointment_date', 'appointment_time', 'serial_number']
        verbose_name = 'Appointment'
        verbose_name_plural = 'Appointments'
        indexes = [
            models.Index(fields=['doctor', 'appointment_date']),
            models.Index(fields=['patient', 'appointment_date']),
            models.Index(fields=['appointment_number']),
            models.Index(fields=['status']),
            models.Index(fields=['appointment_date', 'appointment_time']),
        ]
        unique_together = ['doctor', 'appointment_date', 'serial_number']
    
    def __str__(self):
        return f"{self.appointment_number} - {self.patient.name} with Dr. {self.doctor.user.name}"
    
    @staticmethod
    def generate_appointment_number(date):
        """
        Generate a unique appointment number
        Format: APT-YYYYMMDD-XXX
        """
        date_str = date.strftime('%Y%m%d')
        # Get the count of appointments for that date and generate sequential number
        count = Appointment.objects.filter(
            appointment_date=date
        ).count()
        return f'APT-{date_str}-{str(count + 1).zfill(3)}'
    
    @staticmethod
    def get_next_serial_number(doctor, date):
        """
        Get the next available serial number for a doctor on a specific date
        """
        last_appointment = Appointment.objects.filter(
            doctor=doctor,
            appointment_date=date
        ).order_by('-serial_number').first()
        
        if last_appointment:
            return last_appointment.serial_number + 1
        return 1
    
    def save(self, *args, **kwargs):
        """
        Override save to auto-generate appointment number and serial number
        """
        if not self.appointment_number:
            self.appointment_number = self.generate_appointment_number(self.appointment_date)
        
        if not self.serial_number:
            self.serial_number = self.get_next_serial_number(self.doctor, self.appointment_date)
        # Calculate and persist approximate_time based on serial number and doctor's schedule
        from apps.doctors.models import DoctorSchedule
        from datetime import datetime, timedelta

        day_of_week = (self.appointment_date.weekday() + 1) % 7
        schedule = DoctorSchedule.objects.filter(
            doctor=self.doctor,
            day_of_week=day_of_week,
            is_active=True
        ).first()

        if schedule:
            base_datetime = datetime.combine(self.appointment_date, schedule.start_time)
            approximate_datetime = base_datetime + timedelta(minutes=(self.serial_number - 1) * 10)
            self.approximate_time = approximate_datetime.time()

        super().save(*args, **kwargs)
    
    def get_approximate_time(self):
        """
        Calculate approximate appointment time based on serial number
        Each patient gets 10 minutes
        Time starts from doctor's schedule start_time for that day
        """
        from apps.doctors.models import DoctorSchedule
        
        # Get doctor's schedule for this day
        day_of_week = (self.appointment_date.weekday() + 1) % 7
        schedule = DoctorSchedule.objects.filter(
            doctor=self.doctor,
            day_of_week=day_of_week,
            is_active=True
        ).first()
        
        if not schedule:
            return None
        
        # Calculate time: start_time + (serial_number - 1) * 10 minutes
        from datetime import datetime, timedelta
        start_time = schedule.start_time
        
        # Convert time to datetime for calculation
        base_datetime = datetime.combine(self.appointment_date, start_time)
        approximate_datetime = base_datetime + timedelta(minutes=(self.serial_number - 1) * 10)
        
        return approximate_datetime.time()
