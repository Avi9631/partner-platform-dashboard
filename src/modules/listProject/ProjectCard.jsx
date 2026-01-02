import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  MapPin, Building2, Calendar, 
  Edit2, Trash2, Eye, MoreVertical, Clock, CheckCircle, XCircle,
  TrendingUp, Building
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

export default function ProjectCard({ project, index }) {
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
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 shadow-md hover:shadow-xl bg-white dark:bg-gray-900">
        {/* Image Section - Reduced height */}
        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20">
          {project.image ? (
            <img 
              src={project.image} 
              alt={project.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building className="w-16 h-16 text-orange-300 dark:text-orange-700" />
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7 bg-white/90 hover:bg-white shadow-md"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
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

        {/* Content Section - Compact */}
        <CardHeader className="pb-2 pt-3 px-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 dark:text-white truncate mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {project.name}
              </h3>
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{project.location}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3 px-4 pt-2">
          {/* Property Type Badge */}
          <div className="flex gap-2 mb-3">
            <Badge variant="outline" className="text-xs font-medium">
              <Building2 className="w-3 h-3 mr-1" />
              {project.projectType}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="pt-2 pb-3 px-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{project.v_created_date+' '+project.v_created_time}</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
