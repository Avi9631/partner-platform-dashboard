import { createContext, useContext, useState, useCallback } from 'react';
import { useForm, FormProvider as RHFFormProvider } from 'react-hook-form';

const DeveloperFormContextV2 = createContext(null);

export const useDeveloperFormV2 = () => {
  const context = useContext(DeveloperFormContextV2);
  if (!context) {
    throw new Error('useDeveloperFormV2 must be used within DeveloperFormProviderV2');
  }
  return context;
};

export const DeveloperFormProviderV2 = ({ children, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [developerType, setDeveloperType] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  // Store saved form data from all steps as JSON (empty initially, populated on save)
  const [formData, setFormData] = useState({});
  
  // Initialize React Hook Form (not used for step forms, kept for compatibility)
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
  });

  // Get total steps based on developer type
  const getTotalSteps = useCallback(() => {
    if (!developerType) return 1;
    
    // Steps for all developer types:
    // 0: DeveloperType
    // 1: BasicInformation
    // 2: BusinessDetails
    // 3: ContactAddress
    // 4: ProjectsPortfolio
    // 5: DocumentsUpload
    // 6: ReviewAndSubmit
    return 7;
  }, [developerType]);

  // Update form data in context (called when save & continue is clicked)
  const updateFormData = useCallback((stepData) => {
    setFormData(prev => ({
      ...prev,
      ...stepData,
    }));
  }, []);

  // Navigate to next step with "Save & Continue"
  const saveAndContinue = useCallback((stepData) => {
    // Update form data in context
    if (stepData) {
      updateFormData(stepData);
    }
    
    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    
    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, getTotalSteps, updateFormData]);

  // Navigate to previous step
  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Jump to a specific step (for review page editing)
  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({});
    methods.reset({});
    setCurrentStep(0);
    setDeveloperType(null);
    setCompletedSteps(new Set());
  }, [methods]);

  // Check if a step is completed
  const isStepCompleted = useCallback((step) => {
    return completedSteps.has(step);
  }, [completedSteps]);

  // Get step progress percentage
  const getProgress = useCallback(() => {
    const totalSteps = getTotalSteps();
    if (totalSteps <= 1) return 0;
    return Math.round((currentStep / (totalSteps - 1)) * 100);
  }, [currentStep, getTotalSteps]);

  const value = {
    currentStep,
    setCurrentStep,
    saveAndContinue,
    previousStep,
    goToStep,
    resetForm,
    getTotalSteps,
    developerType,
    setDeveloperType,
    completedSteps,
    isStepCompleted,
    getProgress,
    onClose,
    formData, // JSON object updated only on save & continue
    updateFormData, // Method to update form data
  };

  return (
    <DeveloperFormContextV2.Provider value={value}>
      <RHFFormProvider {...methods}>{children}</RHFFormProvider>
    </DeveloperFormContextV2.Provider>
  );
};
