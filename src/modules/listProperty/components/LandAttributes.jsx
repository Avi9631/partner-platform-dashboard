import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Ruler, Fence, Droplets, Map } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import useListPropertyStore from '../store/useListPropertyStore';

const areaUnits = [
  { value: 'sqft', label: 'Square Feet' },
  { value: 'sqm', label: 'Square Meters' },
  { value: 'acre', label: 'Acre' },
  { value: 'bigha', label: 'Bigha' },
  { value: 'kanal', label: 'Kanal' },
  { value: 'gaj', label: 'Gaj' },
];

const landUseOptions = [
  { value: 'residential', label: 'Residential', icon: '🏡' },
  { value: 'commercial', label: 'Commercial', icon: '🏢' },
  { value: 'agricultural', label: 'Agricultural', icon: '🌾' },
  { value: 'industrial', label: 'Industrial', icon: '🏭' },
];

const irrigationSources = [
  'Borewell',
  'Canal',
  'River',
  'Well',
  'Drip Irrigation',
  'No Irrigation',
];

export default function LandAttributes() {
  const { formData, updateFormData, nextStep, previousStep, updateStepValidation } =
    useListPropertyStore();

  // Separate validation logic from state update
  const checkIsValid = () => {
    return !!(formData.plotArea && formData.areaUnit && formData.landUse);
  };

  // Only update validation state in useEffect
  useEffect(() => {
    const isValid = !!(formData.plotArea && formData.areaUnit && formData.landUse);
    updateStepValidation(2, isValid);
  }, [formData.plotArea, formData.areaUnit, formData.landUse, updateStepValidation]);

  const handleContinue = () => {
    if (checkIsValid()) {
      nextStep();
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
          Land Specifications
        </h2>
        <p className="text-muted-foreground text-sm">
          Provide detailed information about your land/plot
        </p>
      </motion.div>

      <div className="bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 dark:from-orange-950/10 dark:via-background dark:to-orange-900/5 rounded-xl p-6">
        <div className="space-y-6">
        {/* Plot Area & Dimensions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
            <Ruler className="w-5 h-5" />
            Plot Dimensions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Plot Area */}
            <div className="space-y-1.5">
              <Label className="text-sm">
                Plot Area <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min="0"
                placeholder="Enter area"
                value={formData.plotArea}
                onChange={(e) => updateFormData({ plotArea: e.target.value })}
                className="h-9 text-sm focus:border-primary transition-all"
                required
              />
            </div>

            {/* Area Unit */}
            <div className="space-y-1.5">
              <Label className="text-sm">
                Unit <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.areaUnit}
                onValueChange={(value) => updateFormData({ areaUnit: value })}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {areaUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Plot Dimension */}
          <div className="space-y-1.5">
            <Label htmlFor="plotDimension" className="text-sm">
              Plot Dimensions (Length x Width)
            </Label>
            <Input
              id="plotDimension"
              placeholder="e.g., 30 x 40 ft or 50 x 80 m"
              value={formData.plotDimension}
              onChange={(e) => updateFormData({ plotDimension: e.target.value })}
              className="h-9 text-sm focus:border-primary transition-all"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter dimensions if available (optional)
            </p>
          </div>

          {/* Road Width */}
          <div className="space-y-1.5">
            <Label htmlFor="roadWidth" className="text-sm flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5 text-primary" />
              Adjacent Road Width (in feet)
            </Label>
            <Input
              id="roadWidth"
              type="number"
              min="0"
              placeholder="e.g., 20"
              value={formData.roadWidth}
              onChange={(e) => updateFormData({ roadWidth: e.target.value })}
              className="h-9 text-sm focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Land Use */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-400">Land Use Classification</h3>
          <div className="space-y-2">
            <Label className="text-sm">
              Primary Use <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {landUseOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData({ landUse: option.value })}
                  className={`p-3 border rounded text-xs font-medium transition-all flex flex-col items-center gap-1.5 ${
                    formData.landUse === option.value
                      ? 'border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400 scale-105'
                      : 'border-muted hover:border-orange-500/50 hover:scale-105'
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-400">Additional Features</h3>
          
          {/* Fencing */}
          <div className="flex items-center justify-between p-3 border rounded hover:border-orange-500 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Fence className="w-5 h-5 text-white" />
              </div>
              <div>
                <Label className="text-sm font-semibold">Fenced Property</Label>
                <p className="text-xs text-muted-foreground">
                  Is the property boundary fenced?
                </p>
              </div>
            </div>
            <Switch
              checked={formData.fencing}
              onCheckedChange={(checked) => updateFormData({ fencing: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {/* Irrigation Source (for agricultural land) */}
          {['agricultural', 'farmhouse'].includes(formData.propertyType) && (
            <div className="space-y-1.5">
              <Label className="text-sm flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-primary" />
                Irrigation Source
              </Label>
              <Select
                value={formData.irrigationSource}
                onValueChange={(value) =>
                  updateFormData({ irrigationSource: value })
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select irrigation source" />
                </SelectTrigger>
                <SelectContent>
                  {irrigationSources.map((source) => (
                    <SelectItem key={source} value={source.toLowerCase().replace(' ', '_')}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex gap-2">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-0.5">
                Pro Tip
              </h4>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Accurate plot dimensions and clear land use classification help buyers
                understand your property better and can lead to faster sales.
              </p>
            </div>
          </div>
        </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 pt-6 border-t border-orange-200 dark:border-orange-900">
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
            onClick={handleContinue}
            disabled={!checkIsValid()}
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
        </div>
      </div>
    </div>
  );
}
