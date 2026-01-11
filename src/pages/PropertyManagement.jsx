import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Edit3,
  BarChart3,
  Users,
  Eye,
  TrendingUp,
  Calendar,
  MapPin,
  Home,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { propertyApi } from '@/services/propertyService';
import { draftApi } from '@/services/draftService';
import { FullPageLoader } from '@/components/ui/loading-components';
import PropertyAnalytics from './PropertyManagement/PropertyAnalytics';
import PropertyLeads from './PropertyManagement/PropertyLeads';
import PropertyLinks from './PropertyManagement/PropertyLinks';
import PropertySettings from './PropertyManagement/PropertySettings';

export default function PropertyManagement() {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics');

  useEffect(() => {
    fetchPropertyDetails();
  }, [draftId]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const response = await draftApi.getListingDraftById(draftId);
      
      if (response.success) {
        setProperty(response.data);
      } else {
        toast.error('Failed to load property details');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Error loading property details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProperty = () => {
    navigate(`/list-property/edit/${draftId}`);
  };

  if (loading) {
    return <FullPageLoader message="Loading property details..." />;
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Property Not Found</CardTitle>
            <CardDescription>
              The property you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/list-property')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const propertyData = property.draftData || {};
  const title = propertyData.title || propertyData.customPropertyName || propertyData.projectName || 'Untitled Property';
  const location = propertyData.locality || propertyData.city || 'Location not set';
  const status = property.draftStatus?.toLowerCase() || 'draft';
  const image = propertyData.mediaData?.[0]?.url || null;

  // Navigation items
  const navItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'links', label: 'Property Links', icon: Eye },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 text-white shadow-xl">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/list-property')}
                className="text-white hover:bg-white/20 mt-1 flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 min-w-0">
                  

                {/* Property Info */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white truncate">
                      {title}
                    </h1>
                    <Badge 
                      variant={status === 'published' ? 'default' : 'secondary'}
                      className="capitalize bg-white/90 text-orange-700 hover:bg-white"
                    >
                      {status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center text-xs sm:text-sm text-orange-100 gap-3 sm:gap-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{location}</span>
                    </div>
                    {propertyData.propertyType && (
                      <div className="flex items-center gap-1">
                        <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="capitalize">{propertyData.propertyType}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Button 
              onClick={handleEditProperty} 
              className="gap-2 bg-white text-orange-600 hover:bg-orange-50 shadow-lg self-start"
              size="sm"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Edit Property</span>
              <span className="sm:hidden">Edit</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-1 min-w-max sm:min-w-0 py-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all whitespace-nowrap',
                      isActive
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="  mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <PropertyAnalytics draftId={draftId} property={property} />
            </motion.div>
          )}

          {activeTab === 'leads' && (
            <motion.div
              key="leads"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <PropertyLeads draftId={draftId} property={property} />
            </motion.div>
          )}

          {activeTab === 'links' && (
            <motion.div
              key="links"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <PropertyLinks draftId={draftId} property={property} />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <PropertySettings draftId={draftId} property={property} onUpdate={fetchPropertyDetails} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
