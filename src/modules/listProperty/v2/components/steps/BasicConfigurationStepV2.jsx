import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { Bed, Bath, Ruler, Plus, X, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import basicConfigurationSchema from '../../../schemas/basicConfigurationSchema';
import SaveAndContinueFooter from '../SaveAndContinueFooter';

const additionalRoomOptions = [
  { value: 'balcony', label: 'Balcony' },
  { value: 'servantRoom', label: 'Servant Room' },
  { value: 'studyRoom', label: 'Study Room' },
  { value: 'storeRoom', label: 'Store Room' },
  { value: 'poojaRoom', label: 'Pooja Room' },
  { value: 'homeOffice', label: 'Home Office' },
  { value: 'guestRoom', label: 'Guest Room' },
  { value: 'utilityRoom', label: 'Utility Room' },
  { value: 'diningRoom', label: 'Dining Room' },
  { value: 'familyRoom', label: 'Family Room' },
  { value: 'laundryRoom', label: 'Laundry Room' },
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
      additionalRooms: formData?.additionalRooms || [],
      roomDimensions: formData?.roomDimensions || [],
    },
  });

  const { control, watch, setValue, handleSubmit, formState } = form;

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
          {/* Bedrooms, Bathrooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Room Dimensions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Field>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <FieldLabel className="flex items-center gap-2 font-semibold">
                    <Ruler className="w-4 h-4 text-orange-600" />
                    Room Dimensions
                  </FieldLabel>
                  <FieldDescription>
                    Add dimensions for specific rooms (optional, max 10 rooms)
                  </FieldDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentDimensions = watch('roomDimensions') || [];
                    if (currentDimensions.length < 10) {
                      setValue('roomDimensions', [
                        ...currentDimensions,
                        {
                          id: `room_${Date.now()}`,
                          roomName: '',
                          length: '',
                          width: '',
                          unit: 'feet',
                        },
                      ], { shouldValidate: true });
                    }
                  }}
                  disabled={(watch('roomDimensions') || []).length >= 10}
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Room
                </Button>
              </div>

              {(watch('roomDimensions') || []).length === 0 && (
                <p className="text-sm text-muted-foreground italic py-2 px-3 border-2 border-dashed rounded-md">
                  No room dimensions added. Click &quot;Add Room&quot; to specify dimensions for individual rooms.
                </p>
              )}

              <div className="space-y-3">
                {(watch('roomDimensions') || []).map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 border-2 rounded-lg bg-muted/30"
                  >
                    <div className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-12 md:col-span-4">
                        <Controller
                          name={`roomDimensions.${index}.roomName`}
                          control={control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs">Room Name</FieldLabel>
                              <Input
                                {...field}
                                placeholder="e.g., Master Bedroom"
                                className="h-9 text-sm border-2 focus:border-orange-500"
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                      </div>

                      <div className="col-span-4 md:col-span-3">
                        <Controller
                          name={`roomDimensions.${index}.length`}
                          control={control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs">Length</FieldLabel>
                              <Input
                                {...field}
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="12"
                                className="h-9 text-sm border-2 focus:border-orange-500"
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                      </div>

                      <div className="col-span-4 md:col-span-3">
                        <Controller
                          name={`roomDimensions.${index}.width`}
                          control={control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs">Width</FieldLabel>
                              <Input
                                {...field}
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="10"
                                className="h-9 text-sm border-2 focus:border-orange-500"
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                      </div>

                      <div className="col-span-3 md:col-span-1">
                        <Controller
                          name={`roomDimensions.${index}.unit`}
                          control={control}
                          render={({ field }) => (
                            <Field>
                              <FieldLabel className="text-xs">Unit</FieldLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="h-9 text-sm border-2 focus:border-orange-500">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="feet">Feet</SelectItem>
                                  <SelectItem value="meters">Meters</SelectItem>
                                </SelectContent>
                              </Select>
                            </Field>
                          )}
                        />
                      </div>

                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const currentDimensions = watch('roomDimensions');
                            setValue(
                              'roomDimensions',
                              currentDimensions.filter((_, i) => i !== index),
                              { shouldValidate: true }
                            );
                          }}
                          className="h-9 w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Field>
          </motion.div>

          {/* Additional Rooms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Field>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <FieldLabel className="font-semibold">Additional Rooms</FieldLabel>
                  <FieldDescription>
                    Add other rooms in your property (optional, max 10 rooms)
                  </FieldDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentRooms = watch('additionalRooms') || [];
                    if (currentRooms.length < 10) {
                      setValue('additionalRooms', [
                        ...currentRooms,
                        {
                          id: `additional_${Date.now()}`,
                          type: '',
                          count: '',
                        },
                      ], { shouldValidate: true });
                    }
                  }}
                  disabled={(watch('additionalRooms') || []).length >= 10}
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Room
                </Button>
              </div>

              {(watch('additionalRooms') || []).length === 0 && (
                <p className="text-sm text-muted-foreground italic py-2 px-3 border-2 border-dashed rounded-md">
                  No additional rooms added. Click &quot;Add Room&quot; to include balcony, study room, etc.
                </p>
              )}

              <div className="space-y-3">
                {(watch('additionalRooms') || []).map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 border-2 rounded-lg bg-muted/30"
                  >
                    <div className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-6">
                        <Controller
                          name={`additionalRooms.${index}.type`}
                          control={control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs">Room Type</FieldLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="h-9 text-sm border-2 focus:border-orange-500">
                                  <SelectValue placeholder="Select room type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {additionalRoomOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
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
                      </div>

                      <div className="col-span-5">
                        <Controller
                          name={`additionalRooms.${index}.count`}
                          control={control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs">Count</FieldLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={!room.type}
                              >
                                <SelectTrigger className="h-9 text-sm border-2 focus:border-orange-500">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5].map((num) => (
                                    <SelectItem key={num} value={String(num)}>
                                      {num}
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
                      </div>

                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const currentRooms = watch('additionalRooms');
                            setValue(
                              'additionalRooms',
                              currentRooms.filter((_, i) => i !== index),
                              { shouldValidate: true }
                            );
                          }}
                          className="h-9 w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
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
