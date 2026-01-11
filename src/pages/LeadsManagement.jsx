import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "motion/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Home,
  BedDouble,
  Phone,
  Video,
  User,
  Calendar,
  MapPin,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Download,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  fetchLeads,
  fetchLeadsStats,
  updateLeadStatus,
} from "@/services/leadsService";
import { toast } from "sonner";



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
    icon: CheckCircle2,
    color: "text-green-600",
  },
  CLOSED: {
    label: "Closed",
    variant: "destructive",
    icon: XCircle,
    color: "text-red-600",
  },
};

export default function LeadsManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "all",
    reason: searchParams.get("reason") || "all",
    status: searchParams.get("status") || "all",
  });

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  // Fetch leads and stats
  const loadLeads = async (currentPage = 1, resetPage = false) => {
    try {
      setLoading(true);

      // Use real API
      const filterParams = {
        page: resetPage ? 1 : currentPage,
        limit: pageSize,
      };
      if (filters.type !== "all") filterParams.type = filters.type;
      if (filters.reason !== "all") filterParams.reason = filters.reason;
      if (filters.status !== "all") filterParams.status = filters.status;

      const [leadsData, statsData] = await Promise.all([
        fetchLeads(filterParams),
        fetchLeadsStats(),
      ]);

      setLeads(leadsData?.data?.leads || []);
      setTotalLeads(leadsData?.data?.pagination?.total || 0);
      setTotalPages(leadsData?.data?.pagination?.totalPages || 1);
      setPage(resetPage ? 1 : currentPage);
      setStats(statsData);
    } catch (error) {
      toast.error("Failed to load leads", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Refetch when page size changes
  useEffect(() => {
    if (page > 1) {
      loadLeads(1, true);
    } else {
      loadLeads(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.type !== "all") params.set("type", filters.type);
    if (filters.reason !== "all") params.set("reason", filters.reason);
    if (filters.status !== "all") params.set("status", filters.status);
    setSearchParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Handle status update
  const handleStatusUpdate = async (leadId, newStatus) => {
    try {
      // Update via API
      await updateLeadStatus(leadId, newStatus);
      toast.success("Lead status updated successfully");
      loadLeads(page);
    } catch (error) {
      toast.error("Failed to update lead status", {
        description: error.message,
      });
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: "all",
      reason: "all",
      status: "all",
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

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
                Leads Management
              </h1>
              <p className="text-orange-100 text-sm md:text-base">
                Manage and track all your property leads in one place
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-orange-600 hover:bg-orange-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            icon={CheckCircle2}
            color="from-purple-500 to-purple-600 shadow-purple-500/20"
          />
        </div>
      </div>
 

      {/* Filters Section - Horizontal Scroll */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 pb-6">
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
      </div>

      {/* Leads Table */}
      <div className="  mx-auto px-4 sm:px-6 lg:px-8 pb-12">
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
                    <SelectItem value="100">100 / page</SelectItem>
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
                    : "No leads available at the moment."}
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
                            Listing Details
                          </TableHead>
                          <TableHead className="min-w-[150px] font-semibold">Reason</TableHead>
                          <TableHead className="min-w-[180px] font-semibold">
                            Scheduled For
                          </TableHead>
                          <TableHead className="min-w-[180px] font-semibold">
                            Customer
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
                            <TableRow 
                              key={lead.id}
                              className="hover:bg-orange-50/50 transition-colors"
                            >
                            <TableCell className="py-4">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10 flex-shrink-0 shadow-md border-2 border-orange-100">
                                  <AvatarImage src={lead.customerAvatar} />
                                  <AvatarFallback className="text-xs text-white font-bold bg-gradient-to-br from-orange-500 to-orange-600">
                                    {lead.type === "PROPERTY" ? "PR" : lead.type === "PG_COLIVING" ? "PG" : "PJ"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1.5 flex-1 min-w-0">
                                  <div className="font-semibold text-sm text-gray-900 line-clamp-1">
                                    {lead.listingTitle || "Untitled Listing"}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                    {lead.location && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3 text-orange-500" />
                                        <span className="line-clamp-1">{lead.location}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {formatDate(lead.createdAt)}
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="py-4">
                              <ReasonBadge reason={lead.reason} />
                            </TableCell>

                            <TableCell className="py-4">
                              <div className="space-y-1.5">
                                {lead.scheduledDate ? (
                                  <>
                                    <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                                      <Calendar className="h-4 w-4 text-orange-600" />
                                      <span>
                                        {formatDate(lead.scheduledDate)}
                                      </span>
                                    </div>
                                    {lead.scheduledTimeSlot && (
                                      <div className="text-xs text-muted-foreground pl-5">
                                        {lead.scheduledTimeSlot}
                                      </div>
                                    )}
                                    {lead.requestedCallbackTime && (
                                      <div className="text-xs text-muted-foreground pl-5">
                                        {lead.requestedCallbackTime}
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <div className="text-xs text-muted-foreground">
                                    {lead.preferredContactTime ||
                                      lead.preferredTime ||
                                      "Not scheduled"}
                                  </div>
                                )}
                              </div>
                            </TableCell>

                            <TableCell className="py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 flex-shrink-0 shadow-md border-2 border-orange-100">
                                  <AvatarImage src={lead.customerAvatar} />
                                  <AvatarFallback className="text-xs text-white font-bold bg-gradient-to-br from-blue-500 to-blue-600">
                                    {lead.customerName?.[0]?.toUpperCase() ||
                                      "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-semibold text-gray-900 truncate">
                                    {lead.customerName || "Unknown"}
                                  </div>
                                  {lead.customerPhone && (
                                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                      <Phone className="h-3 w-3" />
                                      <span className="truncate">{lead.customerPhone}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="py-4">
                              <Select
                                value={lead.status}
                                onValueChange={(value) =>
                                  handleStatusUpdate(lead.id, value)
                                }
                              >
                                <SelectTrigger className="w-full min-w-[140px]">
                                  <SelectValue>
                                    <div className="flex items-center gap-2">
                                      <StatusIcon
                                        className={`h-3.5 w-3.5 ${statusConfig.color}`}
                                      />
                                      <span className="text-xs font-medium">
                                        {statusConfig.label}
                                      </span>
                                    </div>
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(LEAD_STATUS).map(
                                    ([key, config]) => {
                                      const Icon = config.icon;
                                      return (
                                        <SelectItem key={key} value={key}>
                                          <div className="flex items-center gap-2">
                                            <Icon
                                              className={`h-3.5 w-3.5 ${config.color}`}
                                            />
                                            <span className="font-medium">{config.label}</span>
                                          </div>
                                        </SelectItem>
                                      );
                                    }
                                  )}
                                </SelectContent>
                              </Select>
                            </TableCell>

                            <TableCell className="py-4">
                              <div className="flex gap-1 justify-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 w-9 p-0 hover:bg-green-50 hover:text-green-600"
                                  title="Call Customer"
                                >
                                  <Phone className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 w-9 p-0 hover:bg-orange-50 hover:text-orange-600"
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Enhanced Pagination */}
                {totalLeads > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                      {/* Pagination Info */}
                      <div className="text-sm text-gray-700 font-medium">
                        Showing{" "}
                        <span className="font-bold text-orange-600">
                          {(page - 1) * pageSize + 1}
                        </span>
                        {" "}-{" "}
                        <span className="font-bold text-orange-600">
                          {Math.min(page * pageSize, totalLeads)}
                        </span>
                        {" "}of{" "}
                        <span className="font-bold text-orange-600">
                          {totalLeads}
                        </span>
                        {" "}leads
                      </div>

                      {/* Pagination Controls */}
                      <div className="flex items-center gap-2">
                        {/* First Page Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadLeads(1)}
                          disabled={page === 1 || loading}
                          className="h-9 w-9 p-0 disabled:opacity-50"
                          title="First Page"
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>

                        {/* Previous Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadLeads(page - 1)}
                          disabled={page === 1 || loading}
                          className="h-9 px-4 disabled:opacity-50 font-medium"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>

                        {/* Page Number Buttons */}
                        <div className="hidden md:flex items-center gap-1">
                          {totalPages <= 7 ? (
                            // Show all pages if 7 or less
                            [...Array(totalPages)].map((_, idx) => {
                              const pageNum = idx + 1;
                              return (
                                <Button
                                  key={pageNum}
                                  variant={page === pageNum ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => loadLeads(pageNum)}
                                  disabled={loading}
                                  className={
                                    page === pageNum
                                      ? "h-9 w-9 p-0 bg-orange-600 hover:bg-orange-700 text-white font-bold"
                                      : "h-9 w-9 p-0 hover:bg-orange-50"
                                  }
                                >
                                  {pageNum}
                                </Button>
                              );
                            })
                          ) : (
                            // Show smart pagination for more than 7 pages
                            <>
                              {/* First page */}
                              <Button
                                variant={page === 1 ? "default" : "outline"}
                                size="sm"
                                onClick={() => loadLeads(1)}
                                disabled={loading}
                                className={
                                  page === 1
                                    ? "h-9 w-9 p-0 bg-orange-600 hover:bg-orange-700 text-white font-bold"
                                    : "h-9 w-9 p-0 hover:bg-orange-50"
                                }
                              >
                                1
                              </Button>

                              {/* Left ellipsis */}
                              {page > 3 && (
                                <span className="px-2 text-gray-500">...</span>
                              )}

                              {/* Middle pages */}
                              {[...Array(5)].map((_, idx) => {
                                let pageNum;
                                if (page <= 3) {
                                  pageNum = idx + 2;
                                } else if (page >= totalPages - 2) {
                                  pageNum = totalPages - 5 + idx;
                                } else {
                                  pageNum = page - 2 + idx;
                                }

                                if (pageNum <= 1 || pageNum >= totalPages) {
                                  return null;
                                }

                                return (
                                  <Button
                                    key={pageNum}
                                    variant={page === pageNum ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => loadLeads(pageNum)}
                                    disabled={loading}
                                    className={
                                      page === pageNum
                                        ? "h-9 w-9 p-0 bg-orange-600 hover:bg-orange-700 text-white font-bold"
                                        : "h-9 w-9 p-0 hover:bg-orange-50"
                                    }
                                  >
                                    {pageNum}
                                  </Button>
                                );
                              })}

                              {/* Right ellipsis */}
                              {page < totalPages - 2 && (
                                <span className="px-2 text-gray-500">...</span>
                              )}

                              {/* Last page */}
                              <Button
                                variant={page === totalPages ? "default" : "outline"}
                                size="sm"
                                onClick={() => loadLeads(totalPages)}
                                disabled={loading}
                                className={
                                  page === totalPages
                                    ? "h-9 w-9 p-0 bg-orange-600 hover:bg-orange-700 text-white font-bold"
                                    : "h-9 w-9 p-0 hover:bg-orange-50"
                                }
                              >
                                {totalPages}
                              </Button>
                            </>
                          )}
                        </div>

                        {/* Mobile page indicator */}
                        <div className="md:hidden px-3 py-1 bg-gray-100 rounded-md">
                          <span className="text-sm font-semibold text-gray-700">
                            {page} / {totalPages}
                          </span>
                        </div>

                        {/* Next Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadLeads(page + 1)}
                          disabled={page === totalPages || loading}
                          className="h-9 px-4 disabled:opacity-50 font-medium"
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>

                        {/* Last Page Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadLeads(totalPages)}
                          disabled={page === totalPages || loading}
                          className="h-9 w-9 p-0 disabled:opacity-50"
                          title="Last Page"
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
