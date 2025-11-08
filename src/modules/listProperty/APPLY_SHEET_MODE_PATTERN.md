/**
 * QUICK REFERENCE: Apply Sheet Mode to Remaining Components
 * 
 * For each of these components, apply the pattern below:
 * - FurnishingAmenities.jsx
 * - ParkingUtilities.jsx
 * - LocationAttributes.jsx
 * - FloorDetails.jsx
 * - LandAttributes.jsx
 * - ListingInfoStep.jsx
 * - AmenitiesStep.jsx
 */

// ============================================
// STEP 1: Update the function signature
// ============================================

// FIND (example for FurnishingAmenities):
export default function FurnishingAmenities() {
  const { nextStep, previousStep, updateStepValidation } = usePropertyForm();

// REPLACE WITH:
export default function FurnishingAmenities({ isSheetMode = false }) {
  const { nextStep, previousStep, updateStepValidation, setOpenSection } = usePropertyForm();


// ============================================
// STEP 2: Update button handlers
// ============================================

// For components with forms (BasicDetails pattern):
// FIND:
const onSubmit = (data) => {
  // ... data update logic ...
  nextStep();
};

// REPLACE WITH:
const onSubmit = (data) => {
  // ... data update logic ...
  if (isSheetMode) {
    setOpenSection(null);
  } else {
    nextStep();
  }
};

// For components with direct button clicks (no form):
// FIND:
onClick={nextStep}

// REPLACE WITH:
onClick={isSheetMode ? () => setOpenSection(null) : nextStep}


// ============================================
// STEP 3: Update navigation buttons section
// ============================================

// FIND (typical pattern):
<div className="flex justify-between pt-6 border-t border-orange-200">
  <Button
    variant="outline"
    onClick={previousStep}
    className="px-6 border-orange-200"
  >
    Back
  </Button>
  <Button
    onClick={nextStep}
    disabled={!isValid}
    className="px-8 bg-gradient-to-r from-orange-500"
  >
    Continue
  </Button>
</div>

// REPLACE WITH:
<div className="flex justify-between pt-6 border-t border-orange-200 dark:border-orange-900">
  {!isSheetMode && (
    <Button
      variant="outline"
      onClick={previousStep}
      className="px-6 border-orange-200 hover:bg-orange-50 hover:border-orange-500"
    >
      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
      </svg>
      Back
    </Button>
  )}
  {isSheetMode && (
    <Button
      variant="outline"
      onClick={() => setOpenSection(null)}
      className="px-6 border-orange-200 hover:bg-orange-50 hover:border-orange-500"
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
    {!isSheetMode && (
      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    )}
  </Button>
</div>


// ============================================
// VERIFICATION CHECKLIST
// ============================================

After applying changes to each component:
✓ Component accepts isSheetMode prop with default false
✓ Component imports and uses setOpenSection from usePropertyForm
✓ Save handler closes sheet when isSheetMode is true
✓ Back button only shows when NOT in sheet mode
✓ Cancel button shows when IN sheet mode
✓ Continue button changes to Save in sheet mode
✓ Arrow icon only shows in wizard mode (not sheet mode)
✓ All existing validation logic remains intact
