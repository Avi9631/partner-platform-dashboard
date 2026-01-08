import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  SelectValue 
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
import { fetchLeads, fetchLeadsStats, updateLeadStatus } from "@/services/leadsService";
import { toast } from "sonner";

// Dummy data for demonstration
const DUMMY_LEADS = [
  {
    id: "lead_001",
    type: "PROPERTY",
    reason: "VIRTUAL_TOUR",
    status: "NEW",
    listingId: "PROP-12345",
    listingTitle: "Luxurious 3BHK Apartment in Bandra West",
    customerName: "Rahul Sharma",
    customerEmail: "rahul.sharma@example.com",
    customerPhone: "+91 98765 43210",
    customerAvatar: null,
    message: "I'm interested in scheduling a virtual tour this weekend. Please let me know your available time slots.",
    location: "Mumbai, Maharashtra",
    createdAt: "2026-01-08T10:30:00Z",
    scheduledDate: "2026-01-11T15:00:00Z", // Saturday 3 PM
    scheduledTimeSlot: "3:00 PM - 3:30 PM",
    preferredTime: "Weekend afternoon",
  },
  {
    id: "lead_002",
    type: "PG_COLIVING",
    reason: "CONNECT_AGENT",
    status: "CONTACTED",
    listingId: "PG-7890",
    listingTitle: "Modern Co-living Space near IT Park",
    customerName: "Priya Patel",
    customerEmail: "priya.patel@example.com",
    customerPhone: "+91 87654 32109",
    customerAvatar: null,
    message: "Looking for a single occupancy room. Would like to discuss amenities and rent details.",
    location: "Pune, Maharashtra",
    createdAt: "2026-01-07T15:45:00Z",
    scheduledDate: null,
    preferredContactTime: "10:00 AM - 6:00 PM on weekdays",
  },
  {
    id: "lead_003",
    type: "PROJECT",
    reason: "CALLBACK_REQUEST",
    status: "IN_PROGRESS",
    listingId: "PROJ-5432",
    listingTitle: "Green Valley Residency - Premium Villas",
    customerName: "Amit Kumar",
    customerEmail: "amit.k@example.com",
    customerPhone: "+91 76543 21098",
    customerAvatar: null,
    message: "Interested in 4BHK villa. Please call me between 6-8 PM on weekdays.",
    location: "Bangalore, Karnataka",
    createdAt: "2026-01-07T09:20:00Z",
    scheduledDate: "2026-01-08T18:00:00Z", // 6 PM today
    requestedCallbackTime: "6:00 PM - 8:00 PM",
    preferredDays: "Weekdays only",
  },
  {
    id: "lead_004",
    type: "PROPERTY",
    reason: "CONNECT_AGENT",
    status: "NEW",
    listingId: "PROP-98765",
    listingTitle: "Spacious 2BHK with Sea View",
    customerName: "Sneha Reddy",
    customerEmail: "sneha.reddy@example.com",
    customerPhone: "+91 65432 10987",
    customerAvatar: null,
    message: "Would like to know more about the property and schedule a site visit.",
    location: "Visakhapatnam, Andhra Pradesh",
    createdAt: "2026-01-06T14:10:00Z",
    scheduledDate: null,
    preferredContactTime: "Anytime during business hours",
  },
  {
    id: "lead_005",
    type: "PG_COLIVING",
    reason: "VIRTUAL_TOUR",
    status: "COMPLETED",
    listingId: "PG-4567",
    listingTitle: "Girls Hostel near University Campus",
    customerName: "Ananya Singh",
    customerEmail: "ananya.singh@example.com",
    customerPhone: "+91 54321 09876",
    customerAvatar: null,
    message: "Need accommodation for the upcoming semester. Want to see the rooms and facilities.",
    location: "Delhi, NCR",
    createdAt: "2026-01-05T11:30:00Z",
    scheduledDate: "2026-01-06T14:00:00Z", // Completed yesterday
    scheduledTimeSlot: "2:00 PM - 2:30 PM",
    completedAt: "2026-01-06T14:25:00Z",
  },
  {
    id: "lead_006",
    type: "PROJECT",
    reason: "VIRTUAL_TOUR",
    status: "NEW",
    listingId: "PROJ-2468",
    listingTitle: "Skyline Towers - Smart City Living",
    customerName: "Vikram Mehta",
    customerEmail: "vikram.m@example.com",
    customerPhone: "+91 43210 98765",
    customerAvatar: null,
    message: "Looking for investment opportunities. Want a virtual walkthrough of the show flat.",
    location: "Gurgaon, Haryana",
    createdAt: "2026-01-08T08:15:00Z",
    scheduledDate: "2026-01-09T11:00:00Z", // Tomorrow 11 AM
    scheduledTimeSlot: "11:00 AM - 11:45 AM",
    preferredTime: "Morning hours",
  },
  {
    id: "lead_007",
    type: "PROPERTY",
    reason: "CALLBACK_REQUEST",
    status: "CONTACTED",
    listingId: "PROP-13579",
    listingTitle: "Cozy 1BHK in Koramangala",
    customerName: "Deepak Joshi",
    customerEmail: "deepak.joshi@example.com",
    customerPhone: "+91 32109 87654",
    customerAvatar: null,
    message: "Working professional looking for a rental apartment. Please call back with details.",
    location: "Bangalore, Karnataka",
    createdAt: "2026-01-06T16:40:00Z",
    scheduledDate: "2026-01-07T19:30:00Z", // Already contacted
    requestedCallbackTime: "7:00 PM - 9:00 PM",
    preferredDays: "After office hours",
  },
  {
    id: "lead_008",
    type: "PG_COLIVING",
    reason: "CALLBACK_REQUEST",
    status: "NEW",
    listingId: "PG-9876",
    listingTitle: "Executive PG for Working Professionals",
    customerName: "Neha Kapoor",
    customerEmail: "neha.kapoor@example.com",
    customerPhone: "+91 21098 76543",
    customerAvatar: null,
    message: "Recently relocated to the city. Need a comfortable PG with good food facilities.",
    location: "Hyderabad, Telangana",
    createdAt: "2026-01-08T12:00:00Z",
    scheduledDate: "2026-01-08T20:00:00Z", // Tonight 8 PM
    requestedCallbackTime: "8:00 PM - 10:00 PM",
    preferredDays: "Evening preferred",
  },
  {
    id: "lead_009",
    type: "PROJECT",
    reason: "CONNECT_AGENT",
    status: "IN_PROGRESS",
    listingId: "PROJ-1357",
    listingTitle: "Lakeside Apartments - Phase 2",
    customerName: "Rajesh Gupta",
    customerEmail: "rajesh.gupta@example.com",
    customerPhone: "+91 10987 65432",
    customerAvatar: null,
    message: "Interested in pre-booking. Need complete project details and payment plans.",
    location: "Pune, Maharashtra",
    createdAt: "2026-01-05T13:25:00Z",
    scheduledDate: null,
    preferredContactTime: "9:00 AM - 5:00 PM",
  },
  {
    id: "lead_010",
    type: "PROPERTY",
    reason: "VIRTUAL_TOUR",
    status: "CLOSED",
    listingId: "PROP-24680",
    listingTitle: "Penthouse with Terrace Garden",
    customerName: "Kavita Nair",
    customerEmail: "kavita.nair@example.com",
    customerPhone: "+91 09876 54321",
    customerAvatar: null,
    message: "Premium property buyer. Looking for luxury apartments with modern amenities.",
    location: "Chennai, Tamil Nadu",
    createdAt: "2026-01-04T10:00:00Z",
    scheduledDate: "2026-01-05T16:00:00Z", // Tour was done
    scheduledTimeSlot: "4:00 PM - 4:45 PM",
    completedAt: "2026-01-05T16:40:00Z",
    closedReason: "Customer not interested",
  },
];

const DUMMY_STATS = {
  total: 150,
  new: 25,
  inProgress: 40,
  completed: 70,
};

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
  const [useDummyData, setUseDummyData] = useState(true); // Toggle for dummy data
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

  // Filter dummy data based on filters
  const filterDummyData = (data, filters) => {
    return data.filter((lead) => {
      if (filters.type !== "all" && lead.type !== filters.type) return false;
      if (filters.reason !== "all" && lead.reason !== filters.reason) return false;
      if (filters.status !== "all" && lead.status !== filters.status) return false;
      return true;
    });
  };

  // Fetch leads and stats
  const loadLeads = async (currentPage = 1, resetPage = false) => {
    try {
      setLoading(true);
      
      if (useDummyData) {
        // Use dummy data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        const filteredLeads = filterDummyData(DUMMY_LEADS, filters);
        setTotalLeads(filteredLeads.length);
        setTotalPages(Math.ceil(filteredLeads.length / pageSize));
        
        // Paginate dummy data
        const startIdx = ((resetPage ? 1 : currentPage) - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        setLeads(filteredLeads.slice(startIdx, endIdx));
        setPage(resetPage ? 1 : currentPage);
        setStats(DUMMY_STATS);
      } else {
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

        setLeads(leadsData.leads || []);
        setTotalLeads(leadsData.total || 0);
        setTotalPages(leadsData.totalPages || 1);
        setPage(resetPage ? 1 : currentPage);
        setStats(statsData);
      }
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
  }, [filters, useDummyData]);

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
      if (useDummyData) {
        // Update dummy data
        setLeads(prevLeads => 
          prevLeads.map(lead => 
            lead.id === leadId ? { ...lead, status: newStatus } : lead
          )
        );
        toast.success("Lead status updated successfully");
      } else {
        // Update via API
        await updateLeadStatus(leadId, newStatus);
        toast.success("Lead status updated successfully");
        loadLeads(page);
      }
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
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${config.bgColor} ${config.borderColor} ${config.textColor}`}>
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
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Leads Management</h1>
              <p className="text-orange-100 text-sm md:text-base">
                Manage and track all your property leads in one place
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={useDummyData ? "default" : "outline"} 
                size="sm"
                onClick={() => setUseDummyData(!useDummyData)}
                className={useDummyData ? "bg-white text-orange-600 hover:bg-orange-50" : "bg-orange-500 hover:bg-orange-600"}
              >
                {useDummyData ? "Using Dummy Data" : "Using API Data"}
              </Button>
              <Button variant="outline" size="sm" className="bg-white text-orange-600 hover:bg-orange-50">
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

      {/* Filters Section */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Listing Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Listing Type</label>
                <Select
                  value={filters.type}
                  onValueChange={(value) => setFilters({ ...filters, type: value })}
                >
                  <SelectTrigger>
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason</label>
                <Select
                  value={filters.reason}
                  onValueChange={(value) => setFilters({ ...filters, reason: value })}
                >
                  <SelectTrigger>
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters({ ...filters, status: value })}
                >
                  <SelectTrigger>
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

              {/* Apply Button */}
              <div className="space-y-2">
                <label className="invisible text-sm">Apply</label>
                <Button 
                  onClick={applyFilters} 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle>Leads List</CardTitle>
                <CardDescription>
                  {totalLeads > 0 
                    ? `Showing ${((page - 1) * pageSize) + 1}-${Math.min(page * pageSize, totalLeads)} of ${totalLeads} leads`
                    : "No leads found"
                  }
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={pageSize.toString()} onValueChange={(val) => setPageSize(parseInt(val))}>
                  <SelectTrigger className="w-[120px]">
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
                  onClick={() => loadLeads(page)}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
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
                  {filters.type !== "all" || filters.reason !== "all" || filters.status !== "all"
                    ? "Try adjusting your filters to find what you're looking for."
                    : "No leads available at the moment."}
                </p>
              </motion.div>
            ) : (
              <>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Request Raised</TableHead>
                        <TableHead className="w-[100px]">Type</TableHead>
                        <TableHead className="min-w-[220px]">Listing Details</TableHead>
                        <TableHead className="w-[140px]">Reason</TableHead>
                        <TableHead className="w-[180px]">Scheduled For</TableHead>
                        <TableHead className="min-w-[180px]">Customer</TableHead>
                        <TableHead className="w-[140px]">Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((lead) => {
                        const statusConfig = LEAD_STATUS[lead.status] || {};
                        const StatusIcon = statusConfig.icon || AlertCircle;
                        
                        return (
                          <TableRow key={lead.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="text-sm">
                                  <div>{formatDate(lead.createdAt)}</div>
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <TypeIcon type={lead.type} />
                            </TableCell>
                            
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium text-sm">
                                  {lead.listingTitle || "Untitled Listing"}
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <span>ID: {lead.listingId}</span>
                                  {lead.location && (
                                    <>
                                      <span>•</span>
                                      <MapPin className="h-3 w-3 inline" />
                                      <span>{lead.location}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <ReasonBadge reason={lead.reason} />
                            </TableCell>
                            
                            <TableCell>
                              <div className="space-y-1">
                                {lead.scheduledDate ? (
                                  <>
                                    <div className="flex items-center gap-1.5 text-sm font-medium">
                                      <Calendar className="h-3.5 w-3.5 text-orange-600" />
                                      <span>{formatDate(lead.scheduledDate)}</span>
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
                                    {lead.preferredContactTime || lead.preferredTime || "Not scheduled"}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex items-start gap-2">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                  <AvatarImage src={lead.customerAvatar} />
                                  <AvatarFallback className="text-xs">
                                    {lead.customerName?.[0]?.toUpperCase() || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium truncate">
                                    {lead.customerName || "Unknown"}
                                  </div>
                                  {lead.customerPhone && (
                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      <span>{lead.customerPhone}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <Select
                                value={lead.status}
                                onValueChange={(value) => handleStatusUpdate(lead.id, value)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue>
                                    <div className="flex items-center gap-2">
                                      <StatusIcon className={`h-3 w-3 ${statusConfig.color}`} />
                                      <span className="text-xs">{statusConfig.label}</span>
                                    </div>
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(LEAD_STATUS).map(([key, config]) => {
                                    const Icon = config.icon;
                                    return (
                                      <SelectItem key={key} value={key}>
                                        <div className="flex items-center gap-2">
                                          <Icon className={`h-3 w-3 ${config.color}`} />
                                          <span>{config.label}</span>
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Phone className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
                    <div className="text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadLeads(1)}
                        disabled={page === 1}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadLeads(page - 1)}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      
                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = idx + 1;
                          } else if (page <= 3) {
                            pageNum = idx + 1;
                          } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + idx;
                          } else {
                            pageNum = page - 2 + idx;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={page === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => loadLeads(pageNum)}
                              className={page === pageNum ? "bg-orange-600 hover:bg-orange-700" : ""}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadLeads(page + 1)}
                        disabled={page === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadLeads(totalPages)}
                        disabled={page === totalPages}
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
    </div>
  );
}
