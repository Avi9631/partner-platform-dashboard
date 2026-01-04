import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Ruler, Fence, Droplets, Map, Mountain } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';

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
  const { saveAndContinue, previousStep, formData, setCurrentStepSubmitHandler, setCurrentStepIsValid } = usePropertyFormV2();

  const form = useForm({
    mode: 'onChange',
    defaultValues: {
      plotArea: formData?.plotArea || '',
      areaUnit: formData?.areaUnit || 'sqft',
      plotDimension: formData?.plotDimension || '',
      landUse: formData?.landUse || '',
      roadWidth: formData?.roadWidth || '',
      terrainLevel: formData?.terrainLevel || '',
      soilType: formData?.soilType || '',
      fencing: formData?.fencing || false,
      irrigationSource: formData?.irrigationSource || '',
    },
  });

  const { control } = form;

  const plotArea = form.watch('plotArea');
  const areaUnit = form.watch('areaUnit');
  
  const isValid = !!plotArea && !!areaUnit;

  const handleSubmit = (data) => {
    saveAndContinue(data);
  };

  // Register submit handler with context
  useEffect(() => {
    setCurrentStepSubmitHandler(() => form.handleSubmit(handleSubmit));
    return () => setCurrentStepSubmitHandler(null);
  }, [form, handleSubmit, setCurrentStepSubmitHandler]);

  // Track validation state
  useEffect(() => {
    setCurrentStepIsValid(form.formState.isValid);
  }, [form.formState.isValid, setCurrentStepIsValid]);

  return (
    <div className="w-full max-w-7xl mx-auto">
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

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FieldGroup>
            {/* Plot Area */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="plotArea"
                  control={control}
                  rules={{ required: 'Plot area is required' }}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-orange-600" />
                        Plot Area <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter area"
                        className={`h-10 text-sm border-2 focus:border-orange-500 transition-all ${
                          fieldState.invalid ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="areaUnit"
                  control={control}
                  rules={{ required: 'Unit is required' }}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Unit <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className={`h-10 text-sm border-2 ${
                          fieldState.invalid ? 'border-red-500' : ''
                        }`}>
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
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </motion.div>

            {/* Plot Dimension */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Controller
                name="plotDimension"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Plot Dimensions (Length x Width)
                    </FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      placeholder="e.g., 50 x 40 feet"
                      className="h-10 text-sm border-2 focus:border-orange-500 transition-all"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Optional: Enter dimensions if known</p>
                  </Field>
                )}
              />
            </motion.div>

            {/* Land Use */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Controller
                name="landUse"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="flex items-center gap-2">
                      <Map className="w-4 h-4 text-orange-600" />
                      Land Use Type
                    </FieldLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {landUseOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                            field.value === option.value
                              ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 shadow-md'
                              : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
                          }`}
                        >
                          <div className="text-2xl mb-1">{option.icon}</div>
                          <div className="text-sm font-medium">{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </Field>
                )}
              />
            </motion.div>

            {/* Road Width */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Controller
                name="roadWidth"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Road Width (feet)
                    </FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      placeholder="Enter road width"
                      className="h-10 text-sm border-2 focus:border-orange-500 transition-all"
                    />
                  </Field>
                )}
              />
            </motion.div>

            {/* Terrain Level */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Controller
                name="terrainLevel"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="flex items-center gap-2">
                      <Mountain className="w-4 h-4 text-orange-600" />
                      Terrain Level
                    </FieldLabel>
                    <div className="grid grid-cols-3 gap-3">
                      {terrainLevels.map((terrain) => (
                        <button
                          key={terrain.value}
                          type="button"
                          onClick={() => field.onChange(terrain.value)}
                          className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                            field.value === terrain.value
                              ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 shadow-md'
                              : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                          }`}
                        >
                          <div className="text-xl mb-1">{terrain.icon}</div>
                          <div className="text-sm font-medium">{terrain.label}</div>
                        </button>
                      ))}
                    </div>
                  </Field>
                )}
              />
            </motion.div>

            {/* Soil Type */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Controller
                name="soilType"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>
                      Soil Type
                    </FieldLabel>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                      {soilTypes.map((soil) => (
                        <button
                          key={soil.value}
                          type="button"
                          onClick={() => field.onChange(soil.value)}
                          className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                            field.value === soil.value
                              ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 shadow-md'
                              : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                          }`}
                        >
                          <div className="text-xl mb-1">{soil.icon}</div>
                          <div className="text-xs font-medium">{soil.label}</div>
                        </button>
                      ))}
                    </div>
                  </Field>
                )}
              />
            </motion.div>

            {/* Fencing */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center justify-between p-4 rounded-lg border-2 border-orange-100 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/20">
                <div>
                  <FieldLabel className="flex items-center gap-2">
                    <Fence className="w-4 h-4 text-orange-600" />
                    Fencing Available
                  </FieldLabel>
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
            </motion.div>

            {/* Irrigation Source */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Controller
                name="irrigationSource"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-orange-600" />
                      Irrigation Source
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-10 text-sm border-2">
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
                  </Field>
                )}
              />
            </motion.div>
          </FieldGroup>
        </form>
      </motion.div>
    </div>
  );
}


