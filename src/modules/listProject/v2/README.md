# Project Listing Module V2

## Overview

Complete Project listing system modeled after the PG/Hostel listing flow with comprehensive 9-step form process.

## Architecture

The module follows the same architecture as `listPg/v2` with:
- **Multi-step form** with progressive navigation
- **Context-based state management**
- **Zod schema validation**
- **Draft save functionality**
- **Modern UI with Shadcn components**

## Directory Structure

```
listProject/
├── schemas/                              # Zod validation schemas
│   ├── basicDetailsProjectSchema.js      # Project name, developer, type, status, RERA
│   ├── locationDetailsProjectSchema.js   # Address, coordinates, nearby places
│   ├── configurationsProjectSchema.js    # Unit configurations, BHK types, areas
│   ├── pricingProjectSchema.js          # Pricing per config, payment plans
│   ├── amenitiesProjectSchema.js        # All amenities and facilities
│   ├── mediaUploadProjectSchema.js      # Images, videos, floor plans
│   ├── legalDocsProjectSchema.js        # RERA, approvals, certificates
│   └── additionalInfoProjectSchema.js   # Highlights, USPs, investment info
│
├── v2/
│   ├── components/
│   │   ├── ProjectFormPageV2.jsx         # Main form page
│   │   ├── ProjectFormSheetV2.jsx        # Form sheet with sidebar
│   │   └── steps/
│   │       ├── BasicDetailsProjectStep.jsx           # Step 1: Basic info
│   │       ├── LocationDetailsProjectStep.jsx        # Step 2: Location
│   │       ├── ConfigurationsProjectStep.jsx         # Step 3: Configurations
│   │       ├── PricingProjectStep.jsx                # Step 4: Pricing
│   │       ├── AmenitiesProjectStep.jsx              # Step 5: Amenities
│   │       ├── MediaUploadProjectStep.jsx            # Step 6: Media
│   │       ├── LegalDocsProjectStep.jsx              # Step 7: Legal docs
│   │       ├── AdditionalInfoProjectStep.jsx         # Step 8: Additional info
│   │       ├── ReviewAndSubmitProjectStep.jsx        # Step 9: Review
│   │       └── SaveAndContinueFooter.jsx             # Reusable footer
│   │
│   ├── config/
│   │   └── stepConfigurationProject.js   # Step definitions and order
│   │
│   ├── context/
│   │   └── ProjectFormContextV2.jsx      # Form state management
│   │
│   ├── index.js                          # Module exports
│   └── README.md                         # This file
│
└── PROJECT_ANALYSIS_AND_IMPLEMENTATION.md # Detailed analysis
```

## Form Steps (9 Total)

### 1. Basic Details
- Project name (required)
- Developer/Builder name (required)
- Project type (Residential/Commercial/Mixed-Use)
- Project status (Upcoming/Under Construction/Ready to Move/Completed)
- RERA registration number (required)
- Launch date
- Possession date
- Total project area
- Number of towers/blocks
- Total units
- Project description

### 2. Location Details
- Complete address (Line 1, Line 2, City, State, Pincode)
- Landmark
- Coordinates (latitude, longitude)
- Nearby places:
  - Schools
  - Hospitals
  - Metro/Bus stations
  - Shopping malls
  - IT parks
  - Airports
- Connectivity information

### 3. Unit Configurations
Multiple configurations with:
- Configuration type (1/2/3/4 BHK, Villa, Plot, etc.)
- Number of units
- Number of bathrooms
- Number of balconies
- Carpet area (min-max)
- Built-up area (min-max)
- Super built-up area (min-max)
- Floor plan images
- Availability status

### 4. Pricing Details
- Configuration-wise pricing:
  - Base price
  - Maximum price (for range)
  - Price per sq.ft
- Booking amount
- Payment plans
- Bank loan availability
- Bank tie-ups
- GST applicable & percentage
- Registration charges
- Maintenance charges
- Parking charges
- Club membership charges

### 5. Amenities & Facilities
**Common Amenities:**
- Swimming pool, Gymnasium, Clubhouse
- Indoor games room, Kids play area
- Jogging track, Tennis/Basketball/Badminton courts
- Amphitheater, Yoga center, Party hall
- Library, Co-working spaces, Mini theater
- Spa/Jacuzzi, Cafeteria, Guest rooms
- Pet park, Landscaped gardens

**Security & Safety:**
- 24x7 Security, CCTV surveillance
- Gated community, Intercom facility
- Fire safety systems, Earthquake resistant
- Video doorphone system

**Utilities:**
- Power backup, Lift/Elevator
- 24x7 Water supply, Sewage treatment plant
- Waste management, Rainwater harvesting
- Solar panels, Gas line, Broadband internet

**Green Features:**
- Organic waste treatment
- Green building certification
- Electric car charging stations
- Water conservation, Energy efficient lighting

### 6. Media Gallery
- Project images (categorized):
  - Exterior views
  - Interior views
  - Amenities photos
  - Sample flat images
  - Construction progress
- Master plan/Layout
- Location map
- Video walkthrough URL
- Virtual tour URL (360°)
- YouTube video URL
- Drone shot URL

### 7. Legal & RERA
- RERA certificate upload
- RERA website link
- Approval documents:
  - Municipal approval
  - Fire NOC
  - Environmental clearance
  - Occupancy certificate
  - Building plan approval
- Title clearance status
- Title clearance document
- Encumbrance certificate
- Commencement certificate
- Additional legal documents

### 8. Additional Information
- Project highlights (bullet points)
- About the project (detailed description)
- Target audience (First-time buyers, Families, Investors, NRIs, etc.)
- Investment highlights
- Rental yield potential
- Appreciation potential
- Lifestyle description
- Unique selling points (USPs)
- Awards and recognitions

### 9. Review & Submit
- Collapsible sections showing all data
- Edit buttons for each section
- Final validation
- Terms acceptance
- Submit button

## Usage

### Using as a Page (Full Screen)

```jsx
import { ProjectFormPageV2 } from '@/modules/listProject/v2';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/list-project" element={<ProjectFormPageV2 />} />
      <Route path="/list-project/:draftId" element={<ProjectFormPageV2 />} />
    </Routes>
  );
}
```

### Using as a Sheet (Modal)

```jsx
import { ProjectFormSheetV2 } from '@/modules/listProject/v2';
import { useState } from 'react';

function MyComponent() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button onClick={() => setShowForm(true)}>
        List New Project
      </button>
      
      <ProjectFormSheetV2 
        open={showForm} 
        onOpenChange={setShowForm}
      />
    </>
  );
}
```

### With Draft Editing

```jsx
<ProjectFormSheetV2 
  open={showForm} 
  onOpenChange={setShowForm}
  initialDraftId={123}
/>
```

## Features

### ✅ Multi-Step Navigation
- Progressive step-by-step workflow
- Save & Continue functionality
- Back button to revisit previous steps
- Direct navigation to completed steps

### ✅ Draft Management
- Auto-save on each step
- Create draft on first save
- Update draft on each step
- Load draft for editing
- Draft ID in URL for sharing

### ✅ Validation
- Zod-based schema validation
- Real-time validation feedback
- Step-level validation
- Error logging for debugging

### ✅ UI/UX
- Motion animations for transitions
- Loading states
- Responsive design
- Orange gradient theme
- Icon-based visual hierarchy
- Progress indicator
- Sidebar navigation with step status

### ✅ State Management
- React Context for global state
- React Hook Form for form state
- Persistent draft data
- Completed steps tracking

## Draft Type

When creating drafts, use:
```javascript
draftApi.createListingDraft('PROJECT')
```

## API Integration

The module integrates with:
- `draftApi.createListingDraft()` - Create new draft
- `draftApi.updateListingDraft()` - Update existing draft
- `draftApi.getListingDraftById()` - Fetch draft by ID

## Next Steps

1. **Implement remaining step components** - Most steps currently show placeholder content
2. **Add media upload functionality** - Integrate with presigned URL API
3. **Implement review page** - Show all data with edit capabilities
4. **Add publish API integration** - Submit final project data
5. **Add validation logger** - Import from listProperty utils
6. **Enhance UI components** - Add more interactive elements
7. **Add floor plan management** - Configuration-wise floor plan uploads
8. **Implement RERA validation** - Validate RERA number format
9. **Add address autocomplete** - Google Maps integration
10. **Add image optimization** - Compress and optimize before upload

## Differences from PG/Hostel Listing

1. **More complex configurations** - Multiple unit types vs room types
2. **RERA compliance** - Mandatory legal documentation
3. **Developer integration** - Link to developer profile
4. **Timeline management** - Construction progress tracking
5. **Enhanced media** - Floor plans per configuration
6. **Investment focus** - ROI, appreciation, rental yield
7. **Target audience** - Multiple buyer personas

## Status

**Current Status:** 🟡 Partial Implementation

- ✅ Folder structure created
- ✅ All schemas defined
- ✅ Context and configuration implemented
- ✅ Basic Details step fully implemented
- 🟡 Other steps have placeholder UI
- ⏳ Review & Submit needs implementation
- ⏳ API integration pending
- ⏳ Media upload pending
- ⏳ Validation logger import needed

## Related Documentation

- [PROJECT_ANALYSIS_AND_IMPLEMENTATION.md](../PROJECT_ANALYSIS_AND_IMPLEMENTATION.md) - Detailed feature analysis
- PG/Hostel Module - Reference implementation
- Property Module - Additional patterns and components
