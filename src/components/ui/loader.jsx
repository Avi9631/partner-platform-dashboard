"use client";
import React from "react";
import { Spinner } from "./spinner";

// NOTE: Existing Loader* components kept for backward compatibility.
// Prefer using <Spinner /> from spinner.jsx for a unified loading UI.

/**
 * @deprecated Use <Spinner size="sm" /> directly.
 */
export const LoaderOne = () => <Spinner size="sm" decorative />;

/**
 * @deprecated Use <Spinner size="sm" /> directly.
 */
export const LoaderTwo = () => <Spinner size="sm" decorative />;

/**
 * @deprecated Use <Spinner size="xl" /> directly.
 */
export const LoaderThree = () => <Spinner size="xl" decorative />;

/**
 * @deprecated Use your own label + <Spinner />. Kept for backward compatibility.
 */
export const LoaderFour = ({ text = "Loading..." }) => (
    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Spinner size="sm" />
        <span>{text}</span>
    </div>
);

// Re-export unified Spinner for convenience
export { Spinner };
