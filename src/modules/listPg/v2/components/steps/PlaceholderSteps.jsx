// Placeholder step components - to be fully implemented
// Note: These are template components. The page-level SaveAndContinueFooter handles navigation.

import { motion } from 'motion/react';
import { usePgFormV2 } from '../../context/PgFormContextV2';
import { useEffect } from 'react';

// Location Details Step
export function LocationDetailsPgStep() {
  const { saveAndContinue, setCurrentStepSubmitHandler } = usePgFormV2();
  
  const handleContinue = () => {
    saveAndContinue({ locationStep: 'completed' });
  };

  useEffect(() => {
    setCurrentStepSubmitHandler(() => handleContinue);
  }, []);

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
    </div>
  );
}

// Availability Step
export function AvailabilityPgStep() {
  const { saveAndContinue, setCurrentStepSubmitHandler } = usePgFormV2();
  
  const handleContinue = () => {
    saveAndContinue({ availabilityStep: 'completed' });
  };

  useEffect(() => {
    setCurrentStepSubmitHandler(() => handleContinue);
  }, []);

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
    </div>
  );
}

// Safety & Compliance Step
export function SafetyCompliancePgStep() {
  const { saveAndContinue, setCurrentStepSubmitHandler } = usePgFormV2();
  
  const handleContinue = () => {
    saveAndContinue({ safetyStep: 'completed' });
  };

  useEffect(() => {
    setCurrentStepSubmitHandler(() => handleContinue);
  }, []);

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
    </div>
  );
}

// Review & Submit Step
export function ReviewAndSubmitPgStep() {
  const { saveAndContinue, formData, setCurrentStepSubmitHandler } = usePgFormV2();
  
  const handleSubmit = () => {
    console.log('Submitting PG listing:', formData);
    saveAndContinue({ finalStep: 'completed' });
  };

  useEffect(() => {
    setCurrentStepSubmitHandler(() => handleSubmit);
  }, []);

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
    </div>
  );
}

// Export all as default for easier imports
export default {
  LocationDetailsPgStep,
  AvailabilityPgStep,
  SafetyCompliancePgStep,
  ReviewAndSubmitPgStep,
};
