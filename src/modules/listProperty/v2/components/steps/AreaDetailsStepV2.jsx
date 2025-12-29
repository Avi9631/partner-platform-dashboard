import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Maximize, Plus, Trash2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
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
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import areaDetailsSchema from '../../../schemas/areaDetailsSchema';
import SaveAndContinueFooter from '../SaveAndContinueFooter';
import { createStepLogger } from '../../../utils/validationLogger';

export default function AreaDetailsV2() {
  const { saveAndContinue, previousStep, formData } = usePropertyFormV2();
  
  // Create logger instance (memoized to prevent recreation)
  const logger = useMemo(() => createStepLogger('Area Details Step'), []);
  
  // Initialize React Hook Form with Zod validation
  const form = useForm({
    resolver: zodResolver(areaDetailsSchema),
    mode: 'onChange',
    defaultValues: {
      carpetArea: formData?.carpetArea || '',
      superArea: formData?.superArea || '',
      measurementMethod: formData?.measurementMethod || '',
      areaConfig: formData?.areaConfig || [],
      builtUpToCarpetRatio: formData?.builtUpToCarpetRatio || undefined,
    },
  });

  const { control, setValue, formState, handleSubmit, watch } = form;
  
  // Watch carpet and super area for ratio calculation
  const carpetArea = watch('carpetArea');
  const superArea = watch('superArea');

  // Area configuration state (for additional/optional area types)
  const [areaConfig, setAreaConfig] = useState(formData?.areaConfig || []);

  // Update form when area config changes
  useEffect(() => {
    setValue('areaConfig', areaConfig);
  }, [areaConfig, setValue]);

  // Log validation errors when they change
  useEffect(() => {
    if (Object.keys(formState.errors).length > 0) {
      logger.logErrors(formState.errors);
    }
  }, [formState.errors, logger]);

  const updateAreaConfig = (index, field, value) => {
    const updated = [...areaConfig];
    updated[index][field] = value;
    setAreaConfig(updated);
  };

  const addAreaConfig = () => {
    setAreaConfig([...areaConfig, { type: '', value: '' }]);
  };

  const removeAreaConfig = (index) => {
    setAreaConfig(areaConfig.filter((_, i) => i !== index));
  };

  // Handle form submission
  const onSubmit = (data) => {
    const submitData = {
      ...data,
      areaConfig, // Include area config array
    };
    logger.logSubmission(submitData, formState.errors);
    saveAndContinue(submitData);
  };

  const onError = (errors) => {
    logger.logSubmission(form.getValues(), errors);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Area Details
        </h2>
        <p className="text-muted-foreground text-sm">
          Specify the area measurements of your property
        </p>
      </motion.div>

      <div className="pb-24">
        <FieldGroup>
          {/* Primary Required Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Carpet Area */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Controller
                name="carpetArea"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-2">
                      <Maximize className="w-4 h-4 text-orange-600" />
                      Carpet Area (sq.ft) <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      placeholder="e.g., 1200"
                      className={`h-11 text-sm border-2 focus:border-orange-500 transition-all ${
                        fieldState.invalid ? 'border-red-500' : ''
                      }`}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    {!fieldState.invalid && (
                      <FieldDescription>
                        Usable floor area excluding walls and common areas
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />
            </motion.div>

            {/* Super Area */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Controller
                name="superArea"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-2">
                      <Maximize className="w-4 h-4 text-orange-600" />
                      Super Area (sq.ft) <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      placeholder="e.g., 1500"
                      className={`h-11 text-sm border-2 focus:border-orange-500 transition-all ${
                        fieldState.invalid ? 'border-red-500' : ''
                      }`}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    {!fieldState.invalid && (
                      <FieldDescription>
                        Total area including walls and common areas
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />
            </motion.div>
          </div>

          {/* Measurement Method */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Controller
              name="measurementMethod"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="flex items-center gap-2">
                    Measurement Method <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select measurement method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rera_verified">RERA Verified</SelectItem>
                      <SelectItem value="self_measured">Self Measured</SelectItem>
                      <SelectItem value="architect_certified">Architect Certified</SelectItem>
                      <SelectItem value="builder_provided">Builder Provided</SelectItem>
                      <SelectItem value="not_verified">Not Verified</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  {!fieldState.invalid && (
                    <FieldDescription>
                      How was this measurement obtained?
                    </FieldDescription>
                  )}
                </Field>
              )}
            />
          </motion.div>

          {/* Built-up to Carpet Ratio Display */}
          {/* {carpetArea && superArea && Number(carpetArea) > 0 && Number(superArea) > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
            >
              <p className="text-sm text-green-900 dark:text-green-100">
                <span className="font-semibold">📊 Area Ratio:</span> Super to Carpet ratio is{' '}
                <span className="font-bold">{(Number(superArea) / Number(carpetArea)).toFixed(2)}</span>
                {' '}(Super area is {((Number(superArea) / Number(carpetArea) - 1) * 100).toFixed(1)}% more than carpet area)
              </p>
            </motion.div>
          )} */}

          {/* Divider */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Additional Area Details (Optional)</h3>
          </div>

          {/* Dynamic Area Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FieldLabel className="font-semibold">Other Area Types</FieldLabel>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addAreaConfig}
                className="h-8 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Area Type
              </Button>
            </div>

            {areaConfig.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No additional area types added. Click &quot;Add Area Type&quot; to include terrace, garden, balcony, etc.
              </p>
            )}

            {areaConfig.map((config, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-12 gap-3 items-end p-4 rounded-lg border bg-muted/30"
              >
                <div className="col-span-5">
                  <Field>
                    <FieldLabel className="text-xs">Area Type</FieldLabel>
                    <Select
                      value={config.type}
                      onValueChange={(value) => updateAreaConfig(index, 'type', value)}
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="built_up">Built-up Area</SelectItem>
                        <SelectItem value="plot">Plot Area</SelectItem>
                        <SelectItem value="terrace">Terrace Area</SelectItem>
                        <SelectItem value="balcony">Balcony Area</SelectItem>
                        <SelectItem value="garden">Garden Area</SelectItem>
                        <SelectItem value="parking">Parking Area</SelectItem>
                        <SelectItem value="common">Common Area</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <div className="col-span-5">
                  <Field>
                    <FieldLabel className="text-xs">Value (sq.ft)</FieldLabel>
                    <Input
                      type="number"
                      min="1"
                      placeholder="e.g., 200"
                      value={config.value}
                      onChange={(e) => updateAreaConfig(index, 'value', e.target.value)}
                      className="h-9 text-sm"
                    />
                  </Field>
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeAreaConfig(index)}
                    className="h-9 w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}

            {areaConfig.length > 0 && (
              <FieldDescription>
                Add multiple area types for comprehensive property details
              </FieldDescription>
            )}
          </div>

          {/* Info Box */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
          >
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <span className="font-semibold">💡 Tip:</span> Super area is typically 20-30% more than carpet area due to common spaces and walls.
            </p>
          </motion.div> */}
        </FieldGroup>
      </div>

      <SaveAndContinueFooter
        onBack={previousStep}
        onSaveAndContinue={handleSubmit(onSubmit, onError)}
        nextDisabled={!formState.isValid}
        showBack={true}
      />
    </div>
  );
}
