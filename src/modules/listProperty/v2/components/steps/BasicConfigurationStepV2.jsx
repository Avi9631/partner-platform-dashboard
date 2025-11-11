import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { Bed, Bath, ChefHat, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
import { Checkbox } from '@/components/ui/checkbox';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import basicConfigurationSchema from '../../../schemas/basicConfigurationSchema';
import SaveAndContinueFooter from '../SaveAndContinueFooter';

const additionalRoomOptions = [
  'Servant Room',
  'Study Room',
  'Store Room',
  'Pooja Room',
  'Home Office',
];

export default function BasicConfigurationV2() {
  const { saveAndContinue, previousStep, formData } = usePropertyFormV2();
  
  // Initialize React Hook Form with Zod validation
  const form = useForm({
    resolver: zodResolver(basicConfigurationSchema),
    mode: 'onChange',
    defaultValues: {
      bedrooms: formData?.bedrooms || '',
      bathrooms: formData?.bathrooms || '',
      balconies: formData?.balconies || '',
      balconyType: formData?.balconyType || '',
      kitchenType: formData?.kitchenType || '',
      ceilingHeight: formData?.ceilingHeight || '',
      additionalRooms: formData?.additionalRooms || [],
    },
  });

  const { control, watch, setValue, handleSubmit, formState } = form;

  const toggleAdditionalRoom = (room) => {
    const current = watch('additionalRooms') || [];
    const updated = current.includes(room)
      ? current.filter((r) => r !== room)
      : [...current, room];
    setValue('additionalRooms', updated, { shouldValidate: true });
  };

  const onSubmit = (data) => {
    saveAndContinue(data);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 md:mb-6"
      >
        <h2 className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Basic Configuration
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Define the basic room configuration of your property
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
          {/* Bedrooms, Bathrooms, Balconies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bedrooms */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Controller
                name="bedrooms"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-2">
                      <Bed className="w-4 h-4 text-orange-600" />
                      Bedrooms <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={`h-10 text-sm border-2 focus:border-orange-500 ${
                        fieldState.invalid ? 'border-red-500' : ''
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </motion.div>

            {/* Bathrooms */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Controller
                name="bathrooms"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-2">
                      <Bath className="w-4 h-4 text-orange-600" />
                      Bathrooms <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={`h-10 text-sm border-2 focus:border-orange-500 ${
                        fieldState.invalid ? 'border-red-500' : ''
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </motion.div>

            {/* Balconies */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Controller
                name="balconies"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Balconies</FieldLabel>
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
                  </Field>
                )}
              />
            </motion.div>
          </div>

          {/* Balcony Type & Kitchen Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Balcony Type */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Controller
                name="balconyType"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Balcony Type</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-10 text-sm border-2 focus:border-orange-500">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Balcony</SelectItem>
                        <SelectItem value="terrace">Terrace / Rooftop</SelectItem>
                        <SelectItem value="french">French Balcony</SelectItem>
                        <SelectItem value="juliet">Juliet Balcony</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </motion.div>

            {/* Kitchen Type */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Controller
                name="kitchenType"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="flex items-center gap-2">
                      <ChefHat className="w-4 h-4 text-orange-600" />
                      Kitchen Type
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-10 text-sm border-2 focus:border-orange-500">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modular">Modular Kitchen</SelectItem>
                        <SelectItem value="basic">Basic Kitchen</SelectItem>
                        <SelectItem value="open">Open Kitchen</SelectItem>
                        <SelectItem value="semi_open">Semi-Open Kitchen</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </motion.div>
          </div>

          {/* Ceiling Height */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <Controller
              name="ceilingHeight"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-orange-600" />
                    Ceiling Height (in feet)
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    step="0.1"
                    min="8"
                    placeholder="e.g., 10"
                    className="h-10 text-sm border-2 focus:border-orange-500 transition-all"
                  />
                  <FieldDescription>
                    Standard height is usually 10 feet
                  </FieldDescription>
                </Field>
              )}
            />
          </motion.div>

          {/* Additional Rooms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Field>
              <FieldLabel className="font-semibold">Additional Rooms</FieldLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {additionalRoomOptions.map((room) => (
                  <label
                    key={room}
                    className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:border-orange-500 transition-colors cursor-pointer"
                  >
                    <Checkbox
                      checked={(watch('additionalRooms') || []).includes(room)}
                      onCheckedChange={() => toggleAdditionalRoom(room)}
                    />
                    <span className="text-sm font-medium">
                      {room}
                    </span>
                  </label>
                ))}
              </div>
            </Field>
          </motion.div>
        </FieldGroup>

        {/* Save & Continue Footer */}
        <SaveAndContinueFooter
          onBack={previousStep}
           nextDisabled={!formState.isValid}
          showBack={true}
        />
      </form>
      </motion.div>
    </div>
  );
}
