import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useFormContext } from 'react-hook-form';
import { usePropertyForm } from '../context/PropertyFormContext';
import PricingInformation from './PricingInformation';
import FormButtonFooter from './shared/FormButtonFooter';

export default function PricingInfoStep({ isSheetMode = false }) {
  const { watch } = useFormContext();
  const { nextStep, previousStep, updateStepValidation, currentStep, setOpenSection } = usePropertyForm();
  
  const listingType = watch('listingType');
  const price = watch('price');

  // Validate this step
  const checkIsValid = () => {
    return !!(listingType && price);
  };

  useEffect(() => {
    const isValid = !!(listingType && price);
    updateStepValidation(currentStep, isValid);
  }, [listingType, price, currentStep, updateStepValidation]);

  return (
    <div className="w-full  ">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Pricing Information
        </h2>
        <p className="text-muted-foreground text-sm">
          Set your pricing details and availability
        </p>
      </motion.div>

      <div className=" ">
        <div className="space-y-6">
          <PricingInformation />
        </div>
      </div>

      {/* Fixed Button Footer */}
      <FormButtonFooter
        onBack={previousStep}
        onNext={isSheetMode ? () => setOpenSection(null) : nextStep}
        onCancel={() => setOpenSection(null)}
        nextLabel={isSheetMode ? 'Save' : 'Continue'}
        nextDisabled={!checkIsValid()}
        showBack={true}
        isSheetMode={isSheetMode}
      />
    </div>
  );
}
