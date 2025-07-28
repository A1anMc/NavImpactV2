'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  LightBulbIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CalendarIcon,
  SparklesIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

// Feedback data
const feedbackData = [
  {
    id: 1,
    grantId: 2,
    title: 'ABC Pitch Initiative',
    organisation: 'ABC',
    outcome: 'won',
    submissionDate: '2024-01-20',
    decisionDate: '2024-01-25',
    amount: '$25,000',
    feedback: 'Excellent proposal with strong diverse representation. The innovative format and Australian stories focus were particularly compelling. Team experience was well demonstrated.',
    reviewerNotes: 'Strong social impact narrative. Clear audience strategy. Budget well justified.',
    improvements: [
      'Include more specific audience demographics',
      'Add more detailed distribution strategy',
      'Strengthen the innovative format description'
    ],
    aiAnalysis: {
      strengths: [
        'Strong diverse representation focus',
        'Clear Australian stories emphasis',
        'Well-justified budget'
      ],
      weaknesses: [
        'Could include more specific audience data',
        'Distribution strategy needs more detail'
      ],
      nextTime: [
        'Include audience demographics in detail',
        'Expand distribution strategy section',
        'Add more innovative format examples'
      ]
    },
    teamMembers: ['Alan McCarthy', 'Harry Dog'],
    category: 'Television'
  },
  {
    id: 2,
    grantId: 3,
    title: 'Netflix Documentary Fund',
    organisation: 'Netflix',
    outcome: 'lost',
    submissionDate: '2024-01-15',
    decisionDate: '2024-01-30',
    amount: '$100,000',
    feedback: 'Proposal was strong but lacked global appeal. The human interest angle was good, but production value needs to be higher for Netflix standards.',
    reviewerNotes: 'Good story but not global enough. Production value below standard.',
    improvements: [
      'Strengthen global appeal narrative',
      'Increase production value focus',
      'Add more international distribution details'
    ],
    aiAnalysis: {
      strengths: [
        'Strong human interest story',
        'Good local impact focus'
      ],
      weaknesses: [
        'Lacks global appeal',
        'Production value below standard',
        'Missing international distribution'
      ],
      nextTime: [
        'Emphasize global audience appeal',
        'Include higher production value details',
        'Add international distribution strategy'
      ]
    },
    teamMembers: ['Alan McCarthy'],
    category: 'Documentary'
  },
  {
    id: 3,
    grantId: 4,
    title: 'SBS Content Fund',
    organisation: 'SBS',
    outcome: 'invited_to_revise',
    submissionDate: '2024-01-10',
    decisionDate: '2024-01-28',
    amount: '$35,000',
    feedback: 'Good multicultural focus but needs more diverse voices. The Australian content is strong, but we need more representation in the creative team.',
    reviewerNotes: 'Strong multicultural angle. Need more diverse team representation.',
    improvements: [
      'Add more diverse team members',
      'Strengthen multicultural elements',
      'Include more diverse voices in narrative'
    ],
    aiAnalysis: {
      strengths: [
        'Strong multicultural focus',
        'Good Australian content emphasis'
      ],
      weaknesses: [
        'Lacks diverse team representation',
        'Could include more diverse voices'
      ],
      nextTime: [
        'Include more diverse team members',
        'Strengthen multicultural narrative elements',
        'Add diverse voice representation'
      ]
    },
    teamMembers: ['Alan McCarthy', 'Clooney Cat'],
    category: 'Television'
  }
];

const outcomes = [
  { value: 'won', label: 'Won', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  { value: 'lost', label: 'Lost', color: 'bg-red-100 text-red-800', icon: XMarkIcon },
  { value: 'invited_to_revise', label: 'Invited to Revise', color: 'bg-yellow-100 text-yellow-800', icon: ExclamationTriangleIcon },
  { value: 'no_response', label: 'No Response', color: 'bg-gray-100 text-gray-800', icon: ClockIcon },
];

export default function GrantFeedbackPage() {
  const [selectedOutcome, setSelectedOutcome] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showAddFeedback, setShowAddFeedback] = useState(false);

  const filteredFeedback = feedbackData.filter(feedback => {
    return selectedOutcome === 'all' || feedback.outcome === selectedOutcome;
  });

  const getOutcomeIcon = (outcome) => {
    const outcomeData = outcomes.find(o => o.value === outcome);
    const IconComponent = outcomeData?.icon || ClockIcon;
    return <IconComponent className="h-5 w-5" />;
  };

  const getOutcomeColor = (outcome) => {
    const outcomeData = outcomes.find(o => o.value === outcome);
    return outcomeData?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Grant Feedback & Debrief</h1>
              <p className="text-gray-600">Track outcomes, learn from feedback, and improve future applications</p>
            </div>
            <Button onClick={() => setShowAddFeedback(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Feedback
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{feedbackData.length}</p>
                  </div>
                  <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round((feedbackData.filter(f => f.outcome === 'won').length / feedbackData.length) * 100)}%
                    </p>
                  </div>
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Funding Won</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${feedbackData.filter(f => f.outcome === 'won').reduce((sum, f) => sum + parseInt(f.amount.replace(/[^0-9]/g, '')), 0).toLocaleString()}
                    </p>
                  </div>
                  <SparklesIcon className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">AI Insights</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {feedbackData.reduce((sum, f) => sum + f.aiAnalysis.strengths.length + f.aiAnalysis.weaknesses.length, 0)}
                    </p>
                  </div>
                  <LightBulbIcon className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter by outcome:</span>
            <div className="flex space-x-2">
              <Button
                variant={selectedOutcome === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedOutcome('all')}
              >
                All
              </Button>
              {outcomes.map(outcome => (
                <Button
                  key={outcome.value}
                  variant={selectedOutcome === outcome.value ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedOutcome(outcome.value)}
                  className={selectedOutcome === outcome.value ? outcome.color : ''}
                >
                  {outcome.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Feedback List */}
          <div className="space-y-6">
            {filteredFeedback.map(feedback => (
              <Card key={feedback.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          {getOutcomeIcon(feedback.outcome)}
                          <Badge className={getOutcomeColor(feedback.outcome)}>
                            {outcomes.find(o => o.value === feedback.outcome)?.label}
                          </Badge>
                        </div>
                        <Badge variant="outline">{feedback.category}</Badge>
                        <span className="text-sm text-gray-500">{feedback.organisation}</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feedback.title}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Submitted: {feedback.submissionDate}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Decision: {feedback.decisionDate}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <SparklesIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Amount: {feedback.amount}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Feedback */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Reviewer Feedback</h4>
                          <p className="text-gray-600 text-sm mb-3">{feedback.feedback}</p>
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-gray-700">Key Improvements:</h5>
                            <ul className="space-y-1">
                              {feedback.improvements.map((improvement, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  <span>{improvement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* AI Analysis */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">AI Analysis</h4>
                          <div className="space-y-3">
                            <div>
                              <h5 className="text-sm font-medium text-green-700">Strengths:</h5>
                              <ul className="space-y-1 mt-1">
                                {feedback.aiAnalysis.strengths.map((strength, index) => (
                                  <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                                    <CheckCircleIcon className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-red-700">Areas for Improvement:</h5>
                              <ul className="space-y-1 mt-1">
                                {feedback.aiAnalysis.weaknesses.map((weakness, index) => (
                                  <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                                    <ExclamationTriangleIcon className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                                    <span>{weakness}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <UserGroupIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Team: {feedback.teamMembers.join(', ')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <PencilIcon className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 