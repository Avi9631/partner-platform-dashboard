import { useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { Sparkles, Shield, Dog, Lock } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';
import { usePropertyForm } from '../context/PropertyFormContext';
import { AMENITIES_LIST } from '../constants/amenities';
import amenitiesSchema from '../schemas/amenitiesSchema';
import ProTip from './shared/ProTip';

/**
 * AmenitiesFeatures Component
 * Allows users to select amenities and features for their property listing
 * Displays amenities in a responsive grid with visual feedback
 */
export default function AmenitiesFeatures() {
  const mainForm = useFormContext();
  const { updateStepValidation, currentStep } = usePropertyForm();

  // Initialize React Hook Form with Zod validation
  const {
    watch,
    setValue,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(amenitiesSchema),
    mode: 'onChange',
    defaultValues: {
      amenities: mainForm.watch('amenities') || [],
      isGated: mainForm.watch('isGated') || false,
      fireSafety: mainForm.watch('fireSafety') || false,
      petFriendly: mainForm.watch('petFriendly') || false,
    },
  });

  // Update step validation when form validity changes
  useEffect(() => {
    updateStepValidation(currentStep, isValid);
  }, [isValid, currentStep, updateStepValidation]);

  // Sync form data with main form on field changes
  useEffect(() => {
    const subscription = watch((value) => {
      mainForm.setValue('amenities', value.amenities);
      mainForm.setValue('isGated', value.isGated);
      mainForm.setValue('fireSafety', value.fireSafety);
      mainForm.setValue('petFriendly', value.petFriendly);
    });
    return () => subscription.unsubscribe();
  }, [watch, mainForm]);

  // Memoize selected amenities array to prevent unnecessary re-renders
  const selectedAmenities = useMemo(
    () => watch('amenities') || [],
    [watch]
  );

  /**
   * Toggle amenity selection
   * Adds or removes amenity from the selected list
   */
  const toggleAmenity = useCallback(
    (amenityId) => {
      const updated = selectedAmenities.includes(amenityId)
        ? selectedAmenities.filter((id) => id !== amenityId)
        : [...selectedAmenities, amenityId];
      
      setValue('amenities', updated, { shouldValidate: true });
    },
    [selectedAmenities, setValue]
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
          <Sparkles className="w-5 h-5" />
          Amenities & Features
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Select all amenities available at your property{' '}
          <span className="text-xs">({selectedAmenities.length} selected)</span>
        </p>
      </div>

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

      {/* Amenities Grid */}
      <fieldset className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <legend className="sr-only">Property Amenities</legend>
        {AMENITIES_LIST.map((amenity) => {
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

      {/* Pro Tip Section */}
      <ProTip title="Make Your Listing Stand Out" tips={listingTips} />
    </div>
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
        onCheckedChange={handleClick}
        aria-hidden="true"
        tabIndex={-1}
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
