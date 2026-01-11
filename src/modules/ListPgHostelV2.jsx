import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlusCircle, MapPin, Home, Calendar, DollarSign, 
  Edit2, Trash2, Eye, MoreVertical, Building2, 
  Bed, Users, Search,
  Clock, CheckCircle, XCircle, Loader2
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
import { useToast } from '@/components/hooks/use-toast';
import draftApi from '@/services/draftService';

export default function ListPgHostelV2Page() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const { toast } = useToast();

  // Fetch PG/Hostel drafts from API
  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await draftApi.getUserListingDrafts('PG');
      
      if (response.success && response.data) {
        setListings(response.data);
      } else {
        setListings([]);
      }
    } catch (error) {
      console.error('Failed to fetch PG listings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your listings. Please try again.',
        variant: 'destructive',
      });
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleListNewPg = async () => {
    try {
      setIsCreatingDraft(true);

      const response = await draftApi.createListingDraft( 'PG' );
      
            console.log('Create draft response:', response);
            
            if (response.success && response.data?.draftId) {
 // Navigate to the form page
      navigate(`/list-pg-hostel/edit/${response.data.draftId}`);
            } else {
              toast({
                title: 'Error',
                description: 'Failed to create draft. Please try again.',
                variant: 'destructive',
              });
            }

      
    } catch (error) {
      console.error('Error navigating to form:', error);
      toast({
        title: 'Error',
        description: 'Failed to open form. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingDraft(false);
    }
  };

  const handleEditDraft = async (draftId) => {
    // Navigate to form page with draft ID
    navigate(`/list-pg-hostel/edit/${draftId}`);
  };

  const handleDeleteDraft = async (draftId) => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    // TODO: Implement delete functionality with API call
    console.log('Deleting draft:', draftId);
    toast({
      title: 'Delete Feature',
      description: 'Delete functionality will be implemented with API integration.',
    });
  };

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);



  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">My PG & Hostels</h1>
              <p className="text-orange-100 text-sm md:text-base">Manage and track all your PG/Hostel listings</p>
            </div>
            <Button
              size="lg"
              onClick={handleListNewPg}
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
                  List New PG/Hostel
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
            value={listings.length}
            label="Total Listings"
            color="blue"
          />
          <StatsCard
            icon={<CheckCircle className="w-6 h-6" />}
            value={listings.filter(l => l.status === 'published').length}
            label="Published"
            color="green"
          />
          <StatsCard
            icon={<Clock className="w-6 h-6" />}
            value={listings.filter(l => l.status === 'draft').length}
            label="Drafts"
            color="orange"
          />
          <StatsCard
            icon={<Eye className="w-6 h-6" />}
            value={listings.reduce((sum, l) => sum + l.views, 0)}
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
                placeholder="Search by title or location..."
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
                variant={statusFilter === 'published' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('published')}
                className={statusFilter === 'published' ? 'bg-orange-500 hover:bg-orange-600' : ''}
              >
                Published
              </Button>
              <Button
                variant={statusFilter === 'draft' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('draft')}
                className={statusFilter === 'draft' ? 'bg-orange-500 hover:bg-orange-600' : ''}
              >
                Drafts
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : listings.length === 0 ? (
          <EmptyState searchQuery={searchQuery} onAddNew={handleListNewPg} isCreating={isCreatingDraft} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {listings.map((listing, index) => (
                <PgCard 
                  key={listing.id} 
                  listing={listing} 
                  index={index}
                  onEdit={handleEditDraft}
                  onDelete={handleDeleteDraft}
                />
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

// PG Card Component
function PgCard({ listing, index, onEdit, onDelete }) {
  const statusConfig = {
    published: { 
      color: 'green', 
      label: 'Published', 
      icon: CheckCircle,
      badgeClass: 'bg-green-500 hover:bg-green-600'
    },
    draft: { 
      color: 'orange', 
      label: 'Draft', 
      icon: Clock,
      badgeClass: 'bg-orange-500 hover:bg-orange-600'
    },
    archived: { 
      color: 'gray', 
      label: 'Archived', 
      icon: XCircle,
      badgeClass: 'bg-gray-500 hover:bg-gray-600'
    },
  };

  const config = statusConfig[listing.status] || statusConfig.draft;
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
          {listing.image ? (
            <img 
              src={listing.image} 
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Home className="w-20 h-20 text-orange-300 dark:text-orange-700" />
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
                <DropdownMenuItem onClick={() => window.location.href = `/list-pg-hostel/manage/${listing.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(listing.id)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => onDelete(listing.id)}
                >
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
                {listing.title}
              </h3>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">{listing.location}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          {/* Property Type & Gender Badges */}
          <div className="flex gap-2 mb-3">
            <Badge variant="outline" className="text-xs font-medium">
              <Building2 className="w-3 h-3 mr-1" />
              {listing.propertyType}
            </Badge>
            <Badge variant="outline" className="text-xs font-medium">
              <Users className="w-3 h-3 mr-1" />
              {listing.genderAllowed}
            </Badge>
          </div>

          {/* Bed Availability */}
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mb-4">
            <Bed className="w-4 h-4 mr-1" />
            <span className="font-semibold">{listing.availableBeds}/{listing.totalBeds} beds available</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <DollarSign className="w-5 h-5 text-orange-500" />
            <span className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">
              {listing.startingPrice}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">/month</span>
          </div>
        </CardContent>

        <CardFooter className="pt-0 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{listing.createdAt}</span>
          </div>
          <div className="flex items-center">
            <Eye className="w-3 h-3 mr-1" />
            <span>{listing.views} views</span>
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
        <Home className="w-10 h-10 text-orange-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {searchQuery ? 'No PG/Hostels found' : 'No PG/Hostels yet'}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {searchQuery
          ? 'Try adjusting your search or filter to find what you\'re looking for.'
          : 'Start by listing your first PG/Hostel and grow your business.'}
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
              List Your First PG/Hostel
            </>
          )}
        </Button>
      )}
    </motion.div>
  );
}
