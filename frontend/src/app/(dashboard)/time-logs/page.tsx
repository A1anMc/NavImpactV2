'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ClockIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  PlusIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const timeEntries = [
  {
    id: 1,
    project: 'Wild Hearts',
    task: 'Rough cut review and feedback',
    startTime: '2024-01-27T09:00:00',
    endTime: '2024-01-27T12:30:00',
    duration: '3h 30m',
    status: 'completed',
    description: 'Reviewed rough cut and provided detailed feedback for improvements',
  },
  {
    id: 2,
    project: 'Around the Table',
    task: 'Script revisions and editing',
    startTime: '2024-01-27T13:00:00',
    endTime: '2024-01-27T17:00:00',
    duration: '4h 0m',
    status: 'completed',
    description: 'Worked on script revisions and scene editing for episode 3',
  },
  {
    id: 3,
    project: 'The Last Line',
    task: 'Impact measurement analysis',
    startTime: '2024-01-27T18:00:00',
    endTime: null,
    duration: '2h 15m',
    status: 'active',
    description: 'Analyzing social impact metrics and preparing impact report',
  },
];

const projects = [
  { name: 'Wild Hearts', totalHours: 45.5, color: 'bg-blue-500' },
  { name: 'Around the Table', totalHours: 32.0, color: 'bg-green-500' },
  { name: 'The Last Line', totalHours: 18.5, color: 'bg-purple-500' },
];

export default function TimeLogsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-white/10 rounded-xl">
                  <ClockIcon className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Time Logs</h1>
                  <p className="text-green-100 text-lg">
                    Track your time, monitor productivity, and manage project hours efficiently.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-100">Currently tracking time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                  <span className="text-green-100">96 hours this week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Today's Time</h2>
              <p className="text-gray-600">Track and manage your daily activities</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <PlayIcon className="h-4 w-4 mr-2" />
                Start Timer
              </Button>
              <Button variant="outline">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Time Entries */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ClockIcon className="h-5 w-5" />
                    <span>Recent Time Entries</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timeEntries.map((entry) => (
                      <div key={entry.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{entry.task}</h3>
                              <Badge className={
                                entry.status === 'completed' ? 'bg-green-100 text-green-800' :
                                entry.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {entry.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{entry.project}</p>
                            <p className="text-sm text-gray-700 mb-3">{entry.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{new Date(entry.startTime).toLocaleTimeString()}</span>
                              <span>-</span>
                              <span>{entry.endTime ? new Date(entry.endTime).toLocaleTimeString() : 'In Progress'}</span>
                              <span>•</span>
                              <span className="font-medium text-gray-900">{entry.duration}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {entry.status === 'active' && (
                              <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                                <StopIcon className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              Edit
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
              
              {/* Today's Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">9h 45m</div>
                    <div className="text-sm text-gray-600">Total Time Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">3</div>
                    <div className="text-sm text-gray-600">Active Entries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">2</div>
                    <div className="text-sm text-gray-600">Projects Worked On</div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Hours */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map((project, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 ${project.color} rounded-full`}></div>
                          <span className="text-sm font-medium text-gray-900">{project.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{project.totalHours}h</span>
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
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Start Timer
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <ChartBarIcon className="h-4 w-4 mr-2" />
                    Analytics
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