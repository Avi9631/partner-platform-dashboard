import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles,
  Waves,
  Dumbbell,
  Home,
  Gamepad2,
  Baby,
  CircleDot,
  Theater,
  Heart,
  PartyPopper,
  Library,
  Briefcase,
  Coffee,
  Store,
  Bed,
  PawPrint,
  Users,
  Trees,
  Shield,
  ShieldCheck,
  LockKeyhole,
  Phone,
  Flame,
  ShieldAlert,
  Video,
  Building2,
  Zap,
  MoveVertical,
  Droplet,
  Recycle,
  Trash2,
  CloudRain,
  Sun,
  Wifi,
  Car,
  Leaf,
  BatteryCharging,
  Droplets,
  Lightbulb,
  Check
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProjectFormV2 } from "../../context/ProjectFormContextV2";
import amenitiesProjectSchema, { PROJECT_AMENITIES_LIST } from "../../../schemas/amenitiesProjectSchema";
import SaveAndContinueFooter from "./SaveAndContinueFooter";
import { createStepLogger } from "../../../../listProperty/utils/validationLogger";

// Icon mapping for amenities
const iconMapping = {
  Waves,
  Dumbbell,
  Home,
  Gamepad2,
  Baby,
  FootprintsIcon: Users,
  CircleDot,
  Theater,
  Heart,
  PartyPopper,
  Library,
  Briefcase,
  Coffee,
  Store,
  Bed,
  PawPrint,
  Users,
  Trees,
  Shield,
  ShieldCheck,
  LockKeyhole,
  Phone,
  Flame,
  ShieldAlert,
  Video,
  Building2,
  Zap,
  MoveVertical,
  Droplet,
  Recycle,
  Trash2,
  CloudRain,
  Sun,
  Wifi,
  CarIcon: Car,
  Leaf,
  LeafIcon: Leaf,
  BatteryCharging,
  Droplets,
  Lightbulb,
};

export default function AmenitiesProjectStep() {
  const { saveAndContinue, formData, goToPreviousStep, currentStep } = useProjectFormV2();
  
  const logger = useMemo(() => createStepLogger('Amenities Project Step V2'), []);

  const form = useForm({
    resolver: zodResolver(amenitiesProjectSchema),
    mode: "onChange",
    defaultValues: {
      amenities: formData?.amenities || [],
    },
  });

  // Log validation errors
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      logger.logErrors(form.formState.errors);
    }
  }, [form.formState.errors, logger]);

  // Toggle amenity selection
  const toggleAmenity = (amenityData) => {
    const currentAmenities = form.getValues('amenities');
    const existingIndex = currentAmenities.findIndex(a => a.name === amenityData.name);
    
    if (existingIndex >= 0) {
      // Remove amenity
      const updatedAmenities = currentAmenities.filter((_, i) => i !== existingIndex);
      form.setValue('amenities', updatedAmenities);
    } else {
      // Add amenity
      const newAmenity = {
        name: amenityData.name,
        available: true,
        icon: amenityData.icon
      };
      form.setValue('amenities', [...currentAmenities, newAmenity]);
    }
  };

  // Check if amenity is selected
  const isAmenitySelected = (amenityName) => {
    return form.watch('amenities').some(a => a.name === amenityName);
  };

  const onSubmit = (data) => {
    logger.logSubmission(data, form.formState.errors);
    saveAndContinue(data);
  };

  const onError = (errors) => {
    logger.logSubmission(form.getValues(), errors);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-orange-500" />
          Amenities & Facilities
        </h2>
        <p className="text-muted-foreground text-sm">
          Select all amenities and facilities available in your project
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
          
          {/* Amenities Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {PROJECT_AMENITIES_LIST.map((amenityData) => {
                const isSelected = isAmenitySelected(amenityData.name);
                const IconComponent = iconMapping[amenityData.icon] || Building2;

                return (
                  <motion.div
                    key={amenityData.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-muted hover:border-orange-500/50'
                    }`}
                    onClick={() => toggleAmenity(amenityData)}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className={`p-3 rounded-lg ${
                        isSelected
                          ? 'bg-orange-100 dark:bg-orange-800'
                          : 'bg-muted'
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          isSelected
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-muted-foreground'
                        }`} />
                      </div>
                      <h4 className="font-medium text-sm text-center leading-tight">
                        {amenityData.name}
                      </h4>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute top-2 right-2"
                        >
                          <Check className="w-5 h-5 text-orange-600 bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
 
          {/* Save & Continue Footer */}
          <SaveAndContinueFooter
            onBack={goToPreviousStep}
            showBack={currentStep > 0}
          />
        </form>
      </motion.div>
    </div>
  );
}
