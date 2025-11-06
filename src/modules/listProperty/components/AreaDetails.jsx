import { motion } from 'motion/react';
import { Maximize } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import useListPropertyStore from '../store/useListPropertyStore';

export default function AreaDetails() {
  const { formData, updateFormData, nextStep, previousStep } =
    useListPropertyStore();

  const isValid = !!(formData.carpetArea && formData.superArea);

  return (
    <div className="w-full px-6 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Area Details
        </h2>
        <p className="text-muted-foreground text-sm">
          Specify the area measurements of your property
        </p>
      </motion.div>

      <div className="bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 dark:from-orange-950/10 dark:via-background dark:to-orange-900/5 rounded-xl p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Carpet Area */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="carpetArea" className="text-sm flex items-center gap-2">
                <Maximize className="w-4 h-4 text-orange-600" />
                Carpet Area (sq.ft) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="carpetArea"
                type="number"
                min="1"
                placeholder="e.g., 1200"
                value={formData.carpetArea}
                onChange={(e) => updateFormData({ carpetArea: e.target.value })}
                className="h-11 text-sm border-2 focus:border-orange-500 transition-all"
              />
              <p className="text-xs text-muted-foreground">
                Usable floor area excluding walls and common areas
              </p>
            </motion.div>

            {/* Super Area */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="superArea" className="text-sm flex items-center gap-2">
                <Maximize className="w-4 h-4 text-orange-600" />
                Super Area (sq.ft) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="superArea"
                type="number"
                min="1"
                placeholder="e.g., 1500"
                value={formData.superArea}
                onChange={(e) => updateFormData({ superArea: e.target.value })}
                className="h-11 text-sm border-2 focus:border-orange-500 transition-all"
              />
              <p className="text-xs text-muted-foreground">
                Total area including walls and common areas
              </p>
            </motion.div>
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
          >
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <span className="font-semibold">💡 Tip:</span> Super area is typically 20-30% more than carpet area due to common spaces and walls.
            </p>
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between mt-8 pt-6 border-t border-orange-200 dark:border-orange-900"
        >
          <Button
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
          <Button
            size="default"
            onClick={nextStep}
            disabled={!isValid}
            className="px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30"
          >
            Continue
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
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
