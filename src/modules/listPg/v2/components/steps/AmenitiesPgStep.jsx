import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { z } from 'zod';
import { 
  Wifi,
  Car,
  Shield,
  Building2,
  Users,
  Waves,
  Trees,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePgFormV2 } from '../../context/PgFormContextV2';
import amenitiesPgSchema, { COMMON_AMENITIES_LIST } from '../../../schemas/amenitiesPgSchema';
import SaveAndContinueFooter from './SaveAndContinueFooter';
import { createStepLogger } from '../../../../listProperty/utils/validationLogger';

// Enhanced amenities with emoji icons for better visual appeal
const enhancedAmenitiesList = [
  { name: 'WiFi', icon: '📶', category: 'connectivity' },
  { name: 'Parking', icon: '🚗', category: 'parking' },
  { name: 'Security', icon: '🔒', category: 'security' },
  { name: 'CCTV', icon: '📹', category: 'security' },
  { name: 'Power Backup', icon: '🔋', category: 'utilities' },
  { name: 'Laundry', icon: '🧺', category: 'services' },
  { name: 'Gym', icon: '💪', category: 'recreation' },
  { name: 'Common Area', icon: '🛋️', category: 'spaces' },
  { name: 'Kitchen', icon: '🍳', category: 'facilities' },
  { name: 'Dining Area', icon: '🍽️', category: 'facilities' },
  { name: 'TV', icon: '📺', category: 'entertainment' },
  { name: 'Refrigerator', icon: '🧊', category: 'appliances' },
  { name: 'Water Purifier', icon: '💧', category: 'utilities' },
  { name: 'AC', icon: '❄️', category: 'comfort' },
  { name: 'Geyser', icon: '🔥', category: 'utilities' },
  { name: 'Garden', icon: '🌳', category: 'outdoor' },
  { name: 'Terrace', icon: '🏠', category: 'outdoor' },
  { name: 'Elevator', icon: '🛗', category: 'facilities' },
  { name: 'Housekeeping', icon: '🧹', category: 'services' },
  { name: 'Meal Service', icon: '🍱', category: 'services' },
];

const STEP_ID = 'amenities';

export default function AmenitiesPgStep() {
  const { saveAndContinue, previousStep, getStepData, setCurrentStepSubmitHandler } = usePgFormV2();
  const stepData = getStepData(STEP_ID);
  
  const logger = useMemo(() => createStepLogger('Amenities PG Step V2'), []);

  // Wrap the array schema in an object for form compatibility
  const formSchema = useMemo(() => z.object({
    amenities: amenitiesPgSchema
  }), []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      amenities: stepData?.amenities || [],
    },
  });

  // Log validation errors
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      logger.logErrors(form.formState.errors);
    }
  }, [form.formState.errors, logger]);

  // Toggle amenity selection
  const toggleAmenity = (amenityName, amenityIcon) => {
    const currentAmenities = form.getValues('amenities');
    const existingIndex = currentAmenities.findIndex(a => a.name === amenityName);
    
    if (existingIndex >= 0) {
      // Remove amenity
      const updatedAmenities = currentAmenities.filter((_, i) => i !== existingIndex);
      form.setValue('amenities', updatedAmenities, { shouldValidate: true });
    } else {
      // Add amenity
      const newAmenity = {
        name: amenityName,
        available: true,
        icon: amenityIcon
      };
      form.setValue('amenities', [...currentAmenities, newAmenity], { shouldValidate: true });
    }
  };

  // Check if amenity is selected
  const isAmenitySelected = (amenityName) => {
    const amenities = form.watch('amenities') || [];
    return amenities.some(a => a.name === amenityName);
  };

  const onSubmit = (data) => {
    logger.logSubmission(data, form.formState.errors);
    saveAndContinue(data);
  };

  const onError = (errors) => {
    logger.logSubmission(form.getValues(), errors);
  };

  // Register submit handler with context
  useEffect(() => {
    setCurrentStepSubmitHandler(() => form.handleSubmit(onSubmit, onError));
  }, [form.handleSubmit]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Property Amenities
        </h2>
        <p className="text-muted-foreground text-sm">
          Select the amenities available in your property
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
          
          {/* Amenities Grid */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-semibold">Available Amenities</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <AnimatePresence>
                {enhancedAmenitiesList.map((amenity, index) => {
                  const isSelected = isAmenitySelected(amenity.name);

                  return (
                    <motion.button
                      key={amenity.name}
                      type="button"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => toggleAmenity(amenity.name, amenity.icon)}
                      className={`p-3 border-2 rounded-lg text-left transition-all flex items-center gap-2 relative ${
                        isSelected
                          ? 'border-orange-500 bg-orange-500/10 shadow-md scale-105'
                          : 'border-muted hover:border-orange-300 hover:shadow'
                      }`}
                    >
                      <span className="text-xl">{amenity.icon}</span>
                      <span className="text-xs font-medium flex-1">{amenity.name}</span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1"
                        >
                          <div className="bg-orange-500 rounded-full p-1">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
            
            <p className="text-xs text-muted-foreground mt-3">
              Select all amenities available in your PG/Hostel property
            </p>
          </div>

          {/* Selected Count Summary */}
          {form.watch('amenities')?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg"
            >
              <Check className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                {form.watch('amenities').length} {form.watch('amenities').length === 1 ? 'amenity' : 'amenities'} selected
              </span>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
}