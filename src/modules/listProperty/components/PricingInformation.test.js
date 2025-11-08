// Test file to verify the dynamic pricing structure works correctly
import pricingInformationSchema from '../schemas/pricingInformationSchema';

// Test data for sale listing
const saleData = {
  listingType: 'sale',
  pricing: [
    {
      type: 'asking_price',
      value: '5000000',
      unit: 'total'
    },
    {
      type: 'brokerage_fee',
      value: '2',
      unit: 'percentage'
    }
  ],
  isPriceNegotiable: true,
  availableFrom: '2024-01-01'
};

// Test data for rent listing
const rentData = {
  listingType: 'rent',
  pricing: [
    {
      type: 'monthly_rent',
      value: '25000',
      unit: 'total'
    },
    {
      type: 'security_deposit',
      value: '50000',
      unit: 'total'
    },
    {
      type: 'maintenance_charges',
      value: '2000',
      unit: 'monthly'
    }
  ],
  isPriceNegotiable: false,
  availableFrom: '2024-02-01'
};

// Test data for lease listing
const leaseData = {
  listingType: 'lease',
  pricing: [
    {
      type: 'lease_amount',
      value: '1000000',
      unit: 'total'
    },
    {
      type: 'security_deposit',
      value: '100000',
      unit: 'total'
    }
  ],
  isPriceNegotiable: true
};

// Validation tests
console.log('Testing Sale Data:', pricingInformationSchema.safeParse(saleData));
console.log('Testing Rent Data:', pricingInformationSchema.safeParse(rentData));
console.log('Testing Lease Data:', pricingInformationSchema.safeParse(leaseData));

// Test invalid data (missing primary pricing type)
const invalidData = {
  listingType: 'sale',
  pricing: [
    {
      type: 'brokerage_fee',
      value: '50000',
      unit: 'total'
    }
  ]
};

console.log('Testing Invalid Data:', pricingInformationSchema.safeParse(invalidData));