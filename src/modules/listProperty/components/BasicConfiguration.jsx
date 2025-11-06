import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { Bed, Bath } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import useListPropertyStore from '../store/useListPropertyStore';
import basicConfigurationSchema from '../schemas/basicConfigurationSchema';

const additionalRoomOptions = [
  'Servant Room',
  'Study Room',
  'Store Room',
  'Pooja Room',
  'Home Office',
];

export default function BasicConfiguration() {
  const { formData, updateFormData, nextStep, previousStep, updateStepValidation } =
    useListPropertyStore();

  // Initialize React Hook Form with Zod validation
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(basicConfigurationSchema),
    mode: 'onChange',
    defaultValues: {
      bedrooms: formData.bedrooms || '',
      bathrooms: formData.bathrooms || '',
      balconies: formData.balconies || '',
      additionalRooms: formData.additionalRooms || [],
    },
  });

  // Update step validation when form validity changes
  useEffect(() => {
    updateStepValidation(2, isValid);
  }, [isValid, updateStepValidation]);

  // Handle form submission
  const onSubmit = (data) => {
    updateFormData(data);
    nextStep();
  };

  const toggleAdditionalRoom = (room) => {
    const current = watch('additionalRooms') || [];
    const updated = current.includes(room)
      ? current.filter((r) => r !== room)
      : [...current, room];
    setValue('additionalRooms', updated, { shouldValidate: true });
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
          Basic Configuration
        </h2>
        <p className="text-muted-foreground text-sm">
          Define the basic room configuration of your property
        </p>
      </motion.div>

      <div className="bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 dark:from-orange-950/10 dark:via-background dark:to-orange-900/5 rounded-xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Bedrooms, Bathrooms, Balconies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bedrooms */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label className="text-sm flex items-center gap-2">
                <Bed className="w-4 h-4 text-orange-600" />
                Bedrooms <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="bedrooms"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className={`h-10 text-sm border-2 focus:border-orange-500 ${
                      errors.bedrooms ? 'border-red-500' : ''
                    }`}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, '6+'].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num} {num === '6+' ? '' : num === 1 ? 'Bedroom' : 'Bedrooms'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.bedrooms && (
                <p className="text-sm text-red-500 mt-1">{errors.bedrooms.message}</p>
              )}
            </motion.div>

            {/* Bathrooms */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label className="text-sm flex items-center gap-2">
                <Bath className="w-4 h-4 text-orange-600" />
                Bathrooms <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="bathrooms"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className={`h-10 text-sm border-2 focus:border-orange-500 ${
                      errors.bathrooms ? 'border-red-500' : ''
                    }`}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, '6+'].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num} {num === '6+' ? '' : num === 1 ? 'Bathroom' : 'Bathrooms'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.bathrooms && (
                <p className="text-sm text-red-500 mt-1">{errors.bathrooms.message}</p>
              )}
            </motion.div>

            {/* Balconies */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label className="text-sm">Balconies</Label>
              <Controller
                name="balconies"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="h-10 text-sm border-2 focus:border-orange-500">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, '5+'].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num} {num === '5+' ? '' : num === 1 ? 'Balcony' : 'Balconies'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </motion.div>
          </div>

          {/* Additional Rooms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <Label className="text-sm font-semibold">Additional Rooms</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {additionalRoomOptions.map((room) => (
                <div
                  key={room}
                  className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:border-orange-500 transition-colors cursor-pointer"
                  onClick={() => toggleAdditionalRoom(room)}
                >
                  <Checkbox
                    checked={(watch('additionalRooms') || []).includes(room)}
                    onCheckedChange={() => toggleAdditionalRoom(room)}
                  />
                  <label className="text-sm font-medium cursor-pointer">
                    {room}
                  </label>
                </div>
              ))}
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
