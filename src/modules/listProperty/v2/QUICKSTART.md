# Quick Start Guide - Property Form V2

## ⚡ Get Started in 2 Minutes

### Step 1: Import the Component

```jsx
import { PropertyFormSheetV2 } from '@/modules/listProperty/v2';
```

### Step 2: Add State

```jsx
const [isOpen, setIsOpen] = useState(false);
```

### Step 3: Use the Component

```jsx
<PropertyFormSheetV2 
  open={isOpen} 
  onOpenChange={setIsOpen} 
/>
```

### Step 4: Add a Trigger

```jsx
<Button onClick={() => setIsOpen(true)}>
  List Property
</Button>
```

## 🎯 Complete Example

```jsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PropertyFormSheetV2 } from '@/modules/listProperty/v2';
import { PlusCircle } from 'lucide-react';

export default function MyPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        My Properties
      </h1>
      
      <Button 
        onClick={() => setShowForm(true)}
        className="bg-gradient-to-r from-orange-500 to-orange-600"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        List New Property
      </Button>

      <PropertyFormSheetV2 
        open={showForm} 
        onOpenChange={setShowForm} 
      />
    </div>
  );
}
```

## ✅ That's It!

You now have a fully functional multi-step property form with:
- ✓ Progressive step unlocking
- ✓ Save & Continue buttons
- ✓ Comprehensive review page
- ✓ Beautiful UI with animations
- ✓ Form validation
- ✓ Responsive design

## 🎨 Customization Options

### Custom Styling

The form uses Tailwind CSS classes. You can customize the appearance by:

1. **Modifying theme colors** in your `tailwind.config.js`
2. **Overriding component styles** with custom CSS
3. **Adjusting the gradient colors** in the component files

### Custom Callbacks

```jsx
<PropertyFormSheetV2 
  open={showForm} 
  onOpenChange={(open) => {
    setShowForm(open);
    // Add your custom logic
    if (!open) {
      console.log('Form closed');
    }
  }} 
/>
```

## 🔧 Advanced Usage

### Access Form Context

```jsx
import { usePropertyFormV2 } from '@/modules/listProperty/v2';

function CustomComponent() {
  const { 
    currentStep,
    saveAndContinue,
    getProgress,
    isStepCompleted 
  } = usePropertyFormV2();

  return (
    <div>
      <p>Current Step: {currentStep}</p>
      <p>Progress: {getProgress()}%</p>
    </div>
  );
}
```

### Pre-fill Form Data

```jsx
// Inside your component using the context
const methods = useFormContext();

// Set default values
useEffect(() => {
  methods.setValue('city', 'Mumbai');
  methods.setValue('propertyType', 'apartment');
}, [methods]);
```

## 📚 More Information

- See [README.md](./README.md) for comprehensive documentation
- Check [EXAMPLES.jsx](./EXAMPLES.jsx) for more usage examples
- View [VISUAL_GUIDE.md](./VISUAL_GUIDE.md) for UI details
- Read [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for technical details

## 🆘 Common Issues

### Form doesn't open?
Make sure you're passing boolean values to `open` and `onOpenChange` props.

### Steps not unlocking?
The form uses validation. Ensure required fields are filled before clicking "Save & Continue".

### Sidebar not showing?
Check that the viewport is wide enough. The sidebar is hidden on very small screens.

## 🎉 You're All Set!

Start listing properties with your new multi-step form. Happy coding! 🚀
