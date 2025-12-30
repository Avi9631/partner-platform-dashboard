import { useEffect, useMemo } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import pricingInformationSchema from '../../../schemas/pricingInformationSchema';
import { createStepLogger } from '../../../utils/validationLogger';

export default function PricingStepV2() {
  const { saveAndContinue, previousStep, formData, setCurrentStepSubmitHandler } = usePropertyFormV2();

  // Create logger instance (memoized to prevent recreation)
  const logger = useMemo(() => createStepLogger('Pricing Information Step'), []);

  // Initialize React Hook Form with Zod validation
  const form = useForm({
    resolver: zodResolver(pricingInformationSchema),
    mode: 'onChange',
    defaultValues: {
      pricing: formData?.pricing || [{ type: 'asking_price', value: '', unit: 'total' }],
      isPriceNegotiable: formData?.isPriceNegotiable || false,
      availableFrom: formData?.availableFrom || '',
    },
  });

  const { control, watch, formState, handleSubmit } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'pricing',
  });

  // Get listing type from formData (set in Basic Details step)
  const listingType = formData?.listingType || 'sale';

  // Log validation errors when they change
  useEffect(() => {
    if (Object.keys(formState.errors).length > 0) {
      logger.logErrors(formState.errors);
    }
  }, [formState.errors, logger]);

  // Handle form submission
  const onSubmit = (data) => {
    logger.logSubmission(data, formState.errors);
    saveAndContinue(data);
  };

  const onError = (errors) => {
    logger.logSubmission(form.getValues(), errors);
  };

  // Register submit handler with context
  useEffect(() => {
    setCurrentStepSubmitHandler(() => handleSubmit(onSubmit));
    return () => setCurrentStepSubmitHandler(null);
  }, [handleSubmit, onSubmit, setCurrentStepSubmitHandler]);

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
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
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

      <div className="pb-24">
        <FieldGroup>
          {/* Info: Listing Type from Basic Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
          >
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <span className="font-semibold">Listing Type:</span> For <span className="capitalize font-semibold">{listingType}</span>
              <span className="text-xs block mt-1 text-blue-700 dark:text-blue-300">
                (Set in Basic Details step. Go back to change it.)
              </span>
            </p>
          </motion.div>

          {/* Dynamic Pricing Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <FieldLabel className="text-base font-semibold">
                Pricing Details <span className="text-red-500">*</span>
              </FieldLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ type: 'brokerage_fee', value: '', unit: 'total' })}
                className="flex items-center gap-1.5 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Pricing Item
              </Button>
            </div>

            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-2 rounded-lg space-y-3 bg-muted/30 hover:border-orange-500/30 transition-colors"
              >
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
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
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
                        <FieldLabel className="text-xs">
                          Type <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Select
                          value={typeField.value}
                          onValueChange={typeField.onChange}
                        >
                          <SelectTrigger className="h-9 text-sm border-2 focus:border-orange-500">
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
                        <FieldLabel className="text-xs">
                          Value <span className="text-red-500">*</span>
                        </FieldLabel>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">
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
                            className={`h-9 pl-7 text-sm border-2 focus:border-orange-500 transition-all ${
                              fieldState.invalid ? 'border-red-500' : ''
                            }`}
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
                        <FieldLabel className="text-xs">Unit</FieldLabel>
                        <Select
                          value={unitField.value}
                          onValueChange={unitField.onChange}
                        >
                          <SelectTrigger className="h-9 text-sm border-2 focus:border-orange-500">
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
                </motion.div>
              ))}

            <FieldDescription className="text-xs">
              Add multiple pricing items such as asking price, security deposit, maintenance charges, or brokerage fees
            </FieldDescription>
          </motion.div>

          {/* Price Negotiable Toggle */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Controller
              name="isPriceNegotiable"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between p-4 border-2 rounded-lg hover:border-orange-500 transition-all">
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
          </motion.div>

          {/* Available From */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Controller
              name="availableFrom"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    Available From
                  </FieldLabel>
                  <Input
                    {...field}
                    type="date"
                    className="h-11 text-sm border-2 focus:border-orange-500 transition-all"
                  />
                  <FieldDescription>
                    When will this property be available for occupancy?
                  </FieldDescription>
                </Field>
              )}
            />
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
          >
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <span className="font-semibold">💡 Tip:</span> Be transparent with pricing details. Include all applicable charges to build trust with potential buyers or renters.
            </p>
          </motion.div>
        </FieldGroup>
      </div>
    </div>
  );
}
