# Sprint 2: Implementation Guide

**Sprint**: Sprint 2 - Doctor Search & Discovery  
**Duration**: 2 weeks  
**Approach**: Test-Driven Development (TDD)

---

## Table of Contents

1. [Development Workflow](#development-workflow)
2. [Backend Implementation](#backend-implementation)
3. [Frontend Implementation](#frontend-implementation)
4. [Integration Steps](#integration-steps)
5. [Quality Checklist](#quality-checklist)

---

## Development Workflow

### Sprint Ceremony Schedule

| Activity | When | Duration | Participants |
|----------|------|----------|--------------|
| Sprint Planning | Day 1 (Monday) | 2 hours | Full Team |
| Daily Standup | Every Day 10 AM | 15 minutes | Full Team |
| Code Review | Continuous | As needed | Developers |
| Sprint Review | Day 10 (Friday) | 1 hour | Full Team + Stakeholders |
| Sprint Retrospective | Day 10 (Friday) | 1 hour | Full Team |

### Git Workflow

```bash
# 1. Ensure you're on the correct sprint branch
git checkout feature/sprint-2-doctor-search
git pull origin feature/sprint-2-doctor-search

# 2. Create a task branch (convention: task/sprint-2-<feature-name>)
git checkout -b task/sprint-2-doctor-list-api

# 3. Implement feature with TDD
# Write tests first, then implement code

# 4. Commit frequently with descriptive messages
git add .
git commit -m "test: add tests for doctor list API with filters"
git commit -m "feat: implement doctor list API endpoint"

# 5. Push to remote
git push origin task/sprint-2-doctor-list-api

# 6. Create Pull Request to feature/sprint-2-doctor-search
# Request code review from team member

# 7. After approval, merge to sprint branch
git checkout feature/sprint-2-doctor-search
git merge task/sprint-2-doctor-list-api
git push origin feature/sprint-2-doctor-search

# 8. Delete task branch
git branch -d task/sprint-2-doctor-list-api
git push origin --delete task/sprint-2-doctor-list-api
```

### Task Breakdown (2 Weeks)

#### Week 1: Backend + Basic Frontend

**Days 1-2: Backend Setup & Doctor List API**
- Create doctor filters (`DoctorFilter`)
- Implement `DoctorListView` with pagination
- Write comprehensive tests
- Test search and filter functionality

**Days 3-4: Doctor Detail API & Specializations**
- Implement `DoctorDetailView`
- Create `SpecializationListView`
- Write tests for both endpoints
- Test edge cases (404, validation)

**Day 5: Frontend Setup & Doctor List Page**
- Create `DoctorsPage` component
- Implement `DoctorCard` component
- Create API service layer
- Implement basic listing with loading states

#### Week 2: Advanced Features & Polish

**Days 6-7: Search & Filters**
- Implement search bar component
- Create filter panel UI
- Connect filters to API
- Add URL query parameter sync

**Days 8-9: Doctor Detail Page & Testing**
- Create `DoctorDetailPage` component
- Implement responsive layouts
- Write frontend tests
- Fix bugs and improve UX

**Day 10: Polish, Testing & Documentation**
- Code review and refactoring
- Final testing (manual + automated)
- Update documentation
- Sprint review preparation

---

## Backend Implementation

### Step 1: Setup Django App Structure

```bash
cd backend/apps

# Create doctors app if not exists
# (Already exists from Sprint 1, but we'll reorganize)

# Create necessary directories
mkdir -p doctors/views
mkdir -p doctors/serializers
mkdir -p doctors/tests
mkdir -p doctors/filters
```

### Step 2: Create Custom Manager for Verified Doctors

**File**: `backend/apps/doctors/models.py`

```python
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class DoctorInformationManager(models.Manager):
    """Custom manager for DoctorInformation model."""
    
    def verified(self):
        """Return only verified and approved doctors for public display."""
        return self.filter(
            status='APPROVED',
            is_verified=True
        ).select_related('user')

class DoctorInformation(models.Model):
    """Model for storing doctor-specific information."""
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='doctor_information'
    )
    specialization = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50, unique=True)
    years_of_experience = models.PositiveIntegerField()
    practice_location = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    education = models.TextField(blank=True)
    qualifications = models.CharField(max_length=255, blank=True)
    profile_picture = models.ImageField(
        upload_to='doctors/profiles/',
        null=True,
        blank=True
    )
    rating_avg = models.FloatField(default=0.0)
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='PENDING'
    )
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = DoctorInformationManager()
    
    class Meta:
        verbose_name = 'Doctor Information'
        verbose_name_plural = 'Doctor Information'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Dr. {self.user.get_full_name()} - {self.specialization}"
    
    @property
    def full_name(self):
        """Return full name with Dr. prefix."""
        return f"Dr. {self.user.get_full_name()}"
```

### Step 3: Create Filter Class

**File**: `backend/apps/doctors/filters.py`

```python
import django_filters
from .models import DoctorInformation

class DoctorFilter(django_filters.FilterSet):
    """Custom filter for doctor search and filtering."""
    
    # Multiple specialization filter (OR logic)
    specialization = django_filters.MultipleChoiceFilter(
        field_name='specialization',
        lookup_expr='iexact',
        choices=[]  # Populated dynamically
    )
    
    # Experience range filters
    min_experience = django_filters.NumberFilter(
        field_name='years_of_experience',
        lookup_expr='gte',
        label='Minimum Experience (years)'
    )
    
    max_experience = django_filters.NumberFilter(
        field_name='years_of_experience',
        lookup_expr='lte',
        label='Maximum Experience (years)'
    )
    
    # Rating filter
    min_rating = django_filters.NumberFilter(
        field_name='rating_avg',
        lookup_expr='gte',
        label='Minimum Rating'
    )
    
    # Location filter (case-insensitive partial match)
    location = django_filters.CharFilter(
        field_name='practice_location',
        lookup_expr='icontains',
        label='Location'
    )
    
    class Meta:
        model = DoctorInformation
        fields = ['specialization', 'min_experience', 'max_experience', 'min_rating', 'location']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Dynamically populate specialization choices from database
        specializations = (
            DoctorInformation.objects
            .filter(status='APPROVED', is_verified=True)
            .values_list('specialization', flat=True)
            .distinct()
            .order_by('specialization')
        )
        self.filters['specialization'].extra['choices'] = [
            (spec, spec) for spec in specializations
        ]
```

### Step 4: Create Serializers

**File**: `backend/apps/doctors/serializers/doctor_list.py`

```python
from rest_framework import serializers
from apps.doctors.models import DoctorInformation

class DoctorListSerializer(serializers.ModelSerializer):
    """Serializer for listing doctors with essential information."""
    
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
        """Return formatted full name with Dr. prefix."""
        return f"Dr. {obj.user.get_full_name()}"
```

**File**: `backend/apps/doctors/serializers/doctor_detail.py`

```python
from rest_framework import serializers
from apps.doctors.models import DoctorInformation
from apps.users.serializers import UserSerializer

class DoctorDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed doctor information."""
    
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
        """Return formatted full name with Dr. prefix."""
        return f"Dr. {obj.user.get_full_name()}"
```

**File**: `backend/apps/doctors/serializers/__init__.py`

```python
from .doctor_list import DoctorListSerializer
from .doctor_detail import DoctorDetailSerializer

__all__ = ['DoctorListSerializer', 'DoctorDetailSerializer']
```

### Step 5: Create Views

**File**: `backend/apps/doctors/views/doctor_list.py`

```python
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from apps.doctors.models import DoctorInformation
from apps.doctors.serializers import DoctorListSerializer
from apps.doctors.filters import DoctorFilter

class DoctorListView(generics.ListAPIView):
    """
    API endpoint for listing verified doctors.
    
    Features:
    - Pagination (10 per page)
    - Search by name or specialization
    - Filter by specialization, experience, rating, location
    - Sort by name, experience, rating, registration date
    """
    
    serializer_class = DoctorListSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_class = DoctorFilter
    search_fields = ['user__first_name', 'user__last_name', 'specialization']
    ordering_fields = [
        'user__first_name',
        'years_of_experience',
        'rating_avg',
        'created_at'
    ]
    ordering = ['-rating_avg']  # Default: highest rated first
    
    def get_queryset(self):
        """Return only verified and approved doctors."""
        return DoctorInformation.objects.verified()
```

**File**: `backend/apps/doctors/views/doctor_detail.py`

```python
from rest_framework import generics
from rest_framework.exceptions import NotFound
from apps.doctors.models import DoctorInformation
from apps.doctors.serializers import DoctorDetailSerializer

class DoctorDetailView(generics.RetrieveAPIView):
    """
    API endpoint for retrieving detailed doctor information.
    Only returns verified doctors for privacy.
    """
    
    serializer_class = DoctorDetailSerializer
    lookup_field = 'pk'
    
    def get_queryset(self):
        """Return only verified and approved doctors."""
        return DoctorInformation.objects.verified()
    
    def get_object(self):
        """Override to provide custom 404 message."""
        try:
            return super().get_object()
        except DoctorInformation.DoesNotExist:
            raise NotFound("Doctor not found or not yet verified.")
```

**File**: `backend/apps/doctors/views/specializations.py`

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count
from apps.doctors.models import DoctorInformation

class SpecializationListView(APIView):
    """
    API endpoint for listing all specializations with doctor counts.
    Used for populating filter dropdowns.
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
                {
                    'name': item['specialization'],
                    'count': item['count']
                }
                for item in specializations
            ]
        })
```

**File**: `backend/apps/doctors/views/__init__.py`

```python
from .doctor_list import DoctorListView
from .doctor_detail import DoctorDetailView
from .specializations import SpecializationListView

__all__ = ['DoctorListView', 'DoctorDetailView', 'SpecializationListView']
```

### Step 6: Configure URLs

**File**: `backend/apps/doctors/urls.py`

```python
from django.urls import path
from .views import DoctorListView, DoctorDetailView, SpecializationListView

urlpatterns = [
    path('', DoctorListView.as_view(), name='doctor-list'),
    path('<int:pk>/', DoctorDetailView.as_view(), name='doctor-detail'),
    path('specializations/', SpecializationListView.as_view(), name='specialization-list'),
]
```

**File**: `backend/config/urls.py` (Update)

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.users.urls')),
    path('api/v1/users/', include('apps.users.urls')),
    path('api/v1/doctors/', include('apps.doctors.urls')),  # ADD THIS LINE
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### Step 7: Install Dependencies

```bash
cd backend

# Install django-filter if not already installed
pip install django-filter

# Update requirements.txt
pip freeze > requirements.txt
```

**File**: `backend/config/settings.py` (Update)

```python
INSTALLED_APPS = [
    # ... existing apps
    'django_filters',  # ADD THIS
]

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    # ... rest of config
}
```

### Step 8: Write Tests (TDD Approach)

**File**: `backend/apps/doctors/tests/test_views.py`

Refer to the TDD_APPROACH.md document for complete test examples.

### Step 9: Run Migrations & Test

```bash
cd backend

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Run tests
pytest apps/doctors/tests/

# Run development server
python manage.py runserver
```

### Step 10: Test API Endpoints Manually

```bash
# Test doctor list
curl http://localhost:8000/api/v1/doctors/

# Test with search
curl "http://localhost:8000/api/v1/doctors/?search=cardio"

# Test with filters
curl "http://localhost:8000/api/v1/doctors/?specialization=Cardiology&min_experience=10"

# Test doctor detail
curl http://localhost:8000/api/v1/doctors/1/

# Test specializations
curl http://localhost:8000/api/v1/doctors/specializations/
```

---

## Frontend Implementation

### Step 1: Setup Frontend Structure

```bash
cd frontend/src

# Create directories
mkdir -p pages/doctors
mkdir -p components/doctors
mkdir -p hooks/doctors
mkdir -p services
mkdir -p utils
```

### Step 2: Create API Service

**File**: `frontend/src/services/doctorAPI.js`

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Doctor API service for interacting with backend endpoints
 */
export const doctorAPI = {
  /**
   * Fetch paginated list of doctors with optional filters
   * @param {Object} params - Query parameters for filtering/searching
   * @returns {Promise<Object>} Paginated doctor list response
   */
  getDoctors: async (params = {}) => {
    try {
      // Remove empty parameters
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== null && value !== '')
      );
      
      const response = await axios.get(`${API_BASE_URL}/doctors/`, {
        params: cleanParams
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error.response?.data || { detail: 'Failed to fetch doctors' };
    }
  },
  
  /**
   * Fetch details of a specific doctor by ID
   * @param {number} id - Doctor ID
   * @returns {Promise<Object>} Doctor detail response
   */
  getDoctorById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctors/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching doctor ${id}:`, error);
      throw error.response?.data || { detail: 'Failed to fetch doctor details' };
    }
  },
  
  /**
   * Fetch list of all specializations with counts
   * @returns {Promise<Object>} Specializations response
   */
  getSpecializations: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctors/specializations/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching specializations:', error);
      throw error.response?.data || { detail: 'Failed to fetch specializations' };
    }
  },
};

export default doctorAPI;
```

### Step 3: Create Custom Hook for Doctors

**File**: `frontend/src/hooks/useDoctors.js`

```javascript
import { useState, useEffect, useCallback } from 'react';
import { doctorAPI } from '../services/doctorAPI';

/**
 * Custom hook for fetching and managing doctors list
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} Doctors data, loading state, error, and refetch function
 */
export const useDoctors = (initialFilters = {}) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [filters, setFilters] = useState(initialFilters);
  
  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await doctorAPI.getDoctors(filters);
      setDoctors(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
    } catch (err) {
      setError(err.detail || 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  }, [filters]);
  
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);
  
  return {
    doctors,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    refetch: fetchDoctors,
  };
};

export default useDoctors;
```

### Step 4: Create Doctor Card Component

**File**: `frontend/src/components/doctors/DoctorCard.jsx`

```javascript
import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaBriefcase } from 'react-icons/fa';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Profile Picture */}
      <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
        {doctor.profile_picture ? (
          <img
            src={doctor.profile_picture}
            alt={doctor.full_name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-blue-600">
            {doctor.first_name?.[0]}{doctor.last_name?.[0]}
          </div>
        )}
      </div>
      
      {/* Doctor Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {doctor.full_name}
        </h3>
        
        <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-3">
          {doctor.specialization}
        </span>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <FaBriefcase className="mr-2 text-gray-400" />
            <span>{doctor.years_of_experience} years experience</span>
          </div>
          
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2 text-gray-400" />
            <span>{doctor.practice_location}</span>
          </div>
          
          <div className="flex items-center">
            <FaStar className="mr-2 text-yellow-400" />
            <span className="font-semibold">{doctor.rating_avg.toFixed(1)}</span>
            <span className="ml-1">/ 5.0</span>
          </div>
        </div>
        
        <Link
          to={`/doctors/${doctor.id}`}
          className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
```

### Step 5: Create Doctors List Page

**File**: `frontend/src/pages/DoctorsPage.jsx`

```javascript
import React, { useState } from 'react';
import { useDoctors } from '../hooks/useDoctors';
import DoctorCard from '../components/doctors/DoctorCard';
import SearchBar from '../components/doctors/SearchBar';
import FilterPanel from '../components/doctors/FilterPanel';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DoctorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState({
    specialization: [],
    min_experience: null,
    min_rating: null,
    location: '',
  });
  
  const { doctors, loading, error, pagination, setFilters } = useDoctors({
    search: searchTerm,
    ...filterValues,
  });
  
  const handleSearch = (term) => {
    setSearchTerm(term);
    setFilters((prev) => ({ ...prev, search: term, page: 1 }));
  };
  
  const handleFilterChange = (newFilters) => {
    setFilterValues(newFilters);
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };
  
  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Find a Doctor</h1>
        
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          {/* Filter Panel */}
          <div className="md:col-span-1">
            <FilterPanel onFilterChange={handleFilterChange} />
          </div>
          
          {/* Doctors Grid */}
          <div className="md:col-span-3">
            {doctors.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No doctors found.</p>
                <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  Found {pagination.count} doctor{pagination.count !== 1 ? 's' : ''}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>
                
                {/* Pagination */}
                {pagination.count > 10 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={Math.ceil(pagination.count / 10)}
                      totalPages={Math.ceil(pagination.count / 10)}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;
```

### Step 6: Create Doctor Detail Page

**File**: `frontend/src/pages/DoctorDetailPage.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorAPI } from '../services/doctorAPI';
import { FaMapMarkerAlt, FaStar, FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DoctorDetailPage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const data = await doctorAPI.getDoctorById(id);
        setDoctor(data);
      } catch (err) {
        setError(err.detail || 'Doctor not found');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctor();
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <Link to="/doctors" className="text-blue-600 hover:underline">
          ← Back to Doctors
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm">
            <Link to="/" className="text-blue-600 hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/doctors" className="text-blue-600 hover:underline">Doctors</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-600">{doctor.full_name}</span>
          </nav>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            {/* Profile Picture */}
            <div className="mb-6 md:mb-0 md:mr-8">
              {doctor.profile_picture ? (
                <img
                  src={doctor.profile_picture}
                  alt={doctor.full_name}
                  className="w-48 h-48 rounded-full object-cover border-4 border-blue-200"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-blue-600 flex items-center justify-center text-6xl font-bold text-white">
                  {doctor.user.first_name[0]}{doctor.user.last_name[0]}
                </div>
              )}
            </div>
            
            {/* Doctor Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {doctor.full_name}
              </h1>
              
              <span className="inline-block bg-blue-100 text-blue-800 text-lg font-semibold px-4 py-2 rounded-full mb-4">
                {doctor.specialization}
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
                <div className="flex items-center justify-center md:justify-start">
                  <FaBriefcase className="mr-2 text-gray-400 text-xl" />
                  <span className="text-lg">{doctor.years_of_experience} years</span>
                </div>
                
                <div className="flex items-center justify-center md:justify-start">
                  <FaMapMarkerAlt className="mr-2 text-gray-400 text-xl" />
                  <span className="text-lg">{doctor.practice_location}</span>
                </div>
                
                <div className="flex items-center justify-center md:justify-start">
                  <FaStar className="mr-2 text-yellow-400 text-xl" />
                  <span className="text-lg font-semibold">{doctor.rating_avg.toFixed(1)} / 5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
            </div>
            
            {/* Education Section */}
            {doctor.education && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaGraduationCap className="mr-2 text-blue-600" />
                  Education
                </h2>
                <p className="text-gray-700">{doctor.education}</p>
              </div>
            )}
            
            {/* Qualifications */}
            {doctor.qualifications && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Qualifications
                </h2>
                <p className="text-gray-700">{doctor.qualifications}</p>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-3 text-gray-700">
                <div>
                  <p className="font-semibold">Practice Location:</p>
                  <p>{doctor.practice_location}</p>
                </div>
                <div>
                  <p className="font-semibold">License Number:</p>
                  <p>{doctor.license_number}</p>
                </div>
              </div>
            </div>
            
            {/* CTA Button */}
            <button
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors duration-200"
              disabled
            >
              Book Appointment (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
```

### Step 7: Update Routes

**File**: `frontend/src/App.jsx` (Update)

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ApplyDoctorPage from './pages/ApplyDoctorPage';
import DoctorsPage from './pages/DoctorsPage';  // ADD THIS
import DoctorDetailPage from './pages/DoctorDetailPage';  // ADD THIS
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/apply-doctor" element={<ApplyDoctorPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />  {/* ADD THIS */}
          <Route path="/doctors/:id" element={<DoctorDetailPage />} />  {/* ADD THIS */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

### Step 8: Update Navigation

**File**: `frontend/src/components/Navbar.jsx` (Update)

Add "Find Doctors" link to navigation menu.

---

## Integration Steps

### 1. Environment Variables

**File**: `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 2. CORS Configuration

**File**: `backend/config/settings.py`

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',  # Vite dev server
    'http://localhost:3000',  # Alternative
]
```

### 3. Test Integration

```bash
# Terminal 1: Run backend
cd backend
python manage.py runserver

# Terminal 2: Run frontend
cd frontend
npm run dev

# Open browser: http://localhost:5173/doctors
```

---

## Quality Checklist

### Backend

- [ ] All tests passing (`pytest`)
- [ ] Code coverage ≥ 80%
- [ ] API returns correct response formats
- [ ] Pagination working correctly
- [ ] Search functionality working
- [ ] Filters working (specialization, experience, rating, location)
- [ ] Ordering/sorting working
- [ ] Error handling implemented
- [ ] Only verified doctors returned
- [ ] URL routing correct

### Frontend

- [ ] All tests passing (`npm test`)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading states implemented
- [ ] Error states implemented
- [ ] Empty states implemented
- [ ] Search bar with debounce
- [ ] Filter panel functional
- [ ] Pagination working
- [ ] Navigation working
- [ ] Doctor cards displaying correctly
- [ ] Doctor detail page complete
- [ ] Accessibility (keyboard nav, screen readers)

### Integration

- [ ] Frontend connects to backend successfully
- [ ] API responses handled correctly
- [ ] Error messages user-friendly
- [ ] No console errors
- [ ] CORS configured
- [ ] Environment variables set

### Documentation

- [ ] API documentation updated
- [ ] Code comments added
- [ ] README updated
- [ ] User stories marked complete

---

**Created**: December 22, 2025  
**Last Updated**: December 22, 2025  
**Status**: Ready for Implementation
