/**
 * ListProperty V2 - Sidebar Navigation Design
 * 
 * This is the revamped version of the property listing form with:
 * - Sidebar navigation showing all steps at once
 * - Direct navigation to any step (no locking)
 * - Visual progress tracking with completion indicators
 * - Auto-save functionality (debounced)
 * - Cleaner form layout without bottom footers
 * - Responsive design with modern UI
 * 
 * Key Changes from Previous Version:
 * - Replaced "Save & Continue" bottom footer with sidebar navigation
 * - Added PropertyFormSidebar component for step navigation
 * - Added StepFormWrapper for consistent step layouts
 * - Removed SaveAndContinueFooter dependency
 * - Enhanced auto-save capabilities
 * 
 * Usage:
 * import { PropertyFormSheetV2, PropertyFormPageV2 } from '@/modules/listProperty/v2';
 * 
 * // Sheet variant (overlay)
 * <PropertyFormSheetV2 open={isOpen} onOpenChange={setIsOpen} />
 * 
 * // Page variant (full page with sidebar)
 * <PropertyFormPageV2 />
 * 
 * For migration guide, see: SIDEBAR_REVAMP_GUIDE.md
 */

// Main form components
export { default as PropertyFormSheetV2 } from './components/PropertyFormSheetV2';
export { default as PropertyFormPageV2 } from './components/PropertyFormPageV2';

// New sidebar navigation components
export { default as PropertyFormSidebar } from './components/PropertyFormSidebar';
export { default as StepFormWrapper } from './components/StepFormWrapper';
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
