import React from "react";
import clsx from "clsx";

/**
 * Unified Spinner component.
 * Usage: <Spinner /> or with props <Spinner size="lg" />
 * Sizes: xs, sm, md, lg, xl
 * The visual style is based on the provided sample design:
 * <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
 */
export function Spinner({
  size = "md",
  className = "",
  label = "Loading",
  decorative = false,
}) {
  const sizeMap = {
    xs: "h-4 w-4",
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-12 w-12",
  };
  const sizeClasses = sizeMap[size] || sizeMap.md;

  return (
    <div className={clsx("inline-flex items-center justify-center", className)}>
      <div
        role={decorative ? undefined : "status"}
        aria-label={decorative ? undefined : label}
        aria-live={decorative ? undefined : "polite"}
        className={clsx(
          "animate-spin rounded-full border-2 border-neutral-300 dark:border-neutral-600",
          "border-b-primary",
          sizeClasses
        )}
      />
      {!decorative && <span className="sr-only">{label}</span>}
    </div>
  );
}

export default Spinner;
