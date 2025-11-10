import { motion } from 'motion/react';
import { usePropertyForm } from '../context/PropertyFormContext';
import AmenitiesFeatures from './AmenitiesFeatures';
import FormButtonFooter from './shared/FormButtonFooter';

export default function AmenitiesStep({ isSheetMode = false }) {
  const { nextStep, previousStep, setOpenSection, updateStepValidation, currentStep } = usePropertyForm();

  // This step is optional, so always allow continue
  const canContinue = true;

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Amenities & Features
        </h2>
        <p className="text-muted-foreground text-sm">
          Highlight the amenities and features of your property
        </p>
      </motion.div>

      <div className=" rounded-xl  ">
        <div className="space-y-6">
          <AmenitiesFeatures updateStepValidation={updateStepValidation} currentStep={currentStep} />
        </div>
      </div>

      {/* Fixed Button Footer */}
      <FormButtonFooter
        onBack={previousStep}
        onNext={isSheetMode ? () => setOpenSection(null) : nextStep}
        onCancel={() => setOpenSection(null)}
        nextLabel={isSheetMode ? 'Save' : 'Review Listing'}
        nextDisabled={!canContinue}
        showBack={true}
        isSheetMode={isSheetMode}
      />
    </div>
  );
}
