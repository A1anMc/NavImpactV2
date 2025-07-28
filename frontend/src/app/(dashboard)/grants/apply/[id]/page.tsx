'use client';

import React, { useState } from 'react';
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
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState({});
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStepComplete = (stepId) => {
    setCurrentStep(stepId + 1);
  };

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAiAnalysis({
        score: 85,
        strengths: [
          'Strong social impact focus',
          'Clear target audience',
          'Experienced team',
          'Innovative approach'
        ],
        improvements: [
          'Add more specific metrics',
          'Include risk mitigation',
          'Strengthen budget justification'
        ],
        suggestions: [
          'Consider adding community consultation',
          'Include sustainability measures',
          'Add audience engagement strategy'
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const downloadGrantInfo = () => {
    // Simulate download
    const grantInfo = `
Grant: ${grantData.title}
Amount: ${grantData.amount}
Deadline: ${grantData.deadline}
Category: ${grantData.category}
Organisation: ${grantData.organisation}

Description:
${grantData.description}

Requirements:
${grantData.requirements.map(req => `- ${req}`).join('\n')}

Application Steps:
${grantData.applicationSteps.map(step => `- ${step}`).join('\n')}

AI Suggestions:
${grantData.aiSuggestions.map(suggestion => `- ${suggestion}`).join('\n')}
    `;
    
    const blob = new Blob([grantInfo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${grantData.title.replace(/\s+/g, '_')}_Grant_Info.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
                  onClick={downloadGrantInfo}
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Download Grant Info
                </Button>
                <Button 
                  onClick={handleAiAnalysis}
                  disabled={isAnalyzing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Application Progress */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ClipboardDocumentIcon className="h-5 w-5" />
                    <span>Application Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applicationSteps.map((step) => (
                      <div key={step.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.id < currentStep ? 'bg-green-500 text-white' :
                          step.id === currentStep ? 'bg-blue-500 text-white' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {step.id < currentStep ? (
                            <CheckCircleIcon className="h-5 w-5" />
                          ) : (
                            <span className="text-sm font-medium">{step.id}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{step.title}</h3>
                          <p className="text-sm text-gray-600">{step.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-500">{step.estimatedTime}</span>
                            {step.aiSupport && (
                              <Badge className="bg-purple-100 text-purple-800 text-xs">
                                <SparklesIcon className="h-3 w-3 mr-1" />
                                AI Support
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleStepComplete(step.id)}
                          disabled={step.id > currentStep}
                        >
                          {step.id < currentStep ? 'Completed' : 'Start'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Analysis Panel */}
            <div className="space-y-6">
              
              {/* Grant Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Grant Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Amount</p>
                    <p className="text-2xl font-bold text-green-600">{grantData.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Deadline</p>
                    <p className="text-sm text-gray-600">{grantData.deadline}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Success Rate</p>
                    <p className="text-sm text-gray-600">{grantData.successRate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Match Rate</p>
                    <p className="text-sm text-gray-600">{grantData.matchRate}</p>
                  </div>
                  <Badge className={
                    grantData.priority === 'high' ? 'bg-red-100 text-red-800' :
                    grantData.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }>
                    {grantData.priority} Priority
                  </Badge>
                </CardContent>
              </Card>

              {/* AI Analysis Results */}
              {aiAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <SparklesIcon className="h-5 w-5" />
                      <span>AI Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">Application Score</p>
                      <p className="text-3xl font-bold text-green-600">{aiAnalysis.score}%</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Strengths</p>
                      <ul className="space-y-1">
                        {aiAnalysis.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-green-600 flex items-center">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Improvements</p>
                      <ul className="space-y-1">
                        {aiAnalysis.improvements.map((improvement, index) => (
                          <li key={index} className="text-sm text-orange-600 flex items-center">
                            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Suggestions</p>
                      <ul className="space-y-1">
                        {aiAnalysis.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-blue-600 flex items-center">
                            <LightBulbIcon className="h-3 w-3 mr-1" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <LightBulbIcon className="h-5 w-5" />
                    <span>AI Suggestions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {grantData.aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 