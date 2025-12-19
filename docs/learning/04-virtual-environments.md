# 04 - Virtual Environments & Dependencies

**Status:** ✅ Completed  
**Time Required:** 1-2 hours  
**Phase:** Phase 0 - Foundation

---

## 🎯 Learning Objectives

1. Understand what virtual environments are
2. Know why we need them
3. Learn how to create and use them
4. Understand requirements files
5. Know dependency management best practices

---

## 📚 What is a Virtual Environment?

A **virtual environment** is an **isolated Python environment** for your project.

### The Problem Without Virtual Environments:

```
Global Python (system-wide):
├── Django 3.2
├── requests 2.25.0
└── numpy 1.19.0

Project A needs: Django 3.2 ✅
Project B needs: Django 4.2 ❌ CONFLICT!
```

**Problem:** Can't have two versions of the same package!

### The Solution: Virtual Environments

```
System Python
├── Project A (venv)
│   └── Django 3.2
└── Project B (venv)
    └── Django 4.2
```

Each project has its own isolated environment! 🎉

---

## 🏗️ How Virtual Environments Work

**Think of it like separate rooms:**

```
House (Your Computer)
├── Kitchen (Global Python) - shared by everyone
├── Room A (Project A venv) - Project A's private packages
└── Room B (Project B venv) - Project B's private packages
```

**Benefits:**
1. ✅ Different package versions per project
2. ✅ Clean, organized dependencies
3. ✅ Easy to recreate environment
4. ✅ No conflicts between projects
5. ✅ Team members have same setup

---

## 💻 Creating Virtual Environments

### Python (backend, ai-service)

```bash
# Create virtual environment
python3 -m venv venv

# Activate (Linux/Mac)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Your prompt changes:
(venv) username@computer:~/project$

# Deactivate
deactivate
```

### What We Did:

```bash
# Backend
cd /home/prantic/SHS/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# AI Service
cd /home/prantic/SHS/ai-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Node.js (frontend)

**Node.js doesn't use venv**, but has similar concept:

```bash
# node_modules/ is like a virtual environment
npm install  # Creates node_modules/
```

---

## 📦 Requirements Files

### Python: requirements.txt

**Purpose:** List all dependencies with versions

**Our backend/requirements.txt:**
```
Django==4.2.7
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.1
psycopg2-binary==2.9.9
django-cors-headers==4.3.1
python-decouple==3.8
drf-spectacular==0.27.0
```

**Creating requirements.txt:**
```bash
# Export current packages
pip freeze > requirements.txt

# Or manually write (better for clean dependencies)
```

**Installing from requirements.txt:**
```bash
pip install -r requirements.txt
```

### Development Dependencies

**requirements-dev.txt** for development tools:
```
pytest==7.4.3
pytest-django==4.7.0
black==23.12.0
flake8==6.1.0
pylint==3.0.3
```

**Why separate?**
- Production doesn't need testing/linting tools
- Keeps production environment lean

**Install both:**
```bash
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

### Node.js: package.json

**Frontend dependencies:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

**Installing:**
```bash
npm install  # Installs all dependencies
```

---

## ⚠️ Common Mistakes We Avoided

### Mistake 1: Installing Packages Globally

❌ **Wrong:**
```bash
# Without activating venv
pip install django
```

**Result:** Installs to system Python (messy, conflicts)

✅ **Correct:**
```bash
source venv/bin/activate  # Activate first!
pip install django
```

### Mistake 2: Committing Virtual Environments to Git

❌ **Wrong:**
```bash
git add venv/
git add node_modules/
```

**Result:** Repository becomes HUGE (100+ MB)

✅ **Correct:**
```
# .gitignore file
venv/
node_modules/
```

**Why?** Anyone can recreate with:
```bash
pip install -r requirements.txt  # or npm install
```

### Mistake 3: Not Pinning Versions

❌ **Wrong requirements.txt:**
```
Django
djangorestframework
```

**Problem:** Gets latest version (might break)

✅ **Correct:**
```
Django==4.2.7
djangorestframework==3.14.0
```

**Benefits:**
- Everyone has same versions
- Reproducible builds
- Prevents surprise breakages

---

## 🔄 Our Project Setup

### Backend Virtual Environment

**Location:** `/home/prantic/SHS/backend/venv/`

**Packages Installed:**
- Django 4.2.7
- Django REST Framework 3.14.0
- Simple JWT 5.3.1
- PostgreSQL driver
- CORS headers
- And dependencies...

**Total:** ~20 packages

### AI Service Virtual Environment

**Location:** `/home/prantic/SHS/ai-service/venv/`

**Packages Installed:**
- FastAPI 0.108.0
- uvicorn 0.25.0
- scikit-learn 1.3.2
- pandas 2.1.4
- numpy 1.26.2
- spaCy 3.7.2
- And dependencies...

**Total:** ~50 packages

### Frontend Dependencies

**Location:** `/home/prantic/SHS/frontend/node_modules/`

**Packages:** React, Vite, Tailwind, etc.

---

## 🛠️ Daily Workflow

### Working on Backend:

```bash
# 1. Navigate to backend
cd /home/prantic/SHS/backend

# 2. Activate virtual environment
source venv/bin/activate

# 3. Work (Django commands, pip install, etc.)
python manage.py runserver

# 4. Deactivate when done
deactivate
```

### Working on AI Service:

```bash
cd /home/prantic/SHS/ai-service
source venv/bin/activate
uvicorn main:app --reload
deactivate
```

### Working on Frontend:

```bash
cd /home/prantic/SHS/frontend
npm run dev
# No activation needed for npm
```

---

## 🎓 Quiz Yourself

1. What is a virtual environment?
2. Why don't we commit `venv/` to Git?
3. What's the difference between `requirements.txt` and `requirements-dev.txt`?
4. How do you activate a virtual environment?
5. Why do we pin package versions?

**Answers:**
1. Isolated Python environment for a project
2. Too large and can be recreated from requirements.txt
3. `requirements.txt` for production; `requirements-dev.txt` for development tools
4. `source venv/bin/activate`
5. To ensure everyone has the same versions (reproducibility)

---

## 📚 Further Reading

- [Python venv Documentation](https://docs.python.org/3/library/venv.html)
- [pip Requirements Files](https://pip.pypa.io/en/stable/reference/requirements-file-format/)
- [npm package.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)

---

## ✅ Completion Checklist

- [ ] Understand what virtual environments are
- [ ] Know how to create and activate venv
- [ ] Understand requirements.txt files
- [ ] Know why we don't commit venv/ to Git
- [ ] Can manage dependencies properly

---

**Previous:** [03 - Project Structure](./03-project-structure-monorepo.md)  
**Next:** [05 - Documentation-Driven Development](./05-documentation-driven-development.md)
