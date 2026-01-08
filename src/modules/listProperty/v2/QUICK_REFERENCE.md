# Quick Reference: Nested Form Data Structure

## Context API Changes

### Before
```javascript
const { formData, saveAndContinue } = usePropertyFormV2();

// Access data
const propertyName = formData.propertyName;

// Save data
saveAndContinue({ propertyName: "Villa" });
```

### After
```javascript
const { getStepData, saveAndContinue } = usePropertyFormV2();

// Access data
const stepData = getStepData('basic-details');
const propertyName = stepData.propertyName;

// Save data (same!)
saveAndContinue({ propertyName: "Villa" });
```

## Common Patterns

### Pattern 1: Basic Step Component
```javascript
const STEP_ID = 'basic-details';

export default function BasicDetailsStepV2() {
  const { saveAndContinue, getStepData } = usePropertyFormV2();
  const stepData = getStepData(STEP_ID);
  
  const form = useForm({
    defaultValues: {
      propertyName: stepData?.propertyName || '',
    }
  });
  
  return (
    <form onSubmit={form.handleSubmit(saveAndContinue)}>
      {/* fields */}
    </form>
  );
}
```

### Pattern 2: Manual Save (e.g., PropertyType)
```javascript
const STEP_ID = 'property-type';

export default function PropertyTypeStepV2() {
  const { saveDraft, getStepData, setPropertyType } = usePropertyFormV2();
  const stepData = getStepData(STEP_ID);
  
  const handleSelect = async (type) => {
    setPropertyType(type);
    
    // Wrap in step ID for manual saves
    await saveDraft({ 
      [STEP_ID]: { propertyType: type } 
    });
  };
}
```

### Pattern 3: Custom updateFormData
```javascript
const STEP_ID = 'media-upload';

export default function MediaUploadStepV2() {
  const { updateFormData, getStepData } = usePropertyFormV2();
  const stepData = getStepData(STEP_ID);
  
  const handleUpload = (file) => {
    const newMedia = [...(stepData.mediaData || []), file];
    
    // Update with step ID
    updateFormData(STEP_ID, { mediaData: newMedia });
  };
}
```

## Data Structure Comparison

### Saved to Database
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
  }
}
```

### Flattened for Validation (automatic)
```json
{
  "propertyType": "apartment",
  "propertyName": "Villa",
  "listingType": "sale",
  "bedrooms": 3,
  "bathrooms": 2
}
```

## Key Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `getStepData(stepId)` | Get data for a step | `getStepData('basic-details')` |
| `updateFormData(stepId, data)` | Update step data | `updateFormData('pricing', { price: 5000 })` |
| `saveAndContinue(data)` | Save & go to next step | `saveAndContinue({ bedrooms: 3 })` |
| `saveDraft(nestedData?)` | Save draft manually | `saveDraft({ 'property-type': {...} })` |

## Step IDs Quick Lookup

```javascript
'property-type'         // PropertyTypeStepV2
'location-selection'    // LocationSelectionStepV2
'basic-details'         // BasicDetailsStepV2
'basic-configuration'   // BasicConfigurationStepV2
'unit-amenities'        // UnitAmenitiesStepV2
'location-attributes'   // LocationStepV2
'floor-details'         // FloorDetailsStepV2
'land-attributes'       // LandAttributesStepV2
'pricing'               // PricingStepV2
'suitable-for'          // SuitableForStepV2
'listing-info'          // ListingInfoStepV2
'property-amenities'    // PropertyAmenitiesStepV2
'media-upload'          // MediaUploadStepV2
```

## Migration Checklist

Per component:
- [ ] Add `const STEP_ID = 'step-name';`
- [ ] Replace `formData` with `getStepData(STEP_ID)`
- [ ] Update `defaultValues` to use `stepData`
- [ ] Verify `saveAndContinue(data)` calls
- [ ] Wrap manual `saveDraft()` calls: `{ [STEP_ID]: {...} }`

## Common Mistakes

❌ **Wrong: Using formData directly**
```javascript
const propertyName = formData.propertyName; // undefined in new structure
```

✅ **Right: Using getStepData**
```javascript
const stepData = getStepData('basic-details');
const propertyName = stepData.propertyName;
```

---

❌ **Wrong: Manual saveDraft without nesting**
```javascript
await saveDraft({ propertyType: type }); // Flat structure
```

✅ **Right: Wrapped in step ID**
```javascript
await saveDraft({ 'property-type': { propertyType: type } });
```

---

❌ **Wrong: Passing stepId to saveAndContinue unnecessarily**
```javascript
saveAndContinue(data, 'basic-details'); // Not needed
```

✅ **Right: Let it auto-detect**
```javascript
saveAndContinue(data); // Automatically uses current step
```

## Backwards Compatibility

✅ Old flat drafts automatically work
✅ Validation schemas unchanged
✅ formDataWithType is auto-flattened
✅ No breaking changes to existing functionality

## Need Help?

- See `MIGRATION_GUIDE.md` for detailed instructions
- See `IMPLEMENTATION_SUMMARY.md` for technical details
- See `.EXAMPLE.jsx` files for complete implementations
