'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  PlayIcon,
  ClockIcon,
  UserGroupIcon,
  FilmIcon,
  CameraIcon,
  MegaphoneIcon,
  GlobeAltIcon,
  TrophyIcon,
  PlusIcon,
  ArrowRightIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const projects = [
    {
      id: 1,
      name: 'Wild Hearts',
      description: 'Cinematic documentary exploring human resilience',
      progress: 85,
      status: 'In Production',
      category: 'Documentary',
      team: ['Ursula Searle', 'Shamita Siva'],
      budget: '$125,000',
      timeline: 'Q2 2025',
      impact: 'High',
      color: 'from-blue-500 to-purple-600',
    },
    {
      id: 2,
      name: 'Around the Table',
      description: 'Community storytelling through shared meals',
      progress: 65,
      status: 'Pre-Production',
      category: 'Series',
      team: ['Ash Dorman', 'Mish Rep'],
      budget: '$85,000',
      timeline: 'Q3 2025',
      impact: 'Medium',
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: 3,
      name: 'The Last Line',
      description: 'Environmental conservation narrative',
      progress: 45,
      status: 'Development',
      category: 'Feature',
      team: ['Alan McCarthy', 'Kiara Holt'],
      budget: '$200,000',
      timeline: 'Q4 2025',
      impact: 'High',
      color: 'from-orange-500 to-red-600',
    },
  ];

  const metrics = [
    {
      title: 'Active Projects',
      value: '3',
      change: '+1',
      icon: FilmIcon,
      color: 'bg-blue-500',
      trend: 'up',
    },
    {
      title: 'Production Hours',
      value: '1,247',
      change: '+23%',
      icon: ClockIcon,
      color: 'bg-green-500',
      trend: 'up',
    },
    {
      title: 'Team Members',
      value: '6',
      change: '+1',
      icon: UserGroupIcon,
      color: 'bg-purple-500',
      trend: 'up',
    },
    {
      title: 'Impact Score',
      value: '94%',
      change: '+8%',
      icon: TrophyIcon,
      color: 'bg-orange-500',
      trend: 'up',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Production milestone reached',
      project: 'Wild Hearts',
      user: 'Ursula Searle',
      time: '2 hours ago',
      type: 'milestone',
      icon: CheckCircleIcon,
      color: 'text-green-500',
    },
    {
      id: 2,
      action: 'New grant application submitted',
      project: 'Around the Table',
      user: 'Ash Dorman',
      time: '4 hours ago',
      type: 'grant',
      icon: ChartBarIcon,
      color: 'text-blue-500',
    },
    {
      id: 3,
      action: 'Script review completed',
      project: 'The Last Line',
      user: 'Shamita Siva',
      time: '6 hours ago',
      type: 'review',
      icon: StarIcon,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Image
                    src="/SGE_Main_Logo_White.svg"
                    alt="SGE Logo"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Shadow Goose Entertainment</h1>
                  <p className="text-sm text-gray-500">Production Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <PlusIcon className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold mb-4">Welcome back, Team</h2>
              <p className="text-blue-100 text-lg mb-6">
                Track your productions, manage your team, and drive meaningful impact through cinematic storytelling.
              </p>
              <div className="flex items-center space-x-4">
                <Button className="bg-white text-blue-600 hover:bg-gray-100">
                  View All Projects
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Team Overview
                </Button>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
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
                    </div>
                    <div className={`p-3 ${metric.color} rounded-xl`}>
                      <metric.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Projects Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Active Productions</h2>
                <p className="text-gray-600 mt-1">Track progress and manage your current projects</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <PlusIcon className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`w-3 h-3 bg-gradient-to-r ${project.color} rounded-full`}></div>
                          <Badge className={`${
                            project.status === 'In Production' ? 'bg-green-100 text-green-800' :
                            project.status === 'Pre-Production' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg text-gray-900">{project.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2">
                        <div className={`h-full bg-gradient-to-r ${project.color} rounded-full transition-all duration-300`} 
                             style={{ width: `${project.progress}%` }}></div>
                      </Progress>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Category</p>
                        <p className="font-medium text-gray-900">{project.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Budget</p>
                        <p className="font-medium text-gray-900">{project.budget}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Timeline</p>
                        <p className="font-medium text-gray-900">{project.timeline}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Impact</p>
                        <p className="font-medium text-gray-900">{project.impact}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">Team</p>
                      <div className="flex flex-wrap gap-1">
                        {project.team.map((member, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {member}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200">
                      View Details
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
              <p className="text-gray-600 mt-1">Latest updates from your team</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
                        <activity.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.project} • {activity.user}</p>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              <p className="text-gray-600 mt-1">Common tasks and workflows</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gray-50 border border-gray-200">
                <PlayIcon className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Start Production</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gray-50 border border-gray-200">
                <CameraIcon className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Schedule Shoot</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gray-50 border border-gray-200">
                <MegaphoneIcon className="h-6 w-6 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">Marketing</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gray-50 border border-gray-200">
                <GlobeAltIcon className="h-6 w-6 text-orange-600" />
                <span className="text-sm font-medium text-gray-900">Distribution</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 