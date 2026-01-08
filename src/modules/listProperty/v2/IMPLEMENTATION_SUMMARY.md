# Nested Form Data Structure - Implementation Summary

## Overview
The PropertyFormContextV2 has been updated to save draft data in a **nested structure** where each step's data is grouped under its step ID.

## What Changed

### Previous Structure (Flat)
```json
{
  "propertyType": "apartment",
  "propertyName": "Villa",
  "bedrooms": 3,
  "price": 5000000
}
```

### New Structure (Nested by Step)
```json
{
  "property-type": {
    "propertyType": "apartment"
  },
  "basic-details": {
    "propertyName": "Villa",
    "listingType": "sale"
  },
  "basic-configuration": {
    "bedrooms": 3,
    "bathrooms": 2
  },
  "pricing": {
    "price": 5000000
  }
}
```

## Changes to PropertyFormContextV2.jsx

### 1. Updated State
- `formData` now stores nested structure: `{ stepId: { field1: value1, ... } }`

### 2. New Helper Functions

#### `getStepData(stepId)`
Get data for a specific step.
```javascript
const stepData = getStepData('basic-details');
// Returns: { propertyName: "...", listingType: "..." }
```

#### `updateFormData(stepId, stepData)`
Update data for a specific step (now requires stepId).
```javascript
updateFormData('basic-details', { propertyName: "Villa" });
```

#### `flattenFormData(nestedData)` (internal)
Flattens nested data for backwards compatibility with validation schemas.

### 3. Updated Functions

#### `saveAndContinue(stepData, stepId?)`
- Automatically nests data under current step ID
- `stepId` parameter is optional (auto-detected from current step)

#### `saveDraft(updatedData?)`
- Accepts either nested structure or uses current formData
- When passing data manually, must use nested structure

### 4. Backwards Compatibility

The implementation maintains **full backwards compatibility**:

✅ **Old drafts (flat structure) load correctly**
```javascript
// Old format still works
const draftData = { propertyType: "apartment", propertyName: "Villa" };
// Context extracts: propertyType from root or 'property-type' step
```

✅ **Validation schemas work unchanged**
```javascript
// formDataWithType is automatically flattened for validation
// Schemas continue to work with flat data structure
```

✅ **Completed steps detection works for both formats**
```javascript
// getCompletedStepsFromData checks:
// 1. Nested: formData['basic-details']?.propertyName
// 2. Flat: formData.propertyName (fallback)
```

## How Step Components Should Be Updated

### Pattern 1: Simple Steps (Most Common)

```javascript
const STEP_ID = 'basic-details';

export default function BasicDetailsStepV2() {
  const { saveAndContinue, getStepData } = usePropertyFormV2();
  
  // Get step-specific data
  const stepData = getStepData(STEP_ID);
  
  const form = useForm({
    defaultValues: {
      propertyName: stepData?.propertyName || '',
      listingType: stepData?.listingType || 'sale',
    }
  });
  
  const onSubmit = (data) => {
    // Automatically nests under current step
    saveAndContinue(data);
  };
  
  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

### Pattern 2: Steps with Manual Draft Saves

```javascript
const STEP_ID = 'property-type';

export default function PropertyTypeStepV2() {
  const { setPropertyType, saveDraft, getStepData } = usePropertyFormV2();
  
  const stepData = getStepData(STEP_ID);
  const [selectedType, setSelectedType] = useState(stepData?.propertyType || null);
  
  const handleSelectType = async (type) => {
    setSelectedType(type);
    setPropertyType(type);
    
    // Manual save: wrap in step ID
    await saveDraft({ 
      [STEP_ID]: { propertyType: type } 
    });
  };
  
  return <div>...</div>;
}
```

## Migration Checklist

For each step component in `src/modules/listProperty/v2/components/steps/`:

- [ ] Define `STEP_ID` constant matching `stepConfiguration.js`
- [ ] Replace `formData` with `getStepData(STEP_ID)`
- [ ] Update `defaultValues` to use `stepData` instead of `formData`
- [ ] Ensure `onSubmit` calls `saveAndContinue(data)` (no stepId needed)
- [ ] If using `saveDraft()` manually, wrap data: `{ [STEP_ID]: { ...data } }`
- [ ] Test: draft save, draft load, step navigation, final submission

## Step IDs Reference

Match these with your components:

| Component File | Step ID |
|---------------|---------|
| PropertyTypeStepV2.jsx | `property-type` |
| LocationSelectionStepV2.jsx | `location-selection` |
| BasicDetailsStepV2.jsx | `basic-details` |
| BasicConfigurationStepV2.jsx | `basic-configuration` |
| UnitAmenitiesStepV2.jsx | `unit-amenities` |
| LocationStepV2.jsx | `location-attributes` |
| FloorDetailsStepV2.jsx | `floor-details` |
| LandAttributesStepV2.jsx | `land-attributes` |
| PricingStepV2.jsx | `pricing` |
| SuitableForStepV2.jsx | `suitable-for` |
| ListingInfoStepV2.jsx | `listing-info` |
| PropertyAmenitiesStepV2.jsx | `property-amenities` |
| MediaUploadStepV2.jsx | `media-upload` |

## Benefits

1. **Clear Organization**: Each step's data is isolated and easy to find
2. **Easier Debugging**: Can inspect data by step in dev tools
3. **Better Maintainability**: Steps are more independent
4. **API Ready**: Structure aligns with backend expectations
5. **Type Safety**: Easier to add TypeScript types per step
6. **Migration Friendly**: Backwards compatible with old drafts

## Testing

After updating components, verify:

1. ✅ New draft saves with nested structure
2. ✅ Old draft (flat) loads and converts correctly
3. ✅ Form fields populate from draft
4. ✅ Step completion indicators work
5. ✅ Navigation between steps works
6. ✅ Validation works correctly
7. ✅ Final submission includes all data

## Files Modified

1. `PropertyFormContextV2.jsx` - Core context implementation
2. `MIGRATION_GUIDE.md` - Detailed migration instructions
3. `BasicDetailsStepV2.EXAMPLE.jsx` - Example implementation
4. `PropertyTypeStepV2.EXAMPLE.jsx` - Example with manual saves
5. `IMPLEMENTATION_SUMMARY.md` - This file

## Next Steps

1. Update each step component following the patterns above
2. Test each step individually
3. Test full flow: create → save → reload → submit
4. Verify old drafts still work
5. Update backend if needed to expect nested structure
