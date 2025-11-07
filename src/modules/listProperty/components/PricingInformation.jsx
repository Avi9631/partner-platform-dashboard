import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DollarSign, Calendar, Percent } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import pricingInformationSchema from '../schemas/pricingInformationSchema';

export default function PricingInformation() {
  const mainForm = useFormContext();
  const { updateStepValidation, currentStep } = usePropertyForm();

  // Initialize React Hook Form with Zod validation
  const form = useForm({
    resolver: zodResolver(pricingInformationSchema),
    mode: 'onChange',
    defaultValues: {
      listingType: mainForm.watch('listingType') || 'sale',
      price: mainForm.watch('price') || '',
      priceUnit: mainForm.watch('priceUnit') || 'total',
      isPriceNegotiable: mainForm.watch('isPriceNegotiable') || false,
      securityDeposit: mainForm.watch('securityDeposit') || '',
      brokerageFee: mainForm.watch('brokerageFee') || '',
      maintenanceCharges: mainForm.watch('maintenanceCharges') || '',
      availableFrom: mainForm.watch('availableFrom') || '',
    },
  });

  // Update step validation when form validity changes
  useEffect(() => {
    updateStepValidation(currentStep, form.formState.isValid);
  }, [form.formState.isValid, currentStep, updateStepValidation]);

  // Sync form data with main form on field changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      Object.keys(value).forEach((key) => {
        mainForm.setValue(key, value[key]);
      });
    });
    return () => subscription.unsubscribe();
  }, [form, mainForm]);

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Price */}
          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  {form.watch('listingType') === 'sale' ? 'Asking Price' : 'Monthly Rent'}{' '}
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    ₹
                  </span>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    placeholder={
                      form.watch('listingType') === 'sale' ? '50,00,000' : '25,000'
                    }
                    className={`h-9 pl-6 text-sm ${fieldState.invalid ? 'border-red-500' : ''}`}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Price Unit */}
          <Controller
            name="priceUnit"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Price Per</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="total">Total Price</SelectItem>
                    <SelectItem value="per_sqft">Per Sq.ft</SelectItem>
                    <SelectItem value="per_sqm">Per Sq.m</SelectItem>
                    <SelectItem value="per_acre">Per Acre</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
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

        {/* Security Deposit & Brokerage (for rent/lease) */}
        {form.watch('listingType') !== 'sale' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Security Deposit */}
              <Controller
                name="securityDeposit"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Security Deposit</FieldLabel>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        ₹
                      </span>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        placeholder="e.g., 50,000"
                        className="h-9 pl-6 text-sm"
                      />
                    </div>
                  </Field>
                )}
              />

              {/* Brokerage Fee */}
              <Controller
                name="brokerageFee"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-primary" />
                      Brokerage Fee
                    </FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      placeholder="e.g., 1 month rent or 2%"
                      className="h-9 text-sm"
                    />
                  </Field>
                )}
              />
            </div>

            {/* Maintenance Charges */}
            <Controller
              name="maintenanceCharges"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Maintenance Charges (Monthly)
                  </FieldLabel>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      ₹
                    </span>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      placeholder="e.g., 2,000"
                      className={`h-9 pl-6 text-sm ${fieldState.invalid ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </>
        )}

        {/* Brokerage for Sale */}
        {form.watch('listingType') === 'sale' && (
          <Controller
            name="brokerageFee"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel className="flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-primary" />
                  Brokerage Fee (Optional)
                </FieldLabel>
                <Input
                  {...field}
                  type="text"
                  placeholder="e.g., 1% or ₹50,000"
                  className="h-9 text-sm"
                />
              </Field>
            )}
          />
        )}

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
