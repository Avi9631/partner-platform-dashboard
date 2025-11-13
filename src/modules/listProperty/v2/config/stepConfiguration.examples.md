# Step Configuration Examples

This document shows various examples of how to configure dynamic steps based on form data.

## Basic Usage

The step configuration system allows you to show/hide steps based on any form field value, not just property type.

## Example 1: Show Step Based on Possession Status

```javascript
{
  id: 'possession-date',
  name: 'Possession Date',
  component: PossessionDateStepV2,
  category: STEP_CATEGORIES.OPTIONAL,
  // Only show if possession status is "under_construction"
  isVisible: (formData) => formData.possessionStatus === 'under_construction',
  order: 11.5, // Between pricing and suitable-for
}
```

## Example 2: Show Step Based on Multiple Conditions

```javascript
{
  id: 'ev-charging-details',
  name: 'EV Charging Details',
  component: EVChargingDetailsStepV2,
  category: STEP_CATEGORIES.OPTIONAL,
  // Show only for building types with EV charging enabled
  isVisible: (formData) => {
    const hasBuilding = PROPERTY_GROUPS.BUILDING.includes(formData.propertyType);
    const hasEVCharging = formData.evChargingType && formData.evChargingType !== 'none';
    return hasBuilding && hasEVCharging;
  },
  order: 7.5, // After parking step
}
```

## Example 3: Show Step Based on Numeric Values

```javascript
{
  id: 'visitor-parking-management',
  name: 'Visitor Parking Management',
  component: VisitorParkingStepV2,
  category: STEP_CATEGORIES.OPTIONAL,
  // Show if visitor parking is available and has more than 5 spaces
  isVisible: (formData) => {
    return formData.hasVisitorParking && 
           parseInt(formData.visitorParkingSpaces || 0) > 5;
  },
  order: 8.5,
}
```

## Example 4: Show Step Based on Array/List Values

```javascript
{
  id: 'rera-verification',
  name: 'RERA Verification',
  component: RERAVerificationStepV2,
  category: STEP_CATEGORIES.OPTIONAL,
  // Show if property has RERA IDs registered
  isVisible: (formData) => {
    const reraIds = formData.reraIds || [];
    return reraIds.length > 0 && reraIds.some(rera => rera.id && rera.id.trim());
  },
  order: 3.5, // After basic details
}
```

## Example 5: Complex Business Logic

```javascript
{
  id: 'premium-amenities',
  name: 'Premium Amenities',
  component: PremiumAmenitiesStepV2,
  category: STEP_CATEGORIES.OPTIONAL,
  // Show for premium properties (based on multiple criteria)
  isVisible: (formData) => {
    const isPremiumPropertyType = ['villa', 'penthouse'].includes(formData.propertyType);
    const isLargeBHK = parseInt(formData.bedrooms || 0) >= 4;
    const hasFullBackup = formData.powerBackup === 'full';
    const hasPremiumFurnishing = formData.furnishingLevel === 'fully_furnished';
    
    // Show if it's a premium type OR has 4+ BHK with premium features
    return isPremiumPropertyType || (isLargeBHK && hasFullBackup && hasPremiumFurnishing);
  },
  order: 13.5, // After standard amenities
}
```

## Example 6: Location-Based Conditional Steps

```javascript
{
  id: 'metro-connectivity',
  name: 'Metro Connectivity',
  component: MetroConnectivityStepV2,
  category: STEP_CATEGORIES.OPTIONAL,
  // Show only for properties in metro cities
  isVisible: (formData) => {
    const metroCities = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad'];
    return metroCities.includes(formData.city);
  },
  order: 8.5,
}
```

## Example 7: Ownership-Based Steps

```javascript
{
  id: 'poa-documents',
  name: 'Power of Attorney Documents',
  component: POADocumentsStepV2,
  category: STEP_CATEGORIES.OPTIONAL,
  // Show only for POA ownership type
  isVisible: (formData) => formData.ownershipType === 'poa',
  order: 3.5,
}
```

## Example 8: Pricing-Based Premium Features

```javascript
{
  id: 'luxury-features',
  name: 'Luxury Features',
  component: LuxuryFeaturesStepV2,
  category: STEP_CATEGORIES.OPTIONAL,
  // Show for properties above certain price point
  isVisible: (formData) => {
    const price = parseFloat(formData.price || 0);
    return price >= 50000000; // 5 Crore
  },
  order: 13.5,
}
```

## Example 9: Land-Specific Conditional Steps

```javascript
{
  id: 'agricultural-details',
  name: 'Agricultural Details',
  component: AgriculturalDetailsStepV2,
  category: STEP_CATEGORIES.LAND,
  // Show only for agricultural land
  isVisible: (formData) => formData.propertyType === 'agricultural_land',
  order: 4.5,
},
{
  id: 'soil-analysis',
  name: 'Soil Analysis',
  component: SoilAnalysisStepV2,
  category: STEP_CATEGORIES.OPTIONAL,
  // Show if agricultural land and user wants to add soil details
  isVisible: (formData) => {
    return formData.propertyType === 'agricultural_land' && 
           formData.includeSoilAnalysis === true;
  },
  order: 4.6,
}
```

## Example 10: Cascade Conditions (Step depends on previous step)

```javascript
{
  id: 'floor-details',
  name: 'Floor Details',
  component: FloorDetailsStepV2,
  category: STEP_CATEGORIES.BUILDING,
  // Show for apartment-like properties
  isVisible: (formData) => 
    PROPERTY_GROUPS.APARTMENT_LIKE.includes(formData.propertyType),
  order: 9,
},
{
  id: 'elevator-details',
  name: 'Elevator Details',
  component: ElevatorDetailsStepV2,
  category: STEP_CATEGORIES.OPTIONAL,
  // Show only if floor details indicate property is on higher floors
  isVisible: (formData) => {
    const totalFloor = parseInt(formData.totalFloors || 0);
    const propertyFloor = parseInt(formData.floorNumber || 0);
    return PROPERTY_GROUPS.APARTMENT_LIKE.includes(formData.propertyType) && 
           (totalFloor > 4 || propertyFloor > 3);
  },
  order: 9.5,
}
```

## How to Add a New Conditional Step

1. **Create your step component** (e.g., `MyNewStepV2.jsx`)
2. **Import it** in `stepConfiguration.js`
3. **Add configuration** to the `STEP_CONFIG` array:

```javascript
{
  id: 'my-new-step',
  name: 'My New Step',
  component: MyNewStepV2,
  category: STEP_CATEGORIES.OPTIONAL,
  isVisible: (formData) => {
    // Your condition logic here
    return formData.someField === 'someValue';
  },
  order: 10.5, // Position in the flow
}
```

4. **Test** by setting the condition in previous steps

## Order Values

- Use decimal values (e.g., 8.5) to insert steps between existing steps
- Lower order = earlier in the flow
- Steps are automatically sorted by order value
- Order is applied within visible steps only

## Best Practices

1. **Keep conditions simple** - Complex logic should be extracted to helper functions
2. **Use defensive checks** - Always check if fields exist before accessing
3. **Provide defaults** - Use `|| 0`, `|| ''`, `|| []` for potentially undefined values
4. **Test edge cases** - What happens when form is partially filled?
5. **Consider UX** - Don't show/hide steps too frequently (confusing for users)
6. **Use categories** - Organize related steps with category constants

## Performance Considerations

- The `isVisible` function runs frequently (on every form data change)
- Keep logic lightweight
- Memoize expensive calculations in the context if needed
- The system automatically memoizes visible steps based on form data

## Debugging Tips

Enable console logging to see which steps are visible:

```javascript
const visibleSteps = getVisibleSteps(formData);
console.log('Visible steps:', visibleSteps.map(s => s.name));
```

Check if a specific step is visible:

```javascript
const isVisible = isStepVisible('my-step-id', formData);
console.log('Is my step visible?', isVisible);
```
