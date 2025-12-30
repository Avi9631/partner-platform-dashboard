# PG/Hostel Listing Module - Architecture & Flow

This document explains the architecture and flow of the PG/Hostel listing module, which follows the same patterns as the Property listing module.

## 📁 Project Structure

```
listPg/
├── v2/
│   ├── components/
│   │   ├── PgFormPageV2.jsx          # Full-page form with sidebar
│   │   ├── PgFormSheetV2.jsx         # Sheet/modal overlay variant
│   │   ├── PgFormSidebar.jsx         # Navigation sidebar with publish button
│   │   └── steps/
│   │       ├── BasicDetailsPgStep.jsx
│   │       ├── LocationDetailsPgStep.jsx
│   │       ├── RoomTypesPgStep.jsx
│   │       ├── AmenitiesPgStep.jsx
│   │       ├── FoodMessPgStep.jsx
│   │       ├── RulesRestrictionsPgStep.jsx
│   │       ├── MediaUploadPgStep.jsx
│   │       ├── AvailabilityPgStep.jsx (optional)
│   │       ├── SafetyCompliancePgStep.jsx (optional)
│   │       ├── ReviewAndSubmitPgStep.jsx
│   │       └── SaveAndContinueFooter.jsx  # Reusable footer
│   ├── config/
│   │   └── stepConfigurationPg.js     # Step configuration & visibility logic
│   ├── context/
│   │   └── PgFormContextV2.jsx        # Global form state management
│   ├── hooks/
│   │   └── usePgPublish.js            # Publishing logic hook
│   └── index.js                        # Public exports
└── schemas/
    ├── basicDetailsPgSchema.js
    ├── locationDetailsPgSchema.js
    ├── roomTypesPgSchema.js
    ├── amenitiesPgSchema.js
    ├── foodMessPgSchema.js
    ├── rulesRestrictionsPgSchema.js
    ├── mediaUploadPgSchema.js
    ├── availabilityPgSchema.js
    └── safetyCompliancePgSchema.js
```

## 🔄 Architecture Flow

### 1. **Context Layer** (PgFormContextV2.jsx)

The context is the central state management system for the entire form:

**Key Responsibilities:**
- Manages current step index
- Stores form data from all steps
- Handles draft creation and saving
- Tracks completed steps
- Provides navigation methods
- Manages submit handlers for each step

**Key State:**
```javascript
{
  currentStep: number,              // Current step index
  formData: object,                 // All form data
  completedSteps: Set,              // Set of completed step indices
  draftId: string,                  // Backend draft ID
  isLoadingDraft: boolean,          // Loading state
  isCreatingDraft: boolean,         // Creating draft state
  currentStepSubmitHandler: function // Current step's submit function
}
```

**Key Methods:**
- `saveAndContinue(stepData)` - Save current step and move forward
- `previousStep()` - Navigate to previous step
- `goToStep(index)` - Jump to specific step
- `saveDraft(data)` - Save draft to backend
- `updateFormData(data)` - Update form data in context

### 2. **Configuration Layer** (stepConfigurationPg.js)

Defines all steps and their properties:

**Step Configuration:**
```javascript
{
  id: 'basic-details',           // Unique identifier
  name: 'Basic Details',         // Display name
  component: BasicDetailsPgStep, // React component
  category: 'core',              // Step category
  isVisible: () => true,         // Visibility logic
  order: 0                       // Display order
}
```

**Helper Functions:**
- `getVisibleSteps(formData)` - Get currently visible steps
- `getStepComponent(index, formData)` - Get component for step
- `getTotalVisibleSteps(formData)` - Get total number of steps
- `getStepName(index, formData)` - Get step name by index

### 3. **Component Layer**

#### **PgFormPageV2** (Main Container)
- Full-page layout with fixed sidebar
- Renders current step component dynamically
- Displays header with save/close buttons
- Shows loading state while fetching draft
- Includes fixed footer with navigation buttons

**Flow:**
```
PgFormProviderV2 (Context)
  └── PgFormContentV2
       ├── PgFormSidebar (Navigation + Publish)
       ├── Header (Title + Actions)
       ├── Step Content (Dynamic)
       └── SaveAndContinueFooter (Navigation)
```

#### **PgFormSidebar** (Navigation)
- Shows all steps with progress
- Visual indicators: active, completed, incomplete
- Click any step to navigate (no locking)
- Publish button with confirmation dialog
- Progress bar showing completion

**Features:**
- ✅ Step completion checkmarks
- 🎯 Active step highlighting
- 📊 Progress percentage
- 🚀 Publish button with dialog
- 📝 Auto-save indicator

#### **Step Components** (Individual Steps)
Each step follows this pattern:

```javascript
export default function StepComponent() {
  const { saveAndContinue, formData, setCurrentStepSubmitHandler } = usePgFormV2();
  
  const form = useForm({
    resolver: zodResolver(stepSchema),
    defaultValues: formData
  });
  
  // Register submit handler with context
  useEffect(() => {
    setCurrentStepSubmitHandler(() => form.handleSubmit(onSubmit));
  }, [form.handleSubmit]);
  
  const onSubmit = (data) => {
    saveAndContinue(data);
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

### 4. **Publishing Flow** (usePgPublish.js)

The publishing hook handles the final submission:

**Process:**
1. Validates draftId exists
2. Sanitizes form data (removes non-serializable values)
3. Calls backend API (`pgHostelApi.publishPgColiveHostel`)
4. Shows success/error toast notifications
5. Manages publishing state

**Usage:**
```javascript
const { publish, isPublishing } = usePgPublish(draftId, formData);

const handlePublish = async () => {
  const result = await publish();
  if (result.success) {
    // Navigate or show success message
  }
};
```

## 🎯 User Flow

### Creating a New Listing

```
1. User clicks "List PG/Hostel"
   ↓
2. PgFormPageV2 loads → Context initialized
   ↓
3. Context creates empty draft (gets draftId)
   ↓
4. User on Step 1 (Basic Details)
   ├── Fills form
   ├── Clicks "Save & Continue"
   ├── Data saved to context
   ├── Draft saved to backend
   └── Moves to Step 2
   ↓
5. Repeat for each step...
   ↓
6. All steps completed
   ↓
7. User clicks "Publish PG/Hostel"
   ├── Shows confirmation dialog
   ├── User confirms
   ├── usePgPublish hook called
   ├── API request to backend
   └── Success notification
```

### Editing Existing Draft

```
1. User clicks "Edit Draft" with draftId
   ↓
2. PgFormPageV2 loads with draftId param
   ↓
3. Context fetches draft data via API
   ↓
4. Form data populated
   ↓
5. Completed steps calculated from data
   ↓
6. User can navigate to any step
   ↓
7. Changes auto-saved on each step
```

## 🔧 Key Features

### 1. **Auto-Save**
- Draft created on first step
- Each "Save & Continue" saves to backend
- Manual "Save Draft" button in header
- No data loss on accidental close

### 2. **Free Navigation**
- Click any step in sidebar
- No step locking mechanism
- Context maintains data across navigation

### 3. **Progress Tracking**
- Visual progress bar
- Completed step indicators
- Completion percentage shown

### 4. **Validation**
- Zod schema validation per step
- Real-time error display
- Form state validation with React Hook Form

### 5. **Responsive Design**
- Fixed sidebar on desktop
- Mobile-optimized layouts
- Touch-friendly interactions

## 🔌 Integration Points

### Backend API Endpoints

```javascript
// Draft Management
draftApi.createListingDraft('PG')
draftApi.getListingDraftById(draftId)
draftApi.updateListingDraft(draftId, data)

// Publishing
pgHostelApi.publishPgColiveHostel(data)
```

### Service Files
- `@/services/draftService` - Draft CRUD operations
- `@/services/pgHostelService` - PG/Hostel specific operations

## 📋 Comparison with Property Module

Both modules follow the same architecture pattern:

| Feature | Property | PG/Hostel |
|---------|----------|-----------|
| Context Provider | ✅ PropertyFormProviderV2 | ✅ PgFormProviderV2 |
| Step Configuration | ✅ stepConfiguration.js | ✅ stepConfigurationPg.js |
| Sidebar Navigation | ✅ PropertyFormSidebar | ✅ PgFormSidebar |
| Publish Hook | ✅ usePropertyPublish | ✅ usePgPublish |
| Footer Component | ✅ SaveAndContinueFooter | ✅ SaveAndContinueFooter |
| Draft Auto-Save | ✅ Yes | ✅ Yes |
| Free Navigation | ✅ Yes | ✅ Yes |
| Conditional Steps | ✅ Property Type Based | ❌ All Steps Always Visible |

## 🚀 Usage Examples

### Basic Usage

```javascript
import { PgFormPageV2 } from '@/modules/listPg/v2';

// In your route configuration
<Route path="/list-pg-hostel/new" element={<PgFormPageV2 />} />
<Route path="/list-pg-hostel/edit/:draftId" element={<PgFormPageV2 />} />
```

### Sheet/Modal Usage

```javascript
import { PgFormSheetV2 } from '@/modules/listPg/v2';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>List PG/Hostel</Button>
      <PgFormSheetV2 
        open={isOpen} 
        onOpenChange={setIsOpen}
        initialDraftId={draftId} // optional
      />
    </>
  );
}
```

### Using Context in Custom Components

```javascript
import { usePgFormV2 } from '@/modules/listPg/v2';

function CustomStepComponent() {
  const {
    currentStep,
    formData,
    saveAndContinue,
    previousStep,
    completedSteps
  } = usePgFormV2();
  
  // Use context values...
}
```

## 🛠️ Extending the Module

### Adding a New Step

1. **Create step component:**
```javascript
// components/steps/NewStep.jsx
export default function NewStep() {
  const { saveAndContinue, formData } = usePgFormV2();
  // ... implementation
}
```

2. **Add to step configuration:**
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

3. **Create validation schema:**
```javascript
// schemas/newStepSchema.js
import { z } from 'zod';

export const newStepSchema = z.object({
  // field definitions
});
```

### Customizing Publish Logic

```javascript
// hooks/usePgPublish.js
export function usePgPublish(draftId, formData) {
  // Add custom validation
  // Add custom data transformation
  // Add custom API calls
  // Add custom notifications
}
```

## 📝 Best Practices

1. **Always use context hook:** Access form state via `usePgFormV2()` hook
2. **Register submit handlers:** Use `setCurrentStepSubmitHandler` in step components
3. **Sanitize data:** Remove non-serializable values before API calls
4. **Handle errors gracefully:** Show user-friendly error messages
5. **Optimize re-renders:** Use `useMemo` and `useCallback` appropriately
6. **Test step navigation:** Ensure data persists across steps
7. **Validate thoroughly:** Use Zod schemas for all input validation

## 🐛 Troubleshooting

### Draft not saving?
- Check `draftId` is set in context
- Verify API endpoints are correct
- Check network tab for failed requests

### Steps not updating?
- Ensure `saveAndContinue` is called with proper data
- Check `updateFormData` is being called
- Verify context provider wraps components

### Form data not persisting?
- Check `defaultValues` in `useForm` hook
- Verify `formData` is passed from context
- Ensure step unmount doesn't clear data

## 📚 Related Documentation

- [Property Module Architecture](../listProperty/v2/README.md)
- [Form Validation with Zod](./schemas/README.md)
- [Draft Service API](../../services/draftService.js)
- [PG/Hostel Service API](../../services/pgHostelService.js)

---

**Last Updated:** December 30, 2025  
**Architecture Version:** 2.0  
**Maintained by:** Development Team
