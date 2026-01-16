# Testing Guideline: Sprint 02 - Doctor Search & Profiles

**Comprehensive Testing Strategy for Doctor Discovery Features**

---

## 📋 Document Information

| Attribute | Value |
|-----------|-------|
| **Sprint** | Sprint 02 |
| **Feature** | Doctor Search & Profiles |
| **Testing Level** | Unit, Integration, E2E |
| **Last Updated** | January 16, 2026 |

---

## 🎯 Testing Objectives

1. **Search Functionality**: Verify doctors can be found by specialization, location, disease
2. **Profile Display**: Ensure doctor profiles show accurate information
3. **Rating System**: Test doctor rating and review functionality
4. **Filter Accuracy**: Validate search filters work correctly
5. **Data Integrity**: Ensure only approved, verified doctors appear in search

---

## 🧪 Test Levels

### Unit Testing
**Coverage Target**: ≥90% for models and serializers

**Focus Areas:**
- DoctorInformation model
- Rating model
- Doctor serializers
- Search filters
- Rating calculations

### Integration Testing
**Coverage Target**: ≥85% for API endpoints

**Focus Areas:**
- Doctor list API
- Doctor detail API
- Rating submission API
- Search with filters
- Authentication integration

### End-to-End Testing
**Focus**: Critical user flows

**Scenarios:**
- Search for doctors by specialization
- View doctor profile and ratings
- Submit a rating for a doctor
- Filter doctors by multiple criteria

---

## 📋 Test Cases

### TC2.1: Doctor Model Validation
**Module**: `backend/apps/doctors/`

```python
def test_doctor_information_creation():
    """Test creating a doctor profile"""
    user = create_user(role='DOCTOR')
    doctor = DoctorInformation.objects.create(
        user=user,
        license_number='LIC12345',
        qualification='MBBS, MD',
        specialization='Cardiology',
        experience_years=10
    )
    assert doctor.status == 'PENDING'
    assert doctor.is_verified is False
    assert doctor.rating_avg == 0.00

def test_license_number_unique():
    """Test license number uniqueness constraint"""
    user1 = create_user(role='DOCTOR', email='doc1@test.com')
    user2 = create_user(role='DOCTOR', email='doc2@test.com')
    
    DoctorInformation.objects.create(
        user=user1,
        license_number='LIC12345',
        specialization='Cardiology'
    )
    
    with pytest.raises(IntegrityError):
        DoctorInformation.objects.create(
            user=user2,
            license_number='LIC12345',  # Duplicate
            specialization='Neurology'
        )
```

---

### TC2.2: Rating System
**Module**: `backend/apps/doctors/models.py`

```python
def test_rating_creation():
    """Test creating a rating for a doctor"""
    doctor = create_doctor()
    patient = create_user(role='PATIENT')
    
    rating = Rating.objects.create(
        doctor=doctor,
        user=patient,
        rating=5,
        review_text='Excellent doctor'
    )
    
    assert rating.rating == 5
    assert rating.doctor == doctor
    assert rating.user == patient

def test_rating_unique_constraint():
    """Test one rating per user per doctor"""
    doctor = create_doctor()
    patient = create_user(role='PATIENT')
    
    Rating.objects.create(doctor=doctor, user=patient, rating=5)
    
    with pytest.raises(IntegrityError):
        Rating.objects.create(doctor=doctor, user=patient, rating=4)

def test_rating_validation():
    """Test rating must be between 1 and 5"""
    doctor = create_doctor()
    patient = create_user(role='PATIENT')
    
    with pytest.raises(ValidationError):
        Rating.objects.create(doctor=doctor, user=patient, rating=0)
    
    with pytest.raises(ValidationError):
        Rating.objects.create(doctor=doctor, user=patient, rating=6)

def test_rating_updates_doctor_average():
    """Test rating average calculation"""
    doctor = create_doctor()
    patient1 = create_user(role='PATIENT', email='p1@test.com')
    patient2 = create_user(role='PATIENT', email='p2@test.com')
    
    Rating.objects.create(doctor=doctor, user=patient1, rating=5)
    doctor.refresh_from_db()
    assert doctor.rating_avg == 5.0
    assert doctor.rating_count == 1
    
    Rating.objects.create(doctor=doctor, user=patient2, rating=3)
    doctor.refresh_from_db()
    assert doctor.rating_avg == 4.0
    assert doctor.rating_count == 2
```

---

### TC2.3: Doctor List API
**Endpoint**: `GET /api/v1/doctors/`

```python
def test_list_doctors():
    """Test listing all approved doctors"""
    # Create approved doctor
    doctor1 = create_doctor(status='APPROVED', is_verified=True)
    # Create pending doctor (should not appear)
    doctor2 = create_doctor(status='PENDING', is_verified=False)
    
    client = APIClient()
    response = client.get('/api/v1/doctors/')
    
    assert response.status_code == 200
    assert len(response.data['results']) == 1
    assert response.data['results'][0]['id'] == doctor1.id

def test_filter_by_specialization():
    """Test filtering doctors by specialization"""
    cardio = create_doctor(specialization='Cardiology')
    neuro = create_doctor(specialization='Neurology')
    
    client = APIClient()
    response = client.get('/api/v1/doctors/?specialization=Cardiology')
    
    assert response.status_code == 200
    assert len(response.data['results']) == 1
    assert response.data['results'][0]['specialization'] == 'Cardiology'

def test_search_doctors():
    """Test full-text search"""
    create_doctor(
        specialization='Cardiology',
        user__name='Dr. Heart Specialist'
    )
    create_doctor(
        specialization='Neurology',
        user__name='Dr. Brain Expert'
    )
    
    client = APIClient()
    response = client.get('/api/v1/doctors/?search=heart')
    
    assert response.status_code == 200
    assert len(response.data['results']) == 1
    assert 'Heart' in response.data['results'][0]['user']['name']

def test_doctor_list_pagination():
    """Test pagination works correctly"""
    for i in range(25):
        create_doctor(user__email=f'doc{i}@test.com')
    
    client = APIClient()
    response = client.get('/api/v1/doctors/?page=1&page_size=20')
    
    assert response.status_code == 200
    assert len(response.data['results']) == 20
    assert response.data['count'] == 25
    assert response.data['next'] is not None
```

---

### TC2.4: Doctor Detail API
**Endpoint**: `GET /api/v1/doctors/{id}/`

```python
def test_get_doctor_detail():
    """Test retrieving doctor details"""
    doctor = create_doctor(
        specialization='Cardiology',
        experience_years=10,
        bio='Expert in heart diseases'
    )
    
    client = APIClient()
    response = client.get(f'/api/v1/doctors/{doctor.id}/')
    
    assert response.status_code == 200
    assert response.data['specialization'] == 'Cardiology'
    assert response.data['experience_years'] == 10
    assert response.data['bio'] == 'Expert in heart diseases'

def test_doctor_not_found():
    """Test 404 for non-existent doctor"""
    client = APIClient()
    response = client.get('/api/v1/doctors/99999/')
    
    assert response.status_code == 404

def test_doctor_detail_includes_ratings():
    """Test doctor detail includes rating information"""
    doctor = create_doctor()
    patient1 = create_user(role='PATIENT', email='p1@test.com')
    patient2 = create_user(role='PATIENT', email='p2@test.com')
    
    Rating.objects.create(doctor=doctor, user=patient1, rating=5)
    Rating.objects.create(doctor=doctor, user=patient2, rating=4)
    
    client = APIClient()
    response = client.get(f'/api/v1/doctors/{doctor.id}/')
    
    assert response.status_code == 200
    assert response.data['rating_avg'] == 4.5
    assert response.data['rating_count'] == 2
```

---

### TC2.5: Doctor Rating API
**Endpoint**: `POST /api/v1/doctors/{id}/rate/`

```python
def test_rate_doctor_authenticated():
    """Test authenticated user can rate a doctor"""
    doctor = create_doctor()
    patient = create_user(role='PATIENT')
    
    client = APIClient()
    client.force_authenticate(user=patient)
    
    response = client.post(f'/api/v1/doctors/{doctor.id}/rate/', {
        'rating': 5,
        'review_text': 'Excellent doctor'
    })
    
    assert response.status_code == 201
    assert Rating.objects.filter(doctor=doctor, user=patient).exists()

def test_rate_doctor_unauthenticated():
    """Test unauthenticated user cannot rate"""
    doctor = create_doctor()
    
    client = APIClient()
    response = client.post(f'/api/v1/doctors/{doctor.id}/rate/', {
        'rating': 5
    })
    
    assert response.status_code == 401

def test_rate_doctor_duplicate():
    """Test user cannot rate same doctor twice"""
    doctor = create_doctor()
    patient = create_user(role='PATIENT')
    
    Rating.objects.create(doctor=doctor, user=patient, rating=5)
    
    client = APIClient()
    client.force_authenticate(user=patient)
    
    response = client.post(f'/api/v1/doctors/{doctor.id}/rate/', {
        'rating': 4
    })
    
    assert response.status_code == 400
    assert 'already rated' in str(response.data).lower()

def test_rate_doctor_invalid_rating():
    """Test rating validation"""
    doctor = create_doctor()
    patient = create_user(role='PATIENT')
    
    client = APIClient()
    client.force_authenticate(user=patient)
    
    response = client.post(f'/api/v1/doctors/{doctor.id}/rate/', {
        'rating': 10  # Invalid
    })
    
    assert response.status_code == 400
```

---

### TC2.6: Doctor Search Filters
**Module**: `backend/apps/doctors/views.py`

```python
def test_filter_by_disease():
    """Test filtering doctors by disease treatment"""
    cardio = create_doctor(specialization='Cardiology')
    # Assume disease treatment added via API
    
    client = APIClient()
    response = client.get('/api/v1/doctors/?disease=Heart Attack')
    
    assert response.status_code == 200
    # Verify results contain doctors who treat "Heart Attack"

def test_filter_by_location():
    """Test filtering by practice location"""
    dhaka_doc = create_doctor(practice_location='Dhaka')
    chittagong_doc = create_doctor(practice_location='Chittagong')
    
    client = APIClient()
    response = client.get('/api/v1/doctors/?location=Dhaka')
    
    assert response.status_code == 200
    assert len(response.data['results']) == 1

def test_combined_filters():
    """Test multiple filters simultaneously"""
    create_doctor(
        specialization='Cardiology',
        practice_location='Dhaka',
        experience_years=10
    )
    create_doctor(
        specialization='Neurology',
        practice_location='Dhaka',
        experience_years=5
    )
    
    client = APIClient()
    response = client.get(
        '/api/v1/doctors/?specialization=Cardiology&location=Dhaka'
    )
    
    assert response.status_code == 200
    assert len(response.data['results']) == 1
    assert response.data['results'][0]['specialization'] == 'Cardiology'
```

---

### TC2.7: Frontend Doctor Search
**Module**: `frontend/src/pages/DoctorSearchPage.jsx`

```javascript
describe('Doctor Search Page', () => {
  test('displays search form', () => {
    render(<DoctorSearchPage />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  test('fetches and displays doctors', async () => {
    const mockDoctors = [
      { id: 1, name: 'Dr. Alice', specialization: 'Cardiology' },
      { id: 2, name: 'Dr. Bob', specialization: 'Neurology' }
    ];
    
    axios.get.mockResolvedValue({ data: { results: mockDoctors } });
    
    render(<DoctorSearchPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Dr. Alice')).toBeInTheDocument();
      expect(screen.getByText('Dr. Bob')).toBeInTheDocument();
    });
  });

  test('filters doctors by specialization', async () => {
    render(<DoctorSearchPage />);
    
    const specializationSelect = screen.getByLabelText(/specialization/i);
    fireEvent.change(specializationSelect, { target: { value: 'Cardiology' } });
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('specialization=Cardiology')
      );
    });
  });

  test('navigates to doctor profile on click', () => {
    const mockDoctor = { id: 5, name: 'Dr. Charlie' };
    axios.get.mockResolvedValue({ data: { results: [mockDoctor] } });
    
    const navigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      useNavigate: () => navigate
    }));
    
    render(<DoctorSearchPage />);
    
    const doctorCard = screen.getByText('Dr. Charlie');
    fireEvent.click(doctorCard);
    
    expect(navigate).toHaveBeenCalledWith('/doctors/5');
  });
});
```

---

### TC2.8: Frontend Doctor Profile
**Module**: `frontend/src/pages/DoctorProfilePage.jsx`

```javascript
describe('Doctor Profile Page', () => {
  test('displays doctor information', async () => {
    const mockDoctor = {
      id: 5,
      user: { name: 'Dr. Alice Smith' },
      specialization: 'Cardiology',
      experience_years: 10,
      rating_avg: 4.5,
      bio: 'Expert cardiologist'
    };
    
    axios.get.mockResolvedValue({ data: mockDoctor });
    
    render(<DoctorProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Dr. Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
      expect(screen.getByText(/10 years/i)).toBeInTheDocument();
      expect(screen.getByText('4.5')).toBeInTheDocument();
    });
  });

  test('displays rating form for authenticated users', async () => {
    const mockDoctor = { id: 5, user: { name: 'Dr. Alice' } };
    axios.get.mockResolvedValue({ data: mockDoctor });
    
    // Mock authenticated user
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('mock-token');
    
    render(<DoctorProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText(/rate this doctor/i)).toBeInTheDocument();
    });
  });

  test('submits rating successfully', async () => {
    const mockDoctor = { id: 5, user: { name: 'Dr. Alice' } };
    axios.get.mockResolvedValue({ data: mockDoctor });
    axios.post.mockResolvedValue({ data: { success: true } });
    
    render(<DoctorProfilePage />);
    
    const ratingInput = screen.getByLabelText(/rating/i);
    fireEvent.change(ratingInput, { target: { value: '5' } });
    
    const submitButton = screen.getByText(/submit rating/i);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        '/api/v1/doctors/5/rate/',
        expect.objectContaining({ rating: 5 })
      );
    });
  });
});
```

---

## 🔧 Tools & Setup

### Backend Testing
```bash
# Install pytest dependencies
pip install pytest pytest-django pytest-cov

# Run tests
pytest backend/apps/doctors/tests/ -v

# With coverage
pytest --cov=backend/apps/doctors --cov-report=html
```

### Frontend Testing
```bash
# Install testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Run tests
npm test

# With coverage
npm test -- --coverage
```

---

## 📊 Coverage Requirements

| Component | Target | Critical |
|-----------|--------|----------|
| Models | ≥90% | ✅ Yes |
| Serializers | ≥90% | ✅ Yes |
| Views/APIs | ≥85% | ✅ Yes |
| Frontend Components | ≥75% | ⚠️ Medium |
| Utils/Helpers | ≥80% | ⚠️ Medium |

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Rating average not updating | Signal not triggered | Check post_save signal on Rating model |
| Duplicate license error | Constraint violation | Ensure license_number is unique |
| Search returns pending doctors | Missing filter | Add `status='APPROVED'` filter |
| Rating validation fails | Invalid range | Ensure rating is 1-5 |
| Frontend auth error | Missing token | Check localStorage for access token |

---

## ✅ Execution Checklist

### Pre-Testing
- [ ] Database migrations applied
- [ ] Test database created
- [ ] Test fixtures prepared
- [ ] Environment variables set

### Backend Testing
- [ ] Unit tests pass (90%+ coverage)
- [ ] Integration tests pass
- [ ] API tests pass
- [ ] Doctor search filters tested
- [ ] Rating system tested

### Frontend Testing
- [ ] Component tests pass
- [ ] Search functionality tested
- [ ] Profile page tested
- [ ] Rating submission tested

### Post-Testing
- [ ] Coverage reports generated
- [ ] Failed tests documented
- [ ] Bugs logged in issue tracker
- [ ] Performance benchmarks recorded

---

## 🔗 Related Documentation

- [User Stories](./USER_STORIES.md)
- [API Specification](./API_SPECIFICATION.md)
- [TDD Guide](./TDD.md)
