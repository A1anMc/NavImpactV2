'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DocumentTextIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

// Screen Australia Grant Application Data
const grantData = {
  id: "sa-doc-2025-001",
  title: "Documentary Production Funding - Screen Australia",
  project: "Season 2 of Forging Friendships",
  due_date: "2025-09-29",
  amount: "$500,000",
  status: "in_progress",
  progress: 35,
  current_step: 3,
  total_steps: 6,
  steps: [
    {
      id: 1,
      name: "Project Overview",
      status: "completed",
      completed_at: "2025-01-20",
      content: {
        title: "Season 2 of Forging Friendships",
        synopsis: "A heartwarming documentary series exploring the power of friendship across different cultures and backgrounds. Season 2 will focus on international friendships and cross-cultural connections.",
        genre: "Documentary",
        format: "6 x 60 minutes",
        target_audience: "General audience, 18-65",
        unique_selling_point: "Authentic stories of friendship that transcend cultural barriers"
      }
    },
    {
      id: 2,
      name: "Budget Planning",
      status: "completed",
      completed_at: "2025-01-22",
      content: {
        total_budget: "$750,000",
        requested_amount: "$500,000",
        co_financing: "$250,000",
        breakdown: {
          production: "$400,000",
          post_production: "$200,000",
          marketing: "$100,000",
          contingency: "$50,000"
        }
      }
    },
    {
      id: 3,
      name: "Creative Treatment",
      status: "in_progress",
      started_at: "2025-01-25",
      content: {
        vision: "To create a compelling narrative that showcases the universal language of friendship",
        approach: "Cinematic documentary style with intimate character-driven stories",
        visual_style: "Cinematic, intimate, observational",
        narrative_structure: "Character-driven stories interwoven with broader themes",
        target_outcomes: "Inspire viewers to build meaningful connections across cultures"
      }
    },
    {
      id: 4,
      name: "Team Bios",
      status: "pending",
      content: {
        director: "Jane Smith - 15 years documentary experience",
        producer: "John Doe - Award-winning producer",
        cinematographer: "Sarah Johnson - International experience",
        editor: "Mike Wilson - Emmy-nominated editor"
      }
    },
    {
      id: 5,
      name: "Market Analysis",
      status: "pending",
      content: {
        target_markets: ["Australia", "International streaming platforms"],
        audience_research: "Focus groups show strong interest in cross-cultural stories",
        distribution_strategy: "Multi-platform release strategy",
        competitive_analysis: "Unique positioning in friendship documentary genre"
      }
    },
    {
      id: 6,
      name: "Distribution Strategy",
      status: "pending",
      content: {
        primary_distribution: "ABC Australia, International broadcasters",
        streaming_platforms: ["Netflix", "Amazon Prime", "Disney+"],
        festival_strategy: "International documentary festivals",
        educational_market: "Universities and cultural institutions"
      }
    }
  ],
  key_requirements: [
    "Australian documentary content",
    "Season 2 continuation of successful series",
    "Strong audience engagement from Season 1",
    "Clear distribution strategy",
    "Experienced production team"
  ],
  impact_metrics: {
    audience_reach: "500,000+ viewers",
    social_media_engagement: "15,000+ followers",
    industry_recognition: "2 awards nominations",
    community_impact: "Positive feedback from 95% of viewers"
  }
};

export default function ScreenAustraliaGrantPage() {
  const [currentStep, setCurrentStep] = useState(grantData.current_step);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const handleStepChange = (stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= grantData.total_steps) {
      setCurrentStep(stepNumber);
    }
  };

  const handleFormSubmit = (stepId: number, data: any) => {
    setFormData(prev => ({ ...prev, [stepId]: data }));
    // In a real application, this would save to the backend
    console.log(`Saving step ${stepId}:`, data);
  };

  const renderStepContent = (step: any) => {
    switch (step.id) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                defaultValue={step.content.title}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="synopsis">Synopsis</Label>
              <Textarea
                id="synopsis"
                defaultValue={step.content.synopsis}
                rows={4}
                disabled={!isEditing}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="genre">Genre</Label>
                <Input id="genre" defaultValue={step.content.genre} disabled={!isEditing} />
              </div>
              <div>
                <Label htmlFor="format">Format</Label>
                <Input id="format" defaultValue={step.content.format} disabled={!isEditing} />
              </div>
            </div>
            <div>
              <Label htmlFor="target_audience">Target Audience</Label>
              <Input id="target_audience" defaultValue={step.content.target_audience} disabled={!isEditing} />
            </div>
            <div>
              <Label htmlFor="usp">Unique Selling Point</Label>
              <Textarea
                id="usp"
                defaultValue={step.content.unique_selling_point}
                rows={3}
                disabled={!isEditing}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="total_budget">Total Budget</Label>
                <Input id="total_budget" defaultValue={step.content.total_budget} disabled={!isEditing} />
              </div>
              <div>
                <Label htmlFor="requested_amount">Requested Amount</Label>
                <Input id="requested_amount" defaultValue={step.content.requested_amount} disabled={!isEditing} />
              </div>
              <div>
                <Label htmlFor="co_financing">Co-Financing</Label>
                <Input id="co_financing" defaultValue={step.content.co_financing} disabled={!isEditing} />
              </div>
            </div>
            <div>
              <Label>Budget Breakdown</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {Object.entries(step.content.breakdown).map(([category, amount]) => (
                  <div key={category} className="flex justify-between p-3 border rounded-lg">
                    <span className="capitalize">{category.replace('_', ' ')}</span>
                    <span className="font-semibold">{amount as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="vision">Creative Vision</Label>
              <Textarea
                id="vision"
                defaultValue={step.content.vision}
                rows={3}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="approach">Creative Approach</Label>
              <Textarea
                id="approach"
                defaultValue={step.content.approach}
                rows={3}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="visual_style">Visual Style</Label>
              <Input id="visual_style" defaultValue={step.content.visual_style} disabled={!isEditing} />
            </div>
            <div>
              <Label htmlFor="narrative_structure">Narrative Structure</Label>
              <Textarea
                id="narrative_structure"
                defaultValue={step.content.narrative_structure}
                rows={3}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="target_outcomes">Target Outcomes</Label>
              <Textarea
                id="target_outcomes"
                defaultValue={step.content.target_outcomes}
                rows={3}
                disabled={!isEditing}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            {Object.entries(step.content).map(([role, bio]) => (
              <div key={role}>
                <Label htmlFor={role} className="capitalize">{role}</Label>
                <Textarea
                  id={role}
                  defaultValue={bio as string}
                  rows={3}
                  disabled={!isEditing}
                />
              </div>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="target_markets">Target Markets</Label>
              <Textarea
                id="target_markets"
                defaultValue={step.content.target_markets.join(', ')}
                rows={2}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="audience_research">Audience Research</Label>
              <Textarea
                id="audience_research"
                defaultValue={step.content.audience_research}
                rows={3}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="distribution_strategy">Distribution Strategy</Label>
              <Textarea
                id="distribution_strategy"
                defaultValue={step.content.distribution_strategy}
                rows={3}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="competitive_analysis">Competitive Analysis</Label>
              <Textarea
                id="competitive_analysis"
                defaultValue={step.content.competitive_analysis}
                rows={3}
                disabled={!isEditing}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="primary_distribution">Primary Distribution</Label>
              <Textarea
                id="primary_distribution"
                defaultValue={step.content.primary_distribution}
                rows={2}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="streaming_platforms">Streaming Platforms</Label>
              <Textarea
                id="streaming_platforms"
                defaultValue={step.content.streaming_platforms.join(', ')}
                rows={2}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="festival_strategy">Festival Strategy</Label>
              <Textarea
                id="festival_strategy"
                defaultValue={step.content.festival_strategy}
                rows={2}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="educational_market">Educational Market</Label>
              <Textarea
                id="educational_market"
                defaultValue={step.content.educational_market}
                rows={2}
                disabled={!isEditing}
              />
            </div>
          </div>
        );

      default:
        return <div>Step content not found</div>;
    }
  };

  const currentStepData = grantData.steps.find(step => step.id === currentStep);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Screen Australia Grant Application</h1>
            <p className="text-gray-600">Season 2 of Forging Friendships - Documentary Production Funding</p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="text-red-700 border-red-300">
              Due: {grantData.due_date}
            </Badge>
            <p className="text-sm text-gray-500 mt-1">{grantData.amount} available</p>
          </div>
        </div>
      </header>

      {/* Progress Overview */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Application Progress</h3>
              <p className="text-sm text-gray-600">
                Step {currentStep} of {grantData.total_steps}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{grantData.progress}%</p>
              <p className="text-sm text-gray-500">Complete</p>
            </div>
          </div>
          <Progress value={grantData.progress} className="w-full" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Step Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Application Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {grantData.steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepChange(step.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      currentStep === step.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : step.status === 'completed'
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : step.status === 'in_progress'
                        ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {step.status === 'completed' ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        ) : step.status === 'in_progress' ? (
                          <ClockIcon className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                        )}
                        <span className="font-medium">{step.name}</span>
                      </div>
                      {step.status === 'completed' && (
                        <span className="text-xs text-green-600">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <DocumentTextIcon className="h-5 w-5" />
                  <span>{currentStepData?.name}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <>
                        <CheckIcon className="h-4 w-4 mr-1" />
                        Save
                      </>
                    ) : (
                      <>
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {currentStepData && renderStepContent(currentStepData)}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleStepChange(currentStep - 1)}
                  disabled={currentStep <= 1}
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  onClick={() => handleStepChange(currentStep + 1)}
                  disabled={currentStep >= grantData.total_steps}
                >
                  Next
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 