/**
 * Step Configuration
 * Organized by property type with specific step flows
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

// Common steps for all property types
const COMMON_STEPS = [
  {
    id: 'property-type',
    name: 'Property Type',
    component: PropertyTypeStepV2,
  },
  {
    id: 'location-selection',
    name: 'Location Selection',
    component: LocationSelectionStepV2,
  },
  {
    id: 'basic-details',
    name: 'Basic Details',
    component: BasicDetailsStepV2,
  },
];

// Steps specific to building types (apartment, villa, etc.)
const BUILDING_STEPS = [
  {
    id: 'basic-configuration',
    name: 'Basic Configuration',
    component: BasicConfigurationStepV2,
  },
  {
    id: 'unit-amenities',
    name: 'Unit Amenities',
    component: UnitAmenitiesStepV2,
  },
  {
    id: 'location-attributes',
    name: 'Location Attributes',
    component: LocationStepV2,
  },
];

// Steps specific to apartments/penthouses
const APARTMENT_STEPS = [
  {
    id: 'floor-details',
    name: 'Floor Details',
    component: FloorDetailsStepV2,
  },
];

// Steps specific to land types
const LAND_STEPS = [
  {
    id: 'land-attributes',
    name: 'Land Attributes',
    component: LandAttributesStepV2,
  },
];

// Final steps for all property types
const FINAL_STEPS = [
  {
    id: 'pricing',
    name: 'Pricing',
    component: PricingStepV2,
  }, 
  {
    id: 'listing-info',
    name: 'Listing Info',
    component: ListingInfoStepV2,
  },
  {
    id: 'property-amenities',
    name: 'Property Amenities',
    component: PropertyAmenitiesStepV2,
  },
  {
    id: 'media-upload',
    name: 'Media & Documents',
    component: MediaUploadStepV2,
  },
];

// Property type categories
const BUILDING_TYPES = ['apartment', 'villa', 'duplex', 'independent_house', 'penthouse', 'studio', 'independent_floor'];
const LAND_TYPES = ['plot', 'farmhouse', 'agricultural_land'];
const APARTMENT_TYPES = ['apartment', 'penthouse'];

/**
 * Get steps based on property type
 */
export const getVisibleSteps = (formData = {}) => {
  const { propertyType, listingType } = formData;
  
  if (!propertyType) {
    return COMMON_STEPS;
  }
  
  let steps = [...COMMON_STEPS];
  
  // Add building-specific steps
  if (BUILDING_TYPES.includes(propertyType)) {
    steps = [...steps, ...BUILDING_STEPS];
    
    // Add apartment-specific steps
    if (APARTMENT_TYPES.includes(propertyType)) {
      steps = [...steps, ...APARTMENT_STEPS];
    }
  }
  
  // Add land-specific steps
  if (LAND_TYPES.includes(propertyType)) {
    steps = [...steps, ...LAND_STEPS];
  }
  
  // Add final steps with conditional filtering
  const finalSteps = FINAL_STEPS.filter(step => {
    if (step.condition) {
      return step.condition(formData);
    }
    return true;
  });
  
  steps = [...steps, ...finalSteps];
  
  return steps;
};

// Full configuration array (for reference)
export const STEP_CONFIG = [
  ...COMMON_STEPS,
  ...BUILDING_STEPS,
  ...APARTMENT_STEPS,
  ...LAND_STEPS,
  ...FINAL_STEPS,
];

// Helper functions
export const getStepComponent = (stepIndex, formData = {}) => 
  getVisibleSteps(formData)[stepIndex]?.component || null;

export const getTotalVisibleSteps = (formData = {}) => 
  getVisibleSteps(formData).length;

export const getStepName = (stepIndex, formData = {}) => 
  getVisibleSteps(formData)[stepIndex]?.name || '';

export const isStepVisible = (stepId, formData = {}) => 
  getVisibleSteps(formData).some(step => step.id === stepId);

export const getStepIndexById = (stepId, formData = {}) => 
  getVisibleSteps(formData).findIndex(step => step.id === stepId);

export default {
  STEP_CONFIG,
  getVisibleSteps,
  getStepComponent,
  getTotalVisibleSteps,
  getStepName,
  isStepVisible,
  getStepIndexById,
};
