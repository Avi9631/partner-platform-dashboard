import { motion } from 'motion/react';
import { useFormContext } from 'react-hook-form';
import { usePropertyForm } from '../context/PropertyFormContext';
import SuitableFor from './SuitableFor';
import FormButtonFooter from './shared/FormButtonFooter';

export default function SuitableForStep({ isSheetMode = false }) {
  const { watch } = useFormContext();
  const { nextStep, previousStep, setOpenSection } = usePropertyForm();
  const listingType = watch('listingType');

  // This step is optional, so always allow continue
  const canContinue = true;

  return (
    <div className="w-full ">
      {/* Header */}
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
          Who is this property suitable for? (Optional)
        </p>
      </motion.div>

      <div className=" ">
        <div className="space-y-6">
          {listingType === 'sale' ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                This section is only applicable for rental and lease properties.
              </p>
            </div>
          ) : (
            <SuitableFor />
          )}
        </div>
      </div>

      {/* Fixed Button Footer */}
      <FormButtonFooter
        onBack={previousStep}
        onNext={isSheetMode ? () => setOpenSection(null) : nextStep}
        onCancel={() => setOpenSection(null)}
        nextLabel={isSheetMode ? 'Save' : 'Continue'}
        nextDisabled={!canContinue}
        showBack={true}
        isSheetMode={isSheetMode}
      />
    </div>
  );
}
