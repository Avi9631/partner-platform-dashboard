import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ProjectFormProviderV2, useProjectFormV2 } from '../context/ProjectFormContextV2';
import ProjectTypeStepV2 from './steps/ProjectTypeStepV2';
// Import other steps as they are created
// import LocationSelectionStepV2 from './steps/LocationSelectionStepV2';
// import BasicDetailsStepV2 from './steps/BasicDetailsStepV2';
// ... etc

function ProjectFormContentV2({ open }) {
  const { currentStep, resetForm, projectType, onClose } = useProjectFormV2();

  const handleClose = () => {
    if (window.confirm('Are you sure you want to close? All progress will be lost.')) {
      resetForm();
      onClose(false);
    }
  };

  const renderStepContent = () => {
    // Step 0: Project Type Selection
    if (currentStep === 0) {
      return <ProjectTypeStepV2 />;
    }
    
    const isResidential = projectType && [
      'apartment_complex', 'villa_community', 'township', 
      'row_houses', 'plotted_development'
    ].includes(projectType);
    
    const isCommercial = projectType && [
      'office_complex', 'retail_mall', 'business_park', 'mixed_use'
    ].includes(projectType);
    
    // Common flow for both residential and commercial
    if (isResidential || isCommercial) {
      switch (currentStep) {
        case 1:
          // return <LocationSelectionStepV2 />;
          return <div className="p-8 text-center">Location Selection Step (Coming Soon)</div>;
        case 2:
          // return <GeoTagStepV2 />;
          return <div className="p-8 text-center">GeoTag Step (Coming Soon)</div>;
        case 3:
          // return <BasicDetailsStepV2 />;
          return <div className="p-8 text-center">Basic Details Step (Coming Soon)</div>;
        case 4:
          // return <ProjectSpecificationsStepV2 />;
          return <div className="p-8 text-center">Project Specifications Step (Coming Soon)</div>;
        case 5:
          // return <UnitConfigurationsStepV2 />;
          return <div className="p-8 text-center">Unit Configurations Step (Coming Soon)</div>;
        case 6:
          // return <PriceRangeStepV2 />;
          return <div className="p-8 text-center">Price Range Step (Coming Soon)</div>;
        case 7:
          // return <ApprovalsStepV2 />;
          return <div className="p-8 text-center">Approvals & RERA Step (Coming Soon)</div>;
        case 8:
          // return <ProjectStatusStepV2 />;
          return <div className="p-8 text-center">Project Status Step (Coming Soon)</div>;
        case 9:
          // return <ProjectDescriptionStepV2 />;
          return <div className="p-8 text-center">Project Description Step (Coming Soon)</div>;
        case 10:
          // return <AmenitiesStepV2 />;
          return <div className="p-8 text-center">Amenities Step (Coming Soon)</div>;
        case 11:
          // return <ReviewAndSubmitV2 />;
          return <div className="p-8 text-center">Review & Submit Step (Coming Soon)</div>;
        default:
          return <ProjectTypeStepV2 />;
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
            List Your Project
          </SheetTitle>
          {projectType && (
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

export default function ProjectFormSheetV2({ open, onOpenChange }) {
  return (
    <ProjectFormProviderV2 onClose={onOpenChange}>
      <ProjectFormContentV2 open={open} onOpenChange={onOpenChange} />
    </ProjectFormProviderV2>
  );
}
