import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import AreaInput from "./AreaInput";

export default function CommercialFields({ control, index }) {
  const baseName = `configurations.${index}`;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`${baseName}.commercialDetails.washrooms`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Washrooms</FormLabel>
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

        <FormField
          control={control}
          name={`${baseName}.commercialDetails.parking`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parking Spaces</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  max="200"
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
          unitOptions={['Sq.ft', 'Sq.m']}
        />

        <AreaInput
          control={control}
          name={`${baseName}.builtUpArea`}
          label="Built-up Area"
          unitOptions={['Sq.ft', 'Sq.m']}
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

      {/* Amenities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name={`${baseName}.commercialDetails.furnished`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Furnished</FormLabel>
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
          name={`${baseName}.commercialDetails.powerBackup`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Power Backup</FormLabel>
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
          name={`${baseName}.commercialDetails.airConditioned`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Air Conditioned</FormLabel>
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
