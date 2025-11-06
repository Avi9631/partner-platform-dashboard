import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Users } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { usePropertyForm } from '../context/PropertyFormContext';
import suitableForSchema from '../schemas/suitableForSchema';

const suitableForOptions = [
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { value: 'bachelors', label: 'Bachelors', icon: '🎓' },
  { value: 'company', label: 'Company Lease', icon: '🏢' },
  { value: 'students', label: 'Students', icon: '📚' },
];

export default function SuitableFor() {
  const mainForm = useFormContext();
  const { updateStepValidation, currentStep } = usePropertyForm();

  // Initialize React Hook Form with Zod validation
  const {
    watch,
    setValue,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(suitableForSchema),
    mode: 'onChange',
    defaultValues: {
      suitableFor: mainForm.watch('suitableFor') || [],
    },
  });

  // Update step validation when form validity changes
  useEffect(() => {
    updateStepValidation(currentStep, isValid);
  }, [isValid, currentStep, updateStepValidation]);

  // Sync form data with main form on field changes
  useEffect(() => {
    const subscription = watch((value) => {
      mainForm.setValue('suitableFor', value.suitableFor);
    });
    return () => subscription.unsubscribe();
  }, [watch, mainForm]);

  const toggleSuitableFor = (value) => {
    const current = watch('suitableFor') || [];
    const updated = current.includes(value)
      ? current.filter((s) => s !== value)
      : [...current, value];
    setValue('suitableFor', updated, { shouldValidate: true });
  };

  // Only show for rent/lease
  const listingType = mainForm.watch('listingType');
  if (listingType === 'sale') {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
        <Users className="w-5 h-5" />
        Suitable For
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {suitableForOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => toggleSuitableFor(option.value)}
            className={`p-2 border rounded transition-all flex flex-col items-center gap-1 ${
              (watch('suitableFor') || []).includes(option.value)
                ? 'border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400 scale-105'
                : 'border-muted hover:border-orange-500/50 hover:scale-105'
            }`}
          >
            <span className="text-xl">{option.icon}</span>
            <span className="text-xs font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
