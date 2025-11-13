# OAuth Implementation Testing Checklist

## Pre-Testing Setup

- [ ] Backend `.env` file configured with:
  - `ACCESS_TOKEN_SECRET`
  - `REFRESH_TOKEN_SECRET`
  - `FRONTEND_URL=http://localhost:5173`
  - Google OAuth credentials
  - Microsoft OAuth credentials
  
- [ ] Frontend `.env` file configured with:
  - `VITE_BACKEND_URL=http://localhost:3000`

- [ ] Backend server running: `npm start`
- [ ] Frontend dev server running: `npm run dev`

## Test Cases

### 1. Initial Authentication Flow

- [ ] Open browser to `http://localhost:5173/list-property`
- [ ] Should redirect to `/signin?redirectUri=/list-property`
- [ ] SignIn page displays with Google and Microsoft buttons
- [ ] Click "Continue with Google"
- [ ] Redirects to Google OAuth login
- [ ] After Google authentication, returns to `/list-property`
- [ ] Page loads successfully with content
- [ ] Check DevTools → Application → Cookies:
  - [ ] `accessToken` present (httpOnly)
  - [ ] `refreshToken` present (httpOnly)
  - [ ] `userId` present

### 2. Microsoft OAuth Flow

- [ ] Logout first (click avatar → Logout)
- [ ] Navigate to `/list-project`
- [ ] Should redirect to `/signin?redirectUri=/list-project`
- [ ] Click "Continue with Microsoft"
- [ ] Redirects to Microsoft OAuth login
- [ ] After Microsoft authentication, returns to `/list-project`
- [ ] Page loads successfully

### 3. Authentication Persistence

- [ ] Login via Google or Microsoft
- [ ] Navigate to different routes:
  - [ ] `/list-developer`
  - [ ] `/list-project`
  - [ ] `/list-property`
- [ ] All routes should load without redirect to signin
- [ ] Refresh the page (`Ctrl+R` or `Cmd+R`)
- [ ] Should remain authenticated (no redirect to signin)
- [ ] User avatar should display in header

### 4. Header and User Info

- [ ] After login, check header displays:
  - [ ] User avatar with email initials (e.g., "JD" for john.doe@gmail.com)
- [ ] Click on avatar
- [ ] Dropdown menu appears with:
  - [ ] User email displayed
  - [ ] "Logout" option
- [ ] On mobile view (resize browser to <768px):
  - [ ] Hamburger menu appears
  - [ ] Click hamburger
  - [ ] Side sheet opens with navigation and user info
  - [ ] Logout button visible in side sheet

### 5. Protected Route Access

- [ ] Clear all cookies (DevTools → Application → Clear site data)
- [ ] Navigate to `http://localhost:5173/list-developer`
- [ ] Should immediately redirect to `/signin?redirectUri=/list-developer`
- [ ] After login, should return to `/list-developer`

### 6. Auth Status Check

- [ ] Login successfully
- [ ] Open DevTools → Network tab
- [ ] Filter by "status"
- [ ] Page should call `/auth/status` on initial load
- [ ] Response should be 200 with JSON:
  ```json
  {
    "authenticated": true,
    "user": {
      "userId": "...",
      "userEmail": "..."
    }
  }
  ```

### 7. Token Refresh

**Option A: Wait 25 minutes** (real-time test)
- [ ] Login successfully
- [ ] Leave browser open
- [ ] After 25 minutes, check Network tab
- [ ] Should see POST request to `/auth/refresh-token`
- [ ] Response should be 200
- [ ] New `accessToken` cookie should be set
- [ ] User remains authenticated

**Option B: Manual test** (faster)
- [ ] Login successfully
- [ ] In browser DevTools → Application → Cookies
- [ ] Delete `accessToken` cookie only (keep `refreshToken`)
- [ ] Navigate to any protected route
- [ ] Should either:
  - Auto-refresh token and load page, OR
  - Redirect to signin (depending on timing)

### 8. Logout Flow

- [ ] Login successfully
- [ ] Click user avatar in header
- [ ] Click "Logout"
- [ ] Should redirect to `/signin`
- [ ] Check cookies - should be cleared:
  - [ ] `accessToken` removed
  - [ ] `refreshToken` removed
  - [ ] `userId` removed
- [ ] Try navigating to `/list-property`
- [ ] Should redirect to `/signin?redirectUri=/list-property`

### 9. Token Expiration Handling

- [ ] Login successfully
- [ ] In DevTools, delete both `accessToken` AND `refreshToken` cookies
- [ ] Try to navigate to a protected route
- [ ] Should redirect to `/signin` with appropriate redirectUri
- [ ] Login again
- [ ] Should return to the intended page

### 10. Redirect URI Preservation

Test multiple scenarios:

**Scenario A: Direct link**
- [ ] Logout completely
- [ ] Navigate to `http://localhost:5173/list-property?someParam=value`
- [ ] Should redirect to `/signin?redirectUri=/list-property?someParam=value`
- [ ] Login with Google/Microsoft
- [ ] Should return to `/list-property?someParam=value` (preserving query params)

**Scenario B: Deep link**
- [ ] Logout
- [ ] Navigate to `http://localhost:5173/list-developer`
- [ ] Login
- [ ] Should return exactly to `/list-developer`

### 11. Error Handling

- [ ] Login successfully
- [ ] Open DevTools → Console
- [ ] Check for any errors (should be none)
- [ ] Check Network tab for failed requests (should be none)
- [ ] Try accessing `/signin` while already logged in
- [ ] Should redirect to home page `/`

### 12. Backend Endpoint Protection

**Using curl or Postman:**

- [ ] Test protected endpoint WITHOUT cookies:
  ```bash
  curl http://localhost:3000/getUser -X POST
  ```
  Should return 401 "Authorization token missing"

- [ ] Test protected endpoint WITH valid token:
  - Login via browser
  - Copy `accessToken` cookie value
  - Use in request:
  ```bash
  curl http://localhost:3000/getUser -X POST -H "Cookie: accessToken=YOUR_TOKEN"
  ```
  Should return user data (if endpoint is implemented)

### 13. CORS and Credentials

- [ ] Open DevTools → Network tab
- [ ] Login and navigate around
- [ ] Check request headers for API calls
- [ ] Should include:
  - [ ] `Cookie` header with tokens
  - [ ] `Origin: http://localhost:5173`
- [ ] Response headers should include:
  - [ ] `Access-Control-Allow-Credentials: true`
  - [ ] `Access-Control-Allow-Origin: http://localhost:5173`

### 14. Multiple Tabs/Windows

- [ ] Login in one tab
- [ ] Open new tab with same site
- [ ] Should be automatically authenticated (shares cookies)
- [ ] Logout in one tab
- [ ] Refresh other tab
- [ ] Should redirect to signin

### 15. Session Timeout

- [ ] Login successfully
- [ ] Note the time
- [ ] Wait 60+ minutes (or adjust token expiry for faster testing)
- [ ] Try to navigate or perform action
- [ ] Should be logged out and redirected to signin

## Production Readiness Checklist

- [ ] Update token expiry times in `auth.route.js`:
  - Google: `accessToken: "30m"`, `refreshToken: "60m"` ✓
  - Microsoft: Change from `"1m"` to `"30m"` for accessToken
  - Microsoft: Change from `"15m"` to `"60m"` for refreshToken

- [ ] Set environment variables in production:
  - [ ] `NODE_ENV=production`
  - [ ] `FRONTEND_URL` set to production domain
  - [ ] `ACCESS_CONTROL_ALLOW_ORIGIN` set to production domain

- [ ] Verify OAuth redirect URIs in provider consoles:
  - [ ] Google Console: Add production callback URL
  - [ ] Microsoft Azure: Add production callback URL

- [ ] Test with HTTPS (required for production):
  - [ ] Cookies set with `secure: true`
  - [ ] OAuth redirects work over HTTPS

- [ ] Performance testing:
  - [ ] Token refresh doesn't cause UI lag
  - [ ] Auth check is fast (<100ms)
  - [ ] No excessive API calls

## Known Issues / Edge Cases

Document any issues found during testing:

| Issue | Expected | Actual | Status | Fix |
|-------|----------|--------|--------|-----|
|       |          |        |        |     |

## Sign-off

- [ ] All test cases passed
- [ ] No console errors
- [ ] No network errors
- [ ] User experience is smooth
- [ ] Production checklist reviewed

**Tested by:** _________________  
**Date:** _________________  
**Environment:** Development / Staging / Production  
**Browser(s):** _________________
