import { useForm, FormProvider } from 'react-hook-form';
import { motion } from 'motion/react';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import SaveAndContinueFooter from '../SaveAndContinueFooter';
import FurnishingAmenities from '../../../components/FurnishingAmenities';

export default function FurnishingStepV2() {
  const { saveAndContinue, previousStep, formData } = usePropertyFormV2();

  // Create local form with defaults from context
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      furnishingStatus: formData?.furnishingStatus || 'unfurnished',
      furnishingDetails: formData?.furnishingDetails || {},
      flooringTypes: formData?.flooringTypes || [],
    },
  });

  const { watch } = methods;
  const furnishingStatus = watch('furnishingStatus');
  const isValid = !!furnishingStatus;

  const handleContinue = () => {
    if (isValid) {
      const data = methods.getValues();
      saveAndContinue(data);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="pb-24">
            <FurnishingAmenities 
              isSheetMode={false}
              onNext={handleContinue}
              onBack={previousStep}
            />
          </div>
        </motion.div>

        <SaveAndContinueFooter
          onBack={previousStep}
          onSaveAndContinue={handleContinue}
          nextDisabled={!isValid}
          showBack={true}
        />
      </div>
    </FormProvider>
  );
}
