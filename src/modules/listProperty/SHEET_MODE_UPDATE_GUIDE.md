# ListProperty UI Restructuring - Sheet Mode Implementation Guide

## Overview
The ListProperty UI has been restructured from a sidebar sheet wizard to a single-page layout where each section opens in its own sheet for editing.

## Completed Updates

### Core Files
1. ✅ **ListProperty.jsx** - Main page with card-based section layout
2. ✅ **PropertyFormContext.jsx** - Added `openSection`, `setOpenSection`, and `formData`
3. ✅ **SectionEditSheet.jsx** - New reusable sheet component for section editing
4. ✅ **PropertyTypeSelector.jsx** - Updated to support `onComplete` callback

### Updated Step Components (with isSheetMode support)
1. ✅ BasicDetails
2. ✅ BasicConfiguration
3. ✅ AreaDetails
4. ✅ PricingInfoStep

## Remaining Components to Update

The following components need the same pattern applied:

1. FurnishingAmenities.jsx
2. ParkingUtilities.jsx
3. LocationAttributes.jsx
4. FloorDetails.jsx
5. LandAttributes.jsx
6. SuitableForStep.jsx
7. ListingInfoStep.jsx
8. AmenitiesStep.jsx

## Update Pattern

For each component, apply these changes:

### Step 1: Update Function Signature
```jsx
// Before:
export default function ComponentName() {
  const { nextStep, previousStep, updateStepValidation } = usePropertyForm();

// After:
export default function ComponentName({ isSheetMode = false }) {
  const { nextStep, previousStep, updateStepValidation, setOpenSection } = usePropertyForm();
```

### Step 2: Update Submit Handler
```jsx
// Add conditional logic to close sheet or continue to next step
const onSubmit = (data) => {
  // ... existing data update logic ...
  
  if (isSheetMode) {
    setOpenSection(null);  // Close the sheet
  } else {
    nextStep();  // Continue in wizard mode
  }
};
```

For components without explicit onSubmit, modify the button onClick:
```jsx
onClick={isSheetMode ? () => setOpenSection(null) : nextStep}
```

### Step 3: Update Navigation Buttons
```jsx
// Replace the navigation buttons section with:
<div className="flex justify-between pt-6 border-t border-orange-200 dark:border-orange-900">
  {!isSheetMode && (
    <Button
      variant="outline"
      onClick={previousStep}
      className="px-6 border-orange-200 hover:bg-orange-50"
    >
      Back
    </Button>
  )}
  {isSheetMode && (
    <Button
      variant="outline"
      onClick={() => setOpenSection(null)}
      className="px-6 border-orange-200 hover:bg-orange-50"
    >
      Cancel
    </Button>
  )}
  <Button
    onClick={isSheetMode ? () => setOpenSection(null) : nextStep}
    disabled={!isValid}
    className="px-8 bg-gradient-to-r from-orange-500 to-orange-600"
  >
    {isSheetMode ? 'Save' : 'Continue'}
    {!isSheetMode && <ArrowRightIcon />}
  </Button>
</div>
```

## New Features

### Single Page Layout
- Property sections displayed as clickable cards
- Each card shows completion status
- Cards are color-coded by section type

### Section Cards Display
- Green checkmark = Completed
- Orange alert = Incomplete
- Required badge for mandatory sections

### Sheet-Based Editing
- Click any section card to open editing sheet
- Save or Cancel options
- No step progression required
- Users can edit sections in any order

## Testing Checklist

- [ ] Property type selection works
- [ ] All section cards display correctly
- [ ] Each section opens in a sheet when clicked
- [ ] Save button closes sheet and updates data
- [ ] Cancel button closes sheet without saving
- [ ] Completion status updates after saving
- [ ] Form validation works in sheets
- [ ] Required fields are enforced
- [ ] Final submit button enables when all required sections complete

## Future Enhancements

1. Add progress indicator showing X/Y sections completed
2. Add auto-save functionality
3. Add section data preview on cards
4. Add validation summary on main page
5. Add ability to duplicate similar sections
