import { useFormContext } from 'react-hook-form';
import { motion } from 'motion/react';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import SaveAndContinueFooter from '../SaveAndContinueFooter';
import FurnishingAmenities from '../../../components/FurnishingAmenities';

export default function FurnishingStepV2() {
  const { watch } = useFormContext();
  const { saveAndContinue, previousStep } = usePropertyFormV2();

  const furnishingStatus = watch('furnishingStatus');
  const isValid = !!furnishingStatus;

  const handleContinue = () => {
    if (isValid) {
      saveAndContinue();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="pb-24">
          <FurnishingAmenities isSheetMode={false} />
        </div>
      </motion.div>

      <SaveAndContinueFooter
        onBack={previousStep}
        onSaveAndContinue={handleContinue}
        nextDisabled={!isValid}
        showBack={true}
      />
    </div>
  );
}
