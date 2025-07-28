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
  FireIcon,
  StarIcon,
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <FireIcon className="h-4 w-4 text-red-500" />;
      case 'medium': return <StarIcon className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckIcon className="h-4 w-4 text-green-500" />;
      default: return <CheckIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative max-w-4xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <CurrencyDollarIcon className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Grants & Funding
                  </h1>
                  <p className="text-xl text-blue-100 leading-relaxed">
                    Discover and manage funding opportunities for your entertainment projects with AI-powered matching.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold">${totalAmount.toLocaleString()} total funding</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-300 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold">{grants.length} active opportunities</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Matching Section */}
          <Card className="bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                    <SparklesIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Grant Matching</h3>
                    <p className="text-gray-600 text-lg">Let AI find the perfect grants for your project</p>
                  </div>
                </div>
                <Link href="/grants/match">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all">
                    <SparklesIcon className="h-5 w-5 mr-3" />
                    Find My Matches
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Funding</p>
                    <p className="text-3xl font-bold text-gray-900">${totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Active Grants</p>
                    <p className="text-3xl font-bold text-gray-900">{grants.filter(g => g.status === 'open').length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Team Members</p>
                    <p className="text-3xl font-bold text-gray-900">3</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <UserGroupIcon className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">AI Score</p>
                    <p className="text-3xl font-bold text-gray-900">92%</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <LightBulbIcon className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search grants by title, organisation, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-6 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white"
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
                  className="px-6 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white"
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
                  className="flex items-center space-x-2 px-6 py-3 text-lg rounded-xl"
                >
                  <UserGroupIcon className="h-5 w-5" />
                  <span>Collaboration</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Grants Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredGrants.map((grant) => (
              <Card key={grant.id} className="bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Badge className={`${getStatusColor(grant.status)} border`}>
                          {grant.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-medium">
                          {grant.version}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {getPriorityIcon(grant.priority)}
                          <Badge variant="outline" className="text-xs">
                            {grant.priority} priority
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                        {grant.title}
                      </CardTitle>
                      <p className="text-gray-600 font-medium">{grant.organisation}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-green-600">{grant.amount}</p>
                      <p className="text-sm text-gray-500 font-medium">{grant.category}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 leading-relaxed">{grant.description}</p>
                  
                  {/* AI Score */}
                  <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <LightBulbIcon className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">AI Match Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          style={{ width: `${grant.aiScore}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-900">{grant.aiScore}%</span>
                    </div>
                  </div>
                  
                  {/* Collaboration Section */}
                  {showCollaboration && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-700">Team Collaboration</h4>
                        <span className="text-xs text-gray-500">Last modified: {grant.lastModified}</span>
                      </div>
                      
                      {/* Collaborators */}
                      <div className="flex items-center space-x-3 mb-4">
                        {grant.collaborators.map((collaborator, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-white">{collaborator.avatar}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{collaborator.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {collaborator.role}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      {/* Comments */}
                      {grant.comments.length > 0 && (
                        <div className="space-y-3">
                          <h5 className="text-xs font-semibold text-gray-700">Recent Comments</h5>
                          {grant.comments.slice(0, 2).map((comment) => (
                            <div key={comment.id} className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                              <ChatBubbleLeftIcon className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm text-gray-700">{comment.text}</p>
                                <p className="text-xs text-gray-500 mt-1">{comment.author} • {comment.timestamp}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Deadline: {grant.deadline}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ChartBarIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Match: {grant.matchRate}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button variant="outline" size="sm" className="rounded-lg">
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Link href={`/grants/apply/${grant.id}`}>
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg">
                          <ArrowRightIcon className="h-4 w-4 mr-2" />
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