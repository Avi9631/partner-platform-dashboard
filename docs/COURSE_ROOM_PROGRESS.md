# CourseRoomProgress Component Documentation

## Overview
The **CourseRoomProgress** component is a comprehensive progress tracking and analytics dashboard for course rooms. It displays user enrollment information, activity logs, completion statistics, and performance insights.

## Features

### 1. **Overall Statistics Dashboard**
Displays key metrics at a glance:
- **Total Members**: Number of course room members
- **Completed Members**: Count of users who completed the course
- **Average Progress**: Mean completion percentage across all users
- **Total Activities**: Sum of all learning activities

### 2. **Top Performers Leaderboard**
- Ranks users based on course completion percentage
- Shows top 5 performers with visual badges (🥇 🥈 🥉)
- Displays progress bars and completion counts
- Includes user avatars and names

### 3. **Individual Member Progress Tracking**
For each member, displays:
- **Enrollment Status**: ENROLLED, IN_PROGRESS, COMPLETED, CERTIFIED
- **Timeline Information**:
  - Enrollment date
  - Last activity date
  - Days since enrollment
  - Completion date (if applicable)
- **Progress Metrics**:
  - Visual progress bar
  - Completed activities count
  - Overall percentage
- **Activity Timeline**: Expandable detailed view of all content activities

### 4. **Course Insights Panel**
Provides analytics:
- Completion rate percentage
- Average completion time (in days)
- Engagement score (High 🔥 / Good 👍 / Growing 📈)

## API Response Structure

The component expects data in the following format:

```javascript
{
  "enrollments": {
    "v_created_date": "13-Oct-2025",
    "v_created_time": "23:20:51",
    "v_updated_date": "15-Oct-2025",
    "v_updated_time": "23:16:06",
    "enrollmentId": 3,
    "userId": 1,
    "courseId": 1,
    "enrollmentStatus": "IN_PROGRESS",
    "enrollmentDate": "2025-10-13T17:50:51.683Z",
    "completionDate": null,
    "certificateUrl": null,
    "metadata": {},
    "enrollment_created_at": "2025-10-13T17:50:51.683Z",
    "enrollment_updated_at": "2025-10-15T17:46:06.101Z"
  },
  "activityLogs": [
    {
      "v_created_date": "15-Oct-2025",
      "v_created_time": "23:16:05",
      "v_updated_date": "15-Oct-2025",
      "v_updated_time": "23:16:05",
      "progressId": 2,
      "userId": 1,
      "courseId": 1,
      "courseContentId": 1,
      "progressStatus": "COMPLETED",
      "activityDuration": 0,
      "progressPercent": "0.00",
      "metadata": {},
      "user_course_content_progress_created_at": "2025-10-15T17:46:05.730Z",
      "user_course_content_progress_updated_at": "2025-10-15T17:46:05.730Z"
    }
  ]
}
```

## Component Props

The component uses React Router's `useOutletContext()` to access:

| Prop | Type | Description |
|------|------|-------------|
| `courseList` | Object | Current course information |
| `members` | Array | List of course room members |
| `isLoading` | Boolean | Loading state from parent context |

## State Management

### Local State Variables
- `isLoading`: Loading state for progress data
- `progressData`: Array of enriched member data with progress
- `selectedMember`: Currently selected member for detailed view
- `viewMode`: Display mode ("overview" or "detailed")

## Data Flow

1. **Mount**: Component fetches progress for all members on mount
2. **API Calls**: Makes parallel requests to `/user-progress/{courseId}/{userId}` for each member
3. **Data Enrichment**: Combines member data with progress/enrollment data
4. **Statistics Calculation**: Computes overall stats, leaderboard, and insights
5. **Render**: Displays all information with responsive UI

## Usage Example

```jsx
import CourseRoomProgress from '@/components-xm/Course/CourseRoom/CourseRoomProgress';

// In your router configuration
<Route path="progress" element={<CourseRoomProgress />} />
```

## UI Components Used

- **Card**: Container for sections
- **Badge**: Status indicators
- **Avatar**: User profile pictures
- **Progress**: Visual progress bars
- **Button**: Interactive elements
- **Skeleton**: Loading states
- **Alert**: Warning/info messages

## Enrollment Status Types

| Status | Icon | Color | Description |
|--------|------|-------|-------------|
| `ENROLLED` | 📖 BookOpen | Blue | User enrolled but not started |
| `IN_PROGRESS` | ▶️ PlayCircle | Yellow | User actively learning |
| `COMPLETED` | ✅ CheckCircle | Green | User finished all content |
| `CERTIFIED` | 🏆 Award | Purple | User received certificate |

## Progress Status Types

| Status | Icon | Color | Description |
|--------|------|-------|-------------|
| `NOT_STARTED` | - | Gray | Content not accessed |
| `IN_PROGRESS` | ▶️ | Yellow | Content partially completed |
| `COMPLETED` | ✅ | Green | Content fully completed |
| `LOCKED` | 🔒 | Red | Content not accessible |

## Styling

- Uses **Tailwind CSS** for styling
- Follows **Shadcn/ui** component library conventions
- Responsive design with mobile-first approach
- Gradient backgrounds for visual hierarchy
- Smooth transitions and hover effects

## Performance Optimizations

1. **useMemo**: Memoizes calculated statistics and leaderboard
2. **Parallel API Calls**: Fetches all user progress simultaneously
3. **Conditional Rendering**: Only shows detailed view when expanded
4. **Lazy Loading**: Scrollable activity logs with max height

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

## Error Handling

- Try-catch blocks for all API calls
- Toast notifications for errors
- Fallback UI for empty states
- Loading skeletons during data fetch

## Future Enhancements

Potential improvements:
- [ ] Export progress data to CSV/PDF
- [ ] Filter by enrollment status
- [ ] Date range filtering for activities
- [ ] Real-time progress updates via WebSocket
- [ ] Comparison view between members
- [ ] Email reports to instructors
- [ ] Custom progress milestones
- [ ] Integration with analytics platforms

## Related Components

- `CourseRoom.jsx` - Parent container component
- `CourseRoomMembers.jsx` - Member management
- `CourseRoomActivities.jsx` - Activity feed
- `CourseRoomSettings.jsx` - Room configuration

## API Endpoints

```
GET  /user-progress/{courseId}/{userId}        - Get user progress
GET  /user-progress/course/{courseId}/all      - Get all users progress
POST /user-progress/update                     - Update progress
GET  /user-progress/{courseId}/{userId}/activities - Get activity logs
GET  /user-progress/{courseId}/{userId}/certificate - Get certificate
GET  /user-progress/course/{courseId}/analytics - Get analytics
```

## Dependencies

```json
{
  "@/components/ui/card": "Card components",
  "@/components/ui/badge": "Status badges",
  "@/components/ui/avatar": "User avatars",
  "@/components/ui/progress": "Progress bars",
  "@/components/ui/button": "Interactive buttons",
  "@/components/ui/skeleton": "Loading states",
  "@/components/ui/alert": "Alert messages",
  "lucide-react": "Icon library",
  "react-router-dom": "Routing",
  "axios": "HTTP client"
}
```

## Testing

### Manual Testing Checklist
- [ ] Load component with enrolled members
- [ ] Load component with empty member list
- [ ] Expand/collapse detailed view for each member
- [ ] Verify leaderboard ranking accuracy
- [ ] Check progress percentage calculations
- [ ] Test with different enrollment statuses
- [ ] Verify responsive behavior on mobile
- [ ] Test error handling with network issues

### Test Scenarios
1. **No Members**: Should display empty state message
2. **All Completed**: Should show 100% completion rate
3. **Mixed Progress**: Should accurately calculate averages
4. **No Enrollment**: Should show "not enrolled" alert
5. **Loading State**: Should display skeletons

## Troubleshooting

### Common Issues

**Issue**: Progress not loading
- **Solution**: Check API endpoint `/user-progress/{courseId}/{userId}` is accessible
- Verify user permissions to view progress data

**Issue**: Incorrect progress percentages
- **Solution**: Ensure activity logs have correct `progressStatus` values
- Check calculation logic in `overallStats` useMemo

**Issue**: Members not showing
- **Solution**: Verify `members` prop from parent context is populated
- Check course room membership API

## Support

For questions or issues:
- Check console for error messages
- Review network tab for failed API calls
- Consult backend API documentation
- Contact development team

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team
