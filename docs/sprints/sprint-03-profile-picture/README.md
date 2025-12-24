# Sprint 3: Profile Picture Upload Feature

## Overview
This sprint implements user profile picture upload functionality with a modern, intuitive interface.

## User Story
**As a user**, I want to upload and manage my profile picture so that I can personalize my account and be easily identified by doctors and other users.

## Features Implemented

### 1. Backend (Django)
- ✅ Added `profile_picture` ImageField to User model
- ✅ Configured media file serving with `MEDIA_URL` and `MEDIA_ROOT`
- ✅ Updated `UserProfileSerializer` to include profile picture
- ✅ Added `MultiPartParser` and `FormParser` for file uploads
- ✅ Created database migration for profile_picture field
- ✅ Updated `DoctorListSerializer` and `DoctorDetailSerializer` to show profile_picture as fallback
- ✅ Added `profile_image` support to `DoctorProfileUpdateSerializer`

### 2. Frontend (React)
- ✅ Created `ProfilePictureUpload` component with:
  - Drag-and-drop file upload
  - Click to upload file selector
  - Image preview before upload
  - File validation (type and size)
  - Loading states
  - Upload success feedback
- ✅ Integrated component into ProfilePage sidebar
- ✅ Added separate upload sections for:
  - User profile picture (appears in account settings)
  - Doctor profile picture (appears in search results)
- ✅ Updated `userService` to handle FormData for file uploads
- ✅ Removed "Upcoming Features" section from profile
- ✅ Doctor cards display profile pictures with fallback to user profile_picture

### 3. Improvements
- Clean, modern UI with hover effects
- Real-time preview of selected image
- Maximum file size: 5MB
- Supported formats: PNG, JPG, JPEG
- Responsive design
- Clear labeling for user vs doctor profile pictures
- Automatic upload on file selection
- Visual feedback during upload

## Technical Details

### Database Schema
```python
profile_picture = models.ImageField(
    upload_to='profile_pictures/',
    blank=True,
    null=True,
    help_text='User profile picture'
)
```

### API Endpoint
- **PATCH** `/api/v1/users/profile/`
- Content-Type: `multipart/form-data`
- Field: `profile_picture` (File)

### File Upload Process
1. User selects/drops image file
2. Frontend validates file type and size
3. Preview shown to user
4. File sent as FormData to backend
5. Django saves file to `media/profile_pictures/`
6. URL returned in response
7. Profile updated with new picture

## Migration
```bash
# Create migration
python manage.py makemigrations

# Apply migration
python manage.py migrate
```

## Testing Checklist
- [ ] Upload PNG image to user profile
- [ ] Upload JPG image to user profile
- [ ] Upload JPEG image to user profile
- [ ] Try uploading non-image file (should fail)
- [ ] Try uploading file > 5MB (should fail)
- [ ] Verify user image appears on profile after upload
- [ ] Verify image persists after page reload
- [ ] Test drag-and-drop functionality
- [ ] Test click-to-upload functionality
- [ ] For doctors: Upload doctor profile picture
- [ ] For doctors: Verify doctor image appears in search results
- [ ] For doctors: Verify fallback to user profile_picture if no doctor image
- [ ] Verify upload success feedback message appears

## Git Workflow
```bash
# Created feature branch
git checkout -b feature/user-profile-picture

# Made changes and committed
git add -A
git commit -m "feat: add profile picture upload feature"

# Pushed to GitHub
git push -u origin feature/user-profile-picture
```

## Files Changed
1. `backend/apps/users/models/user.py` - Added profile_picture field
2. `backend/config/settings.py` - Added MEDIA_URL and MEDIA_ROOT
3. `backend/config/urls.py` - Added media file serving in development
4. `backend/apps/users/serializers/user.py` - Updated serializers
5. `backend/apps/users/views/user.py` - Added MultiPartParser
6. `backend/apps/doctors/serializers.py` - Added profile_image fallback to profile_picture
7. `backend/apps/users/serializers/doctor.py` - Added profile_image field
8. `frontend/src/components/ProfilePictureUpload.jsx` - New component
9. `frontend/src/pages/ProfilePage.jsx` - Integrated upload, removed upcoming features, added doctor upload
10. `frontend/src/services/userService.js` - Added FormData support for both endpoints

## Next Steps
- Merge feature branch into sprint-2 branch
- Test in staging environment
- Deploy to production
- Monitor for any issues
