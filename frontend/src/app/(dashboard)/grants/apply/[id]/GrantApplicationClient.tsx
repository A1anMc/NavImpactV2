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
  console.log('🎯 [GrantApplicationClient] Component mounted with grantId:', grantId);
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">🎉 AI Grant Assistant Test</h1>
        <p className="text-gray-600 mb-4">React component is working!</p>
        <p className="text-sm text-gray-500 mb-6">Grant ID: {grantId}</p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-green-800 mb-2">✅ Success!</h2>
          <p className="text-green-700">The component is rendering correctly.</p>
        </div>

        <div className="space-y-4">
          <Button onClick={() => window.location.href = '/grants/'}>
            Back to Grants
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Test Again
          </Button>
        </div>
      </div>
    </div>
  );
} 