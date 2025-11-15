import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useDeveloperFormV2 } from '../../context/DeveloperFormContextV2';
import { projectsSchema } from '../../../schemas/projectsSchema';
import SaveAndContinueFooter from '../SaveAndContinueFooter';

export default function ProjectsStepV2() {
  const { formData, saveAndContinue, previousStep } = useDeveloperFormV2();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(projectsSchema),
    defaultValues: {
      projectTypes: [],
      specializations: [],
      operatingCities: [],
      operatingStates: [],
      ...formData,
    },
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
              <Briefcase className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Projects & Portfolio
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showcase your experience and portfolio
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalProjectsCompleted">
                  Completed Projects <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="totalProjectsCompleted"
                  type="number"
                  {...register('totalProjectsCompleted', { valueAsNumber: true })}
                  placeholder="0"
                  min="0"
                  className={errors.totalProjectsCompleted ? 'border-red-500' : ''}
                />
                {errors.totalProjectsCompleted && (
                  <p className="text-sm text-red-500">{errors.totalProjectsCompleted.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalProjectsOngoing">
                  Ongoing Projects <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="totalProjectsOngoing"
                  type="number"
                  {...register('totalProjectsOngoing', { valueAsNumber: true })}
                  placeholder="0"
                  min="0"
                  className={errors.totalProjectsOngoing ? 'border-red-500' : ''}
                />
                {errors.totalProjectsOngoing && (
                  <p className="text-sm text-red-500">{errors.totalProjectsOngoing.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalUnitsDelivered">Total Units Delivered</Label>
                <Input
                  id="totalUnitsDelivered"
                  type="number"
                  {...register('totalUnitsDelivered', { valueAsNumber: true })}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalSqftDeveloped">Total Sq.Ft. Developed</Label>
                <Input
                  id="totalSqftDeveloped"
                  type="number"
                  {...register('totalSqftDeveloped', { valueAsNumber: true })}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Note:</strong> Additional fields for project types, specializations, and operating regions 
                can be added here. For this implementation, you can manually add these as arrays in the form data.
              </p>
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
