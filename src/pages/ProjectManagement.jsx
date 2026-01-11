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
  Home,
  Settings,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { draftApi } from '@/services/draftService';
import { FullPageLoader } from '@/components/ui/loading-components';
import ProjectAnalytics from './ProjectManagement/ProjectAnalytics';
import ProjectLeads from './ProjectManagement/ProjectLeads';
import ProjectLinks from './ProjectManagement/ProjectLinks';
import ProjectSettings from './ProjectManagement/ProjectSettings';

export default function ProjectManagement() {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics');

  const fetchProjectDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await draftApi.getListingDraftById(draftId);
      
      if (response.success) {
        setProject(response.data);
      } else {
        toast.error('Failed to load project details');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Error loading project details');
    } finally {
      setLoading(false);
    }
  }, [draftId]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  const handleEditProject = () => {
    navigate(`/list-project/${draftId}`);
  };

  if (loading) {
    return <FullPageLoader message="Loading project details..." />;
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Project Not Found</CardTitle>
            <CardDescription>
              The project you&apos;re looking for doesn&apos;t exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/list-project')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const projectData = project.draftData || {};
  const title = projectData.projectName || 'Untitled Project';
  const location = projectData.locality || projectData.city || 'Location not set';
  const status = project.draftStatus?.toLowerCase() || 'draft';
  const developerName = projectData.developerName || null;

  // Navigation items
  const navItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'links', label: 'Project Links', icon: Eye },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white shadow-xl">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/list-project')}
                className="text-white hover:bg-white/20 mt-1 flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 min-w-0">
                {/* Project Info */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white truncate">
                      {title}
                    </h1>
                    <Badge 
                      variant={status === 'published' ? 'default' : 'secondary'}
                      className="capitalize bg-white/90 text-green-700 hover:bg-white"
                    >
                      {status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center text-xs sm:text-sm text-green-100 gap-3 sm:gap-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{location}</span>
                    </div>
                    {developerName && (
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{developerName}</span>
                      </div>
                    )}
                    {projectData.projectType && (
                      <div className="flex items-center gap-1">
                        <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="capitalize">{projectData.projectType}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Button 
              onClick={handleEditProject} 
              className="gap-2 bg-white text-green-600 hover:bg-green-50 shadow-lg self-start"
              size="sm"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Edit Project</span>
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
                        ? 'bg-green-600 text-white shadow-md'
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
              <ProjectAnalytics draftId={draftId} project={project} />
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
              <ProjectLeads draftId={draftId} project={project} />
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
              <ProjectLinks draftId={draftId} project={project} />
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
              <ProjectSettings draftId={draftId} project={project} onUpdate={fetchProjectDetails} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
