# Quick Reference: Adding Validation Logging to Form Steps

## Quick Copy-Paste Template

### 1. Add Import at Top of File

```javascript
import { useEffect, useMemo } from 'react';
import { createStepLogger } from '../../../utils/validationLogger';
```

### 2. Create Logger Instance in Component

```javascript
export default function YourStepComponent() {
  const { saveAndContinue, previousStep, formData } = usePropertyFormV2();
  
  // Create logger instance (memoized to prevent recreation)
  const logger = useMemo(() => createStepLogger('Your Step Name'), []);
  
  // ... rest of your component
}
```

### 3. Add Error Logging Effect

```javascript
// Log validation errors when they change
useEffect(() => {
  if (Object.keys(formState.errors).length > 0) {
    logger.logErrors(formState.errors);
  }
}, [formState.errors, logger]);
```

### 4. Update Submit Handler

```javascript
// Success handler
const onSubmit = (data) => {
  logger.logSubmission(data, formState.errors);
  saveAndContinue(data);
};

// Error handler
const onError = (errors) => {
  logger.logSubmission(form.getValues(), errors);
};
```

### 5. Update Form Element

```javascript
// If using <form> element directly:
<form onSubmit={handleSubmit(onSubmit, onError)}>
  {/* form fields */}
</form>

// If using SaveAndContinueFooter:
<SaveAndContinueFooter
  onBack={previousStep}
  onSaveAndContinue={handleSubmit(onSubmit, onError)}
  nextDisabled={!formState.isValid}
  showBack={true}
/>
```

## Complete Example

```javascript
import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import yourSchema from '../../../schemas/yourSchema';
import SaveAndContinueFooter from '../SaveAndContinueFooter';
import { createStepLogger } from '../../../utils/validationLogger';

export default function YourStepV2() {
  const { saveAndContinue, previousStep, formData } = usePropertyFormV2();
  
  // Create logger instance
  const logger = useMemo(() => createStepLogger('Your Step Name'), []);

  // Initialize React Hook Form with Zod validation
  const form = useForm({
    resolver: zodResolver(yourSchema),
    mode: 'onChange',
    defaultValues: {
      // your default values
    },
  });

  const { control, watch, formState, handleSubmit } = form;

  // Log validation errors when they change
  useEffect(() => {
    if (Object.keys(formState.errors).length > 0) {
      logger.logErrors(formState.errors);
    }
  }, [formState.errors, logger]);

  // Handle form submission
  const onSubmit = (data) => {
    logger.logSubmission(data, formState.errors);
    saveAndContinue(data);
  };

  const onError = (errors) => {
    logger.logSubmission(form.getValues(), errors);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Your form UI */}
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        {/* form fields */}
        
        <SaveAndContinueFooter
          onBack={previousStep}
          nextDisabled={!formState.isValid}
          showBack={true}
        />
      </form>
    </div>
  );
}
```

## Different Form Patterns

### Pattern 1: Using React Hook Form's `useForm`

```javascript
const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onChange',
});

// Use: form.formState.errors, form.getValues(), form.handleSubmit()
```

### Pattern 2: Using React Hook Form's `FormProvider`

```javascript
const methods = useForm({
  resolver: zodResolver(schema),
  mode: 'onChange',
});

// Use: methods.formState.errors, methods.getValues(), methods.handleSubmit()

return (
  <FormProvider {...methods}>
    <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
      {/* form fields */}
    </form>
  </FormProvider>
);
```

### Pattern 3: Form Without Validation Schema

```javascript
// If your form doesn't use Zod schema validation:
const methods = useForm({
  mode: 'onChange',
});

// You can still log errors, but they won't be Zod validation errors
useEffect(() => {
  if (Object.keys(methods.formState.errors).length > 0) {
    logger.logErrors(methods.formState.errors);
  }
}, [methods.formState.errors, logger]);
```

## Customizing Logger Output

### Change Step Name

```javascript
// Use descriptive names that identify the form step
const logger = useMemo(() => createStepLogger('Property Configuration Step'), []);
const logger = useMemo(() => createStepLogger('Amenities & Features Step'), []);
const logger = useMemo(() => createStepLogger('Final Review Step'), []);
```

### Add Custom Logging

```javascript
// Log specific events
const handleFieldChange = (fieldName, value) => {
  console.log(`Field ${fieldName} changed to:`, value);
  setValue(fieldName, value);
};

// Log form state on demand
const debugFormState = () => {
  logger.logState(formState);
};

// Log individual field validation
const handleFieldBlur = (fieldName) => {
  const error = formState.errors[fieldName];
  const value = watch(fieldName);
  logger.logField(fieldName, error, value);
};
```

## Troubleshooting

### Logger Not Showing Up
- Check console is open in DevTools
- Verify no console filters are active
- Check that formState.errors actually has errors

### Errors Not Updating
- Ensure `mode: 'onChange'` is set in useForm
- Check that dependencies array includes `logger`
- Verify formState.errors is being watched

### Duplicate Logs
- Make sure logger is memoized with `useMemo`
- Check that effect dependencies are correct
- Verify no duplicate useEffect hooks

## Checklist

Before committing your changes, verify:

- [ ] Import statement for `createStepLogger` added
- [ ] Logger instance created with `useMemo`
- [ ] Step name is descriptive and unique
- [ ] `useEffect` logs errors when they change
- [ ] Dependencies array includes `formState.errors` and `logger`
- [ ] `onSubmit` logs successful submissions
- [ ] `onError` logs failed submissions
- [ ] `handleSubmit` receives both `onSubmit` and `onError`
- [ ] No linting errors
- [ ] Tested in browser console

## Common Mistakes to Avoid

❌ **Don't** create logger without memoization:
```javascript
const logger = createStepLogger('Step Name'); // Will recreate on every render
```

✅ **Do** use useMemo:
```javascript
const logger = useMemo(() => createStepLogger('Step Name'), []); // Created once
```

---

❌ **Don't** forget dependencies:
```javascript
useEffect(() => {
  logger.logErrors(formState.errors);
}, [formState.errors]); // Missing logger dependency
```

✅ **Do** include all dependencies:
```javascript
useEffect(() => {
  logger.logErrors(formState.errors);
}, [formState.errors, logger]);
```

---

❌ **Don't** log unconditionally:
```javascript
useEffect(() => {
  logger.logErrors(formState.errors); // Logs even when no errors
}, [formState.errors, logger]);
```

✅ **Do** check for errors first:
```javascript
useEffect(() => {
  if (Object.keys(formState.errors).length > 0) {
    logger.logErrors(formState.errors);
  }
}, [formState.errors, logger]);
```

---

❌ **Don't** pass only onSubmit:
```javascript
<form onSubmit={handleSubmit(onSubmit)}>
```

✅ **Do** pass both handlers:
```javascript
<form onSubmit={handleSubmit(onSubmit, onError)}>
```
