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
  
  // Initialize React Hook Form
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      // Property Type (Step 0)
      propertyType: null,
      
      // Basic Details (Step 1)
      ownershipType: 'freehold',
      projectName: '',
      reraId: '',
      city: '',
      locality: '',
      addressText: '',
      landmark: '',
      coordinates: null,
      showMapExact: false,
      ageOfProperty: '',
      possessionStatus: 'ready',
      possessionDate: '',
      
      // Basic Configuration (Step 2 - Building)
      bedrooms: '',
      bathrooms: '',
      balconies: '',
      balconyType: '',
      kitchenType: '',
      ceilingHeight: '',
      additionalRooms: [],
      
      // Area Details (Step 3 - Building)
      carpetArea: '',
      superArea: '',
      
      // Furnishing & Amenities (Step 4 - Building)
      furnishingStatus: 'unfurnished',
      furnishingDetails: {},
      flooringTypes: [],
      
      // Parking & Utilities (Step 5 - Building)
      coveredParking: '',
      openParking: '',
      powerBackup: 'none',
      waterSupply: '',
      
      // Location Attributes (Step 6 - Building)
      facing: '',
      view: '',
      
      // Floor Details (Step 7 - Building, conditional)
      towerName: '',
      floorNumber: '',
      totalFloors: '',
      unitNumber: '',
      isUnitNumberPrivate: false,
      
      // Land Attributes (Step 2 - Land)
      plotArea: '',
      areaUnit: 'sqft',
      plotDimension: '',
      landUse: '',
      roadWidth: '',
      fencing: false,
      irrigationSource: '',
      
      // Pricing Information
      listingType: 'sale',
      price: '',
      priceUnit: 'total',
      maintenanceCharges: '',
      availableFrom: '',
      
      // Suitable For
      suitableFor: [],
      
      // Listing Information
      title: '',
      description: '',
      
      // Amenities
      amenities: [],
    },
  });

  // Get total steps based on property type
  const getTotalSteps = useCallback(() => {
    const isBuildingType = ['apartment', 'villa', 'duplex', 'independent_house', 
                            'penthouse', 'studio', 'independent_floor'].includes(propertyType);
    const isLandType = ['plot', 'farmhouse', 'agricultural_land'].includes(propertyType);
    
    if (isBuildingType) {
      if (['apartment', 'penthouse'].includes(propertyType)) {
        // 0: PropertyType, 1: BasicDetails, 2: BasicConfig, 3: AreaDetails, 
        // 4: Furnishing, 5: Parking, 6: Location, 7: FloorDetails, 
        // 8: Pricing, 9: SuitableFor, 10: ListingInfo, 11: Amenities, 12: Review
        return 13;
      }
      // Other building types (no floor details)
      // 0: PropertyType, 1: BasicDetails, 2: BasicConfig, 3: AreaDetails, 
      // 4: Furnishing, 5: Parking, 6: Location, 
      // 7: Pricing, 8: SuitableFor, 9: ListingInfo, 10: Amenities, 11: Review
      return 12;
    } else if (isLandType) {
      // 0: PropertyType, 1: BasicDetails, 2: LandAttributes, 
      // 3: Pricing, 4: ListingInfo, 5: Amenities, 6: Review
      return 7;
    }
    
    // Default (only property type selector)
    return 1;
  }, [propertyType]);

  // Navigate to next step with "Save & Continue"
  const saveAndContinue = useCallback(() => {
    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    
    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, getTotalSteps]);

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
    methods.reset();
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
    formData: methods.watch(),
  };

  return (
    <PropertyFormContextV2.Provider value={value}>
      <RHFFormProvider {...methods}>{children}</RHFFormProvider>
    </PropertyFormContextV2.Provider>
  );
};
