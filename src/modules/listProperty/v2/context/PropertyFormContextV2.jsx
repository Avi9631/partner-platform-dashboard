import { createContext, useContext, useState, useCallback } from 'react';
import { useForm, FormProvider as RHFFormProvider } from 'react-hook-form';

const PropertyFormContextV2 = createContext(null);

export const usePropertyFormV2 = () => {
  const context = useContext(PropertyFormContextV2);
  if (!context) {
    throw new Error('usePropertyFormV2 must be used within PropertyFormProviderV2');
  }
  return context;
};

export const PropertyFormProviderV2 = ({ children, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [propertyType, setPropertyType] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  // Store saved form data from all steps as JSON (empty initially, populated on save)
  const [formData, setFormData] = useState({});
  
  // Initialize React Hook Form (not used for step forms, kept for compatibility)
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
  });

  // Get total steps based on property type
  const getTotalSteps = useCallback(() => {
    const isBuildingType = ['apartment', 'villa', 'duplex', 'independent_house', 
                            'penthouse', 'studio', 'independent_floor'].includes(propertyType);
    const isLandType = ['plot', 'farmhouse', 'agricultural_land'].includes(propertyType);
    
    if (isBuildingType) {
      if (['apartment', 'penthouse'].includes(propertyType)) {
        // 0: PropertyType, 1: LocationSelection, 2: GeoTag, 3: BasicDetails, 4: BasicConfig, 
        // 5: AreaDetails, 6: Furnishing, 7: Parking, 8: LocationAttributes, 
        // 9: FloorDetails, 10: Pricing, 11: SuitableFor, 12: ListingInfo, 13: Amenities, 14: Review
        return 15;
      }
      // Other building types (no floor details)
      // 0: PropertyType, 1: LocationSelection, 2: GeoTag, 3: BasicDetails, 4: BasicConfig, 
      // 5: AreaDetails, 6: Furnishing, 7: Parking, 8: LocationAttributes,
      // 9: Pricing, 10: SuitableFor, 11: ListingInfo, 12: Amenities, 13: Review
      return 14;
    } else if (isLandType) {
      // 0: PropertyType, 1: LocationSelection, 2: GeoTag, 3: BasicDetails, 4: LandAttributes, 
      // 5: Pricing, 6: ListingInfo, 7: Amenities, 8: Review
      return 9;
    }
    
    // Default (only property type selector)
    return 1;
  }, [propertyType]);

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
    setPropertyType(null);
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
  const isBuildingType = useCallback(() => {
    return ['apartment', 'villa', 'duplex', 'independent_house', 
            'penthouse', 'studio', 'independent_floor'].includes(propertyType);
  }, [propertyType]);

  const isLandType = useCallback(() => {
    return ['plot', 'farmhouse', 'agricultural_land'].includes(propertyType);
  }, [propertyType]);

  const value = {
    currentStep,
    setCurrentStep,
    saveAndContinue,
    previousStep,
    goToStep,
    resetForm,
    getTotalSteps,
    isBuildingType,
    isLandType,
    propertyType,
    setPropertyType,
    completedSteps,
    isStepCompleted,
    getProgress,
    onClose,
    formData, // JSON object updated only on save & continue
    updateFormData, // Method to update form data
  };

  return (
    <PropertyFormContextV2.Provider value={value}>
      <RHFFormProvider {...methods}>{children}</RHFFormProvider>
    </PropertyFormContextV2.Provider>
  );
};
