# Backend Integration Guide: Unified Draft API for Developer Profiles

## Overview
The **listDeveloper** module now uses the same unified draft API endpoints as **listPg** and **listProperty**. This document outlines the backend changes needed to support developer profiles through the existing draft endpoints.

---

## API Endpoints (Already Exist)

All endpoints are in [draft.route.js](d:\my codes\partner-platform-backend\src\routes\draft.route.js):

```javascript
POST   /createListingDraft
PATCH  /updateListingDraft
DELETE /deleteListingDraft
POST   /submitListingDraft
GET    /listingDraft
GET    /listingDraft/:id
```

---

## Required Backend Changes

### 1. Update ListingDraftController to Handle `draftType: 'DEVELOPER'`

#### createListingDraft
```javascript
// Current (handles PROPERTY, PG, etc.)
const { draftType = 'PROPERTY' } = req.body;

// Support DEVELOPER type
const validTypes = ['PROPERTY', 'PG', 'HOSTEL', 'PROJECT', 'DEVELOPER'];
if (!validTypes.includes(draftType)) {
  return res.status(400).json({ message: 'Invalid draftType' });
}
```

#### updateListingDraft
```javascript
// Check draftType in request body
const { draftId, draftType, draftData, ...otherFields } = req.body;

// Allow DEVELOPER type updates
if (draftType === 'DEVELOPER') {
  // Handle developer-specific validation
  // Developer drafts don't have media uploads typically
}
```

#### getUserListingDrafts
```javascript
// Support filtering by draftType query param
const { draftType } = req.query;

// Build query
const query = { userId };
if (draftType) {
  query.draftType = draftType;
}

// Frontend will call: GET /listingDraft?draftType=DEVELOPER
```

---

## Frontend API Calls

### Create Developer Draft
```javascript
// POST /createListingDraft
{
  "draftType": "DEVELOPER",
  "status": "draft",
  "draftData": {
    "developerName": "Prestige Group",
    "developerType": "National Developer",
    // ... other developer fields
  }
}
```

### Update Developer Draft
```javascript
// PATCH /updateListingDraft
{
  "draftId": "draft_123",
  "draftType": "DEVELOPER",
  "draftData": {
    "developerName": "Updated Name",
    "description": "...",
    // ... updated fields
  },
  "status": "draft"
}
```

### Get Developer Drafts
```javascript
// GET /listingDraft?draftType=DEVELOPER
// Returns only developer drafts for the authenticated user
```

### Get Developer Draft by ID
```javascript
// GET /listingDraft/:id
// Returns draft regardless of type (if user owns it)
```

### Delete Developer Draft
```javascript
// DELETE /deleteListingDraft
{
  "id": "draft_123",
  "draftType": "DEVELOPER"
}
```

### Submit Developer Draft
```javascript
// POST /submitListingDraft
{
  "id": "draft_123",
  "draftType": "DEVELOPER"
}
```

---

## Database Schema Considerations

### ListingDraft Table
Ensure these fields exist:

```sql
CREATE TABLE listing_drafts (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  draft_type ENUM('PROPERTY', 'PG', 'HOSTEL', 'PROJECT', 'DEVELOPER') NOT NULL,
  draft_data JSON,  -- Stores developer profile data
  status ENUM('draft', 'submitted', 'published', 'rejected') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP NULL,
  
  INDEX idx_user_type (user_id, draft_type),
  INDEX idx_status (status)
);
```

### Developer Draft Data Structure
The `draftData` JSON field will contain:

```json
{
  "developerName": "Prestige Group",
  "developerType": "National Developer",
  "description": "Leading developer...",
  "establishedYear": 1986,
  "registrationNumber": "CIN...",
  "reraRegistrationNumber": "RERA...",
  
  "primaryContactName": "John Doe",
  "primaryContactEmail": "john@prestige.com",
  "primaryContactPhone": "+91-1234567890",
  
  "officeAddress": "...",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  
  "totalProjectsCompleted": 150,
  "totalProjectsOngoing": 25,
  "totalUnitsDelivered": 50000,
  
  "website": "https://...",
  "linkedIn": "https://..."
}
```

---

## Controller Implementation Example

### createListingDraft
```javascript
async createListingDraft(req, res) {
  try {
    const { draftType = 'PROPERTY', draftData, status = 'draft' } = req.body;
    const userId = req.user.id;

    // Validate draftType
    const validTypes = ['PROPERTY', 'PG', 'HOSTEL', 'PROJECT', 'DEVELOPER'];
    if (!validTypes.includes(draftType)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid draftType. Must be one of: ' + validTypes.join(', ') 
      });
    }

    // Generate unique draft ID
    const draftId = `${draftType.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create draft record
    const draft = await ListingDraft.create({
      id: draftId,
      userId,
      draftType,
      draftData: draftData || {},
      status,
    });

    return res.status(201).json({
      success: true,
      message: `${draftType} draft created successfully`,
      data: {
        draftId: draft.id,
        draftType: draft.draftType,
        status: draft.status,
        createdAt: draft.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating draft:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to create draft' 
    });
  }
}
```

### getUserListingDrafts
```javascript
async getUserListingDrafts(req, res) {
  try {
    const userId = req.user.id;
    const { draftType, status } = req.query;

    // Build filter query
    const filter = { userId };
    if (draftType) filter.draftType = draftType;
    if (status) filter.status = status;

    const drafts = await ListingDraft.find(filter)
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: drafts,
      count: drafts.length,
    });
  } catch (error) {
    console.error('Error fetching drafts:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch drafts' 
    });
  }
}
```

---

## Validation Considerations

### Developer Draft Validation
Since developers don't have media uploads initially, skip file validation:

```javascript
if (draftType === 'DEVELOPER') {
  // Skip media-related validations
  // Focus on text field validations
  if (!draftData.developerName) {
    return res.status(400).json({ message: 'Developer name is required' });
  }
}
```

### Property/PG Draft Validation
```javascript
if (['PROPERTY', 'PG', 'HOSTEL'].includes(draftType)) {
  // Handle media uploads
  // Handle location data
  // Handle property-specific fields
}
```

---

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "DEVELOPER draft created successfully",
  "data": {
    "draftId": "developer_1734355200_abc123xyz",
    "draftType": "DEVELOPER",
    "status": "draft",
    "createdAt": "2025-12-16T10:00:00Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid draftType. Must be one of: PROPERTY, PG, HOSTEL, PROJECT, DEVELOPER"
}
```

---

## Testing Checklist

- [ ] Create developer draft with valid data
- [ ] Update developer draft multiple times
- [ ] Get all developer drafts (filtered by type)
- [ ] Get specific developer draft by ID
- [ ] Delete developer draft
- [ ] Submit developer draft
- [ ] Verify query filtering: `?draftType=DEVELOPER`
- [ ] Verify user cannot access other users' drafts
- [ ] Test with missing `draftType` (should default to PROPERTY)
- [ ] Test with invalid `draftType` (should return 400 error)

---

## Migration Notes

### If Existing Developer Endpoints Need Migration
If there were separate `/createDeveloperDraft` endpoints:

1. **Data Migration**: Copy existing developer drafts to unified table
   ```sql
   INSERT INTO listing_drafts (id, user_id, draft_type, draft_data, status, created_at)
   SELECT id, user_id, 'DEVELOPER', data, status, created_at
   FROM developer_drafts;
   ```

2. **Deprecation Timeline**:
   - Week 1: Deploy unified endpoints
   - Week 2-3: Both endpoints active (dual support)
   - Week 4: Deprecate old endpoints
   - Week 5: Remove old code

---

## Frontend Changes Summary

File: `src/services/developerDraftService.js`

**Before:**
```javascript
createDeveloperDraft: async (draftData) => {
  return apiCall(`${backendUrl}/createDeveloperDraft`, { ... });
}
```

**After:**
```javascript
createDeveloperDraft: async (draftData = {}) => {
  return apiCall(`${backendUrl}/createListingDraft`, {
    body: JSON.stringify({ 
      draftType: 'DEVELOPER',
      ...draftData 
    }),
  });
}
```

All 6 methods updated to use unified endpoints with `draftType: 'DEVELOPER'`.

---

## Benefits of Unified API

✅ **Single codebase** for all draft types  
✅ **Consistent behavior** across modules  
✅ **Easier maintenance** - one controller to update  
✅ **Shared middleware** (auth, validation, upload)  
✅ **Better analytics** - all drafts in one table  
✅ **Simplified testing** - one set of tests

---

## Support & Questions

If backend implementation needs clarification:
- Review [draft.route.js](d:\my codes\partner-platform-backend\src\routes\draft.route.js)
- Check ListingDraftController for existing patterns
- Test with Postman/Insomnia using examples above

---

**Status:** ✅ Frontend Updated  
**Next:** Backend controller needs to handle `draftType: 'DEVELOPER'`  
**Date:** December 16, 2025
