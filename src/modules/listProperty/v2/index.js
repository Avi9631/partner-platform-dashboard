/**
 * ListProperty V2 - Multi-Step Form with Save & Continue
 * 
 * This is the enhanced version of the property listing form with:
 * - Multi-step navigation with "Save & Continue" buttons
 * - Progressive step completion tracking
 * - Enhanced sidebar with locked/unlocked steps
 * - Comprehensive review page with collapsible cards
 * - Ability to edit any completed section from the review page
 * - Consolidated step components (no separate form components)
 * - Draft loading support (URL-based or prop-based)
 * - Full-page and sheet overlay variants
 * 
 * Usage:
 * import { PropertyFormSheetV2, PropertyFormPageV2 } from '@/modules/listProperty/v2';
 * 
 * // Sheet variant
 * <PropertyFormSheetV2 open={isOpen} onOpenChange={setIsOpen} />
 * 
 * // Page variant
 * <PropertyFormPageV2 />
 */

// Main form components
export { default as PropertyFormSheetV2 } from './components/PropertyFormSheetV2';
export { default as PropertyFormPageV2 } from './components/PropertyFormPageV2';

// Context and hooks
export { PropertyFormProviderV2, usePropertyFormV2 } from './context/PropertyFormContextV2';

// Step components - Each step now contains both UI and form logic (consolidated)
export { default as PropertyTypeStepV2 } from './components/steps/PropertyTypeStepV2';
export { default as LocationSelectionStepV2 } from './components/steps/LocationSelectionStepV2';
export { default as GeoTagStepV2 } from './components/steps/GeoTagStepV2';
export { default as BasicDetailsStepV2 } from './components/steps/BasicDetailsStepV2';
export { default as BasicConfigurationStepV2 } from './components/steps/BasicConfigurationStepV2';
export { default as AreaDetailsStepV2 } from './components/steps/AreaDetailsStepV2';
export { default as FurnishingStepV2 } from './components/steps/FurnishingStepV2';
export { default as ParkingStepV2 } from './components/steps/ParkingStepV2';
export { default as LocationStepV2 } from './components/steps/LocationStepV2';
export { default as FloorDetailsStepV2 } from './components/steps/FloorDetailsStepV2';
export { default as LandAttributesStepV2 } from './components/steps/LandAttributesStepV2';
export { default as PricingStepV2 } from './components/steps/PricingStepV2';
export { default as SuitableForStepV2 } from './components/steps/SuitableForStepV2';
export { default as ListingInfoStepV2 } from './components/steps/ListingInfoStepV2';
export { default as AmenitiesStepV2 } from './components/steps/AmenitiesStepV2';
export { default as ReviewAndSubmitV2 } from './components/steps/ReviewAndSubmitV2';
