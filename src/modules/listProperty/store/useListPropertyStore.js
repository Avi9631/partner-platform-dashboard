import { create } from 'zustand';

const useListPropertyStore = create((set, get) => ({
  // Current step (0-based index, but starts from 1 after property type selection)
  currentStep: 0,
  
  // Form data
  formData: {
    // Step 1: Property Type
    propertyType: null, // 'apartment', 'villa', 'plot', 'farmhouse', etc.
    
    // Step 2: Basic Details
    projectName: '',
    city: '',
    geoLocation: { lat: null, lng: null },
    addressText: '',
    ageOfProperty: '',
    possessionStatus: 'ready', // 'ready', 'under_construction', 'resale'
    possessionDate: null,
    
    // Step 3: Building Attributes (conditional)
    bedrooms: '',
    additionalRooms: [],
    carpetArea: '',
    superArea: '',
    furnishingStatus: 'unfurnished', // 'unfurnished', 'semi', 'fully'
    furnishingDetails: {},
    bathrooms: '',
    balconies: '',
    balconyType: 'standard',
    coveredParking: '',
    openParking: '',
    powerBackup: 'none',
    facing: '',
    view: '',
    flooringTypes: [],
    towerName: '',
    floorNumber: '',
    totalFloors: '',
    unitNumber: '',
    isUnitNumberPrivate: false,
    
    // Step 4: Land Attributes (conditional)
    plotArea: '',
    areaUnit: 'sqft',
    plotDimension: '',
    landUse: 'residential',
    roadWidth: '',
    fencing: false,
    irrigationSource: '',
    
    // Step 5: Listing Details
    listingType: 'sale', // 'sale', 'rent', 'lease'
    price: '',
    priceUnit: 'total',
    maintenanceCharges: '',
    availableFrom: null,
    suitableFor: [],
    title: '',
    description: '',
    amenities: [],
  },
  
  // Validation state
  stepValidation: {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
  },
  
  // Actions
  setCurrentStep: (step) => set({ currentStep: step }),
  
  nextStep: () => {
    const { currentStep } = get();
    const totalSteps = get().getTotalSteps();
    if (currentStep < totalSteps - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },
  
  previousStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },
  
  updateFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data }
    }));
    // Update step 2 validation when building attributes change
    const { formData } = get();
    const isStep2Valid = !!(
      formData.bedrooms &&
      formData.bathrooms &&
      formData.carpetArea &&
      formData.superArea
    );
    get().updateStepValidation(2, isStep2Valid);
  },
  
  updateStepValidation: (step, isValid) => set((state) => ({
    stepValidation: { ...state.stepValidation, [step]: isValid }
  })),
  
  resetForm: () => set({
    currentStep: 0, // Reset to 0 to show property type selector
    formData: {
      propertyType: null,
      projectName: '',
      city: '',
      geoLocation: { lat: null, lng: null },
      addressText: '',
      ageOfProperty: '',
      possessionStatus: 'ready',
      possessionDate: null,
      bedrooms: '',
      additionalRooms: [],
      carpetArea: '',
      superArea: '',
      furnishingStatus: 'unfurnished',
      furnishingDetails: {},
      bathrooms: '',
      balconies: '',
      balconyType: 'standard',
      coveredParking: '',
      openParking: '',
      powerBackup: 'none',
      facing: '',
      view: '',
      flooringTypes: [],
      towerName: '',
      floorNumber: '',
      totalFloors: '',
      unitNumber: '',
      isUnitNumberPrivate: false,
      plotArea: '',
      areaUnit: 'sqft',
      plotDimension: '',
      landUse: 'residential',
      roadWidth: '',
      fencing: false,
      irrigationSource: '',
      listingType: 'sale',
      price: '',
      priceUnit: 'total',
      maintenanceCharges: '',
      availableFrom: null,
      suitableFor: [],
      title: '',
      description: '',
      amenities: [],
    },
    stepValidation: {
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
    },
  }),
  
  // Get total steps based on property type
  getTotalSteps: () => {
    const { formData } = get();
    const isBuildingType = get().isBuildingType();
    const isLandType = get().isLandType();
    
    if (isBuildingType) {
      // Steps: BasicDetails(1), BasicConfig(2), AreaDetails(3), Furnishing(4), 
      // Parking(5), Location(6), FloorDetails(7-if apt/penthouse), ListingDetails(8/9), Review(9/10)
      if (['apartment', 'penthouse'].includes(formData.propertyType)) {
        return 10; // All steps including FloorDetails
      }
      return 9; // Skip FloorDetails for other building types
    } else if (isLandType) {
      // Steps: BasicDetails(1), LandAttributes(2), ListingDetails(3), Review(4)
      return 5;
    }
    
    // Default fallback (property type not selected yet)
    return 1;
  },
  
  // Check if current property type needs building or land attributes
  isBuildingType: () => {
    const { formData } = get();
    return ['apartment', 'villa', 'duplex', 'independent_house', 
            'penthouse', 'studio', 'independent_floor'].includes(formData.propertyType);
  },
  
  isLandType: () => {
    const { formData } = get();
    return ['plot', 'farmhouse', 'agricultural_land'].includes(formData.propertyType);
  },
}));

export default useListPropertyStore;
