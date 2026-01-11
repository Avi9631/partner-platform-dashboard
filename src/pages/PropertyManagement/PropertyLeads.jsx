import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Phone,
  Mail,
  Calendar,
  MapPin,
  MessageSquare,
  Filter,
  Search,
  Download,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  User,
  Video,
  Home,
  BedDouble,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionLoader } from '@/components/ui/loading-components';
import { Spinner } from '@/components/ui/spinner';
import { propertyApi } from '@/services/propertyService';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Lead reason configurations
const LEAD_REASONS = {
  CONNECT_AGENT: {
    label: "Connect with Agent",
    icon: Phone,
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  CALLBACK_REQUEST: {
    label: "Callback Request",
    icon: Phone,
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  VIRTUAL_TOUR: {
    label: "Virtual Tour",
    icon: Video,
    color: "bg-purple-500",
    textColor: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
};

// Lead type configurations
const LEAD_TYPES = {
  PROPERTY: {
    label: "Property",
    icon: Home,
    color: "text-orange-600",
  },
  PG_COLIVING: {
    label: "PG/Co-living",
    icon: BedDouble,
    color: "text-teal-600",
  },
  PROJECT: {
    label: "Project",
    icon: Building2,
    color: "text-indigo-600",
  },
};

// Status configurations
const LEAD_STATUS = {
  NEW: {
    label: "New",
    variant: "default",
    icon: AlertCircle,
    color: "text-blue-600",
  },
  CONTACTED: {
    label: "Contacted",
    variant: "secondary",
    icon: Phone,
    color: "text-yellow-600",
  },
  IN_PROGRESS: {
    label: "In Progress",
    variant: "default",
    icon: Clock,
    color: "text-orange-600",
  },
  COMPLETED: {
    label: "Completed",
    variant: "success",
    icon: CheckCircle,
    color: "text-green-600",
  },
  CLOSED: {
    label: "Closed",
    variant: "destructive",
    icon: XCircle,
    color: "text-red-600",
  },
};

export default function PropertyLeads({ draftId, property }) {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    reason: 'all',
    status: 'all',
  });

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  useEffect(() => {
    loadLeads();
  }, [draftId, filters]);

  // Fetch leads and stats
  const loadLeads = async (currentPage = 1, resetPage = false) => {
    try {
      setLoading(true);
      if (resetPage) setPage(currentPage);

      // Build filters object
      const filterParams = {
        page: currentPage,
        pageSize,
      };

      // Add filters only if they're not 'all'
      if (filters.type !== 'all') filterParams.listingType = filters.type;
      if (filters.reason !== 'all') filterParams.reason = filters.reason;
      if (filters.status !== 'all') filterParams.status = filters.status;

      // Fetch leads and stats in parallel
      const [leadsResponse, statsResponse] = await Promise.all([
        propertyApi.getPropertyLeads(draftId, filterParams),
        propertyApi.getPropertyLeadStats(draftId)
      ]);

      if (leadsResponse.success) {
        setLeads(leadsResponse.data.leads || []);
        setTotalPages(leadsResponse.data.pagination?.totalPages || 1);
        setTotalLeads(leadsResponse.data.pagination?.total || 0);
      } else {
        toast.error('Failed to load leads');
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error(error.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  // Refetch when page size changes
  useEffect(() => {
    if (page > 1) {
      setPage(1);
    } else {
      loadLeads();
    }
  }, [pageSize]);

  // Handle status update
  const handleStatusUpdate = async (leadId, newStatus) => {
    try {
      const response = await propertyApi.updateLeadStatus(leadId, newStatus);
      if (response.success) {
        toast.success('Lead status updated successfully');
        loadLeads(page);
      } else {
        toast.error('Failed to update lead status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Error updating lead status');
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: 'all',
      reason: 'all',
      status: 'all',
    });
    setPage(1);
  };

  // Apply filters
  const applyFilters = () => {
    loadLeads(1, true);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get reason badge component
  const ReasonBadge = ({ reason }) => {
    const config = LEAD_REASONS[reason] || {};
    const Icon = config.icon || Phone;

    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${config.bgColor} ${config.borderColor} ${config.textColor}`}
      >
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </div>
    );
  };

  // Get type icon
  const TypeIcon = ({ type }) => {
    const config = LEAD_TYPES[type] || {};
    const Icon = config.icon || Home;
    return (
      <div className={`inline-flex items-center gap-2 ${config.color}`}>
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    );
  };

  // Stats card component
  const StatsCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -2 }}
      className={`bg-gradient-to-br ${color} text-white rounded-xl p-6 shadow-lg relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
        <Icon className="w-24 h-24" />
      </div>
      <div className="relative z-10">
        <div className="mb-2">
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-3xl font-extrabold mb-1">{value}</div>
        <div className="text-sm font-medium opacity-90">{title}</div>
      </div>
    </motion.div>
  );

  const exportLeads = () => {
    const csv = [
      ['Customer Name', 'Email', 'Phone', 'Type', 'Reason', 'Status', 'Message', 'Date', 'Location'],
      ...leads.map(lead => [
        lead.customerName,
        lead.customerEmail,
        lead.customerPhone,
        lead.type,
        lead.reason,
        lead.status,
        lead.message,
        new Date(lead.createdAt).toLocaleString(),
        lead.location,
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `property-leads-${draftId}-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Leads exported successfully');
  };

  if (loading && leads.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Leads"
          value={stats?.total || 0}
          icon={User}
          color="from-blue-500 to-blue-600 shadow-blue-500/20"
        />
        <StatsCard
          title="New Leads"
          value={stats?.new || 0}
          icon={AlertCircle}
          color="from-green-500 to-green-600 shadow-green-500/20"
        />
        <StatsCard
          title="In Progress"
          value={stats?.inProgress || 0}
          icon={Clock}
          color="from-orange-500 to-orange-600 shadow-orange-500/20"
        />
        <StatsCard
          title="Completed"
          value={stats?.completed || 0}
          icon={CheckCircle}
          color="from-purple-500 to-purple-600 shadow-purple-500/20"
        />
      </div>

      {/* Filters Section - Horizontal Scroll */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset All
          </Button>
        </div>
        
        {/* Horizontal Scrollable Filters */}
        <div className="overflow-x-auto pb-2 -mx-2 px-2">
          <div className="flex gap-3 min-w-max">
            {/* Listing Type Filter */}
            <div className="flex-shrink-0 w-[200px]">
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                Listing Type
              </label>
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters({ ...filters, type: value })
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(LEAD_TYPES).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reason Filter */}
            <div className="flex-shrink-0 w-[200px]">
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                Reason
              </label>
              <Select
                value={filters.reason}
                onValueChange={(value) =>
                  setFilters({ ...filters, reason: value })
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reasons</SelectItem>
                  {Object.entries(LEAD_REASONS).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="flex-shrink-0 w-[200px]">
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                Status
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(LEAD_STATUS).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0 flex items-end gap-2">
              <Button
                onClick={applyFilters}
                size="sm"
                className="h-9 bg-orange-600 hover:bg-orange-700 whitespace-nowrap"
              >
                <Filter className="h-4 w-4 mr-2" />
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="h-10 w-1 bg-orange-600 rounded-full"></div>
              <div>
                <CardTitle className="text-xl">All Leads</CardTitle>
                <CardDescription className="mt-1">
                  {totalLeads > 0
                    ? `Showing ${(page - 1) * pageSize + 1}-${Math.min(
                        page * pageSize,
                        totalLeads
                      )} of ${totalLeads} leads`
                    : "No leads found"}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Select
                value={pageSize.toString()}
                onValueChange={(val) => setPageSize(parseInt(val))}
              >
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="20">20 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={() => loadLeads(page)}
              >
                <RefreshCw className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={exportLeads}
              >
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : leads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mb-6">
                <AlertCircle className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No leads found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {filters.type !== "all" ||
                filters.reason !== "all" ||
                filters.status !== "all"
                  ? "Try adjusting your filters to find what you're looking for."
                  : "No leads available for this property at the moment."}
              </p>
            </motion.div>
          ) : (
            <>
              <div className="rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="min-w-[250px] font-semibold">
                          Customer Details
                        </TableHead>
                        <TableHead className="min-w-[150px] font-semibold">Reason</TableHead>
                        <TableHead className="min-w-[180px] font-semibold">
                          Scheduled For
                        </TableHead>
                        <TableHead className="min-w-[200px] font-semibold">
                          Contact Info
                        </TableHead>
                        <TableHead className="min-w-[160px] font-semibold">Status</TableHead>
                        <TableHead className="min-w-[100px] font-semibold text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((lead, index) => {
                        const statusConfig = LEAD_STATUS[lead.status] || {};
                        const StatusIcon = statusConfig.icon || AlertCircle;

                        return (
                          <motion.tr
                            key={lead.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            {/* Customer Details */}
                            <TableCell>
                              <div className="space-y-2">
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {lead.customerName}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    <Calendar className="w-3 h-3 inline mr-1" />
                                    {formatDate(lead.createdAt)}
                                  </div>
                                </div>
                                {lead.message && (
                                  <div className="bg-gray-50 rounded p-2 text-xs text-gray-700 max-w-xs">
                                    <MessageSquare className="w-3 h-3 inline mr-1 text-gray-400" />
                                    {lead.message}
                                  </div>
                                )}
                                {lead.location && (
                                  <div className="text-xs text-gray-500">
                                    <MapPin className="w-3 h-3 inline mr-1" />
                                    {lead.location}
                                  </div>
                                )}
                              </div>
                            </TableCell>

                            {/* Reason */}
                            <TableCell>
                              <ReasonBadge reason={lead.reason} />
                            </TableCell>

                            {/* Scheduled For */}
                            <TableCell>
                              {lead.scheduledDate ? (
                                <div className="space-y-1">
                                  <div className="text-sm font-medium text-gray-900">
                                    {formatDate(lead.scheduledDate)}
                                  </div>
                                  {lead.scheduledTimeSlot && (
                                    <div className="text-xs text-gray-500">
                                      {lead.scheduledTimeSlot}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">Not scheduled</span>
                              )}
                            </TableCell>

                            {/* Contact Info */}
                            <TableCell>
                              <div className="space-y-1.5">
                                <a
                                  href={`mailto:${lead.customerEmail}`}
                                  className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-orange-600 transition-colors"
                                >
                                  <Mail className="w-3 h-3" />
                                  <span className="truncate max-w-[180px]">{lead.customerEmail}</span>
                                </a>
                                <a
                                  href={`tel:${lead.customerPhone}`}
                                  className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-orange-600 transition-colors"
                                >
                                  <Phone className="w-3 h-3" />
                                  {lead.customerPhone}
                                </a>
                              </div>
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                              <Select
                                value={lead.status}
                                onValueChange={(value) => handleStatusUpdate(lead.id, value)}
                              >
                                <SelectTrigger className="w-full h-8 text-xs">
                                  <div className="flex items-center gap-1.5">
                                    <StatusIcon className={`w-3 h-3 ${statusConfig.color}`} />
                                    <span>{statusConfig.label}</span>
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(LEAD_STATUS).map(([key, config]) => {
                                    const Icon = config.icon;
                                    return (
                                      <SelectItem key={key} value={key}>
                                        <div className="flex items-center gap-2">
                                          <Icon className={`w-3 h-3 ${config.color}`} />
                                          {config.label}
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </TableCell>

                            {/* Actions */}
                            <TableCell>
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={() => window.open(`tel:${lead.customerPhone}`)}
                                  title="Call"
                                >
                                  <Phone className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={() => window.open(`mailto:${lead.customerEmail}`)}
                                  title="Email"
                                >
                                  <Mail className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 pt-4 border-t">
                  <div className="text-sm font-medium text-muted-foreground">
                    Page <span className="text-orange-600 font-bold">{page}</span> of {totalPages}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadLeads(1)}
                      disabled={page === 1}
                      className="h-9 w-9 p-0"
                      title="First Page"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadLeads(page - 1)}
                      disabled={page === 1}
                      className="h-9 hidden sm:flex"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadLeads(page - 1)}
                      disabled={page === 1}
                      className="h-9 w-9 p-0 sm:hidden"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = idx + 1;
                        } else if (page <= 3) {
                          pageNumber = idx + 1;
                        } else if (page >= totalPages - 2) {
                          pageNumber = totalPages - 4 + idx;
                        } else {
                          pageNumber = page - 2 + idx;
                        }

                        return (
                          <Button
                            key={pageNumber}
                            variant={page === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => loadLeads(pageNumber)}
                            className={`h-9 w-9 p-0 ${
                              page === pageNumber
                                ? "bg-orange-600 hover:bg-orange-700"
                                : ""
                            }`}
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadLeads(page + 1)}
                      disabled={page === totalPages}
                      className="h-9 hidden sm:flex"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadLeads(page + 1)}
                      disabled={page === totalPages}
                      className="h-9 w-9 p-0 sm:hidden"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadLeads(totalPages)}
                      disabled={page === totalPages}
                      className="h-9 w-9 p-0"
                      title="Last Page"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
