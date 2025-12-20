import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import {
  Building2,
  Calendar,
  FileText,
  Hash,
  Home,
  MapPin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjectFormV2 } from "../../context/ProjectFormContextV2";
import basicDetailsProjectSchema from "../../../schemas/basicDetailsProjectSchema";
import SaveAndContinueFooter from "./SaveAndContinueFooter";
import { createStepLogger } from "../../../../listProperty/utils/validationLogger";

export default function BasicDetailsProjectStep() {
  const { saveAndContinue, formData, goToPreviousStep, currentStep } = useProjectFormV2();
  
  const logger = useMemo(
    () => createStepLogger("Basic Details Project Step V2"),
    []
  );

  const form = useForm({
    resolver: zodResolver(basicDetailsProjectSchema),
    mode: "onChange",
    defaultValues: {
      projectName: formData?.projectName || "",
      developerName: formData?.developerName || "",
      projectType: formData?.projectType || "",
      projectStatus: formData?.projectStatus || "",
      reraNumber: formData?.reraNumber || "",
      launchDate: formData?.launchDate || "",
      possessionDate: formData?.possessionDate || "",
      totalProjectArea: formData?.totalProjectArea || "",
      projectAreaUnit: formData?.projectAreaUnit || "Acres",
      numberOfTowers: formData?.numberOfTowers || undefined,
      totalUnits: formData?.totalUnits || undefined,
      description: formData?.description || "",
    },
  });

  // Log validation errors
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      logger.logErrors(form.formState.errors);
    }
  }, [form.formState.errors, logger]);

  const onSubmit = (data) => {
    logger.logSubmission(data, form.formState.errors);
    saveAndContinue(data);
  };

  const onError = (errors) => {
    logger.logSubmission(form.getValues(), errors);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Basic Project Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Enter the essential details about your real estate project
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-8"
        >
          {/* Project Name & Developer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="projectName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-orange-600" />
                    Project Name <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g., Sky Heights Residency"
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

            <Controller
              name="developerName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-orange-600" />
                    Developer/Builder Name <span className="text-red-500">*</span>
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
          </div>

          {/* Project Type & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="projectType"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-orange-600" />
                    Project Type <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residential Apartment">Residential Apartment</SelectItem>
                      <SelectItem value="Villa/Independent House">Villa/Independent House</SelectItem>
                      <SelectItem value="Plotted Development">Plotted Development</SelectItem>
                      <SelectItem value="Commercial Office">Commercial Office</SelectItem>
                      <SelectItem value="Commercial Shop/Showroom">Commercial Shop/Showroom</SelectItem>
                      <SelectItem value="Commercial Mall">Commercial Mall</SelectItem>
                      <SelectItem value="Mixed Use Development">Mixed Use Development</SelectItem>
                      <SelectItem value="Township">Township</SelectItem>
                      <SelectItem value="Farm House">Farm House</SelectItem>
                      <SelectItem value="Studio Apartment">Studio Apartment</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="projectStatus"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    Project Status <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select project status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Upcoming">Upcoming</SelectItem>
                      <SelectItem value="Under Construction">Under Construction</SelectItem>
                      <SelectItem value="Ready to Move">Ready to Move</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* RERA Number */}
          <Controller
            name="reraNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-orange-600" />
                  RERA Registration Number <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="e.g., MH-ABC-2024-12345"
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

          {/* Launch Date & Possession Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="launchDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    Launch Date
                  </FieldLabel>
                  <Input
                    {...field}
                    type="date"
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

            <Controller
              name="possessionDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    Possession Date
                  </FieldLabel>
                  <Input
                    {...field}
                    type="date"
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

          {/* Total Project Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Controller
                name="totalProjectArea"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      Total Project Area
                    </FieldLabel>
                    <Input
                      {...field}
                      placeholder="e.g., 25"
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

            <Controller
              name="projectAreaUnit"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Unit</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Acres">Acres</SelectItem>
                      <SelectItem value="Hectares">Hectares</SelectItem>
                      <SelectItem value="Sq.ft">Sq.ft</SelectItem>
                      <SelectItem value="Sq.m">Sq.m</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Number of Towers & Total Units */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="numberOfTowers"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-orange-600" />
                    Number of Towers/Blocks
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    placeholder="e.g., 5"
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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

            <Controller
              name="totalUnits"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-orange-600" />
                    Total Units
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    placeholder="e.g., 450"
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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

          {/* Description */}
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-600" />
                  Project Description <span className="text-red-500">*</span>
                </FieldLabel>
                <Textarea
                  {...field}
                  placeholder="Describe your project in detail..."
                  rows={6}
                  className={`text-sm border-2 focus:border-orange-500 transition-all ${
                    fieldState.invalid ? "border-red-500" : ""
                  }`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {field.value?.length || 0} / 3000 characters (minimum 100)
                </p>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <SaveAndContinueFooter
            onBack={goToPreviousStep}
            showBack={currentStep > 0}
          />
        </form>
      </motion.div>
    </div>
  );
}
