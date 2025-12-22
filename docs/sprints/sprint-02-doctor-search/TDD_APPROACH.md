# Sprint 2: Test-Driven Development (TDD) Approach

**Sprint**: Sprint 2 - Doctor Search & Discovery  
**Testing Framework**: pytest (Backend), React Testing Library + Vitest (Frontend)  
**Coverage Target**: ≥ 80%

---

## Table of Contents

1. [TDD Principles](#tdd-principles)
2. [Testing Strategy](#testing-strategy)
3. [Backend Testing](#backend-testing)
4. [Frontend Testing](#frontend-testing)
5. [Test Data Management](#test-data-management)
6. [Continuous Integration](#continuous-integration)

---

## TDD Principles

### Red-Green-Refactor Cycle

```
🔴 RED    → Write a failing test
🟢 GREEN  → Write minimum code to pass
🔵 REFACTOR → Improve code while keeping tests green
```

### Testing Pyramid

```
        /\
       /UI\        ← Few (E2E tests)
      /----\
     / API  \      ← Some (Integration tests)
    /--------\
   /   Unit   \    ← Many (Unit tests)
  /____________\
```

### Core Principles for Sprint 2

1. **Write tests BEFORE implementation**
2. **Test behavior, not implementation**
3. **Keep tests simple and readable**
4. **One assertion per test (when possible)**
5. **Use descriptive test names**
6. **Arrange-Act-Assert (AAA) pattern**

---

## Testing Strategy

### Test Coverage Goals

| Layer | Target Coverage | Priority |
|-------|----------------|----------|
| Models | 100% | 🔴 Critical |
| Serializers | 95% | 🔴 Critical |
| Views/API | 90% | 🔴 Critical |
| Utils/Helpers | 85% | 🟡 High |
| Components | 80% | 🟡 High |
| Integration | 70% | 🟢 Medium |

### Test Types

#### 1. Unit Tests
- Test individual functions/methods in isolation
- Mock external dependencies
- Fast execution (< 1 second per test)

#### 2. Integration Tests
- Test interaction between components
- Use test database
- Moderate execution time (1-5 seconds)

#### 3. End-to-End Tests
- Test complete user workflows
- Use real browser (Cypress - future)
- Slower execution (5-30 seconds)

---

## Backend Testing

### Test Structure

```
backend/
└── apps/
    └── doctors/
        ├── models/
        ├── serializers/
        ├── views/
        └── tests/
            ├── __init__.py
            ├── test_models.py
            ├── test_serializers.py
            ├── test_views.py
            ├── test_filters.py
            └── fixtures.py
```

### 1. Model Tests (`test_models.py`)

#### Test: DoctorInformation Model

```python
# backend/apps/doctors/tests/test_models.py

import pytest
from django.contrib.auth import get_user_model
from apps.doctors.models import DoctorInformation

User = get_user_model()

@pytest.mark.django_db
class TestDoctorInformationModel:
    """Test suite for DoctorInformation model."""
    
    def test_create_doctor_with_required_fields(self):
        """
        Test: Create doctor with only required fields
        Expected: Doctor instance created successfully
        """
        # Arrange
        user = User.objects.create_user(
            email='doctor@test.com',
            password='testpass123',
            first_name='John',
            last_name='Doe',
            role='DOCTOR'
        )
        
        # Act
        doctor = DoctorInformation.objects.create(
            user=user,
            specialization='Cardiology',
            license_number='LIC123456',
            years_of_experience=10
        )
        
        # Assert
        assert doctor.id is not None
        assert doctor.user.email == 'doctor@test.com'
        assert doctor.specialization == 'Cardiology'
        assert doctor.status == 'PENDING'  # Default status
    
    def test_doctor_full_name_property(self):
        """
        Test: full_name property returns correct format
        Expected: Returns "Dr. {first_name} {last_name}"
        """
        # Arrange
        user = User.objects.create_user(
            email='doctor@test.com',
            password='testpass123',
            first_name='Jane',
            last_name='Smith',
            role='DOCTOR'
        )
        doctor = DoctorInformation.objects.create(
            user=user,
            specialization='Neurology',
            license_number='LIC789',
            years_of_experience=15
        )
        
        # Act
        full_name = doctor.full_name
        
        # Assert
        assert full_name == 'Dr. Jane Smith'
    
    def test_only_approved_doctors_in_verified_queryset(self):
        """
        Test: verified() queryset method returns only approved doctors
        Expected: Only doctors with status='APPROVED' and is_verified=True
        """
        # Arrange
        user1 = User.objects.create_user(
            email='approved@test.com', password='pass', role='DOCTOR'
        )
        user2 = User.objects.create_user(
            email='pending@test.com', password='pass', role='DOCTOR'
        )
        user3 = User.objects.create_user(
            email='rejected@test.com', password='pass', role='DOCTOR'
        )
        
        approved_doctor = DoctorInformation.objects.create(
            user=user1, specialization='Cardiology',
            license_number='L1', years_of_experience=10,
            status='APPROVED', is_verified=True
        )
        DoctorInformation.objects.create(
            user=user2, specialization='Neurology',
            license_number='L2', years_of_experience=5,
            status='PENDING'
        )
        DoctorInformation.objects.create(
            user=user3, specialization='Orthopedics',
            license_number='L3', years_of_experience=8,
            status='REJECTED'
        )
        
        # Act
        verified_doctors = DoctorInformation.objects.verified()
        
        # Assert
        assert verified_doctors.count() == 1
        assert approved_doctor in verified_doctors
    
    def test_rating_avg_default_value(self):
        """
        Test: rating_avg defaults to 0.0 for new doctors
        Expected: New doctor has rating_avg = 0.0
        """
        # Arrange & Act
        user = User.objects.create_user(
            email='newdoc@test.com', password='pass', role='DOCTOR'
        )
        doctor = DoctorInformation.objects.create(
            user=user,
            specialization='Pediatrics',
            license_number='LIC456',
            years_of_experience=3
        )
        
        # Assert
        assert doctor.rating_avg == 0.0
```

### 2. Serializer Tests (`test_serializers.py`)

```python
# backend/apps/doctors/tests/test_serializers.py

import pytest
from django.contrib.auth import get_user_model
from apps.doctors.models import DoctorInformation
from apps.doctors.serializers import DoctorListSerializer, DoctorDetailSerializer

User = get_user_model()

@pytest.mark.django_db
class TestDoctorListSerializer:
    """Test suite for DoctorListSerializer."""
    
    def test_serializer_returns_expected_fields(self):
        """
        Test: Serializer includes all required fields
        Expected: Serialized data contains id, full_name, specialization, etc.
        """
        # Arrange
        user = User.objects.create_user(
            email='doctor@test.com',
            password='pass',
            first_name='John',
            last_name='Doe',
            role='DOCTOR'
        )
        doctor = DoctorInformation.objects.create(
            user=user,
            specialization='Cardiology',
            license_number='LIC123',
            years_of_experience=10,
            practice_location='New York, NY',
            status='APPROVED',
            is_verified=True,
            rating_avg=4.5
        )
        
        # Act
        serializer = DoctorListSerializer(doctor)
        data = serializer.data
        
        # Assert
        assert 'id' in data
        assert 'full_name' in data
        assert data['full_name'] == 'Dr. John Doe'
        assert data['specialization'] == 'Cardiology'
        assert data['years_of_experience'] == 10
        assert data['practice_location'] == 'New York, NY'
        assert data['rating_avg'] == 4.5
        assert 'profile_picture' in data
    
    def test_serializer_handles_missing_profile_picture(self):
        """
        Test: Serializer handles doctors without profile pictures
        Expected: profile_picture field is None or empty
        """
        # Arrange
        user = User.objects.create_user(
            email='nopic@test.com', password='pass', role='DOCTOR'
        )
        doctor = DoctorInformation.objects.create(
            user=user,
            specialization='Neurology',
            license_number='LIC456',
            years_of_experience=5
        )
        
        # Act
        serializer = DoctorListSerializer(doctor)
        data = serializer.data
        
        # Assert
        assert data['profile_picture'] is None or data['profile_picture'] == ''

@pytest.mark.django_db
class TestDoctorDetailSerializer:
    """Test suite for DoctorDetailSerializer."""
    
    def test_detail_serializer_includes_additional_fields(self):
        """
        Test: Detail serializer includes more fields than list serializer
        Expected: Contains bio, education, qualifications, license_number
        """
        # Arrange
        user = User.objects.create_user(
            email='detail@test.com',
            password='pass',
            first_name='Jane',
            last_name='Smith',
            role='DOCTOR'
        )
        doctor = DoctorInformation.objects.create(
            user=user,
            specialization='Cardiology',
            license_number='LIC789',
            years_of_experience=15,
            bio='Experienced cardiologist specializing in interventional cardiology.',
            education='Harvard Medical School',
            qualifications='MBBS, MD, FACC'
        )
        
        # Act
        serializer = DoctorDetailSerializer(doctor)
        data = serializer.data
        
        # Assert
        assert 'bio' in data
        assert 'education' in data
        assert 'qualifications' in data
        assert 'license_number' in data
        assert data['bio'] == doctor.bio
        assert data['education'] == doctor.education
```

### 3. View/API Tests (`test_views.py`)

```python
# backend/apps/doctors/tests/test_views.py

import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from apps.doctors.models import DoctorInformation

User = get_user_model()

@pytest.fixture
def api_client():
    """Fixture to provide APIClient instance."""
    return APIClient()

@pytest.fixture
def create_verified_doctors():
    """Fixture to create multiple verified doctors for testing."""
    doctors = []
    specializations = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics']
    
    for i, spec in enumerate(specializations):
        user = User.objects.create_user(
            email=f'doctor{i}@test.com',
            password='testpass',
            first_name=f'Doctor{i}',
            last_name=f'Test{i}',
            role='DOCTOR'
        )
        doctor = DoctorInformation.objects.create(
            user=user,
            specialization=spec,
            license_number=f'LIC{i}',
            years_of_experience=(i + 1) * 5,
            practice_location='Test City',
            status='APPROVED',
            is_verified=True,
            rating_avg=4.0 + (i * 0.2)
        )
        doctors.append(doctor)
    
    return doctors

@pytest.mark.django_db
class TestDoctorListView:
    """Test suite for Doctor List API endpoint."""
    
    def test_get_all_verified_doctors(self, api_client, create_verified_doctors):
        """
        Test: GET /api/v1/doctors/ returns all verified doctors
        Expected: 200 OK with list of verified doctors only
        """
        # Arrange
        url = reverse('doctor-list')  # Assuming URL name is 'doctor-list'
        
        # Act
        response = api_client.get(url)
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert 'results' in response.data
        assert response.data['count'] == 4
        assert len(response.data['results']) == 4
    
    def test_search_by_doctor_name(self, api_client, create_verified_doctors):
        """
        Test: GET /api/v1/doctors/?search=Doctor0
        Expected: Returns only doctors matching the search term
        """
        # Arrange
        url = reverse('doctor-list')
        
        # Act
        response = api_client.get(url, {'search': 'Doctor0'})
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1
        assert 'Doctor0' in response.data['results'][0]['full_name']
    
    def test_search_by_specialization(self, api_client, create_verified_doctors):
        """
        Test: GET /api/v1/doctors/?search=Cardiology
        Expected: Returns doctors with matching specialization
        """
        # Arrange
        url = reverse('doctor-list')
        
        # Act
        response = api_client.get(url, {'search': 'Cardiology'})
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] >= 1
        assert any(
            'Cardiology' in doc['specialization'] 
            for doc in response.data['results']
        )
    
    def test_filter_by_specialization(self, api_client, create_verified_doctors):
        """
        Test: GET /api/v1/doctors/?specialization=Neurology
        Expected: Returns only neurologists
        """
        # Arrange
        url = reverse('doctor-list')
        
        # Act
        response = api_client.get(url, {'specialization': 'Neurology'})
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1
        assert response.data['results'][0]['specialization'] == 'Neurology'
    
    def test_filter_by_experience_range(self, api_client, create_verified_doctors):
        """
        Test: GET /api/v1/doctors/?min_experience=10&max_experience=20
        Expected: Returns doctors with 10-20 years experience
        """
        # Arrange
        url = reverse('doctor-list')
        
        # Act
        response = api_client.get(url, {
            'min_experience': 10,
            'max_experience': 20
        })
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        for doctor in response.data['results']:
            assert 10 <= doctor['years_of_experience'] <= 20
    
    def test_filter_by_rating(self, api_client, create_verified_doctors):
        """
        Test: GET /api/v1/doctors/?min_rating=4.5
        Expected: Returns only doctors with rating >= 4.5
        """
        # Arrange
        url = reverse('doctor-list')
        
        # Act
        response = api_client.get(url, {'min_rating': 4.5})
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        for doctor in response.data['results']:
            assert doctor['rating_avg'] >= 4.5
    
    def test_pagination(self, api_client):
        """
        Test: Pagination works correctly with page_size=10
        Expected: Maximum 10 results per page
        """
        # Arrange: Create 25 doctors
        for i in range(25):
            user = User.objects.create_user(
                email=f'doc{i}@test.com',
                password='pass',
                role='DOCTOR'
            )
            DoctorInformation.objects.create(
                user=user,
                specialization='General',
                license_number=f'L{i}',
                years_of_experience=5,
                status='APPROVED',
                is_verified=True
            )
        
        url = reverse('doctor-list')
        
        # Act
        response = api_client.get(url)
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 25
        assert len(response.data['results']) == 10  # Default page size
        assert 'next' in response.data
        assert response.data['next'] is not None
    
    def test_empty_results(self, api_client):
        """
        Test: No verified doctors in database
        Expected: 200 OK with empty results array
        """
        # Arrange
        url = reverse('doctor-list')
        
        # Act
        response = api_client.get(url)
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 0
        assert response.data['results'] == []

@pytest.mark.django_db
class TestDoctorDetailView:
    """Test suite for Doctor Detail API endpoint."""
    
    def test_get_doctor_detail(self, api_client):
        """
        Test: GET /api/v1/doctors/{id}/ returns doctor details
        Expected: 200 OK with complete doctor information
        """
        # Arrange
        user = User.objects.create_user(
            email='detail@test.com',
            password='pass',
            first_name='John',
            last_name='Doe',
            role='DOCTOR'
        )
        doctor = DoctorInformation.objects.create(
            user=user,
            specialization='Cardiology',
            license_number='LIC123',
            years_of_experience=15,
            bio='Experienced cardiologist',
            status='APPROVED',
            is_verified=True
        )
        url = reverse('doctor-detail', kwargs={'pk': doctor.id})
        
        # Act
        response = api_client.get(url)
        
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == doctor.id
        assert 'bio' in response.data
        assert 'license_number' in response.data
    
    def test_get_non_existent_doctor(self, api_client):
        """
        Test: GET /api/v1/doctors/99999/
        Expected: 404 Not Found
        """
        # Arrange
        url = reverse('doctor-detail', kwargs={'pk': 99999})
        
        # Act
        response = api_client.get(url)
        
        # Assert
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_cannot_view_unverified_doctor_detail(self, api_client):
        """
        Test: GET detail of doctor with status=PENDING
        Expected: 404 Not Found (hide from public)
        """
        # Arrange
        user = User.objects.create_user(
            email='pending@test.com',
            password='pass',
            role='DOCTOR'
        )
        doctor = DoctorInformation.objects.create(
            user=user,
            specialization='Neurology',
            license_number='LIC456',
            years_of_experience=5,
            status='PENDING'
        )
        url = reverse('doctor-detail', kwargs={'pk': doctor.id})
        
        # Act
        response = api_client.get(url)
        
        # Assert
        assert response.status_code == status.HTTP_404_NOT_FOUND
```

### 4. Filter Tests (`test_filters.py`)

```python
# backend/apps/doctors/tests/test_filters.py

import pytest
from django.contrib.auth import get_user_model
from apps.doctors.models import DoctorInformation
from apps.doctors.filters import DoctorFilter

User = get_user_model()

@pytest.mark.django_db
class TestDoctorFilter:
    """Test suite for DoctorFilter class."""
    
    def test_filter_by_multiple_specializations(self):
        """
        Test: Filter by multiple specializations (OR logic)
        Expected: Returns doctors matching any of the specializations
        """
        # Arrange
        # Create doctors with different specializations
        for spec in ['Cardiology', 'Neurology', 'Orthopedics']:
            user = User.objects.create_user(
                email=f'{spec.lower()}@test.com',
                password='pass',
                role='DOCTOR'
            )
            DoctorInformation.objects.create(
                user=user,
                specialization=spec,
                license_number=f'LIC{spec}',
                years_of_experience=10,
                status='APPROVED',
                is_verified=True
            )
        
        # Act
        filter_params = {'specialization': ['Cardiology', 'Neurology']}
        queryset = DoctorInformation.objects.verified()
        filtered = DoctorFilter(filter_params, queryset=queryset).qs
        
        # Assert
        assert filtered.count() == 2
        specializations = [doc.specialization for doc in filtered]
        assert 'Cardiology' in specializations
        assert 'Neurology' in specializations
        assert 'Orthopedics' not in specializations
```

---

## Frontend Testing

### Test Structure

```
frontend/
└── src/
    ├── components/
    │   └── doctors/
    │       ├── DoctorCard.jsx
    │       └── __tests__/
    │           └── DoctorCard.test.jsx
    ├── pages/
    │   ├── DoctorsPage.jsx
    │   └── __tests__/
    │       └── DoctorsPage.test.jsx
    └── hooks/
        ├── useDoctors.js
        └── __tests__/
            └── useDoctors.test.js
```

### 1. Component Tests

#### Test: DoctorCard Component

```javascript
// frontend/src/components/doctors/__tests__/DoctorCard.test.jsx

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import DoctorCard from '../DoctorCard';

const mockDoctor = {
  id: 1,
  full_name: 'Dr. John Doe',
  specialization: 'Cardiology',
  years_of_experience: 15,
  practice_location: 'New York, NY',
  rating_avg: 4.5,
  profile_picture: null
};

describe('DoctorCard Component', () => {
  it('renders doctor information correctly', () => {
    // Arrange & Act
    render(
      <BrowserRouter>
        <DoctorCard doctor={mockDoctor} />
      </BrowserRouter>
    );
    
    // Assert
    expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
    expect(screen.getByText(/15 years experience/i)).toBeInTheDocument();
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
  });
  
  it('displays rating with correct number of stars', () => {
    // Arrange & Act
    render(
      <BrowserRouter>
        <DoctorCard doctor={mockDoctor} />
      </BrowserRouter>
    );
    
    // Assert
    expect(screen.getByText('4.5')).toBeInTheDocument();
    // Check for star icons (depends on implementation)
  });
  
  it('shows placeholder image when no profile picture', () => {
    // Arrange & Act
    const { container } = render(
      <BrowserRouter>
        <DoctorCard doctor={mockDoctor} />
      </BrowserRouter>
    );
    
    // Assert
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', expect.stringContaining('placeholder'));
  });
  
  it('navigates to doctor detail page on click', () => {
    // This test would use userEvent to simulate click
    // and check navigation - implementation depends on routing setup
  });
});
```

#### Test: SearchBar Component

```javascript
// frontend/src/components/doctors/__tests__/SearchBar.test.jsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from '../SearchBar';

describe('SearchBar Component', () => {
  it('renders search input with placeholder', () => {
    // Arrange
    const mockOnSearch = vi.fn();
    
    // Act
    render(<SearchBar onSearch={mockOnSearch} />);
    
    // Assert
    const input = screen.getByPlaceholderText(/search by doctor name/i);
    expect(input).toBeInTheDocument();
  });
  
  it('calls onSearch callback after debounce delay', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText(/search by doctor name/i);
    
    // Act
    await user.type(input, 'John');
    
    // Wait for debounce (300ms)
    await new Promise(resolve => setTimeout(resolve, 350));
    
    // Assert
    expect(mockOnSearch).toHaveBeenCalledWith('John');
  });
  
  it('clears search when clear button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} initialValue="John" />);
    
    // Act
    const clearButton = screen.getByRole('button', { name: /clear/i });
    await user.click(clearButton);
    
    // Assert
    expect(mockOnSearch).toHaveBeenCalledWith('');
    expect(screen.getByPlaceholderText(/search/i)).toHaveValue('');
  });
});
```

### 2. Page Tests

```javascript
// frontend/src/pages/__tests__/DoctorsPage.test.jsx

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DoctorsPage from '../DoctorsPage';
import * as api from '../../services/api';

vi.mock('../../services/api');

const mockDoctors = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      full_name: 'Dr. John Doe',
      specialization: 'Cardiology',
      years_of_experience: 15,
      practice_location: 'New York, NY',
      rating_avg: 4.5
    },
    {
      id: 2,
      full_name: 'Dr. Jane Smith',
      specialization: 'Neurology',
      years_of_experience: 10,
      practice_location: 'Boston, MA',
      rating_avg: 4.8
    }
  ]
};

describe('DoctorsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('displays loading state initially', () => {
    // Arrange
    api.getDoctors.mockImplementation(() => new Promise(() => {}));
    
    // Act
    render(
      <BrowserRouter>
        <DoctorsPage />
      </BrowserRouter>
    );
    
    // Assert
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  
  it('displays doctor list after loading', async () => {
    // Arrange
    api.getDoctors.mockResolvedValue(mockDoctors);
    
    // Act
    render(
      <BrowserRouter>
        <DoctorsPage />
      </BrowserRouter>
    );
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    });
  });
  
  it('displays empty state when no doctors found', async () => {
    // Arrange
    api.getDoctors.mockResolvedValue({ count: 0, results: [] });
    
    // Act
    render(
      <BrowserRouter>
        <DoctorsPage />
      </BrowserRouter>
    );
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText(/no doctors found/i)).toBeInTheDocument();
    });
  });
  
  it('displays error message on API failure', async () => {
    // Arrange
    api.getDoctors.mockRejectedValue(new Error('Network error'));
    
    // Act
    render(
      <BrowserRouter>
        <DoctorsPage />
      </BrowserRouter>
    );
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText(/error loading doctors/i)).toBeInTheDocument();
    });
  });
});
```

### 3. Custom Hook Tests

```javascript
// frontend/src/hooks/__tests__/useDoctors.test.js

import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useDoctors from '../useDoctors';
import * as api from '../../services/api';

vi.mock('../../services/api');

describe('useDoctors Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('fetches doctors on mount', async () => {
    // Arrange
    const mockData = { count: 1, results: [{ id: 1, full_name: 'Dr. Test' }] };
    api.getDoctors.mockResolvedValue(mockData);
    
    // Act
    const { result } = renderHook(() => useDoctors());
    
    // Assert
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.doctors).toEqual(mockData.results);
    });
  });
  
  it('handles search parameter changes', async () => {
    // Arrange
    api.getDoctors.mockResolvedValue({ count: 0, results: [] });
    
    // Act
    const { result, rerender } = renderHook(
      ({ search }) => useDoctors({ search }),
      { initialProps: { search: '' } }
    );
    
    // Change search parameter
    rerender({ search: 'John' });
    
    // Assert
    await waitFor(() => {
      expect(api.getDoctors).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'John' })
      );
    });
  });
});
```

---

## Test Data Management

### Fixtures for Backend

```python
# backend/apps/doctors/tests/fixtures.py

import pytest
from django.contrib.auth import get_user_model
from apps.doctors.models import DoctorInformation

User = get_user_model()

@pytest.fixture
def sample_user():
    """Create a sample user for testing."""
    return User.objects.create_user(
        email='testuser@example.com',
        password='testpass123',
        first_name='Test',
        last_name='User',
        role='PATIENT'
    )

@pytest.fixture
def sample_doctor_user():
    """Create a sample doctor user."""
    return User.objects.create_user(
        email='doctor@example.com',
        password='docpass123',
        first_name='John',
        last_name='Doe',
        role='DOCTOR'
    )

@pytest.fixture
def sample_doctor(sample_doctor_user):
    """Create a sample doctor information record."""
    return DoctorInformation.objects.create(
        user=sample_doctor_user,
        specialization='Cardiology',
        license_number='LIC123456',
        years_of_experience=10,
        practice_location='New York, NY',
        bio='Experienced cardiologist',
        status='APPROVED',
        is_verified=True,
        rating_avg=4.5
    )

@pytest.fixture
def multiple_doctors():
    """Create multiple doctors with different attributes."""
    doctors = []
    specializations = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology']
    
    for i, spec in enumerate(specializations):
        user = User.objects.create_user(
            email=f'doctor{i}@example.com',
            password='pass',
            first_name=f'Doctor{i}',
            last_name=f'Test{i}',
            role='DOCTOR'
        )
        doctor = DoctorInformation.objects.create(
            user=user,
            specialization=spec,
            license_number=f'LIC{i:04d}',
            years_of_experience=(i + 1) * 3,
            practice_location=f'City {i}',
            status='APPROVED',
            is_verified=True,
            rating_avg=3.5 + (i * 0.2)
        )
        doctors.append(doctor)
    
    return doctors
```

### Mock Data for Frontend

```javascript
// frontend/src/__mocks__/doctorData.js

export const mockDoctor = {
  id: 1,
  full_name: 'Dr. John Doe',
  specialization: 'Cardiology',
  years_of_experience: 15,
  practice_location: 'New York, NY',
  rating_avg: 4.5,
  profile_picture: null,
  bio: 'Experienced cardiologist specializing in interventional procedures.',
  education: 'Harvard Medical School',
  qualifications: 'MBBS, MD, FACC',
  license_number: 'LIC123456',
  is_verified: true
};

export const mockDoctorList = [
  mockDoctor,
  {
    id: 2,
    full_name: 'Dr. Jane Smith',
    specialization: 'Neurology',
    years_of_experience: 10,
    practice_location: 'Boston, MA',
    rating_avg: 4.8,
    profile_picture: null
  },
  {
    id: 3,
    full_name: 'Dr. Mike Johnson',
    specialization: 'Orthopedics',
    years_of_experience: 20,
    practice_location: 'Chicago, IL',
    rating_avg: 4.2,
    profile_picture: null
  }
];

export const mockPaginatedResponse = {
  count: 25,
  next: 'http://api/v1/doctors/?page=2',
  previous: null,
  results: mockDoctorList
};
```

---

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml

name: Run Tests

on:
  push:
    branches: [ develop, main, 'feature/**' ]
  pull_request:
    branches: [ develop, main ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
          pip install pytest pytest-django pytest-cov
      
      - name: Run tests with coverage
        run: |
          cd backend
          pytest --cov=apps --cov-report=xml --cov-report=html
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./backend/coverage.xml
  
  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      
      - name: Run tests
        run: |
          cd frontend
          npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./frontend/coverage/coverage-final.json
```

---

## Running Tests Locally

### Backend

```bash
# Run all tests
cd backend
pytest

# Run specific test file
pytest apps/doctors/tests/test_views.py

# Run specific test class
pytest apps/doctors/tests/test_views.py::TestDoctorListView

# Run specific test method
pytest apps/doctors/tests/test_views.py::TestDoctorListView::test_get_all_verified_doctors

# Run with coverage
pytest --cov=apps --cov-report=html

# Run with verbose output
pytest -v

# Run tests in parallel
pytest -n auto
```

### Frontend

```bash
# Run all tests
cd frontend
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test DoctorCard.test.jsx
```

---

## Test Metrics & Reporting

### Coverage Reports

**Backend:**
- HTML report: `backend/htmlcov/index.html`
- XML report: `backend/coverage.xml`
- Terminal summary after each test run

**Frontend:**
- HTML report: `frontend/coverage/lcov-report/index.html`
- JSON report: `frontend/coverage/coverage-final.json`

### Quality Gates

Tests must pass the following criteria to merge:

- ✅ All tests passing (0 failures)
- ✅ Code coverage ≥ 80%
- ✅ No critical bugs introduced
- ✅ All linting checks passing

---

**Created**: December 22, 2025  
**Last Updated**: December 22, 2025  
**Status**: Ready for Implementation
