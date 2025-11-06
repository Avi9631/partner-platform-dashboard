# Invited Member Details Sheet Implementation

## Overview
Created a separate detail sheet component specifically for invited (pending) members since they don't have user profile information like active members do.

## Changes Made

### 1. New Component: `InvitedMemberDetailsSheet.jsx`
- **Location**: `src/components-xm/Course/components/InvitedMemberDetailsSheet.jsx`
- **Purpose**: Display detailed information about pending invitations

#### Features:
- Shows invited user's email address
- Displays invitation status with color-coded badges (Pending, Accepted, Declined, Expired)
- Shows invitation dates (created date, expiry date and time)
- Displays access level information
- Shows who sent the invitation (if available)
- Contextual status messages based on invitation state:
  - **Pending**: Blue alert with expiry information
  - **Declined**: Red alert indicating invitation was declined
  - **Expired**: Gray alert indicating invitation has expired

#### Data Structure:
The component expects an invited member object with the following properties:
```javascript
{
  inviteeEmail: string,      // Email of invited user
  inviteStatus: string,      // PENDING, ACCEPTED, DECLINED, EXPIRED
  accessLevel: string,       // Access level to be granted
  v_created_date: string,    // Date invitation was created
  v_expires_date: string,    // Date invitation expires
  v_expires_time: string,    // Time invitation expires
  invitedBy: string          // Who sent the invitation (optional)
}
```

### 2. Updated Component: `CourseRoomMembers.jsx`
- **Location**: `src/components-xm/Course/CourseRoom/CourseRoomMembers.jsx`

#### Changes:
1. **Import**: Added `InvitedMemberDetailsSheet` component
2. **State**: Added `invitedMemberDetailsSheetOpen` state
3. **Handler**: Added `handleViewInvitedMemberDetails` handler
4. **Usage**: Updated `InvitedMembersTable` to use the new handler
5. **Render**: Added the new `InvitedMemberDetailsSheet` component to the JSX

## Key Differences: MemberDetailsSheet vs InvitedMemberDetailsSheet

### MemberDetailsSheet (Active Members)
- Shows user avatar and profile picture
- Displays full name and initials
- Shows user contact information (phone, location, organization)
- Displays join date and last active time
- Shows member role and access level

### InvitedMemberDetailsSheet (Pending Invitations)
- Shows email icon instead of avatar
- Displays only email address (no user profile yet)
- Shows invitation-specific information
- Displays expiry date and time
- Shows invitation status with contextual alerts
- No role badges (user hasn't joined yet)

## Status Badge Colors
- **PENDING**: Yellow/Orange (`bg-yellow-100 text-yellow-800`)
- **ACCEPTED**: Green (`bg-green-100 text-green-800`)
- **DECLINED**: Red (`bg-red-100 text-red-800`)
- **EXPIRED**: Gray (`bg-gray-100 text-gray-800`)

## Benefits
1. **Better UX**: Appropriate information display based on member type
2. **Clear Distinction**: Separate UI for active vs invited members
3. **Contextual Information**: Status-specific alerts and messages
4. **Type Safety**: PropTypes validation for component props
5. **Maintainability**: Separate concerns for different member types
