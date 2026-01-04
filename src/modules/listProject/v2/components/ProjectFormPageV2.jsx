import { useNavigate, useParams } from 'react-router-dom';
import { ProjectFormProviderV2, useProjectFormV2 } from '../context/ProjectFormContextV2';
import { getStepComponent } from '../config/stepConfigurationProject';
import { Button } from '@/components/ui/button';
import { X, Save } from 'lucide-react';
import ProjectFormSidebar from './ProjectFormSidebar';
import SaveAndContinueFooter from './steps/SaveAndContinueFooter';

function ProjectFormContentV2() {
  const navigate = useNavigate();
  const context = useProjectFormV2();
  
  // Safety check for context
  if (!context) {
    console.error('ProjectFormContentV2 rendered outside of ProjectFormProviderV2');
    return null;
  }
  
  const { currentStep, resetForm, formDataWithType, isLoadingDraft, saveDraft, saveAndContinue, goToPreviousStep, getTotalSteps, currentStepSubmitHandler } = context;

  const handleClose = () => {
    if (window.confirm('Are you sure you want to close? Your progress is saved as draft.')) {
      navigate('/list-project');
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
    <div className="fixed inset-0 flex bg-gray-50 dark:bg-gray-950">
      {/* Sidebar - Hidden on mobile/tablet */}
      <div className="hidden lg:block">
        <ProjectFormSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Top Header */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                New Project Listing
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 hidden sm:block">
                Fill in the details below. Changes are auto-saved.
              </p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                className="gap-1.5 sm:gap-2 text-xs sm:text-sm"
              >
                <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Save Draft</span>
                <span className="sm:hidden">Save</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 h-8 w-8 sm:h-9 sm:w-9"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-orange-50/30 to-white dark:from-orange-950/10 dark:to-gray-950">
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 pb-28 sm:pb-32">
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
          <div className="fixed bottom-0 right-0 left-0 lg:left-80 z-10">
            <SaveAndContinueFooter
              onBack={goToPreviousStep}
              onSaveAndContinue={currentStepSubmitHandler || saveAndContinue}
              showBack={currentStep > 0}
              isLastStep={currentStep === getTotalSteps() - 1}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectFormPageV2() {
  const { draftId } = useParams();
  
  return (
    <ProjectFormProviderV2 
      initialDraftId={draftId}
      onClose={() => {}}
    >
      <ProjectFormContentV2 />
    </ProjectFormProviderV2>
  );
}
