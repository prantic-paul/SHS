# Testing Guideline: Sprint 06 - Medical Records & Blog

**Comprehensive Testing Strategy for Medical Records and Blog Features**

---

## 📋 Document Information

| Attribute | Value |
|-----------|-------|
| **Sprint** | Sprint 06 |
| **Feature** | Medical Records, Prescriptions, Blog System |
| **Testing Level** | Unit, Integration, E2E |
| **Last Updated** | January 16, 2026 |

---

## 🎯 Testing Objectives

1. **Medical Records**: Test record creation and access control
2. **Prescriptions**: Verify prescription management and patient access
3. **Blog System**: Test blog creation, viewing, and commenting
4. **Access Control**: Validate role-based permissions
5. **Data Privacy**: Ensure patients see only their own records

---

## 🧪 Test Levels

### Unit Testing (≥90%)
- Prescription model
- BlogPost model
- Comment model
- Slug generation
- Vital signs validation

### Integration Testing (≥85%)
- Prescription APIs
- Blog APIs
- Comment APIs
- Access control

### E2E Testing
- Doctor creates prescription
- Patient views prescriptions
- Doctor publishes blog
- User comments on blog

---

## 📋 Test Cases

### TC6.1: Prescription Model
```python
def test_prescription_creation():
    doctor = create_doctor()
    patient = create_user(role='PATIENT')
    appointment = create_appointment(doctor=doctor, patient=patient)
    
    prescription = Prescription.objects.create(
        doctor=doctor,
        patient=patient,
        appointment=appointment,
        chief_complaint='Fever and cough',
        diagnosis='Common Cold',
        medications='Paracetamol 500mg',
        dosage='2 tablets, 3 times daily',
        temperature=98.6
    )
    
    assert prescription.doctor == doctor
    assert prescription.patient == patient
    assert prescription.temperature == 98.6

def test_prescription_one_per_appointment():
    doctor = create_doctor()
    patient = create_user(role='PATIENT')
    appointment = create_appointment(doctor=doctor, patient=patient)
    
    Prescription.objects.create(
        doctor=doctor,
        patient=patient,
        appointment=appointment,
        chief_complaint='Test',
        diagnosis='Test',
        medications='Test',
        dosage='Test'
    )
    
    with pytest.raises(IntegrityError):
        Prescription.objects.create(
            doctor=doctor,
            patient=patient,
            appointment=appointment,  # Same appointment
            chief_complaint='Test2',
            diagnosis='Test2',
            medications='Test2',
            dosage='Test2'
        )

def test_blood_pressure_property():
    prescription = create_prescription(
        blood_pressure_systolic=120,
        blood_pressure_diastolic=80
    )
    
    assert prescription.blood_pressure == '120/80'
```

---

### TC6.2: Prescription APIs
**Endpoint**: `POST /api/v1/prescriptions/`

```python
def test_doctor_create_prescription():
    doctor_user = create_user(role='DOCTOR')
    doctor = create_doctor(user=doctor_user)
    patient = create_user(role='PATIENT')
    appointment = create_appointment(doctor=doctor, patient=patient)
    
    client = APIClient()
    client.force_authenticate(user=doctor_user)
    
    response = client.post('/api/v1/prescriptions/', {
        'patient_id': patient.id,
        'appointment_id': appointment.id,
        'chief_complaint': 'Fever',
        'diagnosis': 'Viral infection',
        'medications': 'Paracetamol',
        'dosage': '500mg, 3 times daily',
        'temperature': 99.5
    })
    
    assert response.status_code == 201
    assert response.data['diagnosis'] == 'Viral infection'

def test_patient_cannot_create_prescription():
    patient = create_user(role='PATIENT')
    
    client = APIClient()
    client.force_authenticate(user=patient)
    
    response = client.post('/api/v1/prescriptions/', {
        'patient_id': patient.id,
        'chief_complaint': 'Test',
        'diagnosis': 'Test',
        'medications': 'Test',
        'dosage': 'Test'
    })
    
    assert response.status_code == 403

def test_patient_view_own_prescriptions():
    patient = create_user(role='PATIENT')
    doctor = create_doctor()
    
    prescription1 = create_prescription(patient=patient, doctor=doctor)
    prescription2 = create_prescription(patient=create_user(role='PATIENT', email='other@test.com'))
    
    client = APIClient()
    client.force_authenticate(user=patient)
    
    response = client.get('/api/v1/prescriptions/')
    
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]['id'] == prescription1.id
```

---

### TC6.3: BlogPost Model
```python
def test_blog_post_creation():
    doctor = create_user(role='DOCTOR')
    
    blog = BlogPost.objects.create(
        author=doctor,
        title='Understanding Diabetes',
        content='Diabetes is a chronic condition...',
        is_published=True
    )
    
    assert blog.author == doctor
    assert blog.slug == 'understanding-diabetes'

def test_slug_auto_generation():
    doctor = create_user(role='DOCTOR')
    
    blog1 = BlogPost.objects.create(
        author=doctor,
        title='Health Tips',
        content='Content 1'
    )
    
    blog2 = BlogPost.objects.create(
        author=doctor,
        title='Health Tips',  # Same title
        content='Content 2'
    )
    
    assert blog1.slug == 'health-tips'
    assert blog2.slug == 'health-tips-1'

def test_view_count_increment():
    blog = create_blog_post()
    
    initial_views = blog.views_count
    blog.views_count += 1
    blog.save()
    
    blog.refresh_from_db()
    assert blog.views_count == initial_views + 1
```

---

### TC6.4: Blog APIs
**Endpoint**: `GET /api/v1/blogs/`

```python
def test_list_published_blogs():
    published = create_blog_post(is_published=True)
    draft = create_blog_post(is_published=False)
    
    client = APIClient()
    response = client.get('/api/v1/blogs/')
    
    assert response.status_code == 200
    assert len(response.data['results']) == 1
    assert response.data['results'][0]['id'] == published.id

def test_get_blog_detail():
    blog = create_blog_post(
        title='Test Blog',
        content='Test content'
    )
    
    client = APIClient()
    response = client.get(f'/api/v1/blogs/{blog.id}/')
    
    assert response.status_code == 200
    assert response.data['title'] == 'Test Blog'
    assert response.data['content'] == 'Test content'

def test_create_blog_doctor_only():
    doctor = create_user(role='DOCTOR')
    
    client = APIClient()
    client.force_authenticate(user=doctor)
    
    response = client.post('/api/v1/blogs/', {
        'title': 'New Blog Post',
        'content': 'This is a new blog post...'
    })
    
    assert response.status_code == 201
    assert response.data['title'] == 'New Blog Post'

def test_create_blog_patient_forbidden():
    patient = create_user(role='PATIENT')
    
    client = APIClient()
    client.force_authenticate(user=patient)
    
    response = client.post('/api/v1/blogs/', {
        'title': 'Test',
        'content': 'Test'
    })
    
    assert response.status_code == 403

def test_update_own_blog():
    doctor = create_user(role='DOCTOR')
    blog = create_blog_post(author=doctor)
    
    client = APIClient()
    client.force_authenticate(user=doctor)
    
    response = client.put(f'/api/v1/blogs/{blog.id}/', {
        'title': 'Updated Title',
        'content': 'Updated content'
    })
    
    assert response.status_code == 200
    assert response.data['title'] == 'Updated Title'

def test_cannot_update_others_blog():
    doctor1 = create_user(role='DOCTOR', email='doc1@test.com')
    doctor2 = create_user(role='DOCTOR', email='doc2@test.com')
    blog = create_blog_post(author=doctor1)
    
    client = APIClient()
    client.force_authenticate(user=doctor2)
    
    response = client.put(f'/api/v1/blogs/{blog.id}/', {
        'title': 'Hacked',
        'content': 'Hacked'
    })
    
    assert response.status_code == 403
```

---

### TC6.5: Comment System
```python
def test_create_comment():
    blog = create_blog_post()
    user = create_user(role='PATIENT')
    
    comment = Comment.objects.create(
        blog_post=blog,
        author=user,
        content='Great article!'
    )
    
    assert comment.blog_post == blog
    assert comment.author == user

def test_post_comment_authenticated():
    blog = create_blog_post()
    user = create_user(role='PATIENT')
    
    client = APIClient()
    client.force_authenticate(user=user)
    
    response = client.post(f'/api/v1/blogs/{blog.id}/comments/', {
        'content': 'Great article!'
    })
    
    assert response.status_code == 201
    assert Comment.objects.filter(blog_post=blog, author=user).exists()

def test_post_comment_unauthenticated():
    blog = create_blog_post()
    
    client = APIClient()
    response = client.post(f'/api/v1/blogs/{blog.id}/comments/', {
        'content': 'Test'
    })
    
    assert response.status_code == 401
```

---

### TC6.6: Frontend Prescription View
```javascript
describe('Prescriptions Page', () => {
  test('displays patient prescriptions', async () => {
    const mockPrescriptions = [
      {
        id: 1,
        doctor: { user: { name: 'Dr. Smith' } },
        diagnosis: 'Common Cold',
        medications: 'Paracetamol',
        created_at: '2026-01-15'
      }
    ];
    
    axios.get.mockResolvedValue({ data: mockPrescriptions });
    
    render(<PrescriptionsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
      expect(screen.getByText('Common Cold')).toBeInTheDocument();
      expect(screen.getByText('Paracetamol')).toBeInTheDocument();
    });
  });

  test('displays prescription details', async () => {
    const mockPrescription = {
      id: 1,
      diagnosis: 'Viral Fever',
      medications: 'Paracetamol 500mg',
      dosage: '2 tablets, 3 times daily',
      instructions: 'Take after meals',
      temperature: 99.5
    };
    
    axios.get.mockResolvedValue({ data: mockPrescription });
    
    render(<PrescriptionDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/99.5/i)).toBeInTheDocument();
      expect(screen.getByText(/Take after meals/i)).toBeInTheDocument();
    });
  });
});
```

---

### TC6.7: Frontend Blog System
```javascript
describe('Blog List Page', () => {
  test('displays published blogs', async () => {
    const mockBlogs = [
      { id: 1, title: 'Blog 1', author: { name: 'Dr. Smith' } },
      { id: 2, title: 'Blog 2', author: { name: 'Dr. Jones' } }
    ];
    
    axios.get.mockResolvedValue({ data: { results: mockBlogs } });
    
    render(<BlogListPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Blog 1')).toBeInTheDocument();
      expect(screen.getByText('Blog 2')).toBeInTheDocument();
    });
  });

  test('navigates to blog detail', () => {
    const mockBlogs = [{ id: 1, title: 'Test Blog', author: { name: 'Dr. Smith' } }];
    axios.get.mockResolvedValue({ data: { results: mockBlogs } });
    
    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);
    
    render(<BlogListPage />);
    
    const blogCard = screen.getByText('Test Blog');
    fireEvent.click(blogCard);
    
    expect(navigate).toHaveBeenCalledWith('/blogs/1');
  });
});

describe('Blog Detail Page', () => {
  test('displays blog content', async () => {
    const mockBlog = {
      id: 1,
      title: 'Understanding Diabetes',
      content: 'Diabetes is a chronic condition...',
      author: { name: 'Dr. Smith' },
      created_at: '2026-01-15'
    };
    
    axios.get.mockResolvedValue({ data: mockBlog });
    
    render(<BlogDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Understanding Diabetes')).toBeInTheDocument();
      expect(screen.getByText(/Diabetes is a chronic/i)).toBeInTheDocument();
    });
  });

  test('displays comments', async () => {
    const mockBlog = { id: 1, title: 'Test', comments: [] };
    const mockComments = [
      { id: 1, author: { name: 'John' }, content: 'Great article!' },
      { id: 2, author: { name: 'Jane' }, content: 'Very helpful!' }
    ];
    
    axios.get
      .mockResolvedValueOnce({ data: mockBlog })
      .mockResolvedValueOnce({ data: mockComments });
    
    render(<BlogDetailPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Great article!')).toBeInTheDocument();
      expect(screen.getByText('Very helpful!')).toBeInTheDocument();
    });
  });

  test('posts comment', async () => {
    axios.post.mockResolvedValue({
      data: { id: 3, content: 'New comment', author: { name: 'User' } }
    });
    
    render(<BlogDetailPage />);
    
    const commentInput = screen.getByPlaceholderText(/write a comment/i);
    fireEvent.change(commentInput, { target: { value: 'New comment' } });
    
    fireEvent.click(screen.getByText(/post comment/i));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/comments/'),
        { content: 'New comment' }
      );
    });
  });
});

describe('Create Blog Page', () => {
  test('doctor can create blog', async () => {
    axios.post.mockResolvedValue({
      data: { id: 1, title: 'New Blog', slug: 'new-blog' }
    });
    
    render(<CreateBlogPage />);
    
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New Blog' }
    });
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'Blog content here...' }
    });
    
    fireEvent.click(screen.getByText(/publish/i));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        '/api/v1/blogs/',
        expect.objectContaining({ title: 'New Blog' })
      );
    });
  });
});
```

---

## 🔧 Tools & Setup

### Backend
```bash
pytest backend/apps/prescription/tests/ -v
pytest backend/apps/blog/tests/ -v
```

### Frontend
```bash
npm test -- --testPathPattern="Prescription|Blog"
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

### Prescription Testing
- [ ] Model validation tested
- [ ] Doctor creation tested
- [ ] Patient view access tested
- [ ] Vital signs tested

### Blog Testing
- [ ] Blog creation tested
- [ ] Slug generation tested
- [ ] Publish/draft tested
- [ ] Comment system tested
- [ ] Access control validated

---

## 🔗 Related Documentation

- [User Stories](./USER_STORIES.md)
- [API Specification](./API_SPECIFICATION.md)
- [TDD Guide](./TDD.md)
