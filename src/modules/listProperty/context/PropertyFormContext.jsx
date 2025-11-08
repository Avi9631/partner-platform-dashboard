import { createContext, useContext, useState } from 'react';
import { useForm, FormProvider as RHFFormProvider } from 'react-hook-form';

const PropertyFormContext = createContext(null);

export const usePropertyForm = () => {
  const context = useContext(PropertyFormContext);
  if (!context) {
    throw new Error('usePropertyForm must be used within PropertyFormProvider');
  }
  return context;
};

export const PropertyFormProvider = ({ children, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [propertyType, setPropertyType] = useState(null);
  const [openSection, setOpenSection] = useState(null);

  // Initialize React Hook Form without validation at the top level
  // Each step will handle its own validation
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      // Property Type (Step 0)
      propertyType: null,
      
      // Basic Details (Step 1)
      projectName: '',
      city: '',
      geoLocation: { lat: null, lng: null },
      addressText: '',
      ageOfProperty: '',
      possessionStatus: 'ready',
      possessionDate: null,
      
      // Basic Configuration (Step 2 - Building)
      bedrooms: '',
      bathrooms: '',
      balconies: '',
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
      availableFrom: null,
      
      // Suitable For
      suitableFor: [],
      
      // Listing Information
      title: '',
      description: '',
      
      // Amenities
      amenities: [],
    },
  });

  // Step validation state
  const [stepValidation, setStepValidation] = useState({});

  const updateStepValidation = (step, isValid) => {
    setStepValidation((prev) => ({ ...prev, [step]: isValid }));
  };

  const nextStep = () => {
    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const resetForm = () => {
    methods.reset();
    setCurrentStep(0);
    setPropertyType(null);
    setStepValidation({});
  };

  // Get total steps based on property type
  const getTotalSteps = () => {
    const isBuildingType = ['apartment', 'villa', 'duplex', 'independent_house', 
                            'penthouse', 'studio', 'independent_floor'].includes(propertyType);
    const isLandType = ['plot', 'farmhouse', 'agricultural_land'].includes(propertyType);
    
    if (isBuildingType) {
      // Building types with floor details (apartments, penthouses)
      if (['apartment', 'penthouse'].includes(propertyType)) {
        // Steps: PropertyType(0), BasicDetails(1), BasicConfig(2), AreaDetails(3), 
        // Furnishing(4), Parking(5), Location(6), FloorDetails(7), 
        // Pricing(8), SuitableFor(9), ListingInfo(10), Amenities(11), Review(12)
        return 13;
      }
      // Other building types (no floor details)
      // Steps: PropertyType(0), BasicDetails(1), BasicConfig(2), AreaDetails(3), 
      // Furnishing(4), Parking(5), Location(6), 
      // Pricing(7), SuitableFor(8), ListingInfo(9), Amenities(10), Review(11)
      return 12;
    } else if (isLandType) {
      // Land types
      // Steps: PropertyType(0), BasicDetails(1), LandAttributes(2), 
      // Pricing(3), ListingInfo(4), Amenities(5), Review(6)
      return 7;
    }
    
    // Default (only property type selector)
    return 1;
  };

  const isBuildingType = () => {
    return ['apartment', 'villa', 'duplex', 'independent_house', 
            'penthouse', 'studio', 'independent_floor'].includes(propertyType);
  };

  const isLandType = () => {
    return ['plot', 'farmhouse', 'agricultural_land'].includes(propertyType);
  };

  const value = {
    currentStep,
    setCurrentStep,
    nextStep,
    previousStep,
    goToStep,
    resetForm,
    getTotalSteps,
    isBuildingType,
    isLandType,
    propertyType,
    setPropertyType,
    stepValidation,
    updateStepValidation,
    onClose,
    openSection,
    setOpenSection,
    formData: methods.getValues(),
  };

  return (
    <PropertyFormContext.Provider value={value}>
      <RHFFormProvider {...methods}>{children}</RHFFormProvider>
    </PropertyFormContext.Provider>
  );
};
