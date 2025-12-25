"""
Medical Record URLs
URL routing for medical record API endpoints
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MedicalRecordViewSet,
    PrescriptionViewSet,
    MedicalTestViewSet,
    AllergyViewSet
)

# Create router and register viewsets
router = DefaultRouter()
router.register(r'records', MedicalRecordViewSet, basename='medical-record')
router.register(r'prescriptions', PrescriptionViewSet, basename='prescription')
router.register(r'tests', MedicalTestViewSet, basename='medical-test')
router.register(r'allergies', AllergyViewSet, basename='allergy')

urlpatterns = [
    path('', include(router.urls)),
]
