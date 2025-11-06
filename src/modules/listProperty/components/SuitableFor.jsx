import { Users } from 'lucide-react';
import useListPropertyStore from '../../store/useListPropertyStore';

const suitableForOptions = [
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { value: 'bachelors', label: 'Bachelors', icon: '🎓' },
  { value: 'company', label: 'Company Lease', icon: '🏢' },
  { value: 'students', label: 'Students', icon: '📚' },
];

export default function SuitableFor() {
  const { formData, updateFormData } = useListPropertyStore();

  const toggleSuitableFor = (value) => {
    const current = formData.suitableFor || [];
    const updated = current.includes(value)
      ? current.filter((s) => s !== value)
      : [...current, value];
    updateFormData({ suitableFor: updated });
  };

  // Only show for rent/lease
  if (formData.listingType === 'sale') {
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
            onClick={() => toggleSuitableFor(option.value)}
            className={`p-2 border rounded transition-all flex flex-col items-center gap-1 ${
              (formData.suitableFor || []).includes(option.value)
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
