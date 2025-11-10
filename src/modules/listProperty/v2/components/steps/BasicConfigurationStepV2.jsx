import { useFormContext } from 'react-hook-form';
import { motion } from 'motion/react';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import SaveAndContinueFooter from '../SaveAndContinueFooter';
import BasicConfigurationV2 from '../BasicConfigurationV2';

export default function BasicConfigurationStepV2() {
  const { watch } = useFormContext();
  const { saveAndContinue, previousStep } = usePropertyFormV2();

  const bedrooms = watch('bedrooms');
  const bathrooms = watch('bathrooms');

  const isValid = !!(bedrooms && bathrooms);

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
        {/* Use v2 component without footer */}
        <div className="pb-24">
          <BasicConfigurationV2 />
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
