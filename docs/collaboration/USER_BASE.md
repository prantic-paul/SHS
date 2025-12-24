# User Base: Smart Health Synchronizer

## Overview
Smart Health Synchronizer serves three primary user types, each with distinct roles, goals, and capabilities within the platform.

---

## Primary Users

### 1. General User (Patient)

**Who They Are:**
- Individuals seeking healthcare services
- People managing ongoing health conditions
- Health-conscious individuals looking for reliable medical information

**Their Goals:**
- Find the right healthcare provider efficiently
- Manage health records and prescriptions digitally
- Stay informed about health issues and pandemics
- Receive quality healthcare services

**What They Can Do:**

| Action | Description |
|--------|-------------|
| **Get Doctor Recommendations** | Receive AI-powered suggestions for appropriate doctors based on symptoms |
| **Book Appointments** | Schedule appointments with doctors online |
| **Search Doctors** | View all doctors in their location or filter by specialty |
| **Manage Prescriptions** | Access and continue treatment using digital prescriptions |
| **Read Health Blogs** | Access public awareness blogs posted by doctors |
| **Rate & Review** | Provide ratings and reviews for doctors after receiving treatment |
| **Manage Health Records** | View personal medical history and past prescriptions |

---

### 2. Doctor

**Who They Are:**
- Licensed healthcare professionals
- Medical practitioners offering consultation and treatment services
- Health educators contributing to public awareness

**Their Goals:**
- Provide quality healthcare with access to complete patient history
- Manage practice efficiently with digital tools
- Build professional reputation and reach more patients
- Contribute to public health awareness

**What They Can Do:**

| Action | Description |
|--------|-------------|
| **Analyze Patient Records** | Access and review all previous medical records of a patient |
| **Create Digital Prescriptions** | Issue prescriptions digitally to patients |
| **Update Prescriptions** | Remotely update or correct previously issued digital prescriptions |
| **Write Health Blogs** | Create awareness content about diseases, pandemics, and health topics |
| **Manage Professional Profile** | Update qualifications, specializations, and bio |
| **Manage Schedule** | Update availability, practice location, and appointment slots |
| **Review Content** | Rate and review blogs written by other doctors |
| **View Appointments** | Manage and respond to patient appointment requests |

---

### 3. Admin

**Who They Are:**
- Platform administrators and managers
- System moderators ensuring platform integrity
- Quality assurance personnel

**Their Goals:**
- Maintain platform quality and security
- Verify authenticity of healthcare providers
- Monitor and moderate platform activities
- Ensure compliance with healthcare regulations

**What They Can Do:**

| Action | Description |
|--------|-------------|
| **Full System Control** | Complete access to all platform features and data |
| **Doctor Verification** | Review doctor credentials and approve/reject registrations |
| **User Management** | Manage patient and doctor accounts |
| **Content Moderation** | Monitor and moderate blogs and reviews |
| **Platform Analytics** | Access system-wide reports and statistics |
| **Security Management** | Monitor platform security and handle reported issues |

---

## User Relationships

```
┌─────────────────┐
│     Patient     │──────┐
│  (General User) │      │
└─────────────────┘      │
                         │ Appointments
                         │ Reviews
                         ▼
                   ┌─────────────┐
                   │   Doctor    │
                   └─────────────┘
                         │
                         │ Registration
                         │ Verification
                         ▼
                   ┌─────────────┐
                   │    Admin    │
                   └─────────────┘
```

**Key Interactions:**
- **Patient → Doctor:** Book appointments, receive prescriptions, write reviews
- **Doctor → Patient:** Provide consultation, issue prescriptions, view medical history
- **Doctor → Admin:** Submit registration, await verification
- **Admin → Doctor:** Verify credentials, approve/reject registration
- **Admin → Patient:** Manage accounts, resolve issues
- **Doctor → Doctor:** Review each other's blog content

---

## User Priorities

### Must Have (Critical Users):
1. **Patient** - Core user generating platform activity
2. **Doctor** - Service provider, essential for platform value

### Should Have:
3. **Admin** - Platform management and quality control

### Future Consideration:
- Pharmacy (for prescription fulfillment)
- Lab Technicians (for test results integration)
- Insurance Providers (for claim processing)

---

## Access Levels

| Feature | Patient | Doctor | Admin |
|---------|---------|--------|-------|
| View Doctors | ✅ | ✅ | ✅ |
| Book Appointments | ✅ | ❌ | ✅ |
| Create Prescriptions | ❌ | ✅ | ✅ |
| View Patient Records | Own Only | Assigned Patients | All |
| Write Blogs | ❌ | ✅ | ✅ |
| Verify Doctors | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |

---

**Document Status:** ✅ Completed  
**Date Created:** December 20, 2025  
**Phase:** Sprint 0 - User Analysis  
**Next Step:** Requirements Engineering
