'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EyeIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ChartBarIcon,
  SparklesIcon,
  LightBulbIcon,
  ClipboardDocumentIcon,
  ChatBubbleLeftIcon,
  ClockIcon as ClockIconSolid,
  UserIcon,
  EyeSlashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  FireIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { grantsApi } from '@/services/grants';
import { Grant } from '@/types/models';

export default function GrantsPage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    industry_focus: '',
    location: '',
    org_type: '',
    status: '',
    search: ''
  });

  // Fetch grants from live API
  useEffect(() => {
    const fetchGrants = async () => {
      try {
        setLoading(true);
        const response = await grantsApi.getGrants({ limit: 50 });
        setGrants(response.items || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching grants:', err);
        setError('Failed to load grants. Please try again.');
        setGrants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGrants();
  }, []);

  // Filter grants based on current filters
  const filteredGrants = grants.filter(grant => {
    if (filters.industry_focus && grant.industry_focus !== filters.industry_focus) return false;
    if (filters.location && grant.location_eligibility !== filters.location) return false;
    if (filters.status && grant.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        grant.title.toLowerCase().includes(searchLower) ||
        grant.description.toLowerCase().includes(searchLower) ||
        grant.source.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <FireIcon className="h-4 w-4 text-red-500" />;
      case 'medium': return <StarIcon className="h-4 w-4 text-yellow-500" />;
      case 'low': return <ClockIcon className="h-4 w-4 text-gray-500" />;
      default: return <ClockIcon className="h-4 w-4 text-gray-500" />;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
            <h1 className="text-3xl font-bold text-gray-900">Grants</h1>
            <p className="text-gray-600 mt-2">
              Discover and manage grant opportunities for your projects
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Grant
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search grants..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters.industry_focus}
              onChange={(e) => setFilters({ ...filters, industry_focus: e.target.value })}
            >
              <option value="">All Industries</option>
              <option value="technology">Technology</option>
              <option value="media">Media</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="environment">Environment</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="active">Active</option>
              <option value="closing_soon">Closing Soon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Grants</p>
                <p className="text-2xl font-bold text-gray-900">{grants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Open Grants</p>
                <p className="text-2xl font-bold text-gray-900">
                  {grants.filter(g => g.status === 'open').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Closing Soon</p>
                <p className="text-2xl font-bold text-gray-900">
                  {grants.filter(g => g.status === 'closing_soon').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Funding</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(grants.reduce((sum, g) => sum + (g.max_amount || 0), 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGrants.map((grant) => (
          <Card key={grant.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {grant.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{grant.source}</p>
                </div>
                <Badge className={`ml-2 ${getStatusColor(grant.status)}`}>
                  {grant.status.replace('_', ' ')}
                </Badge>
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
                    <span>Deadline: {formatDate(grant.deadline?.toString())}</span>
                  </div>
                )}

                {/* Industry */}
                {grant.industry_focus && (
                  <div className="flex items-center text-sm">
                    <GlobeAltIcon className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="capitalize">{grant.industry_focus}</span>
                  </div>
                )}

                {/* Location */}
                {grant.location_eligibility && (
                  <div className="flex items-center text-sm">
                    <UserGroupIcon className="h-4 w-4 text-purple-500 mr-2" />
                    <span className="capitalize">{grant.location_eligibility}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Apply
                  </Button>
                </div>
                <Link href={`/grants/apply/${grant.id}`}>
                  <Button size="sm">
                    <ArrowRightIcon className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
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