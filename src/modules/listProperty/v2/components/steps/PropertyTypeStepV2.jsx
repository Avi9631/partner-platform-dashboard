import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Building2, Home, TreePine, LandPlot, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import { Button } from '@/components/ui/button';

const propertyTypes = [
  {
    category: 'Residential',
    types: [
      { value: 'apartment', label: 'Apartment', icon: Building2, description: 'Flat in a building' },
      { value: 'villa', label: 'Villa', icon: Home, description: 'Independent villa' },
      { value: 'duplex', label: 'Duplex', icon: Home, description: 'Two-floor unit' },
      { value: 'independent_house', label: 'Independent House', icon: Home, description: 'Standalone house' },
      { value: 'penthouse', label: 'Penthouse', icon: Building2, description: 'Top-floor luxury' },
      { value: 'independent_floor', label: 'Independent Floor', icon: Building2, description: 'Single floor' },
    ],
  },
  {
    category: 'Land',
    types: [
      { value: 'residential_plot', label: 'Residential Plot', icon: LandPlot, description: 'Land for residential use' },
      { value: 'commercial_plot', label: 'Commercial Plot', icon: LandPlot, description: 'Land for commercial use' },
      { value: 'industrial_plot', label: 'Industrial Plot', icon: LandPlot, description: 'Land for industrial use' },
      { value: 'farmhouse', label: 'Farmhouse', icon: TreePine, description: 'Farm property with structure' },
      { value: 'agricultural_land', label: 'Agricultural Land', icon: TreePine, description: 'Farming land' },
    ],
  },
];

const STEP_ID = 'property-type';

export default function PropertyTypeStepV2() {
  const { setPropertyType, saveAndContinue, getStepData, saveDraft, setCurrentStepIsValid } = usePropertyFormV2();
  const stepData = getStepData(STEP_ID);
  const [selectedType, setSelectedType] = useState(stepData?.propertyType || null);

  // PropertyType step is always valid once a type is selected
  useEffect(() => {
    setCurrentStepIsValid(!!selectedType);
  }, [selectedType, setCurrentStepIsValid]);

  const handleSelectType = async (type) => {
    setSelectedType(type);
    setPropertyType(type);
    
    // Auto-save the property type selection with nested structure
    await saveDraft({ [STEP_ID]: { propertyType: type } });
  };

  const handleContinue = useCallback(() => {
    if (selectedType) {
      // Pass property type data to context and move to next step
      saveAndContinue({ propertyType: selectedType });
    }
  }, [selectedType, saveAndContinue]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Select Property Type
        </h2>
        <p className="text-muted-foreground text-base">
          Choose the type of property you want to list
        </p>
      </motion.div>

      {/* Property Type Categories */}
      <div className="space-y-8">
        {propertyTypes.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 + 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
              {category.category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.types.map((type, typeIndex) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.value;
                
                return (
                  <motion.button
                    key={type.value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: categoryIndex * 0.1 + typeIndex * 0.05 + 0.3 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectType(type.value)}
                    className={cn(
                      'p-6 rounded-xl border-2 transition-all duration-300 text-left',
                      'hover:shadow-lg',
                      isSelected
                        ? 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30 border-orange-500 shadow-xl shadow-orange-500/20'
                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-lg flex items-center justify-center transition-colors',
                          isSelected
                            ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
                            : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                        )}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4
                          className={cn(
                            'font-semibold text-base mb-1',
                            isSelected
                              ? 'text-orange-900 dark:text-orange-100'
                              : 'text-gray-900 dark:text-gray-100'
                          )}
                        >
                          {type.label}
                        </h4>
                        <p
                          className={cn(
                            'text-sm',
                            isSelected
                              ? 'text-orange-700 dark:text-orange-300'
                              : 'text-gray-600 dark:text-gray-400'
                          )}
                        >
                          {type.description}
                        </p>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center"
                        >
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

    
    </div>
  );
}

