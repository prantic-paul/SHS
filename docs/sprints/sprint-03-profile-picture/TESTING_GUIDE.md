# Profile Picture Persistence Testing Guide

## Issue Fixed
Profile pictures were not persisting after page reload or logout because localStorage was not being properly updated with the new image URL.

## Solution Implemented
1. Explicit localStorage update after successful upload
2. Server data refresh after upload
3. Force update of AuthContext with fresh data

## Testing Steps

### Test 1: Basic Upload and Persistence
1. **Login** to your account
2. **Go to Profile Page** (`/profile`)
3. **Upload a profile picture**:
   - Click the upload area or drag an image
   - See the preview
   - Click "Save Picture" button
   - Wait for success message: "Profile picture updated successfully!"

4. **Verify Immediate Display**:
   - ✅ Picture should be visible in the profile page
   - ✅ Picture should be in the circular avatar

5. **Test Page Refresh**:
   - Press F5 or reload the page
   - ✅ Picture should STILL be there
   - ✅ No "loading" flicker back to default avatar

6. **Test Navigation**:
   - Navigate to Home page
   - Navigate back to Profile page
   - ✅ Picture should STILL be there

7. **Test Logout/Login**:
   - Logout
   - Login again with same credentials
   - Go to Profile page
   - ✅ Picture should STILL be there

### Test 2: Doctor Profile Picture (If you're a doctor)
1. **Go to Profile Page**
2. **Find the "Doctor Profile Picture" section** (blue border, below user picture)
3. **Upload a doctor profile picture**:
   - Select/drag an image
   - Click "Save Picture"
   - Wait for success message

4. **Verify Doctor Picture**:
   - ✅ Doctor picture visible in profile
   - Refresh page
   - ✅ Doctor picture STILL there

5. **Verify in Doctor Search**:
   - Go to Home page
   - Search for doctors
   - ✅ Your doctor card should show YOUR profile picture

### Test 3: Database Verification
You can verify that the image is actually saved in the database:

```bash
# In terminal
cd /home/prantic/SHS/backend
source venv/bin/activate
python manage.py shell

# In Python shell
from apps.users.models import User
user = User.objects.get(email='your-email@example.com')
print(f"Profile Picture: {user.profile_picture}")
print(f"URL: {user.profile_picture.url if user.profile_picture else 'None'}")
```

Expected output:
```
Profile Picture: profile_pictures/20251122_102044_Xg3vh0I.jpg
URL: /media/profile_pictures/20251122_102044_Xg3vh0I.jpg
```

### Test 4: File System Verification
Check that the image file actually exists:

```bash
ls -la /home/prantic/SHS/backend/media/profile_pictures/
```

You should see your uploaded image files with timestamps.

### Test 5: localStorage Verification
Open browser DevTools (F12):

1. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
2. Find **Local Storage** → `http://localhost:5174`
3. Look for the `user` key
4. Click to expand the JSON
5. ✅ Should see `profile_picture: "/media/profile_pictures/your-image.jpg"`

### Test 6: Network Request Verification
1. Open DevTools (F12) → **Network** tab
2. **Upload a profile picture**
3. Look for the request to `/api/v1/users/profile/`
4. Click on it
5. Check **Response** tab
6. ✅ Should see the response includes `profile_picture` with the file path

### Test 7: Multiple Uploads
1. Upload a picture → Save
2. Upload a different picture → Save
3. Reload page
4. ✅ Should see the LATEST picture, not the first one

## Expected Results

### ✅ Success Indicators
- Picture visible immediately after upload
- Picture persists after page refresh
- Picture persists after navigation
- Picture persists after logout/login
- Success message shows after upload
- File exists in `/backend/media/profile_pictures/`
- Database has the correct file path
- localStorage has the correct file path
- API response includes the file path

### ❌ Failure Indicators
- Picture disappears after refresh
- Picture resets to default avatar
- Error message after clicking "Save Picture"
- No file in media directory
- Database shows `null` or empty string
- localStorage still has old data

## Common Issues and Solutions

### Issue: Picture disappears after refresh
**Cause**: localStorage not updated
**Solution**: Already fixed! The code now explicitly updates localStorage

### Issue: Picture shows but wrong image
**Cause**: Cache issue
**Solution**: 
```bash
# Clear browser cache
Ctrl + Shift + Delete → Clear cache

# Or hard refresh
Ctrl + F5
```

### Issue: "Failed to upload" error
**Possible causes**:
1. File too large (max 5MB)
2. Wrong file format (only PNG, JPG, JPEG)
3. Backend server not running
4. Network error

**Solution**:
```bash
# Check backend is running
lsof -ti:8000

# Restart backend if needed
cd /home/prantic/SHS/backend
source venv/bin/activate
python manage.py runserver
```

### Issue: Image broken/not loading
**Cause**: Media files not being served
**Solution**: 
```bash
# Check media directory permissions
ls -la /home/prantic/SHS/backend/media/

# Check Django settings
# Verify MEDIA_URL and MEDIA_ROOT are set correctly
```

## Technical Details

### What Happens When You Upload

1. **File Selection**:
   - File stored in component state
   - Preview shown using FileReader

2. **Click "Save Picture"**:
   - FormData created with file
   - PATCH request to `/api/v1/users/profile/`
   - File sent as multipart/form-data

3. **Backend Processing**:
   - Django receives file
   - Saves to `media/profile_pictures/`
   - Updates database with file path
   - Returns updated user data

4. **Frontend Processing**:
   - Receives response with new profile_picture URL
   - Updates profileData state
   - Updates AuthContext user
   - **EXPLICITLY updates localStorage**
   - Fetches fresh profile data from server
   - Shows success message

5. **On Page Reload**:
   - AuthContext reads from localStorage
   - User object includes profile_picture URL
   - ProfilePage fetches fresh data from API
   - Image displayed from server via `/media/` URL

## Verification Checklist

- [ ] Upload works without errors
- [ ] Picture visible immediately
- [ ] Picture persists after F5 refresh
- [ ] Picture persists after navigation away and back
- [ ] Picture persists after logout/login
- [ ] Doctor picture works (if applicable)
- [ ] Doctor picture shows in search results
- [ ] File exists in media directory
- [ ] Database has correct path
- [ ] localStorage has correct path
- [ ] Both buttons work (Save and Cancel)
- [ ] Success message appears
- [ ] No console errors

## Success!
If all tests pass, the profile picture feature is working correctly with full persistence! 🎉
