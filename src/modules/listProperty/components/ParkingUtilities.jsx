import { motion } from 'motion/react';
import { Car, Wind } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import FormButtonFooter from './shared/FormButtonFooter';

export default function ParkingUtilities({ 
  isSheetMode = false,
  onNext,
  onBack,
  onCancel,
}) {
  const { watch, setValue, register } = useFormContext();

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

      </div>

      {/* Fixed Button Footer */}
      {(onNext || onBack || onCancel) && (
        <FormButtonFooter
          onBack={onBack}
          onNext={isSheetMode ? onCancel : onNext}
          onCancel={onCancel}
          nextLabel={isSheetMode ? 'Save' : 'Continue'}
          nextDisabled={false}
          showBack={!!onBack}
          isSheetMode={isSheetMode}
        />
      )}
    </div>
  );
}
