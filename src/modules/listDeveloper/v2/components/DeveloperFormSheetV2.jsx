import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { DeveloperFormProviderV2, useDeveloperFormV2 } from '../context/DeveloperFormContextV2';
import DeveloperTypeStepV2 from './steps/DeveloperTypeStepV2';
import BasicInformationStepV2 from './steps/BasicInformationStepV2';
import BusinessDetailsStepV2 from './steps/BusinessDetailsStepV2';
import ContactAddressStepV2 from './steps/ContactAddressStepV2';
import ProjectsPortfolioStepV2 from './steps/ProjectsPortfolioStepV2';
import DocumentsUploadStepV2 from './steps/DocumentsUploadStepV2';
import ReviewAndSubmitV2 from './steps/ReviewAndSubmitV2';

function DeveloperFormContentV2({ open }) {
  const { currentStep, resetForm, developerType, onClose } = useDeveloperFormV2();

  const handleClose = () => {
    if (window.confirm('Are you sure you want to close? All progress will be lost.')) {
      resetForm();
      onClose(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return <DeveloperTypeStepV2 />;
      case 1: return <BasicInformationStepV2 />;
      case 2: return <BusinessDetailsStepV2 />;
      case 3: return <ContactAddressStepV2 />;
      case 4: return <ProjectsPortfolioStepV2 />;
      case 5: return <DocumentsUploadStepV2 />;
      case 6: return <ReviewAndSubmitV2 />;
      default: return <DeveloperTypeStepV2 />;
    }
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
            Register as Developer
          </SheetTitle>
          {developerType && (
            <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
              Complete each section to register your developer profile
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

export default function DeveloperFormSheetV2({ open, onOpenChange }) {
  return (
    <DeveloperFormProviderV2 onClose={onOpenChange}>
      <DeveloperFormContentV2 open={open} onOpenChange={onOpenChange} />
    </DeveloperFormProviderV2>
  );
}
