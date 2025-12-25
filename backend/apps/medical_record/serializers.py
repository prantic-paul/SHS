"""
Medical Record Serializers
Serializers for medical records, prescriptions, tests, and allergies
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import MedicalRecord, Prescription, MedicalTest, Allergy

User = get_user_model()


class PrescriptionSerializer(serializers.ModelSerializer):
    """Serializer for prescriptions"""
    
    frequency_display = serializers.CharField(source='get_frequency_display', read_only=True)
    duration_unit_display = serializers.CharField(source='get_duration_unit_display', read_only=True)
    
    class Meta:
        model = Prescription
        fields = [
            'id', 'medication_name', 'dosage', 'frequency', 'frequency_display',
            'duration', 'duration_unit', 'duration_unit_display', 'instructions',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class MedicalTestSerializer(serializers.ModelSerializer):
    """Serializer for medical tests"""
    
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = MedicalTest
        fields = [
            'id', 'test_name', 'test_type', 'status', 'status_display',
            'instructions', 'results', 'result_date', 'result_file',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AllergySerializer(serializers.ModelSerializer):
    """Serializer for patient allergies"""
    
    severity_display = serializers.CharField(source='get_severity_display', read_only=True)
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    
    class Meta:
        model = Allergy
        fields = [
            'id', 'patient', 'patient_name', 'allergen', 'allergy_type',
            'severity', 'severity_display', 'reaction', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class MedicalRecordListSerializer(serializers.ModelSerializer):
    """Serializer for listing medical records (summary view)"""
    
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.name', read_only=True)
    doctor_specialization = serializers.CharField(source='doctor.specialization', read_only=True)
    prescription_count = serializers.SerializerMethodField()
    test_count = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicalRecord
        fields = [
            'id', 'appointment', 'patient', 'patient_name', 'doctor',
            'doctor_name', 'doctor_specialization', 'visit_date',
            'chief_complaint', 'diagnosis', 'follow_up_required',
            'follow_up_date', 'prescription_count', 'test_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_prescription_count(self, obj):
        """Get count of prescriptions"""
        return obj.prescriptions.count()
    
    def get_test_count(self, obj):
        """Get count of medical tests"""
        return obj.medical_tests.count()


class MedicalRecordDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed medical record view"""
    
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    patient_id = serializers.IntegerField(source='patient.id', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.name', read_only=True)
    doctor_id = serializers.IntegerField(source='doctor.id', read_only=True)
    doctor_specialization = serializers.CharField(source='doctor.specialization', read_only=True)
    appointment_id = serializers.IntegerField(source='appointment.id', read_only=True)
    prescriptions = PrescriptionSerializer(many=True, read_only=True)
    medical_tests = MedicalTestSerializer(many=True, read_only=True)
    patient_allergies = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicalRecord
        fields = [
            'id', 'appointment', 'appointment_id', 
            'patient', 'patient_id', 'patient_name',
            'doctor', 'doctor_id', 'doctor_name', 'doctor_specialization',
            'visit_date',
            'chief_complaint', 'symptoms', 'temperature',
            'blood_pressure_systolic', 'blood_pressure_diastolic',
            'heart_rate', 'respiratory_rate', 'weight', 'height',
            'diagnosis', 'treatment_plan', 'doctor_notes',
            'follow_up_required', 'follow_up_date', 'follow_up_notes',
            'prescriptions', 'medical_tests', 'patient_allergies',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_patient_allergies(self, obj):
        """Get patient's allergies"""
        allergies = obj.patient.allergies.all()
        return AllergySerializer(allergies, many=True).data


class MedicalRecordCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating medical records"""
    
    prescriptions = PrescriptionSerializer(many=True, required=False)
    medical_tests = MedicalTestSerializer(many=True, required=False)
    
    class Meta:
        model = MedicalRecord
        fields = [
            'id', 'appointment', 'patient', 'doctor', 'visit_date',
            'chief_complaint', 'symptoms', 'temperature',
            'blood_pressure_systolic', 'blood_pressure_diastolic',
            'heart_rate', 'respiratory_rate', 'weight', 'height',
            'diagnosis', 'treatment_plan', 'doctor_notes',
            'follow_up_required', 'follow_up_date', 'follow_up_notes',
            'prescriptions', 'medical_tests',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate(self, data):
        """Validate medical record data"""
        # Ensure at least chief complaint is provided
        if not data.get('chief_complaint'):
            raise serializers.ValidationError({
                'chief_complaint': 'Chief complaint is required'
            })
        
        # Validate follow-up
        if data.get('follow_up_required') and not data.get('follow_up_date'):
            raise serializers.ValidationError({
                'follow_up_date': 'Follow-up date is required when follow-up is needed'
            })
        
        return data
    
    def create(self, validated_data):
        """Create medical record with nested prescriptions and tests"""
        prescriptions_data = validated_data.pop('prescriptions', [])
        medical_tests_data = validated_data.pop('medical_tests', [])
        
        # Create medical record
        medical_record = MedicalRecord.objects.create(**validated_data)
        
        # Create prescriptions
        for prescription_data in prescriptions_data:
            Prescription.objects.create(
                medical_record=medical_record,
                **prescription_data
            )
        
        # Create medical tests
        for test_data in medical_tests_data:
            MedicalTest.objects.create(
                medical_record=medical_record,
                **test_data
            )
        
        return medical_record
    
    def update(self, instance, validated_data):
        """Update medical record with nested prescriptions and tests"""
        prescriptions_data = validated_data.pop('prescriptions', [])
        medical_tests_data = validated_data.pop('medical_tests', [])
        
        # Update medical record fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update prescriptions (delete existing and create new ones)
        if prescriptions_data:
            instance.prescriptions.all().delete()
            for prescription_data in prescriptions_data:
                Prescription.objects.create(
                    medical_record=instance,
                    **prescription_data
                )
        
        # Update medical tests (delete existing and create new ones)
        if medical_tests_data:
            instance.medical_tests.all().delete()
            for test_data in medical_tests_data:
                MedicalTest.objects.create(
                    medical_record=instance,
                    **test_data
                )
        
        return instance
