import { useForm, FormProvider } from 'react-hook-form';
import { motion } from 'motion/react';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import SaveAndContinueFooter from '../SaveAndContinueFooter';
import PricingInformation from '../../../components/PricingInformation';

export default function PricingStepV2() {
  const { saveAndContinue, previousStep, formData } = usePropertyFormV2();

  // Create local form with defaults from context
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      listingType: formData?.listingType || 'sale',
      price: formData?.price || '',
      priceUnit: formData?.priceUnit || 'total',
      maintenanceCost: formData?.maintenanceCost || '',
      securityDeposit: formData?.securityDeposit || '',
      availableFrom: formData?.availableFrom || '',
    },
  });

  const { watch } = methods;
  const listingType = watch('listingType');
  const price = watch('price');
  
  const isValid = !!(listingType && price);

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="pb-24">
            <PricingInformation />
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
