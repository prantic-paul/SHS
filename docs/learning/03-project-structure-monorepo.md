# 03 - Project Structure & Monorepo

**Status:** ✅ Completed  
**Time Required:** 2 hours  
**Phase:** Phase 0 - Foundation

---

## 🎯 Learning Objectives

1. Understand monorepo vs multi-repo
2. Know our project structure
3. Understand separation of concerns
4. Know where each file belongs

---

## 📚 What is a Monorepo?

**Monorepo** = ONE repository containing MULTIPLE projects

### Monorepo vs Multi-Repo

**Multi-Repo (Separate repositories):**
```
github.com/username/shs-backend
github.com/username/shs-frontend
github.com/username/shs-ai-service
```

**Monorepo (One repository):**
```
github.com/username/SHS
  ├── backend/
  ├── frontend/
  └── ai-service/
```

### Why We Use Monorepo?

✅ **Benefits:**
- Share code and docs easily
- One place for everything
- Easier to keep versions in sync
- Simpler collaboration

❌ **When NOT to use:**
- Very large teams
- Independent release cycles
- Different tech stacks per service (not our case)

---

## 🏗️ Our Project Structure

```
SHS/                                # Root directory
├── backend/                        # Django REST Framework
│   ├── venv/                       # Virtual environment (NOT in git)
│   ├── config/                     # Django project settings
│   │   ├── settings.py            # Configuration
│   │   ├── urls.py                # URL routing
│   │   └── wsgi.py                # Web server gateway
│   ├── manage.py                  # Django management script
│   ├── requirements.txt           # Python dependencies
│   ├── requirements-dev.txt       # Dev dependencies
│   ├── .env.example               # Environment variables template
│   └── README.md                  # Backend documentation
│
├── frontend/                       # React + Vite
│   ├── node_modules/              # Dependencies (NOT in git)
│   ├── src/                       # Source code
│   │   ├── App.jsx               # Main component
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Styles
│   ├── package.json               # npm dependencies
│   ├── vite.config.js            # Vite configuration
│   ├── .env.example               # Environment variables template
│   └── README.md                  # Frontend documentation
│
├── ai-service/                     # FastAPI ML service
│   ├── venv/                       # Virtual environment (NOT in git)
│   ├── main.py                    # FastAPI application
│   ├── requirements.txt           # Python dependencies
│   ├── .env.example               # Environment variables template
│   └── README.md                  # AI service documentation
│
├── docs/                           # Documentation
│   ├── learning/                   # Learning materials (NEW!)
│   │   ├── 00-LEARNING_ROADMAP.md
│   │   ├── 01-agile-sdlc-basics.md
│   │   └── ...
│   ├── adr/                       # Architecture Decision Records
│   │   ├── 001-technology-stack-decisions.md
│   │   ├── 002-monorepo-structure.md
│   │   └── ...
│   ├── architecture/              # System architecture
│   │   ├── SYSTEM_ARCHITECTURE.md
│   │   ├── DATABASE_SCHEMA_EXPLAINED.md
│   │   └── API_DESIGN_PRINCIPLES.md
│   ├── sprints/                   # Sprint documentation
│   │   └── sprint-00-foundation/
│   │       ├── completion.md
│   │       └── PHASE_0_COMPLETE.md
│   └── README.md                  # Documentation overview
│
├── .gitignore                      # Files to ignore in Git
├── .git/                          # Git repository data
├── README.md                       # Project overview
├── CONTRIBUTING.md                 # Contribution guidelines
├── CHANGELOG.md                    # Version history
└── LICENSE                         # MIT License
```

---

## 📂 Understanding Each Directory

### 1. **backend/** - Django REST API

**Purpose:** Handle business logic, database, and API endpoints

**Key Files:**
- `manage.py`: Run Django commands (`python manage.py runserver`)
- `config/settings.py`: Database, JWT, CORS configuration
- `config/urls.py`: API route definitions
- `venv/`: Virtual environment (isolated Python packages)

**NOT in Git:**
- `venv/` (too large, can be recreated)
- `.env` (sensitive credentials)
- `__pycache__/` (generated files)

### 2. **frontend/** - React Application

**Purpose:** User interface for patients and doctors

**Key Files:**
- `src/main.jsx`: Application entry point
- `src/App.jsx`: Main React component
- `package.json`: npm dependencies and scripts
- `vite.config.js`: Build tool configuration

**NOT in Git:**
- `node_modules/` (too large, can be recreated with `npm install`)
- `dist/` (build output)

### 3. **ai-service/** - FastAPI ML Service

**Purpose:** AI/ML features (symptom analysis, recommendations)

**Key Files:**
- `main.py`: FastAPI application
- `venv/`: Virtual environment
- `requirements.txt`: ML libraries (scikit-learn, spaCy, etc.)

**Will Add Later (Sprint 4):**
- `models/`: ML model files
- `utils/`: Helper functions
- `routes/`: API endpoints

### 4. **docs/** - Documentation

**Purpose:** Keep all project documentation organized

**Subfolders:**
- `learning/`: Learning materials for this project (NEW!)
- `adr/`: Architecture Decision Records
- `architecture/`: System design documents
- `sprints/`: Sprint-specific documentation

---

## 🔄 Separation of Concerns

Each service has a **specific responsibility**:

| Service | Responsibility | Technology | Port |
|---------|---------------|------------|------|
| **Backend** | Business logic, database, APIs | Django REST | 8000 |
| **Frontend** | User interface, user experience | React + Vite | 5173 |
| **AI Service** | Machine learning, NLP | FastAPI | 8001 |

**Communication:**
```
Frontend (5173) 
    ↓ HTTP requests
Backend (8000)
    ↓ HTTP requests
AI Service (8001)
```

---

## 📝 File Organization Rules

### Where Should I Put This File?

| File Type | Location | Example |
|-----------|----------|---------|
| Django model | `backend/app_name/models.py` | User model |
| Django API view | `backend/app_name/views.py` | Login endpoint |
| React component | `frontend/src/components/` | LoginForm.jsx |
| API service (React) | `frontend/src/services/` | authService.js |
| ML model | `ai-service/models/` | symptom_analyzer.py |
| Documentation | `docs/` | Architecture docs |
| Learning materials | `docs/learning/` | This file! |
| Sprint docs | `docs/sprints/sprint-XX/` | Sprint plans |

### General Rules:

1. **Backend:** Django app per feature (`users/`, `appointments/`)
2. **Frontend:** Component-based structure
3. **AI Service:** Flat structure initially (will organize in Sprint 4)
4. **Docs:** Organized by type (ADRs, architecture, sprints, learning)

---

## 🛠️ Configuration Files

### Environment Variables (.env)

**Why?**
- Store sensitive data (database passwords, API keys)
- Different values per environment (dev, production)
- NOT committed to Git (security!)

**We Have:**
- `backend/.env.example` (template to copy)
- `frontend/.env.example`
- `ai-service/.env.example`

**Usage:**
```bash
# Copy example to create actual .env
cp backend/.env.example backend/.env
# Edit with your actual values
```

### Requirements Files

**Python (backend, ai-service):**
- `requirements.txt`: Production dependencies
- `requirements-dev.txt`: Development tools (pytest, black, flake8)

**Node.js (frontend):**
- `package.json`: All dependencies
- `package-lock.json`: Locked versions

---

## ✅ What We Did

### Phase 0 Structure Created:

1. ✅ Backend with Django project initialized
2. ✅ Frontend with React + Vite (you created)
3. ✅ AI Service with FastAPI basic structure
4. ✅ Docs folder with ADRs and architecture
5. ✅ Learning folder (just created!)
6. ✅ Proper .gitignore
7. ✅ README files for each service

### What We DIDN'T Create (Agile!):

❌ Django apps (will create per sprint)
❌ React components (will create per sprint)
❌ ML models (Sprint 4)
❌ Detailed implementations

---

## 🎓 Quiz Yourself

1. What is a monorepo?
2. Why don't we commit `venv/` or `node_modules/`?
3. Which service runs on port 8000?
4. Where do we put learning materials?
5. What's the purpose of `.env.example`?

**Answers:**
1. One repository containing multiple projects
2. Too large, can be recreated from requirements files
3. Backend (Django)
4. `docs/learning/`
5. Template for environment variables (show structure without exposing secrets)

---

## 📚 Further Reading

- [Monorepo vs Multi-Repo](https://www.atlassian.com/git/tutorials/monorepos)
- [12-Factor App](https://12factor.net/) (Best practices)
- [Django Project Structure](https://docs.djangoproject.com/en/4.2/intro/tutorial01/)

---

## ✅ Completion Checklist

- [ ] Understand monorepo concept
- [ ] Know our complete project structure
- [ ] Understand separation of concerns
- [ ] Know where to put different file types
- [ ] Understand why we use .env files

---

**Previous:** [02 - Git & GitHub Workflow](./02-git-github-workflow.md)  
**Next:** [04 - Virtual Environments](./04-virtual-environments.md)
