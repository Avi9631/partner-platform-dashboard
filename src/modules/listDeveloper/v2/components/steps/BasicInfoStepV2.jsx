import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeveloperFormV2 } from "../../context/DeveloperFormContextV2";
import { basicInfoSchema } from "../../../schemas/basicInfoSchema";
import { useToast } from "@/components/hooks/use-toast";

export default function BasicInfoStepV2() {
  const { formData, publishDeveloper, onClose } = useDeveloperFormV2();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const {
    handleSubmit,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: formData || {},
  });

  // Sync form with context data when available
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      Object.keys(formData).forEach((key) => {
        setValue(key, formData[key]);
      });
    }
  }, [formData, setValue]);

  const onSubmit = async (data) => {
    // Store the data and show confirmation dialog
    setPendingData(data);
    setShowConfirmDialog(true);
  };

  const handleConfirmPublish = async () => {
    if (!pendingData) return;
    
    setIsSubmitting(true);
    setShowConfirmDialog(false);
    
    try {
      const result = await publishDeveloper(pendingData);
      if (result.success) {
        toast({
          title: "Success",
          description: "Developer published successfully!",
        });
        if (onClose) {
          onClose();
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to publish developer",
        });
      }
    } catch (error) {
      console.error('Error publishing developer:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while publishing",
      });
    } finally {
      setIsSubmitting(false);
      setPendingData(null);
    }
  };

  const handleCancelPublish = () => {
    setShowConfirmDialog(false);
    setPendingData(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="pt-6">
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

            {/* Subscribe for Developer Page */}
            <Controller
              name="subscribeForDeveloperPage"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <div className="flex items-center justify-between p-4 border-2 rounded-lg hover:border-orange-500 transition-all bg-orange-50/50 dark:bg-orange-900/10">
                  <div className="flex-1">
                    <FieldLabel className="font-semibold text-base">
                      Subscribe for building and listing the developer page
                    </FieldLabel>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Get a dedicated developer page with your profile, projects, and more
                    </p>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-orange-600"
                  />
                </div>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isSubmitting ? "Publishing..." : "Publish Developer"}
          </Button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Publishing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to publish this developer profile? 
              Once published, it will be visible to users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelPublish}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmPublish}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Publish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
