# Dynamic Step System - Implementation Summary

## What Changed

### Before
Steps were hardcoded in `PropertyFormSheetV2.jsx` using nested if/switch statements based only on **property type**.

### After
Steps are configured in `stepConfiguration.js` and can be shown/hidden based on **any form field value**.

## New Files Created

1. **`config/stepConfiguration.js`** - Central step configuration with all step definitions and visibility logic
2. **`config/README.md`** - Complete documentation of the system
3. **`config/stepConfiguration.examples.md`** - 10+ examples of conditional step patterns

## Modified Files

1. **`context/PropertyFormContextV2.jsx`**
   - Added `formDataWithType` memoized value
   - Updated `getTotalSteps()` to use dynamic configuration
   - Exported `formDataWithType` for step rendering

2. **`components/PropertyFormSheetV2.jsx`**
   - Removed all hardcoded step logic (100+ lines)
   - Now uses `getStepComponent()` utility
   - Much cleaner and maintainable

## Key Features

### 1. Conditional Steps Based on Any Field

```javascript
// Show step only if possession is under construction
isVisible: (formData) => formData.possessionStatus === 'under_construction'

// Show step only if has EV charging
isVisible: (formData) => formData.evChargingType !== 'none'

// Show step only for POA ownership
isVisible: (formData) => formData.ownershipType === 'poa'

// Show step only if RERA IDs exist
isVisible: (formData) => (formData.reraIds || []).length > 0
```

### 2. Complex Conditional Logic

```javascript
// Multiple conditions (AND)
isVisible: (formData) => {
  const isPremium = ['villa', 'penthouse'].includes(formData.propertyType);
  const largeBHK = parseInt(formData.bedrooms || 0) >= 4;
  return isPremium && largeBHK;
}

// Price-based conditions
isVisible: (formData) => parseFloat(formData.price || 0) >= 50000000
```

### 3. Dynamic Step Ordering

```javascript
{
  id: 'floor-details',
  order: 9,  // Comes after parking
},
{
  id: 'ev-charging-details',
  order: 7.5,  // Insert between parking (7) and location (8)
}
```

## How to Add New Conditional Steps

### Example: Add "Possession Date" step (only for under-construction properties)

1. **Create the component** (if it doesn't exist):
```jsx
// components/steps/PossessionDateDetailsStepV2.jsx
export default function PossessionDateDetailsStepV2() {
  const { saveAndContinue, previousStep, formData } = usePropertyFormV2();
  
  // Your step implementation
}
```

2. **Add to configuration**:
```javascript
// In stepConfiguration.js
import PossessionDateDetailsStepV2 from '../components/steps/PossessionDateDetailsStepV2';

// Add to STEP_CONFIG array:
{
  id: 'possession-date-details',
  name: 'Possession Date',
  component: PossessionDateDetailsStepV2,
  category: STEP_CATEGORIES.OPTIONAL,
  isVisible: (formData) => formData.possessionStatus === 'under_construction',
  order: 3.5, // After basic details (3), before configuration (4)
}
```

3. **Done!** The step will automatically appear when `possessionStatus === 'under_construction'`

## Real-World Use Cases

### 1. POA Documentation Step
```javascript
{
  id: 'poa-documents',
  name: 'POA Documents',
  component: POADocumentsStepV2,
  category: STEP_CATEGORIES.OPTIONAL,
  isVisible: (formData) => formData.ownershipType === 'poa',
  order: 3.6,
}
```

### 2. EV Charging Details
```javascript
{
  id: 'ev-charging-details',
  name: 'EV Charging Setup',
  component: EVChargingDetailsStepV2,
  category: STEP_CATEGORIES.OPTIONAL,
  isVisible: (formData) => {
    return formData.evChargingType && formData.evChargingType !== 'none';
  },
  order: 7.5,
}
```

### 3. RERA Verification
```javascript
{
  id: 'rera-verification',
  name: 'RERA Verification',
  component: RERAVerificationStepV2,
  category: STEP_CATEGORIES.OPTIONAL,
  isVisible: (formData) => {
    const reraIds = formData.reraIds || [];
    return reraIds.length > 0 && reraIds.some(r => r.id && r.id.trim());
  },
  order: 3.7,
}
```

### 4. Premium Amenities (Complex Condition)
```javascript
{
  id: 'premium-amenities',
  name: 'Premium Features',
  component: PremiumAmenitiesStepV2,
  category: STEP_CATEGORIES.OPTIONAL,
  isVisible: (formData) => {
    // Show for premium property types
    const isPremiumType = ['villa', 'penthouse'].includes(formData.propertyType);
    
    // OR show for large properties with premium features
    const largeBHK = parseInt(formData.bedrooms || 0) >= 4;
    const hasFullBackup = formData.powerBackup === 'full';
    const fullyFurnished = formData.furnishingLevel === 'fully_furnished';
    
    return isPremiumType || (largeBHK && hasFullBackup && fullyFurnished);
  },
  order: 13.5,
}
```

### 5. Agricultural Land Details
```javascript
{
  id: 'agricultural-specifics',
  name: 'Agricultural Details',
  component: AgriculturalSpecificsStepV2,
  category: STEP_CATEGORIES.LAND,
  isVisible: (formData) => formData.propertyType === 'agricultural_land',
  order: 4.5,
}
```

## Benefits

### For Developers
- ✅ No more nested switch statements
- ✅ Add/modify steps in one place
- ✅ Easy to test visibility logic
- ✅ Clear separation of concerns
- ✅ Self-documenting configuration

### For Business
- ✅ Easy to add new conditional steps
- ✅ Can customize flow based on any criteria
- ✅ Better UX (show only relevant steps)
- ✅ Can A/B test different flows
- ✅ Reduced form abandonment

### For Users
- ✅ See only relevant steps
- ✅ Shorter forms for simple properties
- ✅ More details for complex properties
- ✅ Better guided experience

## Testing

### Test Step Visibility
```javascript
import { isStepVisible, getVisibleSteps } from './config/stepConfiguration';

// Test specific step
const formData = { 
  propertyType: 'apartment',
  possessionStatus: 'under_construction'
};

console.log(isStepVisible('possession-date-details', formData)); // true
console.log(isStepVisible('poa-documents', formData)); // false

// Get all visible steps
const steps = getVisibleSteps(formData);
console.log(steps.map(s => s.name));
```

### Debug Current Flow
```javascript
// In PropertyFormContentV2
const { formDataWithType } = usePropertyFormV2();
const visibleSteps = getVisibleSteps(formDataWithType);

console.log('Current step:', currentStep);
console.log('Visible steps:', visibleSteps.map(s => s.name));
console.log('Total steps:', visibleSteps.length);
```

## Migration Path

### Phase 1 (Current) ✅
- Create step configuration system
- Migrate existing steps
- Maintain backward compatibility

### Phase 2 (Next)
- Add 3-5 new conditional steps based on business needs
- Examples: POA docs, RERA verification, EV charging details

### Phase 3 (Future)
- Add analytics to track which steps users see/complete
- A/B test different step flows
- Optimize based on completion rates

## Configuration API

### Main Functions

```javascript
// Get all visible steps for current form data
getVisibleSteps(formData) → Step[]

// Get component for specific step index
getStepComponent(stepIndex, formData) → React.Component

// Get total number of visible steps
getTotalVisibleSteps(formData) → number

// Check if specific step is visible
isStepVisible(stepId, formData) → boolean

// Get step name by index
getStepName(stepIndex, formData) → string

// Get step index by ID
getStepIndexById(stepId, formData) → number
```

### Step Configuration Object

```javascript
{
  id: string,              // Unique identifier
  name: string,            // Display name
  component: React.Component, // Step component
  category: string,        // CORE, BUILDING, LAND, OPTIONAL
  isVisible: (formData) => boolean,  // Visibility function
  order: number,           // Sort order (supports decimals)
}
```

## Performance

- ⚡ Memoized step calculations
- ⚡ Recalculates only on form data changes
- ⚡ No performance impact for typical forms
- ⚡ Lightweight visibility checks

## Documentation

- **`config/README.md`** - Complete system documentation
- **`config/stepConfiguration.examples.md`** - 10+ detailed examples
- **This file** - Quick reference and implementation summary

## Questions?

1. Check `config/README.md` for detailed documentation
2. See `config/stepConfiguration.examples.md` for examples
3. Review existing step configurations in `config/stepConfiguration.js`
4. Enable debug logging to understand current behavior

## Next Steps

To extend the system:

1. **Identify conditional steps** needed for your business logic
2. **Create step components** following existing patterns
3. **Add configuration** with appropriate visibility logic
4. **Test** by setting form field values
5. **Deploy** and monitor user behavior

The system is now ready for easy extension based on any business requirement!
