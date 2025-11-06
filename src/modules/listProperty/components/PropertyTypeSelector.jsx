import { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, Home, LandPlot, Trees, Building } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useListPropertyStore from '../store/useListPropertyStore';

const propertyTypes = [
  {
    id: 'apartment',
    name: 'Apartment',
    description: 'Multi-story residential building with individual units',
    icon: Building2,
    color: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/10 to-cyan-500/10',
  },
  {
    id: 'villa',
    name: 'Villa / Independent House',
    description: 'Standalone luxury home with private amenities',
    icon: Home,
    color: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-500/10 to-pink-500/10',
  },
  {
    id: 'duplex',
    name: 'Duplex / Independent Floor',
    description: 'Two-story or single floor independent residence',
    icon: Building,
    color: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-500/10 to-red-500/10',
  },
  {
    id: 'penthouse',
    name: 'Penthouse / Studio',
    description: 'Premium top-floor apartment or compact studio',
    icon: Building2,
    color: 'from-amber-500 to-yellow-500',
    bgGradient: 'from-amber-500/10 to-yellow-500/10',
  },
  {
    id: 'plot',
    name: 'Plot / Land',
    description: 'Vacant land for residential or commercial use',
    icon: LandPlot,
    color: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-500/10 to-emerald-500/10',
  },
  {
    id: 'farmhouse',
    name: 'Farm House / Agricultural',
    description: 'Rural property with agricultural potential',
    icon: Trees,
    color: 'from-teal-500 to-green-600',
    bgGradient: 'from-teal-500/10 to-green-600/10',
  },
];

export default function PropertyTypeSelector() {
  const { formData, updateFormData, setCurrentStep, updateStepValidation } = useListPropertyStore();
  const [selectedType, setSelectedType] = useState(formData.propertyType);

  const handleSelect = (typeId) => {
    setSelectedType(typeId);
    updateFormData({ propertyType: typeId });
    updateStepValidation(0, true);
  };

  const handleContinue = () => {
    if (selectedType) {
      setCurrentStep(1); // Start from Basic Details (step 1)
    }
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
          What type of property are you listing?
        </h2>
        <p className="text-muted-foreground text-sm">
          Select the category that best describes your property
        </p>
      </motion.div>

      {/* Property Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {propertyTypes.map((type, index) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;

          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl group ${
                  isSelected
                    ? 'ring-2 ring-orange-500 shadow-lg scale-[1.02]'
                    : 'hover:scale-[1.02]'
                }`}
                onClick={() => handleSelect(type.id)}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${type.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                {/* Animated Border */}
                {isSelected && (
                  <motion.div
                    layoutId="selectedBorder"
                    className={`absolute inset-0 bg-gradient-to-r ${type.color} opacity-20`}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <div className="relative p-4">
                  {/* Icon Container */}
                  <div className="mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} p-2.5 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <Icon className="w-full h-full text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-bold mb-1 text-foreground">
                    {type.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {type.description}
                  </p>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4"
                    >
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center`}>
                        <svg
                          className="w-3.5 h-3.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-end"
      >
        <Button
          size="default"
          onClick={handleContinue}
          disabled={!selectedType}
          className="px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
}
