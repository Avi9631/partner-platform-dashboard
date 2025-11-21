# Business Profile Setup Module

A comprehensive multi-step business profile setup and verification system with phone number verification and owner identity validation.

## Overview

This module provides a streamlined 3-step process for partners to set up and verify their business profiles:

1. **Business Information** - Collect core business details
2. **Phone Verification** - Add and verify multiple business phone numbers
3. **Owner/POC Verification** - Record verification video of owner/point of contact

## Features

### Step 1: Business Information
- Business name
- Registration number
- Business address
- Business email
- Form validation with error handling
- Required field indicators

### Step 2: Multi-Phone Verification
- **Add multiple phone numbers** for the business
- **Individual OTP verification** for each phone number
- Real-time verification status indicators
- Remove unverified phone numbers
- Resend OTP functionality
- Visual verification badges
- At least one verified phone required to proceed

### Step 3: Owner/POC Video Verification
- Camera integration for live video recording
- Head movement instructions (left-to-right, right-to-left)
- Recording timer display
- Video preview with re-record option
- Clear video requirements and guidelines
- Privacy notice for users
- Camera permission handling
- Error handling for camera issues

## Component Structure

```
BusinessProfileSetup/
├── index.jsx                           # Main component with step navigation
├── components/
│   ├── Step1BusinessInfo.jsx          # Business details form
│   ├── Step2MultiPhoneVerification.jsx # Multi-phone verification
│   ├── Step3OwnerVideoVerification.jsx # Owner video recording
│   └── SubmissionSuccess.jsx          # Success screen
├── hooks/
│   └── useMultiPhoneVerification.js   # Phone verification logic
└── README.md                          # This file
```

## Usage

### Basic Integration

```jsx
import BusinessProfileSetup from './modules/BusinessProfileSetup';

// In your router
<Route path="/business-setup" element={<BusinessProfileSetup />} />
```

### API Endpoint

The module submits data to:
```
POST /partnerBusiness/register
```

**Request Format:**
- Content-Type: `multipart/form-data`
- Fields:
  - `businessName`: string
  - `registrationNumber`: string
  - `businessAddress`: string
  - `businessEmail`: string
  - `businessPhones`: JSON array of verified phones
  - `ownerVideo`: File (video)

**Example Payload:**
```json
{
  "businessName": "ABC Real Estate",
  "registrationNumber": "REG123456",
  "businessAddress": "123 Main St, City, State 12345",
  "businessEmail": "contact@abcrealestate.com",
  "businessPhones": [
    {"phone": "+1 (555) 123-4567"},
    {"phone": "+1 (555) 987-6543"}
  ],
  "ownerVideo": <File>
}
```

## Phone Verification Flow

### Adding Phone Numbers
1. User enters phone number in input field
2. Clicks "Add" button or presses Enter
3. Phone is validated and added to the list
4. Duplicate detection prevents adding same number twice

### Verifying Phone Numbers
1. User clicks "Send Verification Code" for a phone
2. OTP is generated and sent (simulated in development)
3. User enters the 6-digit OTP code
4. Clicks "Verify" to validate the code
5. Success shows green badge, failure shows error message
6. User can resend OTP if needed

### Requirements
- At least one phone number must be added
- All added phone numbers must be verified
- Unverified numbers can be removed from the list
- Verified numbers cannot be removed (must be kept)

## Video Verification Flow

### Recording Owner/POC Verification Video
1. User clicks "Start Camera" to activate webcam
2. Camera permissions are requested
3. Live video feed displays in rounded frame
4. User positions themselves in the frame
5. User clicks "Start Recording" to begin
6. Instructions appear: move head left-to-right, then right-to-left
7. Recording timer shows elapsed time
8. User clicks "Stop Recording" to finish
9. Video preview is shown with option to re-record
10. Video is validated on form submission

### Video Requirements
- Face clearly visible and well-lit throughout
- Follow head movement instructions
- Recording duration: 5-10 seconds
- No sunglasses or face coverings
- Well-lit environment
- Optional: Hold ID document next to face
- Optional: State your name or business name

## Validation Rules

### Business Information (Step 1)
- **Business Name**: Required, non-empty
- **Registration Number**: Required, non-empty
- **Business Address**: Required, non-empty
- **Business Email**: Required, valid email format

### Phone Verification (Step 2)
- **At least one phone**: Must add minimum one phone number
- **All verified**: All added phones must be verified with OTP
- **Valid format**: Phone numbers must match pattern `^[+]?[\d\s\-()]+$`
- **No duplicates**: Cannot add same phone number twice

### Owner/POC Verification (Step 3)
- **Video required**: Must record owner/POC verification video
- **Camera access**: Requires camera permissions
- **Recording time**: Minimum recording duration enforced

## Customization

### Styling
The module uses Tailwind CSS and shadcn/ui components. Customize by:
- Modifying Tailwind classes in components
- Updating `components/ui/*` theme components
- Adjusting color schemes in border/background classes

### OTP Configuration
Currently uses simulated OTP. For production:

1. Update `useMultiPhoneVerification.js`:
```javascript
const sendOtp = async (phone, onOtpGenerated) => {
  const response = await fetch(`${backendUrl}/api/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  const data = await response.json();
  onOtpGenerated(data.otp); // Or handle differently for security
};
```

2. Remove OTP display from toast notification
3. Implement server-side OTP verification

### Backend Integration

Update the submission endpoint in `index.jsx`:
```javascript
const response = await fetch(`${backendUrl}/partnerBusiness/register`, {
  method: "POST",
  credentials: "include",
  body: submitData,
});
```

## Database Schema

### PartnerBusiness Entity
```javascript
{
  businessId: INTEGER (PK, auto-increment),
  userId: INTEGER (FK to platform_user),
  businessName: STRING(200),
  registrationNumber: STRING(100),
  businessAddress: TEXT,
  businessEmail: STRING(100),
  businessPhone: JSONB, // Array of phone objects
  verificationStatus: ENUM('PENDING', 'VERIFIED', 'REJECTED'),
  ownerVideoUrl: STRING, // Path to stored video
  // ... timestamp fields
}
```

## Security Considerations

1. **OTP Verification**: In production, never send OTP in response. Use SMS gateway.
2. **Video Storage**: Store owner verification videos securely with encryption
3. **Phone Validation**: Server-side validation of phone format and uniqueness
4. **Rate Limiting**: Implement rate limits on OTP sending
5. **CSRF Protection**: Ensure CSRF tokens for form submission
6. **Data Privacy**: Comply with GDPR/privacy regulations for storing PII
7. **Video Processing**: Consider video size limits and compression

## Dependencies

- React 18+
- react-router-dom
- Tailwind CSS
- shadcn/ui components
- lucide-react (icons)

## Browser Compatibility

- **Camera Feature**: Requires browsers supporting `getUserMedia` API
  - Chrome 53+
  - Firefox 36+
  - Safari 11+
  - Edge 12+

## Testing

### Manual Testing Checklist

#### Step 1: Business Information
- [ ] All fields required validation works
- [ ] Email format validation works
- [ ] Can navigate to next step with valid data
- [ ] Cannot proceed with empty fields

#### Step 2: Phone Verification
- [ ] Can add new phone numbers
- [ ] Cannot add duplicate phone numbers
- [ ] OTP is sent and displayed (dev mode)
- [ ] Can verify phone with correct OTP
- [ ] Error shown for incorrect OTP
- [ ] Can resend OTP
- [ ] Can remove unverified phone numbers
- [ ] Cannot remove verified phone numbers
- [ ] Cannot proceed without at least one verified phone
- [ ] Cannot proceed with unverified phones

#### Step 3: Owner/POC Verification
- [ ] Camera permission requested
- [ ] Camera starts successfully
- [ ] Can start recording
- [ ] Recording timer displays
- [ ] Instructions appear during recording
- [ ] Can stop recording
- [ ] Video preview displays correctly
- [ ] Video has audio/video playback
- [ ] Can re-record video
- [ ] Cannot proceed without recorded video

#### Form Submission
- [ ] Success message displayed after submission
- [ ] Workflow ID shown (if available)
- [ ] Can navigate to dashboard
- [ ] Form data properly formatted in request

## Troubleshooting

### Camera Not Working
- Ensure HTTPS connection (camera requires secure context)
- Check browser camera permissions
- Verify no other app is using the camera
- Check browser compatibility

### OTP Not Received (Production)
- Verify SMS gateway configuration
- Check phone number format
- Ensure SMS service has credits
- Check spam/carrier filtering

### Form Submission Fails
- Check network connectivity
- Verify backend endpoint is accessible
- Check authentication/authorization
- Review browser console for errors
- Validate file size limits for videos
- Check video format compatibility (webm, mp4)

## Future Enhancements

- [ ] Add document upload for business registration certificate
- [ ] Implement email verification
- [ ] Add progress save/resume functionality
- [ ] Support for international phone formats
- [ ] Add facial recognition for owner verification
- [ ] Video quality/duration validation
- [ ] Video compression before upload
- [ ] Bulk phone number upload
- [ ] PDF generation for verification summary
- [ ] Real-time status tracking
- [ ] Admin dashboard for approval workflow

## Support

For issues or questions:
1. Check browser console for errors
2. Review validation error messages
3. Verify API endpoint configuration
4. Contact development team with error logs
