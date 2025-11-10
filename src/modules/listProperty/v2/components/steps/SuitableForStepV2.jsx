import { useForm, FormProvider } from 'react-hook-form';
import { motion } from 'motion/react';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import SaveAndContinueFooter from '../SaveAndContinueFooter';
import SuitableFor from '../../../components/SuitableFor';

export default function SuitableForStepV2() {
  const { saveAndContinue, previousStep, formData } = usePropertyFormV2();

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      suitableFor: formData?.suitableFor || [],
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Tenant Preferences
          </h2>
          <p className="text-muted-foreground text-sm">
            Specify who can rent or buy this property
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="pb-24">
            <SuitableFor />
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
