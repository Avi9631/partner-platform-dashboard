import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Eye, Users, Phone, Calendar, BarChart3, Home } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectAnalytics({ draftId, project }) {
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    totalLeads: 0,
    totalCalls: 0,
    weeklyViews: 0,
    conversionRate: 0,
    siteVisits: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [draftId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await analyticsApi.getProjectAnalytics(draftId);
      
      // Mock data for now
      setAnalytics({
        totalViews: 1245,
        totalLeads: 87,
        totalCalls: 45,
        weeklyViews: 156,
        conversionRate: 6.9,
        siteVisits: 23,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Views',
      value: analytics.totalViews,
      icon: Eye,
      description: 'All time views',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Leads',
      value: analytics.totalLeads,
      icon: Users,
      description: 'Inquiries received',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Phone Calls',
      value: analytics.totalCalls,
      icon: Phone,
      description: 'Direct calls',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Site Visits',
      value: analytics.siteVisits,
      icon: Home,
      description: 'Scheduled visits',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Weekly Views',
      value: analytics.weeklyViews,
      icon: TrendingUp,
      description: 'Last 7 days',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Conversion Rate Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            Performance Metrics
          </CardTitle>
          <CardDescription>View to lead conversion rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Conversion Rate</span>
                <span className="text-2xl font-bold text-green-600">
                  {analytics.conversionRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.conversionRate}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {analytics.totalLeads} leads from {analytics.totalViews} views
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Section */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
          <CardDescription>Coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            View charts, trends, unit-wise analytics, and detailed insights about your project performance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
