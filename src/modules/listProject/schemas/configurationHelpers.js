import { CONFIG_TYPE_TO_CATEGORY, PROPERTY_CATEGORY } from './configurationsProjectSchema';

/**
 * Get property category from configuration type
 */
export const getPropertyCategory = (configurationType) => {
  return CONFIG_TYPE_TO_CATEGORY[configurationType] || null;
};

/**
 * Check if configuration type is residential apartment
 */
export const isResidentialApartment = (configurationType) => {
  return getPropertyCategory(configurationType) === PROPERTY_CATEGORY.RESIDENTIAL_APARTMENT;
};

/**
 * Check if configuration type is independent (villa/row house)
 */
export const isResidentialIndependent = (configurationType) => {
  return getPropertyCategory(configurationType) === PROPERTY_CATEGORY.RESIDENTIAL_INDEPENDENT;
};

/**
 * Check if configuration type is plot
 */
export const isPlot = (configurationType) => {
  return getPropertyCategory(configurationType) === PROPERTY_CATEGORY.PLOT;
};

/**
 * Check if configuration type is farm
 */
export const isFarm = (configurationType) => {
  return getPropertyCategory(configurationType) === PROPERTY_CATEGORY.FARM;
};

/**
 * Check if configuration type is commercial
 */
export const isCommercial = (configurationType) => {
  return getPropertyCategory(configurationType) === PROPERTY_CATEGORY.COMMERCIAL;
};

/**
 * Get required area fields based on configuration type
 */
export const getRequiredAreaFields = (configurationType) => {
  const category = getPropertyCategory(configurationType);
  
  switch (category) {
    case PROPERTY_CATEGORY.RESIDENTIAL_APARTMENT:
      return ['superBuiltUpArea'];
    
    case PROPERTY_CATEGORY.RESIDENTIAL_INDEPENDENT:
      return ['plotArea', 'builtUpArea'];
    
    case PROPERTY_CATEGORY.PLOT:
      return ['plotArea'];
    
    case PROPERTY_CATEGORY.FARM:
      return ['plotArea'];
    
    case PROPERTY_CATEGORY.COMMERCIAL:
      return ['builtUpArea']; // or carpetArea
    
    default:
      return [];
  }
};

/**
 * Get hidden fields based on configuration type
 */
export const getHiddenFields = (configurationType) => {
  const category = getPropertyCategory(configurationType);
  
  const hiddenFields = {
    residentialDetails: true,
    independentDetails: true,
    plotDetails: true,
    farmDetails: true,
    commercialDetails: true,
    carpetArea: false,
    builtUpArea: false,
    superBuiltUpArea: false,
    plotArea: false,
  };

  switch (category) {
    case PROPERTY_CATEGORY.RESIDENTIAL_APARTMENT:
      hiddenFields.residentialDetails = false;
      hiddenFields.plotArea = true;
      break;
    
    case PROPERTY_CATEGORY.RESIDENTIAL_INDEPENDENT:
      hiddenFields.independentDetails = false;
      break;
    
    case PROPERTY_CATEGORY.PLOT:
      hiddenFields.plotDetails = false;
      hiddenFields.carpetArea = true;
      hiddenFields.builtUpArea = true;
      hiddenFields.superBuiltUpArea = true;
      break;
    
    case PROPERTY_CATEGORY.FARM:
      hiddenFields.farmDetails = false;
      hiddenFields.carpetArea = true;
      hiddenFields.builtUpArea = true;
      hiddenFields.superBuiltUpArea = true;
      break;
    
    case PROPERTY_CATEGORY.COMMERCIAL:
      hiddenFields.commercialDetails = false;
      hiddenFields.plotArea = true;
      break;
    
    default:
      break;
  }

  return hiddenFields;
};

/**
 * Get default values based on configuration type
 */
export const getDefaultConfigValues = (configurationType) => {
  const category = getPropertyCategory(configurationType);
  
  const defaults = {
    configurationType,
    numberOfUnits: 1,
    available: true,
    floorPlanImages: [],
  };

  switch (category) {
    case PROPERTY_CATEGORY.RESIDENTIAL_APARTMENT:
      defaults.residentialDetails = {
        bedrooms: 0,
        bathrooms: 1,
        balconies: 0,
        servantRoom: false,
        studyRoom: false,
        poojaRoom: false,
      };
      defaults.superBuiltUpArea = {
        min: 0,
        max: 0,
        unit: 'Sq.ft',
      };
      break;
    
    case PROPERTY_CATEGORY.RESIDENTIAL_INDEPENDENT:
      defaults.independentDetails = {
        bedrooms: 3,
        bathrooms: 2,
        floors: 1,
        swimmingPool: false,
        servantQuarters: false,
        basement: false,
      };
      defaults.plotArea = {
        min: 0,
        max: 0,
        unit: 'Sq.ft',
      };
      defaults.builtUpArea = {
        min: 0,
        max: 0,
        unit: 'Sq.ft',
      };
      break;
    
    case PROPERTY_CATEGORY.PLOT:
      defaults.plotDetails = {
        plotType: 'Residential',
        facing: 'North',
        cornerPlot: false,
        boundaryWall: 'None',
        gatedCommunity: false,
        approvedForConstruction: false,
      };
      defaults.plotArea = {
        min: 0,
        max: 0,
        unit: 'Sq.ft',
      };
      break;
    
    case PROPERTY_CATEGORY.FARM:
      defaults.farmDetails = {
        farmType: 'Agricultural',
        electricityAvailable: false,
        farmhouseExists: false,
      };
      defaults.plotArea = {
        min: 0,
        max: 0,
        unit: 'Acres',
      };
      break;
    
    case PROPERTY_CATEGORY.COMMERCIAL:
      defaults.commercialDetails = {
        washrooms: 0,
        pantry: false,
        parkingSpaces: 0,
        powerBackup: false,
        airConditioned: false,
        loadingDock: false,
      };
      defaults.builtUpArea = {
        min: 0,
        max: 0,
        unit: 'Sq.ft',
      };
      break;
    
    default:
      break;
  }

  return defaults;
};

/**
 * Get configuration type options grouped by category
 */
export const getConfigurationTypeOptions = () => {
  return {
    'Residential - Apartments': [
      '1 RK',
      '1 BHK',
      '2 BHK',
      '3 BHK',
      '4 BHK',
      '5 BHK',
      '6+ BHK',
      'Studio',
      'Penthouse',
      'Duplex',
    ],
    'Residential - Independent': [
      'Villa',
      'Row House',
      'Bungalow',
    ],
    'Plots': [
      'Residential Plot',
      'Commercial Plot',
      'Agricultural Plot',
      'Industrial Plot',
    ],
    'Farms': [
      'Farm Land',
      'Farm House',
    ],
    'Commercial': [
      'Shop',
      'Office Space',
      'Showroom',
      'Warehouse',
      'Co-working Space',
      'Commercial Building',
    ],
  };
};

/**
 * Validate if floor plans are required
 */
export const areFloorPlansRequired = (configurationType) => {
  const category = getPropertyCategory(configurationType);
  
  // Floor plans are not mandatory for plots and raw farm land
  return category !== PROPERTY_CATEGORY.PLOT && 
         !(category === PROPERTY_CATEGORY.FARM && configurationType === 'Farm Land');
};

/**
 * Get appropriate area unit options based on configuration type
 */
export const getAreaUnitOptions = (configurationType) => {
  const category = getPropertyCategory(configurationType);
  
  if (category === PROPERTY_CATEGORY.FARM) {
    return ['Acres', 'Hectares', 'Sq.ft', 'Sq.m'];
  }
  
  if (category === PROPERTY_CATEGORY.PLOT) {
    return ['Sq.ft', 'Sq.m', 'Sq.yd', 'Acres'];
  }
  
  return ['Sq.ft', 'Sq.m', 'Sq.yd'];
};

/**
 * Format configuration display name
 */
export const formatConfigurationName = (config) => {
  if (!config) return '';
  
  const { configurationType, numberOfUnits } = config;
  const category = getPropertyCategory(configurationType);
  
  let details = [];
  
  if (category === PROPERTY_CATEGORY.RESIDENTIAL_APARTMENT && config.residentialDetails) {
    if (config.residentialDetails.bedrooms) {
      details.push(`${config.residentialDetails.bedrooms} Bed`);
    }
    if (config.residentialDetails.bathrooms) {
      details.push(`${config.residentialDetails.bathrooms} Bath`);
    }
  }
  
  if (category === PROPERTY_CATEGORY.RESIDENTIAL_INDEPENDENT && config.independentDetails) {
    details.push(`${config.independentDetails.bedrooms} Bed`);
    details.push(`${config.independentDetails.bathrooms} Bath`);
    details.push(`${config.independentDetails.floors} Floor${config.independentDetails.floors > 1 ? 's' : ''}`);
  }
  
  const detailsStr = details.length > 0 ? ` (${details.join(', ')})` : '';
  return `${configurationType}${detailsStr} - ${numberOfUnits} Unit${numberOfUnits > 1 ? 's' : ''}`;
};
