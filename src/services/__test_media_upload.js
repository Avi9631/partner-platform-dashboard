/**
 * Test/Example: Media Upload Integration
 * 
 * This file demonstrates how to test the media upload functionality
 * You can use this in the browser console to verify the integration
 */

// Example: Test data structure that components create
const exampleFormData = {
  propertyName: 'Luxury Villa',
  propertyType: 'villa',
  location: 'Mumbai',
  
  // Media (from MediaUploadStepV2)
  mediaList: [
    {
      id: 'media-1',
      file: new File([''], 'front-view.jpg', { type: 'image/jpeg' }),
      preview: 'blob:...',
      title: 'Front View',
      category: 'exterior',
      description: 'Beautiful entrance with landscaping',
      type: 'image'
    },
    {
      id: 'media-2',
      file: new File([''], 'living-room.jpg', { type: 'image/jpeg' }),
      preview: 'blob:...',
      title: 'Living Room',
      category: 'interior',
      description: 'Spacious living area',
      type: 'image'
    }
  ],
  
  // Documents (from DocumentUploadStepV2)
  documents: [
    {
      id: 'doc-1',
      file: new File([''], 'deed.pdf', { type: 'application/pdf' }),
      fileName: 'deed.pdf',
      fileSize: 123456,
      fileType: 'application/pdf',
      category: 'legal',
      title: 'Property Deed',
      description: 'Official ownership document',
      uploadedAt: new Date().toISOString()
    }
  ],
  
  // Property Plans (from PropertyPlanUploadStepV2)
  propertyPlans: [
    {
      id: 'plan-1',
      file: new File([''], 'floor-plan.pdf', { type: 'application/pdf' }),
      fileName: 'floor-plan.pdf',
      fileSize: 234567,
      fileType: 'application/pdf',
      preview: 'blob:...',
      category: 'layout',
      title: 'Ground Floor Plan',
      description: 'Detailed layout of ground floor',
      uploadedAt: new Date().toISOString()
    }
  ]
};

// Test function to verify FormData creation
function testFormDataCreation(draftId, formData) {
  const testFormData = new FormData();
  testFormData.append('draftId', draftId);

  // Process mediaList
  const mediaDataMetadata = [];
  if (formData.mediaList && Array.isArray(formData.mediaList)) {
    formData.mediaList.forEach((media) => {
      if (media.file instanceof File) {
        mediaDataMetadata.push({
          title: media.title || '',
          type: media.type || 'image',
          category: media.category || 'general',
          description: media.description || '',
        });
        testFormData.append('mediaData', media.file);
      }
    });
  }

  // Process documents
  const docMediaDataMetadata = [];
  if (formData.documents && Array.isArray(formData.documents)) {
    formData.documents.forEach((doc) => {
      if (doc.file instanceof File) {
        docMediaDataMetadata.push({
          title: doc.title || '',
          type: doc.type || 'document',
          category: doc.category || 'legal',
          description: doc.description || '',
        });
        testFormData.append('docMediaData', doc.file);
      }
    });
  }

  // Process property plans
  const planMediaDataMetadata = [];
  if (formData.propertyPlans && Array.isArray(formData.propertyPlans)) {
    formData.propertyPlans.forEach((plan) => {
      if (plan.file instanceof File) {
        planMediaDataMetadata.push({
          title: plan.title || '',
          type: plan.type || 'floor-plan',
          category: plan.category || 'layout',
          description: plan.description || '',
        });
        testFormData.append('planMediaData', plan.file);
      }
    });
  }

  // Build draftData
  const draftDataForAPI = {
    ...formData,
    mediaData: mediaDataMetadata,
    docMediaData: docMediaDataMetadata,
    planMediaData: planMediaDataMetadata,
  };

  // Remove original arrays
  delete draftDataForAPI.mediaList;
  delete draftDataForAPI.documents;
  delete draftDataForAPI.propertyPlans;

  testFormData.append('draftData', JSON.stringify(draftDataForAPI));

  return testFormData;
}

// Test the FormData creation
console.log('Testing FormData creation...');
const testFormData = testFormDataCreation('123', exampleFormData);

// Log FormData contents (for debugging)
console.log('\n=== FormData Contents ===');
for (let [key, value] of testFormData.entries()) {
  if (value instanceof File) {
    console.log(`${key}:`, {
      name: value.name,
      type: value.type,
      size: value.size
    });
  } else {
    console.log(`${key}:`, value);
  }
}

// Expected API Request Format
console.log('\n=== Expected API Request ===');
console.log('URL: /api/draft/updateListingDraft');
console.log('Method: PATCH');
console.log('Content-Type: multipart/form-data');
console.log('\nFormData Fields:');
console.log('- draftId: "123"');
console.log('- draftData: JSON string with mediaData, docMediaData, planMediaData arrays');
console.log('- mediaData: File (front-view.jpg)');
console.log('- mediaData: File (living-room.jpg)');
console.log('- docMediaData: File (deed.pdf)');
console.log('- planMediaData: File (floor-plan.pdf)');

// Expected Response Format
console.log('\n=== Expected Response ===');
const expectedResponse = {
  success: true,
  data: {
    draftId: 123,
    draftData: {
      propertyName: 'Luxury Villa',
      mediaData: [
        {
          title: 'Front View',
          type: 'image',
          category: 'exterior',
          description: 'Beautiful entrance with landscaping',
          url: 'https://s3.amazonaws.com/.../front-view.jpg',
          key: 'listing-drafts/media/user-123/uuid.jpg',
          originalName: 'front-view.jpg',
          mimetype: 'image/jpeg',
          uploadedAt: '2025-11-24T...'
        },
        {
          title: 'Living Room',
          type: 'image',
          category: 'interior',
          description: 'Spacious living area',
          url: 'https://s3.amazonaws.com/.../living-room.jpg',
          key: 'listing-drafts/media/user-123/uuid.jpg',
          originalName: 'living-room.jpg',
          mimetype: 'image/jpeg',
          uploadedAt: '2025-11-24T...'
        }
      ],
      docMediaData: [
        {
          title: 'Property Deed',
          type: 'document',
          category: 'legal',
          description: 'Official ownership document',
          url: 'https://s3.amazonaws.com/.../deed.pdf',
          key: 'listing-drafts/documents/user-123/uuid.pdf',
          originalName: 'deed.pdf',
          mimetype: 'application/pdf',
          uploadedAt: '2025-11-24T...'
        }
      ],
      planMediaData: [
        {
          title: 'Ground Floor Plan',
          type: 'floor-plan',
          category: 'layout',
          description: 'Detailed layout of ground floor',
          url: 'https://s3.amazonaws.com/.../floor-plan.pdf',
          key: 'listing-drafts/plans/user-123/uuid.pdf',
          originalName: 'floor-plan.pdf',
          mimetype: 'application/pdf',
          uploadedAt: '2025-11-24T...'
        }
      ]
    }
  },
  message: 'Draft updated successfully'
};

console.log(JSON.stringify(expectedResponse, null, 2));

// How to use in actual code
console.log('\n=== Usage in Components ===');
console.log(`
// In your component (e.g., MediaUploadStepV2)
import { usePropertyFormV2 } from '@/modules/listProperty/v2';

function MediaUploadStepV2() {
  const { saveAndContinue } = usePropertyFormV2();
  const [mediaList, setMediaList] = useState([]);

  const handleContinue = () => {
    // Just pass the data - service handles everything
    saveAndContinue({
      mediaList: mediaList  // Array with File objects
    });
  };

  return (/* your UI */);
}
`);

export { testFormDataCreation, exampleFormData };
