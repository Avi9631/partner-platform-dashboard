# ProfileSetup Module

This module handles the multi-step profile setup process for partner users.

## Structure

```
ProfileSetup/
├── index.jsx                          # Main ProfileSetup component
├── components/                        # Step components
│   ├── StepIndicator.jsx             # Visual step progress indicator
│   ├── Step1PersonalInfo.jsx         # Step 1: Personal information form
│   ├── Step2PhoneVerification.jsx    # Step 2: Phone verification with OTP
│   ├── Step3Location.jsx             # Step 3: Location capture
│   ├── Step4ProfileImage.jsx         # Step 4: Profile image capture
│   └── Step5Review.jsx               # Step 5: Review and submit
├── hooks/                             # Custom hooks
│   ├── useCamera.js                  # Camera functionality hook
│   ├── useLocation.js                # Location capture hook
│   └── usePhoneVerification.js       # Phone verification logic hook
└── README.md                          # This file
```

## Components

### Main Component
- **index.jsx**: Orchestrates the entire profile setup flow, manages state, and handles form submission.

### Step Components
Each step is a separate component for better maintainability:

1. **Step1PersonalInfo**: Collects firstName, lastName, phone, and accountType
2. **Step2PhoneVerification**: Handles OTP sending and verification
3. **Step3Location**: Captures user's geolocation and address
4. **Step4ProfileImage**: Live camera capture for profile photo
5. **Step5Review**: Final review before submission

### Shared Components
- **StepIndicator**: Visual representation of current step and progress

## Custom Hooks

### useCamera
Handles all camera-related functionality:
- `startCamera()`: Initializes camera stream
- `stopCamera()`: Stops camera stream and cleanup
- `capturePhoto(onCapture)`: Captures photo from video stream
- Returns: `{ isCameraActive, cameraLoading, cameraError, videoRef, canvasRef, startCamera, stopCamera, capturePhoto }`

### useLocation
Manages geolocation capture:
- `captureLocation(onLocationCapture)`: Gets current location and reverse geocodes to address
- Returns: `{ locationLoading, captureLocation }`

### usePhoneVerification
Handles phone verification flow:
- `sendOtp(phone, onOtpGenerated)`: Sends OTP to phone
- `verifyOtp(inputOtp, generatedOtp, onVerified, onError)`: Verifies OTP input
- `resendOtp(phone, onReset)`: Resends OTP
- Returns: `{ otpSent, otpLoading, sendOtp, verifyOtp, resendOtp }`

## Usage

```jsx
import ProfileSetup from "./modules/ProfileSetup";

// In your router
<Route path="/profile-setup" element={<ProfileSetup />} />
```

## Features

- 5-step guided profile setup process
- Form validation at each step
- Live camera capture for profile photos
- Geolocation capture with reverse geocoding
- Phone verification with OTP
- Responsive design with Tailwind CSS
- Toast notifications for user feedback
- Clean separation of concerns

## Dependencies

- React Router (navigation)
- Shadcn UI components
- Lucide React (icons)
- Custom hooks for useAuth and useToast

## State Management

The main component manages:
- Form data (personal info, location, image)
- Current step number
- Validation errors
- Loading states

Custom hooks manage their specific domain state (camera, location, OTP).

## API Integration

Submits profile data to `/partnerUser/update` endpoint with:
- firstName, lastName, phone, accountType
- latitude, longitude, address
- profileImage (file upload)
- completeProfile flag
