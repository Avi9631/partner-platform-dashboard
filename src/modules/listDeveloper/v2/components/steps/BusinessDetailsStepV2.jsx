import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { FileText, CreditCard, Calendar, Plus, X, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { useDeveloperFormV2 } from '../../context/DeveloperFormContextV2';
import businessDetailsSchema from '../../../schemas/businessDetailsSchema';
import SaveAndContinueFooter from '../SaveAndContinueFooter';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export default function BusinessDetailsStepV2() {
  const { saveAndContinue, previousStep, formData } = useDeveloperFormV2();

  const form = useForm({
    resolver: zodResolver(businessDetailsSchema),
    mode: 'onChange',
    defaultValues: {
      registrationNumber: formData?.registrationNumber || '',
      panNumber: formData?.panNumber || '',
      gstNumber: formData?.gstNumber || '',
      incorporationDate: formData?.incorporationDate || '',
      reraRegistrations: formData?.reraRegistrations || [{ state: '', reraNumber: '', validUpto: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'reraRegistrations',
  });

  const onSubmit = (data) => {
    saveAndContinue(data);
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
          Business & Registration Details
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Provide legal registration and compliance information
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            {/* Registration Number & Incorporation Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Controller
                  name="registrationNumber"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-orange-600" />
                        Company Registration Number <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="e.g., U45200MH2010PTC123456"
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Controller
                  name="incorporationDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        Incorporation Date <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        type="date"
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
              </motion.div>
            </div>

            {/* PAN & GST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Controller
                  name="panNumber"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-orange-600" />
                        PAN Number <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="e.g., ABCDE1234F"
                        maxLength={10}
                        style={{ textTransform: 'uppercase' }}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Controller
                  name="gstNumber"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        GST Number <span className="text-xs text-muted-foreground">(Optional)</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="e.g., 22ABCDE1234F1Z5"
                        maxLength={15}
                        style={{ textTransform: 'uppercase' }}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
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
              </motion.div>
            </div>

            {/* RERA Registrations */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FieldLabel className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-orange-600" />
                    RERA Registrations <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ state: '', reraNumber: '', validUpto: '' })}
                    className="h-8 text-xs border-orange-500 text-orange-600 hover:bg-orange-50"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add RERA
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 border-2 border-orange-100 rounded-lg bg-orange-50/30 dark:bg-orange-950/10 dark:border-orange-900"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-sm">RERA Registration #{index + 1}</h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Controller
                          name={`reraRegistrations.${index}.state`}
                          control={form.control}
                          render={({ field: stateField, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs">State *</FieldLabel>
                              <Select
                                value={stateField.value}
                                onValueChange={stateField.onChange}
                              >
                                <SelectTrigger className={`h-9 text-xs border-2 ${
                                  fieldState.invalid ? 'border-red-500' : ''
                                }`}>
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                  {indianStates.map((state) => (
                                    <SelectItem key={state} value={state} className="text-xs">
                                      {state}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {fieldState.invalid && (
                                <p className="text-xs text-red-500 mt-1">{fieldState.error?.message}</p>
                              )}
                            </Field>
                          )}
                        />

                        <Controller
                          name={`reraRegistrations.${index}.reraNumber`}
                          control={form.control}
                          render={({ field: reraField, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs">RERA Number *</FieldLabel>
                              <Input
                                {...reraField}
                                placeholder="e.g., RA12345678"
                                className={`h-9 text-xs border-2 focus:border-orange-500 ${
                                  fieldState.invalid ? 'border-red-500' : ''
                                }`}
                              />
                              {fieldState.invalid && (
                                <p className="text-xs text-red-500 mt-1">{fieldState.error?.message}</p>
                              )}
                            </Field>
                          )}
                        />

                        <Controller
                          name={`reraRegistrations.${index}.validUpto`}
                          control={form.control}
                          render={({ field: dateField, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs">Valid Upto *</FieldLabel>
                              <Input
                                {...dateField}
                                type="date"
                                className={`h-9 text-xs border-2 focus:border-orange-500 ${
                                  fieldState.invalid ? 'border-red-500' : ''
                                }`}
                              />
                              {fieldState.invalid && (
                                <p className="text-xs text-red-500 mt-1">{fieldState.error?.message}</p>
                              )}
                            </Field>
                          )}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </FieldGroup>

          {/* Save & Continue Footer */}
          <SaveAndContinueFooter
            onBack={previousStep}
            nextDisabled={!form.formState.isValid}
            showBack={true}
          />
        </form>
      </motion.div>
    </div>
  );
}
