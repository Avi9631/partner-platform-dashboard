/**
 * Examples for using the Project Listing V2 components
 */

// ============================================
// Example 1: Basic Usage - Full Page
// ============================================

import ListProjectV2Page from '@/modules/ListProjectV2';

function App() {
  return (
    <div>
      <ListProjectV2Page />
    </div>
  );
}

// ============================================
// Example 2: Using Form Component Separately
// ============================================

import { useState } from 'react';
import { ProjectFormSheetV2 } from '@/modules/listProject/v2';
import { Button } from '@/components/ui/button';

function MyDashboard() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <Button onClick={() => setShowForm(true)}>
        Add New Project
      </Button>

      <ProjectFormSheetV2 
        open={showForm} 
        onOpenChange={setShowForm} 
      />
    </div>
  );
}

// ============================================
// Example 3: Using Context in Custom Components
// ============================================

import { useProjectFormV2 } from '@/modules/listProject/v2';

function CustomStepIndicator() {
  const { 
    currentStep, 
    getTotalSteps,
    getProgress,
    isStepCompleted 
  } = useProjectFormV2();

  return (
    <div>
      <p>Step {currentStep + 1} of {getTotalSteps()}</p>
      <p>Progress: {getProgress()}%</p>
      <p>Step 1 completed: {isStepCompleted(1) ? 'Yes' : 'No'}</p>
    </div>
  );
}

// ============================================
// Example 4: Conditional Rendering Based on Project Type
// ============================================

import { useProjectFormV2 } from '@/modules/listProject/v2';

function ConditionalContent() {
  const { projectType, isResidentialProject, isCommercialProject } = useProjectFormV2();

  if (!projectType) {
    return <p>Please select a project type</p>;
  }

  if (isResidentialProject()) {
    return <div>Residential project form content</div>;
  }

  if (isCommercialProject()) {
    return <div>Commercial project form content</div>;
  }

  return null;
}

// ============================================
// Example 5: Custom Save Handler
// ============================================

import { useProjectFormV2 } from '@/modules/listProject/v2';
import { useState } from 'react';
import SaveAndContinueFooter from '@/modules/listProject/v2/components/steps/SaveAndContinueFooter';

function CustomFormStep() {
  const { saveAndContinue, previousStep } = useProjectFormV2();
  const [formValues, setFormValues] = useState({ name: '', description: '' });

  const handleSave = async () => {
    // Validate
    if (!formValues.name) {
      alert('Name is required');
      return;
    }

    // Save to context and move to next step
    saveAndContinue(formValues);
  };

  return (
    <div>
      <input 
        value={formValues.name}
        onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
        placeholder="Project Name"
      />
      <textarea
        value={formValues.description}
        onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
        placeholder="Description"
      />

      <SaveAndContinueFooter
        onBack={previousStep}
        onSaveAndContinue={handleSave}
        nextDisabled={!formValues.name}
      />
    </div>
  );
}

// ============================================
// Example 6: Accessing Form Data
// ============================================

import { useProjectFormV2 } from '@/modules/listProject/v2';

function ReviewStep() {
  const { formData } = useProjectFormV2();

  return (
    <div>
      <h2>Review Your Project</h2>
      <p>Project Type: {formData.projectType}</p>
      <p>Project Name: {formData.projectName}</p>
      <p>Location: {formData.city}</p>
      <p>Developer: {formData.developer}</p>
      <p>Price Range: {formData.minPrice} - {formData.maxPrice}</p>
      {/* Display other form data */}
    </div>
  );
}

// ============================================
// Example 7: Jump to Specific Step
// ============================================

import { useProjectFormV2 } from '@/modules/listProject/v2';
import { Button } from '@/components/ui/button';

function StepNavigation() {
  const { goToStep, isStepCompleted } = useProjectFormV2();

  return (
    <div>
      <h3>Quick Navigation</h3>
      <Button 
        onClick={() => goToStep(1)}
        disabled={!isStepCompleted(0)}
      >
        Go to Location
      </Button>
      <Button 
        onClick={() => goToStep(5)}
        disabled={!isStepCompleted(4)}
      >
        Go to Price Range
      </Button>
    </div>
  );
}

// ============================================
// Example 8: Using Constants
// ============================================

import { PROJECT_TYPES, PROJECT_STATUS } from '@/modules/listProject/constants/projectTypes';
import { PROJECT_AMENITIES } from '@/modules/listProject/constants/amenities';

function ProjectFilters() {
  return (
    <div>
      <h3>Filter by Type</h3>
      {PROJECT_TYPES.map(category => (
        <div key={category.category}>
          <h4>{category.category}</h4>
          {category.types.map(type => (
            <button key={type.value}>{type.label}</button>
          ))}
        </div>
      ))}

      <h3>Filter by Status</h3>
      {PROJECT_STATUS.map(status => (
        <button key={status.value} style={{ color: status.color }}>
          {status.label}
        </button>
      ))}
    </div>
  );
}

// ============================================
// Example 9: Amenities Selection
// ============================================

import { useState } from 'react';
import { PROJECT_AMENITIES, AMENITY_CATEGORIES } from '@/modules/listProject/constants/amenities';

function AmenitiesSelector() {
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const toggleAmenity = (amenityId) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityId) 
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  // Group amenities by category
  const amenitiesByCategory = PROJECT_AMENITIES.reduce((acc, amenity) => {
    if (!acc[amenity.category]) acc[amenity.category] = [];
    acc[amenity.category].push(amenity);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(amenitiesByCategory).map(([category, amenities]) => (
        <div key={category}>
          <h4>{AMENITY_CATEGORIES[category]}</h4>
          <div>
            {amenities.map(amenity => (
              <button
                key={amenity.id}
                onClick={() => toggleAmenity(amenity.id)}
                style={{
                  background: selectedAmenities.includes(amenity.id) ? 'orange' : 'gray'
                }}
              >
                {amenity.icon} {amenity.label}
              </button>
            ))}
          </div>
        </div>
      ))}
      <p>Selected: {selectedAmenities.length} amenities</p>
    </div>
  );
}

// ============================================
// Example 10: Custom Progress Bar
// ============================================

import { useProjectFormV2 } from '@/modules/listProject/v2';

function CustomProgressBar() {
  const { getProgress, currentStep, getTotalSteps } = useProjectFormV2();

  return (
    <div>
      <div style={{ 
        width: '100%', 
        height: '8px', 
        background: '#e0e0e0',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${getProgress()}%`,
          height: '100%',
          background: 'linear-gradient(to right, #f97316, #ea580c)',
          transition: 'width 0.3s ease'
        }} />
      </div>
      <p>Step {currentStep + 1} of {getTotalSteps()}</p>
    </div>
  );
}

export {
  // Export examples if needed
  MyDashboard,
  CustomStepIndicator,
  ConditionalContent,
  CustomFormStep,
  ReviewStep,
  StepNavigation,
  ProjectFilters,
  AmenitiesSelector,
  CustomProgressBar,
};
