# Property Form V2 - Multi-Step Implementation

## Overview

This is an enhanced version of the property listing form that implements a **true multi-step workflow** with "Save & Continue" buttons. Each form section is presented as a separate step, and users must complete and save each step before progressing to the next.

The form is available in **two variants**:
- **Sheet Overlay**: Opens as a slide-in sheet from the right (for embedded use)
- **Full Page**: Standalone page with routing support (for direct navigation)

## Key Features

### 1. **Multi-Step Navigation**
- Each form section is a distinct step
- Clear step-by-step progression
- "Save & Continue" button to advance to the next step
- "Back" button to return to previous steps

### 2. **Progressive Step Completion**
- Steps are locked until previous steps are completed
- Completed steps are marked with checkmarks
- Visual progress indicator showing overall completion percentage
- Step numbers displayed on each navigation item

### 3. **Enhanced Sidebar**
- **Locked Steps**: Steps that haven't been unlocked yet show a lock icon
- **Current Step**: Highlighted with orange gradient background
- **Completed Steps**: Green background with checkmark icons
- **Clickable Navigation**: Click any unlocked step to jump to it
- **Property Type Badge**: Shows selected property type with change option
- **Progress Bar**: Visual representation of form completion

### 4. **Comprehensive Review Page**
- Final step shows all completed information
- **Collapsible Sections**: Click to expand/collapse each section
- **Edit Buttons**: Quick access to edit any completed section
- **Grouped Information**: Property, Location, Specifications, and Pricing
- **Visual Hierarchy**: Color-coded section headers
- **Submit Button**: Large, prominent button to submit the listing

### 5. **Draft Management**
- Auto-save drafts on each "Save & Continue"
- Load drafts via URL params (`/list-property/edit/:draftId`)
- Load drafts via props (`editingDraft`)
- Draft state persists across sessions

### 6. **Reusable Components**
- Leverages existing form components
- Wrapper components add Save & Continue functionality
- Minimal code duplication
- Easy to maintain and extend

## File Structure

```
v2/
├── components/
│   ├── PropertyFormSheetV2.jsx          # Sheet overlay container
│   ├── PropertyFormPageV2.jsx           # Full page container (NEW)
│   ├── PropertyFormSidebarV2.jsx        # Enhanced sidebar with step navigation
│   ├── SaveAndContinueFooter.jsx        # Reusable footer with Save & Continue
│   └── steps/
│       ├── PropertyTypeStepV2.jsx       # Step 0: Select property type
│       ├── BasicDetailsStepV2.jsx       # Step 1: Location and basic info
│       ├── BasicConfigurationStepV2.jsx # Step 2: Rooms configuration
│       ├── AreaDetailsStepV2.jsx        # Step 3: Size and area
│       ├── FurnishingStepV2.jsx         # Step 4: Furnishing details
│       ├── ParkingStepV2.jsx            # Step 5: Parking and utilities
│       ├── LocationStepV2.jsx           # Step 6: Facing and view
│       ├── FloorDetailsStepV2.jsx       # Step 7: Floor details (apartments)
│       ├── LandAttributesStepV2.jsx     # Step 2: Land details (land types)
│       ├── PricingStepV2.jsx            # Pricing information
│       ├── SuitableForStepV2.jsx        # Tenant preferences
│       ├── ListingInfoStepV2.jsx         # Title and description
│       ├── AmenitiesStepV2.jsx          # Amenities and features
│       ├── MediaUploadStepV2.jsx        # Images and videos upload
│       ├── DocumentUploadStepV2.jsx     # Legal documents upload
│       └── ReviewAndSubmitV2.jsx        # Final review and submit
├── context/
│   └── PropertyFormContextV2.jsx        # Enhanced context with step management
└── index.js                              # Exports for easy imports
```

## Usage

### Sheet Overlay Variant (Embedded Use)

```jsx
import { PropertyFormSheetV2 } from '@/modules/listProperty/v2';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        List Property
      </button>
      
      <PropertyFormSheetV2 
        open={isOpen} 
        onOpenChange={setIsOpen}
        // Optional: Load existing draft
        initialDraftId="draft-123"
        // Or: Pass draft object directly
        editingDraft={draftObject}
      />
    </>
  );
}
```

### Full Page Variant (Routing)

```jsx
import { PropertyFormPageV2 } from '@/modules/listProperty/v2';

// In your router configuration:
<Route path="/list-property/edit/new" element={<PropertyFormPageV2 />} />
<Route path="/list-property/edit/edit/:draftId" element={<PropertyFormPageV2 />} />

// Usage:
// Navigate to: /list-property/edit/new (new property)
// Navigate to: /list-property/edit/edit/draft-123 (edit existing draft)
```

### Using the Context

```jsx
import { usePropertyFormV2 } from '@/modules/listProperty/v2';

function CustomComponent() {
  const { 
    currentStep, 
    saveAndContinue, 
    previousStep,
    isStepCompleted,
    getProgress,
    draftId,
    isLoadingDraft 
  } = usePropertyFormV2();

  return (
    <div>
      <p>Current Step: {currentStep}</p>
      <p>Progress: {getProgress()}%</p>
      <p>Draft ID: {draftId}</p>
      {isLoadingDraft && <p>Loading draft...</p>}
      <button onClick={saveAndContinue}>Save & Continue</button>
    </div>
  );
}
```

## Step Flow

### For Apartments/Penthouses (15 steps):
1. Property Type Selection
2. Basic Details (Location)
3. Basic Configuration (Rooms)
4. Area Details
5. Furnishing & Amenities
6. Parking & Utilities
7. Location Attributes (Facing/View)
8. Floor Details
9. Pricing Information
10. Suitable For (Tenant Preferences)
11. Listing Information (Title/Description)
12. Amenities & Features
13. Media Upload (Images & Videos)
14. Document Upload (Legal Documents)
15. Review & Submit

### For Other Buildings (14 steps):
Same as above, but without Floor Details (step 8)

### For Land/Plots (9 steps):
1. Property Type Selection
2. Basic Details (Location)
3. Land Attributes (Plot Details)
4. Pricing Information
5. Listing Information
6. Amenities & Features
7. Media Upload (Images & Videos)
8. Document Upload (Legal Documents)
9. Review & Submit

## Key Components

### PropertyFormContextV2
Enhanced context provider with:
- `currentStep`: Current active step
- `saveAndContinue()`: Mark current step complete and advance
- `previousStep()`: Go back one step
- `goToStep(step)`: Jump to a specific step
- `isStepCompleted(step)`: Check if a step is completed
- `getProgress()`: Get completion percentage
- `completedSteps`: Set of completed step numbers

### SaveAndContinueFooter
Reusable footer component with:
- Save & Continue button (primary action)
- Back button (secondary action)
- Disabled state management
- Custom labels support
- Different styling for last step (green for submit)

### PropertyFormSidebarV2
Enhanced sidebar featuring:
- Property type selector with change option
- Step list with status indicators
- Progress bar showing completion percentage
- Lock icons for unavailable steps
- Checkmarks for completed steps
- Click-to-navigate for unlocked steps

## Differences from V1

| Feature | V1 | V2 |
|---------|----|----|
| Navigation | Free navigation to any step | Progressive, locked steps |
| Saving | Auto-save on change | Explicit "Save & Continue" |
| Progress | Basic progress bar | Detailed with step completion |
| Review | Simple review page | Collapsible sections with edit |
| Step Access | All steps accessible | Only unlocked steps accessible |
| Footer | Generic continue button | "Save & Continue" emphasis |
| Sidebar | Status only | Interactive with locks |

## Benefits

1. **Better User Flow**: Clear progression through the form
2. **Reduced Errors**: Forces completion of required sections
3. **Clear Expectations**: Users know exactly what's needed
4. **Easy Recovery**: Can go back and edit any completed section
5. **Visual Feedback**: Clear indicators of progress and completion
6. **Professional UI**: Modern, polished appearance

## Future Enhancements

Potential improvements for future versions:
- Auto-save draft functionality
- Resume from last saved step
- Step-specific validation messages
- Estimated time to complete
- Field-level progress indicators
- Mobile-optimized layout
- Keyboard shortcuts for navigation
- Analytics tracking for completion rates

## Migration from V1

To migrate from V1 to V2:

```jsx
// Old V1 import
import PropertyFormSheet from '@/modules/listProperty/components/PropertyFormSheet';

// New V2 import
import { PropertyFormSheetV2 } from '@/modules/listProperty/v2';

// Usage remains the same
<PropertyFormSheetV2 open={isOpen} onOpenChange={setIsOpen} />
```

The component API is fully compatible with V1, making migration seamless.
