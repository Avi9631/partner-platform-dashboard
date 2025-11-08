import { X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PropertyFormProvider, usePropertyForm } from '../context/PropertyFormContext';
import PropertyFormSidebar from './PropertyFormSidebar';
import PropertyTypeSelector from './PropertyTypeSelector';
import BasicDetails from './BasicDetails';
import LandAttributes from './LandAttributes';
import ReviewAndSubmit from './ReviewAndSubmit';
import BasicConfiguration from './BasicConfiguration';
import AreaDetails from './AreaDetails';
import FurnishingAmenities from './FurnishingAmenities';
import ParkingUtilities from './ParkingUtilities';
import LocationAttributes from './LocationAttributes';
import FloorDetails from './FloorDetails';
import PricingInfoStep from './PricingInfoStep';
import SuitableForStep from './SuitableForStep';
import ListingInfoStep from './ListingInfoStep';
import AmenitiesStep from './AmenitiesStep';

function PropertyFormContent({ open }) {
  const { currentStep, resetForm, propertyType, onClose } = usePropertyForm();

  const handleClose = () => {
    if (window.confirm('Are you sure you want to close? All progress will be lost.')) {
      resetForm();
      onClose(false);
    }
  };

  const renderStepContent = () => {
    // Step 0: Property Type Selection
    if (currentStep === 0) {
      return <PropertyTypeSelector />;
    }
    
    const isBuildingType = propertyType && [
      'apartment', 'villa', 'duplex', 'independent_house', 
      'penthouse', 'studio', 'independent_floor'
    ].includes(propertyType);
    
    const isLandType = propertyType && [
      'plot', 'farmhouse', 'agricultural_land'
    ].includes(propertyType);
    
    const isApartmentOrPenthouse = ['apartment', 'penthouse'].includes(propertyType);
    
    // Building type flow: 1-BasicDetails, 2-BasicConfig, 3-AreaDetails, 
    // 4-Furnishing, 5-Parking, 6-Location, 7-FloorDetails(if apt/penthouse), 
    // 8/9-PricingInfo, 9/10-SuitableFor, 10/11-ListingInfo, 11/12-Amenities, 12/13-Review
    if (isBuildingType) {
      if (isApartmentOrPenthouse) {
        switch (currentStep) {
          case 1: return <BasicDetails />;
          case 2: return <BasicConfiguration />;
          case 3: return <AreaDetails />;
          case 4: return <FurnishingAmenities />;
          case 5: return <ParkingUtilities />;
          case 6: return <LocationAttributes />;
          case 7: return <FloorDetails />;
          case 8: return <PricingInfoStep />;
          case 9: return <SuitableForStep />;
          case 10: return <ListingInfoStep />;
          case 11: return <AmenitiesStep />;
          case 12: return <ReviewAndSubmit />;
          default: return <BasicDetails />;
        }
      } else {
        // Other building types (no floor details)
        switch (currentStep) {
          case 1: return <BasicDetails />;
          case 2: return <BasicConfiguration />;
          case 3: return <AreaDetails />;
          case 4: return <FurnishingAmenities />;
          case 5: return <ParkingUtilities />;
          case 6: return <LocationAttributes />;
          case 7: return <PricingInfoStep />;
          case 8: return <SuitableForStep />;
          case 9: return <ListingInfoStep />;
          case 10: return <AmenitiesStep />;
          case 11: return <ReviewAndSubmit />;
          default: return <BasicDetails />;
        }
      }
    }
    
    // Land type flow: 1-BasicDetails, 2-LandAttributes, 3-PricingInfo, 4-ListingInfo, 5-Amenities, 6-Review
    if (isLandType) {
      switch (currentStep) {
        case 1: return <BasicDetails />;
        case 2: return <LandAttributes />;
        case 3: return <PricingInfoStep />;
        case 4: return <ListingInfoStep />;
        case 5: return <AmenitiesStep />;
        case 6: return <ReviewAndSubmit />;
        default: return <BasicDetails />;
      }
    }
    
    // Default (no content if no property type)
    return null;
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-full p-0 overflow-hidden flex flex-col "
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <SheetHeader className="px-6 py-4 mb-0 border-b ">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold  text-black bg-clip-text">
              List Your Property
            </SheetTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              className="hover:bg-orange-100 dark:hover:bg-orange-900/30"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          {propertyType && (
            <p className="text-sm text-muted-foreground">
              Complete all sections to publish your listing
            </p>
          )}
        </SheetHeader>

        <div className="flex flex-1 overflow-hidden ">
          {/* Sidebar Navigation - Always visible */}
          <PropertyFormSidebar />

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto ">
            <div className="min-h-full p-8 pb-24 bg-orange-50">
              {renderStepContent()}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function PropertyFormSheet({ open, onOpenChange }) {
  return (
    <PropertyFormProvider onClose={onOpenChange}>
      <PropertyFormContent open={open} onOpenChange={onOpenChange} />
    </PropertyFormProvider>
  );
}
