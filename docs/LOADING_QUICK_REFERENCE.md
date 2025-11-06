# Loading Components Quick Reference

## Import Statement
```jsx
import { 
  ContentLoader,
  InlineLoader,
  FullPageLoader,
  SectionLoader,
  CardLoader,
  TableLoader,
  ListLoader,
  LoadingOrEmpty
} from '@/components/ui/loading-components';

import { Spinner } from '@/components/ui/spinner';
import { useLoading } from '@/contexts/LoadingContext';
```

## Quick Examples

### 1. Loading a Page Section
```jsx
{loading ? (
  <ContentLoader message="Loading..." size="lg" />
) : (
  <YourContent />
)}
```

### 2. Button with Loading
```jsx
<Button disabled={saving}>
  {saving ? <InlineLoader size="xs" /> : 'Save'}
</Button>
```

### 3. List with Loading & Empty States
```jsx
<LoadingOrEmpty
  loading={loading}
  empty={items.length === 0}
  loadingMessage="Loading items..."
  emptyMessage="No items found"
  emptyIcon={Inbox}
>
  <YourList items={items} />
</LoadingOrEmpty>
```

### 4. Full Page Loading
```jsx
{globalLoading && <FullPageLoader message="Processing..." />}
```

### 5. Skeleton Loading
```jsx
{loading ? (
  <CardLoader />
) : (
  <YourCard />
)}
```

### 6. Table Skeleton
```jsx
{loading ? (
  <TableLoader rows={5} columns={4} />
) : (
  <YourTable />
)}
```

### 7. Using Loading Context
```jsx
function MyComponent() {
  const { startLoading, stopLoading, isLoading } = useLoading();
  
  const fetchData = async () => {
    startLoading('myData');
    try {
      await api.get('/data');
    } finally {
      stopLoading('myData');
    }
  };
  
  return (
    <div>
      {isLoading('myData') && <InlineLoader />}
    </div>
  );
}
```

### 8. Async Hook
```jsx
import { useAsyncLoading } from '@/contexts/LoadingContext';

function MyComponent() {
  const { execute, loading, error } = useAsyncLoading(
    async () => await fetchData(),
    'fetchKey'
  );
  
  return (
    <Button onClick={execute} disabled={loading}>
      {loading ? 'Loading...' : 'Fetch'}
    </Button>
  );
}
```

## Size Reference

| Size | Pixels | Use Case |
|------|--------|----------|
| xs   | 16px   | Buttons, inline text |
| sm   | 24px   | Small cards, list items |
| md   | 32px   | Medium cards, sections |
| lg   | 40px   | Page sections, large cards |
| xl   | 48px   | Full page, major operations |

## Common Patterns

### API Call Pattern
```jsx
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await api.get('/endpoint');
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);

if (loading) return <ContentLoader />;
return <Content data={data} />;
```

### Form Submission Pattern
```jsx
const [submitting, setSubmitting] = useState(false);

const handleSubmit = async (data) => {
  setSubmitting(true);
  try {
    await api.post('/submit', data);
    toast.success('Saved!');
  } catch (error) {
    toast.error('Failed');
  } finally {
    setSubmitting(false);
  }
};

return (
  <Button type="submit" disabled={submitting}>
    {submitting ? <InlineLoader size="xs" /> : 'Submit'}
  </Button>
);
```

### Multiple Loading States
```jsx
const [loadingA, setLoadingA] = useState(false);
const [loadingB, setLoadingB] = useState(false);

const isAnyLoading = loadingA || loadingB;

return (
  <div>
    {loadingA && <ContentLoader message="Loading A..." />}
    {loadingB && <ContentLoader message="Loading B..." />}
  </div>
);
```

## Props Reference

### ContentLoader
```jsx
<ContentLoader 
  message="Loading..."      // Loading message
  size="lg"                  // Spinner size
  className="py-12"          // Additional classes
/>
```

### InlineLoader
```jsx
<InlineLoader 
  message="Saving..."        // Optional message
  size="sm"                  // Spinner size
  className="ml-2"           // Additional classes
/>
```

### FullPageLoader
```jsx
<FullPageLoader 
  message="Loading..."       // Loading message
  backdrop={true}            // Show backdrop (default: true)
/>
```

### SectionLoader
```jsx
<SectionLoader 
  message="Loading..."       // Loading message
  minHeight="300px"          // Minimum height
  backdrop={true}            // Show backdrop
  className="rounded-lg"     // Additional classes
/>
```

### LoadingOrEmpty
```jsx
<LoadingOrEmpty
  loading={isLoading}        // Loading state
  empty={data.length === 0}  // Empty state
  loadingMessage="..."       // Message during loading
  emptyMessage="..."         // Message when empty
  emptyIcon={IconComponent}  // Icon for empty state
>
  {children}                 // Content to show
</LoadingOrEmpty>
```

### CardLoader
```jsx
<CardLoader className="mb-4" />
```

### TableLoader
```jsx
<TableLoader 
  rows={5}                   // Number of skeleton rows
  columns={4}                // Number of skeleton columns
  className="mt-4"           // Additional classes
/>
```

### ListLoader
```jsx
<ListLoader 
  items={5}                  // Number of skeleton items
  className="space-y-2"      // Additional classes
/>
```

## Where to Use Each Component

| Component | Use Case | Example |
|-----------|----------|---------|
| ContentLoader | Page sections, main content areas | Dashboard, Course list |
| InlineLoader | Buttons, inline actions | Save button, Load more |
| FullPageLoader | App initialization, major transitions | Login, Navigation |
| SectionLoader | Card content, sidebars | Profile section, Sidebar |
| CardLoader | Card placeholders | Course cards, User cards |
| TableLoader | Table data loading | Transaction history, User list |
| ListLoader | List items | Comments, Notifications |
| LoadingOrEmpty | Lists/grids with potential empty state | Search results, Courses |

## Tips

1. **Always provide meaningful messages**: Users want to know what's loading
2. **Use appropriate sizes**: Match the spinner size to the context
3. **Skeleton > Spinner**: Use skeleton loaders for lists/grids when possible
4. **Disable during loading**: Prevent duplicate actions
5. **Clean up**: Always set loading to false in finally blocks
6. **Test with slow network**: Use browser dev tools to test
7. **Consider empty states**: Use LoadingOrEmpty for better UX
8. **Accessibility**: All components have proper ARIA attributes

## Anti-Patterns to Avoid

❌ **Don't**: Use loading without message
```jsx
<ContentLoader /> // No context
```

✅ **Do**: Provide meaningful message
```jsx
<ContentLoader message="Loading courses..." />
```

---

❌ **Don't**: Forget to clean up
```jsx
setLoading(true);
await api.call();
// Forgot setLoading(false) on error
```

✅ **Do**: Always use finally
```jsx
try {
  setLoading(true);
  await api.call();
} finally {
  setLoading(false);
}
```

---

❌ **Don't**: Use giant spinners everywhere
```jsx
<Spinner size="xl" /> // For a small button
```

✅ **Do**: Match size to context
```jsx
<InlineLoader size="xs" /> // For buttons
```

---

❌ **Don't**: Show multiple full-page loaders
```jsx
{loadingA && <FullPageLoader />}
{loadingB && <FullPageLoader />}
```

✅ **Do**: Coordinate loading states
```jsx
{(loadingA || loadingB) && <FullPageLoader />}
```

## Common Issues & Solutions

### Issue: Loading state stuck
**Solution**: Always use try/finally blocks

### Issue: Multiple spinners visible
**Solution**: Coordinate loading states or use global loading

### Issue: Spinner too large/small
**Solution**: Use appropriate size prop

### Issue: No loading feedback
**Solution**: Add loading state and component

### Issue: Poor performance
**Solution**: Use skeleton loaders, avoid unnecessary re-renders

## Need Help?

- 📖 Full docs: `docs/LOADING_SYSTEM.md`
- 📝 Implementation summary: `docs/LOADING_IMPLEMENTATION_SUMMARY.md`
- 💻 Code: `src/components/ui/loading-components.jsx`
- 🔧 Context: `src/contexts/LoadingContext.jsx`
