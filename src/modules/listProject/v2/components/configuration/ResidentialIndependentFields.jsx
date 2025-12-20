import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AreaInput from "./AreaInput";

export default function ResidentialIndependentFields({ control, index }) {
  const baseName = `configurations.${index}`;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name={`${baseName}.independentDetails.bedrooms`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bedrooms *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="15"
                  placeholder="3"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${baseName}.independentDetails.bathrooms`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bathrooms *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  placeholder="2"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${baseName}.independentDetails.floors`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Floors *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="2"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Parking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`${baseName}.independentDetails.parking.covered`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Covered Parking</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  max="20"
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
          name={`${baseName}.independentDetails.parking.open`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Open Parking</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  max="50"
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
          name={`${baseName}.plotArea`}
          label="Plot Area *"
          unitOptions={['Sq.ft', 'Sq.m', 'Sq.yd']}
          required
        />

        <AreaInput
          control={control}
          name={`${baseName}.builtUpArea`}
          label="Built-up Area *"
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
                  placeholder="1,00,00,000"
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
                  placeholder="2,00,00,000"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Facing */}
      <FormField
        control={control}
        name={`${baseName}.independentDetails.facing`}
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
    </div>
  );
}
