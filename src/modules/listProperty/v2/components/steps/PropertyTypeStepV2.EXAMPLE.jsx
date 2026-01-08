/**
 * Example: Updated PropertyTypeStepV2.jsx to work with nested form structure
 * 
 * Key changes:
 * 1. Use getStepData('property-type') for initial state
 * 2. Save property type in nested structure
 * 3. Pass data correctly to saveAndContinue
 */

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Building2, Home, TreePine, LandPlot, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import { Button } from '@/components/ui/button';

const STEP_ID = 'property-type';

const propertyTypes = [
  {
    category: 'Residential',
    types: [
      { value: 'apartment', label: 'Apartment', icon: Building2, description: 'Flat in a building' },
      { value: 'villa', label: 'Villa', icon: Home, description: 'Independent villa' },
      { value: 'duplex', label: 'Duplex', icon: Home, description: 'Two-floor unit' },
      { value: 'independent_house', label: 'Independent House', icon: Home, description: 'Standalone house' },
      { value: 'penthouse', label: 'Penthouse', icon: Building2, description: 'Top-floor luxury' },
      { value: 'studio', label: 'Studio Apartment', icon: Building2, description: 'Single room unit' },
      { value: 'independent_floor', label: 'Independent Floor', icon: Building2, description: 'Single floor' },
    ],
  },
  {
    category: 'Land',
    types: [
      { value: 'plot', label: 'Residential Plot', icon: LandPlot, description: 'Vacant land' },
      { value: 'farmhouse', label: 'Farmhouse', icon: TreePine, description: 'Farm property' },
      { value: 'agricultural_land', label: 'Agricultural Land', icon: TreePine, description: 'Farming land' },
    ],
  },
];

export default function PropertyTypeStepV2() {
  const { 
    setPropertyType, 
    saveAndContinue, 
    getStepData,  // ✅ NEW: Get nested step data
    saveDraft, 
    setCurrentStepIsValid 
  } = usePropertyFormV2();
  
  // ✅ UPDATED: Get data from nested structure
  const stepData = getStepData(STEP_ID);
  const [selectedType, setSelectedType] = useState(stepData?.propertyType || null);
  const [hasUserSelected, setHasUserSelected] = useState(false);

  // PropertyType step is always valid once a type is selected
  useEffect(() => {
    setCurrentStepIsValid(!!selectedType);
  }, [selectedType, setCurrentStepIsValid]);

  // ✅ UPDATED: Save property type in nested structure
  const handleSelectType = async (type) => {
    setSelectedType(type);
    setPropertyType(type);
    setHasUserSelected(true);
    
    // Save with nested structure - wrap in step ID
    await saveDraft({ 
      [STEP_ID]: { propertyType: type } 
    });
  };

  // ✅ UPDATED: Pass data in the format expected by saveAndContinue
  const handleContinue = useCallback(() => {
    if (selectedType) {
      // saveAndContinue automatically nests this data under current step ID
      saveAndContinue({ propertyType: selectedType });
    }
  }, [selectedType, saveAndContinue]);

  // Auto-advance only when user actively selects a type (not when returning to this step)
  useEffect(() => {
    if (selectedType && hasUserSelected) {
      const timer = setTimeout(() => {
        handleContinue();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedType, hasUserSelected, handleContinue]);

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
            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              {category.category}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.types.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.value;
                
                return (
                  <motion.button
                    key={type.value}
                    type="button"
                    onClick={() => handleSelectType(type.value)}
                    className={cn(
                      "relative group p-6 rounded-xl border-2 transition-all duration-300",
                      "hover:shadow-lg hover:-translate-y-1",
                      "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
                      isSelected
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20 shadow-md"
                        : "border-border bg-card hover:border-orange-300 dark:hover:border-orange-700"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Selection Indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <ChevronRight className="w-4 h-4 text-white" />
                      </motion.div>
                    )}

                    <div className="flex flex-col items-center text-center space-y-3">
                      <div
                        className={cn(
                          "p-4 rounded-lg transition-colors",
                          isSelected
                            ? "bg-orange-100 dark:bg-orange-900/30"
                            : "bg-muted group-hover:bg-orange-50 dark:group-hover:bg-orange-950/20"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-8 h-8 transition-colors",
                            isSelected
                              ? "text-orange-600 dark:text-orange-400"
                              : "text-muted-foreground group-hover:text-orange-500"
                          )}
                        />
                      </div>
                      
                      <div>
                        <h4
                          className={cn(
                            "font-semibold text-sm mb-1 transition-colors",
                            isSelected
                              ? "text-orange-600 dark:text-orange-400"
                              : "text-foreground"
                          )}
                        >
                          {type.label}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Continue Button (shown if type selected and auto-advance disabled) */}
      {selectedType && !hasUserSelected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex justify-end"
        >
          <Button
            onClick={handleContinue}
            size="lg"
            className="bg-orange-500 hover:bg-orange-600"
          >
            Continue
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Summary of Changes:
 * 
 * 1. Added STEP_ID constant
 * 2. Use getStepData(STEP_ID) to get initial propertyType value
 * 3. In handleSelectType: saveDraft with nested structure { 'property-type': { propertyType: type } }
 * 4. In handleContinue: saveAndContinue({ propertyType: selectedType }) - automatic nesting
 * 
 * Key Points:
 * - When manually calling saveDraft(), wrap data in step ID object
 * - When calling saveAndContinue(), just pass the data - it auto-nests based on current step
 * - Both approaches result in the same nested structure in the draft
 */
