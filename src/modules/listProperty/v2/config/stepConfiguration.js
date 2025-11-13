/**
 * Dynamic Step Configuration System
 * 
 * This configuration file defines all possible steps and their visibility conditions.
 * Steps can be shown/hidden based on:
 * - Property type
 * - Possession status
 * - Parking availability
 * - Any other form field value
 */

import PropertyTypeStepV2 from '../components/steps/PropertyTypeStepV2';
import LocationSelectionStepV2 from '../components/steps/LocationSelectionStepV2';
import GeoTagStepV2 from '../components/steps/GeoTagStepV2';
import BasicDetailsStepV2 from '../components/steps/BasicDetailsStepV2';
import BasicConfigurationStepV2 from '../components/steps/BasicConfigurationStepV2';
import AreaDetailsStepV2 from '../components/steps/AreaDetailsStepV2';
import FurnishingStepV2 from '../components/steps/FurnishingStepV2';
import ParkingStepV2 from '../components/steps/ParkingStepV2';
import LocationStepV2 from '../components/steps/LocationStepV2';
import FloorDetailsStepV2 from '../components/steps/FloorDetailsStepV2';
import LandAttributesStepV2 from '../components/steps/LandAttributesStepV2';
import PricingStepV2 from '../components/steps/PricingStepV2';
import SuitableForStepV2 from '../components/steps/SuitableForStepV2';
import ListingInfoStepV2 from '../components/steps/ListingInfoStepV2';
import AmenitiesStepV2 from '../components/steps/AmenitiesStepV2';
import ReviewAndSubmitV2 from '../components/steps/ReviewAndSubmitV2';

// Step categories for better organization
export const STEP_CATEGORIES = {
  CORE: 'core',
  BUILDING: 'building',
  LAND: 'land',
  OPTIONAL: 'optional',
};

// Property type groups
export const PROPERTY_GROUPS = {
  BUILDING: ['apartment', 'villa', 'duplex', 'independent_house', 'penthouse', 'studio', 'independent_floor'],
  LAND: ['plot', 'farmhouse', 'agricultural_land'],
  APARTMENT_LIKE: ['apartment', 'penthouse'],
};

/**
 * Step Configuration
 * 
 * Each step has:
 * - id: unique identifier
 * - name: display name
 * - component: React component to render
 * - category: step category
 * - isVisible: function that determines if step should be shown based on form data
 * - order: base order for sorting
 */

// ============================================================================
// CORE STEPS (Always visible for all property types)
// ============================================================================
const CORE_STEPS = [
  {
    id: 'property-type',
    name: 'Property Type',
    component: PropertyTypeStepV2,
    category: STEP_CATEGORIES.CORE,
    isVisible: () => true,
    order: 0,
  },
  {
    id: 'location-selection',
    name: 'Location Selection',
    component: LocationSelectionStepV2,
    category: STEP_CATEGORIES.CORE,
    isVisible: (formData) => !!formData.propertyType,
    order: 1,
  },
  {
    id: 'geo-tag',
    name: 'Geo Tag',
    component: GeoTagStepV2,
    category: STEP_CATEGORIES.CORE,
    isVisible: (formData) => !!formData.propertyType,
    order: 2,
  },
  {
    id: 'basic-details',
    name: 'Basic Details',
    component: BasicDetailsStepV2,
    category: STEP_CATEGORIES.CORE,
    isVisible: (formData) => !!formData.propertyType,
    order: 3,
  },
  {
    id: 'pricing',
    name: 'Pricing',
    component: PricingStepV2,
    category: STEP_CATEGORIES.CORE,
    isVisible: (formData) => !!formData.propertyType,
    order: 10,
  },
  {
    id: 'listing-info',
    name: 'Listing Info',
    component: ListingInfoStepV2,
    category: STEP_CATEGORIES.CORE,
    isVisible: (formData) => !!formData.propertyType,
    order: 12,
  },
  {
    id: 'amenities',
    name: 'Amenities',
    component: AmenitiesStepV2,
    category: STEP_CATEGORIES.CORE,
    isVisible: (formData) => !!formData.propertyType,
    order: 13,
  },
  {
    id: 'review-submit',
    name: 'Review & Submit',
    component: ReviewAndSubmitV2,
    category: STEP_CATEGORIES.CORE,
    isVisible: (formData) => !!formData.propertyType,
    order: 14,
  },
];

// ============================================================================
// BUILDING STEPS (Apartments, Villas, etc.)
// ============================================================================
const BUILDING_STEPS = [
  {
    id: 'basic-configuration',
    name: 'Basic Configuration',
    component: BasicConfigurationStepV2,
    category: STEP_CATEGORIES.BUILDING,
    isVisible: (formData) => PROPERTY_GROUPS.BUILDING.includes(formData.propertyType),
    order: 4,
  },
  {
    id: 'area-details',
    name: 'Area Details',
    component: AreaDetailsStepV2,
    category: STEP_CATEGORIES.BUILDING,
    isVisible: (formData) => PROPERTY_GROUPS.BUILDING.includes(formData.propertyType),
    order: 5,
  },
  {
    id: 'furnishing',
    name: 'Furnishing',
    component: FurnishingStepV2,
    category: STEP_CATEGORIES.BUILDING,
    isVisible: (formData) => PROPERTY_GROUPS.BUILDING.includes(formData.propertyType),
    order: 6,
  },
  {
    id: 'parking',
    name: 'Parking',
    component: ParkingStepV2,
    category: STEP_CATEGORIES.BUILDING,
    isVisible: (formData) => PROPERTY_GROUPS.BUILDING.includes(formData.propertyType),
    order: 7,
  },
  {
    id: 'location-attributes',
    name: 'Location Attributes',
    component: LocationStepV2,
    category: STEP_CATEGORIES.BUILDING,
    isVisible: (formData) => PROPERTY_GROUPS.BUILDING.includes(formData.propertyType),
    order: 8,
  },
  {
    id: 'floor-details',
    name: 'Floor Details',
    component: FloorDetailsStepV2,
    category: STEP_CATEGORIES.BUILDING,
    // Only for apartments and penthouses
    isVisible: (formData) => PROPERTY_GROUPS.APARTMENT_LIKE.includes(formData.propertyType),
    order: 9,
  },
  {
    id: 'suitable-for',
    name: 'Suitable For',
    component: SuitableForStepV2,
    category: STEP_CATEGORIES.BUILDING,
    // Only visible for rent/lease, hidden for sale
    isVisible: (formData) => PROPERTY_GROUPS.BUILDING.includes(formData.propertyType) && formData.listingType !== 'sale',
    order: 11,
  },
];

// ============================================================================
// LAND STEPS (Plots, Farmhouse, Agricultural Land)
// ============================================================================
const LAND_STEPS = [
  {
    id: 'land-attributes',
    name: 'Land Attributes',
    component: LandAttributesStepV2,
    category: STEP_CATEGORIES.LAND,
    isVisible: (formData) => PROPERTY_GROUPS.LAND.includes(formData.propertyType),
    order: 4,
  },
];

// ============================================================================
// OPTIONAL/CONDITIONAL STEPS
// ============================================================================
// Add conditional steps here based on specific field values
const OPTIONAL_STEPS = [
  // Example: Uncomment and implement as needed
  
  // {
  //   id: 'possession-date-details',
  //   name: 'Possession Date',
  //   component: PossessionDateDetailsStepV2,
  //   category: STEP_CATEGORIES.OPTIONAL,
  //   isVisible: (formData) => formData.possessionStatus === 'under_construction',
  //   order: 3.5,
  // },
  
  // {
  //   id: 'poa-documents',
  //   name: 'POA Documents',
  //   component: POADocumentsStepV2,
  //   category: STEP_CATEGORIES.OPTIONAL,
  //   isVisible: (formData) => formData.ownershipType === 'poa',
  //   order: 3.6,
  // },
  
  // {
  //   id: 'ev-charging-details',
  //   name: 'EV Charging Details',
  //   component: EVChargingDetailsStepV2,
  //   category: STEP_CATEGORIES.OPTIONAL,
  //   isVisible: (formData) => formData.evChargingType && formData.evChargingType !== 'none',
  //   order: 7.5,
  // },
];

// ============================================================================
// COMBINED STEP CONFIGURATION
// ============================================================================
export const STEP_CONFIG = [
  ...CORE_STEPS,
  ...BUILDING_STEPS,
  ...LAND_STEPS,
  ...OPTIONAL_STEPS,
];

/**
 * Get visible steps based on current form data
 * @param {Object} formData - Current form data including propertyType and other fields
 * @returns {Array} Array of visible step configurations
 */
export const getVisibleSteps = (formData = {}) => {
  return STEP_CONFIG
    .filter(step => step.isVisible(formData))
    .sort((a, b) => a.order - b.order);
};

/**
 * Get step component by index in visible steps
 * @param {number} stepIndex - Current step index
 * @param {Object} formData - Current form data
 * @returns {React.Component} Step component or null
 */
export const getStepComponent = (stepIndex, formData = {}) => {
  const visibleSteps = getVisibleSteps(formData);
  const step = visibleSteps[stepIndex];
  return step ? step.component : null;
};

/**
 * Get total number of visible steps
 * @param {Object} formData - Current form data
 * @returns {number} Total visible steps
 */
export const getTotalVisibleSteps = (formData = {}) => {
  return getVisibleSteps(formData).length;
};

/**
 * Get step name by index
 * @param {number} stepIndex - Current step index
 * @param {Object} formData - Current form data
 * @returns {string} Step name
 */
export const getStepName = (stepIndex, formData = {}) => {
  const visibleSteps = getVisibleSteps(formData);
  const step = visibleSteps[stepIndex];
  return step ? step.name : '';
};

/**
 * Check if a specific step ID is currently visible
 * @param {string} stepId - Step ID to check
 * @param {Object} formData - Current form data
 * @returns {boolean} Whether step is visible
 */
export const isStepVisible = (stepId, formData = {}) => {
  const step = STEP_CONFIG.find(s => s.id === stepId);
  return step ? step.isVisible(formData) : false;
};

/**
 * Get step index by step ID (within visible steps)
 * @param {string} stepId - Step ID
 * @param {Object} formData - Current form data
 * @returns {number} Step index or -1 if not found
 */
export const getStepIndexById = (stepId, formData = {}) => {
  const visibleSteps = getVisibleSteps(formData);
  return visibleSteps.findIndex(step => step.id === stepId);
};

export default {
  STEP_CONFIG,
  STEP_CATEGORIES,
  PROPERTY_GROUPS,
  getVisibleSteps,
  getStepComponent,
  getTotalVisibleSteps,
  getStepName,
  isStepVisible,
  getStepIndexById,
};
