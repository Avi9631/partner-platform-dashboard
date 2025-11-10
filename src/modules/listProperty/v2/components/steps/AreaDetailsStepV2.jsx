import { useForm, FormProvider } from 'react-hook-form';
import { motion } from 'motion/react';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import SaveAndContinueFooter from '../SaveAndContinueFooter';
import AreaDetailsV2 from '../AreaDetailsV2';

export default function AreaDetailsStepV2() {
  const { saveAndContinue, previousStep, formData } = usePropertyFormV2();

  // Create local form with defaults from context
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      carpetArea: formData?.carpetArea || '',
      builtUpArea: formData?.builtUpArea || '',
      superBuiltUpArea: formData?.superBuiltUpArea || '',
      areaUnit: formData?.areaUnit || 'sqft',
    },
  });

  const { watch } = methods;
  const carpetArea = watch('carpetArea');
  const isValid = !!carpetArea;

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
          {/* Use v2 component without footer */}
          <div className="pb-24">
            <AreaDetailsV2 />
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
