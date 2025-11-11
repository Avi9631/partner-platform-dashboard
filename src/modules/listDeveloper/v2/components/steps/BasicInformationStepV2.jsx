import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { Building2, Calendar, Globe, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { useDeveloperFormV2 } from '../../context/DeveloperFormContextV2';
import basicInformationSchema from '../../../schemas/basicInformationSchema';
import SaveAndContinueFooter from '../SaveAndContinueFooter';

export default function BasicInformationStepV2() {
  const { saveAndContinue, previousStep, formData } = useDeveloperFormV2();

  const form = useForm({
    resolver: zodResolver(basicInformationSchema),
    mode: 'onChange',
    defaultValues: {
      developerName: formData?.developerName || '',
      brandName: formData?.brandName || '',
      establishedYear: formData?.establishedYear || '',
      website: formData?.website || '',
      description: formData?.description || '',
    },
  });

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
          Basic Information
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Tell us about your developer profile and business
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            {/* Developer Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Controller
                name="developerName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-orange-600" />
                      Developer/Company Name <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      placeholder="e.g., ABC Developers Pvt Ltd"
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

            {/* Brand Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Controller
                name="brandName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Brand Name <span className="text-xs text-muted-foreground">(Optional)</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      placeholder="e.g., ABC Homes"
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

            {/* Established Year & Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Controller
                  name="establishedYear"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        Established Year <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        type="text"
                        placeholder="e.g., 2010"
                        maxLength={4}
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

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Controller
                  name="website"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-orange-600" />
                        Website <span className="text-xs text-muted-foreground">(Optional)</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://www.example.com"
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

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-orange-600" />
                      Company Description <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Textarea
                      {...field}
                      rows={6}
                      placeholder="Provide a detailed description of your company, expertise, achievements, and core values..."
                      className={`text-sm border-2 focus:border-orange-500 transition-all resize-none ${
                        fieldState.invalid ? 'border-red-500' : ''
                      }`}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      <p className="text-xs text-muted-foreground ml-auto">
                        {field.value?.length || 0}/1000 characters
                      </p>
                    </div>
                  </Field>
                )}
              />
            </motion.div>
          </FieldGroup>

          {/* Save & Continue Footer */}
          <SaveAndContinueFooter
            onBack={previousStep}
            nextDisabled={!form.formState.isValid}
            showBack={true}
          />
        </form>
      </motion.div>
    </div>
  );
}
