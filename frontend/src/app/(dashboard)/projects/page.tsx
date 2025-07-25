import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Server-side rendered page to avoid JavaScript issues
export default function ProjectsPage() {
  return (
    <div className="p-8 space-y-8 bg-neutral-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-neutral-900">Impact Projects</h1>
            <p className="text-lg text-neutral-600 mt-2">
              Track and manage your impact projects with Victorian framework alignment
            </p>
          </div>
          <div className="flex items-center space-x-3 ml-6">
            <Button 
              variant="secondary" 
              size="md"
              onClick={() => window.location.href = '/projects/new'}
            >
              New Impact Project
            </Button>
          </div>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-neutral-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-neutral-900">2</div>
              <div className="text-sm text-neutral-600">Total Projects</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-neutral-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-neutral-900">1,250</div>
              <div className="text-sm text-neutral-600">People Reached</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-neutral-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-neutral-900">2</div>
              <div className="text-sm text-neutral-600">Victorian Frameworks</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-neutral-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">87</div>
              <div className="text-sm text-neutral-600">Portfolio Impact Score</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Framework Alignment Snapshot */}
      <Card className="bg-white border-neutral-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Framework Alignment Snapshot</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900">0</div>
              <div className="text-xs text-neutral-600 text-center">Plan for Victoria</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900">2</div>
              <div className="text-xs text-neutral-600 text-center">Melbourne 2030</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900">0</div>
              <div className="text-xs text-neutral-600 text-center">Activity Centres</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900">1</div>
              <div className="text-xs text-neutral-600 text-center">Greenfields Plan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900">0</div>
              <div className="text-xs text-neutral-600 text-center">Clean Economy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900">0</div>
              <div className="text-xs text-neutral-600 text-center">Reconciliation</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <p className="text-sm text-neutral-600">
              2 projects linked to UN SDGs • 2 projects aligned with Victorian priorities
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Demo Projects */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900">Impact Projects</h2>
          <div className="text-sm text-neutral-500">Showing 2 of 2 projects</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Project 1 */}
          <Card className="bg-white border-neutral-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-neutral-900">Greenfields Housing Renewal</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
                </div>
                <p className="text-sm text-neutral-600">
                  Sustainable housing development in Melbourne's growth corridors, focusing on environmental impact and community wellbeing.
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">Melbourne 2030</span>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Greenfields Plan</span>
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">SDG 11</span>
                </div>
                <div className="pt-2 border-t border-neutral-200">
                  <div className="text-sm text-neutral-500">Reach: 500 people</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project 2 */}
          <Card className="bg-white border-neutral-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-neutral-900">Frontend Integration Test</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
                </div>
                <p className="text-sm text-neutral-600">
                  Testing project for frontend-backend integration with framework alignment features.
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">Melbourne 2030</span>
                  <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">SDG 4</span>
                </div>
                <div className="pt-2 border-t border-neutral-200">
                  <div className="text-sm text-neutral-500">Reach: 750 people</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status */}
      <Card className="bg-white border-neutral-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Page Status</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-neutral-600">Server-side rendering working</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-neutral-600">Static content displayed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-neutral-600">Interactive features pending</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
