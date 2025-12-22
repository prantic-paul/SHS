# Sprint 2: User Stories & Acceptance Criteria

**Sprint**: Sprint 2 - Doctor Search & Discovery  
**Duration**: 2 weeks  
**Status**: 🔄 In Progress

---

## User Story 1: View All Doctors

### Story
**As a** patient  
**I want to** see a list of all verified doctors on the platform  
**So that** I can browse available healthcare professionals and choose one

### Story Points
**Complexity**: 5  
**Priority**: 🔴 Must Have (P0)

### Acceptance Criteria

#### AC 1.1: Display Verified Doctors Only
- **Given** I am a logged-in or guest user
- **When** I navigate to the doctors page (`/doctors`)
- **Then** I should see only doctors with:
  - `status = 'APPROVED'`
  - `is_verified = True`

#### AC 1.2: Doctor Card Information
- **Given** I am viewing the doctors list
- **When** a doctor card is displayed
- **Then** each card must show:
  - Doctor's full name
  - Profile picture (or placeholder if not available)
  - Specialization (with colored badge)
  - Years of experience
  - Rating (stars out of 5)
  - Practice location
  - "View Profile" button

#### AC 1.3: Responsive Grid Layout
- **Given** I am viewing the doctors list on any device
- **Then** the layout should be:
  - **Mobile** (< 640px): 1 column
  - **Tablet** (640px - 1024px): 2 columns
  - **Desktop** (> 1024px): 3 columns

#### AC 1.4: Pagination
- **Given** there are more than 10 doctors
- **When** I view the doctors list
- **Then** I should see:
  - Maximum 10 doctors per page
  - Pagination controls at the bottom
  - Current page indicator
  - "Previous" and "Next" buttons
  - Page numbers (1, 2, 3...)

#### AC 1.5: Loading State
- **Given** I navigate to the doctors page
- **When** the data is being fetched
- **Then** I should see:
  - Loading spinner or skeleton cards
  - "Loading doctors..." message

#### AC 1.6: Empty State
- **Given** there are no verified doctors in the system
- **When** I view the doctors page
- **Then** I should see:
  - Friendly empty state illustration
  - Message: "No doctors found. Please check back later."
  - Suggestion to check requirements if a doctor

### Technical Requirements
- API endpoint returns paginated results
- Frontend handles loading and error states
- Cards have hover effects for better UX
- Accessibility: keyboard navigation, screen reader support

---

## User Story 2: Search Doctors

### Story
**As a** patient  
**I want to** search for doctors by name or specialization  
**So that** I can quickly find specific healthcare professionals

### Story Points
**Complexity**: 5  
**Priority**: 🔴 Must Have (P0)

### Acceptance Criteria

#### AC 2.1: Search Input Visibility
- **Given** I am on the doctors page
- **When** the page loads
- **Then** I should see:
  - Prominent search bar at the top
  - Placeholder text: "Search by doctor name or specialization..."
  - Search icon inside input field

#### AC 2.2: Search by Doctor Name
- **Given** I enter a doctor's name in the search box
- **When** I type at least 2 characters
- **Then** the results should:
  - Filter to show only doctors whose name contains the search term
  - Be case-insensitive
  - Update in real-time (debounced by 300ms)

**Example:**
- Search: "john" → Shows: Dr. John Smith, Dr. Johnny Lee
- Search: "JOHN" → Shows: Same results (case-insensitive)

#### AC 2.3: Search by Specialization
- **Given** I enter a specialization in the search box
- **When** I type at least 2 characters
- **Then** the results should:
  - Filter to show doctors with matching specialization
  - Be case-insensitive
  - Match partial specialization names

**Example:**
- Search: "cardio" → Shows: Cardiologists
- Search: "neuro" → Shows: Neurologists, Neurosurgeons

#### AC 2.4: Combined Search
- **Given** I search for a term
- **When** the term matches both name AND specialization
- **Then** results should include doctors matching either criterion

#### AC 2.5: Clear Search
- **Given** I have entered a search term
- **When** I click the clear button (X icon)
- **Then** the search should:
  - Clear the input field
  - Show all doctors again
  - Reset to page 1

#### AC 2.6: No Results State
- **Given** I search for a term with no matches
- **When** the search returns 0 results
- **Then** I should see:
  - "No doctors found for '{search_term}'"
  - Suggestion: "Try different keywords or browse all doctors"
  - Button to clear search

#### AC 2.7: Search Persistence
- **Given** I have performed a search
- **When** I navigate to a doctor's detail page and return
- **Then** my search term should be preserved

### Technical Requirements
- Debounce search input (300ms) to avoid excessive API calls
- Search uses query parameter: `?search=term`
- Backend uses Django Q objects for OR queries
- Frontend updates URL with search params for sharing

---

## User Story 3: Filter Doctors

### Story
**As a** patient  
**I want to** filter doctors by various criteria  
**So that** I can find doctors that best match my specific needs

### Story Points
**Complexity**: 8  
**Priority**: 🟡 Should Have (P1)

### Acceptance Criteria

#### AC 3.1: Filter Panel Visibility
- **Given** I am on the doctors page
- **When** the page loads
- **Then** I should see:
  - Filter panel on the left sidebar (desktop)
  - Collapsible filter drawer (mobile/tablet)
  - "Filters" button to show/hide filters (mobile)

#### AC 3.2: Filter by Specialization
- **Given** I want to filter by specialization
- **When** I expand the specialization filter
- **Then** I should see:
  - List of all available specializations (checkboxes)
  - Specializations sorted alphabetically
  - Count of doctors per specialization (e.g., "Cardiology (5)")
  - "Select All" / "Clear All" options

**Behavior:**
- Select multiple specializations → Results show doctors matching ANY selected
- Unselect all → Show all doctors

#### AC 3.3: Filter by Location
- **Given** I want to filter by location
- **When** I expand the location filter
- **Then** I should see:
  - Dropdown or autocomplete input for city/area
  - List of popular locations
  - Option to enter custom location

**Behavior:**
- Filters doctors whose practice_location contains the selected location
- Case-insensitive matching

#### AC 3.4: Filter by Experience
- **Given** I want to filter by years of experience
- **When** I expand the experience filter
- **Then** I should see:
  - Checkbox options:
    - "0-5 years"
    - "5-10 years"
    - "10-20 years"
    - "20+ years"

**Behavior:**
- Can select multiple experience ranges
- Results show doctors matching ANY selected range

#### AC 3.5: Filter by Rating
- **Given** I want to filter by rating
- **When** I expand the rating filter
- **Then** I should see:
  - Radio buttons:
    - "4+ stars"
    - "3+ stars"
    - "2+ stars"
    - "1+ stars"
    - "All ratings"

**Behavior:**
- Only one rating filter active at a time
- Shows doctors with rating >= selected value

#### AC 3.6: Multiple Filters Applied
- **Given** I have selected multiple filters
- **When** filters are applied
- **Then** results should:
  - Match ALL filter criteria (AND logic between filter types)
  - Match ANY value within a filter type (OR logic within same type)

**Example:**
- Specialization: Cardiology OR Neurology
- Experience: 10-20 years OR 20+ years
- Rating: 4+ stars
→ Shows doctors who are (Cardio OR Neuro) AND (10-20 OR 20+) AND (rating >= 4)

#### AC 3.7: Active Filter Count
- **Given** I have applied filters
- **When** filters are active
- **Then** I should see:
  - Badge showing number of active filters
  - Example: "Filters (3)" if 3 filters are active

#### AC 3.8: Clear All Filters
- **Given** I have applied multiple filters
- **When** I click "Clear All Filters" button
- **Then** the page should:
  - Remove all filter selections
  - Show all doctors
  - Reset to page 1

#### AC 3.9: Filter Persistence
- **Given** I have applied filters
- **When** I refresh the page or share the URL
- **Then** the filters should:
  - Be preserved in the URL query params
  - Be automatically applied on page load

### Technical Requirements
- Filters use query parameters: `?specialization=Cardiology&experience=10-20&rating=4`
- Backend supports multiple query params
- Frontend updates URL without page reload
- Filter state managed in React state/URL

---

## User Story 4: View Doctor Details

### Story
**As a** patient  
**I want to** view detailed information about a specific doctor  
**So that** I can make an informed decision before booking an appointment

### Story Points
**Complexity**: 5  
**Priority**: 🔴 Must Have (P0)

### Acceptance Criteria

#### AC 4.1: Navigate to Detail Page
- **Given** I am viewing the doctors list
- **When** I click on a doctor card or "View Profile" button
- **Then** I should:
  - Navigate to `/doctors/{doctor_id}`
  - See the doctor's complete profile

#### AC 4.2: Hero Section
- **Given** I am on a doctor's detail page
- **When** the page loads
- **Then** the hero section should display:
  - Large profile picture (or placeholder)
  - Doctor's full name (bold, large font)
  - Specialization badge
  - Years of experience
  - Rating with star icons and number of reviews
  - Verification badge if verified
  - Practice location with icon

#### AC 4.3: About Section
- **Given** I am viewing the detail page
- **When** I scroll to the About section
- **Then** I should see:
  - Professional bio (full text)
  - License number
  - Verification status

#### AC 4.4: Education & Qualifications
- **Given** I am viewing the detail page
- **When** I scroll to the Education section
- **Then** I should see:
  - Qualifications (e.g., "MBBS, MD, PhD")
  - Educational background (institutions attended)
  - Formatted as a list or cards

#### AC 4.5: Experience Details
- **Given** I am viewing the detail page
- **When** I scroll to the Experience section
- **Then** I should see:
  - Total years of experience
  - Previous positions (if available)
  - Current practice location details

#### AC 4.6: Contact Information
- **Given** I am viewing the detail page
- **When** I scroll to the Contact section
- **Then** I should see:
  - Practice location (full address)
  - Phone number (if available)
  - Email (if public)
  - Map (future enhancement)

#### AC 4.7: Book Appointment CTA
- **Given** I am viewing the detail page
- **When** the page loads
- **Then** I should see:
  - Prominent "Book Appointment" button
  - Button should be sticky/floating for easy access
  - **Current Sprint**: Button shows "Coming Soon" or disabled
  - **Sprint 3**: Button will be functional

#### AC 4.8: Loading State
- **Given** I navigate to a doctor's detail page
- **When** data is being fetched
- **Then** I should see:
  - Skeleton loaders for content
  - Loading indicators

#### AC 4.9: Error Handling
- **Given** I navigate to a non-existent doctor ID
- **When** the doctor is not found
- **Then** I should see:
  - 404 error page
  - Message: "Doctor not found"
  - Button to return to doctors list

#### AC 4.10: Back Navigation
- **Given** I am on a doctor's detail page
- **When** I click the back button or breadcrumb
- **Then** I should:
  - Return to the doctors list
  - Preserve my previous search/filters

### Technical Requirements
- Use React Router for navigation
- Breadcrumbs: Home > Doctors > Dr. {Name}
- Meta tags for SEO
- Social sharing metadata
- Responsive design for all screen sizes

---

## User Story 5: Doctor Availability Status (Optional)

### Story
**As a** patient  
**I want to** see if a doctor is currently available or accepting patients  
**So that** I know if I can book an appointment

### Story Points
**Complexity**: 3  
**Priority**: 🟢 Nice to Have (P2)

### Acceptance Criteria

#### AC 5.1: Availability Badge
- **Given** I am viewing a doctor card or detail page
- **When** the doctor has availability status set
- **Then** I should see:
  - **Available**: Green badge "Accepting Patients"
  - **Busy**: Yellow badge "Limited Availability"
  - **Unavailable**: Red badge "Not Accepting New Patients"

#### AC 5.2: Default Status
- **Given** a doctor has not set availability status
- **When** displaying the doctor
- **Then** the default should be:
  - "Availability: Contact to Inquire"

### Technical Requirements
- Add `availability_status` field to DoctorInformation model
- Optional field (can be null)
- Choices: 'available', 'busy', 'unavailable'

---

## User Story 6: Doctor Ratings Display

### Story
**As a** patient  
**I want to** see doctor ratings and reviews  
**So that** I can gauge the quality of care based on other patients' experiences

### Story Points
**Complexity**: 3  
**Priority**: 🟢 Nice to Have (P2)

### Acceptance Criteria

#### AC 6.1: Rating Display on Card
- **Given** I am viewing the doctors list
- **When** a doctor has ratings
- **Then** each card should show:
  - Star icons (filled based on rating)
  - Average rating number (e.g., "4.5")
  - Number of reviews (e.g., "(23 reviews)")

#### AC 6.2: Rating Display on Detail Page
- **Given** I am viewing a doctor's detail page
- **When** the doctor has ratings
- **Then** I should see:
  - Large star display
  - Average rating (e.g., "4.5 out of 5")
  - Total number of reviews
  - Rating breakdown by stars (5★: 15, 4★: 5, etc.)

#### AC 6.3: No Ratings State
- **Given** a doctor has no ratings yet
- **When** displaying ratings
- **Then** I should see:
  - "No reviews yet"
  - "Be the first to review this doctor" (future)

### Technical Requirements
- Uses existing `rating_avg` field from DoctorInformation model
- Future sprint will add Review model for detailed reviews
- For now, display only the average rating

---

## Definition of Done

For each user story to be considered "Done", the following must be completed:

### Development
- [ ] Code implemented and follows project standards
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] Code reviewed and approved
- [ ] No critical or high-severity bugs

### Testing
- [ ] Manual testing completed
- [ ] All acceptance criteria verified
- [ ] Tested on multiple browsers (Chrome, Firefox, Safari)
- [ ] Tested on multiple devices (mobile, tablet, desktop)
- [ ] Accessibility testing completed (keyboard navigation, screen readers)

### Documentation
- [ ] API documentation updated
- [ ] Code comments added where necessary
- [ ] User documentation updated
- [ ] README updated if needed

### Deployment
- [ ] Merged to develop branch
- [ ] Passed CI/CD pipeline
- [ ] Deployed to staging environment
- [ ] Smoke tests passed

---

## Sprint Velocity

**Estimated Story Points**: 29 points  
**Sprint Duration**: 2 weeks (10 working days)  
**Daily Velocity Target**: ~3 points/day

### Story Point Breakdown
- S2-1: View All Doctors - 5 points
- S2-2: Search Doctors - 5 points
- S2-3: Filter Doctors - 8 points
- S2-4: View Doctor Details - 5 points
- S2-5: Availability Status - 3 points (optional)
- S2-6: Ratings Display - 3 points (optional)

**Core Features** (Must Have): 23 points  
**Optional Features** (Nice to Have): 6 points

---

**Created**: December 22, 2025  
**Last Updated**: December 22, 2025  
**Status**: Ready for Development
