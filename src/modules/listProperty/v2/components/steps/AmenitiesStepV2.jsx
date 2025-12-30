import { useMemo, useCallback, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { motion } from 'motion/react';
import PropTypes from 'prop-types';
import { Sparkles, Shield, Dog, Lock } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ProTipV2 from '../shared/ProTipV2';

// Property Features (building/property level)
const FEATURES_LIST = [
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

// Unit Amenities (flat/unit level)
const UNIT_AMENITIES_LIST = [
  { id: 'air_conditioning', label: 'Air Conditioning', icon: '❄️' },
  { id: 'modular_kitchen', label: 'Modular Kitchen', icon: '🍳' },
  { id: 'furnished', label: 'Furnished', icon: '🛋️' },
  { id: 'semi_furnished', label: 'Semi-Furnished', icon: '🪑' },
  { id: 'wardrobe', label: 'Wardrobe', icon: '👔' },
  { id: 'balcony', label: 'Balcony', icon: '🏞️' },
  { id: 'servant_room', label: 'Servant Room', icon: '🚪' },
  { id: 'study_room', label: 'Study Room', icon: '📚' },
  { id: 'pooja_room', label: 'Pooja Room', icon: '🙏' },
  { id: 'private_terrace', label: 'Private Terrace', icon: '🏠' },
  { id: 'private_garden', label: 'Private Garden', icon: '🌿' },
  { id: 'internet_wifi', label: 'Internet/Wi-Fi', icon: '📶' },
  { id: 'intercom', label: 'Intercom Facility', icon: '📞' },
  { id: 'gas_pipeline', label: 'Gas Pipeline', icon: '🔥' },
  { id: 'water_purifier', label: 'Water Purifier', icon: '💧' },
  { id: 'geyser', label: 'Geyser', icon: '🚿' },
];
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';

export default function AmenitiesStepV2() {
  const { saveAndContinue, previousStep, formData, setCurrentStepSubmitHandler } = usePropertyFormV2();

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      features: formData?.features || [],
      amenities: formData?.amenities || [],
      isGated: formData?.isGated || false,
      fireSafety: formData?.fireSafety || false,
      petFriendly: formData?.petFriendly || false,
    },
  });

  const { watch, setValue } = methods;

  // Optional step, can always continue
  const isValid = true;

  const handleContinue = () => {
    const data = methods.getValues();
    saveAndContinue(data);
  };

  // Register submit handler with context
  useEffect(() => {
    setCurrentStepSubmitHandler(() => handleContinue);
    return () => setCurrentStepSubmitHandler(null);
  }, [methods, setCurrentStepSubmitHandler]);

  // Watch the current values
  const selectedFeatures = watch('features') || [];
  const selectedAmenities = watch('amenities') || [];

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
   * Toggle amenity selection
   */
  const toggleAmenity = useCallback(
    (amenityId) => {
      const currentAmenities = methods.getValues('amenities') || [];
      const updated = currentAmenities.includes(amenityId)
        ? currentAmenities.filter((id) => id !== amenityId)
        : [...currentAmenities, amenityId];
      
      setValue('amenities', updated, { shouldValidate: true });
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

  /**
   * Check if an amenity is selected
   */
  const isAmenitySelected = useCallback(
    (amenityId) => selectedAmenities.includes(amenityId),
    [selectedAmenities]
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
            Amenities & Features
          </h2>
          <p className="text-muted-foreground text-sm">
            Highlight the amenities and features of your property
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="pb-24">
            <div className="space-y-6">
              {/* Community Features Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Gated Society */}
                <div className="flex items-center justify-between p-4 border-2 rounded-lg hover:border-orange-500 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Gated Society</Label>
                      <p className="text-xs text-muted-foreground">Secured compound</p>
                    </div>
                  </div>
                  <Switch
                    checked={watch('isGated')}
                    onCheckedChange={(checked) => setValue('isGated', checked, { shouldValidate: true })}
                  />
                </div>

                {/* Fire Safety */}
                <div className="flex items-center justify-between p-4 border-2 rounded-lg hover:border-orange-500 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Fire Safety</Label>
                      <p className="text-xs text-muted-foreground">Compliant systems</p>
                    </div>
                  </div>
                  <Switch
                    checked={watch('fireSafety')}
                    onCheckedChange={(checked) => setValue('fireSafety', checked, { shouldValidate: true })}
                  />
                </div>

                {/* Pet Friendly */}
                <div className="flex items-center justify-between p-4 border-2 rounded-lg hover:border-orange-500 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <Dog className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Pet Friendly</Label>
                      <p className="text-xs text-muted-foreground">Pets allowed</p>
                    </div>
                  </div>
                  <Switch
                    checked={watch('petFriendly')}
                    onCheckedChange={(checked) => setValue('petFriendly', checked, { shouldValidate: true })}
                  />
                </div>
              </div>

              {/* Property Features Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
                    <Sparkles className="w-5 h-5" />
                    Property Features
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select features available at the property/building level{' '}
                    <span className="text-xs">({selectedFeatures.length} selected)</span>
                  </p>
                </div>
                
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

              {/* Unit Amenities Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
                    <Sparkles className="w-5 h-5" />
                    Unit Amenities
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select amenities available within the unit/flat{' '}
                    <span className="text-xs">({selectedAmenities.length} selected)</span>
                  </p>
                </div>
                
                <fieldset className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <legend className="sr-only">Unit Amenities</legend>
                  {UNIT_AMENITIES_LIST.map((amenity) => {
                    const isSelected = isAmenitySelected(amenity.id);
                    
                    return (
                      <AmenityCard
                        key={amenity.id}
                        amenity={amenity}
                        isSelected={isSelected}
                        onToggle={toggleAmenity}
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
