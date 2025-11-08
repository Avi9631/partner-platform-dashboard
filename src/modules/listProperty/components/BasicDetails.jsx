import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { MapPin, Building2, Calendar, Home, FileText, Map } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
import { useFormContext } from 'react-hook-form';
import { usePropertyForm } from '../context/PropertyFormContext';
import basicDetailsSchema from '../schemas/basicDetailsSchema';

export default function BasicDetails({ isSheetMode = false }) {
  const formMethods = useFormContext();
  const { nextStep, previousStep, updateStepValidation, setOpenSection } = usePropertyForm();

  // Initialize React Hook Form with Zod validation
  const form = useForm({
    resolver: zodResolver(basicDetailsSchema),
    mode: 'onChange',
    defaultValues: {
      ownershipType: formMethods.watch('ownershipType') || 'freehold',
      projectName: formMethods.watch('projectName') || '',
      reraId: formMethods.watch('reraId') || '',
      city: formMethods.watch('city') || '',
      locality: formMethods.watch('locality') || '',
      addressText: formMethods.watch('addressText') || '',
      landmark: formMethods.watch('landmark') || '',
      showMapExact: formMethods.watch('showMapExact') || false,
      ageOfProperty: formMethods.watch('ageOfProperty') || '',
      possessionStatus: formMethods.watch('possessionStatus') || 'ready',
      possessionDate: formMethods.watch('possessionDate') || '',
    },
  });

  // Update step validation when form validity changes
  useEffect(() => {
    updateStepValidation(1, form.formState.isValid);
  }, [form.formState.isValid, updateStepValidation]);

  // Handle form submission
  const onSubmit = (data) => {
    // Update the main form context
    Object.keys(data).forEach((key) => {
      formMethods.setValue(key, data[key]);
    });
    
    if (isSheetMode) {
      // Close the sheet when in sheet mode
      setOpenSection(null);
    } else {
      // Continue to next step in wizard mode
      nextStep();
    }
  };

  return (
    <div className="w-full ">
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
        <div className="">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              {/* Ownership Type */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Controller
                  name="ownershipType"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Ownership Type <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className={`h-10 text-sm border-2 ${
                          fieldState.invalid ? 'border-red-500' : ''
                        }`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="freehold">Freehold</SelectItem>
                          <SelectItem value="leasehold">Leasehold</SelectItem>
                          <SelectItem value="poa">Power of Attorney (POA)</SelectItem>
                          <SelectItem value="co_operative">Co-operative Society</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </motion.div>

              {/* Project Name & RERA ID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Name (Optional) */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Controller
                    name="projectName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-orange-600" />
                          Project Name <span className="text-xs text-muted-foreground">(Optional)</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          placeholder="e.g., Green Valley Apartments"
                          className="h-10 text-sm border-2 focus:border-orange-500 transition-all"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </motion.div>

                {/* RERA ID */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <Controller
                    name="reraId"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-orange-600" />
                          RERA Registration No. <span className="text-xs text-muted-foreground">(If applicable)</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          placeholder="e.g., RERA123456"
                          className="h-10 text-sm border-2 focus:border-orange-500 transition-all"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </motion.div>
              </div>

              {/* City & Locality */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* City */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Controller
                    name="city"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-orange-600" />
                          City <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          placeholder="Enter city name"
                          className={`h-10 text-sm border-2 focus:border-orange-500 transition-all ${
                            fieldState.invalid ? 'border-red-500' : ''
                          }`}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </motion.div>

                {/* Locality / Sector */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <Controller
                    name="locality"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>
                          Locality / Sector <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          placeholder="e.g., Sector 62, Jubilee Hills"
                          className={`h-10 text-sm border-2 focus:border-orange-500 transition-all ${
                            fieldState.invalid ? 'border-red-500' : ''
                          }`}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </motion.div>
              </div>

              {/* Full Address */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Controller
                  name="addressText"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-orange-600" />
                        Full Address <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Textarea
                        {...field}
                        placeholder="House/Flat No., Street, Locality, Landmark"
                        className={`min-h-[60px] text-sm border-2 focus:border-orange-500 transition-all ${
                          fieldState.invalid ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </motion.div>

              {/* Landmark */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 }}
              >
                <Controller
                  name="landmark"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="flex items-center gap-2">
                        <Map className="w-4 h-4 text-orange-600" />
                        Nearby Landmark
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="e.g., Near City Mall, Opposite Metro Station"
                        className="h-10 text-sm border-2 focus:border-orange-500 transition-all"
                      />
                      <FieldDescription>
                        Helps buyers locate your property easily
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </motion.div>

              {/* Show Exact Location Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
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

              {/* Age of Property & Possession Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age of Property */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Controller
                    name="ageOfProperty"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-600" />
                          Age of Property (years) <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          placeholder="e.g., 2"
                          className={`h-10 text-sm border-2 focus:border-orange-500 transition-all ${
                            fieldState.invalid ? 'border-red-500' : ''
                          }`}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </motion.div>

                {/* Possession Status */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Controller
                    name="possessionStatus"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>
                          Possession Status <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className={`h-10 text-sm border-2 ${
                            fieldState.invalid ? 'border-red-500' : ''
                          }`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ready">Ready to Move</SelectItem>
                            <SelectItem value="under_construction">Under Construction</SelectItem>
                            <SelectItem value="resale">Resale</SelectItem>
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

              {/* Possession Date (if under construction) */}
              {form.watch('possessionStatus') === 'under_construction' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Controller
                    name="possessionDate"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>
                          Expected Possession Date <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          type="date"
                          className={`h-10 text-sm border-2 focus:border-orange-500 transition-all ${
                            fieldState.invalid ? 'border-red-500' : ''
                          }`}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </motion.div>
              )}
            </FieldGroup>

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-between pt-4"
            >
              {!isSheetMode && (
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
              )}
              {isSheetMode && (
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() => setOpenSection(null)}
                  className="px-6 border-orange-200 hover:bg-orange-50 hover:border-orange-500 dark:border-orange-800 dark:hover:bg-orange-950/30"
                >
                  Cancel
                </Button>
              )}
              <Button
                size="default"
                type="submit"
                disabled={!form.formState.isValid}
                className="px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30"
              >
                {isSheetMode ? 'Save' : 'Continue'}
                {!isSheetMode && (
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
                )}
              </Button>
            </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    );
}
