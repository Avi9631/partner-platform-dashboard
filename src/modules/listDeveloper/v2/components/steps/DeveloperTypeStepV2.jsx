import { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, User, Users, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDeveloperFormV2 } from '../../context/DeveloperFormContextV2';
import SaveAndContinueFooter from '../SaveAndContinueFooter';

const developerTypes = [
  {
    value: 'individual',
    label: 'Individual Developer',
    icon: User,
    description: 'Solo property developer',
    color: 'blue'
  },
  {
    value: 'partnership',
    label: 'Partnership Firm',
    icon: Users,
    description: 'Partnership business',
    color: 'purple'
  },
  {
    value: 'private_limited',
    label: 'Private Limited Company',
    icon: Building2,
    description: 'Pvt. Ltd. Company',
    color: 'indigo'
  },
  {
    value: 'public_limited',
    label: 'Public Limited Company',
    icon: Building2,
    description: 'Public Ltd. Company',
    color: 'cyan'
  },
  {
    value: 'llp',
    label: 'Limited Liability Partnership',
    icon: Briefcase,
    description: 'LLP structure',
    color: 'teal'
  },
  {
    value: 'proprietorship',
    label: 'Sole Proprietorship',
    icon: User,
    description: 'Sole proprietor',
    color: 'green'
  },
];

const colorClasses = {
  blue: {
    selected: 'from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30 border-orange-500 shadow-orange-500/20',
    hover: 'hover:border-orange-300 dark:hover:border-orange-700',
    icon: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
    iconDefault: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    text: 'text-orange-900 dark:text-orange-100',
    textDefault: 'text-gray-900 dark:text-gray-100',
    desc: 'text-orange-700 dark:text-orange-300',
    descDefault: 'text-gray-600 dark:text-gray-400',
    check: 'bg-orange-500',
  },
  purple: {
    selected: 'from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-500 shadow-purple-500/20',
    hover: 'hover:border-purple-300 dark:hover:border-purple-700',
    icon: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white',
    iconDefault: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    text: 'text-purple-900 dark:text-purple-100',
    textDefault: 'text-gray-900 dark:text-gray-100',
    desc: 'text-purple-700 dark:text-purple-300',
    descDefault: 'text-gray-600 dark:text-gray-400',
    check: 'bg-purple-500',
  },
  indigo: {
    selected: 'from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/30 border-indigo-500 shadow-indigo-500/20',
    hover: 'hover:border-indigo-300 dark:hover:border-indigo-700',
    icon: 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white',
    iconDefault: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    text: 'text-indigo-900 dark:text-indigo-100',
    textDefault: 'text-gray-900 dark:text-gray-100',
    desc: 'text-indigo-700 dark:text-indigo-300',
    descDefault: 'text-gray-600 dark:text-gray-400',
    check: 'bg-indigo-500',
  },
  cyan: {
    selected: 'from-cyan-50 to-cyan-100 dark:from-cyan-950/50 dark:to-cyan-900/30 border-cyan-500 shadow-cyan-500/20',
    hover: 'hover:border-cyan-300 dark:hover:border-cyan-700',
    icon: 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white',
    iconDefault: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
    text: 'text-cyan-900 dark:text-cyan-100',
    textDefault: 'text-gray-900 dark:text-gray-100',
    desc: 'text-cyan-700 dark:text-cyan-300',
    descDefault: 'text-gray-600 dark:text-gray-400',
    check: 'bg-cyan-500',
  },
  teal: {
    selected: 'from-teal-50 to-teal-100 dark:from-teal-950/50 dark:to-teal-900/30 border-teal-500 shadow-teal-500/20',
    hover: 'hover:border-teal-300 dark:hover:border-teal-700',
    icon: 'bg-gradient-to-br from-teal-500 to-teal-600 text-white',
    iconDefault: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
    text: 'text-teal-900 dark:text-teal-100',
    textDefault: 'text-gray-900 dark:text-gray-100',
    desc: 'text-teal-700 dark:text-teal-300',
    descDefault: 'text-gray-600 dark:text-gray-400',
    check: 'bg-teal-500',
  },
  green: {
    selected: 'from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border-green-500 shadow-green-500/20',
    hover: 'hover:border-green-300 dark:hover:border-green-700',
    icon: 'bg-gradient-to-br from-green-500 to-green-600 text-white',
    iconDefault: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    text: 'text-green-900 dark:text-green-100',
    textDefault: 'text-gray-900 dark:text-gray-100',
    desc: 'text-green-700 dark:text-green-300',
    descDefault: 'text-gray-600 dark:text-gray-400',
    check: 'bg-green-500',
  },
};

export default function DeveloperTypeStepV2() {
  const { setDeveloperType, saveAndContinue, formData } = useDeveloperFormV2();
  const [selectedType, setSelectedType] = useState(formData?.developerType || null);

  const handleSelectType = (type) => {
    setSelectedType(type);
    setDeveloperType(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      saveAndContinue({ developerType: selectedType });
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
          Select Developer Type
        </h2>
        <p className="text-muted-foreground text-base">
          Choose your business structure to get started
        </p>
      </motion.div>

      {/* Developer Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {developerTypes.map((type, index) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.value;
          const colors = colorClasses[type.color];
          
          return (
            <motion.button
              key={type.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 + 0.2 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectType(type.value)}
              className={cn(
                'p-6 rounded-xl border-2 transition-all duration-300 text-left',
                'hover:shadow-lg',
                isSelected
                  ? `bg-gradient-to-br ${colors.selected} shadow-xl`
                  : `bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 ${colors.hover}`
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center transition-colors',
                    isSelected ? colors.icon : colors.iconDefault
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4
                    className={cn(
                      'font-semibold text-base mb-1',
                      isSelected ? colors.text : colors.textDefault
                    )}
                  >
                    {type.label}
                  </h4>
                  <p
                    className={cn(
                      'text-sm',
                      isSelected ? colors.desc : colors.descDefault
                    )}
                  >
                    {type.description}
                  </p>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn('w-6 h-6 rounded-full flex items-center justify-center', colors.check)}
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

      {/* Save & Continue Footer */}
      <SaveAndContinueFooter
        onSaveAndContinue={handleContinue}
        nextDisabled={!selectedType}
        showBack={false}
      />
    </div>
  );
}
