import { useForm, FormProvider } from 'react-hook-form';
import { useEffect, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { Sofa, Smartphone, CheckCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import unitAmenitiesSchema from '../../../schemas/unitAmenitiesSchema';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';

const furnishingOptions = [
  { value: 'unfurnished', label: 'Unfurnished', description: 'No furniture or fittings' },
  { value: 'semi', label: 'Semi-Furnished', description: 'Basic furniture & fittings' },
  { value: 'fully', label: 'Fully Furnished', description: 'Complete furniture & appliances' },
];

const furnishingDetailOptions = [
  { value: 'wardrobe', label: 'Wardrobes', icon: '🚪' },
  { value: 'ac', label: 'Air Conditioner', icon: '❄️' },
  { value: 'modular_kitchen', label: 'Modular Kitchen', icon: '🍳' },
  { value: 'beds', label: 'Beds', icon: '🛏️' },
  { value: 'sofa', label: 'Sofa', icon: '🛋️' },
  { value: 'dining_table', label: 'Dining Table', icon: '🍽️' },
  { value: 'tv', label: 'Television', icon: '📺' },
  { value: 'refrigerator', label: 'Refrigerator', icon: '🧊' },
  { value: 'washing_machine', label: 'Washing Machine', icon: '🧺' },
  { value: 'geyser', label: 'Geyser', icon: '🔥' },
  { value: 'chimney', label: 'Chimney', icon: '🌫️' },
  { value: 'stove', label: 'Stove/Cooktop', icon: '🔥' },
];

const flooringOptions = [
  'Vitrified',
  'Marble',
  'Wooden',
  'Ceramic',
  'Granite',
  'Mosaic',
];

export default function FurnishingStepV2() {
  const { saveAndContinue, previousStep, formData, setCurrentStepSubmitHandler, setCurrentStepIsValid } = usePropertyFormV2();

  // Create local form with defaults from context
  const methods = useForm({
    resolver: zodResolver(unitAmenitiesSchema),
    mode: 'onChange',
    defaultValues: {
      furnishingStatus: formData?.furnishingStatus || 'unfurnished',
      furnishingDetails: formData?.furnishingDetails || {},
      flooringTypes: formData?.flooringTypes || [],
      amenities: formData?.amenities || [],
      // Phase 1 enhancements
      smartHomeDevices: formData?.smartHomeDevices || [],
      furnitureCondition: formData?.furnitureCondition || undefined,
    },
  });

  const { watch, setValue, formState, handleSubmit } = methods;
  const furnishingStatus = watch('furnishingStatus');
  const furnishingDetails = watch('furnishingDetails');
  const flooringTypes = watch('flooringTypes');

  const onSubmit = useCallback((data) => {
    saveAndContinue(data);
  }, [saveAndContinue]);

  // Register submit handler with context
  useEffect(() => {
    setCurrentStepSubmitHandler(() => handleSubmit(onSubmit));
    return () => setCurrentStepSubmitHandler(null);
  }, [handleSubmit, onSubmit, setCurrentStepSubmitHandler]);

  // Track validation state
  useEffect(() => {
    setCurrentStepIsValid(methods.formState.isValid);
  }, [methods.formState.isValid, setCurrentStepIsValid]);

  const toggleFlooringType = (type) => {
    const current = flooringTypes || [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    setValue('flooringTypes', updated);
  };

  const toggleFurnishingDetail = (detail) => {
    const current = furnishingDetails || {};
    const updated = {
      ...current,
      [detail]: !current[detail]
    };
    setValue('furnishingDetails', updated);
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Unit Amenities
              </h2>
              <p className="text-muted-foreground text-sm">
                Furnishing, flooring and unit-level amenities
              </p>
            </motion.div>

            <div className="space-y-6">
              {/* Furnishing Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Sofa className="w-4 h-4 text-orange-600" />
                  Furnishing Status
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {furnishingOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setValue('furnishingStatus', option.value)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        furnishingStatus === option.value
                          ? 'border-orange-500 bg-orange-500/10 shadow-md scale-105'
                          : 'border-muted hover:border-orange-300 hover:shadow'
                      }`}
                    >
                      <div className="font-semibold text-sm mb-1">{option.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Furnishing Details (if semi or fully furnished) */}
              {(furnishingStatus === 'semi' || furnishingStatus === 'fully') && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="space-y-3"
                >
                  <Label className="text-sm font-semibold">Included Furniture & Appliances</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {furnishingDetailOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleFurnishingDetail(option.value)}
                        className={`p-3 border-2 rounded-lg text-left transition-all flex items-center gap-2 ${
                          (furnishingDetails || {})[option.value]
                            ? 'border-orange-500 bg-orange-500/10 shadow-md scale-105'
                            : 'border-muted hover:border-orange-300 hover:shadow'
                        }`}
                      >
                        <span className="text-xl">{option.icon}</span>
                        <span className="text-xs font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select all items included in the property
                  </p>
                </motion.div>
              )}

              {/* Flooring Types */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <Label className="text-sm font-semibold">Flooring Types</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {flooringOptions.map((type) => (
                    <div
                      key={type}
                      className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:border-orange-500 transition-colors cursor-pointer"
                      onClick={() => toggleFlooringType(type)}
                    >
                      <Checkbox
                        checked={(flooringTypes || []).includes(type)}
                        onCheckedChange={() => toggleFlooringType(type)}
                      />
                      <label className="text-sm font-medium cursor-pointer">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Smart Home Devices */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="space-y-3"
              >
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-orange-600" />
                  Smart Home Devices
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { value: 'smart_door_lock', label: 'Smart Door Lock', icon: '🔐' },
                    { value: 'smart_lights', label: 'Smart Lights', icon: '💡' },
                    { value: 'smart_thermostat', label: 'Smart Thermostat', icon: '🌡️' },
                    { value: 'cctv_cameras', label: 'CCTV Cameras', icon: '📹' },
                    { value: 'smart_switches', label: 'Smart Switches', icon: '🔌' },
                    { value: 'video_doorbell', label: 'Video Doorbell', icon: '🔔' },
                    { value: 'smart_curtains', label: 'Smart Curtains', icon: '🪟' },
                    { value: 'home_automation_system', label: 'Home Automation', icon: '🏠' },
                    { value: 'voice_assistant', label: 'Voice Assistant', icon: '🗣️' },
                    { value: 'smart_security_system', label: 'Security System', icon: '🛡️' },
                  ].map((device) => {
                    const smartHomeDevices = watch('smartHomeDevices') || [];
                    return (
                      <div
                        key={device.value}
                        className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:border-orange-500 transition-colors cursor-pointer"
                        onClick={() => {
                          const updated = smartHomeDevices.includes(device.value)
                            ? smartHomeDevices.filter((d) => d !== device.value)
                            : [...smartHomeDevices, device.value];
                          setValue('smartHomeDevices', updated);
                        }}
                      >
                        <Checkbox
                          checked={smartHomeDevices.includes(device.value)}
                          onCheckedChange={() => {
                            const updated = smartHomeDevices.includes(device.value)
                              ? smartHomeDevices.filter((d) => d !== device.value)
                              : [...smartHomeDevices, device.value];
                            setValue('smartHomeDevices', updated);
                          }}
                        />
                        <span className="text-lg">{device.icon}</span>
                        <label className="text-xs font-medium cursor-pointer flex-1">
                          {device.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Select all smart home features included
                </p>
              </motion.div>

              {/* Furniture Condition */}
              {(furnishingStatus === 'semi' || furnishingStatus === 'fully') && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    Furniture Condition
                  </Label>
                  <Select
                    value={watch('furnitureCondition')}
                    onValueChange={(value) => setValue('furnitureCondition', value)}
                  >
                    <SelectTrigger className="h-10 text-sm border-2 focus:border-orange-500">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New (Less than 1 year)</SelectItem>
                      <SelectItem value="excellent">Excellent (1-2 years, like new)</SelectItem>
                      <SelectItem value="good">Good (2-5 years, well maintained)</SelectItem>
                      <SelectItem value="fair">Fair (5+ years, shows wear)</SelectItem>
                      <SelectItem value="needs_repair">Needs Repair</SelectItem>
                      <SelectItem value="not_applicable">Not Applicable</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Overall condition of the included furniture
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
        </form>
      </div>
    </FormProvider>
  );
}


