# Property Listing Form - Sidebar Navigation Design

## 🎨 Visual Design Overview

### Desktop Layout (>1024px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────┐ ┌───────────────────────────────────────────────────┐ │
│  │                 │ │ Apartment Property                    [Save] [X]   │ │
│  │ List Property   │ ├───────────────────────────────────────────────────┤ │
│  │ Complete all... │ │                                                   │ │
│  ├─────────────────┤ │                                                   │ │
│  │ Property Type:  │ │  ┌─────────────────────────────────────────────┐ │ │
│  │ ► Apartment     │ │  │ [1] ✓  Basic Details                        │ │ │
│  │   [Change]      │ │  │                                             │ │ │
│  ├─────────────────┤ │  │ Fill in the details below...                │ │ │
│  │ Progress: 5/15  │ │  │                                             │ │ │
│  │ ████████░░░░░   │ │  ├─────────────────────────────────────────────┤ │ │
│  ├─────────────────┤ │  │                                             │ │ │
│  │ 1 ✓ Property    │ │  │  [Listing Type]                             │ │ │
│  │    Type         │ │  │  ○ Sale  ● Rent  ○ Lease                   │ │ │
│  ├─────────────────┤ │  │                                             │ │ │
│  │ 2 ➤ Basic       │ │  │  [Ownership Type]                           │ │ │
│  │    Details      │ │  │  ○ Freehold  ○ Leasehold                   │ │ │
│  ├─────────────────┤ │  │                                             │ │ │
│  │ 3   Location    │ │  │  [Project Name]                             │ │ │
│  │    Selection    │ │  │  [Search projects...]                       │ │ │
│  ├─────────────────┤ │  │                                             │ │ │
│  │ 4   Area        │ │  │  [...more form fields...]                   │ │ │
│  │    Details      │ │  │                                             │ │ │
│  ├─────────────────┤ │  └─────────────────────────────────────────────┘ │ │
│  │ 5   Furnishing  │ │                                                   │ │
│  ├─────────────────┤ │  [◄ Previous]                        [Next ►]     │ │
│  │ 6   Parking     │ │                                                   │ │
│  ├─────────────────┤ │                                                   │ │
│  │ 7   Location    │ │                                                   │ │
│  │    Attributes   │ │                                                   │ │
│  ├─────────────────┤ │                                                   │ │
│  │ ...             │ │                                                   │ │
│  └─────────────────┘ └───────────────────────────────────────────────────┘ │
│   320px width            Flexible width (max-w-5xl centered)               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Color Scheme

#### Sidebar
- **Background**: White (`bg-white`) / Dark Gray (`dark:bg-gray-900`)
- **Border**: Gray 200 (`border-gray-200`) / Dark Gray 800 (`dark:border-gray-800`)
- **Current Step**: Orange gradient (`from-orange-500 to-orange-600`)
- **Completed Step**: Green 50 background (`bg-green-50`) with green 500 icon
- **Progress Bar**: Orange gradient (`from-orange-500 to-orange-600`)

#### Main Content
- **Background**: Gradient from orange-50/30 to white
- **Header**: White with border
- **Form Cards**: White with subtle border and shadow
- **Buttons**: Orange gradient for primary, outline for secondary

### Step States Visualization

```
┌─────────────────────────┐
│ ✓ Completed Step        │  → Green background (bg-green-50)
│ [✓] Step Name           │     Green checkmark icon
└─────────────────────────┘     Green text

┌─────────────────────────┐
│ ➤ Current Step          │  → Orange gradient background
│ [2] ➤ Step Name     ►   │     White text, arrow indicator
└─────────────────────────┘     Shadow effect

┌─────────────────────────┐
│ Pending Step            │  → Light gray background
│ [3] Step Name           │     Gray text, numbered icon
└─────────────────────────┘     Hover effect
```

## 📐 Layout Specifications

### Sidebar Dimensions
- Width: `320px` (w-80)
- Position: `sticky` with `top-0`
- Height: `100vh` (full viewport height)
- Overflow: `overflow-y-auto` for step list

### Main Content Area
- Max Width: `1280px` (max-w-5xl)
- Padding: `px-6 py-8`
- Centered: `mx-auto`

### Header Heights
- Top Header: `auto` height with `px-6 py-4` padding
- Sidebar Header: `auto` height with `p-6` padding

### Spacing
- Step Items: `space-y-2` (8px gap)
- Form Sections: `space-y-6` (24px gap)
- Card Padding: `p-6` (24px all around)

## 🎯 Interactive Elements

### Step Navigation Items

```jsx
// Step item states
Active: {
  background: "bg-gradient-to-r from-orange-500 to-orange-600",
  text: "text-white",
  icon: "bg-white/20 ring-2 ring-white/30",
  shadow: "shadow-lg shadow-orange-500/30"
}

Completed: {
  background: "bg-green-50 dark:bg-green-950/30",
  text: "text-green-700 dark:text-green-400",
  icon: "bg-green-500 text-white (checkmark)",
  hover: "hover:shadow-md"
}

Pending: {
  background: "hover:bg-gray-50 dark:hover:bg-gray-800",
  text: "text-gray-700 dark:text-gray-300",
  icon: "bg-gray-200 dark:bg-gray-700",
  hover: "hover:shadow-md"
}
```

### Buttons

```jsx
// Primary button (Next/Continue)
className="bg-gradient-to-r from-orange-500 to-orange-600 
           hover:from-orange-600 hover:to-orange-700 
           shadow-lg gap-2"

// Secondary button (Previous)
className="border-orange-200 hover:bg-orange-50 
           hover:border-orange-500 gap-2"

// Complete button (Last step)
className="bg-gradient-to-r from-green-600 to-emerald-600 
           hover:from-green-700 hover:to-emerald-700"
```

## 🎬 Animations

### Step Transitions

```jsx
// Sidebar step items (staggered entrance)
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: index * 0.05 }}

// Main content
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
transition={{ duration: 0.3 }}

// Progress bar
initial={{ width: 0 }}
animate={{ width: `${percentage}%` }}
transition={{ duration: 0.5 }}
```

### Hover Effects

```jsx
// Step items
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}

// Form cards
hover:shadow-lg transition-shadow duration-300
```

## 🔧 Component Structure

### File Organization

```
v2/
├── components/
│   ├── PropertyFormPageV2.jsx           # ✨ Updated - Main page with sidebar
│   ├── PropertyFormSidebar.jsx          # ✨ New - Sidebar navigation
│   ├── StepFormWrapper.jsx              # ✨ New - Form wrapper with auto-save
│   ├── PropertyFormSheetV2.jsx          # Existing - Sheet overlay
│   ├── SaveAndContinueFooter.jsx        # ⚠️ Deprecated - No longer needed
│   └── steps/
│       ├── PropertyTypeStepV2.jsx       # ✨ Updated - Removed footer
│       ├── BasicDetailsStepV2.jsx       # Can use StepFormWrapper
│       ├── BasicConfigurationStepV2.jsx
│       └── ...
├── context/
│   └── PropertyFormContextV2.jsx        # No changes needed
├── config/
│   └── stepConfiguration.js             # No changes needed
├── SIDEBAR_REVAMP_GUIDE.md              # ✨ New - Migration guide
└── index.js                             # ✨ Updated - New exports
```

## 📱 Responsive Breakpoints

### Current Implementation (Desktop First)

```jsx
// Large screens (>1024px)
- Full sidebar visible (320px)
- Centered content (max-w-5xl)
- Side-by-side layout

// Medium screens (768px-1024px)
- Sidebar still visible
- Slightly narrower content
- Recommend collapsible sidebar

// Small screens (<768px)
- Recommend bottom sheet or drawer
- Full-width content
- Hamburger menu for steps
```

### Recommended Mobile Enhancement

```jsx
// Add to PropertyFormPageV2.jsx
<div className="hidden lg:block">
  <PropertyFormSidebar />
</div>

<div className="lg:hidden">
  {/* Mobile navigation */}
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" className="fixed bottom-4 left-4">
        <Menu className="w-5 h-5 mr-2" />
        Steps ({completedSteps.size}/{totalSteps})
      </Button>
    </SheetTrigger>
    <SheetContent side="bottom">
      <PropertyFormSidebar />
    </SheetContent>
  </Sheet>
</div>
```

## 🎨 Theme Support

### Dark Mode

All components support dark mode using Tailwind's `dark:` prefix:

```jsx
// Sidebar
bg-white dark:bg-gray-900
border-gray-200 dark:border-gray-800
text-gray-700 dark:text-gray-300

// Main content
bg-white dark:bg-gray-900
from-orange-50/30 dark:from-orange-950/10

// Buttons
hover:bg-orange-50 dark:hover:bg-orange-900/30
```

## 📊 Progress Tracking

### Visual Indicators

1. **Progress Bar**
   - Width: 100% of sidebar
   - Height: 8px (h-2)
   - Background: Gray 200
   - Fill: Orange gradient
   - Animation: Smooth width transition

2. **Progress Text**
   - Format: "5 / 15"
   - Color: Orange 600
   - Size: text-xs font-bold

3. **Step Icons**
   - Completed: Green checkmark
   - Current: Step number in orange circle
   - Pending: Step number in gray circle

## 🚀 Performance Optimizations

1. **Auto-save Debouncing**
   - 2-second delay
   - Prevents excessive API calls
   - Cancels on unmount

2. **Lazy Rendering**
   - Only current step rendered
   - Previous steps unmounted
   - Fast navigation

3. **Memoization**
   - Memoized step configuration
   - Memoized form data
   - Optimized re-renders

## 📝 Usage Example

```jsx
// In your app router
import { PropertyFormPageV2 } from '@/modules/listProperty/v2';

// Route configuration
<Route path="/list-property/new" element={<PropertyFormPageV2 />} />
<Route path="/list-property/edit/:draftId" element={<PropertyFormPageV2 />} />

// Navigate to page
navigate('/list-property/new');
navigate('/list-property/edit/draft-123');
```

## 🎯 Key Features

✅ **Sidebar Navigation** - All steps visible at once
✅ **Direct Navigation** - Click any step to jump to it
✅ **Progress Tracking** - Visual progress bar and indicators
✅ **Auto-save** - Debounced auto-save on form changes
✅ **Responsive** - Works on all screen sizes
✅ **Dark Mode** - Full dark mode support
✅ **Animations** - Smooth transitions and effects
✅ **Accessibility** - Keyboard navigation support
✅ **Type Safety** - Full TypeScript support
✅ **Customizable** - Easy to theme and modify

## 🎉 Result

A modern, user-friendly property listing form with:
- Better visual hierarchy
- Faster navigation
- Clearer progress tracking
- Improved user experience
- Cleaner codebase
- Better maintainability

Perfect for complex multi-step forms! 🚀
