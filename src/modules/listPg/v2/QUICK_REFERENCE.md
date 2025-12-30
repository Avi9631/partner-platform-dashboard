# Quick Reference Guide - ListPg V2

## 🎯 What Changed?

### Files Created
1. **`/hooks/usePgPublish.js`** - Publishing hook with API integration
2. **`/ARCHITECTURE.md`** - Complete architecture documentation
3. **`/IMPLEMENTATION_SUMMARY.md`** - Summary of all changes
4. **`/MODULE_COMPARISON.md`** - Side-by-side comparison with Property module

### Files Modified
1. **`/components/PgFormSidebar.jsx`** - Added publish button & dialog
2. **`/context/PgFormContextV2.jsx`** - Added currentStepSubmitHandler
3. **`/components/PgFormPageV2.jsx`** - Fixed layout & integrated footer
4. **`/index.js`** - Added new exports

---

## 📝 Usage Examples

### 1. Basic Page Usage
```javascript
import { PgFormPageV2 } from '@/modules/listPg/v2';

// Route configuration
<Route path="/list-pg-hostel/new" element={<PgFormPageV2 />} />
<Route path="/list-pg-hostel/edit/:draftId" element={<PgFormPageV2 />} />
```

### 2. Sheet/Modal Usage
```javascript
import { PgFormSheetV2 } from '@/modules/listPg/v2';

function ListingButton() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>List PG</Button>
      <PgFormSheetV2 open={open} onOpenChange={setOpen} />
    </>
  );
}
```

### 3. Using Context
```javascript
import { usePgFormV2 } from '@/modules/listPg/v2';

function CustomComponent() {
  const {
    currentStep,
    formData,
    saveAndContinue,
    completedSteps,
    draftId
  } = usePgFormV2();
  
  // Use context values...
}
```

### 4. Using Publish Hook
```javascript
import { usePgPublish } from '@/modules/listPg/v2';

function PublishButton() {
  const { draftId, formData } = usePgFormV2();
  const { publish, isPublishing } = usePgPublish(draftId, formData);
  
  return (
    <Button 
      onClick={publish} 
      disabled={isPublishing}
    >
      {isPublishing ? 'Publishing...' : 'Publish'}
    </Button>
  );
}
```

---

## 🔧 Key Functions

### Context Methods
```javascript
// Navigation
goToStep(stepIndex)          // Jump to specific step
previousStep()               // Go back one step
saveAndContinue(data)        // Save and move forward

// Data Management
updateFormData(data)         // Update form data
saveDraft(data)             // Save draft to backend
resetForm()                  // Clear all data

// Utilities
getTotalSteps()             // Get total step count
isStepCompleted(index)      // Check if step is done
getProgress()               // Get progress percentage

// Submit Handler
setCurrentStepSubmitHandler(fn)  // Register step submit function
```

### Step Configuration
```javascript
import { 
  getVisibleSteps,        // Get array of visible steps
  getStepComponent,       // Get component for step index
  getTotalVisibleSteps,   // Get total visible steps count
  getStepName            // Get step name by index
} from '@/modules/listPg/v2';
```

---

## 🏗️ Component Structure

```
PgFormPageV2
├── PgFormProviderV2 (Context)
└── PgFormContentV2
    ├── PgFormSidebar
    │   ├── Header
    │   ├── Progress Bar
    │   ├── Steps List
    │   ├── Publish Button  ← NEW
    │   └── Publish Dialog  ← NEW
    ├── Main Content
    │   ├── Header (Title + Actions)
    │   └── Step Content (Dynamic)
    └── SaveAndContinueFooter  ← NOW INTEGRATED
        ├── Back Button
        └── Save & Continue Button
```

---

## 🎨 Sidebar Features

### Visual States
- **Active Step:** Orange gradient background, white text
- **Completed Step:** Green checkmark, green highlight
- **Incomplete Step:** Gray background, numbered circle

### Interactions
- **Click Any Step:** Navigate freely (no locking)
- **Progress Bar:** Real-time completion tracking
- **Publish Button:** Confirmation dialog before publish
- **Auto-save Indicator:** Shows current save status

---

## 📋 Publishing Flow

```mermaid
User Clicks Publish
    ↓
Confirmation Dialog Opens
    ├─ Shows completion status (X/Y steps)
    ├─ Warning if incomplete
    └─ User confirms/cancels
    ↓
If Confirmed:
    ├─ usePgPublish.publish() called
    ├─ Data sanitized
    ├─ API request to backend
    ├─ Loading state shown
    └─ Success/Error toast
```

---

## 🔑 Key Props & State

### Context State
```typescript
{
  currentStep: number,
  formData: object,
  completedSteps: Set<number>,
  draftId: string | null,
  isLoadingDraft: boolean,
  isCreatingDraft: boolean,
  currentStepSubmitHandler: function | null  // NEW
}
```

### Publish Hook State
```typescript
{
  isPublishing: boolean,
  publish: () => Promise<{success: boolean, data?: any, error?: any}>
}
```

---

## 🚨 Common Patterns

### Creating a New Step

1. **Create Component:**
```javascript
// components/steps/NewStep.jsx
export default function NewStep() {
  const { saveAndContinue, formData, setCurrentStepSubmitHandler } = usePgFormV2();
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData
  });
  
  useEffect(() => {
    setCurrentStepSubmitHandler(() => form.handleSubmit(onSubmit));
  }, []);
  
  const onSubmit = (data) => {
    saveAndContinue(data);
  };
  
  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

2. **Add to Configuration:**
```javascript
// config/stepConfigurationPg.js
{
  id: 'new-step',
  name: 'New Step',
  component: NewStep,
  category: STEP_CATEGORIES.DETAILS,
  isVisible: () => true,
  order: 99,
}
```

3. **Create Schema:**
```javascript
// schemas/newStepSchema.js
export const newStepSchema = z.object({
  field: z.string().min(1, "Required"),
});
```

---

## 🐛 Troubleshooting

### Issue: Draft not saving
**Check:**
- Is `draftId` set in context?
- Are API endpoints correct?
- Check browser console for errors
- Verify backend is running

### Issue: Form data not persisting
**Check:**
- Is `updateFormData()` being called?
- Are `defaultValues` set in `useForm`?
- Is context provider wrapping components?

### Issue: Publish button disabled
**Check:**
- Is `draftId` present?
- Is form data saved?
- Check `isPublishing` state

### Issue: Footer not visible
**Check:**
- Is `isLoadingDraft` false?
- Is component wrapped in proper layout?
- Check z-index conflicts

---

## 📚 Related Files

### Services
- `@/services/pgHostelService.js` - API calls for PG/Hostel
- `@/services/draftService.js` - Draft management

### Utilities
- `@/lib/apiClient.js` - HTTP client wrapper
- `@/lib/utils.js` - Utility functions

### Components
- `@/components/ui/*` - Shadcn UI components

---

## ✅ Testing Checklist

When testing the module:
- [ ] Create new listing from scratch
- [ ] Navigate between steps
- [ ] Save draft manually
- [ ] Close and reload draft
- [ ] Complete all steps
- [ ] Publish listing
- [ ] Handle errors gracefully
- [ ] Test on mobile devices
- [ ] Check dark mode
- [ ] Verify auto-save works

---

## 🎓 Learning Resources

- **Full Architecture:** See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Implementation Details:** See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- **Module Comparison:** See [MODULE_COMPARISON.md](./MODULE_COMPARISON.md)
- **Property Module:** See `../listProperty/v2/README.md`

---

## 🔗 Quick Links

| What | Where |
|------|-------|
| Main Page Component | [PgFormPageV2.jsx](./components/PgFormPageV2.jsx) |
| Context Provider | [PgFormContextV2.jsx](./context/PgFormContextV2.jsx) |
| Step Config | [stepConfigurationPg.js](./config/stepConfigurationPg.js) |
| Publish Hook | [usePgPublish.js](./hooks/usePgPublish.js) |
| Sidebar | [PgFormSidebar.jsx](./components/PgFormSidebar.jsx) |
| All Exports | [index.js](./index.js) |

---

**Quick Ref Version:** 1.0  
**Last Updated:** December 30, 2025  
**Module Version:** 2.0
