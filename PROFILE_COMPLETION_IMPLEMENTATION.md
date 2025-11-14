# Profile Completion Implementation

## Overview
This implementation adds a mandatory profile completion flow for first-time users. Users who sign in for the first time will be redirected to a profile setup page where they must complete their profile before accessing the platform.

## Features
- ✅ Mandatory profile completion for new users
- ✅ Profile setup form with validation
- ✅ Automatic redirect to profile setup page for incomplete profiles
- ✅ Database field to track profile completion status
- ✅ Backend API endpoint for profile completion
- ✅ Frontend route protection based on profile completion

## Backend Changes

### 1. Database Schema (`PlatformUser.entity.js`)
Added a new field to track profile completion:
```javascript
profileCompleted: {
  type: Sequelize.BOOLEAN,
  field: "profile_completed",
  defaultValue: false,
}
```

### 2. Migration File
Location: `migrations/add-profile-completed-column.sql`
- Adds `profile_completed` column to the database
- Sets existing users with complete information to `profile_completed = true`

Run the migration:
```bash
# Execute the SQL migration in your database
psql -U your_username -d your_database -f migrations/add-profile-completed-column.sql
```

### 3. Auth Status Endpoint (`routes/auth.route.js`)
Updated `/auth/status` to return profile completion status and user details:
```javascript
{
  authenticated: true,
  user: {
    userId: number,
    userEmail: string,
    firstName: string,
    lastName: string,
    phone: string,
    accountType: string,
    profileCompleted: boolean
  }
}
```

### 4. New API Endpoint
**POST** `/partnerUser/completeProfile`

Request body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "accountType": "INDIVIDUAL" // Optional: INDIVIDUAL, AGENT, or ORGANIZATION
}
```

Response:
```json
{
  "status": "success",
  "message": "Profile completed successfully",
  "data": {
    "user": {
      // Updated user object
    }
  }
}
```

### 5. Service Layer (`UserService.service.js`)
Added `completeProfile` method that:
- Validates required fields (firstName, lastName, phone)
- Updates user profile information
- Sets `profileCompleted` to `true`
- Updates `userStatus` to `ACTIVE`
- Generates name initials

## Frontend Changes

### 1. Profile Setup Page (`pages/ProfileSetup.jsx`)
A new page component that:
- Displays a form to collect user information
- Validates all required fields
- Handles form submission
- Shows loading states and error messages
- Redirects to home page after successful completion

### 2. Protected Route (`components/ProtectedRoute.jsx`)
Enhanced to check profile completion:
```jsx
<ProtectedRoute requireProfileComplete={true}>
  {/* Protected content */}
</ProtectedRoute>
```

- `requireProfileComplete={true}` (default): Redirects incomplete profiles to `/profile-setup`
- `requireProfileComplete={false}`: Skips profile completion check

### 3. Routing (`main.jsx`)
Added new route for profile setup:
```jsx
{
  path: "profile-setup",
  element: (
    <ProtectedRoute requireProfileComplete={false}>
      <ProfileSetup />
    </ProtectedRoute>
  ),
}
```

### 4. Auth Context (`context/AuthContext.jsx`)
Already provides user profile data including `profileCompleted` flag through the `/auth/status` endpoint.

## User Flow

### First-Time User
1. User signs in via Google/Microsoft OAuth
2. Backend creates user account with `profileCompleted = false`
3. User is redirected back to the app
4. `ProtectedRoute` detects incomplete profile
5. User is automatically redirected to `/profile-setup`
6. User fills in required information (firstName, lastName, phone, accountType)
7. Profile is submitted and validated
8. Backend updates user with `profileCompleted = true` and `userStatus = ACTIVE`
9. User is redirected to home page
10. User can now access all protected routes

### Returning User
1. User signs in
2. `ProtectedRoute` checks `user.profileCompleted`
3. If `true`, user proceeds to requested page
4. If `false`, user is redirected to `/profile-setup`

## Testing

### Test First-Time User Flow
1. Sign in with a new Google/Microsoft account
2. Verify redirect to `/profile-setup`
3. Try to manually navigate to other routes (should redirect back to profile setup)
4. Fill in the profile form with valid data
5. Submit the form
6. Verify redirect to home page
7. Verify ability to access other routes

### Test Existing User Flow
1. Sign in with existing account that has `profileCompleted = true`
2. Verify direct access to home page
3. Verify ability to navigate to all routes

### Test Validation
1. Try submitting profile form without required fields
2. Verify error messages appear
3. Try invalid phone number format
4. Verify validation error

## Database Migration

Before deploying, run the migration:

```bash
# For PostgreSQL
psql -U your_username -d your_database -f migrations/add-profile-completed-column.sql

# For MySQL
mysql -u your_username -p your_database < migrations/add-profile-completed-column.sql
```

Or manually execute:
```sql
ALTER TABLE platform_users 
ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE;

UPDATE platform_users 
SET profile_completed = TRUE 
WHERE user_first_name IS NOT NULL 
  AND user_last_name IS NOT NULL 
  AND user_phone IS NOT NULL;
```

## Environment Variables
No new environment variables required. Uses existing `VITE_BACKEND_URL` on frontend.

## Dependencies
No new dependencies required. Uses existing UI components and libraries.

## Notes
- Users cannot bypass the profile setup page
- The profile setup page is accessible only to authenticated users
- Form validation is implemented on both frontend and backend
- Phone number format validation uses regex pattern: `/^[+]?[\d\s\-()]+$/`
- Account type defaults to "INDIVIDUAL" if not specified
- User status is automatically set to "ACTIVE" upon profile completion
