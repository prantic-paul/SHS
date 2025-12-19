# Database Schema Explained with Examples

## Table of Contents
- [Overview](#overview)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [Core Tables](#core-tables)
- [Relationships Explained](#relationships-explained)
- [Sample Data Examples](#sample-data-examples)
- [JSONB Fields Explained](#jsonb-fields-explained)
- [Common Queries](#common-queries)

---

## Overview

Our Smart Health Synchronizer database uses **PostgreSQL** and consists of 8 main tables:

1. **users_user** - All system users (patients and doctors)
2. **doctors_doctor** - Doctor-specific information
3. **patients_patient** - Patient-specific information
4. **appointments_appointment** - Appointment bookings
5. **prescriptions_prescription** - Medical prescriptions
6. **health_records_healthrecord** - Patient health records
7. **blogs_blog** - Blog posts by doctors
8. **blogs_blogcomment** - Comments on blog posts

---

## Entity Relationship Diagram (ER Diagram Explained)

```
┌─────────────────┐
│   users_user    │  (Base table for all users)
│─────────────────│
│ id (PK)         │
│ email           │
│ password        │
│ user_type       │  ('doctor' or 'patient')
│ first_name      │
│ last_name       │
│ is_active       │
│ created_at      │
└────────┬────────┘
         │
         │ OneToOne relationship
         │
    ┌────┴───────┐
    │            │
    ▼            ▼
┌──────────────────┐        ┌──────────────────┐
│ doctors_doctor   │        │ patients_patient │
│──────────────────│        │──────────────────│
│ id (PK)          │        │ id (PK)          │
│ user_id (FK)     │        │ user_id (FK)     │
│ specialization   │        │ date_of_birth    │
│ experience_years │        │ blood_group      │
│ education        │        │ allergies        │
│ license_number   │        │ emergency_contact│
│ bio              │        └────────┬─────────┘
└─────────┬────────┘                 │
          │                          │
          │    ForeignKey            │ ForeignKey
          │    (Many-to-One)         │ (Many-to-One)
          │                          │
          │    ┌────────────────────┴┐
          │    │                     │
          ▼    ▼                     ▼
    ┌───────────────────────┐   ┌───────────────────────┐
    │appointments_appointment│   │health_records_record  │
    │───────────────────────│   │───────────────────────│
    │ id (PK)               │   │ id (PK)               │
    │ doctor_id (FK)        │   │ patient_id (FK)       │
    │ patient_id (FK)       │   │ record_type           │
    │ appointment_date      │   │ test_results (JSONB)  │
    │ status                │   │ doctor_notes          │
    │ reason                │   │ created_at            │
    └──────────┬────────────┘   └───────────────────────┘
               │
               │ ForeignKey (Optional)
               │
               ▼
    ┌──────────────────────┐
    │prescriptions_prescription│
    │──────────────────────│
    │ id (PK)              │
    │ doctor_id (FK)       │
    │ patient_id (FK)      │
    │ appointment_id (FK)  │  (Optional - can be NULL)
    │ medications (JSONB)  │
    │ notes                │
    │ created_at           │
    └──────────────────────┘

    ┌───────────────┐
    │  blogs_blog   │
    │───────────────│
    │ id (PK)       │
    │ author_id (FK)│────────┐ (Points to doctors_doctor)
    │ title         │        │
    │ content       │        │
    │ published_at  │        │
    └───────┬───────┘        │
            │                │
            │ ForeignKey     │
            │ (One-to-Many)  │
            ▼                │
    ┌──────────────────┐    │
    │blogs_blogcomment │    │
    │──────────────────│    │
    │ id (PK)          │    │
    │ blog_id (FK)     │    │
    │ user_id (FK)     │────┘ (Can be any user)
    │ content          │
    │ created_at       │
    └──────────────────┘
```

### Relationship Types:

1. **OneToOne**: `users_user` ↔ `doctors_doctor` / `patients_patient`
   - One user can be either a doctor OR a patient, not both

2. **ForeignKey (Many-to-One)**: 
   - Many appointments → One doctor
   - Many appointments → One patient
   - Many prescriptions → One doctor
   - Many prescriptions → One patient

3. **Optional ForeignKey**: 
   - Prescription can have an appointment (or can be standalone)

---

## Core Tables

### 1. users_user (Custom User Model)

**Purpose**: Store all user accounts (both doctors and patients)

**Fields**:
```sql
CREATE TABLE users_user (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL,  -- Hashed password
    user_type VARCHAR(20) NOT NULL,  -- 'doctor' or 'patient'
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    is_staff BOOLEAN DEFAULT FALSE,
    date_joined TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);
```

**Example Data**:
```
id | email                  | user_type | first_name | last_name | phone
---|------------------------|-----------|------------|-----------|-------------
1  | dr.ahmed@example.com   | doctor    | Ahmed      | Rahman    | +8801712345678
2  | patient1@example.com   | patient   | Fatima     | Khan      | +8801812345678
3  | dr.sarah@example.com   | doctor    | Sarah      | Begum     | +8801912345678
4  | patient2@example.com   | patient   | Karim      | Uddin     | +8801612345678
```

---

### 2. doctors_doctor (Doctor Profile)

**Purpose**: Store doctor-specific information

**Fields**:
```sql
CREATE TABLE doctors_doctor (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,  -- OneToOne with users_user
    specialization VARCHAR(100) NOT NULL,
    experience_years INTEGER DEFAULT 0,
    education TEXT,
    license_number VARCHAR(50) UNIQUE,
    consultation_fee DECIMAL(10, 2),
    bio TEXT,
    FOREIGN KEY (user_id) REFERENCES users_user(id) ON DELETE CASCADE
);
```

**Example Data**:
```
id | user_id | specialization | experience_years | license_number | consultation_fee | bio
---|---------|----------------|------------------|----------------|------------------|-----
1  | 1       | Cardiologist   | 10               | BMDC-12345     | 1500.00          | "Specialist in heart diseases..."
2  | 3       | Dermatologist  | 5                | BMDC-67890     | 1200.00          | "Skin care expert..."
```

**How to understand**:
- `user_id = 1` means this doctor profile belongs to the user with `id=1` in `users_user` table
- That user's email is `dr.ahmed@example.com`
- OneToOne relationship: Each user can have ONLY ONE doctor profile

---

### 3. patients_patient (Patient Profile)

**Purpose**: Store patient-specific information

**Fields**:
```sql
CREATE TABLE patients_patient (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,  -- OneToOne with users_user
    date_of_birth DATE,
    blood_group VARCHAR(5),
    allergies TEXT,
    emergency_contact VARCHAR(20),
    address TEXT,
    FOREIGN KEY (user_id) REFERENCES users_user(id) ON DELETE CASCADE
);
```

**Example Data**:
```
id | user_id | date_of_birth | blood_group | allergies        | emergency_contact
---|---------|---------------|-------------|------------------|------------------
1  | 2       | 1995-05-15    | O+          | Penicillin       | +8801812345679
2  | 4       | 1988-11-22    | A+          | None             | +8801612345679
```

**How to understand**:
- `user_id = 2` means this patient profile belongs to the user with `id=2` in `users_user` table
- That user's email is `patient1@example.com`, name is `Fatima Khan`

---

### 4. appointments_appointment (Appointment Booking)

**Purpose**: Store appointment bookings between doctors and patients

**Fields**:
```sql
CREATE TABLE appointments_appointment (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    appointment_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'confirmed', 'completed', 'cancelled'
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (doctor_id) REFERENCES doctors_doctor(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients_patient(id) ON DELETE CASCADE
);
```

**Example Data**:
```
id | doctor_id | patient_id | appointment_date     | status    | reason
---|-----------|------------|----------------------|-----------|------------------------
1  | 1         | 1          | 2025-01-05 10:00:00  | confirmed | Chest pain consultation
2  | 2         | 1          | 2025-01-10 14:00:00  | pending   | Skin rash checkup
3  | 1         | 2          | 2025-01-08 11:30:00  | completed | Regular heart checkup
```

**How to understand this relationship**:
- Appointment `id=1`: 
  - `doctor_id = 1` → Doctor with specialization "Cardiologist" (Dr. Ahmed)
  - `patient_id = 1` → Patient Fatima Khan (user_id=2)
  - Meaning: **Fatima Khan has an appointment with Dr. Ahmed (Cardiologist) on Jan 5, 2025 at 10:00 AM**

- Appointment `id=3`:
  - `doctor_id = 1` → Same doctor (Dr. Ahmed)
  - `patient_id = 2` → Different patient (Karim Uddin, user_id=4)
  - Meaning: **Multiple patients can book appointments with the same doctor**

**Key Insight**: 
- `ForeignKey` allows **Many-to-One** relationship
- Many appointments can point to the same doctor
- Many appointments can point to the same patient
- But each appointment has exactly ONE doctor and ONE patient

---

### 5. prescriptions_prescription (Medical Prescriptions)

**Purpose**: Store prescriptions written by doctors

**Fields**:
```sql
CREATE TABLE prescriptions_prescription (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    appointment_id INTEGER,  -- Optional: Can be NULL
    medications JSONB NOT NULL,  -- JSON array of medications
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (doctor_id) REFERENCES doctors_doctor(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients_patient(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments_appointment(id) ON DELETE SET NULL
);
```

**Example Data**:
```
id | doctor_id | patient_id | appointment_id | medications (JSONB) | notes | created_at
---|-----------|------------|----------------|---------------------|-------|------------
1  | 1         | 1          | 1              | [{"name": "Aspirin", "dosage": "75mg", "frequency": "Once daily", "duration": "30 days"}] | "Take after meals" | 2025-01-05 10:30:00
2  | 1         | 1          | NULL           | [{"name": "Atorvastatin", "dosage": "20mg", "frequency": "Once at night", "duration": "60 days"}] | "For cholesterol" | 2025-01-15 09:00:00
```

**How to understand JSONB medications field**:
```json
[
  {
    "name": "Aspirin",
    "dosage": "75mg",
    "frequency": "Once daily",
    "duration": "30 days",
    "instructions": "Take after meals"
  },
  {
    "name": "Atorvastatin",
    "dosage": "20mg",
    "frequency": "Once at night",
    "duration": "60 days",
    "instructions": "Avoid grapefruit"
  }
]
```

**Key Insight**:
- Prescription `id=1` has `appointment_id = 1`: Written during appointment
- Prescription `id=2` has `appointment_id = NULL`: Standalone prescription (follow-up without appointment)

---

### 6. health_records_healthrecord (Patient Health Records)

**Purpose**: Store patient health records and test results

**Fields**:
```sql
CREATE TABLE health_records_healthrecord (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    record_type VARCHAR(50) NOT NULL,  -- 'lab_test', 'imaging', 'diagnosis', 'vitals'
    test_results JSONB,  -- Flexible JSON storage
    doctor_notes TEXT,
    record_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (patient_id) REFERENCES patients_patient(id) ON DELETE CASCADE
);
```

**Example Data**:
```
id | patient_id | record_type | test_results (JSONB) | doctor_notes
---|------------|-------------|----------------------|---------------
1  | 1          | lab_test    | {"test_name": "Complete Blood Count", "hemoglobin": 13.5, "wbc": 7200, "platelets": 250000} | "Normal range"
2  | 1          | vitals      | {"blood_pressure": "120/80", "heart_rate": 72, "temperature": 98.6, "weight": 65} | "Healthy vitals"
3  | 2          | imaging     | {"test_name": "Chest X-Ray", "findings": "Clear lungs", "report_url": "https://..."} | "No abnormalities"
```

**How to understand JSONB test_results field**:

For lab test:
```json
{
  "test_name": "Complete Blood Count",
  "hemoglobin": 13.5,
  "wbc_count": 7200,
  "platelet_count": 250000,
  "test_date": "2025-01-05",
  "lab_name": "Popular Diagnostic Center"
}
```

For vitals:
```json
{
  "blood_pressure": "120/80",
  "heart_rate": 72,
  "temperature": 98.6,
  "weight_kg": 65,
  "height_cm": 165,
  "bmi": 23.9,
  "measured_at": "2025-01-05T10:00:00"
}
```

**Why JSONB?**
- Different types of health records have different fields
- Lab tests have different parameters
- Flexible structure without needing separate tables
- Can query JSON fields: `WHERE test_results->>'hemoglobin' > 15`

---

### 7. blogs_blog (Doctor Blog Posts)

**Purpose**: Store blog posts written by doctors

**Fields**:
```sql
CREATE TABLE blogs_blog (
    id SERIAL PRIMARY KEY,
    author_id INTEGER NOT NULL,  -- ForeignKey to doctors_doctor
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),
    published_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (author_id) REFERENCES doctors_doctor(id) ON DELETE CASCADE
);
```

**Example Data**:
```
id | author_id | title                               | slug | content | published_at
---|-----------|-------------------------------------|------|---------|-------------
1  | 1         | "Understanding Heart Health"        | understanding-heart-health | "Heart disease is..." | 2025-01-01 09:00:00
2  | 2         | "5 Tips for Healthy Skin"           | 5-tips-healthy-skin | "Skin care is..." | 2025-01-03 14:00:00
```

**How to understand**:
- Blog `id=1` has `author_id = 1` → Doctor with specialization "Cardiologist" (Dr. Ahmed)
- Meaning: **Dr. Ahmed (Cardiologist) wrote a blog about heart health**

---

### 8. blogs_blogcomment (Blog Comments)

**Purpose**: Store comments on blog posts

**Fields**:
```sql
CREATE TABLE blogs_blogcomment (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,  -- Can be doctor or patient
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (blog_id) REFERENCES blogs_blog(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users_user(id) ON DELETE CASCADE
);
```

**Example Data**:
```
id | blog_id | user_id | content | created_at
---|---------|---------|---------|------------
1  | 1       | 2       | "Very informative article! Thank you Dr. Ahmed." | 2025-01-01 10:00:00
2  | 1       | 4       | "I have a question about cholesterol levels." | 2025-01-02 11:30:00
3  | 2       | 2       | "Great tips for skin care!" | 2025-01-03 15:00:00
```

**How to understand**:
- Comment `id=1`:
  - `blog_id = 1` → Blog "Understanding Heart Health"
  - `user_id = 2` → Patient Fatima Khan
  - Meaning: **Fatima Khan commented on Dr. Ahmed's blog about heart health**

---

## Relationships Explained

### Example Scenario: Patient Books Appointment and Gets Prescription

Let's trace through a complete example:

**1. User Registration (users_user)**
```
Patient Fatima Khan signs up:
id=2, email=patient1@example.com, user_type=patient, first_name=Fatima, last_name=Khan
```

**2. Patient Profile Creation (patients_patient)**
```
Create patient profile:
id=1, user_id=2, date_of_birth=1995-05-15, blood_group=O+, allergies=Penicillin
```

**3. Doctor Profile Exists (doctors_doctor)**
```
Dr. Ahmed (Cardiologist):
id=1, user_id=1, specialization=Cardiologist, experience_years=10
```

**4. Patient Books Appointment (appointments_appointment)**
```
Fatima books appointment with Dr. Ahmed:
id=1, doctor_id=1, patient_id=1, appointment_date=2025-01-05 10:00:00, status=confirmed, reason="Chest pain"
```

**5. Doctor Writes Prescription (prescriptions_prescription)**
```
After appointment, Dr. Ahmed prescribes medication:
id=1, doctor_id=1, patient_id=1, appointment_id=1, 
medications=[{"name": "Aspirin", "dosage": "75mg", "frequency": "Once daily", "duration": "30 days"}]
```

**6. Health Record Created (health_records_healthrecord)**
```
Lab test results added:
id=1, patient_id=1, record_type=lab_test, 
test_results={"test_name": "ECG", "findings": "Normal sinus rhythm"}
```

### Visual Representation of This Flow:

```
users_user (id=2)              users_user (id=1)
    ↓ (OneToOne)                   ↓ (OneToOne)
patients_patient (id=1)        doctors_doctor (id=1)
    ↓                               ↓
    └─────────┬─────────────────────┘
              ↓ (Both ForeignKeys)
    appointments_appointment (id=1)
              ↓ (Optional FK)
    prescriptions_prescription (id=1)
    
    health_records_healthrecord (id=1)
              ↑ (FK to patient)
    patients_patient (id=1)
```

---

## JSONB Fields Explained

### Why Use JSONB?

**Traditional Approach** (Not flexible):
```sql
-- Would need separate table
CREATE TABLE prescription_medications (
    id SERIAL,
    prescription_id INTEGER,
    medicine_name VARCHAR,
    dosage VARCHAR,
    frequency VARCHAR
);
```
Problem: Need join queries, more complex

**JSONB Approach** (Flexible):
```sql
medications JSONB = [
  {"name": "Aspirin", "dosage": "75mg", "frequency": "Once daily"},
  {"name": "Vitamin D", "dosage": "1000IU", "frequency": "Once daily"}
]
```
Benefit: Store complex data in one field, easy to update

### Querying JSONB in PostgreSQL

**Get all prescriptions with Aspirin**:
```sql
SELECT * FROM prescriptions_prescription
WHERE medications @> '[{"name": "Aspirin"}]';
```

**Get health records with high hemoglobin**:
```sql
SELECT * FROM health_records_healthrecord
WHERE (test_results->>'hemoglobin')::float > 15.0;
```

---

## Common Queries

### 1. Get all appointments for a patient

```sql
SELECT 
    a.id,
    a.appointment_date,
    a.status,
    a.reason,
    u.first_name AS doctor_first_name,
    u.last_name AS doctor_last_name,
    d.specialization
FROM appointments_appointment a
JOIN doctors_doctor d ON a.doctor_id = d.id
JOIN users_user u ON d.user_id = u.id
WHERE a.patient_id = 1
ORDER BY a.appointment_date DESC;
```

**Result**:
```
id | appointment_date     | status    | reason | doctor_first_name | doctor_last_name | specialization
---|----------------------|-----------|--------|-------------------|------------------|---------------
1  | 2025-01-05 10:00:00  | confirmed | Chest  | Ahmed             | Rahman           | Cardiologist
2  | 2025-01-10 14:00:00  | pending   | Rash   | Sarah             | Begum            | Dermatologist
```

### 2. Get all prescriptions for a patient

```sql
SELECT 
    p.id,
    p.created_at,
    p.medications,
    p.notes,
    u.first_name AS doctor_first_name,
    d.specialization
FROM prescriptions_prescription p
JOIN doctors_doctor d ON p.doctor_id = d.id
JOIN users_user u ON d.user_id = u.id
WHERE p.patient_id = 1
ORDER BY p.created_at DESC;
```

### 3. Get doctor's upcoming appointments

```sql
SELECT 
    a.id,
    a.appointment_date,
    a.reason,
    u.first_name AS patient_first_name,
    u.last_name AS patient_last_name,
    pat.blood_group
FROM appointments_appointment a
JOIN patients_patient pat ON a.patient_id = pat.id
JOIN users_user u ON pat.user_id = u.id
WHERE a.doctor_id = 1 
  AND a.appointment_date > NOW()
  AND a.status != 'cancelled'
ORDER BY a.appointment_date ASC;
```

### 4. Get patient's complete health history

```sql
SELECT 
    hr.record_type,
    hr.test_results,
    hr.doctor_notes,
    hr.record_date
FROM health_records_healthrecord hr
WHERE hr.patient_id = 1
ORDER BY hr.record_date DESC;
```

---

## Database Indexes (For Performance)

```sql
-- Improve query performance
CREATE INDEX idx_appointments_doctor ON appointments_appointment(doctor_id);
CREATE INDEX idx_appointments_patient ON appointments_appointment(patient_id);
CREATE INDEX idx_appointments_date ON appointments_appointment(appointment_date);
CREATE INDEX idx_prescriptions_patient ON prescriptions_prescription(patient_id);
CREATE INDEX idx_health_records_patient ON health_records_healthrecord(patient_id);
CREATE INDEX idx_blogs_author ON blogs_blog(author_id);
```

---

## Summary

### Key Concepts:

1. **OneToOne Relationship**: `users_user` ↔ `doctors_doctor` / `patients_patient`
   - Each user is either a doctor OR a patient
   - Can't be both

2. **ForeignKey (Many-to-One)**: 
   - Many appointments can belong to one doctor
   - Many appointments can belong to one patient
   - Many prescriptions can belong to one doctor

3. **Optional ForeignKey**: 
   - Prescription can have an appointment (or NULL)

4. **JSONB Fields**: 
   - Flexible storage for varying data (medications, test results)
   - Can query JSON fields directly

5. **Cascading Deletes**: 
   - If a user is deleted, their doctor/patient profile is deleted
   - If a doctor is deleted, their appointments are deleted

This schema is designed for a healthcare application where:
- Patients can book appointments with doctors
- Doctors can write prescriptions
- Health records are stored flexibly
- Doctors can write blogs
- Users can comment on blogs
