# Loading System Documentation

## Overview
This application uses a comprehensive, unified loading UI/UX system to provide consistent feedback to users during asynchronous operations.

## Architecture

### 1. Core Components

#### Loading Context (`src/contexts/LoadingContext.jsx`)
A global context provider for managing loading states across the application.

**Features:**
- Centralized loading state management
- Scoped loading (by key)
- Global loading overlay
- Automatic cleanup

**Usage:**
```jsx
import { useLoading } from '@/contexts/LoadingContext';

function MyComponent() {
  const { startLoading, stopLoading, isLoading } = useLoading();
  
  const fetchData = async () => {
    startLoading('myData');
    try {
      const data = await api.fetchData();
      // handle data
    } finally {
      stopLoading('myData');
    }
  };
  
  return (
    <div>
      {isLoading('myData') && <p>Loading...</p>}
    </div>
  );
}
```

#### Async Loading Hook
Automatically manages loading states for async operations:

```jsx
import { useAsyncLoading } from '@/contexts/LoadingContext';

function MyComponent() {
  const { execute, loading, error, data } = useAsyncLoading(
    async () => await fetchSomeData(),
    'fetchData'
  );
  
  return (
    <div>
      <button onClick={execute} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      {error && <p>Error: {error.message}</p>}
      {data && <p>Data: {JSON.stringify(data)}</p>}
    </div>
  );
}
```

### 2. Loading Components (`src/components/ui/loading-components.jsx`)

#### FullPageLoader
Covers entire viewport with loading spinner.

```jsx
import { FullPageLoader } from '@/components/ui/loading-components';

<FullPageLoader message="Loading application..." />
```

**Props:**
- `message` (string): Loading message to display
- `backdrop` (boolean): Whether to show backdrop (default: true)

#### SectionLoader
Covers a specific section with loading state.

```jsx
import { SectionLoader } from '@/components/ui/loading-components';

<SectionLoader 
  message="Loading content..." 
  minHeight="300px"
  backdrop={true}
/>
```

**Props:**
- `message` (string): Loading message
- `className` (string): Additional CSS classes
- `backdrop` (boolean): Show backdrop
- `minHeight` (string): Minimum height for the loader

#### ContentLoader
General content loading with centered spinner.

```jsx
import { ContentLoader } from '@/components/ui/loading-components';

<ContentLoader 
  message="Loading courses..." 
  size="lg" 
/>
```

**Props:**
- `message` (string): Loading message
- `size` ('xs' | 'sm' | 'md' | 'lg' | 'xl'): Spinner size
- `className` (string): Additional CSS classes

#### InlineLoader
Small inline loading indicator.

```jsx
import { InlineLoader } from '@/components/ui/loading-components';

<InlineLoader message="Saving..." size="sm" />
```

**Props:**
- `message` (string): Optional loading message
- `size` ('xs' | 'sm' | 'md' | 'lg' | 'xl'): Spinner size
- `className` (string): Additional CSS classes

#### CardLoader
Skeleton placeholder for card components.

```jsx
import { CardLoader } from '@/components/ui/loading-components';

<CardLoader />
```

#### TableLoader
Skeleton placeholder for table rows.

```jsx
import { TableLoader } from '@/components/ui/loading-components';

<TableLoader rows={5} columns={4} />
```

**Props:**
- `rows` (number): Number of skeleton rows (default: 5)
- `columns` (number): Number of skeleton columns (default: 4)
- `className` (string): Additional CSS classes

#### ListLoader
Skeleton placeholder for list items.

```jsx
import { ListLoader } from '@/components/ui/loading-components';

<ListLoader items={5} />
```

**Props:**
- `items` (number): Number of skeleton items (default: 5)
- `className` (string): Additional CSS classes

#### LoadingOrEmpty
Shows loading, empty state, or content.

```jsx
import { LoadingOrEmpty } from '@/components/ui/loading-components';
import { BookOpen } from 'lucide-react';

<LoadingOrEmpty
  loading={isLoading}
  empty={data.length === 0}
  loadingMessage="Loading courses..."
  emptyMessage="No courses found"
  emptyIcon={BookOpen}
>
  {/* Your content here */}
</LoadingOrEmpty>
```

**Props:**
- `loading` (boolean): Loading state
- `empty` (boolean): Empty state
- `loadingMessage` (string): Message during loading
- `emptyMessage` (string): Message when empty
- `emptyIcon` (Component): Icon component for empty state
- `children` (ReactNode): Content to show when not loading/empty

### 3. Base Spinner Component (`src/components/ui/spinner.jsx`)

The foundational spinner component used throughout the system.

```jsx
import { Spinner } from '@/components/ui/spinner';

<Spinner size="md" />
```

**Props:**
- `size` ('xs' | 'sm' | 'md' | 'lg' | 'xl'): Size of spinner (default: 'md')
- `className` (string): Additional CSS classes
- `label` (string): Accessibility label (default: 'Loading')
- `decorative` (boolean): If true, hides from screen readers

**Sizes:**
- `xs`: 16px (h-4 w-4)
- `sm`: 24px (h-6 w-6)
- `md`: 32px (h-8 w-8)
- `lg`: 40px (h-10 w-10)
- `xl`: 48px (h-12 w-12)

## Implementation Pattern

### For Page Components

```jsx
import { ContentLoader } from '@/components/ui/loading-components';

function MyPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await api.fetchData();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <ContentLoader message="Loading page..." size="lg" />;
  }
  
  return (
    <div>
      {/* Your content */}
    </div>
  );
}
```

### For List/Grid Components

```jsx
import { LoadingOrEmpty } from '@/components/ui/loading-components';
import { BookOpen } from 'lucide-react';

function CourseList({ loading, courses }) {
  return (
    <LoadingOrEmpty
      loading={loading}
      empty={courses.length === 0}
      loadingMessage="Loading courses..."
      emptyMessage="No courses available"
      emptyIcon={BookOpen}
    >
      <div className="grid grid-cols-3 gap-4">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </LoadingOrEmpty>
  );
}
```

### For Button Actions

```jsx
import { InlineLoader } from '@/components/ui/loading-components';

function SaveButton({ onSave }) {
  const [saving, setSaving] = useState(false);
  
  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <button onClick={handleSave} disabled={saving}>
      {saving ? <InlineLoader size="xs" /> : 'Save'}
    </button>
  );
}
```

### For API Calls in Custom Hooks

```jsx
export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosConn.get('/courses');
      setCourses(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    courses,
    loading,
    error,
    fetchCourses,
  };
}
```

## Updated Components

The following components have been updated with the new loading system:

### Core Components
- ✅ `App.jsx` - Uses LoaderOne for initial authentication
- ✅ `Dashboard.jsx` - ContentLoader for course loading
- ✅ `MyJourney.jsx` - ContentLoader for course lists
- ✅ `BringYourOwnCourse.jsx` - ContentLoader for course exploration

### Course Components
- ✅ `CourseOverview.jsx` - InlineLoader and ContentLoader
- 🔄 `CourseVideoTutorial.jsx` - Needs loading states
- 🔄 `CourseQuiz.jsx` - Needs loading states
- 🔄 `CourseFlashcard.jsx` - Needs loading states
- 🔄 `CourseNotes.jsx` - Needs loading states

### Account Settings
- ✅ `MyAccount.jsx` - InlineLoader for save actions
- 🔄 `Notifications.jsx` - Needs loading states
- 🔄 `BillingOverview.jsx` - Needs loading states
- 🔄 `TransactionHistory.jsx` - Needs loading states

### Course Builder
- 🔄 `Builder.jsx` - Needs loading states
- 🔄 `PreviewBuilder.jsx` - Needs loading states
- 🔄 Content creators - Need loading states

### Course Room
- 🔄 `CourseRoom.jsx` - Needs loading states
- 🔄 `CourseRoomMembers.jsx` - Needs loading states
- 🔄 `CourseRoomDiscussions.jsx` - Needs loading states

## Best Practices

1. **Always provide meaningful loading messages**
   ```jsx
   // Good
   <ContentLoader message="Loading your courses..." />
   
   // Avoid
   <ContentLoader message="Loading..." />
   ```

2. **Use appropriate loader size for context**
   ```jsx
   // Full page
   <ContentLoader size="xl" />
   
   // Section
   <ContentLoader size="lg" />
   
   // Card/Item
   <ContentLoader size="md" />
   
   // Button
   <InlineLoader size="xs" />
   ```

3. **Handle errors gracefully**
   ```jsx
   if (loading) return <ContentLoader />;
   if (error) return <ErrorMessage error={error} />;
   return <Content data={data} />;
   ```

4. **Use skeleton loaders for better UX**
   ```jsx
   // Instead of spinner for cards
   {loading ? (
     <CardLoader />
   ) : (
     <Card />
   )}
   ```

5. **Disable interactive elements during loading**
   ```jsx
   <button disabled={loading}>
     {loading ? <InlineLoader size="xs" /> : 'Submit'}
   </button>
   ```

6. **Clean up loading states**
   ```jsx
   useEffect(() => {
     let mounted = true;
     
     const fetchData = async () => {
       setLoading(true);
       try {
         const data = await api.fetch();
         if (mounted) setData(data);
       } finally {
         if (mounted) setLoading(false);
       }
     };
     
     fetchData();
     
     return () => { mounted = false; };
   }, []);
   ```

## Accessibility

All loading components include proper ARIA attributes:
- `role="status"` for loading indicators
- `aria-live="polite"` for dynamic updates
- `aria-label` for screen reader context
- Hidden text with `sr-only` class where appropriate

## Performance Considerations

1. Use skeleton loaders (`CardLoader`, `TableLoader`, `ListLoader`) for better perceived performance
2. Show loading immediately for operations > 100ms
3. Use `useCallback` and `useMemo` to prevent unnecessary re-renders
4. Consider using React.lazy() with Suspense for code splitting

## Migration Guide

### From Old System to New System

**Before:**
```jsx
{loading && <Spinner size="lg" />}
{!loading && <Content />}
```

**After:**
```jsx
<LoadingOrEmpty loading={loading} empty={!data}>
  <Content data={data} />
</LoadingOrEmpty>
```

**Before:**
```jsx
<div className="flex justify-center">
  <Spinner />
  <p>Loading...</p>
</div>
```

**After:**
```jsx
<ContentLoader message="Loading..." />
```

## Future Enhancements

- [ ] Add progress bar for long operations
- [ ] Implement optimistic UI updates
- [ ] Add retry mechanism for failed operations
- [ ] Create loading state debug tool
- [ ] Add loading analytics
