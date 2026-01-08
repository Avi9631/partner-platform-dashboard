# Leads Management Page

## Overview
The Leads Management page provides a comprehensive interface for tracking and managing leads from various listing types (Property, PG/Co-living, Project) with different interaction reasons.

## Features

### 1. Lead Types
- **Property**: Regular property listings
- **PG/Co-living**: PG and hostel listings
- **Project**: Development projects

### 2. Lead Reasons (Distinguished by Color-coded Badges)
- **Connect with Agent** (Blue)
  - Icon: Phone
  - Purpose: Customer wants to connect with an agent
  
- **Callback Request** (Green)
  - Icon: Phone
  - Purpose: Customer requesting a callback
  
- **Virtual Tour** (Purple)
  - Icon: Video
  - Purpose: Customer wants to book a virtual tour

### 3. Lead Status Management
- **New**: Freshly received leads
- **Contacted**: Agent has reached out to customer
- **In Progress**: Active conversation/negotiation
- **Completed**: Successfully converted/closed
- **Closed**: Lead no longer active

### 4. Dashboard Statistics
- Total Leads count
- New Leads count
- In Progress count
- Completed count

### 5. Filtering System
Filter leads by:
- Listing Type (Property, PG/Co-living, Project)
- Reason (Connect Agent, Callback, Virtual Tour)
- Status (New, Contacted, In Progress, Completed, Closed)

### 6. Lead Card Information
Each lead displays:
- Listing title and ID
- Lead type with icon
- Reason badge (color-coded)
- Current status with quick update dropdown
- Customer information (name, email, phone)
- Customer message (if provided)
- Location and creation date
- Action buttons (Contact, View Details)

## API Integration

### Service: `leadsService.js`
Located at: `src/services/leadsService.js`

#### Functions:
1. **fetchLeads(filters)**: Fetch leads with optional filters
2. **fetchLeadsStats()**: Get statistics overview
3. **updateLeadStatus(leadId, status)**: Update a lead's status
4. **fetchLeadDetails(leadId)**: Get detailed information about a lead

## Navigation

### Access Points:
1. **Dashboard**: Card tile on the main dashboard
2. **Header Menu**: Available in both desktop and mobile user menus
3. **Direct URL**: `/leads-management`

## Component Structure

```
LeadsManagement (Main Component)
├── Stats Overview Cards
├── Filters Section
│   ├── Type Filter
│   ├── Reason Filter
│   └── Status Filter
└── Leads Grid
    └── LeadCard (for each lead)
        ├── Lead Header (Type, Title, Reason Badge)
        ├── Status Section (with quick update)
        ├── Customer Information
        ├── Message Display
        ├── Location & Date
        └── Action Buttons
```

## UI/UX Features

### Visual Distinction
- **Color-coded reason badges** make it easy to identify lead intent at a glance
- **Icon-based type indicators** for quick listing type recognition
- **Status badges** with distinct colors for each status
- **Hover effects** on lead cards for better interactivity

### Responsive Design
- Grid layout adapts from 1 column (mobile) to 2 columns (desktop)
- Filters stack on mobile, row on desktop
- Stats cards adapt to screen size (1-4 columns)

### Real-time Updates
- Status can be updated directly from lead cards
- Toast notifications for successful/failed operations
- Automatic data refresh after updates

## Future Enhancements
- Export leads to CSV/Excel
- Bulk status updates
- Lead assignment to team members
- Communication history tracking
- Automated follow-up reminders
- Lead scoring system
- Advanced analytics and reports

## Backend Requirements

The page expects the following API endpoints:

### GET `/api/leads`
Query parameters:
- `type`: PROPERTY | PG_COLIVING | PROJECT
- `reason`: CONNECT_AGENT | CALLBACK_REQUEST | VIRTUAL_TOUR
- `status`: NEW | CONTACTED | IN_PROGRESS | COMPLETED | CLOSED
- `dateFrom`: ISO date string
- `dateTo`: ISO date string

Response:
```json
{
  "leads": [
    {
      "id": "lead_id",
      "type": "PROPERTY",
      "reason": "VIRTUAL_TOUR",
      "status": "NEW",
      "listingId": "123",
      "listingTitle": "Beautiful Villa",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "customerPhone": "+1234567890",
      "customerAvatar": "url",
      "message": "Interested in viewing",
      "location": "Mumbai, Maharashtra",
      "createdAt": "2026-01-08T10:00:00Z"
    }
  ]
}
```

### GET `/api/leads/stats`
Response:
```json
{
  "total": 150,
  "new": 25,
  "inProgress": 40,
  "completed": 70
}
```

### PATCH `/api/leads/:leadId/status`
Body:
```json
{
  "status": "CONTACTED"
}
```

### GET `/api/leads/:leadId`
Response: Single lead object (same structure as above)

## Files Created/Modified

### New Files:
1. `src/pages/LeadsManagement.jsx` - Main page component
2. `src/services/leadsService.js` - API service layer
3. `src/pages/LEADS_MANAGEMENT_README.md` - This documentation

### Modified Files:
1. `src/main.jsx` - Added routing
2. `src/modules/header/Header.jsx` - Added navigation link
3. `src/Dashboard.jsx` - Added dashboard card

## Testing Checklist

- [ ] Page loads without errors
- [ ] Filters work correctly (type, reason, status)
- [ ] Status updates work and reflect in UI
- [ ] Statistics display correctly
- [ ] Lead cards show all information
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Toast notifications appear for success/error
- [ ] Navigation from dashboard and header works
- [ ] Empty state displays when no leads found
- [ ] Loading states display appropriately
