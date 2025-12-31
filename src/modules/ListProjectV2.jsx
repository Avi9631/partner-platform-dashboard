import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlusCircle, MapPin, Building2, Calendar, DollarSign, 
  Edit2, Trash2, Eye, MoreVertical, Home,
  Users, Square, Search, Clock, CheckCircle, XCircle, Loader2,
  TrendingUp, Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { draftApi } from '@/services/draftService';
import { useToast } from '@/components/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

export default function ListProjectV2Page() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const { toast } = useToast();

  // Fetch project drafts from API
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await draftApi.getUserListingDrafts('PROJECT');
      
      if (response.success && response.data) {
        // Transform API data to match our component structure
        const transformedProjects = response.data.map(draft => {
          // Handle configurations - convert to display string
          let configurationsDisplay = null;
          if (draft.draftData?.configurations) {
            if (Array.isArray(draft.draftData.configurations)) {
              // If it's an array, count the items
              configurationsDisplay = `${draft.draftData.configurations.length} Config${draft.draftData.configurations.length !== 1 ? 's' : ''}`;
            } else if (typeof draft.draftData.configurations === 'object') {
              // If it's an object, it might be a single configuration
              configurationsDisplay = '1 Config';
            } else {
              // If it's already a string or number, use it directly
              configurationsDisplay = draft.draftData.configurations;
            }
          }

          return {
            id: draft.id,
            name: draft.draftData?.projectName || 'Untitled Project',
            location: `${draft.draftData?.locality || ''}, ${draft.draftData?.city || 'Location not set'}`.trim(),
            developer: draft.draftData?.developerName || 'Developer not specified',
            projectType: draft.draftData?.propertyType || 'Not specified',
            totalUnits: draft.draftData?.totalUnits || null,
            configurations: configurationsDisplay,
            area: draft.draftData?.projectArea || null,
            priceRange: draft.draftData?.priceRange || 'Price not set',
            status: draft.draftData?.projectStatus || 'under_construction',
            image: draft.draftData?.coverImage || null,
            views: draft.views || 0,
            launchDate: draft.draftData?.launchDate || 'TBA',
          };
        });
        setProjects(transformedProjects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your projects. Please try again.',
        variant: 'destructive',
      });
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleAddNewProject = async () => {
    try {
      setIsCreatingDraft(true);
      const response = await draftApi.createListingDraft('PROPERTY');

      console.log(response);
      
      if (response.success && response.data?.draftId) {
        // Navigate to the form page with the draft ID
        navigate(`/list-project/${response.data.draftId}`);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create draft. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to create draft:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create draft. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingDraft(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">My Projects</h1>
              <p className="text-orange-100 text-sm md:text-base">Manage and track all your real estate projects</p>
            </div>
            <Button
              size="lg"
              onClick={handleAddNewProject}
              disabled={isCreatingDraft}
              className="h-12 px-8 text-sm font-bold bg-white text-orange-600 hover:bg-orange-50 shadow-lg hover:scale-105 transition-all duration-300 self-start md:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingDraft ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Draft...
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5 mr-2" />
                  List New Project
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={<Building2 className="w-6 h-6" />}
            value={projects.length}
            label="Total Projects"
            color="blue"
          />
          <StatsCard
            icon={<TrendingUp className="w-6 h-6" />}
            value={projects.filter(p => p.status === 'under_construction').length}
            label="Under Construction"
            color="orange"
          />
          <StatsCard
            icon={<CheckCircle className="w-6 h-6" />}
            value={projects.filter(p => p.status === 'ready_to_move').length}
            label="Ready to Move"
            color="green"
          />
          <StatsCard
            icon={<Eye className="w-6 h-6" />}
            value="8.2k"
            label="Total Views"
            color="purple"
          />
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by project name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' ? 'bg-orange-500 hover:bg-orange-600' : ''}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'under_construction' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('under_construction')}
                className={statusFilter === 'under_construction' ? 'bg-orange-500 hover:bg-orange-600' : ''}
              >
                Ongoing
              </Button>
              <Button
                variant={statusFilter === 'ready_to_move' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('ready_to_move')}
                className={statusFilter === 'ready_to_move' ? 'bg-orange-500 hover:bg-orange-600' : ''}
              >
                Ready
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <EmptyState searchQuery={searchQuery} onAddNew={handleAddNewProject} isCreating={isCreatingDraft} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

     </div>
  );
}

// Stats Card Component
function StatsCard({ icon, value, label, color }) {
  const colorClasses = {
    blue: 'from-orange-500 to-orange-600 shadow-orange-500/20',
    green: 'from-green-500 to-green-600 shadow-green-500/20',
    orange: 'from-orange-500 to-orange-600 shadow-orange-500/20',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -2 }}
      className={`bg-gradient-to-br ${colorClasses[color]} text-white rounded-xl p-6 shadow-lg relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
        <div className="text-8xl">{icon}</div>
      </div>
      <div className="relative z-10">
        <div className="mb-2">{icon}</div>
        <div className="text-3xl font-extrabold mb-1">{value}</div>
        <div className="text-sm font-medium opacity-90">{label}</div>
      </div>
    </motion.div>
  );
}

// Project Card Component
function ProjectCard({ project, index }) {
  const navigate = useNavigate();
  
  const statusConfig = {
    upcoming: { 
      color: 'blue', 
      label: 'Upcoming', 
      icon: Clock,
      badgeClass: 'bg-blue-500 hover:bg-blue-600'
    },
    under_construction: { 
      color: 'orange', 
      label: 'Under Construction', 
      icon: TrendingUp,
      badgeClass: 'bg-orange-500 hover:bg-orange-600'
    },
    ready_to_move: { 
      color: 'green', 
      label: 'Ready to Move', 
      icon: CheckCircle,
      badgeClass: 'bg-green-500 hover:bg-green-600'
    },
    completed: { 
      color: 'purple', 
      label: 'Completed', 
      icon: XCircle,
      badgeClass: 'bg-purple-500 hover:bg-purple-600'
    },
  };

  const config = statusConfig[project.status] || statusConfig.under_construction;
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Card className="overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 shadow-lg hover:shadow-2xl bg-white dark:bg-gray-900">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20">
          {project.image ? (
            <img 
              src={project.image} 
              alt={project.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building className="w-20 h-20 text-orange-300 dark:text-orange-700" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge className={`${config.badgeClass} text-white font-semibold px-3 py-1 shadow-lg flex items-center`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
          </div>

          {/* Actions Menu */}
          <div className="absolute top-3 left-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 bg-white/90 hover:bg-white shadow-lg"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => navigate(`/list-project/${project.id}`)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/list-project/${project.id}`)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content Section */}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {project.name}
              </h3>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">{project.location}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                by {project.developer}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          {/* Project Type Badge */}
          <div className="mb-3">
            <Badge variant="outline" className="text-xs font-medium">
              <Building2 className="w-3 h-3 mr-1" />
              {project.projectType}
            </Badge>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {project.totalUnits && (
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <Home className="w-4 h-4 mr-1" />
                <span className="font-semibold">{project.totalUnits}</span>
              </div>
            )}
            {project.configurations && (
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4 mr-1" />
                <span className="font-semibold">{project.configurations}</span>
              </div>
            )}
            {project.area && (
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <Square className="w-4 h-4 mr-1" />
                <span className="font-semibold">{project.area}</span>
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="flex items-baseline gap-2">
            <DollarSign className="w-5 h-5 text-orange-500" />
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-orange-600 dark:text-orange-400">
                {project.priceRange}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Price Range</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{project.launchDate}</span>
          </div>
          <div className="flex items-center">
            <Eye className="w-3 h-3 mr-1" />
            <span>{project.views} views</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Empty State Component
function EmptyState({ searchQuery, onAddNew, isCreating }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20"
    >
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/20 mb-6">
        <Building2 className="w-10 h-10 text-orange-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {searchQuery ? 'No projects found' : 'No projects yet'}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {searchQuery
          ? 'Try adjusting your search or filter to find what you\'re looking for.'
          : 'Start by listing your first project and grow your real estate portfolio.'}
      </p>
      {!searchQuery && (
        <Button
          size="lg"
          onClick={onAddNew}
          disabled={isCreating}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5 mr-2" />
              List Your First Project
            </>
          )}
        </Button>
      )}
    </motion.div>
  );
}
