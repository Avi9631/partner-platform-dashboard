# Quick Start Guide - Developer Form V2

## 🚀 Getting Started in 5 Minutes

### Step 1: Import the Component

```jsx
import { DeveloperFormSheetV2 } from '@/modules/listDeveloper/v2';
```

### Step 2: Add State Management

```jsx
const [isOpen, setIsOpen] = useState(false);
```

### Step 3: Add the Component

```jsx
<DeveloperFormSheetV2 
  open={isOpen} 
  onOpenChange={setIsOpen} 
/>
```

### Step 4: Add a Trigger Button

```jsx
<Button onClick={() => setIsOpen(true)}>
  Register as Developer
</Button>
```

## Complete Example

```jsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DeveloperFormSheetV2 } from '@/modules/listDeveloper/v2';

export default function MyPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        Register as Developer
      </Button>
      
      <DeveloperFormSheetV2 
        open={isOpen} 
        onOpenChange={setIsOpen} 
      />
    </div>
  );
}
```

## Form Flow

1. **Developer Type** → Select your business structure
2. **Basic Information** → Company details and description
3. **Business Details** → Registration, PAN, GST, RERA
4. **Contact & Address** → Office locations and contacts
5. **Portfolio** → Projects and experience
6. **Documents** → Upload legal documents
7. **Review & Submit** → Final review and submission

## Available Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `open` | boolean | Yes | Controls sheet visibility |
| `onOpenChange` | function | Yes | Called when sheet should open/close |

## Using Context (Advanced)

```jsx
import { useDeveloperFormV2 } from '@/modules/listDeveloper/v2';

function MyCustomComponent() {
  const {
    currentStep,
    formData,
    saveAndContinue,
    previousStep,
  } = useDeveloperFormV2();

  return (
    <div>
      <p>Step: {currentStep + 1}</p>
      <button onClick={previousStep}>Back</button>
      <button onClick={() => saveAndContinue({})}>Next</button>
    </div>
  );
}
```

## Customization

### Change Theme Color

Edit `SaveAndContinueFooter.jsx` line 32:
```jsx
// Change from blue to your color
className="border-blue-200" // → border-purple-200
```

### Add/Remove Steps

Edit `DeveloperFormSheetV2.jsx` renderStepContent():
```jsx
case 7: return <YourNewStep />;
```

Update `getTotalSteps()` in context:
```jsx
return 8; // instead of 7
```

### Modify Validation

Edit schemas in `schemas/` folder:
```jsx
// Example: Make website required
website: z.string().url('Please enter a valid URL'),
```

## Troubleshooting

### Form not opening?
- Check `open` prop is controlled correctly
- Verify `onOpenChange` is set

### Validation not working?
- Check schema imports in step components
- Verify Zod is installed: `npm install zod`

### Styles not applied?
- Ensure Tailwind CSS is configured
- Check shadcn/ui components are installed

## Need Help?

- **Documentation**: See `README.md` for complete details
- **Examples**: Check `EXAMPLES.jsx` for more use cases
- **Architecture**: Review `IMPLEMENTATION_SUMMARY.md`

## Next Steps

1. ✅ **Test the form** - Click through all steps
2. 🔌 **Connect to API** - Implement backend integration
3. 📊 **Add analytics** - Track user behavior
4. 🎨 **Customize theme** - Match your brand colors
5. 🧪 **Add tests** - Write unit and integration tests

---

**Happy coding!** 🎉

