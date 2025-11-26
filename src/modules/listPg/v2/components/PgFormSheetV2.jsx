import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { PgFormProviderV2, usePgFormV2 } from '../context/PgFormContextV2';
import { getStepComponent } from '../config/stepConfigurationPg';

function PgFormContentV2({ open, onOpenChange }) {
  const context = usePgFormV2();
  
  // Safety check for context
  if (!context) {
    console.error('PgFormContentV2 rendered outside of PgFormProviderV2');
    return null;
  }
  
  const { currentStep, resetForm, propertyType, onClose, formDataWithType } = context;

  const handleClose = () => {
    if (window.confirm('Are you sure you want to close? All progress will be lost.')) {
      resetForm();
      if (onClose) onClose(false);
      if (onOpenChange) onOpenChange(false);
    }
  };

  const renderStepContent = () => {
    // Get the step component dynamically based on current step and form data
    const StepComponent = getStepComponent(currentStep, formDataWithType);
    
    if (!StepComponent) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Step not found</p>
        </div>
      );
    }
    
    return <StepComponent />;
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
            List Your PG/Hostel
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

export default function PgFormSheetV2({ open, onOpenChange, initialDraftId, editingDraft }) {
  // Don't render provider if not open
  if (!open) {
    return null;
  }
  
  return (
    <PgFormProviderV2 
      onClose={onOpenChange} 
      initialDraftId={initialDraftId}
      editingDraft={editingDraft}
    >
      <PgFormContentV2 open={open} onOpenChange={onOpenChange} />
    </PgFormProviderV2>
  );
}
