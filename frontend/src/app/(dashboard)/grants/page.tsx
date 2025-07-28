'use client';

import React, { useState } from 'react';
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
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const grants = [
  {
    id: 1,
    title: 'Screen Australia Documentary Development',
    amount: '$50,000',
    deadline: '2024-02-15',
    status: 'open',
    category: 'Documentary',
    organisation: 'Screen Australia',
    description: 'Development funding for documentary projects with strong social impact focus.',
    requirements: ['Australian content', 'Social impact', 'Innovative storytelling'],
    priority: 'high',
    matchRate: '75%',
    successRate: '15%',
    aiScore: 95,
  },
  {
    id: 2,
    title: 'ABC Pitch Initiative',
    amount: '$25,000',
    deadline: '2024-01-30',
    status: 'submitted',
    category: 'Television',
    organisation: 'ABC',
    description: 'Pitch funding for innovative television content with diverse representation.',
    requirements: ['Diverse casting', 'Australian stories', 'Innovative format'],
    priority: 'medium',
    matchRate: '60%',
    successRate: '25%',
    aiScore: 88,
  },
  {
    id: 3,
    title: 'Netflix Documentary Fund',
    amount: '$100,000',
    deadline: '2024-03-01',
    status: 'open',
    category: 'Documentary',
    organisation: 'Netflix',
    description: 'Global documentary funding for compelling human stories.',
    requirements: ['Global appeal', 'Human interest', 'High production value'],
    priority: 'high',
    matchRate: '50%',
    successRate: '8%',
    aiScore: 82,
  },
  {
    id: 4,
    title: 'SBS Content Fund',
    amount: '$35,000',
    deadline: '2024-02-28',
    status: 'draft',
    category: 'Television',
    organisation: 'SBS',
    description: 'Multicultural content funding for diverse Australian stories.',
    requirements: ['Multicultural focus', 'Australian content', 'Diverse voices'],
    priority: 'medium',
    matchRate: '70%',
    successRate: '20%',
    aiScore: 78,
  },
  {
    id: 5,
    title: 'Film Victoria Production Investment',
    amount: '$200,000',
    deadline: '2024-04-15',
    status: 'open',
    category: 'Feature Film',
    organisation: 'Film Victoria',
    description: 'Feature film production funding for Victorian-based projects.',
    requirements: ['Victorian production', 'Feature length', 'Commercial potential'],
    priority: 'high',
    matchRate: '40%',
    successRate: '12%',
    aiScore: 75,
  },
  {
    id: 6,
    title: 'Documentary Australia Foundation',
    amount: '$75,000',
    deadline: '2024-03-30',
    status: 'researching',
    category: 'Documentary',
    organisation: 'Documentary Australia',
    description: 'Social impact documentary funding with philanthropic support.',
    requirements: ['Social impact', 'Philanthropic angle', 'Australian stories'],
    priority: 'medium',
    matchRate: '80%',
    successRate: '18%',
    aiScore: 85,
  },
];

const categories = [
  { name: 'Documentary', count: 3, color: 'bg-blue-500' },
  { name: 'Television', count: 2, color: 'bg-green-500' },
  { name: 'Feature Film', count: 1, color: 'bg-purple-500' },
];

const statuses = [
  { name: 'Open', count: 4, color: 'bg-green-100 text-green-800' },
  { name: 'Submitted', count: 1, color: 'bg-blue-100 text-blue-800' },
  { name: 'Draft', count: 1, color: 'bg-yellow-100 text-yellow-800' },
];

export default function GrantsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGrants = grants.filter(grant => {
    const matchesCategory = selectedCategory === 'all' || grant.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || grant.status === selectedStatus;
    const matchesSearch = grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grant.organisation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const totalAmount = grants.reduce((sum, grant) => {
    const amount = parseInt(grant.amount.replace(/[^0-9]/g, ''));
    return sum + amount;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-white/10 rounded-xl">
                  <CurrencyDollarIcon className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Grants & Funding</h1>
                  <p className="text-green-100 text-lg">
                    Discover and manage funding opportunities for your entertainment projects.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-green-100">${totalAmount.toLocaleString()} total funding available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                  <span className="text-green-100">{grants.length} active opportunities</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Matching Section */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <SparklesIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">AI Grant Matching</h3>
                    <p className="text-gray-600">Let AI find the perfect grants for your project</p>
                  </div>
                </div>
                <Link href="/grants/match">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <SparklesIcon className="h-4 w-4 mr-2" />
                    Find My Matches
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Funding</p>
                    <p className="text-2xl font-bold text-gray-900">${totalAmount.toLocaleString()}</p>
                  </div>
                  <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Grants</p>
                    <p className="text-2xl font-bold text-gray-900">{grants.filter(g => g.status === 'open').length}</p>
                  </div>
                  <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">18%</p>
                  </div>
                  <ChartBarIcon className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">AI Matches</p>
                    <p className="text-2xl font-bold text-gray-900">4</p>
                  </div>
                  <SparklesIcon className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search grants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.name} value={category.name}>{category.name}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                {statuses.map(status => (
                  <option key={status.name} value={status.name.toLowerCase()}>{status.name}</option>
                ))}
              </select>
              <Button className="bg-green-600 hover:bg-green-700">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Grant
              </Button>
            </div>
          </div>

          {/* Grants Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredGrants.map((grant) => (
              <Card key={grant.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                        {grant.title}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="font-medium">{grant.organisation}</span>
                        <span>•</span>
                        <span>{grant.category}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={
                        grant.status === 'open' ? 'bg-green-100 text-green-800' :
                        grant.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                        grant.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {grant.status}
                      </Badge>
                      {grant.aiScore && (
                        <div className="flex items-center space-x-1">
                          <SparklesIcon className="h-3 w-3 text-purple-600" />
                          <span className="text-xs font-medium text-purple-600">{grant.aiScore}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{grant.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Amount</p>
                      <p className="text-lg font-bold text-green-600">{grant.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Deadline</p>
                      <p className="text-sm text-gray-600">{grant.deadline}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Match Rate</p>
                      <p className="text-sm font-medium">{grant.matchRate}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Success Rate</p>
                      <p className="text-sm font-medium">{grant.successRate}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Priority</p>
                      <Badge className={
                        grant.priority === 'high' ? 'bg-red-100 text-red-800' :
                        grant.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {grant.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Link href={`/grants/apply/${grant.id}`}>
                        <Button size="sm" variant="outline">
                          <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                          Apply
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 