'use client';

import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { copyKit } from '@/lib/copy-kit';

export default function DashboardPage() {
  // Mock data for demonstration
  const stats = [
    { label: 'Active Projects', value: '12', change: '+2', changeType: 'positive' },
    { label: 'Total Funding', value: '$2.4M', change: '+15%', changeType: 'positive' },
    { label: 'SDG Alignment', value: '8', change: '+1', changeType: 'positive' },
    { label: 'Impact Score', value: '87%', change: '+5%', changeType: 'positive' },
  ];

  const recentProjects = [
    {
      id: 1,
      name: 'Community Education Initiative',
      status: 'active',
      sdgs: ['SDG-4', 'SDG-10'],
      progress: 75,
    },
    {
      id: 2,
      name: 'Environmental Conservation Program',
      status: 'active',
      sdgs: ['SDG-13', 'SDG-15'],
      progress: 45,
    },
    {
      id: 3,
      name: 'Youth Skills Development',
      status: 'completed',
      sdgs: ['SDG-8', 'SDG-4'],
      progress: 100,
    },
  ];

  const recentGrants = [
    {
      id: 1,
      name: 'Community Foundation Grant',
      amount: '$50,000',
      deadline: '2024-02-15',
      status: 'pending',
    },
    {
      id: 2,
      name: 'Environmental Impact Fund',
      amount: '$100,000',
      deadline: '2024-03-01',
      status: 'draft',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <PageHeader
        tagline={copyKit.dashboard.tagline}
        subheading={copyKit.dashboard.subheading}
        description={copyKit.dashboard.description}
        actions={
          <>
            <Button variant="secondary" size="md">
              Export Report
            </Button>
            <Button variant="primary" size="md">
              New Project
            </Button>
          </>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-success-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-900">{project.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="neutral" size="sm">
                        {project.status}
                      </Badge>
                      {project.sdgs.map((sdg) => (
                        <Badge key={sdg} variant="sdg" sdgCode={sdg} size="sm">
                          {sdg}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-neutral-900">{project.progress}%</div>
                    <div className="w-16 h-2 bg-neutral-200 rounded-full mt-1">
                      <div 
                        className="h-2 bg-success-500 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="ghost" size="sm">
                View All Projects →
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Grants */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Grants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGrants.map((grant) => (
                <div key={grant.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-900">{grant.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-neutral-600">{grant.amount}</span>
                      <span className="text-sm text-neutral-500">•</span>
                      <span className="text-sm text-neutral-600">Due {grant.deadline}</span>
                    </div>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {grant.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="ghost" size="sm">
                View All Grants →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="primary" size="lg" className="h-16">
              <div className="text-center">
                <div className="text-lg font-semibold">New Project</div>
                <div className="text-sm opacity-90">Create a new impact project</div>
              </div>
            </Button>
            <Button variant="secondary" size="lg" className="h-16">
              <div className="text-center">
                <div className="text-lg font-semibold">Find Grants</div>
                <div className="text-sm opacity-90">Discover funding opportunities</div>
              </div>
            </Button>
            <Button variant="success" size="lg" className="h-16">
              <div className="text-center">
                <div className="text-lg font-semibold">Generate Report</div>
                <div className="text-sm opacity-90">Create impact report</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 