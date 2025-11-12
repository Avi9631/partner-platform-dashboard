# Property Form Steps Documentation

This document provides a comprehensive overview of all steps in the Property Listing Form V2, organized by property type. Each step includes the fields, questions, and validation requirements.

---

## Table of Contents

1. [Property Types Overview](#property-types-overview)
2. [Step Flow by Property Type](#step-flow-by-property-type)
3. [Detailed Step Breakdown](#detailed-step-breakdown)

---

## Property Types Overview

### Residential Building Types
- Apartment
- Villa
- Duplex
- Independent House
- Penthouse
- Studio Apartment
- Independent Floor

### Land Types
- Residential Plot
- Farmhouse
- Agricultural Land

---

## Step Flow by Property Type

### 1. Apartment / Penthouse (14 Steps)

| Step | Name | Required | Fields Count |
|------|------|----------|--------------|
| 0 | Property Type Selection | ✅ | 1 |
| 1 | Location Selection | ✅ | 5 |
| 2 | Geo Tag | ✅ | 4 |
| 3 | Basic Details | ✅ | 6 |
| 4 | Basic Configuration | ✅ | 7 |
| 5 | Area Details | ✅ | 3+ |
| 6 | Furnishing | ✅ | 3 |
| 7 | Parking | ⚪ | 3 |
| 8 | Location Attributes | ⚪ | 2 |
| 9 | Floor Details | ✅ | 7 |
| 10 | Pricing | ✅ | 4+ |
| 11 | Suitable For | ⚪ | 1 |
| 12 | Listing Info | ✅ | 2 |
| 13 | Amenities | ⚪ | 50+ |
| 14 | Review & Submit | ✅ | - |

### 2. Villa / Duplex / Independent House / Studio / Independent Floor (13 Steps)

| Step | Name | Required | Fields Count |
|------|------|----------|--------------|
| 0 | Property Type Selection | ✅ | 1 |
| 1 | Location Selection | ✅ | 5 |
| 2 | Geo Tag | ✅ | 4 |
| 3 | Basic Details | ✅ | 6 |
| 4 | Basic Configuration | ✅ | 7 |
| 5 | Area Details | ✅ | 3+ |
| 6 | Furnishing | ✅ | 3 |
| 7 | Parking | ⚪ | 3 |
| 8 | Location Attributes | ⚪ | 2 |
| 9 | Pricing | ✅ | 4+ |
| 10 | Suitable For | ⚪ | 1 |
| 11 | Listing Info | ✅ | 2 |
| 12 | Amenities | ⚪ | 50+ |
| 13 | Review & Submit | ✅ | - |

### 3. Plot / Farmhouse / Agricultural Land (8 Steps)

| Step | Name | Required | Fields Count |
|------|------|----------|--------------|
| 0 | Property Type Selection | ✅ | 1 |
| 1 | Location Selection | ✅ | 5 |
| 2 | Geo Tag | ✅ | 4 |
| 3 | Basic Details | ✅ | 6 |
| 4 | Land Attributes | ✅ | 9 |
| 5 | Pricing | ✅ | 4+ |
| 6 | Listing Info | ✅ | 2 |
| 7 | Amenities | ⚪ | 50+ |
| 8 | Review & Submit | ✅ | - |

**Legend:** ✅ = Required | ⚪ = Optional

---

## Detailed Step Breakdown

---

### Step 0: Property Type Selection
**Applies to:** All property types  
**Required:** Yes

#### Fields/Questions:

1. **Property Type** (Required)
   - Type: Single selection
   - Options (Residential):
     - Apartment - "Flat in a building"
     - Villa - "Independent villa"
     - Duplex - "Two-floor unit"
     - Independent House - "Standalone house"
     - Penthouse - "Top-floor luxury"
     - Studio Apartment - "Single room unit"
     - Independent Floor - "Single floor"
   - Options (Land):
     - Residential Plot - "Vacant land"
     - Farmhouse - "Farm property"
     - Agricultural Land - "Farming land"

---

### Step 1: Location Selection
**Applies to:** All property types  
**Required:** Yes

#### Fields/Questions:

1. **Property Location** (Required)
   - Type: Interactive map picker
   - Description: "Search for your property address or click on the map to mark the exact location"
   - Auto-populates: City, Locality, Address, Landmark
   - Validation: Coordinates must be selected

2. **City** (Required - Auto-populated)
   - Type: Text (auto-filled from map)
   - Source: Extracted from map selection

3. **Locality** (Required - Auto-populated)
   - Type: Text (auto-filled from map)
   - Source: Extracted from map selection

4. **Full Address** (Required - Auto-populated)
   - Type: Text (auto-filled from map)
   - Source: Formatted address from map

5. **Landmark** (Optional - Auto-populated)
   - Type: Text (auto-filled from map)
   - Source: Nearby landmark from map

6. **Show Exact Location on Map** (Optional)
   - Type: Toggle switch
   - Default: false
   - Description: "Display precise property location to interested buyers"

---

### Step 2: Geo Tag
**Applies to:** All property types  
**Required:** Yes (Must be successful)

#### Fields/Questions:

1. **Property Coordinates Display** (Read-only)
   - Shows: Latitude, Longitude, Address
   - Source: From previous step

2. **Current GPS Location** (Required Action)
   - Type: GPS capture button
   - Action: "Get Current Location"
   - Validation: Must be within 1000 meters of property location

3. **Geo Tag Status** (Auto-calculated)
   - Type: Status indicator
   - Values:
     - Success: Within 1000m range
     - Failed: Beyond 1000m range
     - Pending: Not attempted yet

4. **Distance from Property** (Auto-calculated)
   - Type: Read-only number
   - Unit: Meters
   - Display: Shows calculated distance between current and property location

5. **Geo Tag Timestamp** (Auto-generated)
   - Type: ISO timestamp
   - Generated: When location is captured

**Success Criteria:** User must be within 1000 meters of the property location to proceed.

---

### Step 3: Basic Details
**Applies to:** All property types  
**Required:** Yes

#### Fields/Questions:

1. **Ownership Type** (Required)
   - Type: Dropdown select
   - Options:
     - Freehold
     - Leasehold
     - Power of Attorney (POA)
     - Co-operative Society

2. **Project Name** (Required)
   - Type: Searchable dropdown with pagination
   - Features:
     - Search functionality
     - Load more (10 items per page)
     - "Not Listed" option always available
   - Sample options: Green Valley Apartments, Sunrise Residency, Blue Pearl Heights, etc.

3. **RERA Registration Numbers** (Optional - Multiple)
   - Type: Dynamic field array (Add/Remove)
   - Format: Text input
   - Example: RERA123456
   - Features:
     - Add multiple RERA IDs
     - Remove individual entries
     - No minimum required

4. **Age of Property** (Required)
   - Type: Number input
   - Unit: Years
   - Min: 0
   - Placeholder: "e.g., 2"

5. **Possession Status** (Required)
   - Type: Dropdown select
   - Options:
     - Ready to Move
     - Under Construction
     - Resale

6. **Expected Possession Date** (Conditional)
   - Type: Date picker
   - Required if: Possession Status = "Under Construction"
   - Format: Date

---

### Step 4: Basic Configuration
**Applies to:** Building types only (Not for Land)  
**Required:** Yes

#### Fields/Questions:

1. **Bedrooms** (Required)
   - Type: Dropdown select
   - Options: 1, 2, 3, 4, 5, 6+
   - Display format: "X Bedroom(s)"

2. **Bathrooms** (Required)
   - Type: Dropdown select
   - Options: 1, 2, 3, 4, 5, 6+
   - Display format: "X Bathroom(s)"

3. **Balconies** (Optional)
   - Type: Dropdown select
   - Options: 0, 1, 2, 3, 4, 5+
   - Display format: "X Balcony/Balconies"

4. **Balcony Type** (Optional)
   - Type: Dropdown select
   - Options:
     - Standard Balcony
     - Terrace / Rooftop
     - French Balcony
     - Juliet Balcony

5. **Kitchen Type** (Optional)
   - Type: Dropdown select
   - Options:
     - Modular Kitchen
     - Basic Kitchen
     - Open Kitchen
     - Semi-Open Kitchen

6. **Ceiling Height** (Optional)
   - Type: Number input
   - Unit: Feet
   - Min: 8
   - Step: 0.1
   - Placeholder: "e.g., 10"
   - Note: "Standard height is usually 10 feet"

7. **Additional Rooms** (Optional - Multiple)
   - Type: Checkbox group
   - Options:
     - Servant Room
     - Study Room
     - Store Room
     - Pooja Room
     - Home Office
   - Selection: Multiple allowed

---

### Step 5: Area Details
**Applies to:** Building types only (Not for Land)  
**Required:** Yes

#### Fields/Questions:

1. **Carpet Area** (Required)
   - Type: Number input
   - Unit: sq.ft
   - Min: 1
   - Placeholder: "e.g., 1200"
   - Description: "Usable floor area excluding walls and common areas"

2. **Super Area** (Required)
   - Type: Number input
   - Unit: sq.ft
   - Min: 1
   - Placeholder: "e.g., 1500"
   - Description: "Total area including walls and common areas"

3. **Area Configuration** (Optional - Multiple)
   - Type: Repeater field array (Add/Remove)
   - Each entry contains:
     - **Area Type** (Dropdown):
       - Carpet Area
       - Super Area
       - Built-up Area
       - Plot Area
     - **Value** (Number):
       - Unit: sq.ft
       - Placeholder: "e.g., 1200"
   - Features:
     - Add multiple area measurements
     - Remove entries (minimum 1)
   - Description: "Add multiple area measurements for better clarity"

**Note:** Super area is typically 20-30% more than carpet area.

---

### Step 6: Furnishing
**Applies to:** Building types only (Not for Land)  
**Required:** Yes

#### Fields/Questions:

1. **Furnishing Status** (Required)
   - Type: Card selection (single)
   - Options:
     - **Unfurnished:** "No furniture or fittings"
     - **Semi-Furnished:** "Basic furniture & fittings"
     - **Fully Furnished:** "Complete furniture & appliances"

2. **Included Furniture & Appliances** (Conditional - Multiple)
   - Type: Multi-select cards
   - Shown if: Furnishing Status = "Semi" or "Fully"
   - Options (with icons):
     - 🚪 Wardrobes
     - ❄️ Air Conditioner
     - 🍳 Modular Kitchen
     - 🛏️ Beds
     - 🛋️ Sofa
     - 🍽️ Dining Table
     - 📺 Television
     - 🧊 Refrigerator
     - 🧺 Washing Machine
     - 🔥 Geyser
     - 🌫️ Chimney
     - 🔥 Stove/Cooktop
   - Selection: Multiple allowed

3. **Flooring Types** (Optional - Multiple)
   - Type: Checkbox group
   - Options:
     - Vitrified
     - Marble
     - Wooden
     - Ceramic
     - Granite
     - Mosaic
   - Selection: Multiple allowed

---

### Step 7: Parking
**Applies to:** Building types only (Not for Land)  
**Required:** No (Optional step)

#### Fields/Questions:

1. **Covered Parking** (Optional)
   - Type: Number input
   - Min: 0
   - Placeholder: "Number of spaces"
   - Description: Indoor/covered parking spaces

2. **Open Parking** (Optional)
   - Type: Number input
   - Min: 0
   - Placeholder: "Number of spaces"
   - Description: Open-air parking spaces

3. **Power Backup** (Optional)
   - Type: Dropdown select
   - Options:
     - No Backup
     - Partial Backup (Limited hours/areas)
     - Full Backup (100% coverage)

---

### Step 8: Location Attributes
**Applies to:** Building types only (Not for Land)  
**Required:** No (Optional step)

#### Fields/Questions:

1. **Facing Direction** (Optional)
   - Type: Dropdown select
   - Options:
     - East
     - West
     - North
     - South
     - North-East
     - North-West
     - South-East
     - South-West
   - Description: "Direction the main entrance faces"

2. **View** (Optional)
   - Type: Dropdown select
   - Options:
     - Garden View
     - Road View
     - Park View
     - Club View
     - City View
     - Pool View
     - Sea View
   - Description: "Primary view from the property"

**Note:** East and North-facing properties are often preferred for better natural light.

---

### Step 9: Floor Details
**Applies to:** Apartment & Penthouse only  
**Required:** Yes

#### Fields/Questions:

1. **Tower Name** (Optional)
   - Type: Text input
   - Placeholder: "e.g., Tower A"

2. **Floor Number** (Required)
   - Type: Number input
   - Min: 0
   - Placeholder: "e.g., 5"

3. **Total Floors** (Required)
   - Type: Number input
   - Min: 1
   - Placeholder: "e.g., 20"

4. **Unit Number** (Optional)
   - Type: Text input
   - Placeholder: "e.g., 501"

5. **Keep Unit Number Private** (Optional)
   - Type: Toggle switch
   - Default: false
   - Description: Privacy option for unit number

6. **Lift/Elevator Available** (Optional)
   - Type: Toggle switch
   - Default: false
   - Question: "Is there a working elevator?"

7. **EV Charging Point** (Optional)
   - Type: Toggle switch
   - Default: false
   - Description: "Electric vehicle charging facility"

---

### Step 10: Land Attributes
**Applies to:** Land types only (Plot, Farmhouse, Agricultural Land)  
**Required:** Yes

#### Fields/Questions:

1. **Plot Area** (Required)
   - Type: Number input
   - Min: 0
   - Step: 0.01
   - Placeholder: "Enter area"

2. **Area Unit** (Required)
   - Type: Dropdown select
   - Options:
     - Square Feet
     - Square Meters
     - Acre
     - Bigha
     - Kanal
     - Gaj

3. **Plot Dimensions** (Optional)
   - Type: Text input
   - Format: "Length x Width"
   - Placeholder: "e.g., 50 x 40 feet"
   - Description: "Enter dimensions if known"

4. **Land Use Type** (Optional)
   - Type: Card selection (single)
   - Options:
     - 🏡 Residential
     - 🏢 Commercial
     - 🌾 Agricultural
     - 🏭 Industrial

5. **Road Width** (Optional)
   - Type: Number input
   - Unit: Feet
   - Min: 0
   - Placeholder: "Enter road width"

6. **Terrain Level** (Optional)
   - Type: Card selection (single)
   - Options:
     - 📏 Flat
     - ⛰️ Elevated
     - 📐 Sloped

7. **Soil Type** (Optional)
   - Type: Card selection (single)
   - Options:
     - ⚫ Black Soil
     - 🔴 Red Soil
     - 🟡 Sandy Soil
     - 🟤 Clay Soil
     - 🟢 Loamy Soil

8. **Fencing Available** (Optional)
   - Type: Toggle switch
   - Default: false
   - Question: "Is the plot fenced?"

9. **Irrigation Source** (Optional)
   - Type: Dropdown select
   - Options:
     - Borewell
     - Canal
     - River
     - Well
     - Drip Irrigation
     - No Irrigation

---

### Step 11: Pricing
**Applies to:** All property types  
**Required:** Yes

#### Fields/Questions:

1. **Listing Type** (Required)
   - Type: Card selection (single)
   - Options:
     - For Sale
     - For Rent
     - For Lease
   - Note: Affects available pricing types

2. **Pricing Details** (Required - Multiple)
   - Type: Repeater field array (Add/Remove)
   - Each pricing item contains:
     - **Type** (Required - Dropdown):
       - For Sale:
         - Asking Price
         - Brokerage Fee
       - For Rent:
         - Monthly Rent
         - Security Deposit
         - Maintenance Charges
         - Brokerage Fee
       - For Lease:
         - Lease Amount
         - Security Deposit
         - Maintenance Charges
         - Brokerage Fee
     - **Value** (Required - Number):
       - Min: 0
       - Prefix: ₹ or % (based on unit)
       - Dynamic placeholder based on type
     - **Unit** (Required - Dropdown):
       - For Brokerage:
         - Percentage (%)
         - Fixed Amount
       - For Maintenance:
         - Per Month
         - One Time
       - For Others:
         - Total Price
         - Per Sq.ft
         - Per Sq.m
         - Per Acre
   - Features:
     - Add multiple pricing items
     - Remove entries (minimum 1)
   - Description: "Add multiple pricing items such as asking price, security deposit, maintenance charges, or brokerage fees"

3. **Price Negotiable** (Optional)
   - Type: Toggle switch
   - Default: false
   - Description: "Allow buyers to negotiate the price"

4. **Available From** (Optional)
   - Type: Date picker
   - Question: "When will this property be available for occupancy?"

**Pricing Examples:**
- Sale: ₹50,00,000 (Asking Price)
- Rent: ₹25,000/month
- Lease: ₹10,00,000
- Deposit: ₹50,000
- Maintenance: ₹2,000/month
- Brokerage: 2% or ₹50,000

---

### Step 12: Suitable For
**Applies to:** Rent & Lease listings only  
**Required:** No (Optional step)

#### Fields/Questions:

1. **Suitable For** (Optional - Multiple)
   - Type: Multi-select cards
   - Options:
     - 👨‍👩‍👧‍👦 Family
     - 🎓 Bachelors
     - 🏢 Company Lease
     - 📚 Students
   - Selection: Multiple allowed
   - Note: Only shown for Rent/Lease listings

**Note:** This step is skipped for "Sale" listings.

---

### Step 13: Listing Info
**Applies to:** All property types  
**Required:** Yes

#### Fields/Questions:

1. **Listing Title** (Required)
   - Type: Text input
   - Max length: 100 characters
   - Placeholder: "e.g., Spacious 3BHK Apartment in Prime Location"
   - Character counter: Shown
   - Validation: Must not be empty

2. **Property Description** (Required)
   - Type: Textarea
   - Max length: 1000 characters
   - Placeholder: "Describe your property in detail. Include unique features, nearby landmarks, connectivity, etc."
   - Character counter: Shown
   - Validation: Must not be empty

**Tips for better listings:**
- Use a catchy, descriptive title
- Include nearby landmarks, schools, hospitals
- Mention connectivity details (metro, bus stops, highways)
- Be honest about property condition

---

### Step 14: Amenities
**Applies to:** All property types  
**Required:** No (Optional step)

#### Fields/Questions:

1. **Gated Society** (Optional)
   - Type: Toggle switch
   - Default: false
   - Icon: 🔒 Lock
   - Description: "Secured compound"

2. **Fire Safety** (Optional)
   - Type: Toggle switch
   - Default: false
   - Icon: 🛡️ Shield
   - Description: "Compliant systems"

3. **Pet Friendly** (Optional)
   - Type: Toggle switch
   - Default: false
   - Icon: 🐕 Dog
   - Description: "Pets allowed"

4. **Property Amenities** (Optional - Multiple)
   - Type: Multi-select checkboxes (50+ options)
   - Categories include:
     - **Building Features:** Gym, Swimming Pool, Clubhouse, Garden, Play Area, Jogging Track
     - **Security:** 24/7 Security, CCTV Surveillance, Security Guard, Intercom Facility
     - **Facilities:** Lift, Power Backup, Rainwater Harvesting, Waste Disposal
     - **Recreation:** Indoor Games, Sports Facility, Community Hall, Kids Pool
     - **Services:** Maintenance Staff, Housekeeping, Water Supply, Piped Gas
     - **Technology:** Internet/Wi-Fi, Smart Home, Video Door Security
     - **Environment:** Green Area, Landscaping, Water Feature, Terrace Garden
     - **Parking:** Visitor Parking, EV Charging
   - Selection: Multiple allowed
   - Counter: Shows number of selected amenities

**Pro Tips Displayed:**
- Use a catchy, descriptive title that highlights key features
- Include nearby landmarks, schools, hospitals in the description
- Mention connectivity details (metro, bus stops, highways)
- Be honest and accurate about pricing and property condition

---

### Step 15: Review & Submit
**Applies to:** All property types  
**Required:** Yes (Final step)

#### Sections to Review:

1. **Property Information**
   - Property Type
   - Ownership Type
   - Project Name
   - RERA ID(s)
   - Edit: Returns to Step 0

2. **Location Details**
   - City
   - Locality
   - Full Address
   - Landmark
   - Property Age
   - Possession Status
   - Edit: Returns to Step 1

3. **Property Specifications** (For Buildings)
   - Bedrooms
   - Bathrooms
   - Balconies
   - Carpet Area
   - Super Area
   - Furnishing Status
   - Facing Direction
   - Parking
   - Edit: Returns to Step 2

4. **Land Details** (For Land Types)
   - Plot Area & Unit
   - Plot Dimensions
   - Land Use Type
   - Edit: Returns to Step 2

5. **Listing & Pricing**
   - Listing Type (Sale/Rent/Lease)
   - Price (formatted with ₹ symbol)
   - Available From date
   - Listing Title
   - Description
   - Amenities (first 8 shown, "+X more" if applicable)
   - Edit: Returns to appropriate pricing step

#### Features:

- **Collapsible Sections:** Each section can be expanded/collapsed
- **Edit Buttons:** Each section has an edit button that returns to the relevant step
- **Visual Indicators:**
  - Color-coded icons for each section
  - Badges for categorical data
  - Formatted pricing display
  - Amenity count display

#### Actions:

1. **Back Button:** Returns to previous step
2. **Submit Listing Button:**
   - Label: "Submit Listing"
   - Gradient: Green to Emerald
   - Loading state: Shows "Submitting..." with spinner
   - Icon: CheckCircle

#### On Successful Submission:

**Success Screen:**
- ✅ Green checkmark icon
- Heading: "Property Listed Successfully! 🎉"
- Message: "Your property listing has been submitted and is now under review."
- Action Button: "View My Listings"
- Note: "You'll receive a confirmation email shortly."

#### Data Logged:

Complete form payload with all collected data from all steps is logged to console for debugging/API submission.

---

## Field Summary by Property Type

### Apartment / Penthouse (Total: ~85+ fields)

| Category | Fields | Required |
|----------|--------|----------|
| Property Type | 1 | Yes |
| Location | 6 | 5 Required |
| Geo Tag | 4 | Yes (Success) |
| Basic Details | 6 | 4 Required |
| Configuration | 7 | 2 Required |
| Area | 3+ | 2 Required |
| Furnishing | 3+ | 1 Required |
| Parking | 3 | No |
| Location Attr | 2 | No |
| Floor | 7 | 2 Required |
| Pricing | 4+ | 2 Required |
| Suitable For | 1 | No |
| Listing | 2 | Yes |
| Amenities | 50+ | No |

### Villa / Others (Total: ~80+ fields)

Similar to Apartment but excludes Floor Details step (7 fields less).

### Plot / Land (Total: ~70+ fields)

| Category | Fields | Required |
|----------|--------|----------|
| Property Type | 1 | Yes |
| Location | 6 | 5 Required |
| Geo Tag | 4 | Yes (Success) |
| Basic Details | 6 | 4 Required |
| Land Attributes | 9 | 2 Required |
| Pricing | 4+ | 2 Required |
| Listing | 2 | Yes |
| Amenities | 50+ | No |

---

## Validation Rules Summary

### Required Fields (Cannot proceed without):
- Property Type
- Location coordinates with city, locality, address
- Successful geo-tag (within 1000m)
- Ownership type
- Project name
- Age of property
- Possession status
- For Buildings: Bedrooms, Bathrooms, Carpet Area, Super Area
- For Land: Plot Area, Area Unit
- Listing type
- At least one pricing item with value
- Listing title
- Property description

### Optional Fields (Can be skipped):
- Landmark
- Show exact location toggle
- RERA IDs
- Balconies, balcony type, kitchen type
- Ceiling height
- Additional rooms
- Furnishing details (if unfurnished)
- Flooring types
- Parking details
- Location attributes (facing, view)
- For Apartment: Tower name, unit number, lift, EV charging
- For Land: Plot dimensions, land use, road width, terrain, soil type, fencing, irrigation
- Price negotiable toggle
- Available from date
- Suitable for (rent/lease only)
- All amenities

### Conditional Fields:
- Possession date: Required if possession status = "Under Construction"
- Furnishing details: Shown only if semi/fully furnished
- Floor details: Only for Apartment/Penthouse
- Land attributes: Only for Plot/Farmhouse/Agricultural Land
- Suitable for: Only for Rent/Lease listings

---

## Data Structure

All form data is accumulated in the `formData` object in the context. Final submission includes:

```json
{
  "propertyType": "apartment",
  "coordinates": { "lat": 28.5355, "lng": 77.3910 },
  "city": "Greater Noida",
  "locality": "Sector 16B",
  "addressText": "Full formatted address",
  "landmark": "Near XYZ Mall",
  "showMapExact": true,
  "geoTagStatus": "success",
  "geoTagCoordinates": { "lat": 28.5356, "lng": 77.3911 },
  "geoTagDistance": 112.45,
  "geoTagTimestamp": "2025-11-12T10:30:00.000Z",
  "ownershipType": "freehold",
  "projectName": "Green Valley Apartments",
  "reraIds": [{"id": "RERA123456"}],
  "ageOfProperty": "2",
  "possessionStatus": "ready",
  "bedrooms": "3",
  "bathrooms": "2",
  "balconies": "2",
  "balconyType": "standard",
  "kitchenType": "modular",
  "ceilingHeight": "10",
  "additionalRooms": ["Servant Room", "Study Room"],
  "carpetArea": "1200",
  "superArea": "1500",
  "areaConfig": [
    {"type": "built_up", "value": "1350"}
  ],
  "furnishingStatus": "semi",
  "furnishingDetails": {
    "wardrobe": true,
    "ac": true,
    "modular_kitchen": true
  },
  "flooringTypes": ["Vitrified", "Marble"],
  "coveredParking": "1",
  "openParking": "0",
  "powerBackup": "partial",
  "facing": "east",
  "view": "garden_view",
  "floorNumber": "5",
  "totalFloors": "20",
  "towerName": "Tower A",
  "unitNumber": "501",
  "isUnitNumberPrivate": false,
  "liftAvailable": true,
  "evCharging": false,
  "listingType": "sale",
  "pricing": [
    {"type": "asking_price", "value": "5000000", "unit": "total"}
  ],
  "isPriceNegotiable": true,
  "availableFrom": "2025-12-01",
  "suitableFor": ["family"],
  "title": "Spacious 3BHK Apartment in Prime Location",
  "description": "Beautiful apartment with modern amenities...",
  "amenities": ["gym", "swimming_pool", "garden", "security"],
  "isGated": true,
  "fireSafety": true,
  "petFriendly": false
}
```

---

## Notes

1. **Step Navigation:** Users can only proceed after completing required fields in each step.

2. **Data Persistence:** All entered data is stored in React Context and persists when navigating back/forward.

3. **Edit Functionality:** From the Review step, users can jump to any previous step to edit data.

4. **Responsive Design:** All steps are mobile-responsive with appropriate breakpoints.

5. **Animations:** Smooth transitions and animations using Framer Motion.

6. **Validation:** Real-time validation using React Hook Form with Zod schemas.

7. **Geo-tagging:** Critical security feature requiring physical presence at property location (1000m radius).

8. **Dynamic Fields:** Some fields show/hide based on previous selections (conditional rendering).

9. **Character Limits:**
   - Title: 100 characters
   - Description: 1000 characters
   - RERA IDs: Unlimited entries

10. **Accessibility:** Proper ARIA labels, keyboard navigation, and screen reader support.

---

## Future Enhancements

- Photo/video upload functionality
- 3D virtual tour integration
- Document upload (ownership papers, RERA certificate)
- Save as draft feature
- Pre-fill from previous listings
- AI-powered description generator
- Price suggestions based on market data
- Duplicate listing detection

---

**Last Updated:** November 12, 2025  
**Version:** 2.0  
**Maintained by:** Partner Platform Team
