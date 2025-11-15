# Automatic Token Refresh Implementation

## Overview
This implementation adds automatic access token refresh functionality when the access token expires. The system intelligently detects expired tokens and seamlessly refreshes them without user intervention.

## How It Works

### 1. Centralized API Client (`src/lib/apiClient.js`)
A new `apiClient.js` module wraps all API calls with automatic token refresh logic:

- **`apiFetch()`**: Enhanced fetch wrapper that intercepts 401/403 responses
- **`apiCall()`**: Convenience method for JSON API calls with automatic error handling
- **Token Refresh Logic**: 
  - Detects when an API call returns 401 (Unauthorized) or 403 (Forbidden)
  - Automatically calls `/auth/refresh-token` to get a new access token
  - Retries the original request with the new token
  - Prevents infinite loops by skipping retry for auth endpoints
  - Handles concurrent refresh requests (only one refresh at a time)

### 2. Token Refresh Triggers

#### A. On `/auth/status` Failure
When the auth status check returns an expired token:
- `apiFetch` intercepts the 401 response
- Calls `/auth/refresh-token` to get a new access token
- Retries `/auth/status` with the new token
- Updates user state with fresh data

#### B. On Any API Call Failure
When any authenticated API call fails due to expired token:
- The same automatic refresh logic applies
- Example: Creating a listing draft, updating profile, etc.
- User experiences no interruption

### 3. Updated Services

#### `authService.js`
- Uses `apiCall()` for all auth-related API calls
- Automatically benefits from token refresh

#### `draftService.js`
- Uses `apiCall()` for all listing draft operations
- Simplified error handling (no manual token checks needed)

#### `AuthContext.jsx`
- Uses `apiFetch()` for auth status checks and logout
- Listens for `auth:logout` events from apiClient
- Maintains periodic token refresh (every 25 minutes)

### 4. Backend Updates

#### `authMiddleware.js`
- Returns 401 (instead of 403) for expired tokens
- Includes error code in response for better debugging

#### `auth.route.js` - `/auth/status`
- Returns detailed error information when token is expired
- Indicates whether token is expired vs invalid

## Flow Diagram

```
User Action → API Call
    ↓
Access Token Expired (401/403)?
    ↓ YES
Refresh Token (POST /auth/refresh-token)
    ↓
Refresh Successful?
    ↓ YES
Retry Original API Call
    ↓
Return Response to User

    ↓ NO (Refresh Failed)
Trigger Logout Event
    ↓
Redirect to Sign In
```

## Key Features

### 1. **Automatic & Transparent**
- Users don't experience session interruptions
- No manual token management needed in components

### 2. **Concurrent Request Handling**
- Multiple simultaneous API calls with expired tokens
- Only one refresh request is made
- All pending requests wait for the same refresh

### 3. **Infinite Loop Prevention**
- Auth endpoints (`/auth/status`, `/auth/refresh-token`) skip retry
- `skipRetry` flag prevents recursive refresh attempts

### 4. **Graceful Degradation**
- If refresh fails, user is logged out cleanly
- Custom event (`auth:logout`) triggers logout in AuthContext

### 4. **On-Demand Token Refresh Only**
- NO automatic/proactive refresh timers
- Tokens only refresh when user actively makes API calls
- Sessions naturally expire when user is inactive
- More secure than periodic refresh which extends sessions indefinitely

## Implementation Details

### Access Token Expiry
- **Current**: 15 minutes
- **Production Ready**: ✅ Appropriate for security

### Refresh Token Expiry
- **Current**: 7 days
- **Production Ready**: ✅ Balances security with user experience

### Token Refresh Strategy
- **On-Demand Only**: Tokens refresh automatically when user makes API calls
- **NO Proactive Refresh**: No background timers extending sessions
- **Natural Expiry**: Inactive sessions expire after 15 minutes (access token) + 7 days (refresh token)

## Usage Example

```javascript
// Before (manual token handling)
const response = await fetch(`${backendUrl}/api/endpoint`, {
  credentials: "include",
});
if (!response.ok) {
  if (response.status === 401) {
    // Manually refresh token and retry
  }
}

// After (automatic token refresh)
import { apiCall } from "../lib/apiClient";
const data = await apiCall(`${backendUrl}/api/endpoint`);
// Token refresh happens automatically if needed
```

## Testing

### Test Scenarios
1. **Expired Access Token on Page Load**
   - Open app after token expires
   - `/auth/status` should auto-refresh and load user data

2. **Expired Token During API Call**
   - Perform action after token expires
   - API call should succeed after automatic refresh

3. **Refresh Token Expired**
   - Wait for refresh token to expire
   - User should be logged out and redirected to sign-in

4. **Multiple Concurrent Requests**
   - Make several API calls simultaneously with expired token
   - Only one refresh should occur, all requests should succeed

## Security Considerations

1. **HttpOnly Cookies**: Tokens stored in httpOnly cookies (not accessible via JavaScript)
2. **Secure Flag**: Enabled in production for HTTPS-only transmission
3. **SameSite**: Set to "None" for cross-origin requests (adjust based on deployment)
4. **Short-lived Access Tokens**: Minimizes exposure if compromised
5. **Longer Refresh Tokens**: Balances security with user experience

## Future Enhancements

1. **Token Rotation**: Implement refresh token rotation for enhanced security
2. **Sliding Sessions**: Extend refresh token expiry on active usage
3. **Device Management**: Track and manage multiple active sessions
4. **Biometric Re-authentication**: Require additional auth for sensitive operations

## Troubleshooting

### Issue: Infinite redirect loop
**Solution**: Check that auth endpoints are excluded from retry logic

### Issue: Token refresh not working
**Solution**: Verify refresh token is valid and not expired in cookies

### Issue: User logged out unexpectedly
**Solution**: Check refresh token expiry time (should be 7 days)

## Files Modified

### Frontend
- `src/lib/apiClient.js` (NEW)
- `src/context/AuthContext.jsx`
- `src/services/authService.js`
- `src/services/draftService.js`

### Backend
- `src/middleware/authMiddleware.js`
- `src/routes/auth.route.js`
