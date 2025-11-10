import { motion } from 'motion/react';
import { Compass, Eye } from 'lucide-react';
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

const facingOptions = [
  'East',
  'West',
  'North',
  'South',
  'North-East',
  'North-West',
  'South-East',
  'South-West',
];

const viewOptions = [
  'Garden View',
  'Road View',
  'Park View',
  'Club View',
  'City View',
  'Pool View',
  'Sea View',
];

export default function LocationAttributes({ 
  isSheetMode = false,
  onNext,
  onBack,
  onCancel,
}) {
  const { watch, setValue } = useFormContext();

  return (
    <div className="w-full ">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Location Attributes
        </h2>
        <p className="text-muted-foreground text-sm">
          Specify the facing direction and view of your property
        </p>
      </motion.div>

      <div className=" ">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Facing Direction */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label className="text-sm flex items-center gap-2">
                <Compass className="w-4 h-4 text-orange-600" />
                Facing Direction
              </Label>
              <Select
                value={watch('facing')}
                onValueChange={(value) => setValue('facing', value)}
              >
                <SelectTrigger className="h-11 text-sm border-2 focus:border-orange-500">
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  {facingOptions.map((dir) => (
                    <SelectItem key={dir} value={dir.toLowerCase()}>
                      {dir}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Direction the main entrance faces
              </p>
            </motion.div>

            {/* View */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label className="text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-orange-600" />
                View
              </Label>
              <Select
                value={watch('view')}
                onValueChange={(value) => setValue('view', value)}
              >
                <SelectTrigger className="h-11 text-sm border-2 focus:border-orange-500">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  {viewOptions.map((view) => (
                    <SelectItem
                      key={view}
                      value={view.toLowerCase().replace(' ', '_')}
                    >
                      {view}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Primary view from the property
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
              <span className="font-semibold">💡 Tip:</span> East and North-facing properties are often preferred for better natural light and ventilation.
            </p>
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
