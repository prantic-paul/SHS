from django.apps import AppConfig


class MedicalRecordConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.medical_record'
    verbose_name = 'Medical Record Management'
    
    def ready(self):
        """Import signals when app is ready"""
        try:
            import apps.medical_record.signals
        except ImportError:
            pass
