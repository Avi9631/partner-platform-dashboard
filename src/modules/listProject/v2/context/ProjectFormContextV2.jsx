import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useForm, FormProvider as RHFFormProvider } from 'react-hook-form';
import { getTotalVisibleSteps } from '../config/stepConfigurationProject';
import { draftApi } from '@/services/draftService';

const ProjectFormContextV2 = createContext(null);

export const useProjectFormV2 = () => {
  const context = useContext(ProjectFormContextV2);
  if (!context) {
    if (import.meta.env.DEV) {
      console.error('useProjectFormV2 must be used within ProjectFormProviderV2');
      return null;
    }
    throw new Error('useProjectFormV2 must be used within ProjectFormProviderV2');
  }
  return context;
};

export const ProjectFormProviderV2 = ({ children, onClose, initialDraftId, editingDraft }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [draftId, setDraftId] = useState(initialDraftId || null);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  
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
      console.log('Fetching Project draft data for ID:', id);
      
      const response = await draftApi.getListingDraftById(id);
      
      if (response.success && response.data) {
        console.log('Project draft data fetched successfully:', response.data);
        
        // Set form data from fetched draft
        if (response.data.draftData) {
          setFormData(response.data.draftData);
          console.log('Form data populated from draft');
        }
        
        // Mark all steps as not completed (user can edit any step)
        setCompletedSteps(new Set());
        
        // Start from the first step
        setCurrentStep(0);
      } else {
        console.error('Failed to fetch Project draft data:', response);
      }
    } catch (error) {
      console.error('Error fetching Project draft data:', error);
    } finally {
      setIsLoadingDraft(false);
    }
  }, []);

  // Load draft data when editingDraft is provided (legacy support)
  const loadDraftData = useCallback(() => {
    if (editingDraft && editingDraft.draftData) {
      setIsLoadingDraft(true);
      console.log('Loading Project draft data for editing:', editingDraft);
      
      // Set form data from draft
      setFormData(editingDraft.draftData);
  
      // Mark all steps as not completed (user can edit any step)
      setCompletedSteps(new Set());
      
      // Start from the first step
      setCurrentStep(0);
      
      setIsLoadingDraft(false);
      console.log('Project draft data loaded successfully');
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

  // Memoize the form data
  const formDataWithType = useMemo(() => ({
    ...formData,
  }), [formData]);

  // Get total steps
  const getTotalSteps = useCallback(() => {
    return getTotalVisibleSteps(formDataWithType);
  }, [formDataWithType]);

  // Update form data in context
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
      console.log('No draft ID exists, creating new Project draft...');
      try {
        setIsCreatingDraft(true);
        const createResponse = await draftApi.createListingDraft('PROJECT');
        
        if (createResponse.success && createResponse.data?.draftId) {
          currentDraftId = createResponse.data.draftId;
          console.log('✅ New Project draft created with ID:', currentDraftId);
          setDraftId(currentDraftId);
          setIsCreatingDraft(false);
        } else {
          console.warn('⚠️ Failed to create Project draft:', createResponse);
          setIsCreatingDraft(false);
          return { success: false, message: 'Failed to create draft' };
        }
      } catch (error) {
        console.error('❌ Error creating Project draft:', error);
        setIsCreatingDraft(false);
        return { success: false, error: error.message };
      }
    }

    // Update draft with actual data
    try {
      console.log('Calling updateListingDraft API...', {
        draftId: currentDraftId,
        dataKeys: Object.keys(updatedData || formData),
      });

      const updateResponse = await draftApi.updateListingDraft(
        currentDraftId,
        updatedData || formData
      );

      if (updateResponse.success) {
        console.log('✅ Project draft updated successfully');
        return { success: true, draftId: currentDraftId };
      } else {
        console.warn('⚠️ Failed to update Project draft:', updateResponse);
        return { success: false, message: updateResponse.message || 'Failed to update draft' };
      }
    } catch (error) {
      console.error('❌ Error updating Project draft:', error);
      return { success: false, error: error.message };
    }
  }, [draftId, formData]);

  // Save and continue to next step
  const saveAndContinue = useCallback(async (stepData) => {
    // Update form data in context
    const updatedFormData = { ...formData, ...stepData };
    updateFormData(stepData);
    
    // Save to backend
    const saveResult = await saveDraft(updatedFormData);
    
    if (saveResult.success) {
      // Mark current step as completed
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      
      // Move to next step
      const totalSteps = getTotalSteps();
      if (currentStep < totalSteps - 1) {
        setCurrentStep(prev => prev + 1);
      }
      
      return { success: true };
    } else {
      console.error('Failed to save draft:', saveResult);
      return { success: false, message: saveResult.message || saveResult.error };
    }
  }, [formData, updateFormData, saveDraft, currentStep, getTotalSteps]);

  // Go back to previous step
  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Go to specific step (if completed or current)
  const goToStep = useCallback((stepIndex) => {
    if (stepIndex <= currentStep || completedSteps.has(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  }, [currentStep, completedSteps]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({});
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setDraftId(null);
    methods.reset();
  }, [methods]);

  const value = useMemo(() => ({
    // State
    currentStep,
    completedSteps,
    formData,
    formDataWithType,
    draftId,
    isCreatingDraft,
    isLoadingDraft,
    
    // Methods
    setCurrentStep,
    updateFormData,
    saveAndContinue,
    goToPreviousStep,
    goToStep,
    resetForm,
    getTotalSteps,
    saveDraft,
    
    // React Hook Form methods
    methods,
  }), [
    currentStep,
    completedSteps,
    formData,
    formDataWithType,
    draftId,
    isCreatingDraft,
    isLoadingDraft,
    updateFormData,
    saveAndContinue,
    goToPreviousStep,
    goToStep,
    resetForm,
    getTotalSteps,
    saveDraft,
    methods,
  ]);

  return (
    <ProjectFormContextV2.Provider value={value}>
      <RHFFormProvider {...methods}>
        {children}
      </RHFFormProvider>
    </ProjectFormContextV2.Provider>
  );
};

export default ProjectFormContextV2;
