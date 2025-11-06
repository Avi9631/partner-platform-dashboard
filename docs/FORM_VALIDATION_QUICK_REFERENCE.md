# Component Form Validation - Quick Reference

## 📋 Component Status Overview

| Component | Schema | Form Hook | Validation | Status |
|-----------|--------|-----------|------------|--------|
| PropertyTypeSelector | ❌ None | ❌ Manual | Manual | ✅ Working |
| BasicDetails | ✅ basicDetailsSchema | ✅ react-hook-form | Zod | ✅ Complete |
| AreaDetails | ✅ areaDetailsSchema | ✅ react-hook-form | Zod | ✅ Complete |
| BasicConfiguration | ✅ basicConfigurationSchema | ✅ react-hook-form | Zod | ✅ Complete |
| FloorDetails | ✅ floorDetailsSchema | ✅ react-hook-form | Zod | ✅ Complete |
| LandAttributes | ✅ landAttributesSchema | ✅ react-hook-form | Zod | ✅ Complete |
| PricingInformation | ✅ pricingInformationSchema | ✅ react-hook-form | Zod | ✅ Complete |
| ListingInformation | ✅ listingInformationSchema | ✅ react-hook-form | Zod | ✅ Complete |
| AmenitiesFeatures | ✅ amenitiesSchema | ✅ react-hook-form | Zod | ✅ Complete |
| SuitableFor | ✅ suitableForSchema | ✅ react-hook-form | Zod | ✅ Complete |

## 🚀 Quick Start - Adding a New Form Component

### 1. Create Schema File
```javascript
// src/modules/listProperty/schemas/myComponentSchema.js
import { z } from 'zod';

export const myComponentSchema = z.object({
  fieldName: z.string().min(1, 'Field is required'),
  // Add more fields...
});

export default myComponentSchema;
```

### 2. Create Component with Form
```javascript
// src/modules/listProperty/components/MyComponent.jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useListPropertyStore from '../store/useListPropertyStore';
import myComponentSchema from '../schemas/myComponentSchema';

export default function MyComponent() {
  const { formData, updateFormData, nextStep, previousStep, updateStepValidation } = 
    useListPropertyStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(myComponentSchema),
    mode: 'onChange',
    defaultValues: {
      fieldName: formData.fieldName || '',
    },
  });

  useEffect(() => {
    updateStepValidation(stepIndex, isValid);
  }, [isValid, updateStepValidation]);

  const onSubmit = (data) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Your form fields */}
    </form>
  );
}
```

## 🔧 Common Patterns

### Text Input
```javascript
<Input
  {...register('fieldName')}
  className={errors.fieldName ? 'border-red-500' : ''}
/>
{errors.fieldName && (
  <p className="text-sm text-red-500">{errors.fieldName.message}</p>
)}
```

### Select Dropdown
```javascript
<Controller
  name="selectField"
  control={control}
  render={({ field }) => (
    <Select value={field.value} onValueChange={field.onChange}>
      <SelectTrigger className={errors.selectField ? 'border-red-500' : ''}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
      </SelectContent>
    </Select>
  )}
/>
```

### Switch/Toggle
```javascript
<Switch
  checked={watch('boolField')}
  onCheckedChange={(checked) => 
    setValue('boolField', checked, { shouldValidate: true })
  }
/>
```

### Multi-Select (Array)
```javascript
const toggleItem = (item) => {
  const current = watch('arrayField') || [];
  const updated = current.includes(item)
    ? current.filter((i) => i !== item)
    : [...current, item];
  setValue('arrayField', updated, { shouldValidate: true });
};
```

## 📝 Schema Validation Examples

### Required String
```javascript
fieldName: z.string().min(1, 'Field is required')
```

### Number with Range
```javascript
age: z.string()
  .min(1, 'Age is required')
  .refine((val) => !isNaN(Number(val)) && Number(val) >= 18, {
    message: 'Must be 18 or older',
  })
```

### Enum
```javascript
status: z.enum(['active', 'inactive'], {
  errorMap: () => ({ message: 'Please select a status' }),
})
```

### Optional Field
```javascript
optionalField: z.string().optional()
```

### Array
```javascript
tags: z.array(z.string()).optional().default([])
```

### Conditional Validation
```javascript
z.object({
  hasValue: z.boolean(),
  value: z.string().optional(),
}).refine((data) => {
  if (data.hasValue && !data.value) {
    return false;
  }
  return true;
}, {
  message: 'Value is required when checkbox is checked',
  path: ['value'],
})
```

### Cross-Field Validation
```javascript
z.object({
  min: z.string(),
  max: z.string(),
}).refine((data) => {
  return Number(data.max) >= Number(data.min);
}, {
  message: 'Max must be greater than or equal to min',
  path: ['max'],
})
```

## 🎯 Best Practices

### ✅ DO
- Use `mode: 'onChange'` for real-time validation
- Set proper default values from formData
- Update step validation with useEffect
- Show error messages below fields
- Use `shouldValidate: true` when calling setValue
- Keep schemas in separate files
- Use descriptive error messages

### ❌ DON'T
- Don't mix controlled and uncontrolled inputs
- Don't bypass form validation
- Don't forget to update step validation
- Don't hardcode validation rules in components
- Don't directly mutate formData
- Don't skip error handling

## 🔍 Debugging Tips

### Check Form State
```javascript
console.log('Form Values:', watch());
console.log('Form Errors:', errors);
console.log('Is Valid:', isValid);
```

### Force Validation
```javascript
trigger(); // Validate all fields
trigger('fieldName'); // Validate specific field
```

### Reset Form
```javascript
reset({
  fieldName: 'new value',
});
```

### Get Field State
```javascript
const fieldState = getFieldState('fieldName');
console.log(fieldState.error, fieldState.isDirty);
```

## 📦 Dependencies

Make sure these are installed:
```json
{
  "react-hook-form": "^7.x",
  "@hookform/resolvers": "^3.x",
  "zod": "^3.x"
}
```

## 🔗 Store Integration

All components use the centralized store:
```javascript
const {
  formData,           // Current form data
  updateFormData,     // Update form data
  nextStep,           // Go to next step
  previousStep,       // Go to previous step
  updateStepValidation, // Update validation status
} = useListPropertyStore();
```

## 📚 Resources

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Form Components Refactoring Guide](./FORM_COMPONENTS_REFACTORING.md)
