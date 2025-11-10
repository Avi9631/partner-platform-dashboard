import { useForm, FormProvider } from 'react-hook-form';
import { motion } from 'motion/react';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import SaveAndContinueFooter from '../SaveAndContinueFooter';
import LocationAttributes from '../../../components/LocationAttributes';

export default function LocationStepV2() {
  const { saveAndContinue, previousStep, formData } = usePropertyFormV2();

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      facing: formData?.facing || '',
      overlookingView: formData?.overlookingView || '',
      locationAdvantages: formData?.locationAdvantages || [],
    },
  });

  // Optional step, can always continue
  const isValid = true;

  const handleContinue = () => {
    const data = methods.getValues();
    saveAndContinue(data);
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
            <LocationAttributes isSheetMode={false} />
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
