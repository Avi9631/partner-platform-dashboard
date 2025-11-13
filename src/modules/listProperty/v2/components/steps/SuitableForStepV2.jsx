import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { Users } from 'lucide-react';
import { Field, FieldGroup, FieldError } from '@/components/ui/field';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import suitableForSchema from '../../../schemas/suitableForSchema';
import SaveAndContinueFooter from '../SaveAndContinueFooter';

const suitableForOptions = [
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { value: 'bachelors', label: 'Bachelors', icon: '🎓' },
  { value: 'company', label: 'Company Lease', icon: '🏢' },
  { value: 'students', label: 'Students', icon: '📚' },
];

export default function SuitableForStepV2() {
  const { saveAndContinue, previousStep, formData } = usePropertyFormV2();

  const methods = useForm({
    resolver: zodResolver(suitableForSchema),
    mode: 'onChange',
    defaultValues: {
      suitableFor: formData?.suitableFor || [],
      listingType: formData?.listingType || 'sale',
    },
  });

  const { control, watch, formState, handleSubmit } = methods;

  const toggleSuitableFor = (value, onChange) => {
    const current = watch('suitableFor') || [];
    const updated = current.includes(value)
      ? current.filter((s) => s !== value)
      : [...current, value];
    onChange(updated);
  };

  const handleContinue = (data) => {
    saveAndContinue(data);
  };

  // Only show for rent/lease
  const listingType = watch('listingType');
  const shouldShowSuitableFor = listingType !== 'sale';

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-5xl mx-auto">
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
            {shouldShowSuitableFor ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
                  <Users className="w-5 h-5" />
                  Suitable For <span className="text-red-500">*</span>
                </h3>
                <FieldGroup>
                  <Controller
                    name="suitableFor"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {suitableForOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => toggleSuitableFor(option.value, field.onChange)}
                              className={`p-2 border-2 rounded transition-all flex flex-col items-center gap-1 ${
                                (field.value || []).includes(option.value)
                                  ? 'border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400 scale-105'
                                  : fieldState.invalid
                                  ? 'border-red-500 hover:border-red-500/50 hover:scale-105'
                                  : 'border-muted hover:border-orange-500/50 hover:scale-105'
                              }`}
                            >
                              <span className="text-xl">{option.icon}</span>
                              <span className="text-xs font-medium">{option.label}</span>
                            </button>
                          ))}
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <p>This section is only applicable for rental and lease listings.</p>
              </div>
            )}
          </div>
        </motion.div>

        <SaveAndContinueFooter
          onBack={previousStep}
          onSaveAndContinue={handleSubmit(handleContinue)}
          nextDisabled={!formState.isValid}
          showBack={true}
        />
      </div>
    </FormProvider>
  );
}
