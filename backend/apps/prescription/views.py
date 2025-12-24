"""
Prescription Views
API views for managing prescriptions
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Prescription
from .serializers import PrescriptionSerializer, PrescriptionCreateSerializer


class PrescriptionViewSet(viewsets.ModelViewSet):
    """ViewSet for prescription CRUD operations"""
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter prescriptions based on user role"""
        user = self.request.user
        
        if user.role == 'DOCTOR':
            # Doctors see their own prescriptions
            return Prescription.objects.filter(doctor__user=user)
        elif user.role == 'PATIENT':
            # Patients see their own prescriptions
            return Prescription.objects.filter(patient=user)
        
        return Prescription.objects.none()
    
    def get_serializer_class(self):
        """Return appropriate serializer"""
        if self.action in ['create', 'update', 'partial_update']:
            return PrescriptionCreateSerializer
        return PrescriptionSerializer
    
    def perform_create(self, serializer):
        """Create prescription with validation"""
        user = self.request.user
        
        # Ensure user is a doctor
        if user.role != 'DOCTOR':
            raise ValueError("Only doctors can create prescriptions")
        
        # Check if doctor profile exists
        if not hasattr(user, 'doctor_profile'):
            raise ValueError("Doctor profile not found")
        
        # Save prescription
        prescription = serializer.save()
        
        # Update appointment status to COMPLETED
        if prescription.appointment:
            appointment = prescription.appointment
            appointment.status = 'COMPLETED'
            appointment.save()
    
    @action(detail=False, methods=['get'])
    def by_appointment(self, request):
        """Get prescription by appointment ID"""
        appointment_id = request.query_params.get('appointment_id')
        
        if not appointment_id:
            return Response(
                {"error": "appointment_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            prescription = self.get_queryset().get(appointment_id=appointment_id)
            serializer = self.get_serializer(prescription)
            return Response(serializer.data)
        except Prescription.DoesNotExist:
            return Response(
                {"error": "Prescription not found"},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def patient_history(self, request):
        """Get prescription history for a patient"""
        patient_id = request.query_params.get('patient_id')
        
        if not patient_id:
            return Response(
                {"error": "patient_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        prescriptions = self.get_queryset().filter(patient_id=patient_id)
        serializer = self.get_serializer(prescriptions, many=True)
        return Response(serializer.data)
