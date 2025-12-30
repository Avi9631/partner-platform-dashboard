import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useProjectFormV2 } from "../../context/ProjectFormContextV2";

export default function ReviewAndSubmitProjectStep() {
  const { formData, setCurrentStepSubmitHandler } = useProjectFormV2();

  const handleSubmit = () => {
    console.log('Final submission:', formData);
    // TODO: Call publish API
  };

  // Register submit handler with context
  useEffect(() => {
    setCurrentStepSubmitHandler(() => handleSubmit);
  }, [handleSubmit, setCurrentStepSubmitHandler]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent flex items-center gap-2">
          <CheckCircle className="w-8 h-8" />
          Review & Submit
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review all details before submitting your project
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-8">
          <div className="p-8 bg-green-50 dark:bg-green-900/20 border-2 border-green-300 rounded-lg">
            <p className="text-center text-gray-700 dark:text-gray-300">
              ✅ Review & Submit Step - Implementation in progress
            </p>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-2">
              Will include: Collapsible sections with all data, Edit buttons, Final submit
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
