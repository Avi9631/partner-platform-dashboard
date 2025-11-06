# Comprehensive Property Listing Form Structure

## 1) Basic Property Details
| Field Label | Field Name | Type | Notes |
|---|---|---|---|
| Property Type | property_type | Dropdown | Apartment / Villa / Plot etc |
| Listing For | listing_type | Dropdown | Sale / Rent / Lease |
| Ownership Type | ownership_type | Dropdown | Freehold / Leasehold / POA etc |
| Project Name | project_name | Autocomplete | Optional for standalone houses |
| RERA Registration No. | rera_id | Text | If applicable |
| City | city | Dropdown | |
| Locality / Sector | locality | Text | |
| Address Line | address_text | Textarea | |
| Landmark | landmark | Text | Nearby reference |
| Map Location | geo_location | Map Picker | lat/long |
| Show Exact Location | show_map_exact | Toggle | Yes/No |

## 2) Area & Pricing
| Field Label | Field Name | Type | Notes |
|---|---|---|---|
| Price | price | Number | |
| Price Type | price_unit | Dropdown | Total / Per Sqft / Per Acre |
| Negotiable | is_price_negotiable | Toggle | Yes/No |
| Monthly Rent | rent_amount | Number | Shown if Rent |
| Security Deposit | security_deposit | Number | |
| Brokerage Fee | brokerage_fee | Number / % | Optional |
| Maintenance Charges | maintenance | Number | Monthly |
| Area Config | area_config | Repeater (type + value) | Carpet/Super/Built-up |
| Plot Area | plot_area | Number | For land types |
| Area Unit | area_unit | Dropdown | Sqft / Acre / Bigha etc |
| Age of Property | age_of_property | Number | Years |
| Possession Status | possession_status | Dropdown | Ready / UC / Resale |
| Possession Date | possession_date | Date | |

## 3) Room & Interior Configuration
| Field Label | Field Name | Type | Notes |
|---|---|---|---|
| Bedrooms | bedrooms | Number | |
| Additional Rooms | additional_rooms | Multi-select | Study/Store/Servant |
| Bathrooms | bathrooms | Number | |
| Balconies | balconies | Number | |
| Balcony Type | balcony_type | Dropdown | Standard / Terrace |
| Furnishing Status | furnishing_status | Dropdown | Unfurnished / Semi / Fully |
| Furnishing Details | furnishing_details | Repeater | Wardrobes, AC, Modular Kitchen |
| Kitchen Type | kitchen_type | Dropdown | Modular / Basic / Open |
| Ceiling Height | ceiling_height | Number | Optional |
| Flooring Types | flooring_types | Multi-select | Marble / Vitrified / Wooden |

## 4) Floor / Unit / Parking Details
| Field Label | Field Name | Type | Notes |
|---|---|---|---|
| Tower / Block | tower_name | Text | Apartments only |
| Unit Number | unit_number | Text | |
| Hide Unit Number | is_unit_number_private | Toggle | |
| Floor Number | floor_number | Number | |
| Total Floors | total_floors | Number | |
| Lift Available | lift_available | Toggle | |
| Covered Parking | covered_parking | Number | |
| Open Parking | open_parking | Number | |
| EV Charging | ev_charging | Toggle | |

## 5) Orientation & Utilities
| Field Label | Field Name | Type | Notes |
|---|---|---|---|
| Facing | facing | Dropdown | East / West / North / South |
| View | view | Dropdown | Garden / Road / Park / Pool |
| Power Backup | power_backup | Dropdown | None / Partial / Full |
| Water Supply | water_supply | Dropdown | Municipal / Borewell / Both |
| Electricity Phase | meter_type | Dropdown | Single / Three Phase |
| Waste Disposal | waste_disposal | Dropdown | Municipal / Society Managed |

## 6) Amenities & Community
| Field Label | Field Name | Type | Notes |
|---|---|---|---|
| Amenities | amenities | Multi-select | Pool, Gym, CCTV, Clubhouse etc |
| Gated Society | is_gated | Toggle | Yes/No |
| Fire Safety Compliant | fire_safety | Toggle | Yes/No |
| Pet Friendly | pet_friendly | Toggle | Yes/No |

## 7) Land-Specific Fields
| Field Label | Field Name | Type | Notes |
|---|---|---|---|
| Land Use | land_use | Dropdown | Residential / Commercial / Agricultural |
| Plot Dimensions | plot_dimension | Text | Example: 30x50 |
| Road Width | road_width | Number | In feet/meters |
| Terrain Level | terrain_level | Dropdown | Flat / Elevated / Sloped |
| Soil Type | soil_type | Dropdown | Black / Red / Sandy / Clay |
| Irrigation Source | irrigation_source | Dropdown | Borewell / Canal / None |
| Fencing Available | fencing | Toggle | Yes/No |

## 8) Listing Presentation
| Field Label | Field Name | Type | Notes |
|---|---|---|---|
| Title | title | Text | Short headline |
| Description | description | Textarea | Marketing copy |
| Tags | tags | Multi-select | Corner Unit, Park Facing etc |
| Photos / Videos | listing_media | Media Upload | Supports ordering |
