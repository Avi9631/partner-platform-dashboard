# Dynamic Step Configuration System

## Overview

The property listing form now uses a **dynamic step configuration system** that allows steps to be shown or hidden based on any form field value, not just the property type.

## Architecture

### Files

- **`stepConfiguration.js`** - Central configuration for all form steps
- **`stepConfiguration.examples.md`** - Examples of conditional step configurations
- **`README.md`** - This file

### Key Concepts

1. **Step Configuration Object**: Each step is defined with:
   - `id`: Unique identifier
   - `name`: Display name
   - `component`: React component to render
   - `category`: Organization category (CORE, BUILDING, LAND, OPTIONAL)
   - `isVisible`: Function that returns `true`/`false` based on form data
   - `order`: Numeric order for sorting (supports decimals)

2. **Dynamic Visibility**: The `isVisible` function receives the current `formData` and can check any field:
   ```javascript
   isVisible: (formData) => formData.possessionStatus === 'under_construction'
   ```

3. **Automatic Recalculation**: Steps are automatically recalculated when form data changes, ensuring the right steps appear at the right time.

## How It Works

### 1. Step Configuration (stepConfiguration.js)

```javascript
export const STEP_CONFIG = [
  {
    id: 'floor-details',
    name: 'Floor Details',
    component: FloorDetailsStepV2,
    category: STEP_CATEGORIES.BUILDING,
    isVisible: (formData) => 
      PROPERTY_GROUPS.APARTMENT_LIKE.includes(formData.propertyType),
    order: 9,
  },
  // ... more steps
];
```

### 2. Context Integration (PropertyFormContextV2.jsx)

The context:
- Maintains `formData` with all field values
- Combines it with `propertyType` to create `formDataWithType`
- Uses memoization to recalculate visible steps only when data changes
- Provides `getTotalSteps()` dynamically

```javascript
const formDataWithType = useMemo(() => ({
  ...formData,
  propertyType,
}), [formData, propertyType]);

const getTotalSteps = useCallback(() => {
  return getTotalVisibleSteps(formDataWithType);
}, [formDataWithType]);
```

### 3. Component Rendering (PropertyFormSheetV2.jsx)

The form component:
- Gets the current step component dynamically
- No hardcoded switch statements
- Automatically adapts to configuration changes

```javascript
const renderStepContent = () => {
  const StepComponent = getStepComponent(currentStep, formDataWithType);
  return <StepComponent />;
};
```

## Benefits

### 1. **Flexibility**
- Add/remove steps without touching component logic
- Conditional steps based on ANY form field
- Complex business rules in one place

### 2. **Maintainability**
- All step logic centralized in `stepConfiguration.js`
- No nested switch statements
- Easy to understand flow

### 3. **Scalability**
- Add new conditional steps by simply adding to configuration
- No need to modify multiple files
- Supports complex conditional logic

### 4. **Testability**
- Step visibility logic is pure functions
- Easy to unit test
- Clear separation of concerns

## Adding a New Step

### Step 1: Create the Step Component

```jsx
// src/modules/listProperty/v2/components/steps/MyNewStepV2.jsx
export default function MyNewStepV2() {
  const { saveAndContinue, previousStep, formData } = usePropertyFormV2();
  
  // Your step implementation
  return (
    <div>
      {/* Step content */}
    </div>
  );
}
```

### Step 2: Add to Configuration

```javascript
// In stepConfiguration.js
import MyNewStepV2 from '../components/steps/MyNewStepV2';

export const STEP_CONFIG = [
  // ... existing steps
  {
    id: 'my-new-step',
    name: 'My New Step',
    component: MyNewStepV2,
    category: STEP_CATEGORIES.OPTIONAL,
    isVisible: (formData) => {
      // Your visibility logic
      return formData.someField === 'someValue';
    },
    order: 10.5, // Position in flow
  },
];
```

### Step 3: Test

The step will automatically appear when the condition is met. No other changes needed!

## Common Patterns

### Show for Specific Property Types
```javascript
isVisible: (formData) => 
  PROPERTY_GROUPS.BUILDING.includes(formData.propertyType)
```

### Show Based on Field Value
```javascript
isVisible: (formData) => 
  formData.possessionStatus === 'under_construction'
```

### Multiple Conditions (AND)
```javascript
isVisible: (formData) => {
  const isBuilding = PROPERTY_GROUPS.BUILDING.includes(formData.propertyType);
  const hasParking = formData.coveredParking > 0 || formData.openParking > 0;
  return isBuilding && hasParking;
}
```

### Multiple Conditions (OR)
```javascript
isVisible: (formData) => {
  const isPremiumType = ['villa', 'penthouse'].includes(formData.propertyType);
  const isLargeBHK = parseInt(formData.bedrooms || 0) >= 4;
  return isPremiumType || isLargeBHK;
}
```

### Numeric Comparisons
```javascript
isVisible: (formData) => {
  const price = parseFloat(formData.price || 0);
  return price >= 50000000; // 5 Crore+
}
```

### Array/List Checks
```javascript
isVisible: (formData) => {
  const reraIds = formData.reraIds || [];
  return reraIds.length > 0 && reraIds.some(r => r.id);
}
```

## Utility Functions

### `getVisibleSteps(formData)`
Returns array of visible step configurations based on form data.

### `getStepComponent(stepIndex, formData)`
Gets the component for a specific step index in the visible steps.

### `getTotalVisibleSteps(formData)`
Returns the total number of visible steps.

### `getStepName(stepIndex, formData)`
Gets the display name for a step.

### `isStepVisible(stepId, formData)`
Checks if a specific step ID is currently visible.

### `getStepIndexById(stepId, formData)`
Gets the index of a step within visible steps.

## Migration from Old System

### Before (Hardcoded)
```javascript
// PropertyFormSheetV2.jsx
const renderStepContent = () => {
  if (currentStep === 0) return <PropertyTypeStepV2 />;
  
  if (isBuildingType) {
    if (isApartmentOrPenthouse) {
      switch (currentStep) {
        case 1: return <LocationSelectionStepV2 />;
        case 2: return <GeoTagStepV2 />;
        // ... many more cases
      }
    }
  }
  // ... more nested logic
};
```

### After (Configuration-Based)
```javascript
// PropertyFormSheetV2.jsx
const renderStepContent = () => {
  const StepComponent = getStepComponent(currentStep, formDataWithType);
  return <StepComponent />;
};
```

All step logic is now in `stepConfiguration.js`!

## Debugging

### Enable Debug Logging

```javascript
// In PropertyFormContentV2
const visibleSteps = getVisibleSteps(formDataWithType);
console.log('Visible steps:', visibleSteps.map(s => ({ id: s.id, name: s.name })));
console.log('Current step:', currentStep);
console.log('Form data:', formDataWithType);
```

### Check Step Visibility

```javascript
import { isStepVisible } from '../config/stepConfiguration';

const isFloorDetailsVisible = isStepVisible('floor-details', formData);
console.log('Floor details visible?', isFloorDetailsVisible);
```

## Best Practices

1. **Keep `isVisible` functions pure** - No side effects
2. **Use defensive checks** - Always handle `undefined` values
3. **Provide sensible defaults** - Use `|| 0`, `|| ''`, `|| []`
4. **Extract complex logic** - Use helper functions for readability
5. **Use decimals for order** - Insert steps between existing ones (e.g., 8.5)
6. **Document conditions** - Add comments explaining business rules
7. **Test edge cases** - What if form is partially filled?
8. **Consider UX** - Don't show/hide steps too aggressively

## Performance

- Step visibility is recalculated using `useMemo` based on `formDataWithType`
- Only recalculates when form data actually changes
- `isVisible` functions should be lightweight (they run on every data change)
- No performance concerns for typical form sizes (< 20 steps)

## Future Enhancements

Potential improvements:
- Step dependencies graph visualization
- Validation warnings for unreachable steps
- Step progress estimation based on visible steps
- A/B testing different step flows
- Analytics on which steps users skip/complete
- Dynamic step ordering based on user behavior

## Examples

See `stepConfiguration.examples.md` for 10+ detailed examples of conditional step configurations.

## Support

For questions or issues:
1. Check the examples in `stepConfiguration.examples.md`
2. Review existing step configurations in `stepConfiguration.js`
3. Enable debug logging to see what's happening
4. Test your visibility logic independently before adding to config
