# Token Refresh Testing Guide

## Quick Testing Steps

### 1. Test Automatic Refresh on Page Load

**Steps:**
1. Sign in to the application
2. Wait for access token to expire (1 minute based on current config)
3. Refresh the browser page
4. Observe the network tab in DevTools

**Expected Result:**
- `/auth/status` returns 401 (token expired)
- `/auth/refresh-token` is called automatically
- `/auth/status` is retried and returns 200
- User remains authenticated

### 2. Test Automatic Refresh on API Call

**Steps:**
1. Sign in and navigate to any page
2. Wait for access token to expire (1 minute)
3. Perform an action that requires API call (e.g., create listing draft)
4. Observe network tab

**Expected Result:**
- Initial API call returns 401
- `/auth/refresh-token` is called
- Original API call is retried
- Action completes successfully

### 3. Test Multiple Concurrent Requests

**Steps:**
1. Sign in and wait for token to expire
2. Quickly perform multiple actions (e.g., open multiple pages)
3. Observe network tab

**Expected Result:**
- Multiple API calls fail with 401
- Only ONE `/auth/refresh-token` call is made
- All failed requests are retried after refresh
- All requests succeed

### 4. Test Refresh Token Expiry

**Steps:**
1. Sign in to the application
2. Wait for refresh token to expire (15 minutes based on current config)
3. Try to perform any action or refresh page

**Expected Result:**
- `/auth/refresh-token` fails
- User is logged out automatically
- User is redirected to sign-in page

### 5. Test Proactive Token Refresh

**Steps:**
1. Sign in and keep the application active
2. Wait for 25 minutes (or check earlier with shorter interval)
3. Observe network tab

**Expected Result:**
- `/auth/refresh-token` is called automatically every 25 minutes
- No interruption to user experience
- Access token stays fresh

## Network Tab Monitoring

### Success Flow
```
1. GET /auth/status → 401 (token expired)
2. POST /auth/refresh-token → 200 (new token)
3. GET /auth/status → 200 (with user data)
```

### Failure Flow (Refresh Token Expired)
```
1. GET /auth/status → 401 (token expired)
2. POST /auth/refresh-token → 403 (refresh token invalid)
3. User logged out and redirected
```

## Console Logging

Look for these messages:
- ✅ "Token refresh failed:" (when refresh token expires)
- ✅ "Auth status check failed:" (when auth check fails)
- ✅ "Authenticated user:" (in backend logs when token is valid)

## Debugging Tips

### Check Cookie Values
```javascript
// In browser console
document.cookie
```
Look for:
- `accessToken` (short-lived, 1 min)
- `refreshToken` (longer-lived, 15 min)

### Force Token Expiry (For Testing)
Update backend `auth.route.js`:
```javascript
let accessToken = jwt.sign(claims, accessTokenSecret, {
  expiresIn: "10s" // Very short for testing
});
```

### Monitor Token Refresh
```javascript
// Add to src/lib/apiClient.js
console.log("🔄 Refreshing token...");
console.log("✅ Token refreshed successfully");
console.log("❌ Token refresh failed");
```

## Common Issues

### Issue: Token refreshes but user still logged out
**Check:** 
- Refresh token expiry (should be longer than access token)
- Cookie settings (httpOnly, secure, sameSite)

### Issue: Infinite refresh loop
**Check:**
- Auth endpoints are excluded from retry logic
- `skipRetry` flag is working correctly

### Issue: Multiple refresh calls on concurrent requests
**Check:**
- `isRefreshing` flag and `refreshPromise` are shared correctly
- All requests wait for the same refresh promise

## Performance Monitoring

Track these metrics:
1. **Refresh Success Rate**: % of successful token refreshes
2. **Retry Count**: Average retries per failed request
3. **Response Time**: Time to complete refresh + retry flow

## Production Readiness ✅

The current configuration is production-ready with secure defaults:

1. **Access Token Expiry**: ✅ 15 minutes
   - Short enough to minimize exposure if compromised
   - Long enough to avoid frequent refreshes during active use

2. **Refresh Token Expiry**: ✅ 7 days
   - Balances security with user convenience
   - Users re-authenticate weekly

3. **On-Demand Refresh Only**: ✅ No proactive timers
   - Sessions expire naturally when user is inactive
   - Tokens only refresh when user actively uses the app
   - More secure than periodic background refresh

4. **HTTPS in Production**: ✅ Already configured
   ```javascript
   secure: process.env.NODE_ENV === "production"
   ```

5. **Monitor Error Rates**: Set up logging for failed refreshes
