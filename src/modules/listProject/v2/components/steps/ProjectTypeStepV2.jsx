import { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, Home, Building, LandPlot, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProjectFormV2 } from '../../context/ProjectFormContextV2';
import SaveAndContinueFooter from './SaveAndContinueFooter';
import { PROJECT_TYPES } from '../../../constants/projectTypes';

// Icon mapping
const iconMap = {
  Building2,
  Home,
  Building,
  LandPlot,
  ShoppingBag,
};

export default function ProjectTypeStepV2() {
  const { setProjectType, saveAndContinue, formData } = useProjectFormV2();
  const [selectedType, setSelectedType] = useState(formData?.projectType || null);

  const handleSelectType = (type) => {
    setSelectedType(type);
    setProjectType(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      saveAndContinue({ projectType: selectedType });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Select Project Type
        </h2>
        <p className="text-muted-foreground text-base">
          Choose the type of real estate project you want to list
        </p>
      </motion.div>

      {/* Project Type Categories */}
      <div className="space-y-8">
        {PROJECT_TYPES.map((category, categoryIndex) => (
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
                const Icon = iconMap[type.icon];
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

      {/* Save & Continue Footer */}
      <SaveAndContinueFooter
        onSaveAndContinue={handleContinue}
        nextDisabled={!selectedType}
        showBack={false}
      />
    </div>
  );
}
