"""
Prescription Serializers
"""
from rest_framework import serializers
from .models import Prescription


class PrescriptionSerializer(serializers.ModelSerializer):
    """Serializer for prescription data"""
    
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.name', read_only=True)
    appointment_number = serializers.CharField(source='appointment.appointment_number', read_only=True)
    blood_pressure = serializers.CharField(read_only=True)
    
    class Meta:
        model = Prescription
        fields = [
            'id', 'doctor', 'patient', 'appointment',
            'patient_name', 'doctor_name', 'appointment_number',
            'chief_complaint', 'diagnosis',
            'temperature', 'blood_pressure_systolic', 'blood_pressure_diastolic',
            'blood_pressure', 'heart_rate', 'respiratory_rate',
            'medications', 'dosage', 'instructions', 'doctor_notes',
            'follow_up_required', 'follow_up_date',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PrescriptionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating prescriptions"""
    
    class Meta:
        model = Prescription
        fields = [
            'doctor', 'patient', 'appointment',
            'chief_complaint', 'diagnosis',
            'temperature', 'blood_pressure_systolic', 'blood_pressure_diastolic',
            'heart_rate', 'respiratory_rate',
            'medications', 'dosage', 'instructions', 'doctor_notes',
            'follow_up_required', 'follow_up_date'
        ]
    
    def validate(self, data):
        """Validate prescription data"""
        if not data.get('chief_complaint'):
            raise serializers.ValidationError("Chief complaint is required")
        if not data.get('diagnosis'):
            raise serializers.ValidationError("Diagnosis is required")
        if not data.get('medications'):
            raise serializers.ValidationError("Medications are required")
        if not data.get('dosage'):
            raise serializers.ValidationError("Dosage is required")
        return data
