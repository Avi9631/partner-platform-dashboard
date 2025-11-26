import { useEffect, useMemo, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Users,
  FileText,
  Building2,
  Calendar,
  Plus,
  X,
  Award,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePgFormV2 } from "../../context/PgFormContextV2";
import basicDetailsPgSchema from "../../../schemas/basicDetailsPgSchema";
import SaveAndContinueFooter from "./SaveAndContinueFooter";
import { createStepLogger } from "../../../../listProperty/utils/validationLogger";

export default function BasicDetailsPgStep() {
  const { saveAndContinue, formData, setPropertyType } = usePgFormV2();
 
  const logger = useMemo(
    () => createStepLogger("Basic Details PG Step V2"),
    []
  );

  const form = useForm({
    resolver: zodResolver(basicDetailsPgSchema),
    mode: "onChange",
    defaultValues: {
      // Main property details
      propertyName: formData?.propertyName || formData?.title || "",
      propertyType: formData?.propertyType || "PG / Hostel",
      genderAllowed: formData?.genderAllowed || "Gents",

      // Description object
      description: formData?.description || "",

      // Brand management
      isBrandManaged:
        formData?.isBrandManaged || formData?.managedByBrand || false,
      brandName: formData?.brandName || "",

      // Property age
      yearBuilt: formData?.yearBuilt || "",
      lastRenovated: formData?.lastRenovated || "",
 

    },
  });

  // Watch property type to update context
  const watchedPropertyType = form.watch("propertyType");
  useEffect(() => {
    if (watchedPropertyType) {
      setPropertyType(watchedPropertyType);
    }
  }, [watchedPropertyType, setPropertyType]);

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
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Basic Property Information
        </h2>
  
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
          {/* Basic Property Details */}

          <div className="space-y-6">
            {/* Property Name */}
            <Controller
              name="propertyName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Property Name</FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g., Sky View PG & Hostel"
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

            {/* Property Type & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="propertyType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-orange-600" />
                      Property Type <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={`h-11 text-sm border-2 ${
                          fieldState.invalid ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PG / Hostel">PG / Hostel</SelectItem>
                        <SelectItem value="PG">PG (Paying Guest)</SelectItem>
                        <SelectItem value="Hostel">Hostel</SelectItem>
                        <SelectItem value="Co-living">
                          Co-living Space
                        </SelectItem>
                        <SelectItem value="Rooms">Rooms</SelectItem>
                        <SelectItem value="Service Apartment">
                          Service Apartment
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="genderAllowed"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-600" />
                      Gender Allowed <span className="text-red-500">*</span>
                    </FieldLabel>
                    <div className="grid grid-cols-3 gap-2">
                      {["Gents", "Ladies", "Gents / Ladies / Unisex"].map(
                        (type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => field.onChange(type)}
                            className={`p-3 border-2 rounded-lg text-xs font-medium transition-all ${
                              field.value === type
                                ? "border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400 scale-105"
                                : "border-muted hover:border-orange-500/50 hover:scale-105"
                            }`}
                          >
                            {type === "Gents / Ladies / Unisex"
                              ? "Unisex"
                              : type}
                          </button>
                        )
                      )}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Descriptions */}
            <div className="space-y-6">
  

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Description{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Textarea
                      {...field}
                      placeholder="Provide detailed information about your property, facilities, nearby places, etc. (50-2000 characters)"
                      className={`min-h-[150px] text-sm border-2 focus:border-orange-500 transition-all ${
                        fieldState.invalid ? "border-red-500" : ""
                      }`}
                      maxLength={2000}
                    />
                    <div className="flex items-center justify-between mt-1">
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Include details about location, amenities, rules
                        </p>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {field.value?.length || 0}/2000
                      </span>
                    </div>
                  </Field>
                )}
              />
            </div>

 
          </div>

          {/* Brand Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border-2 rounded-lg hover:border-orange-500 transition-colors">
              <div>
                <Label
                  htmlFor="isBrandManaged"
                  className="text-sm font-semibold cursor-pointer"
                >
                  Managed by Brand?
                </Label>
                <p className="text-xs text-muted-foreground">
                  Is this property managed by a brand/chain?
                </p>
              </div>
              <Controller
                name="isBrandManaged"
                control={form.control}
                render={({ field }) => (
                  <Switch
                    id="isBrandManaged"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            <AnimatePresence>
              {form.watch("isBrandManaged") && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <Controller
                    name="brandName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>
                          Brand Name <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          placeholder="e.g., Zostel, OYO Life, Sky Living"
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Property Age */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="yearBuilt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    Year Built
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g., 2019"
                    className={`h-11 text-sm border-2 focus:border-orange-500 transition-all ${
                      fieldState.invalid ? "border-red-500" : ""
                    }`}
                    maxLength={4}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="lastRenovated"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Last Renovated</FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g., 2024"
                    className={`h-11 text-sm border-2 focus:border-orange-500 transition-all ${
                      fieldState.invalid ? "border-red-500" : ""
                    }`}
                    maxLength={4}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
  
 
 

          {/* Save & Continue Footer */}
          <SaveAndContinueFooter
            onSaveAndContinue={form.handleSubmit(onSubmit)}
            nextDisabled={!form.formState.isValid}
            showBack={false}
          />
        </form>
      </motion.div>
    </div>
  );
}
