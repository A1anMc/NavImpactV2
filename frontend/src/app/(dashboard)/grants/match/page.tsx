'use client';

import React, { useState, useEffect } from 'react';
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
import { grantsApi } from '@/services/grants';
import { Grant, GrantRecommendation } from '@/types/models';
import Link from 'next/link';

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

export default function GrantMatchPage() {
  const [profile, setProfile] = useState({
    projectType: '',
    impactAreas: [],
    teamExperience: '',
    budgetRange: '',
    timeline: '',
    location: '',
    description: ''
  });
  const [recommendations, setRecommendations] = useState<GrantRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!profile.projectType || !profile.teamExperience || !profile.budgetRange) {
      setError('Please complete your project profile before analysis.');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      // Convert profile to AI recommendation request
      const request = {
        user_id: 1, // Mock user ID
        project_tags: [
          profile.projectType,
          ...profile.impactAreas,
          profile.teamExperience,
          profile.budgetRange
        ],
        industry_focus: profile.projectType,
        location: profile.location,
        org_type: 'media',
        budget_range: {
          min: profile.budgetRange === 'small' ? 1000 : 
               profile.budgetRange === 'medium' ? 25000 :
               profile.budgetRange === 'large' ? 100000 : 500000,
          max: profile.budgetRange === 'small' ? 25000 :
               profile.budgetRange === 'medium' ? 100000 :
               profile.budgetRange === 'large' ? 500000 : 1000000
        },
        timeline: profile.timeline,
        max_results: 10
      };

      const result = await grantsApi.getAIRecommendations(request);
      setRecommendations(result.recommendations);
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError('Failed to get AI recommendations. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchScoreText = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Great Match';
    if (score >= 70) return 'Good Match';
    return 'Fair Match';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Grant Matching</h1>
            <p className="text-gray-600 mt-2">
              Build your project profile and get AI-powered grant recommendations
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Save Profile
            </Button>
            <Button>
              <SparklesIcon className="h-4 w-4 mr-2" />
              Quick Match
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Profile Builder */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Project Profile Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Project Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {projectTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setProfile({ ...profile, projectType: type.id })}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        profile.projectType === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="font-medium text-sm">{type.name}</div>
                      <div className="text-xs text-gray-600">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Impact Areas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Impact Areas (Select multiple)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {impactAreas.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => {
                        const newAreas = profile.impactAreas.includes(area.id)
                          ? profile.impactAreas.filter(id => id !== area.id)
                          : [...profile.impactAreas, area.id];
                        setProfile({ ...profile, impactAreas: newAreas });
                      }}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        profile.impactAreas.includes(area.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{area.icon}</div>
                      <div className="font-medium text-sm">{area.name}</div>
                      <div className="text-xs text-gray-600">{area.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Team Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Team Experience *
                </label>
                <div className="space-y-2">
                  {teamExperience.map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => setProfile({ ...profile, teamExperience: exp.id })}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${
                        profile.teamExperience === exp.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{exp.name}</div>
                          <div className="text-sm text-gray-600">{exp.description}</div>
                        </div>
                        <div className="text-sm text-gray-500">{exp.years}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Budget Range *
                </label>
                <div className="space-y-2">
                  {budgetRanges.map((budget) => (
                    <button
                      key={budget.id}
                      onClick={() => setProfile({ ...profile, budgetRange: budget.id })}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${
                        profile.budgetRange === budget.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{budget.name}</div>
                          <div className="text-sm text-gray-600">{budget.description}</div>
                        </div>
                        <div className="text-sm font-medium text-green-600">{budget.range}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline
                </label>
                <select
                  value={profile.timeline}
                  onChange={(e) => setProfile({ ...profile, timeline: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select timeline</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6-12 months">6-12 months</option>
                  <option value="12+ months">12+ months</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sydney, NSW"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  placeholder="Describe your project concept, goals, and unique aspects..."
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Button
                onClick={handleAnalyze}
                disabled={analyzing || !profile.projectType || !profile.teamExperience || !profile.budgetRange}
                className="w-full"
              >
                {analyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-4 w-4 mr-2" />
                    Get AI Recommendations
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2" />
                AI Recommendations
                {recommendations.length > 0 && (
                  <Badge className="ml-2">{recommendations.length} matches</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.length === 0 ? (
                <div className="text-center py-12">
                  <SparklesIcon className="h-12 w-12 text-gray-400 mx-auto" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No recommendations yet</h3>
                  <p className="mt-2 text-gray-600">
                    Complete your project profile and click "Get AI Recommendations" to find matching grants.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((recommendation) => (
                    <Card key={recommendation.grant.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{recommendation.grant.title}</h3>
                            <p className="text-sm text-gray-600">{recommendation.grant.source}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getMatchScoreColor(recommendation.match_score)}`}>
                              {recommendation.match_score}%
                            </div>
                            <div className="text-xs text-gray-500">{getMatchScoreText(recommendation.match_score)}</div>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-3">{recommendation.grant.description}</p>

                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center text-sm">
                            <CurrencyDollarIcon className="h-4 w-4 text-green-500 mr-2" />
                            <span>
                              {recommendation.grant.min_amount && recommendation.grant.max_amount 
                                ? `${formatCurrency(recommendation.grant.min_amount)} - ${formatCurrency(recommendation.grant.max_amount)}`
                                : 'Amount not specified'
                              }
                            </span>
                          </div>
                          {recommendation.grant.deadline && (
                            <div className="flex items-center text-sm">
                              <CalendarIcon className="h-4 w-4 text-red-500 mr-2" />
                              <span>{formatDate(recommendation.grant.deadline?.toString())}</span>
                            </div>
                          )}
                        </div>

                        {recommendation.reasons.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Why this matches:</h4>
                            <ul className="space-y-1">
                              {recommendation.reasons.slice(0, 3).map((reason, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-start">
                                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{recommendation.priority}</Badge>
                            {recommendation.success_probability && (
                              <Badge variant="outline">
                                {Math.round(recommendation.success_probability * 100)}% success
                              </Badge>
                            )}
                          </div>
                          <Link href={`/grants/apply/${recommendation.grant.id}`}>
                            <Button size="sm">
                              <ArrowRightIcon className="h-4 w-4 mr-1" />
                              Apply Now
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 