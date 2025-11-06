import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Maximize, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import { usePropertyForm } from '../context/PropertyFormContext';

export default function AreaDetails() {
  const { nextStep, previousStep, updateStepValidation } = usePropertyForm();
  const { register, watch, setValue, formState: { errors, isValid } } = useFormContext();

  // Area configuration state (for repeater)
  const [areaConfig, setAreaConfig] = useState(watch('areaConfig') || [
    { type: 'carpet', value: '' },
    { type: 'super', value: '' },
    { type: 'built_up', value: '' },
  ]);

  // Update form when area config changes
  useEffect(() => {
    setValue('areaConfig', areaConfig);
  }, [areaConfig, setValue]);

  // Update step validation when form validity changes
  useEffect(() => {
    updateStepValidation(2, isValid);
  }, [isValid, updateStepValidation]);

  const updateAreaConfig = (index, field, value) => {
    const updated = [...areaConfig];
    updated[index][field] = value;
    setAreaConfig(updated);
  };

  const addAreaConfig = () => {
    setAreaConfig([...areaConfig, { type: 'carpet', value: '' }]);
  };

  const removeAreaConfig = (index) => {
    if (areaConfig.length > 1) {
      setAreaConfig(areaConfig.filter((_, i) => i !== index));
    }
  };

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
          {/* Area Configuration (Repeater) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Area Configuration</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addAreaConfig}
                className="h-8 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Area Type
              </Button>
            </div>

            {areaConfig.map((config, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-12 gap-3 items-end"
              >
                <div className="col-span-5 space-y-2">
                  <Label className="text-xs">Area Type</Label>
                  <Select
                    value={config.type}
                    onValueChange={(value) => updateAreaConfig(index, 'type', value)}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carpet">Carpet Area</SelectItem>
                      <SelectItem value="super">Super Area</SelectItem>
                      <SelectItem value="built_up">Built-up Area</SelectItem>
                      <SelectItem value="plot">Plot Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-5 space-y-2">
                  <Label className="text-xs">Value (sq.ft)</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="e.g., 1200"
                    value={config.value}
                    onChange={(e) => updateAreaConfig(index, 'value', e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeAreaConfig(index)}
                    disabled={areaConfig.length === 1}
                    className="h-9 w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}

            <p className="text-xs text-muted-foreground">
              Add multiple area measurements for better clarity (Carpet, Super, Built-up, Plot)
            </p>
          </div>

          {/* Legacy Single Fields (for backward compatibility) */}
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
                {...register('carpetArea')}
                className={`h-11 text-sm border-2 focus:border-orange-500 transition-all ${
                  errors.carpetArea ? 'border-red-500' : ''
                }`}
              />
              {errors.carpetArea && (
                <p className="text-sm text-red-500 mt-1">{errors.carpetArea.message}</p>
              )}
              {!errors.carpetArea && (
                <p className="text-xs text-muted-foreground">
                  Usable floor area excluding walls and common areas
                </p>
              )}
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
                {...register('superArea')}
                className={`h-11 text-sm border-2 focus:border-orange-500 transition-all ${
                  errors.superArea ? 'border-red-500' : ''
                }`}
              />
              {errors.superArea && (
                <p className="text-sm text-red-500 mt-1">{errors.superArea.message}</p>
              )}
              {!errors.superArea && (
                <p className="text-xs text-muted-foreground">
                  Total area including walls and common areas
                </p>
              )}
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

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-between mt-8 pt-6 border-t border-orange-200 dark:border-orange-900"
          >
            <Button
              type="button"
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
    </div>
  );
}
