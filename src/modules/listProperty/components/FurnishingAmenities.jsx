import { motion } from 'motion/react';
import { Sofa } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import useListPropertyStore from '../store/useListPropertyStore';

const furnishingOptions = [
  { value: 'unfurnished', label: 'Unfurnished', description: 'No furniture or fittings' },
  { value: 'semi', label: 'Semi-Furnished', description: 'Basic furniture & fittings' },
  { value: 'fully', label: 'Fully Furnished', description: 'Complete furniture & appliances' },
];

const flooringOptions = [
  'Vitrified',
  'Marble',
  'Wooden',
  'Ceramic',
  'Granite',
  'Mosaic',
];

export default function FurnishingAmenities() {
  const { formData, updateFormData, nextStep, previousStep } =
    useListPropertyStore();

  const toggleFlooringType = (type) => {
    const current = formData.flooringTypes || [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    updateFormData({ flooringTypes: updated });
  };

  return (
    <div className="w-full px-6 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Furnishing & Amenities
        </h2>
        <p className="text-muted-foreground text-sm">
          Describe the furnishing and flooring of your property
        </p>
      </motion.div>

      <div className="bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 dark:from-orange-950/10 dark:via-background dark:to-orange-900/5 rounded-xl p-6">
        <div className="space-y-6">
          {/* Furnishing Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Sofa className="w-4 h-4 text-orange-600" />
              Furnishing Status
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {furnishingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    updateFormData({ furnishingStatus: option.value })
                  }
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    formData.furnishingStatus === option.value
                      ? 'border-orange-500 bg-orange-500/10 shadow-md scale-105'
                      : 'border-muted hover:border-orange-300 hover:shadow'
                  }`}
                >
                  <div className="font-semibold text-sm mb-1">{option.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Flooring Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <Label className="text-sm font-semibold">Flooring Types</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {flooringOptions.map((type) => (
                <div
                  key={type}
                  className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:border-orange-500 transition-colors cursor-pointer"
                  onClick={() => toggleFlooringType(type)}
                >
                  <Checkbox
                    checked={(formData.flooringTypes || []).includes(type)}
                    onCheckedChange={() => toggleFlooringType(type)}
                  />
                  <label className="text-sm font-medium cursor-pointer">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-between mt-8 pt-6 border-t border-orange-200 dark:border-orange-900"
        >
          <Button
            variant="outline"
            size="default"
            onClick={previousStep}
            className="px-6 border-orange-200 hover:bg-orange-50 hover:border-orange-500 dark:border-orange-800 dark:hover:bg-orange-950/30"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
            Back
          </Button>
          <Button
            size="default"
            onClick={nextStep}
            className="px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30"
          >
            Continue
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
