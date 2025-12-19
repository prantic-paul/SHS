# Agile Development Process - Complete Flow

**Created:** December 20, 2025  
**Purpose:** Clarify the EXACT step-by-step Agile process from start to finish

---

## 🎯 The Big Picture

```
Phase 0 (Sprint 0): Foundation
    ↓
Product Backlog Creation
    ↓
Sprint 1 → Sprint 2 → Sprint 3 → ... → Sprint N
    ↓
Product Complete
```

---

## 📋 Detailed Agile Flow

### **PHASE 0: SPRINT 0 (Foundation Setup)** 

**When:** Before ANY coding starts  
**Duration:** 1-2 weeks  
**Goal:** Set up foundation

#### Step 1: Define the Problem
```
Question: What problem are we solving?

Our Answer:
"Bangladesh lacks an integrated healthcare platform.
Patients struggle to find doctors, book appointments,
and manage health records efficiently."
```

✅ **Output:** Problem statement documented

---

#### Step 2: Identify User Base
```
Question: Who will use this system?

Our Answer:
- Primary Users: Patients (general public)
- Secondary Users: Doctors (healthcare providers)
- Future: Admins, Pharmacies
```

✅ **Output:** User types identified

---

#### Step 3: High-Level Architecture
```
Question: What's the overall system design?

Our Answer:
Frontend (React) ↔ Backend (Django) ↔ Database (PostgreSQL)
                         ↕
                  AI Service (FastAPI)
```

**What to define:**
- System components
- Technology stack
- Communication patterns
- Security approach (high-level)

**What NOT to define:**
- ❌ Detailed API endpoints
- ❌ Exact database fields
- ❌ Implementation details
- ❌ All features at once

✅ **Output:** `SYSTEM_ARCHITECTURE.md` (high-level, ~200-300 lines)

---

#### Step 4: Initial Database Schema
```
Question: What are the core entities?

Our Answer:
- User (base for all users)
- Patient (patient-specific)
- Doctor (doctor-specific)
- Appointment (booking system)
- Prescription (medical records)
- Health Record (patient history)
- Blog (health articles)
```

**What to define:**
- Core entities (tables)
- Relationships between entities
- Why we designed it this way

**What NOT to define:**
- ❌ Exact field types (VARCHAR, INT, etc.)
- ❌ Constraints (NOT NULL, UNIQUE)
- ❌ Indexes for performance
- ❌ Sample data

✅ **Output:** `DATABASE_SCHEMA_EXPLAINED.md` (blueprint, ~200-300 lines)

---

#### Step 5: Divide Project into Sprints
```
Question: How do we break down the project?

Process:
1. List ALL features you want to build
2. Group related features together
3. Prioritize (what's needed first?)
4. Create sprint plan
```

**Our Sprint Plan:**

| Sprint | Goal | Features | Duration |
|--------|------|----------|----------|
| Sprint 0 | Foundation | Setup, Architecture, Docs | 1-2 weeks |
| Sprint 1 | Authentication | User registration, Login, JWT | 1-2 weeks |
| Sprint 2 | Doctor Profiles | Doctor registration, Profile management | 1-2 weeks |
| Sprint 3 | Appointments | Booking system, Calendar | 2-3 weeks |
| Sprint 4 | AI Integration | Symptom analysis, Recommendations | 2-3 weeks |
| Sprint 5 | Blog System | Blog posts, Comments | 1-2 weeks |
| Sprint 6 | Polish | Testing, Bug fixes, Optimization | 1-2 weeks |

✅ **Output:** Sprint breakdown document

---

#### Step 6: Create Product Backlog
```
Product Backlog = Complete list of ALL features to build

Example:
1. User registration
2. User login
3. Password reset
4. Doctor profile creation
5. Patient profile creation
6. Search doctors
7. Book appointment
8. Cancel appointment
... (50+ items)
```

**Organize by:**
- Priority (Must have → Nice to have)
- Dependencies (Login before Profile)
- Business value (Core features first)

✅ **Output:** Product backlog (list of all features)

---

### **EACH SPRINT: REPEATING CYCLE**

Now, for EACH sprint (Sprint 1, 2, 3...), follow this cycle:

---

## 🔁 Single Sprint Flow (2-4 weeks)

### **Step 1: Sprint Planning** (1 day)

**Input:** Product backlog  
**Output:** Sprint backlog

**Process:**
```
1. Review product backlog
2. Select features for THIS sprint
3. Write user stories for selected features
4. Define acceptance criteria
5. Estimate effort (hours/days)
6. Commit to sprint goal
```

**Example (Sprint 1 - Authentication):**

**User Story 1:**
```
As a patient
I want to register an account
So that I can access the platform

Acceptance Criteria:
✓ User can enter email, password, name
✓ Email must be unique
✓ Password must be 8+ characters
✓ User receives confirmation message
✓ User is redirected to login page
```

**User Story 2:**
```
As a patient
I want to login with my credentials
So that I can access my account

Acceptance Criteria:
✓ User can enter email and password
✓ System validates credentials
✓ User receives JWT token on success
✓ User is redirected to dashboard
✓ Error message shown for invalid credentials
```

✅ **Output:** 
- Sprint backlog (selected features)
- User stories with acceptance criteria

---

### **Step 2: Technical Design Document (TDD)** (1-2 days)

**Purpose:** Plan HOW to implement the sprint features

**What to include:**

#### A. Feature Scope
```
In Scope:
✓ User registration
✓ User login
✓ JWT token generation

Out of Scope:
✗ Password reset (Sprint 2)
✗ Social login (Future)
✗ Two-factor authentication (Future)
```

#### B. Database Design (Detailed)
```
User Model:
- id: Integer, Primary Key, Auto-increment
- email: VARCHAR(255), UNIQUE, NOT NULL
- password: VARCHAR(255), NOT NULL (hashed)
- first_name: VARCHAR(100), NOT NULL
- last_name: VARCHAR(100), NOT NULL
- user_type: ENUM('patient', 'doctor'), NOT NULL
- is_active: BOOLEAN, DEFAULT TRUE
- created_at: TIMESTAMP, DEFAULT NOW()
- updated_at: TIMESTAMP, AUTO UPDATE

Indexes:
- INDEX on email (for fast login lookup)
```

#### C. API Endpoints (Detailed)
```
POST /api/auth/register/
Request:
{
  "email": "user@example.com",
  "password": "securepass123",
  "first_name": "John",
  "last_name": "Doe",
  "user_type": "patient"
}
Response (201 Created):
{
  "message": "User registered successfully",
  "user_id": 1
}

POST /api/auth/login/
Request:
{
  "email": "user@example.com",
  "password": "securepass123"
}
Response (200 OK):
{
  "access": "eyJ0eXAiOiJKV1QiLCJh...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJh..."
}
```

#### D. Implementation Plan
```
1. Create User model in Django
2. Create serializers (validation)
3. Create registration view
4. Create login view
5. Configure JWT settings
6. Create React registration page
7. Create React login page
8. Connect React to API
9. Test all flows
```

✅ **Output:** Technical Design Document (TDD) for the sprint

---

### **Step 3: Development** (1-2 weeks)

**Daily workflow:**

#### Morning: Daily Standup (15 minutes)
```
Each team member answers:
1. What did I do yesterday?
2. What will I do today?
3. Any blockers?

Example:
"Yesterday: Created User model
Today: Implement registration API
Blockers: None"
```

#### During the Day: Code!
```
1. Pick a task from sprint backlog
2. Create feature branch
   git checkout -b feature/sprint-1-user-registration
3. Write code
4. Write tests
5. Test locally
6. Commit with proper message
   git commit -m "feat: add user registration endpoint"
7. Push to GitHub
8. Create Pull Request
9. Code review
10. Merge to develop branch
```

**Development Order (for Sprint 1 example):**

**Day 1-2: Backend - User Model**
```bash
cd backend
python manage.py startapp users
# Create User model
# Run migrations
```

**Day 3-4: Backend - Registration API**
```python
# Create serializers
# Create registration view
# Add URL routing
# Test with Postman
```

**Day 5-6: Backend - Login API & JWT**
```python
# Configure JWT settings
# Create login view
# Test authentication flow
```

**Day 7-8: Frontend - Registration Page**
```jsx
// Create RegisterForm component
// Add form validation
// Connect to backend API
// Test registration flow
```

**Day 9-10: Frontend - Login Page**
```jsx
// Create LoginForm component
// Handle JWT token storage
// Implement protected routes
// Test login flow
```

**Day 11-12: Integration & Testing**
```
- End-to-end testing
- Fix bugs
- Ensure all acceptance criteria met
```

✅ **Output:** Working features with code

---

### **Step 4: Testing** (Continuous + 1-2 days at end)

**Types of Testing:**

#### A. Unit Tests
```python
# Test individual functions
def test_user_registration():
    response = client.post('/api/auth/register/', data={...})
    assert response.status_code == 201
```

#### B. Integration Tests
```python
# Test multiple components together
def test_registration_and_login_flow():
    # Register user
    # Login with credentials
    # Verify token received
```

#### C. Manual Testing
```
- Test in browser
- Try different scenarios
- Test error cases
- Verify all acceptance criteria
```

✅ **Output:** Tested, working features

---

### **Step 5: Sprint Review** (2-4 hours)

**Purpose:** Demo what was built

**Attendees:** Team + Stakeholders (in real projects)

**Process:**
```
1. Demo each completed feature
2. Show working software (not slides!)
3. Gather feedback
4. Update product backlog based on feedback
```

**Example:**
```
Demo:
1. "Here's the registration page" (show in browser)
2. "User enters details, clicks register"
3. "System validates and creates account"
4. "User can now login with credentials"
5. "JWT token is generated and stored"
6. "User is redirected to dashboard"

Feedback:
- "Can we add password strength indicator?" 
  → Add to backlog for future sprint
- "Great! Exactly what we needed!"
```

✅ **Output:** 
- Demo completed
- Feedback collected
- Backlog updated

---

### **Step 6: Sprint Retrospective** (1-2 hours)

**Purpose:** Reflect and improve

**Questions:**
```
1. What went well?
   "Good collaboration, clear requirements"

2. What didn't go well?
   "Testing took longer than expected"

3. What can we improve?
   "Write tests while coding, not at end"

4. Action items for next sprint?
   "Set up automated testing early"
```

✅ **Output:** Action items for improvement

---

### **Step 7: Prepare for Next Sprint** (Few hours)

```
1. Mark completed items in backlog
2. Update sprint progress
3. Document lessons learned
4. Merge develop to main (if ready for release)
5. Plan next sprint
```

---

## 🔁 Repeat for Each Sprint

```
Sprint 2: Doctor Profiles
- Sprint Planning → User Stories → TDD → Development → Testing → Review → Retrospective

Sprint 3: Appointments
- Sprint Planning → User Stories → TDD → Development → Testing → Review → Retrospective

Sprint 4: AI Integration
- Sprint Planning → User Stories → TDD → Development → Testing → Review → Retrospective

... and so on
```

---

## 📊 Visual Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    SPRINT 0 (Foundation)                     │
│  1. Define Problem                                           │
│  2. Identify Users                                           │
│  3. High-Level Architecture                                  │
│  4. Initial Database Schema                                  │
│  5. Divide into Sprints                                      │
│  6. Create Product Backlog                                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    START SPRINT CYCLE                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
    ┌──────────────────────┴──────────────────────┐
    │                                              │
    ▼                                              │
┌─────────────────────────────────────┐           │
│  📋 Sprint Planning (1 day)         │           │
│  - Select features                  │           │
│  - Write user stories               │           │
│  - Define acceptance criteria       │           │
└────────────────┬────────────────────┘           │
                 │                                 │
                 ▼                                 │
┌─────────────────────────────────────┐           │
│  📝 Technical Design (1-2 days)     │           │
│  - Detailed database design         │           │
│  - API endpoint specifications      │           │
│  - Implementation plan              │           │
└────────────────┬────────────────────┘           │
                 │                                 │
                 ▼                                 │
┌─────────────────────────────────────┐           │
│  💻 Development (1-2 weeks)         │           │
│  - Daily standups                   │           │
│  - Write code                       │           │
│  - Write tests                      │           │
│  - Code reviews                     │           │
└────────────────┬────────────────────┘           │
                 │                                 │
                 ▼                                 │
┌─────────────────────────────────────┐           │
│  🧪 Testing (Continuous + End)      │           │
│  - Unit tests                       │           │
│  - Integration tests                │           │
│  - Manual testing                   │           │
└────────────────┬────────────────────┘           │
                 │                                 │
                 ▼                                 │
┌─────────────────────────────────────┐           │
│  🎬 Sprint Review (2-4 hours)       │           │
│  - Demo working features            │           │
│  - Gather feedback                  │           │
│  - Update backlog                   │           │
└────────────────┬────────────────────┘           │
                 │                                 │
                 ▼                                 │
┌─────────────────────────────────────┐           │
│  🤔 Sprint Retrospective (1-2 hrs)  │           │
│  - What went well?                  │           │
│  - What to improve?                 │           │
│  - Action items                     │           │
└────────────────┬────────────────────┘           │
                 │                                 │
                 ▼                                 │
┌─────────────────────────────────────┐           │
│  🔄 Sprint Complete!                │           │
│  - Working features delivered       │           │
│  - Ready for next sprint            │           │
└────────────────┬────────────────────┘           │
                 │                                 │
                 └─────────────────────────────────┘
                           │
                           ▼
              All Sprints Complete?
                      /    \
                    NO      YES
                    /         \
                   /           \
          Next Sprint        🎉 PRODUCT COMPLETE!
```

---

## ✅ Key Clarifications

### 1. **When to Write User Stories?**
```
❌ NOT in Sprint 0
✅ At the START of each sprint (Sprint Planning)

Why? You don't know exact requirements until you're ready to build.
```

### 2. **When to Write TDD?**
```
✅ AFTER user stories, BEFORE coding
✅ At the start of each sprint, after Sprint Planning

Why? TDD = detailed plan for implementation.
```

### 3. **High-Level vs Detailed Design**
```
Sprint 0 (High-Level):
- "We'll have a User table"
- "Users can be patients or doctors"
- "Authentication will use JWT"

Sprint 1 TDD (Detailed):
- "User table: id (INT), email (VARCHAR(255) UNIQUE)..."
- "User model extends AbstractUser..."
- "POST /api/auth/register/ returns 201 with user_id..."
```

### 4. **What if Architecture Changes?**
```
✅ It's OKAY to change!
✅ Agile = flexibility
✅ Update architecture docs as you learn

Example:
Sprint 2: "We need a separate table for doctor availability"
→ Update DATABASE_SCHEMA_EXPLAINED.md
→ Document in ADR why we changed
```

---

## 📝 Our Current Status

```
✅ Sprint 0: ALMOST COMPLETE
   ✅ Problem defined
   ✅ Users identified (Patients, Doctors)
   ✅ High-level architecture created
   ✅ Initial database schema created
   ✅ Project divided into sprints
   ⏳ Product backlog (needs creation)

Next Steps:
1. Review architecture docs (if unclear, ask!)
2. Review database schema (if unclear, ask!)
3. Create product backlog (list all features)
4. Start Sprint 1 Planning
```

---

## 🎓 Summary

**Agile Flow = Sprint 0 + Repeating Sprint Cycle**

**Sprint 0:**
1. Define problem
2. Identify users
3. High-level architecture
4. Initial database schema
5. Divide into sprints
6. Create product backlog

**Each Sprint (1-3):**
1. Sprint Planning → User Stories + Acceptance Criteria
2. Technical Design → Detailed TDD
3. Development → Write code + tests
4. Testing → Verify everything works
5. Sprint Review → Demo and feedback
6. Retrospective → Reflect and improve
7. Repeat for next sprint

---

**Does this clarify the complete Agile flow?** 🚀

Any specific part you want me to explain further?
