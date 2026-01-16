# Contributing to Smart Health Synchronizer (SHS)

First off, thank you for considering contributing to Smart Health Synchronizer! It's people like you that make SHS such a great project. This is an actively developing project, and we welcome contributions from the community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

### Our Standards

**Examples of behavior that contributes to a positive environment:**
- ✅ Using welcoming and inclusive language
- ✅ Being respectful of differing viewpoints and experiences
- ✅ Gracefully accepting constructive criticism
- ✅ Focusing on what is best for the community
- ✅ Showing empathy towards other community members

**Examples of unacceptable behavior:**
- ❌ Trolling, insulting/derogatory comments, and personal or political attacks
- ❌ Public or private harassment
- ❌ Publishing others' private information without permission
- ❌ Other conduct which could reasonably be considered inappropriate

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Python 3.10+** installed
- **Node.js 18+** and npm installed
- **PostgreSQL 14+** installed and running
- **Git** installed
- **Google Gemini API Key** (for AI chatbot testing)
- **Pinecone API Key** (for vector database testing)

### Setting Up Development Environment

1. **Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub
   # Then clone your fork
   git clone https://github.com/your-username/SHS.git
   cd SHS
   ```

2. **Set Up Backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your configuration
   python manage.py migrate
   python manage.py runserver
   ```

3. **Set Up Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

4. **Set Up AI Service** (Optional)
   ```bash
   cd ai-service
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env
   # Add your API keys to .env
   uvicorn main:app --reload --port 8001
   ```

5. **Set Up ML Service** (Optional)
   ```bash
   cd disease-prediction-service
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python train_model.py  # Train models
   uvicorn main:app --reload --port 8002
   ```

---

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.

**When submitting a bug report, include:**
- Clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Screenshots (if applicable)
- Environment details (OS, Python/Node version, browser)
- Error messages or logs

**Example Bug Report:**
```markdown
**Bug**: Appointment booking fails for past dates

**Steps to Reproduce**:
1. Navigate to /book-appointment/5
2. Select yesterday's date
3. Click "Book Appointment"

**Expected**: Error message "Cannot book past dates"
**Actual**: Form submits and returns 500 error

**Environment**:
- OS: Ubuntu 22.04
- Python: 3.10.12
- Browser: Chrome 120

**Logs**:
```
ERROR: DateValidationError at /api/v1/appointments/
```
```

### Suggesting Enhancements

We welcome feature suggestions! Before submitting:
- Check if the feature is already in the [Roadmap](README.md#-roadmap)
- Search existing issues/discussions

**Enhancement Proposal Template:**
```markdown
**Feature**: Doctor availability calendar

**Problem**: Currently doctors cannot set their available time slots

**Proposed Solution**:
- Add AvailabilitySlot model
- Create API for doctors to set availability
- Update appointment booking to show only available slots

**Benefits**:
- Reduces booking conflicts
- Better user experience
- Automated scheduling

**Alternatives Considered**:
- Manual scheduling (current approach)
- Third-party calendar integration
```

### Pull Requests

We actively welcome your pull requests! Areas where you can contribute:

- 🐛 **Bug Fixes**: Fix reported issues
- ✨ **New Features**: Implement features from the roadmap
- 📝 **Documentation**: Improve docs, add examples
- 🧪 **Tests**: Increase test coverage
- 🎨 **UI/UX**: Improve frontend design
- ⚡ **Performance**: Optimize queries, reduce load times
- 🔧 **Refactoring**: Improve code quality

---

## 🔄 Development Workflow

### Branch Strategy

We use **Git Flow** with the following branches:

```
main (production-ready)
  └── develop (integration branch)
        ├── feature/feature-name
        ├── fix/bug-description
        ├── docs/documentation-update
        └── test/test-improvement
```

### Creating a Feature Branch

```bash
# Always start from develop
git checkout develop
git pull origin develop

# Create your feature branch
git checkout -b feature/doctor-availability-calendar

# Work on your feature
# ... make changes ...

# Commit your changes
git add .
git commit -m "feat: add doctor availability calendar"

# Push to your fork
git push origin feature/doctor-availability-calendar

# Create Pull Request on GitHub
```

### Branch Naming Conventions

| Type | Example | Purpose |
|------|---------|---------|
| `feature/` | `feature/payment-integration` | New features |
| `fix/` | `fix/appointment-date-validation` | Bug fixes |
| `docs/` | `docs/update-api-guide` | Documentation |
| `test/` | `test/add-appointment-tests` | Testing |
| `refactor/` | `refactor/simplify-auth-logic` | Code refactoring |
| `chore/` | `chore/update-dependencies` | Maintenance |

---

## 📏 Coding Standards

### Python (Backend & Services)

**Style Guide**: PEP 8

```python
# Use type hints
def get_doctor_by_id(doctor_id: int) -> Optional[DoctorInformation]:
    """
    Retrieve a doctor by ID.
    
    Args:
        doctor_id: The unique identifier of the doctor
        
    Returns:
        DoctorInformation object or None if not found
    """
    try:
        return DoctorInformation.objects.get(id=doctor_id)
    except DoctorInformation.DoesNotExist:
        return None

# Use descriptive variable names
approved_doctors = DoctorInformation.objects.filter(
    status='APPROVED',
    is_verified=True
)

# Keep functions focused and small
def calculate_average_rating(ratings: list[int]) -> float:
    """Calculate average from a list of ratings."""
    return sum(ratings) / len(ratings) if ratings else 0.0
```

**Django Best Practices**:
```python
# Use select_related for foreign keys
appointments = Appointment.objects.select_related(
    'doctor', 'patient'
).filter(appointment_date=today)

# Use prefetch_related for many-to-many
doctors = DoctorInformation.objects.prefetch_related(
    'ratings'
).filter(specialization='Cardiology')

# Use F() expressions for database-level operations
from django.db.models import F
DoctorInformation.objects.filter(
    id=doctor_id
).update(rating_count=F('rating_count') + 1)
```

### JavaScript/React (Frontend)

**Style Guide**: ESLint + Prettier

```javascript
// Use functional components with hooks
import { useState, useEffect } from 'react';

const DoctorCard = ({ doctor, onBookAppointment }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Clear, descriptive function names
  const handleBooking = async () => {
    setIsLoading(true);
    try {
      await onBookAppointment(doctor.id);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="doctor-card">
      <h3>{doctor.user.name}</h3>
      <p>{doctor.specialization}</p>
      <button onClick={handleBooking} disabled={isLoading}>
        {isLoading ? 'Booking...' : 'Book Appointment'}
      </button>
    </div>
  );
};

export default DoctorCard;
```

**React Best Practices**:
```javascript
// Custom hooks for reusable logic
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('access_token');
    if (token) {
      // Verify token and set user
    }
    setLoading(false);
  }, []);

  return { user, loading };
};

// PropTypes for type checking
import PropTypes from 'prop-types';

DoctorCard.propTypes = {
  doctor: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    specialization: PropTypes.string.isRequired
  }).isRequired,
  onBookAppointment: PropTypes.func.isRequired
};
```

### Code Formatting

**Python**:
```bash
# Install black and isort
pip install black isort

# Format code
black backend/
isort backend/

# Check with flake8
flake8 backend/
```

**JavaScript**:
```bash
# Install eslint and prettier
npm install --save-dev eslint prettier

# Format code
npm run format

# Lint code
npm run lint
```

---

## 🧪 Testing Guidelines

### Coverage Requirements

| Component | Minimum Coverage | Target Coverage |
|-----------|------------------|-----------------|
| Models | 90% | 95% |
| APIs | 85% | 90% |
| Frontend Components | 75% | 80% |
| Utils/Helpers | 80% | 85% |

### Backend Testing (pytest)

```python
# tests/test_appointments.py
import pytest
from datetime import date, timedelta
from apps.appointment.models import Appointment
from apps.users.models import User, DoctorInformation

@pytest.mark.django_db
class TestAppointmentBooking:
    def test_book_appointment_success(self, client, doctor, patient):
        """Test successful appointment booking"""
        tomorrow = date.today() + timedelta(days=1)
        
        client.force_authenticate(user=patient)
        response = client.post('/api/v1/appointments/', {
            'doctor_id': doctor.id,
            'appointment_date': tomorrow.isoformat(),
            'appointment_time': '10:00',
            'reason': 'Regular checkup'
        })
        
        assert response.status_code == 201
        assert 'appointment_number' in response.data
        assert Appointment.objects.filter(
            patient=patient,
            doctor=doctor
        ).exists()

    def test_book_appointment_past_date_fails(self, client, doctor, patient):
        """Test booking with past date returns 400"""
        yesterday = date.today() - timedelta(days=1)
        
        client.force_authenticate(user=patient)
        response = client.post('/api/v1/appointments/', {
            'doctor_id': doctor.id,
            'appointment_date': yesterday.isoformat()
        })
        
        assert response.status_code == 400
        assert 'past' in str(response.data).lower()
```

**Run Backend Tests**:
```bash
cd backend
pytest --cov=apps --cov-report=html
```

### Frontend Testing (Jest + React Testing Library)

```javascript
// DoctorCard.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DoctorCard from './DoctorCard';

describe('DoctorCard', () => {
  const mockDoctor = {
    id: 1,
    user: { name: 'Dr. Alice Smith' },
    specialization: 'Cardiology',
    rating_avg: 4.5
  };

  test('renders doctor information', () => {
    render(<DoctorCard doctor={mockDoctor} />);
    
    expect(screen.getByText('Dr. Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  test('calls onBookAppointment when button clicked', async () => {
    const mockBook = jest.fn();
    render(<DoctorCard doctor={mockDoctor} onBookAppointment={mockBook} />);
    
    const button = screen.getByText(/book appointment/i);
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockBook).toHaveBeenCalledWith(1);
    });
  });
});
```

**Run Frontend Tests**:
```bash
cd frontend
npm test -- --coverage
```

### Test Checklist

Before submitting PR:
- [ ] All new code has tests
- [ ] All existing tests pass
- [ ] Coverage meets minimum requirements
- [ ] Integration tests added for API changes
- [ ] E2E tests added for new user flows

---

## 📝 Documentation

### Code Documentation

**Python Docstrings**:
```python
def calculate_disease_probability(symptoms: list[str]) -> dict:
    """
    Calculate disease probabilities from symptoms.
    
    Args:
        symptoms: List of symptom names (e.g., ['fever', 'cough'])
        
    Returns:
        Dictionary with disease names as keys and probabilities as values.
        Example: {'Common Cold': 0.85, 'Flu': 0.10}
        
    Raises:
        ValueError: If symptoms list is empty
        KeyError: If symptom not in known symptoms
        
    Example:
        >>> calculate_disease_probability(['fever', 'cough'])
        {'Common Cold': 0.85, 'Flu': 0.10, 'COVID-19': 0.05}
    """
    if not symptoms:
        raise ValueError("Symptoms list cannot be empty")
    
    # Implementation
    pass
```

**JSDoc Comments**:
```javascript
/**
 * Fetches doctor details from the API
 * @param {number} doctorId - The ID of the doctor to fetch
 * @returns {Promise<Object>} Doctor object with profile details
 * @throws {Error} If doctor not found or network error
 * @example
 * const doctor = await fetchDoctorDetails(5);
 * console.log(doctor.user.name);
 */
const fetchDoctorDetails = async (doctorId) => {
  const response = await axios.get(`/api/v1/doctors/${doctorId}/`);
  return response.data;
};
```

### Documentation Updates

When adding features, update:
- [ ] README.md (if user-facing feature)
- [ ] API documentation (if new endpoints)
- [ ] Sprint documentation (if part of sprint)
- [ ] Architecture docs (if system design changes)
- [ ] Inline code comments
- [ ] CHANGELOG.md

---

## 💬 Commit Message Guidelines

We follow **Conventional Commits** specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(appointment): add recurring appointments` |
| `fix` | Bug fix | `fix(auth): resolve token refresh issue` |
| `docs` | Documentation | `docs(api): update endpoint descriptions` |
| `style` | Code style changes | `style(frontend): format with prettier` |
| `refactor` | Code refactoring | `refactor(doctor): simplify search logic` |
| `test` | Add/update tests | `test(appointment): add booking tests` |
| `chore` | Maintenance | `chore(deps): update dependencies` |
| `perf` | Performance improvement | `perf(query): optimize doctor search query` |

### Examples

**Simple commit**:
```bash
git commit -m "feat(chat): add message history pagination"
```

**Detailed commit**:
```bash
git commit -m "feat(prediction): add doctor recommendation

- Map predicted disease to medical specialization
- Query doctors treating the disease
- Filter by location and rating
- Return top 5 recommended doctors

Closes #42"
```

**Breaking change**:
```bash
git commit -m "feat(api): change authentication to OAuth2

BREAKING CHANGE: JWT authentication replaced with OAuth2.
Update client applications to use new auth flow.

Migration guide in docs/AUTH_MIGRATION.md"
```

### Commit Message Rules

- ✅ Use imperative mood ("add" not "added" or "adds")
- ✅ Don't capitalize first letter of subject
- ✅ No period at the end of subject
- ✅ Limit subject line to 50 characters
- ✅ Separate subject from body with blank line
- ✅ Wrap body at 72 characters
- ✅ Reference issues and PRs in footer

---

## 🔍 Pull Request Process

### Before Submitting

1. **Update your branch**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout your-feature-branch
   git rebase develop
   ```

2. **Run all tests**:
   ```bash
   # Backend
   cd backend && pytest
   
   # Frontend
   cd frontend && npm test
   ```

3. **Check code quality**:
   ```bash
   # Python
   black backend/
   flake8 backend/
   
   # JavaScript
   npm run lint
   npm run format
   ```

4. **Update documentation** as needed

### Pull Request Template

```markdown
## Description
Briefly describe what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issue
Fixes #(issue number)

## How Has This Been Tested?
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged and published

## Screenshots (if applicable)
Add screenshots to help explain your changes.
```

### Review Process

1. **Automated Checks**: CI/CD will run tests and linting
2. **Code Review**: Maintainer will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, maintainer will merge

### PR Review Criteria

- ✅ Code follows project standards
- ✅ All tests pass
- ✅ Documentation updated
- ✅ No merge conflicts
- ✅ Commit messages follow convention
- ✅ Changes are focused and logical

---

## 🏷️ Issue Labels

| Label | Description | Use When |
|-------|-------------|----------|
| `bug` | Something isn't working | Reporting bugs |
| `enhancement` | New feature or request | Suggesting features |
| `documentation` | Improvements to docs | Doc updates needed |
| `good first issue` | Good for newcomers | Easy issues |
| `help wanted` | Extra attention needed | Need community help |
| `question` | Further information requested | Asking questions |
| `wontfix` | This will not be worked on | Closing without fix |

---

## 📞 Getting Help

- 📖 **Documentation**: Check [docs/](./docs/)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/prantic-paul/SHS/discussions)
- 🐛 **Issues**: [GitHub Issues](https://github.com/prantic-paul/SHS/issues)
- 📧 **Email**: Contact maintainers directly (for sensitive issues)

---

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

<div align="center">

**Thank you for contributing to Smart Health Synchronizer!** 🎉

Your contributions make this project better for everyone.

</div>
