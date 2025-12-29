import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useForm, FormProvider as RHFFormProvider } from 'react-hook-form';
import { getTotalVisibleSteps, getVisibleSteps } from '../config/stepConfiguration';
import { draftApi } from '@/services/draftService';

const PropertyFormContextV2 = createContext(null);

/**
 * Helper function to determine which steps have data
 * Returns a Set of step indices that have completed data
 */
const getCompletedStepsFromData = (formData) => {
  const completedSteps = new Set();
  const visibleSteps = getVisibleSteps(formData);

  visibleSteps.forEach((step, index) => {
    let hasData = false;

    switch (step.id) {
      case 'property-type':
        hasData = !!formData.propertyType;
        break;
      case 'location-selection':
        hasData = !!(formData.address || formData.latitude || formData.longitude);
        break;
      case 'basic-details':
        hasData = !!(formData.propertyName || formData.propertyFor || formData.description);
        break;
      case 'basic-configuration':
        hasData = !!(formData.bedrooms || formData.bathrooms);
        break;
      case 'furnishing':
        hasData = !!(formData.furnishingStatus);
        break;
      case 'location-attributes':
        hasData = !!(formData.facing || formData.overLooking);
        break;
      case 'floor-details':
        hasData = !!(formData.floorNumber || formData.totalFloors);
        break;
      case 'pricing':
        hasData = !!(formData.price || formData.pricePerSqft);
        break;
      case 'suitable-for':
        hasData = !!(formData.suitableFor);
        break;
      case 'listing-info':
        hasData = !!(formData.availableFrom || formData.possessionStatus);
        break;
      case 'amenities':
        hasData = !!(formData.amenities && Object.keys(formData.amenities).length > 0);
        break;
      case 'media-upload':
        hasData = !!(formData.images && formData.images.length > 0);
        break;
      case 'property-plan-upload':
        hasData = !!(formData.propertyPlans && formData.propertyPlans.length > 0);
        break;
      case 'document-upload':
        hasData = !!(formData.documents && formData.documents.length > 0);
        break;
      case 'land-attributes':
        hasData = !!(formData.plotArea || formData.plotLength);
        break;
      default:
        hasData = false;
    }

    if (hasData) {
      completedSteps.add(index);
    }
  });

  return completedSteps;
};

export const usePropertyFormV2 = () => {
  const context = useContext(PropertyFormContextV2);
  if (!context) {
    if (import.meta.env.DEV) {
      console.error('usePropertyFormV2 must be used within PropertyFormProviderV2');
      return null; // Return null in dev mode for better HMR support
    }
    throw new Error('usePropertyFormV2 must be used within PropertyFormProviderV2');
  }
  return context;
};

export const PropertyFormProviderV2 = ({ children, onClose, initialDraftId, editingDraft }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [propertyType, setPropertyType] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [draftId, setDraftId] = useState(initialDraftId || null);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  
  // Store saved form data from all steps as JSON (empty initially, populated on save)
  const [formData, setFormData] = useState({});
  
  // Initialize React Hook Form (not used for step forms, kept for compatibility)
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
  });

  // Fetch draft data from API when initialDraftId is provided
  const fetchDraftData = useCallback(async (id) => {
    try {
      setIsLoadingDraft(true);
      console.log('Fetching property draft data for ID:', id);
      
      const response = await draftApi.getListingDraftById(id);
      
      if (response.success && response.data) {
        console.log('Property draft data fetched successfully:', response.data);
        
        // Set form data from fetched draft (backend returns draftData field)
        if (response.data.draftData) {
          const draftData = response.data.draftData;
          setFormData(draftData);
          console.log('Form data populated from draft:', draftData);
          
          // Set property type if available
          if (draftData.propertyType) {
            setPropertyType(draftData.propertyType);
          }
          
          // Calculate completed steps based on draft data
          const completed = getCompletedStepsFromData(draftData);
          setCompletedSteps(completed);
          console.log('Completed steps synced with draft data:', Array.from(completed));
        }
        
        // Start from the first step
        setCurrentStep(0);
      } else {
        console.error('Failed to fetch property draft data:', response);
      }
    } catch (error) {
      console.error('Error fetching property draft data:', error);
    } finally {
      setIsLoadingDraft(false);
    }
  }, []);

  // Load draft data when editingDraft is provided (legacy support)
  const loadDraftData = useCallback(() => {
    if (editingDraft) {
      setIsLoadingDraft(true);
      console.log('Loading property draft data for editing:', editingDraft);
      
      // Set form data from draft (support both formData and draftData fields)
      const draftFormData = editingDraft.draftData || editingDraft.formData;
      if (draftFormData) {
        setFormData(draftFormData);
        console.log('Property draft data loaded successfully:', draftFormData);
        
        // Set property type if available
        if (draftFormData.propertyType) {
          setPropertyType(draftFormData.propertyType);
        }
        
        // Calculate completed steps based on draft data
        const completed = getCompletedStepsFromData(draftFormData);
        setCompletedSteps(completed);
        console.log('Completed steps synced with draft data:', Array.from(completed));
      }
  
      // Start from the first step
      setCurrentStep(0);
      
      setIsLoadingDraft(false);
    }
  }, [editingDraft]);

  // Load draft data on mount when initialDraftId or editingDraft changes
  useEffect(() => {
    if (initialDraftId && !editingDraft) {
      // Fetch draft data from API when draftId is in URL
      fetchDraftData(initialDraftId);
    } else if (editingDraft) {
      // Load draft data directly when provided as prop (legacy)
      loadDraftData();
    }
  }, [initialDraftId, editingDraft, fetchDraftData, loadDraftData]);

  // Memoize the form data with propertyType for step configuration
  const formDataWithType = useMemo(() => ({
    ...formData,
    propertyType,
  }), [formData, propertyType]);

  // Get total steps dynamically based on current form data
  const getTotalSteps = useCallback(() => {
    return getTotalVisibleSteps(formDataWithType);
  }, [formDataWithType]);

  // Update form data in context (called when save & continue is clicked)
  const updateFormData = useCallback((stepData) => {
    setFormData(prev => ({
      ...prev,
      ...stepData,
    }));
  }, []);

  // Save draft to backend
  const saveDraft = useCallback(async (updatedData) => {
    let currentDraftId = draftId;
    
    // If no draft ID exists, create a new draft first
    if (!currentDraftId) {
      console.log('No draft ID exists, creating new draft...');
      try {
        setIsCreatingDraft(true);
        const createResponse = await draftApi.createListingDraft({
          status: 'draft',
        });
        
        if (createResponse.success && createResponse.data?.draftId) {
          currentDraftId = createResponse.data.draftId;
          console.log('✅ New draft created with ID:', currentDraftId);
          setDraftId(currentDraftId);
          setIsCreatingDraft(false);
          // Continue to update the draft with actual data below
        } else {
          console.warn('⚠️ Failed to create draft:', createResponse);
          setIsCreatingDraft(false);
          return { success: false, message: 'Failed to create draft' };
        }
      } catch (error) {
        console.error('❌ Error creating draft:', error);
        setIsCreatingDraft(false);
        return { success: false, error: error.message };
      }
    }

    // Update draft with actual data (works for both newly created and existing drafts)
    try {
      console.log('Calling updateListingDraft API...', {
        draftId: currentDraftId,
        dataKeys: Object.keys(updatedData || formData),
      });
      
      // Pass the actual form data directly, not wrapped in draftData
      const response = await draftApi.updateListingDraft(currentDraftId, updatedData || formData);
      
      console.log('API Response:', response);
      
      if (response.success) {
        console.log('✅ Draft saved successfully to backend');
        return { success: true, data: response, draftId: currentDraftId };
      } else {
        console.warn('⚠️ Draft save returned unsuccessful response:', response);
        return { success: false, message: response.message || 'Unknown error' };
      }
    } catch (error) {
      console.error('❌ Failed to save draft:', error);
      // Don't throw error, just log it and return failure
      return { success: false, error: error.message };
    }
  }, [draftId, formData]);

  // Navigate to next step with "Save & Continue"
  const saveAndContinue = useCallback(async (stepData) => {
    try {
      // Update form data in context first
      const updatedFormData = { ...formData, ...stepData };
      
      if (stepData) {
        updateFormData(stepData);
      }
      
      // Save to backend (this will auto-create draft if draftId doesn't exist)
      console.log('Saving draft to backend...', { draftId, stepData });
      const saveResult = await saveDraft(updatedFormData);
      
      if (saveResult.success) {
        console.log('Draft saved successfully');
        // If a new draft was created, the draftId is already set by saveDraft
      } else {
        console.warn('Draft save unsuccessful, but continuing to next step');
      }
      
      // Mark current step as completed
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      
      // Move to next step
      const totalSteps = getTotalSteps();
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Error in saveAndContinue:', error);
      // Still proceed to next step even if save fails
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      const totalSteps = getTotalSteps();
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  }, [currentStep, getTotalSteps, updateFormData, formData, saveDraft, draftId]);

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
    setDraftId(null);
    setIsCreatingDraft(false);
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
    const buildingTypes = ['apartment', 'villa', 'duplex', 'independent_house', 
            'penthouse', 'studio', 'independent_floor'];
    return buildingTypes.includes(propertyType);
  }, [propertyType]);

  const isLandType = useCallback(() => {
    const landTypes = ['plot', 'farmhouse', 'agricultural_land'];
    return landTypes.includes(propertyType);
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
    formDataWithType, // Form data with propertyType for step configuration
    draftId, // Current draft ID
    setDraftId, // Function to set draft ID (for auto-creation)
    saveDraft, // Function to save draft
    isCreatingDraft, // Loading state for draft creation
    isLoadingDraft, // Loading state for loading draft data
  };

  return (
    <PropertyFormContextV2.Provider value={value}>
      <RHFFormProvider {...methods}>{children}</RHFFormProvider>
    </PropertyFormContextV2.Provider>
  );
};
