import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { Compass, Eye, MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import locationAttributesSchema from '../../../schemas/locationAttributesSchema';
import SaveAndContinueFooter from '../SaveAndContinueFooter';

const facingOptions = [
  'East',
  'West',
  'North',
  'South',
  'North-East',
  'North-West',
  'South-East',
  'South-West',
];

const viewOptions = [
  'Garden View',
  'Road View',
  'Park View',
  'Club View',
  'City View',
  'Pool View',
  'Sea View',
];

const propertyPositionOptions = [
  { value: 'corner', label: 'Corner Property', description: 'Property located at a corner' },
  { value: 'middle', label: 'Middle Unit', description: 'Property between other units' },
  { value: 'end', label: 'End Unit', description: 'Property at the end of a row' },
  { value: 'standalone', label: 'Standalone', description: 'Independent property with no attached units' },
  { value: 'front_facing', label: 'Front Facing', description: 'Property facing the main street/entrance' },
  { value: 'rear', label: 'Rear Unit', description: 'Property at the back of the complex' },
];

export default function LocationStepV2() {
  const { saveAndContinue, previousStep, formData } = usePropertyFormV2();

  const methods = useForm({
    resolver: zodResolver(locationAttributesSchema),
    mode: 'onChange',
    defaultValues: {
      facing: formData?.facing || '',
      view: formData?.view || '',
      propertyPosition: formData?.propertyPosition || '',
     },
    reValidateMode: 'onChange',
  });

  const { watch, setValue, handleSubmit, formState, trigger } = methods;

  // Trigger validation on mount to ensure form state is correct
  useEffect(() => {
    trigger();
  }, [trigger]);

  // Debug: Log form state changes
  useEffect(() => {
    console.log('Form State:', {
      isValid: formState.isValid,
      errors: formState.errors,
      values: watch(),
    });
  }, [formState.isValid, formState.errors, watch]);

  const onSubmit = (data) => {
    console.log('Form submitted with data:', data);
    saveAndContinue(data);
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="pb-24">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Location Attributes
              </h2>
              <p className="text-muted-foreground text-sm">
                Specify the facing direction and view of your property
              </p>
            </motion.div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Facing Direction */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label className="text-sm flex items-center gap-2">
                    <Compass className="w-4 h-4 text-orange-600" />
                    Facing Direction <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch('facing')}
                    onValueChange={(value) => setValue('facing', value, { shouldValidate: true })}
                  >
                    <SelectTrigger className="h-11 text-sm border-2 focus:border-orange-500">
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent>
                      {facingOptions.map((dir) => (
                        <SelectItem key={dir} value={dir.toLowerCase()}>
                          {dir}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Direction the main entrance faces
                  </p>
                </motion.div>

                {/* View */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label className="text-sm flex items-center gap-2">
                    <Eye className="w-4 h-4 text-orange-600" />
                    View <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch('view')}
                    onValueChange={(value) => setValue('view', value, { shouldValidate: true })}
                  >
                    <SelectTrigger className="h-11 text-sm border-2 focus:border-orange-500">
                      <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                      {viewOptions.map((view) => (
                        <SelectItem
                          key={view}
                          value={view.toLowerCase().replace(' ', '_')}
                        >
                          {view}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Primary view from the property
                  </p>
                </motion.div>
              </div>

              {/* Corner Property */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label className="text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  Property Position <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch('propertyPosition')}
                  onValueChange={(value) => setValue('propertyPosition', value, { shouldValidate: true })}
                >
                  <SelectTrigger className="h-11 text-sm border-2 focus:border-orange-500">
                    <SelectValue placeholder="Select property position" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyPositionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Position of the property within the building or layout
                </p>
              </motion.div>

     

              {/* Info Box */}
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
              >
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <span className="font-semibold">💡 Tip:</span> East and North-facing properties are often preferred for better natural light and ventilation.
                </p>
              </motion.div> */}
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <SaveAndContinueFooter
            onBack={previousStep}
            nextDisabled={!formState.isValid}
            showBack={true}
          />
        </form>
      </div>
    </FormProvider>
  );
}
