# 🚀 Quick Start Guide - Project Listing

Get your project listing system up and running in minutes!

## 📋 Prerequisites

Ensure you have these dependencies installed (already present in your property listing):
- React 18+
- motion/react (framer-motion)
- lucide-react
- react-hook-form
- shadcn/ui components
- Tailwind CSS

## 🎯 Step 1: Add to Your Router

```jsx
// In your App.jsx or routing file
import ListProjectV2Page from '@/modules/ListProjectV2';

// Add route
<Route path="/projects" element={<ListProjectV2Page />} />
```

## 🎨 Step 2: Test the Page

Navigate to `/projects` in your browser. You should see:
- ✅ Header with "My Projects" title
- ✅ Stats cards showing metrics
- ✅ Search and filter section
- ✅ Grid of 6 mock projects
- ✅ "List New Project" button

## 📝 Step 3: Open the Form

Click the **"List New Project"** button. You should see:
- ✅ Full-screen slide-in sheet from right
- ✅ "List Your Project" header
- ✅ Grid of 9 project type cards
- ✅ Select a project type
- ✅ "Continue" button becomes active

## ✅ Step 4: Verify It Works

1. **Select a project type** (e.g., "Apartment Complex")
2. **Click Continue** → Should move to next step
3. **See placeholder** → "Location Selection Step (Coming Soon)"
4. **Click Back** → Returns to project type selection
5. **Close sheet** → Asks for confirmation

## 🔧 Step 5: Customize (Optional)

### Change Colors
```jsx
// In your component or Tailwind config
// Replace orange-500 with your brand color
className="bg-orange-500" → className="bg-blue-500"
```

### Update Mock Data
```jsx
// In ListProjectV2.jsx, find mockProjects array
const mockProjects = [
  {
    id: 1,
    name: 'Your Project Name',
    location: 'Your City',
    // ... customize fields
  }
];
```

### Add Your Logo
```jsx
// In the header section
<img src="/your-logo.png" alt="Logo" className="h-8" />
```

## 🏗️ Step 6: Complete the Form Steps

The foundation is ready! Now add the remaining step components:

### Create Step Files (Copy pattern from PropertyTypeStepV2)

1. **LocationSelectionStepV2.jsx** - City/locality selector
2. **GeoTagStepV2.jsx** - Map integration
3. **BasicDetailsStepV2.jsx** - Project name, developer, launch date
4. **ProjectSpecificationsStepV2.jsx** - Units, towers, floors
5. **UnitConfigurationsStepV2.jsx** - Available BHK types
6. **PriceRangeStepV2.jsx** - Min/max pricing
7. **ApprovalsStepV2.jsx** - RERA, approvals
8. **ProjectStatusStepV2.jsx** - Construction status
9. **ProjectDescriptionStepV2.jsx** - Long description
10. **AmenitiesStepV2.jsx** - Select amenities
11. **ReviewAndSubmitV2.jsx** - Final review

### Update ProjectFormSheetV2.jsx

Uncomment the imports and switch cases as you create each step:

```jsx
// Uncomment these as you create the files
// import LocationSelectionStepV2 from './steps/LocationSelectionStepV2';
// import BasicDetailsStepV2 from './steps/BasicDetailsStepV2';

// In renderStepContent(), replace placeholders:
case 1:
  return <LocationSelectionStepV2 />; // Remove placeholder
```

## 🔌 Step 7: Connect to Backend

### Create API Service

```jsx
// services/projectService.js
export const projectService = {
  // Get all projects
  async getProjects() {
    const response = await fetch('/api/projects');
    return response.json();
  },

  // Create project
  async createProject(data) {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Update project
  async updateProject(id, data) {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Delete project
  async deleteProject(id) {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};
```

### Update ListProjectV2.jsx

```jsx
import { projectService } from '@/services/projectService';

// In useEffect
useEffect(() => {
  async function loadProjects() {
    setLoading(true);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  }
  
  loadProjects();
}, []);
```

### Handle Form Submission

```jsx
// In ReviewAndSubmitV2.jsx
const { formData } = useProjectFormV2();

const handleSubmit = async () => {
  try {
    await projectService.createProject(formData);
    // Show success message
    // Close form
    // Refresh list
  } catch (error) {
    // Show error message
  }
};
```

## 📱 Step 8: Make It Production-Ready

### Add Error Boundaries

```jsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary>
  <ListProjectV2Page />
</ErrorBoundary>
```

### Add Loading States

```jsx
{loading ? (
  <Loader2 className="w-8 h-8 animate-spin" />
) : (
  <ProjectList />
)}
```

### Add Toast Notifications

```jsx
import { useToast } from '@/components/ui/use-toast';

const { toast } = useToast();

toast({
  title: "Project created!",
  description: "Your project has been listed successfully.",
});
```

## 🎓 Pro Tips

### 1. Reuse Property Listing Steps
Many steps are similar between property and project listing. You can:
- Copy the LocationSelectionStepV2 from property listing
- Adapt the field names (property → project)
- Reuse validation schemas

### 2. Use React Hook Form
Each step should use react-hook-form for validation:

```jsx
import { useForm } from 'react-hook-form';

const methods = useForm({
  defaultValues: formData,
  mode: 'onChange'
});
```

### 3. Add Zod Validation

```jsx
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  projectName: z.string().min(3, 'Name too short'),
  developer: z.string().min(2, 'Developer required'),
  // ... more fields
});

const methods = useForm({
  resolver: zodResolver(schema)
});
```

### 4. Implement Draft Saving

```jsx
// Auto-save to localStorage
useEffect(() => {
  localStorage.setItem('projectDraft', JSON.stringify(formData));
}, [formData]);

// Load on mount
useEffect(() => {
  const draft = localStorage.getItem('projectDraft');
  if (draft) {
    setFormData(JSON.parse(draft));
  }
}, []);
```

### 5. Add Image Upload

```jsx
// Use a service like Cloudinary or AWS S3
const handleImageUpload = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  const { url } = await response.json();
  return url;
};
```

## 🐛 Troubleshooting

### Form not opening?
- Check if `showForm` state is updating
- Verify Sheet component is imported correctly
- Check for console errors

### Steps not advancing?
- Ensure `saveAndContinue` is called with data
- Check if `currentStep` is updating in context
- Verify project type is set

### Styles not applying?
- Ensure Tailwind is configured properly
- Check if dark mode classes need adjustment
- Verify all UI components are imported

### Icons not showing?
- Install lucide-react: `npm install lucide-react`
- Check import statements
- Verify icon names are correct

## 📚 Additional Resources

- **Property Listing Code**: Reference for similar patterns
- **v2/README.md**: Detailed documentation
- **COMPARISON.md**: Property vs Project differences
- **EXAMPLES.jsx**: Code examples
- **IMPLEMENTATION_SUMMARY.md**: Complete feature list

## 🎉 You're Done!

Your project listing system is now:
- ✅ Fully functional with mock data
- ✅ Ready to connect to backend
- ✅ Easy to customize
- ✅ Production-ready structure

Next: Build out the remaining step components and connect to your API!

---

**Need Help?** Check the property listing implementation for reference - both systems follow identical patterns.
