# Connecting All Agile Concepts - A Complete Example

**Created:** December 20, 2025  
**Purpose:** Show how ALL Agile concepts connect together with real examples

---

## 🎬 The Story: Building a Restaurant Booking App

Let me walk you through building a restaurant booking app from scratch, showing how EVERY concept connects.

---

## 📋 STAGE 0: THE BEGINNING (Before Any Planning)

### You Have an Idea
```
"I want to build an app where people can book restaurant tables online"
```

That's it! That's ALL you have. Now let's see how Agile helps you build it.

---

## 🚀 SPRINT 0: FOUNDATION (Week 1-2)

### Step 1: Problem Statement (Day 1)

**What You Do:**
Sit down and write CLEARLY what problem you're solving.

**Example:**
```
PROBLEM STATEMENT

Current Situation:
- People call restaurants to book tables
- Restaurants are busy, phones ring constantly
- Customers wait on hold for 10+ minutes
- No way to see available times
- Booking gets lost in manual registers

Problems:
1. Time-wasting for customers
2. Phone bills for restaurants
3. Booking errors
4. No confirmation system

Solution:
Build an online platform where customers can:
- See available tables
- Book instantly
- Get confirmation
- Manage bookings
```

**Output:** Problem statement document ✅

---

### Step 2: Identify User Base (Day 1)

**What You Do:**
List WHO will use your app.

**Example:**
```
USER BASE

Primary Users:
1. Customers (restaurant visitors)
   - Want to book tables
   - Want to see menus
   - Want to cancel/modify bookings

2. Restaurant Owners
   - Want to manage tables
   - Want to see bookings
   - Want to update menus

Future Users (maybe later):
3. Restaurant Staff (waiters)
4. Delivery drivers
```

**Output:** User types identified ✅

---

### Step 3: Requirements Engineering (Day 2-3)

**What You Do:**
List ALL features you MIGHT want to build (don't worry about order yet).

**Example:**
```
REQUIREMENTS (Brain Dump - Everything!)

Customer Features:
- Register account
- Login
- Search restaurants
- View restaurant details
- See available time slots
- Book a table
- Cancel booking
- Modify booking
- View booking history
- Rate restaurant
- Write reviews
- Save favorite restaurants

Restaurant Owner Features:
- Register restaurant
- Login
- Add restaurant details
- Upload menu
- Set table capacity
- Set opening hours
- View bookings
- Accept/reject bookings
- Manage availability
- View customer reviews
- Respond to reviews

System Features:
- Send email confirmations
- Send SMS reminders
- Payment processing
- Search and filters
- Map integration
```

**Output:** Complete requirements list (50+ items) ✅

**Connection:** This is your **Product Backlog** (raw form)

---

### Step 4: Initial Architecture Design (Day 4-5)

**Question:** Do I design EVERYTHING in detail?

**Answer:** NO! Only HIGH-LEVEL!

**What You Do:**
Draw boxes showing MAIN components (not implementation details).

**Example:**
```
HIGH-LEVEL ARCHITECTURE (Initial - Sprint 0)

┌─────────────┐
│  Customers  │
│  Owners     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Frontend   │ (React - what users see)
│  Website    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Backend    │ (Django - business logic)
│  API        │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Database   │ (PostgreSQL - store data)
│  Storage    │
└─────────────┘

Technology Choices:
- Frontend: React (why? good for SPAs)
- Backend: Django REST (why? Python, good for web APIs)
- Database: PostgreSQL (why? reliable, free)
```

**What You DON'T Design:**
- ❌ Exact API endpoints (/api/bookings/ POST)
- ❌ Database field types (VARCHAR(255))
- ❌ React component structure
- ❌ Authentication flow details
- ❌ Payment integration details

**Why Not?** You don't know exact requirements yet! You'll learn as you build.

**Output:** High-level architecture diagram ✅

---

### Step 5: Initial Database Schema (Day 5-6)

**Question:** Do I design ALL tables with ALL fields?

**Answer:** NO! Only CORE ENTITIES and RELATIONSHIPS!

**What You Do:**
Identify main "things" (entities) and how they connect.

**Example:**
```
INITIAL DATABASE SCHEMA (Sprint 0)

Core Entities:
1. User (people who use the app)
2. Customer (user type: books tables)
3. Restaurant (places where people eat)
4. Table (physical tables in restaurant)
5. Booking (reservation made by customer)

Relationships:
User → Customer (one-to-one)
User → Restaurant (one-to-one, owner)
Restaurant → Table (one-to-many, restaurant has many tables)
Customer → Booking (one-to-many, customer makes many bookings)
Restaurant → Booking (one-to-many, restaurant receives many bookings)
Table → Booking (one-to-many, table can be booked multiple times)

Simple Diagram:

    User
     ├─ Customer ──→ Booking ←── Table ←── Restaurant
     └─ Owner ────────────────────────────┘

That's it! Just boxes and arrows.
```

**What You DON'T Design:**
- ❌ Field names (first_name, last_name)
- ❌ Field types (VARCHAR, INTEGER)
- ❌ Constraints (NOT NULL, UNIQUE)
- ❌ Indexes for performance
- ❌ Sample data

**Why Not?** You'll add details when implementing each feature in sprints!

**Output:** Entity relationship diagram (simple, 1 page) ✅

---

### Step 6: Divide into Sprints (Day 6-7)

**What You Do:**
Take your requirements list and group them into sprints.

**Example:**
```
SPRINT BREAKDOWN

Sprint 0: Foundation (CURRENT)
- Setup project
- Choose technologies
- Initial architecture
- Initial database schema

Sprint 1: Authentication (2 weeks)
- User registration
- User login
- JWT tokens
Goal: Users can create accounts and login

Sprint 2: Restaurant Profiles (2 weeks)
- Restaurant registration
- Restaurant details
- Upload menu
- Set table capacity
Goal: Restaurants can create profiles

Sprint 3: Table Booking (3 weeks)
- Search restaurants
- View available times
- Make booking
- View booking
Goal: Customers can book tables

Sprint 4: Booking Management (2 weeks)
- Cancel booking
- Modify booking
- Booking history
- Email confirmations
Goal: Manage bookings easily

Sprint 5: Reviews & Ratings (2 weeks)
- Rate restaurant
- Write review
- View reviews
Goal: Customers can share feedback

Sprint 6: Polish (2 weeks)
- Testing
- Bug fixes
- Performance
- UI improvements
Goal: Production-ready app
```

**How to Decide Order:**
1. **Dependencies:** Login before Booking (can't book without account)
2. **Value:** Core features first (booking > reviews)
3. **Complexity:** Simple features first (login > payment)

**Output:** Sprint plan with goals ✅

---

### Step 7: Create Product Backlog (Day 7)

**What You Do:**
Organize your requirements list by priority.

**Example:**
```
PRODUCT BACKLOG (Prioritized)

MUST HAVE (Sprint 1-3):
1. User registration
2. User login
3. Restaurant registration
4. View available tables
5. Make booking
6. View booking

SHOULD HAVE (Sprint 4-5):
7. Cancel booking
8. Modify booking
9. Email confirmations
10. Write reviews
11. Rate restaurant

NICE TO HAVE (Sprint 6+):
12. SMS reminders
13. Payment integration
14. Map integration
15. Favorite restaurants
16. Social media sharing
```

**Output:** Prioritized product backlog ✅

---

## ✅ SPRINT 0 COMPLETE!

**What You Have Now:**
1. ✅ Problem statement (WHY we're building this)
2. ✅ User base identified (WHO will use it)
3. ✅ Requirements list (WHAT features we need)
4. ✅ High-level architecture (HOW system is structured)
5. ✅ Initial database schema (WHAT data entities exist)
6. ✅ Sprint plan (WHEN to build what)
7. ✅ Product backlog (ALL features prioritized)

**What You DON'T Have:**
- ❌ No code written
- ❌ No detailed designs
- ❌ No user stories yet (comes next!)

---

## 🏃 SPRINT 1: USER AUTHENTICATION (Week 3-4)

Now the REAL work begins! Let me show you how ONE sprint works.

### Day 1: Sprint Planning

**What You Do:**
Take features from product backlog and write user stories.

**Features for Sprint 1:**
- User registration
- User login

**Writing User Stories:**

**User Story 1:**
```
AS A customer
I WANT TO register an account
SO THAT I can book restaurant tables

Acceptance Criteria:
✓ Customer can enter email, password, name
✓ Email must be unique (no duplicates)
✓ Password must be 8+ characters
✓ System sends confirmation email
✓ Customer is redirected to login page

Estimation: 8 hours
```

**User Story 2:**
```
AS A customer
I WANT TO login to my account
SO THAT I can access my bookings

Acceptance Criteria:
✓ Customer can enter email and password
✓ System validates credentials
✓ Customer receives JWT token on success
✓ Customer is redirected to dashboard
✓ Error message for invalid credentials

Estimation: 6 hours
```

**User Story 3:**
```
AS A restaurant owner
I WANT TO register my restaurant
SO THAT customers can find and book tables

Acceptance Criteria:
✓ Owner can enter restaurant name, email, password
✓ Email must be unique
✓ Password must be 8+ characters
✓ Owner type is marked as 'restaurant_owner'
✓ Owner is redirected to restaurant setup

Estimation: 6 hours
```

**Output:** User stories with acceptance criteria ✅

**Sprint Goal:** "Enable users to register and login"

---

### Day 2: Technical Design Document (TDD)

**What You Do:**
NOW you add details! You know EXACTLY what you're building (user stories), so design it in detail.

**TDD Structure:**

#### Part 1: Scope
```
In Scope:
✓ User registration
✓ User login
✓ JWT token generation

Out of Scope:
✗ Password reset (Sprint 2)
✗ Social media login (Future)
✗ Email verification (Sprint 2)
```

#### Part 2: Detailed Database Design
```
NOW you add details!

User Table:
- id: INTEGER, PRIMARY KEY, AUTO_INCREMENT
- email: VARCHAR(255), UNIQUE, NOT NULL
- password: VARCHAR(255), NOT NULL (will be hashed)
- first_name: VARCHAR(100), NOT NULL
- last_name: VARCHAR(100), NOT NULL
- user_type: ENUM('customer', 'owner'), NOT NULL
- is_active: BOOLEAN, DEFAULT TRUE
- created_at: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP

Indexes:
- INDEX idx_email ON User(email) [for fast login lookup]

Constraints:
- Email must be valid format (regex validation)
- Password will be hashed with bcrypt
```

**See the difference?**
- Sprint 0: "We'll have a User entity"
- Sprint 1 TDD: "User table with id INTEGER PRIMARY KEY..."

#### Part 3: API Endpoints (Detailed)
```
POST /api/auth/register/
Description: Register new user
Request Body:
{
  "email": "user@example.com",
  "password": "securepass123",
  "first_name": "John",
  "last_name": "Doe",
  "user_type": "customer"
}
Response (201 Created):
{
  "message": "User registered successfully",
  "user_id": 1
}
Response (400 Bad Request):
{
  "error": "Email already exists"
}

POST /api/auth/login/
Description: User login
Request Body:
{
  "email": "user@example.com",
  "password": "securepass123"
}
Response (200 OK):
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "user_type": "customer"
  }
}
Response (401 Unauthorized):
{
  "error": "Invalid credentials"
}
```

#### Part 4: Implementation Plan
```
Backend Tasks (Django):
1. Create 'users' app
2. Create User model (with fields above)
3. Run migrations
4. Create UserSerializer (validation)
5. Create RegisterView (handle registration)
6. Create LoginView (handle login, generate JWT)
7. Configure JWT settings
8. Add URL routes
9. Test with Postman

Frontend Tasks (React):
10. Create RegisterPage component
11. Create form with validation
12. Connect to /api/auth/register/
13. Create LoginPage component
14. Create login form
15. Connect to /api/auth/login/
16. Store JWT token in localStorage
17. Create protected route wrapper
18. Test end-to-end flow

Estimated Total: 20 hours = ~2.5 days
```

**Output:** Complete TDD document (5-10 pages) ✅

---

### Day 3-10: Development

**What You Do:**
Follow your TDD step by step!

**Day 3:**
```
Task: Create User model
Time: 9 AM - 12 PM

git checkout -b feature/sprint-1-user-model
cd backend
python manage.py startapp users
# Edit models.py (add User model as per TDD)
python manage.py makemigrations
python manage.py migrate
git add .
git commit -m "feat: create User model with authentication fields"
git push origin feature/sprint-1-user-model
```

**Daily Standup (Every Morning, 15 min):**
```
Yesterday: Created User model, ran migrations
Today: Implement registration API endpoint
Blockers: None
```

**Day 4:**
```
Task: Implement registration endpoint
# Create serializers.py
# Create views.py (RegisterView)
# Add to urls.py
# Test with Postman
git commit -m "feat: add user registration endpoint"
```

**Day 5:**
```
Task: Implement login endpoint
# Create LoginView
# Configure JWT settings
# Test login flow
git commit -m "feat: add login endpoint with JWT"
```

**Day 6-7:**
```
Task: Frontend registration page
# Create RegisterPage.jsx
# Add form validation
# Connect to API
git commit -m "feat: add registration page"
```

**Day 8-9:**
```
Task: Frontend login page
# Create LoginPage.jsx
# Handle token storage
# Create protected routes
git commit -m "feat: add login page and auth flow"
```

**Day 10:**
```
Task: Testing everything
# Test registration
# Test login
# Test error cases
# Fix bugs
```

---

### Day 11: Testing

**What You Do:**
Write automated tests + manual testing.

**Unit Tests (Backend):**
```python
def test_user_registration_success():
    response = client.post('/api/auth/register/', {
        'email': 'test@example.com',
        'password': 'testpass123',
        'first_name': 'Test',
        'last_name': 'User',
        'user_type': 'customer'
    })
    assert response.status_code == 201
    assert 'user_id' in response.data

def test_duplicate_email_rejected():
    # Register first user
    client.post('/api/auth/register/', {...})
    # Try to register with same email
    response = client.post('/api/auth/register/', {...})
    assert response.status_code == 400
```

**Manual Testing:**
```
✓ Register with valid data → Success
✓ Register with invalid email → Error
✓ Register with short password → Error
✓ Register with duplicate email → Error
✓ Login with correct credentials → Success
✓ Login with wrong password → Error
✓ Token stored in localStorage → Success
✓ Protected routes work → Success
```

---

### Day 12: Sprint Review

**What You Do:**
Demo what you built!

**Demo Script:**
```
"Let me show you what we built in Sprint 1:

1. [Open app] This is the registration page
2. [Fill form] User enters email, password, name
3. [Click Register] System validates and creates account
4. [Show success] User gets confirmation message
5. [Navigate to login] This is the login page
6. [Enter credentials] User enters email and password
7. [Click Login] System validates and returns JWT token
8. [Show dashboard] User is logged in successfully
9. [Check localStorage] Token is stored here
10. [Try protected page] Only logged-in users can access

All acceptance criteria met! ✓"
```

**Feedback Collected:**
```
Stakeholder: "Great! Can we add password strength indicator?"
You: "Sure, I'll add to product backlog for Sprint 2"

Stakeholder: "Can users reset password?"
You: "Not yet, that's planned for Sprint 2"
```

---

### Day 13: Sprint Retrospective

**What You Do:**
Team reflection.

```
What Went Well:
✓ Clear TDD helped development
✓ No major blockers
✓ Good teamwork

What Didn't Go Well:
✗ Testing took longer than expected
✗ Forgot to design error messages initially

What To Improve:
→ Write tests while coding (not at end)
→ Include error message designs in TDD

Action Items:
→ Next sprint: Add "Error Handling" section to TDD template
→ Next sprint: Write tests as we code
```

---

## ✅ SPRINT 1 COMPLETE!

**What You Have:**
- ✅ Working user registration
- ✅ Working user login
- ✅ JWT authentication
- ✅ Code committed and merged
- ✅ Tests written
- ✅ Documentation updated

**Architecture/Database Changes:**
```
Initial (Sprint 0):
"We'll have a User entity"

After Sprint 1:
User table fully implemented with 10 fields
Authentication flow fully working
```

**Did architecture change?** 
- Mostly NO (followed initial design)
- Minor additions: Added 'updated_at' field (learned we needed it)

---

## 🏃 SPRINT 2: RESTAURANT PROFILES (Week 5-6)

Now you repeat the SAME process!

### Sprint Planning:
```
Features from backlog:
- Restaurant registration
- Restaurant profile creation
- Upload menu
- Set table capacity
```

### Write User Stories:
```
AS A restaurant owner
I WANT TO create my restaurant profile
SO THAT customers can find my restaurant
```

### Write TDD:
```
NOW you add details for Restaurant:

Restaurant Table:
- id: INTEGER, PRIMARY KEY
- owner_id: FOREIGN KEY → User(id)
- name: VARCHAR(255), NOT NULL
- address: TEXT, NOT NULL
- phone: VARCHAR(20)
...

API Endpoints:
POST /api/restaurants/
GET /api/restaurants/{id}/
PUT /api/restaurants/{id}/
```

### Develop → Test → Review → Retrospective

**Did database schema change?**
- YES! Added Restaurant table (was in initial design as concept)
- Added Menu table (new! learned we needed it after working on feature)
- Updated architecture doc to reflect changes

---

## 🎯 KEY INSIGHTS: Connecting Everything

### Connection Map:

```
Problem Statement
    ↓ (defines)
User Base
    ↓ (helps create)
Requirements Engineering (all features)
    ↓ (organized into)
Sprint Plan (which sprint builds what)
    ↓ (becomes)
Product Backlog (prioritized features)
    ↓ (selected for each sprint)
Sprint Planning
    ↓ (writes)
User Stories + Acceptance Criteria (WHAT to build)
    ↓ (designed in detail)
Technical Design Document (HOW to build)
    ↓ (guides)
Development (build it!)
    ↓ (verified by)
Testing (does it work?)
    ↓ (shown in)
Sprint Review (demo!)
    ↓ (improved via)
Sprint Retrospective (learn!)
    ↓ (influences)
Next Sprint Planning
    ↓
Repeat!
```

### The Flow in One Sentence:
```
You identify the problem → know your users → list all features →
plan sprints → each sprint: write stories → design details →
code → test → demo → improve → next sprint
```

---

## 🎨 Architecture & Database: Initial vs Incremental

### THE GOLDEN RULE:

**Sprint 0 (Initial):**
```
Design: CONCEPTS and RELATIONSHIPS
Level: "We'll have Users, Restaurants, Bookings"
Detail: 10%

Think of it as: Architectural blueprint of a house
(Shows rooms, not electrical wiring)
```

**Sprint 1+ (Incremental):**
```
Design: EXACT IMPLEMENTATION
Level: "User table: id INT PRIMARY KEY, email VARCHAR(255)..."
Detail: 100%

Think of it as: Construction plans
(Shows exactly where each wire goes)
```

### Example Evolution:

**Sprint 0 Architecture:**
```
Components:
- Frontend (React)
- Backend (Django)
- Database (PostgreSQL)

That's it! 1 page.
```

**After Sprint 1:**
```
Added details:
- Frontend: Login page, Register page components
- Backend: /api/auth/register/, /api/auth/login/ endpoints
- Database: User table fully defined

Architecture doc updated: Now 3 pages
```

**After Sprint 2:**
```
Added more:
- Frontend: Restaurant profile pages
- Backend: /api/restaurants/ endpoints
- Database: Restaurant, Menu tables defined

Architecture doc updated: Now 5 pages
```

**See the pattern?** It GROWS incrementally!

---

## 📝 Do I Update Architecture Every Sprint?

**YES!** But only for what changed.

**Process:**
```
End of each sprint:
1. Did we add new components? → Update architecture diagram
2. Did we add new tables? → Update database schema
3. Did design change from initial plan? → Document why in ADR

But: Keep it REAL (actual implementation), not future plans
```

---

## ✅ Summary: The Complete Picture

**Sprint 0 = Foundation (High-Level)**
- Problem statement (WHY)
- User base (WHO)
- Requirements (WHAT - all features)
- Initial architecture (HOW - concepts)
- Initial database (WHAT DATA - entities)
- Sprint plan (WHEN)
- Product backlog (PRIORITY)

**Each Sprint = Build + Learn**
- Sprint planning → User stories (WHAT exactly)
- TDD → Detailed design (HOW exactly)
- Daily standups → Progress check
- Development → Build it
- Testing → Verify it
- Sprint review → Demo it
- Retrospective → Improve it

**Architecture & Database:**
- Sprint 0: 10% detail (concepts)
- Sprint 1+: 100% detail (implementation)
- Updates: After each sprint (what changed)

---

**Does this connect everything for you?** 🎯

Let me know what's still unclear, and I'll explain with more examples!
