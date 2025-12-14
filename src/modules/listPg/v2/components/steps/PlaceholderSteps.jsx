// Placeholder step components - to be fully implemented

import { motion } from 'motion/react';
import { usePgFormV2 } from '../../context/PgFormContextV2';
import SaveAndContinueFooter from './SaveAndContinueFooter';

// Location Details Step
export function LocationDetailsPgStep() {
  const { saveAndContinue, previousStep } = usePgFormV2();
  
  const handleContinue = () => {
    // TODO: Implement form validation and data collection
    saveAndContinue({ locationStep: 'completed' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Location Details
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Provide complete address and nearby places information
        </p>
        <p className="text-sm text-muted-foreground py-8">
          This step component needs to be fully implemented with address fields, landmark, coordinates, and nearby places arrays.
        </p>
      </motion.div>
      <SaveAndContinueFooter
        onBack={previousStep}
        onSaveAndContinue={handleContinue}
        showBack={true}
      />
    </div>
  );
}

// Room Types Step
export function RoomTypesPgStep() {
  const { saveAndContinue, previousStep } = usePgFormV2();
  
  const handleContinue = () => {
    saveAndContinue({ roomTypesStep: 'completed' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Room Types & Pricing
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Add different room types with their pricing details
        </p>
        <p className="text-sm text-muted-foreground py-8">
          This step needs field array for multiple room types with pricing, facilities, and availability.
        </p>
      </motion.div>
      <SaveAndContinueFooter
        onBack={previousStep}
        onSaveAndContinue={handleContinue}
        showBack={true}
      />
    </div>
  );
}

// Amenities Step
export function AmenitiesPgStep() {
  const { saveAndContinue, previousStep } = usePgFormV2();
  
  const handleContinue = () => {
    saveAndContinue({ amenitiesStep: 'completed' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Amenities
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Select common and room amenities
        </p>
        <p className="text-sm text-muted-foreground py-8">
          Similar to property amenities step - checkboxes for common and room amenities.
        </p>
      </motion.div>
      <SaveAndContinueFooter
        onBack={previousStep}
        onSaveAndContinue={handleContinue}
        showBack={true}
      />
    </div>
  );
}

// Food & Mess Step
export function FoodMessPgStep() {
  const { saveAndContinue, previousStep } = usePgFormV2();
  
  const handleContinue = () => {
    saveAndContinue({ foodMessStep: 'completed' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Food & Mess Details
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Meal availability, timings, and food options
        </p>
        <p className="text-sm text-muted-foreground py-8">
          Fields for meal availability, food type, kitchen timings, cooking policy, etc.
        </p>
      </motion.div>
      <SaveAndContinueFooter
        onBack={previousStep}
        onSaveAndContinue={handleContinue}
        showBack={true}
      />
    </div>
  );
}

// Rules & Restrictions Step
export function RulesRestrictionsPgStep() {
  const { saveAndContinue, previousStep } = usePgFormV2();
  
  const handleContinue = () => {
    saveAndContinue({ rulesStep: 'completed' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Rules & Restrictions
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Property rules and guest policies
        </p>
        <p className="text-sm text-muted-foreground py-8">
          Gate timing, visitor policy, alcohol/smoking/pets policy, minimum stay, notice period.
        </p>
      </motion.div>
      <SaveAndContinueFooter
        onBack={previousStep}
        onSaveAndContinue={handleContinue}
        showBack={true}
      />
    </div>
  );
}

// Media Upload Step
export function MediaUploadPgStep() {
  const { saveAndContinue, previousStep } = usePgFormV2();
  
  const handleContinue = () => {
    saveAndContinue({ mediaStep: 'completed' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Media Upload
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Upload property, room, and amenities images
        </p>
        <p className="text-sm text-muted-foreground py-8">
          Image upload for property, rooms, washrooms, amenities. Video and virtual tour URLs.
        </p>
      </motion.div>
      <SaveAndContinueFooter
        onBack={previousStep}
        onSaveAndContinue={handleContinue}
        showBack={true}
      />
    </div>
  );
}

// Availability Step
export function AvailabilityPgStep() {
  const { saveAndContinue, previousStep } = usePgFormV2();
  
  const handleContinue = () => {
    saveAndContinue({ availabilityStep: 'completed' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Availability & Inventory
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Manage bed availability and sold-out status
        </p>
        <p className="text-sm text-muted-foreground py-8">
          Total beds, available beds, sold-out status, next availability, seasonal pricing.
        </p>
      </motion.div>
      <SaveAndContinueFooter
        onBack={previousStep}
        onSaveAndContinue={handleContinue}
        showBack={true}
      />
    </div>
  );
}

// Safety & Compliance Step
export function SafetyCompliancePgStep() {
  const { saveAndContinue, previousStep } = usePgFormV2();
  
  const handleContinue = () => {
    saveAndContinue({ safetyStep: 'completed' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Safety & Compliance
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Safety measures and certifications
        </p>
        <p className="text-sm text-muted-foreground py-8">
          Fire safety, police verification, first aid, CCTV, emergency exits, night security.
        </p>
      </motion.div>
      <SaveAndContinueFooter
        onBack={previousStep}
        onSaveAndContinue={handleContinue}
        showBack={true}
      />
    </div>
  );
}

// Review & Submit Step
export function ReviewAndSubmitPgStep() {
  const { saveAndContinue, previousStep, formData } = usePgFormV2();
  
  const handleSubmit = () => {
    console.log('Submitting PG listing:', formData);
    // TODO: Implement final submission logic
    saveAndContinue({ finalStep: 'completed' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Review & Submit
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Review your listing before submission
        </p>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
          <pre className="text-xs overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </motion.div>
      <SaveAndContinueFooter
        onBack={previousStep}
        onSaveAndContinue={handleSubmit}
        showBack={true}
        nextLabel="Submit Listing"
        isLastStep={true}
      />
    </div>
  );
}

// Export all as default for easier imports
export default {
  LocationDetailsPgStep,
  RoomTypesPgStep,
  AmenitiesPgStep,
  FoodMessPgStep,
  RulesRestrictionsPgStep,
  MediaUploadPgStep,
  AvailabilityPgStep,
  SafetyCompliancePgStep,
  ReviewAndSubmitPgStep,
};
