/**
 * Project types and configurations for real estate projects
 */

export const PROJECT_TYPES = [
  {
    category: 'Residential',
    types: [
      { 
        value: 'apartment_complex', 
        label: 'Apartment Complex', 
        icon: 'Building2',
        description: 'Multi-story residential complex'
      },
      { 
        value: 'villa_community', 
        label: 'Villa Community', 
        icon: 'Home',
        description: 'Gated villa development'
      },
      { 
        value: 'township', 
        label: 'Township', 
        icon: 'Building',
        description: 'Large integrated township'
      },
      { 
        value: 'row_houses', 
        label: 'Row Houses', 
        icon: 'Home',
        description: 'Connected row housing'
      },
      { 
        value: 'plotted_development', 
        label: 'Plotted Development', 
        icon: 'LandPlot',
        description: 'Residential plots'
      },
    ],
  },
  {
    category: 'Commercial',
    types: [
      { 
        value: 'office_complex', 
        label: 'Office Complex', 
        icon: 'Building2',
        description: 'Commercial office spaces'
      },
      { 
        value: 'retail_mall', 
        label: 'Retail Mall', 
        icon: 'ShoppingBag',
        description: 'Shopping center'
      },
      { 
        value: 'business_park', 
        label: 'Business Park', 
        icon: 'Building',
        description: 'Business campus'
      },
      { 
        value: 'mixed_use', 
        label: 'Mixed Use', 
        icon: 'Building2',
        description: 'Residential + Commercial'
      },
    ],
  },
];

export const PROJECT_STATUS = [
  { value: 'upcoming', label: 'Upcoming', color: 'blue' },
  { value: 'under_construction', label: 'Under Construction', color: 'orange' },
  { value: 'ready_to_move', label: 'Ready to Move', color: 'green' },
  { value: 'completed', label: 'Completed', color: 'purple' },
];

export const POSSESSION_STATUS = [
  { value: 'immediate', label: 'Immediate', description: 'Ready for possession' },
  { value: 'within_3_months', label: 'Within 3 Months', description: '1-3 months' },
  { value: 'within_6_months', label: 'Within 6 Months', description: '3-6 months' },
  { value: 'within_1_year', label: 'Within 1 Year', description: '6-12 months' },
  { value: 'more_than_1_year', label: 'More than 1 Year', description: '12+ months' },
];

export const APPROVAL_AUTHORITIES = [
  'Municipal Corporation',
  'Development Authority',
  'RERA',
  'Housing Board',
  'Panchayat',
  'Other',
];

export const UNIT_CONFIGURATIONS = [
  { value: '1bhk', label: '1 BHK' },
  { value: '1.5bhk', label: '1.5 BHK' },
  { value: '2bhk', label: '2 BHK' },
  { value: '2.5bhk', label: '2.5 BHK' },
  { value: '3bhk', label: '3 BHK' },
  { value: '3.5bhk', label: '3.5 BHK' },
  { value: '4bhk', label: '4 BHK' },
  { value: '4bhk+', label: '4+ BHK' },
  { value: 'studio', label: 'Studio' },
  { value: 'penthouse', label: 'Penthouse' },
];
