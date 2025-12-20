import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import AreaInput from "./AreaInput";

export default function PlotFields({ control, index }) {
  const baseName = `configurations.${index}`;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`${baseName}.plotDetails.plotType`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plot Type *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plot type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Agricultural">Agricultural</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${baseName}.plotDetails.facing`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facing *</FormLabel>
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

      {/* Plot Area */}
      <AreaInput
        control={control}
        name={`${baseName}.plotArea`}
        label="Plot Area *"
        unitOptions={['Sq.ft', 'Sq.m', 'Sq.yd', 'Acres']}
        required
      />

      {/* Plot Dimensions */}
      <FormField
        control={control}
        name={`${baseName}.plotDetails.dimensions`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Plot Dimensions (Optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., 40x60 ft or 30x50 m"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
                  placeholder="25,00,000"
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
                  placeholder="50,00,000"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Plot Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`${baseName}.plotDetails.cornerPlot`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Corner Plot</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${baseName}.plotDetails.approvedForConstruction`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Approved for Construction</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
