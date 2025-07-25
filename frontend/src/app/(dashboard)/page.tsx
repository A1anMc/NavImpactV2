'use client';

import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { copyKit, impactMetrics } from '@/lib/copy-kit';
import { VICTORIAN_FRAMEWORKS, VictorianFramework } from '@/types/projects';

export default function DashboardPage() {
  // Portfolio-level impact metrics
  const portfolioMetrics = [
    { 
      label: 'Portfolio Impact Score', 
      value: '87', 
      unit: '/100',
      change: '+12', 
      changeType: 'positive',
      description: 'Aggregated reach, depth & systemic influence'
    },
    { 
      label: 'Communities Reached', 
      value: '24', 
      unit: '',
      change: '+3', 
      changeType: 'positive',
      description: 'Direct community impact'
    },
    { 
      label: 'Victorian Frameworks', 
      value: '6', 
      unit: '/6',
      change: '+2', 
      changeType: 'positive',
      description: 'Government priorities aligned'
    },
    { 
      label: 'Funding Utilisation', 
      value: '94', 
      unit: '%',
      change: '+5%', 
      changeType: 'positive',
      description: 'Efficiency vs outcomes achieved'
    },
  ];

  // Impact analytics data
  const impactAnalytics = {
    reach: { current: 15420, target: 20000, growth: 15 },
    depth: { current: 78, target: 85, growth: 8 },
    systemic: { current: 65, target: 75, growth: 12 },
    sustainability: { current: 82, target: 90, growth: 6 },
  };

  // Framework alignment data
  const frameworkAlignment = {
    plan_for_victoria: 4,
    melbourne_2030: 3,
    activity_centres_program: 2,
    greenfields_housing_plan: 1,
    clean_economy_workforce_strategy: 2,
    victorian_aboriginal_affairs_framework: 1,
  };

  // Recent impact projects
  const recentProjects = [
    {
      id: 1,
      name: 'Community Education Initiative',
      status: 'active',
      sdgs: ['SDG-4', 'SDG-10'],
      frameworks: ['plan_for_victoria', 'melbourne_2030'] as VictorianFramework[],
      reach: 1250,
      impactScore: 89,
      outcomes: 'Literacy improved by 23%',
    },
    {
      id: 2,
      name: 'Environmental Conservation Program',
      status: 'active',
      sdgs: ['SDG-13', 'SDG-15'],
      frameworks: ['melbourne_2030', 'activity_centres_program'] as VictorianFramework[],
      reach: 890,
      impactScore: 76,
      outcomes: 'Emissions reduced by 15%',
    },
    {
      id: 3,
      name: 'Youth Skills Development',
      status: 'completed',
      sdgs: ['SDG-8', 'SDG-4'],
      frameworks: ['plan_for_victoria', 'clean_economy_workforce_strategy'] as VictorianFramework[],
      reach: 2100,
      impactScore: 94,
      outcomes: 'Employment rate increased by 31%',
    },
  ];

  // Recent funding activities
  const recentFunding = [
    {
      id: 1,
      name: 'Community Foundation Grant',
      amount: '$50,000',
      deadline: '2024-02-15',
      status: 'pending',
      impactAlignment: 'High',
    },
    {
      id: 2,
      name: 'Environmental Impact Fund',
      amount: '$100,000',
      deadline: '2024-03-01',
      status: 'draft',
      impactAlignment: 'Medium',
    },
  ];

  return (
    <div className="p-8 space-y-8 bg-neutral-50 min-h-screen">
      {/* Page Header */}
      <PageHeader
        tagline={copyKit.dashboard.tagline}
        subheading={copyKit.dashboard.subheading}
        description={copyKit.dashboard.description}
        actions={
          <>
            <Button variant="secondary" size="md">
              Export Analytics
            </Button>
            <Button variant="primary" size="md">
              New Impact Project
            </Button>
          </>
        }
      />

      {/* Portfolio-Level Impact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioMetrics.map((metric, index) => (
          <Card key={index} className="bg-white border-neutral-200">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-600">{metric.label}</p>
                  <div className={`text-sm font-semibold ${
                    metric.changeType === 'positive' ? 'text-impact-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold text-neutral-900">{metric.value}</span>
                    <span className="text-lg text-neutral-500">{metric.unit}</span>
                  </div>
                  <p className="text-xs text-neutral-500">{metric.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Framework Alignment Snapshot */}
      <Card className="bg-white border-neutral-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Framework Alignment Snapshot</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            {Object.entries(frameworkAlignment).map(([framework, count]) => (
              <div key={framework} className="text-center">
                <div className="text-2xl font-bold text-neutral-900">{count}</div>
                <div className="text-xs text-neutral-600 text-center">
                  {VICTORIAN_FRAMEWORKS[framework as VictorianFramework].badgeLabel}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-neutral-200">
            <p className="text-sm text-neutral-600">
              4 projects aligned with Plan for Victoria, 3 with Melbourne 2030, 2 with Victorian Aboriginal Affairs Framework, 6 linked to UN SDGs
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Impact Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Impact Metrics Overview */}
        <Card className="lg:col-span-2 bg-white border-neutral-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-neutral-900">Impact Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(impactAnalytics).map(([key, data]) => (
                <div key={key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-neutral-700 capitalize">{key}</h4>
                    <span className="text-sm text-impact-600 font-medium">+{data.growth}%</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-neutral-900">{data.current}</span>
                      <span className="text-sm text-neutral-500">/ {data.target}</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-impact-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(data.current / data.target) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SDG Alignment Summary */}
        <Card className="bg-white border-neutral-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-neutral-900">SDG Alignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">8</div>
                <div className="text-sm text-neutral-600">Goals Addressed</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['SDG-4', 'SDG-8', 'SDG-10', 'SDG-13', 'SDG-15', 'SDG-16'].map((sdg) => (
                  <Badge key={sdg} variant="sdg" sdgCode={sdg} size="sm" className="text-xs">
                    {sdg}
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-neutral-500 text-center">
                Top alignment areas: Education, Economic Growth, Reduced Inequalities
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Projects and Funding Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Impact Projects */}
        <Card className="bg-white border-neutral-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-neutral-900">Recent Impact Projects</CardTitle>
              <Button variant="ghost" size="sm">
                View All →
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-neutral-900 mb-1">{project.name}</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="neutral" size="sm">
                          {project.status}
                        </Badge>
                        {project.frameworks?.slice(0, 1).map((framework) => (
                          <Badge
                            key={framework}
                            variant="victorian"
                            victorianFramework={framework}
                            size="sm"
                            className="text-xs"
                          >
                            {VICTORIAN_FRAMEWORKS[framework].badgeLabel}
                          </Badge>
                        ))}
                        {project.sdgs.slice(0, 1).map((sdg) => (
                          <Badge key={sdg} variant="sdg" sdgCode={sdg} size="sm">
                            {sdg}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-neutral-900">{project.impactScore}</div>
                      <div className="text-xs text-neutral-500">Impact Score</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Reach:</span>
                      <span className="font-medium">{project.reach.toLocaleString()} people</span>
                    </div>
                    <div className="text-sm text-neutral-600">
                      <span className="font-medium">Outcomes:</span> {project.outcomes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Funding Activities */}
        <Card className="bg-white border-neutral-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-neutral-900">Funding Activities</CardTitle>
              <Button variant="ghost" size="sm">
                View All →
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFunding.map((funding) => (
                <div key={funding.id} className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-neutral-900 mb-1">{funding.name}</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="neutral" size="sm">
                          {funding.status}
                        </Badge>
                        <Badge 
                          variant={funding.impactAlignment === 'High' ? 'impact' : 'neutral'} 
                          size="sm"
                        >
                          {funding.impactAlignment} Impact
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-neutral-900">{funding.amount}</div>
                      <div className="text-xs text-neutral-500">Amount</div>
                    </div>
                  </div>
                  <div className="text-sm text-neutral-600">
                    <span className="font-medium">Deadline:</span> {funding.deadline}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Impact Focused */}
      <Card className="bg-white border-neutral-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-neutral-900">Impact Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="primary" size="lg" className="h-16">
              <div className="text-center">
                <div className="text-lg font-semibold">New Impact Project</div>
                <div className="text-sm opacity-90">Create measurable outcomes</div>
              </div>
            </Button>
            <Button variant="impact" size="lg" className="h-16">
              <div className="text-center">
                <div className="text-lg font-semibold">Generate Impact Report</div>
                <div className="text-sm opacity-90">Demonstrate value to stakeholders</div>
              </div>
            </Button>
            <Button variant="secondary" size="lg" className="h-16">
              <div className="text-center">
                <div className="text-lg font-semibold">Discover Funding</div>
                <div className="text-sm opacity-90">Find aligned opportunities</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 