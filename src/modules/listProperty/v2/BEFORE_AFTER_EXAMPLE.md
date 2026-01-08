# Complete Before/After Example: LocationSelectionStepV2

## Before (Flat Structure)

```javascript
export default function LocationSelectionStepV2() {
  const { 
    saveAndContinue, 
    previousStep, 
    formData,           // ← Flat data
    setCurrentStepIsValid 
  } = usePropertyFormV2();

  const form = useForm({
    resolver: zodResolver(locationSelectionSchema),
    mode: 'onChange',
    defaultValues: {
      address: formData?.address || '',           // ← Direct access
      city: formData?.city || '',                 // ← Direct access
      state: formData?.state || '',               // ← Direct access
      pincode: formData?.pincode || '',           // ← Direct access
      latitude: formData?.latitude || '',         // ← Direct access
      longitude: formData?.longitude || '',       // ← Direct access
    },
  });

  const onSubmit = (data) => {
    saveAndContinue(data);  // ← Works same
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  );
}
```

## After (Nested Structure)

```javascript
const STEP_ID = 'location-selection';  // ← Define step ID

export default function LocationSelectionStepV2() {
  const { 
    saveAndContinue, 
    previousStep, 
    getStepData,            // ← New: Get step data
    setCurrentStepIsValid 
  } = usePropertyFormV2();

  // ← Get step-specific data
  const stepData = getStepData(STEP_ID);

  const form = useForm({
    resolver: zodResolver(locationSelectionSchema),
    mode: 'onChange',
    defaultValues: {
      address: stepData?.address || '',      // ← Use stepData
      city: stepData?.city || '',            // ← Use stepData
      state: stepData?.state || '',          // ← Use stepData
      pincode: stepData?.pincode || '',      // ← Use stepData
      latitude: stepData?.latitude || '',    // ← Use stepData
      longitude: stepData?.longitude || '',  // ← Use stepData
    },
  });

  const onSubmit = (data) => {
    saveAndContinue(data);  // ← Same! Auto-nests
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  );
}
```

## What Changed

### Minimal Changes Required!

1. **Add step ID constant** (1 line)
   ```javascript
   const STEP_ID = 'location-selection';
   ```

2. **Replace formData with getStepData** (2 lines)
   ```javascript
   // Before
   const { formData } = usePropertyFormV2();
   
   // After
   const { getStepData } = usePropertyFormV2();
   const stepData = getStepData(STEP_ID);
   ```

3. **Update defaultValues** (replace `formData` with `stepData`)
   ```javascript
   // Before
   address: formData?.address || '',
   
   // After
   address: stepData?.address || '',
   ```

That's it! **Only 3 simple changes** per component.

## Result: Draft Structure

### Before (Flat)
```json
{
  "propertyType": "apartment",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001"
}
```

### After (Nested)
```json
{
  "property-type": {
    "propertyType": "apartment"
  },
  "location-selection": {
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }
}
```

## Benefits in Action

### Debugging
**Before:** All fields mixed together
```javascript
console.log(formData);
// { propertyType: "apartment", address: "...", bedrooms: 3, ... }
// Hard to see which fields belong to which step
```

**After:** Clear separation
```javascript
console.log(formData);
// {
//   "property-type": { propertyType: "apartment" },
//   "location-selection": { address: "...", city: "..." },
//   "basic-configuration": { bedrooms: 3 }
// }
// Easy to see data per step!
```

### Step Completion Detection
The context automatically checks both nested and flat structures:
```javascript
// Checks both formats:
hasData = !!(
  stepData.address ||      // New nested format
  formData.address         // Old flat format (backwards compat)
);
```

### Validation
Still works with flat data (auto-flattened internally):
```javascript
// locationSelectionSchema expects flat structure
// Context automatically flattens for validation
const flattenedData = {
  address: "...",
  city: "...",
  // ... all fields at root level
};
```

## No Breaking Changes

✅ **saveAndContinue** - Same API, works identically
✅ **Form submission** - No changes needed
✅ **Validation** - Works with existing schemas
✅ **Old drafts** - Load correctly with backwards compatibility
✅ **Navigation** - No changes
✅ **Step completion** - Auto-detects both formats

## Summary

This migration:
- ✅ Requires minimal code changes (3 simple updates)
- ✅ Maintains backwards compatibility
- ✅ Improves data organization
- ✅ Makes debugging easier
- ✅ Doesn't break existing functionality
- ✅ Aligns with backend expectations

The changes are **non-breaking** and **easy to implement**!
