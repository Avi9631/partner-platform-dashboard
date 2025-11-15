import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { User, MapPin, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useDeveloperFormV2 } from '../../context/DeveloperFormContextV2';
import { contactInfoSchema } from '../../../schemas/contactInfoSchema';
import SaveAndContinueFooter from '../SaveAndContinueFooter';

export default function ContactInfoStepV2() {
  const { formData, saveAndContinue, previousStep } = useDeveloperFormV2();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: formData || {},
  });

  useEffect(() => {
    if (formData) {
      Object.keys(formData).forEach((key) => {
        setValue(key, formData[key]);
      });
    }
  }, [formData, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await saveAndContinue(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border-orange-200 dark:border-orange-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contact Information
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                How can potential clients reach you?
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Primary Contact */}
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Primary Contact</h4>
              
              <div className="space-y-2">
                <Label htmlFor="primaryContactName">Name <span className="text-red-500">*</span></Label>
                <Input
                  id="primaryContactName"
                  {...register('primaryContactName')}
                  placeholder="Contact person name"
                  className={errors.primaryContactName ? 'border-red-500' : ''}
                />
                {errors.primaryContactName && (
                  <p className="text-sm text-red-500">{errors.primaryContactName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryContactEmail">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="primaryContactEmail"
                  type="email"
                  {...register('primaryContactEmail')}
                  placeholder="contact@company.com"
                  className={errors.primaryContactEmail ? 'border-red-500' : ''}
                />
                {errors.primaryContactEmail && (
                  <p className="text-sm text-red-500">{errors.primaryContactEmail.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryContactPhone">Phone <span className="text-red-500">*</span></Label>
                <Input
                  id="primaryContactPhone"
                  {...register('primaryContactPhone')}
                  placeholder="+91 9876543210"
                  className={errors.primaryContactPhone ? 'border-red-500' : ''}
                />
                {errors.primaryContactPhone && (
                  <p className="text-sm text-red-500">{errors.primaryContactPhone.message}</p>
                )}
              </div>
            </div>

            {/* Office Address */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Office Address
              </h4>

              <div className="space-y-2">
                <Label htmlFor="officeAddress">Address <span className="text-red-500">*</span></Label>
                <Input
                  id="officeAddress"
                  {...register('officeAddress')}
                  placeholder="Street address"
                  className={errors.officeAddress ? 'border-red-500' : ''}
                />
                {errors.officeAddress && (
                  <p className="text-sm text-red-500">{errors.officeAddress.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                  <Input
                    id="city"
                    {...register('city')}
                    placeholder="City"
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                  <Input
                    id="state"
                    {...register('state')}
                    placeholder="State"
                    className={errors.state ? 'border-red-500' : ''}
                  />
                  {errors.state && (
                    <p className="text-sm text-red-500">{errors.state.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode <span className="text-red-500">*</span></Label>
                <Input
                  id="pincode"
                  {...register('pincode')}
                  placeholder="123456"
                  maxLength={6}
                  className={errors.pincode ? 'border-red-500' : ''}
                />
                {errors.pincode && (
                  <p className="text-sm text-red-500">{errors.pincode.message}</p>
                )}
              </div>
            </div>

            {/* Online Presence */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Online Presence
              </h4>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  {...register('website')}
                  placeholder="https://www.company.com"
                  className={errors.website ? 'border-red-500' : ''}
                />
                {errors.website && (
                  <p className="text-sm text-red-500">{errors.website.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  type="url"
                  {...register('linkedin')}
                  placeholder="https://linkedin.com/company/..."
                  className={errors.linkedin ? 'border-red-500' : ''}
                />
                {errors.linkedin && (
                  <p className="text-sm text-red-500">{errors.linkedin.message}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <SaveAndContinueFooter
        onPrevious={previousStep}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
