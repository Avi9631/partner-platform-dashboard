import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { getTotalVisibleSteps, getVisibleSteps } from '../config/stepConfiguration';
import { draftApi } from '@/services/draftService';
import { validateAllSteps } from '../utils/schemaMapping';

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
        hasData = !!(
          formData.address || 
          formData.city ||
          formData.state ||
          formData.pincode ||
          formData.latitude || 
          formData.longitude
        );
        break;
        
      case 'basic-details':
        hasData = !!(
          formData.propertyName ||
          formData.listingType ||
          formData.propertyAge ||
          formData.description
        );
        break;
        
      case 'basic-configuration':
        hasData = !!(
          formData.bedrooms !== undefined ||
          formData.bathrooms !== undefined ||
          formData.balconies !== undefined ||
          formData.carpetArea ||
          formData.builtUpArea ||
          formData.superBuiltUpArea
        );
        break;
        
      case 'land-attributes':
        hasData = !!(
          formData.plotArea ||
          formData.plotLength ||
          formData.plotWidth ||
          formData.boundaryWall ||
          formData.facingDirection
        );
        break;
        
      case 'furnishing':
        hasData = !!(
          formData.furnishingStatus ||
          formData.furnishingDetails ||
          (formData.furnishingItems && formData.furnishingItems.length > 0)
        );
        break;
        
      case 'location-attributes':
        hasData = !!(
          formData.nearbyPlaces ||
          formData.locationAdvantages ||
          formData.distanceFromMainRoad
        );
        break;
        
      case 'floor-details':
        hasData = !!(
          formData.floorNumber !== undefined ||
          formData.totalFloors !== undefined ||
          formData.floorType
        );
        break;
        
      case 'pricing':
        hasData = !!(
          formData.price !== undefined ||
          formData.expectedPrice ||
          formData.rentAmount ||
          formData.securityDeposit ||
          formData.maintenanceCharges
        );
        break;
        
      case 'suitable-for':
        hasData = !!(
          formData.suitableFor ||
          (formData.preferredTenants && formData.preferredTenants.length > 0)
        );
        break;
        
      case 'listing-info':
        hasData = !!(
          formData.availableFrom ||
          formData.possessionStatus ||
          formData.ownershipType
        );
        break;
        
      case 'amenities':
        hasData = !!(
          formData.amenities && 
          typeof formData.amenities === 'object' && 
          Object.keys(formData.amenities).length > 0 &&
          Object.values(formData.amenities).some(val => val === true || val === 'yes' || val)
        );
        break;
        
      case 'media-upload':
        hasData = !!(
          (formData.mediaData && Array.isArray(formData.mediaData) && formData.mediaData.length > 0)
        );
        break;
        
      case 'property-plan-upload':
        hasData = !!(
          formData.floorPlans && 
          Array.isArray(formData.floorPlans) && 
          formData.floorPlans.length > 0
        );
        break;
        
      case 'document-upload':
        hasData = !!(
          formData.documents && 
          Array.isArray(formData.documents) && 
          formData.documents.length > 0
        );
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
  const [formData, setFormData] = useState({});
  const [currentStepSubmitHandler, setCurrentStepSubmitHandler] = useState(null);
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
          if (draftData.propertyType) {
            setPropertyType(draftData.propertyType);
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

  const formDataWithType = useMemo(() => ({
    ...formData,
    propertyType,
  }), [formData, propertyType]);

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

  const updateFormData = useCallback((stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }));
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

  const saveAndContinue = useCallback(async (stepData) => {
    const updatedFormData = { ...formData, ...stepData };
    updateFormData(stepData);
    
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
  }, [currentStep, getTotalSteps, updateFormData, formData, saveDraft]);

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
    draftId,
    setDraftId,
    saveDraft,
    isLoading,
    currentStepSubmitHandler,
    setCurrentStepSubmitHandler,
    areAllStepsValid,
  };

  return (
    <PropertyFormContextV2.Provider value={value}>
      {children}
    </PropertyFormContextV2.Provider>
  );
};
