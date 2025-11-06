import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useListPropertyStore from '../store/useListPropertyStore';
import listingInformationSchema from '../schemas/listingInformationSchema';

export default function ListingInformation() {
  const { formData, updateFormData, updateStepValidation } = useListPropertyStore();

  // Initialize React Hook Form with Zod validation
  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(listingInformationSchema),
    mode: 'onChange',
    defaultValues: {
      title: formData.title || '',
      description: formData.description || '',
    },
  });

  // Update step validation when form validity changes
  useEffect(() => {
    updateStepValidation(6, isValid);
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
        <FileText className="w-5 h-5" />
        Listing Information
      </h3>
      
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-sm flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-primary" />
          Listing Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g., Spacious 3BHK Apartment in Prime Location"
          {...register('title')}
          className={`h-9 text-sm ${errors.title ? 'border-red-500' : ''}`}
          maxLength={100}
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
        {!errors.title && (
          <p className="text-xs text-muted-foreground">
            {watch('title')?.length || 0}/100 characters
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-sm">
          Property Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your property in detail. Include unique features, nearby landmarks, connectivity, etc."
          {...register('description')}
          className={`min-h-[100px] text-sm ${errors.description ? 'border-red-500' : ''}`}
          maxLength={1000}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
        )}
        {!errors.description && (
          <p className="text-xs text-muted-foreground">
            {watch('description')?.length || 0}/1000 characters
          </p>
        )}
      </div>
    </div>
  );
}
