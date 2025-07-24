'use client';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  ClockIcon,
  DocumentTextIcon,
  EyeIcon,
  CalendarIcon,
  MapPinIcon,
  SparklesIcon,
  ArrowUpIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import IntelligenceTab from '@/components/impact/IntelligenceTab';

interface ImpactMetrics {
  total_grants: number;
  active_grants: number;
  closed_grants: number;
  total_funding_available: number;
  average_grant_amount: number;
  min_grant_amount: number;
  max_grant_amount: number;
  urgent_deadlines: number;
  impact_score: number;
}

interface SuccessMetrics {
  application_success_rate: number;
  total_applications: number;
  successful_applications: number;
  pending_applications: number;
  rejected_applications: number;
}

interface FundingTrend {
  period: string;
  total_funding: number;
  grants_count: number;
}

interface SectorPerformance {
  sector: string;
  grant_count: number;
  total_funding: number;
  avg_funding: number;
}

interface ImpactDashboard {
  metrics: ImpactMetrics;
  kpis: SuccessMetrics;
  trends: FundingTrend[];
  insights: string[];
  charts: {
    timeline: {
      this_week: number;
      this_month: number;
      this_quarter: number;
      total_open: number;
    };
    funding_trends: FundingTrend[];
    sector_performance: SectorPerformance[];
  };
}

export default function ImpactPage() {
  const [dashboard, setDashboard] = useState<ImpactDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('all');

  useEffect(() => {
    fetchImpactDashboard();
  }, []);

  const fetchImpactDashboard = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://navimpact-api.onrender.com/api/v1/impact/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch impact data');
      }
      const data = await response.json();
      setDashboard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f766e]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading impact data: {error}</p>
          <Button onClick={fetchImpactDashboard} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No impact data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Impact Dashboard</h1>
        <p className="text-gray-600">Track your organisation&rsquo;s impact and grant performance</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
            <ChartBarIcon className="h-4 w-4 text-[#0f766e]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0f766e]">{dashboard.metrics.impact_score}</div>
            <p className="text-xs text-muted-foreground">Composite performance score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
            <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(dashboard.metrics.total_funding_available)}
            </div>
            <p className="text-xs text-muted-foreground">Available across {dashboard.metrics.active_grants} grants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Grants</CardTitle>
            <DocumentTextIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{dashboard.metrics.active_grants}</div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Deadlines</CardTitle>
            <ClockIcon className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{dashboard.metrics.urgent_deadlines}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ChartBarIcon className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <ArrowUpIcon className="h-4 w-4" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4" />
            AI Intelligence
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <DocumentTextIcon className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Success Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Success Rate</CardTitle>
            <CardDescription>Your grant application performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-[#0f766e]">
                {formatPercentage(dashboard.kpis.application_success_rate)}
              </span>
              <Badge variant="secondary">Success Rate</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Applications</span>
                <span className="font-medium">{dashboard.kpis.total_applications}</span>
              </div>
              <div className="flex justify-between">
                <span>Successful</span>
                <span className="font-medium text-green-600">{dashboard.kpis.successful_applications}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending</span>
                <span className="font-medium text-yellow-600">{dashboard.kpis.pending_applications}</span>
              </div>
              <div className="flex justify-between">
                <span>Rejected</span>
                <span className="font-medium text-red-600">{dashboard.kpis.rejected_applications}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grant Timeline</CardTitle>
            <CardDescription>Upcoming deadlines and opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-red-500" />
                  <span>This Week</span>
                </div>
                <Badge variant="destructive">{dashboard.charts.timeline.this_week}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-orange-500" />
                  <span>This Month</span>
                </div>
                <Badge variant="outline">{dashboard.charts.timeline.this_month}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-blue-500" />
                  <span>This Quarter</span>
                </div>
                <Badge variant="outline">{dashboard.charts.timeline.this_quarter}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <EyeIcon className="h-4 w-4 text-green-500" />
                  <span>Total Open</span>
                </div>
                <Badge variant="default">{dashboard.charts.timeline.total_open}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      {dashboard.insights.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>Actionable recommendations based on your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboard.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-blue-600 mt-0.5">💡</div>
                  <p className="text-sm text-blue-900">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          {/* Detailed Analytics */}
          <Tabs defaultValue="trends" className="space-y-6">
        <TabsList>
          <TabsTrigger value="trends">Funding Trends</TabsTrigger>
          <TabsTrigger value="sectors">Sector Performance</TabsTrigger>
          <TabsTrigger value="distribution">Grant Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Funding Trends</CardTitle>
              <CardDescription>Monthly funding availability trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboard.charts.funding_trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{trend.period}</span>
                      <span className="text-sm text-gray-600">{trend.grants_count} grants</span>
                    </div>
                    <span className="font-bold text-[#0f766e]">
                      {formatCurrency(trend.total_funding)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sector Performance</CardTitle>
              <CardDescription>Grant distribution by industry sector</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboard.charts.sector_performance.map((sector, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPinIcon className="h-4 w-4 text-gray-500" />
                      <span className="font-medium capitalize">{sector.sector}</span>
                      <Badge variant="outline">{sector.grant_count} grants</Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#0f766e]">
                        {formatCurrency(sector.total_funding)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Avg: {formatCurrency(sector.avg_funding)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grant Distribution</CardTitle>
              <CardDescription>Overview of grant amounts and categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Grant Amounts</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Average Grant</span>
                      <span className="font-medium">{formatCurrency(dashboard.metrics.average_grant_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Minimum Grant</span>
                      <span className="font-medium">{formatCurrency(dashboard.metrics.min_grant_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maximum Grant</span>
                      <span className="font-medium">{formatCurrency(dashboard.metrics.max_grant_amount)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Grant Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Active Grants</span>
                      <Badge variant="default">{dashboard.metrics.active_grants}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Closed Grants</span>
                      <Badge variant="outline">{dashboard.metrics.closed_grants}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Grants</span>
                      <Badge variant="default">{dashboard.metrics.total_grants}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-6">
          <IntelligenceTab />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Impact Reports</CardTitle>
              <CardDescription>Generate and download comprehensive impact reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="flex items-center gap-2">
                    <DocumentTextIcon className="h-4 w-4" />
                    Executive Summary
                  </Button>
                  <Button className="flex items-center gap-2">
                    <ChartBarIcon className="h-4 w-4" />
                    Detailed Analysis
                  </Button>
                  <Button className="flex items-center gap-2">
                    <ArrowUpIcon className="h-4 w-4" />
                    Sector Report
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  Customize reports for different audiences and export in multiple formats.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Last Updated */}
      <div className="mt-8 text-center text-sm text-gray-500">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
} 