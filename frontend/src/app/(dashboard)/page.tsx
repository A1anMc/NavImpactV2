'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChartBarIcon,
  FolderIcon,
  DocumentMagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  PhotoIcon,
  ClockIcon,
  CircleStackIcon,
  ShieldCheckIcon,
  PlusIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Simplified Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl shadow-lg">
              <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Shadow Goose Entertainment
              </h1>
              <p className="text-gray-600 text-lg">
                Media Impact & Project Management Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              System Online
            </span>
            <span>6 Team Members</span>
            <span>4 Active Projects</span>
          </div>
        </div>

        {/* SGE Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Media Projects</p>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                  <p className="text-xs text-green-600">Active</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <PhotoIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Team Members</p>
                  <p className="text-2xl font-bold text-gray-900">6</p>
                  <p className="text-xs text-blue-600">Including 1 Intern</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserCircleIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Grants Available</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-yellow-600">Matching SGE</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DocumentMagnifyingGlassIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Impact Stories</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                  <p className="text-xs text-purple-600">Documented</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ChartBarIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SGE Project Showcase */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Media Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg">
                    <PhotoIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Wild Hearts</h3>
                    <p className="text-sm text-gray-600 mb-3">Environmental conservation documentary</p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-100 text-green-800">In Production</Badge>
                      <span className="text-xs text-gray-500">75% Complete</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                    <PhotoIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Around the Table</h3>
                    <p className="text-sm text-gray-600 mb-3">Community engagement series</p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-yellow-100 text-yellow-800">Planning</Badge>
                      <span className="text-xs text-gray-500">25% Complete</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Primary Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/projects/new">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-12">
                      <PlusIcon className="h-5 w-5 mr-2" />
                      New Project
                    </Button>
                  </Link>
                  <Link href="/grants">
                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 h-12">
                      <DocumentMagnifyingGlassIcon className="h-5 w-5 mr-2" />
                      Find Grants
                    </Button>
                  </Link>
                  <Link href="/tasks">
                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 h-12">
                      <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                      View Tasks
                    </Button>
                  </Link>
                  <Link href="/impact">
                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 h-12">
                      <ChartBarIcon className="h-5 w-5 mr-2" />
                      Impact Analytics
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity - Simplified */}
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Project Updated', project: 'Digital Inclusion Initiative', time: '2 hours ago', status: 'success' },
                    { action: 'Grant Application', project: 'Community Tech Hub', time: '1 day ago', status: 'pending' },
                    { action: 'Impact Assessment', project: 'Youth Mentoring Program', time: '2 days ago', status: 'success' },
                    { action: 'Task Completed', project: 'Sustainability Report', time: '3 days ago', status: 'success' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-1.5 rounded-full ${
                        item.status === 'success' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        <CheckCircleIcon className={`h-4 w-4 ${
                          item.status === 'success' ? 'text-green-600' : 'text-yellow-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.action}</p>
                        <p className="text-xs text-gray-600">{item.project}</p>
                      </div>
                      <span className="text-xs text-gray-500">{item.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Simplified */}
          <div className="space-y-6">
            {/* Navigation Hub */}
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Navigation Hub
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Projects', href: '/projects', icon: FolderIcon, color: 'green' },
                    { name: 'Grants', href: '/grants', icon: DocumentMagnifyingGlassIcon, color: 'yellow' },
                    { name: 'Tasks', href: '/tasks', icon: ClipboardDocumentListIcon, color: 'purple' },
                    { name: 'Impact', href: '/impact', icon: ChartBarIcon, color: 'blue' },
                    { name: 'Media', href: '/media', icon: PhotoIcon, color: 'indigo' },
                    { name: 'Time Logs', href: '/time-logs', icon: ClockIcon, color: 'gray' },
                  ].map((item) => (
                    <Link key={item.name} href={item.href}>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className={`p-2 rounded-lg bg-${item.color}-100`}>
                          <item.icon className={`h-4 w-4 text-${item.color}-600`} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                        <ArrowRightIcon className="h-4 w-4 text-gray-400 ml-auto" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Advanced Features */}
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Advanced Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/customer-hub">
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <CircleStackIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Customer Hub</span>
                      <ArrowRightIcon className="h-4 w-4 text-gray-400 ml-auto" />
                    </div>
                  </Link>
                  <Link href="/sustainability">
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="p-2 rounded-lg bg-emerald-100">
                        <ShieldCheckIcon className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Sustainability</span>
                      <ArrowRightIcon className="h-4 w-4 text-gray-400 ml-auto" />
                    </div>
                  </Link>
                  <Link href="/help-guide">
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Help & Guide</span>
                      <ArrowRightIcon className="h-4 w-4 text-gray-400 ml-auto" />
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 