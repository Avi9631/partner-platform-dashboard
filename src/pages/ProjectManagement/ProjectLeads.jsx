import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Calendar, MessageSquare, User, Filter, Home } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ProjectLeads({ draftId, project }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, [draftId]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await leadsApi.getProjectLeads(draftId);
      
      // Mock data for now
      setLeads([
        {
          id: 1,
          name: 'Rajesh Patel',
          email: 'rajesh@example.com',
          phone: '+91 98765 43210',
          message: 'Interested in 3BHK unit, would like to schedule a site visit',
          date: new Date().toISOString(),
          status: 'new',
          source: 'website',
          interestedUnit: '3 BHK',
          budget: '₹80-90 Lakhs',
        },
        {
          id: 2,
          name: 'Sneha Gupta',
          email: 'sneha@example.com',
          phone: '+91 98765 43211',
          message: 'Looking for 2BHK, preferred floor 5+',
          date: new Date(Date.now() - 86400000).toISOString(),
          status: 'contacted',
          source: 'phone',
          interestedUnit: '2 BHK',
          budget: '₹60-70 Lakhs',
        },
        {
          id: 3,
          name: 'Vikram Sharma',
          email: 'vikram@example.com',
          phone: '+91 98765 43212',
          message: 'Want to know about payment plans and possession date',
          date: new Date(Date.now() - 172800000).toISOString(),
          status: 'site-visit',
          source: 'website',
          interestedUnit: '4 BHK',
          budget: '₹1-1.2 Cr',
        },
        {
          id: 4,
          name: 'Anita Reddy',
          email: 'anita@example.com',
          phone: '+91 98765 43213',
          message: 'Booked 2BHK unit on 15th floor',
          date: new Date(Date.now() - 259200000).toISOString(),
          status: 'converted',
          source: 'reference',
          interestedUnit: '2 BHK',
          budget: '₹65 Lakhs',
        },
      ]);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'contacted':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'site-visit':
        return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
      case 'converted':
        return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'site-visit':
        return 'Site Visit Scheduled';
      default:
        return status;
    }
  };

  const filteredLeads = filter === 'all' 
    ? leads 
    : leads.filter(lead => lead.status === filter);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leads</h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Leads</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="site-visit">Site Visit</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads List */}
      {filteredLeads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No leads yet</h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              When people show interest in your project, their details will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                          <Badge className={getStatusColor(lead.status)}>
                            {getStatusLabel(lead.status)}
                          </Badge>
                        </div>
                        <div className="flex flex-col gap-2 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{lead.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(lead.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Lead Details */}
                    <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-500">Interested Unit</p>
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          <Home className="h-3 w-3" />
                          {lead.interestedUnit}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Budget</p>
                        <p className="text-sm font-medium text-gray-900">{lead.budget}</p>
                      </div>
                    </div>

                    {lead.message && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <MessageSquare className="h-4 w-4 inline mr-2 text-gray-400" />
                          {lead.message}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row lg:flex-col gap-2">
                    <Button size="sm" className="gap-2">
                      <Phone className="h-4 w-4" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
