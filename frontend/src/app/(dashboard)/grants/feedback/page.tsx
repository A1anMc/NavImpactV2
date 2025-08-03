'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  LightBulbIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  FireIcon,
  ClockIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { grantsApi } from '@/services/grants';
import { Grant } from '@/types/models';

interface GrantFeedback {
  id: number;
  grantTitle: string;
  submissionDate: string;
  outcome: 'Won' | 'Lost' | 'Pending' | 'Withdrawn';
  amount: string;
  feedback: string;
  aiDebrief: {
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
  };
  category: string;
  organisation: string;
  teamMembers: string[];
  timeToDecision: string;
  successFactors: string[];
}

export default function GrantFeedbackPage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [feedbackEntries, setFeedbackEntries] = useState<GrantFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  // Fetch grants and create feedback entries
  useEffect(() => {
    const fetchGrantsAndCreateFeedback = async () => {
      try {
        setLoading(true);
        const response = await grantsApi.getGrants({ limit: 100 });
        const grantsData = response.items || [];
        setGrants(grantsData);

        // Create mock feedback entries based on grants
        const feedback: GrantFeedback[] = grantsData.slice(0, 10).map((grant, index) => {
          const outcomes: ('Won' | 'Lost' | 'Pending' | 'Withdrawn')[] = ['Won', 'Lost', 'Pending'];
          const outcome = outcomes[index % outcomes.length];
          const submissionDate = new Date();
          submissionDate.setDate(submissionDate.getDate() - (index + 1) * 30);

          return {
            id: index + 1,
            grantTitle: grant.title,
            submissionDate: submissionDate.toISOString().split('T')[0],
            outcome,
            amount: grant.max_amount ? `$${grant.max_amount.toLocaleString()}` : 'Amount not specified',
            feedback: outcome === 'Won' 
              ? 'Strong application with clear objectives and well-justified budget.'
              : outcome === 'Lost'
              ? 'Good concept but needs improvement in specific areas.'
              : 'Application is under review.',
            aiDebrief: {
              strengths: ['Clear objectives', 'Strong team', 'Good budget'],
              weaknesses: ['Could improve distribution plan', 'Needs more innovation'],
              improvements: ['Enhance distribution strategy', 'Add innovative elements'],
            },
            category: grant.industry_focus || 'General',
            organisation: grant.source,
            teamMembers: ['Alan McCarthy', 'Harry Dog'],
            timeToDecision: `${30 + Math.floor(Math.random() * 30)} days`,
            successFactors: ['Clear objectives', 'Strong team', 'Good budget']
          };
        });

        setFeedbackEntries(feedback);
        setError(null);
      } catch (err) {
        console.error('Error fetching grants:', err);
        setError('Failed to load feedback data. Please try again.');
        setFeedbackEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGrantsAndCreateFeedback();
  }, []);

  const filteredFeedback = feedbackEntries.filter(entry => {
    if (filter === 'all') return true;
    if (filter === 'won') return entry.outcome === 'Won';
    if (filter === 'lost') return entry.outcome === 'Lost';
    if (filter === 'pending') return entry.outcome === 'Pending';
    return true;
  });

  const successRate = feedbackEntries.length > 0 
    ? (feedbackEntries.filter(entry => entry.outcome === 'Won').length / feedbackEntries.length * 100).toFixed(1)
    : '0';

  const averageDecisionTime = feedbackEntries.length > 0
    ? Math.round(feedbackEntries.reduce((sum, entry) => {
        const days = parseInt(entry.timeToDecision.split(' ')[0]);
        return sum + days;
      }, 0) / feedbackEntries.length)
    : 0;

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'Won': return 'bg-green-100 text-green-800';
      case 'Lost': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'Won': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'Lost': return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'Pending': return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'Withdrawn': return <TrashIcon className="h-5 w-5 text-gray-500" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading feedback data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto" />
            <p className="mt-4 text-red-600">{error}</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Grant Feedback & Analytics</h1>
            <p className="text-gray-600 mt-2">
              Track application outcomes and learn from AI-powered insights
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <SparklesIcon className="h-4 w-4 mr-2" />
              AI Insights
            </Button>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{successRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ClipboardDocumentListIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{feedbackEntries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg Decision Time</p>
                <p className="text-2xl font-bold text-gray-900">{averageDecisionTime} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Funding Won</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${feedbackEntries
                    .filter(entry => entry.outcome === 'Won')
                    .reduce((sum, entry) => {
                      const amount = parseInt(entry.amount.replace(/[^0-9]/g, ''));
                      return sum + (isNaN(amount) ? 0 : amount);
                    }, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All ({feedbackEntries.length})
          </Button>
          <Button
            variant={filter === 'won' ? 'primary' : 'outline'}
            onClick={() => setFilter('won')}
          >
            Won ({feedbackEntries.filter(entry => entry.outcome === 'Won').length})
          </Button>
          <Button
            variant={filter === 'lost' ? 'primary' : 'outline'}
            onClick={() => setFilter('lost')}
          >
            Lost ({feedbackEntries.filter(entry => entry.outcome === 'Lost').length})
          </Button>
          <Button
            variant={filter === 'pending' ? 'primary' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            Pending ({feedbackEntries.filter(entry => entry.outcome === 'Pending').length})
          </Button>
        </div>
      </div>

      {/* Feedback Entries */}
      <div className="space-y-6">
        {filteredFeedback.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No feedback entries</h3>
              <p className="mt-2 text-gray-600">
                Feedback entries will appear here as you submit grant applications.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredFeedback.map((entry) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getOutcomeIcon(entry.outcome)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{entry.grantTitle}</h3>
                        <Badge className={getOutcomeColor(entry.outcome)}>
                          {entry.outcome}
                        </Badge>
                        <Badge variant="outline">{entry.category}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{entry.feedback}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {formatDate(entry.submissionDate)}
                        </div>
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          {entry.amount}
                        </div>
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-1" />
                          {entry.teamMembers.join(', ')}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {entry.timeToDecision}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>

                {/* AI Debrief */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <SparklesIcon className="h-4 w-4 text-yellow-500 mr-2" />
                    <h4 className="font-medium text-gray-900">AI Debrief</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-green-700 mb-2">Strengths</h5>
                      <ul className="space-y-1">
                        {entry.aiDebrief.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-green-600 flex items-start">
                            <CheckCircleIcon className="h-4 w-4 mr-1 mt-0.5" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-red-700 mb-2">Areas for Improvement</h5>
                      <ul className="space-y-1">
                        {entry.aiDebrief.weaknesses.map((weakness, index) => (
                          <li key={index} className="text-sm text-red-600 flex items-start">
                            <XCircleIcon className="h-4 w-4 mr-1 mt-0.5" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-blue-700 mb-2">Recommendations</h5>
                      <ul className="space-y-1">
                        {entry.aiDebrief.improvements.map((improvement, index) => (
                          <li key={index} className="text-sm text-blue-600 flex items-start">
                            <LightBulbIcon className="h-4 w-4 mr-1 mt-0.5" />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 