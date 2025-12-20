import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import AreaInput from "./AreaInput";

export default function FarmFields({ control, index }) {
  const baseName = `configurations.${index}`;

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`${baseName}.farmDetails.farmType`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Farm Type *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select farm type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Agricultural">Agricultural</SelectItem>
                <SelectItem value="Recreational">Recreational</SelectItem>
                <SelectItem value="Mixed Use">Mixed Use</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Farm Area */}
      <AreaInput
        control={control}
        name={`${baseName}.plotArea`}
        label="Farm Area *"
        unitOptions={['Acres', 'Hectares', 'Sq.ft', 'Sq.m']}
        required
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
                  placeholder="1,00,00,000"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Farm Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`${baseName}.farmDetails.waterSource`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Water Source</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select water source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Borewell">Borewell</SelectItem>
                  <SelectItem value="River">River</SelectItem>
                  <SelectItem value="Canal">Canal</SelectItem>
                  <SelectItem value="Lake">Lake</SelectItem>
                  <SelectItem value="Municipal">Municipal</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${baseName}.farmDetails.electricityAvailable`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Electricity Available</FormLabel>
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

      {/* Farmhouse */}
      <FormField
        control={control}
        name={`${baseName}.farmDetails.farmhouseIncluded`}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel>Farmhouse Included</FormLabel>
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
  );
}
