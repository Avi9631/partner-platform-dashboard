import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

/**
 * Reusable component for area input with min, max, and unit fields
 */
export default function AreaInput({ control, name, label, unitOptions = ['Sq.ft', 'Sq.m', 'Sq.yd'], required = false }) {
  return (
    <div className="space-y-3">
      <FormLabel className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </FormLabel>
      <div className="grid grid-cols-3 gap-3">
        {/* Min Area */}
        <FormField
          control={control}
          name={`${name}.min`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-gray-600">Min</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Max Area */}
        <FormField
          control={control}
          name={`${name}.max`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-gray-600">Max</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Unit Selection */}
        <FormField
          control={control}
          name={`${name}.unit`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-gray-600">Unit</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {unitOptions.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
