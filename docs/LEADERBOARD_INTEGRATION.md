# Course Leaderboard Integration Guide

## Overview
This document explains how the `CourseRoomLeaderboard` component integrates with the new `getCourseLeaderboard` API.

## API Integration

### Endpoint
```javascript
POST /getCourseLeaderboard
```

### Request Payload
```javascript
{
  courseId: string,      // Required: Course identifier
  limit: number,         // Optional: Max users (0 = all users)
  sortBy: string        // Optional: 'score', 'progress', 'quiz', 'time'
}
```

### Component Usage
```javascript
axiosConn.post(import.meta.env.VITE_API_URL + "/getCourseLeaderboard", {
  courseId: courseList.courseId,
  limit: 0,          // Get all users
  sortBy: sortBy,    // Dynamic sorting
})
```

## Features Implemented

### 1. **Dynamic Sorting**
Users can switch between different ranking criteria:
- **Overall Score** (default) - Weighted calculation of all metrics
- **Progress** - Course completion percentage
- **Quiz Score** - Average quiz performance
- **Learning Time** - Total hours spent learning

```javascript
const [sortBy, setSortBy] = useState("score");

// Sort buttons trigger re-fetch
<Button onClick={() => setSortBy("progress")}>Progress</Button>
```

### 2. **Top 3 Podium Display**
Special visual treatment for top 3 performers:
- **1st Place**: Gold tier, larger card, centered
- **2nd Place**: Silver tier, left position
- **3rd Place**: Bronze tier, right position

Features:
- Rank badges with tier-specific colors
- Avatar with gradient fallback
- Overall score display
- Progress bar
- Completed/Total content stats
- Average quiz score
- Achievement badges

### 3. **Full Leaderboard List**
Ranks 4+ displayed in a scrollable list:
- Position number
- User avatar and name
- Rank tier badge (Gold/Silver/Bronze)
- Detailed stats (content, learning hours, quizzes)
- Progress bar (desktop only)
- Overall score
- Achievement icons

### 4. **Statistics Dashboard**
Course-wide aggregate statistics displayed at the top:
- **Total Users**: All users with course access
- **Completed**: Users who finished the course
- **In Progress**: Active learners
- **Avg Progress**: Average completion percentage
- **Avg Quiz Score**: Average quiz performance

### 5. **Achievement System**
Four achievement types based on performance:

#### Achievement Badges

| Badge | Criteria | Icon | Color |
|-------|----------|------|-------|
| **Completion Master** | Completed course + 10+ content items | Award | Green |
| **Consistent** | Active for 7+ days | Flame | Orange |
| **Top Performer** | 90%+ quiz average with passes | Star | Purple |
| **Fast Learner** | 80%+ progress in <5 hours | Zap | Yellow |

```javascript
const determineAchievements = ({
  progressPercent,
  completedActivities,
  totalTimeSpent,
  activityStreak,
  avgQuizScore,
  status,
  passedQuizzes,
}) => {
  const achievements = [];
  
  if (status === "COMPLETED" && completedActivities >= 10) {
    achievements.push("COMPLETION_MASTER");
  }
  if (activityStreak >= 7) {
    achievements.push("CONSISTENT");
  }
  if (avgQuizScore >= 90 && passedQuizzes > 0) {
    achievements.push("TOP_PERFORMER");
  }
  const hoursSpent = totalTimeSpent / 3600;
  if (hoursSpent > 0 && hoursSpent < 5 && progressPercent >= 80) {
    achievements.push("FAST_LEARNER");
  }
  
  return achievements;
};
```

### 6. **Rank Tiers**
Visual distinction for different performance levels:

```javascript
const RANK_TIERS = {
  GOLD: { min: 1, max: 3, color: "from-yellow-400 to-yellow-600" },
  SILVER: { min: 4, max: 10, color: "from-gray-300 to-gray-500" },
  BRONZE: { min: 11, max: 20, color: "from-orange-300 to-orange-500" },
};
```

## Data Mapping

### API Response → Component State
```javascript
const processedData = (data.leaderboard || []).map((user) => ({
  // User Identity
  userId: user.userId,
  rank: user.rank,
  displayName: `${user.firstName} ${user.lastName}`,
  email: user.email,
  avatar: user.profilePic,
  
  // Progress Metrics
  progressPercent: user.progressPercent,
  completedActivities: user.completedContent,
  totalActivities: user.totalContent,
  
  // Time Tracking
  totalTimeSpent: user.totalActivityHours * 3600, // Hours to seconds
  totalTimeHours: user.totalActivityHours,
  
  // Quiz Performance
  avgQuizScore: user.averageQuizScore,
  passedQuizzes: user.passedQuizzes,
  totalQuizzes: user.totalQuizzes,
  
  // Engagement
  activityStreak: calculatedStreak,
  achievements: determineAchievements(...),
  
  // Scoring
  overallScore: user.leaderboardScore,
  status: user.status,
  
  // Dates
  enrollmentDate: user.enrollmentDate,
  lastActive: user.lastActivityDate,
}));
```

## User Status Values
- **NOT_STARTED**: Enrolled but no progress
- **ENROLLED**: Enrolled but no completed content
- **IN_PROGRESS**: Some content completed
- **COMPLETED**: All course content completed

## Loading States
```javascript
if (isLoading || contextLoading) {
  return <Skeleton className="h-64 w-full" />;
}

if (leaderboardData.length === 0) {
  return <EmptyState />;
}
```

## Error Handling
```javascript
.catch((err) => {
  console.error("Error fetching leaderboard data:", err);
  toast({
    title: "Error",
    description: err.response?.data?.message || "Failed to load leaderboard data",
    variant: "destructive",
  });
  setLeaderboardData([]);
  setStatistics(null);
  setIsLoading(false);
});
```

## Responsive Design
- **Mobile**: Single column podium, simplified stats
- **Tablet**: 3-column podium, partial stats
- **Desktop**: Full layout with all statistics

## Performance Considerations
1. **Efficient Re-renders**: Uses `useMemo` for top 3 and rest of leaderboard
2. **Single API Call**: Fetches all data in one request
3. **Client-side Filtering**: No pagination needed with limit: 0
4. **Optimized Re-fetching**: Only triggers on `courseId` or `sortBy` change

## Future Enhancements
1. **Time Range Filtering**: Weekly, Monthly, All-time
2. **Search/Filter Users**: Find specific learners
3. **Export Leaderboard**: CSV/PDF download
4. **Real-time Updates**: WebSocket integration
5. **Leaderboard History**: Track rank changes over time
6. **Team Leaderboards**: Group competitions
7. **Custom Achievements**: Admin-defined badges

## Dependencies
- `@/components/ui/*` - Shadcn UI components
- `@/hooks/use-toast` - Toast notifications
- `lucide-react` - Icons
- `react-router-dom` - Routing context
- `@/axioscon.js` - Axios instance

## Testing Checklist
- [ ] Leaderboard loads with course data
- [ ] Sorting changes trigger API re-fetch
- [ ] Top 3 podium displays correctly
- [ ] Statistics show accurate aggregates
- [ ] Achievements appear for qualified users
- [ ] Empty state shows when no data
- [ ] Loading skeleton displays during fetch
- [ ] Error toast shows on API failure
- [ ] Responsive layout works on all screens
- [ ] Rank tiers display correct colors/icons

## Related Files
- **Backend API**: `src/service/AcademyService.service.js` - `getCourseLeaderboard()`
- **Backend Controller**: `src/controller/Generic.controller.js` - `getCourseLeaderboard()`
- **Backend Route**: `src/routes/common.route.js` - `POST /getCourseLeaderboard`
- **API Documentation**: `COURSE_LEADERBOARD_API.md`
