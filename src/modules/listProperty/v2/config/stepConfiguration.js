/**
 * Simplified Step Configuration
 * Dynamic step visibility based on property type and form data
 */

import PropertyTypeStepV2 from '../components/steps/PropertyTypeStepV2';
import LocationSelectionStepV2 from '../components/steps/LocationSelectionStepV2';
import BasicDetailsStepV2 from '../components/steps/BasicDetailsStepV2';
import BasicConfigurationStepV2 from '../components/steps/BasicConfigurationStepV2';
import FurnishingStepV2 from '../components/steps/FurnishingStepV2';
import LocationStepV2 from '../components/steps/LocationStepV2';
import FloorDetailsStepV2 from '../components/steps/FloorDetailsStepV2';
import LandAttributesStepV2 from '../components/steps/LandAttributesStepV2';
import PricingStepV2 from '../components/steps/PricingStepV2';
import SuitableForStepV2 from '../components/steps/SuitableForStepV2';
import ListingInfoStepV2 from '../components/steps/ListingInfoStepV2';
import AmenitiesStepV2 from '../components/steps/AmenitiesStepV2';
import MediaUploadStepV2 from '../components/steps/MediaUploadStepV2';
import PropertyPlanUploadStepV2 from '../components/steps/PropertyPlanUploadStepV2';
import DocumentUploadStepV2 from '../components/steps/DocumentUploadStepV2';

// Property type groups for easier checks
const BUILDING_TYPES = ['apartment', 'villa', 'duplex', 'independent_house', 'penthouse', 'studio', 'independent_floor'];
const LAND_TYPES = ['plot', 'farmhouse', 'agricultural_land'];
const APARTMENT_TYPES = ['apartment', 'penthouse'];

const isBuilding = (type) => BUILDING_TYPES.includes(type);
const isLand = (type) => LAND_TYPES.includes(type);
const isApartment = (type) => APARTMENT_TYPES.includes(type);

// Simplified step configuration - flat array with visibility functions
export const STEP_CONFIG = [
  {
    id: 'property-type',
    name: 'Property Type',
    component: PropertyTypeStepV2,
    isVisible: () => true,
  },
  {
    id: 'location-selection',
    name: 'Location Selection',
    component: LocationSelectionStepV2,
    isVisible: (data) => !!data.propertyType,
  },
  {
    id: 'basic-details',
    name: 'Basic Details',
    component: BasicDetailsStepV2,
    isVisible: (data) => !!data.propertyType,
  },
  {
    id: 'basic-configuration',
    name: 'Basic Configuration',
    component: BasicConfigurationStepV2,
    isVisible: (data) => isBuilding(data.propertyType),
  },
  {
    id: 'land-attributes',
    name: 'Land Attributes',
    component: LandAttributesStepV2,
    isVisible: (data) => isLand(data.propertyType),
  },
  {
    id: 'furnishing',
    name: 'Furnishing',
    component: FurnishingStepV2,
    isVisible: (data) => isBuilding(data.propertyType),
  },
  {
    id: 'location-attributes',
    name: 'Location Attributes',
    component: LocationStepV2,
    isVisible: (data) => isBuilding(data.propertyType),
  },
  {
    id: 'floor-details',
    name: 'Floor Details',
    component: FloorDetailsStepV2,
    isVisible: (data) => isApartment(data.propertyType),
  },
  {
    id: 'pricing',
    name: 'Pricing',
    component: PricingStepV2,
    isVisible: (data) => !!data.propertyType,
  },
  {
    id: 'suitable-for',
    name: 'Suitable For',
    component: SuitableForStepV2,
    isVisible: (data) => isBuilding(data.propertyType) && data.listingType !== 'sale',
  },
  {
    id: 'listing-info',
    name: 'Listing Info',
    component: ListingInfoStepV2,
    isVisible: (data) => !!data.propertyType,
  },
  {
    id: 'amenities',
    name: 'Amenities',
    component: AmenitiesStepV2,
    isVisible: (data) => !!data.propertyType,
  },
  {
    id: 'media-upload',
    name: 'Media Upload',
    component: MediaUploadStepV2,
    isVisible: (data) => !!data.propertyType,
  },
  {
    id: 'property-plan-upload',
    name: 'Property Plans',
    component: PropertyPlanUploadStepV2,
    isVisible: (data) => !!data.propertyType,
  },
  {
    id: 'document-upload',
    name: 'Document Upload',
    component: DocumentUploadStepV2,
    isVisible: (data) => !!data.propertyType,
  },
];

// Helper functions
export const getVisibleSteps = (formData = {}) => 
  STEP_CONFIG.filter(step => step.isVisible(formData));

export const getStepComponent = (stepIndex, formData = {}) => 
  getVisibleSteps(formData)[stepIndex]?.component || null;

export const getTotalVisibleSteps = (formData = {}) => 
  getVisibleSteps(formData).length;

export const getStepName = (stepIndex, formData = {}) => 
  getVisibleSteps(formData)[stepIndex]?.name || '';

export const isStepVisible = (stepId, formData = {}) => 
  STEP_CONFIG.find(s => s.id === stepId)?.isVisible(formData) || false;

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
