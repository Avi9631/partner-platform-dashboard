# List Property - Quick Reference Guide

## 🚀 Quick Start

### Run the Application
```bash
npm run dev
# or
npm start
```

Navigate to the List Property module in your application.

## 📋 Step-by-Step User Flow

### Step 1: Select Property Type
**Action:** Click on one of the 6 property type cards
- Apartment
- Villa / Independent House  
- Duplex / Independent Floor
- Penthouse / Studio
- Plot / Land
- Farm House / Agricultural

**Validation:** Must select one type to continue

---

### Step 2: Basic Details
**Required Fields:**
- ✅ City
- ✅ Full Address
- ✅ Age of Property (years)
- ✅ Possession Status

**Optional Fields:**
- Project Name
- Expected Possession Date (if under construction)

**Navigation:** Can go back to change property type

---

### Step 3a: Building Specifications (For Apartments/Villas)
**Required Fields:**
- ✅ Bedrooms
- ✅ Bathrooms
- ✅ Carpet Area (sq.ft)
- ✅ Super Area (sq.ft)

**Optional Fields:**
- Additional Rooms (Study, Servant, Store, Pooja)
- Balconies
- Furnishing Status & Details
- Flooring Types (Multi-select)
- Parking (Covered/Open)
- Power Backup
- Facing Direction
- View Type
- Floor Details (Tower, Floor Number, Unit Number)

---

### Step 3b: Land Specifications (For Plots/Farms)
**Required Fields:**
- ✅ Plot Area
- ✅ Area Unit (sqft, acre, bigha, etc.)
- ✅ Land Use (Residential/Commercial/Agricultural/Industrial)

**Optional Fields:**
- Plot Dimensions (Length x Width)
- Road Width
- Fencing (Yes/No)
- Irrigation Source (for agricultural)

---

### Step 4: Listing Details & Pricing
**Required Fields:**
- ✅ Listing Type (Sale/Rent/Lease)
- ✅ Price
- ✅ Listing Title (max 100 chars)
- ✅ Description (max 1000 chars)

**Optional Fields:**
- Price Unit (Total/Per sqft/Per acre)
- Maintenance Charges (for Rent/Lease)
- Available From Date
- Suitable For (Family/Bachelors/Company/Students)
- Amenities (16 options with icons)

**Available Amenities:**
🏋️ Gymnasium | 🏊 Swimming Pool | 🎪 Club House | 🎠 Children Park
🔒 24/7 Security | 📹 CCTV | 🛗 Lift | 🅿️ Visitor Parking
⚡ Power Backup | 💧 Water Supply | 🌳 Garden | 📞 Intercom
👷 Maintenance | 📶 Internet | 🧘 Yoga Area | 🏃 Jogging Track

---

### Step 5: Review & Submit
**Actions Available:**
- ✏️ Edit any section (jumps back to that step)
- ✅ Submit Listing (with loading state)

**After Submission:**
- Success animation
- Confirmation message
- Option to view listings or list another

---

## 🎨 Visual Design Elements

### Color Coding by Property Type
- **Apartment:** Blue to Cyan gradient
- **Villa:** Purple to Pink gradient
- **Duplex:** Orange to Red gradient
- **Penthouse:** Amber to Yellow gradient
- **Plot:** Green to Emerald gradient
- **Farmhouse:** Teal to Green gradient

### Button States
- **Primary Action:** Gradient button (Primary to Purple)
- **Success Action:** Green to Emerald gradient
- **Secondary Action:** Outline button
- **Disabled:** Reduced opacity, no hover effect

### Animation Triggers
- **Page Load:** Fade in + slide up (header)
- **Step Change:** Slide left/right
- **Selection:** Scale + border highlight
- **Hover:** Scale up + shadow increase
- **Submit:** Loading spinner → Success checkmark

---

## 🔧 Developer Quick Reference

### Import Store
```javascript
import useListPropertyStore from '@/modules/listProperty/store/useListPropertyStore';
```

### Get Form Data
```javascript
const { formData, currentStep } = useListPropertyStore();
```

### Navigate Steps
```javascript
const { nextStep, previousStep, setCurrentStep } = useListPropertyStore();

nextStep();           // Go to next step
previousStep();       // Go to previous step
setCurrentStep(2);    // Jump to specific step
```

### Update Form Data
```javascript
const { updateFormData } = useListPropertyStore();

updateFormData({ city: 'Mumbai', price: '5000000' });
```

### Validate Step
```javascript
const { updateStepValidation } = useListPropertyStore();

updateStepValidation(1, true); // Mark step 1 as valid
```

### Reset Form
```javascript
const { resetForm } = useListPropertyStore();

resetForm(); // Clear all data and go to step 1
```

### Check Property Type
```javascript
const { isBuildingType, isLandType } = useListPropertyStore();

if (isBuildingType()) {
  // Show building attributes
} else if (isLandType()) {
  // Show land attributes
}
```

---

## 📊 Data Flow

```
User Input → Component State → Zustand Store → Review Page → API Submit
     ↓           ↓                  ↓              ↓            ↓
  onChange   updateFormData    formData state   Display   POST request
```

---

## ✅ Validation Rules

### Step 1 (Property Type)
- Must select one property type

### Step 2 (Basic Details)
- City: Required, text
- Address: Required, text
- Age: Required, number ≥ 0
- Possession: Required, enum

### Step 3 (Specifications)
**For Buildings:**
- Bedrooms: Required, 1-6+
- Bathrooms: Required, 1-6+
- Carpet Area: Required, number > 0
- Super Area: Required, number > 0

**For Land:**
- Plot Area: Required, number > 0
- Area Unit: Required, enum
- Land Use: Required, enum

### Step 4 (Listing)
- Listing Type: Required, enum
- Price: Required, number > 0
- Title: Required, 1-100 chars
- Description: Required, 1-1000 chars

---

## 🎯 Pro Tips

### For Better Listings
1. **Use Descriptive Titles:** Include key features (e.g., "Spacious 3BHK with Sea View")
2. **Detail is Key:** Mention nearby landmarks, metro stations, schools
3. **Be Honest:** Accurate info builds trust
4. **Highlight USP:** What makes your property special?
5. **Select All Amenities:** More amenities = better visibility

### For Developers
1. **Test on Mobile:** 60% of users browse on mobile
2. **Validate Early:** Show errors immediately
3. **Save Drafts:** Consider auto-save every 30s
4. **Image Upload:** Add in future enhancement
5. **Analytics:** Track where users drop off

---

## 🐛 Troubleshooting

### Issue: Can't proceed to next step
**Solution:** Check that all required fields are filled. Red asterisk (*) indicates required.

### Issue: Form data lost on refresh
**Solution:** Currently expected behavior. Add localStorage persistence if needed.

### Issue: Animations laggy on mobile
**Solution:** Reduce `particleCount` in Vortex component or disable on mobile.

### Issue: Step indicator not updating
**Solution:** Ensure `updateStepValidation` is called when fields change.

---

## 📱 Keyboard Shortcuts (Future Enhancement)

- `Ctrl/Cmd + →` : Next step
- `Ctrl/Cmd + ←` : Previous step
- `Ctrl/Cmd + S` : Save draft
- `Ctrl/Cmd + Enter` : Submit (on review page)

---

## 🔗 Related Components

- `StepIndicator` - Progress visualization
- `PropertyTypeSelector` - Step 1 component
- `BasicDetails` - Step 2 component
- `BuildingAttributes` - Step 3a component
- `LandAttributes` - Step 3b component
- `ListingDetails` - Step 4 component
- `ReviewAndSubmit` - Step 5 component

---

## 📞 Support

For issues or enhancements, create an issue in the project repository.

---

**Version:** 1.0.0  
**Last Updated:** November 6, 2025
