# PG/Hostel Listing Module V2

## Overview

Complete PG/Hostel listing system modeled after the property listing flow with comprehensive 10-step form process.

## Architecture

The module follows the same architecture as `listProperty/v2` with:
- **Multi-step form** with progressive navigation
- **Context-based state management**
- **Zod schema validation**
- **Draft save functionality**
- **Modern UI with Shadcn components**

## Directory Structure

```
listPg/
├── schemas/                          # Zod validation schemas
│   ├── basicDetailsPgSchema.js       # Property name, type, gender, owner info
│   ├── locationDetailsPgSchema.js    # Address, landmark, nearby places
│   ├── roomTypesPgSchema.js          # Room categories, pricing, availability
│   ├── amenitiesPgSchema.js          # Common and room amenities
│   ├── foodMessPgSchema.js           # Meal options, timings, food type
│   ├── rulesRestrictionsPgSchema.js  # Property rules and policies
│   ├── mediaUploadPgSchema.js        # Images and videos
│   ├── availabilityPgSchema.js       # Bed inventory management
│   └── safetyCompliancePgSchema.js   # Safety measures and certifications
│
├── v2/
│   ├── components/
│   │   ├── PgFormSheetV2.jsx         # Main form container
│   │   └── steps/
│   │       ├── BasicDetailsPgStep.jsx           # Step 1: Property basics
│   │       ├── LocationDetailsPgStep.jsx        # Step 2: Location details
│   │       ├── RoomTypesPgStep.jsx              # Step 3: Room types & pricing
│   │       ├── AmenitiesPgStep.jsx              # Step 4: Amenities
│   │       ├── FoodMessPgStep.jsx               # Step 5: Food & mess
│   │       ├── RulesRestrictionsPgStep.jsx      # Step 6: Rules
│   │       ├── MediaUploadPgStep.jsx            # Step 7: Media
│   │       ├── AvailabilityPgStep.jsx           # Step 8: Availability
│   │       ├── SafetyCompliancePgStep.jsx       # Step 9: Safety
│   │       ├── ReviewAndSubmitPgStep.jsx        # Step 10: Review
│   │       ├── SaveAndContinueFooter.jsx        # Reusable footer
│   │       └── PlaceholderSteps.jsx             # Template implementations
│   │
│   ├── config/
│   │   └── stepConfigurationPg.js    # Step definitions and order
│   │
│   ├── context/
│   │   └── PgFormContextV2.jsx       # Form state management
│   │
│   └── index.js                      # Module exports
```

## Form Steps (10 Total)

### 1. Basic Details
- Property name
- Property type (PG/Hostel/Co-living/Rooms/Service Apartment)
- Gender allowed (Gents/Ladies/Unisex)
- Short and long descriptions
- Owner/Manager information
- Brand management info
- Year built/renovated

### 2. Location Details
- Full address (line 1, line 2, city, state, pincode)
- Landmark
- Coordinates (latitude, longitude)
- Nearby places:
  - Colleges
  - IT parks
  - Bus stops
  - Metro stations
  - Hospitals

### 3. Room Types & Pricing
Multiple room types with:
- Category (Single/Double/Triple/4-6 sharing/Private/Studio)
- AC/Non-AC
- Attached washroom, balcony
- Room size
- Rent per month
- Security deposit
- Maintenance charges
- Food included/cost
- Electricity included/per unit cost
- Booking amount
- Refund policy
- Available/Total rooms

### 4. Amenities
**Common Amenities:**
- WiFi, Parking, CCTV, Power backup
- Lift, Housekeeping, Laundry
- Water purifier, Geyser
- Security guard, Biometric access
- Visitor policy, Rooftop access

**Room Amenities:**
- Bed type, Mattress, Cupboard
- Study table, Chair
- Fan, AC, Refrigerator, TV
- Window, Attached bathroom, Balcony

### 5. Food & Mess
- Meal availability (Breakfast/Lunch/Dinner)
- Food type (Veg/Non-veg/Both)
- Weekly menu
- Kitchen timings
- Cooking allowed
- Tiffin service partner
- RO water availability

### 6. Rules & Restrictions
- Gate closing time
- Visitor policy and timings
- Alcohol/Smoking allowed
- Non-veg allowed
- Pets allowed
- Quiet hours
- Minimum stay period
- Notice period
- Additional rules

### 7. Media Upload
- Property images (cover + gallery)
- Room images (per room type)
- Washroom images
- Amenities images
- Virtual tour URL
- Video URLs

### 8. Availability & Inventory
- Total beds
- Available beds
- Sold out status
- Next availability date
- Auto-update via owner app
- Seasonal pricing

### 9. Safety & Compliance
- Fire safety certificate
- Police verification details
- First-aid kit availability
- CCTV coverage percentage
- Emergency exits
- Night guard availability
- Additional safety measures

### 10. Review & Submit
- Collapsible review sections
- Edit any step
- Final submission

## Usage

### Basic Implementation

```jsx
import { PgFormSheetV2 } from '@/modules/listPg/v2';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        List PG/Hostel
      </button>
      
      <PgFormSheetV2 
        open={isOpen} 
        onOpenChange={setIsOpen} 
      />
    </>
  );
}
```

### With Draft Editing

```jsx
<PgFormSheetV2 
  open={isOpen} 
  onOpenChange={setIsOpen}
  initialDraftId={draftId}
  editingDraft={draftData}
/>
```

### Using the Context

```jsx
import { usePgFormV2 } from '@/modules/listPg/v2';

function CustomComponent() {
  const { 
    currentStep, 
    saveAndContinue, 
    previousStep,
    formData 
  } = usePgFormV2();

  return (
    <div>
      <p>Current Step: {currentStep}</p>
      <button onClick={saveAndContinue}>Save & Continue</button>
    </div>
  );
}
```

## Data Structure

### Basic Details Example
```json
{
  "propertyName": "Sunshine PG for Gents",
  "propertyType": "pg",
  "genderAllowed": "gents",
  "shortDescription": "Comfortable PG near IT parks",
  "longDescription": "Well-maintained PG with all modern amenities...",
  "ownerName": "John Doe",
  "managerContact": "9876543210",
  "isBrandManaged": false,
  "yearBuilt": "2020"
}
```

### Room Type Example
```json
{
  "category": "double_sharing",
  "hasAc": true,
  "hasAttachedWashroom": true,
  "hasBalcony": false,
  "roomSize": 150,
  "rentPerMonth": 8000,
  "securityDeposit": 16000,
  "maintenanceCharges": 500,
  "isFoodIncluded": true,
  "isElectricityIncluded": false,
  "electricityPerUnit": 8,
  "availableRooms": 3,
  "totalRooms": 5
}
```

## API Integration (TODO)

The module is designed to work with these API endpoints:

```javascript
// Create new PG draft
draftApi.createPgDraft({ status: 'draft' })

// Update PG draft
draftApi.updatePgDraft(draftId, formData)

// Get user's PG drafts
draftApi.getUserPgDrafts()

// Get specific PG draft
draftApi.getPgDraftById(draftId)

// Delete PG draft
draftApi.deletePgDraft(draftId)
```

## Implementation Status

### ✅ Completed
- All validation schemas
- Step configuration
- Form context and state management
- Main form sheet component
- Basic Details step (fully implemented)
- SaveAndContinueFooter component
- Placeholder step components
- Main page component (ListPgHostelV2)
- Routing integration
- Dashboard card

### 🚧 Pending
- Full implementation of steps 2-10
- API integration for draft management
- Media upload functionality
- Review page with edit capabilities
- Backend API endpoints

## Next Steps

1. **Implement Remaining Steps**: Fully develop steps 2-10 following the BasicDetailsPgStep pattern
2. **API Integration**: Connect to backend endpoints for draft management
3. **Media Upload**: Integrate S3 upload functionality
4. **Testing**: Add unit and integration tests
5. **Documentation**: Add inline documentation and examples

## Differences from Property Listing

| Feature | Property Listing | PG/Hostel Listing |
|---------|------------------|-------------------|
| Steps | 9-16 (conditional) | 10 (fixed) |
| Room Management | N/A | Multiple room types |
| Food & Mess | N/A | Dedicated step |
| Rules | Limited | Comprehensive |
| Availability | N/A | Bed inventory |
| Safety | Basic amenities | Dedicated compliance step |

## Key Features

- **Progressive Form**: Step-by-step with validation
- **Draft Auto-save**: Automatic draft creation and updates
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels and keyboard navigation
- **Type Safety**: Zod schemas for validation
- **Modern UI**: Shadcn components with smooth animations
- **Reusable Components**: Modular architecture

## Contributing

When adding new features:
1. Follow the existing pattern from property listing
2. Add Zod schemas for validation
3. Create step components with proper error handling
4. Update step configuration
5. Test with different screen sizes
6. Add documentation

## Support

For issues or questions:
- Check existing property listing implementation
- Review schema definitions
- Verify step configuration
- Check console for validation errors
