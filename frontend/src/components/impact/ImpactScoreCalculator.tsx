'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { impactService } from '@/services/impact';
import { ImpactMetrics, ImpactScore } from '@/types/impact';

interface ImpactScoreCalculatorProps {
  onScoreCalculated?: (score: ImpactScore) => void;
  initialMetrics?: Partial<ImpactMetrics>;
}

export const ImpactScoreCalculator: React.FC<ImpactScoreCalculatorProps> = ({
  onScoreCalculated,
  initialMetrics
}) => {
  const [metrics, setMetrics] = useState<ImpactMetrics>({
    reach_count: initialMetrics?.reach_count || 0,
    outcome_count: initialMetrics?.outcome_count || 0,
    sustainability_score: initialMetrics?.sustainability_score || 50,
    innovation_score: initialMetrics?.innovation_score || 50,
    evidence_quality: initialMetrics?.evidence_quality || 50,
    stakeholder_satisfaction: initialMetrics?.stakeholder_satisfaction || 50,
    cost_effectiveness: initialMetrics?.cost_effectiveness || 0.5,
    scalability_potential: initialMetrics?.scalability_potential || 50,
    social_return_on_investment: initialMetrics?.social_return_on_investment || 2.5,
    environmental_impact: initialMetrics?.environmental_impact || 50,
    gender_equality_score: initialMetrics?.gender_equality_score || 50,
    digital_inclusion_score: initialMetrics?.digital_inclusion_score || 50,
    community_engagement_level: initialMetrics?.community_engagement_level || 50,
    policy_influence_score: initialMetrics?.policy_influence_score || 50,
    knowledge_transfer_score: initialMetrics?.knowledge_transfer_score || 50,
    capacity_building_score: initialMetrics?.capacity_building_score || 50,
  });

  const [calculatedScore, setCalculatedScore] = useState<ImpactScore | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [activeScenario, setActiveScenario] = useState<'current' | 'optimistic' | 'pessimistic'>('current');
  const [scenarios, setScenarios] = useState<Record<string, ImpactScore>>({});
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);
  const [realTimeScore, setRealTimeScore] = useState<number | null>(null);

  // Real-time score calculation
  useEffect(() => {
    const timer = setTimeout(() => {
      const score = impactService.calculateImpactScore(metrics);
      setRealTimeScore(score.weighted_score);
    }, 500);

    return () => clearTimeout(timer);
  }, [metrics]);

  const handleMetricChange = (key: keyof ImpactMetrics, value: number) => {
    setMetrics(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const calculateScore = () => {
    const score = impactService.calculateImpactScore(metrics);
    setCalculatedScore(score);
    setShowResults(true);
    onScoreCalculated?.(score);
    
    // Calculate scenarios
    calculateScenarios();
  };

  const calculateScenarios = () => {
    const optimisticMetrics = { ...metrics };
    const pessimisticMetrics = { ...metrics };
    
    // Optimistic scenario: increase all scores by 20%
    Object.keys(optimisticMetrics).forEach(key => {
      const metricKey = key as keyof ImpactMetrics;
      const currentValue = optimisticMetrics[metricKey];
      if (typeof currentValue === 'number') {
        if (key === 'cost_effectiveness') {
          optimisticMetrics[metricKey] = Math.min(currentValue * 1.2, 1);
        } else {
          optimisticMetrics[metricKey] = Math.min(currentValue * 1.2, 100);
        }
      }
    });

    // Pessimistic scenario: decrease all scores by 20%
    Object.keys(pessimisticMetrics).forEach(key => {
      const metricKey = key as keyof ImpactMetrics;
      const currentValue = pessimisticMetrics[metricKey];
      if (typeof currentValue === 'number') {
        if (key === 'cost_effectiveness') {
          pessimisticMetrics[metricKey] = Math.max(currentValue * 0.8, 0);
        } else {
          pessimisticMetrics[metricKey] = Math.max(currentValue * 0.8, 0);
        }
      }
    });

    const optimisticScore = impactService.calculateImpactScore(optimisticMetrics);
    const pessimisticScore = impactService.calculateImpactScore(pessimisticMetrics);

    setScenarios({
      optimistic: optimisticScore,
      pessimistic: pessimisticScore,
    });
  };

  const resetCalculator = () => {
    setMetrics({
      reach_count: 0,
      outcome_count: 0,
      sustainability_score: 50,
      innovation_score: 50,
      evidence_quality: 50,
      stakeholder_satisfaction: 50,
      cost_effectiveness: 0.5,
      scalability_potential: 50,
      social_return_on_investment: 2.5,
      environmental_impact: 50,
      gender_equality_score: 50,
      digital_inclusion_score: 50,
      community_engagement_level: 50,
      policy_influence_score: 50,
      knowledge_transfer_score: 50,
      capacity_building_score: 50,
    });
    setCalculatedScore(null);
    setShowResults(false);
    setScenarios({});
    setRealTimeScore(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'High Impact';
    if (score >= 60) return 'Medium Impact';
    return 'Low Impact';
  };

  const getMetricDescription = (metric: string): string => {
    const descriptions: Record<string, string> = {
      reach_count: 'Number of people or communities directly reached by the project',
      outcome_count: 'Number of measurable outcomes achieved',
      sustainability_score: 'Long-term viability and self-sufficiency of the project',
      innovation_score: 'Novelty and creativity in approach and methodology',
      evidence_quality: 'Robustness and reliability of impact evidence',
      stakeholder_satisfaction: 'Satisfaction levels of key stakeholders',
      cost_effectiveness: 'Efficiency of resource utilization (0-1 scale)',
      scalability_potential: 'Potential for expansion and replication',
      social_return_on_investment: 'Social value created per dollar invested',
      environmental_impact: 'Positive environmental outcomes and sustainability',
      gender_equality_score: 'Promotion of gender equality and inclusion',
      digital_inclusion_score: 'Digital accessibility and technology adoption',
      community_engagement_level: 'Level of community participation and ownership',
      policy_influence_score: 'Influence on policy development and implementation',
      knowledge_transfer_score: 'Knowledge sharing and capacity development',
      capacity_building_score: 'Strengthening of organizational and individual capabilities',
    };
    return descriptions[metric] || 'Impact metric measurement';
  };

  const getMetricIcon = (metric: string) => {
    const icons: Record<string, string> = {
      reach_count: '👥',
      outcome_count: '🎯',
      sustainability_score: '🌱',
      innovation_score: '💡',
      evidence_quality: '📊',
      stakeholder_satisfaction: '🤝',
      cost_effectiveness: '💰',
      scalability_potential: '📈',
      social_return_on_investment: '💎',
      environmental_impact: '🌍',
      gender_equality_score: '⚖️',
      digital_inclusion_score: '💻',
      community_engagement_level: '🏘️',
      policy_influence_score: '📋',
      knowledge_transfer_score: '📚',
      capacity_building_score: '🏗️',
    };
    return icons[metric] || '📊';
  };

  return (
    <div className="space-y-6">
      {/* Real-time Score Preview */}
      {realTimeScore !== null && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Live Score Preview</p>
                <p className={`text-2xl font-bold ${getScoreColor(realTimeScore)}`}>
                  {Math.round(realTimeScore)}
                </p>
                <p className="text-sm text-gray-600">{getScoreLabel(realTimeScore)}</p>
              </div>
              <div className="text-right">
                <Badge className="bg-green-100 text-green-800">Live</Badge>
                <p className="text-xs text-gray-500 mt-1">Updates as you adjust</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Form */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Impact Metrics Input</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
              className="text-gray-600 border-gray-300"
            >
              {showAdvancedMetrics ? 'Hide' : 'Show'} Advanced Metrics
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Metrics */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Core Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Reach Count */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <span>{getMetricIcon('reach_count')}</span>
                  <span>People/Communities Reached</span>
                </label>
                <input
                  type="number"
                  value={metrics.reach_count}
                  onChange={(e) => handleMetricChange('reach_count', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter number of people reached"
                />
                <p className="text-xs text-gray-500">{getMetricDescription('reach_count')}</p>
              </div>

              {/* Outcome Count */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <span>{getMetricIcon('outcome_count')}</span>
                  <span>Measurable Outcomes</span>
                </label>
                <input
                  type="number"
                  value={metrics.outcome_count}
                  onChange={(e) => handleMetricChange('outcome_count', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Number of outcomes achieved"
                />
                <p className="text-xs text-gray-500">{getMetricDescription('outcome_count')}</p>
              </div>

              {/* Sustainability Score */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <span>{getMetricIcon('sustainability_score')}</span>
                  <span>Sustainability Score (0-100)</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={metrics.sustainability_score}
                  onChange={(e) => handleMetricChange('sustainability_score', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>{metrics.sustainability_score}</span>
                  <span>100</span>
                </div>
                <p className="text-xs text-gray-500">{getMetricDescription('sustainability_score')}</p>
              </div>

              {/* Innovation Score */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <span>{getMetricIcon('innovation_score')}</span>
                  <span>Innovation Score (0-100)</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={metrics.innovation_score}
                  onChange={(e) => handleMetricChange('innovation_score', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>{metrics.innovation_score}</span>
                  <span>100</span>
                </div>
                <p className="text-xs text-gray-500">{getMetricDescription('innovation_score')}</p>
              </div>

              {/* Evidence Quality */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <span>{getMetricIcon('evidence_quality')}</span>
                  <span>Evidence Quality (0-100)</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={metrics.evidence_quality}
                  onChange={(e) => handleMetricChange('evidence_quality', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>{metrics.evidence_quality}</span>
                  <span>100</span>
                </div>
                <p className="text-xs text-gray-500">{getMetricDescription('evidence_quality')}</p>
              </div>

              {/* Stakeholder Satisfaction */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <span>{getMetricIcon('stakeholder_satisfaction')}</span>
                  <span>Stakeholder Satisfaction (0-100)</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={metrics.stakeholder_satisfaction}
                  onChange={(e) => handleMetricChange('stakeholder_satisfaction', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>{metrics.stakeholder_satisfaction}</span>
                  <span>100</span>
                </div>
                <p className="text-xs text-gray-500">{getMetricDescription('stakeholder_satisfaction')}</p>
              </div>

              {/* Cost Effectiveness */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <span>{getMetricIcon('cost_effectiveness')}</span>
                  <span>Cost Effectiveness (0-1)</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={metrics.cost_effectiveness}
                  onChange={(e) => handleMetricChange('cost_effectiveness', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>{metrics.cost_effectiveness.toFixed(1)}</span>
                  <span>1</span>
                </div>
                <p className="text-xs text-gray-500">{getMetricDescription('cost_effectiveness')}</p>
              </div>

              {/* Scalability Potential */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <span>{getMetricIcon('scalability_potential')}</span>
                  <span>Scalability Potential (0-100)</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={metrics.scalability_potential}
                  onChange={(e) => handleMetricChange('scalability_potential', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>{metrics.scalability_potential}</span>
                  <span>100</span>
                </div>
                <p className="text-xs text-gray-500">{getMetricDescription('scalability_potential')}</p>
              </div>
            </div>
          </div>

          {/* Advanced Metrics */}
          {showAdvancedMetrics && (
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Advanced Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Social Return on Investment */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <span>{getMetricIcon('social_return_on_investment')}</span>
                    <span>Social Return on Investment</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={metrics.social_return_on_investment}
                    onChange={(e) => handleMetricChange('social_return_on_investment', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., 3.5"
                  />
                  <p className="text-xs text-gray-500">{getMetricDescription('social_return_on_investment')}</p>
                </div>

                {/* Environmental Impact */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <span>{getMetricIcon('environmental_impact')}</span>
                    <span>Environmental Impact (0-100)</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={metrics.environmental_impact}
                    onChange={(e) => handleMetricChange('environmental_impact', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>{metrics.environmental_impact}</span>
                    <span>100</span>
                  </div>
                  <p className="text-xs text-gray-500">{getMetricDescription('environmental_impact')}</p>
                </div>

                {/* Gender Equality Score */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <span>{getMetricIcon('gender_equality_score')}</span>
                    <span>Gender Equality Score (0-100)</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={metrics.gender_equality_score}
                    onChange={(e) => handleMetricChange('gender_equality_score', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>{metrics.gender_equality_score}</span>
                    <span>100</span>
                  </div>
                  <p className="text-xs text-gray-500">{getMetricDescription('gender_equality_score')}</p>
                </div>

                {/* Digital Inclusion Score */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <span>{getMetricIcon('digital_inclusion_score')}</span>
                    <span>Digital Inclusion Score (0-100)</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={metrics.digital_inclusion_score}
                    onChange={(e) => handleMetricChange('digital_inclusion_score', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>{metrics.digital_inclusion_score}</span>
                    <span>100</span>
                  </div>
                  <p className="text-xs text-gray-500">{getMetricDescription('digital_inclusion_score')}</p>
                </div>

                {/* Community Engagement Level */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <span>{getMetricIcon('community_engagement_level')}</span>
                    <span>Community Engagement Level (0-100)</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={metrics.community_engagement_level}
                    onChange={(e) => handleMetricChange('community_engagement_level', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>{metrics.community_engagement_level}</span>
                    <span>100</span>
                  </div>
                  <p className="text-xs text-gray-500">{getMetricDescription('community_engagement_level')}</p>
                </div>

                {/* Policy Influence Score */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <span>{getMetricIcon('policy_influence_score')}</span>
                    <span>Policy Influence Score (0-100)</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={metrics.policy_influence_score}
                    onChange={(e) => handleMetricChange('policy_influence_score', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>{metrics.policy_influence_score}</span>
                    <span>100</span>
                  </div>
                  <p className="text-xs text-gray-500">{getMetricDescription('policy_influence_score')}</p>
                </div>

                {/* Knowledge Transfer Score */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <span>{getMetricIcon('knowledge_transfer_score')}</span>
                    <span>Knowledge Transfer Score (0-100)</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={metrics.knowledge_transfer_score}
                    onChange={(e) => handleMetricChange('knowledge_transfer_score', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>{metrics.knowledge_transfer_score}</span>
                    <span>100</span>
                  </div>
                  <p className="text-xs text-gray-500">{getMetricDescription('knowledge_transfer_score')}</p>
                </div>

                {/* Capacity Building Score */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <span>{getMetricIcon('capacity_building_score')}</span>
                    <span>Capacity Building Score (0-100)</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={metrics.capacity_building_score}
                    onChange={(e) => handleMetricChange('capacity_building_score', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>{metrics.capacity_building_score}</span>
                    <span>100</span>
                  </div>
                  <p className="text-xs text-gray-500">{getMetricDescription('capacity_building_score')}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <Button onClick={calculateScore} className="bg-green-600 hover:bg-green-700 text-white">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Calculate Impact Score
            </Button>
            <Button onClick={resetCalculator} variant="outline" className="text-gray-600 border-gray-300">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {showResults && calculatedScore && (
        <div className="space-y-6">
          {/* Scenario Analysis */}
          {Object.keys(scenarios).length > 0 && (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Scenario Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(scenarios).map(([scenario, score]) => (
                    <div
                      key={scenario}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        activeScenario === scenario
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setActiveScenario(scenario as any)}
                    >
                      <div className="text-center">
                        <h4 className="font-medium text-gray-900 capitalize mb-2">{scenario}</h4>
                        <div className={`text-2xl font-bold ${getScoreColor(score.weighted_score)}`}>
                          {Math.round(score.weighted_score)}
                        </div>
                        <p className="text-sm text-gray-600">{getScoreLabel(score.weighted_score)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Results */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Impact Score Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(calculatedScore.weighted_score)} mb-2`}>
                  {Math.round(calculatedScore.weighted_score)}
                </div>
                <div className="text-lg text-gray-600 mb-1">
                  {getScoreLabel(calculatedScore.weighted_score)}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Weighted Impact Score (0-100)
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <Badge className={`${getScoreColor(calculatedScore.weighted_score)} bg-opacity-10`}>
                    Confidence: {calculatedScore.confidence_level}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800">
                    Trend: {calculatedScore.trend}
                  </Badge>
                </div>
              </div>

              {/* Score Breakdown */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Score Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(calculatedScore.breakdown).map(([metric, score]) => (
                    <div key={metric} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getMetricIcon(metric)}</span>
                        <span className="text-sm text-gray-700 capitalize">
                          {metric.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{Math.round(score)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weight Factors */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Weight Factors</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(calculatedScore.factors).map(([factor, weight]) => (
                    <div key={factor} className="text-center p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                      <div className="text-sm text-gray-600 capitalize">
                        {factor.replace(/_/g, ' ').replace(' weight', '')}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {(weight * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Recommendations */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Smart Recommendations</h4>
                <div className="space-y-3">
                  {calculatedScore.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div className="text-sm font-medium text-blue-800">Recommendation {index + 1}</div>
                        <div className="text-sm text-blue-700">{recommendation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              {calculatedScore.risk_factors.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Risk Factors</h4>
                  <div className="space-y-2">
                    {calculatedScore.risk_factors.map((risk, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div className="text-sm text-yellow-800">{risk}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}; 