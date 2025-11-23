# New Upload Steps Documentation

## Overview

Two new steps have been added to the property listing form to handle media and document uploads:

1. **Media Upload Step** - Upload images and videos with metadata
2. **Document Upload Step** - Upload legal and ownership documents with metadata

Both steps are positioned after the "Amenities" step and before the "Review & Submit" step.

---

## Step 13: Media Upload (MediaUploadStepV2.jsx)

### Purpose
Allows users to upload property images and videos with titles and descriptions to showcase the property effectively.

### Features

#### 🖼️ Image Upload
- **Required**: At least one image must be uploaded
- **Supported formats**: JPEG, JPG, PNG, WebP
- **Maximum file size**: 5MB per image
- **Multiple uploads**: Users can upload multiple images at once
- **Preview**: Real-time preview of uploaded images
- **Metadata**: Each image can have:
  - Title (e.g., "Living Room View")
  - Description (brief details about the image)

#### 🎥 Video Upload
- **Optional**: Videos are not required
- **Supported formats**: MP4, WebM, MOV (QuickTime)
- **Maximum file size**: 50MB per video
- **Multiple uploads**: Users can upload multiple videos
- **Preview**: Video preview with play controls
- **Metadata**: Each video can have:
  - Title (e.g., "Virtual Property Tour")
  - Description (brief details about the video)

#### 📋 Upload Features
- **Drag-and-drop support**: Easy file selection
- **Error handling**: Clear error messages for:
  - Invalid file types
  - Oversized files
- **Remove functionality**: Delete any uploaded media
- **Edit metadata**: Update titles and descriptions after upload
- **Visual feedback**: 
  - Upload count badges
  - Type indicators (Image/Video badges)
  - Preview thumbnails
- **Pro tips**: Helpful suggestions for better media quality

### Validation Rules

1. **Required**: At least 1 image must be uploaded
2. **Image types**: Only JPEG, PNG, WebP allowed
3. **Video types**: Only MP4, WebM, MOV allowed
4. **Image size**: Maximum 5MB
5. **Video size**: Maximum 50MB

### User Experience

```
┌─────────────────────────────────────────┐
│  Upload Images & Videos                 │
├─────────────────────────────────────────┤
│                                         │
│  📸 Property Images * (Required)        │
│  ┌─────────────────────────────────┐   │
│  │ [+] Add Images                  │   │
│  │ 3 images uploaded               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Image Grid - 2 columns]               │
│  ┌──────────┐  ┌──────────┐           │
│  │ Preview  │  │ Preview  │           │
│  │ Image 1  │  │ Image 2  │           │
│  │ Title    │  │ Title    │           │
│  │ Desc     │  │ Desc     │           │
│  └──────────┘  └──────────┘           │
│                                         │
│  🎥 Property Videos (Optional)          │
│  ┌─────────────────────────────────┐   │
│  │ [+] Add Videos                  │   │
│  │ 1 video uploaded                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Video Grid]                           │
│  ┌──────────┐                          │
│  │ Preview  │                          │
│  │ Video 1  │                          │
│  │ Title    │                          │
│  │ Desc     │                          │
│  └──────────┘                          │
│                                         │
│  💡 Media Best Practices                │
│  • Use high-quality images...           │
│                                         │
│  [Back] [Save & Continue]              │
└─────────────────────────────────────────┘
```

### Data Structure

```javascript
{
  images: [
    {
      id: "img-1234567890-0.123",
      file: File,
      preview: "blob:http://...",
      title: "Living Room View",
      description: "Spacious living room with natural lighting",
      type: "image"
    }
  ],
  videos: [
    {
      id: "vid-1234567890-0.456",
      file: File,
      preview: "blob:http://...",
      title: "Property Walkthrough",
      description: "Complete tour of the property",
      type: "video"
    }
  ]
}
```

---

## Step 14: Document Upload (DocumentUploadStepV2.jsx)

### Purpose
Allows users to upload legal, ownership, and approval documents to verify property authenticity and compliance.

### Features

#### 📁 Document Categories

The documents are organized into three categories:

##### 1. **Ownership Documents** 🏠
- Property ownership and title documents
- Examples:
  - Title Deed
  - Sale Deed
  - Registration Papers

##### 2. **Legal Documents** 🛡️
- Legal compliance documents
- Examples:
  - NOC (No Objection Certificate)
  - Encumbrance Certificate
  - Legal Opinion

##### 3. **Approval Documents** ✅
- Government and authority approvals
- Examples:
  - Building Approval
  - Occupancy Certificate
  - RERA Certificate

#### 📤 Upload Features
- **Optional**: No documents are required (but recommended)
- **Supported formats**: PDF, JPG, PNG, DOC, DOCX
- **Maximum file size**: 10MB per document
- **Multiple uploads**: Upload multiple documents per category
- **Category organization**: Documents grouped by type
- **Metadata**: Each document can have:
  - Title (e.g., "Sale Deed Copy")
  - Description (relevant details about the document)
- **File information**: Shows filename and file size
- **Remove functionality**: Delete any uploaded document
- **Summary section**: Overview of uploaded documents by category

### Validation Rules

1. **Optional**: Documents are not required
2. **File types**: PDF, DOC, DOCX, JPG, PNG only
3. **File size**: Maximum 10MB per document
4. **No limit**: Can upload as many documents as needed

### User Experience

```
┌─────────────────────────────────────────┐
│  Upload Documents                       │
├─────────────────────────────────────────┤
│                                         │
│  🏠 Ownership Documents (Optional)      │
│  Property ownership and title docs      │
│  Examples: Title Deed, Sale Deed...     │
│  ┌─────────────────────────────────┐   │
│  │ [+] Add Documents  | 2 documents│   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 📄 sale-deed.pdf                │   │
│  │ 2.4 MB                          │   │
│  │ Title: [Sale Deed Copy]         │   │
│  │ Description: [...]              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  🛡️ Legal Documents (Optional)          │
│  [Similar layout]                       │
│                                         │
│  ✅ Approval Documents (Optional)        │
│  [Similar layout]                       │
│                                         │
│  📊 Document Summary                     │
│  ┌─────────────────────────────────┐   │
│  │ Total: 5 | Ownership: 2         │   │
│  │ Legal: 2 | Approval: 1          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  💡 Document Upload Best Practices       │
│  • Ensure documents are clear...        │
│                                         │
│  [Back] [Save & Continue]              │
└─────────────────────────────────────────┘
```

### Data Structure

```javascript
{
  documents: [
    {
      id: "doc-1234567890-0.789",
      file: File,
      fileName: "sale-deed.pdf",
      fileSize: 2457600, // bytes
      fileType: "application/pdf",
      category: "ownership", // or "legal", "approval"
      title: "Sale Deed Copy",
      description: "Original sale deed from 2020",
      uploadedAt: "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## Integration with Form Flow

### Step Order

The new steps are integrated into the existing flow as follows:

**Before:**
```
...
11. Listing Info
12. Amenities
13. Review & Submit
```

**After:**
```
...
11. Listing Info
12. Amenities
13. Media Upload ⭐ NEW
14. Document Upload ⭐ NEW
15. Review & Submit
```

### Context Integration

Both steps are fully integrated with the `PropertyFormContextV2`:

```javascript
// Both steps use the same context API
const { saveAndContinue, previousStep, formData } = usePropertyFormV2();

// Data is saved to context on continue
const handleContinue = () => {
  const data = { images, videos };
  saveAndContinue(data);
};
```

### Navigation

- **Back Button**: Returns to "Amenities" step
- **Save & Continue**: Saves data and proceeds to next step
- **Progressive Unlock**: Steps unlock only after previous steps are completed
- **Edit Access**: Users can return to these steps from the Review page

---

## Technical Implementation

### File Storage Strategy

The current implementation stores file objects in the form context. For production deployment, you should:

1. **Upload to Server**: Send files to backend API
2. **Store URLs**: Replace file objects with URLs in form data
3. **Handle Uploads**: Implement progress tracking
4. **Error Handling**: Retry failed uploads

### Example Backend Integration

```javascript
const handleContinue = async () => {
  // Upload images to server
  const uploadedImages = await Promise.all(
    images.map(async (img) => {
      const formData = new FormData();
      formData.append('file', img.file);
      formData.append('title', img.title);
      formData.append('description', img.description);
      
      const response = await uploadService.uploadImage(formData);
      return {
        url: response.url,
        title: img.title,
        description: img.description,
        type: 'image'
      };
    })
  );
  
  // Save URLs to context instead of file objects
  saveAndContinue({ images: uploadedImages, videos: uploadedVideos });
};
```

### Memory Management

- **Object URLs**: Properly cleaned up using `URL.revokeObjectURL()`
- **File previews**: Generated on upload for immediate feedback
- **Cleanup**: URLs revoked when media is removed

---

## Styling and UX

### Design Principles

1. **Visual Hierarchy**: Clear sections for different media types
2. **Feedback**: Real-time upload status and error messages
3. **Accessibility**: Proper labels and ARIA attributes
4. **Responsive**: Works on all screen sizes
5. **Consistent**: Matches existing form design patterns

### Color Scheme

- **Primary**: Orange (#F97316) for CTAs and highlights
- **Success**: Green for completed states
- **Error**: Red for validation errors
- **Muted**: Gray for secondary information

### Components Used

- `Card`, `CardHeader`, `CardContent` - Container structure
- `Button` - Upload and action buttons
- `Badge` - Status indicators
- `Input`, `Textarea` - Metadata inputs
- `motion` (Framer Motion) - Smooth animations
- `ProTipV2` - Helpful tips section

---

## Best Practices for Users

### Media Upload Tips
1. Upload high-quality images with good lighting
2. Include photos of all rooms and amenities
3. Keep videos short (30-60 seconds)
4. Add descriptive titles to help buyers

### Document Upload Tips
1. Ensure documents are clear and legible
2. Upload certified copies when possible
3. PDFs are preferred for compatibility
4. Keep originals ready for verification

---

## Future Enhancements

Potential improvements for future versions:

### Media Upload
- [ ] Image cropping and rotation
- [ ] Bulk metadata editing
- [ ] Automatic image optimization
- [ ] Video transcoding
- [ ] 360° virtual tour support
- [ ] Progress bars for large uploads
- [ ] Drag-and-drop reordering
- [ ] Set primary/cover image

### Document Upload
- [ ] OCR for automatic document recognition
- [ ] Document verification status
- [ ] Expiry date tracking for time-sensitive documents
- [ ] Document templates/examples
- [ ] Bulk upload with auto-categorization
- [ ] Digital signature support
- [ ] Document preview modal

### General
- [ ] Cloud storage integration (AWS S3, Google Cloud Storage)
- [ ] CDN integration for faster delivery
- [ ] Automatic backup and recovery
- [ ] Version control for documents
- [ ] Audit trail for uploads/deletions

---

## Testing Checklist

### Media Upload Testing
- [ ] Upload valid image (JPEG, PNG, WebP)
- [ ] Upload invalid image format
- [ ] Upload oversized image (>5MB)
- [ ] Upload multiple images at once
- [ ] Add title and description to image
- [ ] Remove uploaded image
- [ ] Upload valid video (MP4, WebM, MOV)
- [ ] Upload invalid video format
- [ ] Upload oversized video (>50MB)
- [ ] Preview image and video
- [ ] Try to continue without any images (should be blocked)
- [ ] Continue with at least one image (should succeed)

### Document Upload Testing
- [ ] Upload valid PDF document
- [ ] Upload valid image as document
- [ ] Upload valid DOC/DOCX file
- [ ] Upload invalid file format
- [ ] Upload oversized document (>10MB)
- [ ] Add title and description to document
- [ ] Upload documents to different categories
- [ ] Remove uploaded document
- [ ] View document summary
- [ ] Continue without any documents (should succeed - optional)

### Navigation Testing
- [ ] Navigate back to Amenities step
- [ ] Save and continue to next step
- [ ] Return to upload steps from Review page
- [ ] Verify data persists after navigation

---

## API Integration Requirements

### Endpoints Needed

#### 1. Upload Image
```
POST /api/listings/upload/image
Content-Type: multipart/form-data

Body:
- file: File
- title: string
- description: string
- listingDraftId: string

Response:
{
  success: true,
  data: {
    url: "https://cdn.example.com/images/abc123.jpg",
    thumbnailUrl: "https://cdn.example.com/thumbnails/abc123.jpg",
    id: "img_123"
  }
}
```

#### 2. Upload Video
```
POST /api/listings/upload/video
Content-Type: multipart/form-data

Body:
- file: File
- title: string
- description: string
- listingDraftId: string

Response:
{
  success: true,
  data: {
    url: "https://cdn.example.com/videos/xyz789.mp4",
    thumbnailUrl: "https://cdn.example.com/thumbnails/xyz789.jpg",
    id: "vid_456",
    duration: 45 // seconds
  }
}
```

#### 3. Upload Document
```
POST /api/listings/upload/document
Content-Type: multipart/form-data

Body:
- file: File
- title: string
- description: string
- category: string (ownership|legal|approval)
- listingDraftId: string

Response:
{
  success: true,
  data: {
    url: "https://cdn.example.com/documents/doc789.pdf",
    id: "doc_789",
    fileName: "sale-deed.pdf",
    fileSize: 2457600
  }
}
```

#### 4. Delete Media/Document
```
DELETE /api/listings/upload/:id

Response:
{
  success: true,
  message: "File deleted successfully"
}
```

---

## Summary

The two new upload steps enhance the property listing form by:

✅ **Media Upload Step**
- Captures high-quality property images and videos
- Requires at least one image
- Supports metadata for better organization
- Provides real-time previews

✅ **Document Upload Step**
- Organizes legal documents by category
- All documents are optional
- Supports multiple file formats
- Helps verify property authenticity

Both steps maintain consistency with the existing form design and provide excellent user experience with clear validation, helpful tips, and intuitive interfaces.
