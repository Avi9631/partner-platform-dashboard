# ListDeveloper V2 Implementation

## Overview

This implementation creates a complete multi-step form system for adding and managing developer partners, following the same architecture as ListProperty V2.

## Architecture

### 1. **Multi-Step Form Flow**
- **Step 1:** Basic Information (name, type, established year, etc.)
- **Step 2:** Contact Information (email, phone, address)
- **Step 3:** Projects & Portfolio (completed/ongoing projects, statistics)
- **Step 4:** Certifications & Awards (optional)
- **Step 5:** Media & Documents (optional)
- **Step 6:** Review & Submit

### 2. **Core Components**

#### Context Provider (`DeveloperFormContextV2.jsx`)
- Manages form state across all steps
- Handles draft creation and updates
- Provides navigation methods (next, previous, goToStep)
- Tracks completed steps and progress

#### Form Sheet (`DeveloperFormSheetV2.jsx`)
- Right-side slide-in overlay for the form
- Renders current step dynamically
- Prevents accidental closure with confirmation dialog

#### Step Configuration (`stepConfiguration.js`)
- Defines all available steps
- Controls step visibility based on form data
- Provides helper functions for step management

#### Step Components
Each step is a self-contained component with:
- Schema-based validation (Zod)
- Form state management (React Hook Form)
- Save & Continue functionality
- Previous/Next navigation

### 3. **Data Flow**

```
ListDeveloperV2 Page
  ↓
  Creates Draft (API Call)
  ↓
  Opens DeveloperFormSheetV2
  ↓
  DeveloperFormContextV2 (State Management)
  ↓
  Step Components (Form UI)
  ↓
  Save & Continue (Auto-save to Backend)
  ↓
  Review & Submit (Final Submission)
```

### 4. **API Integration**

#### Developer Draft Service (`developerDraftService.js`)
- `createDeveloperDraft()` - Create new draft
- `updateDeveloperDraft()` - Update existing draft
- `getUserDeveloperDrafts()` - Fetch all user drafts
- `submitDeveloperDraft()` - Submit for review
- `deleteDeveloperDraft()` - Delete draft

**Note:** Backend endpoints need to be implemented to match these API calls.

### 5. **Validation Schemas**

#### basicInfoSchema.js
- Developer name (required, 2-100 chars)
- Developer type (enum of 6 types)
- Description (optional, 50-1000 chars)
- Established year (1900 - current year)
- Registration numbers (optional)

#### contactInfoSchema.js
- Primary contact (name, email, phone) - all required
- Secondary contact (optional)
- Office address (required)
- City, State, Pincode (required)
- Website, LinkedIn (optional)

#### projectsSchema.js
- Total projects (completed/ongoing)
- Total units delivered
- Total sq.ft. developed
- Project types (multi-select)
- Specializations (array)
- Operating cities/states (arrays)

#### certificationsSchema.js
- ISO certifications
- Awards
- Green building certifications
- Memberships
- Other certifications

#### mediaSchema.js
- Logo, cover image
- Brochure, company profile
- Project images (max 20)
- Video links (max 5)

## Usage

### Sheet Overlay (Sidebar)

```jsx
import { DeveloperFormSheetV2 } from '@/modules/listDeveloper/v2';

function MyComponent() {
  const [showForm, setShowForm] = useState(false);
  const [draftId, setDraftId] = useState(null);

  const handleAddDeveloper = async () => {
    // Create draft first
    const response = await developerDraftApi.createDeveloperDraft({
      status: 'draft',
      formData: {},
    });
    
    if (response.success) {
      setDraftId(response.data.draftId);
      setShowForm(true);
    }
  };

  return (
    <>
      <button onClick={handleAddDeveloper}>Add Developer</button>
      <DeveloperFormSheetV2 
        open={showForm} 
        onOpenChange={setShowForm}
        initialDraftId={draftId}
      />
    </>
  );
}
```

### Full Page View (Dedicated Route)

```jsx
import { DeveloperFormPageV2 } from '@/modules/listDeveloper/v2';
import { Routes, Route } from 'react-router-dom';

// In your routes
<Route path="/developer/edit/:draftId" element={<DeveloperFormPageV2 />} />

// Navigate with draft ID in URL
navigate(`/developer/edit/${draftId}`);
```

### With Legacy Draft Editing

```jsx
<DeveloperFormSheetV2 
  open={isOpen} 
  onOpenChange={setIsOpen}
  editingDraft={draftData}
/>
```

### Using Context and Configuration

```jsx
import { 
  useDeveloperFormV2,
  getStepName,
  isStepVisible,
  getStepIndexById 
} from '@/modules/listDeveloper/v2';

function CustomComponent() {
  const { 
    formData, 
    currentStep, 
    isLoadingDraft,
    draftId 
  } = useDeveloperFormV2();
  
  // Get current step name
  const stepName = getStepName(currentStep, formData);
  
  // Check if media step is visible
  const showMedia = isStepVisible('media', formData);
  
  // Get step index by ID
  const reviewIndex = getStepIndexById('review-submit', formData);
}
```

## Key Features

### ✅ Implemented
- Multi-step wizard with progress tracking
- Auto-save on each step
- Form validation with Zod
- Responsive design
- Draft management with URL-based loading
- Review & edit functionality
- Empty states and loading states
- Error handling with toast notifications
- **Draft loading from URL** (`initialDraftId` param)
- **Legacy draft editing support** (`editingDraft` prop)
- **Full-page variant** (`DeveloperFormPageV2`)
- **Enhanced footer** with motion animations
- **Loading spinner** during draft fetch
- **Step utility functions** (`getStepName`, `isStepVisible`, `getStepIndexById`)

### 🚧 To Be Enhanced
- File upload functionality for media
- Rich text editor for descriptions
- Multi-select components for arrays
- Image preview and cropping
- Real-time validation
- Step-by-step help tooltips

## Comparison with ListProperty

| Feature | ListProperty | ListDeveloper | Notes |
|---------|--------------|---------------|-------|
| Dynamic Steps | ✅ (based on property type) | ❌ (linear flow) | Could be enhanced |
| Schema Validation | ✅ | ✅ | Both use Zod |
| Auto-save | ✅ | ✅ | On each step |
| Review Page | ✅ | ✅ | Edit any section |
| File Uploads | ✅ | 🚧 | To be implemented |
| Step Count | 14-16 | 6 | Simpler flow |

## File Structure

```
listDeveloper/
├── README.md                             # This documentation
├── schemas/                              # Zod validation schemas
│   ├── basicInfoSchema.js                # Developer name, type, established year
│   ├── contactInfoSchema.js              # Email, phone, address
│   ├── projectsSchema.js                 # Projects and portfolio stats
│   ├── certificationsSchema.js           # Certifications and awards
│   └── mediaSchema.js                    # Logo, images, documents
└── v2/
    ├── components/
    │   ├── DeveloperFormSheetV2.jsx      # Sheet overlay container
    │   ├── DeveloperFormPageV2.jsx       # Full-page container (NEW!)
    │   ├── SaveAndContinueFooter.jsx     # Enhanced footer with animations
    │   └── steps/
    │       ├── BasicInfoStepV2.jsx       # Step 1: Basic info
    │       ├── ContactInfoStepV2.jsx     # Step 2: Contact details
    │       ├── ProjectsStepV2.jsx        # Step 3: Projects & portfolio
    │       ├── CertificationsStepV2.jsx  # Step 4: Certifications
    │       ├── MediaStepV2.jsx           # Step 5: Media & documents
    │       └── ReviewAndSubmitV2.jsx     # Step 6: Review & submit
    ├── config/
    │   └── stepConfiguration.js          # Step definitions & utility functions
    ├── context/
    │   └── DeveloperFormContextV2.jsx    # Form state with draft loading
    └── index.js                          # Module exports
```

## Backend Requirements

The backend needs to implement these endpoints:

```
POST   /createDeveloperDraft      - Create new developer draft
PATCH  /updateDeveloperDraft      - Update existing draft
DELETE /deleteDeveloperDraft      - Delete draft
POST   /submitDeveloperDraft      - Submit for approval
GET    /developerDraft            - Get all user drafts
GET    /developerDraft/:id        - Get specific draft
```

## Next Steps

1. **Backend Implementation**
   - Create developer draft entity
   - Implement CRUD endpoints
   - Add validation

2. **Enhanced UI Components**
   - Multi-select for project types
   - Tag input for specializations
   - File upload with preview
   - Rich text editor

3. **Testing**
   - Unit tests for validation schemas
   - Integration tests for API calls
   - E2E tests for form flow

4. **Documentation**
   - API documentation
   - User guide
   - Developer onboarding docs

## Notes

- The implementation follows React best practices
- All form data is typed and validated
- The code is modular and reusable
- Error handling is comprehensive
- The UI is accessible and responsive
