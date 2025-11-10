import { useForm, FormProvider } from 'react-hook-form';
import { motion } from 'motion/react';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import SaveAndContinueFooter from '../SaveAndContinueFooter';
import BasicConfigurationV2 from '../BasicConfigurationV2';

export default function BasicConfigurationStepV2() {
  const { saveAndContinue, previousStep, formData } = usePropertyFormV2();

  // Create local form with defaults from context
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      bedrooms: formData?.bedrooms || '',
      bathrooms: formData?.bathrooms || '',
      balconies: formData?.balconies || '',
      additionalRooms: formData?.additionalRooms || [],
    },
  });

  const { watch } = methods;
  const bedrooms = watch('bedrooms');
  const bathrooms = watch('bathrooms');

  const isValid = !!(bedrooms && bathrooms);

  const handleContinue = () => {
    if (isValid) {
      // Collect all form data and pass to context
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
    </FormProvider>
  );
}
