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
  StarIcon,
  FireIcon,
  GlobeAltIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const projectTypes = [
  { id: 'documentary', name: 'Documentary', icon: '🎬', description: 'Non-fiction storytelling' },
  { id: 'feature-film', name: 'Feature Film', icon: '🎭', description: 'Narrative feature films' },
  { id: 'television', name: 'Television', icon: '📺', description: 'TV series and content' },
  { id: 'short-film', name: 'Short Film', icon: '🎥', description: 'Short format content' },
  { id: 'animation', name: 'Animation', icon: '🎨', description: 'Animated content' },
  { id: 'web-series', name: 'Web Series', icon: '💻', description: 'Digital content' },
];

const impactAreas = [
  { id: 'social-impact', name: 'Social Impact', icon: '🌍', description: 'Community and social change' },
  { id: 'cultural-diversity', name: 'Cultural Diversity', icon: '🌈', description: 'Multicultural representation' },
  { id: 'environmental', name: 'Environmental', icon: '🌱', description: 'Environmental awareness' },
  { id: 'education', name: 'Education', icon: '📚', description: 'Educational content' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎪', description: 'Pure entertainment' },
  { id: 'innovation', name: 'Innovation', icon: '🚀', description: 'Innovative storytelling' },
];

const teamExperience = [
  { id: 'beginner', name: 'Beginner', description: 'New to the industry', years: '0-2 years' },
  { id: 'intermediate', name: 'Intermediate', description: 'Some experience', years: '3-5 years' },
  { id: 'experienced', name: 'Experienced', description: 'Well established', years: '5-10 years' },
  { id: 'expert', name: 'Expert', description: 'Industry veteran', years: '10+ years' },
];

const budgetRanges = [
  { id: 'small', name: 'Small Budget', range: '$1K - $25K', description: 'Independent projects' },
  { id: 'medium', name: 'Medium Budget', range: '$25K - $100K', description: 'Mid-range productions' },
  { id: 'large', name: 'Large Budget', range: '$100K - $500K', description: 'Major productions' },
  { id: 'enterprise', name: 'Enterprise', range: '$500K+', description: 'Blockbuster projects' },
];

const matchedGrants = [
  {
    id: 1,
    title: 'Screen Australia Documentary Development',
    organisation: 'Screen Australia',
    amount: '$50,000',
    matchScore: 95,
    deadline: '2024-02-15',
    category: 'Documentary',
    description: 'Perfect match for your documentary project with social impact focus.',
    requirements: ['Australian content', 'Social impact', 'Innovative storytelling'],
    aiInsights: {
      strengths: ['Strong social impact angle', 'Experienced team', 'Clear budget'],
      improvements: ['Add more distribution details', 'Strengthen audience engagement'],
      successRate: '85%'
    }
  },
  {
    id: 2,
    title: 'ABC Pitch Initiative',
    organisation: 'ABC',
    amount: '$25,000',
    matchScore: 88,
    deadline: '2024-01-30',
    category: 'Television',
    description: 'Excellent fit for your television project with diverse representation.',
    requirements: ['Diverse casting', 'Australian stories', 'Innovative format'],
    aiInsights: {
      strengths: ['Diverse representation', 'Innovative format', 'Clear objectives'],
      improvements: ['Add more innovative elements', 'Strengthen multicultural focus'],
      successRate: '75%'
    }
  },
  {
    id: 3,
    title: 'Netflix Documentary Fund',
    organisation: 'Netflix',
    amount: '$100,000',
    matchScore: 82,
    deadline: '2024-03-01',
    category: 'Documentary',
    description: 'Good match for global documentary with human interest angle.',
    requirements: ['Global appeal', 'Human interest', 'High production value'],
    aiInsights: {
      strengths: ['Global appeal', 'Human interest', 'High production quality'],
      improvements: ['Strengthen global distribution', 'Add more international perspectives'],
      successRate: '65%'
    }
  },
  {
    id: 4,
    title: 'SBS Content Fund',
    organisation: 'SBS',
    amount: '$35,000',
    matchScore: 78,
    deadline: '2024-02-28',
    category: 'Television',
    description: 'Good fit for multicultural content with community focus.',
    requirements: ['Multicultural focus', 'Australian content', 'Diverse voices'],
    aiInsights: {
      strengths: ['Multicultural focus', 'Community engagement', 'Diverse voices'],
      improvements: ['Strengthen community partnerships', 'Add impact measurement'],
      successRate: '70%'
    }
  }
];

export default function GrantMatchPage() {
  const [selectedProjectType, setSelectedProjectType] = useState('');
  const [selectedImpactArea, setSelectedImpactArea] = useState('');
  const [selectedTeamExperience, setSelectedTeamExperience] = useState('');
  const [selectedBudgetRange, setSelectedBudgetRange] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedGrant, setSelectedGrant] = useState(null);

  const handleAnalyze = () => {
    if (!selectedProjectType || !selectedImpactArea || !selectedTeamExperience || !selectedBudgetRange) {
      return;
    }
    
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 3000);
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMatchScoreText = (score) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Very Good Match';
    if (score >= 70) return 'Good Match';
    return 'Fair Match';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative max-w-4xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <SparklesIcon className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                    AI Grant Matching
                  </h1>
                  <p className="text-xl text-purple-100 leading-relaxed">
                    Tell us about your project and let AI find the perfect funding opportunities for you.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold">95% accuracy rate</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-300 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold">Real-time matching</span>
                </div>
              </div>
            </div>
          </div>

          {!showResults ? (
            /* Project Form */
            <div className="space-y-8">
              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                    <SparklesIcon className="h-8 w-8 text-purple-600" />
                    <span>Project Profile</span>
                  </CardTitle>
                  <p className="text-gray-600 text-lg">Help us understand your project to find the best matches</p>
                </CardHeader>
                <CardContent className="space-y-8">
                  
                  {/* Project Type */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">What type of project are you working on?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {projectTypes.map((type) => (
                        <div
                          key={type.id}
                          onClick={() => setSelectedProjectType(type.id)}
                          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                            selectedProjectType === type.id
                              ? 'border-purple-500 bg-purple-50 shadow-lg'
                              : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                          }`}
                        >
                          <div className="text-3xl mb-3">{type.icon}</div>
                          <h4 className="font-semibold text-gray-900 mb-1">{type.name}</h4>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Impact Area */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">What's your primary impact focus?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {impactAreas.map((area) => (
                        <div
                          key={area.id}
                          onClick={() => setSelectedImpactArea(area.id)}
                          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                            selectedImpactArea === area.id
                              ? 'border-purple-500 bg-purple-50 shadow-lg'
                              : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                          }`}
                        >
                          <div className="text-3xl mb-3">{area.icon}</div>
                          <h4 className="font-semibold text-gray-900 mb-1">{area.name}</h4>
                          <p className="text-sm text-gray-600">{area.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team Experience */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">What's your team's experience level?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {teamExperience.map((experience) => (
                        <div
                          key={experience.id}
                          onClick={() => setSelectedTeamExperience(experience.id)}
                          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                            selectedTeamExperience === experience.id
                              ? 'border-purple-500 bg-purple-50 shadow-lg'
                              : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">{experience.name}</h4>
                              <p className="text-sm text-gray-600 mb-2">{experience.description}</p>
                              <p className="text-xs text-purple-600 font-medium">{experience.years}</p>
                            </div>
                            <UserGroupIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">What's your funding requirement?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {budgetRanges.map((budget) => (
                        <div
                          key={budget.id}
                          onClick={() => setSelectedBudgetRange(budget.id)}
                          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                            selectedBudgetRange === budget.id
                              ? 'border-purple-500 bg-purple-50 shadow-lg'
                              : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">{budget.name}</h4>
                              <p className="text-lg font-bold text-green-600 mb-1">{budget.range}</p>
                              <p className="text-sm text-gray-600">{budget.description}</p>
                            </div>
                            <CurrencyDollarIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Analyze Button */}
                  <div className="flex justify-center pt-8">
                    <Button
                      onClick={handleAnalyze}
                      disabled={!selectedProjectType || !selectedImpactArea || !selectedTeamExperience || !selectedBudgetRange || isAnalyzing}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-xl font-semibold rounded-2xl shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="h-6 w-6 mr-3" />
                          Find My Matches
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Results */
            <div className="space-y-8">
              {/* Analysis Summary */}
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-lg">
                        <SparklesIcon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Analysis Complete</h3>
                        <p className="text-gray-600 text-lg">Found {matchedGrants.length} perfect matches for your project</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setShowResults(false)}
                      variant="outline"
                      className="px-6 py-3 text-lg rounded-xl"
                    >
                      Start Over
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Matched Grants */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {matchedGrants.map((grant) => (
                  <Card key={grant.id} className="bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                              {grant.category}
                            </Badge>
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${getMatchScoreColor(grant.matchScore)}`}></div>
                              <span className="text-sm font-medium text-gray-600">
                                {getMatchScoreText(grant.matchScore)}
                              </span>
                            </div>
                          </div>
                          <CardTitle className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                            {grant.title}
                          </CardTitle>
                          <p className="text-gray-600 font-medium">{grant.organisation}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-green-600">{grant.amount}</p>
                          <div className="flex items-center space-x-1 justify-end">
                            <StarIcon className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-600">{grant.matchScore}% match</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-6 leading-relaxed">{grant.description}</p>
                      
                      {/* AI Insights */}
                      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                        <div className="flex items-center space-x-3 mb-4">
                          <LightBulbIcon className="h-5 w-5 text-purple-600" />
                          <span className="font-semibold text-gray-900">AI Insights</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-semibold text-green-700 mb-2 flex items-center">
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Strengths
                            </h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {grant.aiInsights.strengths.map((strength, index) => (
                                <li key={index} className="flex items-start space-x-1">
                                  <span className="text-green-500 mt-1">•</span>
                                  <span>{strength}</span>
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
                              {grant.aiInsights.improvements.map((improvement, index) => (
                                <li key={index} className="flex items-start space-x-1">
                                  <span className="text-blue-500 mt-1">•</span>
                                  <span>{improvement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-600">Deadline: {grant.deadline}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <ChartBarIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-600">{grant.aiInsights.successRate} success rate</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button variant="outline" size="sm" className="rounded-lg">
                            <EyeIcon className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg">
                            <ArrowRightIcon className="h-4 w-4 mr-2" />
                            Apply
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