"""
Serializers for the appointment app
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import date, timedelta
from apps.users.models import DoctorInformation
from apps.doctors.models import DoctorSchedule
from .models import Appointment

User = get_user_model()


class AppointmentListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing appointments
    """
    doctor_name = serializers.CharField(source='doctor.user.name', read_only=True)
    doctor_specialization = serializers.CharField(source='doctor.specialization', read_only=True)
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    patient_email = serializers.EmailField(source='patient.email', read_only=True)
    approximate_time = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = [
            'id',
            'appointment_number',
            'doctor',
            'doctor_name',
            'doctor_specialization',
            'patient',
            'patient_name',
            'patient_email',
            'appointment_date',
            'appointment_time',
            'approximate_time',
            'serial_number',
            'status',
            'patient_notes',
            'created_at',
        ]
        read_only_fields = ['id', 'appointment_number', 'serial_number', 'approximate_time', 'created_at']
    
    def get_approximate_time(self, obj):
        """Get calculated approximate time"""
        # Prefer stored approximate_time if available
        time = getattr(obj, 'approximate_time', None) or obj.get_approximate_time()
        return time.strftime('%H:%M:%S') if time else None


class AppointmentDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for appointment detail view
    """
    doctor_name = serializers.CharField(source='doctor.user.name', read_only=True)
    doctor_specialization = serializers.CharField(source='doctor.specialization', read_only=True)
    approximate_time = serializers.SerializerMethodField()
    doctor_phone = serializers.CharField(source='doctor.phone', read_only=True)
    doctor_email = serializers.EmailField(source='doctor.email', read_only=True)
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    patient_email = serializers.EmailField(source='patient.email', read_only=True)
    patient_phone = serializers.CharField(source='patient.phone', read_only=True)
    
    class Meta:
        model = Appointment
        fields = [
            'id',
            'appointment_number',
            'doctor',
            'doctor_name',
            'doctor_specialization',
            'doctor_phone',
            'doctor_email',
            'patient',
            'patient_name',
            'patient_email',
            'patient_phone',
            'appointment_date',
            'appointment_time',
            'approximate_time',
            'serial_number',
            'status',
            'patient_notes',
            'doctor_notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'appointment_number', 'serial_number', 'approximate_time', 'created_at', 'updated_at']
    
    def get_approximate_time(self, obj):
        """Get calculated approximate time"""
        time = getattr(obj, 'approximate_time', None) or obj.get_approximate_time()
        return time.strftime('%H:%M:%S') if time else None


class AppointmentCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating appointments
    Patient only selects date (today or tomorrow)
    Time is not required - appointment time is calculated based on serial number
    """
    doctor = serializers.PrimaryKeyRelatedField(
        queryset=DoctorInformation.objects.filter(is_verified=True, status='APPROVED')
    )
    
    class Meta:
        model = Appointment
        fields = [
            'doctor',
            'appointment_date',
            'patient_notes',
        ]
    
    def validate_doctor(self, value):
        """
        Validate that the user is not booking their own appointment
        """
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            # Check if doctor is trying to book appointment with themselves
            if hasattr(request.user, 'doctor_profile'):
                if request.user.doctor_profile == value:
                    raise serializers.ValidationError(
                        "You cannot book an appointment with yourself."
                    )
        return value
    
    def validate_appointment_date(self, value):
        """
        Validate that appointment date is today or tomorrow only
        """
        today = date.today()
        tomorrow = today + timedelta(days=1)
        
        if value not in [today, tomorrow]:
            raise serializers.ValidationError(
                "You can only book appointments for today or tomorrow."
            )
        
        return value
    
    def validate(self, data):
        """
        Validate that:
        1. Doctor is available on the selected date and time
        2. Appointment time is within doctor's schedule hours
        3. User doesn't have multiple appointments with same doctor on same day
        4. Time slot is not already booked for this doctor
        """
        doctor = data.get('doctor')
        appointment_date = data.get('appointment_date')
        # appointment_time is not supplied by client anymore
        appointment_time = None
        request = self.context.get('request')
        patient = request.user if request else None

        # Check 1: Validate doctor availability
        # Get the day of week (convert to our format: 0=Sunday)
        day_of_week = (appointment_date.weekday() + 1) % 7

        # Check if doctor has schedule for this day
        schedule = DoctorSchedule.objects.filter(
            doctor=doctor,
            day_of_week=day_of_week,
            is_active=True
        ).first()

        if not schedule:
            raise serializers.ValidationError({
                'appointment_date': f'Doctor is not available on {appointment_date.strftime("%A")}. '
            })

        # Check 2: No explicit appointment_time to validate; ensure bookings for today are within schedule
        today = date.today()
        if appointment_date == today:
            current_time = timezone.now().time()
            if current_time >= schedule.end_time:
                raise serializers.ValidationError({
                    'appointment_date': 'Doctor is not accepting appointments for today (time has passed).'
                })

        # Check 3: Prevent multiple appointments with same doctor on same day
        if patient:
            existing_appointment = Appointment.objects.filter(
                patient=patient,
                doctor=doctor,
                appointment_date=appointment_date,
                status__in=['PENDING', 'CONFIRMED']  # Only check active appointments
            ).exists()

            if existing_appointment:
                raise serializers.ValidationError({
                    'appointment_date': 'You already have an appointment with this doctor on this date.'
                })

        return data
    
    def create(self, validated_data):
        """
        Create appointment with auto-generated number and serial
        """
        request = self.context.get('request')
        validated_data['patient'] = request.user

        # Auto-generate appointment number and serial number
        appointment = Appointment(**validated_data)
        appointment.save()

        return appointment


class AppointmentUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating appointment status and notes
    """
    class Meta:
        model = Appointment
        fields = ['status', 'patient_notes', 'doctor_notes']
    
    def validate_status(self, value):
        """
        Validate status transitions
        """
        instance = self.instance
        if instance:
            # Don't allow changing status of completed appointments
            if instance.status == 'COMPLETED':
                raise serializers.ValidationError(
                    "Cannot modify completed appointments."
                )
        return value
