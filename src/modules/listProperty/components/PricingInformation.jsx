import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DollarSign, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useListPropertyStore from '../store/useListPropertyStore';
import pricingInformationSchema from '../schemas/pricingInformationSchema';

export default function PricingInformation() {
  const { formData, updateFormData, updateStepValidation } = useListPropertyStore();

  // Initialize React Hook Form with Zod validation
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(pricingInformationSchema),
    mode: 'onChange',
    defaultValues: {
      listingType: formData.listingType || 'sale',
      price: formData.price || '',
      priceUnit: formData.priceUnit || 'total',
      maintenanceCharges: formData.maintenanceCharges || '',
      availableFrom: formData.availableFrom || '',
    },
  });

  // Update step validation when form validity changes
  useEffect(() => {
    updateStepValidation(5, isValid);
  }, [isValid, updateStepValidation]);

  // Sync form data with store on field changes
  useEffect(() => {
    const subscription = watch((value) => {
      updateFormData(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateFormData]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
        <DollarSign className="w-5 h-5" />
        Pricing Information
      </h3>
      
      {/* Listing Type */}
      <div className="space-y-2">
        <Label className="text-sm">
          Listing Type <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {['sale', 'rent', 'lease'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setValue('listingType', type, { shouldValidate: true })}
              className={`p-2 border rounded text-xs font-medium capitalize transition-all ${
                watch('listingType') === type
                  ? 'border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400 scale-105'
                  : 'border-muted hover:border-orange-500/50 hover:scale-105'
              }`}
            >
              For {type}
            </button>
          ))}
        </div>
        {errors.listingType && (
          <p className="text-sm text-red-500 mt-1">{errors.listingType.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Price */}
        <div className="space-y-1.5">
          <Label className="text-sm">
            {watch('listingType') === 'sale' ? 'Asking Price' : 'Monthly Rent'}{' '}
            <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              ₹
            </span>
            <Input
              type="number"
              min="0"
              placeholder={
                watch('listingType') === 'sale' ? '50,00,000' : '25,000'
              }
              {...register('price')}
              className={`h-9 pl-6 text-sm ${errors.price ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.price && (
            <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Price Unit */}
        <div className="space-y-1.5">
          <Label className="text-sm">Price Per</Label>
          <Controller
            name="priceUnit"
            control={control}
            render={({ field }) => (
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
            )}
          />
        </div>
      </div>

      {/* Maintenance Charges (for rent) */}
      {watch('listingType') !== 'sale' && (
        <div className="space-y-1.5">
          <Label className="text-sm">
            Maintenance Charges (Monthly)
          </Label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              ₹
            </span>
            <Input
              type="number"
              min="0"
              placeholder="e.g., 2,000"
              {...register('maintenanceCharges')}
              className={`h-9 pl-6 text-sm ${errors.maintenanceCharges ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.maintenanceCharges && (
            <p className="text-sm text-red-500 mt-1">{errors.maintenanceCharges.message}</p>
          )}
        </div>
      )}

      {/* Available From */}
      <div className="space-y-1.5">
        <Label htmlFor="availableFrom" className="text-sm flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          Available From
        </Label>
        <Input
          id="availableFrom"
          type="date"
          {...register('availableFrom')}
          className="h-9 text-sm"
        />
      </div>
    </div>
  );
}
