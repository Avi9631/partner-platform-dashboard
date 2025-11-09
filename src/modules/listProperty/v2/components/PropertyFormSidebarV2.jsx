import { 
  Building2, 
  MapPin, 
  DollarSign, 
  CheckCircle2,
  Circle,
  LandPlot,
  Bed,
  Maximize,
  Sofa,
  Car,
  Compass,
  Layers,
  Users,
  Tag,
  Sparkles,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePropertyFormV2 } from '../context/PropertyFormContextV2';

export default function PropertyFormSidebarV2() {
  const { 
    currentStep, 
    propertyType,
    resetForm,
    setCurrentStep,
    isStepCompleted,
    getProgress,
    getTotalSteps,
  } = usePropertyFormV2();

  const handleChangePropertyType = () => {
    if (window.confirm('Changing property type will reset all your progress. Continue?')) {
      resetForm();
      setCurrentStep(0);
    }
  };

  // Define navigation items based on property type
  const getNavigationItems = () => {
    const isBuildingProp = propertyType && [
      'apartment', 'villa', 'duplex', 'independent_house', 
      'penthouse', 'studio', 'independent_floor'
    ].includes(propertyType);
    
    const isLandProp = propertyType && [
      'plot', 'farmhouse', 'agricultural_land'
    ].includes(propertyType);
    
    const isApartmentOrPenthouse = ['apartment', 'penthouse'].includes(propertyType);

    const baseItems = [
      {
        step: 0,
        label: 'Property Type',
        icon: Building2,
        description: 'Choose type',
      },
      {
        step: 1,
        label: 'Basic Details',
        icon: MapPin,
        description: 'Location & info',
      },
    ];

    if (isBuildingProp) {
      baseItems.push(
        {
          step: 2,
          label: 'Configuration',
          icon: Bed,
          description: 'Rooms & layout',
        },
        {
          step: 3,
          label: 'Area Details',
          icon: Maximize,
          description: 'Size & space',
        },
        {
          step: 4,
          label: 'Furnishing',
          icon: Sofa,
          description: 'Interior details',
        },
        {
          step: 5,
          label: 'Parking',
          icon: Car,
          description: 'Utilities',
        },
        {
          step: 6,
          label: 'Location',
          icon: Compass,
          description: 'Facing & view',
        }
      );

      if (isApartmentOrPenthouse) {
        baseItems.push({
          step: 7,
          label: 'Floor Details',
          icon: Layers,
          description: 'Tower & floor',
        });
        
        baseItems.push(
          {
            step: 8,
            label: 'Pricing',
            icon: DollarSign,
            description: 'Price details',
          },
          {
            step: 9,
            label: 'Suitable For',
            icon: Users,
            description: 'Preferences',
          },
          {
            step: 10,
            label: 'Listing Info',
            icon: Tag,
            description: 'Title & desc',
          },
          {
            step: 11,
            label: 'Amenities',
            icon: Sparkles,
            description: 'Features',
          },
          {
            step: 12,
            label: 'Review',
            icon: CheckCircle2,
            description: 'Final review',
          }
        );
      } else {
        baseItems.push(
          {
            step: 7,
            label: 'Pricing',
            icon: DollarSign,
            description: 'Price details',
          },
          {
            step: 8,
            label: 'Suitable For',
            icon: Users,
            description: 'Preferences',
          },
          {
            step: 9,
            label: 'Listing Info',
            icon: Tag,
            description: 'Title & desc',
          },
          {
            step: 10,
            label: 'Amenities',
            icon: Sparkles,
            description: 'Features',
          },
          {
            step: 11,
            label: 'Review',
            icon: CheckCircle2,
            description: 'Final review',
          }
        );
      }
    } else if (isLandProp) {
      baseItems.push(
        {
          step: 2,
          label: 'Land Details',
          icon: LandPlot,
          description: 'Plot specs',
        },
        {
          step: 3,
          label: 'Pricing',
          icon: DollarSign,
          description: 'Price details',
        },
        {
          step: 4,
          label: 'Listing Info',
          icon: Tag,
          description: 'Title & desc',
        },
        {
          step: 5,
          label: 'Amenities',
          icon: Sparkles,
          description: 'Features',
        },
        {
          step: 6,
          label: 'Review',
          icon: CheckCircle2,
          description: 'Final review',
        }
      );
    } else {
      baseItems.push(
        {
          step: 2,
          label: 'Details',
          icon: Building2,
          description: 'Property info',
        },
        {
          step: 3,
          label: 'Pricing',
          icon: DollarSign,
          description: 'Price details',
        },
        {
          step: 4,
          label: 'Listing Info',
          icon: Tag,
          description: 'Title & desc',
        },
        {
          step: 5,
          label: 'Amenities',
          icon: Sparkles,
          description: 'Features',
        },
        {
          step: 6,
          label: 'Review',
          icon: CheckCircle2,
          description: 'Final review',
        }
      );
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  // Can navigate to a step if it's completed or if previous steps are completed
  const canNavigateToStep = (step) => {
    // Can always go back to previous completed steps
    if (step < currentStep) return true;
    
    // Can go to current step
    if (step === currentStep) return true;
    
    // Can only go forward if all previous steps are completed
    if (step > currentStep) {
      for (let i = 0; i < step; i++) {
        if (!isStepCompleted(i)) return false;
      }
      return true;
    }
    
    return false;
  };

  const getStepStatus = (step) => {
    if (isStepCompleted(step)) return 'completed';
    if (step === currentStep) return 'current';
    if (step < currentStep) return 'completed';
    return 'upcoming';
  };

  const handleStepClick = (step) => {
    if (canNavigateToStep(step)) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="w-72 border-r bg-gradient-to-b from-orange-50/50 to-white dark:from-orange-950/20 dark:to-background overflow-y-auto">
      <div className="p-4">
        {/* Property Type Badge */}
        {propertyType && (
          <div className="mb-6 p-3 rounded-lg bg-white dark:bg-gray-900 border-2 border-orange-200 dark:border-orange-800 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-orange-600 dark:text-orange-400">
                Selected Property
              </p>
              <button
                onClick={handleChangePropertyType}
                className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 underline"
              >
                Change
              </button>
            </div>
            <p className="text-sm font-semibold text-orange-900 dark:text-orange-100 capitalize">
              {propertyType.replace('_', ' ')}
            </p>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const status = getStepStatus(item.step);
            const canNavigate = canNavigateToStep(item.step);

            return (
              <button
                key={`${item.step}-${index}`}
                onClick={() => handleStepClick(item.step)}
                disabled={!canNavigate}
                className={cn(
                  'w-full text-left p-3 rounded-lg transition-all duration-200',
                  'flex items-start gap-3 group relative',
                  status === 'current' && 
                    'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 scale-105',
                  status === 'completed' && 
                    'bg-white dark:bg-gray-900 border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 hover:shadow-md cursor-pointer',
                  status === 'upcoming' && !canNavigate &&
                    'bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 opacity-50 cursor-not-allowed',
                  status === 'upcoming' && canNavigate &&
                    'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-sm cursor-pointer'
                )}
              >
                {/* Icon & Status Indicator */}
                <div className="relative flex-shrink-0 mt-0.5">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      'transition-all duration-200',
                      status === 'current' && 
                        'bg-white/20 text-white',
                      status === 'completed' && 
                        'bg-gradient-to-br from-green-500 to-green-600 text-white',
                      status === 'upcoming' && !canNavigate &&
                        'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600',
                      status === 'upcoming' && canNavigate &&
                        'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50'
                    )}
                  >
                    {status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : status === 'upcoming' && !canNavigate ? (
                      <Lock className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  
                  {/* Step Number Badge */}
                  <div
                    className={cn(
                      'absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                      status === 'current' && 'bg-white text-orange-600',
                      status === 'completed' && 'bg-green-700 text-white',
                      status === 'upcoming' && 'bg-gray-400 dark:bg-gray-600 text-white'
                    )}
                  >
                    {item.step + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      'font-semibold text-sm mb-0.5 truncate',
                      status === 'current' && 'text-white',
                      status === 'completed' && 'text-green-900 dark:text-green-100',
                      status === 'upcoming' && 'text-gray-700 dark:text-gray-300'
                    )}
                  >
                    {item.label}
                  </h3>
                  <p
                    className={cn(
                      'text-xs truncate',
                      status === 'current' && 'text-white/90',
                      status === 'completed' && 'text-green-700 dark:text-green-300',
                      status === 'upcoming' && 'text-gray-500 dark:text-gray-500'
                    )}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Validation Status */}
                {status === 'completed' && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                
                {/* Lock icon for locked steps */}
                {status === 'upcoming' && !canNavigate && (
                  <div className="flex-shrink-0">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Progress Indicator */}
        <div className="mt-6 p-4 rounded-lg bg-white dark:bg-gray-900 border-2 border-orange-200 dark:border-orange-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-orange-900 dark:text-orange-100">
              Overall Progress
            </span>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
              {getProgress()}%
            </span>
          </div>
          <div className="w-full bg-orange-200 dark:bg-orange-900/50 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 ease-out rounded-full"
              style={{
                width: `${getProgress()}%`,
              }}
            />
          </div>
          <p className="text-xs text-orange-700 dark:text-orange-300 mt-2">
            Step {currentStep + 1} of {getTotalSteps()}
          </p>
        </div>

        {/* Help Text */}
        <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-900 dark:text-blue-100">
            💡 <span className="font-semibold">Tip:</span> Click &quot;Save & Continue&quot; to move forward
          </p>
        </div>
      </div>
    </div>
  );
}
