# ListProperty UI - Quick Reference Guide

## 🎯 Quick Start

### Open the Form
```jsx
const [isSheetOpen, setIsSheetOpen] = useState(false);

<Button onClick={() => setIsSheetOpen(true)}>
  List New Property
</Button>

<PropertyFormSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
```

## 📊 Component Hierarchy

```
ListProperty.jsx (Landing Page)
└── PropertyFormSheet.jsx (Sheet Container)
    ├── PropertyFormSidebar.jsx (Navigation)
    └── Step Components:
        ├── PropertyTypeSelector.jsx
        ├── BasicDetails.jsx
        ├── BuildingAttributes.jsx (conditional)
        ├── LandAttributes.jsx (conditional)
        ├── ListingDetails.jsx
        └── ReviewAndSubmit.jsx
```

## 🎨 Key Features

### Sidebar Navigation
- ✅ Visual progress indicator
- ✅ Step validation status
- ✅ Click to jump to any valid step
- ✅ Property type badge
- ✅ Progress percentage

### Form Steps
1. **Property Type** - Select category
2. **Basic Details** - Location & info
3. **Attributes** - Building or Land details
4. **Listing** - Pricing & description
5. **Review** - Final check & submit

### Step States
- 🟢 **Completed** - Green with checkmark
- 🟠 **Current** - Orange highlighted
- ⚪ **Upcoming** - Gray, clickable if previous completed
- 🔒 **Locked** - Disabled until requirements met

## 💾 State Management

### Store Hook
```jsx
import useListPropertyStore from './store/useListPropertyStore';

const {
  currentStep,          // Current active step (0-4)
  formData,            // All form values
  stepValidation,      // Step completion status
  setCurrentStep,      // Navigate to step
  nextStep,            // Go forward
  previousStep,        // Go back
  updateFormData,      // Update values
  updateStepValidation,// Update validation
  resetForm,           // Clear everything
  isBuildingType,      // Check if building
  isLandType,          // Check if land
} = useListPropertyStore();
```

## 🎯 Common Tasks

### Validate a Step
```jsx
const checkIsValid = () => {
  return !!(formData.field1 && formData.field2);
};

useEffect(() => {
  updateStepValidation(stepNumber, checkIsValid());
}, [formData.field1, formData.field2]);
```

### Navigate Between Steps
```jsx
// Go to specific step
setCurrentStep(2);

// Go forward
nextStep();

// Go back
previousStep();
```

### Update Form Data
```jsx
// Single field
updateFormData({ city: 'New York' });

// Multiple fields
updateFormData({
  city: 'New York',
  addressText: '123 Main St',
  ageOfProperty: 5
});
```

## 🎨 Styling Guide

### Component Sizes
```jsx
// Headers
<h2 className="text-2xl font-bold mb-2">Title</h2>
<p className="text-sm text-muted-foreground">Description</p>

// Form Fields
<Input className="h-10 text-sm" />

// Buttons
<Button size="default" className="px-8">Action</Button>

// Containers
<div className="px-6 py-6">Content</div>
<div className="space-y-6">Sections</div>
```

## 🐛 Common Issues

### Sheet Won't Close
```jsx
const handleClose = () => {
  if (window.confirm('Close form?')) {
    resetForm();
    onOpenChange(false);
  }
};
```

### Can't Navigate Forward
- Check `stepValidation[currentStep]` is `true`
- Verify validation logic in component

---

**Version**: 2.0.0 | **Updated**: Nov 6, 2025
