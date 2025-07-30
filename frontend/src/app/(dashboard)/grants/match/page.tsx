'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';
import { grantsApi } from '@/services/grants';
import { Grant } from '@/types/models';

// Mock grants data for testing
const MOCK_GRANTS: Grant[] = [
  {
    id: 1,
    title: "Screen Australia Documentary Production",
    description: "Funding for documentary production by Australian practitioners. Supports creative development, production, and post-production.",
    source: "Screen Australia",
    source_url: "https://www.screenaustralia.gov.au/funding-and-support/documentary",
    application_url: null,
    contact_email: "funding@screenaustralia.gov.au",
    min_amount: 50000,
    max_amount: 500000,
    open_date: null,
    deadline: new Date("2024-12-31"),
    industry_focus: "media",
    location_eligibility: "national",
    org_type_eligible: ["startup", "sme", "enterprise"],
    funding_purpose: ["production", "development"],
    audience_tags: ["documentary", "australian"],
    status: "open",
    notes: "High-profile documentary funding opportunity",
    created_at: new Date(),
    updated_at: new Date(),
    created_by_id: null
  },
  {
    id: 2,
    title: "Creative Australia Arts Projects",
    description: "Support for innovative arts projects with strong community engagement and cultural impact.",
    source: "Creative Australia",
    source_url: "https://creative.gov.au/funding",
    application_url: "https://creative.gov.au/apply",
    contact_email: "arts@creative.gov.au",
    min_amount: 10000,
    max_amount: 100000,
    open_date: new Date("2024-01-01"),
    deadline: new Date("2025-03-15"),
    industry_focus: "arts",
    location_eligibility: "national",
    org_type_eligible: ["nonprofit", "community group"],
    funding_purpose: ["development", "production"],
    audience_tags: ["arts", "community"],
    status: "open",
    notes: "Arts and culture focus",
    created_at: new Date(),
    updated_at: new Date(),
    created_by_id: null
  },
  {
    id: 3,
    title: "Netflix Documentary Fund",
    description: "Funding for documentary projects with global appeal and innovative storytelling approaches.",
    source: "Netflix",
    source_url: "https://netflix.com/funding",
    application_url: "https://netflix.com/apply",
    contact_email: "funding@netflix.com",
    min_amount: 100000,
    max_amount: 500000,
    open_date: new Date("2024-01-01"),
    deadline: new Date("2025-03-15"),
    industry_focus: "media",
    location_eligibility: "international",
    org_type_eligible: ["startup", "sme", "enterprise"],
    funding_purpose: ["production", "development"],
    audience_tags: ["global", "documentary"],
    status: "open",
    notes: "High-profile documentary funding opportunity",
    created_at: new Date(),
    updated_at: new Date(),
    created_by_id: null
  },
  {
    id: 4,
    title: "ABC Pitch Initiative",
    description: "Support for innovative television content with diverse representation and Australian stories.",
    source: "ABC",
    source_url: "https://abc.net.au/funding",
    application_url: "https://abc.net.au/apply",
    contact_email: "pitch@abc.net.au",
    min_amount: 25000,
    max_amount: 100000,
    open_date: new Date("2024-01-01"),
    deadline: new Date("2025-02-28"),
    industry_focus: "media",
    location_eligibility: "national",
    org_type_eligible: ["startup", "sme", "enterprise"],
    funding_purpose: ["development", "production"],
    audience_tags: ["australian", "television"],
    status: "open",
    notes: "Australian content development",
    created_at: new Date(),
    updated_at: new Date(),
    created_by_id: null
  },
  {
    id: 5,
    title: "YouTube Creator Fund",
    description: "Funding for digital content creators with innovative storytelling and strong audience engagement.",
    source: "YouTube",
    source_url: "https://youtube.com/funding",
    application_url: "https://youtube.com/apply",
    contact_email: "creator@youtube.com",
    min_amount: 10000,
    max_amount: 50000,
    open_date: new Date("2024-01-01"),
    deadline: new Date("2025-06-30"),
    industry_focus: "media",
    location_eligibility: "international",
    org_type_eligible: ["startup", "sme", "enterprise"],
    funding_purpose: ["production", "development"],
    audience_tags: ["digital", "creator"],
    status: "open",
    notes: "Digital content creation",
    created_at: new Date(),
    updated_at: new Date(),
    created_by_id: null
  }
];

export default function GrantMatchingPage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [filteredGrants, setFilteredGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Use mock data for now while backend is being fixed
  useEffect(() => {
    setLoading(true);
    try {
      // Try to fetch from API first
      grantsApi.getGrants().then(data => {
        if (data && data.items && data.items.length > 0) {
          setGrants(data.items);
          setFilteredGrants(data.items);
        } else {
          // Fall back to mock data
          console.log('Using mock data - API returned no grants');
          setGrants(MOCK_GRANTS);
          setFilteredGrants(MOCK_GRANTS);
        }
        setLoading(false);
      }).catch(err => {
        console.log('API error, using mock data:', err);
        setGrants(MOCK_GRANTS);
        setFilteredGrants(MOCK_GRANTS);
        setLoading(false);
      });
    } catch (err) {
      console.log('Using mock data due to error:', err);
      setGrants(MOCK_GRANTS);
      setFilteredGrants(MOCK_GRANTS);
      setLoading(false);
    }
  }, []);

  // Filter grants based on search and filters
  useEffect(() => {
    let filtered = grants;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(grant =>
        grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grant.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grant.source.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Industry filter
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(grant => grant.industry_focus === selectedIndustry);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(grant => grant.status === selectedStatus);
    }

    setFilteredGrants(filtered);
  }, [grants, searchQuery, selectedIndustry, selectedStatus]);

  const calculateMatchScore = (grant: Grant): number => {
    let score = 0;
    
    // Base score for open grants
    if (grant.status === 'open') score += 30;
    
    // Industry match
    if (grant.industry_focus === 'media') score += 25;
    
    // Deadline proximity (higher score for closer deadlines)
    if (grant.deadline) {
      const daysUntilDeadline = Math.ceil((grant.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilDeadline > 0 && daysUntilDeadline <= 30) score += 20;
      else if (daysUntilDeadline > 30 && daysUntilDeadline <= 90) score += 15;
      else if (daysUntilDeadline > 90) score += 10;
    }
    
    // Amount range (prefer medium amounts)
    if (grant.min_amount && grant.max_amount) {
      const avgAmount = (grant.min_amount + grant.max_amount) / 2;
      if (avgAmount >= 25000 && avgAmount <= 100000) score += 15;
      else if (avgAmount > 100000) score += 10;
      else score += 5;
    }
    
    return Math.min(score, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'closing_soon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading grants...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Grant Matching</h1>
            <p className="text-gray-600 mt-2">
              Find the best grants for your projects with smart filtering
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
            <Button>
              <SparklesIcon className="h-4 w-4 mr-2" />
              Quick Match
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search grants by title, description, or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Industries</option>
            <option value="media">Media</option>
            <option value="arts">Arts</option>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
          
          <div className="flex items-center text-sm text-gray-500">
            <SparklesIcon className="h-4 w-4 mr-1" />
            AI-powered matching
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          Found {filteredGrants.length} grants matching your criteria
        </p>
      </div>

      {/* Grants Grid */}
      {filteredGrants.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-center">
            <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No grants found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGrants.map((grant) => {
            const matchScore = calculateMatchScore(grant);
            return (
              <Card key={grant.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{grant.title}</CardTitle>
                      <p className="text-sm text-gray-600 mb-2">{grant.source}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(grant.status)}>
                          {grant.status.replace('_', ' ')}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800">
                          {matchScore}% Match
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {grant.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        {grant.min_amount && grant.max_amount 
                          ? `${formatCurrency(grant.min_amount)} - ${formatCurrency(grant.max_amount)}`
                          : 'Amount not specified'
                        }
                      </span>
                    </div>
                    
                    {grant.deadline && (
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-red-500 mr-2" />
                        <span className="text-sm text-gray-600">
                          Deadline: {formatDate(grant.deadline)}
                        </span>
                      </div>
                    )}
                    
                    {grant.industry_focus && (
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-sm text-gray-600 capitalize">
                          {grant.industry_focus}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button size="sm">
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
} 