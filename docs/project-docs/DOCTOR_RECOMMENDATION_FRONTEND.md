# Doctor Recommendation Feature - Frontend Implementation

**Date**: January 3, 2026  
**Branch**: feature/doctor-recommendation  
**Phase**: Frontend Development

---

## 📋 Overview

This document describes the implementation of the Doctor Recommendation feature in the frontend. Users can now input their symptoms and get personalized doctor recommendations based on their health concerns.

---

## 🎯 Feature Requirements

### User Story
> "As a patient, I want to input my symptoms and get recommendations for suitable doctors, so that I can book an appointment with the right specialist."

### Functional Requirements
1. ✅ Add "Get Doctor Recommendation" button in user profile (NOT in navbar)
2. ✅ Provide symptom input field with autocomplete/suggestions
3. ✅ Load symptoms from `symptoms_list.txt` (337 symptoms)
4. ✅ Allow users to search and filter symptoms
5. ✅ Support multiple symptom selection
6. ✅ Display selected symptoms with ability to remove
7. ✅ Provide quick-add buttons for common symptoms
8. ✅ Show symptom count and validation
9. ⏳ Call backend API to get doctor recommendations (TODO)
10. ⏳ Display recommended doctors with relevant information (TODO)

---

## 📁 Files Created/Modified

### New Files
1. **`frontend/src/components/DoctorRecommendation.jsx`**
   - Main component for doctor recommendation modal
   - Symptom search and selection interface
   - Multi-select symptom input with autocomplete
   - 337 symptoms loaded from data file

2. **`frontend/src/data/symptoms_list.txt`**
   - Complete list of 337 medical symptoms
   - Moved from root directory for better organization

### Modified Files
1. **`frontend/src/pages/ProfilePage.jsx`**
   - Added "Get Doctor Recommendation" button in profile header
   - Imported DoctorRecommendation component
   - Added modal state management
   - Added FiUsers icon

### Organized Files
1. **`docs/project-docs/SCRIPTS_README.md`**
   - Moved from root to keep root directory clean
   - Contains documentation about startup scripts

---

## 🎨 UI/UX Design

### Component Structure

```
DoctorRecommendation Modal
├── Header (Gradient background with title)
├── Info Alert (Usage instructions)
├── Selected Symptoms Section
│   └── Chip badges with remove buttons
├── Search Input
│   ├── Search icon
│   ├── Input field with placeholder
│   └── Dropdown with filtered results
├── Quick Add Common Symptoms
│   └── Predefined symptom buttons
└── Footer
    ├── Cancel button
    └── Get Recommendations button (with count badge)
```

### Color Scheme
- **Primary**: Green theme for health/wellness
- **Accent**: Primary blue for interactive elements
- **Alert**: Blue for information messages
- **Success**: Green for selected items
- **Error**: Red for removal actions

### Responsive Design
- Mobile-first approach
- Max width: 4xl (56rem)
- Max height: 90vh with scrollable content
- Flexible button layout (column on mobile, row on desktop)

---

## 💡 Features Implemented

### 1. Symptom Search with Autocomplete
```jsx
- Real-time filtering as user types
- Case-insensitive search
- Shows up to 50 results at a time
- Displays total count of available symptoms
- "No results" message when search yields nothing
```

### 2. Multi-Select Functionality
```jsx
- Users can select multiple symptoms
- Selected symptoms displayed as removable chips
- Checkmark icon indicates already selected items
- Disabled state for already selected symptoms in dropdown
```

### 3. Quick Add Common Symptoms
```jsx
Common symptoms available:
- Fever
- Headache
- Cough
- Sore throat
- Fatigue
- Nausea
- Dizziness
- Chest pain
```

### 4. User Feedback
```jsx
- Selected symptom count in badge
- Visual confirmation (checkmarks)
- Hover effects on all interactive elements
- Disabled state with appropriate styling
- Informational alert with instructions
```

### 5. Validation
```jsx
- Minimum 1 symptom required
- Button disabled when no symptoms selected
- Alert message if user tries to proceed without symptoms
```

---

## 🔧 Technical Implementation

### State Management
```jsx
const [symptoms, setSymptoms] = useState([]);              // Filtered symptoms
const [allSymptoms, setAllSymptoms] = useState([]);        // All 337 symptoms
const [selectedSymptoms, setSelectedSymptoms] = useState([]); // User's selection
const [searchQuery, setSearchQuery] = useState('');        // Search input
const [showDropdown, setShowDropdown] = useState(false);   // Dropdown visibility
```

### Data Loading
```jsx
// Load symptoms from text file
useEffect(() => {
  const symptomsList = symptomsData
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0);
  setAllSymptoms(symptomsList);
  setSymptoms(symptomsList);
}, []);
```

### Search Filtering
```jsx
useEffect(() => {
  if (searchQuery.trim() === '') {
    setSymptoms(allSymptoms);
  } else {
    const filtered = allSymptoms.filter(symptom =>
      symptom.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSymptoms(filtered);
  }
}, [searchQuery, allSymptoms]);
```

### Click Outside Handler
```jsx
// Close dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```

---

## 🚀 User Flow

### Step-by-Step Process

1. **Access Feature**
   - User logs in and navigates to Profile page
   - Clicks "Get Doctor Recommendation" button in profile header

2. **Select Symptoms**
   - Modal opens with symptom input interface
   - User can either:
     - Type to search specific symptoms
     - Use quick-add buttons for common symptoms
   - Selected symptoms appear as chips with remove option

3. **Review Selection**
   - User reviews selected symptoms (shown as count badge)
   - Can remove any symptom by clicking X button on chip
   - Can add more symptoms as needed

4. **Get Recommendations** (TODO - Backend Integration)
   - Click "Get Doctor Recommendations" button
   - System sends symptoms to backend API
   - Backend analyzes symptoms and returns matching doctors
   - Display recommended doctors with specialization info

5. **Close Modal**
   - User can close modal at any time via X button or Cancel

---

## 📊 Symptoms Data

### Statistics
- **Total Symptoms**: 337 unique medical symptoms
- **Categories**: General, respiratory, cardiac, neurological, gastrointestinal, etc.
- **Format**: Plain text file, one symptom per line
- **Location**: `frontend/src/data/symptoms_list.txt`

### Sample Symptoms
```
anxiety and nervousness
depression
shortness of breath
sharp chest pain
dizziness
insomnia
fever
headache
cough
sore throat
...
```

---

## 🔮 Next Steps (Backend Integration)

### API Endpoint (To Be Implemented)
```javascript
POST /api/v1/recommendations/doctors
Request Body:
{
  "symptoms": ["fever", "cough", "headache"],
  "user_id": 123
}

Response:
{
  "success": true,
  "recommendations": [
    {
      "doctor_id": 1,
      "name": "Dr. John Doe",
      "specialization": "General Physician",
      "match_score": 0.95,
      "reason": "Best match for fever and common cold symptoms",
      "availability": "Available today",
      "rating": 4.8
    },
    ...
  ]
}
```

### Frontend Integration Tasks
1. Create `recommendationService.js` API service
2. Add loading state during API call
3. Create DoctorRecommendationResults component
4. Display recommended doctors in card format
5. Add booking option for each recommended doctor
6. Handle API errors gracefully
7. Add recommendation history tracking

---

## 🎯 Testing Checklist

### Manual Testing
- [x] Modal opens when button clicked
- [x] Symptoms load correctly from file
- [x] Search filters symptoms in real-time
- [x] Can select multiple symptoms
- [x] Selected symptoms display as chips
- [x] Can remove selected symptoms
- [x] Quick-add buttons work
- [x] Dropdown closes when clicking outside
- [x] Button disabled when no symptoms selected
- [x] Modal closes properly
- [ ] API call sends correct data (pending backend)
- [ ] Recommendations display correctly (pending backend)

### Edge Cases
- [x] Empty search query shows all symptoms
- [x] No results message when search finds nothing
- [x] Cannot select same symptom twice
- [x] Selected symptoms persist during search
- [x] Dropdown shows limited results (50 max)

---

## 📱 Responsive Behavior

### Desktop (≥1024px)
- Modal width: 56rem (896px)
- Two-column button layout in footer
- Comfortable spacing and padding

### Tablet (768px - 1023px)
- Modal width: 90% of viewport
- Maintains two-column layout where possible
- Adjusted padding for touch targets

### Mobile (< 768px)
- Modal width: 95% of viewport
- Single-column button layout
- Larger touch targets
- Reduced padding for content visibility

---

## 🔐 Security Considerations

1. **Input Validation**
   - Symptoms validated against known list
   - No SQL injection risk (using predefined list)
   - XSS protection via React's built-in escaping

2. **Data Privacy**
   - Symptoms stored temporarily in component state
   - Not persisted until user confirms
   - Backend will handle secure storage

---

## 🎨 Styling Details

### CSS Classes Used
```jsx
// Tailwind CSS utility classes
- Layout: flex, grid, relative, absolute, fixed
- Spacing: p-{n}, m-{n}, gap-{n}
- Colors: bg-primary-{n}, text-{color}-{n}
- Borders: border-{n}, rounded-{size}
- Effects: shadow-{size}, hover:, transition-all
- Responsive: sm:, md:, lg:
```

### Custom Styles
- Gradient background for modal header
- Smooth transitions on all interactive elements
- Box shadows for depth perception
- Rounded corners for modern look

---

## 📚 Dependencies

### React Hooks Used
- `useState` - Component state management
- `useEffect` - Side effects (data loading, event listeners)
- `useRef` - DOM element references

### External Libraries
- `react-icons/fi` - Feather icons
- Tailwind CSS - Utility-first styling

### Data Imports
```jsx
import symptomsData from '../data/symptoms_list.txt?raw';
```
Note: Vite's `?raw` suffix imports file content as string

---

## 🐛 Known Issues

None at the moment. Component is working as expected for symptom selection UI.

---

## 📝 Code Quality

### Best Practices Implemented
- ✅ Component documentation with JSDoc comments
- ✅ Descriptive variable and function names
- ✅ Separation of concerns
- ✅ Reusable component structure
- ✅ Proper event handler cleanup
- ✅ Accessibility considerations (labels, aria attributes)
- ✅ Performance optimization (limited dropdown results)

### Code Organization
```
DoctorRecommendation.jsx (280 lines)
├── Imports (10 lines)
├── Component Definition (15 lines)
├── State Management (10 lines)
├── Effects (30 lines)
├── Event Handlers (40 lines)
└── JSX Rendering (175 lines)
```

---

## 🎓 Learning Points

### React Patterns Used
1. **Controlled Components** - Input value tied to state
2. **Conditional Rendering** - Show/hide based on state
3. **Event Delegation** - Efficient event handling
4. **Effect Cleanup** - Removing event listeners
5. **Refs for DOM Access** - Click outside detection

### UI/UX Patterns
1. **Autocomplete** - Real-time search suggestions
2. **Multi-select** - Chip-based selection display
3. **Quick Actions** - Common options readily available
4. **Progressive Disclosure** - Dropdown shows on focus
5. **Visual Feedback** - Disabled states, hover effects

---

## 📞 Support & Maintenance

### For Issues
- Check browser console for errors
- Verify symptoms_list.txt is properly loaded
- Ensure Tailwind CSS is working
- Test in different browsers (Chrome, Firefox, Safari)

### Future Enhancements
1. Add symptom categories/grouping
2. Implement symptom severity levels
3. Add symptom duration tracking
4. Include symptom descriptions/tooltips
5. Save symptom history for user
6. Add voice input for symptoms
7. Implement symptom synonyms/aliases
8. Add multi-language support

---

**Status**: ✅ Frontend UI Complete - Ready for Backend Integration  
**Next Phase**: Backend API Development for ML-based Doctor Recommendations

---

**Last Updated**: January 3, 2026  
**Author**: Development Team  
**Version**: 1.0.0
