import { useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { Layers, ArrowUpCircle, Flame, AlertTriangle, ArrowUpDown, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import floorDetailsSchema from '../../../schemas/floorDetailsSchema';
import SaveAndContinueFooter from '../SaveAndContinueFooter';
import { createStepLogger } from '../../../utils/validationLogger';

export default function FloorDetailsStepV2() {
  const { saveAndContinue, previousStep, formData } = usePropertyFormV2();

  // Create logger instance (memoized to prevent recreation)
  const logger = useMemo(() => createStepLogger('Floor Details Step'), []);

  const methods = useForm({
    resolver: zodResolver(floorDetailsSchema),
    mode: 'onChange',
    defaultValues: {
      floorNumber: formData?.floorNumber || '',
      totalFloors: formData?.totalFloors || '',
      towerName: formData?.towerName || '',
      unitNumber: formData?.unitNumber || '',
      isUnitNumberPrivate: formData?.isUnitNumberPrivate || false,
      liftAvailable: formData?.liftAvailable || false,
      // Phase 1 enhancements
      fireExitProximity: formData?.fireExitProximity || '',
      hasEmergencyExit: formData?.hasEmergencyExit || false,
      staircaseType: formData?.staircaseType || '',
      hasIntercom: formData?.hasIntercom || false,
    },
  });

  const { register, watch, setValue, handleSubmit, formState } = methods;

  // Log validation errors when they change
  useEffect(() => {
    if (Object.keys(formState.errors).length > 0) {
      logger.logErrors(formState.errors);
    }
  }, [formState.errors, logger]);

  const onSubmit = (data) => {
    logger.logSubmission(data, formState.errors);
    saveAndContinue(data);
  };

  const onError = (errors) => {
    logger.logSubmission(methods.getValues(), errors);
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="pb-24">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Floor Details
              </h2>
              <p className="text-muted-foreground text-sm">
                Provide floor and unit information
              </p>
            </motion.div>

            <div className="space-y-6">
              {/* Tower & Floor Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tower Name */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="towerName" className="text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-orange-600" />
                    Tower Name
                  </Label>
                  <Input
                    id="towerName"
                    placeholder="e.g., Tower A"
                    {...register('towerName')}
                    className="h-11 text-sm border-2 focus:border-orange-500 transition-all"
                  />
                </motion.div>

                {/* Floor Number */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="floorNumber" className="text-sm">
                    Floor Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="floorNumber"
                    type="number"
                    min="0"
                    placeholder="e.g., 5"
                    {...register('floorNumber')}
                    className={`h-11 text-sm border-2 focus:border-orange-500 transition-all ${
                      formState.errors.floorNumber ? 'border-red-500' : ''
                    }`}
                  />
                  {formState.errors.floorNumber && (
                    <p className="text-sm text-red-500 mt-1">{formState.errors.floorNumber.message}</p>
                  )}
                </motion.div>

                {/* Total Floors */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="totalFloors" className="text-sm">
                    Total Floors <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="totalFloors"
                    type="number"
                    min="1"
                    placeholder="e.g., 20"
                    {...register('totalFloors')}
                    className={`h-11 text-sm border-2 focus:border-orange-500 transition-all ${
                      formState.errors.totalFloors ? 'border-red-500' : ''
                    }`}
                  />
                  {formState.errors.totalFloors && (
                    <p className="text-sm text-red-500 mt-1">{formState.errors.totalFloors.message}</p>
                  )}
                </motion.div>
              </div>

              {/* Unit Number */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <Label htmlFor="unitNumber" className="text-sm">
                  Unit Number
                </Label>
                <Input
                  id="unitNumber"
                  placeholder="e.g., 501"
                  {...register('unitNumber')}
                  className="h-11 text-sm border-2 focus:border-orange-500 transition-all"
                />
                
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/30">
                  <Switch
                    checked={watch('isUnitNumberPrivate')}
                    onCheckedChange={(checked) =>
                      setValue('isUnitNumberPrivate', checked, { shouldValidate: true })
                    }
                  />
                  <Label className="text-sm cursor-pointer">
                    Keep unit number private
                  </Label>
                </div>
              </motion.div>

              {/* Lift Available */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-between p-4 border-2 rounded-lg hover:border-orange-500 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <ArrowUpCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Lift/Elevator Available</Label>
                    <p className="text-xs text-muted-foreground">
                      Is there a working elevator?
                    </p>
                  </div>
                </div>
                <Switch
                  checked={watch('liftAvailable')}
                  onCheckedChange={(checked) =>
                    setValue('liftAvailable', checked, { shouldValidate: true })
                  }
                />
              </motion.div>

              {/* Fire Exit & Emergency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fire Exit Proximity */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75 }}
                  className="space-y-2"
                >
                  <Label className="text-sm flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-600" />
                    Fire Exit Proximity
                  </Label>
                  <Select
                    value={watch('fireExitProximity')}
                    onValueChange={(value) => setValue('fireExitProximity', value)}
                  >
                    <SelectTrigger className="h-11 text-sm border-2 focus:border-orange-500">
                      <SelectValue placeholder="Select proximity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very_near">Very Near (Within 10m)</SelectItem>
                      <SelectItem value="near">Near (Within 50m)</SelectItem>
                      <SelectItem value="moderate">Moderate (Within 100m)</SelectItem>
                      <SelectItem value="far">Far (Beyond 100m)</SelectItem>
                      <SelectItem value="not_available">Not Available</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Has Emergency Exit */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-2"
                >
                  <Label className="text-sm font-semibold">Emergency Features</Label>
                  <div className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:border-orange-500 transition-colors">
                    <Checkbox
                      checked={watch('hasEmergencyExit')}
                      onCheckedChange={(checked) => setValue('hasEmergencyExit', checked)}
                    />
                    <Label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      Has Emergency Exit on this floor
                    </Label>
                  </div>
                </motion.div>
              </div>

              {/* Staircase Type & Intercom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Staircase Type */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.85 }}
                  className="space-y-2"
                >
                  <Label className="text-sm flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-orange-600" />
                    Staircase Access
                  </Label>
                  <Select
                    value={watch('staircaseType')}
                    onValueChange={(value) => setValue('staircaseType', value)}
                  >
                    <SelectTrigger className="h-11 text-sm border-2 focus:border-orange-500">
                      <SelectValue placeholder="Select staircase type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="common">Common Staircase (Shared)</SelectItem>
                      <SelectItem value="private">Private Staircase</SelectItem>
                      <SelectItem value="both">Both Common & Private</SelectItem>
                      <SelectItem value="none">None (Only Lift)</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Has Intercom */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-2"
                >
                  <Label className="text-sm font-semibold">Communication</Label>
                  <div className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:border-orange-500 transition-colors">
                    <Checkbox
                      checked={watch('hasIntercom')}
                      onCheckedChange={(checked) => setValue('hasIntercom', checked)}
                    />
                    <Label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                      <Phone className="w-4 h-4 text-orange-600" />
                      Intercom System Available
                    </Label>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <SaveAndContinueFooter
            onBack={previousStep}
            nextDisabled={!formState.isValid}
            showBack={true}
          />
        </form>
      </div>
    </FormProvider>
  );
}
