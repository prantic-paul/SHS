from django.contrib import admin
from .models import Prescription


@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient', 'doctor', 'diagnosis', 'created_at']
    list_filter = ['created_at', 'follow_up_required']
    search_fields = ['patient__name', 'doctor__user__name', 'diagnosis']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('doctor', 'patient', 'appointment')
        }),
        ('Medical Details', {
            'fields': ('chief_complaint', 'diagnosis')
        }),
        ('Vital Signs', {
            'fields': ('temperature', 'blood_pressure_systolic', 'blood_pressure_diastolic', 
                      'heart_rate', 'respiratory_rate')
        }),
        ('Medication', {
            'fields': ('medications', 'dosage', 'instructions')
        }),
        ('Follow-up', {
            'fields': ('follow_up_required', 'follow_up_date')
        }),
        ('Notes', {
            'fields': ('doctor_notes',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
