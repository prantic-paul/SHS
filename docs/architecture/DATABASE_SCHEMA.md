# Database Schema: Smart Health Synchronizer

## Overview
This document describes the initial database schema for Smart Health Synchronizer (SHS) - Sprint 0 design. This schema will evolve incrementally as we implement features in subsequent sprints.

**Schema Level:** High-Level (10% detail - entities and relationships only)  
**Phase:** Sprint 0 - Foundation  
**Last Updated:** December 21, 2025

---

## 1. Entity Relationship Diagram (Conceptual)

```
┌──────────────────────────────────────────────────────────────────────┐
│                              USER                                     │
│  - id                                                                 │
│  - email                                                              │
│  - password (hashed)                                                  │
│  - first_name                                                         │
│  - last_name                                                          │
│  - phone                                                              │
│  - role (PATIENT, DOCTOR, ADMIN)                                     │
│  - is_active                                                          │
│  - created_at                                                         │
└──────────────────────────────────────────────────────────────────────┘
       │                                    │
       │ 1:1 (if role=DOCTOR)               │ 1:Many
       │                                    │
       ▼                                    ▼
┌─────────────────────────┐    ┌───────────────────────────────┐
│   DOCTOR_INFORMATION    │    │      MEDICAL_RECORD           │
│  - id                   │    │  - id                         │
│  - user_id (FK)         │    │  - user_id (FK - Patient)     │
│  - license_number       │    │  - doctor_id (FK)             │
│  - specialization       │    │  - appointment_id (FK)        │
│  - qualifications       │    │  - diagnosis                  │
│  - experience_years     │    │  - prescription               │
│  - bio                  │    │     (medications & notes)     │
│  - location             │    │  - visit_date                 │
│  - is_verified          │    │  - created_at                 │
│  - rating_avg           │    │  - updated_at                 │
│  - created_at           │    └───────────────────────────────┘
└─────────────────────────┘
       │
       │ 1:Many
       │
       ├──────────────────────┬──────────────────────┬─────────────────┐
       │                      │                      │                 │
       ▼                      ▼                      ▼                 ▼
┌──────────────────┐  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────┐
│      BLOG        │  │ APPOINTMENT_    │  │  APPOINTMENT     │  │    REVIEW    │
│  - id            │  │   SCHEDULE      │  │  (Booking)       │  │  (Rating)    │
│  - doctor_id(FK) │  │  - id           │  │  - id            │  │  - id        │
│  - title         │  │  - doctor_id(FK)│  │  - patient_id(FK)│  │  - patient_id│
│  - content       │  │  - day_of_week  │  │  - doctor_id(FK) │  │       (FK)   │
│  - category      │  │  - start_time   │  │  - schedule_id   │  │  - doctor_id │
│  - published_at  │  │  - end_time     │  │       (FK)       │  │       (FK)   │
│  - created_at    │  │  - is_available │  │  - appointment_  │  │  - rating    │
└──────────────────┘  │  - created_at   │  │     date         │  │     (1-5)    │
                      └─────────────────┘  │  - status        │  │  - review    │
                                           │  - created_at    │  │     _text    │
                                           └──────────────────┘  │  - created_at│
                                                                  └──────────────┘
```

---

## 2. Entity Definitions

### 2.1 User (Core Entity)
**Purpose:** Central authentication and user management table

**Key Attributes:**
- `id` - Unique identifier (Primary Key)
- `email` - User's email (unique)
- `password` - Hashed password
- `first_name` - User's first name
- `last_name` - User's last name
- `phone` - Contact number
- `role` - User type: PATIENT, DOCTOR, ADMIN
- `is_active` - Account status
- `created_at` - Registration timestamp

**Relationships:**
- One User → One Doctor Information (if role = DOCTOR)
- One User (Patient) → Many Medical Records
- One User (Doctor) → Many Medical Records (as provider)
- One User (Doctor) → Many Blogs
- One User (Doctor) → Many Appointment Schedules
- One User (Doctor) → Many Appointments (as provider)
- One User (Patient) → Many Appointments (as patient)
- One User (Patient) → Many Reviews (as reviewer)
- One User (Doctor) → Many Reviews (as reviewed)

**Business Rules:**
- Email must be unique
- Role determines access permissions
- Doctors must have corresponding Doctor Information record
- Patients do not need Doctor Information record

---

### 2.2 Doctor Information
**Purpose:** Extended profile information for doctors only

**Key Attributes:**
- `id` - Unique identifier (Primary Key)
- `user_id` - Foreign Key to User (one-to-one)
- `license_number` - Medical license number (unique)
- `specialization` - Doctor's specialty (e.g., Cardiology, Dermatology)
- `qualifications` - Educational qualifications (e.g., MBBS, MD)
- `experience_years` - Years of practice experience
- `bio` - Professional biography
- `location` - Practice location/address
- `is_verified` - Admin verification status
- `rating_avg` - Average rating (calculated from reviews)
- `created_at` - Profile creation timestamp

**Relationships:**
- Belongs to one User (user_id Foreign Key)
- Has many Blogs
- Has many Appointment Schedules
- Has many Appointments
- Has many Reviews
- Has many Prescriptions

**Business Rules:**
- Only users with role = DOCTOR can have this record
- License number must be unique
- Must be verified by admin before appearing in searches
- Rating is calculated automatically from reviews

---

### 2.3 Medical Record
**Purpose:** Store patient health history, doctor consultations, and prescriptions

**Key Attributes:**
- `id` - Unique identifier (Primary Key)
- `user_id` - Foreign Key to User (Patient)
- `doctor_id` - Foreign Key to Doctor Information
- `appointment_id` - Foreign Key to Appointment (optional)
- `diagnosis` - Medical diagnosis
- `prescription` - Prescribed medications and instructions (JSON/Text)
- `visit_date` - Date of consultation
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

**Relationships:**
- Belongs to one User (Patient)
- Belongs to one Doctor
- May link to one Appointment

**Business Rules:**
- Patient can view their own records
- Doctor can view records of their assigned patients
- Doctor can update prescription in existing medical record
- Latest prescription can be retrieved by sorting by `created_at` or `updated_at`
- Complete medical history and prescription history maintained for each patient
- Each appointment creates one medical record with prescription

---

### 2.4 Blog
**Purpose:** Health awareness articles written by doctors

**Key Attributes:**
- `id` - Unique identifier (Primary Key)
- `doctor_id` - Foreign Key to Doctor Information
- `title` - Blog post title
- `content` - Blog post content (HTML/Markdown)
- `category` - Blog category (e.g., Pandemic, Prevention, Treatment)
- `published_at` - Publication timestamp
- `created_at` - Creation timestamp

**Relationships:**
- Belongs to one Doctor (author)
- Can have many Comments (future feature)

**Business Rules:**
- Only verified doctors can publish blogs
- Blogs are public (visible to all users)
- Doctors can edit/delete their own blogs
- Admins can moderate any blog

---

### 2.5 Appointment Schedule
**Purpose:** Define doctor availability for appointments

**Key Attributes:**
- `id` - Unique identifier (Primary Key)
- `doctor_id` - Foreign Key to Doctor Information
- `day_of_week` - Day (Monday-Sunday) or specific date
- `start_time` - Schedule start time
- `end_time` - Schedule end time
- `is_available` - Availability status
- `created_at` - Creation timestamp

**Relationships:**
- Belongs to one Doctor
- Has many Appointments (bookings)

**Business Rules:**
- Doctors manage their own schedules
- Patients can only book within available schedule slots
- Schedule can be recurring (weekly) or one-time

---

### 2.6 Appointment (Booking)
**Purpose:** Track patient-doctor appointment bookings

**Key Attributes:**
- `id` - Unique identifier (Primary Key)
- `patient_id` - Foreign Key to User (Patient)
- `doctor_id` - Foreign Key to Doctor Information
- `schedule_id` - Foreign Key to Appointment Schedule
- `appointment_date` - Specific appointment date and time
- `status` - Booking status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- `created_at` - Booking timestamp

**Relationships:**
- Belongs to one Patient
- Belongs to one Doctor
- Belongs to one Appointment Schedule
- Creates one Medical Record (with prescription after consultation)

**Business Rules:**
- Patient can book one appointment at a time with same doctor
- Cannot double-book the same schedule slot
- Patients can cancel appointments
- Doctors can view all their appointments
- Status changes as appointment progresses
- After completion, medical record with prescription is created

---

### 2.7 Review (Rating)
**Purpose:** Patient ratings and reviews for doctors

**Key Attributes:**
- `id` - Unique identifier (Primary Key)
- `patient_id` - Foreign Key to User (Patient)
- `doctor_id` - Foreign Key to Doctor Information
- `rating` - Numeric rating (1-5 stars)
- `review_text` - Written review (optional)
- `created_at` - Review timestamp

**Relationships:**
- Belongs to one Patient (reviewer)
- Belongs to one Doctor (reviewed)

**Business Rules:**
- Only patients who had appointments can review doctors
- One patient can review one doctor only once (or once per appointment)
- Doctors cannot review themselves
- Admin can moderate inappropriate reviews
- Average rating is calculated and stored in Doctor Information

---

## 3. Relationship Summary

### One-to-One Relationships
| Entity A | Entity B | Description |
|----------|----------|-------------|
| User (Doctor) | Doctor Information | One doctor user has one extended profile |

### One-to-Many Relationships
| Parent | Child | Description |
|--------|-------|-------------|
| User (Patient) | Medical Record | One patient has many health records |
| Doctor Information | Medical Record | One doctor creates many records |
| Doctor Information | Blog | One doctor writes many blogs |
| Doctor Information | Appointment Schedule | One doctor has many schedule slots |
| Doctor Information | Appointment | One doctor has many appointments |
| User (Patient) | Appointment | One patient books many appointments |
| User (Patient) | Review | One patient writes many reviews |
| Doctor Information | Review | One doctor receives many reviews |

---

## 4. Key Design Decisions

### 4.1 User-Role Model
**Decision:** Single User table with role field instead of separate Patient/Doctor tables

**Rationale:**
- Simplifies authentication (one login system)
- User can potentially be both patient and doctor
- Reduces code duplication
- Easier to manage permissions

**Trade-off:**
- Doctor-specific fields stored separately in Doctor Information table
- Requires additional join for doctor data

### 4.2 Medical Records
**Decision:** Separate Medical Record table instead of embedding in Appointment

**Rationale:**
- Appointments and medical records are different concepts
- Patient may have records from external sources
- Complete medical history independent of appointments
- Better for long-term health tracking

### 4.3 Appointment Schedule vs Appointment
**Decision:** Two separate tables for schedule definition and actual bookings

**Rationale:**
- Schedule defines availability (reusable slots)
- Appointments are specific bookings
- Easier to manage recurring schedules
- Clear separation of concerns

### 4.4 Prescription in Medical Records
**Decision:** Prescription stored as part of Medical Record, not separate table

**Rationale:**
- Medical record represents complete consultation including prescription
- Simplifies data model (one entity instead of two)
- Easy to retrieve latest prescription by sorting medical records
- Prescription is always linked to a consultation
- Natural grouping of diagnosis + prescription

**Trade-off:**
- Less normalized (prescription data embedded in record)
- Can use JSON field for flexible prescription structure
- Query latest prescription: `SELECT * FROM medical_record WHERE user_id=X ORDER BY created_at DESC LIMIT 1`

---

## 5. Data Integrity Rules

### Primary Keys
- All tables have auto-incrementing `id` as primary key
- Ensures unique identification of records

### Foreign Keys
- All relationships enforced with foreign key constraints
- Maintains referential integrity
- Prevents orphaned records

### Unique Constraints
- User.email (unique)
- Doctor Information.license_number (unique)
- Review: patient_id + doctor_id (unique - one review per patient-doctor pair)

### Not Null Constraints
- Essential fields cannot be null (email, password, role, etc.)
- Ensures data completeness

### Check Constraints
- Review.rating between 1 and 5
- Appointment.status in valid status list
- User.role in (PATIENT, DOCTOR, ADMIN)

---

## 6. Indexes (Performance Considerations)

**Recommended indexes for Sprint 1+ implementation:**
- User.email (unique index for login)
- User.role (filter by user type)
- Doctor Information.specialization (doctor search)
- Doctor Information.location (location-based search)
- Appointment.patient_id (patient's appointments)
- Appointment.doctor_id (doctor's appointments)
- Appointment.appointment_date (date-based queries)
- Review.doctor_id (aggregate ratings)

**Note:** Specific index implementation will be done in Sprint 1 during TDD.

---

## 7. Sample Data Flow Examples

### Example 1: Patient Books Appointment
```
1. Patient searches for doctor
   → Query Doctor Information (filter by location/specialization)

2. Patient views doctor profile
   → Query Doctor Information, Reviews (calculate avg rating)

3. Patient checks availability
   → Query Appointment Schedule (doctor_id, available slots)

4. Patient books appointment
   → Create Appointment record (patient_id, doctor_id, schedule_id, date)

5. Doctor views appointments
   → Query Appointments (doctor_id, upcoming dates)
```

### Example 2: Doctor Issues Prescription
```
1. Doctor completes appointment
   → Update Appointment status = COMPLETED

2. Doctor creates medical record
   → Create Medical Record (patient_id, doctor_id, diagnosis, prescription)

3. Patient views prescription
   → Query Medical Record (patient_id, ORDER BY created_at DESC) - Get latest
```

### Example 3: Patient Reviews Doctor
```
1. Patient had appointment
   → Verify Appointment exists (patient_id, doctor_id, status=COMPLETED)

2. Patient writes review
   → Create Review (patient_id, doctor_id, rating, review_text)

3. Update doctor rating
   → Calculate average from all Reviews (doctor_id)
   → Update Doctor Information.rating_avg
```

---

## 8. Future Enhancements

**Schema additions planned for future sprints:**
- Notification table (appointment reminders)
- Payment table (transaction records)
- Blog Comment table (user comments on blogs)
- File Attachment table (images, PDFs)
- Doctor Specialization table (normalized specialties)
- Location table (structured location data)
- Availability Exception table (doctor unavailable dates)

**These will be added incrementally based on sprint requirements.**

**Note:** Field details (exact types, constraints, validations) will be finalized during Sprint 1+ Technical Design Document (TDD) phase.

---

## 9. Technology Notes

### Django ORM Models
- This schema will be implemented as Django models
- Django automatically handles primary keys (`id`)
- Foreign keys defined with `models.ForeignKey()`
- Timestamps handled with `auto_now_add=True`

### PostgreSQL Features
- JSONB for flexible data (e.g., medications list)
- Full-text search for blogs and doctor search
- Date/time handling for appointments
- Transaction support for data integrity

---

## Summary

**What This Schema Provides:**
- ✅ Core entities for all major features
- ✅ Clear relationships between entities
- ✅ Flexible design supporting all user types
- ✅ Foundation for incremental development
- ✅ Data integrity and business rules

**What We'll Design Later (Sprint 1+):**
- Exact field types (VARCHAR(255), INTEGER, etc.)
- Specific constraints and validations
- Index definitions
- Migration scripts
- Sample data for testing

---

**Document Status:** ✅ Completed  
**Schema Level:** High-Level (Sprint 0)  
**Next Step:** Create Sprint Plan and Product Backlog
