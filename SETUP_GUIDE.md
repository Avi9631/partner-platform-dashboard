# Mandatory Profile Completion - Quick Start Guide

## What Was Implemented

A mandatory profile completion flow that forces first-time users to complete their profile before accessing the platform.

## Quick Setup Steps

### 1. Run Database Migration

Execute the SQL migration to add the `profile_completed` column:

```sql
ALTER TABLE platform_users 
ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE;

UPDATE platform_users 
SET profile_completed = TRUE 
WHERE user_first_name IS NOT NULL 
  AND user_last_name IS NOT NULL 
  AND user_phone IS NOT NULL;
```

Or run the migration file:
```bash
# PostgreSQL
psql -U your_username -d your_database -f migrations/add-profile-completed-column.sql
```

### 2. Restart Backend Server

The backend changes will be automatically picked up when you restart:
```bash
cd partner-platform-backend
npm start
# or
nodemon server.js
```

### 3. Restart Frontend Development Server

```bash
cd partner-platform-dashboard
npm run dev
```

## Testing the Flow

### Test as New User:
1. Open a private/incognito browser window
2. Navigate to your app (e.g., `http://localhost:5173`)
3. Click "Sign in with Google" or "Sign in with Microsoft"
4. Use an account that has never signed in before
5. **Expected behavior:**
   - After OAuth redirect, you should be on `/profile-setup`
   - Try navigating to `/` or `/list-property` - you'll be redirected back to `/profile-setup`
6. Fill in the form:
   - First Name: (required)
   - Last Name: (required)
   - Phone: (required, format: +1234567890 or (123) 456-7890)
   - Account Type: Choose from Individual, Agent, or Organization
7. Click "Complete Profile"
8. **Expected behavior:**
   - Success toast notification
   - Redirect to home page (`/`)
   - Now you can access all routes normally

### Test as Existing User:
1. Sign in with an account that already has `profileCompleted = true`
2. **Expected behavior:**
   - Direct access to the home page
   - No redirect to profile setup
   - Normal navigation to all routes

## Files Modified

### Backend:
- `src/entity/PlatformUser.entity.js` - Added `profileCompleted` field
- `src/routes/auth.route.js` - Updated `/auth/status` endpoint
- `src/service/UserService.service.js` - Added `completeProfile()` method
- `src/controller/User.controller.js` - Added `completeProfile()` controller
- `src/routes/user.route.js` - Added `/partnerUser/completeProfile` route
- `migrations/add-profile-completed-column.sql` - New migration file

### Frontend:
- `src/pages/ProfileSetup.jsx` - New profile setup page (created)
- `src/components/ProtectedRoute.jsx` - Added profile completion check
- `src/main.jsx` - Added `/profile-setup` route

## API Endpoint

**POST** `/partnerUser/completeProfile`

**Headers:**
- Cookie: `accessToken` (automatically sent with `credentials: 'include'`)

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "accountType": "INDIVIDUAL"
}
```

**Response (Success - 200):**
```json
{
  "status": "success",
  "message": "Profile completed successfully",
  "data": {
    "user": {
      "userId": 1,
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "email": "john.doe@example.com",
      "accountType": "INDIVIDUAL",
      "profileCompleted": true,
      "userStatus": "ACTIVE",
      ...
    }
  }
}
```

## Troubleshooting

### Issue: Profile setup page not showing
- Check browser console for errors
- Verify `/auth/status` endpoint returns `profileCompleted: false` for new users
- Check network tab to ensure user data is being loaded

### Issue: Cannot submit profile form
- Check validation errors in the form
- Verify phone number format (must match: `/^[+]?[\d\s\-()]+$/`)
- Check browser console and network tab for API errors

### Issue: Redirecting back to profile setup after completion
- Check if the backend successfully updated `profileCompleted` to `true`
- Verify `checkAuthStatus()` is called after form submission
- Check browser cookies for valid `accessToken`

### Issue: Migration fails
- Check if column already exists: `SELECT column_name FROM information_schema.columns WHERE table_name = 'platform_users';`
- Verify database connection and permissions
- Check table name matches your actual table (might be different casing)

## Configuration

No additional configuration needed. The implementation uses:
- Existing `VITE_BACKEND_URL` environment variable
- Existing authentication cookies (`accessToken`, `refreshToken`)
- Existing UI components from shadcn/ui

## Next Steps (Optional Enhancements)

1. **Add phone verification:** Implement OTP verification for phone numbers
2. **Profile editing:** Allow users to edit their profile later
3. **Additional fields:** Add more optional fields (company name, address, etc.)
4. **Admin approval:** Require admin approval before activating accounts
5. **Profile progress indicator:** Show completion percentage for optional fields
