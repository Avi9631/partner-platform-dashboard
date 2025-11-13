# OAuth Authentication Flow Diagram

## Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER AUTHENTICATION FLOW                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│    User      │
│  Browser     │
└──────┬───────┘
       │
       │ 1. Navigate to /list-property
       ↓
┌──────────────────────┐
│  ProtectedRoute      │
│  Component           │
│  ┌────────────────┐  │
│  │ isAuthenticated│  │
│  │ = false?       │  │
│  └────────┬───────┘  │
└───────────┼──────────┘
            │
            │ 2. Redirect to /signin?redirectUri=/list-property
            ↓
    ┌───────────────┐
    │  SignIn Page  │
    │               │
    │ [Google] btn  │
    │ [Microsoft] btn│
    └───────┬───────┘
            │
            │ 3. User clicks "Continue with Google"
            │
            │ 4. Redirect to backend
            ↓
    ┌─────────────────────────────────────────┐
    │  Backend: /auth/google                   │
    │  ?redirectUri=http://localhost:5173/... │
    │                                          │
    │  - Store redirectUri in cookie           │
    │  - Initiate OAuth with Google            │
    └─────────────┬───────────────────────────┘
                  │
                  │ 5. Redirect to Google OAuth
                  ↓
            ┌─────────────┐
            │   Google    │
            │   OAuth     │
            │   Server    │
            └──────┬──────┘
                   │
                   │ 6. User authenticates
                   │
                   │ 7. Redirect to callback
                   ↓
    ┌──────────────────────────────────────────┐
    │  Backend: /auth/google/redirect          │
    │                                          │
    │  - Verify OAuth response                 │
    │  - Create/Find user in DB                │
    │  - Generate JWT tokens                   │
    │  - Set cookies:                          │
    │    • accessToken (30min)                 │
    │    • refreshToken (60min)                │
    │    • userId                              │
    │  - Read postAuthRedirect cookie          │
    │  - Clear postAuthRedirect cookie         │
    │  - Redirect to saved URL                 │
    └──────────────┬───────────────────────────┘
                   │
                   │ 8. Redirect to /list-property
                   ↓
            ┌──────────────┐
            │    User      │
            │  Browser     │
            └──────┬───────┘
                   │
                   │ 9. Navigate to /list-property
                   ↓
    ┌──────────────────────────┐
    │  ProtectedRoute          │
    │  Component               │
    │  ┌────────────────────┐  │
    │  │ Check /auth/status │  │
    │  │ isAuthenticated    │  │
    │  │ = true ✓           │  │
    │  └────────┬───────────┘  │
    └───────────┼──────────────┘
                │
                │ 10. Render protected content
                ↓
    ┌────────────────────────┐
    │   List Property Page   │
    │   (Authenticated)      │
    └────────────────────────┘
```

## Token Refresh Flow

```
┌─────────────────────────────────────────────────────────────┐
│              AUTOMATIC TOKEN REFRESH (Every 25 min)          │
└─────────────────────────────────────────────────────────────┘

    ┌────────────────┐
    │  AuthContext   │
    │  (Frontend)    │
    └────────┬───────┘
             │
             │ Timer: Every 25 minutes
             │
             │ POST /auth/refresh-token
             │ (with refreshToken cookie)
             ↓
    ┌─────────────────────────┐
    │  Backend                │
    │  /auth/refresh-token    │
    │                         │
    │  - Verify refreshToken  │
    │  - Generate new access  │
    │  - Set new accessToken  │
    │    cookie               │
    └────────┬────────────────┘
             │
             │ Success: New accessToken
             ↓
    ┌────────────────┐
    │  User continues│
    │  using app     │
    └────────────────┘

    If refresh fails:
    ↓
    ┌────────────────┐
    │  Logout user   │
    │  → /signin     │
    └────────────────┘
```

## Logout Flow

```
┌──────────────────────────────────────────────┐
│              USER LOGOUT FLOW                 │
└──────────────────────────────────────────────┘

    ┌────────────┐
    │   User     │
    │   clicks   │
    │  "Logout"  │
    └─────┬──────┘
          │
          │ 1. Call logout() from useAuth
          ↓
    ┌────────────────┐
    │  AuthContext   │
    │  logout()      │
    └────────┬───────┘
             │
             │ 2. GET /auth/logout
             ↓
    ┌─────────────────────┐
    │  Backend            │
    │  /auth/logout       │
    │                     │
    │  - Clear cookies:   │
    │    • accessToken    │
    │    • refreshToken   │
    └──────────┬──────────┘
               │
               │ 3. Clear state & redirect
               ↓
    ┌────────────────────┐
    │   SignIn Page      │
    │   User logged out  │
    └────────────────────┘
```

## API Request with Authentication

```
┌────────────────────────────────────────────────┐
│         AUTHENTICATED API REQUEST              │
└────────────────────────────────────────────────┘

    ┌────────────────┐
    │  Frontend      │
    │  Component     │
    └────────┬───────┘
             │
             │ fetch('/api/endpoint', {
             │   credentials: 'include'  ← sends cookies
             │ })
             ↓
    ┌─────────────────────────┐
    │  Backend Middleware     │
    │  authMiddleware         │
    │                         │
    │  - Extract accessToken  │
    │    from cookies         │
    │  - Verify JWT           │
    │  - Attach user to req   │
    └────────┬────────────────┘
             │
             ├─→ Valid? → Continue to route handler
             │
             └─→ Invalid? → 401/403 Error
                            ↓
                    Frontend detects error
                    → Try refresh or logout
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      Browser App                          │  │
│  │                                                           │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │   SignIn     │  │ Protected    │  │   Header     │   │  │
│  │  │   Page       │  │ Routes       │  │  (w/Logout)  │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐     │  │
│  │  │          AuthContext (Global State)             │     │  │
│  │  │  - user, isAuthenticated, isLoading             │     │  │
│  │  │  - Auto token refresh (25 min)                  │     │  │
│  │  │  - Auth status check (5 min)                    │     │  │
│  │  └─────────────────────────────────────────────────┘     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              │ HTTP + Cookies                    │
│                              ↓                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     Express Server                        │  │
│  │                                                           │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │   Auth       │  │ Protected    │  │ Auth         │   │  │
│  │  │   Routes     │  │ Routes       │  │ Middleware   │   │  │
│  │  │              │  │ (Draft,User) │  │              │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐     │  │
│  │  │           Cookie Management                     │     │  │
│  │  │  - accessToken (httpOnly, 30min)                │     │  │
│  │  │  - refreshToken (httpOnly, 60min)               │     │  │
│  │  │  - userId                                        │     │  │
│  │  └─────────────────────────────────────────────────┘     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              │ OAuth 2.0                         │
│                              ↓                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   OAUTH PROVIDERS                                │
│  ┌─────────────────┐              ┌─────────────────┐           │
│  │     Google      │              │   Microsoft     │           │
│  │  OAuth Server   │              │  OAuth Server   │           │
│  └─────────────────┘              └─────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```
