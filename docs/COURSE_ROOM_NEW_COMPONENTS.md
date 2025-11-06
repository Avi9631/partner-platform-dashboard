# Course Room New Components

## Overview
This document describes two new components created for the Course Room feature: **CourseRoomLeaderboard** and **CourseRoomMemberDetail**.

## Components Created

### 1. CourseRoomLeaderboard.jsx
**Location:** `src/components-xm/Course/CourseRoom/CourseRoomLeaderboard.jsx`

**Purpose:** Displays a competitive leaderboard showing top performers in the course based on various metrics.

**Features:**
- **Top 3 Podium Display**: Visual podium-style layout for the top 3 performers with gold, silver, and bronze tiers
- **Rank Tiers System**: 
  - Gold (Rank 1-3)
  - Silver (Rank 4-10)
  - Bronze (Rank 11-20)
- **Achievement Badges**:
  - Fast Learner
  - Consistent
  - Top Performer
  - Completion Master
- **Scoring System**: Overall score calculated from:
  - Progress percentage (40% weight)
  - Completed activities (30% weight)
  - Activity streak (20% weight)
  - Average quiz score (10% weight)
- **Time Range Filters**: All-time, Monthly, Weekly (UI ready)
- **Comprehensive Metrics**:
  - Completed activities count
  - Activity streak (consecutive days)
  - Total time spent
  - Progress percentage

**Data Fetching:**
- Uses the same API endpoint as CourseRoomProgress: `/searchCourse`
- Includes enrollments, activity logs, quiz results, and course content
- Calculates metrics client-side for ranking

**UI Components:**
- Gradient cards for visual appeal
- Progress bars for completion tracking
- Avatar displays with fallback initials
- Badge system for achievements and ranks
- Responsive grid layout

**Route:** `/course/:CourseId/room/leaderboard`

---

### 2. CourseRoomMemberDetail.jsx
**Location:** `src/components-xm/Course/CourseRoom/CourseRoomMemberDetail.jsx`

**Purpose:** Displays detailed information about a specific course member, including their progress, activities, and quiz performance.

**Features:**
- **Profile Section**:
  - Large avatar with fallback
  - Member name and email
  - Enrollment status badge
  - Quick stats (enrollment date, streak, completed count)
  - Overall progress percentage with visual progress bar

- **Statistics Cards**:
  - **Completed Activities**: Shows completed/total activities
  - **Time Spent**: Total and average time per activity
  - **Quiz Score**: Average score and pass rate
  - **Activity Streak**: Consecutive days active

- **Tabbed Detail View**:
  - **Overview Tab**:
    - Progress by content type (Video, Quiz, Document, etc.)
    - Recent activity timeline with status indicators
  - **Activities Tab**:
    - Full list of all activities
    - Status for each activity (Not Started, In Progress, Completed)
    - Activity duration tracking
    - Content type categorization
  - **Quizzes Tab**:
    - Quiz attempt history
    - Scores and pass/fail status
    - Attempt dates

**Data Fetching:**
- Uses `/searchCourse` endpoint with specific userId filter
- Fetches complete user progress data including:
  - Enrollments
  - Activity logs with course content details
  - Quiz results
  - Course access information

**Calculations:**
- Progress percentage
- Total time spent
- Average time per activity
- Quiz statistics (average score, pass rate)
- Activity streak calculation
- Days since enrollment

**Route:** `/course/:CourseId/room/member/:userId`

**Navigation:**
- Accessible from CourseRoomProgress "View Details" button
- Back button to return to previous page

---

## Integration

### Routes Added to `main.jsx`:
```jsx
import CourseRoomLeaderboard from "./components-xm/Course/CourseRoom/CourseRoomLeaderboard.jsx";
import CourseRoomMemberDetail from "./components-xm/Course/CourseRoom/CourseRoomMemberDetail.jsx";

// In routes:
{
  path: "/course/:CourseId/room/leaderboard",
  element: <CourseRoomLeaderboard />,
},
{
  path: "/course/:CourseId/room/member/:userId",
  element: <CourseRoomMemberDetail />,
}
```

### CourseRoom.jsx Updates:
- Added "Leaderboard" tab in navigation
- Updated `getCurrentTab()` to recognize leaderboard and member detail routes
- Tab icon changed to Activity for consistency

### CourseRoomProgress.jsx Updates:
- Added navigation imports (`useNavigate`, `useParams`)
- Updated "View Details" button to navigate to member detail page instead of opening sheet
- Navigation route: `/course/${CourseId}/room/member/${member.userId}`

---

## Design Patterns

### Common Patterns Used:
1. **Gradient Backgrounds**: Used for visual hierarchy and modern UI
2. **Card-based Layout**: Consistent with existing course room design
3. **Skeleton Loading**: Loading states for better UX
4. **Empty States**: Meaningful messages when no data available
5. **Responsive Design**: Mobile-first approach with responsive grids
6. **Icon System**: Lucide icons for visual consistency
7. **Color Coding**: Status-based colors (green=completed, yellow=in-progress, gray=not-started)

### State Management:
- Uses `useOutletContext` to receive shared data from parent CourseRoom component
- Local state for component-specific data (leaderboard data, member data)
- React hooks for data fetching and side effects

### Error Handling:
- Toast notifications for API errors
- Try-catch blocks for async operations
- Fallback UI for missing data

---

## API Integration

### Endpoint Used:
**POST** `/searchCourse`

### Request Structure:
```javascript
{
  limit: number,
  offset: number,
  getThisData: {
    datasource: "User",
    attributes: [],
    where: { userId: number }, // Optional for member detail
    include: [
      {
        datasource: "CourseAccess",
        as: "courseAccess",
        required: true,
        where: { courseId: string }
      },
      {
        datasource: "UserCourseEnrollment",
        as: "enrollments",
        required: false
      },
      {
        datasource: "UserCourseContentProgress",
        as: "activityLogs",
        required: false,
        include: [
          {
            datasource: "CourseContent",
            as: "courseContent",
            required: false
          }
        ]
      },
      {
        datasource: "QuizResultLog",
        as: "quizResults",
        required: false
      }
    ]
  }
}
```

---

## Future Enhancements

### Potential Improvements:
1. **Real-time Updates**: WebSocket integration for live leaderboard updates
2. **Time Range Filtering**: Implement functional weekly/monthly filters
3. **Export Functionality**: Download member reports as PDF/CSV
4. **Comparison View**: Compare multiple members side-by-side
5. **Rewards System**: Integration with gamification features
6. **Social Features**: Comments, likes, peer recognition
7. **Performance Analytics**: Charts and graphs for trend analysis
8. **Custom Ranking**: Allow admins to customize scoring weights
9. **Notifications**: Alert members when they're overtaken in leaderboard
10. **Mobile App Integration**: Deep linking to member profiles

---

## Testing Recommendations

### Test Cases:
1. **Leaderboard Component**:
   - Verify correct sorting by overall score
   - Check rank tier assignments
   - Test achievement badge logic
   - Validate empty state handling
   - Test time range filter switching

2. **Member Detail Component**:
   - Test with users having no activity
   - Verify quiz pass/fail logic
   - Check streak calculation accuracy
   - Test tab switching functionality
   - Validate progress by content type calculations

3. **Navigation**:
   - Test navigation from progress to member detail
   - Verify back button functionality
   - Check URL parameter handling

4. **Responsive Design**:
   - Test on mobile, tablet, and desktop screens
   - Verify touch interactions on mobile
   - Check scrollable areas

---

## Dependencies

### UI Components:
- Card, CardContent, CardHeader, CardTitle, CardDescription
- Avatar, AvatarFallback, AvatarImage
- Badge
- Button
- Progress
- Skeleton
- Tabs, TabsContent, TabsList, TabsTrigger

### Icons (Lucide React):
- Trophy, Medal, Award, Crown
- Star, Flame, Zap
- TrendingUp, Activity, BarChart3
- CheckCircle, PlayCircle, BookOpen
- Calendar, Clock, Timer
- User, Users
- ArrowLeft, ChevronRight

### Hooks:
- useState, useEffect, useMemo (React)
- useNavigate, useParams, useOutletContext (React Router)
- useToast (Custom hook)

### Services:
- axiosConn (API client)

---

## File Structure

```
src/
  components-xm/
    Course/
      CourseRoom/
        CourseRoom.jsx                    (Parent component)
        CourseRoomProgress.jsx            (Updated with navigation)
        CourseRoomLeaderboard.jsx         (NEW - Leaderboard view)
        CourseRoomMemberDetail.jsx        (NEW - Member detail view)
        CourseRoomMembers.jsx             (Existing)
        CourseRoomSettings.jsx            (Existing)
  main.jsx                                (Updated with routes)
```

---

## Screenshots/UI Reference

### Leaderboard Layout:
- **Header**: Gradient card with filters
- **Top 3 Podium**: Side-by-side cards with ranks 2, 1, 3
- **Full List**: Scrollable list starting from rank 4

### Member Detail Layout:
- **Profile Header**: Avatar, name, status, quick stats
- **Statistics Row**: 4 gradient cards with key metrics
- **Tabs Section**: Three tabs with detailed information

---

## Conclusion

These two new components significantly enhance the Course Room functionality by providing:
1. **Competitive Element**: Leaderboard encourages engagement
2. **Detailed Insights**: Member detail provides comprehensive progress tracking
3. **Better Navigation**: Direct links between progress and member details
4. **Modern UI**: Gradient designs and responsive layouts
5. **Comprehensive Data**: All relevant metrics in one place

The components follow existing design patterns, use the same API structure, and integrate seamlessly with the current Course Room architecture.
