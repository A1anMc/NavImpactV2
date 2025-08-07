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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading grant application...</p>
        </div>
      </div>
    );
  }

  if (error || !grant) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Grant</h3>
          <p className="text-gray-600">{error || 'Grant not found'}</p>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">AI-Powered Grant Writing Assistant</h3>
              <p className="text-blue-800 mb-4">
                Upload your project documents or provide URLs to help AI analyze your project and generate grant content.
              </p>
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Project Documents</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.rtf"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    files.forEach(file => {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const content = event.target?.result as string;
                        const newDoc = {
                          name: file.name,
                          type: file.type,
                          content: content,
                          analysis: 'Analyzing document...'
                        };
                        setApplicationData(prev => ({
                          ...prev,
                          aiAnalysis: {
                            ...prev.aiAnalysis,
                            uploadedDocuments: [...prev.aiAnalysis.uploadedDocuments, newDoc]
                          }
                        }));
                        
                        // Simulate AI analysis
                        setTimeout(() => {
                          setApplicationData(prev => ({
                            ...prev,
                            aiAnalysis: {
                              ...prev.aiAnalysis,
                              uploadedDocuments: prev.aiAnalysis.uploadedDocuments.map(doc => 
                                doc.name === file.name 
                                  ? { ...doc, analysis: `AI Analysis: This document contains project planning information that can be used for grant writing. Key themes: ${file.name.includes('plan') ? 'Project planning and strategy' : 'Project documentation'}` }
                                  : doc
                              )
                            }
                          }));
                        }, 2000);
                      };
                      reader.readAsText(file);
                    });
                  }}
                  className="hidden"
                  id="document-upload"
                />
                <label htmlFor="document-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto" />
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-blue-600 hover:text-blue-500">
                        Click to upload
                      </span>{' '}
                      or drag and drop
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT, RTF up to 10MB</p>
                  </div>
                </label>
              </div>
              
              {/* Uploaded Documents */}
              {applicationData.aiAnalysis.uploadedDocuments.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h4 className="font-medium text-gray-900">Uploaded Documents</h4>
                  {applicationData.aiAnalysis.uploadedDocuments.map((doc, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DocumentTextIcon className="h-5 w-5 text-blue-500" />
                          <span className="font-medium">{doc.name}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setApplicationData(prev => ({
                              ...prev,
                              aiAnalysis: {
                                ...prev.aiAnalysis,
                                uploadedDocuments: prev.aiAnalysis.uploadedDocuments.filter((_, i) => i !== index)
                              }
                            }));
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                      {doc.analysis && (
                        <p className="text-sm text-gray-600 mt-2">{doc.analysis}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project URLs</label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter project URL (e.g., website, social media, portfolio)"
                    value={applicationData.aiAnalysis.projectUrls.find((_, i) => i === applicationData.aiAnalysis.projectUrls.length - 1)?.url || ''}
                    onChange={(e) => {
                      const urls = [...applicationData.aiAnalysis.projectUrls];
                      if (urls.length === 0 || urls[urls.length - 1].url) {
                        urls.push({ url: e.target.value, analysis: '' });
                      } else {
                        urls[urls.length - 1].url = e.target.value;
                      }
                      setApplicationData(prev => ({
                        ...prev,
                        aiAnalysis: {
                          ...prev.aiAnalysis,
                          projectUrls: urls
                        }
                      }));
                    }}
                  />
                  <Button
                    onClick={() => {
                      const urls = [...applicationData.aiAnalysis.projectUrls];
                      if (urls.length > 0 && urls[urls.length - 1].url) {
                        // Simulate AI analysis of URL
                        setTimeout(() => {
                          setApplicationData(prev => ({
                            ...prev,
                            aiAnalysis: {
                              ...prev.aiAnalysis,
                              projectUrls: prev.aiAnalysis.projectUrls.map((url, i) => 
                                i === prev.aiAnalysis.projectUrls.length - 1 
                                  ? { ...url, analysis: `AI Analysis: This URL contains project information that can be used for grant writing. Key insights: Project showcase and portfolio details.` }
                                  : url
                              )
                            }
                          }));
                        }, 1500);
                      }
                    }}
                  >
                    Analyze
                  </Button>
                </div>
                
                {/* Added URLs */}
                {applicationData.aiAnalysis.projectUrls.filter(url => url.url).map((url, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <GlobeAltIcon className="h-5 w-5 text-green-500" />
                        <a href={url.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {url.url}
                        </a>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setApplicationData(prev => ({
                            ...prev,
                            aiAnalysis: {
                              ...prev.aiAnalysis,
                              projectUrls: prev.aiAnalysis.projectUrls.filter((_, i) => i !== index)
                            }
                          }));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                    {url.analysis && (
                      <p className="text-sm text-gray-600 mt-2">{url.analysis}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Suggestions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">AI Suggestions</label>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="space-y-2">
                  {applicationData.aiAnalysis.aiSuggestions.length > 0 ? (
                    applicationData.aiAnalysis.aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <LightBulbIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <span className="text-sm text-yellow-800">{suggestion}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-yellow-800">
                      Upload documents or add URLs to get AI suggestions for your grant application.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Generate Content Button */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Generate Grant Content</h4>
              <p className="text-sm text-green-800 mb-4">
                Use AI to generate project descriptions, impact statements, and budget justifications based on your uploaded materials.
              </p>
              <Button
                onClick={() => {
                  // Simulate AI content generation
                  setApplicationData(prev => ({
                    ...prev,
                    aiAnalysis: {
                      ...prev.aiAnalysis,
                      generatedContent: {
                        projectDescription: 'AI-generated project description based on your uploaded materials...',
                        impactStatement: 'AI-generated impact statement highlighting social and cultural benefits...',
                        budgetJustification: 'AI-generated budget justification with detailed cost breakdown...'
                      }
                    }
                  }));
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* AI Generated Content */}
            {applicationData.aiAnalysis.generatedContent.projectDescription && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">AI-Generated Project Description</h4>
                <p className="text-sm text-green-800 mb-3">
                  {applicationData.aiAnalysis.generatedContent.projectDescription}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setApplicationData(prev => ({
                      ...prev,
                      projectOverview: {
                        ...prev.projectOverview,
                        description: applicationData.aiAnalysis.generatedContent.projectDescription
                      }
                    }));
                  }}
                >
                  Use This Description
                </Button>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
              <Input
                value={applicationData.projectOverview.title}
                onChange={(e) => updateApplicationData('projectOverview', { title: e.target.value })}
                placeholder="Enter your project title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Description *</label>
              <Textarea
                value={applicationData.projectOverview.description}
                onChange={(e) => updateApplicationData('projectOverview', { description: e.target.value })}
                placeholder="Describe your project in detail"
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Creative Vision *</label>
              <Textarea
                value={applicationData.projectOverview.creativeVision}
                onChange={(e) => updateApplicationData('projectOverview', { creativeVision: e.target.value })}
                placeholder="What is your unique creative vision for this project?"
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
              <Input
                value={applicationData.projectOverview.targetAudience}
                onChange={(e) => updateApplicationData('projectOverview', { targetAudience: e.target.value })}
                placeholder="Who is your target audience?"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Director *</label>
                <Input
                  value={applicationData.creativeTeam.director}
                  onChange={(e) => updateApplicationData('creativeTeam', { director: e.target.value })}
                  placeholder="Director name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Producer *</label>
                <Input
                  value={applicationData.creativeTeam.producer}
                  onChange={(e) => updateApplicationData('creativeTeam', { producer: e.target.value })}
                  placeholder="Producer name"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Personnel</label>
              {applicationData.creativeTeam.keyPersonnel.map((person, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Input
                    value={person.name}
                    onChange={(e) => {
                      const updatedPersonnel = [...applicationData.creativeTeam.keyPersonnel];
                      updatedPersonnel[index].name = e.target.value;
                      updateApplicationData('creativeTeam', { keyPersonnel: updatedPersonnel });
                    }}
                    placeholder="Name"
                  />
                  <Input
                    value={person.role}
                    onChange={(e) => {
                      const updatedPersonnel = [...applicationData.creativeTeam.keyPersonnel];
                      updatedPersonnel[index].role = e.target.value;
                      updateApplicationData('creativeTeam', { keyPersonnel: updatedPersonnel });
                    }}
                    placeholder="Role"
                  />
                  <div className="flex space-x-2">
                    <Input
                      value={person.experience}
                      onChange={(e) => {
                        const updatedPersonnel = [...applicationData.creativeTeam.keyPersonnel];
                        updatedPersonnel[index].experience = e.target.value;
                        updateApplicationData('creativeTeam', { keyPersonnel: updatedPersonnel });
                      }}
                      placeholder="Experience"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeKeyPersonnel(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addKeyPersonnel}>
                Add Team Member
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Budget (AUD) *</label>
              <Input
                type="number"
                value={applicationData.budgetBreakdown.totalBudget}
                onChange={(e) => updateApplicationData('budgetBreakdown', { totalBudget: parseFloat(e.target.value) || 0 })}
                placeholder="Enter total budget"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget Categories</label>
              {applicationData.budgetBreakdown.categories.map((category, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Input
                    value={category.category}
                    onChange={(e) => {
                      const updatedCategories = [...applicationData.budgetBreakdown.categories];
                      updatedCategories[index].category = e.target.value;
                      updateApplicationData('budgetBreakdown', { categories: updatedCategories });
                    }}
                    placeholder="Category"
                  />
                  <Input
                    type="number"
                    value={category.amount}
                    onChange={(e) => {
                      const updatedCategories = [...applicationData.budgetBreakdown.categories];
                      updatedCategories[index].amount = parseFloat(e.target.value) || 0;
                      updateApplicationData('budgetBreakdown', { categories: updatedCategories });
                    }}
                    placeholder="Amount"
                  />
                  <div className="flex space-x-2">
                    <Input
                      value={category.description}
                      onChange={(e) => {
                        const updatedCategories = [...applicationData.budgetBreakdown.categories];
                        updatedCategories[index].description = e.target.value;
                        updateApplicationData('budgetBreakdown', { categories: updatedCategories });
                      }}
                      placeholder="Description"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeBudgetCategory(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addBudgetCategory}>
                Add Budget Category
              </Button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget Justification *</label>
              <Textarea
                value={applicationData.budgetBreakdown.justification}
                onChange={(e) => updateApplicationData('budgetBreakdown', { justification: e.target.value })}
                placeholder="Explain how the budget will be used and why it's necessary"
                rows={4}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Social Impact *</label>
              <Textarea
                value={applicationData.impactStatement.socialImpact}
                onChange={(e) => updateApplicationData('impactStatement', { socialImpact: e.target.value })}
                placeholder="How will your project create positive social change?"
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cultural Impact</label>
              <Textarea
                value={applicationData.impactStatement.culturalImpact}
                onChange={(e) => updateApplicationData('impactStatement', { culturalImpact: e.target.value })}
                placeholder="How will your project contribute to cultural development?"
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Measurable Outcomes *</label>
              <Textarea
                value={applicationData.impactStatement.measurableOutcomes}
                onChange={(e) => updateApplicationData('impactStatement', { measurableOutcomes: e.target.value })}
                placeholder="What specific, measurable outcomes will your project achieve?"
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Community Engagement</label>
              <Textarea
                value={applicationData.impactStatement.communityEngagement}
                onChange={(e) => updateApplicationData('impactStatement', { communityEngagement: e.target.value })}
                placeholder="How will you engage with the community?"
                rows={4}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distribution Platforms</label>
              <div className="space-y-2">
                {['Cinema', 'Television', 'Streaming', 'Festivals', 'Online', 'Educational'].map((platform) => (
                  <label key={platform} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={applicationData.distributionStrategy.platforms.includes(platform)}
                      onChange={(e) => {
                        const updatedPlatforms = e.target.checked
                          ? [...applicationData.distributionStrategy.platforms, platform]
                          : applicationData.distributionStrategy.platforms.filter(p => p !== platform);
                        updateApplicationData('distributionStrategy', { platforms: updatedPlatforms });
                      }}
                      className="mr-2"
                    />
                    {platform}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
              <Input
                value={applicationData.distributionStrategy.targetAudience}
                onChange={(e) => updateApplicationData('distributionStrategy', { targetAudience: e.target.value })}
                placeholder="Who is your target audience for distribution?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marketing Plan</label>
              <Textarea
                value={applicationData.distributionStrategy.marketingPlan}
                onChange={(e) => updateApplicationData('distributionStrategy', { marketingPlan: e.target.value })}
                placeholder="How will you market and promote your project?"
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distribution Timeline</label>
              <Input
                value={applicationData.distributionStrategy.timeline}
                onChange={(e) => updateApplicationData('distributionStrategy', { timeline: e.target.value })}
                placeholder="What is your planned distribution timeline?"
              />
            </div>
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
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

          {/* Application Progress */}
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
        </div>
      </div>
    </div>
  );
} 