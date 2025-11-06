import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { Layers } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import useListPropertyStore from '../store/useListPropertyStore';
import floorDetailsSchema from '../schemas/floorDetailsSchema';

export default function FloorDetails() {
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
    resolver: zodResolver(floorDetailsSchema),
    mode: 'onChange',
    defaultValues: {
      towerName: formData.towerName || '',
      floorNumber: formData.floorNumber || '',
      totalFloors: formData.totalFloors || '',
      unitNumber: formData.unitNumber || '',
      isUnitNumberPrivate: formData.isUnitNumberPrivate || false,
    },
  });

  // Update step validation when form validity changes
  useEffect(() => {
    updateStepValidation(4, isValid);
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
          Floor Details
        </h2>
        <p className="text-muted-foreground text-sm">
          Provide floor and unit information
        </p>
      </motion.div>

      <div className="bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 dark:from-orange-950/10 dark:via-background dark:to-orange-900/5 rounded-xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Tower & Floor Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tower Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="towerName" className="text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-600" />
                Tower Name
              </Label>
              <Input
                id="towerName"
                placeholder="e.g., Tower A"
                {...register('towerName')}
                className="h-11 text-sm border-2 focus:border-orange-500 transition-all"
              />
            </motion.div>

            {/* Floor Number */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="floorNumber" className="text-sm">
                Floor Number
              </Label>
              <Input
                id="floorNumber"
                type="number"
                min="0"
                placeholder="e.g., 5"
                {...register('floorNumber')}
                className={`h-11 text-sm border-2 focus:border-orange-500 transition-all ${
                  errors.floorNumber ? 'border-red-500' : ''
                }`}
              />
              {errors.floorNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.floorNumber.message}</p>
              )}
            </motion.div>

            {/* Total Floors */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="totalFloors" className="text-sm">
                Total Floors
              </Label>
              <Input
                id="totalFloors"
                type="number"
                min="1"
                placeholder="e.g., 20"
                {...register('totalFloors')}
                className={`h-11 text-sm border-2 focus:border-orange-500 transition-all ${
                  errors.totalFloors ? 'border-red-500' : ''
                }`}
              />
              {errors.totalFloors && (
                <p className="text-sm text-red-500 mt-1">{errors.totalFloors.message}</p>
              )}
            </motion.div>
          </div>

          {/* Unit Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <Label htmlFor="unitNumber" className="text-sm">
              Unit Number
            </Label>
            <Input
              id="unitNumber"
              placeholder="e.g., 501"
              {...register('unitNumber')}
              className="h-11 text-sm border-2 focus:border-orange-500 transition-all"
            />
            
            <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/30">
              <Switch
                checked={watch('isUnitNumberPrivate')}
                onCheckedChange={(checked) =>
                  setValue('isUnitNumberPrivate', checked, { shouldValidate: true })
                }
              />
              <Label className="text-sm cursor-pointer">
                Keep unit number private
              </Label>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-between mt-8 pt-6 border-t border-orange-200 dark:border-orange-900"
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
              type="submit"
              size="default"
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
    </div>
  );
}
