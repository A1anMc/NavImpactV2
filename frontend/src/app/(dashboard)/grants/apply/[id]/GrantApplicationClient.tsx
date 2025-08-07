'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  ArrowLeftIcon,
  ArrowRightIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { grantsApi } from '@/services/grants';
import { Grant } from '@/types/models';

interface GrantApplicationClientProps {
  grantId: string;
}

interface ApplicationData {
  projectOverview: {
    title: string;
    description: string;
    creativeVision: string;
    targetAudience: string;
  };
  creativeTeam: {
    director: string;
    producer: string;
    keyPersonnel: Array<{ name: string; role: string; experience: string }>;
  };
  budgetBreakdown: {
    totalBudget: number;
    categories: Array<{ category: string; amount: number; description: string }>;
    justification: string;
  };
  impactStatement: {
    socialImpact: string;
    culturalImpact: string;
    measurableOutcomes: string;
    communityEngagement: string;
  };
  distributionStrategy: {
    platforms: string[];
    targetAudience: string;
    marketingPlan: string;
    timeline: string;
  };
  aiAnalysis: {
    uploadedDocuments: Array<{ name: string; type: string; content: string; analysis: string }>;
    projectUrls: Array<{ url: string; analysis: string }>;
    aiSuggestions: Array<string>;
    generatedContent: {
      projectDescription: string;
      impactStatement: string;
      budgetJustification: string;
    };
  };
}

export function GrantApplicationClient({ grantId }: GrantApplicationClientProps) {
  const [grant, setGrant] = useState<Grant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    projectOverview: {
      title: '',
      description: '',
      creativeVision: '',
      targetAudience: '',
    },
    creativeTeam: {
      director: '',
      producer: '',
      keyPersonnel: [{ name: '', role: '', experience: '' }],
    },
    budgetBreakdown: {
      totalBudget: 0,
      categories: [{ category: '', amount: 0, description: '' }],
      justification: '',
    },
    impactStatement: {
      socialImpact: '',
      culturalImpact: '',
      measurableOutcomes: '',
      communityEngagement: '',
    },
    distributionStrategy: {
      platforms: [],
      targetAudience: '',
      marketingPlan: '',
      timeline: '',
    },
    aiAnalysis: {
      uploadedDocuments: [],
      projectUrls: [],
      aiSuggestions: [],
      generatedContent: {
        projectDescription: '',
        impactStatement: '',
        budgetJustification: '',
      },
    },
  });

  // Fetch grant data from API
  useEffect(() => {
    const fetchGrant = async () => {
      try {
        console.log('🔄 [GrantApplicationClient] Starting to fetch grant:', grantId);
        setLoading(true);
        setError(null);
        
        const grantData = await grantsApi.getGrant(grantId);
        console.log('✅ [GrantApplicationClient] Grant data received:', grantData);
        setGrant(grantData);
      } catch (err) {
        console.error('❌ [GrantApplicationClient] Error fetching grant:', err);
        setError('Failed to load grant details. Please try again.');
        // Set a fallback grant to prevent infinite loading
        setGrant({
          id: parseInt(grantId),
          title: 'Grant Application',
          description: 'Grant application form',
          source: 'NavImpact',
          source_url: '',
          application_url: '',
          contact_email: '',
          min_amount: 0,
          max_amount: 0,
          open_date: new Date(),
          deadline: new Date(),
          industry_focus: 'media',
          location_eligibility: 'Australia',
          org_type_eligible: [],
          funding_purpose: [],
          audience_tags: [],
          status: 'open',
          notes: '',
          created_at: new Date(),
          updated_at: new Date(),
          created_by_id: null
        });
      } finally {
        console.log('🏁 [GrantApplicationClient] Setting loading to false');
        setLoading(false);
      }
    };

    if (grantId) {
      fetchGrant();
    } else {
      console.log('⚠️ [GrantApplicationClient] No grantId provided');
      setLoading(false);
    }
  }, [grantId]);

  const applicationSteps = [
    {
      id: 1,
      title: 'AI Analysis',
      description: 'Upload documents and URLs for AI-powered grant writing assistance',
      status: 'pending',
      estimatedTime: '15 min',
      aiSupport: true,
    },
    {
      id: 2,
      title: 'Project Overview',
      description: 'Describe your project concept and creative vision',
      status: 'pending',
      estimatedTime: '30 min',
      aiSupport: true,
    },
    {
      id: 3,
      title: 'Creative Team',
      description: 'List key personnel and their experience',
      status: 'pending',
      estimatedTime: '20 min',
      aiSupport: true,
    },
    {
      id: 4,
      title: 'Budget Breakdown',
      description: 'Detailed budget with justification',
      status: 'pending',
      estimatedTime: '45 min',
      aiSupport: true,
    },
    {
      id: 5,
      title: 'Impact Statement',
      description: 'Social and cultural impact of your project',
      status: 'pending',
      estimatedTime: '25 min',
      aiSupport: true,
    },
    {
      id: 6,
      title: 'Distribution Strategy',
      description: 'How you plan to reach your audience',
      status: 'pending',
      estimatedTime: '20 min',
      aiSupport: true,
    },
  ];

  const aiSuggestions = [
    'Focus on the unique creative vision that sets your project apart',
    'Emphasize the social and cultural impact of your work',
    'Provide specific, measurable outcomes for your project',
    'Demonstrate strong community engagement and participation',
    'Show clear budget justification with detailed breakdowns',
    'Highlight innovative approaches to storytelling and content creation',
  ];

  const handleNextStep = () => {
    if (currentStep < applicationSteps.length) {
      setCurrentStep(currentStep + 1);
      setProgress((currentStep / applicationSteps.length) * 100);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setProgress(((currentStep - 2) / applicationSteps.length) * 100);
    }
  };

  const handleSubmitApplication = async () => {
    try {
      // Here you would submit the application data to your API
      console.log('Submitting application:', applicationData);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const updateApplicationData = (section: keyof ApplicationData, data: any) => {
    setApplicationData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const addKeyPersonnel = () => {
    setApplicationData(prev => ({
      ...prev,
      creativeTeam: {
        ...prev.creativeTeam,
        keyPersonnel: [...prev.creativeTeam.keyPersonnel, { name: '', role: '', experience: '' }]
      }
    }));
  };

  const removeKeyPersonnel = (index: number) => {
    setApplicationData(prev => ({
      ...prev,
      creativeTeam: {
        ...prev.creativeTeam,
        keyPersonnel: prev.creativeTeam.keyPersonnel.filter((_, i) => i !== index)
      }
    }));
  };

  const addBudgetCategory = () => {
    setApplicationData(prev => ({
      ...prev,
      budgetBreakdown: {
        ...prev.budgetBreakdown,
        categories: [...prev.budgetBreakdown.categories, { category: '', amount: 0, description: '' }]
      }
    }));
  };

  const removeBudgetCategory = (index: number) => {
    setApplicationData(prev => ({
      ...prev,
      budgetBreakdown: {
        ...prev.budgetBreakdown,
        categories: prev.budgetBreakdown.categories.filter((_, i) => i !== index)
      }
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closing_soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading grant application...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                <h3 className="text-lg font-medium text-red-800">Error Loading Grant</h3>
              </div>
              <p className="mt-2 text-red-700">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Main Content - Only render if grant exists and not loading */}
          {!loading && !error && grant && (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Grant Application</h1>
                    <p className="text-blue-100">Complete your application for {grant.title}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{Math.round(progress)}%</div>
                    <div className="text-blue-100">Complete</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
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

              {/* Application Form */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Steps */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <ClipboardDocumentIcon className="h-5 w-5 mr-2" />
                        {applicationSteps[currentStep - 1].title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {renderStepContent()}
                        
                        <div className="flex items-center justify-between pt-6 border-t">
                          <Button
                            variant="outline"
                            onClick={handlePrevStep}
                            disabled={currentStep === 1}
                          >
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Previous
                          </Button>
                          
                          {currentStep < applicationSteps.length ? (
                            <Button onClick={handleNextStep}>
                              Next
                              <ArrowRightIcon className="h-4 w-4 ml-2" />
                            </Button>
                          ) : (
                            <Button onClick={handleSubmitApplication}>
                              Submit Application
                            </Button>
                          )}
                        </div>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
} 