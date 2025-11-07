import * as React from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

const InputGroup = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      {...props}
    />
  )
})
InputGroup.displayName = "InputGroup"

const InputGroupAddon = React.forwardRef(({ 
  className, 
  align = "end",
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-10 pointer-events-none",
        align === "start" && "left-3 top-3",
        align === "end" && "right-3 top-3",
        align === "block-end" && "right-3 bottom-3",
        className
      )}
      {...props}
    />
  )
})
InputGroupAddon.displayName = "InputGroupAddon"

const InputGroupText = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
InputGroupText.displayName = "InputGroupText"

const InputGroupTextarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <Textarea
      ref={ref}
      className={cn("pr-20", className)}
      {...props}
    />
  )
})
InputGroupTextarea.displayName = "InputGroupTextarea"

export {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
}