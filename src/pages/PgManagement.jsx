import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Edit3,
  BarChart3,
  Users,
  Eye,
  MapPin,
  Settings,
  Bed,
  Users as UsersIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { draftApi } from '@/services/draftService';
import { FullPageLoader } from '@/components/ui/loading-components';
import PgAnalytics from './PgManagement/PgAnalytics';
import PgLeads from './PgManagement/PgLeads';
import PgLinks from './PgManagement/PgLinks';
import PgSettings from './PgManagement/PgSettings';

export default function PgManagement() {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pg, setPg] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics');

  const fetchPgDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await draftApi.getListingDraftById(draftId);
      
      if (response.success) {
        setPg(response.data);
      } else {
        toast.error('Failed to load PG/Hostel details');
      }
    } catch (error) {
      console.error('Error fetching PG/Hostel:', error);
      toast.error('Error loading PG/Hostel details');
    } finally {
      setLoading(false);
    }
  }, [draftId]);

  useEffect(() => {
    fetchPgDetails();
  }, [fetchPgDetails]);

  const handleEditPg = () => {
    navigate(`/list-pg-hostel/edit/${draftId}`);
  };

  if (loading) {
    return <FullPageLoader message="Loading PG/Hostel details..." />;
  }

  if (!pg) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>PG/Hostel Not Found</CardTitle>
            <CardDescription>
              The PG/Hostel you&apos;re looking for doesn&apos;t exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/list-pg-hostel')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to PG/Hostels
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pgData = pg.draftData || {};
  const title = pgData.title || pgData.customPropertyName || pgData.pgName || 'Untitled PG/Hostel';
  const location = pgData.locality || pgData.city || 'Location not set';
  const status = pg.draftStatus?.toLowerCase() || 'draft';
  const pgType = pgData.pgType || 'PG';

  // Navigation items
  const navItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'links', label: 'PG Links', icon: Eye },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-xl">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/list-pg-hostel')}
                className="text-white hover:bg-white/20 mt-1 flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 min-w-0">
                {/* PG Info */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white truncate">
                      {title}
                    </h1>
                    <Badge 
                      variant={status === 'published' ? 'default' : 'secondary'}
                      className="capitalize bg-white/90 text-blue-700 hover:bg-white"
                    >
                      {status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center text-xs sm:text-sm text-blue-100 gap-3 sm:gap-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{location}</span>
                    </div>
                    {pgType && (
                      <div className="flex items-center gap-1">
                        <Bed className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="capitalize">{pgType}</span>
                      </div>
                    )}
                    {pgData.totalBeds && (
                      <div className="flex items-center gap-1">
                        <UsersIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{pgData.totalBeds} Beds</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Button 
              onClick={handleEditPg} 
              className="gap-2 bg-white text-blue-600 hover:bg-blue-50 shadow-lg self-start"
              size="sm"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Edit PG/Hostel</span>
              <span className="sm:hidden">Edit</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
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
                        ? 'bg-blue-600 text-white shadow-md'
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
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <PgAnalytics draftId={draftId} pg={pg} />
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
              <PgLeads draftId={draftId} pg={pg} />
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
              <PgLinks draftId={draftId} pg={pg} />
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
              <PgSettings draftId={draftId} pg={pg} onUpdate={fetchPgDetails} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
