/**
 * Step Configuration - Declarative & Loosely Coupled
 * Each property type defines its own step flow for maximum flexibility
 * 
 * Architecture:
 * - Each property type has its own step array
 * - Steps are reusable components
 * - Easy to add/remove/reorder steps per property type
 * - Special handling for hybrid types (e.g., farmhouse = land + building)
 */

import PropertyTypeStepV2 from '../components/steps/PropertyTypeStepV2';
import LocationSelectionStepV2 from '../components/steps/LocationSelectionStepV2';
import BasicDetailsStepV2 from '../components/steps/BasicDetailsStepV2';
import BasicConfigurationStepV2 from '../components/steps/BasicConfigurationStepV2';
import UnitAmenitiesStepV2 from '../components/steps/UnitAmenitiesStepV2';
import LocationStepV2 from '../components/steps/LocationStepV2';
import FloorDetailsStepV2 from '../components/steps/FloorDetailsStepV2';
import LandAttributesStepV2 from '../components/steps/LandAttributesStepV2';
import PricingStepV2 from '../components/steps/PricingStepV2';
import SuitableForStepV2 from '../components/steps/SuitableForStepV2';
import ListingInfoStepV2 from '../components/steps/ListingInfoStepV2';
import PropertyAmenitiesStepV2 from '../components/steps/PropertyAmenitiesStepV2';
import MediaUploadStepV2 from '../components/steps/MediaUploadStepV2';

// ============================================
// STEP DEFINITIONS (Reusable)
// ============================================

const STEPS = {
  PROPERTY_TYPE: {
    id: 'property-type',
    name: 'Property Type',
    component: PropertyTypeStepV2,
  },
  LOCATION_SELECTION: {
    id: 'location-selection',
    name: 'Location Selection',
    component: LocationSelectionStepV2,
  },
  BASIC_DETAILS: {
    id: 'basic-details',
    name: 'Basic Details',
    component: BasicDetailsStepV2,
  },
  BASIC_CONFIGURATION: {
    id: 'basic-configuration',
    name: 'Basic Configuration',
    component: BasicConfigurationStepV2,
  },
  UNIT_AMENITIES: {
    id: 'unit-amenities',
    name: 'Unit Amenities',
    component: UnitAmenitiesStepV2,
  },
  LOCATION_ATTRIBUTES: {
    id: 'location-attributes',
    name: 'Location Attributes',
    component: LocationStepV2,
  },
  FLOOR_DETAILS: {
    id: 'floor-details',
    name: 'Floor Details',
    component: FloorDetailsStepV2,
  },
  LAND_ATTRIBUTES: {
    id: 'land-attributes',
    name: 'Land Attributes',
    component: LandAttributesStepV2,
  },
  PRICING: {
    id: 'pricing',
    name: 'Pricing',
    component: PricingStepV2,
  },
  LISTING_INFO: {
    id: 'listing-info',
    name: 'Listing Info',
    component: ListingInfoStepV2,
  },
  PROPERTY_AMENITIES: {
    id: 'property-amenities',
    name: 'Property Amenities',
    component: PropertyAmenitiesStepV2,
  },
  MEDIA_UPLOAD: {
    id: 'media-upload',
    name: 'Media & Documents',
    component: MediaUploadStepV2,
  },
};

// ============================================
// PROPERTY TYPE CONFIGURATIONS
// Each property type defines its complete step flow
// ============================================

const PROPERTY_TYPE_STEPS = {
  // Residential Building Types
  apartment: [
    STEPS.PROPERTY_TYPE,
    STEPS.LOCATION_SELECTION,
    STEPS.BASIC_DETAILS,
    STEPS.BASIC_CONFIGURATION,
    STEPS.UNIT_AMENITIES,
    STEPS.LOCATION_ATTRIBUTES,
    STEPS.FLOOR_DETAILS, // Apartment-specific
    STEPS.PRICING,
    STEPS.LISTING_INFO,
    STEPS.PROPERTY_AMENITIES,
    STEPS.MEDIA_UPLOAD,
  ],
  
  villa: [
    STEPS.PROPERTY_TYPE,
    STEPS.LOCATION_SELECTION,
    STEPS.BASIC_DETAILS,
    STEPS.BASIC_CONFIGURATION,
    STEPS.UNIT_AMENITIES,
    STEPS.LOCATION_ATTRIBUTES,
    STEPS.PRICING,
    STEPS.LISTING_INFO,
    STEPS.PROPERTY_AMENITIES,
    STEPS.MEDIA_UPLOAD,
  ],
  
  duplex: [
    STEPS.PROPERTY_TYPE,
    STEPS.LOCATION_SELECTION,
    STEPS.BASIC_DETAILS,
    STEPS.BASIC_CONFIGURATION,
    STEPS.UNIT_AMENITIES,
    STEPS.LOCATION_ATTRIBUTES,
    STEPS.PRICING,
    STEPS.LISTING_INFO,
    STEPS.PROPERTY_AMENITIES,
    STEPS.MEDIA_UPLOAD,
  ],
  
  independent_house: [
    STEPS.PROPERTY_TYPE,
    STEPS.LOCATION_SELECTION,
    STEPS.BASIC_DETAILS,
    STEPS.BASIC_CONFIGURATION,
    STEPS.UNIT_AMENITIES,
    STEPS.LOCATION_ATTRIBUTES,
    STEPS.PRICING,
    STEPS.LISTING_INFO,
    STEPS.PROPERTY_AMENITIES,
    STEPS.MEDIA_UPLOAD,
  ],
  
  penthouse: [
    STEPS.PROPERTY_TYPE,
    STEPS.LOCATION_SELECTION,
    STEPS.BASIC_DETAILS,
    STEPS.BASIC_CONFIGURATION,
    STEPS.UNIT_AMENITIES,
    STEPS.LOCATION_ATTRIBUTES,
    STEPS.FLOOR_DETAILS, // Penthouse-specific
    STEPS.PRICING,
    STEPS.LISTING_INFO,
    STEPS.PROPERTY_AMENITIES,
    STEPS.MEDIA_UPLOAD,
  ],
  
  independent_floor: [
    STEPS.PROPERTY_TYPE,
    STEPS.LOCATION_SELECTION,
    STEPS.BASIC_DETAILS,
    STEPS.BASIC_CONFIGURATION,
    STEPS.UNIT_AMENITIES,
    STEPS.LOCATION_ATTRIBUTES,
    STEPS.PRICING,
    STEPS.LISTING_INFO,
    STEPS.PROPERTY_AMENITIES,
    STEPS.MEDIA_UPLOAD,
  ],
  
  // Hybrid Type - Farmhouse (Land + Building)
  farmhouse: [
    STEPS.PROPERTY_TYPE,
    STEPS.LOCATION_SELECTION,
    STEPS.BASIC_DETAILS,
    STEPS.LAND_ATTRIBUTES,    // Land/plot details first
    STEPS.BASIC_CONFIGURATION, // Then building details
    STEPS.UNIT_AMENITIES,
    STEPS.LOCATION_ATTRIBUTES,
    STEPS.PRICING,
    STEPS.LISTING_INFO,
    STEPS.PROPERTY_AMENITIES,
    STEPS.MEDIA_UPLOAD,
  ],
  
  // Land/Plot Types
  residential_plot: [
    STEPS.PROPERTY_TYPE,
    STEPS.LOCATION_SELECTION,
    STEPS.BASIC_DETAILS,
    STEPS.LAND_ATTRIBUTES,
    STEPS.PRICING,
    STEPS.LISTING_INFO,
    STEPS.PROPERTY_AMENITIES,
    STEPS.MEDIA_UPLOAD,
  ],
  
  commercial_plot: [
    STEPS.PROPERTY_TYPE,
    STEPS.LOCATION_SELECTION,
    STEPS.BASIC_DETAILS,
    STEPS.LAND_ATTRIBUTES,
    STEPS.PRICING,
    STEPS.LISTING_INFO,
    STEPS.PROPERTY_AMENITIES,
    STEPS.MEDIA_UPLOAD,
  ],
  
  industrial_plot: [
    STEPS.PROPERTY_TYPE,
    STEPS.LOCATION_SELECTION,
    STEPS.BASIC_DETAILS,
    STEPS.LAND_ATTRIBUTES,
    STEPS.PRICING,
    STEPS.LISTING_INFO,
    STEPS.PROPERTY_AMENITIES,
    STEPS.MEDIA_UPLOAD,
  ],
  
  agricultural_land: [
    STEPS.PROPERTY_TYPE,
    STEPS.LOCATION_SELECTION,
    STEPS.BASIC_DETAILS,
    STEPS.LAND_ATTRIBUTES,
    STEPS.PRICING,
    STEPS.LISTING_INFO,
    STEPS.PROPERTY_AMENITIES,
    STEPS.MEDIA_UPLOAD,
  ],
};

// Default steps when no property type is selected
const DEFAULT_STEPS = [
  STEPS.PROPERTY_TYPE,
  STEPS.LOCATION_SELECTION,
  STEPS.BASIC_DETAILS,
];

// ============================================
// PUBLIC API
// ============================================

/**
 * Get steps based on property type
 * Returns the complete step flow for the given property type
 * 
 * @param {Object} formData - Form data containing propertyType
 * @returns {Array} Array of step configurations
 */
export const getVisibleSteps = (formData = {}) => {
  const { propertyType } = formData;
  
  if (!propertyType) {
    return DEFAULT_STEPS;
  }
  
  // Get steps for this property type, or fallback to default
  const steps = PROPERTY_TYPE_STEPS[propertyType] || DEFAULT_STEPS;
  
  // Apply conditional filtering if needed
  return steps.filter(step => {
    // Add conditional logic here if any step has conditions
    if (step.condition) {
      return step.condition(formData);
    }
    return true;
  });
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get step component by index
 */
export const getStepComponent = (stepIndex, formData = {}) => 
  getVisibleSteps(formData)[stepIndex]?.component || null;

/**
 * Get total number of visible steps
 */
export const getTotalVisibleSteps = (formData = {}) => 
  getVisibleSteps(formData).length;

/**
 * Get step name by index
 */
export const getStepName = (stepIndex, formData = {}) => 
  getVisibleSteps(formData)[stepIndex]?.name || '';

/**
 * Check if a step is visible in the current flow
 */
export const isStepVisible = (stepId, formData = {}) => 
  getVisibleSteps(formData).some(step => step.id === stepId);

/**
 * Get step index by ID
 */
export const getStepIndexById = (stepId, formData = {}) => 
  getVisibleSteps(formData).findIndex(step => step.id === stepId);

/**
 * Get all available property types
 */
export const getAvailablePropertyTypes = () => 
  Object.keys(PROPERTY_TYPE_STEPS);

/**
 * Check if property type is a building type (has building-specific steps)
 */
export const isBuildingType = (propertyType) => {
  const steps = PROPERTY_TYPE_STEPS[propertyType] || [];
  return steps.some(step => step.id === 'basic-configuration');
};

/**
 * Check if property type is a land type (has land-specific steps)
 */
export const isLandType = (propertyType) => {
  const steps = PROPERTY_TYPE_STEPS[propertyType] || [];
  return steps.some(step => step.id === 'land-attributes');
};

/**
 * Check if property type is a hybrid type (has both building and land steps)
 */
export const isHybridType = (propertyType) => {
  return isBuildingType(propertyType) && isLandType(propertyType);
};

// ============================================
// EXPORTS
// ============================================

export default {
  STEPS,
  PROPERTY_TYPE_STEPS,
  getVisibleSteps,
  getStepComponent,
  getTotalVisibleSteps,
  getStepName,
  isStepVisible,
  getStepIndexById,
  getAvailablePropertyTypes,
  isBuildingType,
  isLandType,
  isHybridType,
};
