import { useForm, FormProvider } from 'react-hook-form';
import { useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { FileText, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';

export default function ListingInfoStepV2() {
  const { saveAndContinue, previousStep, formData, setCurrentStepSubmitHandler } = usePropertyFormV2();

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      title: formData?.title || '',
      description: formData?.description || '',
    },
  });

  const { register, watch, formState: { errors } } = methods;
  const title = watch('title');
  const description = watch('description');
  
  const isValid = !!(title && description);

  const handleContinue = useCallback(() => {
    if (isValid) {
      const data = methods.getValues();
      saveAndContinue(data);
    }
  }, [isValid, methods, saveAndContinue]);

  // Register submit handler with context
  useEffect(() => {
    setCurrentStepSubmitHandler(() => handleContinue);
    return () => setCurrentStepSubmitHandler(null);
  }, [handleContinue, setCurrentStepSubmitHandler]);

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Listing Information
          </h2>
          <p className="text-muted-foreground text-sm">
            Create an attractive title and description for your listing
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
        <div>
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
                    {title?.length || 0}/100 characters
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
                    {description?.length || 0}/1000 characters
                  </p>
                )}
              </div>
            </div>
        </motion.div>
      </div>
    </FormProvider>
  );
}


