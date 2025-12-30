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
import { Combobox } from "@/components/ui/combobox";
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
import { createStepLogger } from "../../../../listProperty/utils/validationLogger";

export default function BasicDetailsPgStep() {
  const { saveAndContinue, formData, setPropertyType, setCurrentStepSubmitHandler } = usePgFormV2();
 
  const logger = useMemo(
    () => createStepLogger("Basic Details PG Step V2"),
    []
  );

  // Popular PG/Hostel brand names
  const brandOptions = useMemo(() => [
    { label: "Zostel", value: "Zostel" },
    { label: "OYO Life", value: "OYO Life" },
    { label: "Stanza Living", value: "Stanza Living" },
    { label: "Your Space", value: "Your Space" },
    { label: "Settle", value: "Settle" },
    { label: "CoHo", value: "CoHo" },
    { label: "Zolo", value: "Zolo" },
    { label: "NestAway", value: "NestAway" },
    { label: "Oxfordcaps", value: "Oxfordcaps" },
    { label: "Colive", value: "Colive" },
    { label: "HelloWorld", value: "HelloWorld" },
    { label: "HostelPass", value: "HostelPass" },
  ], []);

  const form = useForm({
    resolver: zodResolver(basicDetailsPgSchema),
    mode: "onChange",
    defaultValues: {
      // Main property details
      propertyName: formData?.propertyName || formData?.title || "",
       genderAllowed: formData?.genderAllowed || "Gents",

      // Description object
      description: formData?.description || "",

      // Brand management
      isBrandManaged:
        formData?.isBrandManaged || formData?.managedByBrand || false,
      brandName: formData?.brandName || "",
 
  

    },
  });

 
  // Log validation errors
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      logger.logErrors(form.formState.errors);
    }
  }, [form.formState.errors, logger]);

  // Register submit handler with context
  useEffect(() => {
    setCurrentStepSubmitHandler(() => form.handleSubmit(onSubmit));
  }, [form.handleSubmit]);
 
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
        <h2 className="text-2xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
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
                name="genderAllowed"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-600" />
                      Gender Allowed <span className="text-red-500">*</span>
                    </FieldLabel>
                    <div className="grid grid-cols-3 gap-2">
                      {["Gents", "Ladies", "Unisex"].map(
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
                            {type === "Unisex"
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
                        <Combobox
                          options={brandOptions}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select or type brand name..."
                          searchPlaceholder="Search brand..."
                          emptyText="No brand found."
                          allowCustom={true}
                          className={fieldState.invalid ? "border-red-500" : ""}
                        />
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <p className="text-xs text-muted-foreground mt-1">
                            Select from the list or type a custom brand name and press Enter
                          </p>
                        )}
                      </Field>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
