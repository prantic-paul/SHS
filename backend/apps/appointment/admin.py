"""
Admin configuration for Appointment app
"""
from django.contrib import admin
from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    """
    Admin interface for Appointment model
    """
    list_display = [
        'appointment_number',
        'doctor',
        'patient',
        'appointment_date',
    'approximate_time',
        'serial_number',
        'status',
        'created_at'
    ]
    list_filter = ['status', 'appointment_date', 'created_at']
    search_fields = [
        'appointment_number',
        'doctor__user__name',
        'patient__name',
        'patient__email'
    ]
    readonly_fields = ['appointment_number', 'serial_number', 'created_at', 'updated_at']
    ordering = ['-appointment_date', 'serial_number']
    date_hierarchy = 'appointment_date'
    
    fieldsets = (
        ('Appointment Information', {
            'fields': ('appointment_number', 'doctor', 'patient', 'serial_number')
        }),
        ('Schedule', {
            'fields': ('appointment_date', 'approximate_time', 'status')
        }),
        ('Notes', {
            'fields': ('patient_notes', 'doctor_notes'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """
        Customize queryset with select_related for performance
        """
        qs = super().get_queryset(request)
        return qs.select_related('doctor__user', 'patient')
