import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Combobox({
  options = [],
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  allowCustom = false,
  className,
  disabled = false,
}) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  // Find the label for the current value
  const selectedOption = options.find((option) => option.value === value)
  const displayValue = selectedOption ? selectedOption.label : value

  const handleSelect = (currentValue) => {
    const newValue = currentValue === value ? "" : currentValue
    onValueChange(newValue)
    setOpen(false)
    setInputValue("")
  }

  const handleInputChange = (search) => {
    setInputValue(search)
  }

  const handleInputKeyDown = (e) => {
    if (allowCustom && e.key === "Enter" && inputValue && !options.some(opt => 
      opt.label.toLowerCase() === inputValue.toLowerCase()
    )) {
      e.preventDefault()
      onValueChange(inputValue)
      setOpen(false)
      setInputValue("")
    }
  }

  // Filter options based on input
  const filteredOptions = inputValue
    ? options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    : options

  // Check if input value is a custom value (not in the list)
  const isCustomValue = allowCustom && inputValue && !options.some(
    (opt) => opt.label.toLowerCase() === inputValue.toLowerCase()
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-11 border-2 hover:border-orange-500 transition-all",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <span className="truncate">
            {value ? displayValue : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 z-50" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={inputValue}
            onValueChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
          />
          <CommandList>
            <CommandEmpty>
              {emptyText}
            </CommandEmpty>
            <CommandGroup>
              {/* Show custom input option first if it's a custom value */}
              {isCustomValue && (
                <CommandItem
                  value={inputValue}
                  onSelect={handleSelect}
                  className="text-orange-600 font-medium"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === inputValue ? "opacity-100" : "opacity-0"
                    )}
                  />
                  Use "{inputValue}"
                </CommandItem>
              )}
              {/* Show filtered options */}
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
