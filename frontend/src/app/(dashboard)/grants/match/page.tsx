'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CurrencyDollarIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon,
  EyeIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const projectTypes = [
  { id: 'documentary', name: 'Documentary', icon: '🎬' },
  { id: 'feature-film', name: 'Feature Film', icon: '🎭' },
  { id: 'television', name: 'Television Series', icon: '📺' },
  { id: 'short-film', name: 'Short Film', icon: '🎥' },
  { id: 'web-series', name: 'Web Series', icon: '💻' },
  { id: 'podcast', name: 'Podcast', icon: '🎧' },
];

const impactAreas = [
  { id: 'environmental', name: 'Environmental Conservation', icon: '🌱' },
  { id: 'social-justice', name: 'Social Justice', icon: '⚖️' },
  { id: 'indigenous', name: 'Indigenous Stories', icon: '🏛️' },
  { id: 'diversity', name: 'Diversity & Inclusion', icon: '🌈' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'health', name: 'Health & Wellness', icon: '🏥' },
];

const teamExperience = [
  { id: 'beginner', name: 'Beginner (0-2 years)', icon: '🌱' },
  { id: 'intermediate', name: 'Intermediate (3-5 years)', icon: '🌿' },
  { id: 'experienced', name: 'Experienced (5+ years)', icon: '🌳' },
  { id: 'expert', name: 'Expert (10+ years)', icon: '🏆' },
];

const matchedGrants = [
  {
    id: 1,
    title: 'Screen Australia Documentary Development',
    amount: '$50,000',
    matchScore: 95,
    deadline: '2024-02-15',
    category: 'Documentary',
    organisation: 'Screen Australia',
    description: 'Perfect match for your environmental documentary project.',
    whyMatch: [
      'Strong environmental focus',
      'Australian content requirement',
      'Social impact emphasis',
      'Development funding available'
    ],
    requirements: ['Australian content', 'Social impact', 'Innovative storytelling'],
    priority: 'high',
  },
  {
    id: 2,
    title: 'ABC Pitch Initiative',
    amount: '$25,000',
    matchScore: 88,
    deadline: '2024-01-30',
    category: 'Television',
    organisation: 'ABC',
    description: 'Excellent opportunity for diverse storytelling.',
    whyMatch: [
      'Diversity focus aligns with your project',
      'Innovative format support',
      'Australian stories emphasis',
      'Strong team requirements'
    ],
    requirements: ['Diverse casting', 'Australian stories', 'Innovative format'],
    priority: 'high',
  },
  {
    id: 3,
    title: 'Documentary Australia Foundation',
    amount: '$75,000',
    matchScore: 82,
    deadline: '2024-03-30',
    category: 'Documentary',
    organisation: 'Documentary Australia',
    description: 'Great fit for social impact documentary.',
    whyMatch: [
      'Social impact focus',
      'Philanthropic angle',
      'Australian stories',
      'Community engagement'
    ],
    requirements: ['Social impact', 'Philanthropic angle', 'Australian stories'],
    priority: 'medium',
  },
  {
    id: 4,
    title: 'SBS Content Fund',
    amount: '$35,000',
    matchScore: 78,
    deadline: '2024-02-28',
    category: 'Television',
    organisation: 'SBS',
    description: 'Good match for multicultural content.',
    whyMatch: [
      'Multicultural focus',
      'Diverse voices',
      'Australian content',
      'Community stories'
    ],
    requirements: ['Multicultural focus', 'Australian content', 'Diverse voices'],
    priority: 'medium',
  },
];

export default function GrantMatchingPage() {
  const [selectedProjectType, setSelectedProjectType] = useState('');
  const [selectedImpactArea, setSelectedImpactArea] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 3000);
  };

  const canAnalyze = selectedProjectType && selectedImpactArea && selectedExperience && budgetRange;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-white/10 rounded-xl">
                  <SparklesIcon className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">AI Grant Matching</h1>
                  <p className="text-purple-100 text-lg">
                    Let AI analyze your project and find the perfect grant opportunities.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-purple-100">AI-powered matching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                  <span className="text-purple-100">Personalized recommendations</span>
                </div>
              </div>
            </div>
          </div>

          {!showResults ? (
            /* Project Analysis Form */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Project Details */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {projectTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedProjectType(type.id)}
                          className={`p-4 border-2 rounded-lg text-center transition-all ${
                            selectedProjectType === type.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="font-medium text-gray-900">{type.name}</div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Impact Focus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {impactAreas.map((area) => (
                        <button
                          key={area.id}
                          onClick={() => setSelectedImpactArea(area.id)}
                          className={`p-4 border-2 rounded-lg text-center transition-all ${
                            selectedImpactArea === area.id
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">{area.icon}</div>
                          <div className="font-medium text-gray-900">{area.name}</div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Team Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {teamExperience.map((level) => (
                        <button
                          key={level.id}
                          onClick={() => setSelectedExperience(level.id)}
                          className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                            selectedExperience === level.id
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-xl">{level.icon}</div>
                            <div className="font-medium text-gray-900">{level.name}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Budget Range</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { id: 'under-25k', name: 'Under $25,000', icon: '💰' },
                        { id: '25k-50k', name: '$25,000 - $50,000', icon: '💵' },
                        { id: '50k-100k', name: '$50,000 - $100,000', icon: '🏦' },
                        { id: 'over-100k', name: 'Over $100,000', icon: '💎' },
                      ].map((range) => (
                        <button
                          key={range.id}
                          onClick={() => setBudgetRange(range.id)}
                          className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                            budgetRange === range.id
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-xl">{range.icon}</div>
                            <div className="font-medium text-gray-900">{range.name}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Analysis Panel */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <SparklesIcon className="h-5 w-5" />
                      <span>AI Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <SparklesIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Ready to Analyze
                        </h3>
                        <p className="text-sm text-gray-600">
                          Our AI will analyze your project and find the best grant matches based on your criteria.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Project Type</span>
                          <Badge className={selectedProjectType ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}>
                            {selectedProjectType ? projectTypes.find(t => t.id === selectedProjectType)?.name : 'Not selected'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Impact Area</span>
                          <Badge className={selectedImpactArea ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                            {selectedImpactArea ? impactAreas.find(a => a.id === selectedImpactArea)?.name : 'Not selected'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Experience Level</span>
                          <Badge className={selectedExperience ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'}>
                            {selectedExperience ? teamExperience.find(e => e.id === selectedExperience)?.name : 'Not selected'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Budget Range</span>
                          <Badge className={budgetRange ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}>
                            {budgetRange ? budgetRange.replace('-', ' - ').replace('k', 'K') : 'Not selected'}
                          </Badge>
                        </div>
                      </div>

                      <Button
                        onClick={handleAnalyze}
                        disabled={!canAnalyze || isAnalyzing}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        {isAnalyzing ? (
                          <>
                            <PauseIcon className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <SparklesIcon className="h-4 w-4 mr-2" />
                            Analyze & Find Matches
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            /* Results */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">AI Matched Grants</h2>
                <Button
                  onClick={() => setShowResults(false)}
                  variant="outline"
                >
                  Start Over
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {matchedGrants.map((grant) => (
                  <Card key={grant.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                            {grant.title}
                          </CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="font-medium">{grant.organisation}</span>
                            <span>•</span>
                            <span>{grant.category}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{grant.amount}</div>
                          <Badge className={`mt-2 ${
                            grant.priority === 'high' ? 'bg-red-100 text-red-800' :
                            grant.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {grant.priority} Priority
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">Match Score</span>
                          <span className="text-lg font-bold text-blue-600">{grant.matchScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${grant.matchScore}%` }}
                          ></div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{grant.description}</p>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Why This Matches:</p>
                        <ul className="space-y-1">
                          {grant.whyMatch.map((reason, index) => (
                            <li key={index} className="text-sm text-green-600 flex items-center">
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Deadline: {grant.deadline}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm">
                            <DocumentTextIcon className="h-4 w-4 mr-1" />
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 