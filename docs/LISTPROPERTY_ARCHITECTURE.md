# ListProperty Component Architecture

## Component Tree

```
src/modules/
│
├── ListProperty.jsx (Main Entry - Landing Page)
│   ├── Stats Cards (Active Listings, Views, Buyers)
│   ├── "List New Property" Button
│   └── <PropertyFormSheet />
│
└── listProperty/
    │
    ├── components/
    │   │
    │   ├── PropertyFormSheet.jsx (Sheet Container)
    │   │   ├── SheetHeader (Title + Close)
    │   │   ├── <PropertyFormSidebar />
    │   │   └── ScrollArea
    │   │       └── Step Components (Dynamic)
    │   │
    │   ├── PropertyFormSidebar.jsx (Navigation)
    │   │   ├── Property Type Badge
    │   │   ├── Navigation Items (Steps 0-4)
    │   │   │   ├── Icon + Label
    │   │   │   ├── Status Indicator
    │   │   │   └── Validation Badge
    │   │   ├── Progress Bar
    │   │   └── Help Text
    │   │
    │   ├── PropertyTypeSelector.jsx (Step 0)
    │   │   ├── Header
    │   │   ├── Property Type Grid
    │   │   │   └── Type Cards (6 options)
    │   │   └── Continue Button
    │   │
    │   ├── BasicDetails.jsx (Step 1)
    │   │   ├── Header
    │   │   ├── Form (React Hook Form + Zod)
    │   │   │   ├── Project Name
    │   │   │   ├── City
    │   │   │   ├── Address
    │   │   │   ├── Age of Property
    │   │   │   ├── Possession Status
    │   │   │   └── Possession Date
    │   │   └── Navigation (Back + Continue)
    │   │
    │   ├── BuildingAttributes.jsx (Step 2 - Conditional)
    │   │   ├── Header
    │   │   ├── Basic Configuration
    │   │   │   ├── Bedrooms
    │   │   │   ├── Bathrooms
    │   │   │   ├── Balconies
    │   │   │   └── Additional Rooms
    │   │   ├── Area Details
    │   │   │   ├── Carpet Area
    │   │   │   └── Super Area
    │   │   ├── Furnishing & Amenities
    │   │   │   ├── Furnishing Status
    │   │   │   └── Flooring Types
    │   │   ├── Parking & Utilities
    │   │   │   ├── Parking (Covered + Open)
    │   │   │   └── Power Backup
    │   │   ├── Location Attributes
    │   │   │   ├── Facing Direction
    │   │   │   └── View
    │   │   ├── Floor Details (Apartments)
    │   │   │   ├── Tower Name
    │   │   │   ├── Floor Number
    │   │   │   ├── Total Floors
    │   │   │   └── Unit Number
    │   │   └── Navigation (Back + Continue)
    │   │
    │   ├── LandAttributes.jsx (Step 2 - Conditional)
    │   │   ├── Header
    │   │   ├── Plot Dimensions
    │   │   │   ├── Plot Area
    │   │   │   ├── Area Unit
    │   │   │   ├── Plot Dimensions
    │   │   │   └── Road Width
    │   │   ├── Land Use Classification
    │   │   ├── Additional Features
    │   │   │   ├── Fencing
    │   │   │   └── Irrigation Source
    │   │   └── Navigation (Back + Continue)
    │   │
    │   ├── ListingDetails.jsx (Step 3)
    │   │   ├── Header
    │   │   ├── Pricing Information
    │   │   │   ├── Listing Type
    │   │   │   ├── Price
    │   │   │   ├── Price Unit
    │   │   │   ├── Maintenance Charges
    │   │   │   └── Available From
    │   │   ├── Suitable For (Rent/Lease)
    │   │   ├── Listing Information
    │   │   │   ├── Title
    │   │   │   └── Description
    │   │   ├── Amenities & Features
    │   │   └── Navigation (Back + Continue)
    │   │
    │   ├── ReviewAndSubmit.jsx (Step 4)
    │   │   ├── Header
    │   │   ├── Summary Cards
    │   │   │   ├── Property Information
    │   │   │   ├── Location Details
    │   │   │   ├── Specifications
    │   │   │   └── Listing Details
    │   │   ├── Submit Button
    │   │   └── Success Screen (Conditional)
    │   │
    │   └── StepIndicator.jsx (Legacy - Not Used)
    │
    ├── store/
    │   └── useListPropertyStore.js (Zustand Store)
    │       ├── State
    │       │   ├── currentStep
    │       │   ├── formData
    │       │   └── stepValidation
    │       └── Actions
    │           ├── setCurrentStep()
    │           ├── nextStep()
    │           ├── previousStep()
    │           ├── updateFormData()
    │           ├── updateStepValidation()
    │           ├── resetForm()
    │           ├── getTotalSteps()
    │           ├── isBuildingType()
    │           └── isLandType()
    │
    └── schemas/
        └── basicDetailsSchema.js (Zod Validation)
```

## Data Flow

```
User Interaction
       ↓
Component Event Handler
       ↓
Zustand Store Action
       ↓
Store State Update
       ↓
Component Re-render
       ↓
UI Update
```

## Navigation Flow

```
Step 0: Property Type Selection
       ↓ (Select type + Continue)
Step 1: Basic Details
       ↓ (Fill form + Validate)
Step 2: Building OR Land Attributes (Conditional)
       ↓ (Fill specifications)
Step 3: Listing Details
       ↓ (Pricing + Description)
Step 4: Review & Submit
       ↓ (Verify + Submit)
Success Screen
```

## State Management Flow

```
Initial State (Step 0)
       ↓
User selects property type
       ↓
updateFormData({ propertyType: 'apartment' })
       ↓
updateStepValidation(0, true)
       ↓
nextStep() → currentStep = 1
       ↓
User fills basic details
       ↓
updateFormData({ city, address, ... })
       ↓
Form validation triggers
       ↓
updateStepValidation(1, isValid)
       ↓
Continue...
```

## Sidebar Navigation Logic

```
User clicks step in sidebar
       ↓
Check: Can navigate to step?
       ├─ YES → setCurrentStep(targetStep)
       │        ↓
       │   Update UI to show new step
       │
       └─ NO → Prevent navigation
              ↓
         Show validation message (future)
```

## Validation Flow

```
Form Field Changes
       ↓
React Hook Form validates
       ↓
useEffect detects changes
       ↓
checkIsValid() runs
       ↓
updateStepValidation(step, result)
       ↓
Sidebar updates validation badge
       ↓
Navigation enabled/disabled
```

## Sheet Lifecycle

```
1. User clicks "List New Property"
   ↓
2. setIsSheetOpen(true)
   ↓
3. PropertyFormSheet renders
   ↓
4. Sidebar appears (if property type selected)
   ↓
5. User completes form
   ↓
6. User clicks Close/Submit
   ↓
7. Confirmation dialog (if data exists)
   ↓
8. resetForm() called
   ↓
9. onOpenChange(false)
   ↓
10. Sheet closes
```

## Conditional Rendering Logic

```
Step 2 Decision Tree:
    
    formData.propertyType?
         ↓
    ┌────┴────┐
    ↓         ↓
Building    Land
Types       Types
    ↓         ↓
Render      Render
Building    Land
Attributes  Attributes
```

## Component Communication

```
PropertyFormSheet
    ↓ (props: open, onOpenChange)
    ├─→ PropertyFormSidebar
    │       ↓ (uses: useListPropertyStore)
    │       ├─ currentStep
    │       ├─ stepValidation
    │       └─ setCurrentStep
    │
    └─→ Step Components
            ↓ (uses: useListPropertyStore)
            ├─ formData
            ├─ updateFormData
            ├─ nextStep
            ├─ previousStep
            └─ updateStepValidation
```

---

**Legend:**
- `→` Data/Control Flow
- `↓` Sequential Flow
- `├─` Branch
- `└─` End Branch

**Last Updated**: November 6, 2025
