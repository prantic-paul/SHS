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

## User Story 5: Doctor Availability Status

### Story
**As a** patient  
**I want to** see if a doctor is currently available or accepting patients  
**So that** I know if I can book an appointment

### Story Points
**Complexity**: 2  
**Priority**: � Must Have (P0)

### Acceptance Criteria

#### AC 5.1: Availability Badge Display
- **Given** I am viewing a doctor card or detail page
- **When** the doctor information is displayed
- **Then** I should see:
  - **Red badge** with text "Not Accepting New Patients" (default for all doctors)

#### AC 5.2: Default Unavailable Status
- **Given** no appointment system is implemented yet
- **When** displaying any doctor
- **Then** all doctors should show:
  - `availability_status = 'unavailable'` by default
  - Red badge indicating "Not Accepting New Patients"
  - Message: "Appointment booking coming soon in Sprint 3"

#### AC 5.3: Badge Styling
- **Given** I am viewing the availability badge
- **Then** the badge should:
  - Be prominently displayed on both card and detail page
  - Use red color (#EF4444 or similar) for unavailable status
  - Have clear, readable text
  - Include an icon (e.g., calendar-x or clock icon)

### Technical Requirements
- Add `availability_status` field to DoctorInformation model
- Default value: 'unavailable'
- Choices: 'available', 'busy', 'unavailable'
- Migration to set all existing doctors to 'unavailable'
- Future sprints will enable doctors to update their status

---

## User Story 6: Doctor Ratings Display & Submission

### Story
**As a** patient  
**I want to** view and submit ratings for doctors  
**So that** I can share my experience and help other patients make informed decisions

### Story Points
**Complexity**: 5  
**Priority**: � Must Have (P0)

### Acceptance Criteria

#### AC 6.1: Rating Display on Card
- **Given** I am viewing the doctors list
- **When** a doctor card is displayed
- **Then** each card should show:
  - Star icons (5 stars, filled/half-filled/empty based on rating)
  - Average rating number (e.g., "4.5")
  - Number of reviews (e.g., "(23 reviews)")
  - Visual star representation using gold/yellow color (#FFC107)

#### AC 6.2: Rating Display on Detail Page
- **Given** I am viewing a doctor's detail page
- **When** the page loads
- **Then** I should see:
  - Large star display (5 stars with current rating highlighted)
  - Average rating (e.g., "4.5 out of 5")
  - Total number of reviews
  - Rating breakdown by stars (5★: 15, 4★: 5, 3★: 2, 2★: 1, 1★: 0)
  - Progress bars showing percentage of each star rating

#### AC 6.3: No Ratings State
- **Given** a doctor has no ratings yet (rating_avg = 0.0)
- **When** displaying ratings
- **Then** I should see:
  - Empty stars (outline only)
  - "No reviews yet"
  - Message: "Be the first to rate this doctor"

#### AC 6.4: Submit Rating Form (Authenticated Users)
- **Given** I am a logged-in patient
- **When** I am on a doctor's detail page
- **Then** I should see:
  - "Rate this Doctor" section
  - 5 interactive stars (clickable/hoverable)
  - Optional text review field (200 chars max)
  - "Submit Rating" button

#### AC 6.5: Rating Submission Interaction
- **Given** I am submitting a rating
- **When** I hover over stars
- **Then** stars should:
  - Highlight up to the hovered star
  - Show tooltip with rating value (1-5)
  - Change color on hover (gold to darker gold)

- **When** I click on a star (e.g., 4th star)
- **Then** the rating should:
  - Be selected and persist
  - Show "You selected 4 stars" message
  - Enable the submit button

#### AC 6.6: Rating Submission Validation
- **Given** I am submitting a rating
- **When** I click "Submit Rating"
- **Then** the system should:
  - Validate that a star rating is selected (1-5)
  - Show error if no rating selected: "Please select a star rating"
  - Validate review text is ≤200 characters
  - Show loading state during submission

#### AC 6.7: Successful Rating Submission
- **Given** I submitted a valid rating
- **When** submission is successful
- **Then** I should see:
  - Success message: "Thank you for your feedback!"
  - Updated average rating immediately
  - Updated review count
  - My rating shown in "Your Rating" section
  - Rating form replaced with "You rated this doctor" message

#### AC 6.8: One Rating Per User Per Doctor
- **Given** I have already rated a doctor
- **When** I view that doctor's detail page again
- **Then** I should see:
  - "Your Rating: ★★★★☆ (4 stars)" section
  - "Edit Rating" button (to modify my existing rating)
  - No new rating form (prevent duplicate ratings)

#### AC 6.9: Guest User Rating Restriction
- **Given** I am not logged in (guest user)
- **When** I view a doctor's detail page
- **Then** I should see:
  - Ratings display (read-only)
  - Message: "Please log in to rate this doctor"
  - "Log In" button that redirects to login page

#### AC 6.10: Rating Calculation Update
- **Given** a new rating is submitted
- **When** the rating is saved
- **Then** the system should:
  - Recalculate the doctor's average rating
  - Update `rating_avg` field
  - Update `rating_count` field
  - Reflect changes immediately on both list and detail pages

### Technical Requirements
- Create `Rating` model with fields:
  - `doctor` (ForeignKey to DoctorInformation)
  - `user` (ForeignKey to User)
  - `rating` (IntegerField, choices 1-5)
  - `review_text` (TextField, optional, max 200 chars)
  - `created_at`, `updated_at`
  - Unique constraint: (doctor, user) - one rating per user per doctor
- Add `rating_count` field to DoctorInformation model
- API endpoint: POST /api/v1/doctors/{id}/ratings/
- API endpoint: GET /api/v1/doctors/{id}/ratings/ (list all ratings)
- API endpoint: PUT /api/v1/doctors/{id}/ratings/{rating_id}/ (update own rating)
- Implement signal to update doctor's rating_avg when new rating submitted
- Frontend: Star rating component (interactive)
- Frontend: Rating display component (read-only)
- Validation: Authenticated users only can submit ratings

---

## User Story 7: Rating Breakdown & Statistics (Optional)

### Story
**As a** patient  
**I want to** see detailed rating statistics for a doctor  
**So that** I can understand the distribution of patient feedback

### Story Points
**Complexity**: 2  
**Priority**: 🟢 Nice to Have (P2)

### Acceptance Criteria

#### AC 7.1: Rating Breakdown Chart
- **Given** I am viewing a doctor's detail page with ratings
- **When** the ratings section loads
- **Then** I should see:
  - Horizontal bar chart showing distribution of ratings
  - Each row: star level (5★, 4★, 3★, 2★, 1★)
  - Percentage bar (filled according to percentage)
  - Count number next to each bar (e.g., "15 ratings")

#### AC 7.2: Recent Reviews Display
- **Given** a doctor has reviews with text
- **When** I scroll to the reviews section
- **Then** I should see:
  - List of most recent 5 reviews
  - Each review showing: star rating, review text, user name, date
  - "Load More" button if more than 5 reviews exist

#### AC 7.3: Helpful Reviews Sorting
- **Given** multiple reviews exist
- **When** viewing the reviews
- **Then** I should be able to:
  - Sort by: "Most Recent", "Highest Rated", "Lowest Rated"
  - See reviews update based on selected sort option

### Technical Requirements
- Add aggregation query to count ratings by star level
- Calculate percentages for bar chart
- Implement pagination for reviews (5 per page)
- Add sorting functionality for reviews list

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

**Estimated Story Points**: 32 points  
**Sprint Duration**: 2 weeks (10 working days)  
**Daily Velocity Target**: ~3.2 points/day

### Story Point Breakdown
- S2-1: View All Doctors - 5 points
- S2-2: Search Doctors - 5 points
- S2-3: Filter Doctors - 8 points
- S2-4: View Doctor Details - 5 points
- S2-5: Availability Status - 2 points (must have)
- S2-6: Ratings Display & Submission - 5 points (must have)
- S2-7: Rating Breakdown & Statistics - 2 points (optional)

**Core Features** (Must Have): 30 points  
**Optional Features** (Nice to Have): 2 points

---

**Created**: December 22, 2025  
**Last Updated**: December 22, 2025  
**Status**: Ready for Development
