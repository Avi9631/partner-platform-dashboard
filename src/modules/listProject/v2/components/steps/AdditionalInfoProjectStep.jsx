import { motion } from "motion/react";
import { Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProjectFormV2 } from "../../context/ProjectFormContextV2";
import additionalInfoProjectSchema from "../../../schemas/additionalInfoProjectSchema";
import SaveAndContinueFooter from "./SaveAndContinueFooter";

export default function AdditionalInfoProjectStep() {
  const { saveAndContinue, formData, goToPreviousStep, currentStep } = useProjectFormV2();

  const form = useForm({
    resolver: zodResolver(additionalInfoProjectSchema),
    mode: "onChange",
    defaultValues: formData || {},
  });

  const onSubmit = (data) => {
    saveAndContinue(data);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
          <Info className="w-8 h-8" />
          Additional Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add highlights, investment info, and unique features
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="p-8 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 rounded-lg">
            <p className="text-center text-gray-700 dark:text-gray-300">
              ℹ️ Additional Info Step - Implementation in progress
            </p>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-2">
              Will include: Highlights, USPs, Investment potential, Awards
            </p>
          </div>

          <SaveAndContinueFooter
            onBack={goToPreviousStep}
            showBack={currentStep > 0}
          />
        </form>
      </motion.div>
    </div>
  );
}
