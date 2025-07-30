'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  ChartBarIcon,
  CheckCircleIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

// OKR 4.1: Social Media Following Tracking
const okr4_1 = {
  objective: "Increase Following on Social Media by 400% over 4 months",
  baseline: {
    date: "2024-12-27", // 30 days ago
    platforms: {
      instagram: 1250,
      youtube: 3400,
      linkedin: 890,
      twitter: 650,
      facebook: 2100
    },
    total_followers: 8290
  },
  target: {
    date: "2025-04-27", // 4 months from baseline
    total_followers: 33160, // 400% increase
    monthly_growth_target: 6217 // (33160 - 8290) / 4
  },
  current_progress: {
    date: "2025-01-27", // Current date
    platforms: {
      instagram: 1800, // +44% from baseline
      youtube: 4200,   // +23.5% from baseline
      linkedin: 1200,  // +34.8% from baseline
      twitter: 850,    // +30.8% from baseline
      facebook: 2800   // +33.3% from baseline
    },
    total_followers: 10850, // +30.9% from baseline
    monthly_growth: 2560    // Current monthly growth
  },
  progress_percentage: 30.9, // (10850 - 8290) / (33160 - 8290) * 100
  on_track: true,
  months_remaining: 3
};

// Screen Australia Grant Test Data
const screenAustraliaGrant = {
  id: "sa-doc-2025-001",
  title: "Documentary Production Funding - Screen Australia",
  project: "Season 2 of Forging Friendships",
  due_date: "2025-09-29",
  amount: "$500,000",
  status: "in_progress",
  progress: 35,
  steps: [
    { id: 1, name: "Project Overview", status: "completed", completed_at: "2025-01-20" },
    { id: 2, name: "Budget Planning", status: "completed", completed_at: "2025-01-22" },
    { id: 3, name: "Creative Treatment", status: "in_progress", started_at: "2025-01-25" },
    { id: 4, name: "Team Bios", status: "pending" },
    { id: 5, name: "Market Analysis", status: "pending" },
    { id: 6, name: "Distribution Strategy", status: "pending" }
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

export default function ImpactPage() {
  const [activeTab, setActiveTab] = useState('okr-tracking');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const calculateGrowth = (current: number, baseline: number) => {
    return ((current - baseline) / baseline * 100).toFixed(1);
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const renderOKRTracking = () => (
    <div className="space-y-6">
      {/* OKR Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                OKR 4.1: Social Media Following
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Target: 400% increase over 4 months (Baseline: {okr4_1.baseline.total_followers.toLocaleString()} followers)
              </p>
            </div>
            <div className="text-right">
              <Badge variant={okr4_1.on_track ? "success" : "danger"}>
                {okr4_1.on_track ? "On Track" : "Behind Schedule"}
              </Badge>
              <p className="text-sm text-gray-500 mt-1">
                {okr4_1.months_remaining} months remaining
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {okr4_1.current_progress.total_followers.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Current Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                +{okr4_1.current_progress.total_followers - okr4_1.baseline.total_followers}
              </p>
              <p className="text-sm text-gray-600">Growth</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {okr4_1.progress_percentage.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Target Progress</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress to Target</span>
              <span>{okr4_1.progress_percentage.toFixed(1)}%</span>
            </div>
            <Progress value={okr4_1.progress_percentage} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Platform Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GlobeAltIcon className="h-5 w-5" />
            <span>Platform Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(okr4_1.current_progress.platforms).map(([platform, current]) => {
              const baseline = okr4_1.baseline.platforms[platform as keyof typeof okr4_1.baseline.platforms];
              const growth = calculateGrowth(current, baseline);
              const growthNumber = parseFloat(growth);
              
              return (
                <div key={platform} className="text-center p-4 border rounded-lg">
                  <div className="flex justify-center mb-2">
                    {platform === 'instagram' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-pink-500"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0-3 3V6a3 3 0 1 0 3-3h12a3 3 0 1 0-3 3"/></svg>}
                    {platform === 'youtube' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-red-500"><path d="M21 10V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/></svg>}
                    {platform === 'linkedin' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-600"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6"/></svg>}
                    {platform === 'twitter' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-400"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C7 10.3 23 3.6 22 4"/><path d="M14 10h-3v5h3v-5z"/><path d="M14 15h-3v5h3v-5z"/></svg>}
                    {platform === 'facebook' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-700"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>}
                  </div>
                  <p className="font-semibold text-lg">{current.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 capitalize">{platform}</p>
                  <p className={`text-sm font-medium ${getGrowthColor(growthNumber)}`}>
                    {growthNumber >= 0 ? '+' : ''}{growth}%
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Growth Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-600"><path d="M13 10V3L4 14.5 13 3v7"/><path d="M21 10H10"/><path d="M21 14H10"/><path d="M21 18H10"/></svg>
            <span>Monthly Growth Tracking</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Current Monthly Growth</span>
              <span className="text-lg font-bold text-green-600">
                +{okr4_1.current_progress.monthly_growth.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Target Monthly Growth</span>
              <span className="text-lg font-bold text-blue-600">
                +{okr4_1.target.monthly_growth_target.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Performance vs Target</span>
              <span className={`text-lg font-bold ${okr4_1.current_progress.monthly_growth >= okr4_1.target.monthly_growth_target ? 'text-green-600' : 'text-red-600'}`}>
                {okr4_1.current_progress.monthly_growth >= okr4_1.target.monthly_growth_target ? 'Ahead' : 'Behind'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderGrantTest = () => (
    <div className="space-y-6">
      {/* Grant Test Header */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Screen Australia Grant Test
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Season 2 of Forging Friendships - Documentary Production Funding
              </p>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-green-700 border-green-300">
                Due: {screenAustraliaGrant.due_date}
              </Badge>
              <p className="text-sm text-gray-500 mt-1">
                {screenAustraliaGrant.amount} available
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {screenAustraliaGrant.progress}%
              </p>
              <p className="text-sm text-gray-600">Application Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {screenAustraliaGrant.steps.filter(s => s.status === 'completed').length}/{screenAustraliaGrant.steps.length}
              </p>
              <p className="text-sm text-gray-600">Steps Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {screenAustraliaGrant.steps.filter(s => s.status === 'in_progress').length}
              </p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Application Progress</span>
              <span>{screenAustraliaGrant.progress}%</span>
            </div>
            <Progress value={screenAustraliaGrant.progress} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Application Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600"><path d="M20 12a8 8 0 0 0-8-8 8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8"/><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/></svg>
            <span>Application Steps</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {screenAustraliaGrant.steps.map((step) => (
              <div key={step.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-green-100 text-green-600' :
                    step.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircleIcon className="h-5 w-5" />
                    ) : step.status === 'in_progress' ? (
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
                    ) : (
                      <div className="w-3 h-3 bg-gray-400 rounded-full" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{step.name}</p>
                    {step.completed_at && (
                      <p className="text-sm text-gray-500">Completed: {step.completed_at}</p>
                    )}
                    {step.started_at && (
                      <p className="text-sm text-blue-600">Started: {step.started_at}</p>
                    )}
                  </div>
                </div>
                <Badge variant={
                  step.status === 'completed' ? 'success' :
                  step.status === 'in_progress' ? 'default' :
                  'outline'
                }>
                  {step.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ChartBarIcon className="h-5 w-5" />
            <span>Expected Impact Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(screenAustraliaGrant.impact_metrics).map(([metric, value]) => (
              <div key={metric} className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-gray-600 capitalize">
                  {metric.replace('_', ' ')}
                </p>
                <p className="text-lg font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircleIcon className="h-5 w-5" />
            <span>Key Requirements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {screenAustraliaGrant.key_requirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span className="text-gray-700">{requirement}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Impact Dashboard</h1>
        <p className="text-gray-600">Track OKRs and grant application progress</p>
      </header>

      <div className="mb-6 flex space-x-4 border-b border-gray-200">
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === 'okr-tracking'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('okr-tracking')}
        >
          OKR 4.1 Tracking
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === 'grant-test'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('grant-test')}
        >
          Screen Australia Grant Test
        </button>
      </div>

      <main className="flex-1">
        {activeTab === 'okr-tracking' ? renderOKRTracking() : renderGrantTest()}
      </main>
    </div>
  );
} 