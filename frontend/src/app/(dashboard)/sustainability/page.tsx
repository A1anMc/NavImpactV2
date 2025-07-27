'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChartBarIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  FlagIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface ESRSData {
  metrics: number;
  policies: number;
  action_plans: number;
  targets: number;
}

interface SustainabilityOverview {
  total_metrics: number;
  verified_metrics: number;
  total_policies: number;
  approved_policies: number;
  total_action_plans: number;
  completed_plans: number;
  total_targets: number;
  achieved_targets: number;
}

const SustainabilityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'environment' | 'social' | 'governance'>('overview');
  const [overview, setOverview] = useState<SustainabilityOverview | null>(null);
  const [esrsData, setEsrsData] = useState<{
    environment: Record<string, ESRSData>;
    social: Record<string, ESRSData>;
    governance: Record<string, ESRSData>;
  } | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    setOverview({
      total_metrics: 24,
      verified_metrics: 18,
      total_policies: 12,
      approved_policies: 10,
      total_action_plans: 15,
      completed_plans: 8,
      total_targets: 20,
      achieved_targets: 12,
    });

    setEsrsData({
      environment: {
        E1: { metrics: 4, policies: 2, action_plans: 3, targets: 5 },
        E2: { metrics: 3, policies: 1, action_plans: 2, targets: 3 },
        E3: { metrics: 2, policies: 1, action_plans: 1, targets: 2 },
        E4: { metrics: 3, policies: 2, action_plans: 2, targets: 4 },
        E5: { metrics: 2, policies: 1, action_plans: 1, targets: 2 },
      },
      social: {
        S1: { metrics: 3, policies: 2, action_plans: 2, targets: 3 },
        S2: { metrics: 2, policies: 1, action_plans: 1, targets: 2 },
        S3: { metrics: 2, policies: 1, action_plans: 1, targets: 2 },
        S4: { metrics: 3, policies: 2, action_plans: 2, targets: 3 },
      },
      governance: {
        G1: { metrics: 2, policies: 1, action_plans: 1, targets: 2 },
        G2: { metrics: 2, policies: 1, action_plans: 1, targets: 2 },
        G3: { metrics: 2, policies: 1, action_plans: 1, targets: 2 },
      },
    });
  }, []);

  const esrsTopics = {
    environment: {
      E1: { name: 'Climate Change', description: 'GHG emissions, reduction targets, transition plans' },
      E2: { name: 'Pollution', description: 'Air, water, and soil pollutants' },
      E3: { name: 'Water & Marine Resources', description: 'Water withdrawal, consumption, discharge quality' },
      E4: { name: 'Biodiversity & Ecosystems', description: 'Impacts on protected areas, mitigation actions' },
      E5: { name: 'Resource Use & Circular Economy', description: 'Material intensity, waste generation/recovery' },
    },
    social: {
      S1: { name: 'Own Workforce', description: 'Diversity, pay gap, health & safety, training' },
      S2: { name: 'Workers in Value Chain', description: 'Child/forced labour screening, fair wages' },
      S3: { name: 'Affected Communities', description: 'Human rights impact, indigenous rights' },
      S4: { name: 'Consumers & End-users', description: 'Product safety, data privacy, accessibility' },
    },
    governance: {
      G1: { name: 'Business Conduct', description: 'Ethics, corruption prevention, lobbying spend' },
      G2: { name: 'Organisation & Strategy', description: 'Sustainability targets, risk management' },
      G3: { name: 'Internal Control & Oversight', description: 'Board expertise, stakeholder engagement' },
    },
  };

  const getStatusColor = (completed: number, total: number) => {
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (completed: number, total: number) => {
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    if (percentage >= 80) return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
    if (percentage >= 60) return <ClockIcon className="h-5 w-5 text-yellow-600" />;
    return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Sustainability & Governance
              </h1>
              <p className="text-gray-600">
                Comprehensive tracking of environmental, social, and governance performance
              </p>
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

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'environment', name: 'Environment', icon: DocumentTextIcon },
              { id: 'social', name: 'Social', icon: ClipboardDocumentListIcon },
              { id: 'governance', name: 'Governance', icon: ShieldCheckIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-green-100 text-green-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && overview && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Metrics</p>
                      <p className="text-2xl font-bold text-gray-900">{overview.total_metrics}</p>
                      <p className="text-xs text-green-600 mt-1">
                        {overview.verified_metrics} verified
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <ChartBarIcon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Policies</p>
                      <p className="text-2xl font-bold text-gray-900">{overview.total_policies}</p>
                      <p className="text-xs text-green-600 mt-1">
                        {overview.approved_policies} approved
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Action Plans</p>
                      <p className="text-2xl font-bold text-gray-900">{overview.total_action_plans}</p>
                      <p className="text-xs text-green-600 mt-1">
                        {overview.completed_plans} completed
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <ClipboardDocumentListIcon className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Performance Targets</p>
                      <p className="text-2xl font-bold text-gray-900">{overview.total_targets}</p>
                      <p className="text-xs text-green-600 mt-1">
                        {overview.achieved_targets} achieved
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <FlagIcon className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ESRS Framework Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Environment */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <DocumentTextIcon className="h-5 w-5 text-green-600" />
                    </div>
                    Environment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(esrsTopics.environment).map(([code, topic]) => (
                      <div key={code} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div>
                          <p className="font-medium text-gray-900">{code}: {topic.name}</p>
                          <p className="text-xs text-gray-600">{topic.description}</p>
                        </div>
                        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Social */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <ClipboardDocumentListIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    Social
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(esrsTopics.social).map(([code, topic]) => (
                      <div key={code} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div>
                          <p className="font-medium text-gray-900">{code}: {topic.name}</p>
                          <p className="text-xs text-gray-600">{topic.description}</p>
                        </div>
                        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Governance */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    Governance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(esrsTopics.governance).map(([code, topic]) => (
                      <div key={code} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div>
                          <p className="font-medium text-gray-900">{code}: {topic.name}</p>
                          <p className="text-xs text-gray-600">{topic.description}</p>
                        </div>
                        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Environment Tab */}
        {activeTab === 'environment' && esrsData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(esrsTopics.environment).map(([code, topic]) => {
                const data = esrsData.environment[code];
                const totalItems = data.metrics + data.policies + data.action_plans + data.targets;
                const completedItems = Math.floor(totalItems * 0.75); // Mock completion rate
                
                return (
                  <Card key={code} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {code}: {topic.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{topic.description}</p>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Progress</span>
                          {getStatusIcon(completedItems, totalItems)}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Metrics</span>
                            <span className="font-medium">{data.metrics}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Policies</span>
                            <span className="font-medium">{data.policies}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Action Plans</span>
                            <span className="font-medium">{data.action_plans}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Targets</span>
                            <span className="font-medium">{data.targets}</span>
                          </div>
                        </div>
                        
                        <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Add {code} Data
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Social Tab */}
        {activeTab === 'social' && esrsData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(esrsTopics.social).map(([code, topic]) => {
                const data = esrsData.social[code];
                const totalItems = data.metrics + data.policies + data.action_plans + data.targets;
                const completedItems = Math.floor(totalItems * 0.8); // Mock completion rate
                
                return (
                  <Card key={code} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {code}: {topic.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{topic.description}</p>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Progress</span>
                          {getStatusIcon(completedItems, totalItems)}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Metrics</span>
                            <span className="font-medium">{data.metrics}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Policies</span>
                            <span className="font-medium">{data.policies}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Action Plans</span>
                            <span className="font-medium">{data.action_plans}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Targets</span>
                            <span className="font-medium">{data.targets}</span>
                          </div>
                        </div>
                        
                        <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Add {code} Data
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Governance Tab */}
        {activeTab === 'governance' && esrsData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(esrsTopics.governance).map(([code, topic]) => {
                const data = esrsData.governance[code];
                const totalItems = data.metrics + data.policies + data.action_plans + data.targets;
                const completedItems = Math.floor(totalItems * 0.85); // Mock completion rate
                
                return (
                  <Card key={code} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {code}: {topic.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{topic.description}</p>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Progress</span>
                          {getStatusIcon(completedItems, totalItems)}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Metrics</span>
                            <span className="font-medium">{data.metrics}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Policies</span>
                            <span className="font-medium">{data.policies}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Action Plans</span>
                            <span className="font-medium">{data.action_plans}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Targets</span>
                            <span className="font-medium">{data.targets}</span>
                          </div>
                        </div>
                        
                        <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Add {code} Data
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SustainabilityPage; 