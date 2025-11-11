import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlusCircle, MapPin, Home, Calendar, DollarSign, 
  Edit2, Trash2, Eye, MoreVertical, Building2, 
  Bed, Bath, Square, Search,
  Clock, CheckCircle, XCircle, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyFormSheetV2 } from '@/modules/listProperty/v2';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

export default function ListPropertyV2Page() {
  const [showForm, setShowForm] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - Replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setListings(mockListings);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">My Properties</h1>
              <p className="text-orange-100 text-sm md:text-base">Manage and track all your property listings</p>
            </div>
            <Button
              size="lg"
              onClick={() => setShowForm(true)}
              className="h-12 px-8 text-sm font-bold bg-white text-orange-600 hover:bg-orange-50 shadow-lg hover:scale-105 transition-all duration-300 self-start md:self-auto"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              List New Property
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
            value="2.4k"
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
        ) : filteredListings.length === 0 ? (
          <EmptyState searchQuery={searchQuery} onAddNew={() => setShowForm(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredListings.map((listing, index) => (
                <PropertyCard key={listing.id} listing={listing} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <PropertyFormSheetV2 open={showForm} onOpenChange={setShowForm} />
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

// Property Card Component
function PropertyCard({ listing, index }) {
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
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem>
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
          {/* Property Type Badge */}
          <div className="mb-3">
            <Badge variant="outline" className="text-xs font-medium">
              <Building2 className="w-3 h-3 mr-1" />
              {listing.propertyType}
            </Badge>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {listing.bedrooms && (
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <Bed className="w-4 h-4 mr-1" />
                <span className="font-semibold">{listing.bedrooms}</span>
              </div>
            )}
            {listing.bathrooms && (
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <Bath className="w-4 h-4 mr-1" />
                <span className="font-semibold">{listing.bathrooms}</span>
              </div>
            )}
            {listing.area && (
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <Square className="w-4 h-4 mr-1" />
                <span className="font-semibold">{listing.area}</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <DollarSign className="w-5 h-5 text-orange-500" />
            <span className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">
              {listing.price}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{listing.priceUnit}</span>
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
function EmptyState({ searchQuery, onAddNew }) {
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
        {searchQuery ? 'No properties found' : 'No properties yet'}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {searchQuery
          ? 'Try adjusting your search or filter to find what you\'re looking for.'
          : 'Start by listing your first property and watch your portfolio grow.'}
      </p>
      {!searchQuery && (
        <Button
          size="lg"
          onClick={onAddNew}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          List Your First Property
        </Button>
      )}
    </motion.div>
  );
}

// Mock Data
const mockListings = [
  {
    id: 1,
    title: 'Luxury 3BHK Apartment with Sea View',
    location: 'Bandra West, Mumbai',
    propertyType: 'Apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: '1500 sq.ft',
    price: '₹2.5 Cr',
    priceUnit: '',
    status: 'published',
    image: null,
    views: 234,
    createdAt: 'Jan 15, 2025',
  },
  {
    id: 2,
    title: 'Modern Villa in Gated Community',
    location: 'Whitefield, Bangalore',
    propertyType: 'Villa',
    bedrooms: 4,
    bathrooms: 3,
    area: '2500 sq.ft',
    price: '₹1.8 Cr',
    priceUnit: '',
    status: 'published',
    image: null,
    views: 456,
    createdAt: 'Jan 10, 2025',
  },
  {
    id: 3,
    title: 'Spacious Penthouse with Terrace',
    location: 'Andheri East, Mumbai',
    propertyType: 'Penthouse',
    bedrooms: 5,
    bathrooms: 4,
    area: '3200 sq.ft',
    price: '₹4.5 Cr',
    priceUnit: '',
    status: 'draft',
    image: null,
    views: 89,
    createdAt: 'Jan 8, 2025',
  },
  {
    id: 4,
    title: 'Cozy 2BHK Ready to Move',
    location: 'Powai, Mumbai',
    propertyType: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: '1100 sq.ft',
    price: '₹1.2 Cr',
    priceUnit: '',
    status: 'published',
    image: null,
    views: 567,
    createdAt: 'Jan 5, 2025',
  },
  {
    id: 5,
    title: 'Independent House with Garden',
    location: 'Koramangala, Bangalore',
    propertyType: 'Independent House',
    bedrooms: 3,
    bathrooms: 2,
    area: '1800 sq.ft',
    price: '₹95 Lac',
    priceUnit: '',
    status: 'draft',
    image: null,
    views: 123,
    createdAt: 'Jan 3, 2025',
  },
  {
    id: 6,
    title: 'Studio Apartment Near Metro',
    location: 'Goregaon West, Mumbai',
    propertyType: 'Studio',
    bedrooms: null,
    bathrooms: 1,
    area: '450 sq.ft',
    price: '₹65 Lac',
    priceUnit: '',
    status: 'published',
    image: null,
    views: 789,
    createdAt: 'Dec 28, 2024',
  },
];
