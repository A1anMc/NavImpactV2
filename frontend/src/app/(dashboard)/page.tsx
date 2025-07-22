'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import GrantRecommendations from '@/components/grants/GrantRecommendations';
import { 
  DocumentMagnifyingGlassIcon, 
  FolderIcon, 
  ClipboardDocumentListIcon,
  ChartBarIcon,
  PhotoIcon,
  ClockIcon,
  UserIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { Target } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">NavImpact Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your grants today.</p>
      </div>

      {/* Status Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-medium">System Status: All Services Operational</span>
          </div>
          <a 
            href="https://navimpact-api.onrender.com/health" 
            target="_blank" 
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            View API Status
          </a>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Grants</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <DocumentMagnifyingGlassIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <FolderIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Tasks</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <ClipboardDocumentListIcon className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Deadlines</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-xs text-red-600">This week</p>
              </div>
              <ClockIcon className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Recommendations */}
        <div className="lg:col-span-2">
          <GrantRecommendations limit={3} showTitle={true} />
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/grants">
                <Button variant="outline" className="w-full justify-start">
                  <DocumentMagnifyingGlassIcon className="h-4 w-4 mr-2" />
                  Browse All Grants
                </Button>
              </Link>
              <Link href="/grants?filter=matching">
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  View Matching Grants
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" className="w-full justify-start">
                  <FolderIcon className="h-4 w-4 mr-2" />
                  Manage Projects
                </Button>
              </Link>
              <Link href="/tasks">
                <Button variant="outline" className="w-full justify-start">
                  <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
                  View Tasks
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Profile Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-green-600" />
                Profile Setup
              </CardTitle>
              <CardDescription>
                Complete your profile to get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Organization Details</span>
                  <Badge variant="success">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Grant Preferences</span>
                  <Badge variant="success">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Notification Settings</span>
                  <Badge variant="warning">Pending</Badge>
                </div>
                <Link href="/settings/profile">
                  <Button size="sm" className="w-full mt-2">
                    <CogIcon className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-purple-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">New grant added</p>
                    <p className="text-xs text-gray-500">Digital Media Innovation Fund</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Task completed</p>
                    <p className="text-xs text-gray-500">Review grant applications</p>
                    <p className="text-xs text-gray-400">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Deadline reminder</p>
                    <p className="text-xs text-gray-500">Youth Mental Health Initiative</p>
                    <p className="text-xs text-gray-400">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 