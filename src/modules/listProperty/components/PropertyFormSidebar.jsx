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
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePropertyForm } from '../context/PropertyFormContext';

export default function PropertyFormSidebar() {
  const { 
    currentStep, 
    stepValidation, 
    propertyType,
    resetForm,
    setCurrentStep
  } = usePropertyForm();

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
        step: 1,
        label: 'Basic Details',
        icon: MapPin,
        description: 'Location & info',
      },
    ];

    // Add building steps as separate main steps
    if (isBuildingProp) {
      baseItems.push(
        {
          step: 2,
          label: 'Basic Config',
          icon: Bed,
          description: 'Rooms setup',
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
          description: 'Parking & utilities',
        },
        {
          step: 6,
          label: 'Location',
          icon: Compass,
          description: 'Facing & view',
        }
      );

      // Add floor details for apartments/penthouses
      if (isApartmentOrPenthouse) {
        baseItems.push({
          step: 7,
          label: 'Floor Details',
          icon: Layers,
          description: 'Tower & floor info',
        });
        
        // Listing Details steps (separate screens)
        baseItems.push(
          {
            step: 8,
            label: 'Pricing Info',
            icon: DollarSign,
            description: 'Price & charges',
          },
          {
            step: 9,
            label: 'Suitable For',
            icon: Users,
            description: 'Tenant preference',
          },
          {
            step: 10,
            label: 'Listing Info',
            icon: Tag,
            description: 'Title & description',
          },
          {
            step: 11,
            label: 'Amenities',
            icon: Sparkles,
            description: 'Features & facilities',
          },
          {
            step: 12,
            label: 'Review & Submit',
            icon: CheckCircle2,
            description: 'Final review',
          }
        );
      } else {
        // Listing Details steps for other building types (separate screens)
        baseItems.push(
          {
            step: 7,
            label: 'Pricing Info',
            icon: DollarSign,
            description: 'Price & charges',
          },
          {
            step: 8,
            label: 'Suitable For',
            icon: Users,
            description: 'Tenant preference',
          },
          {
            step: 9,
            label: 'Listing Info',
            icon: Tag,
            description: 'Title & description',
          },
          {
            step: 10,
            label: 'Amenities',
            icon: Sparkles,
            description: 'Features & facilities',
          },
          {
            step: 11,
            label: 'Review & Submit',
            icon: CheckCircle2,
            description: 'Final review',
          }
        );
      }
    } else if (isLandProp) {
      baseItems.push(
        {
          step: 2,
          label: 'Plot Dimensions',
          icon: LandPlot,
          description: 'Land specifications',
        },
        {
          step: 3,
          label: 'Pricing Info',
          icon: DollarSign,
          description: 'Price & charges',
        },
        {
          step: 4,
          label: 'Listing Info',
          icon: Tag,
          description: 'Title & description',
        },
        {
          step: 5,
          label: 'Amenities',
          icon: Sparkles,
          description: 'Features & facilities',
        },
        {
          step: 6,
          label: 'Review & Submit',
          icon: CheckCircle2,
          description: 'Final review',
        }
      );
    } else {
      // Before property type selected
      baseItems.push(
        {
          step: 2,
          label: 'Property Details',
          icon: Building2,
          description: 'Property info',
        },
        {
          step: 3,
          label: 'Pricing Info',
          icon: DollarSign,
          description: 'Price & charges',
        },
        {
          step: 4,
          label: 'Listing Info',
          icon: Tag,
          description: 'Title & description',
        },
        {
          step: 5,
          label: 'Amenities',
          icon: Sparkles,
          description: 'Features & facilities',
        },
        {
          step: 6,
          label: 'Review & Submit',
          icon: CheckCircle2,
          description: 'Final review',
        }
      );
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const canNavigateToStep = () => {
    // Allow free navigation to any step (no restrictions)
    return true;
  };

  const getStepStatus = (step) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'current';
    return 'upcoming';
  };

  const handleStepClick = (step) => {
    if (canNavigateToStep(step)) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="w-72 border-r bg-muted/30 overflow-y-auto">
      <div className="p-4">
        {/* Property Type Badge */}
        {propertyType && (
          <div className="mb-6 p-3 rounded-lg bg-orange-100 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
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

            return (
              <button
                key={`${item.step}-${index}`}
                onClick={() => handleStepClick(item.step)}
                className={cn(
                  'w-full text-left p-3 rounded-lg transition-all duration-200',
                  'flex items-start gap-3 group',
                  status === 'current' && 
                    'bg-orange-100 dark:bg-orange-950/50 border border-orange-300 dark:border-orange-700 shadow-sm',
                  status === 'completed' && 
                    'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50 hover:bg-green-100 dark:hover:bg-green-950/30',
                  status === 'upcoming' &&
                    'bg-background border border-muted hover:bg-muted/50 hover:border-orange-200 dark:hover:border-orange-800 cursor-pointer'
                )}
              >
                {/* Icon & Status Indicator */}
                <div className="relative flex-shrink-0 mt-0.5">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      'transition-all duration-200',
                      status === 'current' && 
                        'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md',
                      status === 'completed' && 
                        'bg-gradient-to-br from-green-500 to-green-600 text-white',
                      status === 'upcoming' && 
                        'bg-muted text-muted-foreground group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30'
                    )}
                  >
                    {status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : status === 'current' ? (
                      <Icon className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  
                  {/* Step Number Badge */}
                  <div
                    className={cn(
                      'absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                      status === 'current' && 'bg-orange-600 text-white',
                      status === 'completed' && 'bg-green-600 text-white',
                      status === 'upcoming' && 'bg-muted-foreground/20 text-muted-foreground'
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
                      status === 'current' && 'text-orange-900 dark:text-orange-100',
                      status === 'completed' && 'text-green-900 dark:text-green-100',
                      status === 'upcoming' && 'text-muted-foreground'
                    )}
                  >
                    {item.label}
                  </h3>
                  <p
                    className={cn(
                      'text-xs truncate',
                      status === 'current' && 'text-orange-700 dark:text-orange-300',
                      status === 'completed' && 'text-green-700 dark:text-green-300',
                      status === 'upcoming' && 'text-muted-foreground/70'
                    )}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Validation Status */}
                {status !== 'upcoming' && (
                  <div className="flex-shrink-0">
                    {stepValidation[item.step] || status === 'completed' ? (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    ) : status === 'current' ? (
                      <div className="w-6 h-6 rounded-full bg-orange-200 dark:bg-orange-800/50 flex items-center justify-center">
                        <Circle className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                      </div>
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Progress Indicator */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-orange-900 dark:text-orange-100">
              Progress
            </span>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
              {Math.round(((currentStep - 1) / (navigationItems.length - 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-orange-200 dark:bg-orange-900/50 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 ease-out rounded-full"
              style={{
                width: `${((currentStep - 1) / (navigationItems.length - 1)) * 100}%`,
              }}
            />
          </div>
          <p className="text-xs text-orange-700 dark:text-orange-300 mt-2">
            Step {currentStep} of {navigationItems.length}
          </p>
        </div>

        {/* Help Text */}
        <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-900 dark:text-blue-100">
            💡 <span className="font-semibold">Tip:</span> Complete each section to unlock the next step
          </p>
        </div>
      </div>
    </div>
  );
}
