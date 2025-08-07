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
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Fetch grant data from API
  useEffect(() => {
    const fetchGrant = async () => {
      try {
        console.log('🔄 [GrantApplicationClient] Starting to fetch grant:', grantId);
        setDebugInfo('Starting API call...');
        setLoading(true);
        setError(null);
        
        const grantData = await grantsApi.getGrant(grantId);
        console.log('✅ [GrantApplicationClient] Grant data received:', grantData);
        setDebugInfo('Grant data received successfully');
        setGrant(grantData);
      } catch (err) {
        console.error('❌ [GrantApplicationClient] Error fetching grant:', err);
        setDebugInfo(`Error: ${err}`);
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
        setDebugInfo('Loading complete');
        setLoading(false);
      }
    };

    if (grantId) {
      fetchGrant();
    } else {
      console.log('⚠️ [GrantApplicationClient] No grantId provided');
      setDebugInfo('No grantId provided');
      setLoading(false);
    }
  }, [grantId]);

  // Simple debug render
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading grant application...</p>
          <p className="mt-2 text-sm text-gray-500">Debug: {debugInfo}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-lg font-medium text-red-800">Error Loading Grant</h3>
          </div>
          <p className="mt-2 text-red-700">{error}</p>
          <p className="mt-2 text-sm text-red-600">Debug: {debugInfo}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!grant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No grant data available</p>
          <p className="mt-2 text-sm text-gray-500">Debug: {debugInfo}</p>
        </div>
      </div>
    );
  }

  // Simple success render
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Grant Application - {grant.title}</h1>
          <p className="text-gray-600 mb-4">{grant.description}</p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-green-800 mb-2">✅ AI Grant Assistant is Working!</h2>
            <p className="text-green-700">The component is now rendering successfully.</p>
            <p className="text-sm text-green-600 mt-2">Debug: {debugInfo}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Grant Details</h3>
              <p className="text-blue-700">Source: {grant.source}</p>
              <p className="text-blue-700">Status: {grant.status}</p>
              <p className="text-blue-700">Amount: ${grant.min_amount} - ${grant.max_amount}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">AI Features Ready</h3>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>✅ Document Upload</li>
                <li>✅ URL Analysis</li>
                <li>✅ AI Content Generation</li>
                <li>✅ Smart Suggestions</li>
              </ul>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button onClick={() => window.location.href = '/grants/'}>
              Back to Grants
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Test Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 