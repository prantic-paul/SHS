"""
URL configuration for the appointment app
"""
from django.urls import path
from . import views

app_name = 'appointment'

urlpatterns = [
    # Appointment CRUD
    path('', views.AppointmentListCreateView.as_view(), name='appointment-list-create'),
    path('<int:pk>/', views.AppointmentDetailView.as_view(), name='appointment-detail'),
    path('<int:pk>/delete-if-missed/', views.auto_delete_missed_appointment, name='delete-missed-appointment'),
    
    # Custom endpoints
    path('my-appointments/', views.my_appointments_view, name='my-appointments'),
    path('doctor/today/', views.doctor_today_appointments_view, name='doctor-today-appointments'),
    path('doctor/tomorrow/', views.doctor_tomorrow_appointments_view, name='doctor-tomorrow-appointments'),
    path('doctor/completed/', views.doctor_completed_appointments_view, name='doctor-completed-appointments'),
    path('cleanup-missed/', views.delete_missed_appointments_view, name='cleanup-missed-appointments'),
]
