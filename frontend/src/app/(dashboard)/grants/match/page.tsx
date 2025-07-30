'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CurrencyDollarIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ArrowRightIcon,
  EyeIcon,
  DocumentTextIcon,
  StarIcon,
  FireIcon,
  GlobeAltIcon,
  CalendarIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { grantsApi } from '@/services/grants';
import { Grant } from '@/types/models';
import Link from 'next/link';

export default function GrantMatchPage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [filteredGrants, setFilteredGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Fetch all grants
  useEffect(() => {
    const fetchGrants = async () => {
      try {
        setLoading(true);
        const response = await grantsApi.getGrants({ limit: 100 });
        const grantsData = response.items || [];
        setGrants(grantsData);
        setFilteredGrants(grantsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching grants:', err);
        setError('Failed to load grants. Please try again.');
        setGrants([]);
        setFilteredGrants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGrants();
  }, []);

  // Filter grants based on search and filters
  useEffect(() => {
    let filtered = grants;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(grant => 
        grant.title.toLowerCase().includes(searchLower) ||
        grant.description.toLowerCase().includes(searchLower) ||
        grant.source.toLowerCase().includes(searchLower) ||
        (grant.industry_focus && grant.industry_focus.toLowerCase().includes(searchLower))
      );
    }

    // Industry filter
    if (selectedIndustry) {
      filtered = filtered.filter(grant => 
        grant.industry_focus === selectedIndustry
      );
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(grant => 
        grant.status === selectedStatus
      );
    }

    setFilteredGrants(filtered);
  }, [grants, searchTerm, selectedIndustry, selectedStatus]);

  const calculateMatchScore = (grant: Grant) => {
    let score = 50; // Base score

    // Boost score for open grants
    if (grant.status === 'open') score += 20;
    if (grant.status === 'closing_soon') score += 10;

    // Boost score for media-related grants
    if (grant.industry_focus === 'media') score += 15;
    if (grant.industry_focus === 'technology') score += 10;

    // Boost score for grants with deadlines
    if (grant.deadline) score += 10;

    // Boost score for grants with higher amounts
    if (grant.max_amount && grant.max_amount > 50000) score += 10;

    return Math.min(score, 100);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchScoreText = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Great Match';
    if (score >= 40) return 'Good Match';
    return 'Fair Match';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
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

  // Get unique industries for filter
  const industries = [...new Set(grants.map(g => g.industry_focus).filter(Boolean))];
  const statuses = [...new Set(grants.map(g => g.status))];

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

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto" />
            <p className="mt-4 text-red-600">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Try Again
            </Button>
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

      {/* Simple Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search grants by title, description, or organization..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              <option value="">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Found {filteredGrants.length} grants matching your criteria
          </p>
          <div className="flex items-center space-x-2">
            <SparklesIcon className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-gray-600">AI-powered matching</span>
          </div>
        </div>
      </div>

      {/* Grants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGrants.map((grant) => {
          const matchScore = calculateMatchScore(grant);
          return (
            <Card key={grant.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {grant.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{grant.source}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getStatusColor(grant.status)}>
                      {grant.status.replace('_', ' ')}
                    </Badge>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getMatchScoreColor(matchScore)}`}>
                        {matchScore}%
                      </div>
                      <div className="text-xs text-gray-500">{getMatchScoreText(matchScore)}</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {grant.description}
                </p>
                
                <div className="space-y-3">
                  {/* Amount */}
                  <div className="flex items-center text-sm">
                    <CurrencyDollarIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span className="font-medium">
                      {grant.min_amount && grant.max_amount 
                        ? `${formatCurrency(grant.min_amount)} - ${formatCurrency(grant.max_amount)}`
                        : 'Amount not specified'
                      }
                    </span>
                  </div>

                  {/* Deadline */}
                  {grant.deadline && (
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="h-4 w-4 text-red-500 mr-2" />
                      <span>Deadline: {formatDate(grant.deadline.toString())}</span>
                    </div>
                  )}

                  {/* Industry */}
                  {grant.industry_focus && (
                    <div className="flex items-center text-sm">
                      <GlobeAltIcon className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="capitalize">{grant.industry_focus}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                  <Link href={`/grants/apply/${grant.id}`}>
                    <Button size="sm">
                      <ArrowRightIcon className="h-4 w-4 mr-1" />
                      Apply
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredGrants.length === 0 && !loading && (
        <div className="text-center py-12">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No grants found</h3>
          <p className="mt-2 text-gray-600">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
    </div>
  );
} 