import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AreaInput from "./AreaInput";

export default function ResidentialApartmentFields({ control, index }) {
  const baseName = `configurations.${index}`;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name={`${baseName}.residentialDetails.bedrooms`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bedrooms</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${baseName}.residentialDetails.bathrooms`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bathrooms *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  max="15"
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${baseName}.residentialDetails.balconies`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Balconies</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Area Details */}
      <div className="space-y-3">
        <AreaInput
          control={control}
          name={`${baseName}.carpetArea`}
          label="Carpet Area"
          unitOptions={['Sq.ft', 'Sq.m', 'Sq.yd']}
        />

        <AreaInput
          control={control}
          name={`${baseName}.superBuiltUpArea`}
          label="Super Built-up Area *"
          unitOptions={['Sq.ft', 'Sq.m', 'Sq.yd']}
          required
        />
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`${baseName}.pricing.minPrice`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Price (₹)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  placeholder="50,00,000"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${baseName}.pricing.maxPrice`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Price (₹)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  placeholder="75,00,000"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`${baseName}.residentialDetails.facing`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facing</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select facing" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'].map((dir) => (
                    <SelectItem key={dir} value={dir}>
                      {dir}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${baseName}.residentialDetails.furnishing`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Furnishing</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                  <SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem>
                  <SelectItem value="Fully-Furnished">Fully-Furnished</SelectItem>
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
