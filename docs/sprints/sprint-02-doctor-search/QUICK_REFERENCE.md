# Sprint 2: Quick Reference Guide

**Last Updated**: December 22, 2025  
**Sprint Status**: 🔄 In Progress  
**Total Story Points**: 32 (30 must-have + 2 optional)

---

## 📋 Quick Summary

Sprint 2 focuses on **Doctor Search & Discovery** with the addition of a comprehensive **Rating Submission System** and **Availability Status**.

### Core Features (30 points - Must Have)
1. ✅ View All Verified Doctors (5 pts)
2. ✅ Search Doctors by Name/Specialization (5 pts)
3. ✅ Filter Doctors (Multiple Criteria) (8 pts)
4. ✅ View Doctor Detail Page (5 pts)
5. ✅ Doctor Availability Status - All Unavailable (2 pts)
6. ✅ Doctor Ratings Display & Submission (5 pts)

### Optional Features (2 points - Nice to Have)
7. ⚪ Rating Breakdown & Statistics (2 pts)

---

## 🆕 New Features Added

### 1. Doctor Rating Submission System
**What's New:**
- Interactive 5-star rating (click/hover with gold highlighting)
- Submit ratings with optional text review (max 200 chars)
- One rating per user per doctor (unique constraint)
- Edit/delete own ratings
- Guest users must log in to rate
- Real-time rating average calculation
- Rating breakdown with progress bars (5★ to 1★)

**API Endpoints:**
```
POST   /api/v1/doctors/{id}/ratings/          - Submit rating
GET    /api/v1/doctors/{id}/ratings/          - List ratings
PUT    /api/v1/doctors/{id}/ratings/{rid}/    - Update rating
DELETE /api/v1/doctors/{id}/ratings/{rid}/    - Delete rating
GET    /api/v1/doctors/{id}/ratings/breakdown/ - Get stats
```

### 2. Doctor Availability Status
**What's New:**
- All doctors default to "unavailable" status
- Red badge: "Not Accepting New Patients"
- Displayed on cards and detail page
- Message: "Appointment booking coming soon in Sprint 3"

**Database Field:**
```python
availability_status = models.CharField(
    max_length=20,
    choices=[
        ('available', 'Available'),
        ('busy', 'Busy'),
        ('unavailable', 'Unavailable')
    ],
    default='unavailable'
)
```

---

## 🗄️ Database Changes

### New Model: Rating
```python
class Rating(models.Model):
    doctor = ForeignKey(DoctorInformation)
    user = ForeignKey(User)
    rating = IntegerField(choices=[(1,1), (2,2), (3,3), (4,4), (5,5)])
    review_text = TextField(max_length=200, blank=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = [['doctor', 'user']]
```

### Updated Model: DoctorInformation
**New Fields:**
- `rating_count` (IntegerField, default=0)
- `availability_status` (CharField, default='unavailable')

---

## 🎨 Frontend Components

### New Components to Build:
1. **StarRating** - Interactive 5-star input
2. **StarDisplay** - Read-only star display
3. **RatingForm** - Rating submission form
4. **RatingBreakdown** - Horizontal bar chart
5. **ReviewList** - Paginated reviews
6. **AvailabilityBadge** - Status badge

---

## 📊 API Response Examples

### Doctor List (with new fields)
```json
{
  "count": 25,
  "results": [
    {
      "id": 1,
      "full_name": "Dr. John Doe",
      "specialization": "Cardiology",
      "years_of_experience": 15,
      "practice_location": "New York, NY",
      "rating_avg": 4.8,
      "rating_count": 23,
      "availability_status": "unavailable",
      "is_verified": true
    }
  ]
}
```

### Submit Rating
```bash
# Request
POST /api/v1/doctors/1/ratings/
Authorization: Bearer <JWT_TOKEN>
{
  "rating": 5,
  "review_text": "Excellent doctor!"
}

# Response (201 Created)
{
  "id": 42,
  "doctor": 1,
  "user": { "id": 10, "first_name": "John", "last_name": "Patient" },
  "rating": 5,
  "review_text": "Excellent doctor!",
  "created_at": "2025-12-22T14:30:00Z"
}
```

### Get Rating Breakdown
```bash
# Request
GET /api/v1/doctors/1/ratings/breakdown/

# Response
{
  "average_rating": 4.5,
  "total_ratings": 23,
  "rating_breakdown": {
    "5": { "count": 15, "percentage": 65.2 },
    "4": { "count": 5, "percentage": 21.7 },
    "3": { "count": 2, "percentage": 8.7 },
    "2": { "count": 1, "percentage": 4.3 },
    "1": { "count": 0, "percentage": 0.0 }
  }
}
```

---

## ✅ Implementation Checklist

### Backend (Days 1-5)
- [ ] Create `Rating` model with migrations
- [ ] Add `rating_count` field to `DoctorInformation`
- [ ] Add `availability_status` field (default: 'unavailable')
- [ ] Create `RatingSerializer`
- [ ] Implement rating views (List, Create, Update, Delete)
- [ ] Add rating URLs
- [ ] Create Django signals for rating_avg calculation
- [ ] Write tests for rating functionality
- [ ] Update doctor list/detail serializers

### Frontend (Days 6-10)
- [ ] Build `StarRating` component (interactive)
- [ ] Build `StarDisplay` component (read-only)
- [ ] Create `RatingForm` component
- [ ] Create `RatingBreakdown` component
- [ ] Create `ReviewList` component
- [ ] Create `AvailabilityBadge` component
- [ ] Integrate rating submission with API
- [ ] Add authentication check for rating
- [ ] Display ratings on doctor cards
- [ ] Display ratings on detail page
- [ ] Add rating breakdown charts

### Testing
- [ ] Backend: Test Rating CRUD operations
- [ ] Backend: Test unique constraint (one rating per user)
- [ ] Backend: Test rating_avg calculation
- [ ] Frontend: Test StarRating component
- [ ] Frontend: Test RatingForm submission
- [ ] Frontend: Test guest user restrictions
- [ ] Integration: Test full rating flow

---

## 🚀 Implementation Priority

**Week 1: Backend + Basic Features**
```
Day 1-2: Doctor List & Detail APIs ✅ (from original plan)
Day 3:   Rating model & migrations 🆕
Day 4:   Rating API endpoints 🆕
Day 5:   Availability status field 🆕
```

**Week 2: Frontend + Rating System**
```
Day 6-7: Search & Filter UI ✅ (from original plan)
Day 8:   StarRating & RatingForm components 🆕
Day 9:   Rating submission integration 🆕
Day 10:  Rating breakdown & polish 🆕
```

---

## 📝 Key Acceptance Criteria

### Rating Submission
- ✅ Authenticated users can submit ratings (1-5 stars)
- ✅ Optional text review (max 200 characters)
- ✅ One rating per user per doctor enforced
- ✅ Users can edit/delete their own ratings
- ✅ Guest users see "Please log in to rate" message
- ✅ Success message: "Thank you for your feedback!"
- ✅ Real-time UI update after submission

### Availability Status
- ✅ All doctors show "Not Accepting New Patients" (red badge)
- ✅ Default `availability_status = 'unavailable'`
- ✅ Visible on both list and detail pages
- ✅ "Appointment booking coming soon in Sprint 3" message

### Rating Display
- ✅ Gold stars (filled/half/empty) based on rating_avg
- ✅ Show average rating + count (e.g., "4.5 (23 reviews)")
- ✅ Rating breakdown with progress bars
- ✅ Empty state: "No reviews yet"

---

## 📚 Documentation Files

1. **USER_STORIES.md** - 7 user stories with acceptance criteria
2. **API_SPECIFICATION.md** - 8 endpoints documented
3. **TDD_APPROACH.md** - Test specifications
4. **IMPLEMENTATION_GUIDE.md** - Step-by-step guide
5. **QUICK_REFERENCE.md** (this file) - Quick overview

---

## 🔗 Git Information

**Branch**: `feature/sprint-2-doctor-search`  
**Latest Commit**: `524b058`  
**Status**: ✅ Pushed to GitHub

---

## 💡 Quick Tips

1. **Start with tests** - Follow TDD approach (Red-Green-Refactor)
2. **Use Django signals** - Auto-update rating_avg when Rating is saved/deleted
3. **Validate on both sides** - Backend validation + Frontend validation
4. **Handle edge cases** - 0 ratings, duplicate submissions, guest users
5. **Optimize queries** - Use `select_related()` and `prefetch_related()`
6. **Test thoroughly** - Unit tests, integration tests, manual testing

---

**Questions?** Refer to the detailed documentation files for more information.
