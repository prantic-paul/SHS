# Profile Picture Feature - User Guide

## Where to Find Profile Picture Settings

### For All Users

1. **Navigate to Profile Page**
   - Click on your name/avatar in the navbar
   - Or go to `/profile` URL directly

2. **Find Profile Picture Section**
   - Look at the **right sidebar**
   - You'll see a card titled **"User Profile Picture"**
   - This section includes:
     - Current profile picture display (circular avatar)
     - Drag-and-drop upload area
     - Click to upload option
     - File format and size limits

3. **Upload Your Picture**
   - **Method 1: Drag & Drop**
     - Drag an image file from your computer
     - Drop it on the upload area
     - Image uploads automatically
   
   - **Method 2: Click to Select**
     - Click anywhere on the profile picture or upload area
     - Select an image from your computer
     - Image uploads automatically

4. **See Confirmation**
   - While uploading: "Uploading and saving..." message
   - After success: "✓ Profile picture updated successfully" message

### For Doctors (Additional Section)

If you're a doctor, you'll see **TWO** profile picture sections:

1. **User Profile Picture** (top section)
   - This is your general account profile picture
   - Used in account settings and general app areas

2. **Doctor Profile Picture** (blue-bordered section below)
   - This is specifically for your doctor profile
   - **This is what patients see in doctor search results**
   - **This appears on your doctor card**
   - If not set, the system uses your user profile picture as fallback

## Where Profile Pictures Appear

### User Profile Picture Shows In:
- Profile page header
- Account dropdown menu
- User settings

### Doctor Profile Picture Shows In:
- Doctor search results cards
- Doctor detail page
- Doctor listings
- Appointment bookings

## Important Notes

1. **Automatic Upload**: Pictures upload **immediately** when selected - no need to click "Save"

2. **File Requirements**:
   - Formats: PNG, JPG, JPEG only
   - Max size: 5MB
   - Recommended: Square images (e.g., 500x500px) for best display

3. **Two Pictures for Doctors**:
   - User picture: Your personal account picture
   - Doctor picture: Your professional picture for patients
   - They can be the same or different images

4. **Fallback System**:
   - If doctor picture is not set, user picture is shown
   - If no pictures are set, a default avatar with your initial is shown

## Troubleshooting

**Q: I don't see the upload section**
- Make sure you're logged in
- Navigate to Profile page (`/profile`)
- Check the right sidebar

**Q: Upload is not working**
- Check file size (must be < 5MB)
- Check file format (PNG, JPG, JPEG only)
- Check browser console for errors
- Try a different image

**Q: Picture not showing in doctor search**
- Make sure you uploaded to "Doctor Profile Picture" section (blue border)
- Refresh the page after upload
- Clear browser cache if needed

**Q: I'm a doctor but only see one upload section**
- Make sure your doctor application is approved
- Log out and log back in
- Check your role in Account Details section

## Quick Access

- **Profile Page**: Click your name in navbar → Profile
- **Direct URL**: http://localhost:5174/profile
- **Doctor Search**: Home page → Search doctors
