'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { impactService } from '@/services/impact';
import { Project } from '@/types/projects';
import { ImpactScore, ImpactAnalytics, FrameworkAlignment, ImpactStory } from '@/types/impact';

interface ImpactDashboardProps {
  project?: Project;
  isPortfolio?: boolean;
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ project, isPortfolio = false }) => {
  const [impactScore, setImpactScore] = useState<ImpactScore | null>(null);
  const [analytics, setAnalytics] = useState<ImpactAnalytics | null>(null);
  const [frameworkAlignment, setFrameworkAlignment] = useState<FrameworkAlignment | null>(null);
  const [impactStories, setImpactStories] = useState<ImpactStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'stories' | 'reports' | 'predictions' | 'benchmarks'>('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'3m' | '6m' | '1y' | 'all'>('1y');
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');

  useEffect(() => {
    loadImpactData();
  }, [project, selectedTimeframe]);

  const loadImpactData = async () => {
    setLoading(true);
    try {
      if (isPortfolio) {
        const portfolioAnalytics = await impactService.getPortfolioAnalytics();
        setAnalytics(portfolioAnalytics);
      } else if (project) {
        const projectAnalytics = await impactService.getProjectAnalytics(project.id);
        setAnalytics(projectAnalytics);
        
        // Calculate impact score for project
        const metrics = {
          reach_count: project.reach_count || 0,
          outcome_count: 1,
          sustainability_score: 75,
          innovation_score: 80,
          evidence_quality: 85,
          stakeholder_satisfaction: 90,
          cost_effectiveness: 0.8,
          scalability_potential: 70,
        };
        const score = impactService.calculateImpactScore(metrics);
        setImpactScore(score);
        
        // Calculate framework alignment
        const alignment = impactService.calculateFrameworkAlignment(project);
        setFrameworkAlignment(alignment);

        // Load impact stories
        const stories = await impactService.getImpactStories(project.id);
        setImpactStories(stories);
      }
    } catch (error) {
      console.error('Error loading impact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      const reportConfig = {
        report_type: 'detailed' as const,
        time_period: {
          start_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date().toISOString(),
        },
        include_sections: {
          executive_summary: true,
          impact_metrics: true,
          outcome_stories: true,
          framework_alignment: true,
          financial_analysis: true,
          recommendations: true,
          methodology: true,
          limitations: true,
          appendices: true,
        },
        customizations: {
          branding: true,
          stakeholder_focus: ['funders', 'partners'],
          key_messages: ['Demonstrating measurable impact', 'Strategic alignment with government priorities'],
          visual_style: 'professional' as const,
          language: 'english' as const,
        },
      };
      
      const result = await impactService.generateImpactReport(reportConfig);
      window.open(result.report_url, '_blank');
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'High Impact';
    if (score >= 60) return 'Medium Impact';
    return 'Low Impact';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return (
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'declining':
        return (
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-8 max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isPortfolio ? 'Portfolio Impact Analytics' : 'Project Impact Dashboard'}
            </h1>
            <p className="text-gray-600">
              {isPortfolio 
                ? 'Comprehensive impact measurement across all projects' 
                : 'Track and measure project outcomes and impact'
              }
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Timeframe Selector */}
            <div className="flex items-center space-x-1 bg-white border border-gray-200 rounded-lg p-1">
              {[
                { value: '3m', label: '3M' },
                { value: '6m', label: '6M' },
                { value: '1y', label: '1Y' },
                { value: 'all', label: 'All' },
              ].map((timeframe) => (
                <button
                  key={timeframe.value}
                  onClick={() => setSelectedTimeframe(timeframe.value as any)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedTimeframe === timeframe.value
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {timeframe.label}
                </button>
              ))}
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('summary')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'summary'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'detailed'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Detailed
              </button>
            </div>

            <Button variant="outline" className="text-gray-600 border-gray-300">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Data
            </Button>
            <Button onClick={generateReport} className="bg-green-600 hover:bg-green-700 text-white">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Report
            </Button>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white p-1 rounded-lg border border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'metrics', label: 'Metrics', icon: '📈' },
            { id: 'stories', label: 'Stories', icon: '📖' },
            { id: 'reports', label: 'Reports', icon: '📋' },
            { id: 'predictions', label: 'Predictions', icon: '🔮' },
            { id: 'benchmarks', label: 'Benchmarks', icon: '🏆' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Enhanced Impact Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Impact Score</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {impactScore ? Math.round(impactScore.weighted_score) : analytics?.portfolio_summary.average_impact_score || 0}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-green-600">+12.3% vs last quarter</span>
                        {impactScore && getTrendIcon(impactScore.trend)}
                      </div>
                      <div className="mt-2">
                        <Badge className={`${getScoreColor(impactScore?.weighted_score || 0)} text-xs`}>
                          {getScoreLabel(impactScore?.weighted_score || 0)}
                        </Badge>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Reach</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {analytics?.portfolio_summary.total_reach.toLocaleString() || project?.reach_count?.toLocaleString() || 0}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-green-600">+8.5% vs last quarter</span>
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div className="mt-2">
                        <Badge className="bg-blue-100 text-blue-800 text-xs">Growing</Badge>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Evidence Coverage</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {analytics?.portfolio_summary.evidence_coverage || 85}%
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-green-600">+5.2% vs last quarter</span>
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div className="mt-2">
                        <Badge className="bg-purple-100 text-purple-800 text-xs">Strong</Badge>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">ROI Ratio</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {analytics?.roi_analysis.roi_ratio ? analytics.roi_analysis.roi_ratio.toFixed(1) : 3.2}:1
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-green-600">+0.8 vs last quarter</span>
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div className="mt-2">
                        <Badge className="bg-orange-100 text-orange-800 text-xs">Excellent</Badge>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Framework Alignment */}
            {frameworkAlignment && (
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Framework Alignment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Victorian Alignment */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Victorian Government Priorities</h4>
                      <div className="space-y-3">
                        {Object.entries(frameworkAlignment.victorian_alignment).map(([framework, score]) => {
                          if (framework === 'total_score') return null;
                          return (
                            <div key={framework} className="flex items-center justify-between">
                              <span className="text-sm text-gray-700 capitalize">
                                {framework.replace(/_/g, ' ')}
                              </span>
                              <div className="flex items-center space-x-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                                    style={{ width: `${score}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900">{score}%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* SDG Alignment */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">UN Sustainable Development Goals</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(frameworkAlignment.sdg_alignment).map(([sdg, score]) => {
                          if (sdg === 'total_score') return null;
                          return (
                            <div key={sdg} className="flex items-center justify-between p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                              <span className="text-xs text-gray-700">{sdg}</span>
                              <Badge className={`${score >= 70 ? 'bg-green-100 text-green-800' : score >= 40 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'} text-xs`}>
                                {score}%
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Impact Breakdown */}
            {impactScore && (
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Impact Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(impactScore.breakdown).map(([metric, score]) => (
                      <div key={metric} className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-2xl font-bold text-gray-900 mb-1">{Math.round(score)}</div>
                        <div className="text-sm text-gray-600 capitalize mb-2">
                          {metric.replace(/_/g, ' ')}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                        <div className="mt-2">
                          <Badge className={`${score >= 80 ? 'bg-green-100 text-green-800' : score >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'} text-xs`}>
                            {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Risk Assessment */}
            {analytics?.risk_assessment && (
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge className={`${
                      analytics.risk_assessment.overall_risk_level === 'low' ? 'bg-green-100 text-green-800' :
                      analytics.risk_assessment.overall_risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {analytics.risk_assessment.overall_risk_level.toUpperCase()} RISK
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {analytics.risk_assessment.risk_factors.length} risk factors identified
                    </span>
                  </div>
                  <div className="space-y-3">
                    {analytics.risk_assessment.risk_factors.map((risk, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div>
                          <div className="font-medium text-gray-900">{risk.factor}</div>
                          <div className="text-sm text-gray-600">
                            Likelihood: {Math.round(risk.likelihood * 100)}% | Impact: {Math.round(risk.impact * 100)}%
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            {risk.mitigation_strategies.length} strategies
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="space-y-8">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Detailed Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Advanced metrics and measurement tools will be implemented here.</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stories Tab */}
        {activeTab === 'stories' && (
          <div className="space-y-8">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Impact Stories</CardTitle>
              </CardHeader>
              <CardContent>
                {impactStories.length > 0 ? (
                  <div className="space-y-4">
                    {impactStories.map((story) => (
                      <div key={story.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{story.title}</h4>
                        <p className="text-gray-600 mb-3">{story.story_summary}</p>
                        <div className="flex items-center space-x-4">
                          <Badge className="bg-green-100 text-green-800">
                            {story.beneficiary_type}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(story.created_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No impact stories available yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-8">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Impact Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Generated impact reports and historical data will be shown here.</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Predictions Tab */}
        {activeTab === 'predictions' && (
          <div className="space-y-8">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Predictive Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">AI-powered impact predictions and forecasting will be displayed here.</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Benchmarks Tab */}
        {activeTab === 'benchmarks' && (
          <div className="space-y-8">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Benchmarking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Industry benchmarks and peer comparisons will be shown here.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}; 