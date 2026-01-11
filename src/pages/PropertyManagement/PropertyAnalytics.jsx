import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Eye,
  TrendingUp,
  Clock,
  UserX,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionLoader } from '@/components/ui/loading-components';
import { propertyApi } from '@/services/propertyService';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function PropertyAnalytics({ draftId, property }) {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, all

  useEffect(() => {
    fetchAnalytics();
  }, [draftId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      const response = await propertyApi.getPropertyAnalytics(draftId, timeRange);
      
      if (response.success) {
        setAnalytics(response.data);
      } else {
        toast.error('Failed to load analytics');
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error(error.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4" />;
    if (trend === 'down') return <ArrowDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-green-600 dark:text-green-400';
    if (trend === 'down') return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  if (loading) {
    return <SectionLoader message="Loading analytics..." />;
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const statsCards = [
    {
      title: 'Total Views',
      value: analytics?.views?.total?.toLocaleString() || 0,
      change: analytics?.views?.change || 0,
      trend: analytics?.views?.trend || 'stable',
      icon: Eye,
      description: 'Total property page views',
      color: 'blue',
      chartData: analytics?.views?.daily || [],
    },
    {
      title: 'Bounce Rate',
      value: `${analytics?.bounceRate?.total || 0}%`,
      change: analytics?.bounceRate?.change || 0,
      trend: analytics?.bounceRate?.trend || 'stable',
      icon: UserX,
      description: 'Visitors who left without interaction',
      color: 'red',
      chartData: analytics?.bounceRate?.daily || [],
      isInverted: true, // Lower is better
    },
    {
      title: 'Conversion Rate',
      value: `${analytics?.conversionRate?.total || 0}%`,
      change: analytics?.conversionRate?.change || 0,
      trend: analytics?.conversionRate?.trend || 'stable',
      icon: TrendingUp,
      description: 'Visitors who contacted you',
      color: 'green',
      chartData: analytics?.conversionRate?.daily || [],
    },
    {
      title: 'Avg. Time Spent',
      value: analytics?.averageTimeOnPage?.totalFormatted || '0m 0s',
      change: analytics?.averageTimeOnPage?.change || 0,
      trend: analytics?.averageTimeOnPage?.trend || 'stable',
      icon: Clock,
      description: 'Average time on property page',
      color: 'purple',
      chartData: analytics?.averageTimeOnPage?.daily || [],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-1 bg-orange-600 rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Property Analytics
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Track your property's performance and engagement
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: '7 Days', value: '7d' },
              { label: '30 Days', value: '30d' },
              { label: '90 Days', value: '90d' },
              { label: 'All Time', value: 'all' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === option.value
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid - Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const getGradientColor = () => {
            switch (stat.color) {
              case 'blue': return 'from-blue-500 to-blue-600 shadow-blue-500/20';
              case 'red': return 'from-red-500 to-red-600 shadow-red-500/20';
              case 'green': return 'from-green-500 to-green-600 shadow-green-500/20';
              case 'purple': return 'from-purple-500 to-purple-600 shadow-purple-500/20';
              default: return 'from-blue-500 to-blue-600 shadow-blue-500/20';
            }
          };

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${getGradientColor()} text-white rounded-xl p-6 shadow-lg relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                <Icon className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <div className="mb-2">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <div className="text-3xl font-extrabold">{stat.value}</div>
                  {stat.change !== 0 && (
                    <div className="flex items-center gap-1">
                      {getTrendIcon(stat.isInverted ? (stat.trend === 'up' ? 'down' : stat.trend === 'down' ? 'up' : 'stable') : stat.trend)}
                      <span className="text-sm font-bold opacity-90">
                        {Math.abs(stat.change)}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium opacity-90">{stat.title}</div>
                <p className="text-xs opacity-75 mt-1">{stat.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const getChartColor = () => {
            switch (stat.color) {
              case 'blue': return '#3b82f6';
              case 'red': return '#ef4444';
              case 'green': return '#10b981';
              case 'purple': return '#8b5cf6';
              default: return '#3b82f6';
            }
          };

          return (
            <motion.div
              key={`chart-${stat.title}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow bg-white shadow-sm border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg ${
                        stat.color === 'blue' ? 'bg-blue-100' :
                        stat.color === 'red' ? 'bg-red-100' :
                        stat.color === 'green' ? 'bg-green-100' :
                        'bg-purple-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          stat.color === 'blue' ? 'text-blue-600' :
                          stat.color === 'red' ? 'text-red-600' :
                          stat.color === 'green' ? 'text-green-600' :
                          'text-purple-600'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold text-gray-900">
                          {stat.title} Trend
                        </CardTitle>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Last 7 days performance
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stat.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={getChartColor()} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={getChartColor()} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                          tickLine={false}
                          axisLine={false}
                          width={45}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.98)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '10px 14px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          }}
                          labelStyle={{ fontWeight: 600, marginBottom: '6px', color: '#374151' }}
                          itemStyle={{ color: getChartColor(), fontSize: '14px', fontWeight: 500 }}
                          formatter={(value) => {
                            if (stat.title === 'Avg. Time Spent') {
                              return [formatTime(value), 'Time'];
                            }
                            if (stat.title === 'Bounce Rate' || stat.title === 'Conversion Rate') {
                              return [`${value}%`, stat.title];
                            }
                            return [value, stat.title];
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={getChartColor()}
                          strokeWidth={2.5}
                          fill={`url(#gradient-${index})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
