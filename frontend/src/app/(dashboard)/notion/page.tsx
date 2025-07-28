'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DocumentTextIcon,
  LinkIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const notionConnections = [
  {
    id: 1,
    name: 'SGE Production Hub',
    type: 'Database',
    status: 'connected',
    lastSync: '2 minutes ago',
    items: 156,
    description: 'Main production database with scripts, schedules, and team info',
  },
  {
    id: 2,
    name: 'Wild Hearts Project',
    type: 'Page',
    status: 'connected',
    lastSync: '5 minutes ago',
    items: 23,
    description: 'Project-specific page with script drafts and production notes',
  },
  {
    id: 3,
    name: 'Around the Table Series',
    type: 'Database',
    status: 'connected',
    lastSync: '1 hour ago',
    items: 89,
    description: 'Series development database with episode outlines and character development',
  },
  {
    id: 4,
    name: 'Impact Measurement',
    type: 'Database',
    status: 'pending',
    lastSync: 'Never',
    items: 0,
    description: 'Impact tracking and measurement data',
  },
];

const recentNotionUpdates = [
  {
    id: 1,
    title: 'Wild Hearts - Scene 12 Revision',
    type: 'update',
    database: 'SGE Production Hub',
    time: '2 minutes ago',
    user: 'Shamita Siva',
  },
  {
    id: 2,
    title: 'Around the Table - Episode 3 Outline',
    type: 'create',
    database: 'Around the Table Series',
    time: '15 minutes ago',
    user: 'Ash Dorman',
  },
  {
    id: 3,
    title: 'Production Schedule - Q2 2025',
    type: 'update',
    database: 'SGE Production Hub',
    time: '1 hour ago',
    user: 'Mish Rep',
  },
  {
    id: 4,
    title: 'Client Feedback - The Last Line',
    type: 'comment',
    database: 'SGE Production Hub',
    time: '3 hours ago',
    user: 'Ursula Searle',
  },
];

export default function NotionPage() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectNotion = () => {
    setIsConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-black to-gray-800 rounded-2xl p-8 text-white">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-white/10 rounded-xl">
                  <DocumentTextIcon className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Notion Integration</h1>
                  <p className="text-gray-100 text-lg">
                    Connect your Notion workspace to streamline production workflows, script management, and team collaboration.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-100">3 databases connected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                  <span className="text-gray-100">268 items synced</span>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Notion Connections */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <DocumentTextIcon className="h-5 w-5" />
                      <span>Notion Connections</span>
                    </CardTitle>
                    <Button 
                      onClick={handleConnectNotion}
                      disabled={isConnecting}
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      {isConnecting ? (
                        <>
                          <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Connect New
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notionConnections.map((connection) => (
                      <div key={connection.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{connection.name}</h3>
                              <Badge className={
                                connection.status === 'connected' ? 'bg-green-100 text-green-800' :
                                connection.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }>
                                {connection.status}
                              </Badge>
                              <Badge variant="outline">{connection.type}</Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{connection.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{connection.items} items</span>
                              <span>•</span>
                              <span>Last sync: {connection.lastSync}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Connection Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">3</div>
                    <div className="text-sm text-gray-600">Connected Databases</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">268</div>
                    <div className="text-sm text-gray-600">Total Items Synced</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">156</div>
                    <div className="text-sm text-gray-600">Production Hub Items</div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Updates */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentNotionUpdates.map((update) => (
                      <div key={update.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                        <div className={`p-1 rounded ${
                          update.type === 'create' ? 'bg-green-100' :
                          update.type === 'update' ? 'bg-blue-100' :
                          'bg-purple-100'
                        }`}>
                          {update.type === 'create' && <PlusIcon className="h-3 w-3 text-green-600" />}
                          {update.type === 'update' && <PencilIcon className="h-3 w-3 text-blue-600" />}
                          {update.type === 'comment' && <DocumentTextIcon className="h-3 w-3 text-purple-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{update.title}</p>
                          <p className="text-xs text-gray-600">{update.database} • {update.user}</p>
                          <p className="text-xs text-gray-500">{update.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Connect Database
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Cog6ToothIcon className="h-4 w-4 mr-2" />
                    Sync Settings
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    View in Notion
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Integration Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Notion Integration Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Script Management</h3>
                  </div>
                  <p className="text-sm text-gray-600">Version control, collaboration, and real-time editing for all script development.</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Production Planning</h3>
                  </div>
                  <p className="text-sm text-gray-600">Schedules, timelines, and resource management all in one place.</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Team Collaboration</h3>
                  </div>
                  <p className="text-sm text-gray-600">Real-time updates, comments, and feedback from all team members.</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Asset Organization</h3>
                  </div>
                  <p className="text-sm text-gray-600">Centralized storage and tagging for all production assets and references.</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Client Management</h3>
                  </div>
                  <p className="text-sm text-gray-600">Client briefs, feedback, and communication tracking.</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Impact Tracking</h3>
                  </div>
                  <p className="text-sm text-gray-600">Measure and document social impact and audience engagement.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 