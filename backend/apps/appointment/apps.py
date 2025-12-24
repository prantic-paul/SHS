"""
App configuration for Appointment app
"""
from django.apps import AppConfig


class AppointmentConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.appointment'
    verbose_name = 'Appointment Management'
    
    def ready(self):
        """
        Import signals when app is ready
        """
        pass
