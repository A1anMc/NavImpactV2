'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
}

interface Filters {
  search: string;
  deadline: string;
  minAmount: number;
  maxAmount: number;
  industry: string;
  location: string;
  orgType: string;
  status: string;
}

export default function GrantsPage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [filteredGrants, setFilteredGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedGrants, setExpandedGrants] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<Filters>({
    search: '',
    deadline: '',
    minAmount: 0,
    maxAmount: 1000000,
    industry: '',
    location: '',
    orgType: '',
    status: ''
  });

  // Mock data for demonstration
  const mockGrants: Grant[] = [
    {
      id: '1',
      title: 'Community Development Grant',
      description: 'Supporting community-led initiatives that strengthen social cohesion and improve local outcomes.',
      source: 'Victorian Government',
      status: 'open',
      min_amount: 10000,
      max_amount: 100000,
      deadline: '2024-03-15',
      industry_focus: 'Community Services',
      location_eligibility: 'Victoria',
      org_type_eligible: ['Non-profit', 'Community Group']
    },
    {
      id: '2',
      title: 'Sustainability Innovation Fund',
      description: 'Funding for projects that demonstrate innovative approaches to environmental sustainability.',
      source: 'Federal Government',
      status: 'open',
      min_amount: 25000,
      max_amount: 500000,
      deadline: '2024-04-30',
      industry_focus: 'Environment',
      location_eligibility: 'Australia',
      org_type_eligible: ['Non-profit', 'Social Enterprise', 'Research Institution']
    },
    {
      id: '3',
      title: 'Digital Inclusion Program',
      description: 'Supporting initiatives that improve digital literacy and access to technology in underserved communities.',
      source: 'Local Council',
      status: 'closing_soon',
      min_amount: 5000,
      max_amount: 50000,
      deadline: '2024-02-28',
      industry_focus: 'Technology',
      location_eligibility: 'Melbourne',
      org_type_eligible: ['Non-profit', 'Community Group', 'Educational Institution']
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setGrants(mockGrants);
      setFilteredGrants(mockGrants);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (key: keyof Filters, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters: Filters) => {
    let filtered = grants.filter(grant => {
      const matchesSearch = grant.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
                           grant.description.toLowerCase().includes(currentFilters.search.toLowerCase());
      const matchesStatus = !currentFilters.status || grant.status === currentFilters.status;
      const matchesIndustry = !currentFilters.industry || grant.industry_focus === currentFilters.industry;
      const matchesLocation = !currentFilters.location || grant.location_eligibility?.includes(currentFilters.location);
      
      return matchesSearch && matchesStatus && matchesIndustry && matchesLocation;
    });
    
    setFilteredGrants(filtered);
  };

  const toggleGrantExpansion = (grantId: string) => {
    const newExpanded = new Set(expandedGrants);
    if (newExpanded.has(grantId)) {
      newExpanded.delete(grantId);
    } else {
      newExpanded.add(grantId);
    }
    setExpandedGrants(newExpanded);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-8 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Grants</h1>
            <p className="text-gray-600">Discover funding opportunities for your impact projects</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="text-gray-600 border-gray-300"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              Filters
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Custom Grant
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{filteredGrants.length}</div>
              <div className="text-sm text-gray-600">Available Grants</div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {filteredGrants.filter(g => g.status === 'open').length}
              </div>
              <div className="text-sm text-gray-600">Open Applications</div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {filteredGrants.filter(g => g.status === 'closing_soon').length}
              </div>
              <div className="text-sm text-gray-600">Closing Soon</div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatCurrency(filteredGrants.reduce((sum, g) => sum + (g.max_amount || 0), 0))}
              </div>
              <div className="text-sm text-gray-600">Total Funding Available</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <Card className="bg-white border border-gray-200 shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Filter Grants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search grants..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">All Status</option>
                    <option value="open">Open</option>
                    <option value="closing_soon">Closing Soon</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select
                    value={filters.industry}
                    onChange={(e) => handleFilterChange('industry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">All Industries</option>
                    <option value="Community Services">Community Services</option>
                    <option value="Environment">Environment</option>
                    <option value="Technology">Technology</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">All Locations</option>
                    <option value="Victoria">Victoria</option>
                    <option value="Melbourne">Melbourne</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Grants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGrants.map(grant => (
            <Card key={grant.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{grant.title}</h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(grant.status)}`}>
                        {getStatusLabel(grant.status)}
                      </span>
                      <span className="text-xs text-gray-500">{grant.source}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{grant.description}</p>

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

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleGrantExpansion(grant.id)}
                    className="flex-1 text-gray-600"
                  >
                    {expandedGrants.has(grant.id) ? 'Less Details' : 'More Details'}
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    Apply
                  </Button>
                </div>

                {expandedGrants.has(grant.id) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="space-y-3">
                      {grant.location_eligibility && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Location Eligibility:</span>
                          <p className="text-sm text-gray-600 mt-1">{grant.location_eligibility}</p>
                        </div>
                      )}
                      {grant.org_type_eligible && grant.org_type_eligible.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Eligible Organizations:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {grant.org_type_eligible.map(type => (
                              <span key={type} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGrants.length === 0 && !loading && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 10H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No grants found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more results.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 