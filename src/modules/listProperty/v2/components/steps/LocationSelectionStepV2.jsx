import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import { useEffect, useCallback } from 'react';
import { Switch } from '@/components/ui/switch';
import {
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import locationSelectionSchema from '../../../schemas/locationSelectionSchema';
import SaveAndContinueFooter from '../SaveAndContinueFooter';
import LocationPicker from '@/components/maps/LocationPicker';

export default function LocationSelectionStepV2() {
  const { saveAndContinue, previousStep, formData, setCurrentStepSubmitHandler, setCurrentStepIsValid } = usePropertyFormV2();

  // Initialize React Hook Form with Zod validation
  // Default values defined here, populated from context if previously saved
  const form = useForm({
    resolver: zodResolver(locationSelectionSchema),
    mode: 'onChange',
    defaultValues: {
      coordinates: formData?.coordinates || null,
      showMapExact: formData?.showMapExact || false,
      city: formData?.city || '',
      locality: formData?.locality || '',
      addressText: formData?.addressText || '',
      landmark: formData?.landmark || '',
    },
  });

  // Handle form submission - update context only on save & continue
  const onSubmit = useCallback((data) => {
    // Pass step data to context to update formData JSON
    saveAndContinue(data);
  }, [saveAndContinue]);

  // Register submit handler with context
  useEffect(() => {
    setCurrentStepSubmitHandler(() => form.handleSubmit(onSubmit));
    return () => setCurrentStepSubmitHandler(null);
  }, [form, onSubmit, setCurrentStepSubmitHandler]);

  // Track validation state
  useEffect(() => {
    setCurrentStepIsValid(form.formState.isValid);
  }, [form.formState.isValid, setCurrentStepIsValid]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 md:mb-6"
      >
        <h2 className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Pin Your Property Location
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Select the exact location of your property on the map
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Location Picker with Map */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="space-y-3">
              <FieldLabel className="flex items-center gap-2 text-base">
                <MapPin className="w-5 h-5 text-orange-600" />
                Property Location <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldDescription className="text-sm">
                Search for your property address or click on the map to mark the exact location. 
                The system will automatically extract city, locality, address, and landmark details.
              </FieldDescription>
              
              <Controller
                name="coordinates"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <LocationPicker
                      value={field.value ? {
                        coordinates: field.value,
                        formattedAddress: form.watch('addressText'),
                        city: form.watch('city'),
                        locality: form.watch('locality'),
                      } : null}
                      onChange={(locationData) => {
                        if (locationData) {
                          field.onChange(locationData.coordinates);
                          
                          // Auto-populate address fields from map selection
                          if (locationData.city) {
                            form.setValue('city', locationData.city, { shouldValidate: true, shouldDirty: true });
                          }
                          if (locationData.locality) {
                            form.setValue('locality', locationData.locality, { shouldValidate: true, shouldDirty: true });
                          }
                          if (locationData.formattedAddress) {
                            form.setValue('addressText', locationData.formattedAddress, { shouldValidate: true, shouldDirty: true });
                          }
                          if (locationData.landmark) {
                            form.setValue('landmark', locationData.landmark, { shouldValidate: true, shouldDirty: true });
                          }
                        } else {
                          field.onChange(null);
                        }
                      }}
                      height="400px"
                    />
                    {fieldState.invalid && (
                      <p className="text-sm text-red-500 mt-2">
                        Please select a location on the map
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </motion.div>

          {/* Auto-populated address preview */}
          {/* {form.watch('coordinates') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
            >
              <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
                ✓ Location Selected
              </p>
              <div className="space-y-1 text-xs text-green-800 dark:text-green-200">
                {form.watch('city') && (
                  <p><span className="font-medium">City:</span> {form.watch('city')}</p>
                )}
                {form.watch('locality') && (
                  <p><span className="font-medium">Locality:</span> {form.watch('locality')}</p>
                )}
                {form.watch('addressText') && (
                  <p><span className="font-medium">Address:</span> {form.watch('addressText')}</p>
                )}
                {form.watch('landmark') && (
                  <p><span className="font-medium">Landmark:</span> {form.watch('landmark')}</p>
                )}
              </div>
            </motion.div>
          )} */}

          {/* Show Exact Location Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Controller
              name="showMapExact"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border-2 border-muted">
                  <div>
                    <FieldLabel className="font-semibold">Show Exact Location on Map</FieldLabel>
                    <FieldDescription className="text-xs mt-1">
                      Display precise property location to interested buyers
                    </FieldDescription>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
          >
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <span className="font-semibold">💡 Tip:</span> Accurate location helps buyers find your property easily. 
              You can search by address or drag the map marker to adjust the position.
            </p>
          </motion.div>

        </form>
      </motion.div>
    </div>
  );
}


