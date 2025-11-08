import { X, Building2, MapPin } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePropertyForm } from '../context/PropertyFormContext';
import PropertyTypeSelector from './PropertyTypeSelector';
import BasicDetails from './BasicDetails';
import BasicConfiguration from './BasicConfiguration';
import AreaDetails from './AreaDetails';
import FurnishingAmenities from './FurnishingAmenities';
import ParkingUtilities from './ParkingUtilities';
import LocationAttributes from './LocationAttributes';
import FloorDetails from './FloorDetails';
import LandAttributes from './LandAttributes';
import PricingInfoStep from './PricingInfoStep';
import SuitableForStep from './SuitableForStep';
import ListingInfoStep from './ListingInfoStep';
import AmenitiesStep from './AmenitiesStep';

export default function SectionEditSheet({ sections }) {
  const { openSection, setOpenSection } = usePropertyForm();

  const handleClose = () => {
    setOpenSection(null);
  };

  const renderSectionContent = () => {
    // Handle special sections that don't have a component field
    if (openSection === 'property-type') {
      return <PropertyTypeSelector onComplete={() => setOpenSection(null)} />;
    }
    if (openSection === 'location') {
      return <BasicDetails isSheetMode />;
    }

    const section = sections.find(s => s.id === openSection);
    if (!section) return null;

    switch (section.component) {
      case 'PropertyTypeSelector':
        return <PropertyTypeSelector onComplete={() => setOpenSection(null)} />;
      case 'BasicDetails':
        return <BasicDetails isSheetMode />;
      case 'BasicConfiguration':
        return <BasicConfiguration isSheetMode />;
      case 'AreaDetails':
        return <AreaDetails isSheetMode />;
      case 'FurnishingAmenities':
        return <FurnishingAmenities isSheetMode />;
      case 'ParkingUtilities':
        return <ParkingUtilities isSheetMode />;
      case 'LocationAttributes':
        return <LocationAttributes isSheetMode />;
      case 'FloorDetails':
        return <FloorDetails isSheetMode />;
      case 'LandAttributes':
        return <LandAttributes isSheetMode />;
      case 'PricingInfoStep':
        return <PricingInfoStep isSheetMode />;
      case 'SuitableForStep':
        return <SuitableForStep isSheetMode />;
      case 'ListingInfoStep':
        return <ListingInfoStep isSheetMode />;
      case 'AmenitiesStep':
        return <AmenitiesStep isSheetMode />;
      default:
        return null;
    }
  };

  const getCurrentSection = () => {
    // Handle special sections
    if (openSection === 'property-type') {
      return {
        id: 'property-type',
        title: 'Select Property Type',
        description: 'Choose the type of property you want to list',
        icon: Building2,
        color: 'from-orange-500 to-orange-600'
      };
    }
    if (openSection === 'location') {
      return {
        id: 'location',
        title: 'Property Location',
        description: 'City, address & property details',
        icon: MapPin,
        color: 'from-blue-500 to-cyan-500'
      };
    }
    return sections.find(s => s.id === openSection);
  };

  const currentSection = getCurrentSection();

  return (
    <Sheet open={!!openSection} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent 
        side="bottom" 
        className="w-full h-[100vh] p-0 overflow-hidden flex flex-col rounded-t-2xl [&>button]:hidden"
      >
        <SheetHeader className="px-6 py-4 mb-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3">
              {currentSection && (
                <>
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentSection.color} p-2 flex items-center justify-center`}
                  >
                    <currentSection.icon className="w-full h-full text-white" />
                  </div>
                  <div>
                    <SheetTitle className="text-xl font-bold">
                      {currentSection.title}
                    </SheetTitle>
                    <p className="text-sm text-muted-foreground">
                      {currentSection.description}
                    </p>
                  </div>
                </>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              className="hover:bg-orange-100 dark:hover:bg-orange-900/30"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="max-w-7xl mx-auto w-full p-6">
            {renderSectionContent()}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
