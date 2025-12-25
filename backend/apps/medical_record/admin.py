"""
Medical Record Admin Configuration
Django admin interface for medical records
"""
from django.contrib import admin
from .models import MedicalRecord, Prescription, MedicalTest, Allergy


class PrescriptionInline(admin.TabularInline):
    """Inline admin for prescriptions"""
    model = Prescription
    extra = 1
    fields = ['medication_name', 'dosage', 'frequency', 'duration', 'duration_unit', 'instructions']


class MedicalTestInline(admin.TabularInline):
    """Inline admin for medical tests"""
    model = MedicalTest
    extra = 1
    fields = ['test_name', 'test_type', 'status', 'instructions', 'results', 'result_date']


@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    """Admin interface for medical records"""
    list_display = [
        'id', 'patient', 'doctor', 'visit_date', 'chief_complaint',
        'diagnosis', 'follow_up_required', 'created_at'
    ]
    list_filter = ['visit_date', 'follow_up_required', 'created_at', 'doctor']
    search_fields = ['patient__name', 'doctor__user__name', 'diagnosis', 'chief_complaint']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'visit_date'
    inlines = [PrescriptionInline, MedicalTestInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('appointment', 'patient', 'doctor', 'visit_date')
        }),
        ('Symptoms & Complaints', {
            'fields': ('chief_complaint', 'symptoms')
        }),
        ('Vital Signs', {
            'fields': (
                'temperature', 'blood_pressure_systolic', 'blood_pressure_diastolic',
                'heart_rate', 'respiratory_rate', 'weight', 'height'
            ),
            'classes': ('collapse',)
        }),
        ('Medical Assessment', {
            'fields': ('diagnosis', 'treatment_plan', 'doctor_notes')
        }),
        ('Follow-up', {
            'fields': ('follow_up_required', 'follow_up_date', 'follow_up_notes'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    """Admin interface for prescriptions"""
    list_display = [
        'id', 'medical_record', 'medication_name', 'dosage',
        'frequency', 'duration', 'duration_unit', 'created_at'
    ]
    list_filter = ['frequency', 'duration_unit', 'created_at']
    search_fields = ['medication_name', 'medical_record__patient__name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Medical Record', {
            'fields': ('medical_record',)
        }),
        ('Medication Details', {
            'fields': ('medication_name', 'dosage', 'frequency', 'duration', 'duration_unit', 'instructions')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(MedicalTest)
class MedicalTestAdmin(admin.ModelAdmin):
    """Admin interface for medical tests"""
    list_display = [
        'id', 'medical_record', 'test_name', 'test_type',
        'status', 'result_date', 'created_at'
    ]
    list_filter = ['status', 'test_type', 'created_at', 'result_date']
    search_fields = ['test_name', 'test_type', 'medical_record__patient__name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Medical Record', {
            'fields': ('medical_record',)
        }),
        ('Test Details', {
            'fields': ('test_name', 'test_type', 'status', 'instructions')
        }),
        ('Results', {
            'fields': ('results', 'result_date', 'result_file')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Allergy)
class AllergyAdmin(admin.ModelAdmin):
    """Admin interface for allergies"""
    list_display = [
        'id', 'patient', 'allergen', 'allergy_type',
        'severity', 'created_at'
    ]
    list_filter = ['severity', 'allergy_type', 'created_at']
    search_fields = ['patient__name', 'allergen', 'allergy_type']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Patient', {
            'fields': ('patient',)
        }),
        ('Allergy Details', {
            'fields': ('allergen', 'allergy_type', 'severity', 'reaction', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
