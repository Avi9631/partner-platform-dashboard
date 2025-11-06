import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { MapPin, Building2, Calendar, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useListPropertyStore from '../store/useListPropertyStore';
import basicDetailsSchema from '../schemas/basicDetailsSchema';

export default function BasicDetails() {
  const { formData, updateFormData, nextStep, previousStep, updateStepValidation } =
    useListPropertyStore();

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(basicDetailsSchema),
    mode: 'onChange',
    defaultValues: {
      projectName: formData.projectName || '',
      city: formData.city || '',
      addressText: formData.addressText || '',
      ageOfProperty: formData.ageOfProperty || '',
      possessionStatus: formData.possessionStatus || 'ready',
      possessionDate: formData.possessionDate || '',
    },
  });

  // Update step validation when form validity changes
  useEffect(() => {
    updateStepValidation(1, isValid);
  }, [isValid, updateStepValidation]);

  // Handle form submission
  const onSubmit = (data) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <div className="w-full px-6 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Property Location & Basic Information
        </h2>
        <p className="text-muted-foreground text-sm">
          Provide essential details about your property
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 dark:from-orange-950/10 dark:via-background dark:to-orange-900/5 rounded-xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Project Name (Optional) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="projectName" className="text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-orange-600" />
                  Project Name <span className="text-xs text-muted-foreground">(Optional)</span>
                </Label>
                <Input
                  id="projectName"
                  placeholder="e.g., Green Valley Apartments, Palm Springs Villa"
                  {...register('projectName')}
                  className="h-10 text-sm border-2 focus:border-orange-500 transition-all"
                />
              </motion.div>

              {/* City */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="city" className="text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  placeholder="Enter city name"
                  {...register('city')}
                  className={`h-10 text-sm border-2 focus:border-orange-500 transition-all ${
                    errors.city ? 'border-red-500' : ''
                  }`}
                />
                {errors.city && (
                  <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
                )}
              </motion.div>

              {/* Address */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="addressText" className="text-sm flex items-center gap-2">
                  <Home className="w-4 h-4 text-orange-600" />
                  Full Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="addressText"
                  placeholder="House/Flat No., Street, Locality, Landmark"
                  {...register('addressText')}
                  className={`h-10 text-sm border-2 focus:border-orange-500 transition-all ${
                    errors.addressText ? 'border-red-500' : ''
                  }`}
                />
                {errors.addressText && (
                  <p className="text-sm text-red-500 mt-1">{errors.addressText.message}</p>
                )}
              </motion.div>

              {/* Age of Property & Possession Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age of Property */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="ageOfProperty" className="text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    Age of Property (years) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ageOfProperty"
                    type="number"
                    min="0"
                    placeholder="e.g., 2"
                    {...register('ageOfProperty')}
                    className={`h-10 text-sm border-2 focus:border-orange-500 transition-all ${
                      errors.ageOfProperty ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.ageOfProperty && (
                    <p className="text-sm text-red-500 mt-1">{errors.ageOfProperty.message}</p>
                  )}
                </motion.div>

                {/* Possession Status */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2"
                >
                  <Label className="text-sm">
                    Possession Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch('possessionStatus')}
                    onValueChange={(value) => setValue('possessionStatus', value)}
                  >
                    <SelectTrigger className={`h-10 text-sm border-2 ${
                      errors.possessionStatus ? 'border-red-500' : ''
                    }`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ready">Ready to Move</SelectItem>
                      <SelectItem value="under_construction">Under Construction</SelectItem>
                      <SelectItem value="resale">Resale</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.possessionStatus && (
                    <p className="text-sm text-red-500 mt-1">{errors.possessionStatus.message}</p>
                  )}
                </motion.div>
              </div>

              {/* Possession Date (if under construction) */}
              {watch('possessionStatus') === 'under_construction' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="possessionDate" className="text-sm">
                    Expected Possession Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="possessionDate"
                    type="date"
                    {...register('possessionDate')}
                    className={`h-10 text-sm border-2 focus:border-orange-500 transition-all ${
                      errors.possessionDate ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.possessionDate && (
                    <p className="text-sm text-red-500 mt-1">{errors.possessionDate.message}</p>
                  )}
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex justify-between pt-4"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={previousStep}
                  className="px-6 border-orange-200 hover:bg-orange-50 hover:border-orange-500 dark:border-orange-800 dark:hover:bg-orange-950/30"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 17l-5-5m0 0l5-5m-5 5h12"
                    />
                  </svg>
                  Back
                </Button>
                <Button
                  size="default"
                  type="submit"
                  disabled={!isValid}
                  className="px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30"
                >
                  Continue
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    );
}
