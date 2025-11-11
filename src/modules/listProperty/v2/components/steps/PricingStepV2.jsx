import { useForm, FormProvider, Controller, useFieldArray } from 'react-hook-form';
import { motion } from 'motion/react';
import { DollarSign, Calendar, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import SaveAndContinueFooter from '../SaveAndContinueFooter';

export default function PricingStepV2() {
  const { saveAndContinue, previousStep, formData } = usePropertyFormV2();

  // Create local form with defaults from context
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      listingType: formData?.listingType || 'sale',
      pricing: formData?.pricing || [{ type: 'asking_price', value: '', unit: 'total' }],
      isPriceNegotiable: formData?.isPriceNegotiable || false,
      availableFrom: formData?.availableFrom || '',
    },
  });

  const { control, watch } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'pricing',
  });

  const listingType = watch('listingType');
  const pricing = watch('pricing');
  
  const isValid = !!(listingType && pricing && pricing.length > 0 && pricing[0].value);

  const handleContinue = () => {
    if (isValid) {
      const data = methods.getValues();
      saveAndContinue(data);
    }
  };

  // Helper function to get pricing type options based on listing type
  const getPricingTypeOptions = () => {
    const baseOptions = [
      { value: 'brokerage_fee', label: 'Brokerage Fee' },
    ];

    if (listingType === 'sale') {
      return [
        { value: 'asking_price', label: 'Asking Price' },
        ...baseOptions,
      ];
    }

    if (listingType === 'rent') {
      return [
        { value: 'monthly_rent', label: 'Monthly Rent' },
        { value: 'security_deposit', label: 'Security Deposit' },
        { value: 'maintenance_charges', label: 'Maintenance Charges' },
        ...baseOptions,
      ];
    }

    if (listingType === 'lease') {
      return [
        { value: 'lease_amount', label: 'Lease Amount' },
        { value: 'security_deposit', label: 'Security Deposit' },
        { value: 'maintenance_charges', label: 'Maintenance Charges' },
        ...baseOptions,
      ];
    }

    return baseOptions;
  };

  // Helper function to get unit options based on pricing type
  const getUnitOptions = (pricingType) => {
    if (pricingType === 'brokerage_fee') {
      return [
        { value: 'percentage', label: 'Percentage (%)' },
        { value: 'total', label: 'Fixed Amount' },
      ];
    }

    if (pricingType === 'maintenance_charges') {
      return [
        { value: 'monthly', label: 'Per Month' },
        { value: 'total', label: 'One Time' },
      ];
    }

    return [
      { value: 'total', label: 'Total Price' },
      { value: 'per_sqft', label: 'Per Sq.ft' },
      { value: 'per_sqm', label: 'Per Sq.m' },
      { value: 'per_acre', label: 'Per Acre' },
    ];
  };

  // Helper function to get placeholder text
  const getPlaceholder = (pricingType, unit) => {
    if (pricingType === 'asking_price') return '50,00,000';
    if (pricingType === 'monthly_rent') return '25,000';
    if (pricingType === 'lease_amount') return '10,00,000';
    if (pricingType === 'security_deposit') return '50,000';
    if (pricingType === 'maintenance_charges') return '2,000';
    if (pricingType === 'brokerage_fee') {
      return unit === 'percentage' ? '2' : '50,000';
    }
    return '0';
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Pricing Information
          </h2>
          <p className="text-muted-foreground text-sm">
            Set your pricing details and availability
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="pb-24">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
                <DollarSign className="w-5 h-5" />
                Pricing Information
              </h3>
              
              <FieldGroup>
                {/* Listing Type */}
                <Controller
                  name="listingType"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Listing Type <span className="text-red-500">*</span>
                      </FieldLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {['sale', 'rent', 'lease'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => field.onChange(type)}
                            className={`p-2 border rounded text-xs font-medium capitalize transition-all ${
                              field.value === type
                                ? 'border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400 scale-105'
                                : 'border-muted hover:border-orange-500/50 hover:scale-105'
                            }`}
                          >
                            For {type}
                          </button>
                        ))}
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Dynamic Pricing Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FieldLabel className="text-base font-semibold">
                      Pricing Details <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ type: 'brokerage_fee', value: '', unit: 'total' })}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Pricing Item
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-3 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          Pricing Item {index + 1}
                        </span>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Pricing Type */}
                        <Controller
                          name={`pricing.${index}.type`}
                          control={control}
                          render={({ field: typeField, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel>
                                Type <span className="text-red-500">*</span>
                              </FieldLabel>
                              <Select
                                value={typeField.value}
                                onValueChange={typeField.onChange}
                              >
                                <SelectTrigger className="h-9 text-sm">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getPricingTypeOptions().map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
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

                        {/* Value */}
                        <Controller
                          name={`pricing.${index}.value`}
                          control={control}
                          render={({ field: valueField, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel>
                                Value <span className="text-red-500">*</span>
                              </FieldLabel>
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                  {watch(`pricing.${index}.unit`) === 'percentage' ? '%' : '₹'}
                                </span>
                                <Input
                                  {...valueField}
                                  type="number"
                                  min="0"
                                  placeholder={getPlaceholder(
                                    watch(`pricing.${index}.type`),
                                    watch(`pricing.${index}.unit`)
                                  )}
                                  className={`h-9 pl-6 text-sm ${fieldState.invalid ? 'border-red-500' : ''}`}
                                />
                              </div>
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />

                        {/* Unit */}
                        <Controller
                          name={`pricing.${index}.unit`}
                          control={control}
                          render={({ field: unitField }) => (
                            <Field>
                              <FieldLabel>Unit</FieldLabel>
                              <Select
                                value={unitField.value}
                                onValueChange={unitField.onChange}
                              >
                                <SelectTrigger className="h-9 text-sm">
                                  <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getUnitOptions(watch(`pricing.${index}.type`)).map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </Field>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Negotiable Toggle */}
                <Controller
                  name="isPriceNegotiable"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between p-3 border rounded hover:border-orange-500 transition-colors">
                      <div>
                        <FieldLabel className="font-semibold">Price Negotiable</FieldLabel>
                        <FieldDescription className="text-xs">
                          Allow buyers to negotiate the price
                        </FieldDescription>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />

                {/* Available From */}
                <Controller
                  name="availableFrom"
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        Available From
                      </FieldLabel>
                      <Input
                        {...field}
                        type="date"
                        className="h-9 text-sm"
                      />
                    </Field>
                  )}
                />
              </FieldGroup>
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
    </FormProvider>
  );
}
