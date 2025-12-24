# Sprint 2: Doctor Search & Discovery

**Duration**: 2 weeks  
**Status**: 🔄 In Progress  
**Branch**: `feature/sprint-2-doctor-search`  
**Start Date**: December 22, 2025  
**Target End Date**: January 5, 2026

---

## 📚 Complete Documentation

This sprint has comprehensive documentation across multiple files for your reference:

### Core Documentation
1. **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** ⭐ START HERE - Quick overview and checklists
2. **[USER_STORIES.md](./USER_STORIES.md)** - Detailed user stories with acceptance criteria (32 story points)
3. **[TDD_APPROACH.md](./TDD_APPROACH.md)** - Test-Driven Development strategy with complete test specifications
4. **[API_SPECIFICATION.md](./API_SPECIFICATION.md)** - Complete API endpoint documentation (8 endpoints)
5. **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Step-by-step backend & frontend implementation
6. **README.md** (this file) - Sprint overview and quick reference

💡 **Tip**: Start with QUICK_REFERENCE.md for a fast overview, then dive into specific docs as needed

---

## 📋 Overview

Sprint 2 focuses on implementing the doctor search and discovery features, allowing patients to find and view verified doctors based on various criteria.

## 🎯 Sprint Goals

1. ⬜ Doctor list view (all verified doctors)
2. ⬜ Doctor search by name/specialization
3. ⬜ Doctor filtering (specialization, location, experience)
4. ⬜ Doctor detail page
5. ⬜ Doctor availability status
6. ⬜ Doctor ratings display

---

## 📝 User Stories

### Story 1: View All Doctors
**As a** patient  
**I want to** see a list of all verified doctors  
**So that** I can browse available healthcare professionals

**Acceptance Criteria:**
- [ ] Display all doctors with APPROVED status
- [ ] Show doctor card with: name, photo, specialization, rating, experience
- [ ] Paginate results (10 doctors per page)
- [ ] Responsive grid layout (1 col mobile, 2 cols tablet, 3 cols desktop)
- [ ] Loading state while fetching data
- [ ] Empty state when no doctors found

**Priority:** 🔴 Must Have

---

### Story 2: Search Doctors
**As a** patient  
**I want to** search doctors by name or specialization  
**So that** I can quickly find specific doctors

**Acceptance Criteria:**
- [ ] Search input field at top of page
- [ ] Search by doctor name (case-insensitive)
- [ ] Search by specialization
- [ ] Real-time search results (debounced)
- [ ] Clear search button
- [ ] Show "No results found" message

**Priority:** 🔴 Must Have

---

### Story 3: Filter Doctors
**As a** patient  
**I want to** filter doctors by criteria  
**So that** I can find doctors that meet my needs

**Acceptance Criteria:**
- [ ] Filter by specialization (dropdown/checkboxes)
- [ ] Filter by location
- [ ] Filter by years of experience (0-5, 5-10, 10-20, 20+)
- [ ] Filter by rating (4+, 3+, etc.)
- [ ] Multiple filters can be applied together
- [ ] Show active filter count
- [ ] Clear all filters button

**Priority:** 🟡 Should Have

---

### Story 4: View Doctor Details
**As a** patient  
**I want to** view detailed information about a doctor  
**So that** I can make an informed decision

**Acceptance Criteria:**
- [ ] Click doctor card to view details
- [ ] Display full profile information
- [ ] Show education, qualifications, experience
- [ ] Display practice location with map (future)
- [ ] Show ratings and reviews (future)
- [ ] Display availability calendar (future)
- [ ] "Book Appointment" button (Sprint 3)

**Priority:** 🔴 Must Have

---

## 🏗️ Technical Implementation

### Backend API Endpoints

```python
GET    /api/v1/doctors/                    # List all verified doctors
GET    /api/v1/doctors/?search=cardio      # Search doctors
GET    /api/v1/doctors/?specialization=    # Filter by specialization
GET    /api/v1/doctors/{id}/               # Get doctor details
GET    /api/v1/doctors/specializations/    # Get all specializations
```

### Frontend Pages

```
/doctors                    # DoctorsListPage
/doctors/{id}              # DoctorDetailPage
```

### Database Changes
No new models needed - uses existing DoctorInformation model from Sprint 1.

### Additional Features
- Pagination using Django REST Framework's PageNumberPagination
- Search using Django Q objects
- Filtering using query parameters
- Caching for better performance (optional)

---

## 🎨 UI/UX Design

### Doctors List Page
- **Header**: "Find Your Doctor"
- **Search Bar**: Prominent search input
- **Filters Panel**: Sidebar or collapsible filters
- **Doctor Cards**: Grid layout with hover effects
- **Pagination**: Bottom of page

### Doctor Card
- Profile picture placeholder
- Name (bold)
- Specialization (colored badge)
- Rating (stars)
- Experience years
- Location
- "View Profile" button

### Doctor Detail Page
- Hero section with doctor info
- Tabs: About, Education, Reviews (future)
- Contact information
- "Book Appointment" CTA button

---

## 📊 API Response Format

### Doctor List Response
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/v1/doctors/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "user": {
        "user_id": "u-123456",
        "name": "Dr. John Smith",
        "email": "john.smith@example.com",
        "phone": "01712345678",
        "location": "Dhaka, Bangladesh"
      },
      "license_number": "BMDC-12345",
      "qualification": "MBBS, MD",
      "specialization": "Cardiology",
      "education": "Harvard Medical School",
      "practice_location": "Square Hospital, Dhaka",
      "experience_years": 15,
      "bio": "Experienced cardiologist...",
      "rating_avg": 4.5,
      "is_verified": true,
      "created_at": "2025-01-01T10:00:00Z"
    }
  ]
}
```

---

## ✅ Definition of Done

- [ ] All user stories completed
- [ ] API endpoints implemented and tested
- [ ] Frontend pages created and responsive
- [ ] Search functionality working
- [ ] Filter functionality working
- [ ] Doctor detail page displaying all info
- [ ] Unit tests written for backend
- [ ] Manual testing completed
- [ ] Code reviewed and merged to develop
- [ ] Documentation updated

---

## 🚀 Sprint Timeline

**Week 1:**
- Backend API endpoints
- Doctor list view
- Basic search functionality

**Week 2:**
- Filter functionality
- Doctor detail page
- UI polish and testing

---

## 📝 Notes

- Focus on verified doctors only (is_verified=True, status=APPROVED)
- Use existing DoctorInformation model
- Prepare structure for future features (appointments, reviews)
- Keep UI clean and professional
- Mobile-first responsive design

---

## 🔗 Related Documentation

- [Sprint 1 Documentation](../sprint-01-authentication/README.md)
- [Database Schema](../../architecture/DATABASE_SCHEMA.md)
- [API Design Principles](../../architecture/API_DESIGN_PRINCIPLES.md)

---

**Created:** December 22, 2025  
**Last Updated:** December 22, 2025  
**Status:** Planning → Development
