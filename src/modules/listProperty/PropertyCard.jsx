import { motion } from 'motion/react';
import { 
  MapPin, Building2, Calendar, 
  Edit2, Trash2, Eye, MoreVertical, Clock, CheckCircle, XCircle,
  Home, Settings
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
import { useNavigate } from 'react-router-dom';

export default function PropertyCard({ listing, index, onEdit, onDelete }) {
  const navigate = useNavigate();
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

  // Extract data from raw API structure
  const draftId = listing.draftId;
  const title = listing.draftData?.title || listing.draftData?.customPropertyName || listing.draftData?.projectName || 'Untitled Property';
  const location = listing.draftData?.locality || listing.draftData?.city || 'Location not set';
  const propertyType = listing.draftData?.propertyType || 'Not specified';
  const listingType = listing.draftData?.listingType || 'sale';
  
  const status = listing.draftStatus?.toLowerCase() || 'draft';
  const image = listing.draftData?.mediaData?.[0]?.url || null;
  const createdAt = new Date(listing.createdAt || listing.draft_created_at).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const config = statusConfig[status] || statusConfig.draft;
  const StatusIcon = config.icon;

  const handleManageClick = () => {
    navigate(`/list-property/manage/${draftId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 shadow-md hover:shadow-xl bg-white dark:bg-gray-900">
        {/* Image Section - Reduced height */}
        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20">
          {image ? (
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Home className="w-16 h-16 text-orange-300 dark:text-orange-700" />
            </div>
          )}
          
          {/* Status Badge - Smaller */}
          <div className="absolute top-2 right-2">
            <Badge className={`${config.badgeClass} text-white text-xs px-2 py-0.5 shadow-md flex items-center`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
          </div>

          {/* Actions Menu - Smaller */}
          <div className="absolute top-2 left-2">
 
          </div> 
        </div>

        {/* Content Section - Compact */}
        <CardHeader className="pb-2 pt-3 px-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 dark:text-white truncate mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {title}
              </h3>
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mb-1">
                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3 px-4 pt-2">
          {/* Listing Type and Property Type Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary" className="text-xs capitalize">
              {listingType}
            </Badge>
            <Badge variant="outline" className="text-xs font-medium">
              <Building2 className="w-3 h-3 mr-1" />
              {propertyType}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="pt-2 pb-3 px-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{createdAt}</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleManageClick}
            className="h-7 text-xs gap-1 hover:text-orange-600 dark:hover:text-orange-400"
          >
            <Settings className="w-3 h-3" />
            Manage
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
