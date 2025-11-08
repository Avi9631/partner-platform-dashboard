import { motion } from 'motion/react';
import { Car, Wind, Droplets, Zap, Trash2 } from 'lucide-react';
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

export default function ParkingUtilities() {
  const { watch, setValue, register } = useFormContext();
  const { nextStep, previousStep } = usePropertyForm();

  return (
    <div className="w-full  ">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Parking & Utilities
        </h2>
        <p className="text-muted-foreground text-sm">
          Provide parking and utility information
        </p>
      </motion.div>

      <div className=" ">
        <div className="space-y-6">
          {/* Parking */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <Car className="w-5 h-5" />
              Parking Spaces
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Covered Parking */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <Label htmlFor="coveredParking" className="text-sm">
                  Covered Parking
                </Label>
                <Input
                  id="coveredParking"
                  type="number"
                  min="0"
                  placeholder="Number of spaces"
                  {...register('coveredParking')}
                  className="h-11 text-sm border-2 focus:border-orange-500 transition-all"
                />
              </motion.div>

              {/* Open Parking */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="openParking" className="text-sm">
                  Open Parking
                </Label>
                <Input
                  id="openParking"
                  type="number"
                  min="0"
                  placeholder="Number of spaces"
                  {...register('openParking')}
                  className="h-11 text-sm border-2 focus:border-orange-500 transition-all"
                />
              </motion.div>
            </div>
          </div>

          {/* Power Backup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <Label className="text-sm flex items-center gap-2">
              <Wind className="w-4 h-4 text-orange-600" />
              Power Backup
            </Label>
            <Select
              value={watch('powerBackup')}
              onValueChange={(value) => setValue('powerBackup', value)}
            >
              <SelectTrigger className="h-11 text-sm border-2 focus:border-orange-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Backup</SelectItem>
                <SelectItem value="partial">Partial Backup (Limited hours/areas)</SelectItem>
                <SelectItem value="full">Full Backup (100% coverage)</SelectItem>
              </SelectContent>
            </Select>
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
