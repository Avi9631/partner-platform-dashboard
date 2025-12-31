import { useState, useEffect, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { Bed, Bath, Plus, Trash2, Maximize } from 'lucide-react';
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
import basicConfigurationSchema from '../../../schemas/basicConfigurationSchema';

export default function BasicConfigurationV2() {
  const { saveAndContinue, previousStep, formData, setCurrentStepSubmitHandler } = usePropertyFormV2();
  
  // Area configuration state (for additional/optional area types)
  const [areaConfig, setAreaConfig] = useState(formData?.areaConfig || []);
  
  // Initialize React Hook Form with Zod validation
  const form = useForm({
    resolver: zodResolver(basicConfigurationSchema),
    mode: 'onChange',
    defaultValues: {
      bedrooms: formData?.bedrooms || '',
      bathrooms: formData?.bathrooms || '',
      carpetArea: formData?.carpetArea || '',
      superArea: formData?.superArea || '',
      measurementMethod: formData?.measurementMethod || '',
      areaConfig: formData?.areaConfig || [],
      builtUpToCarpetRatio: formData?.builtUpToCarpetRatio || undefined,
     },
  });

  const { control, watch, setValue, handleSubmit, formState } = form;
  
  // Update form when area config changes
  useEffect(() => {
    setValue('areaConfig', areaConfig);
  }, [areaConfig, setValue]);
  
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

  const onSubmit = useCallback((data) => {
    saveAndContinue(data);
  }, [saveAndContinue]);

  // Register submit handler with context
  useEffect(() => {
    setCurrentStepSubmitHandler(() => form.handleSubmit(onSubmit));
    return () => setCurrentStepSubmitHandler(null);
  }, [form, onSubmit, setCurrentStepSubmitHandler]);

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
          Basic Configuration
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Define the basic room configuration of your property
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
          {/* Bedrooms, Bathrooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bedrooms */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Controller
                name="bedrooms"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-2">
                      <Bed className="w-4 h-4 text-orange-600" />
                      Bedrooms <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={`h-10 text-sm border-2 focus:border-orange-500 ${
                        fieldState.invalid ? 'border-red-500' : ''
                      }`}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, '6+'].map((num) => (
                          <SelectItem key={num} value={String(num)}>
                            {num} {num === '6+' ? '' : num === 1 ? 'Bedroom' : 'Bedrooms'}
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
            </motion.div>

            {/* Bathrooms */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Controller
                name="bathrooms"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-2">
                      <Bath className="w-4 h-4 text-orange-600" />
                      Bathrooms <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={`h-10 text-sm border-2 focus:border-orange-500 ${
                        fieldState.invalid ? 'border-red-500' : ''
                      }`}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, '6+'].map((num) => (
                          <SelectItem key={num} value={String(num)}>
                            {num} {num === '6+' ? '' : num === 1 ? 'Bathroom' : 'Bathrooms'}
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
            </motion.div>
          </div>

          {/* Area Details Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Carpet Area */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
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
                      className={`h-10 text-sm border-2 focus:border-orange-500 transition-all ${
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
              transition={{ delay: 0.5 }}
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
                      className={`h-10 text-sm border-2 focus:border-orange-500 transition-all ${
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
            transition={{ delay: 0.6 }}
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
                    <SelectTrigger className="h-10">
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

          {/* Dynamic Area Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FieldLabel className="font-semibold">Room Area </FieldLabel>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addAreaConfig}
                className="h-8 text-xs border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Area Type
              </Button>
            </div>

            {areaConfig.length === 0 && (
              <p className="text-sm text-muted-foreground italic py-2 px-3 border-2 border-dashed rounded-md">
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
        </FieldGroup>
      </form>
      </motion.div>
    </div>
  );
}


