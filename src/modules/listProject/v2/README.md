# Project Listing V2 - Multi-Step Implementation

## Overview

A comprehensive project listing system for real estate projects (residential and commercial) that implements a **multi-step workflow** similar to the property listing form. Users can list various types of projects including apartment complexes, villa communities, townships, office complexes, and more.

## Key Features

### 1. **Multi-Step Navigation**
- Progressive step-by-step form flow
- Each section is a distinct step with validation
- "Save & Continue" button to advance
- "Back" button to return to previous steps
- Clear visual progress indicators

### 2. **Project Types Supported**

#### Residential
- Apartment Complex
- Villa Community
- Township
- Row Houses
- Plotted Development

#### Commercial
- Office Complex
- Retail Mall
- Business Park
- Mixed Use (Residential + Commercial)

### 3. **Form Steps**

The form includes the following steps (12 total):

1. **Project Type Selection** - Choose the type of real estate project
2. **Location Selection** - Select city and locality
3. **GeoTag** - Mark project location on map
4. **Basic Details** - Project name, builder/developer, launch date
5. **Project Specifications** - Total units, towers, floors, land area
6. **Unit Configurations** - Available BHK types and sizes
7. **Price Range** - Minimum and maximum pricing
8. **Approvals & RERA** - Regulatory approvals and RERA number
9. **Project Status** - Construction status and possession timeline
10. **Project Description** - Detailed project description and highlights
11. **Amenities** - Project-level amenities and features
12. **Review & Submit** - Final review before submission

### 4. **Enhanced UI/UX**
- Modern card-based project listing view
- Real-time search and filtering
- Status-based categorization (Upcoming, Under Construction, Ready to Move, Completed)
- Responsive design for all screen sizes
- Smooth animations and transitions
- Stats dashboard showing project metrics

### 5. **Project Card Features**
- Project image with fallback
- Status badge with color coding
- Developer name
- Location with pin icon
- Total units count
- Available configurations
- Land area
- Price range
- Launch date
- View count
- Quick actions menu (View, Edit, Delete)

## File Structure

```
listProject/
├── constants/
│   ├── projectTypes.js          # Project types and configurations
│   └── amenities.js             # Project-level amenities
├── v2/
│   ├── components/
│   │   ├── ProjectFormSheetV2.jsx       # Main sheet container
│   │   └── steps/
│   │       ├── ProjectTypeStepV2.jsx    # Step 0: Select project type
│   │       ├── SaveAndContinueFooter.jsx # Reusable footer component
│   │       └── ... (other step components to be added)
│   ├── context/
│   │   └── ProjectFormContextV2.jsx     # Form state management
│   ├── index.js                         # Module exports
│   └── README.md                        # This file
└── schemas/                             # Validation schemas (to be added)
```

## Usage

### Basic Implementation

```jsx
import ListProjectV2Page from '@/modules/ListProjectV2';

function App() {
  return <ListProjectV2Page />;
}
```

### Using the Form Component Separately

```jsx
import { ProjectFormSheetV2 } from '@/modules/listProject/v2';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        List Project
      </button>
      
      <ProjectFormSheetV2 
        open={isOpen} 
        onOpenChange={setIsOpen} 
      />
    </>
  );
}
```

### Using the Context

```jsx
import { useProjectFormV2 } from '@/modules/listProject/v2';

function CustomComponent() {
  const { 
    currentStep, 
    saveAndContinue, 
    previousStep,
    isStepCompleted,
    getProgress,
    projectType
  } = useProjectFormV2();

  return (
    <div>
      <p>Current Step: {currentStep}</p>
      <p>Project Type: {projectType}</p>
      <p>Progress: {getProgress()}%</p>
    </div>
  );
}
```

## Key Components

### ProjectFormContextV2
Context provider with:
- `currentStep`: Current active step number
- `saveAndContinue(stepData)`: Save current step data and advance
- `previousStep()`: Go back one step
- `goToStep(step)`: Jump to a specific step
- `isStepCompleted(step)`: Check if a step is completed
- `getProgress()`: Get completion percentage
- `completedSteps`: Set of completed step numbers
- `projectType`: Selected project type
- `formData`: Accumulated form data from all steps

### SaveAndContinueFooter
Reusable footer component with:
- Save & Continue button (primary action)
- Back button (secondary action)
- Disabled state management
- Custom labels support
- Different styling for last step (green for submit)

### ListProjectV2Page
Main page component featuring:
- Stats cards showing project metrics
- Search and filter functionality
- Grid layout of project cards
- Empty state when no projects exist
- Loading state with spinner
- Responsive design

## Project Status Configuration

Projects can have the following statuses:
- **Upcoming**: Projects not yet launched or in pre-launch phase
- **Under Construction**: Active construction phase
- **Ready to Move**: Construction completed, ready for possession
- **Completed**: Fully completed and delivered projects

Each status has:
- Color coding (blue, orange, green, purple)
- Icon representation
- Badge styling

## Mock Data

The implementation includes mock data for 6 sample projects showcasing different:
- Project types (Apartment Complex, Villa Community, Township, etc.)
- Locations (Mumbai, Bangalore, Gurgaon, etc.)
- Developers (Prestige Group, Godrej Properties, DLF, etc.)
- Price ranges
- Unit configurations
- Project statuses

## Differences from Property Listing

| Feature | Property Listing | Project Listing |
|---------|-----------------|----------------|
| Entity Type | Individual properties | Real estate projects |
| Steps | 13-15 steps | 12 steps |
| Focus | Single unit details | Project-level details |
| Configurations | Single BHK | Multiple BHK options |
| Pricing | Fixed price | Price range |
| Additional Info | Floor details | Total units, towers |

## Benefits

1. **Comprehensive**: Covers all aspects of project listing
2. **User-Friendly**: Clear progression and visual feedback
3. **Flexible**: Supports multiple project types
4. **Scalable**: Easy to add new steps or fields
5. **Consistent**: Similar UX to property listing
6. **Modern**: Contemporary design with animations

## Next Steps / TODO

1. **Create Remaining Step Components**:
   - LocationSelectionStepV2
   - GeoTagStepV2
   - BasicDetailsStepV2
   - ProjectSpecificationsStepV2
   - UnitConfigurationsStepV2
   - PriceRangeStepV2
   - ApprovalsStepV2
   - ProjectStatusStepV2
   - ProjectDescriptionStepV2
   - AmenitiesStepV2
   - ReviewAndSubmitV2

2. **Add Validation Schemas**:
   - Create Zod schemas for each step
   - Implement validation in forms

3. **Backend Integration**:
   - Connect to project API endpoints
   - Implement create/update/delete operations
   - Add image upload functionality

4. **Enhanced Features**:
   - Draft saving functionality
   - Auto-save as user progresses
   - Image gallery for projects
   - Floor plans upload
   - Project timeline visualization
   - Unit availability tracking

5. **Analytics**:
   - Track form completion rates
   - Identify drop-off points
   - User behavior analytics

## Migration Notes

To use this in your application:

1. Import the page component:
   ```jsx
   import ListProjectV2Page from '@/modules/ListProjectV2';
   ```

2. Add to your router:
   ```jsx
   <Route path="/projects" element={<ListProjectV2Page />} />
   ```

3. Ensure all dependencies are installed:
   - motion/react (framer-motion)
   - lucide-react
   - react-hook-form
   - @/components/ui/* (shadcn components)

## Support

For questions or issues, please refer to the property listing implementation as a reference, as both follow similar patterns and architecture.
