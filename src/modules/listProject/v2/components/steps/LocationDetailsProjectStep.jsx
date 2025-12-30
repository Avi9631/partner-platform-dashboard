import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import {
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { useProjectFormV2 } from "../../context/ProjectFormContextV2";
import locationDetailsProjectSchema from "../../../schemas/locationDetailsProjectSchema";
import LocationPicker from "@/components/maps/LocationPicker";

export default function LocationDetailsProjectStep() {
  const { saveAndContinue, formData, setCurrentStepSubmitHandler } = useProjectFormV2();

  const form = useForm({
    resolver: zodResolver(locationDetailsProjectSchema),
    mode: "onChange",
    defaultValues: {
      coordinates: formData?.coordinates || null,
      city: formData?.city || '',
      locality: formData?.locality || '',
      addressText: formData?.addressText || '',
      landmark: formData?.landmark || '',
    },
  });

  const onSubmit = (data) => {
    saveAndContinue(data);
  };

  // Register submit handler with context
  useEffect(() => {
    setCurrentStepSubmitHandler(() => form.handleSubmit(onSubmit));
  }, [form.handleSubmit, setCurrentStepSubmitHandler]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-6"
      >
        <h2 className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
          <MapPin className="w-6 h-6 md:w-8 md:h-8" />
          Location Details
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Select the exact location of your project on the map
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-6 pb-24">
          {/* Map Location Picker */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="space-y-3">
              <FieldLabel className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Pin Project Location <span className="text-red-500">*</span>
              </FieldLabel>
              <FieldDescription className="text-sm">
                Search for your project address or click on the map to mark the exact location. 
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
                      height="500px"
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
        </div>
      </motion.div>
    </div>
  );
}