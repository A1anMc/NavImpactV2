import React from 'react';
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

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
  ];
}

// Mock grant data
const grantData = {
  id: 1,
  title: 'Screen Australia Documentary Development',
  amount: '$50,000',
  deadline: '2024-02-15',
  status: 'open',
  category: 'Documentary',
  organisation: 'Screen Australia',
  description: 'Development funding for documentary projects with strong social impact focus.',
  requirements: ['Australian content', 'Social impact', 'Innovative storytelling'],
  priority: 'high',
  matchRate: '75%',
  successRate: '15%',
  applicationSteps: [
    'Project Overview',
    'Creative Team',
    'Budget Breakdown',
    'Impact Statement',
    'Distribution Strategy',
    'Supporting Materials'
  ],
  aiSuggestions: [
    'Emphasize social impact and community engagement',
    'Include diverse representation in your team',
    'Show clear audience and distribution strategy',
    'Demonstrate innovative storytelling approach',
    'Provide strong evidence of project feasibility'
  ]
};

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
  },
];

export default function GrantApplicationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Grant Application</h1>
                <p className="text-blue-100">AI-powered application support for {grantData.title}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Download Grant Info
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                >
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  AI Analysis
                </Button>
              </div>
            </div>
          </div>

          {/* Grant Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{grantData.title}</CardTitle>
                <Badge variant="secondary" className="text-sm">
                  {grantData.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-semibold">{grantData.amount}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Deadline</p>
                    <p className="font-semibold">{grantData.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Match Rate</p>
                    <p className="font-semibold">{grantData.matchRate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Steps */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Application Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applicationSteps.map((step) => (
                <Card key={step.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <Badge variant="outline">{step.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {step.estimatedTime}
                      </span>
                      {step.aiSupport && (
                        <span className="flex items-center text-blue-600">
                          <SparklesIcon className="h-4 w-4 mr-1" />
                          AI Support
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2 text-purple-600" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {grantData.aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <LightBulbIcon className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <p className="text-gray-700">{suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Start Application
            </Button>
            <Button size="lg" variant="outline">
              <EyeIcon className="h-5 w-5 mr-2" />
              Preview Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 