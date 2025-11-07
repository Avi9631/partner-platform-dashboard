import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const FieldGroup = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-4", className)}
      {...props}
    />
  )
})
FieldGroup.displayName = "FieldGroup"

const Field = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "space-y-2",
        orientation === "horizontal" && "flex items-center gap-2 space-y-0",
        className
      )}
      {...props}
    />
  )
})
Field.displayName = "Field"

const FieldLabel = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
      {...props}
    />
  )
})
FieldLabel.displayName = "FieldLabel"

const FieldDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FieldDescription.displayName = "FieldDescription"

const FieldError = React.forwardRef(({ className, errors, ...props }, ref) => {
  if (!errors || errors.length === 0) {
    return null
  }

  return (
    <div ref={ref} className={cn("text-sm font-medium text-destructive", className)} {...props}>
      {errors.map((error, index) => (
        <p key={index}>{error?.message || error}</p>
      ))}
    </div>
  )
})
FieldError.displayName = "FieldError"

export {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
}