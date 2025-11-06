import { Spinner } from "./spinner";
import clsx from "clsx";

/**
 * Full Page Loading Overlay
 * Covers the entire viewport with a loading spinner
 */
export function FullPageLoader({ message = "Loading...", backdrop = true }) {
  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center",
        backdrop && "bg-background/80 backdrop-blur-sm"
      )}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex flex-col items-center space-y-4">
        <Spinner size="xl" />
        {message && (
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Section Loading Overlay
 * Covers a specific section with loading state
 */
export function SectionLoader({
  message = "Loading...",
  className = "",
  backdrop = true,
  minHeight = "200px",
}) {
  return (
    <div
      className={clsx(
        "relative flex items-center justify-center",
        backdrop && "bg-background/50 backdrop-blur-sm rounded-lg",
        className
      )}
      style={{ minHeight }}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex flex-col items-center space-y-3 p-8">
        <Spinner size="lg" />
        {message && (
          <p className="text-sm font-medium text-muted-foreground">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Inline Loader
 * Small inline loading indicator
 */
export function InlineLoader({ message, size = "sm", className = "" }) {
  return (
    <div
      className={clsx("inline-flex items-center gap-2", className)}
      role="status"
      aria-live="polite"
      aria-label={message || "Loading"}
    >
      <Spinner size={size} />
      {message && (
        <span className="text-sm text-muted-foreground">{message}</span>
      )}
    </div>
  );
}

/**
 * Card Loading Skeleton
 * Loading placeholder for card components
 */
export function CardLoader({ className = "" }) {
  return (
    <div
      className={clsx(
        "rounded-lg border bg-card p-6 animate-pulse",
        className
      )}
      role="status"
      aria-label="Loading content"
    >
      <div className="space-y-4">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded"></div>
          <div className="h-3 bg-muted rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Table Loading Skeleton
 * Loading placeholder for table rows
 */
export function TableLoader({ rows = 5, columns = 4, className = "" }) {
  return (
    <div className={clsx("space-y-2", className)} role="status" aria-label="Loading table">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-4 p-4 border rounded-lg animate-pulse"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={clsx(
                "h-4 bg-muted rounded",
                colIndex === 0 ? "w-1/4" : "flex-1"
              )}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * List Loading Skeleton
 * Loading placeholder for list items
 */
export function ListLoader({ items = 5, className = "" }) {
  return (
    <div className={clsx("space-y-3", className)} role="status" aria-label="Loading list">
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 border rounded-lg animate-pulse"
        >
          <div className="w-10 h-10 bg-muted rounded-full flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-muted rounded w-3/4"></div>
            <div className="h-2 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Button Loading State
 * Loading button with spinner
 */
export function ButtonLoader({ children, loading, disabled, ...props }) {
  return (
    <button {...props} disabled={loading || disabled}>
      {loading ? (
        <span className="flex items-center gap-2">
          <Spinner size="xs" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

/**
 * Content Loader
 * Generic content loading with spinner centered in container
 */
export function ContentLoader({ 
  message = "Loading content...", 
  className = "",
  size = "md" 
}) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center py-12 space-y-4",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <Spinner size={size} />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}

/**
 * Page Transition Loader
 * Used for page route transitions
 */
export function PageTransitionLoader({ message = "Loading page..." }) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center space-y-4">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}

/**
 * Empty State with Loading Option
 * Shows empty state or loading state
 */
export function LoadingOrEmpty({
  loading,
  empty,
  loadingMessage = "Loading...",
  emptyMessage = "No data available",
  emptyIcon: EmptyIcon,
  children,
}) {
  if (loading) {
    return <ContentLoader message={loadingMessage} />;
  }

  if (empty) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        {EmptyIcon && <EmptyIcon className="h-12 w-12 text-muted-foreground" />}
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return children;
}
