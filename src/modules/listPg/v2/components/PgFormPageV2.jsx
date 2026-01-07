import { useNavigate, useParams } from 'react-router-dom';
import { PgFormProviderV2, usePgFormV2 } from '../context/PgFormContextV2';
import { getStepComponent } from '../config/stepConfigurationPg';
import { Button } from '@/components/ui/button';
import { X, Save } from 'lucide-react';
import PgFormSidebar from './PgFormSidebar';
import SaveAndContinueFooter from './steps/SaveAndContinueFooter';

function PgFormContentV2() {
  const navigate = useNavigate();
  const context = usePgFormV2();
  
  // Safety check for context
  if (!context) {
    console.error('PgFormContentV2 rendered outside of PgFormProviderV2');
    return null;
  }
  
  const { currentStep, resetForm, formDataWithType, isLoadingDraft, saveDraft, formData, saveAndContinue, previousStep, getTotalSteps, currentStepSubmitHandler, draftId } = context;

  const handleClose = () => {
    if (window.confirm('Are you sure you want to close? Your progress is saved as draft.')) {
      navigate('/list-pg-hostel');
    }
  };

  const handleSaveDraft = async () => {
    const result = await saveDraft();
    if (result.success) {
      alert('Draft saved successfully!');
    } else {
      alert('Failed to save draft. Please try again.');
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
    <div className="fixed inset-0 flex bg-gray-50 dark:bg-gray-950 z-10">
      {/* Sidebar */}
      <PgFormSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Top Header */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                New PG/Hostel Listing
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Fill in the details below. Changes are auto-saved.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800">
                <div className={`w-2 h-2 rounded-full ${draftId ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {draftId ? 'Draft Saved' : 'Not Saved'}
                </span>
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

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-orange-50/30 to-white dark:from-orange-950/10 dark:to-gray-950">
          <div className="max-w-5xl mx-auto px-6 py-8 pb-32">
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

        {/* Fixed Footer */}
        {!isLoadingDraft && (
          <div className="flex-shrink-0">
            <SaveAndContinueFooter
              onBack={previousStep}
              onSaveAndContinue={async () => {
                // If current step has registered a submit handler, use it
                if (currentStepSubmitHandler) {
                  await currentStepSubmitHandler();
                } else {
                  // No form in current step, just save and continue
                  await saveAndContinue({});
                }
              }}
              showBack={currentStep > 0}
              isLastStep={currentStep === getTotalSteps() - 1}
            />
          </div>
        )}
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
