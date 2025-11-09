import { Controller, useFormContext } from 'react-hook-form';
import { motion } from 'motion/react';
import { Ruler, Fence, Droplets, Map, Mountain } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import SaveAndContinueFooter from '../SaveAndContinueFooter';

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

export default function LandAttributesStepV2() {
  const { register, control, watch, formState: { errors } } = useFormContext();
  const { saveAndContinue, previousStep } = usePropertyFormV2();

  const plotArea = watch('plotArea');
  const areaUnit = watch('areaUnit');
  
  const isValid = !!plotArea && !!areaUnit;

  const handleContinue = () => {
    if (isValid) {
      saveAndContinue();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 md:mb-6"
      >
        <h2 className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Land Specifications
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Provide detailed information about your land/plot
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4 pb-20"
      >
        {/* Plot Area & Dimensions */}
        <div className="space-y-3 p-4 rounded-lg border border-orange-100 dark:border-orange-900 bg-white dark:bg-gray-900">
          <h3 className="text-base font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
            <Ruler className="w-4 h-4" />
            Plot Dimensions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {/* Plot Area */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Plot Area <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter area"
                {...register('plotArea', { required: 'Plot area is required' })}
                className={`h-10 ${errors.plotArea ? 'border-red-500' : ''}`}
              />
              {errors.plotArea && (
                <p className="text-sm text-red-500">{errors.plotArea.message}</p>
              )}
            </div>

            {/* Area Unit */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Unit <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="areaUnit"
                control={control}
                rules={{ required: 'Unit is required' }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className={`h-10 ${errors.areaUnit ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select unit" />
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
                <p className="text-sm text-red-500">{errors.areaUnit.message}</p>
              )}
            </div>
          </div>

          {/* Plot Dimension */}
          <div className="space-y-2">
            <Label htmlFor="plotDimension" className="text-sm font-medium">
              Plot Dimensions (Length x Width)
            </Label>
            <Input
              id="plotDimension"
              type="text"
              placeholder="e.g., 50 x 40 feet"
              {...register('plotDimension')}
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">Optional: Enter dimensions if known</p>
          </div>
        </div>

        {/* Land Use & Classification */}
        <div className="space-y-3 p-4 rounded-lg border border-orange-100 dark:border-orange-900 bg-white dark:bg-gray-900">
          <h3 className="text-base font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
            <Map className="w-4 h-4" />
            Land Use & Classification
          </h3>
          
          {/* Land Use */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Land Use Type</Label>
            <Controller
              name="landUse"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                  {landUseOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      className={`p-3 md:p-4 rounded-lg border-2 transition-all ${
                        field.value === option.value
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 shadow-md'
                          : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
                      }`}
                    >
                      <div className="text-xl md:text-2xl mb-1">{option.icon}</div>
                      <div className="text-xs md:text-sm font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Road Width */}
          <div className="space-y-2">
            <Label htmlFor="roadWidth" className="text-sm font-medium">
              Road Width (feet)
            </Label>
            <Input
              id="roadWidth"
              type="number"
              min="0"
              placeholder="Enter road width"
              {...register('roadWidth')}
              className="h-10"
            />
          </div>
        </div>

        {/* Terrain & Soil */}
        <div className="space-y-3 p-4 rounded-lg border border-orange-100 dark:border-orange-900 bg-white dark:bg-gray-900">
          <h3 className="text-base font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
            <Mountain className="w-4 h-4" />
            Terrain & Soil Information
          </h3>
          
          {/* Terrain Level */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Terrain Level</Label>
            <Controller
              name="terrainLevel"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                  {terrainLevels.map((terrain) => (
                    <button
                      key={terrain.value}
                      type="button"
                      onClick={() => field.onChange(terrain.value)}
                      className={`p-2 md:p-3 rounded-lg border-2 transition-all ${
                        field.value === terrain.value
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                      }`}
                    >
                      <div className="text-lg md:text-xl mb-1">{terrain.icon}</div>
                      <div className="text-xs md:text-sm font-medium">{terrain.label}</div>
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Soil Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Soil Type</Label>
            <Controller
              name="soilType"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                  {soilTypes.map((soil) => (
                    <button
                      key={soil.value}
                      type="button"
                      onClick={() => field.onChange(soil.value)}
                      className={`p-2 md:p-3 rounded-lg border-2 transition-all ${
                        field.value === soil.value
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                      }`}
                    >
                      <div className="text-lg md:text-xl mb-1">{soil.icon}</div>
                      <div className="text-xs font-medium truncate">{soil.label}</div>
                    </button>
                  ))}
                </div>
              )}
            />
          </div>
        </div>

        {/* Infrastructure */}
        <div className="space-y-3 p-4 rounded-lg border border-orange-100 dark:border-orange-900 bg-white dark:bg-gray-900">
          <h3 className="text-base font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
            <Fence className="w-4 h-4" />
            Infrastructure & Utilities
          </h3>
          
          {/* Fencing */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
            <div>
              <Label className="text-sm font-medium">Fencing Available</Label>
              <p className="text-xs text-muted-foreground">Is the plot fenced?</p>
            </div>
            <Controller
              name="fencing"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {/* Irrigation Source */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Droplets className="w-4 h-4" />
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
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select irrigation source" />
                  </SelectTrigger>
                  <SelectContent>
                    {irrigationSources.map((source) => (
                      <SelectItem key={source} value={source.toLowerCase().replace(/\s+/g, '_')}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </motion.div>

      <SaveAndContinueFooter
        onBack={previousStep}
        onSaveAndContinue={handleContinue}
        nextDisabled={!isValid}
        showBack={true}
      />
    </div>
  );
}
