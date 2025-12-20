# Exercise: Create Initial Architecture & Database Schema

**Your Task:** Design the initial (Sprint 0) architecture and database schema for Smart Health Synchronizer

**Remember:** HIGH-LEVEL ONLY! Concepts, not implementation details!

---

## 🎯 Part 1: High-Level Architecture

### Instructions:

You need to draw the system components and how they connect.

### Questions to Answer:

1. **What are the main components?**
   - Hint: Frontend? Backend? Database? AI Service?

2. **What technology for each component?**
   - Frontend: ? (You already have React + Vite)
   - Backend: ? (You have Django REST)
   - Database: ? (We chose PostgreSQL)
   - AI Service: ? (We have FastAPI)

3. **How do they communicate?**
   - Frontend ↔ Backend: ? (HTTP/REST API)
   - Backend ↔ Database: ? (SQL queries)
   - Backend ↔ AI Service: ? (HTTP/REST API)

4. **What ports do they run on?**
   - Frontend: ?
   - Backend: ?
   - AI Service: ?
   - Database: ?

### Your Task:

Open `docs/architecture/SYSTEM_ARCHITECTURE.md` and:

1. **Check if the current design matches your understanding**
   - Is it high-level enough? (no implementation details)
   - Does it show all main components?
   - Are relationships clear?

2. **Modify if needed:**
   - Too detailed? → Simplify
   - Missing components? → Add them
   - Unclear? → Clarify

### Template to Follow:

```markdown
## High-Level Architecture

[Draw a simple box diagram]

Frontend (React)
    ↓ (HTTP/JSON)
Backend (Django)
    ↓ (SQL)
Database (PostgreSQL)

Backend (Django)
    ↓ (HTTP/JSON)
AI Service (FastAPI)

Explain:
- Frontend: What it does (user interface)
- Backend: What it does (business logic)
- Database: What it does (data storage)
- AI Service: What it does (ML features)
```

---

## 🎯 Part 2: Initial Database Schema

### Instructions:

Identify the CORE ENTITIES (tables) and their RELATIONSHIPS.

### Questions to Guide You:

Think about the problem: Healthcare platform for Bangladesh

**Who uses the system?**
- Patients?
- Doctors?
- Admins?

**What actions do they perform?**
- Patients: Book appointments, view health records
- Doctors: Accept appointments, write prescriptions

**What "things" (entities) do we need to track?**
- Users?
- Doctors?
- Patients?
- Appointments?
- What else?

### Exercise 1: Identify Entities

List the MAIN entities (tables) you think we need:

```
My Entities List:
1. User (because _______)
2. Doctor (because _______)
3. Patient (because _______)
4. _______ (because _______)
5. _______ (because _______)
6. _______ (because _______)
```

**Hint:** Think about:
- Who are the actors? (User, Doctor, Patient)
- What are the main actions? (Appointment, Prescription)
- What content exists? (Blog posts, Health records)

### Exercise 2: Identify Relationships

How do these entities connect?

```
Example:
User → Doctor (one-to-one)
Because: One doctor account has one user login

User → Patient (one-to-one)
Because: One patient account has one user login

Now you continue:
Doctor → Appointment (__________)
Because: ____________________

Patient → Appointment (__________)
Because: ____________________

Appointment → Prescription (__________)
Because: ____________________
```

**Relationship Types:**
- **One-to-One:** One A has exactly one B
  - Example: One user has one doctor profile
- **One-to-Many:** One A has many B
  - Example: One doctor has many appointments
- **Many-to-Many:** Many A have many B
  - Example: Many patients can see many doctors (through appointments)

### Exercise 3: Draw Simple Diagram

Draw boxes and arrows:

```
        User
         |
    ┌────┴────┐
    ↓         ↓
  Patient   Doctor
    |         |
    └─→ Appointment ←┘
            |
            ↓
      Prescription

What else?
Add more entities and connections!
```

### Your Task:

Open `docs/architecture/DATABASE_SCHEMA_EXPLAINED.md` and:

1. **Review current design:**
   - Are all necessary entities there?
   - Are relationships clear?
   - Is it high-level (no field types yet)?

2. **Update if needed:**
   - Missing entities? → Add them (with reasoning WHY)
   - Wrong relationships? → Fix them
   - Too detailed? → Remove implementation details

### What to Include (Sprint 0):

✅ **DO Include:**
- Entity names (User, Doctor, Patient...)
- Relationships (one-to-one, one-to-many)
- Brief description of each entity
- WHY we need each entity
- Simple ER diagram

❌ **DON'T Include (Yet):**
- Field names (first_name, email)
- Field types (VARCHAR(255), INTEGER)
- Constraints (NOT NULL, UNIQUE)
- Indexes
- Sample data
- SQL code

### Template:

```markdown
## Core Entities

### 1. User
**Purpose:** Store login information for all users

**Why?** Both patients and doctors need to login

**Relationships:**
- One-to-One with Patient
- One-to-One with Doctor

### 2. Patient
**Purpose:** Store patient-specific information

**Why?** Patients have different data than doctors (blood group, age, etc.)

**Relationships:**
- One-to-One with User
- One-to-Many with Appointment

Continue for each entity...
```

---

## 🎯 Part 3: Validate Your Design

### Sanity Check Questions:

Ask yourself:

1. **Can users register and login?**
   - Do I have a User entity? ✓
   - Can I distinguish patients from doctors? ✓

2. **Can patients book appointments?**
   - Do I have Patient entity? ✓
   - Do I have Doctor entity? ✓
   - Do I have Appointment entity? ✓
   - Are they connected properly? ✓

3. **Can doctors write prescriptions?**
   - Do I have Prescription entity? ✓
   - Is it connected to Appointment? ✓

4. **Can patients view their health records?**
   - Do I have HealthRecord entity? ✓
   - Is it connected to Patient? ✓

5. **Can doctors write blog posts?**
   - Do I have Blog entity? ✓
   - Is it connected to Doctor? ✓

If you can answer YES to all, you have a good initial design!

---

## 🎯 Part 4: Document Your Decisions

For each major decision, write WHY:

```markdown
## Design Decisions

### Why separate User, Patient, and Doctor tables?

Option A: Single User table with all fields
- Pros: Simpler
- Cons: Many NULL fields, confusing

Option B: Separate tables (CHOSEN)
- Pros: Clean, no NULL pollution, clear responsibilities
- Cons: More tables

Decision: Option B because clean data structure is more important than fewer tables.

### Why One-to-One between User and Doctor?

Because each doctor has exactly one login account, and each doctor account has one user.

Continue documenting your decisions...
```

---

## ✅ What You Should Do Now:

### Step 1: Review Current Docs (30 minutes)

1. Open `docs/architecture/SYSTEM_ARCHITECTURE.md`
   - Read it carefully
   - Is it high-level? (should be ~300 lines)
   - Understand each section

2. Open `docs/architecture/DATABASE_SCHEMA_EXPLAINED.md`
   - Read it carefully
   - Understand entities and relationships
   - Is it high-level? (should be ~300 lines)

### Step 2: Think About It (30 minutes)

1. Do the exercises above
2. List entities you think are needed
3. Draw relationships
4. Compare with current docs

### Step 3: Ask Questions (15 minutes)

What's unclear?
- Architecture components?
- Database entities?
- Relationships?
- Why we designed it this way?

### Step 4: Update (If Needed) (1 hour)

If you think something should change:
1. Tell me what and why
2. I'll guide you to make the change
3. You update the documents

---

## 🚫 Common Mistakes to Avoid:

### Mistake 1: Too Detailed in Sprint 0
```
❌ Wrong (Sprint 0):
User Table:
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- email: VARCHAR(255) UNIQUE NOT NULL
- password: VARCHAR(255) NOT NULL
... (10 more fields with exact types)

✅ Right (Sprint 0):
User Entity:
- Stores login information for all users
- Will have email, password, name fields
- Relationships: one-to-one with Patient/Doctor
```

### Mistake 2: Missing Core Entities
```
❌ Wrong:
Only have User and Appointment

Problem: How do we differentiate doctors from patients?

✅ Right:
Have User, Patient, Doctor, Appointment
Clear separation of concerns
```

### Mistake 3: Wrong Relationships
```
❌ Wrong:
Patient → Doctor (one-to-one)

Problem: A patient can only see one doctor ever?

✅ Right:
Patient → Appointment ← Doctor (many-to-many through Appointment)
Patient can see many doctors, doctor can see many patients
```

---

## 📝 Your Action Items:

1. [ ] Read `SYSTEM_ARCHITECTURE.md` carefully
2. [ ] Read `DATABASE_SCHEMA_EXPLAINED.md` carefully
3. [ ] Do Exercise 1: List entities
4. [ ] Do Exercise 2: Identify relationships
5. [ ] Do Exercise 3: Draw diagram
6. [ ] Compare your answers with current docs
7. [ ] Ask me questions about anything unclear
8. [ ] Tell me if you want to change anything

---

## 💬 Questions to Ask Me:

Feel free to ask:

1. "Why do we need entity X?"
2. "Should we have entity Y?"
3. "Is this relationship correct?"
4. "Is the current architecture too detailed?"
5. "Should we add/remove something?"

---

**Ready?** 

Start by reading the two architecture documents, then come back with your thoughts!

What do you think about the current design? Does it make sense? Should we change anything?
