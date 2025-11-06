# Quick Reference: Using React Hook Form in Property Listing

## Import Statements

```jsx
import { useFormContext } from 'react-hook-form';
import { usePropertyForm } from '../context/PropertyFormContext';
```

## Common Patterns

### 1. Reading Form Values
```jsx
const { watch } = useFormContext();
const fieldValue = watch('fieldName');
const allValues = watch(); // Get all form data
```

### 2. Setting Form Values
```jsx
const { setValue } = useFormContext();
setValue('fieldName', value);
setValue('fieldName', value, { shouldValidate: true }); // With validation
```

### 3. Registering Inputs
```jsx
const { register } = useFormContext();
<input {...register('fieldName')} />
```

### 4. Using Select Components
```jsx
const { watch, setValue } = useFormContext();
<Select
  value={watch('fieldName')}
  onValueChange={(value) => setValue('fieldName', value)}
>
  {/* options */}
</Select>
```

### 5. Validation
```jsx
const { formState: { errors } } = useFormContext();
{errors.fieldName && (
  <p className="text-red-500">{errors.fieldName.message}</p>
)}
```

### 6. Navigation
```jsx
const { nextStep, previousStep, goToStep } = usePropertyForm();
<Button onClick={nextStep}>Next</Button>
<Button onClick={previousStep}>Back</Button>
<Button onClick={() => goToStep(3)}>Go to Step 3</Button>
```

### 7. Step Validation
```jsx
const { updateStepValidation } = usePropertyForm();
useEffect(() => {
  const isValid = /* your validation logic */;
  updateStepValidation(stepNumber, isValid);
}, [dependencies]);
```

### 8. Property Type Check
```jsx
const { propertyType, isBuildingType, isLandType } = usePropertyForm();
if (isBuildingType()) {
  // Show building-specific fields
}
```

## Form Field Names

All fields available in the form context:

### Property Type
- `propertyType`

### Basic Details
- `projectName`
- `city`
- `addressText`
- `ageOfProperty`
- `possessionStatus`
- `possessionDate`

### Building Configuration
- `bedrooms`
- `bathrooms`
- `balconies`
- `additionalRooms[]`
- `carpetArea`
- `superArea`

### Furnishing
- `furnishingStatus`
- `flooringTypes[]`
- `furnishingDetails{}`

### Parking & Utilities
- `coveredParking`
- `openParking`
- `powerBackup`

### Location
- `facing`
- `view`

### Floor Details
- `towerName`
- `floorNumber`
- `totalFloors`
- `unitNumber`
- `isUnitNumberPrivate`

### Land Attributes
- `plotArea`
- `areaUnit`
- `plotDimension`
- `landUse`
- `roadWidth`
- `fencing`
- `irrigationSource`

### Listing Details
- `listingType`
- `price`
- `priceUnit`
- `maintenanceCharges`
- `availableFrom`
- `suitableFor[]`
- `title`
- `description`
- `amenities[]`

## Complete Component Template

```jsx
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { usePropertyForm } from '../context/PropertyFormContext';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function MyFormStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const { nextStep, previousStep, updateStepValidation } = usePropertyForm();

  // Watch field for validation
  const myField = watch('myField');

  // Update step validation
  useEffect(() => {
    const isValid = !!myField && myField.length > 0;
    updateStepValidation(stepNumber, isValid);
  }, [myField, updateStepValidation]);

  return (
    <div className="w-full px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Step Title
        </h2>
        <p className="text-muted-foreground text-sm">
          Step description
        </p>
      </motion.div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="myField">
            My Field <span className="text-red-500">*</span>
          </Label>
          <Input
            id="myField"
            {...register('myField')}
            placeholder="Enter value"
            className={errors.myField ? 'border-red-500' : ''}
          />
          {errors.myField && (
            <p className="text-sm text-red-500">{errors.myField.message}</p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={previousStep}
          >
            Back
          </Button>
          <Button
            onClick={nextStep}
            disabled={!myField}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
```

## Zod Schema Template

```js
import { z } from 'zod';

const myStepSchema = z.object({
  myField: z.string()
    .min(1, 'This field is required')
    .max(100, 'Maximum 100 characters'),
  optionalField: z.string().optional(),
  numberField: z.coerce.number()
    .min(0, 'Must be positive')
    .optional(),
  arrayField: z.array(z.string()).optional(),
});

export default myStepSchema;
```

## Debugging Tips

### 1. Check Current Form State
```jsx
const allData = watch();
console.log('Current form data:', allData);
```

### 2. Check Specific Field
```jsx
const { getValues } = useFormContext();
console.log('Field value:', getValues('fieldName'));
```

### 3. Check Validation Errors
```jsx
const { formState: { errors } } = useFormContext();
console.log('Validation errors:', errors);
```

### 4. Check Current Step
```jsx
const { currentStep, propertyType } = usePropertyForm();
console.log('Step:', currentStep, 'Type:', propertyType);
```

## Common Issues & Solutions

### Issue: Field value not updating
**Solution:** Use `setValue` instead of directly modifying state
```jsx
// ❌ Wrong
formData.field = value;

// ✅ Correct
setValue('field', value);
```

### Issue: Validation not working
**Solution:** Ensure field name matches schema
```jsx
// Schema
z.object({ myField: z.string() })

// Component - names must match!
<input {...register('myField')} />
```

### Issue: Form data lost between steps
**Solution:** Ensure PropertyFormProvider wraps all steps
```jsx
// In PropertyFormSheet.jsx
<PropertyFormProvider onClose={onOpenChange}>
  {/* All form steps here */}
</PropertyFormProvider>
```

### Issue: Can't access form context
**Solution:** Component must be inside PropertyFormProvider
```jsx
// Error: useFormContext() can only be used inside FormProvider
// Fix: Make sure component is rendered inside PropertyFormSheet
```
