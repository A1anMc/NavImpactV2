'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

const ImpactPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'detailed'>('overview');
  const [expandedMetrics, setExpandedMetrics] = useState<Set<string>>(new Set());

  const toggleMetric = (metricId: string) => {
    const newExpanded = new Set(expandedMetrics);
    if (newExpanded.has(metricId)) {
      newExpanded.delete(metricId);
    } else {
      newExpanded.add(metricId);
    }
    setExpandedMetrics(newExpanded);
  };

  const impactMetrics = [
    {
      id: 'reach',
      name: 'Reach & Engagement',
      value: 15.2,
      unit: 'K',
      change: '+12%',
      status: 'positive',
      description: 'Total people reached through programs',
      details: 'Includes direct beneficiaries, community members, and online engagement',
    },
    {
      id: 'outcomes',
      name: 'Outcomes Achieved',
      value: 87,
      unit: '%',
      change: '+8%',
      status: 'positive',
      description: 'Percentage of planned outcomes achieved',
      details: 'Based on quarterly assessments and stakeholder feedback',
    },
    {
      id: 'satisfaction',
      name: 'Stakeholder Satisfaction',
      value: 4.6,
      unit: '/5',
      change: '+0.2',
      status: 'positive',
      description: 'Average satisfaction score from stakeholders',
      details: 'Survey responses from beneficiaries, partners, and funders',
    },
    {
      id: 'efficiency',
      name: 'Operational Efficiency',
      value: 92,
      unit: '%',
      change: '+5%',
      status: 'positive',
      description: 'Resource utilization efficiency',
      details: 'Ratio of outputs to inputs across all programs',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'positive':
        return <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />;
      case 'neutral':
        return <ClockIcon className="h-4 w-4 text-yellow-600" />;
      case 'negative':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />;
      default:
        return <CheckCircleIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Simplified Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Impact Analytics</h1>
              <p className="text-gray-600">Track and measure your social impact performance</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <EyeIcon className="h-4 w-4 mr-2" />
                View Report
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm w-fit">
            <button
              onClick={() => setActiveView('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeView === 'overview'
                  ? 'bg-green-100 text-green-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('detailed')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeView === 'detailed'
                  ? 'bg-green-100 text-green-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Detailed View
            </button>
          </div>
        </div>

        {/* Impact Metrics - Simplified */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {impactMetrics.map((metric) => (
            <Card key={metric.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-600">{metric.name}</h3>
                  {getStatusIcon(metric.status)}
                </div>
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                  <span className="text-sm text-gray-500">{metric.unit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{metric.description}</span>
                  <Badge className={`text-xs ${
                    metric.status === 'positive' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {metric.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Metrics - Progressive Disclosure */}
        {activeView === 'detailed' && (
          <div className="space-y-6">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Detailed Impact Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {impactMetrics.map((metric) => (
                    <div key={metric.id} className="border border-gray-200 rounded-lg p-4">
                      <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleMetric(metric.id)}
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">{metric.name}</h4>
                          <p className="text-sm text-gray-600">{metric.description}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">{metric.value}{metric.unit}</div>
                            <Badge className={`text-xs ${
                              metric.status === 'positive' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {metric.change}
                            </Badge>
                          </div>
                          {expandedMetrics.has(metric.id) ? (
                            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      
                      {expandedMetrics.has(metric.id) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-700">{metric.details}</p>
                          <div className="mt-3 flex space-x-2">
                            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                              View Trends
                            </Button>
                            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                              Download Data
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Framework Alignment - Simplified */}
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Framework Alignment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Environmental</h4>
                    <div className="text-2xl font-bold text-green-600 mb-1">85%</div>
                    <p className="text-sm text-gray-600">Alignment Score</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Social</h4>
                    <div className="text-2xl font-bold text-blue-600 mb-1">92%</div>
                    <p className="text-sm text-gray-600">Alignment Score</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Governance</h4>
                    <div className="text-2xl font-bold text-purple-600 mb-1">78%</div>
                    <p className="text-sm text-gray-600">Alignment Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImpactPage; 