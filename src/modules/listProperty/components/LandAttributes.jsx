import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { motion } from 'motion/react';
import { Ruler, Fence, Droplets, Map } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { usePropertyForm } from '../context/PropertyFormContext';

const areaUnits = [
  { value: 'sqft', label: 'Square Feet' },
  { value: 'sqm', label: 'Square Meters' },
  { value: 'acre', label: 'Acre' },
  { value: 'bigha', label: 'Bigha' },
  { value: 'kanal', label: 'Kanal' },
  { value: 'gaj', label: 'Gaj' },
];

const landUseOptions = [
  { value: 'residential', label: 'Residential', icon: '🏡' },
  { value: 'commercial', label: 'Commercial', icon: '🏢' },
  { value: 'agricultural', label: 'Agricultural', icon: '🌾' },
  { value: 'industrial', label: 'Industrial', icon: '🏭' },
];

const irrigationSources = [
  'Borewell',
  'Canal',
  'River',
  'Well',
  'Drip Irrigation',
  'No Irrigation',
];

const terrainLevels = [
  { value: 'flat', label: 'Flat', icon: '📏' },
  { value: 'elevated', label: 'Elevated', icon: '⛰️' },
  { value: 'sloped', label: 'Sloped', icon: '📐' },
];

const soilTypes = [
  { value: 'black', label: 'Black Soil', icon: '⚫' },
  { value: 'red', label: 'Red Soil', icon: '🔴' },
  { value: 'sandy', label: 'Sandy Soil', icon: '🟡' },
  { value: 'clay', label: 'Clay Soil', icon: '🟤' },
  { value: 'loamy', label: 'Loamy Soil', icon: '🟢' },
];

export default function LandAttributes() {
  const { nextStep, previousStep, updateStepValidation, propertyType } = usePropertyForm();
  const { register, control, watch, setValue, formState: { errors, isValid } } = useFormContext();

  // Update step validation when form validity changes
  useEffect(() => {
    updateStepValidation(2, isValid);
  }, [isValid, updateStepValidation]);

  return (
    <div className="w-full ">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Land Specifications
        </h2>
        <p className="text-muted-foreground text-sm">
          Provide detailed information about your land/plot
        </p>
      </motion.div>

      <div className=" ">
        <div className="space-y-6">
        {/* Plot Area & Dimensions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
            <Ruler className="w-5 h-5" />
            Plot Dimensions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Plot Area */}
            <div className="space-y-1.5">
              <Label className="text-sm">
                Plot Area <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min="0"
                placeholder="Enter area"
                {...register('plotArea')}
                className={`h-9 text-sm focus:border-primary transition-all ${
                  errors.plotArea ? 'border-red-500' : ''
                }`}
              />
              {errors.plotArea && (
                <p className="text-sm text-red-500 mt-1">{errors.plotArea.message}</p>
              )}
            </div>

            {/* Area Unit */}
            <div className="space-y-1.5">
              <Label className="text-sm">
                Unit <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="areaUnit"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className={`h-9 text-sm ${
                      errors.areaUnit ? 'border-red-500' : ''
                    }`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {areaUnits.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.areaUnit && (
                <p className="text-sm text-red-500 mt-1">{errors.areaUnit.message}</p>
              )}
            </div>
          </div>

          {/* Plot Dimension */}
          <div className="space-y-1.5">
            <Label htmlFor="plotDimension" className="text-sm">
              Plot Dimensions (Length x Width)
            </Label>
            <Input
              id="plotDimension"
              placeholder="e.g., 30 x 40 ft or 50 x 80 m"
              {...register('plotDimension')}
              className="h-9 text-sm focus:border-primary transition-all"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter dimensions if available (optional)
            </p>
          </div>

          {/* Road Width */}
          <div className="space-y-1.5">
            <Label htmlFor="roadWidth" className="text-sm flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5 text-primary" />
              Adjacent Road Width (in feet)
            </Label>
            <Input
              id="roadWidth"
              type="number"
              min="0"
              placeholder="e.g., 20"
              {...register('roadWidth')}
              className={`h-9 text-sm focus:border-primary transition-all ${
                errors.roadWidth ? 'border-red-500' : ''
              }`}
            />
            {errors.roadWidth && (
              <p className="text-sm text-red-500 mt-1">{errors.roadWidth.message}</p>
            )}
          </div>
        </div>

        {/* Land Use */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-400">Land Use Classification</h3>
          <div className="space-y-2">
            <Label className="text-sm">
              Primary Use <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {landUseOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setValue('landUse', option.value, { shouldValidate: true })}
                  className={`p-3 border rounded text-xs font-medium transition-all flex flex-col items-center gap-1.5 ${
                    watch('landUse') === option.value
                      ? 'border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400 scale-105'
                      : 'border-muted hover:border-orange-500/50 hover:scale-105'
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
            {errors.landUse && (
              <p className="text-sm text-red-500 mt-1">{errors.landUse.message}</p>
            )}
          </div>
        </div>

        {/* Additional Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-400">Additional Features</h3>
          
          {/* Terrain Level */}
          <div className="space-y-2">
            <Label className="text-sm">Terrain Level</Label>
            <div className="grid grid-cols-3 gap-2">
              {terrainLevels.map((terrain) => (
                <button
                  key={terrain.value}
                  type="button"
                  onClick={() => setValue('terrainLevel', terrain.value, { shouldValidate: true })}
                  className={`p-3 border rounded text-xs font-medium transition-all flex flex-col items-center gap-1.5 ${
                    watch('terrainLevel') === terrain.value
                      ? 'border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400 scale-105'
                      : 'border-muted hover:border-orange-500/50 hover:scale-105'
                  }`}
                >
                  <span className="text-2xl">{terrain.icon}</span>
                  <span>{terrain.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Soil Type (for agricultural) */}
          {['agricultural', 'farmhouse'].includes(propertyType) && (
            <div className="space-y-2">
              <Label className="text-sm">Soil Type</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {soilTypes.map((soil) => (
                  <button
                    key={soil.value}
                    type="button"
                    onClick={() => setValue('soilType', soil.value, { shouldValidate: true })}
                    className={`p-3 border rounded text-xs font-medium transition-all flex items-center gap-2 ${
                      watch('soilType') === soil.value
                        ? 'border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400 scale-105'
                        : 'border-muted hover:border-orange-500/50 hover:scale-105'
                    }`}
                  >
                    <span className="text-xl">{soil.icon}</span>
                    <span>{soil.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Fencing */}
          <div className="flex items-center justify-between p-3 border rounded hover:border-orange-500 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Fence className="w-5 h-5 text-white" />
              </div>
              <div>
                <Label className="text-sm font-semibold">Fenced Property</Label>
                <p className="text-xs text-muted-foreground">
                  Is the property boundary fenced?
                </p>
              </div>
            </div>
            <Switch
              checked={watch('fencing')}
              onCheckedChange={(checked) => setValue('fencing', checked, { shouldValidate: true })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {/* Irrigation Source (for agricultural land) */}
          {['agricultural', 'farmhouse'].includes(propertyType) && (
            <div className="space-y-1.5">
              <Label className="text-sm flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-primary" />
                Irrigation Source
              </Label>
              <Controller
                name="irrigationSource"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Select irrigation source" />
                    </SelectTrigger>
                    <SelectContent>
                      {irrigationSources.map((source) => (
                        <SelectItem key={source} value={source.toLowerCase().replace(' ', '_')}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex gap-2">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-0.5">
                Pro Tip
              </h4>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Accurate plot dimensions and clear land use classification help buyers
                understand your property better and can lead to faster sales.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 pt-6 border-t border-orange-200 dark:border-orange-900">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={previousStep}
            className="px-6 border-orange-200 hover:bg-orange-50 hover:border-orange-500 dark:border-orange-800 dark:hover:bg-orange-950/30"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
            Back
          </Button>
          <Button
            size="default"
            onClick={nextStep}
            disabled={!isValid}
            className="px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30"
          >
            Continue
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}
