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
  ChatBubbleLeftIcon,
  ClockIcon as ClockIconSolid,
  UserIcon,
  EyeSlashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Enhanced grant data with versioning and collaboration
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
    // Version tracking
    version: 'v2.1',
    lastModified: '2024-01-15',
    modifiedBy: 'Alan McCarthy',
    // Collaboration features
    collaborators: [
      { name: 'Alan McCarthy', role: 'owner', avatar: 'AM' },
      { name: 'Harry Dog', role: 'editor', avatar: 'HD' },
      { name: 'Clooney Cat', role: 'viewer', avatar: 'CC' }
    ],
    comments: [
      { id: 1, author: 'Harry Dog', text: 'Updated budget section with new figures', timestamp: '2024-01-15 14:30' },
      { id: 2, author: 'Clooney Cat', text: 'Added social impact metrics', timestamp: '2024-01-14 16:45' }
    ],
    changeLog: [
      { version: 'v2.1', date: '2024-01-15', changes: 'Updated budget, added impact metrics', author: 'Alan McCarthy' },
      { version: 'v2.0', date: '2024-01-10', changes: 'Initial draft completed', author: 'Alan McCarthy' }
    ]
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
    version: 'v1.0',
    lastModified: '2024-01-20',
    modifiedBy: 'Alan McCarthy',
    collaborators: [
      { name: 'Alan McCarthy', role: 'owner', avatar: 'AM' },
      { name: 'Harry Dog', role: 'editor', avatar: 'HD' }
    ],
    comments: [
      { id: 1, author: 'Harry Dog', text: 'Submitted to ABC portal', timestamp: '2024-01-20 09:15' }
    ],
    changeLog: [
      { version: 'v1.0', date: '2024-01-20', changes: 'Final submission', author: 'Alan McCarthy' }
    ]
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
    version: 'v1.2',
    lastModified: '2024-01-18',
    modifiedBy: 'Alan McCarthy',
    collaborators: [
      { name: 'Alan McCarthy', role: 'owner', avatar: 'AM' }
    ],
    comments: [],
    changeLog: [
      { version: 'v1.2', date: '2024-01-18', changes: 'Added global distribution strategy', author: 'Alan McCarthy' },
      { version: 'v1.1', date: '2024-01-12', changes: 'Updated project description', author: 'Alan McCarthy' }
    ]
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
    version: 'v0.8',
    lastModified: '2024-01-16',
    modifiedBy: 'Alan McCarthy',
    collaborators: [
      { name: 'Alan McCarthy', role: 'owner', avatar: 'AM' },
      { name: 'Clooney Cat', role: 'viewer', avatar: 'CC' }
    ],
    comments: [
      { id: 1, author: 'Clooney Cat', text: 'Need to add more multicultural elements', timestamp: '2024-01-16 11:20' }
    ],
    changeLog: [
      { version: 'v0.8', date: '2024-01-16', changes: 'Added multicultural focus section', author: 'Alan McCarthy' }
    ]
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
    version: 'v1.5',
    lastModified: '2024-01-19',
    modifiedBy: 'Alan McCarthy',
    collaborators: [
      { name: 'Alan McCarthy', role: 'owner', avatar: 'AM' },
      { name: 'Harry Dog', role: 'editor', avatar: 'HD' },
      { name: 'Clooney Cat', role: 'editor', avatar: 'CC' }
    ],
    comments: [
      { id: 1, author: 'Harry Dog', text: 'Updated Victorian production requirements', timestamp: '2024-01-19 15:30' },
      { id: 2, author: 'Clooney Cat', text: 'Added commercial potential analysis', timestamp: '2024-01-19 16:45' }
    ],
    changeLog: [
      { version: 'v1.5', date: '2024-01-19', changes: 'Updated Victorian requirements and commercial analysis', author: 'Alan McCarthy' },
      { version: 'v1.4', date: '2024-01-15', changes: 'Added feature film budget breakdown', author: 'Alan McCarthy' }
    ]
  },
  {
    id: 6,
    title: 'Documentary Australia Foundation',
    amount: '$75,000',
    deadline: '2024-03-30',
    status: 'open',
    category: 'Documentary',
    organisation: 'Documentary Australia',
    description: 'Social impact documentary funding with philanthropic support.',
    requirements: ['Social impact', 'Philanthropic angle', 'Community engagement'],
    priority: 'medium',
    matchRate: '65%',
    successRate: '18%',
    aiScore: 72,
    version: 'v1.1',
    lastModified: '2024-01-17',
    modifiedBy: 'Alan McCarthy',
    collaborators: [
      { name: 'Alan McCarthy', role: 'owner', avatar: 'AM' }
    ],
    comments: [],
    changeLog: [
      { version: 'v1.1', date: '2024-01-17', changes: 'Added philanthropic support section', author: 'Alan McCarthy' }
    ]
  }
];

const categories = [
  { name: 'All Categories', value: 'all' },
  { name: 'Documentary', value: 'Documentary' },
  { name: 'Feature Film', value: 'Feature Film' },
  { name: 'Television', value: 'Television' },
];

const statuses = [
  { name: 'All Status', value: 'all' },
  { name: 'Open', value: 'open' },
  { name: 'Draft', value: 'draft' },
  { name: 'Submitted', value: 'submitted' },
  { name: 'Closed', value: 'closed' },
];

const quickStats = [
  { name: 'Open', count: 4, color: 'bg-green-100 text-green-800' },
  { name: 'Submitted', count: 1, color: 'bg-blue-100 text-blue-800' },
  { name: 'Draft', count: 1, color: 'bg-yellow-100 text-yellow-800' },
];

export default function GrantsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCollaboration, setShowCollaboration] = useState(false);

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
                    <p className="text-sm font-medium text-gray-600">Team Collaborators</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                  <UserGroupIcon className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Version History</p>
                    <p className="text-2xl font-bold text-gray-900">{grants.reduce((sum, g) => sum + g.changeLog.length, 0)}</p>
                  </div>
                  <ClockIconSolid className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.name}
                  </option>
                ))}
              </select>
              <Button
                onClick={() => setShowCollaboration(!showCollaboration)}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <UserGroupIcon className="h-4 w-4" />
                <span>Collaboration</span>
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
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={grant.status === 'open' ? 'bg-green-100 text-green-800' : 
                                        grant.status === 'submitted' ? 'bg-blue-100 text-blue-800' : 
                                        'bg-yellow-100 text-yellow-800'}>
                          {grant.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {grant.version}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {grant.priority} priority
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{grant.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{grant.organisation}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{grant.amount}</p>
                      <p className="text-sm text-gray-500">{grant.category}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{grant.description}</p>
                  
                  {/* Collaboration Section */}
                  {showCollaboration && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Team Collaboration</h4>
                        <span className="text-xs text-gray-500">Last modified: {grant.lastModified}</span>
                      </div>
                      
                      {/* Collaborators */}
                      <div className="flex items-center space-x-2 mb-3">
                        {grant.collaborators.map((collaborator, index) => (
                          <div key={index} className="flex items-center space-x-1">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-700">{collaborator.avatar}</span>
                            </div>
                            <span className="text-xs text-gray-600">{collaborator.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {collaborator.role}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      {/* Comments */}
                      {grant.comments.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-xs font-medium text-gray-700">Recent Comments</h5>
                          {grant.comments.slice(0, 2).map((comment) => (
                            <div key={comment.id} className="flex items-start space-x-2">
                              <ChatBubbleLeftIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs text-gray-600">{comment.text}</p>
                                <p className="text-xs text-gray-400">{comment.author} • {comment.timestamp}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Change Log */}
                      <div className="mt-3">
                        <h5 className="text-xs font-medium text-gray-700 mb-1">Recent Changes</h5>
                        {grant.changeLog.slice(0, 1).map((change, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <ClockIconSolid className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">{change.changes}</span>
                            <span className="text-xs text-gray-400">• {change.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Deadline: {grant.deadline}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ChartBarIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Match: {grant.matchRate}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Link href={`/grants/apply/${grant.id}`}>
                        <Button size="sm">
                          <ArrowRightIcon className="h-4 w-4 mr-1" />
                          Apply
                        </Button>
                      </Link>
                    </div>
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