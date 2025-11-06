# Form Components Refactoring - Complete Guide

## Overview
All form components in the listProperty module have been refactored to be **loosely coupled**, **self-contained**, and independently validated using **React Hook Form** with **Zod** schemas.

## Architecture Principles

### 1. **Loose Coupling**
- Each component manages its own form state
- Components don't directly depend on each other
- Communication happens only through the centralized store (useListPropertyStore)

### 2. **Self-Contained Validation**
- Each component has its own Zod schema
- Form validation happens independently within each component
- No shared validation logic between components

### 3. **Individual Schemas**
- Separate schema file for each component
- Type-safe validation rules
- Clear error messages
- Conditional validation based on field dependencies

## Refactored Components

### 1. **BasicDetails.jsx**
**Schema:** `basicDetailsSchema.js`

**Fields:**
- `projectName` (optional)
- `city` (required)
- `addressText` (required)
- `ageOfProperty` (required, number >= 0)
- `possessionStatus` (required, enum)
- `possessionDate` (conditional - required if under_construction)

**Key Features:**
- Uses `react-hook-form` with `zodResolver`
- Automatic validation on field change
- Conditional field display (possessionDate)
- Form submission triggers store update and navigation

---

### 2. **AreaDetails.jsx**
**Schema:** `areaDetailsSchema.js`

**Fields:**
- `carpetArea` (required, number > 0)
- `superArea` (required, number > 0, must be >= carpetArea)

**Key Features:**
- Cross-field validation (superArea >= carpetArea)
- Real-time error display
- Independent validation state

---

### 3. **BasicConfiguration.jsx**
**Schema:** `basicConfigurationSchema.js`

**Fields:**
- `bedrooms` (required, select dropdown)
- `bathrooms` (required, select dropdown)
- `balconies` (optional, select dropdown)
- `additionalRooms` (optional, array of strings)

**Key Features:**
- Uses `Controller` for Select components
- Checkbox-based multi-select for additional rooms
- Array manipulation with form validation

---

### 4. **FloorDetails.jsx**
**Schema:** `floorDetailsSchema.js`

**Fields:**
- `towerName` (optional)
- `floorNumber` (optional, number >= 0)
- `totalFloors` (optional, number > 0)
- `unitNumber` (optional)
- `isUnitNumberPrivate` (optional, boolean)

**Key Features:**
- Cross-field validation (floorNumber <= totalFloors)
- Switch component integration
- Conditional validation

---

### 5. **LandAttributes.jsx**
**Schema:** `landAttributesSchema.js`

**Fields:**
- `plotArea` (required, number > 0)
- `areaUnit` (required, enum)
- `plotDimension` (optional)
- `landUse` (required, enum)
- `roadWidth` (optional, number > 0)
- `fencing` (optional, boolean)
- `irrigationSource` (optional)

**Key Features:**
- Button group for land use selection
- Switch for fencing option
- Conditional field display (irrigation source)
- Complex form with multiple input types

---

### 6. **PricingInformation.jsx**
**Schema:** `pricingInformationSchema.js`

**Fields:**
- `listingType` (required, enum: sale/rent/lease)
- `price` (required, number > 0)
- `priceUnit` (required, enum)
- `maintenanceCharges` (optional, number >= 0)
- `availableFrom` (optional, date)

**Key Features:**
- Dynamic field display based on listingType
- Auto-sync with store using watch subscription
- Currency input formatting

---

### 7. **ListingInformation.jsx**
**Schema:** `listingInformationSchema.js`

**Fields:**
- `title` (required, 10-100 characters)
- `description` (required, 50-1000 characters)

**Key Features:**
- Character count display
- Min/max length validation
- Real-time validation feedback

---

### 8. **AmenitiesFeatures.jsx**
**Schema:** `amenitiesSchema.js`

**Fields:**
- `amenities` (optional, array of strings)

**Key Features:**
- Multi-select checkbox grid
- Memoized selection state
- Optimized rendering with useCallback

---

### 9. **SuitableFor.jsx**
**Schema:** `suitableForSchema.js`

**Fields:**
- `suitableFor` (optional, array of enums)

**Key Features:**
- Conditional rendering (only for rent/lease)
- Button-based multi-select
- Enum validation

---

## Schema Files Structure

```
src/modules/listProperty/schemas/
├── basicDetailsSchema.js
├── areaDetailsSchema.js
├── basicConfigurationSchema.js
├── floorDetailsSchema.js
├── landAttributesSchema.js
├── pricingInformationSchema.js
├── listingInformationSchema.js
├── amenitiesSchema.js
└── suitableForSchema.js
```

## Key Implementation Patterns

### 1. **Form Initialization**
```javascript
const {
  register,
  handleSubmit,
  control,
  watch,
  setValue,
  formState: { errors, isValid },
} = useForm({
  resolver: zodResolver(schema),
  mode: 'onChange',
  defaultValues: {
    // Initialize from store
  },
});
```

### 2. **Step Validation Update**
```javascript
useEffect(() => {
  updateStepValidation(stepIndex, isValid);
}, [isValid, updateStepValidation]);
```

### 3. **Form Submission**
```javascript
const onSubmit = (data) => {
  updateFormData(data);
  nextStep();
};
```

### 4. **Auto-Sync Pattern (for non-step components)**
```javascript
useEffect(() => {
  const subscription = watch((value) => {
    updateFormData(value);
  });
  return () => subscription.unsubscribe();
}, [watch, updateFormData]);
```

### 5. **Controller for Select Components**
```javascript
<Controller
  name="fieldName"
  control={control}
  render={({ field }) => (
    <Select value={field.value} onValueChange={field.onChange}>
      {/* Select options */}
    </Select>
  )}
/>
```

## Benefits of This Architecture

### ✅ **Maintainability**
- Each component can be modified independently
- Clear separation of concerns
- Easy to add/remove fields

### ✅ **Testability**
- Components can be tested in isolation
- Schemas can be unit tested separately
- No hidden dependencies

### ✅ **Type Safety**
- Zod provides runtime type checking
- TypeScript-compatible schemas
- Autocomplete support

### ✅ **User Experience**
- Real-time validation feedback
- Clear error messages
- Consistent validation behavior

### ✅ **Developer Experience**
- Easy to understand component structure
- Reusable patterns
- Minimal boilerplate

## Migration Impact

### What Changed
- ❌ Removed direct `onChange` handlers
- ❌ Removed manual validation logic
- ✅ Added react-hook-form integration
- ✅ Added Zod schemas
- ✅ Added proper error handling

### What Stayed the Same
- ✅ Store integration (useListPropertyStore)
- ✅ UI/UX (no visual changes)
- ✅ Navigation flow
- ✅ Data structure

## Future Enhancements

1. **Add TypeScript**
   - Convert schemas to TypeScript
   - Add type inference from Zod schemas

2. **Form State Persistence**
   - Save to localStorage
   - Resume incomplete forms

3. **Advanced Validation**
   - Async validation (e.g., check duplicate titles)
   - External API validation

4. **Accessibility**
   - ARIA labels for errors
   - Keyboard navigation
   - Screen reader support

## Testing Checklist

- [ ] Each component validates independently
- [ ] Form submission works correctly
- [ ] Error messages display properly
- [ ] Navigation between steps works
- [ ] Store updates correctly
- [ ] Conditional fields show/hide properly
- [ ] All validation rules work as expected
- [ ] No console errors or warnings

## Conclusion

All components are now **loosely coupled** with their own **validation schemas** and **form management**. This architecture ensures:
- Independent component development
- Easy maintenance and testing
- Consistent validation behavior
- Better user experience with real-time feedback
