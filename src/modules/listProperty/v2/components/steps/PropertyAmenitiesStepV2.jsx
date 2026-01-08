import { useMemo, useCallback, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { motion } from 'motion/react';
import PropTypes from 'prop-types';
import { Sparkles } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

// Property Features (building/property level)
const FEATURES_LIST = [
  { id: 'gated_society', label: 'Gated Society', icon: '🔐' },
  { id: 'fire_safety', label: 'Fire Safety', icon: '🧯' },
  { id: 'gym', label: 'Gymnasium', icon: '🏋️' },
  { id: 'swimming_pool', label: 'Swimming Pool', icon: '🏊' },
  { id: 'clubhouse', label: 'Club House', icon: '🎪' },
  { id: 'garden', label: 'Garden/Park', icon: '🌳' },
  { id: 'children_play_area', label: 'Children Play Area', icon: '🎠' },
  { id: 'jogging_track', label: 'Jogging Track', icon: '🏃' },
  { id: 'lift', label: 'Lift/Elevator', icon: '🛗' },
  { id: 'power_backup', label: 'Power Backup', icon: '⚡' },
  { id: 'water_supply_247', label: '24/7 Water Supply', icon: '💧' },
  { id: 'visitor_parking', label: 'Visitor Parking', icon: '🅿️' },
  { id: 'security_247', label: '24/7 Security', icon: '🔒' },
  { id: 'cctv_surveillance', label: 'CCTV Surveillance', icon: '📹' },
  { id: 'maintenance_staff', label: 'Maintenance Staff', icon: '👷' },
  { id: 'rainwater_harvesting', label: 'Rainwater Harvesting', icon: '🌧️' },
  { id: 'waste_disposal', label: 'Waste Disposal', icon: '🗑️' },
  { id: 'piped_gas', label: 'Piped Gas', icon: '🔥' },
];

import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';

const STEP_ID = 'property-amenities';

export default function PropertyAmenitiesStepV2() {
  const { saveAndContinue, previousStep, getStepData, setCurrentStepSubmitHandler, setCurrentStepIsValid } = usePropertyFormV2();
  const stepData = getStepData(STEP_ID);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      features: stepData?.features || [],
    },
  });

  const { watch, setValue } = methods;

  // Optional step, can always continue
  const isValid = true;

  const handleContinue = useCallback(() => {
    const data = methods.getValues();
    saveAndContinue(data);
  }, [methods, saveAndContinue]);

  // Register submit handler with context
  useEffect(() => {
    setCurrentStepSubmitHandler(() => handleContinue);
    return () => setCurrentStepSubmitHandler(null);
  }, [handleContinue, setCurrentStepSubmitHandler]);

  // Track validation state
  useEffect(() => {
    setCurrentStepIsValid(isValid);
  }, [isValid, setCurrentStepIsValid]);

  // Watch the current values
  const selectedFeatures = watch('features') || [];

  /**
   * Toggle feature selection
   */
  const toggleFeature = useCallback(
    (featureId) => {
      const currentFeatures = methods.getValues('features') || [];
      const updated = currentFeatures.includes(featureId)
        ? currentFeatures.filter((id) => id !== featureId)
        : [...currentFeatures, featureId];
      
      setValue('features', updated, { shouldValidate: true });
    },
    [methods, setValue]
  );

  /**
   * Check if a feature is selected
   */
  const isFeatureSelected = useCallback(
    (featureId) => selectedFeatures.includes(featureId),
    [selectedFeatures]
  );

  // Pro tips for better listings
  const listingTips = [
    'Use a catchy, descriptive title that highlights key features',
    'Include nearby landmarks, schools, hospitals in the description',
    'Mention connectivity details (metro, bus stops, highways)',
    'Be honest and accurate about pricing and property condition',
  ];

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Property Amenities
          </h2>
          <p className="text-muted-foreground text-sm">
            Building/property level features and facilities
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <div className="space-y-6">
              {/* Property Features Section */}
              <div className="space-y-4">
             
                
                <fieldset className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <legend className="sr-only">Property Features</legend>
                  {FEATURES_LIST.map((feature) => {
                    const isSelected = isFeatureSelected(feature.id);
                    
                    return (
                      <AmenityCard
                        key={feature.id}
                        amenity={feature}
                        isSelected={isSelected}
                        onToggle={toggleFeature}
                      />
                    );
                  })}
                </fieldset>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </FormProvider>
  );
}

/**
 * Individual amenity card component
 * Extracted for better performance and readability
 */
function AmenityCard({ amenity, isSelected, onToggle }) {
  const handleClick = () => onToggle(amenity.id);

  return (
    <button
      type="button"
      className={`
        flex items-center gap-2 p-3 border rounded-lg 
        transition-all duration-200 cursor-pointer
        hover:border-orange-500 hover:shadow-sm
        text-left w-full
        ${
          isSelected
            ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 shadow-sm'
            : 'border-border hover:bg-accent/50'
        }
      `}
      onClick={handleClick}
      aria-pressed={isSelected}
      aria-label={`${amenity.label}${isSelected ? ', selected' : ''}`}
    >
      <Checkbox
        checked={isSelected}
        aria-hidden="true"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-lg flex-shrink-0" aria-hidden="true">
          {amenity.icon}
        </span>
        <span className="text-sm font-medium truncate">{amenity.label}</span>
      </div>
    </button>
  );
}

AmenityCard.propTypes = {
  amenity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};


