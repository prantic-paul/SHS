# Database Schema - Initial Design

**Status:** Sprint 0 - High-Level Blueprint  
**Last Updated:** December 19, 2025  
**Note:** This is an initial blueprint showing core entities. Detailed field definitions will be added per sprint.

---

## 🎯 Purpose

This document provides a **simplified, initial database design** for the Smart Health Synchronizer. It shows the main entities and their relationships, WITHOUT going into detailed implementation (field types, constraints, indexes, etc.).

**Agile Approach:**
- Sprint 0: Define core entities and relationships (THIS DOCUMENT)
- Sprint 1+: Add detailed field definitions per feature

---

## 📊 Entity Relationship Diagram (Simple)

```
                    ┌──────────┐
                    │   User   │ (Base table - all users)
                    │──────────│
                    │ id       │
                    │ email    │
                    │ password │
                    │ type     │ ('patient' or 'doctor')
                    └────┬─────┘
                         │
                ┌────────┴────────┐
                │                 │
                ▼                 ▼
        ┌──────────────┐   ┌──────────────┐
        │   Patient    │   │    Doctor    │
        │──────────────│   │──────────────│
        │ id           │   │ id           │
        │ user_id (FK) │   │ user_id (FK) │
        │ blood_group  │   │ specialization │
        │ date_of_birth│   │ license_number │
        └──────┬───────┘   └───────┬──────┘
               │                   │
               │                   │
               └───────┬───────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Appointment    │
              │─────────────────│
              │ id              │
              │ patient_id (FK) │
              │ doctor_id (FK)  │
              │ date_time       │
              │ status          │
              └────┬────────────┘
                   │
                   ▼
          ┌─────────────────────┐
          │   Prescription      │
          │─────────────────────│
          │ id                  │
          │ appointment_id (FK) │
          │ medicines           │
          │ instructions        │
          └─────────────────────┘


        ┌──────────────────┐              ┌────────────────┐
        │  Health Record   │              │     Blog       │
        │──────────────────│              │────────────────│
        │ id               │              │ id             │
        │ patient_id (FK)  │              │ author_id (FK) │
        │ record_type      │              │ title          │
        │ data             │              │ content        │
        │ date             │              │ created_at     │
        └──────────────────┘              └────────┬───────┘
                                                   │
                                                   ▼
                                          ┌────────────────┐
                                          │  Blog Comment  │
                                          │────────────────│
                                          │ id             │
                                          │ blog_id (FK)   │
                                          │ user_id (FK)   │
                                          │ comment        │
                                          └────────────────┘
```

---

## 📋 Core Entities (Tables)

### 1. **User** (Base table for all users)
**Purpose:** Store common information for all users (patients AND doctors)

**Key Fields (minimal):**
- `id` - Unique identifier
- `email` - Login credential
- `password` - Hashed password
- `type` - User type ('patient' or 'doctor')
- `first_name`, `last_name` - Basic info
- `is_active` - Account status

**Why?** 
- Both patients and doctors need to login
- Common fields shared between both user types
- Extensible design (can add 'admin' later)

---

### 2. **Patient** (Patient-specific information)
**Purpose:** Store information specific to patients only

**Key Fields (minimal):**
- `id` - Unique identifier
- `user_id` - Links to User table (ONE patient = ONE user)
- `blood_group` - Medical info
- `date_of_birth` - Age calculation
- Additional medical history (to be detailed in Sprint)

**Relationship:** 
- One-to-One with User
- Only created when user type is 'patient'

---

### 3. **Doctor** (Doctor-specific information)
**Purpose:** Store information specific to doctors only

**Key Fields (minimal):**
- `id` - Unique identifier
- `user_id` - Links to User table (ONE doctor = ONE user)
- `specialization` - e.g., Cardiologist, Neurologist
- `license_number` - Professional credential
- `years_of_experience` - Expertise indicator
- `verification_status` - Admin approval status

**Relationship:**
- One-to-One with User
- Only created when user type is 'doctor'

---

### 4. **Appointment** (Booking system)
**Purpose:** Manage appointments between patients and doctors

**Key Fields (minimal):**
- `id` - Unique identifier
- `patient_id` - Which patient? (Foreign Key → Patient)
- `doctor_id` - Which doctor? (Foreign Key → Doctor)
- `date_time` - When is the appointment?
- `status` - 'pending', 'confirmed', 'completed', 'cancelled'
- `reason` - Why patient needs appointment

**Relationships:**
- Many-to-One with Patient (one patient, many appointments)
- Many-to-One with Doctor (one doctor, many appointments)

---

### 5. **Prescription** (Medical prescriptions)
**Purpose:** Store prescriptions given by doctors after appointments

**Key Fields (minimal):**
- `id` - Unique identifier
- `appointment_id` - Which appointment? (Foreign Key → Appointment)
- `medicines` - List of prescribed medicines
- `instructions` - How to take medicines
- `created_at` - When was it prescribed?

**Relationship:**
- One-to-One with Appointment (one appointment = one prescription)

---

### 6. **Health Record** (Patient medical history)
**Purpose:** Store patient health records, reports, test results

**Key Fields (minimal):**
- `id` - Unique identifier
- `patient_id` - Which patient? (Foreign Key → Patient)
- `record_type` - 'test_result', 'diagnosis', 'report'
- `title` - Brief description
- `data` - Actual record data (JSON format)
- `file` - Uploaded file (PDF, image)
- `date` - Record date

**Relationship:**
- Many-to-One with Patient (one patient, many health records)

---

### 7. **Blog** (Health articles by doctors)
**Purpose:** Doctors can write health-related blog posts

**Key Fields (minimal):**
- `id` - Unique identifier
- `author_id` - Which doctor wrote this? (Foreign Key → Doctor)
- `title` - Blog title
- `content` - Blog content (rich text)
- `category` - Health topic category
- `published_at` - Publication date

**Relationship:**
- Many-to-One with Doctor (one doctor, many blogs)

---

### 8. **Blog Comment** (Comments on blog posts)
**Purpose:** Users can comment on blog posts

**Key Fields (minimal):**
- `id` - Unique identifier
- `blog_id` - Which blog? (Foreign Key → Blog)
- `user_id` - Who commented? (Foreign Key → User)
- `comment` - Comment text
- `created_at` - Comment date

**Relationships:**
- Many-to-One with Blog (one blog, many comments)
- Many-to-One with User (one user, many comments)

---

## 🔗 Relationship Types Explained

### 1. One-to-One
**Example:** User ↔ Doctor

```
One User = Exactly One Doctor Profile
One Doctor Profile = Exactly One User
```

**Why?** A doctor account has one user login, and one user of type 'doctor' has one doctor profile.

---

### 2. One-to-Many (Most common)
**Example:** Doctor → Appointments

```
One Doctor = Many Appointments
One Appointment = One Doctor
```

**Why?** A doctor can have multiple appointments with different patients, but each appointment is with only one doctor.

---

### 3. Many-to-Many (Future consideration)
**Example:** Patient ↔ Doctor (through Appointments)

```
One Patient can see Many Doctors
One Doctor can see Many Patients
```

**Implementation:** Through the Appointment table (junction table)

---

## 🎯 Design Decisions

### 1. Why separate User, Patient, and Doctor tables?

**Option A (Single table):**
```
User table with ALL fields:
- email, password (common)
- specialization (doctors only) ← NULL for patients
- blood_group (patients only) ← NULL for doctors
```

**Problems:**
- Many NULL fields
- Confusing (which fields are for whom?)
- Hard to maintain

**Option B (Separate tables) ✅ CHOSEN:**
```
User: Common fields for all
Patient: Patient-specific fields only
Doctor: Doctor-specific fields only
```

**Benefits:**
- Clean data structure
- No NULL pollution
- Easy to extend
- Clear responsibilities

---

### 2. Why use Foreign Keys?

**Foreign Key** = Link between tables

**Example:**
```
Appointment table:
- patient_id = 5 → Links to Patient with id=5
- doctor_id = 3 → Links to Doctor with id=3
```

**Benefits:**
- Data integrity (can't create appointment for non-existent patient)
- Easy queries (get all appointments for a patient)
- Automatic cascading (if doctor deleted, what happens to appointments?)

---

## 📝 What's NOT in This Document (By Design)

Following Agile principles, we're NOT defining:

❌ **Detailed field types** (VARCHAR(50) vs TEXT)  
❌ **Constraints** (NOT NULL, UNIQUE, CHECK)  
❌ **Indexes** (Performance optimization)  
❌ **Triggers** (Automatic actions)  
❌ **Views** (Derived tables)  
❌ **Sample data** (Test records)  

**Why?** 
- These are implementation details
- Will be defined per sprint when implementing
- Keeps initial design simple and understandable

---

## 🚀 Next Steps

### Current Status (Sprint 0):
✅ Core entities identified  
✅ Relationships defined  
✅ High-level structure understood  

### What's Next:
1. **Review this design** - Make sure you understand entities and relationships
2. **Ask questions** - If anything is unclear
3. **Move to Sprint 1** - Define detailed User model with all fields
4. **Implement incrementally** - One model at a time

---

## 🔗 Related Documents

- [System Architecture](./SYSTEM_ARCHITECTURE.md) - How database fits in overall system
- [API Design Principles](./API_DESIGN_PRINCIPLES.md) - How database data is accessed
- [Learning: Database Design Basics](../learning/07-database-design-basics.md) - Learn database concepts

---

## ⚠️ Important Notes

1. **This is a BLUEPRINT:** Like architectural drawings, not construction
2. **Will evolve:** As we build features, we'll add/modify
3. **Sprint-by-sprint:** Detailed definitions come when implementing
4. **Focus on concepts:** Understand relationships, not memorize fields

---

**Last Updated:** December 19, 2025  
**Next Review:** Sprint 1 - When implementing User authentication
