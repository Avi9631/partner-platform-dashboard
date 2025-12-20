import { motion } from "motion/react";
import { Home, Plus, Trash2, Settings } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useProjectFormV2 } from "../../context/ProjectFormContextV2";
import configurationsProjectSchema, { PROPERTY_CATEGORY } from "../../../schemas/configurationsProjectSchema";
import SaveAndContinueFooter from "./SaveAndContinueFooter";
import { 
  getConfigurationTypeOptions, 
  getDefaultConfigValues,
  getPropertyCategory,
  formatConfigurationName,
} from "../../../schemas/configurationHelpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

// Import configuration field components
import ResidentialApartmentFields from "../configuration/ResidentialApartmentFields";
import ResidentialIndependentFields from "../configuration/ResidentialIndependentFields";
import PlotFields from "../configuration/PlotFields";
import FarmFields from "../configuration/FarmFields";
import CommercialFields from "../configuration/CommercialFields";

export default function ConfigurationsProjectStep() {
  const { saveAndContinue, formData, goToPreviousStep, currentStep } = useProjectFormV2();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const form = useForm({
    resolver: zodResolver(configurationsProjectSchema),
    mode: "onChange",
    defaultValues: formData || { configurations: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "configurations",
  });

  const onSubmit = (data) => {
    console.log("Configuration data:", data);
    saveAndContinue(data);
  };

  const addConfiguration = (configurationType) => {
    const defaultValues = getDefaultConfigValues(configurationType);
    append(defaultValues);
    // Auto-open sheet for newly added config
    setEditingIndex(fields.length);
    setSheetOpen(true);
  };

  const openEditSheet = (index) => {
    setEditingIndex(index);
    setSheetOpen(true);
  };

  const closeSheet = () => {
    setSheetOpen(false);
    setEditingIndex(null);
  };

  const renderConfigurationFields = (index, configurationType) => {
    const category = getPropertyCategory(configurationType);

    switch (category) {
      case PROPERTY_CATEGORY.RESIDENTIAL_APARTMENT:
        return <ResidentialApartmentFields control={form.control} index={index} />;
      
      case PROPERTY_CATEGORY.RESIDENTIAL_INDEPENDENT:
        return <ResidentialIndependentFields control={form.control} index={index} />;
      
      case PROPERTY_CATEGORY.PLOT:
        return <PlotFields control={form.control} index={index} />;
      
      case PROPERTY_CATEGORY.FARM:
        return <FarmFields control={form.control} index={index} />;
      
      case PROPERTY_CATEGORY.COMMERCIAL:
        return <CommercialFields control={form.control} index={index} />;
      
      default:
        return (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Configuration fields not available for this type
            </p>
          </div>
        );
    }
  };

  const configTypeOptions = getConfigurationTypeOptions();
  const editingConfig = editingIndex !== null ? form.watch(`configurations.${editingIndex}`) : null;

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
          <Home className="w-8 h-8" />
          Unit Configurations
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Define unit types, sizes, and availability for your project
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Quick Add Configuration Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Add Configuration Type</CardTitle>
                <CardDescription>
                  Select the type of units in your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(configTypeOptions).map(([category, types]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {types.map((type) => (
                        <Button
                          key={type}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addConfiguration(type)}
                          className="text-xs"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Configuration List */}
            {fields.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Added Configurations ({fields.length})</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field, index) => {
                    const watchedConfig = form.watch(`configurations.${index}`);
                    const hasErrors = form.formState.errors.configurations?.[index];
                    const category = getPropertyCategory(watchedConfig?.configurationType);

                    return (
                      <Card key={field.id} className={`relative hover:shadow-md transition-shadow ${hasErrors ? 'border-red-300' : ''}`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <CardTitle className="text-base truncate">
                                  {watchedConfig?.configurationType || 'New Configuration'}
                                </CardTitle>
                                {hasErrors && (
                                  <Badge variant="destructive" className="text-xs">
                                    Error
                                  </Badge>
                                )}
                              </div>
                              {watchedConfig && (
                                <CardDescription className="text-sm">
                                  {formatConfigurationName(watchedConfig)}
                                </CardDescription>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                {category?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => openEditSheet(index)}
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {fields.length === 0 && (
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Home className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    No Configurations Added
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
                    Add at least one configuration type to define the units in your project.
                    Select from apartments, villas, plots, farms, or commercial spaces above.
                  </p>
                </CardContent>
              </Card>
            )}

            {form.formState.errors.configurations && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {form.formState.errors.configurations.message ||
                   form.formState.errors.configurations.root?.message}
                </p>
              </div>
            )}

            <SaveAndContinueFooter
              onBack={goToPreviousStep}
              showBack={currentStep > 0}
            />
          </form>
        </Form>

        {/* Configuration Edit Sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="right" className="w-full sm:max-w-3xl lg:max-w-4xl overflow-y-auto p-0">
            <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-xl">
                  <Settings className="w-6 h-6 text-orange-500" />
                  {editingConfig?.configurationType || 'Configuration'}
                </SheetTitle>
                <SheetDescription className="text-base">
                  Configure the details for this unit type. All required fields must be filled.
                </SheetDescription>
              </SheetHeader>
            </div>
            
            <div className="px-6 py-6">
              {editingIndex !== null && editingConfig && (
                <div className="space-y-6">
                  {renderConfigurationFields(editingIndex, editingConfig.configurationType)}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 z-10 bg-background border-t px-6 py-4">
              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeSheet}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    // Trigger validation for this specific config
                    form.trigger(`configurations.${editingIndex}`).then((isValid) => {
                      if (isValid) {
                        closeSheet();
                      }
                    });
                  }}
                >
                  Save & Close
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </motion.div>
    </div>
  );
}
