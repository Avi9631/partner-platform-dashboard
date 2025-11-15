import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Building2, Calendar, FileText, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useDeveloperFormV2 } from '../../context/DeveloperFormContextV2';
import { basicInfoSchema } from '../../../schemas/basicInfoSchema';
import SaveAndContinueFooter from '../SaveAndContinueFooter';

export default function BasicInfoStepV2() {
  const { formData, saveAndContinue, previousStep, currentStep } = useDeveloperFormV2();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: formData || {},
  });

  // Sync form with context data when available
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

  const developerTypes = [
    'National Developer',
    'Regional Developer',
    'Local Builder',
    'Boutique Developer',
    'Luxury Developer',
    'Affordable Housing Developer',
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border-orange-200 dark:border-orange-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Building2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Developer Information
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tell us about your company and what makes you unique
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Developer Name */}
            <div className="space-y-2">
              <Label htmlFor="developerName" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Developer Name
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="developerName"
                {...register('developerName')}
                placeholder="e.g., Prestige Group"
                className={errors.developerName ? 'border-red-500' : ''}
              />
              {errors.developerName && (
                <p className="text-sm text-red-500">{errors.developerName.message}</p>
              )}
            </div>

            {/* Developer Type */}
            <div className="space-y-2">
              <Label htmlFor="developerType" className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                Developer Type
                <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue('developerType', value)}
                value={watch('developerType')}
              >
                <SelectTrigger className={errors.developerType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select developer type" />
                </SelectTrigger>
                <SelectContent>
                  {developerTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.developerType && (
                <p className="text-sm text-red-500">{errors.developerType.message}</p>
              )}
            </div>

            {/* Established Year */}
            <div className="space-y-2">
              <Label htmlFor="establishedYear" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Established Year
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="establishedYear"
                type="number"
                {...register('establishedYear', { valueAsNumber: true })}
                placeholder="e.g., 1986"
                min="1900"
                max={new Date().getFullYear()}
                className={errors.establishedYear ? 'border-red-500' : ''}
              />
              {errors.establishedYear && (
                <p className="text-sm text-red-500">{errors.establishedYear.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Company Description
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Brief description of your company, values, and vision..."
                rows={5}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Minimum 50 characters to help potential clients understand your business better
              </p>
            </div>

            {/* Registration Number */}
            <div className="space-y-2">
              <Label htmlFor="registrationNumber" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Company Registration Number
              </Label>
              <Input
                id="registrationNumber"
                {...register('registrationNumber')}
                placeholder="e.g., CIN: U12345AB1986PLC123456"
                className={errors.registrationNumber ? 'border-red-500' : ''}
              />
              {errors.registrationNumber && (
                <p className="text-sm text-red-500">{errors.registrationNumber.message}</p>
              )}
            </div>

            {/* RERA Registration */}
            <div className="space-y-2">
              <Label htmlFor="reraRegistrationNumber" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                RERA Registration Number
              </Label>
              <Input
                id="reraRegistrationNumber"
                {...register('reraRegistrationNumber')}
                placeholder="e.g., RERA-GGM-123-456"
                className={errors.reraRegistrationNumber ? 'border-red-500' : ''}
              />
              {errors.reraRegistrationNumber && (
                <p className="text-sm text-red-500">{errors.reraRegistrationNumber.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <SaveAndContinueFooter
        onPrevious={currentStep > 0 ? previousStep : null}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
