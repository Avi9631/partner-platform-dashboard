# Missing Fields - Quick Reference Guide

## 🎯 Quick Summary

**Total Fields in Spec:** 66  
**Implemented:** 64 (97%)  
**Missing:** 2 (3%)

---

## ✅ Newly Implemented Fields (24 Total)

### BasicDetails.jsx (5 new fields)
```javascript
ownership_type      // Dropdown: freehold/leasehold/poa/co_operative
rera_id            // Text input (optional)
locality           // Text input (required)
landmark           // Text input (optional)
show_map_exact     // Boolean toggle
```

### AreaDetails.jsx (1 new field)
```javascript
area_config        // Array of {type, value} - Dynamic repeater
```

### PricingInformation.jsx (3 new fields)
```javascript
is_price_negotiable // Boolean toggle
security_deposit    // Number (for rent/lease)
brokerage_fee       // Text/Number (flexible)
```

### BasicConfiguration.jsx (3 new fields)
```javascript
balcony_type       // Dropdown: standard/terrace/french/juliet
kitchen_type       // Dropdown: modular/basic/open/semi_open
ceiling_height     // Number (in feet)
```

### FloorDetails.jsx (2 new fields)
```javascript
lift_available     // Boolean toggle
ev_charging        // Boolean toggle
```

### FurnishingAmenities.jsx (1 new field)
```javascript
furnishing_details // Array: wardrobes, ac, beds, sofa, etc.
```

### ParkingUtilities.jsx (3 new fields)
```javascript
water_supply       // Dropdown: municipal/borewell/both/tanker
meter_type         // Dropdown: single/three (phase)
waste_disposal     // Dropdown: municipal/society/both
```

### AmenitiesFeatures.jsx (3 new fields)
```javascript
is_gated          // Boolean toggle
fire_safety       // Boolean toggle
pet_friendly      // Boolean toggle
```

### LandAttributes.jsx (2 new fields)
```javascript
terrain_level     // Selection: flat/elevated/sloped
soil_type         // Selection: black/red/sandy/clay/loamy
```

### ListingInformation.jsx (1 new field)
```javascript
tags              // Array (max 10) - Custom + suggested tags
```

---

## ❌ Not Yet Implemented (2 fields)

### 1. geo_location (BasicDetails.jsx)
**Type:** Map Picker Component  
**Data:** `{ lat: number, lng: number }`  
**Status:** Requires map library integration  
**Priority:** Medium

### 2. listing_media (ListingInformation.jsx)
**Type:** File Upload Component  
**Data:** Array of file objects with ordering  
**Status:** Requires upload infrastructure  
**Priority:** High

---

## 🔧 How to Use New Fields

### Example: Ownership Type
```javascript
// In your form
<Select
  value={watch('ownershipType')}
  onValueChange={(value) => setValue('ownershipType', value)}
>
  <SelectItem value="freehold">Freehold</SelectItem>
  <SelectItem value="leasehold">Leasehold</SelectItem>
  <SelectItem value="poa">POA</SelectItem>
  <SelectItem value="co_operative">Co-operative</SelectItem>
</Select>
```

### Example: Area Config (Repeater)
```javascript
// State
const [areaConfig, setAreaConfig] = useState([
  { type: 'carpet', value: '' },
  { type: 'super', value: '' }
]);

// Add new entry
const addAreaConfig = () => {
  setAreaConfig([...areaConfig, { type: 'carpet', value: '' }]);
};

// Remove entry
const removeAreaConfig = (index) => {
  setAreaConfig(areaConfig.filter((_, i) => i !== index));
};
```

### Example: Toggle Fields
```javascript
<Switch
  checked={watch('isPriceNegotiable')}
  onCheckedChange={(checked) => setValue('isPriceNegotiable', checked)}
/>
```

### Example: Tags (Multi-select)
```javascript
const [tags, setTags] = useState([]);

const addTag = (tag) => {
  if (tag && !tags.includes(tag) && tags.length < 10) {
    setTags([...tags, tag]);
  }
};

const removeTag = (tagToRemove) => {
  setTags(tags.filter(t => t !== tagToRemove));
};
```

---

## 📋 Field Validation Rules

### Required Fields (*)
- city
- locality
- address_text
- age_of_property
- possession_status
- ownership_type

### Conditional Required
- possession_date (if possession_status = 'under_construction')
- security_deposit (if listing_type = 'rent' or 'lease')

### Number Constraints
- age_of_property: min=0
- ceiling_height: min=8, step=0.1
- covered_parking: min=0
- open_parking: min=0

### Text Length Limits
- title: max=100 characters
- description: max=1000 characters
- tags: max=10 items, each max=30 characters

---

## 🎨 UI Patterns Used

### 1. Toggle Cards (for yes/no features)
```javascript
<div className="flex items-center justify-between p-4 border-2 rounded-lg">
  <div className="flex items-center gap-3">
    <Icon />
    <div>
      <Label>Feature Name</Label>
      <p className="text-xs">Description</p>
    </div>
  </div>
  <Switch checked={value} onCheckedChange={handler} />
</div>
```

### 2. Button Group Selection (for categories)
```javascript
<div className="grid grid-cols-3 gap-2">
  {options.map(option => (
    <button
      onClick={() => setValue('field', option.value)}
      className={watch('field') === option.value ? 'selected' : ''}
    >
      <span>{option.icon}</span>
      <span>{option.label}</span>
    </button>
  ))}
</div>
```

### 3. Multi-select with Checkboxes
```javascript
{options.map(option => (
  <div onClick={() => toggleOption(option.value)}>
    <Checkbox checked={selected.includes(option.value)} />
    <label>{option.label}</label>
  </div>
))}
```

---

## 🚦 Testing Checklist

- [ ] All new fields render correctly
- [ ] Validation works for required fields
- [ ] Conditional fields show/hide properly
- [ ] Form submission includes all new fields
- [ ] Mobile responsive design verified
- [ ] Accessibility (keyboard navigation) tested
- [ ] Error messages display correctly
- [ ] Default values load properly
- [ ] Field dependencies work correctly
- [ ] Form state persists during navigation

---

## 📦 Dependencies Required

```json
{
  "react-hook-form": "^7.x",
  "@hookform/resolvers": "^3.x",
  "zod": "^3.x",
  "lucide-react": "latest",
  "framer-motion": "latest",
  "@radix-ui/react-switch": "latest",
  "@radix-ui/react-select": "latest"
}
```

---

## 🔗 Related Files to Update

When integrating these fields:

1. **Schema Files** (`src/modules/listProperty/schemas/`)
   - Update Zod schemas with new fields
   - Add validation rules

2. **Type Definitions** (if using TypeScript)
   - Update interface definitions
   - Add new field types

3. **API Integration**
   - Update payload structure
   - Map form fields to API fields

4. **Database Schema**
   - Add new columns/fields
   - Update migrations

5. **Backend Validation**
   - Mirror frontend validations
   - Add business logic

---

## 💡 Pro Tips

1. **Reuse Patterns:** Copy similar field implementations for consistency
2. **Conditional Logic:** Use `watch()` to show/hide related fields
3. **Validation:** Always add both frontend and backend validation
4. **User Guidance:** Include helper text for complex fields
5. **Testing:** Test with different property types
6. **Accessibility:** Ensure all fields are keyboard accessible
7. **Performance:** Use `useMemo` for expensive computations
8. **Error Handling:** Provide clear, actionable error messages

---

## 📞 Support

For questions or issues:
1. Check the detailed analysis: `FIELD_IMPLEMENTATION_ANALYSIS.md`
2. Review component source code
3. Test with sample data
4. Verify schema definitions

---

**Last Updated:** November 6, 2025
