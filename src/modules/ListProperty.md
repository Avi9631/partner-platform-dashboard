We’ll design a comprehensive & future-proof attribute schema that works across:
Apartment


Independent House / Villa / Duplex / Independent Floor


Penthouse / Studio


Plot


Farm House / Agricultural Land



Core Design Principle
Some data points apply only to built structures, others only to land-based properties.
So we structure like this:
Table
Purpose
PropertyAsset
Permanent characteristics of the property
Listing
The listing that represents sale/rent
PropertyAttributes_Building
Fields relevant to homes/apartments
PropertyAttributes_Land
Fields relevant to plots/farms
Common Additional Attributes
JSONB (flexible future-proof area)


✅ Standardized Field Set (Final Refined List)
PropertyAsset (Common for all types)
Field
Type
Description
id
UUID
Unique ID
property_type
Enum
Apartment / Villa / Plot / Farm House etc.
project_name
Text / FK optional
For apartments & township properties
city
Text
City name
geo_location
Point (lat, long)
Map coordinate
address_text
Text
Textual address
age_of_property
Integer (years)
Approx property age
possession_status
Enum
Ready / Under Construction / Resale
possession_date
Date (nullable)
If not ready yet
attributes
JSONB
Custom attributes not in schema


For Building / Residential Unit Types
(Apartment / Independent House / Duplex / Independent Floor / Villa / Penthouse / Studio)
Store in property_attributes_building
Field
Type
Examples / Notes
bedrooms
Integer
1,2,3,4+
additional_rooms
JSONB
Servant Room, Study, Store etc.
carpet_area
Number
Sqft/Sqm
super_area
Number


furnishing_status
Enum
Unfurnished / Semi / Fully
furnishing_details
JSONB
{"wardrobes":2,"modular_kitchen":true}
bathrooms
Integer
1..5
balconies
Integer
0..5
balcony_type
Enum
Standard / Juliet / Terrace
covered_parking
Integer
Count
open_parking
Integer
Count
power_backup
Enum
None / Partial / Full
facing
Enum
East/West/North/South/Northeast etc.
view
Enum
Garden / Road / Park / Club / City etc.
flooring_types
JSONB Array
["Vitrified","Wooden"]
tower_name
Text
For apartments
floor_number
Integer
1-40
total_floors
Integer
Tower height
unit_number
Text
Can be hidden
is_unit_number_private
Boolean
Yes/No


For Land Types
(Plot / Farm House Land / Agricultural Land)
Store in property_attributes_land
Field
Type
Description
plot_area
Number
Units in sqft/acre/bigha
area_unit
Enum
Sqft / Acre / Bigha / Kanal / Gaj etc
plot_dimension
Text
Example: 30x40
land_use
Enum
Residential / Commercial / Agricultural
road_width
Number
Adjacent road width in feet/meters
fencing
Boolean
Yes/No
irrigation_source
Text / Enum
Canal / Borewell / No irrigation


Listing Fields
(What agent/owner posts)
Field
Type
Description
id
UUID


property_asset_id
FK
Links to property
listed_by_user_id
FK
Agent or owner
listing_type
Enum
Sale / Rent / Lease
price
Decimal
Asking price
price_unit
Enum
Total / Per Sqft / Per Acre etc.
maintenance_charges
Decimal (optional)
Monthly
available_from
Date
Move-in date
suitable_for
JSONB Array
Family / Bachelor / Company Lease
title
Text
Listing headline
description
Text
Marketing description
amenities
JSONB Array
Club, Gym, CCTV, Pool etc.
status
Enum
Active / Sold / Withdrawn / Expired
created_at
Timestamp


updated_at
Timestamp




