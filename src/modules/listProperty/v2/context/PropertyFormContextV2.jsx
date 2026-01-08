import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { getTotalVisibleSteps, getVisibleSteps } from '../config/stepConfiguration';
import { draftApi } from '@/services/draftService';
import { validateAllSteps } from '../utils/schemaMapping';

const PropertyFormContextV2 = createContext(null);

/**
 * Helper function to determine which steps have data
 * Returns a Set of step indices that have completed data
 * Supports both nested (stepName: {fields}) and flat structure for backwards compatibility
 */
const getCompletedStepsFromData = (formData) => {
  const completedSteps = new Set();
  
  // Build propertyType-aware formData for getVisibleSteps
  const formDataWithType = {
    ...formData,
    propertyType: formData['property-type']?.propertyType || formData.propertyType,
  };
  
  const visibleSteps = getVisibleSteps(formDataWithType);

  visibleSteps.forEach((step, index) => {
    let hasData = false;
    const stepData = formData[step.id] || {};

    switch (step.id) {
      case 'property-type':
        hasData = !!(stepData.propertyType || formData.propertyType);
        break;
        
      case 'location-selection':
        hasData = !!(
          stepData.address || stepData.city || stepData.state || 
          stepData.pincode || stepData.latitude || stepData.longitude ||
          // Backwards compatibility
          formData.address || formData.city || formData.state ||
          formData.pincode || formData.latitude || formData.longitude
        );
        break;
        
      case 'basic-details':
        hasData = !!(
          stepData.propertyName || stepData.listingType || 
          stepData.propertyAge || stepData.description ||
          // Backwards compatibility
          formData.propertyName || formData.listingType ||
          formData.propertyAge || formData.description
        );
        break;
        
      case 'basic-configuration':
        hasData = !!(
          stepData.bedrooms !== undefined || stepData.bathrooms !== undefined ||
          stepData.balconies !== undefined || stepData.carpetArea ||
          stepData.builtUpArea || stepData.superBuiltUpArea ||
          // Backwards compatibility
          formData.bedrooms !== undefined || formData.bathrooms !== undefined ||
          formData.balconies !== undefined || formData.carpetArea ||
          formData.builtUpArea || formData.superBuiltUpArea
        );
        break;
        
      case 'land-attributes':
        hasData = !!(
          stepData.plotArea || stepData.plotLength || stepData.plotWidth ||
          stepData.boundaryWall || stepData.facingDirection ||
          // Backwards compatibility
          formData.plotArea || formData.plotLength || formData.plotWidth ||
          formData.boundaryWall || formData.facingDirection
        );
        break;
        
      case 'unit-amenities':
      case 'furnishing':
        hasData = !!(
          stepData.furnishingStatus || stepData.furnishingDetails ||
          (stepData.furnishingItems && stepData.furnishingItems.length > 0) ||
          // Backwards compatibility
          formData.furnishingStatus || formData.furnishingDetails ||
          (formData.furnishingItems && formData.furnishingItems.length > 0)
        );
        break;
        
      case 'location-attributes':
        hasData = !!(
          stepData.nearbyPlaces || stepData.locationAdvantages ||
          stepData.distanceFromMainRoad ||
          // Backwards compatibility
          formData.nearbyPlaces || formData.locationAdvantages ||
          formData.distanceFromMainRoad
        );
        break;
        
      case 'floor-details':
        hasData = !!(
          stepData.floorNumber !== undefined || stepData.totalFloors !== undefined ||
          stepData.floorType ||
          // Backwards compatibility
          formData.floorNumber !== undefined || formData.totalFloors !== undefined ||
          formData.floorType
        );
        break;
        
      case 'pricing':
        hasData = !!(
          stepData.price !== undefined || stepData.expectedPrice ||
          stepData.rentAmount || stepData.securityDeposit ||
          stepData.maintenanceCharges ||
          // Backwards compatibility
          formData.price !== undefined || formData.expectedPrice ||
          formData.rentAmount || formData.securityDeposit ||
          formData.maintenanceCharges
        );
        break;
        
      case 'suitable-for':
        hasData = !!(
          stepData.suitableFor ||
          (stepData.preferredTenants && stepData.preferredTenants.length > 0) ||
          // Backwards compatibility
          formData.suitableFor ||
          (formData.preferredTenants && formData.preferredTenants.length > 0)
        );
        break;
        
      case 'listing-info':
        hasData = !!(
          stepData.availableFrom || stepData.possessionStatus ||
          stepData.ownershipType ||
          // Backwards compatibility
          formData.availableFrom || formData.possessionStatus ||
          formData.ownershipType
        );
        break;
        
      case 'property-amenities':
      case 'amenities':
        hasData = !!(
          (stepData.amenities && typeof stepData.amenities === 'object' &&
            Object.keys(stepData.amenities).length > 0 &&
            Object.values(stepData.amenities).some(val => val === true || val === 'yes' || val)) ||
          // Check if stepData itself has amenity fields
          (Object.keys(stepData).length > 0 &&
            Object.values(stepData).some(val => val === true || val === 'yes' || val)) ||
          // Backwards compatibility
          (formData.amenities && typeof formData.amenities === 'object' &&
            Object.keys(formData.amenities).length > 0 &&
            Object.values(formData.amenities).some(val => val === true || val === 'yes' || val))
        );
        break;
        
      case 'media-upload':
        hasData = !!(
          (stepData.mediaData && Array.isArray(stepData.mediaData) && stepData.mediaData.length > 0) ||
          (stepData.images && Array.isArray(stepData.images) && stepData.images.length > 0) ||
          // Backwards compatibility
          (formData.mediaData && Array.isArray(formData.mediaData) && formData.mediaData.length > 0)
        );
        break;
        
      case 'property-plan-upload':
        hasData = !!(
          (stepData.floorPlans && Array.isArray(stepData.floorPlans) && stepData.floorPlans.length > 0) ||
          // Backwards compatibility
          (formData.floorPlans && Array.isArray(formData.floorPlans) && formData.floorPlans.length > 0)
        );
        break;
        
      case 'document-upload':
        hasData = !!(
          (stepData.documents && Array.isArray(stepData.documents) && stepData.documents.length > 0) ||
          // Backwards compatibility
          (formData.documents && Array.isArray(formData.documents) && formData.documents.length > 0)
        );
        break;
        
      default:
        // Check if step has any data
        hasData = stepData && typeof stepData === 'object' && Object.keys(stepData).length > 0;
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
    throw new Error('usePropertyFormV2 must be used within PropertyFormProviderV2');
  }
  return context;
};

export const PropertyFormProviderV2 = ({ children, onClose, initialDraftId, editingDraft }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [propertyType, setPropertyType] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [draftId, setDraftId] = useState(initialDraftId || null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({}); // Nested structure: { stepId: { field1: value1, ... } }
  const [currentStepSubmitHandler, setCurrentStepSubmitHandler] = useState(null);
  const [currentStepIsValid, setCurrentStepIsValid] = useState(true);
  const [areAllStepsValid, setAreAllStepsValid] = useState(false);

  // Load draft data on mount
  useEffect(() => {
    const loadDraft = async () => {
      if (!initialDraftId && !editingDraft) return;

      try {
        setIsLoading(true);
        
        let draftData;
        if (initialDraftId) {
          const response = await draftApi.getListingDraftById(initialDraftId);
          draftData = response.success ? response.data?.draftData : null;
        } else if (editingDraft) {
          draftData = editingDraft.draftData || editingDraft.formData;
        }

        if (draftData) {
          setFormData(draftData);
          // Extract propertyType from nested structure or flat structure (backwards compatibility)
          const extractedPropertyType = draftData['property-type']?.propertyType || draftData.propertyType;
          if (extractedPropertyType) {
            setPropertyType(extractedPropertyType);
          }
          
          // Sync completed steps based on draft data
          const completed = getCompletedStepsFromData(draftData);
          setCompletedSteps(completed);
          console.log('✅ Property completed steps synced with draft data:', Array.from(completed));
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDraft();
  }, [initialDraftId, editingDraft]);

  // Re-sync completed steps whenever formData changes (for update case)
  // This ensures the sidebar step status stays in sync with actual data
  useEffect(() => {
    // Only re-sync if we have form data (not during initial render)
    if (formData && Object.keys(formData).length > 0) {
      const completed = getCompletedStepsFromData(formData);
      setCompletedSteps(completed);
      console.log('🔄 Property completed steps re-synced with form data:', Array.from(completed));
    }
  }, [formData, propertyType]);

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

  const formDataWithType = useMemo(() => {
    const flattened = flattenFormData(formData);
    return {
      ...flattened,
      propertyType,
    };
  }, [formData, propertyType, flattenFormData]);

  // Validate all steps whenever formData or propertyType changes
  useEffect(() => {
    const visibleSteps = getVisibleSteps(formDataWithType);
    const validationResult = validateAllSteps(visibleSteps, formDataWithType);
    setAreAllStepsValid(validationResult.allValid);
    
    if (!validationResult.allValid) {
      console.log('⚠️ Invalid steps:', validationResult.invalidSteps);
    } else {
      console.log('✅ All steps are valid');
    }
  }, [formDataWithType]);

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
    
    console.log(`📝 Updated form data for step: ${stepId}`, stepData);
  }, []);

  // Simplified draft save
  const saveDraft = useCallback(async (updatedData) => {
    try {
      const dataToSave = updatedData || formData;
      
      // Create draft if none exists
      if (!draftId) {
        const createResponse = await draftApi.createListingDraft({ status: 'draft' });
        if (createResponse.success && createResponse.data?.draftId) {
          const newDraftId = createResponse.data.draftId;
          setDraftId(newDraftId);
          const response = await draftApi.updateListingDraft(newDraftId, dataToSave);
          return { success: response.success, draftId: newDraftId };
        }
        return { success: false, message: 'Failed to create draft' };
      }
      
      // Update existing draft
      const response = await draftApi.updateListingDraft(draftId, dataToSave);
      return { success: response.success, draftId };
    } catch (error) {
      console.error('Save draft error:', error);
      return { success: false, error: error.message };
    }
  }, [draftId, formData]);

  const saveAndContinue = useCallback(async (stepData, stepId) => {
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
    
    // Wait for draft to save before proceeding
    const result = await saveDraft(updatedFormData);
    if (!result.success) {
      console.error('Failed to save draft:', result.error);
      // Still continue even if save fails (user can retry later)
    }
    
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    
    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, getTotalSteps, updateFormData, formData, saveDraft, formDataWithType]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const goToStep = useCallback((step) => setCurrentStep(step), []);

  const resetForm = useCallback(() => {
    setFormData({});
    setCurrentStep(0);
    setPropertyType(null);
    setCompletedSteps(new Set());
    setDraftId(null);
  }, []);

  const isStepCompleted = useCallback((step) => completedSteps.has(step), [completedSteps]);

  const getProgress = useCallback(() => {
    const totalSteps = getTotalSteps();
    return totalSteps <= 1 ? 0 : Math.round((currentStep / (totalSteps - 1)) * 100);
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
    propertyType,
    setPropertyType,
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
    isLoading,
    currentStepSubmitHandler,
    setCurrentStepSubmitHandler,
    currentStepIsValid,
    setCurrentStepIsValid,
    areAllStepsValid,
  };

  return (
    <PropertyFormContextV2.Provider value={value}>
      {children}
    </PropertyFormContextV2.Provider>
  );
};
