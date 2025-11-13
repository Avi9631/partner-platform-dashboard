# Validation Error Logging - Example Output

This document shows examples of what you'll see in the browser console when validation errors occur.

## Example 1: Basic Field Validation Errors

When a user tries to submit the Basic Details step without filling required fields:

```
🚨 Validation Errors - Basic Details Step
Timestamp: 2025-11-12T10:30:45.123Z
  📍 projectName:
     Message: Project name is required
     Type: required
  📍 ageOfProperty:
     Message: Age of property is required
     Type: required
```

## Example 2: Nested Array Validation Errors

When RERA IDs are added but left empty:

```
🚨 Validation Errors - Basic Details Step
Timestamp: 2025-11-12T10:31:15.456Z
  📋 reraIds (Array):
    [0]:
      📍 id:
         Message: RERA ID is required
         Type: required
    [1]:
      📍 id:
         Message: RERA ID is required
         Type: required
```

## Example 3: Conditional Validation Errors

When possession status is "under_construction" but possession date is not provided:

```
🚨 Validation Errors - Basic Details Step
Timestamp: 2025-11-12T10:32:00.789Z
  📍 possessionDate:
     Message: Expected possession date is required for properties under construction
     Type: custom
```

## Example 4: Multiple Field Errors

When multiple fields have validation issues:

```
🚨 Validation Errors - Area Details Step
Timestamp: 2025-11-12T10:33:30.012Z
  📍 carpetArea:
     Message: Carpet area is required
     Type: required
  📍 superArea:
     Message: Super area is required
     Type: required
  📍 measurementMethod:
     Message: Measurement method is required
     Type: required
```

## Example 5: Successful Form Submission

When a user successfully submits a step:

```
✅ Form Submission Successful - Pricing Information Step
Timestamp: 2025-11-12T10:34:00.345Z
Form Data: {
  listingType: 'sale',
  pricing: [
    {
      type: 'asking_price',
      value: '5000000',
      unit: 'total'
    }
  ],
  isPriceNegotiable: true,
  availableFrom: '2025-12-01'
}
```

## Example 6: Failed Form Submission

When a user tries to submit with validation errors:

```
❌ Form Submission Failed - Location Attributes Step
Timestamp: 2025-11-12T10:35:15.678Z
Form Data: {
  facing: '',
  view: 'garden_view',
  propertyPosition: '',
  overlooking: ['garden', 'park']
}
Validation Errors: {
  facing: {
    message: 'Facing direction is required',
    type: 'required'
  }
}
🚨 Validation Errors - Location Attributes Step
Timestamp: 2025-11-12T10:35:15.678Z
  📍 facing:
     Message: Facing direction is required
     Type: required
```

## Example 7: Complex Pricing Validation

When pricing array has validation errors:

```
🚨 Validation Errors - Pricing Information Step
Timestamp: 2025-11-12T10:36:45.901Z
  📋 pricing (Array):
    [0]:
      📍 value:
         Message: Value is required
         Type: required
    [1]:
      📍 type:
         Message: Type is required
         Type: required
      📍 value:
         Message: Value is required
         Type: required
```

## Example 8: Number Validation Errors

When numeric values don't meet requirements:

```
🚨 Validation Errors - Floor Details Step
Timestamp: 2025-11-12T10:37:20.234Z
  📍 floorNumber:
     Message: Floor number must be at least 0
     Type: min
  📍 totalFloors:
     Message: Total floors must be at least 1
     Type: min
```

## How to View These Logs

1. **Open Developer Tools**
   - Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
   - Press `Cmd+Option+I` (Mac)

2. **Navigate to Console Tab**
   - Click on the "Console" tab in DevTools

3. **Interact with the Form**
   - Fill out form fields
   - Leave some fields empty or enter invalid data
   - Click "Save & Continue"

4. **View the Logs**
   - Logs appear in real-time as you interact with the form
   - Errors are grouped and collapsible
   - Timestamps help track when errors occurred

## Tips for Using the Logs

### Filtering Logs
- Use the DevTools search/filter to find specific field names
- Look for 🚨 emoji to quickly find validation error groups
- Use ✅ and ❌ emojis to find submission results

### Understanding Log Structure
- **Group Headers**: Show step name and timestamp
- **📍 Icon**: Indicates a direct field error
- **📋 Icon**: Indicates an array field with errors
- **🔸 Icon**: Indicates nested object errors
- **Indentation**: Shows nesting level for complex structures

### Common Patterns

**Required Field**:
```
Type: required
Message: [Field name] is required
```

**Minimum Value**:
```
Type: min
Message: [Field name] must be at least [value]
```

**Custom Validation**:
```
Type: custom
Message: [Custom validation message]
```

**Regex Pattern**:
```
Type: pattern
Message: [Pattern requirement description]
```

## Debugging Workflow

1. **Identify the Step**: Look at the step name in the log header
2. **Find the Field**: Look for the field name marked with 📍
3. **Read the Message**: Understand what validation failed
4. **Check the Type**: Understand which validation rule failed
5. **Fix the Issue**: Update the form data accordingly
6. **Resubmit**: Watch for success (✅) or new errors (❌)

## Production Considerations

In production builds, these console logs can be:
- Automatically stripped by build tools
- Wrapped in environment checks (`if (process.env.NODE_ENV === 'development')`)
- Sent to error tracking services instead of console
- Disabled via configuration

The current implementation logs to console in all environments, which is useful for development and staging but should be configured for production use.
