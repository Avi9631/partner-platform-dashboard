# Media Upload Integration Guide

## Overview
This guide explains how the frontend property listing form integrates with the backend media upload API.

## Data Flow

### 1. Frontend Data Structure

The form collects three types of media:

**Media (Images/Videos)** - `mediaList`
```javascript
{
  id: 'media-123',
  file: File,              // The actual file object
  preview: 'blob:...',     // Preview URL for display
  title: 'Front View',
  category: 'exterior',
  description: 'Beautiful entrance',
  type: 'image'           // 'image' or 'video'
}
```

**Documents** - `documents`
```javascript
{
  id: 'doc-123',
  file: File,
  fileName: 'deed.pdf',
  fileSize: 123456,
  fileType: 'application/pdf',
  category: 'legal',
  title: 'Property Deed',
  description: 'Official ownership document',
  uploadedAt: '2025-11-24T...'
}
```

**Property Plans** - `propertyPlans`
```javascript
{
  id: 'plan-123',
  file: File,
  fileName: 'floor-plan.pdf',
  fileSize: 234567,
  fileType: 'application/pdf',
  preview: 'blob:...',
  category: 'layout',
  title: 'Ground Floor Plan',
  description: 'Detailed layout',
  uploadedAt: '2025-11-24T...'
}
```

### 2. Service Layer Transformation

The `draftService.js` automatically transforms the data:

**Input** (from form):
```javascript
{
  propertyName: 'Luxury Villa',
  mediaList: [
    { file: File, title: 'Front View', type: 'image', category: 'exterior', description: '...' }
  ],
  documents: [
    { file: File, title: 'Deed', type: 'document', category: 'legal', description: '...' }
  ],
  propertyPlans: [
    { file: File, title: 'Floor Plan', type: 'floor-plan', category: 'layout', description: '...' }
  ]
}
```

**Output** (to API):
```javascript
// FormData structure:
draftId: '123'
draftData: JSON.stringify({
  propertyName: 'Luxury Villa',
  mediaData: [
    { title: 'Front View', type: 'image', category: 'exterior', description: '...' }
  ],
  docMediaData: [
    { title: 'Deed', type: 'document', category: 'legal', description: '...' }
  ],
  planMediaData: [
    { title: 'Floor Plan', type: 'floor-plan', category: 'layout', description: '...' }
  ]
})
mediaData: File (binary)
docMediaData: File (binary)
planMediaData: File (binary)
```

### 3. Backend Processing

The backend:
1. Detects `mediaData`, `docMediaData`, `planMediaData` fields
2. Uploads files to S3 in appropriate folders
3. Merges S3 URLs with metadata from `draftData`
4. Stores complete data in database

**Result in Database**:
```javascript
{
  propertyName: 'Luxury Villa',
  mediaData: [
    {
      title: 'Front View',
      type: 'image',
      category: 'exterior',
      description: '...',
      url: 'https://s3.../file.jpg',        // Added by backend
      key: 'listing-drafts/media/...',      // Added by backend
      originalName: 'front.jpg',            // Added by backend
      mimetype: 'image/jpeg',               // Added by backend
      uploadedAt: '2025-11-24T...'          // Added by backend
    }
  ],
  docMediaData: [...],
  planMediaData: [...]
}
```

## Usage in Components

### Example: Saving Form Data with Media

```javascript
import { usePropertyFormV2 } from '@/modules/listProperty/v2';

function MediaUploadStep() {
  const { saveAndContinue } = usePropertyFormV2();
  const [mediaList, setMediaList] = useState([]);

  const handleContinue = () => {
    // Just pass the data as-is, service handles the transformation
    saveAndContinue({
      mediaList: mediaList,  // Array with File objects
    });
  };

  return (
    // ... your component UI
  );
}
```

### Example: Context Auto-Saves to Backend

```javascript
// In PropertyFormContextV2.jsx
const saveAndContinue = useCallback(async (stepData) => {
  // Update form data
  const updatedFormData = { ...formData, ...stepData };
  updateFormData(stepData);
  
  // Service automatically detects files and uses FormData
  const saveResult = await saveDraft(updatedFormData);
  
  if (saveResult.success) {
    console.log('Saved with URLs:', saveResult.data);
  }
  
  // Move to next step
  setCurrentStep(currentStep + 1);
}, [formData, saveDraft, currentStep]);
```

## No Changes Required in Components

The existing components (`MediaUploadStepV2.jsx`, `DocumentUploadStepV2.jsx`, `PropertyPlanUploadStepV2.jsx`) **don't need any changes**. They already:

1. Store files with metadata in state
2. Call `saveAndContinue()` with the data
3. The service layer handles the API transformation automatically

## Verification

To verify the integration is working:

1. **Check FormData in Network Tab**:
   ```
   draftId: 123
   draftData: {"propertyName":"Villa","mediaData":[{...}]}
   mediaData: (binary)
   mediaData: (binary)
   ```

2. **Check Response**:
   ```json
   {
     "success": true,
     "data": {
       "draftData": {
         "mediaData": [
           {
             "title": "Front View",
             "url": "https://s3.../file.jpg",
             ...
           }
         ]
       }
     }
   }
   ```

3. **Check Console Logs**:
   - "Uploading files..." message from service
   - "Draft saved successfully" from context

## Error Handling

The service handles various error scenarios:

```javascript
// In draftService.js
if (!response.ok) {
  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.message || 'Failed to update draft');
}
```

Common errors:
- File too large (>100MB)
- Too many files (>20 per field)
- Invalid file type
- Draft not found
- Network errors

## Testing Checklist

- [ ] Upload single image
- [ ] Upload multiple images
- [ ] Upload video
- [ ] Upload documents
- [ ] Upload floor plans
- [ ] Upload all three types together
- [ ] Verify URLs are returned
- [ ] Verify files are accessible from S3
- [ ] Test with large files (near limit)
- [ ] Test error scenarios

## Backend API Reference

See `LISTING_DRAFT_MEDIA_UPLOAD.md` in backend repository for complete API documentation.

## Summary

✅ **No component changes needed** - Components already pass File objects  
✅ **Service auto-detects files** - Automatically switches to FormData  
✅ **Backend auto-uploads** - Files uploaded to S3, URLs merged with metadata  
✅ **Type mapping automatic** - `mediaList` → `mediaData`, `documents` → `docMediaData`, `propertyPlans` → `planMediaData`
