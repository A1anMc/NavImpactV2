'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  SparklesIcon,
  UserGroupIcon,
  ChartBarIcon,
  LightBulbIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
} from '@heroicons/react/24/outline';
import { grantsApi } from '@/services/grants';
import { Grant } from '@/types/models';

interface GrantApplicationClientProps {
  grantId: string;
}

export function GrantApplicationClient({ grantId }: GrantApplicationClientProps) {
  const [grant, setGrant] = useState<Grant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);

  // Fetch grant data from API
  useEffect(() => {
    const fetchGrant = async () => {
      try {
        setLoading(true);
        const grantData = await grantsApi.getGrant(grantId);
        setGrant(grantData);
        setError(null);
      } catch (err) {
        console.error('Error fetching grant:', err);
        setError('Failed to load grant details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (grantId) {
      fetchGrant();
    }
  }, [grantId]);

  const applicationSteps = [
    {
      id: 1,
      title: 'Project Overview',
      description: 'Describe your project concept and creative vision',
      status: 'pending',
      estimatedTime: '30 min',
      aiSupport: true,
    },
    {
      id: 2,
      title: 'Creative Team',
      description: 'List key personnel and their experience',
      status: 'pending',
      estimatedTime: '20 min',
      aiSupport: true,
    },
    {
      id: 3,
      title: 'Budget Breakdown',
      description: 'Detailed budget with justification',
      status: 'pending',
      estimatedTime: '45 min',
      aiSupport: true,
    },
    {
      id: 4,
      title: 'Impact Statement',
      description: 'Social and cultural impact of your project',
      status: 'pending',
      estimatedTime: '25 min',
      aiSupport: true,
    },
    {
      id: 5,
      title: 'Distribution Strategy',
      description: 'How you plan to reach your audience',
      status: 'pending',
      estimatedTime: '20 min',
      aiSupport: true,
    },
    {
      id: 6,
      title: 'Supporting Materials',
      description: 'Portfolio, references, and additional documents',
      status: 'pending',
      estimatedTime: '15 min',
      aiSupport: false,
    }
  ];

  const aiSuggestions = [
    'Emphasize social impact and community engagement',
    'Include diverse representation in your team',
    'Show clear audience and distribution strategy',
    'Demonstrate innovative storytelling approach',
    'Provide strong evidence of project feasibility'
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'closing_soon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading grant details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !grant) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto" />
            <p className="mt-4 text-red-600">{error || 'Grant not found'}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{grant.title}</h1>
            <p className="text-gray-600 mt-2">
              AI-Powered Grant Application Process
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <EyeIcon className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button>
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Download Grant Info
            </Button>
          </div>
        </div>

        {/* Grant Details Card */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{grant.title}</CardTitle>
                <p className="text-gray-600 mt-1">{grant.source}</p>
              </div>
              <Badge className={getStatusColor(grant.status)}>
                {grant.status.replace('_', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-semibold">
                    {grant.min_amount && grant.max_amount 
                      ? `${formatCurrency(grant.min_amount)} - ${formatCurrency(grant.max_amount)}`
                      : 'Amount not specified'
                    }
                  </p>
                </div>
              </div>
              {grant.deadline && (
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-red-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Deadline</p>
                    <p className="font-semibold">{formatDate(grant.deadline.toString())}</p>
                  </div>
                </div>
              )}
              {grant.industry_focus && (
                <div className="flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Industry</p>
                    <p className="font-semibold capitalize">{grant.industry_focus}</p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-gray-700 mt-4">{grant.description}</p>
          </CardContent>
        </Card>
      </div>

      {/* Application Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Steps */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardDocumentIcon className="h-5 w-5 mr-2" />
                Application Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicationSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`p-4 border rounded-lg ${
                      step.id === currentStep
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          step.id < currentStep
                            ? 'bg-green-500 text-white'
                            : step.id === currentStep
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {step.id < currentStep ? (
                            <CheckCircleIcon className="h-5 w-5" />
                          ) : (
                            <span className="text-sm font-medium">{step.id}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{step.title}</h3>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{step.estimatedTime}</span>
                        {step.aiSupport && (
                          <SparklesIcon className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Support Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2" />
                AI Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">AI Suggestions</h4>
                  <ul className="space-y-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-blue-800 flex items-start">
                        <LightBulbIcon className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Success Tips</h4>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li>• Be specific about your project goals</li>
                    <li>• Include measurable outcomes</li>
                    <li>• Demonstrate community impact</li>
                    <li>• Show clear budget justification</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Application Stats</h4>
                  <div className="space-y-2 text-sm text-purple-800">
                    <div className="flex justify-between">
                      <span>Estimated Time:</span>
                      <span className="font-medium">2.5 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate:</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Match Score:</span>
                      <span className="font-medium">75%</span>
                    </div>
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