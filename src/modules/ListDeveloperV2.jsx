import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlusCircle, MapPin, Building2, Calendar,
  Edit2, Trash2, Eye, MoreVertical, Award,
  Search, CheckCircle, Loader2,
  Briefcase, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { developerDraftApi } from '@/services/developerDraftService';
import { useToast } from '@/components/hooks/use-toast';
import draftApi from '@/services/draftService';

export default function ListDeveloperV2Page() {
  const navigate = useNavigate();
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const { toast } = useToast();

  // Fetch developer drafts from API
  const fetchDevelopers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await developerDraftApi.getUserDeveloperDrafts("DEVELEOPER");
      
      if (response.success && response.data) {
        // Transform API data to match our component structure
        const transformedDevelopers = response.data.map(draft => ({
          id: draft.draftId,
          name: draft.draftData?.developerName || 'Untitled Developer',
          logo: draft.draftData?.logo || null,
          subscribed: draft.draftData?.subscribeForDeveloperPage || false,
          status: draft.draftStatus,
        }));
        setDevelopers(transformedDevelopers);
      } else {
        setDevelopers([]);
      }
    } catch (error) {
      console.error('Failed to fetch developers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your developers. Please try again.',
        variant: 'destructive',
      });
      setDevelopers([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleAddNewDeveloper = async () => {
    try {
      setIsCreatingDraft(true);
       const response = await draftApi.createListingDraft('DEVELOPER');

      console.log(response);
      
      if (response.success && response.data?.draftId) {
        // Navigate to the form page with the draft ID
        navigate(`/list-developer/${response.data.draftId}`);
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

  const handleEditDeveloper = (draftId) => {
    navigate(`/list-developer/${draftId}`);
  };

  useEffect(() => {
    fetchDevelopers();
  }, [fetchDevelopers]);

  const filteredDevelopers = developers.filter(developer => {
    const matchesSearch = developer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         developer.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || developer.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Developer Partners</h1>
              <p className="text-orange-100 text-sm md:text-base">Manage and showcase your developer portfolio</p>
            </div>
            <Button
              size="lg"
              onClick={handleAddNewDeveloper}
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
                  Add New Developer
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={<Building2 className="w-6 h-6" />}
            value={developers.length}
            label="Total Developers"
            color="blue"
          />
          <StatsCard
            icon={<Award className="w-6 h-6" />}
            value={developers.filter(d => d.verified).length}
            label="Verified Partners"
            color="green"
          />
          <StatsCard
            icon={<Home className="w-6 h-6" />}
            value={developers.reduce((sum, d) => sum + d.projectsCount, 0)}
            label="Total Projects"
            color="purple"
          />
          <StatsCard
            icon={<Eye className="w-6 h-6" />}
            value="15.3k"
            label="Total Views"
            color="orange"
          />
        </div>
      </div> */}

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by developer name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={typeFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setTypeFilter('all')}
                className={typeFilter === 'all' ? 'bg-orange-500 hover:bg-orange-600' : ''}
              >
                All
              </Button>
   
            </div>
          </div>
        </div>
      </div>

      {/* Developers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : filteredDevelopers.length === 0 ? (
          <EmptyState searchQuery={searchQuery} onAddNew={handleAddNewDeveloper} isCreating={isCreatingDraft} />
        ) : (
          <div className="grid grid-cols-1 gap-3">
            <AnimatePresence>
              {filteredDevelopers.map((developer, index) => (
                <DeveloperCard 
                  key={developer.id} 
                  developer={developer} 
                  index={index}
                  onDelete={(id) => {
                    // TODO: Implement delete functionality
                    console.log('Delete developer:', id);
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* <DeveloperFormSheetV2 open={showForm} onOpenChange={handleFormClose} initialDraftId={currentDraftId} /> */}
    </div>
  );
}
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

// Developer Card Component
function DeveloperCard({ developer, index, onEdit, onDelete }) {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-200 hover:shadow-md bg-white dark:bg-gray-900">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {developer.logo ? (
                <img 
                  src={developer.logo} 
                  alt={developer.name}
                  className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                  <Building2 className="w-8 h-8 text-orange-500" />
                </div>
              )}
            </div>

            {/* Developer Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate mb-1">
                {developer.name}
              </h3>
              
              {/* Subscription Status */}
              <div className="flex items-center gap-2 mb-1">
                {developer.subscribed ? (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Page Subscribed
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-gray-500">
                    Not Subscribed
                  </Badge>
                )}
              </div>
              
              {/* Status Badge */}
              <div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    developer.status === 'PUBLISHED' 
                      ? 'border-green-500 text-green-700 dark:text-green-400' 
                      : 'border-gray-300 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {developer.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0 flex gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => navigate(`/list-developer/${developer.id}`)}
                className="h-9 w-9 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => onDelete && onDelete(developer.id)}
                className="h-9 w-9 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
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
        {searchQuery ? 'No developers found' : 'No developers yet'}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {searchQuery
          ? 'Try adjusting your search or filter to find what you\'re looking for.'
          : 'Start by adding your first developer partner to build your network.'}
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
              Add Your First Developer
            </>
          )}
        </Button>
      )}
    </motion.div>
  );
}

// Mock Data
const mockDevelopers = [
  {
    id: 1,
    name: 'Prestige Group',
    location: 'Bangalore, Karnataka',
    type: 'National Developer',
    experience: 35,
    projectsCount: 280,
    rating: 4.8,
    verified: true,
    established: 1986,
    specializations: ['Apartments', 'Villas', 'Commercial'],
    logo: null,
    views: 3456,
  },
  {
    id: 2,
    name: 'Godrej Properties',
    location: 'Mumbai, Maharashtra',
    type: 'National Developer',
    experience: 28,
    projectsCount: 195,
    rating: 4.7,
    verified: true,
    established: 1990,
    specializations: ['Residential', 'Townships', 'Plotted'],
    logo: null,
    views: 4123,
  },
  {
    id: 3,
    name: 'DLF Limited',
    location: 'Gurgaon, Haryana',
    type: 'National Developer',
    experience: 76,
    projectsCount: 425,
    rating: 4.9,
    verified: true,
    established: 1946,
    specializations: ['Commercial', 'Residential', 'Retail'],
    logo: null,
    views: 5234,
  },
  {
    id: 4,
    name: 'Sobha Limited',
    location: 'Pune, Maharashtra',
    type: 'Regional Developer',
    experience: 45,
    projectsCount: 145,
    rating: 4.6,
    verified: true,
    established: 1976,
    specializations: ['Row Houses', 'Villas', 'Apartments'],
    logo: null,
    views: 2890,
  },
  {
    id: 5,
    name: 'Brigade Group',
    location: 'Hyderabad, Telangana',
    type: 'Regional Developer',
    experience: 38,
    projectsCount: 168,
    rating: 4.5,
    verified: false,
    established: 1986,
    specializations: ['Office Spaces', 'Residential', 'Hospitality'],
    logo: null,
    views: 2156,
  },
  {
    id: 6,
    name: 'ATS Group',
    location: 'Noida, Uttar Pradesh',
    type: 'Local Builder',
    experience: 25,
    projectsCount: 78,
    rating: 4.4,
    verified: true,
    established: 1998,
    specializations: ['Plotted', 'Villas', 'Apartments'],
    logo: null,
    views: 1890,
  },
  {
    id: 7,
    name: 'Lodha Group',
    location: 'Mumbai, Maharashtra',
    type: 'Luxury Developer',
    experience: 42,
    projectsCount: 215,
    rating: 4.9,
    verified: true,
    established: 1980,
    specializations: ['Luxury', 'Ultra Luxury', 'Premium'],
    logo: null,
    views: 6234,
  },
  {
    id: 8,
    name: 'Mahindra Lifespace',
    location: 'Chennai, Tamil Nadu',
    type: 'National Developer',
    experience: 30,
    projectsCount: 125,
    rating: 4.6,
    verified: true,
    established: 1994,
    specializations: ['Sustainable', 'Residential', 'Industrial'],
    logo: null,
    views: 2567,
  },
];
