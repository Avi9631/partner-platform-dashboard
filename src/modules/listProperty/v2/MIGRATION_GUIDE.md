# Migration Guide: Nested Form Data Structure

## Overview
The PropertyFormContextV2 now saves draft data in a nested structure where each step's data is grouped under the step ID:

### Old Structure (Flat)
```json
{
  "propertyType": "apartment",
  "propertyName": "Luxury Villa",
  "listingType": "sale",
  "bedrooms": 3,
  "bathrooms": 2,
  "carpetArea": 1200
}
```

### New Structure (Nested by Step)
```json
{
  "property-type": {
    "propertyType": "apartment"
  },
  "basic-details": {
    "propertyName": "Luxury Villa",
    "listingType": "sale",
    "propertyAge": "1-5"
  },
  "basic-configuration": {
    "bedrooms": 3,
    "bathrooms": 2,
    "carpetArea": 1200
  }
}
```

## Changes to PropertyFormContextV2

### New Helper Functions

1. **`getStepData(stepId)`**: Get data for a specific step
   ```javascript
   const stepData = getStepData('basic-details');
   // Returns: { propertyName: "...", listingType: "...", ... }
   ```

2. **`updateFormData(stepId, stepData)`**: Update data for a step (now requires stepId)
   ```javascript
   // Old way (deprecated)
   updateFormData({ propertyName: "Villa" });
   
   // New way
   updateFormData('basic-details', { propertyName: "Villa" });
   ```

3. **`saveAndContinue(stepData, stepId)`**: Save and move to next step
   ```javascript
   // stepId is optional - automatically uses current step if not provided
   saveAndContinue(formValues);
   // or
   saveAndContinue(formValues, 'basic-details');
   ```

### Backwards Compatibility

The context maintains **full backwards compatibility**:
- Can read old flat-structure drafts
- `formDataWithType` is automatically flattened for validation schemas
- `getCompletedStepsFromData` checks both nested and flat structures

## How to Update Step Components

### Example: BasicDetailsStepV2.jsx

#### Before (accessing flat formData)
```javascript
export default function BasicDetailsStepV2() {
  const { saveAndContinue, formData } = usePropertyFormV2();
  
  const form = useForm({
    defaultValues: {
      propertyName: formData.propertyName || '',
      listingType: formData.listingType || '',
      propertyAge: formData.propertyAge || '',
    }
  });
  
  const onSubmit = (data) => {
    saveAndContinue(data);
  };
}
```

#### After (accessing nested step data)
```javascript
export default function BasicDetailsStepV2() {
  const { saveAndContinue, getStepData } = usePropertyFormV2();
  
  // Get data specifically for this step
  const stepData = getStepData('basic-details');
  
  const form = useForm({
    defaultValues: {
      propertyName: stepData.propertyName || '',
      listingType: stepData.listingType || '',
      propertyAge: stepData.propertyAge || '',
    }
  });
  
  const onSubmit = (data) => {
    // stepId is automatically determined from current step
    saveAndContinue(data);
  };
}
```

### Example: PropertyTypeStepV2.jsx

```javascript
export default function PropertyTypeStepV2() {
  const { setPropertyType, saveDraft, getStepData } = usePropertyFormV2();
  
  const stepData = getStepData('property-type');
  const [selectedType, setSelectedType] = useState(stepData?.propertyType || null);

  const handleSelectType = async (type) => {
    setSelectedType(type);
    setPropertyType(type);
    
    // Save with nested structure
    await saveDraft({ 
      'property-type': { propertyType: type } 
    });
  };
}
```

## Step-by-Step Migration Checklist

For each step component, follow these steps:

### 1. Update Context Hook Usage
```javascript
// Add getStepData to destructured context
const { 
  saveAndContinue, 
  getStepData,  // Add this
  formData      // Can remove if only using getStepData
} = usePropertyFormV2();
```

### 2. Get Step-Specific Data
```javascript
// Define your step ID (should match the ID in stepConfiguration.js)
const STEP_ID = 'basic-details';
const stepData = getStepData(STEP_ID);
```

### 3. Update Default Values
```javascript
// Before
defaultValues: {
  propertyName: formData.propertyName || '',
  // ...
}

// After
defaultValues: {
  propertyName: stepData.propertyName || '',
  // ...
}
```

### 4. Update Form Submission
```javascript
// saveAndContinue automatically uses current step ID
const onSubmit = (data) => {
  saveAndContinue(data);
};

// Or explicitly pass stepId if needed
const onSubmit = (data) => {
  saveAndContinue(data, STEP_ID);
};
```

### 5. Update Manual Draft Saves
```javascript
// Before
await saveDraft({ propertyType: type });

// After - wrap in step ID
await saveDraft({ 
  'property-type': { propertyType: type } 
});

// Or use updateFormData
updateFormData('property-type', { propertyType: type });
await saveDraft(); // saves current formData
```

## Step IDs Reference

Match these IDs with your step components:

| Step Component | Step ID |
|---------------|---------|
| PropertyTypeStepV2 | `property-type` |
| LocationSelectionStepV2 | `location-selection` |
| BasicDetailsStepV2 | `basic-details` |
| BasicConfigurationStepV2 | `basic-configuration` |
| UnitAmenitiesStepV2 | `unit-amenities` |
| LocationStepV2 | `location-attributes` |
| FloorDetailsStepV2 | `floor-details` |
| LandAttributesStepV2 | `land-attributes` |
| PricingStepV2 | `pricing` |
| SuitableForStepV2 | `suitable-for` |
| ListingInfoStepV2 | `listing-info` |
| PropertyAmenitiesStepV2 | `property-amenities` |
| MediaUploadStepV2 | `media-upload` |

## Testing

After migration, verify:

1. ✅ Draft saves correctly with nested structure
2. ✅ Draft loads correctly (both old flat and new nested formats)
3. ✅ Form values populate correctly from draft
4. ✅ Step completion status reflects correctly
5. ✅ Navigation between steps works
6. ✅ Final submission has all data

## Benefits

1. **Clear Data Organization**: Each step's data is isolated
2. **Easier Debugging**: Can inspect data per step
3. **Better Validation**: Can validate step-by-step
4. **Modularity**: Steps are more independent
5. **API Ready**: Structure aligns with backend expectations
