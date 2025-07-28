'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  GlobeAltIcon,
  ChartBarIcon,
  TrendingUpIcon,
  UsersIcon,
  HeartIcon,
  EyeIcon,
  ShareIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

const impactMetrics = [
  {
    title: 'Total Reach',
    value: '2.4M',
    change: '+15%',
    icon: UsersIcon,
    color: 'bg-blue-500',
    description: 'People reached through our content',
  },
  {
    title: 'Engagement Rate',
    value: '94%',
    change: '+8%',
    icon: HeartIcon,
    color: 'bg-green-500',
    description: 'Average engagement across platforms',
  },
  {
    title: 'Social Impact Score',
    value: '8.7/10',
    change: '+0.3',
    icon: TrendingUpIcon,
    color: 'bg-purple-500',
    description: 'Measured social impact rating',
  },
  {
    title: 'Content Views',
    value: '15.2M',
    change: '+23%',
    icon: EyeIcon,
    color: 'bg-orange-500',
    description: 'Total content views this quarter',
  },
];

const impactStories = [
  {
    id: 1,
    title: 'Wild Hearts - Community Impact',
    description: 'Documentary reached 500K viewers, leading to increased awareness of environmental conservation.',
    metrics: {
      reach: '500K',
      engagement: '92%',
      impact: 'High',
    },
    status: 'published',
    date: '2024-01-27',
  },
  {
    id: 2,
    title: 'Around the Table - Social Connection',
    description: 'Series fostered community connections, with 85% of viewers reporting increased empathy.',
    metrics: {
      reach: '300K',
      engagement: '89%',
      impact: 'Medium',
    },
    status: 'published',
    date: '2024-01-26',
  },
  {
    id: 3,
    title: 'The Last Line - Conservation Awareness',
    description: 'Pre-production phase showing strong potential for environmental impact messaging.',
    metrics: {
      reach: '50K',
      engagement: '78%',
      impact: 'Developing',
    },
    status: 'in-progress',
    date: '2024-01-25',
  },
];

const impactAreas = [
  {
    area: 'Environmental Conservation',
    score: 9.2,
    projects: 2,
    description: 'Focus on climate change and sustainability',
  },
  {
    area: 'Social Connection',
    score: 8.7,
    projects: 1,
    description: 'Building community and empathy',
  },
  {
    area: 'Education',
    score: 8.1,
    projects: 1,
    description: 'Knowledge sharing and awareness',
  },
];

export default function ImpactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-white/10 rounded-xl">
                  <GlobeAltIcon className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Impact Measurement</h1>
                  <p className="text-green-100 text-lg">
                    Track and measure the social impact of our cinematic storytelling across all productions.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-100">8.7/10 overall impact score</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                  <span className="text-green-100">2.4M total reach</span>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactMetrics.map((metric, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-sm text-green-600 font-medium">{metric.change}</span>
                        <span className="text-sm text-gray-500 ml-1">from last month</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                    </div>
                    <div className={`p-3 ${metric.color} rounded-xl`}>
                      <metric.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Impact Stories */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ChartBarIcon className="h-5 w-5" />
                    <span>Impact Stories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {impactStories.map((story) => (
                      <div key={story.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{story.title}</h3>
                            <p className="text-gray-600 mb-4">{story.description}</p>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900">Reach</p>
                                <p className="text-2xl font-bold text-blue-600">{story.metrics.reach}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Engagement</p>
                                <p className="text-2xl font-bold text-green-600">{story.metrics.engagement}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Impact</p>
                                <Badge className={
                                  story.metrics.impact === 'High' ? 'bg-green-100 text-green-800' :
                                  story.metrics.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                                }>
                                  {story.metrics.impact}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge className={
                              story.status === 'published' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }>
                              {story.status}
                            </Badge>
                            <span className="text-xs text-gray-500">{story.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button size="sm" variant="outline">
                            <EyeIcon className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <ShareIcon className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Impact Areas */}
              <Card>
                <CardHeader>
                  <CardTitle>Impact Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {impactAreas.map((area, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{area.area}</h3>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">{area.score}/10</div>
                            <div className="text-xs text-gray-500">{area.projects} projects</div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{area.description}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(area.score / 10) * 100}%` }}
                          ></div>
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
                    Add Impact Story
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <ChartBarIcon className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Share Impact
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 