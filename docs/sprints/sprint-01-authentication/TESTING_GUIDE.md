# FIXES APPLIED - Testing Guide

## Issues Fixed

### 1. ✅ Landing Page Login/Profile Button
**Problem**: No login button visible on landing page, and after login it didn't show profile button
**Solution**: 
- Added conditional rendering: Shows "Login" button when not authenticated
- Shows "Profile" button when authenticated
- Button changes automatically based on auth state

### 2. ✅ Post-Login/Register Redirect
**Problem**: After login/register, users were redirected to profile page
**Solution**: 
- Changed redirect destination from `/profile` to `/` (home page)
- Now users see the landing page with "Profile" button after authentication

### 3. ✅ Doctor Verification Not Working
**Problem**: 
- Changing status to APPROVED in Django admin didn't update user role
- Status stayed as PENDING
- User role remained as PATIENT instead of changing to DOCTOR

**Root Cause**: 
- `save_model()` method was returning early without saving
- `is_verified` field was editable, causing conflicts

**Solution**:
- Made `is_verified` read-only in admin
- Fixed `save_model()` to properly call `approve()` method when status changes
- The `approve()` method now correctly:
  1. Sets status to 'APPROVED'
  2. Sets is_verified to True
  3. **Updates user.role from 'PATIENT' to 'DOCTOR'**
  4. Saves both doctor profile and user model

## How to Test

### Test 1: Login/Profile Button on Landing Page

**Before Login:**
1. Open http://localhost:5173
2. Check navbar - Should see "Login" button (not "Profile")
3. Click any section link (Doctors, Public Awareness, Contact) - button should stay "Login"

**After Login:**
1. Click "Login" button
2. Login with any existing user
3. Should redirect to home page (http://localhost:5173/)
4. Check navbar - Should now see "Profile" button instead of "Login"
5. Click "Profile" button - Should go to profile page

### Test 2: Registration Flow

1. Open http://localhost:5173
2. Click "Get Started" or "Register" button
3. Fill in all registration details
4. Click "Register"
5. **Expected**: Redirect to home page (/)
6. **Expected**: Navbar shows "Profile" button
7. Click "Profile" to verify account was created

### Test 3: Doctor Verification (MOST IMPORTANT)

**Step 1: Apply as Doctor**
1. Login/Register as a new user
2. Go to Profile page
3. Click "Apply as Doctor" button
4. Fill in all doctor information:
   - License Number: TEST123
   - Qualification: MBBS, MD
   - Education: Medical University Name
   - Specialization: Cardiology
   - Practice Location: City Hospital, Dhaka
   - Experience Years: 5
   - Bio: Brief description
5. Submit application

**Step 2: Verify Current State**
1. Check profile page - Should show:
   - Role badge: "PATIENT"
   - Doctor Profile section with status: "PENDING"
   - No "Edit Profile" button (only approved doctors can edit)

**Step 3: Approve in Django Admin**
1. Open http://localhost:8000/admin/
2. Login with admin credentials: admin@shs.com / admin123
3. Go to "Doctor Information" section
4. Find the application (should show STATUS: Pending)
5. Click on the application to open it
6. In the "Verification" section, change Status dropdown from "Pending" to **"Approved"**
7. Click "Save" button
8. **Expected**: Green success message: "Doctor [Name] approved successfully. User role updated to DOCTOR."

**Step 4: Verify Changes on Frontend**
1. Go back to frontend (http://localhost:5173)
2. Logout if needed, then login again as the doctor
3. Click "Profile" button
4. **Expected Results**:
   - ✅ Role badge should show: **"DOCTOR"** (not PATIENT)
   - ✅ Doctor Profile section should show:
     - Status badge: **"APPROVED"** (green background)
     - Verified badge: "Verified Doctor" with shield icon
     - **"Edit Profile" button should now be visible**
   - ✅ Can now edit doctor profile by clicking "Edit Profile"

**Step 5: Edit Doctor Profile**
1. Click "Edit Profile" in Doctor Profile section
2. Update any fields (Specialization, Experience, Bio, etc.)
3. Click "Save Changes"
4. **Expected**: Success message and profile updates are saved

### Test 4: Verify Database Changes

**Check User Role in Admin:**
1. In Django admin, go to "Users" section
2. Find the approved doctor user
3. Check the "Role" field
4. **Expected**: Should show **"DOCTOR"** (not "PATIENT")

**Check Doctor Status:**
1. In Django admin, go to "Doctor Information"
2. Find the approved doctor
3. **Expected**: 
   - Status: **APPROVED**
   - Is verified: ✅ (checkmark)
   - User role in related user: **DOCTOR**

## Quick Verification Checklist

- [ ] Landing page shows "Login" button when not logged in
- [ ] Login redirects to home page (/)
- [ ] Register redirects to home page (/)
- [ ] After auth, navbar shows "Profile" button
- [ ] Profile button click goes to /profile
- [ ] Can apply as doctor
- [ ] Application shows status: PENDING
- [ ] User role is PATIENT before approval
- [ ] Admin can change status to APPROVED
- [ ] Admin shows success message about role update
- [ ] After approval, user role changes to DOCTOR
- [ ] After approval, doctor status shows APPROVED
- [ ] After approval, "Verified Doctor" badge appears
- [ ] After approval, "Edit Profile" button appears
- [ ] Doctor can edit their professional information
- [ ] All changes persist after page reload

## Common Issues & Solutions

### Issue: Status stays PENDING after clicking Save
**Solution**: Make sure you changed the dropdown to "Approved" before clicking Save

### Issue: Role still shows PATIENT
**Solution**: 
1. Logout and login again to refresh the session
2. Check in Django admin that user.role is actually "DOCTOR"
3. If still wrong, the server may need restart

### Issue: Can't edit doctor profile
**Solution**: Only APPROVED doctors can edit. Check that:
1. Status is APPROVED (not PENDING)
2. User role is DOCTOR
3. You're logged in as that doctor

### Issue: Changes not saving
**Solution**: 
1. Check browser console for errors
2. Verify backend server is running on port 8000
3. Check that JWT token is valid (logout and login again)

## Technical Details

### Backend Changes
**File**: `/backend/apps/users/admin.py`
- Made `is_verified` read-only
- Fixed `save_model()` method to call `approve()` properly
- Added success messages with proper levels

### Frontend Changes
**Files**:
- `/frontend/src/pages/HomePage.jsx` - Added conditional Login/Profile button with FiUser icon
- `/frontend/src/pages/LoginPage.jsx` - Changed redirect from '/profile' to '/'
- `/frontend/src/pages/RegisterPage.jsx` - Changed redirect from '/profile' to '/'

### API Endpoints Working
- ✅ POST /api/v1/auth/login/ - Login and get JWT token
- ✅ POST /api/v1/auth/register/ - Register new user
- ✅ GET /api/v1/users/profile/ - Get user profile with doctor info
- ✅ PATCH /api/v1/users/profile/ - Update user basic info
- ✅ POST /api/v1/doctors/apply/ - Submit doctor application
- ✅ PATCH /api/v1/doctors/profile/ - Update doctor professional info

## Expected Behavior Summary

1. **Unauthenticated User**:
   - Sees "Login" button on landing page
   - Can register or login
   - After auth, redirects to home page with "Profile" button

2. **Patient User**:
   - Role badge shows "PATIENT"
   - Can apply as doctor
   - After applying, status is "PENDING"
   - Cannot edit doctor profile yet

3. **Doctor (Approved)**:
   - Role badge shows "DOCTOR"
   - Status shows "APPROVED" with green badge
   - "Verified Doctor" badge appears
   - Can edit professional information
   - All edits save successfully

## Success Indicators

✅ **All Fixed Successfully If:**
1. Login button appears on landing page for guests
2. Profile button appears after authentication
3. Login/Register redirect to home page
4. Admin approval changes user role to DOCTOR
5. Doctor status changes to APPROVED
6. Verified badge appears
7. Edit Profile button becomes available
8. All database changes persist correctly

---

**Last Updated**: December 21, 2025
**Status**: All issues resolved ✅
**Servers Running**:
- Backend: http://localhost:8000
- Frontend: http://localhost:5173
- Admin: http://localhost:8000/admin/
