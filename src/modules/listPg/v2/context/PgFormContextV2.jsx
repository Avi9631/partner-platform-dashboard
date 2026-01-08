import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useForm, FormProvider as RHFFormProvider } from 'react-hook-form';
import { getTotalVisibleSteps, getVisibleSteps } from '../config/stepConfigurationPg';
import { draftApi } from '@/services/draftService';
import { toast } from 'sonner';

const PgFormContextV2 = createContext(null);

/**
 * Helper function to determine which steps have data
 * Returns a Set of step indices that have completed data
 * Supports both nested (stepName: {fields}) and flat structure for backwards compatibility
 */
const getCompletedStepsFromData = (formData) => {
  const completedSteps = new Set();
  const visibleSteps = getVisibleSteps(formData);

  // Helper to check if a value is meaningful (not null, undefined, empty string, or empty array)
  const hasValue = (val) => {
    if (val === null || val === undefined || val === '') return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'object') return Object.keys(val).length > 0;
    return true;
  };

  visibleSteps.forEach((step, index) => {
    let hasData = false;

    switch (step.id) {
      case 'basic-details': {
        const stepData = formData['basic-details'] || {};
        // Check if any basic detail field is filled
        hasData = !!(
          hasValue(stepData.pgHostelName) || hasValue(formData.pgHostelName) ||
          hasValue(stepData.propertyFor) || hasValue(formData.propertyFor) ||
          hasValue(stepData.pgHostelType) || hasValue(formData.pgHostelType) ||
          hasValue(stepData.description) || hasValue(formData.description) ||
          hasValue(stepData.establishedYear) || hasValue(formData.establishedYear) ||
          hasValue(stepData.totalFloors) || hasValue(formData.totalFloors) ||
          hasValue(stepData.ownerName) || hasValue(formData.ownerName) ||
          hasValue(stepData.ownerContact) || hasValue(formData.ownerContact)
        );
        break;
      }
        
      case 'location-details': {
        const stepData = formData['location-details'] || {};
        // Check if location details are provided (address or coordinates)
        hasData = !!(
          hasValue(stepData.address) || hasValue(formData.address) ||
          hasValue(stepData.city) || hasValue(formData.city) ||
          hasValue(stepData.state) || hasValue(formData.state) ||
          hasValue(stepData.pincode) || hasValue(formData.pincode) ||
          hasValue(stepData.latitude) || hasValue(formData.latitude) ||
          hasValue(stepData.longitude) || hasValue(formData.longitude) ||
          hasValue(stepData.locationDetails) || hasValue(formData.locationDetails) ||
          hasValue(stepData.landmark) || hasValue(formData.landmark) ||
          hasValue(stepData.locality) || hasValue(formData.locality)
        );
        break;
      }
        
      case 'room-types': {
        const stepData = formData['room-types'] || {};
        const roomTypes = stepData.roomTypes || formData.roomTypes;
        // Check if room types are defined with valid data
        console.log('🔍 Checking room-types:', {
          hasRoomTypes: !!roomTypes,
          isArray: Array.isArray(roomTypes),
          length: roomTypes?.length,
          roomTypes: roomTypes
        });
        hasData = !!(
          roomTypes && 
          Array.isArray(roomTypes) && 
          roomTypes.length > 0 &&
          roomTypes.some(room => 
            hasValue(room.name) || 
            hasValue(room.category) || 
            hasValue(room.roomSize) ||
            (room.pricing && Array.isArray(room.pricing) && room.pricing.length > 0) ||
            (room.amenities && Array.isArray(room.amenities) && room.amenities.length > 0) ||
            hasValue(room.refundPolicy) ||
            (room.images && Array.isArray(room.images) && room.images.length > 0)
          )
        );
        console.log('🔍 room-types hasData:', hasData);
        break;
      }
        
      case 'amenities': {
        const stepData = formData['amenities'] || {};
        // Check if any amenity is selected (using commonAmenities field)
        hasData = !!(
          (stepData.commonAmenities && Array.isArray(stepData.commonAmenities) && stepData.commonAmenities.length > 0) ||
          (formData.commonAmenities && Array.isArray(formData.commonAmenities) && formData.commonAmenities.length > 0) ||
          (stepData.commonAmenitiesLegacy && Array.isArray(stepData.commonAmenitiesLegacy) && stepData.commonAmenitiesLegacy.length > 0) ||
          (formData.commonAmenitiesLegacy && Array.isArray(formData.commonAmenitiesLegacy) && formData.commonAmenitiesLegacy.length > 0) ||
          (stepData.amenities && typeof stepData.amenities === 'object' && Object.keys(stepData.amenities).length > 0) ||
          (formData.amenities && typeof formData.amenities === 'object' && Object.keys(formData.amenities).length > 0)
        );
        break;
      }
        
      case 'food-mess': {
        const stepData = formData['food-mess'] || {};
        // Check if food/mess options are defined (using foodMess field)
        hasData = !!(
          (stepData.foodMess && typeof stepData.foodMess === 'object' && Object.keys(stepData.foodMess).length > 0) ||
          (formData.foodMess && typeof formData.foodMess === 'object' && Object.keys(formData.foodMess).length > 0) ||
          stepData.foodAvailable !== undefined || formData.foodAvailable !== undefined ||
          stepData.messAvailable !== undefined || formData.messAvailable !== undefined ||
          hasValue(stepData.foodType) || hasValue(formData.foodType) ||
          hasValue(stepData.messCharges) || hasValue(formData.messCharges) ||
          hasValue(stepData.mealsIncluded) || hasValue(formData.mealsIncluded) ||
          hasValue(stepData.foodTimings) || hasValue(formData.foodTimings) ||
          stepData.breakfastIncluded !== undefined || formData.breakfastIncluded !== undefined ||
          stepData.lunchIncluded !== undefined || formData.lunchIncluded !== undefined ||
          stepData.dinnerIncluded !== undefined || formData.dinnerIncluded !== undefined
        );
        break;
      }
        
      case 'rules-restrictions': {
        const stepData = formData['rules-restrictions'] || {};
        // Rules are optional - mark as complete if rules array exists (even if empty)
        // or if it has at least one valid rule
        hasData = !!(
          (stepData.rules !== undefined && Array.isArray(stepData.rules)) ||
          (formData.rules !== undefined && Array.isArray(formData.rules))
        );
        break;
      }
        
      case 'media-upload': {
        const stepData = formData['media-upload'] || {};
        // Check if any media files are uploaded (using mediaData field)
        hasData = !!(
          (stepData.mediaData && Array.isArray(stepData.mediaData) && stepData.mediaData.length > 0) ||
          (formData.mediaData && Array.isArray(formData.mediaData) && formData.mediaData.length > 0) ||
          (stepData.images && Array.isArray(stepData.images) && stepData.images.length > 0) ||
          (formData.images && Array.isArray(formData.images) && formData.images.length > 0) ||
          (stepData.videos && Array.isArray(stepData.videos) && stepData.videos.length > 0) ||
          (formData.videos && Array.isArray(formData.videos) && formData.videos.length > 0) ||
          hasValue(stepData.virtualTourUrl) || hasValue(formData.virtualTourUrl) ||
          hasValue(stepData.coverImage) || hasValue(formData.coverImage)
        );
        break;
      }
        
      case 'availability':
        // Check if availability information is provided
        hasData = !!(
          hasValue(formData.availableFrom) ||
          formData.vacantBeds !== undefined ||
          formData.totalBeds !== undefined ||
          formData.immediateAvailability !== undefined
        );
        break;
        
      case 'safety-compliance':
        // Check if safety/compliance info is provided
        hasData = !!(
          formData.hasFireSafety !== undefined ||
          formData.hasCCTV !== undefined ||
          formData.hasSecurityGuard !== undefined ||
          hasValue(formData.safetyFeatures) ||
          hasValue(formData.fireSafetyEquipment) ||
          formData.hasEmergencyExit !== undefined
        );
        break;

      case 'review-submit':
        // Review step is always accessible, but mark as complete only if previous steps are done
        // This will be handled separately - don't auto-complete
        hasData = false;
        break;
        
      default:
        hasData = false;
    }

    if (hasData) {
      completedSteps.add(index);
      console.log(`✅ Step ${index} (${step.id}) marked as completed`);
    } else {
      console.log(`❌ Step ${index} (${step.id}) has no data`);
    }
  });

  console.log('📊 Total completed steps:', completedSteps.size, 'out of', visibleSteps.length);
  return completedSteps;
};

export const usePgFormV2 = () => {
  const context = useContext(PgFormContextV2);
  if (!context) {
    if (import.meta.env.DEV) {
      console.error('usePgFormV2 must be used within PgFormProviderV2');
      return null;
    }
    throw new Error('usePgFormV2 must be used within PgFormProviderV2');
  }
  return context;
};

export const PgFormProviderV2 = ({ children, onClose, initialDraftId, editingDraft }) => {
  const [currentStep, setCurrentStep] = useState(0);
   const [completedSteps, setCompletedSteps] = useState(new Set());
  const [draftId, setDraftId] = useState(initialDraftId || null);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [currentStepSubmitHandler, setCurrentStepSubmitHandler] = useState(null);
  
  // Store saved form data from all steps as JSON
  const [formData, setFormData] = useState({});
  
  // Initialize React Hook Form
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
  });

  // Fetch draft data from API when initialDraftId is provided
  const fetchDraftData = useCallback(async (id) => {
    try {
      setIsLoadingDraft(true);
      console.log('🔄 Fetching PG draft data for ID:', id);
      
      const response = await draftApi.getListingDraftById(id);
      
      if (response.success && response.data) {
        console.log('✅ PG draft data fetched successfully:', response.data);
        
        // Set form data from fetched draft
        if (response.data.draftData) {
          const draftData = response.data.draftData;
          console.log('📝 Draft data fields:', Object.keys(draftData));
          setFormData(draftData);
          console.log('✅ Form data populated from draft');
          
          // Calculate completed steps based on draft data
          const completed = getCompletedStepsFromData(draftData);
          setCompletedSteps(completed);
          console.log('✅ Completed steps synced with draft data:', Array.from(completed));
          
          // Start from the first incomplete step to continue progress
          const visibleSteps = getVisibleSteps(draftData);
          let firstIncompleteStep = 0;
          for (let i = 0; i < visibleSteps.length; i++) {
            if (!completed.has(i)) {
              firstIncompleteStep = i;
              break;
            }
          }
          setCurrentStep(firstIncompleteStep);
          console.log('📍 Starting at step:', firstIncompleteStep, visibleSteps[firstIncompleteStep]?.name || 'Unknown');
        } else {
          console.warn('⚠️ No draftData found in response');
          setCurrentStep(0);
        }
      } else {
        console.error('❌ Failed to fetch PG draft data:', response);
      }
    } catch (error) {
      console.error('❌ Error fetching PG draft data:', error);
    } finally {
      setIsLoadingDraft(false);
    }
  }, []);

  // Load draft data when editingDraft is provided (legacy support)
  const loadDraftData = useCallback(() => {
    if (editingDraft && editingDraft.draftData) {
      setIsLoadingDraft(true);
      console.log('🔄 Loading PG draft data for editing:', editingDraft);
      
      const draftData = editingDraft.draftData;
      console.log('📝 Draft data fields:', Object.keys(draftData));
      
      // Set form data from draft
      setFormData(draftData);
  
      // Calculate completed steps based on draft data
      const completed = getCompletedStepsFromData(draftData);
      setCompletedSteps(completed);
      console.log('✅ Completed steps synced with draft data:', Array.from(completed));
      
      // Start from the first incomplete step to continue progress
      const visibleSteps = getVisibleSteps(draftData);
      let firstIncompleteStep = 0;
      for (let i = 0; i < visibleSteps.length; i++) {
        if (!completed.has(i)) {
          firstIncompleteStep = i;
          break;
        }
      }
      setCurrentStep(firstIncompleteStep);
      console.log('📍 Starting at step:', firstIncompleteStep, visibleSteps[firstIncompleteStep]?.name || 'Unknown');
      
      setIsLoadingDraft(false);
      console.log('✅ PG draft data loaded successfully');
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

  // Re-sync completed steps whenever formData changes (for update case)
  // This ensures the sidebar step status stays in sync with actual data
  useEffect(() => {
    // Only re-sync if we have form data (not during initial render)
    if (formData && Object.keys(formData).length > 0) {
      const completed = getCompletedStepsFromData(formData);
      
      // Only update if there's an actual difference to avoid infinite loops
      const currentCompleted = Array.from(completedSteps).sort().join(',');
      const newCompleted = Array.from(completed).sort().join(',');
      
      if (currentCompleted !== newCompleted) {
        setCompletedSteps(completed);
        console.log('🔄 Completed steps re-synced with form data:', Array.from(completed));
      }
    }
  }, [formData]);

  /**
   * Helper to flatten nested formData for backwards compatibility with validation
   * Converts { stepId: { field1: value1 } } to { field1: value1, field2: value2, ... }
   */
  const flattenFormData = useCallback((nestedData) => {
    const flattened = {};
    Object.entries(nestedData).forEach(([key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Merge step data into flattened object
        Object.assign(flattened, value);
      } else {
        // Keep top-level primitives (backwards compatibility)
        flattened[key] = value;
      }
    });
    return flattened;
  }, []);

  // Memoize the form data (flattened for validation)
  const formDataWithType = useMemo(() => {
    return flattenFormData(formData);
  }, [formData, flattenFormData]);

  // Get total steps
  const getTotalSteps = useCallback(() => {
    return getTotalVisibleSteps(formDataWithType);
  }, [formDataWithType]);

  /**
   * Update form data for a specific step
   * @param {string} stepId - The ID of the step (e.g., 'basic-details')
   * @param {Object} stepData - The data for that step
   */
  const updateFormData = useCallback((stepId, stepData) => {
    if (!stepId) {
      console.warn('updateFormData called without stepId, using flat structure');
      // Fallback to flat structure if no stepId provided (backwards compatibility)
      setFormData(prev => ({ ...prev, ...stepData }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [stepId]: {
        ...(prev[stepId] || {}),
        ...stepData,
      }
    }));
    
    console.log(`📝 Updated PG form data for step: ${stepId}`, stepData);
  }, []);

  // Sanitize data to remove circular references and non-serializable values
  const sanitizeData = useCallback((obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      console.warn('Error sanitizing data, manually filtering:', error);
      const sanitized = {};
      for (const key in obj) {
        const value = obj[key];
        if (
          value !== null && 
          value !== undefined &&
          typeof value !== 'function' &&
          !(value instanceof HTMLElement) &&
          !(value instanceof Window)
        ) {
          sanitized[key] = value;
        }
      }
      return sanitized;
    }
  }, []);

  // Save draft to backend
  const saveDraft = useCallback(async (updatedData, showToast = true) => {
    let currentDraftId = draftId;
    
    // If no draft ID exists, create a new draft first
    if (!currentDraftId) {
      console.log('No draft ID exists, creating new PG draft...');
      try {
        setIsCreatingDraft(true);
        const createResponse = await draftApi.createListingDraft('PG');
        
        if (createResponse.success && createResponse.data?.draftId) {
          currentDraftId = createResponse.data.draftId;
          console.log('✅ New PG draft created with ID:', currentDraftId);
          setDraftId(currentDraftId);
          setIsCreatingDraft(false);
        } else {
          console.warn('⚠️ Failed to create PG draft:', createResponse);
          setIsCreatingDraft(false);
          return { success: false, message: 'Failed to create draft' };
        }
      } catch (error) {
        console.error('❌ Error creating PG draft:', error);
        setIsCreatingDraft(false);
        return { success: false, error: error.message };
      }
    }

    // Update draft with actual data (sanitized)
    try {
      const dataToSave = sanitizeData(updatedData || formData);
      
      console.log('Calling updateListingDraft API...', {
        draftId: currentDraftId,
        dataKeys: Object.keys(dataToSave),
      });
      
      const response = await draftApi.updateListingDraft(currentDraftId, dataToSave);
      
      console.log('API Response:', response);
      
      if (response.success) {
        console.log('✅ PG draft saved successfully to backend');
        if (showToast) {
          toast.success('Draft saved successfully', {
            description: 'Your changes have been saved',
            duration: 3000,
          });
        }
        return { success: true, data: response, draftId: currentDraftId };
      } else {
        console.warn('⚠️ PG draft save returned unsuccessful response:', response);
        if (showToast) {
          toast.error('Failed to save draft', {
            description: response.message || 'Unknown error occurred',
            duration: 4000,
          });
        }
        return { success: false, message: response.message || 'Unknown error' };
      }
    } catch (error) {
      console.error('❌ Failed to save PG draft:', error);
      if (showToast) {
        toast.error('Error saving draft', {
          description: error.message || 'An unexpected error occurred',
          duration: 4000,
        });
      }
      return { success: false, error: error.message };
    }
  }, [draftId, formData, sanitizeData]);

  // Navigate to next step with "Save & Continue"
  const saveAndContinue = useCallback(async (stepData, stepId) => {
    try {
      // Get current step ID from visible steps
      const visibleSteps = getVisibleSteps(formDataWithType);
      const currentStepId = stepId || visibleSteps[currentStep]?.id;
      
      if (!currentStepId) {
        console.error('Could not determine current step ID');
        return;
      }
      
      // Update form data with nested structure
      const updatedFormData = {
        ...formData,
        [currentStepId]: {
          ...(formData[currentStepId] || {}),
          ...stepData,
        }
      };
      
      updateFormData(currentStepId, stepData);
      
      // Save to backend
      console.log('Saving PG draft to backend...', { draftId, stepData });
      toast.loading('Saving draft...', { id: 'save-draft' });
      const saveResult = await saveDraft(updatedFormData, false); // Don't show toast from saveDraft
      
      if (saveResult.success) {
        console.log('PG draft saved successfully');
        toast.success('Progress saved!', {
          id: 'save-draft',
          description: 'Moving to next step',
          duration: 2000,
        });
      } else {
        console.warn('PG draft save unsuccessful, but continuing to next step');
        toast.error('Failed to save', {
          id: 'save-draft',
          description: saveResult.message || 'An error occurred',
          duration: 3000,
        });
      }
      
      // Recalculate completed steps based on the updated data
      const newCompletedSteps = getCompletedStepsFromData(updatedFormData);
      setCompletedSteps(newCompletedSteps);
      console.log('✅ Completed steps updated after save:', Array.from(newCompletedSteps));
      
      // Move to next step
      const totalSteps = getTotalSteps();
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Error in saveAndContinue:', error);
      // Still proceed to next step even if save fails
      // Recalculate completed steps based on current formData
      const updatedFormData = { ...formData, ...stepData };
      const newCompletedSteps = getCompletedStepsFromData(updatedFormData);
      setCompletedSteps(newCompletedSteps);
      
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

  // Jump to a specific step
  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({});
    methods.reset({});
    setCurrentStep(0);
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

  /**
   * Get data for a specific step
   * @param {string} stepId - The step ID
   * @returns {Object} The step's data
   */
  const getStepData = useCallback((stepId) => {
    return formData[stepId] || {};
  }, [formData]);

  const value = {
    currentStep,
    setCurrentStep,
    saveAndContinue,
    previousStep,
    goToStep,
    resetForm,
    getTotalSteps,
 
    completedSteps,
    isStepCompleted,
    getProgress,
    onClose,
    formData,
    updateFormData,
    formDataWithType,
    getStepData,
    draftId,
    setDraftId,
    saveDraft,
    isCreatingDraft,
    isLoadingDraft,
    currentStepSubmitHandler,
    setCurrentStepSubmitHandler,
  };

  return (
    <PgFormContextV2.Provider value={value}>
      <RHFFormProvider {...methods}>{children}</RHFFormProvider>
    </PgFormContextV2.Provider>
  );
};
