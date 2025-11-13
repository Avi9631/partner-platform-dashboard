# OAuth Authentication Implementation

This document describes the OAuth authentication system implemented across the Partner Platform.

## Overview

The application now uses **OAuth 2.0** authentication with Google and Microsoft as identity providers. All routes except the `/signin` page require authentication.

## Architecture

### Frontend Components

#### 1. **AuthContext** (`src/context/AuthContext.jsx`)
- Manages global authentication state
- Provides user information and authentication status
- Handles automatic token refresh every 25 minutes
- Checks authentication status periodically (every 5 minutes)

#### 2. **ProtectedRoute** (`src/components/ProtectedRoute.jsx`)
- Wraps protected routes to enforce authentication
- Redirects unauthenticated users to `/signin` with `redirectUri` parameter
- Shows loading spinner while checking auth status

#### 3. **SignIn Page** (`src/pages/SignIn.jsx`)
- Login page with Google and Microsoft OAuth buttons
- Automatically redirects authenticated users
- Preserves `redirectUri` for post-login navigation

#### 4. **Header Component** (`src/modules/header/Header.jsx`)
- Displays user avatar with email initials
- Dropdown menu with user info and logout button
- Mobile-responsive design

### Backend Endpoints

#### Authentication Routes (`src/routes/auth.route.js`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/status` | GET | Check if user is authenticated |
| `/auth/google` | GET | Initiate Google OAuth flow |
| `/auth/google/redirect` | GET | Google OAuth callback |
| `/auth/microsoft` | GET | Initiate Microsoft OAuth flow |
| `/auth/microsoft/redirect` | GET | Microsoft OAuth callback |
| `/auth/refresh-token` | POST | Refresh access token |
| `/auth/logout` | GET | Clear cookies and logout |

#### Protected Routes
All routes in these files require authentication via `authMiddleware`:
- `src/routes/common.route.js` - Common endpoints (e.g., `/getUser`)
- `src/routes/draft.route.js` - Listing draft operations
- `src/routes/user.route.js` - User management
- `src/routes/temporal.route.js` - Temporal workflow operations

## Authentication Flow

### 1. Initial Login

```
User visits protected route (e.g., /list-property)
    ↓
Not authenticated → Redirect to /signin?redirectUri=/list-property
    ↓
User clicks "Continue with Google/Microsoft"
    ↓
Redirect to backend: /auth/google?redirectUri=http://localhost:5173/list-property
    ↓
OAuth provider authenticates user
    ↓
Backend callback: /auth/google/redirect
    ↓
Set cookies: accessToken, refreshToken, userId
    ↓
Redirect to: http://localhost:5173/list-property
    ↓
User is authenticated and can access the page
```

### 2. Token Refresh

- **Access Token**: Expires in 30 minutes (Google) or 1 minute (Microsoft - adjust in production)
- **Refresh Token**: Expires in 60 minutes (Google) or 15 minutes (Microsoft)
- Frontend automatically refreshes access token every 25 minutes
- If refresh fails, user is logged out and redirected to `/signin`

### 3. Logout

```
User clicks Logout button
    ↓
Frontend calls logout() from useAuth hook
    ↓
Backend: /auth/logout clears all cookies
    ↓
Frontend clears state and redirects to /signin
```

## Security Features

### Cookies
- **httpOnly**: Prevents JavaScript access (XSS protection)
- **secure**: HTTPS only in production
- **sameSite**: "None" for cross-origin requests
- **maxAge**: 7 days for refresh token

### Tokens
- **Access Token**: Short-lived (30 min), used for API requests
- **Refresh Token**: Longer-lived (60 min), used to get new access tokens
- **JWT Claims**: Contains `userId` and `userEmail`

### Middleware
- `authMiddleware` validates access token on every protected request
- Returns 401 if token is missing
- Returns 403 if token is invalid/expired

## Environment Variables

### Backend (`.env`)
```env
ACCESS_TOKEN_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`.env`)
```env
VITE_BACKEND_URL=http://localhost:3000
```

## Usage

### Protecting a New Route

1. Add route to `main.jsx` as a child of the protected parent:
```jsx
{
  path: "/new-feature",
  element: <NewFeature />,
}
```

2. The route is automatically protected by `ProtectedRoute` wrapper.

### Using Auth in Components

```jsx
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user?.userEmail}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls

```javascript
const response = await fetch(`${backendUrl}/api/endpoint`, {
  method: 'POST',
  credentials: 'include', // Important: sends cookies
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});
```

## Redirect URI Flow

When a user is logged out while on a specific page:

1. Current page URL is saved as `redirectUri` query parameter
2. User is redirected to `/signin?redirectUri=/list-property`
3. SignIn page extracts `redirectUri` from query params
4. After OAuth callback, backend redirects to the saved URL
5. User lands back on the page they were originally trying to access

## Testing

### Test Authentication Flow
1. Start backend: `cd partner-platform-backend && npm start`
2. Start frontend: `cd partner-platform-dashboard && npm run dev`
3. Navigate to `http://localhost:5173/list-property`
4. Should redirect to `/signin`
5. Click "Continue with Google" or "Continue with Microsoft"
6. After authentication, should return to `/list-property`

### Test Token Refresh
1. Login and wait 25 minutes
2. Check browser DevTools → Network tab
3. Should see automatic POST to `/auth/refresh-token`
4. Access token cookie should be updated

### Test Logout
1. Click user avatar in header
2. Click "Logout"
3. Should redirect to `/signin`
4. Cookies should be cleared

## Troubleshooting

### "Not authenticated" errors
- Check that cookies are being sent (`credentials: 'include'`)
- Verify `VITE_BACKEND_URL` matches your backend URL
- Check browser console for CORS errors

### Redirect loops
- Ensure `/signin` route is NOT wrapped in `ProtectedRoute`
- Check that `frontendUrl` in backend matches your frontend URL

### OAuth callback fails
- Verify OAuth credentials are configured in backend
- Check `redirectUri` matches OAuth provider settings
- Review backend logs for authentication errors

## Future Enhancements

- [ ] Add email/password authentication option
- [ ] Implement "Remember Me" functionality
- [ ] Add role-based access control (RBAC)
- [ ] Implement session management dashboard
- [ ] Add two-factor authentication (2FA)
- [ ] Store refresh tokens in database for better security
- [ ] Add token rotation on refresh
