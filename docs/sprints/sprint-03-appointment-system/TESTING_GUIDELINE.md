# Testing Guideline: Sprint 03 - Appointment System

**Comprehensive Testing Strategy for Appointment Booking & Management**

---

## 📋 Document Information

| Attribute | Value |
|-----------|-------|
| **Sprint** | Sprint 03 |
| **Feature** | Appointment System |
| **Testing Level** | Unit, Integration, E2E |
| **Last Updated** | January 16, 2026 |

---

## 🎯 Testing Objectives

1. **Booking Flow**: Verify patients can book appointments successfully
2. **Doctor Dashboard**: Test doctor appointment management interface
3. **Status Management**: Validate appointment status transitions
4. **Date Validation**: Ensure no past-date bookings
5. **Auto-Cleanup**: Test 7-day old appointment deletion

---

## 🧪 Test Levels

### Unit Testing (≥90%)
- Appointment model
- Date validation logic
- Appointment number generation
- Status transitions

### Integration Testing (≥85%)
- Booking API
- Dashboard API
- Update/Cancel APIs
- CAPTCHA integration

### E2E Testing
- Complete booking flow
- Doctor dashboard workflow
- Appointment cancellation
- Status update flow

---

## 📋 Test Cases

### TC3.1: Appointment Model
```python
def test_appointment_creation():
    doctor = create_doctor()
    patient = create_user(role='PATIENT')
    
    appointment = Appointment.objects.create(
        doctor=doctor,
        patient=patient,
        appointment_date=date.today() + timedelta(days=1),
        appointment_time='10:30'
    )
    
    assert appointment.status == 'PENDING'
    assert appointment.appointment_number.startswith('APT-')

def test_appointment_number_unique():
    doctor = create_doctor()
    patient = create_user(role='PATIENT')
    
    app1 = Appointment.objects.create(
        doctor=doctor, patient=patient,
        appointment_date=date.today() + timedelta(days=1)
    )
    app2 = Appointment.objects.create(
        doctor=doctor, patient=patient,
        appointment_date=date.today() + timedelta(days=2)
    )
    
    assert app1.appointment_number != app2.appointment_number

def test_past_date_validation():
    doctor = create_doctor()
    patient = create_user(role='PATIENT')
    
    with pytest.raises(ValidationError):
        Appointment.objects.create(
            doctor=doctor,
            patient=patient,
            appointment_date=date.today() - timedelta(days=1)  # Past
        )
```

---

### TC3.2: Booking API
**Endpoint**: `POST /api/v1/appointments/`

```python
def test_book_appointment_success():
    doctor = create_doctor()
    patient = create_user(role='PATIENT')
    
    client = APIClient()
    client.force_authenticate(user=patient)
    
    response = client.post('/api/v1/appointments/', {
        'doctor_id': doctor.id,
        'appointment_date': (date.today() + timedelta(days=1)).isoformat(),
        'appointment_time': '10:30',
        'reason': 'Regular checkup'
    })
    
    assert response.status_code == 201
    assert 'appointment_number' in response.data
    assert response.data['status'] == 'PENDING'

def test_book_appointment_past_date():
    doctor = create_doctor()
    patient = create_user(role='PATIENT')
    
    client = APIClient()
    client.force_authenticate(user=patient)
    
    response = client.post('/api/v1/appointments/', {
        'doctor_id': doctor.id,
        'appointment_date': (date.today() - timedelta(days=1)).isoformat()
    })
    
    assert response.status_code == 400
    assert 'past' in str(response.data).lower()

def test_book_appointment_unauthenticated():
    doctor = create_doctor()
    
    client = APIClient()
    response = client.post('/api/v1/appointments/', {
        'doctor_id': doctor.id,
        'appointment_date': (date.today() + timedelta(days=1)).isoformat()
    })
    
    assert response.status_code == 401
```

---

### TC3.3: Doctor Dashboard API
**Endpoint**: `GET /api/v1/appointments/doctor-dashboard/`

```python
def test_doctor_dashboard_today():
    doctor_user = create_user(role='DOCTOR')
    doctor = create_doctor(user=doctor_user)
    patient = create_user(role='PATIENT')
    
    # Create today's appointment
    Appointment.objects.create(
        doctor=doctor,
        patient=patient,
        appointment_date=date.today(),
        appointment_time='10:00'
    )
    
    client = APIClient()
    client.force_authenticate(user=doctor_user)
    
    response = client.get('/api/v1/appointments/doctor-dashboard/')
    
    assert response.status_code == 200
    assert 'today_appointments' in response.data
    assert len(response.data['today_appointments']) == 1

def test_doctor_dashboard_upcoming():
    doctor_user = create_user(role='DOCTOR')
    doctor = create_doctor(user=doctor_user)
    patient = create_user(role='PATIENT')
    
    # Create appointment in 3 days
    Appointment.objects.create(
        doctor=doctor,
        patient=patient,
        appointment_date=date.today() + timedelta(days=3)
    )
    
    client = APIClient()
    client.force_authenticate(user=doctor_user)
    
    response = client.get('/api/v1/appointments/doctor-dashboard/')
    
    assert 'upcoming_appointments' in response.data
    assert len(response.data['upcoming_appointments']) == 1

def test_patient_cannot_access_dashboard():
    patient = create_user(role='PATIENT')
    
    client = APIClient()
    client.force_authenticate(user=patient)
    
    response = client.get('/api/v1/appointments/doctor-dashboard/')
    
    assert response.status_code == 403
```

---

### TC3.4: Update/Cancel Appointments
```python
def test_patient_cancel_own_appointment():
    doctor = create_doctor()
    patient = create_user(role='PATIENT')
    
    appointment = Appointment.objects.create(
        doctor=doctor,
        patient=patient,
        appointment_date=date.today() + timedelta(days=1)
    )
    
    client = APIClient()
    client.force_authenticate(user=patient)
    
    response = client.delete(f'/api/v1/appointments/{appointment.id}/')
    
    assert response.status_code == 204
    assert not Appointment.objects.filter(id=appointment.id).exists()

def test_doctor_update_appointment_status():
    doctor_user = create_user(role='DOCTOR')
    doctor = create_doctor(user=doctor_user)
    patient = create_user(role='PATIENT')
    
    appointment = Appointment.objects.create(
        doctor=doctor,
        patient=patient,
        appointment_date=date.today()
    )
    
    client = APIClient()
    client.force_authenticate(user=doctor_user)
    
    response = client.patch(f'/api/v1/appointments/{appointment.id}/', {
        'status': 'CONFIRMED'
    })
    
    assert response.status_code == 200
    appointment.refresh_from_db()
    assert appointment.status == 'CONFIRMED'
```

---

### TC3.5: Auto-Cleanup Task
```python
def test_delete_old_appointments():
    doctor = create_doctor()
    patient = create_user(role='PATIENT')
    
    # Create 8-day old appointment
    old_date = date.today() - timedelta(days=8)
    old_appointment = Appointment.objects.create(
        doctor=doctor,
        patient=patient,
        appointment_date=old_date
    )
    
    # Create recent appointment
    recent_appointment = Appointment.objects.create(
        doctor=doctor,
        patient=patient,
        appointment_date=date.today()
    )
    
    # Run cleanup task
    from apps.appointment.tasks import cleanup_old_appointments
    cleanup_old_appointments()
    
    assert not Appointment.objects.filter(id=old_appointment.id).exists()
    assert Appointment.objects.filter(id=recent_appointment.id).exists()
```

---

### TC3.6: Frontend Booking
```javascript
describe('Book Appointment Page', () => {
  test('displays booking form', () => {
    render(<BookAppointmentPage />);
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reason/i)).toBeInTheDocument();
  });

  test('prevents past date selection', () => {
    render(<BookAppointmentPage />);
    const dateInput = screen.getByLabelText(/date/i);
    
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    
    fireEvent.change(dateInput, { 
      target: { value: pastDate.toISOString().split('T')[0] } 
    });
    
    expect(screen.getByText(/cannot book past date/i)).toBeInTheDocument();
  });

  test('submits booking successfully', async () => {
    axios.post.mockResolvedValue({
      data: { appointment_number: 'APT-20260116-001' }
    });
    
    render(<BookAppointmentPage />);
    
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: '2026-01-20' }
    });
    fireEvent.change(screen.getByLabelText(/reason/i), {
      target: { value: 'Checkup' }
    });
    
    fireEvent.click(screen.getByText(/book appointment/i));
    
    await waitFor(() => {
      expect(screen.getByText(/APT-20260116-001/i)).toBeInTheDocument();
    });
  });
});
```

---

### TC3.7: Doctor Dashboard Frontend
```javascript
describe('Doctor Dashboard', () => {
  test('displays today appointments', async () => {
    const mockAppointments = [
      { id: 1, patient: { name: 'John Doe' }, appointment_time: '10:00' }
    ];
    
    axios.get.mockResolvedValue({
      data: { today_appointments: mockAppointments }
    });
    
    render(<DoctorDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('10:00')).toBeInTheDocument();
    });
  });

  test('confirms appointment', async () => {
    axios.get.mockResolvedValue({
      data: { today_appointments: [{ id: 1, status: 'PENDING' }] }
    });
    axios.patch.mockResolvedValue({
      data: { id: 1, status: 'CONFIRMED' }
    });
    
    render(<DoctorDashboardPage />);
    
    const confirmButton = await screen.findByText(/confirm/i);
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith(
        '/api/v1/appointments/1/',
        { status: 'CONFIRMED' }
      );
    });
  });
});
```

---

## 🔧 Tools & Setup

### Backend
```bash
pytest backend/apps/appointment/tests/ -v --cov
```

### Frontend
```bash
npm test -- --testPathPattern=Appointment
```

---

## 📊 Coverage Requirements

| Component | Target |
|-----------|--------|
| Models | ≥90% |
| APIs | ≥85% |
| Frontend | ≥75% |

---

## ✅ Execution Checklist

- [ ] Booking flow tested
- [ ] Dashboard tested
- [ ] Status transitions validated
- [ ] Auto-cleanup tested
- [ ] CAPTCHA integration verified
- [ ] Date validation confirmed

---

## 🔗 Related Documentation

- [User Stories](./USER_STORIES.md)
- [API Specification](./API_SPECIFICATION.md)
