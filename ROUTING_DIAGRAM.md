# 🗺️ Application Routing Structure

## Visual Route Map

```
┌─────────────────────────────────────────────────────────────────┐
│                        Application Root                          │
│                      http://localhost:5173                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                   ┌─────────┴─────────┐
                   │                   │
        ┌──────────▼──────────┐   ┌───▼───────────────┐
        │    /list-property   │   │ /list-property-v2 │
        │        (V1)         │   │       (V2)        │
        └──────────┬──────────┘   └────┬──────────────┘
                   │                   │
                   │                   │
        ┌──────────▼──────────┐   ┌───▼───────────────┐
        │   ListProperty.jsx  │   │ ListPropertyV2.jsx│
        │                     │   │                   │
        │  Card-Based View    │   │  Multi-Step Form  │
        │                     │   │                   │
        │  • Property Cards   │   │  • Landing Page   │
        │  • Section Cards    │   │  • "Start" Button │
        │  • Edit Sheets      │   │  • Feature Cards  │
        │                     │   │                   │
        │  Uses:              │   │  Opens:           │
        │  PropertyFormSheet  │   │  PropertyFormV2   │
        │  SectionEditSheet   │   │  SheetV2          │
        └─────────────────────┘   └───────────────────┘
```

## Navigation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Journey                             │
└─────────────────────────────────────────────────────────────────┘

Option 1: Start from V1
   ↓
User visits: /list-property
   ↓
Sees card-based interface
   ↓
Clicks: "Try New Multi-Step Form (V2)" ✨
   ↓
Navigates to: /list-property-v2
   ↓
Clicks: "Start Listing Property"
   ↓
PropertyFormSheetV2 opens
   ↓
Multi-step form experience


Option 2: Start from V2
   ↓
User visits: /list-property-v2
   ↓
Sees landing page with features
   ↓
Clicks: "Start Listing Property"
   ↓
PropertyFormSheetV2 opens
   ↓
Multi-step form experience
   ↓
Can click "Back to V1 (Card View)"
   ↓
Returns to: /list-property
```

## Component Hierarchy

```
App.jsx (Root Layout)
├── Header
├── <Outlet /> (React Router)
    │
    ├── /list-property → ListProperty.jsx
    │   ├── PropertyFormProvider
    │   ├── Property Type Card
    │   ├── Location Card
    │   ├── Section Cards (grid)
    │   └── SectionEditSheet
    │       └── Opens various form components
    │
    └── /list-property-v2 → ListPropertyV2.jsx
        ├── Hero Section
        ├── Feature Cards
        ├── "Start Listing" Button
        └── PropertyFormSheetV2
            ├── PropertyFormProviderV2
            ├── PropertyFormSidebarV2
            │   ├── Step Navigation
            │   ├── Progress Bar
            │   └── Lock/Unlock Logic
            ├── Main Content Area
            │   └── Step Components
            │       ├── PropertyTypeStepV2
            │       ├── BasicDetailsStepV2
            │       ├── ...other steps...
            │       └── ReviewAndSubmitV2
            └── SaveAndContinueFooter
```

## File Locations

```
src/
├── main.jsx ⭐ (Routes defined here)
│   └── Router Configuration:
│       ├── /list-property → ListProperty
│       └── /list-property-v2 → ListPropertyV2
│
├── App.jsx (Layout wrapper)
│
└── modules/
    ├── ListProperty.jsx (V1 page)
    ├── ListPropertyV2.jsx ⭐ (V2 landing page)
    │
    └── listProperty/
        ├── components/ (V1 components)
        │   ├── PropertyFormSheet.jsx
        │   ├── SectionEditSheet.jsx
        │   └── ...
        │
        └── v2/ ⭐ (V2 components)
            ├── index.js
            ├── context/
            │   └── PropertyFormContextV2.jsx
            └── components/
                ├── PropertyFormSheetV2.jsx
                ├── PropertyFormSidebarV2.jsx
                ├── SaveAndContinueFooter.jsx
                └── steps/
                    └── ...14 step components
```

## URL Access Summary

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | App.jsx | Root layout with header |
| `/list-property` | ListProperty.jsx | V1 card-based form |
| `/list-property-v2` | ListPropertyV2.jsx | V2 multi-step landing |

## Quick Test Commands

```bash
# Start dev server
npm run dev

# Then visit these URLs:

# V1 (Original)
http://localhost:5173/list-property

# V2 (New Multi-Step)
http://localhost:5173/list-property-v2
```

## Cross-Navigation Elements

### In V1 (/list-property)
```jsx
<Button> ✨ Try New Multi-Step Form (V2) </Button>
→ Links to: /list-property-v2
```

### In V2 (/list-property-v2)
```jsx
<Button> ← Back to V1 (Card View) </Button>
→ Links to: /list-property
```

This allows users to easily switch between versions! 🔄
