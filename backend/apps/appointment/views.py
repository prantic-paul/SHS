"""
Views for the appointment app
"""
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.utils import timezone
from datetime import date, timedelta
from .models import Appointment
from .serializers import (
    AppointmentListSerializer,
    AppointmentDetailSerializer,
    AppointmentCreateSerializer,
    AppointmentUpdateSerializer,
)


class AppointmentListCreateView(generics.ListCreateAPIView):
    """
    API view to list and create appointments
    GET /api/v1/appointments/
    POST /api/v1/appointments/
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Return appointments based on user role
        - Patients see their own appointments
        - Doctors see appointments booked with them
        """
        user = self.request.user
        
        if user.role == 'DOCTOR' and hasattr(user, 'doctor_profile'):
            # Doctors see appointments with them
            return Appointment.objects.filter(doctor=user.doctor_profile)
        else:
            # Patients see their own appointments
            return Appointment.objects.filter(patient=user)
    
    def get_serializer_class(self):
        """
        Use different serializers for list and create
        """
        if self.request.method == 'POST':
            return AppointmentCreateSerializer
        return AppointmentListSerializer
    
    def get_serializer_context(self):
        """
        Add request to serializer context
        """
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def create(self, request, *args, **kwargs):
        """
        Create appointment and return success message with details
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save()
        
        # Return detailed response with appointment info
        response_serializer = AppointmentDetailSerializer(appointment)
        return Response({
            'success': True,
            'message': 'Appointment booked successfully!',
            'appointment': response_serializer.data,
        }, status=status.HTTP_201_CREATED)


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve, update, or delete a specific appointment
    GET /api/v1/appointments/{id}/
    PUT /api/v1/appointments/{id}/
    PATCH /api/v1/appointments/{id}/
    DELETE /api/v1/appointments/{id}/
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Users can only access their own appointments
        - Patients: their booked appointments
        - Doctors: appointments with them OR appointments they booked as patients
        """
        user = self.request.user
        
        if user.role == 'DOCTOR' and hasattr(user, 'doctor_profile'):
            # Doctors can access appointments WITH them OR appointments they booked as patients
            return Appointment.objects.filter(
                Q(doctor=user.doctor_profile) | Q(patient=user)
            )
        else:
            # Regular patients can only access appointments they booked
            return Appointment.objects.filter(patient=user)
    
    def get_serializer_class(self):
        """
        Use different serializers for different methods
        """
        if self.request.method in ['PUT', 'PATCH']:
            return AppointmentUpdateSerializer
        return AppointmentDetailSerializer
    
    def destroy(self, request, *args, **kwargs):
        """
        Delete appointment record instead of marking it cancelled
        """
        instance = self.get_object()

        # Only allow deletion if appointment is not completed
        if instance.status == 'COMPLETED':
            return Response(
                {'error': 'Cannot delete completed appointments.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        instance.delete()

        return Response(
            {'success': True, 'message': 'Appointment deleted successfully.'},
            status=status.HTTP_200_OK
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_appointments_view(request):
    """
    Get all appointments for the logged-in user (appointments they BOOKED as a patient)
    Separated by upcoming and past appointments
    Even doctors see appointments they booked with other doctors
    GET /api/v1/appointments/my-appointments/
    """
    user = request.user
    today = date.today()
    
    # All users (including doctors) see appointments they booked as patients
    # Cancelled appointments are deleted, so no need to exclude them
    appointments = Appointment.objects.filter(patient=user)
    
    # Separate upcoming and past, sorted by time
    # Upcoming: future dates that are not completed
    upcoming = appointments.filter(
        appointment_date__gte=today
    ).exclude(status='COMPLETED').order_by('appointment_date', 'serial_number')
    
    # Past: old dates OR completed status
    past = appointments.filter(
        Q(appointment_date__lt=today) | Q(status='COMPLETED')
    ).order_by('-appointment_date', '-serial_number')
    
    upcoming_serializer = AppointmentListSerializer(upcoming, many=True)
    past_serializer = AppointmentListSerializer(past, many=True)
    
    return Response({
        'upcoming': upcoming_serializer.data,
        'past': past_serializer.data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_today_appointments_view(request):
    """
    Get today's appointments for a doctor (for queue management)
    Sorted by time with priority:
    - Appointments with future time come first (sorted by time ascending)
    - Appointments with past time come last (sorted by time ascending)
    GET /api/v1/appointments/doctor/today/
    """
    user = request.user
    
    if user.role != 'DOCTOR' or not hasattr(user, 'doctor_profile'):
        return Response(
            {'error': 'Only doctors can access this endpoint'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    today = date.today()
    current_time = timezone.now().time()
    
    # Get all today's appointments excluding completed ones
    appointments = Appointment.objects.filter(
        doctor=user.doctor_profile,
        appointment_date=today
    ).exclude(status='COMPLETED')
    
    # Use approximate_time if available for sorting and filtering
    # Only show upcoming appointments (exclude missed ones)
    upcoming_appointments = []
    no_time_appointments = []

    for apt in appointments:
        apt_time = getattr(apt, 'approximate_time', None) or apt.get_approximate_time()
        if apt_time:
            # Only include if appointment time hasn't passed
            if apt_time >= current_time:
                upcoming_appointments.append(apt)
            # Missed appointments are not included (they should be deleted)
        else:
            no_time_appointments.append(apt)

    upcoming_appointments = sorted(upcoming_appointments, key=lambda x: getattr(x, 'approximate_time', x.get_approximate_time()))
    appointments_without_time_sorted = sorted(no_time_appointments, key=lambda x: x.serial_number)
    
    # Only return upcoming appointments (no missed appointments)
    sorted_appointments = upcoming_appointments + appointments_without_time_sorted
    
    serializer = AppointmentListSerializer(sorted_appointments, many=True)
    
    return Response({
        'date': today,
        'total_appointments': len(sorted_appointments),
        'upcoming_count': len(upcoming_appointments),
        'missed_count': 0,  # Missed appointments are deleted, not shown
        'no_time_count': len(appointments_without_time_sorted),
        'appointments': serializer.data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_tomorrow_appointments_view(request):
    """
    Get tomorrow's appointments for a doctor
    Sorted by appointment time
    GET /api/v1/appointments/doctor/tomorrow/
    """
    user = request.user
    
    if user.role != 'DOCTOR' or not hasattr(user, 'doctor_profile'):
        return Response(
            {'error': 'Only doctors can access this endpoint'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    tomorrow = date.today() + timedelta(days=1)
    
    # Get all tomorrow's appointments excluding completed
    appointments = Appointment.objects.filter(
        doctor=user.doctor_profile,
        appointment_date=tomorrow
    ).exclude(status='COMPLETED').order_by('serial_number')
    
    serializer = AppointmentListSerializer(appointments, many=True)
    
    return Response({
        'date': tomorrow,
        'total_appointments': appointments.count(),
        'appointments': serializer.data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_completed_appointments_view(request):
    """
    Get completed (prescribed) appointments for a doctor
    Sorted by date descending (most recent first)
    GET /api/v1/appointments/doctor/completed/
    """
    user = request.user
    
    if user.role != 'DOCTOR' or not hasattr(user, 'doctor_profile'):
        return Response(
            {'error': 'Only doctors can access this endpoint'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Get all completed appointments
    appointments = Appointment.objects.filter(
        doctor=user.doctor_profile,
        status='COMPLETED'
    ).order_by('-appointment_date', '-created_at')
    
    serializer = AppointmentListSerializer(appointments, many=True)
    
    return Response({
        'total_appointments': appointments.count(),
        'appointments': serializer.data,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_missed_appointments_view(request):
    """
    Delete appointments that have missed their time
    Can be called by a cron job or manually
    Only staff/admin can trigger this
    POST /api/v1/appointments/cleanup-missed/
    """
    if not request.user.is_staff:
        return Response(
            {'error': 'Only staff members can trigger this action'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    today = date.today()
    current_time = timezone.now().time()
    
    # Find all appointments for today whose approximate time has passed
    missed_appointments = []
    for apt in Appointment.objects.filter(appointment_date=today):
        apt_time = getattr(apt, 'approximate_time', None) or apt.get_approximate_time()
        if apt_time and apt_time < current_time:
            missed_appointments.append(apt.id)

    count = len(missed_appointments)
    if count:
        Appointment.objects.filter(id__in=missed_appointments).delete()
    
    return Response({
        'success': True,
        'message': f'Deleted {count} missed appointments',
        'deleted_count': count,
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def auto_delete_missed_appointment(request, pk):
    """
    Automatically delete a specific missed appointment
    DELETE /api/v1/appointments/{id}/delete-if-missed/
    """
    try:
        appointment = Appointment.objects.get(pk=pk)
        
        # Check if user has permission (patient or doctor)
        user = request.user
        if appointment.patient != user and (
            user.role != 'DOCTOR' or not hasattr(user, 'doctor_profile') or 
            appointment.doctor != user.doctor_profile
        ):
            return Response(
                {'error': 'You do not have permission to delete this appointment'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if appointment is actually missed using approximate_time
        if appointment.appointment_date == date.today():
            current_time = timezone.now().time()
            apt_time = getattr(appointment, 'approximate_time', None) or appointment.get_approximate_time()
            if apt_time and apt_time < current_time and appointment.status in ['PENDING', 'CONFIRMED']:
                appointment.delete()
                return Response({
                    'success': True,
                    'message': 'Missed appointment deleted successfully'
                })
        
        return Response(
            {'error': 'Appointment is not eligible for deletion (not missed)'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Appointment.DoesNotExist:
        return Response(
            {'error': 'Appointment not found'},
            status=status.HTTP_404_NOT_FOUND
        )
