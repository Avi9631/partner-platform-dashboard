import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Building2, Calendar, FileText, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useDeveloperFormV2 } from "../../context/DeveloperFormContextV2";
import { basicInfoSchema } from "../../../schemas/basicInfoSchema";
import SaveAndContinueFooter from "../SaveAndContinueFooter";

export default function BasicInfoStepV2() {
  const { formData, saveAndContinue, previousStep, currentStep } =
    useDeveloperFormV2();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: formData || {},
  });

  // Sync form with context data when available
  useEffect(() => {
    if (formData) {
      Object.keys(formData).forEach((key) => {
        setValue(key, formData[key]);
      });
    }
  }, [formData, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await saveAndContinue(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const developerTypes = [
    "International Developer",
    "National Developer",
    "Regional Developer",
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border-orange-200 dark:border-orange-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Building2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Developer Information
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tell us about your company and what makes you unique
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Developer Name */}
            <Controller
              name="developerName"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Developer Name
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g., Prestige Group"
                    className={`h-11 text-sm border-2 focus:border-orange-500 transition-all ${
                      fieldState.invalid ? "border-red-500" : ""
                    }`}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Developer Type */}
            <Controller
              name="developerType"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Developer Type
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={`h-11 text-sm border-2 focus:border-orange-500 transition-all ${
                        fieldState.invalid ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select developer type" />
                    </SelectTrigger>
                    <SelectContent>
                      {developerTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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

            {/* Established Year */}
            <Controller
              name="establishedYear"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Established Year
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    placeholder="e.g., 1986"
                    min="1900"
                    max={new Date().getFullYear()}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    className={`h-11 text-sm border-2 focus:border-orange-500 transition-all ${
                      fieldState.invalid ? "border-red-500" : ""
                    }`}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Company Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    placeholder="Brief description of your company, values, and vision..."
                    rows={5}
                    className={`text-sm border-2 focus:border-orange-500 transition-all ${
                      fieldState.invalid ? "border-red-500" : ""
                    }`}
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Minimum 50 characters to help potential clients understand your
                      business better
                    </p>
                  )}
                </Field>
              )}
            />

            {/* Registration Number */}
            <Controller
              name="registrationNumber"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Company Registration Number
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g., CIN: U12345AB1986PLC123456"
                    className={`h-11 text-sm border-2 focus:border-orange-500 transition-all ${
                      fieldState.invalid ? "border-red-500" : ""
                    }`}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <SaveAndContinueFooter
        onBack={previousStep}
        showBack={currentStep > 0}
        isLoading={isSubmitting}
        loadingText="Saving..."
      />
    </form>
  );
}
