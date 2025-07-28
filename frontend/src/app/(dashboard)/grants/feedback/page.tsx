'use client';

import React, { useState } from 'react';
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
} from '@heroicons/react/24/outline';

const pastApplications = [
  {
    id: 1,
    grantTitle: 'Screen Australia Documentary Development',
    submissionDate: '2023-11-01',
    outcome: 'Won',
    amount: '$50,000',
    feedback: 'Strong narrative, clear impact statement. Budget was well-justified.',
    aiDebrief: {
      strengths: ['Compelling story', 'Strong team experience', 'Clear budget'],
      weaknesses: ['Limited distribution plan'],
      improvements: ['Expand distribution strategy', 'Highlight audience engagement'],
    },
    category: 'Documentary',
    organisation: 'Screen Australia',
    teamMembers: ['Alan McCarthy', 'Harry Dog'],
    timeToDecision: '45 days',
    successFactors: ['Strong narrative', 'Clear budget', 'Experienced team']
  },
  {
    id: 2,
    grantTitle: 'ABC Pitch Initiative',
    submissionDate: '2023-10-15',
    outcome: 'Lost',
    amount: '$25,000',
    feedback: 'Good concept but lacked innovation. Consider more diverse representation.',
    aiDebrief: {
      strengths: ['Good concept', 'Clear objectives'],
      weaknesses: ['Lacked innovation', 'Limited diversity'],
      improvements: ['Add innovative elements', 'Include diverse perspectives'],
    },
    category: 'Television',
    organisation: 'ABC',
    teamMembers: ['Alan McCarthy'],
    timeToDecision: '30 days',
    successFactors: ['Innovation', 'Diversity', 'Clear objectives']
  },
  {
    id: 3,
    grantTitle: 'Netflix Documentary Fund',
    submissionDate: '2023-09-20',
    outcome: 'Won',
    amount: '$100,000',
    feedback: 'Excellent global appeal and production quality. Strong human interest angle.',
    aiDebrief: {
      strengths: ['Global appeal', 'High production quality', 'Human interest'],
      weaknesses: ['Could strengthen distribution plan'],
      improvements: ['Enhance distribution strategy', 'Add more global perspectives'],
    },
    category: 'Documentary',
    organisation: 'Netflix',
    teamMembers: ['Alan McCarthy', 'Clooney Cat'],
    timeToDecision: '60 days',
    successFactors: ['Global appeal', 'Production quality', 'Human interest']
  },
  {
    id: 4,
    grantTitle: 'SBS Content Fund',
    submissionDate: '2023-08-10',
    outcome: 'Lost',
    amount: '$35,000',
    feedback: 'Good multicultural focus but needs stronger community engagement.',
    aiDebrief: {
      strengths: ['Multicultural focus', 'Good concept'],
      weaknesses: ['Weak community engagement', 'Limited impact measurement'],
      improvements: ['Strengthen community partnerships', 'Add impact measurement'],
    },
    category: 'Television',
    organisation: 'SBS',
    teamMembers: ['Alan McCarthy', 'Clooney Cat'],
    timeToDecision: '25 days',
    successFactors: ['Community engagement', 'Impact measurement', 'Multicultural focus']
  },
  {
    id: 5,
    grantTitle: 'Film Victoria Production Investment',
    submissionDate: '2023-07-05',
    outcome: 'Won',
    amount: '$200,000',
    feedback: 'Strong commercial potential and Victorian production focus. Excellent budget breakdown.',
    aiDebrief: {
      strengths: ['Commercial potential', 'Victorian focus', 'Clear budget'],
      weaknesses: ['Could strengthen marketing strategy'],
      improvements: ['Enhance marketing plan', 'Add more commercial elements'],
    },
    category: 'Feature Film',
    organisation: 'Film Victoria',
    teamMembers: ['Alan McCarthy', 'Harry Dog', 'Clooney Cat'],
    timeToDecision: '75 days',
    successFactors: ['Commercial potential', 'Local focus', 'Clear budget']
  }
];

const outcomes = [
  { name: 'All Outcomes', value: 'all' },
  { name: 'Won', value: 'Won' },
  { name: 'Lost', value: 'Lost' },
  { name: 'Pending', value: 'Pending' },
];

const categories = [
  { name: 'All Categories', value: 'all' },
  { name: 'Documentary', value: 'Documentary' },
  { name: 'Television', value: 'Television' },
  { name: 'Feature Film', value: 'Feature Film' },
];

export default function GrantFeedbackPage() {
  const [selectedOutcome, setSelectedOutcome] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);

  const filteredApplications = pastApplications.filter(app => {
    const matchesOutcome = selectedOutcome === 'all' || app.outcome === selectedOutcome;
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    const matchesSearch = app.grantTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.organisation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesOutcome && matchesCategory && matchesSearch;
  });

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'Won': return 'bg-green-100 text-green-800 border-green-200';
      case 'Lost': return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOutcomeIcon = (outcome) => {
    switch (outcome) {
      case 'Won': return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'Lost': return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'Pending': return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const successRate = (pastApplications.filter(app => app.outcome === 'Won').length / pastApplications.length * 100).toFixed(1);
  const totalAmount = pastApplications.filter(app => app.outcome === 'Won').reduce((sum, app) => sum + parseInt(app.amount.replace(/[^0-9]/g, '')), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative max-w-4xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <ChatBubbleLeftRightIcon className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                    Grant Feedback & Insights
                  </h1>
                  <p className="text-xl text-purple-100 leading-relaxed">
                    Learn from past applications and improve your success rate with AI-powered insights.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold">{successRate}% success rate</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-300 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold">${totalAmount.toLocaleString()} total won</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Success Rate</p>
                    <p className="text-3xl font-bold text-green-600">{successRate}%</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Won</p>
                    <p className="text-3xl font-bold text-blue-600">${totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Applications</p>
                    <p className="text-3xl font-bold text-gray-900">{pastApplications.length}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <ClipboardDocumentListIcon className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Avg Decision Time</p>
                    <p className="text-3xl font-bold text-gray-900">47 days</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <ClockIcon className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="relative">
                  <ChatBubbleLeftRightIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search applications by title, organisation, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={selectedOutcome}
                  onChange={(e) => setSelectedOutcome(e.target.value)}
                  className="px-6 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg bg-white"
                >
                  {outcomes.map((outcome) => (
                    <option key={outcome.value} value={outcome.value}>
                      {outcome.name}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-6 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg bg-white"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Applications Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredApplications.map((app) => (
              <Card key={app.id} className="bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Badge className={`${getOutcomeColor(app.outcome)} border`}>
                          {app.outcome}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-medium">
                          {app.category}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {getOutcomeIcon(app.outcome)}
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                        {app.grantTitle}
                      </CardTitle>
                      <p className="text-gray-600 font-medium">{app.organisation}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-green-600">{app.amount}</p>
                      <p className="text-sm text-gray-500 font-medium">{app.timeToDecision}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 leading-relaxed">{app.feedback}</p>
                  
                  {/* AI Insights */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <SparklesIcon className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-gray-900">AI Insights</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="text-sm font-semibold text-green-700 mb-2 flex items-center">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Strengths
                        </h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {app.aiDebrief.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start space-x-1">
                              <span className="text-green-500 mt-1">•</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-semibold text-red-700 mb-2 flex items-center">
                          <XCircleIcon className="h-4 w-4 mr-1" />
                          Weaknesses
                        </h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {app.aiDebrief.weaknesses.map((weakness, index) => (
                            <li key={index} className="flex items-start space-x-1">
                              <span className="text-red-500 mt-1">•</span>
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-semibold text-blue-700 mb-2 flex items-center">
                          <LightBulbIcon className="h-4 w-4 mr-1" />
                          Improvements
                        </h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {app.aiDebrief.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-start space-x-1">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Team and Details */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <UserGroupIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">{app.teamMembers.join(', ')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">{app.submissionDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button variant="outline" size="sm" className="rounded-lg">
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-lg">
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
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