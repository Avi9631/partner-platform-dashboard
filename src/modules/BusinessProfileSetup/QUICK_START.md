# Business Profile Setup - Quick Start Guide

## 🚀 Getting Started

### What Was Created

A complete **BusinessProfileSetup** module with 3 steps:

1. **Business Details** - Name, registration, address, email
2. **Phone Verification** - Add & verify multiple business phones with OTP
3. **Owner/POC Verification** - Record verification video of owner/point of contact

## 📁 Files Created

```
BusinessProfileSetup/
├── index.jsx                              # Main wizard component
├── README.md                              # Full documentation
├── IMPLEMENTATION_SUMMARY.md              # Implementation details
├── QUICK_START.md                         # This file
├── components/
│   ├── Step1BusinessInfo.jsx             # Business form
│   ├── Step2MultiPhoneVerification.jsx   # Multi-phone OTP
│   ├── Step3OwnerVideoVerification.jsx   # Video recording
│   └── SubmissionSuccess.jsx             # Success screen
└── hooks/
    └── useMultiPhoneVerification.js      # Phone OTP hook
```

## 🎯 How to Use

### 1. Add to Router

```jsx
// In your App.jsx or router file
import BusinessProfileSetup from './modules/BusinessProfileSetup';

<Route 
  path="/business-setup" 
  element={<BusinessProfileSetup />} 
/>
```

### 2. Navigate to the Page

```jsx
// From any component
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/business-setup');
```

### 3. Try It Out!

Visit: `http://localhost:5173/business-setup` (or your dev URL)

## 📋 User Flow

### Step 1: Enter Business Details
- Fill in business name
- Enter registration number
- Provide business address
- Add business email
- Click **Next**

### Step 2: Verify Phone Numbers
1. Enter a phone number → Click **Add** (+)
2. Click **Send Verification Code**
3. Enter the 6-digit OTP from toast notification
4. Click **Verify**
5. ✅ Phone marked as verified
6. Repeat for more phone numbers
7. Click **Next** (all phones must be verified)

### Step 3: Record Verification Video
1. Click **Start Camera**
2. Allow camera permissions
3. Position yourself in frame
4. Click **Start Recording**
5. Follow instructions: move head left-to-right, then right-to-left
6. Click **Stop Recording**
7. Review video (or **Record Again**)
8. Click **Submit for Verification**

### Success!
- See confirmation screen
- Get workflow ID for tracking
- Click **Go to Dashboard**

## 🧪 Testing

### Development Mode
- **OTP is displayed in toast** - Check the notification for the code
- **OTP is logged to console** - Open DevTools to see the code
- Example OTP: `123456` (6 digits)

### Test Data Example

```javascript
// Step 1
businessName: "ABC Real Estate Agency"
registrationNumber: "REG-2024-001234"
businessAddress: "123 Main Street, Suite 100, City, State 12345"
businessEmail: "contact@abcrealestate.com"

// Step 2
Phone 1: "+1 (555) 123-4567" → OTP: [see toast]
Phone 2: "+1 (555) 987-6543" → OTP: [see toast]

// Step 3
[Record verification video with camera - follow head movement instructions]
```

## 🔧 Backend Setup Required

### Create API Endpoint

```javascript
// backend: POST /partnerBusiness/register

router.post('/register', 
  authenticate, // Your auth middleware
  upload.single('ownerImage'), // Multer for file upload
  async (req, res) => {
    try {
      const {
        businessName,
        registrationNumber,
        businessAddress,
        businessEmail,
        businessPhones // JSON string
      } = req.body;
      
      const ownerVideo = req.file;
      const userId = req.user.userId;
      
      // Parse phones
      const phones = JSON.parse(businessPhones);
      
      // Create business record
      const business = await PartnerBusiness.create({
        userId,
        businessName,
        registrationNumber,
        businessAddress,
        businessEmail,
        businessPhone: phones, // JSONB field
        verificationStatus: 'PENDING',
        // Save ownerVideo path...
      });
      
      res.json({
        success: true,
        data: {
          businessId: business.businessId,
          workflowId: 'workflow-123', // Your workflow ID
        },
        message: 'Business profile submitted'
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
);
```

## 🎨 Key Features

### ✨ Multi-Phone Verification
- Add unlimited business phones
- Each phone gets individual OTP
- Visual badges show verified status
- Can remove unverified phones
- Resend OTP if needed

### 📹 Video Verification
- Live camera preview
- Video recording with timer
- Head movement instructions
- Video playback preview
- Re-record option
- Clear requirements shown
- Privacy notice included

### ✅ Form Validation
- Real-time error messages
- Required field indicators
- Email format validation
- Phone format validation
- No duplicate phones
- All phones must be verified

### 📱 Mobile Responsive
- Works on all screen sizes
- Touch-friendly buttons
- Scrollable step indicator
- Optimized layouts

## 🐛 Common Issues

### Camera Not Working?
- **HTTPS Required**: Camera needs secure connection
- **Check Permissions**: Allow camera in browser
- **Already in Use**: Close other apps using camera
- **Browser Support**: Use Chrome/Firefox/Safari/Edge

### OTP Not Showing?
- **Check Toast**: OTP appears in notification (top-right)
- **Check Console**: Also logged to DevTools console
- **Dev Mode Only**: In production, OTP sent via SMS

### Cannot Proceed to Next Step?
- **Step 1**: Fill all required fields (marked with *)
- **Step 2**: Verify ALL added phone numbers
- **Step 3**: Record owner/POC verification video

## 🔐 Security Notes

### Current (Development)
- ⚠️ OTP shown in UI (for testing)
- ⚠️ No SMS gateway
- ⚠️ No rate limiting

### Production Required
- 🔒 Integrate SMS gateway (Twilio, SNS, etc.)
- 🔒 Never send OTP to client
- 🔒 Rate limit OTP requests
- 🔒 Encrypt stored videos
- 🔒 Add CSRF protection
- 🔒 Validate file types/sizes
- 🔒 Video compression and optimization

## 📚 Documentation

- **README.md** - Comprehensive feature docs
- **IMPLEMENTATION_SUMMARY.md** - Technical details
- **QUICK_START.md** - This guide

## 🚦 Next Steps

### For Development
1. ✅ Module created and ready
2. ⬜ Add route to your app
3. ⬜ Create backend endpoint
4. ⬜ Test complete flow
5. ⬜ Integrate SMS gateway (production)

### For Production
1. ⬜ Remove OTP from toast/console
2. ⬜ Implement server-side OTP
3. ⬜ Setup SMS gateway
4. ⬜ Add rate limiting
5. ⬜ Secure video storage
6. ⬜ Add video compression
7. ⬜ Add reCAPTCHA
8. ⬜ Setup verification workflow
9. ⬜ Create admin approval interface

## 💡 Tips

### Adding More Fields?
Edit `Step1BusinessInfo.jsx` to add more business fields.

### Changing Step Count?
Update `totalSteps` in `index.jsx` and add new step components.

### Customizing Colors?
All components use Tailwind classes - easy to customize.

### Need Help?
Check the comprehensive README.md for detailed info.

## 🎉 You're All Set!

The BusinessProfileSetup module is ready to use. Just add it to your router and start testing!

**Happy coding! 🚀**
