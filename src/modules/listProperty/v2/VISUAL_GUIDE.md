# Visual Guide - Property Form V2

## 🎨 UI Components Overview

### 1. Main Sheet Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [X] List Your Property - Multi-Step Form                      │
│  Complete each section and click "Save & Continue" to progress │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│   SIDEBAR    │            MAIN CONTENT AREA                    │
│   (Fixed)    │            (Scrollable)                         │
│              │                                                  │
│  Property    │                                                  │
│  Badge       │    ┌──────────────────────────────┐            │
│              │    │                              │            │
│  Step List   │    │   Current Step Content      │            │
│   [1] ✓      │    │                              │            │
│   [2] ✓      │    │   Form Fields and Inputs    │            │
│   [3] ●      │    │                              │            │
│   [4] 🔒     │    │                              │            │
│   [5] 🔒     │    │                              │            │
│              │    └──────────────────────────────┘            │
│  Progress    │                                                  │
│  Bar: 30%    │                                                  │
│              │                                                  │
│              ├──────────────────────────────────────────────────┤
│              │  [← Back]                  [Save & Continue →] │
└──────────────┴──────────────────────────────────────────────────┘
```

## 🎯 Step States

### Current Step (Orange Gradient)
```
┌────────────────────────────────────────┐
│  ●  [3] Basic Configuration            │
│     🏠   Rooms & layout                │
│                                    ○   │
└────────────────────────────────────────┘
Background: Orange gradient
Border: Orange
Icon: White on orange
```

### Completed Step (Green)
```
┌────────────────────────────────────────┐
│  ✓  [1] Basic Details                  │
│     📍  Location & info            ✓   │
└────────────────────────────────────────┘
Background: White/Gray-900
Border: Green
Icon: White on green gradient
Status: Green checkmark
```

### Locked Step (Gray)
```
┌────────────────────────────────────────┐
│  🔒  [4] Area Details                  │
│     📏  Size & space              🔒   │
└────────────────────────────────────────┘
Background: Gray-50/Gray-900
Border: Gray
Icon: Gray
Status: Lock icon
Interaction: Disabled
```

### Unlocked but Not Started (White)
```
┌────────────────────────────────────────┐
│  ○  [3] Configuration                  │
│     🛏️  Rooms & layout                │
└────────────────────────────────────────┘
Background: White/Gray-900
Border: Gray
Icon: Orange on light background
Interaction: Clickable
```

## 📱 Review Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    Review Your Listing                          │
│          Please verify all details before submitting            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐       │
│  │ 🏠 Property Information                  [Edit] [▼] │       │
│  ├─────────────────────────────────────────────────────┤       │
│  │  Property Type: Apartment                           │       │
│  │  Ownership: Freehold                                │       │
│  │  Project: Green Valley Apartments                   │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐       │
│  │ 📍 Location Details                      [Edit] [▼] │       │
│  ├─────────────────────────────────────────────────────┤       │
│  │  City: Mumbai          Locality: Andheri West       │       │
│  │  Address: 123 Main Street, Near Mall                │       │
│  │  Property Age: 2 years                              │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐       │
│  │ 🏡 Property Specifications              [Edit] [▲] │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐       │
│  │ 💰 Listing & Pricing                    [Edit] [▲] │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│              [← Back]            [✓ Submit Listing]            │
└─────────────────────────────────────────────────────────────────┘
```

## 🎨 Color Palette

### Primary Colors
- **Orange Gradient**: `from-orange-500 to-orange-600`
  - Used for: Current step, primary buttons, branding
  - Hover: `from-orange-600 to-orange-700`

- **Green Gradient**: `from-green-500 to-green-600`
  - Used for: Completed steps, success states, submit button
  - Hover: `from-green-700 to-emerald-700`

### Section Colors
- **Property Info**: Orange (`from-orange-500 to-orange-600`)
- **Location**: Blue (`from-blue-500 to-cyan-500`)
- **Specifications**: Purple (`from-purple-500 to-pink-500`)
- **Pricing**: Green (`from-green-500 to-emerald-500`)

### Status Colors
- **Current**: Orange
- **Completed**: Green
- **Locked**: Gray
- **Error**: Red

## 📐 Spacing & Dimensions

### Sidebar
- Width: `w-72` (18rem / 288px)
- Padding: `p-4` (1rem / 16px)
- Step spacing: `space-y-2` (0.5rem / 8px)

### Main Content
- Max width: `max-w-4xl` (56rem / 896px) for most steps
- Max width: `max-w-5xl` (64rem / 1024px) for review
- Padding: `p-8` (2rem / 32px)
- Bottom padding: `pb-32` (8rem / 128px) for footer clearance

### Footer
- Position: `fixed bottom-0`
- Padding: `p-6` (1.5rem / 24px)
- Left offset: `left-72` (matches sidebar width)
- Z-index: `z-50`

## 🎭 Animation Details

### Step Transitions
```jsx
// Fade in from top
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}

// Fade in from bottom
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, delay: 0.2 }}

// Fade in from left
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: 0.3 }}
```

### Button Hover Effects
```jsx
whileHover={{ scale: 1.03 }}
whileTap={{ scale: 0.98 }}
```

### Progress Bar
```jsx
// Smooth width transition
transition={{ duration: 0.5, ease: 'easeOut' }}
```

## 🔤 Typography

### Headers
- Page Title: `text-3xl font-bold`
- Section Title: `text-2xl font-bold`
- Card Title: `text-xl font-semibold`
- Subsection: `text-lg font-semibold`

### Body Text
- Description: `text-base text-muted-foreground`
- Field Label: `text-sm font-medium`
- Help Text: `text-xs text-muted-foreground`

### Special Text
- Gradient text: `bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent`

## 🎯 Interactive States

### Buttons

#### Primary (Save & Continue)
```
Default: Orange gradient, white text, shadow
Hover:   Darker gradient, lifted shadow
Active:  Pressed effect
Disabled: Opacity 50%, cursor not-allowed
```

#### Secondary (Back)
```
Default: White background, orange border
Hover:   Orange light background
Active:  Pressed effect
```

### Step Navigation Items
```
Completed:
  Default: White bg, green border
  Hover:   Green tint, lifted shadow
  Click:   Navigate to step

Current:
  Default: Orange gradient, white text, large shadow
  No hover: Always highlighted

Locked:
  Default: Gray bg, gray border
  Hover:   No effect
  Click:   No action, disabled
```

## 📊 Progress Indicator

```
┌──────────────────────────────────────────┐
│ Overall Progress                    30%  │
│ ████████░░░░░░░░░░░░░░░░░░░░░░░░░░      │
│ Step 3 of 12                             │
└──────────────────────────────────────────┘
```

Features:
- Percentage shown on right
- Filled bar uses orange gradient
- Empty bar is light orange
- Current step / total steps shown below
- Updates smoothly with transitions

## 💡 Tips Section

```
┌──────────────────────────────────────────┐
│ 💡 Tip: Click "Save & Continue" to      │
│    move forward                          │
└──────────────────────────────────────────┘
```

Styling:
- Blue background (`bg-blue-50`)
- Blue border (`border-blue-200`)
- Small text (`text-xs`)
- Icon: 💡 emoji

## 🎊 Success Screen

```
┌─────────────────────────────────────────┐
│                                         │
│           ╭─────────────╮              │
│           │             │              │
│           │      ✓      │              │
│           │             │              │
│           ╰─────────────╯              │
│                                         │
│   Property Listed Successfully! 🎉      │
│                                         │
│   Your property listing has been        │
│   submitted and is now under review.    │
│                                         │
│      [View My Listings]                │
│                                         │
│   You'll receive a confirmation email   │
│   shortly.                              │
│                                         │
└─────────────────────────────────────────┘
```

Features:
- Large green circle with checkmark icon
- Scale animation on appear
- Green gradient button
- Celebratory emoji 🎉
- Clear messaging

## 🎨 Card Variations

### Property Type Selection Cards
```
┌─────────────────────────────────┐
│  🏢  Apartment                  │
│                                 │
│  Flat in a building         ✓  │
└─────────────────────────────────┘
```

States:
- Unselected: White bg, gray border
- Hover: Orange border, shadow
- Selected: Orange gradient bg, checkmark

### Review Section Cards
```
┌──────────────────────────────────────────┐
│ ╭──╮ Section Title         [Edit]  [▼]  │
│ │🏠│                                      │
│ ╰──╯                                     │
├──────────────────────────────────────────┤
│ Content area with details                │
│ • Item 1                                 │
│ • Item 2                                 │
└──────────────────────────────────────────┘
```

Features:
- Color-coded icon box
- Collapsible content
- Edit button
- Hover effect on entire card

## 📱 Responsive Considerations

- Sidebar collapses on mobile (< 768px)
- Grid layouts adjust to single column
- Footer buttons stack vertically if needed
- Reduced padding on small screens

This visual guide provides a comprehensive overview of all UI elements in the V2 property form!
