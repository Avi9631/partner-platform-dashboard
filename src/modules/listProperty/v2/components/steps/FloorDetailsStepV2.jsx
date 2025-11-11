import { useForm, FormProvider } from 'react-hook-form';
import { motion } from 'motion/react';
import { Layers, ArrowUpCircle, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import SaveAndContinueFooter from '../SaveAndContinueFooter';

export default function FloorDetailsStepV2() {
  const { saveAndContinue, previousStep, formData } = usePropertyFormV2();

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      floorNumber: formData?.floorNumber || '',
      totalFloors: formData?.totalFloors || '',
      towerName: formData?.towerName || '',
      unitNumber: formData?.unitNumber || '',
      isUnitNumberPrivate: formData?.isUnitNumberPrivate || false,
      liftAvailable: formData?.liftAvailable || false,
      evCharging: formData?.evCharging || false,
    },
  });

  const { register, watch, setValue, formState: { errors } } = methods;
  const floorNumber = watch('floorNumber');
  const totalFloors = watch('totalFloors');
  
  const isValid = !!(floorNumber && totalFloors);

  const handleContinue = () => {
    if (isValid) {
      const data = methods.getValues();
      saveAndContinue(data);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-4xl mx-auto">
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
                    Floor Number
                  </Label>
                  <Input
                    id="floorNumber"
                    type="number"
                    min="0"
                    placeholder="e.g., 5"
                    {...register('floorNumber')}
                    className={`h-11 text-sm border-2 focus:border-orange-500 transition-all ${
                      errors.floorNumber ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.floorNumber && (
                    <p className="text-sm text-red-500 mt-1">{errors.floorNumber.message}</p>
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
                    Total Floors
                  </Label>
                  <Input
                    id="totalFloors"
                    type="number"
                    min="1"
                    placeholder="e.g., 20"
                    {...register('totalFloors')}
                    className={`h-11 text-sm border-2 focus:border-orange-500 transition-all ${
                      errors.totalFloors ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.totalFloors && (
                    <p className="text-sm text-red-500 mt-1">{errors.totalFloors.message}</p>
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

              {/* Lift & EV Charging */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {/* EV Charging */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                  className="flex items-center justify-between p-4 border-2 rounded-lg hover:border-orange-500 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">EV Charging Point</Label>
                      <p className="text-xs text-muted-foreground">
                        Electric vehicle charging facility
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={watch('evCharging')}
                    onCheckedChange={(checked) =>
                      setValue('evCharging', checked, { shouldValidate: true })
                    }
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <SaveAndContinueFooter
          onBack={previousStep}
          onSaveAndContinue={handleContinue}
          nextDisabled={!isValid}
          showBack={true}
        />
      </div>
    </FormProvider>
  );
}
