import { useMemo, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import useListPropertyStore from '../../store/useListPropertyStore';
import { AMENITIES_LIST } from '../../constants/amenities';
import ProTip from '../shared/ProTip';

/**
 * AmenitiesFeatures Component
 * Allows users to select amenities and features for their property listing
 * Displays amenities in a responsive grid with visual feedback
 */
export default function AmenitiesFeatures() {
  const { formData, updateFormData } = useListPropertyStore();

  // Memoize selected amenities array to prevent unnecessary re-renders
  const selectedAmenities = useMemo(
    () => formData.amenities || [],
    [formData.amenities]
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
      
      updateFormData({ amenities: updated });
    },
    [selectedAmenities, updateFormData]
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

      {/* Amenities Grid */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        role="group"
        aria-labelledby="amenities-heading"
      >
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
      </div>

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
    <div
      className={`
        flex items-center gap-2 p-3 border rounded-lg 
        transition-all duration-200 cursor-pointer
        hover:border-orange-500 hover:shadow-sm
        ${
          isSelected
            ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 shadow-sm'
            : 'border-border hover:bg-accent/50'
        }
      `}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`${amenity.label}${isSelected ? ', selected' : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
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
    </div>
  );
}
