import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { PropertyFormProviderV2, usePropertyFormV2 } from '../context/PropertyFormContextV2';
import PropertyTypeStepV2 from './steps/PropertyTypeStepV2';
import BasicDetailsStepV2 from './steps/BasicDetailsStepV2';
import BasicConfigurationStepV2 from './steps/BasicConfigurationStepV2';
import AreaDetailsStepV2 from './steps/AreaDetailsStepV2';
import FurnishingStepV2 from './steps/FurnishingStepV2';
import ParkingStepV2 from './steps/ParkingStepV2';
import LocationStepV2 from './steps/LocationStepV2';
import FloorDetailsStepV2 from './steps/FloorDetailsStepV2';
import LandAttributesStepV2 from './steps/LandAttributesStepV2';
import PricingStepV2 from './steps/PricingStepV2';
import SuitableForStepV2 from './steps/SuitableForStepV2';
import ListingInfoStepV2 from './steps/ListingInfoStepV2';
import AmenitiesStepV2 from './steps/AmenitiesStepV2';
import ReviewAndSubmitV2 from './steps/ReviewAndSubmitV2';

function PropertyFormContentV2({ open }) {
  const { currentStep, resetForm, propertyType, onClose } = usePropertyFormV2();

  const handleClose = () => {
    if (window.confirm('Are you sure you want to close? All progress will be lost.')) {
      resetForm();
      onClose(false);
    }
  };

  const renderStepContent = () => {
    // Step 0: Property Type Selection
    if (currentStep === 0) {
      return <PropertyTypeStepV2 />;
    }
    
    const isBuildingType = propertyType && [
      'apartment', 'villa', 'duplex', 'independent_house', 
      'penthouse', 'studio', 'independent_floor'
    ].includes(propertyType);
    
    const isLandType = propertyType && [
      'plot', 'farmhouse', 'agricultural_land'
    ].includes(propertyType);
    
    const isApartmentOrPenthouse = ['apartment', 'penthouse'].includes(propertyType);
    
    // Building type flow
    if (isBuildingType) {
      if (isApartmentOrPenthouse) {
        switch (currentStep) {
          case 1: return <BasicDetailsStepV2 />;
          case 2: return <BasicConfigurationStepV2 />;
          case 3: return <AreaDetailsStepV2 />;
          case 4: return <FurnishingStepV2 />;
          case 5: return <ParkingStepV2 />;
          case 6: return <LocationStepV2 />;
          case 7: return <FloorDetailsStepV2 />;
          case 8: return <PricingStepV2 />;
          case 9: return <SuitableForStepV2 />;
          case 10: return <ListingInfoStepV2 />;
          case 11: return <AmenitiesStepV2 />;
          case 12: return <ReviewAndSubmitV2 />;
          default: return <BasicDetailsStepV2 />;
        }
      } else {
        // Other building types (no floor details)
        switch (currentStep) {
          case 1: return <BasicDetailsStepV2 />;
          case 2: return <BasicConfigurationStepV2 />;
          case 3: return <AreaDetailsStepV2 />;
          case 4: return <FurnishingStepV2 />;
          case 5: return <ParkingStepV2 />;
          case 6: return <LocationStepV2 />;
          case 7: return <PricingStepV2 />;
          case 8: return <SuitableForStepV2 />;
          case 9: return <ListingInfoStepV2 />;
          case 10: return <AmenitiesStepV2 />;
          case 11: return <ReviewAndSubmitV2 />;
          default: return <BasicDetailsStepV2 />;
        }
      }
    }
    
    // Land type flow
    if (isLandType) {
      switch (currentStep) {
        case 1: return <BasicDetailsStepV2 />;
        case 2: return <LandAttributesStepV2 />;
        case 3: return <PricingStepV2 />;
        case 4: return <ListingInfoStepV2 />;
        case 5: return <AmenitiesStepV2 />;
        case 6: return <ReviewAndSubmitV2 />;
        default: return <BasicDetailsStepV2 />;
      }
    }
    
    return null;
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-full p-0 overflow-hidden flex flex-col"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <SheetHeader className="px-4 py-3 md:px-6 md:py-3 mb-0 border-b bg-gradient-to-r from-orange-50 to-white dark:from-orange-950/20 dark:to-background flex-shrink-0">
          <SheetTitle className="text-lg md:text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent line-clamp-1">
            List Your Property
          </SheetTitle>
          {propertyType && (
            <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
              Complete each section and click &quot;Continue&quot; to progress
            </p>
          )}
        </SheetHeader>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full px-4 py-4 md:px-6 md:py-6 pb-20 md:pb-24 bg-gradient-to-br from-orange-50/30 to-white dark:from-orange-950/10 dark:to-background">
            {renderStepContent()}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function PropertyFormSheetV2({ open, onOpenChange }) {
  return (
    <PropertyFormProviderV2 onClose={onOpenChange}>
      <PropertyFormContentV2 open={open} onOpenChange={onOpenChange} />
    </PropertyFormProviderV2>
  );
}
