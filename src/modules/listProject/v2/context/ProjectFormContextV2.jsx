import { createContext, useContext, useState, useCallback } from 'react';
import { useForm, FormProvider as RHFFormProvider } from 'react-hook-form';

const ProjectFormContextV2 = createContext(null);

export const useProjectFormV2 = () => {
  const context = useContext(ProjectFormContextV2);
  if (!context) {
    throw new Error('useProjectFormV2 must be used within ProjectFormProviderV2');
  }
  return context;
};

export const ProjectFormProviderV2 = ({ children, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [projectType, setProjectType] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  // Store saved form data from all steps as JSON
  const [formData, setFormData] = useState({});
  
  // Initialize React Hook Form
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
  });

  // Get total steps based on project type
  const getTotalSteps = useCallback(() => {
    const isResidential = ['apartment_complex', 'villa_community', 'township', 
                           'row_houses', 'plotted_development'].includes(projectType);
    const isCommercial = ['office_complex', 'retail_mall', 'business_park', 
                          'mixed_use'].includes(projectType);
    
    if (isResidential || isCommercial) {
      // Steps:
      // 0: ProjectType
      // 1: LocationSelection
      // 2: GeoTag
      // 3: BasicDetails (Name, Builder, Launch Date)
      // 4: ProjectSpecifications (Total Units, Towers, Floors)
      // 5: UnitConfigurations (BHK types available)
      // 6: PriceRange
      // 7: Approvals & RERA
      // 8: ProjectStatus & Possession
      // 9: ProjectDescription
      // 10: Amenities
      // 11: Review & Submit
      return 12;
    }
    
    // Default (only project type selector)
    return 1;
  }, [projectType]);

  // Update form data in context
  const updateFormData = useCallback((stepData) => {
    setFormData(prev => ({
      ...prev,
      ...stepData,
    }));
  }, []);

  // Navigate to next step with "Save & Continue"
  const saveAndContinue = useCallback((stepData) => {
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

  // Jump to a specific step
  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({});
    methods.reset({});
    setCurrentStep(0);
    setProjectType(null);
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

  // Helper functions
  const isResidentialProject = useCallback(() => {
    return ['apartment_complex', 'villa_community', 'township', 
            'row_houses', 'plotted_development'].includes(projectType);
  }, [projectType]);

  const isCommercialProject = useCallback(() => {
    return ['office_complex', 'retail_mall', 'business_park', 
            'mixed_use'].includes(projectType);
  }, [projectType]);

  const value = {
    currentStep,
    setCurrentStep,
    saveAndContinue,
    previousStep,
    goToStep,
    resetForm,
    getTotalSteps,
    isResidentialProject,
    isCommercialProject,
    projectType,
    setProjectType,
    completedSteps,
    isStepCompleted,
    getProgress,
    onClose,
    formData,
    updateFormData,
  };

  return (
    <ProjectFormContextV2.Provider value={value}>
      <RHFFormProvider {...methods}>{children}</RHFFormProvider>
    </ProjectFormContextV2.Provider>
  );
};
