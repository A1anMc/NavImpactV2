'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Target, 
  Users, 
  Bookmark,
  Share2,
  Download,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Building,
  Tag,
  MessageSquare,
  FileText,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface Grant {
  id: string;
  title: string;
  description: string;
  source: string;
  status: string;
  min_amount?: number;
  max_amount?: number;
  deadline?: string;
  industry_focus?: string;
  location_eligibility?: string;
  org_type_eligible?: string[];
  funding_purpose?: string[];
  audience_tags?: string[];
  relevance_score?: number;
  success_probability?: number;
  tags?: string[];
  notes?: string;
  team_members?: string[];
  documents?: string[];
  application_status?: 'not_started' | 'in_progress' | 'submitted' | 'awarded' | 'rejected';
}

interface GrantAnalytics {
  totalGrants: number;
  openGrants: number;
  closingSoon: number;
  totalFunding: number;
  averageAmount: number;
  topIndustries: { industry: string; count: number }[];
  fundingTrends: { month: string; amount: number }[];
  successRate: number;
  upcomingDeadlines: Grant[];
}

interface SavedSearch {
  id: string;
  name: string;
  filters: any;
  lastUsed: string;
  resultCount: number;
}

interface GrantRecommendation {
  grant: Grant;
  reasons: string[];
  matchScore: number;
  priority: 'high' | 'medium' | 'low';
}

export default function GrantsPage() {
  // State management
  const [grants, setGrants] = useState<Grant[]>([]);
  const [filteredGrants, setFilteredGrants] = useState<Grant[]>([]);
  const [recommendations, setRecommendations] = useState<GrantRecommendation[]>([]);
  const [analytics, setAnalytics] = useState<GrantAnalytics | null>(null);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('discover');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [showCollaboration, setShowCollaboration] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    industry: '',
    location: '',
    orgType: '',
    minAmount: 0,
    maxAmount: 1000000,
    deadlineRange: '',
    fundingPurpose: '',
    audienceTags: '',
    relevanceScore: 0,
    successProbability: 0
  });

  // Enhanced mock data with AI features
  const mockGrants: Grant[] = [
    {
      id: '1',
      title: 'Digital Inclusion Innovation Fund',
      description: 'Supporting innovative projects that bridge the digital divide and improve access to technology for underserved communities across Victoria.',
      source: 'Victorian Government',
      status: 'open',
      min_amount: 25000,
      max_amount: 200000,
      deadline: '2024-04-15',
      industry_focus: 'Technology',
      location_eligibility: 'Victoria',
      org_type_eligible: ['Non-profit', 'Social Enterprise', 'Educational Institution'],
      funding_purpose: ['Digital Inclusion', 'Technology Access', 'Community Development'],
      audience_tags: ['Youth', 'Underserved Communities', 'Digital Literacy'],
      relevance_score: 95,
      success_probability: 78,
      tags: ['High Priority', 'Digital Innovation', 'Community Impact'],
      application_status: 'not_started'
    },
    {
      id: '2',
      title: 'Sustainable Business Accelerator',
      description: 'Accelerating sustainable business models and circular economy solutions for Victorian SMEs and startups.',
      source: 'Sustainability Victoria',
      status: 'open',
      min_amount: 50000,
      max_amount: 500000,
      deadline: '2024-05-30',
      industry_focus: 'Sustainability',
      location_eligibility: 'Victoria',
      org_type_eligible: ['SME', 'Startup', 'Social Enterprise'],
      funding_purpose: ['Sustainability', 'Circular Economy', 'Business Development'],
      audience_tags: ['SMEs', 'Startups', 'Sustainability Experts'],
      relevance_score: 88,
      success_probability: 65,
      tags: ['Sustainability', 'Business Growth', 'Circular Economy'],
      application_status: 'in_progress'
    },
    {
      id: '3',
      title: 'Indigenous Cultural Preservation Grant',
      description: 'Supporting Indigenous communities to preserve and promote cultural heritage through digital storytelling and community programs.',
      source: 'Indigenous Affairs Victoria',
      status: 'closing_soon',
      min_amount: 10000,
      max_amount: 100000,
      deadline: '2024-03-20',
      industry_focus: 'Cultural Heritage',
      location_eligibility: 'Victoria',
      org_type_eligible: ['Indigenous Organisation', 'Non-profit', 'Community Group'],
      funding_purpose: ['Cultural Preservation', 'Indigenous Heritage', 'Community Programs'],
      audience_tags: ['Indigenous Communities', 'Cultural Heritage', 'Digital Storytelling'],
      relevance_score: 92,
      success_probability: 82,
      tags: ['Indigenous', 'Cultural Heritage', 'High Priority'],
      application_status: 'submitted'
    },
    {
      id: '4',
      title: 'Mental Health Innovation Challenge',
      description: 'Funding innovative approaches to mental health support, particularly for young people and vulnerable populations.',
      source: 'Department of Health',
      status: 'open',
      min_amount: 75000,
      max_amount: 300000,
      deadline: '2024-06-15',
      industry_focus: 'Healthcare',
      location_eligibility: 'Victoria',
      org_type_eligible: ['Healthcare Provider', 'Non-profit', 'Research Institution'],
      funding_purpose: ['Mental Health', 'Innovation', 'Youth Services'],
      audience_tags: ['Youth', 'Mental Health Professionals', 'Vulnerable Populations'],
      relevance_score: 85,
      success_probability: 70,
      tags: ['Mental Health', 'Innovation', 'Youth Focus'],
      application_status: 'not_started'
    },
    {
      id: '5',
      title: 'Renewable Energy Community Fund',
      description: 'Supporting community-led renewable energy projects that reduce carbon emissions and create local economic benefits.',
      source: 'Clean Energy Victoria',
      status: 'open',
      min_amount: 50000,
      max_amount: 250000,
      deadline: '2024-07-01',
      industry_focus: 'Energy',
      location_eligibility: 'Victoria',
      org_type_eligible: ['Community Group', 'Non-profit', 'Social Enterprise'],
      funding_purpose: ['Renewable Energy', 'Community Development', 'Carbon Reduction'],
      audience_tags: ['Community Groups', 'Energy Experts', 'Environmentalists'],
      relevance_score: 90,
      success_probability: 75,
      tags: ['Renewable Energy', 'Community', 'Sustainability'],
      application_status: 'not_started'
    }
  ];

  // Mock analytics data
  const mockAnalytics: GrantAnalytics = {
    totalGrants: 156,
    openGrants: 89,
    closingSoon: 12,
    totalFunding: 45000000,
    averageAmount: 288462,
    topIndustries: [
      { industry: 'Technology', count: 23 },
      { industry: 'Healthcare', count: 18 },
      { industry: 'Sustainability', count: 15 },
      { industry: 'Education', count: 12 },
      { industry: 'Community', count: 10 }
    ],
    fundingTrends: [
      { month: 'Jan', amount: 3200000 },
      { month: 'Feb', amount: 3800000 },
      { month: 'Mar', amount: 4200000 },
      { month: 'Apr', amount: 4500000 }
    ],
    successRate: 68,
    upcomingDeadlines: mockGrants.filter(g => g.status === 'closing_soon').slice(0, 5)
  };

  // Mock recommendations
  const mockRecommendations: GrantRecommendation[] = [
    {
      grant: mockGrants[0],
      reasons: [
        'Matches your digital inclusion project focus',
        'High success probability based on your profile',
        'Deadline aligns with your project timeline',
        'Funding range fits your budget requirements'
      ],
      matchScore: 95,
      priority: 'high'
    },
    {
      grant: mockGrants[1],
      reasons: [
        'Aligns with your sustainability goals',
        'Your organisation type is eligible',
        'Good match for your business model'
      ],
      matchScore: 88,
      priority: 'high'
    }
  ];

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setGrants(mockGrants);
      setFilteredGrants(mockGrants);
      setAnalytics(mockAnalytics);
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 1000);
  }, []);

  // Computed values
  const totalFunding = useMemo(() => 
    filteredGrants.reduce((sum, g) => sum + (g.max_amount || 0), 0), 
    [filteredGrants]
  );

  const averageRelevanceScore = useMemo(() => 
    filteredGrants.length > 0 
      ? filteredGrants.reduce((sum, g) => sum + (g.relevance_score || 0), 0) / filteredGrants.length 
      : 0, 
    [filteredGrants]
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closing_soon': return 'bg-orange-100 text-orange-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Open';
      case 'closing_soon': return 'Closing Soon';
      case 'closed': return 'Closed';
      default: return 'Unknown';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters: any) => {
    let filtered = grants.filter(grant => {
      const matchesSearch = !currentFilters.search || 
        grant.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
        grant.description.toLowerCase().includes(currentFilters.search.toLowerCase());
      
      const matchesStatus = !currentFilters.status || grant.status === currentFilters.status;
      const matchesIndustry = !currentFilters.industry || grant.industry_focus === currentFilters.industry;
      const matchesLocation = !currentFilters.location || grant.location_eligibility?.includes(currentFilters.location);
      
      const matchesAmount = (!currentFilters.minAmount || (grant.max_amount || 0) >= currentFilters.minAmount) &&
                           (!currentFilters.maxAmount || (grant.min_amount || 0) <= currentFilters.maxAmount);
      
      const matchesRelevance = !currentFilters.relevanceScore || (grant.relevance_score || 0) >= currentFilters.relevanceScore;
      
      return matchesSearch && matchesStatus && matchesIndustry && matchesLocation && matchesAmount && matchesRelevance;
    });
    
    setFilteredGrants(filtered);
  };

  const saveSearch = () => {
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: `Search ${savedSearches.length + 1}`,
      filters: filters,
      lastUsed: new Date().toISOString(),
      resultCount: filteredGrants.length
    };
    setSavedSearches([...savedSearches, newSearch]);
  };

  const exportGrants = () => {
    const csvContent = [
      ['Title', 'Source', 'Status', 'Min Amount', 'Max Amount', 'Deadline', 'Industry', 'Relevance Score'],
      ...filteredGrants.map(g => [
        g.title,
        g.source,
        g.status,
        g.min_amount?.toString() || '',
        g.max_amount?.toString() || '',
        g.deadline || '',
        g.industry_focus || '',
        g.relevance_score?.toString() || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grants-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-8 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Grants Hub</h1>
            <p className="text-gray-600">AI-powered grant discovery and management platform</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={exportGrants}
              className="text-gray-600 border-gray-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-gray-600 border-gray-300"
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Recommendations
            </Button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Grants</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.totalGrants}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>{analytics?.openGrants} currently open</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Funding</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics?.totalFunding || 0)}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  <span>Avg: {formatCurrency(analytics?.averageAmount || 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.successRate}%</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={analytics?.successRate || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Closing Soon</p>
                  <p className="text-2xl font-bold text-orange-600">{analytics?.closingSoon}</p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Next 30 days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="discover" className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Discover</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Recommendations</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Collaboration</span>
            </TabsTrigger>
          </TabsList>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            {/* Smart Search Bar */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="smart-search" className="text-sm font-medium text-gray-700 mb-2 block">
                      Smart Search
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="smart-search"
                        placeholder="Try: 'grants for youth digital inclusion in Victoria' or 'sustainability funding for SMEs'"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="pl-10 pr-4 py-3 text-lg"
                      />
                    </div>
                  </div>
                  <Button onClick={saveSearch} variant="outline">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Advanced Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Status</Label>
                      <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Status</SelectItem>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="closing_soon">Closing Soon</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Industry Focus</Label>
                      <Select value={filters.industry} onValueChange={(value) => handleFilterChange('industry', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Industries" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Industries</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Sustainability">Sustainability</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Cultural Heritage">Cultural Heritage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Location</Label>
                      <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Locations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Locations</SelectItem>
                          <SelectItem value="Victoria">Victoria</SelectItem>
                          <SelectItem value="Melbourne">Melbourne</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Min Relevance Score</Label>
                      <Select value={filters.relevanceScore.toString()} onValueChange={(value) => handleFilterChange('relevanceScore', parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any Score" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Any Score</SelectItem>
                          <SelectItem value="70">70%+</SelectItem>
                          <SelectItem value="80">80%+</SelectItem>
                          <SelectItem value="90">90%+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Grants Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredGrants.map(grant => (
                <Card key={grant.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{grant.title}</h3>
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge className={getStatusColor(grant.status)}>
                            {getStatusLabel(grant.status)}
                          </Badge>
                          <span className="text-xs text-gray-500">{grant.source}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{grant.description}</p>

                    {/* Relevance Score */}
                    {grant.relevance_score && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-500">Relevance Score</span>
                          <span className="font-medium text-gray-900">{grant.relevance_score}%</span>
                        </div>
                        <Progress value={grant.relevance_score} className="h-2" />
                      </div>
                    )}

                    <div className="space-y-2 mb-4">
                      {grant.min_amount && grant.max_amount && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Funding Range:</span>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(grant.min_amount)} - {formatCurrency(grant.max_amount)}
                          </span>
                        </div>
                      )}
                      {grant.deadline && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Deadline:</span>
                          <span className="font-medium text-gray-900">
                            {new Date(grant.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {grant.industry_focus && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Focus Area:</span>
                          <span className="font-medium text-gray-900">{grant.industry_focus}</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {grant.tags && grant.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {grant.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedGrant(grant)}
                        className="flex-1 text-gray-600"
                      >
                        View Details
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredGrants.length === 0 && (
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-12 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No grants found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search terms to see more results.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* AI Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                  AI-Powered Recommendations
                </CardTitle>
                <p className="text-gray-600">Based on your projects, tags, and past applications</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recommendations.map((rec, index) => (
                    <div key={rec.grant.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getPriorityColor(rec.priority)}>
                              {rec.priority.toUpperCase()} PRIORITY
                            </Badge>
                            <Badge className="bg-purple-100 text-purple-800">
                              {rec.matchScore}% Match
                            </Badge>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{rec.grant.title}</h3>
                          <p className="text-gray-600 mb-4">{rec.grant.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Why This Grant Matches:</h4>
                          <ul className="space-y-1">
                            {rec.reasons.map((reason, idx) => (
                              <li key={idx} className="flex items-start text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Grant Details:</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Funding:</span>
                              <span className="font-medium">
                                {formatCurrency(rec.grant.min_amount || 0)} - {formatCurrency(rec.grant.max_amount || 0)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Deadline:</span>
                              <span className="font-medium">
                                {rec.grant.deadline ? new Date(rec.grant.deadline).toLocaleDateString() : 'TBD'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Success Probability:</span>
                              <span className="font-medium">{rec.grant.success_probability}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Apply Now
                        </Button>
                        <Button variant="outline">
                          <Bookmark className="w-4 h-4 mr-2" />
                          Save for Later
                        </Button>
                        <Button variant="outline">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share with Team
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Funding Trends */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Funding Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.fundingTrends.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{trend.month}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(trend.amount / Math.max(...analytics.fundingTrends.map(t => t.amount))) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{formatCurrency(trend.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Industries */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-green-600" />
                    Top Industries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.topIndustries.map((industry, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{industry.industry}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(industry.count / Math.max(...analytics.topIndustries.map(i => i.count))) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{industry.count} grants</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Deadlines */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.upcomingDeadlines.map((grant, index) => (
                    <div key={grant.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{grant.title}</h4>
                        <p className="text-sm text-gray-600">{grant.source}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {grant.deadline ? new Date(grant.deadline).toLocaleDateString() : 'TBD'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {grant.deadline ? 
                            Math.ceil((new Date(grant.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) + ' days left' : 
                            'No deadline'
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Collaboration Tab */}
          <TabsContent value="collaboration" className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-600" />
                  Team Collaboration
                </CardTitle>
                <p className="text-gray-600">Manage grant applications, team notes, and document sharing</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Saved Searches */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <Bookmark className="w-4 h-4 mr-2" />
                      Saved Searches
                    </h3>
                    <div className="space-y-2">
                      {savedSearches.map(search => (
                        <div key={search.id} className="p-3 border border-gray-200 rounded-lg">
                          <div className="font-medium text-sm text-gray-900">{search.name}</div>
                          <div className="text-xs text-gray-600">{search.resultCount} results</div>
                          <div className="text-xs text-gray-500">{new Date(search.lastUsed).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team Notes */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Team Notes
                    </h3>
                    <div className="space-y-2">
                      <div className="p-3 border border-gray-200 rounded-lg">
                        <div className="font-medium text-sm text-gray-900">Digital Inclusion Grant</div>
                        <div className="text-xs text-gray-600">Need to partner with local schools</div>
                        <div className="text-xs text-gray-500">By Sarah - 2 hours ago</div>
                      </div>
                      <div className="p-3 border border-gray-200 rounded-lg">
                        <div className="font-medium text-sm text-gray-900">Sustainability Accelerator</div>
                        <div className="text-xs text-gray-600">Budget looks good, ready to apply</div>
                        <div className="text-xs text-gray-500">By Mike - 1 day ago</div>
                      </div>
                    </div>
                  </div>

                  {/* Document Management */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Documents
                    </h3>
                    <div className="space-y-2">
                      <div className="p-3 border border-gray-200 rounded-lg">
                        <div className="font-medium text-sm text-gray-900">Grant Application Template</div>
                        <div className="text-xs text-gray-600">Updated 3 days ago</div>
                      </div>
                      <div className="p-3 border border-gray-200 rounded-lg">
                        <div className="font-medium text-sm text-gray-900">Budget Spreadsheet</div>
                        <div className="text-xs text-gray-600">Updated 1 week ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 