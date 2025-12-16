import { useNavigate, useParams } from 'react-router-dom';
import { PgFormProviderV2, usePgFormV2 } from '../context/PgFormContextV2';
import { getStepComponent } from '../config/stepConfigurationPg';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';

function PgFormContentV2() {
  const navigate = useNavigate();
  const context = usePgFormV2();
  
  // Safety check for context
  if (!context) {
    console.error('PgFormContentV2 rendered outside of PgFormProviderV2');
    return null;
  }
  
  const { currentStep, resetForm, propertyType, formDataWithType, isLoadingDraft } = context;

  const handleClose = () => {
    if (window.confirm('Are you sure you want to close? All progress will be lost.')) {
      resetForm();
      navigate('/list-pg-hostel');
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-orange-50/30 to-white dark:from-orange-950/10 dark:to-background">
      {/* Header */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
              {/* <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="hover:bg-orange-50 dark:hover:bg-orange-900/20"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button> */}
              <div>
                <h1 className="text-xl  font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  List Your PG/Hostel
                </h1>
           
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full px-4 py-4 md:px-6 md:py-6 pb-20 md:pb-32 bg-gradient-to-br from-orange-50/30 to-white dark:from-orange-950/10 dark:to-background">
            {isLoadingDraft ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading draft data...</p>
                </div>
              </div>
            ) : (
              renderStepContent()
            )}
          </div>
        </div>
    </div>
  );
}

export default function PgFormPageV2() {
  const { draftId } = useParams();
  
  return (
    <PgFormProviderV2 
      initialDraftId={draftId}
      onClose={() => {}}
    >
      <PgFormContentV2 />
    </PgFormProviderV2>
  );
}
