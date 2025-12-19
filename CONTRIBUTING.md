# Contributing to Smart Health Synchronizer

Thank you for considering contributing to Smart Health Synchronizer! This document provides guidelines for contributing to the project.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branching Strategy](#branching-strategy)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

---

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Keep discussions professional

---

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/smart-health-synchronizer.git
   cd smart-health-synchronizer
   ```
3. **Set up development environment**:
   - Backend: Follow backend setup in README.md
   - Frontend: Follow frontend setup in README.md
4. **Create a branch** for your work

---

## 🔄 Development Workflow

We follow **Agile methodology** with 2-week sprints:

### Sprint Cycle
1. **Sprint Planning** - Define goals and tasks
2. **Development** - Implement features
3. **Code Review** - Review and improve
4. **Sprint Review** - Demo and feedback
5. **Sprint Retrospective** - Reflect and improve

### Daily Workflow
1. Pull latest changes from `develop`
2. Create feature branch
3. Write tests (TDD approach)
4. Implement feature
5. Run tests and ensure they pass
6. Update documentation
7. Create Pull Request

---

## 🌿 Branching Strategy

We use **GitFlow** branching model:

### Main Branches
- `main` - Production-ready code (protected)
- `develop` - Integration branch (protected)

### Supporting Branches
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes
- `docs/*` - Documentation updates
- `test/*` - Test-related changes
- `refactor/*` - Code refactoring

### Branch Naming Convention
```bash
feature/user-authentication
feature/blog-system
bugfix/login-error
hotfix/security-patch
docs/api-documentation
test/user-api-tests
refactor/auth-service
```

### Creating a Branch
```bash
# Always create from develop (unless hotfix)
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

---

## 💬 Commit Guidelines

We follow **Conventional Commits** specification.

### Format
```
<type>(<scope>): <subject>

<body> (optional)

<footer> (optional)
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code formatting (no logic change)
- `refactor` - Code restructuring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `perf` - Performance improvements
- `ci` - CI/CD changes

### Scope
- `auth` - Authentication
- `api` - API changes
- `ui` - User interface
- `db` - Database
- `docs` - Documentation
- `tests` - Testing

### Examples
```bash
# Good commits
git commit -m "feat(auth): implement JWT authentication"
git commit -m "fix(api): resolve user registration validation error"
git commit -m "docs(readme): update installation instructions"
git commit -m "test(auth): add unit tests for login endpoint"
git commit -m "refactor(api): improve error handling pattern"

# Bad commits (avoid)
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "wip"
```

### Multi-line Commit Example
```bash
git commit -m "feat(blog): add blog post creation feature

- Created BlogPost model
- Implemented CRUD API endpoints
- Added serializers and validators
- Wrote comprehensive unit tests
- Updated API documentation

Closes #42"
```

---

## 🔀 Pull Request Process

### Before Creating PR
1. ✅ All tests pass
2. ✅ Code follows style guidelines
3. ✅ Documentation updated
4. ✅ No console.log or debug statements
5. ✅ Self-review completed

### Creating PR
1. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR on GitHub** from your branch to `develop`

3. **Fill PR template** with:
   - Clear description of changes
   - Related issue numbers
   - Type of change
   - Testing done
   - Screenshots (if UI changes)

### PR Template
```markdown
## Description
Brief description of what this PR does

## Related Issues
Closes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No new warnings

## Screenshots (if applicable)
```

### Code Review Process
1. **Maintainer reviews** your code
2. **Address feedback** by pushing new commits
3. **Approval** - Once approved, maintainer merges
4. **Clean up** - Delete your branch after merge

---

## 🎨 Coding Standards

### Python/Django (Backend)
```python
# Use snake_case for variables and functions
user_name = "John"
def get_user_data():
    pass

# Use PascalCase for classes
class UserProfile:
    pass

# Use UPPER_SNAKE_CASE for constants
MAX_LOGIN_ATTEMPTS = 3

# Write docstrings for functions/classes
def authenticate_user(username: str, password: str) -> bool:
    """
    Authenticate user with provided credentials.
    
    Args:
        username: User's username
        password: User's password
    
    Returns:
        True if authentication successful, False otherwise
    """
    pass

# Use type hints
def process_data(data: dict) -> list[str]:
    pass
```

### JavaScript/React (Frontend)
```javascript
// Use camelCase for variables and functions
const userName = "John";
function getUserData() {}

// Use PascalCase for React components
function UserProfile() {}
const Dashboard = () => {};

// Use UPPER_SNAKE_CASE for constants
const API_URL = "http://localhost:8000";

// Write JSDoc comments
/**
 * Fetches user data from API
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} User data object
 */
async function fetchUser(userId) {}
```

### Code Quality Tools

**Backend:**
- `black` - Code formatter
- `flake8` - Linter
- `isort` - Import sorter
- `pylint` - Static analyzer

**Frontend:**
- `ESLint` - Linter
- `Prettier` - Code formatter

**Run before committing:**
```bash
# Backend
cd backend
black .
isort .
flake8
pylint src/

# Frontend
cd frontend
npm run lint
npm run format
```

---

## 🧪 Testing Guidelines

### Backend Testing (pytest)
```python
# tests/test_auth.py
import pytest
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
class TestUserAuthentication:
    def test_user_registration(self):
        """Test user can register successfully"""
        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="securepass123"
        )
        assert user.username == "testuser"
        assert user.check_password("securepass123")
```

### Frontend Testing (React Testing Library)
```javascript
// UserProfile.test.jsx
import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';

describe('UserProfile', () => {
  it('renders user information', () => {
    render(<UserProfile user={{ name: 'John' }} />);
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
```

### Test Coverage
- Aim for **>80% code coverage**
- Write tests for:
  - All API endpoints
  - Business logic
  - Edge cases
  - Error handling

### Running Tests
```bash
# Backend
cd backend
pytest
pytest --cov=src --cov-report=html

# Frontend
cd frontend
npm test
npm test -- --coverage
```

---

## 📚 Documentation

### What to Document
1. **Code Documentation**
   - Docstrings for functions/classes
   - Comments for complex logic
   - Type hints (Python) / JSDoc (JavaScript)

2. **API Documentation**
   - Update Swagger/OpenAPI specs
   - Add endpoint examples
   - Document request/response formats

3. **Architecture Documentation**
   - Update system design if needed
   - Write ADRs for major decisions
   - Update database schema

4. **User Documentation**
   - Update README if needed
   - Add setup instructions
   - Document new features

### Documentation Standards
- Write in **clear, simple English**
- Use **code examples**
- Include **screenshots** for UI features
- Keep docs **up-to-date** with code

---

## 🐛 Reporting Bugs

### Before Reporting
1. Check if issue already exists
2. Try to reproduce the bug
3. Gather relevant information

### Bug Report Template
```markdown
**Description**
Clear description of the bug

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g., Ubuntu 22.04]
- Browser: [e.g., Chrome 120]
- Version: [e.g., v0.1.0]

**Additional Context**
Any other relevant information
```

---

## 💡 Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution**
How you'd like it to work

**Describe alternatives**
Alternative solutions considered

**Additional context**
Mockups, examples, etc.
```

---

## ❓ Questions?

- Check existing documentation in `docs/`
- Search existing issues
- Ask in discussions

---

## 🎉 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Recognized in the community

---

Thank you for contributing! 🙌
