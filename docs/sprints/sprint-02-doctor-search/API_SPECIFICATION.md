# Sprint 2: API Endpoint Specification

**Sprint**: Sprint 2 - Doctor Search & Discovery  
**API Version**: v1  
**Base URL**: `http://localhost:8000/api/v1` (Development)  
**Authentication**: JWT Bearer Token (for future protected endpoints)

---

## Table of Contents

1. [API Overview](#api-overview)
2. [Doctor List Endpoint](#doctor-list-endpoint)
3. [Doctor Detail Endpoint](#doctor-detail-endpoint)
4. [Specializations Endpoint](#specializations-endpoint)
5. [Error Responses](#error-responses)
6. [Rate Limiting](#rate-limiting)

---

## API Overview

### Base Configuration

```python
# backend/config/settings.py

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}
```

### HTTP Methods

| Endpoint | GET | POST | PUT | PATCH | DELETE |
|----------|-----|------|-----|-------|--------|
| `/doctors/` | ✅ List | ❌ | ❌ | ❌ | ❌ |
| `/doctors/{id}/` | ✅ Retrieve | ❌ | ❌ | ❌ | ❌ |
| `/doctors/specializations/` | ✅ List | ❌ | ❌ | ❌ | ❌ |

---

## Doctor List Endpoint

### Endpoint Details

**URL**: `/api/v1/doctors/`  
**Method**: `GET`  
**Authentication**: Not Required (Public endpoint)  
**Description**: Retrieve a paginated list of verified doctors with search and filter capabilities

### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `page` | integer | No | Page number (default: 1) | `?page=2` |
| `page_size` | integer | No | Results per page (default: 10, max: 100) | `?page_size=20` |
| `search` | string | No | Search by doctor name or specialization | `?search=john` |
| `specialization` | string | No | Filter by specialization (can be multiple) | `?specialization=Cardiology&specialization=Neurology` |
| `min_experience` | integer | No | Minimum years of experience | `?min_experience=10` |
| `max_experience` | integer | No | Maximum years of experience | `?max_experience=20` |
| `min_rating` | float | No | Minimum rating (0.0 - 5.0) | `?min_rating=4.0` |
| `location` | string | No | Filter by practice location | `?location=New York` |
| `ordering` | string | No | Sort results (see ordering options) | `?ordering=-rating_avg` |

### Ordering Options

| Value | Description |
|-------|-------------|
| `full_name` | Sort by name A-Z |
| `-full_name` | Sort by name Z-A |
| `years_of_experience` | Sort by experience (ascending) |
| `-years_of_experience` | Sort by experience (descending) |
| `rating_avg` | Sort by rating (ascending) |
| `-rating_avg` | Sort by rating (descending) |
| `created_at` | Sort by registration date (oldest first) |
| `-created_at` | Sort by registration date (newest first) |

### Request Example

```http
GET /api/v1/doctors/?search=cardio&min_experience=10&min_rating=4.0&ordering=-rating_avg&page=1 HTTP/1.1
Host: localhost:8000
Accept: application/json
```

### Response (200 OK)

```json
{
  "count": 25,
  "next": "http://localhost:8000/api/v1/doctors/?page=2&search=cardio&min_experience=10&min_rating=4.0&ordering=-rating_avg",
  "previous": null,
  "results": [
    {
      "id": 1,
      "full_name": "Dr. John Doe",
      "first_name": "John",
      "last_name": "Doe",
      "specialization": "Cardiology",
      "years_of_experience": 15,
      "practice_location": "New York, NY",
      "rating_avg": 4.8,
      "is_verified": true,
      "profile_picture": "http://localhost:8000/media/doctors/profiles/john_doe.jpg"
    },
    {
      "id": 2,
      "full_name": "Dr. Jane Smith",
      "first_name": "Jane",
      "last_name": "Smith",
      "specialization": "Cardiology",
      "years_of_experience": 12,
      "practice_location": "Boston, MA",
      "rating_avg": 4.6,
      "is_verified": true,
      "profile_picture": null
    },
    {
      "id": 3,
      "full_name": "Dr. Mike Johnson",
      "first_name": "Mike",
      "last_name": "Johnson",
      "specialization": "Interventional Cardiology",
      "years_of_experience": 20,
      "practice_location": "Los Angeles, CA",
      "rating_avg": 4.5,
      "is_verified": true,
      "profile_picture": "http://localhost:8000/media/doctors/profiles/mike_johnson.jpg"
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `count` | integer | Total number of doctors matching the filters |
| `next` | string/null | URL for the next page (null if last page) |
| `previous` | string/null | URL for the previous page (null if first page) |
| `results` | array | Array of doctor objects |
| `results[].id` | integer | Doctor's unique identifier |
| `results[].full_name` | string | Full name with "Dr." prefix |
| `results[].first_name` | string | Doctor's first name |
| `results[].last_name` | string | Doctor's last name |
| `results[].specialization` | string | Medical specialization |
| `results[].years_of_experience` | integer | Years of medical experience |
| `results[].practice_location` | string | Practice location (city, state) |
| `results[].rating_avg` | float | Average rating (0.0 - 5.0) |
| `results[].is_verified` | boolean | Verification status (always true for listed doctors) |
| `results[].profile_picture` | string/null | URL to profile picture or null |

### Filter Combinations

#### Example 1: Search by Name
```http
GET /api/v1/doctors/?search=john
```
Returns doctors whose name contains "john" (case-insensitive)

#### Example 2: Filter by Specialization
```http
GET /api/v1/doctors/?specialization=Cardiology
```
Returns only cardiologists

#### Example 3: Multiple Specializations (OR Logic)
```http
GET /api/v1/doctors/?specialization=Cardiology&specialization=Neurology
```
Returns doctors who are cardiologists OR neurologists

#### Example 4: Experience Range
```http
GET /api/v1/doctors/?min_experience=10&max_experience=20
```
Returns doctors with 10-20 years of experience

#### Example 5: High-Rated Experienced Doctors
```http
GET /api/v1/doctors/?min_rating=4.5&min_experience=15&ordering=-rating_avg
```
Returns doctors with rating ≥4.5 and experience ≥15 years, sorted by rating

#### Example 6: Location-Based Search
```http
GET /api/v1/doctors/?location=New York&specialization=Pediatrics
```
Returns pediatricians practicing in New York

#### Example 7: Combined Search and Filters
```http
GET /api/v1/doctors/?search=cardio&min_experience=10&min_rating=4.0&location=Boston
```
Returns cardiologists in Boston with 10+ years experience and 4+ rating

### Empty Results Response (200 OK)

```json
{
  "count": 0,
  "next": null,
  "previous": null,
  "results": []
}
```

---

## Doctor Detail Endpoint

### Endpoint Details

**URL**: `/api/v1/doctors/{id}/`  
**Method**: `GET`  
**Authentication**: Not Required (Public endpoint)  
**Description**: Retrieve detailed information about a specific doctor

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Doctor's unique identifier |

### Request Example

```http
GET /api/v1/doctors/1/ HTTP/1.1
Host: localhost:8000
Accept: application/json
```

### Response (200 OK)

```json
{
  "id": 1,
  "user": {
    "id": 5,
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "DOCTOR"
  },
  "full_name": "Dr. John Doe",
  "specialization": "Cardiology",
  "license_number": "LIC123456",
  "years_of_experience": 15,
  "practice_location": "New York, NY",
  "bio": "Dr. John Doe is a board-certified cardiologist with over 15 years of experience in interventional cardiology. He specializes in minimally invasive procedures and has performed over 2,000 successful cardiac catheterizations.",
  "education": "Harvard Medical School (MD), Johns Hopkins University (Residency), Mayo Clinic (Fellowship)",
  "qualifications": "MBBS, MD, FACC, FSCAI",
  "rating_avg": 4.8,
  "is_verified": true,
  "status": "APPROVED",
  "profile_picture": "http://localhost:8000/media/doctors/profiles/john_doe.jpg",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-12-20T14:22:00Z"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Doctor's unique identifier |
| `user` | object | Associated user account information |
| `user.id` | integer | User account ID |
| `user.email` | string | User's email address |
| `user.first_name` | string | User's first name |
| `user.last_name` | string | User's last name |
| `user.role` | string | User role (always "DOCTOR") |
| `full_name` | string | Full name with "Dr." prefix |
| `specialization` | string | Medical specialization |
| `license_number` | string | Medical license number |
| `years_of_experience` | integer | Years of medical experience |
| `practice_location` | string | Full practice location |
| `bio` | string/null | Professional biography |
| `education` | string/null | Educational background |
| `qualifications` | string/null | Medical qualifications/certifications |
| `rating_avg` | float | Average rating (0.0 - 5.0) |
| `is_verified` | boolean | Verification status |
| `status` | string | Approval status (APPROVED, PENDING, REJECTED) |
| `profile_picture` | string/null | URL to profile picture |
| `created_at` | datetime | Registration timestamp (ISO 8601) |
| `updated_at` | datetime | Last update timestamp (ISO 8601) |

### Error Response - Not Found (404)

```json
{
  "detail": "Not found."
}
```

**Scenarios for 404:**
- Doctor ID doesn't exist
- Doctor status is not "APPROVED"
- Doctor is not verified (`is_verified=False`)

---

## Specializations Endpoint

### Endpoint Details

**URL**: `/api/v1/doctors/specializations/`  
**Method**: `GET`  
**Authentication**: Not Required (Public endpoint)  
**Description**: Get a list of all available medical specializations with doctor counts

### Request Example

```http
GET /api/v1/doctors/specializations/ HTTP/1.1
Host: localhost:8000
Accept: application/json
```

### Response (200 OK)

```json
{
  "specializations": [
    {
      "name": "Cardiology",
      "count": 15
    },
    {
      "name": "Neurology",
      "count": 12
    },
    {
      "name": "Orthopedics",
      "count": 10
    },
    {
      "name": "Pediatrics",
      "count": 18
    },
    {
      "name": "Dermatology",
      "count": 8
    },
    {
      "name": "General Medicine",
      "count": 25
    },
    {
      "name": "Psychiatry",
      "count": 7
    },
    {
      "name": "Ophthalmology",
      "count": 6
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `specializations` | array | List of specialization objects |
| `specializations[].name` | string | Specialization name |
| `specializations[].count` | integer | Number of verified doctors in this specialization |

### Use Cases

This endpoint is useful for:
1. Populating specialization filter dropdowns
2. Showing specialization statistics on the homepage
3. Creating "Browse by Specialization" sections
4. Displaying specialization counts in filter panels

---

## Error Responses

### Standard Error Format

All API errors follow this JSON structure:

```json
{
  "detail": "Error message description",
  "code": "error_code"
}
```

### HTTP Status Codes

| Status Code | Description | Example Scenario |
|-------------|-------------|------------------|
| `200 OK` | Success | Data retrieved successfully |
| `400 Bad Request` | Invalid request | Invalid query parameters |
| `404 Not Found` | Resource not found | Doctor ID doesn't exist |
| `500 Internal Server Error` | Server error | Database connection failure |
| `503 Service Unavailable` | Service temporarily down | Maintenance mode |

### Error Examples

#### 400 Bad Request - Invalid Parameter

```json
{
  "detail": "Invalid value for 'min_rating'. Must be between 0 and 5.",
  "code": "invalid_parameter"
}
```

**Triggers:**
- `?min_rating=10` (out of range)
- `?page=-1` (negative page number)
- `?page_size=1000` (exceeds max limit)

#### 404 Not Found - Doctor Not Found

```json
{
  "detail": "Not found."
}
```

**Triggers:**
- `/api/v1/doctors/99999/` (non-existent ID)
- `/api/v1/doctors/5/` (doctor not approved/verified)

#### 500 Internal Server Error

```json
{
  "detail": "An error occurred while processing your request. Please try again later.",
  "code": "internal_error"
}
```

---

## Rate Limiting

### Current Configuration

**Sprint 2**: No rate limiting implemented  
**Sprint 3+**: Will implement rate limiting for production

### Planned Rate Limits (Future)

| User Type | Limit | Window |
|-----------|-------|--------|
| Anonymous | 100 requests | 1 hour |
| Authenticated | 1000 requests | 1 hour |
| Premium | Unlimited | - |

### Rate Limit Headers (Future)

When implemented, responses will include:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

### Rate Limit Exceeded Response (429)

```json
{
  "detail": "Request limit exceeded. Please try again in 30 minutes.",
  "code": "rate_limit_exceeded",
  "retry_after": 1800
}
```

---

## Backend Implementation Guide

### 1. URL Configuration

```python
# backend/apps/doctors/urls.py

from django.urls import path
from .views import DoctorListView, DoctorDetailView, SpecializationListView

urlpatterns = [
    path('', DoctorListView.as_view(), name='doctor-list'),
    path('<int:pk>/', DoctorDetailView.as_view(), name='doctor-detail'),
    path('specializations/', SpecializationListView.as_view(), name='specialization-list'),
]
```

```python
# backend/config/urls.py

from django.urls import path, include

urlpatterns = [
    # ... other patterns
    path('api/v1/doctors/', include('apps.doctors.urls')),
]
```

### 2. Serializers

```python
# backend/apps/doctors/serializers/doctor_list.py

from rest_framework import serializers
from apps.doctors.models import DoctorInformation

class DoctorListSerializer(serializers.ModelSerializer):
    """Serializer for doctor list view."""
    
    full_name = serializers.SerializerMethodField()
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    
    class Meta:
        model = DoctorInformation
        fields = [
            'id',
            'full_name',
            'first_name',
            'last_name',
            'specialization',
            'years_of_experience',
            'practice_location',
            'rating_avg',
            'is_verified',
            'profile_picture',
        ]
    
    def get_full_name(self, obj):
        return f"Dr. {obj.user.get_full_name()}"
```

```python
# backend/apps/doctors/serializers/doctor_detail.py

from rest_framework import serializers
from apps.doctors.models import DoctorInformation
from apps.users.serializers import UserSerializer

class DoctorDetailSerializer(serializers.ModelSerializer):
    """Serializer for doctor detail view with complete information."""
    
    user = UserSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = DoctorInformation
        fields = [
            'id',
            'user',
            'full_name',
            'specialization',
            'license_number',
            'years_of_experience',
            'practice_location',
            'bio',
            'education',
            'qualifications',
            'rating_avg',
            'is_verified',
            'status',
            'profile_picture',
            'created_at',
            'updated_at',
        ]
    
    def get_full_name(self, obj):
        return f"Dr. {obj.user.get_full_name()}"
```

### 3. Filters

```python
# backend/apps/doctors/filters.py

import django_filters
from .models import DoctorInformation

class DoctorFilter(django_filters.FilterSet):
    """Custom filter set for DoctorInformation model."""
    
    specialization = django_filters.MultipleChoiceFilter(
        field_name='specialization',
        lookup_expr='iexact',
        choices=[]  # Will be populated dynamically
    )
    
    min_experience = django_filters.NumberFilter(
        field_name='years_of_experience',
        lookup_expr='gte'
    )
    
    max_experience = django_filters.NumberFilter(
        field_name='years_of_experience',
        lookup_expr='lte'
    )
    
    min_rating = django_filters.NumberFilter(
        field_name='rating_avg',
        lookup_expr='gte'
    )
    
    location = django_filters.CharFilter(
        field_name='practice_location',
        lookup_expr='icontains'
    )
    
    class Meta:
        model = DoctorInformation
        fields = ['specialization', 'min_experience', 'max_experience', 'min_rating', 'location']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Dynamically populate specialization choices
        specializations = DoctorInformation.objects.values_list('specialization', flat=True).distinct()
        self.filters['specialization'].extra['choices'] = [(s, s) for s in specializations]
```

### 4. Views

```python
# backend/apps/doctors/views/doctor_list.py

from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from apps.doctors.models import DoctorInformation
from apps.doctors.serializers import DoctorListSerializer
from apps.doctors.filters import DoctorFilter

class DoctorListView(generics.ListAPIView):
    """
    API endpoint for listing verified doctors.
    Supports search, filtering, and pagination.
    """
    serializer_class = DoctorListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = DoctorFilter
    search_fields = ['user__first_name', 'user__last_name', 'specialization']
    ordering_fields = ['user__first_name', 'years_of_experience', 'rating_avg', 'created_at']
    ordering = ['-rating_avg']  # Default ordering
    
    def get_queryset(self):
        """Return only verified doctors."""
        return DoctorInformation.objects.verified().select_related('user')
```

```python
# backend/apps/doctors/views/doctor_detail.py

from rest_framework import generics
from rest_framework.exceptions import NotFound
from apps.doctors.models import DoctorInformation
from apps.doctors.serializers import DoctorDetailSerializer

class DoctorDetailView(generics.RetrieveAPIView):
    """
    API endpoint for retrieving detailed information about a doctor.
    Only returns verified doctors.
    """
    serializer_class = DoctorDetailSerializer
    lookup_field = 'pk'
    
    def get_queryset(self):
        """Return only verified doctors."""
        return DoctorInformation.objects.verified().select_related('user')
    
    def get_object(self):
        """Override to provide custom 404 handling."""
        try:
            return super().get_object()
        except DoctorInformation.DoesNotExist:
            raise NotFound("Doctor not found or not verified.")
```

```python
# backend/apps/doctors/views/specializations.py

from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count
from apps.doctors.models import DoctorInformation

class SpecializationListView(APIView):
    """
    API endpoint for listing all specializations with doctor counts.
    """
    
    def get(self, request):
        """Return list of specializations with counts."""
        specializations = (
            DoctorInformation.objects
            .verified()
            .values('specialization')
            .annotate(count=Count('id'))
            .order_by('specialization')
        )
        
        return Response({
            'specializations': [
                {'name': item['specialization'], 'count': item['count']}
                for item in specializations
            ]
        })
```

### 5. Model QuerySet Manager

```python
# backend/apps/doctors/models.py

from django.db import models

class DoctorInformationManager(models.Manager):
    """Custom manager for DoctorInformation model."""
    
    def verified(self):
        """Return only verified and approved doctors."""
        return self.filter(status='APPROVED', is_verified=True)

class DoctorInformation(models.Model):
    """Doctor information model."""
    
    # ... existing fields ...
    
    objects = DoctorInformationManager()
    
    class Meta:
        verbose_name = 'Doctor Information'
        verbose_name_plural = 'Doctor Information'
        ordering = ['-created_at']
```

---

## Frontend Integration Examples

### 1. API Service

```javascript
// frontend/src/services/doctorAPI.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const doctorAPI = {
  /**
   * Get list of doctors with optional filters
   * @param {Object} params - Query parameters
   * @returns {Promise} API response with paginated doctor list
   */
  getDoctors: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctors/`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Get doctor details by ID
   * @param {number} id - Doctor ID
   * @returns {Promise} API response with doctor details
   */
  getDoctorById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctors/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Get list of specializations
   * @returns {Promise} API response with specializations
   */
  getSpecializations: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctors/specializations/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
```

### 2. Usage Example in Component

```javascript
// frontend/src/pages/DoctorsPage.jsx

import { useState, useEffect } from 'react';
import { doctorAPI } from '../services/doctorAPI';

function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    specialization: [],
    min_experience: null,
    min_rating: null,
  });
  
  useEffect(() => {
    fetchDoctors();
  }, [filters]);
  
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await doctorAPI.getDoctors(filters);
      setDoctors(data.results);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Component rendering...
}
```

---

**Created**: December 22, 2025  
**Last Updated**: December 22, 2025  
**Status**: Ready for Implementation
