"""
URL configuration for the doctors app
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'doctors'

router = DefaultRouter()
router.register(r'schedules', views.DoctorScheduleViewSet, basename='schedule')

urlpatterns = [
    # Doctor endpoints
    path('', views.DoctorListView.as_view(), name='doctor-list'),
    path('<int:pk>/', views.DoctorDetailView.as_view(), name='doctor-detail'),
    path('specializations/', views.specialization_list_view, name='specialization-list'),
    
    # Rating endpoints
    path('<int:doctor_id>/ratings/', views.RatingListCreateView.as_view(), name='rating-list-create'),
    path('<int:doctor_id>/ratings/<int:rating_id>/', views.RatingDetailView.as_view(), name='rating-detail'),
    path('<int:doctor_id>/ratings/breakdown/', views.rating_breakdown_view, name='rating-breakdown'),
    
    # Schedule endpoints (for doctors only)
    path('', include(router.urls)),
]
