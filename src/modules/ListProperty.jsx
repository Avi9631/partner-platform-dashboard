import { motion } from 'motion/react';
import { 
  Plus, Building2, MapPin, DollarSign, CheckCircle2, 
  Edit, LandPlot, Bed, Maximize, Sofa, Car, Compass, 
  Layers, Users, Tag, Sparkles, AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PropertyFormProvider, usePropertyForm } from './listProperty/context/PropertyFormContext';
import SectionEditSheet from './listProperty/components/SectionEditSheet';

function ListPropertyContent() {
  // eslint-disable-next-line no-unused-vars
  const { propertyType, formData, openSection, setOpenSection, resetForm } = usePropertyForm();

  // Define sections based on property type
  const getSections = () => {
    if (!propertyType) return [];

    const isBuildingType = [
      'apartment', 'villa', 'duplex', 'independent_house', 
      'penthouse', 'studio', 'independent_floor'
    ].includes(propertyType);
    
    const isLandType = [
      'plot', 'farmhouse', 'agricultural_land'
    ].includes(propertyType);
    
    const isApartmentOrPenthouse = ['apartment', 'penthouse'].includes(propertyType);

    const sections = [];

    if (isBuildingType) {
      sections.push(
        {
          id: 'basic-config',
          title: 'Room Configuration',
          description: 'Bedrooms, bathrooms & more',
          icon: Bed,
          color: 'from-purple-500 to-pink-500',
          required: true,
          component: 'BasicConfiguration',
        },
        {
          id: 'area-details',
          title: 'Area Details',
          description: 'Carpet & super built-up area',
          icon: Maximize,
          color: 'from-green-500 to-emerald-500',
          required: true,
          component: 'AreaDetails',
        },
        {
          id: 'furnishing',
          title: 'Furnishing & Amenities',
          description: 'Interior details & features',
          icon: Sofa,
          color: 'from-amber-500 to-orange-500',
          required: false,
          component: 'FurnishingAmenities',
        },
        {
          id: 'parking',
          title: 'Parking & Utilities',
          description: 'Parking spaces & power backup',
          icon: Car,
          color: 'from-indigo-500 to-blue-500',
          required: false,
          component: 'ParkingUtilities',
        },
        {
          id: 'location',
          title: 'Location Attributes',
          description: 'Facing direction & views',
          icon: Compass,
          color: 'from-red-500 to-rose-500',
          required: false,
          component: 'LocationAttributes',
        }
      );

      if (isApartmentOrPenthouse) {
        sections.push({
          id: 'floor-details',
          title: 'Floor Details',
          description: 'Tower, floor & unit information',
          icon: Layers,
          color: 'from-teal-500 to-cyan-500',
          required: true,
          component: 'FloorDetails',
        });
      }
    } else if (isLandType) {
      sections.push({
        id: 'land-attributes',
        title: 'Plot Dimensions',
        description: 'Land specifications & features',
        icon: LandPlot,
        color: 'from-lime-500 to-green-500',
        required: true,
        component: 'LandAttributes',
      });
    }

    // Common sections for all types
    sections.push(
      {
        id: 'pricing',
        title: 'Pricing Information',
        description: 'Price & payment details',
        icon: DollarSign,
        color: 'from-yellow-500 to-amber-500',
        required: true,
        component: 'PricingInfoStep',
      },
      {
        id: 'suitable-for',
        title: 'Suitable For',
        description: 'Tenant preferences',
        icon: Users,
        color: 'from-violet-500 to-purple-500',
        required: false,
        component: 'SuitableForStep',
      },
      {
        id: 'listing-info',
        title: 'Listing Information',
        description: 'Title & description',
        icon: Tag,
        color: 'from-fuchsia-500 to-pink-500',
        required: true,
        component: 'ListingInfoStep',
      },
      {
        id: 'amenities',
        title: 'Amenities',
        description: 'Property features & facilities',
        icon: Sparkles,
        color: 'from-sky-500 to-blue-500',
        required: false,
        component: 'AmenitiesStep',
      }
    );

    return sections;
  };

  const sections = getSections();

  const getSectionStatus = (sectionId) => {
    // Check if section has data based on its ID
    const data = formData;
    
    switch (sectionId) {
      case 'property-type':
        return propertyType ? 'completed' : 'incomplete';
      case 'location':
        return data.city && data.addressText ? 'completed' : 'incomplete';
      case 'basic-config':
        return data.bedrooms && data.bathrooms ? 'completed' : 'incomplete';
      case 'area-details':
        return data.carpetArea ? 'completed' : 'incomplete';
      case 'pricing':
        return data.price && data.listingType ? 'completed' : 'incomplete';
      case 'listing-info':
        return data.title && data.description ? 'completed' : 'incomplete';
      default:
        return 'incomplete';
    }
  };

  const hasLocation = formData.city && formData.addressText && formData.ageOfProperty;

  if (!propertyType) {
    return (
      <div className="bg-background relative min-h-screen">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-orange-50 via-background to-orange-50/30 dark:from-orange-950/20 dark:via-background dark:to-orange-900/10" />
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pt-8 pb-8"
          >
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
                    List Your Property
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Click below to get started
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <Card className="p-12 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-950/50 dark:to-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building2 className="w-12 h-12 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">
                    Ready to list your property?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Start by selecting the type of property you want to list
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setOpenSection('property-type')}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Select Property Type
                  </Button>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Property Type Selection Sheet */}
        <SectionEditSheet sections={[{ id: 'property-type', title: 'Select Property Type', description: 'Choose the type of property you want to list', icon: Building2, color: 'from-orange-500 to-orange-600', component: 'PropertyTypeSelector' }]} />
      </div>
    );
  }

  return (
    <div className="bg-background relative min-h-screen">
      {/* Orange Gradient Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-orange-50 via-background to-orange-50/30 dark:from-orange-950/20 dark:via-background dark:to-orange-900/10" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-8 pb-6"
        >
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
                  List Your Property
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Complete all sections to publish your listing
              </p>
            </div>
          </div>
        </motion.div>

        {/* Top Cards: Property Type & Location */}
        <div className="container mx-auto px-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Property Type Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className={`p-4 h-full transition-all duration-300 border-2 cursor-pointer group relative overflow-hidden ${
                getSectionStatus('property-type') === 'completed'
                  ? 'border-green-500 dark:border-green-600 shadow-lg shadow-green-500/20 hover:shadow-xl'
                  : 'hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-700'
              }`}>
                {getSectionStatus('property-type') === 'completed' && (
                  <>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-2xl -z-0" />
                  </>
                )}
                <div className="flex flex-col h-full relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br p-2 flex items-center justify-center group-hover:scale-110 transition-transform ${
                      getSectionStatus('property-type') === 'completed'
                        ? 'from-green-500 to-emerald-600 shadow-lg shadow-green-500/30'
                        : 'from-orange-500 to-orange-600'
                    }`}>
                      <Building2 className="w-full h-full text-white" />
                    </div>
                    {getSectionStatus('property-type') === 'completed' ? (
                      <Badge className="text-xs bg-green-500 hover:bg-green-600 text-white border-0">
                        ✓ Completed
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-base font-bold mb-1 text-gray-900 dark:text-gray-100">
                      Property Type
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      Select property category & transaction type
                    </p>
                    {propertyType && (
                      <div className="mt-2 p-2 rounded-lg border bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800">
                        <p className="text-[10px] font-medium mb-0.5 text-orange-600 dark:text-orange-400">
                          Selected Type
                        </p>
                        <p className="text-xs font-bold capitalize text-orange-900 dark:text-orange-100">
                          {propertyType.replace('_', ' ')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-muted">
                    {getSectionStatus('property-type') === 'completed' ? (
                      <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-semibold">Completed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Incomplete</span>
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant={getSectionStatus('property-type') === 'completed' ? 'outline' : 'ghost'}
                      onClick={() => setOpenSection('property-type')}
                      className={`h-8 ${getSectionStatus('property-type') === 'completed'
                        ? 'border-green-300 hover:bg-green-50 dark:border-green-700 dark:hover:bg-green-950/30 text-green-700 dark:text-green-400'
                        : 'hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                      }`}
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" />
                      <span className="text-xs">{getSectionStatus('property-type') === 'completed' ? 'Change' : 'Select'}</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className={`p-4 h-full transition-all duration-300 border-2 cursor-pointer group relative overflow-hidden ${
                getSectionStatus('location') === 'completed'
                  ? 'border-green-500 dark:border-green-600 shadow-lg shadow-green-500/20 hover:shadow-xl'
                  : 'hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-700'
              }`}>
                {getSectionStatus('location') === 'completed' && (
                  <>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-2xl -z-0" />
                  </>
                )}
                <div className="flex flex-col h-full relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br p-2 flex items-center justify-center group-hover:scale-110 transition-transform ${
                      getSectionStatus('location') === 'completed'
                        ? 'from-green-500 to-emerald-600 shadow-lg shadow-green-500/30'
                        : 'from-blue-500 to-cyan-500'
                    }`}>
                      <MapPin className="w-full h-full text-white" />
                    </div>
                    {getSectionStatus('location') === 'completed' ? (
                      <Badge className="text-xs bg-green-500 hover:bg-green-600 text-white border-0">
                        ✓ Completed
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-base font-bold mb-1 text-gray-900 dark:text-gray-100">
                      Property Location
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      City, address & property details
                    </p>
                    {hasLocation && (
                      <div className="mt-2 p-2 rounded-lg border bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                        <p className="text-[10px] font-medium mb-0.5 text-blue-600 dark:text-blue-400">
                          Location
                        </p>
                        <p className="text-xs font-bold text-blue-900 dark:text-blue-100">
                          {formData.city}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                          {formData.addressText}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-muted">
                    {getSectionStatus('location') === 'completed' ? (
                      <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-semibold">Completed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Incomplete</span>
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant={getSectionStatus('location') === 'completed' ? 'outline' : 'ghost'}
                      onClick={() => setOpenSection('location')}
                      className={`h-8 ${getSectionStatus('location') === 'completed'
                        ? 'border-green-300 hover:bg-green-50 dark:border-green-700 dark:hover:bg-green-950/30 text-green-700 dark:text-green-400'
                        : 'hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                      }`}
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" />
                      <span className="text-xs">{getSectionStatus('location') === 'completed' ? 'Edit' : 'Add'}</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const status = getSectionStatus(section.id);
              
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: status === 'completed' ? [1, 1.02, 1] : 1
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.3 + index * 0.1,
                    scale: { duration: 0.3 }
                  }}
                >
                  <Card className={`p-4 transition-all duration-300 border-2 cursor-pointer group relative overflow-hidden ${
                    status === 'completed'
                      ? 'border-green-500 dark:border-green-600 shadow-lg shadow-green-500/20 hover:shadow-xl'
                      : 'hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-700'
                  }`}>
                    {status === 'completed' && (
                      <>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-2xl -z-0" />
                      </>
                    )}
                    <div className="flex flex-col h-full relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                            status === 'completed' 
                              ? 'from-green-500 to-emerald-600 shadow-lg shadow-green-500/30' 
                              : section.color
                          } p-2 flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="w-full h-full text-white" />
                        </div>
                        {status === 'completed' ? (
                          <Badge className="text-xs bg-green-500 hover:bg-green-600 text-white border-0">
                            ✓ Completed
                          </Badge>
                        ) : section.required ? (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Optional
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-base font-bold mb-1 text-gray-900 dark:text-gray-100">
                          {section.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {section.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-muted">
                        {status === 'completed' ? (
                          <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs font-semibold">Completed</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">Incomplete</span>
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant={status === 'completed' ? 'outline' : 'ghost'}
                          onClick={() => setOpenSection(section.id)}
                          className={`h-8 ${status === 'completed'
                            ? 'border-green-300 hover:bg-green-50 dark:border-green-700 dark:hover:bg-green-950/30 text-green-700 dark:text-green-400'
                            : 'hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                          }`}
                        >
                          <Edit className="w-3.5 h-3.5 mr-1" />
                          <span className="text-xs">{status === 'completed' ? 'Edit' : 'Add'}</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 h-14 px-12 text-base"
              disabled={
                !propertyType || 
                getSectionStatus('location') !== 'completed' ||
                sections.some(s => s.required && getSectionStatus(s.id) !== 'completed')
              }
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Review & Submit Listing
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Complete all required sections to submit your listing
            </p>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-20 right-10 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-20 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -z-10" />

      {/* Section Edit Sheet */}
      <SectionEditSheet sections={sections} />
    </div>
  );
}

export default function ListProperty() {
  return (
    <PropertyFormProvider>
      <ListPropertyContent />
    </PropertyFormProvider>
  );
}
