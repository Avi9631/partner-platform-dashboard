import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { Car, Wind, Zap, Users, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import parkingUtilitiesSchema from '../../../schemas/parkingUtilitiesSchema';
import SaveAndContinueFooter from '../SaveAndContinueFooter';

export default function ParkingStepV2() {
  const { saveAndContinue, previousStep, formData } = usePropertyFormV2();

  // Create local form with defaults from context
  const methods = useForm({
    resolver: zodResolver(parkingUtilitiesSchema),
    mode: 'onChange',
    defaultValues: {
      coveredParking: formData?.coveredParking || '',
      openParking: formData?.openParking || '',
      powerBackup: formData?.powerBackup || 'none',
      // Phase 1 enhancements
      evChargingType: formData?.evChargingType || 'none',
      evChargingPoints: formData?.evChargingPoints || '',
      hasVisitorParking: formData?.hasVisitorParking || false,
      visitorParkingSpaces: formData?.visitorParkingSpaces || '',
      parkingType: formData?.parkingType || '',
      parkingSecurityType: formData?.parkingSecurityType || '',
    },
  });

  const { watch, setValue, register, handleSubmit, formState } = methods;

  const onSubmit = (data) => {
    saveAndContinue(data);
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
                Parking & Utilities
              </h2>
              <p className="text-muted-foreground text-sm">
                Provide parking and utility information
              </p>
            </motion.div>

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
                      Covered Parking <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="coveredParking"
                      type="number"
                      min="0"
                      placeholder="e.g., 1 (enter 0 if none)"
                      {...register('coveredParking')}
                      className="h-11 text-sm border-2 focus:border-orange-500 transition-all"
                    />
                    {formState.errors.coveredParking && (
                      <p className="text-sm text-red-500">{formState.errors.coveredParking.message}</p>
                    )}
                  </motion.div>

                  {/* Open Parking */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="openParking" className="text-sm">
                      Open Parking <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="openParking"
                      type="number"
                      min="0"
                      placeholder="e.g., 2 (enter 0 if none)"
                      {...register('openParking')}
                      className="h-11 text-sm border-2 focus:border-orange-500 transition-all"
                    />
                    {formState.errors.openParking && (
                      <p className="text-sm text-red-500">{formState.errors.openParking.message}</p>
                    )}
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
                  Power Backup <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch('powerBackup')}
                  onValueChange={(value) => setValue('powerBackup', value)}
                >
                  <SelectTrigger className="h-11 text-sm border-2 focus:border-orange-500">
                    <SelectValue placeholder="Select power backup option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Backup</SelectItem>
                    <SelectItem value="partial">Partial Backup (Limited hours/areas)</SelectItem>
                    <SelectItem value="full">Full Backup (100% coverage)</SelectItem>
                  </SelectContent>
                </Select>
                {formState.errors.powerBackup && (
                  <p className="text-sm text-red-500">{formState.errors.powerBackup.message}</p>
                )}
              </motion.div>

              {/* EV Charging */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
                  <Zap className="w-5 h-5" />
                  Electric Vehicle Charging
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* EV Charging Type */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <Label className="text-sm">Charging Type</Label>
                    <Select
                      value={watch('evChargingType')}
                      onValueChange={(value) => setValue('evChargingType', value)}
                    >
                      <SelectTrigger className="h-11 text-sm border-2 focus:border-orange-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No EV Charging</SelectItem>
                        <SelectItem value="ac_slow">AC Slow (3-7 kW)</SelectItem>
                        <SelectItem value="dc_fast">DC Fast (50+ kW)</SelectItem>
                        <SelectItem value="both">Both AC & DC</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  {/* EV Charging Points */}
                  {watch('evChargingType') !== 'none' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="evChargingPoints" className="text-sm">
                        Number of Charging Points <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="evChargingPoints"
                        type="number"
                        min="1"
                        placeholder="e.g., 2"
                        {...register('evChargingPoints')}
                        className="h-11 text-sm border-2 focus:border-orange-500 transition-all"
                      />
                      {formState.errors.evChargingPoints && (
                        <p className="text-sm text-red-500">{formState.errors.evChargingPoints.message}</p>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Visitor Parking */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
                  <Users className="w-5 h-5" />
                  Visitor Parking
                </h3>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4"
                >
                  {/* Has Visitor Parking */}
                  <div className="flex items-center space-x-2 p-3 border-2 rounded-lg">
                    <Checkbox
                      checked={watch('hasVisitorParking')}
                      onCheckedChange={(checked) => setValue('hasVisitorParking', checked)}
                    />
                    <Label className="text-sm font-medium cursor-pointer">
                      Visitor parking available
                    </Label>
                  </div>

                  {/* Visitor Parking Spaces */}
                  {watch('hasVisitorParking') && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="visitorParkingSpaces" className="text-sm">
                        Number of Visitor Parking Spaces <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="visitorParkingSpaces"
                        type="number"
                        min="1"
                        placeholder="e.g., 10"
                        {...register('visitorParkingSpaces')}
                        className="h-11 text-sm border-2 focus:border-orange-500 transition-all"
                      />
                      {formState.errors.visitorParkingSpaces && (
                        <p className="text-sm text-red-500">{formState.errors.visitorParkingSpaces.message}</p>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Parking Type & Security */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Parking Type */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 }}
                  className="space-y-2"
                >
                  <Label className="text-sm">Parking Allocation Type <span className="text-red-500">*</span></Label>
                  <Select
                    value={watch('parkingType')}
                    onValueChange={(value) => setValue('parkingType', value)}
                  >
                    <SelectTrigger className="h-11 text-sm border-2 focus:border-orange-500">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reserved">Reserved (Dedicated slot)</SelectItem>
                      <SelectItem value="shared">Shared Parking</SelectItem>
                      <SelectItem value="first_come">First Come First Serve</SelectItem>
                    </SelectContent>
                  </Select>
                  {formState.errors.parkingType && (
                    <p className="text-sm text-red-500">{formState.errors.parkingType.message}</p>
                  )}
                </motion.div>

                {/* Parking Security */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2"
                >
                  <Label className="text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-600" />
                    Parking Security
                  </Label>
                  <Select
                    value={watch('parkingSecurityType')}
                    onValueChange={(value) => setValue('parkingSecurityType', value)}
                  >
                    <SelectTrigger className="h-11 text-sm border-2 focus:border-orange-500">
                      <SelectValue placeholder="Select security type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guarded">Guarded (Security personnel)</SelectItem>
                      <SelectItem value="cctv">CCTV Surveillance</SelectItem>
                      <SelectItem value="gated">Gated with Access Control</SelectItem>
                      <SelectItem value="multiple">Multiple Security Measures</SelectItem>
                      <SelectItem value="none">No Special Security</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
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
