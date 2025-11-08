import { useEffect } from 'react';
import { useForm, Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { usePropertyForm } from '../context/PropertyFormContext';
import pricingInformationSchema from '../schemas/pricingInformationSchema';

export default function PricingInformation() {
  const mainForm = useFormContext();
  const { updateStepValidation, currentStep } = usePropertyForm();

  // Get initial pricing array from main form or create default
  const getInitialPricing = () => {
    const existingPricing = mainForm.watch('pricing');
    if (existingPricing && existingPricing.length > 0) {
      return existingPricing;
    }
    
    const listingType = mainForm.watch('listingType') || 'sale';
    let defaultType = 'asking_price';
    if (listingType === 'rent') {
      defaultType = 'monthly_rent';
    } else if (listingType === 'lease') {
      defaultType = 'lease_amount';
    }
    
    return [{ type: defaultType, value: '', unit: 'total' }];
  };

  // Initialize React Hook Form with Zod validation
  const form = useForm({
    resolver: zodResolver(pricingInformationSchema),
    mode: 'onChange',
    defaultValues: {
      listingType: mainForm.watch('listingType') || 'sale',
      pricing: getInitialPricing(),
      isPriceNegotiable: mainForm.watch('isPriceNegotiable') || false,
      availableFrom: mainForm.watch('availableFrom') || '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'pricing',
  });

  // Update step validation when form validity changes
  useEffect(() => {
    updateStepValidation(currentStep, form.formState.isValid);
  }, [form.formState.isValid, currentStep, updateStepValidation]);

  // Handle listing type changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'listingType') {
        const newType = value.listingType;
        const currentPricing = form.getValues('pricing');
        
        // Update the primary pricing type based on listing type
        let primaryType = 'asking_price';
        if (newType === 'rent') {
          primaryType = 'monthly_rent';
        } else if (newType === 'lease') {
          primaryType = 'lease_amount';
        }
        
        // Check if we need to update the first pricing item
        if (currentPricing.length > 0) {
          const firstItem = currentPricing[0];
          const shouldUpdate = !['asking_price', 'monthly_rent', 'lease_amount'].includes(firstItem.type) ||
            (newType === 'sale' && firstItem.type !== 'asking_price') ||
            (newType === 'rent' && firstItem.type !== 'monthly_rent') ||
            (newType === 'lease' && firstItem.type !== 'lease_amount');
          
          if (shouldUpdate) {
            form.setValue('pricing.0.type', primaryType);
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Sync form data with main form on field changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      for (const key of Object.keys(value)) {
        mainForm.setValue(key, value[key]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, mainForm]);

  // Helper function to get pricing type options based on listing type
  const getPricingTypeOptions = () => {
    const listingType = form.watch('listingType');
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
        <DollarSign className="w-5 h-5" />
        Pricing Information
      </h3>
      
      <FieldGroup>
        {/* Listing Type */}
        <Controller
          name="listingType"
          control={form.control}
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
                  control={form.control}
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
                  control={form.control}
                  render={({ field: valueField, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Value <span className="text-red-500">*</span>
                      </FieldLabel>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          {form.watch(`pricing.${index}.unit`) === 'percentage' ? '%' : '₹'}
                        </span>
                        <Input
                          {...valueField}
                          type="number"
                          min="0"
                          placeholder={getPlaceholder(
                            form.watch(`pricing.${index}.type`),
                            form.watch(`pricing.${index}.unit`)
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
                  control={form.control}
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
                          {getUnitOptions(form.watch(`pricing.${index}.type`)).map((option) => (
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
          control={form.control}
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
          control={form.control}
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
  );
}
