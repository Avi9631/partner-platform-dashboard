import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Maximize, Plus, Trash2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
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
import { useFormContext } from 'react-hook-form';
import { usePropertyForm } from '../context/PropertyFormContext';
import areaDetailsSchema from '../schemas/areaDetailsSchema';
import FormButtonFooter from './shared/FormButtonFooter';

export default function AreaDetails({ isSheetMode = false }) {
  const { nextStep, previousStep, updateStepValidation, setOpenSection } = usePropertyForm();
  const formMethods = useFormContext();

  // Initialize React Hook Form with Zod validation
  const form = useForm({
    resolver: zodResolver(areaDetailsSchema),
    mode: 'onChange',
    defaultValues: {
      carpetArea: formMethods.watch('carpetArea') || '',
      superArea: formMethods.watch('superArea') || '',
      areaConfig: formMethods.watch('areaConfig') || [
        { type: 'carpet', value: '' },
        { type: 'super', value: '' },
        { type: 'built_up', value: '' },
      ],
    },
  });

  // Area configuration state (for repeater)
  const [areaConfig, setAreaConfig] = useState(form.watch('areaConfig'));

  // Update form when area config changes
  useEffect(() => {
    form.setValue('areaConfig', areaConfig);
  }, [areaConfig, form]);

  // Update step validation when form validity changes
  useEffect(() => {
    updateStepValidation(2, form.formState.isValid);
  }, [form.formState.isValid, updateStepValidation]);

  // Handle form submission
  const onSubmit = (data) => {
    // Update the main form context
    Object.keys(data).forEach((key) => {
      formMethods.setValue(key, data[key]);
    });
    
    if (isSheetMode) {
      setOpenSection(null);
    } else {
      nextStep();
    }
  };

  const updateAreaConfig = (index, field, value) => {
    const updated = [...areaConfig];
    updated[index][field] = value;
    setAreaConfig(updated);
  };

  const addAreaConfig = () => {
    setAreaConfig([...areaConfig, { type: 'carpet', value: '' }]);
  };

  const removeAreaConfig = (index) => {
    if (areaConfig.length > 1) {
      setAreaConfig(areaConfig.filter((_, i) => i !== index));
    }
  };

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
          Area Details
        </h2>
        <p className="text-muted-foreground text-sm">
          Specify the area measurements of your property
        </p>
      </motion.div>

      <div className=" ">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            {/* Area Configuration (Repeater) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FieldLabel className="font-semibold">Area Configuration</FieldLabel>
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

            {areaConfig.map((config, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-12 gap-3 items-end"
              >
                <div className="col-span-5">
                  <Field>
                    <FieldLabel className="text-xs">Area Type</FieldLabel>
                    <Select
                      value={config.type}
                      onValueChange={(value) => updateAreaConfig(index, 'type', value)}
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="carpet">Carpet Area</SelectItem>
                        <SelectItem value="super">Super Area</SelectItem>
                        <SelectItem value="built_up">Built-up Area</SelectItem>
                        <SelectItem value="plot">Plot Area</SelectItem>
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
                      placeholder="e.g., 1200"
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
                    disabled={areaConfig.length === 1}
                    className="h-9 w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}

            <FieldDescription>
              Add multiple area measurements for better clarity (Carpet, Super, Built-up, Plot)
            </FieldDescription>
          </div>

          {/* Primary Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Carpet Area */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Controller
                name="carpetArea"
                control={form.control}
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
              transition={{ delay: 0.3 }}
            >
              <Controller
                name="superArea"
                control={form.control}
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

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
          >
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <span className="font-semibold">💡 Tip:</span> Super area is typically 20-30% more than carpet area due to common spaces and walls.
            </p>
          </motion.div>
          </FieldGroup>
        </form>
      </div>

      {/* Fixed Button Footer */}
      <FormButtonFooter
        onBack={previousStep}
        onNext={form.handleSubmit(onSubmit)}
        onCancel={() => setOpenSection(null)}
        nextLabel={isSheetMode ? 'Save' : 'Continue'}
        nextDisabled={!form.formState.isValid}
        showBack={true}
        isSheetMode={isSheetMode}
      />
    </div>
  );
}
